import { useRef, useCallback } from "react";
import {
  scrollTo,
  useAnimatedReaction,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import { listToObject } from "../components/sortableUtils";
import { ScrollDirection } from "../types/sortable";
import { DropProviderRef } from "../types/context";

export interface UseSortableListOptions<TData> {
  data: TData[];
  itemHeight: number;
  itemKeyExtractor?: (item: TData, index: number) => string;
}

export interface UseSortableListReturn<TData> {
  positions: any;
  scrollY: any;
  autoScroll: any;
  scrollViewRef: any;
  dropProviderRef: React.RefObject<DropProviderRef>;
  handleScroll: any;
  handleScrollEnd: () => void;
  contentHeight: number;
  getItemProps: (
    item: TData,
    index: number
  ) => {
    id: string;
    positions: any;
    lowerBound: any;
    autoScrollDirection: any;
    itemsCount: number;
    itemHeight: number;
  };
}

/**
 * A hook for managing sortable lists with drag-and-drop reordering capabilities.
 *
 * This hook provides the foundational state management and utilities needed to create
 * sortable lists. It handles position tracking, scroll synchronization, auto-scrolling,
 * and provides helper functions for individual sortable items.
 *
 * @template TData - The type of data items in the sortable list (must extend `{ id: string }`)
 * @param options - Configuration options for the sortable list
 * @returns Object containing shared values, refs, handlers, and utilities for the sortable list
 *
 * @example
 * Basic sortable list setup:
 * ```typescript
 * import { useSortableList } from './hooks/useSortableList';
 * import { SortableItem } from './components/SortableItem';
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
 *   const {
 *     scrollViewRef,
 *     dropProviderRef,
 *     handleScroll,
 *     handleScrollEnd,
 *     contentHeight,
 *     getItemProps,
 *   } = useSortableList({
 *     data: tasks,
 *     itemHeight: 60,
 *   });
 *
 *   return (
 *     <GestureHandlerRootView style={styles.container}>
 *       <DropProvider ref={dropProviderRef}>
 *         <Animated.ScrollView
 *           ref={scrollViewRef}
 *           onScroll={handleScroll}
 *           scrollEventThrottle={16}
 *           style={styles.scrollView}
 *           contentContainerStyle={{ height: contentHeight }}
 *           onScrollEndDrag={handleScrollEnd}
 *           onMomentumScrollEnd={handleScrollEnd}
 *         >
 *           {tasks.map((task, index) => {
 *             const itemProps = getItemProps(task, index);
 *             return (
 *               <SortableItem key={task.id} {...itemProps}>
 *                 <View style={styles.taskItem}>
 *                   <Text>{task.title}</Text>
 *                 </View>
 *               </SortableItem>
 *             );
 *           })}
 *         </Animated.ScrollView>
 *       </DropProvider>
 *     </GestureHandlerRootView>
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
 *   const sortableListProps = useSortableList({
 *     data: items,
 *     itemHeight: 50,
 *     itemKeyExtractor: (item) => item.uuid, // Use uuid instead of id
 *   });
 *
 *   const { getItemProps, ...otherProps } = sortableListProps;
 *
 *   return (
 *     <SortableListContainer {...otherProps}>
 *       {items.map((item, index) => {
 *         const itemProps = getItemProps(item, index);
 *         return (
 *           <SortableItem key={item.uuid} {...itemProps}>
 *             <View style={styles.customItem}>
 *               <Text>{item.name}</Text>
 *               <Text>Order: {item.order}</Text>
 *             </View>
 *           </SortableItem>
 *         );
 *       })}
 *     </SortableListContainer>
 *   );
 * }
 * ```
 *
 * @example
 * Sortable list with reordering logic:
 * ```typescript
 * function ReorderableTaskList() {
 *   const [tasks, setTasks] = useState(initialTasks);
 *
 *   const handleReorder = useCallback((id: string, from: number, to: number) => {
 *     setTasks(prevTasks => {
 *       const newTasks = [...prevTasks];
 *       const [movedTask] = newTasks.splice(from, 1);
 *       newTasks.splice(to, 0, movedTask);
 *       return newTasks;
 *     });
 *   }, []);
 *
 *   const sortableProps = useSortableList({
 *     data: tasks,
 *     itemHeight: 80,
 *   });
 *
 *   return (
 *     <SortableListContainer {...sortableProps}>
 *       {tasks.map((task, index) => {
 *         const itemProps = sortableProps.getItemProps(task, index);
 *         return (
 *           <SortableItem
 *             key={task.id}
 *             {...itemProps}
 *             onMove={handleReorder}
 *           >
 *             <TaskCard task={task} />
 *           </SortableItem>
 *         );
 *       })}
 *     </SortableListContainer>
 *   );
 * }
 * ```
 *
 * @see {@link UseSortableListOptions} for configuration options
 * @see {@link UseSortableListReturn} for return value details
 * @see {@link useSortable} for individual item management
 * @see {@link SortableItem} for component implementation
 * @see {@link Sortable} for high-level sortable list component
 * @see {@link DropProvider} for drag-and-drop context
 */
export function useSortableList<TData extends { id: string }>(
  options: UseSortableListOptions<TData>
): UseSortableListReturn<TData> {
  const { data, itemHeight, itemKeyExtractor = (item) => item.id } = options;

  // Set up shared values
  const positions = useSharedValue(listToObject(data));
  const scrollY = useSharedValue(0);
  const autoScroll = useSharedValue(ScrollDirection.None);
  const scrollViewRef = useAnimatedRef();
  const dropProviderRef = useRef<DropProviderRef>(null);

  // Scrolling synchronization
  useAnimatedReaction(
    () => scrollY.value,
    (scrolling) => {
      scrollTo(scrollViewRef, 0, scrolling, false);
    }
  );

  // Handle scroll events
  const handleScroll = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  const handleScrollEnd = useCallback(() => {
    let localScrollTimeout: NodeJS.Timeout | null = null;
    if (localScrollTimeout) {
      clearTimeout(localScrollTimeout);
    }
    localScrollTimeout = setTimeout(() => {
      dropProviderRef.current?.requestPositionUpdate();
    }, 50);
  }, []);

  // Calculate content height
  const contentHeight = data.length * itemHeight;

  // Helper to get props for each sortable item
  const getItemProps = useCallback(
    (item: TData, index: number) => {
      const id = itemKeyExtractor(item, index);
      return {
        id,
        positions,
        lowerBound: scrollY,
        autoScrollDirection: autoScroll,
        itemsCount: data.length,
        itemHeight,
      };
    },
    [data.length, itemHeight, itemKeyExtractor, positions, scrollY, autoScroll]
  );

  return {
    positions,
    scrollY,
    autoScroll,
    scrollViewRef,
    dropProviderRef,
    handleScroll,
    handleScrollEnd,
    contentHeight,
    getItemProps,
  };
}
