import { useRef, useCallback, useEffect } from "react";
import {
  scrollTo,
  useAnimatedReaction,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import {
  UseGridSortableListOptions,
  UseGridSortableListReturn,
  GridScrollDirection,
  GridOrientation,
  GridStrategy,
  GridPositions,
} from "../types/grid";
import { DropProviderRef } from "../types/context";
import { SortableData } from "../types/sortable";
import {
  listToGridObject,
  calculateGridContentDimensions,
} from "../lib/gridCalculations";

/**
 * Hook for managing sortable grid lists with drag-and-drop reordering
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

  // Validate data in development
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

  // Initialize shared values
  const positions = useSharedValue<GridPositions>(
    listToGridObject(data, dimensions, orientation)
  );
  const scrollY = useSharedValue(0);
  const scrollX = useSharedValue(0);
  const autoScrollDirection = useSharedValue(GridScrollDirection.None);
  const scrollViewRef = useAnimatedRef();
  const dropProviderRef = useRef<DropProviderRef>(null);

  // Update positions when data changes (e.g., item removed)
  useEffect(() => {
    positions.value = listToGridObject(data, dimensions, orientation);
  }, [data, dimensions, orientation, positions]);

  // Calculate content dimensions
  const { width: contentWidth, height: contentHeight } =
    calculateGridContentDimensions(data.length, dimensions, orientation);

  // Scroll synchronization for vertical scrolling
  useAnimatedReaction(
    () => scrollY.value,
    (scrolling) => {
      if (orientation === GridOrientation.Vertical) {
        scrollTo(scrollViewRef, 0, scrolling, false);
      }
    }
  );

  // Scroll synchronization for horizontal scrolling
  useAnimatedReaction(
    () => scrollX.value,
    (scrolling) => {
      if (orientation === GridOrientation.Horizontal) {
        scrollTo(scrollViewRef, scrolling, 0, false);
      }
    }
  );

  // Handle scroll events
  const handleScroll = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
    scrollX.value = event.contentOffset.x;
  });

  // Handle scroll end
  const handleScrollEnd = useCallback(() => {
    let localScrollTimeout: NodeJS.Timeout | null = null;
    if (localScrollTimeout) {
      clearTimeout(localScrollTimeout);
    }
    localScrollTimeout = setTimeout(() => {
      dropProviderRef.current?.requestPositionUpdate();
    }, 50);
  }, []);

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
