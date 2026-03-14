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
import { SortableData } from "../types/sortable";
import { useGridSortableList } from "../hooks/useGridSortableList";

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

/**
 * A high-level component for creating sortable grids with smooth reordering animations.
 *
 * The SortableGrid component provides a complete solution for sortable grids, handling
 * all the complex state management, gesture handling, and animations internally.
 * It renders a scrollable grid where items can be dragged to reorder them with
 * smooth animations and auto-scrolling support.
 *
 * @template TData - The type of data items in the grid (must extend `{ id: string }`)
 * @param props - Configuration props for the sortable grid
 */
function SortableGridComponent<TData extends SortableData>({
  data,
  renderItem,
  dimensions,
  orientation = GridOrientation.Vertical,
  strategy = GridStrategy.Insert,
  style,
  contentContainerStyle,
  itemKeyExtractor = (item) => item.id,
  scrollEnabled = true,
}: SortableGridProps<TData>) {
  // Validate required dimensions
  if (!dimensions.itemWidth || !dimensions.itemHeight) {
    throw new Error(
      "SortableGrid requires itemWidth and itemHeight in dimensions"
    );
  }

  if (
    orientation === GridOrientation.Vertical &&
    !dimensions.columns
  ) {
    throw new Error(
      "SortableGrid requires columns in dimensions when orientation is vertical"
    );
  }

  if (
    orientation === GridOrientation.Horizontal &&
    !dimensions.rows
  ) {
    throw new Error(
      "SortableGrid requires rows in dimensions when orientation is horizontal"
    );
  }

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

  const renderGridItems = useCallback(() => {
    return data.map((item, index) => {
      const itemProps = getItemProps(item, index);
      const renderItemProps: SortableGridRenderItemProps<TData> = {
        item,
        index,
        ...itemProps,
      };
      return renderItem(renderItemProps);
    });
  }, [data, getItemProps, renderItem]);

  return (
    <GestureHandlerRootView style={styles.flex}>
      <DropProvider ref={dropProviderRef}>
        <AnimatedScrollView
          ref={scrollViewRef}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          scrollEnabled={scrollEnabled}
          style={[styles.scrollView, style]}
          contentContainerStyle={contentContainerStyle}
          onScrollEndDrag={handleScrollEnd}
          onMomentumScrollEnd={handleScrollEnd}
          simultaneousHandlers={dropProviderRef}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        >
          <View
            style={{
              width: contentWidth,
              height: contentHeight,
              position: "relative",
            }}
          >
            {renderGridItems()}
          </View>
        </AnimatedScrollView>
      </DropProvider>
    </GestureHandlerRootView>
  );
}

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
  },
});
