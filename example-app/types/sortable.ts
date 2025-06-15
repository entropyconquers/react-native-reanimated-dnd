import { StyleProp, ViewStyle } from "react-native";
import { SharedValue } from "react-native-reanimated";
import { DropProviderRef } from "../types/context";
import { ReactNode } from "react";

export enum ScrollDirection {
  None = "none",
  Up = "up",
  Down = "down",
}

// Add horizontal scroll directions
export enum HorizontalScrollDirection {
  None = "none",
  Left = "left",
  Right = "right",
}

// Add Direction enum for unified sortable components
export enum SortableDirection {
  Vertical = "vertical",
  Horizontal = "horizontal",
}

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

/**
 * Props interface for the SortableItem component.
 *
 * @template T - The type of data associated with the sortable item
 *
 * @see {@link SortableItem} for component usage
 * @see {@link useSortable} for the underlying hook
 * @see {@link UseSortableOptions} for hook configuration options
 * @see {@link UseSortableReturn} for hook return details
 */
export interface SortableItemProps<T> {
  /** Unique identifier for this sortable item */
  id: string;

  /** Data associated with this sortable item */
  data: T;

  /** Shared value containing positions of all items in the list */
  positions: SharedValue<{ [id: string]: number }>;

  /** Shared value representing the current scroll position (for vertical) */
  lowerBound?: SharedValue<number>;

  /** Shared value representing the current scroll position (for horizontal) */
  leftBound?: SharedValue<number>;

  /** Shared value indicating the current auto-scroll direction (for vertical) */
  autoScrollDirection?: SharedValue<ScrollDirection>;

  /** Shared value indicating the current auto-scroll direction (for horizontal) */
  autoScrollHorizontalDirection?: SharedValue<HorizontalScrollDirection>;

  /** Total number of items in the sortable list */
  itemsCount: number;

  /** Direction of the sortable list */
  direction?: SortableDirection;

  /** Height of each item in pixels (for vertical) */
  itemHeight?: number;

  /** Width of each item in pixels (for horizontal) */
  itemWidth?: number;

  /** Gap between items in pixels (for horizontal) */
  gap?: number;

  /** Horizontal padding of the container (for horizontal) */
  paddingHorizontal?: number;

  /** Height of the scrollable container (optional, for vertical) */
  containerHeight?: number;

  /** Width of the scrollable container (optional, for horizontal) */
  containerWidth?: number;

  /** Child components to render inside the sortable item */
  children: ReactNode;

  /** Style to apply to the item container */
  style?: StyleProp<ViewStyle>;

  /** Additional animated style to apply */
  animatedStyle?: StyleProp<ViewStyle>;

  /** Callback fired when item position changes */
  onMove?: (id: string, from: number, to: number) => void;

  /** Callback fired when dragging starts */
  onDragStart?: (id: string, position: number) => void;

  /** Callback fired when dragging ends */
  onDrop?: (id: string, position: number) => void;

  /** Callback fired during dragging with position updates (for vertical) */
  onDragging?: (
    id: string,
    overItemId: string | null,
    yPosition: number
  ) => void;

  /** Callback fired during dragging with position updates (for horizontal) */
  onDraggingHorizontal?: (
    id: string,
    overItemId: string | null,
    xPosition: number
  ) => void;
}

/**
 * Props interface for the Sortable component.
 *
 * @template TData - The type of data items in the sortable list
 *
 * @see {@link Sortable} for component usage
 * @see {@link useSortableList} for the underlying hook
 * @see {@link UseSortableListOptions} for hook configuration options
 * @see {@link UseSortableListReturn} for hook return details
 */
export interface SortableProps<TData> {
  /** Array of data items to render as sortable list */
  data: TData[];

  /** Function to render each sortable item */
  renderItem: (props: SortableRenderItemProps<TData>) => ReactNode;

  /** Direction of the sortable list */
  direction?: SortableDirection;

  /** Height of each item in pixels (required for vertical direction) */
  itemHeight?: number;

  /** Width of each item in pixels (required for horizontal direction) */
  itemWidth?: number;

  /** Gap between items in pixels (only for horizontal direction) */
  gap?: number;

  /** Horizontal padding of the container (only for horizontal direction) */
  paddingHorizontal?: number;

  /** Style to apply to the scroll view */
  style?: StyleProp<ViewStyle>;

  /** Style to apply to the scroll view content container */
  contentContainerStyle?: StyleProp<ViewStyle>;

  /** Function to extract unique key from each item */
  itemKeyExtractor?: (item: TData, index: number) => string;

  /**
   * Whether to use FlatList for rendering instead of ScrollView.
   * FlatList provides better performance for large lists with virtualization,
   * while ScrollView renders all items at once.
   * @default true
   */
  useFlatList?: boolean;
}

/**
 * Props passed to the renderItem function in Sortable component.
 *
 * @template TData - The type of data item being rendered
 *
 * @see {@link SortableProps} for usage
 * @see {@link Sortable} for component usage
 * @see {@link SortableItem} for individual item component
 */
export interface SortableRenderItemProps<TData> {
  /** The data item being rendered */
  item: TData;

  /** Index of the item in the original data array */
  index: number;

  /** Unique identifier for this item */
  id: string;

  /** Shared value containing positions of all items */
  positions: SharedValue<{ [id: string]: number }>;

  /** Direction of the sortable list */
  direction?: SortableDirection;

  /** Shared value representing the current scroll position (for vertical) */
  lowerBound?: SharedValue<number>;

  /** Shared value representing the current scroll position (for horizontal) */
  leftBound?: SharedValue<number>;

  /** Shared value indicating the current auto-scroll direction (for vertical) */
  autoScrollDirection?: SharedValue<ScrollDirection>;

  /** Shared value indicating the current auto-scroll direction (for horizontal) */
  autoScrollHorizontalDirection?: SharedValue<HorizontalScrollDirection>;

  /** Total number of items in the list */
  itemsCount: number;

  /** Height of each item in pixels (for vertical) */
  itemHeight?: number;

  /** Width of each item in pixels (for horizontal) */
  itemWidth?: number;

  /** Gap between items in pixels (for horizontal) */
  gap?: number;

  /** Horizontal padding of the container (for horizontal) */
  paddingHorizontal?: number;
}

export interface SortableContextValue {
  panGestureHandler: any;
}

/**
 * Props for the SortableHandle component.
 */
export interface SortableHandleProps {
  /** The content to render inside the handle */
  children: React.ReactNode;
  /** Optional style to apply to the handle */
  style?: StyleProp<ViewStyle>;
}

/**
 * Configuration options for the useHorizontalSortable hook.
 *
 * @template T - The type of data associated with the sortable item
 */
export interface UseHorizontalSortableOptions<T> {
  /**
   * Unique identifier for this sortable item. Must be unique within the sortable list.
   * Used for tracking position changes and managing reordering logic.
   */
  id: string;

  /**
   * Shared value containing the current positions of all items in the sortable list.
   * This is typically managed by the parent sortable list component.
   */
  positions: SharedValue<{ [id: string]: number }>;

  /**
   * Shared value representing the current scroll position (left bound) of the container.
   * Used for auto-scrolling during drag operations.
   */
  leftBound: SharedValue<number>;

  /**
   * Shared value indicating the current auto-scroll direction.
   * Used to trigger automatic scrolling when dragging near container edges.
   */
  autoScrollDirection: SharedValue<HorizontalScrollDirection>;

  /**
   * Total number of items in the sortable list.
   * Used for boundary calculations and position validation.
   */
  itemsCount: number;

  /**
   * Width of each item in pixels. All items must have the same width.
   * Used for position calculations and auto-scrolling.
   */
  itemWidth: number;

  /**
   * Gap between items in pixels.
   * @default 0
   */
  gap?: number;

  /**
   * Horizontal padding of the container in pixels.
   * @default 0
   */
  paddingHorizontal?: number;

  /**
   * Width of the scrollable container in pixels.
   * Used for auto-scroll calculations and determining scroll boundaries.
   * @default 500
   */
  containerWidth?: number;

  /**
   * Callback fired when an item's position changes within the list.
   */
  onMove?: (id: string, from: number, to: number) => void;

  /**
   * Callback fired when dragging starts for this item.
   */
  onDragStart?: (id: string, position: number) => void;

  /**
   * Callback fired when dragging ends for this item.
   */
  onDrop?: (id: string, position: number) => void;

  /**
   * Callback fired continuously while dragging, providing real-time position updates.
   */
  onDragging?: (
    id: string,
    overItemId: string | null,
    xPosition: number
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
 * Return value from the useHorizontalSortable hook.
 */
export interface UseHorizontalSortableReturn {
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
   */
  hasHandle: boolean;
}

/**
 * Configuration options for the useHorizontalSortableList hook.
 *
 * @template TData - The type of data items in the sortable list
 */
export interface UseHorizontalSortableListOptions<TData> {
  /**
   * Array of data items to be rendered as sortable list items.
   */
  data: TData[];

  /**
   * Width of each item in pixels. All items must have the same width
   * for proper position calculations and smooth animations.
   */
  itemWidth: number;

  /**
   * Gap between items in pixels.
   * @default 0
   */
  gap?: number;

  /**
   * Horizontal padding of the container in pixels.
   * @default 0
   */
  paddingHorizontal?: number;

  /**
   * Function to extract a unique key from each data item.
   * If not provided, defaults to using the `id` property.
   */
  itemKeyExtractor?: (item: TData, index: number) => string;
}

/**
 * Return value from the useHorizontalSortableList hook.
 *
 * @template TData - The type of data items in the sortable list
 */
export interface UseHorizontalSortableListReturn<TData> {
  /**
   * Shared value containing the current positions of all items.
   */
  positions: any;

  /**
   * Shared value tracking the current horizontal scroll position.
   */
  scrollX: any;

  /**
   * Shared value indicating the current auto-scroll direction.
   */
  autoScroll: any;

  /**
   * Animated ref for the scroll view component.
   */
  scrollViewRef: any;

  /**
   * Ref for the drop provider context.
   */
  dropProviderRef: React.RefObject<DropProviderRef>;

  /**
   * Animated scroll handler to attach to the ScrollView.
   */
  handleScroll: any;

  /**
   * Callback to call when scrolling ends.
   */
  handleScrollEnd: () => void;

  /**
   * Total width of the scrollable content.
   */
  contentWidth: number;

  /**
   * Helper function to get props for individual sortable items.
   */
  getItemProps: (
    item: TData,
    index: number
  ) => {
    id: string;
    positions: any;
    leftBound: any;
    autoScrollDirection: any;
    itemsCount: number;
    itemWidth: number;
    gap: number;
    paddingHorizontal: number;
  };
}

/**
 * Props interface for the HorizontalSortableItem component.
 *
 * @template T - The type of data associated with the sortable item
 */
export interface HorizontalSortableItemProps<T> {
  /** Unique identifier for this sortable item */
  id: string;

  /** Data associated with this sortable item */
  data: T;

  /** Shared value containing positions of all items in the list */
  positions: SharedValue<{ [id: string]: number }>;

  /** Shared value representing the current scroll position */
  leftBound: SharedValue<number>;

  /** Shared value indicating the current auto-scroll direction */
  autoScrollDirection: SharedValue<HorizontalScrollDirection>;

  /** Total number of items in the sortable list */
  itemsCount: number;

  /** Width of each item in pixels */
  itemWidth: number;

  /** Gap between items in pixels */
  gap?: number;

  /** Horizontal padding of the container */
  paddingHorizontal?: number;

  /** Width of the scrollable container (optional) */
  containerWidth?: number;

  /** Child components to render inside the sortable item */
  children: ReactNode;

  /** Style to apply to the item container */
  style?: StyleProp<ViewStyle>;

  /** Additional animated style to apply */
  animatedStyle?: StyleProp<ViewStyle>;

  /** Callback fired when item position changes */
  onMove?: (id: string, from: number, to: number) => void;

  /** Callback fired when dragging starts */
  onDragStart?: (id: string, position: number) => void;

  /** Callback fired when dragging ends */
  onDrop?: (id: string, position: number) => void;

  /** Callback fired during dragging with position updates */
  onDragging?: (
    id: string,
    overItemId: string | null,
    xPosition: number
  ) => void;
}

/**
 * Props interface for the HorizontalSortable component.
 *
 * @template TData - The type of data items in the sortable list
 */
export interface HorizontalSortableProps<TData> {
  /** Array of data items to render as sortable list */
  data: TData[];

  /** Function to render each sortable item */
  renderItem: (props: HorizontalSortableRenderItemProps<TData>) => ReactNode;

  /** Width of each item in pixels */
  itemWidth: number;

  /** Gap between items in pixels */
  gap?: number;

  /** Horizontal padding of the container */
  paddingHorizontal?: number;

  /** Style to apply to the scroll view */
  style?: StyleProp<ViewStyle>;

  /** Style to apply to the scroll view content container */
  contentContainerStyle?: StyleProp<ViewStyle>;

  /** Function to extract unique key from each item */
  itemKeyExtractor?: (item: TData, index: number) => string;
}

/**
 * Props passed to the renderItem function in HorizontalSortable component.
 *
 * @template TData - The type of data item being rendered
 *
 * @see {@link SortableProps} for usage
 * @see {@link Sortable} for component usage
 * @see {@link SortableItem} for individual item component
 */
export interface HorizontalSortableRenderItemProps<TData> {
  /** The data item being rendered */
  item: TData;

  /** Index of the item in the original data array */
  index: number;

  /** Unique identifier for this item */
  id: string;

  /** Shared value containing positions of all items */
  positions: SharedValue<{ [id: string]: number }>;

  /** Shared value representing the current scroll position */
  leftBound: SharedValue<number>;

  /** Shared value indicating the current auto-scroll direction */
  autoScrollDirection: SharedValue<HorizontalScrollDirection>;

  /** Total number of items in the list */
  itemsCount: number;

  /** Width of each item in pixels */
  itemWidth: number;

  /** Gap between items in pixels */
  gap: number;

  /** Horizontal padding of the container */
  paddingHorizontal: number;
}
