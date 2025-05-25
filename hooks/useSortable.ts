import React, { useState, useEffect, useRef } from "react";
import { StyleProp, ViewStyle } from "react-native";
import {
  useSharedValue,
  useDerivedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
  runOnUI,
  useAnimatedReaction,
  useAnimatedGestureHandler,
} from "react-native-reanimated";
import {
  Gesture,
  PanGestureHandlerGestureEvent,
} from "react-native-gesture-handler";
import {
  ScrollDirection,
  setPosition,
  setAutoScroll,
} from "../components/sortableUtils";
import { UseSortableOptions, UseSortableReturn } from "../types/sortable";

/**
 * @see {@link UseSortableOptions} for configuration options
 * @see {@link UseSortableReturn} for return value details
 * @see {@link useSortableList} for list-level management
 * @see {@link SortableItem} for component implementation
 * @see {@link Sortable} for high-level sortable list component
 */

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
    children,
    handleComponent,
  } = options;

  const [isMoving, setIsMoving] = useState(false);
  const [hasHandle, setHasHandle] = useState(false);
  const movingSV = useSharedValue(false);
  const currentOverItemId = useSharedValue<string | null>(null);
  const onDraggingLastCallTimestamp = useSharedValue(0);
  const THROTTLE_INTERVAL = 50; // milliseconds

  const positionY = useSharedValue(0);
  const top = useSharedValue(0);
  const targetLowerBound = useSharedValue(0);

  useEffect(() => {
    runOnUI(() => {
      "worklet";
      const initialTopVal = positions.value[id] * itemHeight;
      const initialLowerBoundVal = lowerBound.value;
      top.value = initialTopVal;
      positionY.value = initialTopVal;
      targetLowerBound.value = initialLowerBoundVal;
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const calculatedContainerHeight = useRef(containerHeight).current;
  const upperBound = useDerivedValue(
    () => lowerBound.value + calculatedContainerHeight
  );

  useEffect(() => {
    if (!children || !handleComponent) {
      setHasHandle(false);
      return;
    }

    const checkForHandle = (child: React.ReactNode): boolean => {
      if (React.isValidElement(child)) {
        if (child.type === handleComponent) {
          return true;
        }

        if (child.props && child.props.children) {
          if (
            React.Children.toArray(child.props.children).some(checkForHandle)
          ) {
            return true;
          }
        }
      }
      return false;
    };

    setHasHandle(React.Children.toArray(children).some(checkForHandle));
  }, [children, handleComponent]);

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
          runOnJS(onDragging)(id, newOverItemId, Math.round(currentY));
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
            runOnJS(onMove)(id, previousPosition, currentPosition);
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

  type GestureContext = Record<string, number>;

  const panGestureHandler = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    GestureContext
  >({
    onStart(event, ctx) {
      "worklet";
      ctx.initialItemContentY = positions.value[id] * itemHeight;
      ctx.initialFingerAbsoluteY = event.absoluteY;
      ctx.initialLowerBound = lowerBound.value;

      positionY.value = ctx.initialItemContentY;
      movingSV.value = true;
      runOnJS(setIsMoving)(true);

      if (onDragStart) {
        runOnJS(onDragStart)(id, positions.value[id]);
      }
    },
    onActive(event, ctx) {
      "worklet";
      const fingerDyScreen = event.absoluteY - ctx.initialFingerAbsoluteY;
      const scrollDeltaSinceStart = lowerBound.value - ctx.initialLowerBound;
      positionY.value =
        ctx.initialItemContentY + fingerDyScreen + scrollDeltaSinceStart;
    },
    onFinish() {
      "worklet";
      const finishPosition = positions.value[id] * itemHeight;
      top.value = withTiming(finishPosition);
      movingSV.value = false;
      runOnJS(setIsMoving)(false);

      if (onDrop) {
        runOnJS(onDrop)(id, positions.value[id]);
      }

      currentOverItemId.value = null;
    },
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
  };
}
