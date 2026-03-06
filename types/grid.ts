import { StyleProp, ViewStyle } from "react-native";
import { ReactNode } from "react";
import { SharedValue } from "react-native-reanimated";
import { SortableData } from "./sortable";
import { DropProviderRef } from "./context";

/**
 * Direction for grid scrolling
 */
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

/**
 * Grid orientation
 */
export enum GridOrientation {
  Vertical = "vertical", // Fixed columns, variable rows
  Horizontal = "horizontal", // Fixed rows, variable columns
}

/**
 * Reordering strategy for grid items
 */
export enum GridStrategy {
  Insert = "insert", // Shift items between dragged and target
  Swap = "swap", // Direct position exchange
}

/**
 * Position information for a grid item
 */
export interface GridPosition {
  /** Linear index in the grid (0, 1, 2, ...) */
  index: number;
  /** Row number (0-indexed) */
  row: number;
  /** Column number (0-indexed) */
  column: number;
  /** X coordinate in pixels */
  x: number;
  /** Y coordinate in pixels */
  y: number;
}

/**
 * Shared value structure for grid positions
 */
export interface GridPositions {
  [id: string]: GridPosition;
}

/**
 * Configuration for grid dimensions
 */
export interface GridDimensions {
  /** Number of columns (for vertical grids) */
  columns?: number;
  /** Number of rows (for horizontal grids) */
  rows?: number;
  /** Width of each item */
  itemWidth: number;
  /** Height of each item */
  itemHeight: number;
  /** Gap between rows */
  rowGap?: number;
  /** Gap between columns */
  columnGap?: number;
}

/**
 * Configuration options for the useGridSortable hook
 */
export interface UseGridSortableOptions<T> {
  /** Unique identifier for this grid item */
  id: string;

  /** Shared value containing grid positions of all items */
  positions: SharedValue<GridPositions>;

  /** Shared value for vertical scroll position */
  scrollY: SharedValue<number>;

  /** Shared value for horizontal scroll position */
  scrollX: SharedValue<number>;

  /** Shared value for auto-scroll direction */
  autoScrollDirection: SharedValue<GridScrollDirection>;

  /** Total number of items in the grid */
  itemsCount: number;

  /** Grid dimensions configuration */
  dimensions: GridDimensions;

  /** Grid orientation */
  orientation: GridOrientation;

  /** Reordering strategy */
  strategy?: GridStrategy;

  /** Container width (for auto-scroll) */
  containerWidth?: number;

  /** Container height (for auto-scroll) */
  containerHeight?: number;

  /** Activation delay in milliseconds before drag starts */
  activationDelay?: number;

  /** Callback when item position changes */
  onMove?: (id: string, from: number, to: number) => void;

  /** Callback when dragging starts */
  onDragStart?: (id: string, position: number) => void;

  /** Callback when dragging ends */
  onDrop?: (id: string, position: number, allPositions?: GridPositions) => void;

  /** Callback during dragging */
  onDragging?: (
    id: string,
    overItemId: string | null,
    x: number,
    y: number
  ) => void;

  /** Children for handle detection */
  children?: React.ReactNode;

  /** Handle component type */
  handleComponent?: React.ComponentType<any>;

  /** Whether the item is being removed and should animate out */
  isBeingRemoved?: boolean;
}

/**
 * Return value from useGridSortable hook
 */
export interface UseGridSortableReturn {
  /** Animated style for the grid item */
  animatedStyle: StyleProp<ViewStyle>;

  /** Pan gesture handler */
  panGestureHandler: any;

  /** Whether item is being dragged */
  isMoving: boolean;

  /** Whether item has a handle */
  hasHandle: boolean;
}

/**
 * Configuration options for useGridSortableList hook
 */
export interface UseGridSortableListOptions<TData extends SortableData> {
  /** Array of data items */
  data: TData[];

  /** Grid dimensions */
  dimensions: GridDimensions;

  /** Grid orientation */
  orientation?: GridOrientation;

  /** Reordering strategy */
  strategy?: GridStrategy;

  /** Key extractor function */
  itemKeyExtractor?: (item: TData, index: number) => string;
}

/**
 * Return value from useGridSortableList hook
 */
export interface UseGridSortableListReturn<TData extends SortableData> {
  /** Shared value containing grid positions */
  positions: SharedValue<GridPositions>;

  /** Shared value for vertical scroll */
  scrollY: SharedValue<number>;

  /** Shared value for horizontal scroll */
  scrollX: SharedValue<number>;

  /** Shared value for auto-scroll direction */
  autoScrollDirection: SharedValue<GridScrollDirection>;

  /** Animated ref for scroll view */
  scrollViewRef: any;

  /** Ref for drop provider */
  dropProviderRef: React.RefObject<DropProviderRef>;

  /** Scroll handler */
  handleScroll: any;

  /** Scroll end handler */
  handleScrollEnd: () => void;

  /** Total content width */
  contentWidth: number;

  /** Total content height */
  contentHeight: number;

  /** Helper to get props for grid items */
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
 * Props for SortableGridItem component
 */
export interface SortableGridItemProps<T> {
  /** Unique identifier */
  id: string;

  /** Item data */
  data: T;

  /** Grid positions */
  positions: SharedValue<GridPositions>;

  /** Vertical scroll position */
  scrollY: SharedValue<number>;

  /** Horizontal scroll position */
  scrollX: SharedValue<number>;

  /** Auto-scroll direction */
  autoScrollDirection: SharedValue<GridScrollDirection>;

  /** Total items count */
  itemsCount: number;

  /** Grid dimensions */
  dimensions: GridDimensions;

  /** Grid orientation */
  orientation: GridOrientation;

  /** Reordering strategy */
  strategy?: GridStrategy;

  /** Container width */
  containerWidth?: number;

  /** Container height */
  containerHeight?: number;

  /** Activation delay in milliseconds before drag starts */
  activationDelay?: number;

  /** Children to render */
  children: ReactNode;

  /** Container style */
  style?: StyleProp<ViewStyle>;

  /** Additional animated style */
  animatedStyle?: StyleProp<ViewStyle>;

  /** Position change callback */
  onMove?: (id: string, from: number, to: number) => void;

  /** Drag start callback */
  onDragStart?: (id: string, position: number) => void;

  /** Drag end callback */
  onDrop?: (id: string, position: number, allPositions?: GridPositions) => void;

  /** Dragging callback */
  onDragging?: (
    id: string,
    overItemId: string | null,
    x: number,
    y: number
  ) => void;

  /** Whether the item is being removed and should animate out */
  isBeingRemoved?: boolean;
}

/**
 * Props for SortableGrid component
 */
export interface SortableGridProps<TData extends SortableData> {
  /** Array of data items */
  data: TData[];

  /** Render function for each item */
  renderItem: (props: SortableGridRenderItemProps<TData>) => ReactNode;

  /** Grid dimensions */
  dimensions: GridDimensions;

  /** Grid orientation */
  orientation?: GridOrientation;

  /** Reordering strategy */
  strategy?: GridStrategy;

  /** Scroll view style */
  style?: StyleProp<ViewStyle>;

  /** Content container style */
  contentContainerStyle?: StyleProp<ViewStyle>;

  /** Item container style */
  itemContainerStyle?: StyleProp<ViewStyle>;

  /** Key extractor */
  itemKeyExtractor?: (item: TData, index: number) => string;

  /** Enable virtualization */
  virtualized?: boolean;

  /** Window size for virtualization */
  windowSize?: number;
}

/**
 * Props passed to renderItem in SortableGrid
 */
export interface SortableGridRenderItemProps<TData extends SortableData> {
  /** Item data */
  item: TData;

  /** Item index */
  index: number;

  /** Item ID */
  id: string;

  /** Grid positions */
  positions: SharedValue<GridPositions>;

  /** Vertical scroll */
  scrollY: SharedValue<number>;

  /** Horizontal scroll */
  scrollX: SharedValue<number>;

  /** Auto-scroll direction */
  autoScrollDirection: SharedValue<GridScrollDirection>;

  /** Total items */
  itemsCount: number;

  /** Grid dimensions */
  dimensions: GridDimensions;

  /** Grid orientation */
  orientation: GridOrientation;

  /** Reordering strategy */
  strategy: GridStrategy;
}
