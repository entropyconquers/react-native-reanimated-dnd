import { useRef, useCallback } from "react";
import {
  scrollTo,
  useAnimatedReaction,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import { listToObject, getContentWidth } from "../components/sortableUtils";
import { HorizontalScrollDirection } from "../types/sortable";
import { DropProviderRef } from "../types/context";
import {
  UseHorizontalSortableListOptions,
  UseHorizontalSortableListReturn,
} from "../types/sortable";

/**
 * A hook for managing horizontal sortable lists with drag-and-drop reordering capabilities.
 *
 * This hook provides the foundational state management and utilities needed to create
 * horizontal sortable lists. It handles position tracking, scroll synchronization,
 * auto-scrolling, gap management, and provides helper functions for individual sortable items.
 *
 * @template TData - The type of data items in the sortable list (must extend `{ id: string }`)
 * @param options - Configuration options for the horizontal sortable list
 * @returns Object containing shared values, refs, handlers, and utilities for the horizontal sortable list
 *
 * @example
 * Basic horizontal sortable list setup:
 * ```typescript
 * import { useHorizontalSortableList } from './hooks/useHorizontalSortableList';
 * import { HorizontalSortableItem } from './components/HorizontalSortableItem';
 *
 * interface Tag {
 *   id: string;
 *   label: string;
 *   color: string;
 * }
 *
 * function TagList() {
 *   const [tags, setTags] = useState<Tag[]>([
 *     { id: '1', label: 'React', color: '#61dafb' },
 *     { id: '2', label: 'TypeScript', color: '#3178c6' },
 *     { id: '3', label: 'React Native', color: '#0fa5e9' }
 *   ]);
 *
 *   const {
 *     scrollViewRef,
 *     dropProviderRef,
 *     handleScroll,
 *     handleScrollEnd,
 *     contentWidth,
 *     getItemProps,
 *   } = useHorizontalSortableList({
 *     data: tags,
 *     itemWidth: 120,
 *     gap: 10,
 *     paddingHorizontal: 16,
 *   });
 *
 *   return (
 *     <GestureHandlerRootView style={styles.container}>
 *       <DropProvider ref={dropProviderRef}>
 *         <Animated.ScrollView
 *           ref={scrollViewRef}
 *           onScroll={handleScroll}
 *           scrollEventThrottle={16}
 *           horizontal={true}
 *           style={styles.scrollView}
 *           contentContainerStyle={{ width: contentWidth }}
 *           onScrollEndDrag={handleScrollEnd}
 *           onMomentumScrollEnd={handleScrollEnd}
 *           showsHorizontalScrollIndicator={false}
 *         >
 *           {tags.map((tag, index) => {
 *             const itemProps = getItemProps(tag, index);
 *             return (
 *               <HorizontalSortableItem key={tag.id} {...itemProps}>
 *                 <View style={[styles.tagItem, { backgroundColor: tag.color }]}>
 *                   <Text style={styles.tagText}>{tag.label}</Text>
 *                 </View>
 *               </HorizontalSortableItem>
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
 * Horizontal sortable list with reordering logic:
 * ```typescript
 * function ReorderableTagList() {
 *   const [tags, setTags] = useState(initialTags);
 *
 *   const handleReorder = useCallback((id: string, from: number, to: number) => {
 *     setTags(prevTags => {
 *       const newTags = [...prevTags];
 *       const [movedTag] = newTags.splice(from, 1);
 *       newTags.splice(to, 0, movedTag);
 *       return newTags;
 *     });
 *   }, []);
 *
 *   const sortableProps = useHorizontalSortableList({
 *     data: tags,
 *     itemWidth: 100,
 *     gap: 8,
 *     paddingHorizontal: 20,
 *   });
 *
 *   return (
 *     <HorizontalSortableContainer {...sortableProps}>
 *       {tags.map((tag, index) => {
 *         const itemProps = sortableProps.getItemProps(tag, index);
 *         return (
 *           <HorizontalSortableItem
 *             key={tag.id}
 *             {...itemProps}
 *             onMove={handleReorder}
 *           >
 *             <TagComponent tag={tag} />
 *           </HorizontalSortableItem>
 *         );
 *       })}
 *     </HorizontalSortableContainer>
 *   );
 * }
 */
export function useHorizontalSortableList<TData extends { id: string }>(
  options: UseHorizontalSortableListOptions<TData>
): UseHorizontalSortableListReturn<TData> {
  const {
    data,
    itemWidth,
    gap = 0,
    paddingHorizontal = 0,
    itemKeyExtractor = (item) => item.id,
  } = options;

  // Set up shared values
  const positions = useSharedValue(listToObject(data));
  const scrollX = useSharedValue(0);
  const autoScroll = useSharedValue(HorizontalScrollDirection.None);
  const scrollViewRef = useAnimatedRef();
  const dropProviderRef = useRef<DropProviderRef>(null!);

  // Scrolling synchronization
  useAnimatedReaction(
    () => scrollX.value,
    (scrolling) => {
      scrollTo(scrollViewRef, scrolling, 0, false);
    }
  );

  // Handle scroll events
  const handleScroll = useAnimatedScrollHandler((event) => {
    scrollX.value = event.contentOffset.x;
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

  // Calculate content width including gaps and padding
  const contentWidth = getContentWidth(
    data.length,
    itemWidth,
    gap,
    paddingHorizontal
  );

  // Helper to get props for each sortable item
  const getItemProps = useCallback(
    (item: TData, index: number) => {
      const id = itemKeyExtractor(item, index);
      return {
        id,
        positions,
        leftBound: scrollX,
        autoScrollDirection: autoScroll,
        itemsCount: data.length,
        itemWidth,
        gap,
        paddingHorizontal,
      };
    },
    [
      data.length,
      itemWidth,
      gap,
      paddingHorizontal,
      itemKeyExtractor,
      positions,
      scrollX,
      autoScroll,
    ]
  );

  return {
    positions,
    scrollX,
    autoScroll,
    scrollViewRef,
    dropProviderRef,
    handleScroll,
    handleScrollEnd,
    contentWidth,
    getItemProps,
  };
}
