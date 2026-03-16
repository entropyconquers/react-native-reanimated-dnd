import { useRef, useCallback, useEffect } from "react";
import {
  scrollTo,
  useAnimatedReaction,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import {
  GridScrollDirection,
  GridOrientation,
  GridStrategy,
  UseGridSortableListOptions,
  UseGridSortableListReturn,
} from "../types/grid";
import { SortableData } from "../types/sortable";
import { DropProviderRef } from "../types/context";
import {
  listToGridObject,
  calculateGridContentDimensions,
} from "../utils/gridCalculations";

/**
 * A hook for managing sortable grids with drag-and-drop reordering capabilities.
 *
 * This hook provides the foundational state management and utilities needed to create
 * sortable grids. It handles position tracking, scroll synchronization, auto-scrolling,
 * and provides helper functions for individual sortable grid items.
 *
 * @template TData - The type of data items in the sortable grid (must extend `{ id: string }`)
 * @param options - Configuration options for the sortable grid
 * @returns Object containing shared values, refs, handlers, and utilities for the sortable grid
 */
export function useGridSortableList<TData extends SortableData>(
  options: UseGridSortableListOptions<TData>
): UseGridSortableListReturn<TData> {
  const {
    data,
    dimensions,
    orientation = GridOrientation.Vertical,
    strategy = GridStrategy.Insert,
    itemKeyExtractor = (item) => item.id,
  } = options;

  // Runtime validation in development mode
  if (__DEV__) {
    data.forEach((item, index) => {
      const id = itemKeyExtractor(item, index);
      if (typeof id !== "string" || !id) {
        console.error(
          `[react-native-reanimated-dnd] Grid item at index ${index} has invalid id: ${id}. ` +
            `Each item must have a unique string id property.`
        );
      }
    });
  }

  // Set up shared values
  const positions = useSharedValue(
    listToGridObject(data, dimensions, orientation)
  );
  const scrollY = useSharedValue(0);
  const scrollX = useSharedValue(0);
  const autoScrollDirection = useSharedValue(GridScrollDirection.None);
  const scrollViewRef = useAnimatedRef();
  const dropProviderRef = useRef<DropProviderRef>(null);

  // Update positions when data or dimensions change
  useEffect(() => {
    positions.value = listToGridObject(data, dimensions, orientation);
  }, [
    data.length,
    data.map((d) => itemKeyExtractor(d, 0)).join(","),
    dimensions.columns,
    dimensions.rows,
    dimensions.itemWidth,
    dimensions.itemHeight,
    dimensions.rowGap,
    dimensions.columnGap,
    orientation,
  ]);

  // Scrolling synchronization
  useAnimatedReaction(
    () => scrollY.value,
    (scrolling) => {
      scrollTo(scrollViewRef, scrollX.value, scrolling, false);
    }
  );

  useAnimatedReaction(
    () => scrollX.value,
    (scrolling) => {
      scrollTo(scrollViewRef, scrolling, scrollY.value, false);
    }
  );

  // Handle scroll events
  const handleScroll = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
    scrollX.value = event.contentOffset.x;
  });

  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const handleScrollEnd = useCallback(() => {
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    scrollTimeoutRef.current = setTimeout(() => {
      dropProviderRef.current?.requestPositionUpdate();
    }, 50);
  }, []);

  // Calculate content dimensions
  const { width: contentWidth, height: contentHeight } =
    calculateGridContentDimensions(data.length, dimensions, orientation);

  // Helper to get props for each grid item
  const getItemProps = useCallback(
    (item: TData, index: number) => {
      const id = itemKeyExtractor(item, index);
      return {
        id,
        positions,
        scrollY,
        scrollX,
        autoScrollDirection,
        itemsCount: data.length,
        dimensions,
        orientation,
        strategy,
      };
    },
    [
      data.length,
      dimensions,
      orientation,
      strategy,
      itemKeyExtractor,
      positions,
      scrollY,
      scrollX,
      autoScrollDirection,
    ]
  );

  return {
    positions,
    scrollY,
    scrollX,
    autoScrollDirection,
    scrollViewRef,
    dropProviderRef,
    handleScroll,
    handleScrollEnd,
    contentWidth,
    contentHeight,
    getItemProps,
  };
}
