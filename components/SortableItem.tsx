import React, { createContext, useContext } from "react";
import { StyleProp, ViewStyle } from "react-native";
import Animated from "react-native-reanimated";
import { PanGestureHandler } from "react-native-gesture-handler";
import { SortableItemProps } from "./sortableTypes";
import { useSortable } from "../hooks/useSortable";
import { UseSortableOptions } from "../types/sortable";

// Create a context to share gesture between SortableItem and SortableHandle
interface SortableContextValue {
  panGestureHandler: any;
}

const SortableContext = createContext<SortableContextValue | null>(null);

/**
 * Props for the SortableHandle component.
 */
interface SortableHandleProps {
  /** The content to render inside the handle */
  children: React.ReactNode;
  /** Optional style to apply to the handle */
  style?: StyleProp<ViewStyle>;
}

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
 * @template T - The type of data associated with this sortable item
 * @param props - Configuration props for the sortable item
 *
 * @example
 * Basic sortable item (entire item is draggable):
 * ```typescript
 * import { SortableItem } from './components/SortableItem';
 *
 * function TaskItem({ task, positions, ...sortableProps }) {
 *   return (
 *     <SortableItem
 *       id={task.id}
 *       data={task}
 *       positions={positions}
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
 * Sortable item with drag handle:
 * ```typescript
 * function TaskItemWithHandle({ task, positions, ...sortableProps }) {
 *   return (
 *     <SortableItem
 *       id={task.id}
 *       data={task}
 *       positions={positions}
 *       {...sortableProps}
 *     >
 *       <View style={styles.taskContainer}>
 *         <View style={styles.taskContent}>
 *           <Text style={styles.taskTitle}>{task.title}</Text>
 *           <Text style={styles.taskDescription}>{task.description}</Text>
 *         </View>
 *
 *         {/* Only this handle can initiate dragging *\/}
 *         <SortableItem.Handle style={styles.dragHandle}>
 *           <View style={styles.handleIcon}>
 *             <View style={styles.handleLine} />
 *             <View style={styles.handleLine} />
 *             <View style={styles.handleLine} />
 *           </View>
 *         </SortableItem.Handle>
 *       </View>
 *     </SortableItem>
 *   );
 * }
 * ```
 *
 * @example
 * Sortable item with callbacks and state tracking:
 * ```typescript
 * function AdvancedTaskItem({ task, positions, ...sortableProps }) {
 *   const [isDragging, setIsDragging] = useState(false);
 *
 *   return (
 *     <SortableItem
 *       id={task.id}
 *       data={task}
 *       positions={positions}
 *       {...sortableProps}
 *       onDragStart={(id, position) => {
 *         setIsDragging(true);
 *         hapticFeedback();
 *         analytics.track('drag_start', { taskId: id, position });
 *       }}
 *       onDrop={(id, position) => {
 *         setIsDragging(false);
 *         analytics.track('drag_end', { taskId: id, position });
 *       }}
 *       onDragging={(id, overItemId, yPosition) => {
 *         if (overItemId) {
 *           // Show visual feedback for item being hovered over
 *           highlightItem(overItemId);
 *         }
 *       }}
 *       style={[
 *         styles.taskItem,
 *         isDragging && styles.draggingItem
 *       ]}
 *     >
 *       <View style={styles.taskContent}>
 *         <Text style={styles.taskTitle}>{task.title}</Text>
 *         <Text style={styles.taskPriority}>Priority: {task.priority}</Text>
 *         {isDragging && (
 *           <Text style={styles.dragIndicator}>Dragging...</Text>
 *         )}
 *       </View>
 *     </SortableItem>
 *   );
 * }
 * ```
 *
 * @example
 * Sortable item with custom animations:
 * ```typescript
 * function AnimatedTaskItem({ task, positions, ...sortableProps }) {
 *   return (
 *     <SortableItem
 *       id={task.id}
 *       data={task}
 *       positions={positions}
 *       {...sortableProps}
 *       animatedStyle={{
 *         // Custom animated styles can be applied here
 *         shadowOpacity: 0.3,
 *         shadowRadius: 10,
 *         shadowColor: '#000',
 *         shadowOffset: { width: 0, height: 5 }
 *       }}
 *     >
 *       <Animated.View style={[
 *         styles.taskContainer,
 *         {
 *           backgroundColor: task.priority === 'high' ? '#ffebee' : '#f5f5f5'
 *         }
 *       ]}>
 *         <Text style={styles.taskTitle}>{task.title}</Text>
 *         <View style={styles.taskMeta}>
 *           <Text style={styles.taskDue}>{task.dueDate}</Text>
 *           <Text style={styles.taskAssignee}>{task.assignee}</Text>
 *         </View>
 *       </Animated.View>
 *     </SortableItem>
 *   );
 * }
 * ```
 *
 * @see {@link SortableItem.Handle} for creating drag handles
 * @see {@link useSortable} for the underlying hook
 * @see {@link Sortable} for the parent sortable list component
 * @see {@link UseSortableOptions} for configuration options
 * @see {@link UseSortableReturn} for hook return details
 */
export function SortableItem<T>({
  id,
  data,
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
}: SortableItemProps<T>) {
  // Use our custom hook for all the sortable logic
  const sortableOptions: UseSortableOptions<T> = {
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
    children,
    handleComponent: SortableHandle,
  };

  const { animatedStyle, panGestureHandler, isMoving, hasHandle } =
    useSortable<T>(sortableOptions);

  // Combine the default animated style with any custom styles
  const combinedAnimatedStyle = [animatedStyle, customAnimatedStyle];

  // Create the context value
  const contextValue: SortableContextValue = {
    panGestureHandler,
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
  if (hasHandle) {
    return content;
  } else {
    return (
      <PanGestureHandler
        onGestureEvent={panGestureHandler}
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
