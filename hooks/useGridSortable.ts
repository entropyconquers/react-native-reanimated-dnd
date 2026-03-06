import { useState, useEffect, useMemo } from "react";
import { StyleProp, ViewStyle } from "react-native";
import React from "react";
import {
  runOnJS,
  SharedValue,
  useAnimatedGestureHandler,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { PanGestureHandlerGestureEvent } from "react-native-gesture-handler";
import {
  UseGridSortableOptions,
  UseGridSortableReturn,
  GridPositions,
  GridScrollDirection,
  GridStrategy,
  GridOrientation,
} from "../types/grid";
import {
  setGridPosition,
  setGridAutoScroll,
  findItemIdAtIndex,
} from "../lib/gridCalculations";

/**
 * Hook for creating sortable grid items with drag-and-drop reordering
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
    onMove,
    onDragStart,
    onDrop,
    onDragging,
    children,
    handleComponent,
    isBeingRemoved = false,
  } = options;

  const [isMoving, setIsMoving] = useState(false);
  const [hasHandle, setHasHandle] = useState(false);
  const movingSV = useSharedValue(false);
  const currentOverItemId = useSharedValue<string | null>(null);
  const onDraggingLastCallTimestamp = useSharedValue(0);
  const THROTTLE_INTERVAL = 50;

  // Initialize position from shared value
  const initialPosition = useMemo(() => {
    const pos = positions.get();
    return pos?.[id] || { index: 0, row: 0, column: 0, x: 0, y: 0 };
  }, []);

  const initialScrollY = useMemo(() => scrollY.get(), []);
  const initialScrollX = useMemo(() => scrollX.get(), []);

  // Shared values for position tracking
  const positionX = useSharedValue(initialPosition.x);
  const positionY = useSharedValue(initialPosition.y);
  const left = useSharedValue(initialPosition.x);
  const top = useSharedValue(initialPosition.y);
  const targetScrollY = useSharedValue(initialScrollY);
  const targetScrollX = useSharedValue(initialScrollX);

  // Check for handle component
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

  // React to position changes during drag
  useAnimatedReaction(
    () => ({ x: positionX.value, y: positionY.value }),
    (current, previous) => {
      if (!movingSV.value) {
        return;
      }

      if (previous && current.x === previous.x && current.y === previous.y) {
        return;
      }

      // Determine which item we're hovering over
      const currentPosition = positions.value[id];
      let newOverItemId: string | null = null;

      // Find item at current drag position
      for (const [itemId, itemPos] of Object.entries(positions.value)) {
        if (itemId !== id) {
          const withinX =
            current.x >= itemPos.x &&
            current.x < itemPos.x + dimensions.itemWidth;
          const withinY =
            current.y >= itemPos.y &&
            current.y < itemPos.y + dimensions.itemHeight;

          if (withinX && withinY) {
            newOverItemId = itemId;
            break;
          }
        }
      }

      if (currentOverItemId.value !== newOverItemId) {
        currentOverItemId.value = newOverItemId;
      }

      // Call onDragging callback (throttled)
      if (onDragging) {
        const now = Date.now();
        if (now - onDraggingLastCallTimestamp.value > THROTTLE_INTERVAL) {
          runOnJS(onDragging)(
            id,
            newOverItemId,
            Math.round(current.x),
            Math.round(current.y)
          );
          onDraggingLastCallTimestamp.value = now;
        }
      }

      // Update visual position
      left.value = current.x;
      top.value = current.y;

      // Update logical positions in grid
      // Note: current.x and current.y are already in scrolled coordinates
      setGridPosition(
        current.x,
        current.y,
        0, // Don't pass scroll offsets since positions are already adjusted
        0,
        itemsCount,
        positions,
        id,
        dimensions,
        orientation,
        strategy
      );

      // Set auto-scroll direction
      // current position is already in container coordinates (includes scroll)
      setGridAutoScroll(
        current.x,
        current.y,
        scrollX.value,
        scrollY.value,
        containerWidth,
        containerHeight,
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
      onDragging,
      scrollX,
      scrollY,
      autoScrollDirection,
      currentOverItemId,
      left,
      top,
      onDraggingLastCallTimestamp,
      orientation,
      strategy,
      containerWidth,
      containerHeight,
    ]
  );

  // React to position changes from other items moving
  useAnimatedReaction(
    () => positions.value[id],
    (currentPosition, previousPosition) => {
      if (!currentPosition || !previousPosition) {
        return;
      }

      if (currentPosition.index !== previousPosition.index && !movingSV.value) {
        // Animate to new position with same timing as drag release
        left.value = withTiming(currentPosition.x);
        top.value = withTiming(currentPosition.y);

        if (onMove) {
          runOnJS(onMove)(id, previousPosition.index, currentPosition.index);
        }
      }
    },
    [movingSV, onMove, id]
  );

  // Handle auto-scrolling
  useAnimatedReaction(
    () => autoScrollDirection.value,
    (scrollDir, previousValue) => {
      if (!scrollDir || !previousValue || scrollDir === previousValue) {
        return;
      }

      const SCROLL_DURATION = 1500;

      switch (scrollDir) {
        case GridScrollDirection.Up:
          targetScrollY.value = scrollY.value;
          targetScrollY.value = withTiming(0, { duration: SCROLL_DURATION });
          break;

        case GridScrollDirection.Down: {
          const maxScrollY = Math.max(
            0,
            itemsCount * dimensions.itemHeight - containerHeight
          );
          targetScrollY.value = scrollY.value;
          targetScrollY.value = withTiming(maxScrollY, {
            duration: SCROLL_DURATION,
          });
          break;
        }

        case GridScrollDirection.Left:
          targetScrollX.value = scrollX.value;
          targetScrollX.value = withTiming(0, { duration: SCROLL_DURATION });
          break;

        case GridScrollDirection.Right: {
          const maxScrollX = Math.max(
            0,
            itemsCount * dimensions.itemWidth - containerWidth
          );
          targetScrollX.value = scrollX.value;
          targetScrollX.value = withTiming(maxScrollX, {
            duration: SCROLL_DURATION,
          });
          break;
        }

        case GridScrollDirection.UpLeft:
          targetScrollY.value = scrollY.value;
          targetScrollY.value = withTiming(0, { duration: SCROLL_DURATION });
          targetScrollX.value = scrollX.value;
          targetScrollX.value = withTiming(0, { duration: SCROLL_DURATION });
          break;

        case GridScrollDirection.UpRight: {
          targetScrollY.value = scrollY.value;
          targetScrollY.value = withTiming(0, { duration: SCROLL_DURATION });
          const maxScrollX = Math.max(
            0,
            itemsCount * dimensions.itemWidth - containerWidth
          );
          targetScrollX.value = scrollX.value;
          targetScrollX.value = withTiming(maxScrollX, {
            duration: SCROLL_DURATION,
          });
          break;
        }

        case GridScrollDirection.DownLeft: {
          const maxScrollY = Math.max(
            0,
            itemsCount * dimensions.itemHeight - containerHeight
          );
          targetScrollY.value = scrollY.value;
          targetScrollY.value = withTiming(maxScrollY, {
            duration: SCROLL_DURATION,
          });
          targetScrollX.value = scrollX.value;
          targetScrollX.value = withTiming(0, { duration: SCROLL_DURATION });
          break;
        }

        case GridScrollDirection.DownRight: {
          const maxScrollY = Math.max(
            0,
            itemsCount * dimensions.itemHeight - containerHeight
          );
          const maxScrollX = Math.max(
            0,
            itemsCount * dimensions.itemWidth - containerWidth
          );
          targetScrollY.value = scrollY.value;
          targetScrollY.value = withTiming(maxScrollY, {
            duration: SCROLL_DURATION,
          });
          targetScrollX.value = scrollX.value;
          targetScrollX.value = withTiming(maxScrollX, {
            duration: SCROLL_DURATION,
          });
          break;
        }

        case GridScrollDirection.None:
          targetScrollY.value = scrollY.value;
          targetScrollX.value = scrollX.value;
          break;
      }
    }
  );

  // Sync target scroll with actual scroll during drag
  useAnimatedReaction(
    () => ({ y: targetScrollY.value, x: targetScrollX.value }),
    (target, previous) => {
      if (!target || !previous) {
        return;
      }

      if (
        movingSV.value &&
        (target.y !== previous.y || target.x !== previous.x)
      ) {
        scrollY.value = target.y;
        scrollX.value = target.x;
      }
    },
    [movingSV]
  );

  // Gesture handler
  type GestureContext = {
    initialItemX: number;
    initialItemY: number;
    initialFingerX: number;
    initialFingerY: number;
    initialScrollX: number;
    initialScrollY: number;
  };

  const panGestureHandler = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    GestureContext
  >({
    onStart(event, ctx) {
      "worklet";
      const currentPos = positions.value[id];
      ctx.initialItemX = currentPos.x;
      ctx.initialItemY = currentPos.y;
      ctx.initialFingerX = event.absoluteX;
      ctx.initialFingerY = event.absoluteY;
      ctx.initialScrollX = scrollX.value;
      ctx.initialScrollY = scrollY.value;

      positionX.value = ctx.initialItemX;
      positionY.value = ctx.initialItemY;
      movingSV.value = true;
      runOnJS(setIsMoving)(true);

      if (onDragStart) {
        runOnJS(onDragStart)(id, currentPos.index);
      }
    },

    onActive(event, ctx) {
      "worklet";
      const fingerDeltaX = event.absoluteX - ctx.initialFingerX;
      const fingerDeltaY = event.absoluteY - ctx.initialFingerY;

      // Calculate scroll offset difference since drag started
      const scrollDiffX = scrollX.value - ctx.initialScrollX;
      const scrollDiffY = scrollY.value - ctx.initialScrollY;

      // Adjust position for finger movement and scroll changes
      positionX.value = ctx.initialItemX + fingerDeltaX + scrollDiffX;
      positionY.value = ctx.initialItemY + fingerDeltaY + scrollDiffY;
    },

    onFinish() {
      "worklet";
      const finalPosition = positions.value[id];
      left.value = withTiming(finalPosition.x);
      top.value = withTiming(finalPosition.y);
      movingSV.value = false;
      runOnJS(setIsMoving)(false);

      if (onDrop) {
        const positionsCopy: GridPositions = {};
        for (const key in positions.value) {
          positionsCopy[key] = { ...positions.value[key] };
        }
        runOnJS(onDrop)(id, finalPosition.index, positionsCopy);
      }

      currentOverItemId.value = null;
    },
  });

  // Animated style
  const animatedStyle = useAnimatedStyle(() => {
    "worklet";
    return {
      position: "absolute",
      left: left.value,
      top: top.value,
      width: dimensions.itemWidth,
      height: dimensions.itemHeight,
      zIndex: movingSV.value ? 1000 : 1,
      shadowColor: "black",
      shadowOpacity: withSpring(movingSV.value ? 0.2 : 0),
      shadowRadius: 10,
      elevation: movingSV.value ? 5 : 0,
      opacity: withTiming(isBeingRemoved ? 0 : 1, { duration: 200 }),
      transform: [
        {
          scale: withTiming(isBeingRemoved ? 0.8 : 1, { duration: 200 }),
        },
      ],
    };
  }, [movingSV, dimensions, isBeingRemoved]);

  return {
    animatedStyle,
    panGestureHandler,
    isMoving,
    hasHandle,
  };
}
