import { useRef, useCallback, useMemo, useState, useEffect } from "react";
import {
  scrollTo,
  useAnimatedReaction,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import {
  listToObject,
  resolveItemHeight,
} from "../components/sortableUtils";
import { ScrollDirection } from "../types/sortable";
import { DropProviderRef } from "../types/context";

export interface UseSortableListOptions<TData> {
  data: TData[];
  itemHeight?: number | number[] | ((item: TData, index: number) => number);
  enableDynamicHeights?: boolean;
  estimatedItemHeight?: number;
  onHeightsMeasured?: (heights: { [id: string]: number }) => void;
  itemKeyExtractor?: (item: TData, index: number) => string;
}

export interface UseSortableListReturn<TData> {
  positions: any;
  scrollY: any;
  autoScroll: any;
  scrollViewRef: any;
  dropProviderRef: React.RefObject<DropProviderRef | null>;
  handleScroll: any;
  handleScrollEnd: () => void;
  contentHeight: number;
  isDynamicHeight: boolean;
  itemHeights: any;
  scheduleHeightUpdate?: (id: string, height: number) => void;
  getItemProps: (
    item: TData,
    index: number
  ) => {
    id: string;
    positions: any;
    lowerBound: any;
    autoScrollDirection: any;
    itemsCount: number;
    itemHeight?: number;
    isDynamicHeight: boolean;
    estimatedItemHeight: number;
    itemHeights?: any;
    scheduleHeightUpdate?: (id: string, height: number) => void;
  };
}

/**
 * A hook for managing sortable lists with drag-and-drop reordering capabilities.
 *
 * This hook provides the foundational state management and utilities needed to create
 * sortable lists. It handles position tracking, scroll synchronization, auto-scrolling,
 * and provides helper functions for individual sortable items.
 *
 * Supports dynamic item heights via `enableDynamicHeights` or by providing an array/function
 * for `itemHeight`.
 *
 * @template TData - The type of data items in the sortable list (must extend `{ id: string }`)
 * @param options - Configuration options for the sortable list
 * @returns Object containing shared values, refs, handlers, and utilities for the sortable list
 *
 * @see {@link UseSortableListOptions} for configuration options
 * @see {@link UseSortableListReturn} for return value details
 * @see {@link useSortable} for individual item management
 */
export function useSortableList<TData extends { id: string }>(
  options: UseSortableListOptions<TData>
): UseSortableListReturn<TData> {
  const {
    data,
    itemHeight,
    enableDynamicHeights = false,
    estimatedItemHeight = 60,
    onHeightsMeasured,
    itemKeyExtractor = (item) => item.id,
  } = options;

  // Determine if we're in dynamic height mode:
  // - explicitly enabled, OR
  // - itemHeight is an array/function (non-uniform heights), OR
  // - itemHeight is undefined (needs measurement)
  const isDynamicHeight = useMemo(() => {
    if (enableDynamicHeights) return true;
    if (typeof itemHeight === "number") return false;
    if (itemHeight === undefined) return false; // No itemHeight and no dynamic = error (validated below)
    return true; // Array or function
  }, [enableDynamicHeights, itemHeight]);

  // Whether onLayout measurement is needed (vs pre-computed heights)
  const needsMeasurement = enableDynamicHeights;

  // Runtime validation in development mode
  if (__DEV__) {
    data.forEach((item, index) => {
      const id = itemKeyExtractor(item, index);
      if (typeof id !== "string" || !id) {
        console.error(
          `[react-native-reanimated-dnd] Item at index ${index} has invalid id: ${id}. ` +
            `Each item must have a unique string id property.`
        );
      }
    });

    if (!isDynamicHeight && itemHeight === undefined) {
      console.error(
        "[react-native-reanimated-dnd] itemHeight is required when not using dynamic heights. " +
          "Either provide itemHeight or set enableDynamicHeights to true."
      );
    }
  }

  // Set up shared values
  const positions = useSharedValue(listToObject(data));
  const scrollY = useSharedValue(0);
  const autoScroll = useSharedValue(ScrollDirection.None);
  const scrollViewRef = useAnimatedRef();
  const dropProviderRef = useRef<DropProviderRef | null>(null);

  // Dynamic height shared values — initialized with estimated heights
  // so items are positioned correctly from the first frame.
  const initialHeights = useMemo(() => {
    if (!isDynamicHeight) return {};
    const heights: { [id: string]: number } = {};
    data.forEach((item, index) => {
      const id = itemKeyExtractor(item, index);
      heights[id] = resolveItemHeight(itemHeight, item, index, estimatedItemHeight);
    });
    return heights;
  }, []);

  const itemHeightsSV = useSharedValue<{ [id: string]: number }>(initialHeights);

  // Content height state — updated on JS thread for use in styles
  const fixedContentHeight =
    typeof itemHeight === "number" ? data.length * itemHeight : null;
  const [dynamicContentHeight, setDynamicContentHeight] = useState(() => {
    if (!isDynamicHeight && fixedContentHeight !== null) return fixedContentHeight;
    // Estimate from data
    let total = 0;
    data.forEach((item, index) => {
      total += resolveItemHeight(itemHeight, item, index, estimatedItemHeight);
    });
    return total;
  });

  // Initialize heights when data changes (for array/function mode)
  useEffect(() => {
    if (!isDynamicHeight) return;

    const newHeights: { [id: string]: number } = {};
    data.forEach((item, index) => {
      const id = itemKeyExtractor(item, index);
      // If we have pre-computed heights (array/function), use them
      // If measurement mode, keep existing measured heights or use estimate
      if (!needsMeasurement) {
        newHeights[id] = resolveItemHeight(
          itemHeight,
          item,
          index,
          estimatedItemHeight
        );
      } else {
        // Preserve previously measured heights, use estimate for new items
        const existing = itemHeightsSV.value[id];
        newHeights[id] = existing ?? estimatedItemHeight;
      }
    });

    itemHeightsSV.value = newHeights;

    // Compute total content height
    let total = 0;
    data.forEach((item, index) => {
      const id = itemKeyExtractor(item, index);
      total += newHeights[id] ?? estimatedItemHeight;
    });
    setDynamicContentHeight(total);
  }, [data, isDynamicHeight, needsMeasurement, itemHeight, estimatedItemHeight, itemKeyExtractor]);

  // Height update function called from onLayout on JS thread
  const scheduleHeightUpdate = useCallback(
    (id: string, height: number) => {
      const rounded = Math.round(height);
      const prev = itemHeightsSV.value[id];
      if (prev !== undefined && Math.abs(prev - rounded) < 1) return;

      const newHeights = { ...itemHeightsSV.value, [id]: rounded };
      itemHeightsSV.value = newHeights;

      // Recalculate total content height on JS thread
      let total = 0;
      data.forEach((item, index) => {
        const itemId = itemKeyExtractor(item, index);
        total += newHeights[itemId] ?? estimatedItemHeight;
      });
      setDynamicContentHeight(total);

      if (onHeightsMeasured) {
        onHeightsMeasured(newHeights);
      }
    },
    [data, itemKeyExtractor, estimatedItemHeight, onHeightsMeasured]
  );

  // Mirror of the user-driven scroll position. Used to discriminate
  // user-driven scrollY updates from auto-scroll worklet updates so the
  // reaction below doesn't cancel native momentum on every scroll frame.
  const userScrollY = useSharedValue(0);

  // Scrolling synchronization. The reaction propagates auto-scroll commands
  // (drag-near-edge) to the actual scroll view via scrollTo. It must skip
  // user-driven updates: scrollTo with animated:false maps to
  // setContentOffset:animated:NO on iOS (and the equivalent on Android),
  // which cancels active deceleration. Calling it on every frame of momentum
  // scroll kills inertia and the list stops dead the moment the user lifts
  // their finger. We detect user-driven updates by checking userScrollY,
  // which handleScroll keeps in sync with the actual contentOffset.
  useAnimatedReaction(
    () => scrollY.value,
    (scrolling) => {
      if (scrolling === userScrollY.value) return;
      scrollTo(scrollViewRef, 0, scrolling, false);
    }
  );

  // Handle scroll events. userScrollY is written BEFORE scrollY so that when
  // the reaction above fires (triggered by the scrollY change), userScrollY
  // is already at the new value and the equality check short-circuits.
  const handleScroll = useAnimatedScrollHandler((event) => {
    userScrollY.value = event.contentOffset.y;
    scrollY.value = event.contentOffset.y;
  });

  const handleScrollEnd = useCallback(() => {
    let localScrollTimeout: NodeJS.Timeout | null = null;
    if (localScrollTimeout) {
      clearTimeout(localScrollTimeout);
    }
    localScrollTimeout = setTimeout(() => {
      dropProviderRef.current?.requestPositionUpdate();
    }, 50);
  }, []);

  // Calculate content height
  const contentHeight =
    !isDynamicHeight && fixedContentHeight !== null
      ? fixedContentHeight
      : dynamicContentHeight;

  // Helper to get props for each sortable item
  const getItemProps = useCallback(
    (item: TData, index: number) => {
      const id = itemKeyExtractor(item, index);
      return {
        id,
        positions,
        lowerBound: scrollY,
        autoScrollDirection: autoScroll,
        itemsCount: data.length,
        itemHeight: typeof itemHeight === "number" ? itemHeight : undefined,
        isDynamicHeight,
        estimatedItemHeight,
        itemHeights: isDynamicHeight ? itemHeightsSV : undefined,
        scheduleHeightUpdate: needsMeasurement ? scheduleHeightUpdate : undefined,
      };
    },
    [
      data.length,
      itemHeight,
      isDynamicHeight,
      estimatedItemHeight,
      needsMeasurement,
      itemKeyExtractor,
      positions,
      scrollY,
      autoScroll,
      itemHeightsSV,
      scheduleHeightUpdate,
    ]
  );

  return {
    positions,
    scrollY,
    autoScroll,
    scrollViewRef,
    dropProviderRef,
    handleScroll,
    handleScrollEnd,
    contentHeight,
    isDynamicHeight,
    itemHeights: itemHeightsSV,
    scheduleHeightUpdate: needsMeasurement ? scheduleHeightUpdate : undefined,
    getItemProps,
  };
}
