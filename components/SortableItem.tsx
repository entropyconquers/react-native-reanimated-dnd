import React, { createContext, useContext, useEffect } from "react";
import { StyleProp, ViewStyle } from "react-native";
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
 *
 * @example
 * Basic drag handle:
 * ```typescript
 * <SortableItem id="item-1" {...sortableProps}>
 *   <View style={styles.itemContent}>
 *     <Text>Item content (not draggable)</Text>
 *
 *     <SortableItem.Handle style={styles.dragHandle}>
 *       <Icon name="drag-handle" size={20} />
 *     </SortableItem.Handle>
 *   </View>
 * </SortableItem>
 * ```
 *
 * @example
 * Custom styled handle:
 * ```typescript
 * <SortableItem id="item-2" {...sortableProps}>
 *   <View style={styles.card}>
 *     <Text style={styles.title}>Card Title</Text>
 *     <Text style={styles.content}>Card content...</Text>
 *
 *     <SortableItem.Handle style={styles.customHandle}>
 *       <View style={styles.handleDots}>
 *         <View style={styles.dot} />
 *         <View style={styles.dot} />
 *         <View style={styles.dot} />
 *       </View>
 *     </SortableItem.Handle>
 *   </View>
 * </SortableItem>
 * ```
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
  registerHandle: SortableContextValue["registerHandle"],
  hasHandle: boolean
) {
  const content = (
    <Animated.View style={[animatedStyle, customAnimatedStyle]}>
      <SortableContext.Provider value={{ panGestureHandler, registerHandle }}>
        <Animated.View style={style}>{children}</Animated.View>
      </SortableContext.Provider>
    </Animated.View>
  );

  if (hasHandle) {
    return content;
  }

  return (
    <GestureDetector gesture={panGestureHandler}>{content}</GestureDetector>
  );
}

interface VerticalSortableItemInnerProps<T> extends SortableItemProps<T> {
  autoScrollDirection: NonNullable<SortableItemProps<T>["autoScrollDirection"]>;
  itemHeight: number;
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
  children,
  style,
  animatedStyle: customAnimatedStyle,
  onMove,
  onDragStart,
  onDrop,
  onDragging,
}: VerticalSortableItemInnerProps<T>) {
  const { animatedStyle, panGestureHandler, hasHandle, registerHandle } = useSortable<T>({
    id,
    positions,
    lowerBound,
    autoScrollDirection,
    itemsCount,
    itemHeight,
    containerHeight,
    onMove,
    onDragStart,
    onDrop,
    onDragging,
  });

  return renderSortableContent(
    animatedStyle,
    customAnimatedStyle,
    style,
    children,
    panGestureHandler,
    registerHandle,
    hasHandle
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
  const { animatedStyle, panGestureHandler, hasHandle, registerHandle } =
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
    registerHandle,
    hasHandle
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
 *
 * @example
 * Basic vertical sortable item (entire item is draggable):
 * ```typescript
 * import { SortableItem } from './components/SortableItem';
 *
 * function TaskItem({ task, positions, ...sortableProps }) {
 *   return (
 *     <SortableItem
 *       id={task.id}
 *       data={task}
 *       positions={positions}
 *       direction="vertical"
 *       itemHeight={60}
 *       {...sortableProps}
 *       onMove={(id, from, to) => {
 *         console.log(`Task ${id} moved from ${from} to ${to}`);
 *         reorderTasks(id, from, to);
 *       }}
 *     >
 *       <View style={styles.taskContainer}>
 *         <Text style={styles.taskTitle}>{task.title}</Text>
 *         <Text style={styles.taskStatus}>{task.completed ? 'Done' : 'Pending'}</Text>
 *       </View>
 *     </SortableItem>
 *   );
 * }
 * ```
 *
 * @example
 * Horizontal sortable item:
 * ```typescript
 * function TagItem({ tag, positions, ...sortableProps }) {
 *   return (
 *     <SortableItem
 *       id={tag.id}
 *       data={tag}
 *       positions={positions}
 *       direction="horizontal"
 *       itemWidth={120}
 *       gap={12}
 *       paddingHorizontal={16}
 *       {...sortableProps}
 *     >
 *       <View style={[styles.tagContainer, { backgroundColor: tag.color }]}>
 *         <Text style={styles.tagText}>{tag.label}</Text>
 *       </View>
 *     </SortableItem>
 *   );
 * }
 * ```
 */
export function SortableItem<T>({
  direction = SortableDirection.Vertical,
  ...props
}: SortableItemProps<T>) {
  // Validate required props based on direction
  if (
    direction === SortableDirection.Vertical &&
    (!props.itemHeight || !props.lowerBound || !props.autoScrollDirection)
  ) {
    throw new Error(
      "itemHeight, lowerBound, and autoScrollDirection are required for vertical direction"
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
      itemHeight={props.itemHeight!}
      lowerBound={props.lowerBound!}
      autoScrollDirection={props.autoScrollDirection!}
    />
  );
}

// Attach the SortableHandle as a static property
SortableItem.Handle = SortableHandle;
