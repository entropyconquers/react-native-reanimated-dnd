import React, { memo, useCallback } from "react";
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
 * The Sortable component provides a complete solution for sortable lists, handling
 * all the complex state management, gesture handling, and animations internally.
 * It renders a scrollable list where items can be dragged to reorder them with
 * smooth animations and auto-scrolling support.
 *
 * Supports both vertical (default) and horizontal directions via the `direction` prop.
 *
 * @template TData - The type of data items in the list (must extend `{ id: string }`)
 * @param props - Configuration props for the sortable list
 *
 * @example
 * Basic vertical sortable list (default):
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
 * Horizontal sortable list:
 * ```typescript
 * function HorizontalTagList() {
 *   const [tags, setTags] = useState<Tag[]>([
 *     { id: '1', label: 'React', color: '#61dafb' },
 *     { id: '2', label: 'TypeScript', color: '#3178c6' },
 *     { id: '3', label: 'React Native', color: '#0fa5e9' }
 *   ]);
 *
 *   const renderTag = ({ item, id, positions, ...props }) => (
 *     <SortableItem key={id} id={id} positions={positions} {...props}>
 *       <View style={[styles.tagItem, { backgroundColor: item.color }]}>
 *         <Text style={styles.tagText}>{item.label}</Text>
 *       </View>
 *     </SortableItem>
 *   );
 *
 *   return (
 *     <Sortable
 *       data={tags}
 *       renderItem={renderTag}
 *       direction="horizontal"
 *       itemWidth={120}
 *       gap={12}
 *       paddingHorizontal={16}
 *       style={styles.horizontalList}
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
 * @see {@link SortableItem} for individual item component
 * @see {@link useSortableList} for the underlying vertical hook
 * @see {@link useHorizontalSortableList} for the underlying horizontal hook
 * @see {@link SortableRenderItemProps} for render function props
 * @see {@link SortableDirection} for direction options
 */
function SortableComponent<TData extends { id: string }>({
  data,
  renderItem,
  direction = SortableDirection.Vertical,
  itemHeight,
  itemWidth,
  gap = 0,
  paddingHorizontal = 0,
  style,
  contentContainerStyle,
  itemKeyExtractor = (item) => item.id,
  useFlatList = true,
}: SortableProps<TData>) {
  // Validate required props based on direction
  if (direction === SortableDirection.Vertical && !itemHeight) {
    throw new Error("itemHeight is required when direction is vertical");
  }
  if (direction === SortableDirection.Horizontal && !itemWidth) {
    throw new Error("itemWidth is required when direction is horizontal");
  }

  if (direction === SortableDirection.Horizontal) {
    // Use horizontal sortable implementation
    const horizontalOptions: UseHorizontalSortableListOptions<TData> = {
      data,
      itemWidth: itemWidth!,
      gap,
      paddingHorizontal,
      itemKeyExtractor,
    };

    const {
      scrollViewRef: horizontalScrollViewRef,
      dropProviderRef: horizontalDropProviderRef,
      handleScroll: horizontalHandleScroll,
      handleScrollEnd: horizontalHandleScrollEnd,
      contentWidth,
      getItemProps: getHorizontalItemProps,
    } = useHorizontalSortableList<TData>(horizontalOptions);

    const memoizedHorizontalRenderItem = useCallback(
      ({ item, index }: { item: unknown; index: number }) => {
        const itemProps = getHorizontalItemProps(
          item as unknown as TData,
          index
        );
        const sortableItemProps: SortableRenderItemProps<TData> = {
          item: item as TData,
          index,
          direction: SortableDirection.Horizontal,
          autoScrollHorizontalDirection: itemProps.autoScrollDirection,
          ...itemProps,
        };
        return renderItem(sortableItemProps) as React.ReactElement;
      },
      [getHorizontalItemProps, renderItem]
    );

    return (
      <GestureHandlerRootView style={styles.flex}>
        <DropProvider ref={horizontalDropProviderRef}>
          {useFlatList ? (
            <AnimatedFlatList
              ref={horizontalScrollViewRef}
              data={data}
              keyExtractor={itemKeyExtractor as any}
              horizontal
              renderItem={memoizedHorizontalRenderItem}
              onScroll={horizontalHandleScroll}
              scrollEventThrottle={16}
              style={[styles.scrollView, style]}
              contentContainerStyle={[
                { width: contentWidth },
                contentContainerStyle,
              ]}
              onScrollEndDrag={horizontalHandleScrollEnd}
              onMomentumScrollEnd={horizontalHandleScrollEnd}
              simultaneousHandlers={horizontalDropProviderRef}
              showsHorizontalScrollIndicator={false}
            />
          ) : (
            <AnimatedScrollView
              ref={horizontalScrollViewRef}
              onScroll={horizontalHandleScroll}
              scrollEventThrottle={16}
              horizontal={true}
              style={[styles.scrollView, style]}
              contentContainerStyle={[
                { width: contentWidth },
                contentContainerStyle,
              ]}
              onScrollEndDrag={horizontalHandleScrollEnd}
              onMomentumScrollEnd={horizontalHandleScrollEnd}
              simultaneousHandlers={horizontalDropProviderRef}
              showsHorizontalScrollIndicator={false}
            >
              {data.map((item, index) => {
                const itemProps = getHorizontalItemProps(item, index);
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

  // Use vertical sortable implementation (default)
  const verticalOptions: UseSortableListOptions<TData> = {
    data,
    itemHeight: itemHeight!,
    itemKeyExtractor,
  };

  const {
    scrollViewRef,
    dropProviderRef,
    handleScroll,
    handleScrollEnd,
    contentHeight,
    getItemProps,
  } = useSortableList<TData>(verticalOptions);

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
