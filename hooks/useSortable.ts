import { useCallback, useMemo, useRef, useState } from "react";
import { StyleProp, ViewStyle } from "react-native";
import {
  SharedValue,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { Gesture, GestureType } from "react-native-gesture-handler";
import { scheduleOnRN } from "react-native-worklets";
import {
  findPositionForY,
  getItemCumulativeY,
} from "../components/sortableUtils";

export enum ScrollDirection {
  None = "none",
  Up = "up",
  Down = "down",
}

export function clamp(value: number, lowerBound: number, upperBound: number) {
  "worklet";
  return Math.max(lowerBound, Math.min(value, upperBound));
}

export function objectMove(
  object: { [id: string]: number },
  from: number,
  to: number
) {
  "worklet";
  const newObject = Object.assign({}, object);
  const movedUp = to < from;

  for (const id in object) {
    if (object[id] === from) {
      newObject[id] = to;
      continue;
    }

    // Items in-between from and to should shift by 1 position;
    // clamping isn't necessary as long as to and from are valid
    const currentPosition = object[id];
    if (movedUp && currentPosition >= to && currentPosition < from) {
      newObject[id]++;
    } else if (currentPosition <= to && currentPosition > from) {
      newObject[id]--;
    }
  }

  return newObject;
}

export function listToObject<T extends { id: string }>(list: T[]) {
  const values = Object.values(list);
  const object: { [id: string]: number } = {};

  for (let i = 0; i < values.length; i++) {
    object[values[i].id] = i;
  }

  return object;
}

export function setPosition(
  positionY: number,
  itemsCount: number,
  positions: SharedValue<{ [id: string]: number }>,
  id: string,
  itemHeight: number
) {
  "worklet";
  const newPosition = clamp(
    Math.floor(positionY / itemHeight),
    0,
    itemsCount - 1
  );

  if (newPosition !== positions.value[id]) {
    positions.value = objectMove(
      positions.value,
      positions.value[id],
      newPosition
    );
  }
}

export function setAutoScroll(
  positionY: number,
  lowerBound: number,
  upperBound: number,
  scrollThreshold: number,
  autoScroll: SharedValue<ScrollDirection>
) {
  "worklet";
  if (positionY <= lowerBound + scrollThreshold) {
    autoScroll.value = ScrollDirection.Up;
  } else if (positionY >= upperBound - scrollThreshold) {
    autoScroll.value = ScrollDirection.Down;
  } else {
    autoScroll.value = ScrollDirection.None;
  }
}

/**
 * @see {@link UseSortableOptions} for configuration options
 * @see {@link UseSortableReturn} for return value details
 * @see {@link useSortableList} for list-level management
 * @see {@link SortableItem} for component implementation
 * @see {@link Sortable} for high-level sortable list component
 */

export interface UseSortableOptions<T> {
  id: string;
  positions: SharedValue<{ [id: string]: number }>;
  lowerBound: SharedValue<number>;
  autoScrollDirection: SharedValue<ScrollDirection>;
  itemsCount: number;
  itemHeight?: number;
  containerHeight?: number;
  estimatedItemHeight?: number;
  isDynamicHeight?: boolean;
  itemHeights?: SharedValue<{ [id: string]: number }>;
  onMove?: (id: string, from: number, to: number) => void;
  onDragStart?: (id: string, position: number) => void;
  onDrop?: (
    id: string,
    position: number,
    allPositions?: { [id: string]: number }
  ) => void;
  onDragging?: (
    id: string,
    overItemId: string | null,
    yPosition: number
  ) => void;
  /**
   * Long-press duration in milliseconds before the drag gesture activates.
   * Pass `0` for immediate activation when using a dedicated drag handle.
   *
   * @default 200
   */
  preDragDelay?: number;
}

export interface UseSortableReturn {
  animatedStyle: StyleProp<ViewStyle>;
  panGestureHandler: GestureType;
  handlePanGestureHandler: GestureType;
  isMoving: boolean;
  hasHandle: boolean;
  registerHandle: (registered: boolean) => void;
}

/**
 * A hook for creating sortable list items with drag-and-drop reordering capabilities.
 *
 * Supports both fixed height and dynamic height modes. In dynamic height mode,
 * positions are calculated using cumulative heights instead of uniform itemHeight.
 *
 * @template T - The type of data associated with the sortable item
 * @param options - Configuration options for the sortable item behavior
 * @returns Object containing animated styles, gesture handlers, and state for the sortable item
 *
 * @see {@link UseSortableOptions} for configuration options
 * @see {@link UseSortableReturn} for return value details
 * @see {@link useSortableList} for list-level management
 * @see {@link SortableItem} for component implementation
 * @see {@link Sortable} for high-level sortable list component
 */
export function useSortable<T>(
  options: UseSortableOptions<T>
): UseSortableReturn {
  const {
    id,
    positions,
    lowerBound,
    autoScrollDirection,
    itemsCount,
    itemHeight,
    containerHeight = 500,
    estimatedItemHeight = 60,
    isDynamicHeight = false,
    itemHeights,
    onMove,
    onDragStart,
    onDrop,
    onDragging,
    preDragDelay = 200,
  } = options;

  // Effective item height for fixed mode calculations
  const effectiveItemHeight = itemHeight || estimatedItemHeight;

  const [isMoving, setIsMoving] = useState(false);
  const [hasHandle, setHasHandle] = useState(false);

  const registerHandle = useCallback((registered: boolean) => {
    setHasHandle(registered);
  }, []);
  const movingSV = useSharedValue(false);
  const currentOverItemId = useSharedValue<string | null>(null);
  const onDraggingLastCallTimestamp = useSharedValue(0);
  const THROTTLE_INTERVAL = 50; // milliseconds

  const initialTopVal = useMemo(() => {
    const posArr = positions.get();
    const pos = posArr?.[id] ?? 0;
    // For dynamic heights, use estimated height for initial position.
    // The animated reaction will correct it once cumulative heights are available.
    return pos * effectiveItemHeight;
  }, []);

  const initialLowerBoundVal = useMemo(() => {
    return lowerBound.get();
  }, []);

  const positionY = useSharedValue(initialTopVal);
  const top = useSharedValue(initialTopVal);
  const targetLowerBound = useSharedValue(initialLowerBoundVal);
  const initialItemContentY = useSharedValue(0);
  const initialFingerAbsoluteY = useSharedValue(0);
  const initialLowerBound = useSharedValue(0);

  const calculatedContainerHeight = useRef(containerHeight).current;
  const upperBound = useDerivedValue(
    () => lowerBound.value + calculatedContainerHeight
  );

  // === Position sync for non-moving items ===
  // In dynamic mode: compute cumulative Y inline from positions + itemHeights
  // In fixed mode: watch position index and multiply by itemHeight
  useAnimatedReaction(
    () => {
      if (isDynamicHeight && itemHeights) {
        // Compute Y position inline — avoids an intermediate shared value
        // that would cause all items to cascade on every position change.
        return getItemCumulativeY(id, positions.value, itemHeights.value, estimatedItemHeight);
      }
      return (positions.value[id] ?? 0) * effectiveItemHeight;
    },
    (newTop, oldTop) => {
      if (oldTop !== null && newTop !== oldTop && !movingSV.value) {
        top.value = withSpring(newTop);
      }
    },
    [isDynamicHeight, itemHeights, positions, id, effectiveItemHeight, estimatedItemHeight, movingSV]
  );

  // === Position change callback (onMove) ===
  useAnimatedReaction(
    () => positions.value[id],
    (currentPosition, previousPosition) => {
      if (
        currentPosition !== null &&
        previousPosition !== null &&
        currentPosition !== previousPosition &&
        !movingSV.value &&
        onMove
      ) {
        scheduleOnRN(onMove, id, previousPosition, currentPosition);
      }
    },
    [movingSV, onMove]
  );

  // === Drag position tracking ===
  useAnimatedReaction(
    () => positionY.value,
    (currentY, previousY) => {
      if (currentY === null || !movingSV.value) {
        return;
      }

      if (previousY !== null && currentY === previousY) {
        return;
      }

      // Calculate target discrete position
      let clampedPosition: number;

      if (isDynamicHeight && itemHeights) {
        // Dynamic mode: find position using item heights (computed inline)
        clampedPosition = findPositionForY(
          currentY,
          positions.value,
          itemHeights.value,
          estimatedItemHeight,
          itemsCount
        );
      } else {
        // Fixed mode: simple division
        clampedPosition = Math.min(
          Math.max(0, Math.ceil(currentY / effectiveItemHeight)),
          itemsCount - 1
        );
      }

      // Determine overItemId based on the current state of positions.value
      let newOverItemId: string | null = null;
      const positionsObj = positions.value;
      for (const itemIdIter in positionsObj) {
        if (positionsObj[itemIdIter] === clampedPosition && itemIdIter !== id) {
          newOverItemId = itemIdIter;
          break;
        }
      }

      if (currentOverItemId.value !== newOverItemId) {
        currentOverItemId.value = newOverItemId;
      }

      if (onDragging) {
        const now = Date.now();
        if (now - onDraggingLastCallTimestamp.value > THROTTLE_INTERVAL) {
          scheduleOnRN(onDragging, id, newOverItemId, Math.round(currentY));
          onDraggingLastCallTimestamp.value = now;
        }
      }

      // Update visual position
      top.value = currentY;

      // Update logical positions
      if (isDynamicHeight) {
        // Dynamic: use cumulative-heights-based position finding
        if (clampedPosition !== positions.value[id]) {
          positions.value = objectMove(
            positions.value,
            positions.value[id],
            clampedPosition
          );
        }
      } else {
        // Fixed: use standard position calculation
        setPosition(currentY, itemsCount, positions, id, effectiveItemHeight);
      }

      setAutoScroll(
        currentY,
        lowerBound.value,
        upperBound.value,
        effectiveItemHeight,
        autoScrollDirection
      );
    },
    [
      movingSV,
      effectiveItemHeight,
      isDynamicHeight,
      estimatedItemHeight,
      itemsCount,
      positions,
      id,
      onDragging,
      lowerBound,
      upperBound,
      autoScrollDirection,
      currentOverItemId,
      top,
      onDraggingLastCallTimestamp,
      itemHeights,
    ]
  );

  // === Auto-scroll handling ===
  useAnimatedReaction(
    () => autoScrollDirection.value,
    (scrollDirection, previousValue) => {
      if (
        scrollDirection !== null &&
        previousValue !== null &&
        scrollDirection !== previousValue
      ) {
        switch (scrollDirection) {
          case ScrollDirection.Up: {
            targetLowerBound.value = lowerBound.value;
            targetLowerBound.value = withTiming(0, { duration: 1500 });
            break;
          }
          case ScrollDirection.Down: {
            let contentHeight: number;
            if (isDynamicHeight && itemHeights) {
              // Sum all item heights for total content height
              contentHeight = 0;
              const heights = itemHeights.value;
              const posObj = positions.value;
              for (const itemId in posObj) {
                contentHeight += heights[itemId] ?? estimatedItemHeight;
              }
            } else {
              contentHeight = itemsCount * effectiveItemHeight;
            }
            const maxScroll = contentHeight - calculatedContainerHeight;
            targetLowerBound.value = lowerBound.value;
            targetLowerBound.value = withTiming(maxScroll, { duration: 1500 });
            break;
          }
          case ScrollDirection.None: {
            targetLowerBound.value = lowerBound.value;
            break;
          }
        }
      }
    },
    [isDynamicHeight, itemHeights, effectiveItemHeight, estimatedItemHeight, itemsCount, calculatedContainerHeight]
  );

  useAnimatedReaction(
    () => targetLowerBound.value,
    (targetLowerBoundValue, previousValue) => {
      if (
        targetLowerBoundValue !== null &&
        previousValue !== null &&
        targetLowerBoundValue !== previousValue
      ) {
        if (movingSV.value) {
          lowerBound.value = targetLowerBoundValue;
        }
      }
    },
    [movingSV]
  );

  // === Pan gesture ===
  const createPanGesture = () =>
    Gesture.Pan()
      .activateAfterLongPress(preDragDelay)
      .shouldCancelWhenOutside(false)
      .onStart((event) => {
        "worklet";
        // Calculate initial content Y position
        if (isDynamicHeight && itemHeights) {
          initialItemContentY.value = getItemCumulativeY(
            id,
            positions.value,
            itemHeights.value,
            estimatedItemHeight
          );
        } else {
          initialItemContentY.value = positions.value[id] * effectiveItemHeight;
        }

        initialFingerAbsoluteY.value = event.absoluteY;
        initialLowerBound.value = lowerBound.value;

        positionY.value = initialItemContentY.value;
        movingSV.value = true;
        scheduleOnRN(setIsMoving, true);

        if (onDragStart) {
          scheduleOnRN(onDragStart, id, positions.value[id]);
        }
      })
      .onUpdate((event) => {
        "worklet";
        const fingerDyScreen = event.absoluteY - initialFingerAbsoluteY.value;
        const scrollDeltaSinceStart = lowerBound.value - initialLowerBound.value;
        positionY.value =
          initialItemContentY.value + fingerDyScreen + scrollDeltaSinceStart;
      })
      .onFinalize(() => {
        "worklet";
        // Calculate finish position
        let finishPosition: number;
        if (isDynamicHeight && itemHeights) {
          finishPosition = getItemCumulativeY(
            id,
            positions.value,
            itemHeights.value,
            estimatedItemHeight
          );
        } else {
          finishPosition = positions.value[id] * effectiveItemHeight;
        }

        top.value = withTiming(finishPosition);
        movingSV.value = false;
        scheduleOnRN(setIsMoving, false);

        if (onDrop) {
          const positionsCopy = { ...positions.value };
          scheduleOnRN(onDrop, id, positions.value[id], positionsCopy);
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
    return {
      position: "absolute",
      left: 0,
      right: 0,
      top: top.value,
      zIndex: movingSV.value ? 1 : 0,
      shadowColor: "black",
      shadowOpacity: withSpring(movingSV.value ? 0.2 : 0),
      shadowRadius: 10,
    };
  }, [movingSV]);

  return {
    animatedStyle,
    panGestureHandler,
    handlePanGestureHandler,
    isMoving,
    hasHandle,
    registerHandle,
  };
}
