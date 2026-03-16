import React, { memo, useCallback, useMemo } from "react";
import { StyleSheet } from "react-native";
import Animated from "react-native-reanimated";
import {
  GestureHandlerRootView,
  FlatList,
  ScrollView,
} from "react-native-gesture-handler";
import { DropProvider } from "../context/DropContext";
import {
  SortableProps,
  SortableRenderItemProps,
  SortableDirection,
} from "../types/sortable";
import {
  useSortableList,
  UseSortableListOptions,
} from "../hooks/useSortableList";
import { useHorizontalSortableList } from "../hooks/useHorizontalSortableList";
import { UseHorizontalSortableListOptions } from "../types/sortable";
import { dataHash } from "./sortableUtils";

// Create animated versions of both components
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);
const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

/**
 * A high-level component for creating sortable lists with smooth reordering animations.
 *
 * Supports both fixed and dynamic item heights. For dynamic heights, use
 * `enableDynamicHeights` or provide an array/function for `itemHeight`.
 *
 * @template TData - The type of data items in the list (must extend `{ id: string }`)
 * @param props - Configuration props for the sortable list
 *
 * @see {@link SortableItem} for individual item component
 * @see {@link useSortableList} for the underlying vertical hook
 * @see {@link useHorizontalSortableList} for the underlying horizontal hook
 */
function SortableComponent<TData extends { id: string }>({
  data,
  renderItem,
  direction = SortableDirection.Vertical,
  itemHeight,
  itemWidth,
  gap = 0,
  paddingHorizontal = 0,
  enableDynamicHeights = false,
  estimatedItemHeight = 60,
  onHeightsMeasured,
  style,
  contentContainerStyle,
  itemKeyExtractor = (item) => item.id,
  useFlatList = true,
}: SortableProps<TData>) {
  // Determine if dynamic height mode applies
  const isDynamicHeightMode = useMemo(() => {
    if (direction === SortableDirection.Horizontal) return false;
    if (enableDynamicHeights) return true;
    if (typeof itemHeight === "number") return false;
    if (itemHeight === undefined) return false;
    return true; // Array or function
  }, [enableDynamicHeights, itemHeight, direction]);

  // Validate required props based on direction
  if (
    direction === SortableDirection.Vertical &&
    !isDynamicHeightMode &&
    !itemHeight
  ) {
    throw new Error(
      "itemHeight is required when direction is vertical and not using dynamic heights"
    );
  }
  if (direction === SortableDirection.Horizontal && !itemWidth) {
    throw new Error("itemWidth is required when direction is horizontal");
  }

  if (direction === SortableDirection.Horizontal) {
    return (
      <HorizontalSortableContent
        data={data}
        renderItem={renderItem}
        direction={direction}
        itemWidth={itemWidth}
        gap={gap}
        paddingHorizontal={paddingHorizontal}
        style={style}
        contentContainerStyle={contentContainerStyle}
        itemKeyExtractor={itemKeyExtractor}
        useFlatList={useFlatList}
      />
    );
  }

  return (
    <VerticalSortableContent
      data={data}
      renderItem={renderItem}
      direction={direction}
      itemHeight={itemHeight}
      enableDynamicHeights={enableDynamicHeights}
      estimatedItemHeight={estimatedItemHeight}
      onHeightsMeasured={onHeightsMeasured}
      style={style}
      contentContainerStyle={contentContainerStyle}
      itemKeyExtractor={itemKeyExtractor}
      useFlatList={useFlatList}
    />
  );
}

function VerticalSortableContent<TData extends { id: string }>({
  data,
  renderItem,
  direction,
  itemHeight,
  enableDynamicHeights,
  estimatedItemHeight,
  onHeightsMeasured,
  style,
  contentContainerStyle,
  itemKeyExtractor,
  useFlatList,
}: SortableProps<TData>) {
  const {
    scrollViewRef,
    dropProviderRef,
    handleScroll,
    handleScrollEnd,
    contentHeight,
    getItemProps,
  } = useSortableList<TData>({
    data,
    itemHeight,
    enableDynamicHeights,
    estimatedItemHeight,
    onHeightsMeasured,
    itemKeyExtractor,
  });

  const memoizedVerticalRenderItem = useCallback(
    ({ item, index }: { item: unknown; index: number }) => {
      const itemProps = getItemProps(item as unknown as TData, index);
      const sortableItemProps: SortableRenderItemProps<TData> = {
        item: item as TData,
        index,
        direction: SortableDirection.Vertical,
        ...itemProps,
      };
      return renderItem(sortableItemProps) as React.ReactElement;
    },
    [getItemProps, renderItem]
  );

  return (
    <GestureHandlerRootView style={styles.flex}>
      <DropProvider ref={dropProviderRef}>
        {useFlatList ? (
          <AnimatedFlatList
            ref={scrollViewRef}
            data={data}
            keyExtractor={itemKeyExtractor as any}
            renderItem={memoizedVerticalRenderItem}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            style={[styles.scrollView, style]}
            contentContainerStyle={[
              { height: contentHeight },
              contentContainerStyle,
            ]}
            onScrollEndDrag={handleScrollEnd}
            onMomentumScrollEnd={handleScrollEnd}
            simultaneousHandlers={dropProviderRef}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <AnimatedScrollView
            ref={scrollViewRef}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            style={[styles.scrollView, style]}
            contentContainerStyle={[
              { height: contentHeight },
              contentContainerStyle,
            ]}
            onScrollEndDrag={handleScrollEnd}
            onMomentumScrollEnd={handleScrollEnd}
            simultaneousHandlers={dropProviderRef}
          >
            {data.map((item, index) => {
              const itemProps = getItemProps(item, index);
              const sortableItemProps: SortableRenderItemProps<TData> = {
                item,
                index,
                direction: SortableDirection.Vertical,
                ...itemProps,
              };
              return renderItem(sortableItemProps);
            })}
          </AnimatedScrollView>
        )}
      </DropProvider>
    </GestureHandlerRootView>
  );
}

function HorizontalSortableContent<TData extends { id: string }>({
  data,
  renderItem,
  direction,
  itemWidth,
  gap = 0,
  paddingHorizontal = 0,
  style,
  contentContainerStyle,
  itemKeyExtractor,
  useFlatList,
}: SortableProps<TData>) {
  const {
    scrollViewRef,
    dropProviderRef,
    handleScroll,
    handleScrollEnd,
    contentWidth,
    getItemProps,
  } = useHorizontalSortableList<TData>({
    data,
    itemWidth: itemWidth!,
    gap,
    paddingHorizontal,
    itemKeyExtractor,
  });

  const memoizedHorizontalRenderItem = useCallback(
    ({ item, index }: { item: unknown; index: number }) => {
      const itemProps = getItemProps(item as TData, index);
      const sortableItemProps: SortableRenderItemProps<TData> = {
        item: item as TData,
        index,
        direction: SortableDirection.Horizontal,
        autoScrollHorizontalDirection: itemProps.autoScrollDirection,
        ...itemProps,
      };
      return renderItem(sortableItemProps) as React.ReactElement;
    },
    [getItemProps, renderItem]
  );

  return (
    <GestureHandlerRootView style={styles.flex}>
      <DropProvider ref={dropProviderRef}>
        {useFlatList ? (
          <AnimatedFlatList
            ref={scrollViewRef}
            data={data}
            keyExtractor={itemKeyExtractor as any}
            horizontal
            renderItem={memoizedHorizontalRenderItem}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            style={[styles.scrollView, style]}
            contentContainerStyle={[
              { width: contentWidth },
              contentContainerStyle,
            ]}
            onScrollEndDrag={handleScrollEnd}
            onMomentumScrollEnd={handleScrollEnd}
            simultaneousHandlers={dropProviderRef}
            showsHorizontalScrollIndicator={false}
          />
        ) : (
          <AnimatedScrollView
            ref={scrollViewRef}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            horizontal={true}
            style={[styles.scrollView, style]}
            contentContainerStyle={[
              { width: contentWidth },
              contentContainerStyle,
            ]}
            onScrollEndDrag={handleScrollEnd}
            onMomentumScrollEnd={handleScrollEnd}
            simultaneousHandlers={dropProviderRef}
            showsHorizontalScrollIndicator={false}
          >
            {data.map((item, index) => {
              const itemProps = getItemProps(item, index);
              const sortableItemProps: SortableRenderItemProps<TData> = {
                item,
                index,
                direction: SortableDirection.Horizontal,
                autoScrollHorizontalDirection: itemProps.autoScrollDirection,
                ...itemProps,
              };
              return renderItem(sortableItemProps);
            })}
          </AnimatedScrollView>
        )}
      </DropProvider>
    </GestureHandlerRootView>
  );
}

export const Sortable = memo(
  ({ data, renderItem, ...props }: SortableProps<any>) => {
    const dataHashKey = dataHash(data);
    return (
      <SortableComponent
        data={data}
        renderItem={renderItem}
        {...props}
        key={dataHashKey}
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
