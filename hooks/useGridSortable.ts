import { useCallback, useState, useRef } from "react";
import { StyleProp, ViewStyle } from "react-native";
import {
  SharedValue,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { Gesture, GestureType } from "react-native-gesture-handler";
import { scheduleOnRN } from "react-native-worklets";
import {
  GridScrollDirection,
  GridPositions,
  GridDimensions,
  GridOrientation,
  GridStrategy,
  UseGridSortableOptions,
  UseGridSortableReturn,
} from "../types/grid";
import {
  setGridPosition,
  setGridAutoScroll,
  calculateGridContentDimensions,
} from "../utils/gridCalculations";

/**
 * A hook for creating sortable grid items with drag-and-drop reordering capabilities.
 *
 * This hook provides the core functionality for individual items within a sortable grid,
 * handling drag gestures, position animations, auto-scrolling, and reordering logic.
 * It works in conjunction with useGridSortableList to provide a complete sortable grid solution.
 *
 * @template T - The type of data associated with the sortable grid item
 * @param options - Configuration options for the sortable grid item behavior
 * @returns Object containing animated styles, gesture handlers, and state for the grid item
 */
export function useGridSortable<T>(
  options: UseGridSortableOptions<T>
): UseGridSortableReturn {
  const {
    id,
    positions,
    scrollY,
    scrollX,
    autoScrollDirection,
    itemsCount,
    dimensions,
    orientation,
    strategy = GridStrategy.Insert,
    containerWidth = 500,
    containerHeight = 500,
    activationDelay,
    onMove,
    onDragStart,
    onDrop,
    onDragging,
    isBeingRemoved = false,
  } = options;

  const [isMoving, setIsMoving] = useState(false);
  const [hasHandle, setHasHandle] = useState(false);

  const registerHandle = useCallback((registered: boolean) => {
    setHasHandle(registered);
  }, []);

  const movingSV = useSharedValue(false);
  const currentOverItemId = useSharedValue<string | null>(null);
  const onDraggingLastCallTimestamp = useSharedValue(0);
  const THROTTLE_INTERVAL = 50;

  const initialPositionRef = useRef<{ x: number; y: number } | null>(null);
  if (initialPositionRef.current === null) {
    const posArr = positions.get();
    const pos = posArr?.[id];
    initialPositionRef.current = pos ? { x: pos.x, y: pos.y } : { x: 0, y: 0 };
  }
  const initialPosition = initialPositionRef.current;

  const positionX = useSharedValue(initialPosition.x);
  const positionY = useSharedValue(initialPosition.y);
  const topValue = useSharedValue(initialPosition.y);
  const leftValue = useSharedValue(initialPosition.x);

  const targetScrollY = useSharedValue(0);
  const targetScrollX = useSharedValue(0);

  // Context shared values (replaces gesture handler context object)
  const initialItemContentX = useSharedValue(0);
  const initialItemContentY = useSharedValue(0);
  const initialFingerAbsoluteX = useSharedValue(0);
  const initialFingerAbsoluteY = useSharedValue(0);
  const initialScrollY = useSharedValue(0);
  const initialScrollX = useSharedValue(0);

  const calculatedContainerHeight = useRef(containerHeight).current;
  const calculatedContainerWidth = useRef(containerWidth).current;

  // React to position changes during drag (hit detection, reordering)
  useAnimatedReaction(
    () => ({ x: positionX.value, y: positionY.value }),
    (current, previous) => {
      if (!movingSV.value) {
        return;
      }

      if (
        previous !== null &&
        current.x === previous.x &&
        current.y === previous.y
      ) {
        return;
      }

      // Calculate target cell for hit detection
      const { itemWidth, itemHeight, columnGap = 0, rowGap = 0, columns = 3 } = dimensions;
      const clampedColumn = Math.min(
        Math.max(0, Math.round(current.x / (itemWidth + columnGap))),
        (orientation === GridOrientation.Vertical ? columns : Infinity) - 1
      );
      const clampedRow = Math.floor(current.y / (itemHeight + rowGap));
      let targetIndex: number;
      if (orientation === GridOrientation.Vertical) {
        targetIndex = clampedRow * columns + clampedColumn;
      } else {
        const rows = dimensions.rows ?? 3;
        targetIndex = clampedColumn * rows + clampedRow;
      }
      targetIndex = Math.max(0, Math.min(targetIndex, itemsCount - 1));

      // Determine overItemId
      let newOverItemId: string | null = null;
      const positionsValue = positions.value;
      for (const itemId in positionsValue) {
        if (positionsValue[itemId].index === targetIndex && itemId !== id) {
          newOverItemId = itemId;
          break;
        }
      }

      if (currentOverItemId.value !== newOverItemId) {
        currentOverItemId.value = newOverItemId;
      }

      if (onDragging) {
        const now = Date.now();
        if (now - onDraggingLastCallTimestamp.value > THROTTLE_INTERVAL) {
          scheduleOnRN(
            onDragging,
            id,
            newOverItemId,
            Math.round(current.x),
            Math.round(current.y)
          );
          onDraggingLastCallTimestamp.value = now;
        }
      }

      // Update visual position and logical positions
      topValue.value = current.y;
      leftValue.value = current.x;
      setGridPosition(
        current.x,
        current.y,
        scrollX.value,
        scrollY.value,
        itemsCount,
        positions,
        id,
        dimensions,
        orientation,
        strategy
      );
      setGridAutoScroll(
        current.x,
        current.y,
        scrollX.value,
        scrollY.value,
        calculatedContainerWidth,
        calculatedContainerHeight,
        dimensions.itemHeight,
        autoScrollDirection
      );
    },
    [
      movingSV,
      dimensions,
      itemsCount,
      positions,
      id,
      orientation,
      strategy,
      onDragging,
      scrollX,
      scrollY,
      autoScrollDirection,
      currentOverItemId,
      topValue,
      leftValue,
      onDraggingLastCallTimestamp,
    ]
  );

  // React to position changes from other items (animate to new slot)
  useAnimatedReaction(
    () => positions.value[id],
    (currentPosition, previousPosition) => {
      if (
        currentPosition !== null &&
        currentPosition !== undefined &&
        previousPosition !== null &&
        previousPosition !== undefined
      ) {
        if (
          currentPosition.x !== previousPosition.x ||
          currentPosition.y !== previousPosition.y
        ) {
          if (!movingSV.value) {
            topValue.value = withSpring(currentPosition.y);
            leftValue.value = withSpring(currentPosition.x);
            if (onMove) {
              scheduleOnRN(onMove, id, previousPosition.index, currentPosition.index);
            }
          }
        }
      }
    },
    [movingSV]
  );

  // React to auto-scroll direction changes
  useAnimatedReaction(
    () => autoScrollDirection.value,
    (scrollDirection, previousValue) => {
      if (
        scrollDirection !== null &&
        previousValue !== null &&
        scrollDirection !== previousValue
      ) {
        const { width: contentWidth, height: contentHeight } =
          calculateGridContentDimensions(itemsCount, dimensions, orientation);

        const maxScrollY = Math.max(0, contentHeight - calculatedContainerHeight);
        const maxScrollX = Math.max(0, contentWidth - calculatedContainerWidth);

        const hasUp =
          scrollDirection === GridScrollDirection.Up ||
          scrollDirection === GridScrollDirection.UpLeft ||
          scrollDirection === GridScrollDirection.UpRight;
        const hasDown =
          scrollDirection === GridScrollDirection.Down ||
          scrollDirection === GridScrollDirection.DownLeft ||
          scrollDirection === GridScrollDirection.DownRight;
        const hasLeft =
          scrollDirection === GridScrollDirection.Left ||
          scrollDirection === GridScrollDirection.UpLeft ||
          scrollDirection === GridScrollDirection.DownLeft;
        const hasRight =
          scrollDirection === GridScrollDirection.Right ||
          scrollDirection === GridScrollDirection.UpRight ||
          scrollDirection === GridScrollDirection.DownRight;

        if (hasUp) {
          targetScrollY.value = scrollY.value;
          targetScrollY.value = withTiming(0, { duration: 1500 });
        } else if (hasDown) {
          targetScrollY.value = scrollY.value;
          targetScrollY.value = withTiming(maxScrollY, { duration: 1500 });
        } else {
          targetScrollY.value = scrollY.value;
        }

        if (hasLeft) {
          targetScrollX.value = scrollX.value;
          targetScrollX.value = withTiming(0, { duration: 1500 });
        } else if (hasRight) {
          targetScrollX.value = scrollX.value;
          targetScrollX.value = withTiming(maxScrollX, { duration: 1500 });
        } else {
          targetScrollX.value = scrollX.value;
        }

        if (scrollDirection === GridScrollDirection.None) {
          targetScrollY.value = scrollY.value;
          targetScrollX.value = scrollX.value;
        }
      }
    }
  );

  // Sync target scroll values back to scroll shared values
  useAnimatedReaction(
    () => ({ y: targetScrollY.value, x: targetScrollX.value }),
    (target, previous) => {
      if (previous === null) return;
      if (movingSV.value) {
        if (target.y !== previous.y) {
          scrollY.value = target.y;
        }
        if (target.x !== previous.x) {
          scrollX.value = target.x;
        }
      }
    },
    [movingSV]
  );

  const createPanGesture = () =>
    Gesture.Pan()
      .activateAfterLongPress(activationDelay ?? 200)
      .shouldCancelWhenOutside(false)
      .onStart((event) => {
        "worklet";
        const currentPos = positions.value[id];
        if (!currentPos) return;

        initialItemContentX.value = currentPos.x;
        initialItemContentY.value = currentPos.y;
        initialFingerAbsoluteX.value = event.absoluteX;
        initialFingerAbsoluteY.value = event.absoluteY;
        initialScrollY.value = scrollY.value;
        initialScrollX.value = scrollX.value;

        positionX.value = initialItemContentX.value;
        positionY.value = initialItemContentY.value;
        movingSV.value = true;
        scheduleOnRN(setIsMoving, true);

        if (onDragStart) {
          scheduleOnRN(onDragStart, id, currentPos.index);
        }
      })
      .onUpdate((event) => {
        "worklet";
        const fingerDxScreen = event.absoluteX - initialFingerAbsoluteX.value;
        const fingerDyScreen = event.absoluteY - initialFingerAbsoluteY.value;
        const scrollDeltaY = scrollY.value - initialScrollY.value;
        const scrollDeltaX = scrollX.value - initialScrollX.value;

        positionX.value =
          initialItemContentX.value + fingerDxScreen + scrollDeltaX;
        positionY.value =
          initialItemContentY.value + fingerDyScreen + scrollDeltaY;
      })
      .onFinalize(() => {
        "worklet";
        const finishPos = positions.value[id];
        if (finishPos) {
          topValue.value = withTiming(finishPos.y);
          leftValue.value = withTiming(finishPos.x);
        }

        movingSV.value = false;
        scheduleOnRN(setIsMoving, false);

        autoScrollDirection.value = GridScrollDirection.None;

        if (onDrop && finishPos) {
          const positionsCopy = { ...positions.value };
          scheduleOnRN(onDrop, id, finishPos.index, positionsCopy);
        }

        currentOverItemId.value = null;
      });

  // Main gesture for full-item dragging — disabled when a handle is registered
  const panGestureHandler: GestureType = createPanGesture().enabled(!hasHandle);

  // Separate gesture for handle-only dragging (avoids sharing a gesture
  // object between two GestureDetectors and the handlerTag mutation warning)
  const handlePanGestureHandler: GestureType = createPanGesture();

  const animatedStyle = useAnimatedStyle(() => {
    "worklet";

    if (isBeingRemoved) {
      return {
        position: "absolute",
        top: topValue.value,
        left: leftValue.value,
        width: dimensions.itemWidth,
        height: dimensions.itemHeight,
        zIndex: 0,
        opacity: withTiming(0, { duration: 250 }),
        transform: [{ scale: withTiming(0.5, { duration: 250 }) }],
      };
    }

    return {
      position: "absolute",
      top: topValue.value,
      left: leftValue.value,
      width: dimensions.itemWidth,
      height: dimensions.itemHeight,
      zIndex: movingSV.value ? 1000 : 0,
      shadowColor: "black",
      shadowOpacity: withSpring(movingSV.value ? 0.2 : 0),
      shadowRadius: 10,
      transform: [{ scale: withSpring(movingSV.value ? 1.05 : 1) }],
    };
  }, [movingSV, isBeingRemoved, dimensions]);

  return {
    animatedStyle,
    panGestureHandler,
    handlePanGestureHandler,
    isMoving,
    hasHandle,
    registerHandle,
  };
}
