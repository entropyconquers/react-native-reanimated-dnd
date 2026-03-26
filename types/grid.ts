import { StyleProp, ViewStyle } from "react-native";
import { ReactNode } from "react";
import { SharedValue } from "react-native-reanimated";
import { GestureType } from "react-native-gesture-handler";
import { SortableData } from "./sortable";
import { DropProviderRef } from "./context";
import { ItemHeights } from "../utils/gridCalculations";

export enum GridScrollDirection {
  None = "none",
  Up = "up",
  Down = "down",
  Left = "left",
  Right = "right",
  UpLeft = "up-left",
  UpRight = "up-right",
  DownLeft = "down-left",
  DownRight = "down-right",
}

export enum GridOrientation {
  Vertical = "vertical",
  Horizontal = "horizontal",
}

export enum GridStrategy {
  Insert = "insert",
  Swap = "swap",
}

export interface GridPosition {
  index: number;
  row: number;
  column: number;
  x: number;
  y: number;
}

export interface GridPositions {
  [id: string]: GridPosition;
}

export interface GridDimensions {
  columns?: number;
  rows?: number;
  itemWidth: number;
  itemHeight: number;
  rowGap?: number;
  columnGap?: number;
  /** Optional mapping of item IDs to custom heights */
  itemHeights?: ItemHeights;
}

/**
 * Configuration options for the useGridSortable hook.
 *
 * @template T - The type of data associated with the sortable grid item
 */
export interface UseGridSortableOptions<T> {
  /** Unique identifier for this grid item */
  id: string;

  /** Shared value containing the current positions of all items */
  positions: SharedValue<GridPositions>;

  /** Shared value tracking the current vertical scroll position */
  scrollY: SharedValue<number>;

  /** Shared value tracking the current horizontal scroll position */
  scrollX: SharedValue<number>;

  /** Shared value indicating the current auto-scroll direction */
  autoScrollDirection: SharedValue<GridScrollDirection>;

  /** Total number of items in the grid */
  itemsCount: number;

  /** Grid dimension configuration */
  dimensions: GridDimensions;

  /** Grid orientation (vertical or horizontal) */
  orientation: GridOrientation;

  /** Reordering strategy (insert or swap) */
  strategy?: GridStrategy;

  /** Width of the scrollable container */
  containerWidth?: number;

  /** Height of the scrollable container */
  containerHeight?: number;

  /** Delay in ms before drag activates */
  activationDelay?: number;

  /** Callback fired when an item's position changes */
  onMove?: (id: string, from: number, to: number) => void;

  /** Callback fired when dragging starts */
  onDragStart?: (id: string, position: number) => void;

  /** Callback fired when dragging ends */
  onDrop?: (
    id: string,
    position: number,
    allPositions?: GridPositions
  ) => void;

  /** Callback fired continuously during dragging */
  onDragging?: (
    id: string,
    overItemId: string | null,
    x: number,
    y: number
  ) => void;

  /** Whether this item is being removed (triggers removal animation) */
  isBeingRemoved?: boolean;

  /** Array of item IDs in the current order (for variable height support) */
  itemIds?: string[];
}

/**
 * Return value from the useGridSortable hook.
 */
export interface UseGridSortableReturn {
  /** Animated style to apply to the grid item */
  animatedStyle: StyleProp<ViewStyle>;

  /** Pan gesture for full-item drag interactions. Automatically disabled when a handle is registered. */
  panGestureHandler: GestureType;

  /** Pan gesture for handle-only drag interactions. */
  handlePanGestureHandler: GestureType;

  /** Whether this item is currently being dragged */
  isMoving: boolean;

  /** Whether this grid item has a handle component */
  hasHandle: boolean;

  /** Callback for handle components to register/unregister themselves. */
  registerHandle: (registered: boolean) => void;
}

/**
 * Configuration options for the useGridSortableList hook.
 *
 * @template TData - The type of data items in the grid
 */
export interface UseGridSortableListOptions<TData extends SortableData> {
  /** Array of data items to manage */
  data: TData[];

  /** Grid dimension configuration */
  dimensions: GridDimensions;

  /** Grid orientation */
  orientation?: GridOrientation;

  /** Reordering strategy */
  strategy?: GridStrategy;

  /** Function to extract unique keys from items */
  itemKeyExtractor?: (item: TData, index: number) => string;
}

/**
 * Return value from the useGridSortableList hook.
 *
 * @template TData - The type of data items in the grid
 */
export interface UseGridSortableListReturn<TData extends SortableData> {
  /** Shared value containing the position mapping for all items */
  positions: SharedValue<GridPositions>;

  /** Shared value tracking the current vertical scroll position */
  scrollY: SharedValue<number>;

  /** Shared value tracking the current horizontal scroll position */
  scrollX: SharedValue<number>;

  /** Shared value indicating the current auto-scroll direction */
  autoScrollDirection: SharedValue<GridScrollDirection>;

  /** Animated ref for the scroll view */
  scrollViewRef: any;

  /** Ref for the DropProvider context */
  dropProviderRef: React.RefObject<DropProviderRef>;

  /** Animated scroll handler */
  handleScroll: any;

  /** Handler for scroll end events */
  handleScrollEnd: () => void;

  /** Total width of the grid content */
  contentWidth: number;

  /** Total height of the grid content */
  contentHeight: number;

  /** Helper function to get props for each grid item */
  getItemProps: (
    item: TData,
    index: number
  ) => {
    id: string;
    positions: SharedValue<GridPositions>;
    scrollY: SharedValue<number>;
    scrollX: SharedValue<number>;
    autoScrollDirection: SharedValue<GridScrollDirection>;
    itemsCount: number;
    dimensions: GridDimensions;
    orientation: GridOrientation;
    strategy: GridStrategy;
  };
}

/**
 * Props for the SortableGridItem component.
 *
 * @template T - The type of data associated with the grid item
 */
export interface SortableGridItemProps<T> {
  /** Unique identifier for this grid item */
  id: string;

  /** Data associated with this grid item */
  data: T;

  /** Shared value containing positions of all items */
  positions: SharedValue<GridPositions>;

  /** Shared value tracking the current vertical scroll position */
  scrollY: SharedValue<number>;

  /** Shared value tracking the current horizontal scroll position */
  scrollX: SharedValue<number>;

  /** Shared value indicating the current auto-scroll direction */
  autoScrollDirection: SharedValue<GridScrollDirection>;

  /** Total number of items in the grid */
  itemsCount: number;

  /** Grid dimension configuration */
  dimensions: GridDimensions;

  /** Grid orientation */
  orientation: GridOrientation;

  /** Reordering strategy */
  strategy?: GridStrategy;

  /** Width of the scrollable container */
  containerWidth?: number;

  /** Height of the scrollable container */
  containerHeight?: number;

  /** Array of item IDs in the current order (for variable height support) */
  itemIds?: string[];

  /** Delay in ms before drag activates */
  activationDelay?: number;

  /** Child components to render inside the grid item */
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
  onDrop?: (
    id: string,
    position: number,
    allPositions?: GridPositions
  ) => void;

  /** Callback fired continuously during dragging */
  onDragging?: (
    id: string,
    overItemId: string | null,
    x: number,
    y: number
  ) => void;

  /** Whether this item is being removed */
  isBeingRemoved?: boolean;
}

/**
 * Props for the SortableGrid component.
 *
 * @template TData - The type of data items in the grid
 */
export interface SortableGridProps<TData extends SortableData> {
  /** Array of data items to render in the grid */
  data: TData[];

  /** Function to render each grid item */
  renderItem: (props: SortableGridRenderItemProps<TData>) => ReactNode;

  /** Grid dimension configuration */
  dimensions: GridDimensions;

  /** Grid orientation */
  orientation?: GridOrientation;

  /** Reordering strategy */
  strategy?: GridStrategy;

  /** Style to apply to the scroll view */
  style?: StyleProp<ViewStyle>;

  /** Style to apply to the scroll view content container */
  contentContainerStyle?: StyleProp<ViewStyle>;

  /** Style to apply to each item container */
  itemContainerStyle?: StyleProp<ViewStyle>;

  /** Function to extract unique keys from items */
  itemKeyExtractor?: (item: TData, index: number) => string;

  /** Whether scrolling is enabled */
  scrollEnabled?: boolean;
}

/**
 * Props passed to the renderItem function in SortableGrid.
 *
 * @template TData - The type of data item being rendered
 */
export interface SortableGridRenderItemProps<TData extends SortableData> {
  /** The data item being rendered */
  item: TData;

  /** Index of the item in the original data array */
  index: number;

  /** Unique identifier for this item */
  id: string;

  /** Shared value containing positions of all items */
  positions: SharedValue<GridPositions>;

  /** Shared value tracking the current vertical scroll position */
  scrollY: SharedValue<number>;

  /** Shared value tracking the current horizontal scroll position */
  scrollX: SharedValue<number>;

  /** Shared value indicating the current auto-scroll direction */
  autoScrollDirection: SharedValue<GridScrollDirection>;

  /** Total number of items in the grid */
  itemsCount: number;

  /** Grid dimension configuration */
  dimensions: GridDimensions;

  /** Grid orientation */
  orientation: GridOrientation;

  /** Reordering strategy */
  strategy: GridStrategy;

  /** Array of item IDs in the current order (for variable height support) */
  itemIds?: string[];
}
