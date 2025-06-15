import React, { createContext, useContext } from "react";
import { StyleProp, ViewStyle } from "react-native";
import Animated from "react-native-reanimated";
import { PanGestureHandler } from "react-native-gesture-handler";
import { useSortable } from "../hooks/useSortable";
import { useHorizontalSortable } from "../hooks/useHorizontalSortable";
import {
  SortableItemProps,
  SortableHandleProps,
  SortableContextValue,
  UseSortableOptions,
  UseHorizontalSortableOptions,
  SortableDirection,
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

  if (!sortableContext) {
    console.warn("SortableHandle must be used within a SortableItem component");
    return <>{children}</>;
  }

  return (
    <PanGestureHandler onGestureEvent={sortableContext.panGestureHandler}>
      <Animated.View style={style}>{children}</Animated.View>
    </PanGestureHandler>
  );
};

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
  id,
  data,
  positions,
  direction = SortableDirection.Vertical,
  lowerBound,
  leftBound,
  autoScrollDirection,
  autoScrollHorizontalDirection,
  itemsCount,
  itemHeight,
  itemWidth,
  gap = 0,
  paddingHorizontal = 0,
  containerHeight,
  containerWidth,
  children,
  style,
  animatedStyle: customAnimatedStyle,
  onMove,
  onDragStart,
  onDrop,
  onDragging,
  onDraggingHorizontal,
}: SortableItemProps<T>) {
  // Validate required props based on direction
  if (
    direction === SortableDirection.Vertical &&
    (!itemHeight || !lowerBound || !autoScrollDirection)
  ) {
    throw new Error(
      "itemHeight, lowerBound, and autoScrollDirection are required for vertical direction"
    );
  }
  if (
    direction === SortableDirection.Horizontal &&
    (!itemWidth || !leftBound || !autoScrollHorizontalDirection)
  ) {
    throw new Error(
      "itemWidth, leftBound, and autoScrollHorizontalDirection are required for horizontal direction"
    );
  }

  if (direction === SortableDirection.Horizontal) {
    // Use horizontal sortable implementation
    const horizontalOptions: UseHorizontalSortableOptions<T> = {
      id,
      positions,
      leftBound: leftBound!,
      autoScrollDirection: autoScrollHorizontalDirection!,
      itemsCount,
      itemWidth: itemWidth!,
      gap,
      paddingHorizontal,
      containerWidth,
      onMove,
      onDragStart,
      onDrop,
      onDragging: onDraggingHorizontal,
      children,
      handleComponent: SortableHandle,
    };

    const {
      animatedStyle: horizontalAnimatedStyle,
      panGestureHandler: horizontalPanGestureHandler,
      isMoving: horizontalIsMoving,
      hasHandle: horizontalHasHandle,
    } = useHorizontalSortable<T>(horizontalOptions);

    // Combine the default animated style with any custom styles
    const combinedAnimatedStyle = [
      horizontalAnimatedStyle,
      customAnimatedStyle,
    ];

    // Create the context value
    const contextValue: SortableContextValue = {
      panGestureHandler: horizontalPanGestureHandler,
    };

    // Always provide the context to avoid issues when toggling handle modes
    const content = (
      <Animated.View style={combinedAnimatedStyle}>
        <SortableContext.Provider value={contextValue}>
          <Animated.View style={style}>{children}</Animated.View>
        </SortableContext.Provider>
      </Animated.View>
    );

    // If a handle is found, let the handle control the dragging
    // Otherwise, the entire component is draggable with PanGestureHandler
    if (horizontalHasHandle) {
      return content;
    } else {
      return (
        <PanGestureHandler
          onGestureEvent={horizontalPanGestureHandler}
          activateAfterLongPress={200}
          shouldCancelWhenOutside={false}
        >
          {content}
        </PanGestureHandler>
      );
    }
  }

  // Use vertical sortable implementation (default)
  const verticalOptions: UseSortableOptions<T> = {
    id,
    positions,
    lowerBound: lowerBound!,
    autoScrollDirection: autoScrollDirection!,
    itemsCount,
    itemHeight: itemHeight!,
    containerHeight,
    onMove,
    onDragStart,
    onDrop,
    onDragging,
    children,
    handleComponent: SortableHandle,
  };

  const {
    animatedStyle: verticalAnimatedStyle,
    panGestureHandler: verticalPanGestureHandler,
    isMoving: verticalIsMoving,
    hasHandle: verticalHasHandle,
  } = useSortable<T>(verticalOptions);

  // Combine the default animated style with any custom styles
  const combinedAnimatedStyle = [verticalAnimatedStyle, customAnimatedStyle];

  // Create the context value
  const contextValue: SortableContextValue = {
    panGestureHandler: verticalPanGestureHandler,
  };

  // Always provide the context to avoid issues when toggling handle modes
  const content = (
    <Animated.View style={combinedAnimatedStyle}>
      <SortableContext.Provider value={contextValue}>
        <Animated.View style={style}>{children}</Animated.View>
      </SortableContext.Provider>
    </Animated.View>
  );

  // If a handle is found, let the handle control the dragging
  // Otherwise, the entire component is draggable with PanGestureHandler
  if (verticalHasHandle) {
    return content;
  } else {
    return (
      <PanGestureHandler
        onGestureEvent={verticalPanGestureHandler}
        activateAfterLongPress={200}
        shouldCancelWhenOutside={false}
      >
        {content}
      </PanGestureHandler>
    );
  }
}

// Attach the SortableHandle as a static property
SortableItem.Handle = SortableHandle;
