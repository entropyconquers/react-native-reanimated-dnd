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
  itemHeight: number;
  containerHeight?: number;
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
}

export interface UseSortableReturn {
  animatedStyle: StyleProp<ViewStyle>;
  panGestureHandler: GestureType;
  isMoving: boolean;
  hasHandle: boolean;
  registerHandle: (registered: boolean) => void;
}

/**
 * A hook for creating sortable list items with drag-and-drop reordering capabilities.
 *
 * This hook provides the core functionality for individual items within a sortable list,
 * handling drag gestures, position animations, auto-scrolling, and reordering logic.
 * It works in conjunction with useSortableList to provide a complete sortable solution.
 *
 * @template T - The type of data associated with the sortable item
 * @param options - Configuration options for the sortable item behavior
 * @returns Object containing animated styles, gesture handlers, and state for the sortable item
 *
 * @example
 * Basic sortable item:
 * ```typescript
 * import { useSortable } from './hooks/useSortable';
 *
 * function SortableTaskItem({ task, positions, ...sortableProps }) {
 *   const { animatedStyle, panGestureHandler, isMoving } = useSortable({
 *     id: task.id,
 *     positions,
 *     ...sortableProps,
 *     onMove: (id, from, to) => {
 *       console.log(`Task ${id} moved from ${from} to ${to}`);
 *       reorderTasks(id, from, to);
 *     }
 *   });
 *
 *   return (
 *     <PanGestureHandler {...panGestureHandler}>
 *       <Animated.View style={[styles.taskItem, animatedStyle]}>
 *         <Text style={[styles.taskText, isMoving && styles.dragging]}>
 *           {task.title}
 *         </Text>
 *       </Animated.View>
 *     </PanGestureHandler>
 *   );
 * }
 * ```
 *
 * @example
 * Sortable item with drag handle:
 * ```typescript
 * import { useSortable } from './hooks/useSortable';
 * import { SortableHandle } from './components/SortableItem';
 *
 * function TaskWithHandle({ task, ...sortableProps }) {
 *   const { animatedStyle, panGestureHandler, hasHandle } = useSortable({
 *     id: task.id,
 *     ...sortableProps,
 *     children: (
 *       <View style={styles.taskContent}>
 *         <Text>{task.title}</Text>
 *         <SortableHandle>
 *           <Icon name="drag-handle" />
 *         </SortableHandle>
 *       </View>
 *     )
 *   });
 *
 *   return (
 *     <PanGestureHandler {...panGestureHandler}>
 *       <Animated.View style={[styles.taskItem, animatedStyle]}>
 *         <View style={styles.taskContent}>
 *           <Text>{task.title}</Text>
 *           <SortableHandle>
 *             <Icon name="drag-handle" />
 *           </SortableHandle>
 *         </View>
 *       </Animated.View>
 *     </PanGestureHandler>
 *   );
 * }
 * ```
 *
 * @example
 * Sortable item with callbacks and state tracking:
 * ```typescript
 * function AdvancedSortableItem({ item, ...sortableProps }) {
 *   const [isDragging, setIsDragging] = useState(false);
 *
 *   const { animatedStyle, panGestureHandler } = useSortable({
 *     id: item.id,
 *     ...sortableProps,
 *     onDragStart: (id, position) => {
 *       setIsDragging(true);
 *       analytics.track('drag_start', { itemId: id, position });
 *     },
 *     onDrop: (id, position) => {
 *       setIsDragging(false);
 *       analytics.track('drag_end', { itemId: id, position });
 *     },
 *     onDragging: (id, overItemId, yPosition) => {
 *       if (overItemId) {
 *         showDropPreview(overItemId);
 *       }
 *     }
 *   });
 *
 *   return (
 *     <PanGestureHandler {...panGestureHandler}>
 *       <Animated.View
 *         style={[
 *           styles.item,
 *           animatedStyle,
 *           isDragging && styles.dragging
 *         ]}
 *       >
 *         <Text>{item.title}</Text>
 *       </Animated.View>
 *     </PanGestureHandler>
 *   );
 * }
 * ```
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
    onMove,
    onDragStart,
    onDrop,
    onDragging,
  } = options;

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
    const pos = posArr?.[id];
    return pos * itemHeight;
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
      const clampedPosition = Math.min(
        Math.max(0, Math.ceil(currentY / itemHeight)),
        itemsCount - 1
      );

      // Determine overItemId based on the current state of positions.value
      // BEFORE setPosition modifies it for this specific currentY
      let newOverItemId: string | null = null;
      for (const [itemIdIter, itemPosIter] of Object.entries(positions.value)) {
        if (itemPosIter === clampedPosition && itemIdIter !== id) {
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

      // Update visual position and logical positions
      top.value = currentY;
      setPosition(currentY, itemsCount, positions, id, itemHeight);
      setAutoScroll(
        currentY,
        lowerBound.value,
        upperBound.value,
        itemHeight,
        autoScrollDirection
      );
    },
    [
      movingSV,
      itemHeight,
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
    ]
  );

  useAnimatedReaction(
    () => positions.value[id],
    (currentPosition, previousPosition) => {
      if (
        currentPosition !== null &&
        previousPosition !== null &&
        currentPosition !== previousPosition
      ) {
        if (!movingSV.value) {
          top.value = withSpring(currentPosition * itemHeight);
          if (onMove) {
            scheduleOnRN(onMove, id, previousPosition, currentPosition);
          }
        }
      }
    },
    [movingSV]
  );

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
            const contentHeight = itemsCount * itemHeight;
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
    }
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

  const panGestureHandler: GestureType = Gesture.Pan()
    .activateAfterLongPress(200)
    .shouldCancelWhenOutside(false)
    .onStart((event) => {
      "worklet";
      initialItemContentY.value = positions.value[id] * itemHeight;
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
      const finishPosition = positions.value[id] * itemHeight;
      top.value = withTiming(finishPosition);
      movingSV.value = false;
      scheduleOnRN(setIsMoving, false);

      if (onDrop) {
        const positionsCopy = { ...positions.value };
        scheduleOnRN(onDrop, id, positions.value[id], positionsCopy);
      }

      currentOverItemId.value = null;
    });

  const animatedStyle = useAnimatedStyle(() => {
    "worklet";
    return {
      position: "absolute",
      left: 0,
      right: 0,
      top: top.value,
      zIndex: movingSV.value ? 1 : 0,
      backgroundColor: "#000000",
      shadowColor: "black",
      shadowOpacity: withSpring(movingSV.value ? 0.2 : 0),
      shadowRadius: 10,
    };
  }, [movingSV]);

  return {
    animatedStyle,
    panGestureHandler,
    isMoving,
    hasHandle,
    registerHandle,
  };
}
