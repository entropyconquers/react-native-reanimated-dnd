import React from "react";
import { StyleSheet, StyleProp, ViewStyle } from "react-native";
import Animated, {
  useAnimatedProps,
  useAnimatedStyle,
} from "react-native-reanimated";
import {
  GestureHandlerRootView,
  ScrollView,
} from "react-native-gesture-handler";
import { SortableItem } from "./SortableItem";
import { DropProvider } from "../context/DropContext";
import { useSortableList } from "../hooks/useSortableList";
import {
  SortableProps,
  SortableRenderItemProps,
  UseSortableListOptions,
  UseSortableListReturn,
} from "../types/sortable";

// Create an animated version of the ScrollView
const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

/**
 * A high-level component for creating sortable lists with smooth reordering animations.
 *
 * The Sortable component provides a complete solution for sortable lists, handling
 * all the complex state management, gesture handling, and animations internally.
 * It renders a scrollable list where items can be dragged to reorder them with
 * smooth animations and auto-scrolling support.
 *
 * @template TData - The type of data items in the list (must extend `{ id: string }`)
 * @param props - Configuration props for the sortable list
 *
 * @example
 * Basic sortable list:
 * ```typescript
 * import { Sortable } from './components/Sortable';
 *
 * interface Task {
 *   id: string;
 *   title: string;
 *   completed: boolean;
 * }
 *
 * function TaskList() {
 *   const [tasks, setTasks] = useState<Task[]>([
 *     { id: '1', title: 'Learn React Native', completed: false },
 *     { id: '2', title: 'Build an app', completed: false },
 *     { id: '3', title: 'Deploy to store', completed: false }
 *   ]);
 *
 *   const renderTask = ({ item, id, positions, ...props }) => (
 *     <SortableItem key={id} id={id} positions={positions} {...props}>
 *       <View style={styles.taskItem}>
 *         <Text>{item.title}</Text>
 *         <Text>{item.completed ? '✓' : '○'}</Text>
 *       </View>
 *     </SortableItem>
 *   );
 *
 *   return (
 *     <Sortable
 *       data={tasks}
 *       renderItem={renderTask}
 *       itemHeight={60}
 *       style={styles.list}
 *     />
 *   );
 * }
 * ```
 *
 * @example
 * Sortable list with custom styling and callbacks:
 * ```typescript
 * function AdvancedTaskList() {
 *   const [tasks, setTasks] = useState(initialTasks);
 *
 *   const renderTask = ({ item, id, positions, ...props }) => (
 *     <SortableItem
 *       key={id}
 *       id={id}
 *       positions={positions}
 *       {...props}
 *       onMove={(itemId, from, to) => {
 *         // Update data when items are reordered
 *         const newTasks = [...tasks];
 *         const [movedTask] = newTasks.splice(from, 1);
 *         newTasks.splice(to, 0, movedTask);
 *         setTasks(newTasks);
 *
 *         // Analytics
 *         analytics.track('task_reordered', { taskId: itemId, from, to });
 *       }}
 *       onDragStart={(itemId) => {
 *         hapticFeedback();
 *         setDraggingTask(itemId);
 *       }}
 *       onDrop={(itemId) => {
 *         setDraggingTask(null);
 *       }}
 *     >
 *       <Animated.View style={[styles.taskItem, item.priority === 'high' && styles.highPriority]}>
 *         <Text style={styles.taskTitle}>{item.title}</Text>
 *         <Text style={styles.taskDue}>{item.dueDate}</Text>
 *         <View style={styles.dragHandle}>
 *           <Icon name="drag-handle" size={20} color="#666" />
 *         </View>
 *       </Animated.View>
 *     </SortableItem>
 *   );
 *
 *   return (
 *     <View style={styles.container}>
 *       <Text style={styles.header}>My Tasks ({tasks.length})</Text>
 *       <Sortable
 *         data={tasks}
 *         renderItem={renderTask}
 *         itemHeight={80}
 *         style={styles.sortableList}
 *         contentContainerStyle={styles.listContent}
 *       />
 *     </View>
 *   );
 * }
 * ```
 *
 * @example
 * Sortable list with drag handles:
 * ```typescript
 * function SortableWithHandles() {
 *   const [items, setItems] = useState(data);
 *
 *   const renderItem = ({ item, id, positions, ...props }) => (
 *     <SortableItem key={id} id={id} positions={positions} {...props}>
 *       <View style={styles.itemContainer}>
 *         <View style={styles.itemContent}>
 *           <Text style={styles.itemTitle}>{item.title}</Text>
 *           <Text style={styles.itemSubtitle}>{item.subtitle}</Text>
 *         </View>
 *
 *         {/* Only this handle area can initiate dragging *\/}
 *         <SortableItem.Handle style={styles.dragHandle}>
 *           <View style={styles.handleIcon}>
 *             <View style={styles.handleDot} />
 *             <View style={styles.handleDot} />
 *             <View style={styles.handleDot} />
 *           </View>
 *         </SortableItem.Handle>
 *       </View>
 *     </SortableItem>
 *   );
 *
 *   return (
 *     <Sortable
 *       data={items}
 *       renderItem={renderItem}
 *       itemHeight={70}
 *     />
 *   );
 * }
 * ```
 *
 * @example
 * Sortable list with custom key extractor:
 * ```typescript
 * interface CustomItem {
 *   uuid: string;
 *   name: string;
 *   order: number;
 * }
 *
 * function CustomSortableList() {
 *   const [items, setItems] = useState<CustomItem[]>(data);
 *
 *   const renderItem = ({ item, id, positions, ...props }) => (
 *     <SortableItem key={id} id={id} positions={positions} {...props}>
 *       <View style={styles.customItem}>
 *         <Text>{item.name}</Text>
 *         <Text>Order: {item.order}</Text>
 *       </View>
 *     </SortableItem>
 *   );
 *
 *   return (
 *     <Sortable
 *       data={items}
 *       renderItem={renderItem}
 *       itemHeight={50}
 *       itemKeyExtractor={(item) => item.uuid} // Use uuid instead of id
 *     />
 *   );
 * }
 * ```
 *
 * @see {@link SortableItem} for individual item component
 * @see {@link useSortableList} for the underlying hook
 * @see {@link SortableRenderItemProps} for render function props
 * @see {@link UseSortableListOptions} for configuration options
 * @see {@link UseSortableListReturn} for hook return details
 * @see {@link DropProvider} for drag-and-drop context
 */
export function Sortable<TData extends { id: string }>({
  data,
  renderItem,
  itemHeight,
  style,
  contentContainerStyle,
  itemKeyExtractor = (item) => item.id,
}: SortableProps<TData>) {
  const sortableOptions: UseSortableListOptions<TData> = {
    data,
    itemHeight,
    itemKeyExtractor,
  };

  const {
    scrollViewRef,
    dropProviderRef,
    handleScroll,
    handleScrollEnd,
    contentHeight,
    getItemProps,
  } = useSortableList<TData>(sortableOptions);

  return (
    <GestureHandlerRootView style={styles.flex}>
      <DropProvider ref={dropProviderRef}>
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
            // Get the item props from our hook
            const itemProps = getItemProps(item, index);

            // Create the complete props with the item and index
            const sortableItemProps: SortableRenderItemProps<TData> = {
              item,
              index,
              ...itemProps,
            };

            return renderItem(sortableItemProps);
          })}
        </AnimatedScrollView>
      </DropProvider>
    </GestureHandlerRootView>
  );
}

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
