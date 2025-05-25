import { ReactNode } from "react";
import { StyleProp, ViewStyle } from "react-native";
import { SharedValue } from "react-native-reanimated";
import { ScrollDirection } from "./sortableUtils";

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

  /** Shared value representing the current scroll position */
  lowerBound: SharedValue<number>;

  /** Shared value indicating the current auto-scroll direction */
  autoScrollDirection: SharedValue<ScrollDirection>;

  /** Total number of items in the sortable list */
  itemsCount: number;

  /** Height of each item in pixels */
  itemHeight: number;

  /** Height of the scrollable container (optional) */
  containerHeight?: number;

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
    yPosition: number
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

  /** Height of each item in pixels */
  itemHeight: number;

  /** Style to apply to the scroll view */
  style?: StyleProp<ViewStyle>;

  /** Style to apply to the scroll view content container */
  contentContainerStyle?: StyleProp<ViewStyle>;

  /** Function to extract unique key from each item */
  itemKeyExtractor?: (item: TData, index: number) => string;
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

  /** Shared value representing the current scroll position */
  lowerBound: SharedValue<number>;

  /** Shared value indicating the current auto-scroll direction */
  autoScrollDirection: SharedValue<ScrollDirection>;

  /** Total number of items in the list */
  itemsCount: number;

  /** Height of each item in pixels */
  itemHeight: number;
}
