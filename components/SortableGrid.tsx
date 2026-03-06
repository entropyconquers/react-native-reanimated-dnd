import React, { memo, useCallback } from "react";
import { StyleSheet, View } from "react-native";
import Animated from "react-native-reanimated";
import {
  GestureHandlerRootView,
  ScrollView,
} from "react-native-gesture-handler";
import { DropProvider } from "../context/DropContext";
import {
  SortableGridProps,
  SortableGridRenderItemProps,
  GridOrientation,
  GridStrategy,
} from "../types/grid";
import { useGridSortableList } from "../hooks/useGridSortableList";

// Create animated version of ScrollView
const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

/**
 * A high-level component for creating sortable grids with smooth reordering animations.
 *
 * The SortableGrid component provides a complete solution for 2D sortable grids,
 * handling all the complex state management, gesture handling, and grid-aware animations.
 *
 * @template TData - The type of data items in the grid (must extend `{ id: string }`)
 * @param props - Configuration props for the sortable grid
 */
function SortableGridComponent<TData extends { id: string }>({
  data,
  renderItem,
  dimensions,
  orientation = GridOrientation.Vertical,
  strategy = GridStrategy.Insert,
  style,
  contentContainerStyle,
  itemContainerStyle,
  itemKeyExtractor = (item) => item.id,
  virtualized = false,
}: SortableGridProps<TData>) {
  // Validate dimensions
  if (!dimensions.itemWidth || !dimensions.itemHeight) {
    throw new Error(
      "SortableGrid requires both itemWidth and itemHeight in dimensions"
    );
  }

  if (orientation === GridOrientation.Vertical && !dimensions.columns) {
    throw new Error(
      "SortableGrid with vertical orientation requires columns in dimensions"
    );
  }

  if (orientation === GridOrientation.Horizontal && !dimensions.rows) {
    throw new Error(
      "SortableGrid with horizontal orientation requires rows in dimensions"
    );
  }

  // Use grid sortable list hook
  const {
    scrollViewRef,
    dropProviderRef,
    handleScroll,
    handleScrollEnd,
    contentWidth,
    contentHeight,
    getItemProps,
  } = useGridSortableList<TData>({
    data,
    dimensions,
    orientation,
    strategy,
    itemKeyExtractor,
  });

  // Render all grid items
  const renderGridItems = useCallback(() => {
    return data.map((item, index) => {
      const itemProps = getItemProps(item, index);
      const gridRenderItemProps: SortableGridRenderItemProps<TData> = {
        item,
        index,
        ...itemProps,
      };
      return (
        <View key={itemProps.id} style={itemContainerStyle}>
          {renderItem(gridRenderItemProps)}
        </View>
      );
    });
  }, [data, getItemProps, renderItem, itemContainerStyle]);

  return (
    <GestureHandlerRootView style={styles.flex}>
      <DropProvider ref={dropProviderRef}>
        <AnimatedScrollView
          ref={scrollViewRef}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          horizontal={orientation === GridOrientation.Horizontal}
          style={[styles.scrollView, style]}
          contentContainerStyle={[
            {
              width: contentWidth,
              height: contentHeight,
              position: "relative",
            },
            contentContainerStyle,
          ]}
          onScrollEndDrag={handleScrollEnd}
          onMomentumScrollEnd={handleScrollEnd}
          simultaneousHandlers={dropProviderRef}
          showsVerticalScrollIndicator={
            orientation === GridOrientation.Vertical
          }
          showsHorizontalScrollIndicator={
            orientation === GridOrientation.Horizontal
          }
        >
          {renderGridItems()}
        </AnimatedScrollView>
      </DropProvider>
    </GestureHandlerRootView>
  );
}

/**
 * Memoized SortableGrid component
 */
export const SortableGrid = memo(
  ({ data, renderItem, ...props }: SortableGridProps<any>) => {
    return (
      <SortableGridComponent
        data={data}
        renderItem={renderItem}
        {...props}
      />
    );
  }
);

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    position: "relative",
    backgroundColor: "white",
  },
});
