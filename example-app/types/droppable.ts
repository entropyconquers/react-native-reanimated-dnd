import { LayoutChangeEvent, StyleProp, ViewStyle } from "react-native";
import Animated, { useAnimatedRef } from "react-native-reanimated";
import { DropAlignment, DropOffset } from "./context";

/**
 * Configuration options for the useDroppable hook.
 *
 * @template TData - The type of data that can be dropped on this droppable
 */
export interface UseDroppableOptions<TData = unknown> {
  /**
   * Callback function fired when an item is successfully dropped on this droppable.
   * This is where you handle the drop logic for your application.
   *
   * @param data - The data from the draggable item that was dropped
   *
   * @example
   * ```typescript
   * const handleDrop = (data: TaskData) => {
   *   console.log('Task dropped:', data.name);
   *   moveTaskToColumn(data.id, 'completed');
   *   showNotification(`${data.name} completed!`);
   * };
   * ```
   */
  onDrop: (data: TData) => void;

  /**
   * Whether this droppable is disabled. When true, items cannot be dropped here.
   * Useful for conditionally enabling/disabling drop functionality.
   *
   * @default false
   *
   * @example
   * ```typescript
   * const isDisabled = user.role !== 'admin';
   *
   * const { viewProps } = useDroppable({
   *   onDrop: handleDrop,
   *   dropDisabled: isDisabled
   * });
   * ```
   */
  dropDisabled?: boolean;

  /**
   * Callback fired when the active state of this droppable changes.
   * Active state indicates whether a draggable item is currently hovering over this droppable.
   *
   * @param isActive - Whether a draggable is currently hovering over this droppable
   *
   * @example
   * ```typescript
   * const handleActiveChange = (isActive: boolean) => {
   *   if (isActive) {
   *     playHoverSound();
   *     setHighlighted(true);
   *   } else {
   *     setHighlighted(false);
   *   }
   * };
   * ```
   */
  onActiveChange?: (isActive: boolean) => void;

  /**
   * How dropped items should be aligned within this droppable area.
   *
   * Available alignments:
   * - `center`: Center the item within the droppable (default)
   * - `top-left`: Align to top-left corner
   * - `top-center`: Align to top edge, centered horizontally
   * - `top-right`: Align to top-right corner
   * - `center-left`: Align to left edge, centered vertically
   * - `center-right`: Align to right edge, centered vertically
   * - `bottom-left`: Align to bottom-left corner
   * - `bottom-center`: Align to bottom edge, centered horizontally
   * - `bottom-right`: Align to bottom-right corner
   *
   * @default "center"
   *
   * @example
   * ```typescript
   * // Items dropped here will snap to the top-left corner
   * const { viewProps } = useDroppable({
   *   onDrop: handleDrop,
   *   dropAlignment: 'top-left'
   * });
   * ```
   */
  dropAlignment?: DropAlignment;

  /**
   * Additional pixel offset to apply after alignment.
   * Useful for fine-tuning the exact position where items are dropped.
   *
   * @example
   * ```typescript
   * // Drop items 10px to the right and 5px down from the center
   * const { viewProps } = useDroppable({
   *   onDrop: handleDrop,
   *   dropAlignment: 'center',
   *   dropOffset: { x: 10, y: 5 }
   * });
   * ```
   */
  dropOffset?: DropOffset;

  /**
   * Style to apply when a draggable item is hovering over this droppable.
   * This provides visual feedback to users about valid drop targets.
   *
   * @example
   * ```typescript
   * const activeStyle = {
   *   backgroundColor: 'rgba(0, 255, 0, 0.2)',
   *   borderColor: '#00ff00',
   *   borderWidth: 2,
   *   transform: [{ scale: 1.05 }]
   * };
   *
   * const { viewProps } = useDroppable({
   *   onDrop: handleDrop,
   *   activeStyle
   * });
   * ```
   */
  activeStyle?: StyleProp<ViewStyle>;

  /**
   * Unique identifier for this droppable. If not provided, one will be generated automatically.
   * Used for tracking which droppable items are dropped on.
   *
   * @example
   * ```typescript
   * const { viewProps } = useDroppable({
   *   droppableId: 'todo-column',
   *   onDrop: handleDrop
   * });
   * ```
   */
  droppableId?: string;

  /**
   * Maximum number of items that can be dropped on this droppable.
   * When capacity is reached, additional items cannot be dropped here.
   *
   * @default 1
   *
   * @example
   * ```typescript
   * // Allow up to 5 items in this drop zone
   * const { viewProps } = useDroppable({
   *   onDrop: handleDrop,
   *   capacity: 5
   * });
   *
   * // Unlimited capacity
   * const { viewProps } = useDroppable({
   *   onDrop: handleDrop,
   *   capacity: Infinity
   * });
   * ```
   */
  capacity?: number;
}

/**
 * Return value from the useDroppable hook.
 */
export interface UseDroppableReturn {
  /**
   * Props to spread on the view that will act as a drop zone.
   * Contains layout handler and conditional active styling.
   */
  viewProps: {
    /** Layout change handler for position tracking */
    onLayout: (event: LayoutChangeEvent) => void;
    /** Style applied when active (draggable hovering) */
    style?: StyleProp<ViewStyle>;
  };

  /**
   * Whether a draggable item is currently hovering over this droppable.
   * Useful for conditional rendering or additional visual feedback.
   */
  isActive: boolean;

  /**
   * The active style that was passed in options. Useful for external styling logic.
   */
  activeStyle?: StyleProp<ViewStyle>;

  /**
   * Animated ref for the droppable view. Used internally for measurements.
   */
  animatedViewRef: ReturnType<typeof useAnimatedRef<Animated.View>>;
}

/**
 * Props for the Droppable component.
 *
 * @template TData - The type of data that can be dropped on this droppable
 */
export interface DroppableProps<TData = unknown>
  extends UseDroppableOptions<TData> {
  /** Style to apply to the droppable container */
  style?: StyleProp<ViewStyle>;
  /** The content to render inside the droppable */
  children: React.ReactNode;
}
