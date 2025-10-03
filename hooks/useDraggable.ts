// hooks/useDraggable.ts
import React, {
  useRef,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { LayoutChangeEvent } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
  runOnUI,
  useAnimatedReaction,
  useAnimatedRef,
} from "react-native-reanimated";
import {
  Gesture,
  PanGestureHandlerEventPayload,
  GestureType,
} from "react-native-gesture-handler";
import {
  SlotsContext,
  SlotsContextValue,
  DropAlignment,
  DropOffset,
  DropSlot,
} from "../types/context";
import {
  DraggableState,
  AnimationFunction,
  CollisionAlgorithm,
  UseDraggableOptions,
  UseDraggableReturn,
} from "../types/draggable";
import { safeMeasure } from "./safeMeasure";

/**
 * A powerful hook for creating draggable components with advanced features like
 * collision detection, bounded dragging, axis constraints, and custom animations.
 *
 * This hook provides the core functionality for drag-and-drop interactions,
 * handling gesture recognition, position tracking, collision detection with drop zones,
 * and smooth animations.
 *
 * @template TData - The type of data associated with the draggable item
 * @param options - Configuration options for the draggable behavior
 * @returns Object containing props, gesture handlers, and state for the draggable component
 *
 * @example
 * Basic draggable component:
 * ```typescript
 * import { useDraggable } from './hooks/useDraggable';
 *
 * function MyDraggable() {
 *   const { animatedViewProps, gesture, state } = useDraggable({
 *     data: { id: '1', name: 'Draggable Item' },
 *     onDragStart: (data) => console.log('Started dragging:', data.name),
 *     onDragEnd: (data) => console.log('Finished dragging:', data.name),
 *   });
 *
 *   return (
 *     <GestureDetector gesture={gesture}>
 *       <Animated.View {...animatedViewProps}>
 *         <Text>Drag me!</Text>
 *       </Animated.View>
 *     </GestureDetector>
 *   );
 * }
 * ```
 *
 * @example
 * Draggable with custom animation and bounds:
 * ```typescript
 * function BoundedDraggable() {
 *   const boundsRef = useRef<View>(null);
 *
 *   const { animatedViewProps, gesture } = useDraggable({
 *     data: { id: '2', type: 'bounded' },
 *     dragBoundsRef: boundsRef,
 *     dragAxis: 'x', // Only horizontal movement
 *     animationFunction: (toValue) => {
 *       'worklet';
 *       return withTiming(toValue, { duration: 300 });
 *     },
 *     collisionAlgorithm: 'center',
 *   });
 *
 *   return (
 *     <View ref={boundsRef} style={styles.container}>
 *       <GestureDetector gesture={gesture}>
 *         <Animated.View {...animatedViewProps}>
 *           <Text>Bounded horizontal draggable</Text>
 *         </Animated.View>
 *       </GestureDetector>
 *     </View>
 *   );
 * }
 * ```
 *
 * @example
 * Draggable with state tracking:
 * ```typescript
 * function StatefulDraggable() {
 *   const [dragState, setDragState] = useState(DraggableState.IDLE);
 *
 *   const { animatedViewProps, gesture } = useDraggable({
 *     data: { id: '3', status: 'active' },
 *     onStateChange: setDragState,
 *     onDragging: ({ x, y, tx, ty }) => {
 *       console.log(`Position: (${x + tx}, ${y + ty})`);
 *     },
 *   });
 *
 *   return (
 *     <GestureDetector gesture={gesture}>
 *       <Animated.View
 *         {...animatedViewProps}
 *         style={[
 *           animatedViewProps.style,
 *           { opacity: dragState === DraggableState.DRAGGING ? 0.7 : 1 }
 *         ]}
 *       >
 *         <Text>State: {dragState}</Text>
 *       </Animated.View>
 *     </GestureDetector>
 *   );
 * }
 * ```
 *
 * @see {@link DraggableState} for state management
 * @see {@link CollisionAlgorithm} for collision detection options
 * @see {@link AnimationFunction} for custom animations
 * @see {@link UseDraggableOptions} for configuration options
 * @see {@link UseDraggableReturn} for return value details
 */

export const useDraggable = <TData = unknown>(
  options: UseDraggableOptions<TData>
): UseDraggableReturn => {
  const {
    data,
    draggableId,
    dragDisabled = false,
    preDragDelay = 0,
    onDragStart,
    onDragEnd,
    onDragging,
    onStateChange,
    animationFunction,
    dragBoundsRef,
    dragAxis = "both",
    collisionAlgorithm = "intersect",
    children,
    handleComponent,
  } = options;

  // Create animated ref first
  const animatedViewRef = useAnimatedRef<Animated.View>();

  // Add state management
  const [state, setState] = useState<DraggableState>(DraggableState.IDLE);
  const [hasHandle, setHasHandle] = useState(false);

  // Check if any child is a Handle component
  useEffect(() => {
    if (!children || !handleComponent) {
      setHasHandle(false);
      return;
    }

    // Check if children contain a Handle component
    const checkForHandle = (child: React.ReactNode): boolean => {
      if (React.isValidElement(child)) {
        // Check for direct component type match
        if (child.type === handleComponent) {
          return true;
        }

        // Check children recursively
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

  useEffect(() => {
    onStateChange?.(state);
  }, [state, onStateChange]);

  const tx = useSharedValue(0);
  const ty = useSharedValue(0);
  const offsetX = useSharedValue(0);
  const offsetY = useSharedValue(0);
  const dragDisabledShared = useSharedValue(dragDisabled);
  const dragAxisShared = useSharedValue(dragAxis);
  const preDragDelayShared = useSharedValue(preDragDelay);

  const nodeReady = useSharedValue(false);
  const originX = useSharedValue(0);
  const originY = useSharedValue(0);
  const itemW = useSharedValue(0);
  const itemH = useSharedValue(0);
  const isOriginSet = useRef(false);
  const internalDraggableId = useRef(
    draggableId || `draggable-${Math.random().toString(36).substr(2, 9)}`
  ).current;

  const boundsX = useSharedValue(0);
  const boundsY = useSharedValue(0);
  const boundsWidth = useSharedValue(0);
  const boundsHeight = useSharedValue(0);
  const boundsAreSet = useSharedValue(false);

  const {
    getSlots,
    setActiveHoverSlot,
    activeHoverSlotId,
    registerPositionUpdateListener,
    unregisterPositionUpdateListener,
    registerDroppedItem,
    unregisterDroppedItem,
    hasAvailableCapacity,
    onDragging: contextOnDragging,
    onDragStart: contextOnDragStart,
    onDragEnd: contextOnDragEnd,
  } = useContext(SlotsContext) as SlotsContextValue<TData>;

  useEffect(() => {
    preDragDelayShared.value = preDragDelay;
  }, [preDragDelay, preDragDelayShared]);

  useEffect(() => {
    dragDisabledShared.value = dragDisabled;
  }, [dragDisabled, dragDisabledShared]);

  useEffect(() => {
    dragAxisShared.value = dragAxis;
  }, [dragAxis, dragAxisShared]);

  const updateDraggablePosition = useCallback(() => {
    runOnUI(() => {
      "worklet";
      if (!nodeReady.value) return;
      const measurement = safeMeasure(animatedViewRef);
      if (measurement === null) {
        return;
      }

      const currentTx = tx.value;
      const currentTy = ty.value;
      //only update the origin if the tx and ty are 0
      if (currentTx === 0 && currentTy === 0) {
        const newOriginX = measurement.pageX - currentTx;
        const newOriginY = measurement.pageY - currentTy;

        originX.value = newOriginX;
        originY.value = newOriginY;
      }
      itemW.value = measurement.width;
      itemH.value = measurement.height;

      if (!isOriginSet.current) {
        isOriginSet.current = true;
      }
    })();
  }, [animatedViewRef, originX, originY, itemW, itemH, tx, ty]);

  // Worklet version for use within UI thread contexts
  const updateDraggablePositionWorklet = useCallback(() => {
    "worklet";
    if (!nodeReady.value) return;
    const measurement = safeMeasure(animatedViewRef);
    if (measurement === null) {
      return;
    }

    const currentTx = tx.value;
    const currentTy = ty.value;
    //only update the origin if the tx and ty are 0
    if (currentTx === 0 && currentTy === 0) {
      const newOriginX = measurement.pageX - currentTx;
      const newOriginY = measurement.pageY - currentTy;

      originX.value = newOriginX;
      originY.value = newOriginY;
    }
    itemW.value = measurement.width;
    itemH.value = measurement.height;

    if (!isOriginSet.current) {
      isOriginSet.current = true;
    }
  }, [animatedViewRef, originX, originY, itemW, itemH, tx, ty]);

  const updateBounds = useCallback(() => {
    const currentBoundsView = dragBoundsRef?.current;
    if (currentBoundsView) {
      currentBoundsView.measure((_x, _y, width, height, pageX, pageY) => {
        if (
          typeof pageX === "number" &&
          typeof pageY === "number" &&
          width > 0 &&
          height > 0
        ) {
          runOnUI(() => {
            "worklet";
            boundsX.value = pageX;
            boundsY.value = pageY;
            boundsWidth.value = width;
            boundsHeight.value = height;
            if (!boundsAreSet.value) {
              boundsAreSet.value = true;
            }
          })();
        } else {
          console.warn(
            "useDraggable: dragBoundsRef measurement failed or returned invalid dimensions. Bounds may be stale or item unbounded."
          );
        }
      });
    } else {
      runOnUI(() => {
        "worklet";
        if (boundsAreSet.value) {
          boundsAreSet.value = false;
        }
      })();
    }
  }, [
    dragBoundsRef,
    boundsX,
    boundsY,
    boundsWidth,
    boundsHeight,
    boundsAreSet,
  ]);

  useEffect(() => {
    const handlePositionUpdate = () => {
      updateDraggablePosition();
      updateBounds();
    };
    registerPositionUpdateListener(internalDraggableId, handlePositionUpdate);
    return () => {
      unregisterPositionUpdateListener(internalDraggableId);
    };
  }, [
    internalDraggableId,
    registerPositionUpdateListener,
    unregisterPositionUpdateListener,
    updateDraggablePosition,
    updateBounds,
  ]);

  useEffect(() => {
    updateBounds();
  }, [updateBounds]);

  const handleLayoutHandler = useCallback(
    (event: LayoutChangeEvent) => {
      // Mark native node ready on UI thread, then measure.
      runOnUI(() => {
        'worklet';
        nodeReady.value = true;
      })();
      updateDraggablePosition();
    },
    [updateDraggablePosition, nodeReady]
  );

  const animateDragEndPosition = useCallback(
    (targetXValue: number, targetYValue: number) => {
      "worklet";
      if (animationFunction) {
        tx.value = animationFunction(targetXValue);
        ty.value = animationFunction(targetYValue);
      } else {
        tx.value = withSpring(targetXValue);
        ty.value = withSpring(targetYValue);
      }
    },
    [animationFunction, tx, ty]
  );

  const performCollisionCheck = useCallback(
    (
      draggableX: number,
      draggableY: number,
      draggableW: number,
      draggableH: number,
      slot: DropSlot<TData>,
      algo: CollisionAlgorithm
    ): boolean => {
      if (algo === "intersect") {
        return (
          draggableX < slot.x + slot.width &&
          draggableX + draggableW > slot.x &&
          draggableY < slot.y + slot.height &&
          draggableY + draggableH > slot.y
        );
      } else if (algo === "contain") {
        return (
          draggableX >= slot.x &&
          draggableX + draggableW <= slot.x + slot.width &&
          draggableY >= slot.y &&
          draggableY + draggableH <= slot.y + slot.height
        );
      } else {
        const draggableCenterX = draggableX + draggableW / 2;
        const draggableCenterY = draggableY + draggableH / 2;
        return (
          draggableCenterX >= slot.x &&
          draggableCenterX <= slot.x + slot.width &&
          draggableCenterY >= slot.y &&
          draggableCenterY <= slot.y + slot.height
        );
      }
    },
    []
  );

  const processDropAndAnimate = useCallback(
    (
      currentTxVal: number,
      currentTyVal: number,
      draggableData: TData,
      currentOriginX: number,
      currentOriginY: number,
      currentItemW: number,
      currentItemH: number
    ) => {
      const slots = getSlots();
      const currentDraggableX = currentOriginX + currentTxVal;
      const currentDraggableY = currentOriginY + currentTyVal;

      let hitSlotData: DropSlot<TData> | null = null;
      let hitSlotId: number | null = null;

      for (const key in slots) {
        const slotId = parseInt(key, 10);
        const s = slots[slotId];

        const isCollision = performCollisionCheck(
          currentDraggableX,
          currentDraggableY,
          currentItemW,
          currentItemH,
          s,
          collisionAlgorithm
        );

        if (isCollision) {
          const hasCapacity = hasAvailableCapacity(s.id);

          if (hasCapacity) {
            hitSlotData = s;
            hitSlotId = slotId;
            break;
          }
        }
      }

      let finalTxValue: number;
      let finalTyValue: number;

      if (hitSlotData && hitSlotId !== null) {
        if (hitSlotData.onDrop) {
          runOnJS(hitSlotData.onDrop)(draggableData);
        }

        runOnJS(registerDroppedItem)(
          internalDraggableId,
          hitSlotData.id,
          draggableData
        );

        runOnJS(setState)(DraggableState.DROPPED);

        const alignment: DropAlignment = hitSlotData.dropAlignment || "center";
        const offset: DropOffset = hitSlotData.dropOffset || { x: 0, y: 0 };

        let targetX = 0;
        let targetY = 0;

        switch (alignment) {
          case "top-left":
            targetX = hitSlotData.x;
            targetY = hitSlotData.y;
            break;
          case "top-center":
            targetX = hitSlotData.x + hitSlotData.width / 2 - currentItemW / 2;
            targetY = hitSlotData.y;
            break;
          case "top-right":
            targetX = hitSlotData.x + hitSlotData.width - currentItemW;
            targetY = hitSlotData.y;
            break;
          case "center-left":
            targetX = hitSlotData.x;
            targetY = hitSlotData.y + hitSlotData.height / 2 - currentItemH / 2;
            break;
          case "center":
            targetX = hitSlotData.x + hitSlotData.width / 2 - currentItemW / 2;
            targetY = hitSlotData.y + hitSlotData.height / 2 - currentItemH / 2;
            break;
          case "center-right":
            targetX = hitSlotData.x + hitSlotData.width - currentItemW;
            targetY = hitSlotData.y + hitSlotData.height / 2 - currentItemH / 2;
            break;
          case "bottom-left":
            targetX = hitSlotData.x;
            targetY = hitSlotData.y + hitSlotData.height - currentItemH;
            break;
          case "bottom-center":
            targetX = hitSlotData.x + hitSlotData.width / 2 - currentItemW / 2;
            targetY = hitSlotData.y + hitSlotData.height - currentItemH;
            break;
          case "bottom-right":
            targetX = hitSlotData.x + hitSlotData.width - currentItemW;
            targetY = hitSlotData.y + hitSlotData.height - currentItemH;
            break;
          default:
            targetX = hitSlotData.x + hitSlotData.width / 2 - currentItemW / 2;
            targetY = hitSlotData.y + hitSlotData.height / 2 - currentItemH / 2;
        }

        const draggableTargetX = targetX + offset.x;
        const draggableTargetY = targetY + offset.y;

        finalTxValue = draggableTargetX - currentOriginX;
        finalTyValue = draggableTargetY - currentOriginY;
      } else {
        // No hit slot or no capacity available - reset to original position and set state to IDLE
        finalTxValue = 0;
        finalTyValue = 0;

        runOnJS(setState)(DraggableState.IDLE);
        runOnJS(unregisterDroppedItem)(internalDraggableId);
      }

      runOnUI(animateDragEndPosition)(finalTxValue, finalTyValue);
    },
    [
      getSlots,
      animateDragEndPosition,
      collisionAlgorithm,
      performCollisionCheck,
      setState,
      internalDraggableId,
      registerDroppedItem,
      unregisterDroppedItem,
      hasAvailableCapacity,
    ]
  );

  const updateHoverState = useCallback(
    (
      currentTxVal: number,
      currentTyVal: number,
      currentOriginX: number,
      currentOriginY: number,
      currentItemW: number,
      currentItemH: number
    ) => {
      const slots = getSlots();
      const currentDraggableX = currentOriginX + currentTxVal;
      const currentDraggableY = currentOriginY + currentTyVal;

      let newHoveredSlotId: number | null = null;
      for (const key in slots) {
        const slotId = parseInt(key, 10);
        const s = slots[slotId];

        const isCollision = performCollisionCheck(
          currentDraggableX,
          currentDraggableY,
          currentItemW,
          currentItemH,
          s,
          collisionAlgorithm
        );

        if (isCollision) {
          newHoveredSlotId = slotId;
          break;
        }
      }
      if (activeHoverSlotId !== newHoveredSlotId) {
        setActiveHoverSlot(newHoveredSlotId);
      }
    },
    [
      getSlots,
      setActiveHoverSlot,
      activeHoverSlotId,
      collisionAlgorithm,
      performCollisionCheck,
    ]
  );

  const gesture = React.useMemo<GestureType>(
    () =>
      Gesture.Pan()
        .activateAfterLongPress(preDragDelay)
        // We use onStart to detect the initial drag start after the preDragDelay
        .onStart(() => {
          "worklet";
          // Only measure/drag when node is ready.
          if (!nodeReady.value) return;
          //first update the position
          updateDraggablePositionWorklet();
          if (dragDisabledShared.value) return;
          offsetX.value = tx.value;
          offsetY.value = ty.value;
          // Update state to DRAGGING when drag begins
          runOnJS(setState)(DraggableState.DRAGGING);
          if (onDragStart) runOnJS(onDragStart)(data);
          if (contextOnDragStart) runOnJS(contextOnDragStart)(data);
        })
        .onUpdate((event: PanGestureHandlerEventPayload) => {
          "worklet";
          if (dragDisabledShared.value) return;
          let newTx = offsetX.value + event.translationX;
          let newTy = offsetY.value + event.translationY;
          if (boundsAreSet.value) {
            const currentItemW = itemW.value;
            const currentItemH = itemH.value;
            const minTx = boundsX.value - originX.value;
            const maxTx =
              boundsX.value + boundsWidth.value - originX.value - currentItemW;
            const minTy = boundsY.value - originY.value;
            const maxTy =
              boundsY.value + boundsHeight.value - originY.value - currentItemH;
            newTx = Math.max(minTx, Math.min(newTx, maxTx));
            newTy = Math.max(minTy, Math.min(newTy, maxTy));
          }
          if (dragAxisShared.value === "x") {
            tx.value = newTx;
          } else if (dragAxisShared.value === "y") {
            ty.value = newTy;
          } else {
            tx.value = newTx;
            ty.value = newTy;
          }
          if (onDragging) {
            runOnJS(onDragging)({
              x: originX.value,
              y: originY.value,
              tx: tx.value,
              ty: ty.value,
              itemData: data,
            });
          }
          if (contextOnDragging) {
            runOnJS(contextOnDragging)({
              x: originX.value,
              y: originY.value,
              tx: tx.value,
              ty: ty.value,
              itemData: data,
            });
          }
          runOnJS(updateHoverState)(
            tx.value,
            ty.value,
            originX.value,
            originY.value,
            itemW.value,
            itemH.value
          );
        })
        .onEnd(() => {
          "worklet";
          if (dragDisabledShared.value) return;
          if (onDragEnd) runOnJS(onDragEnd)(data);
          if (contextOnDragEnd) runOnJS(contextOnDragEnd)(data);
          runOnJS(processDropAndAnimate)(
            tx.value,
            ty.value,
            data,
            originX.value,
            originY.value,
            itemW.value,
            itemH.value
          );
          runOnJS(setActiveHoverSlot)(null);
        }),
    [
      dragDisabledShared,
      offsetX,
      offsetY,
      tx,
      ty,
      originX,
      originY,
      itemW,
      itemH,
      onDragStart,
      onDragEnd,
      data,
      processDropAndAnimate,
      updateHoverState,
      setActiveHoverSlot,
      animationFunction,
      onDragging,
      boundsAreSet,
      boundsX,
      boundsY,
      boundsWidth,
      boundsHeight,
      dragAxisShared,
      setState,
      updateDraggablePositionWorklet,
      contextOnDragging,
      contextOnDragStart,
      contextOnDragEnd,
      nodeReady,
    ]
  );

  const animatedStyleProp = useAnimatedStyle(() => {
    "worklet";
    return {
      transform: [{ translateX: tx.value }, { translateY: ty.value }] as const,
    };
  }, [tx, ty]);

  // Replace the React useEffect with useAnimatedReaction to properly handle shared values
  useAnimatedReaction(
    () => {
      // This runs on the UI thread and detects when position is back to origin
      // and state needs to be reset
      return {
        txValue: tx.value,
        tyValue: ty.value,
        isZero: tx.value === 0 && ty.value === 0,
      };
    },
    (result, previous) => {
      // Only trigger when values change to zero (returned to original position)
      if (result.isZero && previous && !previous.isZero) {
        // Use runOnJS to call setState from the UI thread
        runOnJS(setState)(DraggableState.IDLE);
        // When returning to origin position, we know we're no longer dropped
        runOnJS(unregisterDroppedItem)(internalDraggableId);
      }
    },
    [setState, unregisterDroppedItem, internalDraggableId]
  );

  // Clean up on unmount
  useEffect(() => {
    return () => {
      // Clean up any registered drops when unmounting
      unregisterDroppedItem(internalDraggableId);
    };
  }, [internalDraggableId, unregisterDroppedItem]);

  return {
    animatedViewProps: {
      style: animatedStyleProp,
      onLayout: handleLayoutHandler,
    },
    gesture,
    state,
    animatedViewRef,
    hasHandle,
  };
};
