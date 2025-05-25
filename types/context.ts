import { ReactNode } from "react";

/**
 * Alignment options for positioning dropped items within a droppable area.
 *
 * Controls where dropped items are positioned relative to the droppable's bounds.
 * Each alignment option places the item at a specific anchor point within the droppable.
 *
 * @example
 * ```typescript
 * // Center the dropped item (default behavior)
 * const centerAlignment: DropAlignment = 'center';
 *
 * // Place item at top-left corner
 * const topLeftAlignment: DropAlignment = 'top-left';
 *
 * // Place item at bottom edge, centered horizontally
 * const bottomCenterAlignment: DropAlignment = 'bottom-center';
 * ```
 *
 * @see {@link DropOffset} for additional positioning control
 * @see {@link UseDroppableOptions} for usage in droppables
 */
export type DropAlignment =
  | "center"
  | "top-left"
  | "top-center"
  | "top-right"
  | "center-left"
  | "center-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

/**
 * Pixel offset to apply after alignment positioning.
 *
 * Provides fine-grained control over the exact position where dropped items
 * are placed within a droppable area. Applied after the DropAlignment calculation.
 *
 * @example
 * ```typescript
 * // No offset (default)
 * const noOffset: DropOffset = { x: 0, y: 0 };
 *
 * // Move 10px right and 5px down from aligned position
 * const customOffset: DropOffset = { x: 10, y: 5 };
 *
 * // Move 20px left from aligned position
 * const leftOffset: DropOffset = { x: -20, y: 0 };
 * ```
 *
 * @see {@link DropAlignment} for base positioning
 * @see {@link UseDroppableOptions} for usage in droppables
 */
export interface DropOffset {
  /** Horizontal offset in pixels (positive = right, negative = left) */
  x: number;
  /** Vertical offset in pixels (positive = down, negative = up) */
  y: number;
}

/**
 * Mapping of draggable items to their drop locations and data.
 *
 * Tracks which draggable items have been dropped on which droppable areas,
 * along with the associated data payload.
 */
export interface DroppedItemsMap<TData = unknown> {
  [draggableId: string]: {
    droppableId: string;
    data: TData;
  };
}

/**
 * Configuration for a single drop slot/zone.
 *
 * Contains all the information needed to handle drop operations
 * for a specific droppable area.
 */
export interface DropSlot<TData = unknown> {
  /** Unique identifier for this drop slot */
  id: string;
  /** X position of the drop slot */
  x: number;
  /** Y position of the drop slot */
  y: number;
  /** Width of the drop slot */
  width: number;
  /** Height of the drop slot */
  height: number;
  /** Callback to handle dropped items */
  onDrop: (data: TData) => void;
  /** How to align dropped items within this slot */
  dropAlignment?: DropAlignment;
  /** Additional offset to apply after alignment */
  dropOffset?: DropOffset;
  /** Maximum number of items this slot can accept */
  capacity?: number;
}

/**
 * Listener function type for position update notifications.
 */
export type PositionUpdateListener = () => void;

/**
 * Context value interface for the drop/drag system.
 *
 * Provides methods for registering droppables, tracking dropped items,
 * and managing the overall drag-and-drop state.
 */
export interface SlotsContextValue<TData = unknown> {
  /** Register a new drop slot */
  register: (id: number, slot: DropSlot<TData>) => void;
  /** Unregister a drop slot */
  unregister: (id: number) => void;
  /** Get all registered drop slots */
  getSlots: () => Record<number, DropSlot<TData>>;
  /** Check if a slot is registered */
  isRegistered: (id: number) => boolean;
  /** Set the currently active hover slot */
  setActiveHoverSlot: (id: number | null) => void;
  /** ID of the currently active hover slot */
  activeHoverSlotId: number | null;
  /** Register a position update listener */
  registerPositionUpdateListener: (
    id: string,
    listener: PositionUpdateListener
  ) => void;
  /** Unregister a position update listener */
  unregisterPositionUpdateListener: (id: string) => void;
  /** Request a position update for all registered elements */
  requestPositionUpdate: () => void;
  /** Register a dropped item */
  registerDroppedItem: (
    draggableId: string,
    droppableId: string,
    itemData: any
  ) => void;
  /** Unregister a dropped item */
  unregisterDroppedItem: (draggableId: string) => void;
  /** Get all currently dropped items */
  getDroppedItems: () => DroppedItemsMap<any>;
  /** Check if a droppable has available capacity */
  hasAvailableCapacity: (droppableId: string) => boolean;
  /** Global callback for drag operations */
  onDragging?: (payload: {
    x: number;
    y: number;
    tx: number;
    ty: number;
    itemData: any;
  }) => void;
  /** Global callback for drag start */
  onDragStart?: (data: any) => void;
  /** Global callback for drag end */
  onDragEnd?: (data: any) => void;
}

/**
 * Props for the DropProvider component.
 */
export interface DropProviderProps {
  /** The child components that will have access to the drag-and-drop context */
  children: ReactNode;

  /**
   * Callback fired when layout updates are complete.
   * Useful for triggering additional UI updates after position recalculations.
   */
  onLayoutUpdateComplete?: () => void;

  /**
   * Callback fired when the dropped items mapping changes.
   * Provides access to the current state of which items are dropped where.
   *
   * @param droppedItems - Current mapping of draggable IDs to their drop locations
   */
  onDroppedItemsUpdate?: (droppedItems: DroppedItemsMap) => void;

  /**
   * Global callback fired during drag operations.
   * Receives position updates for all draggable items.
   *
   * @param payload - Position and data information for the dragging item
   */
  onDragging?: (payload: {
    x: number;
    y: number;
    tx: number;
    ty: number;
    itemData: any;
  }) => void;

  /**
   * Global callback fired when any drag operation starts.
   * @param data - The data associated with the draggable item
   */
  onDragStart?: (data: any) => void;

  /**
   * Global callback fired when any drag operation ends.
   * @param data - The data associated with the draggable item
   */
  onDragEnd?: (data: any) => void;
}

/**
 * Ref interface for the DropProvider component.
 *
 * Provides imperative methods for interacting with the drop provider.
 */
export interface DropProviderRef {
  /**
   * Manually trigger a position update for all registered droppables and draggables.
   * Useful after layout changes or when positions may have become stale.
   */
  requestPositionUpdate: () => void;

  /**
   * Get the current mapping of dropped items.
   * @returns Object mapping draggable IDs to their drop information
   */
  getDroppedItems: () => DroppedItemsMap;
}
