// Define DropAlignment and DropOffset types here

import { ReactNode } from "react";

import { createContext } from "react";

/**
 * Alignment options for positioning dropped items within a droppable area.
 *
 * Determines where within the droppable bounds the draggable item will be positioned
 * when successfully dropped. Can be combined with DropOffset for fine-tuning.
 *
 * @example
 * ```typescript
 * // Center the dropped item (default)
 * const centerAlignment: DropAlignment = 'center';
 *
 * // Position at top-left corner
 * const topLeftAlignment: DropAlignment = 'top-left';
 *
 * // Position at bottom edge, centered horizontally
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

// Define type for the draggable-to-droppable mapping
export interface DroppedItemsMap<TData = unknown> {
  [draggableId: string]: {
    droppableId: string;
    data: TData;
  };
}

// Interface for a single drop slot
export interface DropSlot<TData = unknown> {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  onDrop: (data: TData) => void;
  dropAlignment?: DropAlignment;
  dropOffset?: DropOffset;
  capacity?: number;
}

// Listener type for position updates
export type PositionUpdateListener = () => void;

// Interface for the context value
export interface SlotsContextValue<TData = unknown> {
  register: (id: number, slot: DropSlot<TData>) => void;
  unregister: (id: number) => void;
  getSlots: () => Record<number, DropSlot<TData>>;
  isRegistered: (id: number) => boolean;
  setActiveHoverSlot: (id: number | null) => void;
  activeHoverSlotId: number | null;
  registerPositionUpdateListener: (
    id: string,
    listener: PositionUpdateListener
  ) => void;
  unregisterPositionUpdateListener: (id: string) => void;
  requestPositionUpdate: () => void;

  // Update method signatures to use string IDs for droppables
  registerDroppedItem: (
    draggableId: string,
    droppableId: string,
    itemData: any
  ) => void;
  unregisterDroppedItem: (draggableId: string) => void;
  getDroppedItems: () => DroppedItemsMap<any>;

  // Add new method to check if a droppable has available capacity
  hasAvailableCapacity: (droppableId: string) => boolean;

  // Add onDragging callback
  onDragging?: (payload: {
    x: number;
    y: number;
    tx: number;
    ty: number;
    itemData: any;
  }) => void;

  // Add onDragStart and onDragEnd callbacks
  onDragStart?: (data: any) => void;
  onDragEnd?: (data: any) => void;
}

// Default context value using 'any' for broad compatibility
const defaultSlotsContextValue: SlotsContextValue<any> = {
  register: (_id: number, _slot: DropSlot<any>) => {
    if (process.env.NODE_ENV !== "production") {
      console.warn("SlotsContext: register called without a Provider.");
    }
  },
  unregister: (_id: number) => {
    if (process.env.NODE_ENV !== "production") {
      console.warn("SlotsContext: unregister called without a Provider.");
    }
  },
  getSlots: () => {
    if (process.env.NODE_ENV !== "production") {
      console.warn("SlotsContext: getSlots called without a Provider.");
    }
    return {} as Record<number, DropSlot<any>>;
  },
  isRegistered: (_id: number) => {
    if (process.env.NODE_ENV !== "production") {
      console.warn("SlotsContext: isRegistered called without a Provider.");
    }
    return false;
  },
  setActiveHoverSlot: (_id: number | null) => {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        "SlotsContext: setActiveHoverSlot called without a Provider."
      );
    }
  },
  activeHoverSlotId: null,
  registerPositionUpdateListener: (
    _id: string,
    _listener: PositionUpdateListener
  ) => {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        "SlotsContext: registerPositionUpdateListener called without a Provider."
      );
    }
  },
  unregisterPositionUpdateListener: (_id: string) => {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        "SlotsContext: unregisterPositionUpdateListener called without a Provider."
      );
    }
  },
  requestPositionUpdate: () => {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        "SlotsContext: requestPositionUpdate called without a Provider (internally)."
      );
    }
  },
  // Update default implementations
  registerDroppedItem: (
    _draggableId: string,
    _droppableId: string,
    _itemData: any
  ) => {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        "SlotsContext: registerDroppedItem called without a Provider."
      );
    }
  },
  unregisterDroppedItem: (_draggableId: string) => {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        "SlotsContext: unregisterDroppedItem called without a Provider."
      );
    }
  },
  getDroppedItems: () => {
    if (process.env.NODE_ENV !== "production") {
      console.warn("SlotsContext: getDroppedItems called without a Provider.");
    }
    return {} as DroppedItemsMap<any>;
  },
  hasAvailableCapacity: (_droppableId: string) => {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        "SlotsContext: hasAvailableCapacity called without a Provider."
      );
    }
    return false;
  },
  onDragging: (payload: {
    x: number;
    y: number;
    tx: number;
    ty: number;
    itemData: any;
  }) => {
    if (process.env.NODE_ENV !== "production") {
      console.warn("SlotsContext: onDragging called without a Provider.");
    }
  },
  onDragStart: undefined,
  onDragEnd: undefined,
};

// Create the context
export const SlotsContext = createContext<SlotsContextValue<any>>(
  defaultSlotsContextValue
);

// Props for the DropProvider
/**
 * Props for the DropProvider component.
 *
 * @see {@link DropProvider} for component usage
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

// Type for the imperative handle exposed by DropProvider
/**
 * Imperative handle interface for the DropProvider component.
 * Provides methods that can be called on the DropProvider ref.
 *
 * @example
 * ```typescript
 * const dropProviderRef = useRef<DropProviderRef>(null);
 *
 * // Trigger position update
 * dropProviderRef.current?.requestPositionUpdate();
 *
 * // Get current dropped items
 * const droppedItems = dropProviderRef.current?.getDroppedItems();
 * ```
 *
 * @see {@link DropProvider} for component usage
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
