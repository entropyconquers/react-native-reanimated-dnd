import { ViewStyle, View, StyleProp } from "react-native";
import Animated, {
  AnimatedStyle,
  useAnimatedRef,
} from "react-native-reanimated";
import { GestureType } from "react-native-gesture-handler";
import { LayoutChangeEvent } from "react-native";

/**
 * Enum representing the different states a draggable item can be in.
 *
 * @example
 * ```typescript
 * import { DraggableState } from './types/draggable';
 *
 * const handleStateChange = (state: DraggableState) => {
 *   switch (state) {
 *     case DraggableState.IDLE:
 *       console.log('Item is at rest');
 *       break;
 *     case DraggableState.DRAGGING:
 *       console.log('Item is being dragged');
 *       break;
 *     case DraggableState.DROPPED:
 *       console.log('Item was successfully dropped');
 *       break;
 *   }
 * };
 * ```
 */
export enum DraggableState {
  /** Item is at rest in its original or dropped position */
  IDLE = "IDLE",
  /** Item is currently being dragged by the user */
  DRAGGING = "DRAGGING",
  /** Item has been successfully dropped on a valid drop zone */
  DROPPED = "DROPPED",
}

/**
 * Custom animation function type for controlling how draggable items animate.
 *
 * @param toValue - The target value to animate to
 * @returns The animated value (typically from withSpring, withTiming, etc.)
 *
 * @example
 * ```typescript
 * const customAnimation: AnimationFunction = (toValue) => {
 *   'worklet';
 *   return withTiming(toValue, { duration: 500, easing: Easing.bounce });
 * };
 * ```
 */
export type AnimationFunction = (toValue: number) => number;

/**
 * Collision detection algorithms for determining when a draggable overlaps with a droppable.
 *
 * - `center`: Collision detected when the center point of the draggable is over the droppable
 * - `intersect`: Collision detected when any part of the draggable overlaps with the droppable (default)
 * - `contain`: Collision detected when the entire draggable is contained within the droppable
 *
 * @example
 * ```typescript
 * // For precise dropping, use center collision
 * const preciseDraggable = useDraggable({
 *   data: myData,
 *   collisionAlgorithm: 'center'
 * });
 *
 * // For easy dropping, use intersect (default)
 * const easyDraggable = useDraggable({
 *   data: myData,
 *   collisionAlgorithm: 'intersect'
 * });
 *
 * // For strict containment, use contain
 * const strictDraggable = useDraggable({
 *   data: myData,
 *   collisionAlgorithm: 'contain'
 * });
 * ```
 */
export type CollisionAlgorithm = "center" | "intersect" | "contain";

/**
 * Configuration options for the useDraggable hook.
 *
 * @template TData - The type of data associated with the draggable item
 */
export interface UseDraggableOptions<TData = unknown> {
  /**
   * Data payload associated with this draggable item. This data is passed to drop handlers
   * when the item is successfully dropped.
   *
   * @example
   * ```typescript
   * const data = { id: '1', name: 'Task 1', priority: 'high' };
   * ```
   */
  data: TData;

  /**
   * Unique identifier for this draggable item. If not provided, one will be generated automatically.
   * Used for tracking dropped items and managing state.
   */
  draggableId?: string;

  /**
   * Whether dragging is disabled for this item. When true, the item cannot be dragged.
   * Useful for conditionally enabling/disabling drag functionality.
   *
   * @default false
   */
  dragDisabled?: boolean;

  /**
   * Delay in milliseconds before dragging starts.
   *
   * @default 0
   */
  preDragDelay?: number;

  /**
   * Callback fired when dragging starts.
   *
   * @param data - The data associated with the draggable item
   *
   * @example
   * ```typescript
   * const handleDragStart = (data) => {
   *   console.log('Started dragging:', data.name);
   *   setIsDragging(true);
   * };
   * ```
   */
  onDragStart?: (data: TData) => void;

  /**
   * Callback fired when dragging ends (regardless of whether it was dropped successfully).
   *
   * @param data - The data associated with the draggable item
   *
   * @example
   * ```typescript
   * const handleDragEnd = (data) => {
   *   console.log('Finished dragging:', data.name);
   *   setIsDragging(false);
   * };
   * ```
   */
  onDragEnd?: (data: TData) => void;

  /**
   * Callback fired continuously while dragging. Useful for real-time feedback.
   *
   * @param payload - Object containing position and translation information
   * @param payload.x - Original X position of the item
   * @param payload.y - Original Y position of the item
   * @param payload.tx - Current X translation from original position
   * @param payload.ty - Current Y translation from original position
   * @param payload.itemData - The data associated with the draggable item
   *
   * @example
   * ```typescript
   * const handleDragging = ({ x, y, tx, ty, itemData }) => {
   *   const currentX = x + tx;
   *   const currentY = y + ty;
   *   console.log(`${itemData.name} is at (${currentX}, ${currentY})`);
   * };
   * ```
   */
  onDragging?: (payload: {
    x: number;
    y: number;
    tx: number;
    ty: number;
    itemData: TData;
  }) => void;

  /**
   * Callback fired when the draggable state changes.
   *
   * @param state - The new state of the draggable item
   *
   * @example
   * ```typescript
   * const handleStateChange = (state) => {
   *   if (state === DraggableState.DROPPED) {
   *     showSuccessMessage();
   *   }
   * };
   * ```
   */
  onStateChange?: (state: DraggableState) => void;

  /**
   * Custom animation function for controlling how the item animates when dropped.
   * If not provided, uses default spring animation.
   *
   * @example
   * ```typescript
   * const bounceAnimation = (toValue) => {
   *   'worklet';
   *   return withTiming(toValue, {
   *     duration: 600,
   *     easing: Easing.bounce
   *   });
   * };
   * ```
   */
  animationFunction?: AnimationFunction;

  /**
   * Reference to a View that defines the dragging boundaries. The draggable item
   * will be constrained within this view's bounds.
   *
   * @example
   * ```typescript
   * const boundsRef = useRef<View>(null);
   *
   * return (
   *   <View ref={boundsRef} style={styles.container}>
   *     <Draggable dragBoundsRef={boundsRef} data={data}>
   *       <Text>Bounded draggable</Text>
   *     </Draggable>
   *   </View>
   * );
   * ```
   */
  dragBoundsRef?: React.RefObject<Animated.View | View>;

  /**
   * Constrains dragging to a specific axis.
   *
   * - `x`: Only horizontal movement allowed
   * - `y`: Only vertical movement allowed
   * - `both`: Movement in both directions (default)
   *
   * @default "both"
   *
   * @example
   * ```typescript
   * // Horizontal slider
   * const horizontalDraggable = useDraggable({
   *   data: sliderData,
   *   dragAxis: 'x'
   * });
   *
   * // Vertical slider
   * const verticalDraggable = useDraggable({
   *   data: sliderData,
   *   dragAxis: 'y'
   * });
   * ```
   */
  dragAxis?: "x" | "y" | "both";

  /**
   * Algorithm used for collision detection with drop zones.
   *
   * @default "intersect"
   *
   * @see {@link CollisionAlgorithm} for detailed explanation of each algorithm
   */
  collisionAlgorithm?: CollisionAlgorithm;

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
 * Return value from the useDraggable hook.
 */
export interface UseDraggableReturn {
  /**
   * Props to spread on the animated view that will be draggable.
   * Contains the animated style and layout handler.
   */
  animatedViewProps: {
    /** Animated style containing transform values for dragging */
    style: AnimatedStyle<ViewStyle>;
    /** Layout change handler for position updates */
    onLayout: (event: LayoutChangeEvent) => void;
  };

  /**
   * Gesture object to attach to GestureDetector for handling drag interactions.
   * Only used when no handle is present (entire component is draggable).
   */
  gesture: GestureType;

  /**
   * Current state of the draggable item.
   * @see {@link DraggableState}
   */
  state: DraggableState;

  /**
   * Animated ref for the draggable view. Used internally for measurements.
   */
  animatedViewRef: ReturnType<typeof useAnimatedRef<Animated.View>>;

  /**
   * Whether this draggable has a handle component. When true, only the handle
   * can initiate dragging. When false, the entire component is draggable.
   */
  hasHandle: boolean;
}

export interface DraggableContextValue {
  gesture: any;
  state: DraggableState;
}

/**
 * Props for the Draggable component.
 *
 * @template TData - The type of data associated with the draggable item
 */
export interface DraggableProps<TData = unknown>
  extends UseDraggableOptions<TData> {
  /** Style to apply to the draggable container */
  style?: StyleProp<ViewStyle>;
  /** The content to render inside the draggable */
  children: React.ReactNode;
  /** Callback fired when the draggable state changes */
  onStateChange?: (state: DraggableState) => void;
}

/**
 * Props for the Handle component.
 */
export interface DraggableHandleProps {
  /** The content to render inside the handle */
  children: React.ReactNode;
  /** Optional style to apply to the handle */
  style?: StyleProp<ViewStyle>;
}
