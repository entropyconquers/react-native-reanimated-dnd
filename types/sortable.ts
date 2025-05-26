import { StyleProp, ViewStyle } from "react-native";
import { SharedValue } from "react-native-reanimated";
import { ScrollDirection } from "react-native-reanimated-dnd";
import { DropProviderRef } from "react-native-reanimated-dnd";

/**
 * Configuration options for the useSortable hook.
 *
 * @template T - The type of data associated with the sortable item
 */
export interface UseSortableOptions<T> {
  /**
   * Unique identifier for this sortable item. Must be unique within the sortable list.
   * Used for tracking position changes and managing reordering logic.
   *
   * @example
   * ```typescript
   * const itemId = `task-${task.id}`;
   * ```
   */
  id: string;

  /**
   * Shared value containing the current positions of all items in the sortable list.
   * This is typically managed by the parent sortable list component.
   *
   * @example
   * ```typescript
   * // Managed by useSortableList hook
   * const positions = useSharedValue({
   *   'item-1': 0,
   *   'item-2': 1,
   *   'item-3': 2
   * });
   * ```
   */
  positions: SharedValue<{ [id: string]: number }>;

  /**
   * Shared value representing the current scroll position (lower bound) of the container.
   * Used for auto-scrolling during drag operations.
   */
  lowerBound: SharedValue<number>;

  /**
   * Shared value indicating the current auto-scroll direction.
   * Used to trigger automatic scrolling when dragging near container edges.
   */
  autoScrollDirection: SharedValue<ScrollDirection>;

  /**
   * Total number of items in the sortable list.
   * Used for boundary calculations and position validation.
   */
  itemsCount: number;

  /**
   * Height of each item in pixels. All items must have the same height.
   * Used for position calculations and auto-scrolling.
   *
   * @example
   * ```typescript
   * const ITEM_HEIGHT = 60; // 60px per item
   * ```
   */
  itemHeight: number;

  /**
   * Height of the scrollable container in pixels.
   * Used for auto-scroll calculations and determining scroll boundaries.
   *
   * @default 500
   */
  containerHeight?: number;

  /**
   * Callback fired when an item's position changes within the list.
   * This is called for both the moved item and any items that were displaced.
   *
   * @param id - The ID of the item that moved
   * @param from - The previous position index
   * @param to - The new position index
   *
   * @example
   * ```typescript
   * const handleMove = (id: string, from: number, to: number) => {
   *   console.log(`Item ${id} moved from position ${from} to ${to}`);
   *   // Update your data model
   *   reorderItems(id, from, to);
   * };
   * ```
   */
  onMove?: (id: string, from: number, to: number) => void;

  /**
   * Callback fired when dragging starts for this item.
   *
   * @param id - The ID of the item being dragged
   * @param position - The current position index of the item
   *
   * @example
   * ```typescript
   * const handleDragStart = (id: string, position: number) => {
   *   console.log(`Started dragging item ${id} from position ${position}`);
   *   setDraggingItem(id);
   *   hapticFeedback();
   * };
   * ```
   */
  onDragStart?: (id: string, position: number) => void;

  /**
   * Callback fired when dragging ends for this item.
   *
   * @param id - The ID of the item that was being dragged
   * @param position - The final position index of the item
   *
   * @example
   * ```typescript
   * const handleDrop = (id: string, position: number) => {
   *   console.log(`Dropped item ${id} at position ${position}`);
   *   setDraggingItem(null);
   *   saveNewOrder();
   * };
   * ```
   */
  onDrop?: (id: string, position: number) => void;

  /**
   * Callback fired continuously while dragging, providing real-time position updates.
   * Useful for showing visual feedback or updating UI during drag operations.
   *
   * @param id - The ID of the item being dragged
   * @param overItemId - The ID of the item currently being hovered over (null if none)
   * @param yPosition - The current Y position of the dragged item
   *
   * @example
   * ```typescript
   * const handleDragging = (id: string, overItemId: string | null, yPosition: number) => {
   *   if (overItemId) {
   *     console.log(`Item ${id} is hovering over ${overItemId}`);
   *     setHoverTarget(overItemId);
   *   } else {
   *     setHoverTarget(null);
   *   }
   * };
   * ```
   */
  onDragging?: (
    id: string,
    overItemId: string | null,
    yPosition: number
  ) => void;

  /**
   * Children elements - used internally for handle detection.
   * @internal
   */
  children?: React.ReactNode;

  /**
   * Handle component type - used internally for handle detection.
   * @internal
   */
  handleComponent?: React.ComponentType<any>;
}

/**
 * Return value from the useSortable hook.
 */
export interface UseSortableReturn {
  /**
   * Animated style to apply to the sortable item.
   * Contains position transforms and visual effects for dragging state.
   */
  animatedStyle: StyleProp<ViewStyle>;

  /**
   * Pan gesture handler for drag interactions.
   * Attach this to a PanGestureHandler to enable dragging.
   */
  panGestureHandler: any;

  /**
   * Whether this item is currently being moved/dragged.
   * Useful for conditional styling or behavior.
   */
  isMoving: boolean;

  /**
   * Whether this sortable item has a handle component.
   * When true, only the handle can initiate dragging.
   * When false, the entire item is draggable.
   */
  hasHandle: boolean;
}

/**
 * Configuration options for the useSortableList hook.
 *
 * @template TData - The type of data items in the sortable list
 */
export interface UseSortableListOptions<TData> {
  /**
   * Array of data items to be rendered as sortable list items.
   * Each item must have an `id` property for tracking.
   *
   * @example
   * ```typescript
   * const tasks = [
   *   { id: '1', title: 'Task 1', completed: false },
   *   { id: '2', title: 'Task 2', completed: true },
   *   { id: '3', title: 'Task 3', completed: false }
   * ];
   * ```
   */
  data: TData[];

  /**
   * Height of each item in pixels. All items must have the same height
   * for proper position calculations and smooth animations.
   *
   * @example
   * ```typescript
   * const ITEM_HEIGHT = 80; // Each list item is 80px tall
   * ```
   */
  itemHeight: number;

  /**
   * Function to extract a unique key from each data item.
   * If not provided, defaults to using the `id` property.
   *
   * @param item - The data item
   * @param index - The index of the item in the array
   * @returns Unique string identifier for the item
   *
   * @default (item) => item.id
   *
   * @example
   * ```typescript
   * // Custom key extractor for items without id property
   * const keyExtractor = (item, index) => `${item.type}-${item.name}-${index}`;
   *
   * // Using a compound key
   * const keyExtractor = (item) => `${item.category}_${item.id}`;
   * ```
   */
  itemKeyExtractor?: (item: TData, index: number) => string;
}

/**
 * Return value from the useSortableList hook.
 *
 * @template TData - The type of data items in the sortable list
 */
export interface UseSortableListReturn<TData> {
  /**
   * Shared value containing the current positions of all items.
   * Maps item IDs to their current position indices.
   *
   * @example
   * ```typescript
   * // positions.value might look like:
   * {
   *   'item-1': 0,
   *   'item-2': 1,
   *   'item-3': 2
   * }
   * ```
   */
  positions: any;

  /**
   * Shared value tracking the current scroll position.
   * Used for auto-scrolling during drag operations.
   */
  scrollY: any;

  /**
   * Shared value indicating the current auto-scroll direction.
   * Used to trigger automatic scrolling when dragging near edges.
   */
  autoScroll: any;

  /**
   * Animated ref for the scroll view component.
   * Used for programmatic scrolling during drag operations.
   */
  scrollViewRef: any;

  /**
   * Ref for the drop provider context.
   * Used for triggering position updates after scroll events.
   */
  dropProviderRef: React.RefObject<DropProviderRef>;

  /**
   * Animated scroll handler to attach to the ScrollView.
   * Tracks scroll position for auto-scroll calculations.
   */
  handleScroll: any;

  /**
   * Callback to call when scrolling ends.
   * Triggers position recalculation for accurate drop zone detection.
   */
  handleScrollEnd: () => void;

  /**
   * Total height of the scrollable content.
   * Calculated as `data.length * itemHeight`.
   */
  contentHeight: number;

  /**
   * Helper function to get props for individual sortable items.
   *
   * @param item - The data item
   * @param index - The index of the item in the array
   * @returns Props object to pass to the sortable item component
   *
   * @example
   * ```typescript
   * {data.map((item, index) => {
   *   const itemProps = getItemProps(item, index);
   *   return (
   *     <SortableItem key={itemProps.id} {...itemProps}>
   *       <Text>{item.title}</Text>
   *     </SortableItem>
   *   );
   * })}
   * ```
   */
  getItemProps: (
    item: TData,
    index: number
  ) => {
    /** Unique identifier for the item */
    id: string;
    /** Shared positions object */
    positions: any;
    /** Shared scroll position */
    lowerBound: any;
    /** Shared auto-scroll direction */
    autoScrollDirection: any;
    /** Total number of items */
    itemsCount: number;
    /** Height of each item */
    itemHeight: number;
  };
}
