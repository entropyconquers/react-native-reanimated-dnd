import React, { createContext, useCallback, useContext, useEffect } from "react";
import { LayoutChangeEvent, StyleProp, ViewStyle } from "react-native";
import Animated from "react-native-reanimated";
import { GestureDetector } from "react-native-gesture-handler";
import { useHorizontalSortable } from "../hooks/useHorizontalSortable";
import { useSortable } from "../hooks/useSortable";
import {
  SortableDirection,
  SortableContextValue,
  SortableHandleProps,
  SortableItemProps,
  UseHorizontalSortableOptions,
  UseSortableOptions,
} from "../types/sortable";

// Create a context to share gesture between SortableItem and SortableHandle
const SortableContext = createContext<SortableContextValue | null>(null);

/**
 * A handle component that can be used within SortableItem to create a specific
 * draggable area. When a SortableHandle is present, only the handle area can
 * initiate dragging, while the rest of the item remains non-draggable.
 *
 * @param props - Props for the handle component
 */
const SortableHandle = ({ children, style }: SortableHandleProps) => {
  const sortableContext = useContext(SortableContext);

  useEffect(() => {
    sortableContext?.registerHandle(true);
    return () => {
      sortableContext?.registerHandle(false);
    };
  }, [sortableContext]);

  if (!sortableContext) {
    console.warn("SortableHandle must be used within a SortableItem component");
    return <>{children}</>;
  }

  return (
    <GestureDetector gesture={sortableContext.panGestureHandler}>
      <Animated.View style={style}>{children}</Animated.View>
    </GestureDetector>
  );
};

function renderSortableContent(
  animatedStyle: StyleProp<ViewStyle>,
  customAnimatedStyle: SortableItemProps<unknown>["animatedStyle"],
  style: StyleProp<ViewStyle> | undefined,
  children: React.ReactNode,
  panGestureHandler: SortableContextValue["panGestureHandler"],
  handlePanGestureHandler: SortableContextValue["panGestureHandler"],
  registerHandle: SortableContextValue["registerHandle"],
  onLayout?: (event: LayoutChangeEvent) => void,
) {
  const content = (
    <Animated.View style={[animatedStyle, customAnimatedStyle]} onLayout={onLayout}>
      <SortableContext.Provider value={{ panGestureHandler: handlePanGestureHandler, registerHandle }}>
        <Animated.View style={style}>{children}</Animated.View>
      </SortableContext.Provider>
    </Animated.View>
  );

  // Always render the outer GestureDetector to avoid mount/unmount cycles
  // that trigger Reanimated 4's "Tried to modify key handlerTag" warning.
  // The panGestureHandler is automatically disabled when a handle is registered.
  return (
    <GestureDetector gesture={panGestureHandler}>{content}</GestureDetector>
  );
}

interface VerticalSortableItemInnerProps<T> extends SortableItemProps<T> {
  autoScrollDirection: NonNullable<SortableItemProps<T>["autoScrollDirection"]>;
  lowerBound: NonNullable<SortableItemProps<T>["lowerBound"]>;
}

function VerticalSortableItemInner<T>({
  id,
  positions,
  lowerBound,
  autoScrollDirection,
  itemsCount,
  itemHeight,
  containerHeight,
  isDynamicHeight = false,
  estimatedItemHeight,
  itemHeights,
  scheduleHeightUpdate,
  children,
  style,
  animatedStyle: customAnimatedStyle,
  onMove,
  onDragStart,
  onDrop,
  onDragging,
}: VerticalSortableItemInnerProps<T>) {
  const { animatedStyle, panGestureHandler, handlePanGestureHandler, registerHandle } = useSortable<T>({
    id,
    positions,
    lowerBound,
    autoScrollDirection,
    itemsCount,
    itemHeight,
    containerHeight,
    estimatedItemHeight,
    isDynamicHeight,
    itemHeights,
    onMove,
    onDragStart,
    onDrop,
    onDragging,
  });

  // Handle layout measurement for dynamic heights
  const handleLayout = useCallback(
    (event: LayoutChangeEvent) => {
      if (!isDynamicHeight || !scheduleHeightUpdate) return;
      const { height } = event.nativeEvent.layout;
      scheduleHeightUpdate(id, height);
    },
    [id, isDynamicHeight, scheduleHeightUpdate]
  );

  return renderSortableContent(
    animatedStyle,
    customAnimatedStyle,
    style,
    children,
    panGestureHandler,
    handlePanGestureHandler,
    registerHandle,
    isDynamicHeight && scheduleHeightUpdate ? handleLayout : undefined,
  );
}

interface HorizontalSortableItemInnerProps<T> extends SortableItemProps<T> {
  autoScrollHorizontalDirection: NonNullable<
    SortableItemProps<T>["autoScrollHorizontalDirection"]
  >;
  itemWidth: number;
  leftBound: NonNullable<SortableItemProps<T>["leftBound"]>;
}

function HorizontalSortableItemInner<T>({
  id,
  positions,
  leftBound,
  autoScrollHorizontalDirection,
  itemsCount,
  itemWidth,
  gap = 0,
  paddingHorizontal = 0,
  containerWidth,
  children,
  style,
  animatedStyle: customAnimatedStyle,
  onMove,
  onDragStart,
  onDrop,
  onDraggingHorizontal,
}: HorizontalSortableItemInnerProps<T>) {
  const { animatedStyle, panGestureHandler, handlePanGestureHandler, registerHandle } =
    useHorizontalSortable<T>({
      id,
      positions,
      leftBound,
      autoScrollDirection: autoScrollHorizontalDirection,
      itemsCount,
      itemWidth,
      gap,
      paddingHorizontal,
      containerWidth,
      onMove,
      onDragStart,
      onDrop,
      onDragging: onDraggingHorizontal,
    });

  return renderSortableContent(
    animatedStyle,
    customAnimatedStyle,
    style,
    children,
    panGestureHandler,
    handlePanGestureHandler,
    registerHandle,
  );
}

/**
 * A component for individual items within a sortable list.
 *
 * SortableItem provides the drag-and-drop functionality for individual list items,
 * handling gesture recognition, position animations, and reordering logic.
 * It can be used with or without drag handles for different interaction patterns.
 *
 * Supports both vertical (default) and horizontal directions automatically based
 * on the direction prop passed from the parent Sortable component.
 *
 * @template T - The type of data associated with this sortable item
 * @param props - Configuration props for the sortable item
 */
export function SortableItem<T>({
  direction = SortableDirection.Vertical,
  ...props
}: SortableItemProps<T>) {
  // Validate required props based on direction
  if (
    direction === SortableDirection.Vertical &&
    !props.isDynamicHeight &&
    !props.itemHeight &&
    (!props.lowerBound || !props.autoScrollDirection)
  ) {
    throw new Error(
      "itemHeight (or isDynamicHeight), lowerBound, and autoScrollDirection are required for vertical direction"
    );
  }
  if (
    direction === SortableDirection.Horizontal &&
    (!props.itemWidth ||
      !props.leftBound ||
      !props.autoScrollHorizontalDirection)
  ) {
    throw new Error(
      "itemWidth, leftBound, and autoScrollHorizontalDirection are required for horizontal direction"
    );
  }

  if (direction === SortableDirection.Horizontal) {
    return (
      <HorizontalSortableItemInner
        {...props}
        direction={direction}
        itemWidth={props.itemWidth!}
        leftBound={props.leftBound!}
        autoScrollHorizontalDirection={props.autoScrollHorizontalDirection!}
      />
    );
  }

  return (
    <VerticalSortableItemInner
      {...props}
      direction={direction}
      lowerBound={props.lowerBound!}
      autoScrollDirection={props.autoScrollDirection!}
    />
  );
}

// Attach the SortableHandle as a static property
SortableItem.Handle = SortableHandle;
