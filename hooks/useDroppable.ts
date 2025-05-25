import React, {
  useRef,
  useEffect,
  useContext,
  useCallback,
  useMemo,
} from "react";
import {
  LayoutChangeEvent,
  StyleProp,
  ViewStyle,
  StyleSheet,
} from "react-native";
import Animated, {
  useAnimatedRef,
  measure,
  runOnUI,
  runOnJS,
} from "react-native-reanimated";
import {
  SlotsContext,
  SlotsContextValue,
  DropAlignment,
  DropOffset,
} from "../context/DropContext";
import { _getUniqueDroppableId } from "../components/Droppable";
import { UseDroppableOptions, UseDroppableReturn } from "../types/droppable";

/**
 * A hook for creating drop zones that can receive draggable items.
 *
 * This hook handles the registration of drop zones, collision detection with draggable items,
 * visual feedback during hover states, and proper positioning of dropped items within the zone.
 * It integrates seamlessly with the drag-and-drop context to provide a complete solution.
 *
 * @template TData - The type of data that can be dropped on this droppable
 * @param options - Configuration options for the droppable behavior
 * @returns Object containing view props, active state, and internal references
 *
 * @example
 * Basic drop zone:
 * ```typescript
 * import { useDroppable } from './hooks/useDroppable';
 *
 * function BasicDropZone() {
 *   const { viewProps, isActive } = useDroppable({
 *     onDrop: (data) => {
 *       console.log('Item dropped:', data);
 *       // Handle the dropped item
 *     }
 *   });
 *
 *   return (
 *     <Animated.View
 *       {...viewProps}
 *       style={[
 *         styles.dropZone,
 *         viewProps.style, // Important: include the active style
 *         isActive && styles.highlighted
 *       ]}
 *     >
 *       <Text>Drop items here</Text>
 *     </Animated.View>
 *   );
 * }
 * ```
 *
 * @example
 * Drop zone with custom alignment and capacity:
 * ```typescript
 * function TaskColumn() {
 *   const [tasks, setTasks] = useState<Task[]>([]);
 *
 *   const { viewProps, isActive } = useDroppable({
 *     droppableId: 'in-progress-column',
 *     onDrop: (task: Task) => {
 *       setTasks(prev => [...prev, task]);
 *       updateTaskStatus(task.id, 'in-progress');
 *     },
 *     dropAlignment: 'top-center',
 *     dropOffset: { x: 0, y: 10 },
 *     capacity: 10, // Max 10 tasks in this column
 *     activeStyle: {
 *       backgroundColor: 'rgba(59, 130, 246, 0.1)',
 *       borderColor: '#3b82f6',
 *       borderWidth: 2,
 *       borderStyle: 'dashed'
 *     }
 *   });
 *
 *   return (
 *     <Animated.View {...viewProps} style={[styles.column, viewProps.style]}>
 *       <Text style={styles.columnTitle}>In Progress ({tasks.length}/10)</Text>
 *       {tasks.map(task => (
 *         <TaskCard key={task.id} task={task} />
 *       ))}
 *       {isActive && (
 *         <Text style={styles.dropHint}>Release to add task</Text>
 *       )}
 *     </Animated.View>
 *   );
 * }
 * ```
 *
 * @example
 * Conditional drop zone with validation:
 * ```typescript
 * function RestrictedDropZone() {
 *   const [canAcceptItems, setCanAcceptItems] = useState(true);
 *
 *   const { viewProps, isActive } = useDroppable({
 *     onDrop: (data: FileData) => {
 *       if (data.type === 'image' && data.size < 5000000) {
 *         uploadFile(data);
 *       } else {
 *         showError('Only images under 5MB allowed');
 *       }
 *     },
 *     dropDisabled: !canAcceptItems,
 *     onActiveChange: (active) => {
 *       if (active) {
 *         setHoverFeedback('Drop your image here');
 *       } else {
 *         setHoverFeedback('');
 *       }
 *     },
 *     activeStyle: {
 *       backgroundColor: canAcceptItems ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
 *       borderColor: canAcceptItems ? '#22c55e' : '#ef4444'
 *     }
 *   });
 *
 *   return (
 *     <Animated.View
 *       {...viewProps}
 *       style={[
 *         styles.uploadZone,
 *         viewProps.style,
 *         !canAcceptItems && styles.disabled
 *       ]}
 *     >
 *       <Text>
 *         {canAcceptItems ? 'Drop images here' : 'Upload disabled'}
 *       </Text>
 *       {isActive && <Text>Release to upload</Text>}
 *     </Animated.View>
 *   );
 * }
 * ```
 *
 * @see {@link DropAlignment} for alignment options
 * @see {@link DropOffset} for offset configuration
 * @see {@link UseDroppableOptions} for configuration options
 * @see {@link UseDroppableReturn} for return value details
 * @see {@link DropProvider} for drag-and-drop context setup
 * @see {@link Draggable} for draggable components
 */
export const useDroppable = <TData = unknown>(
  options: UseDroppableOptions<TData>
): UseDroppableReturn => {
  const {
    onDrop,
    dropDisabled,
    onActiveChange,
    dropAlignment,
    dropOffset,
    activeStyle,
    droppableId,
    capacity,
  } = options;

  // Create animated ref first
  const animatedViewRef = useAnimatedRef<Animated.View>();

  const id = useRef(_getUniqueDroppableId()).current;
  const stringId = useRef(droppableId || `droppable-${id}`).current;
  const instanceId = useRef(
    `droppable-${id}-${Math.random().toString(36).substr(2, 9)}`
  ).current;

  const {
    register,
    unregister,
    isRegistered,
    activeHoverSlotId: contextActiveHoverSlotId,
    registerPositionUpdateListener,
    unregisterPositionUpdateListener,
  } = useContext(SlotsContext) as SlotsContextValue<TData>;

  const isActive = contextActiveHoverSlotId === id;

  // Process active style to separate transforms from other styles
  const { processedActiveStyle, activeTransforms } = useMemo(() => {
    if (!isActive || !activeStyle) {
      return { processedActiveStyle: null, activeTransforms: [] };
    }

    const flattenedStyle = StyleSheet.flatten(activeStyle);
    let processedStyle = { ...flattenedStyle };
    let transforms: any[] = [];

    // Extract and process transforms if present
    if (flattenedStyle.transform) {
      if (Array.isArray(flattenedStyle.transform)) {
        transforms = [...flattenedStyle.transform];
      }

      // Remove transform from the main style to avoid conflicts
      delete processedStyle.transform;
    }

    return {
      processedActiveStyle: processedStyle,
      activeTransforms: transforms,
    };
  }, [isActive, activeStyle]);

  // Create the final style with transforms properly handled
  const combinedActiveStyle = useMemo(() => {
    if (!isActive || !activeStyle) {
      return undefined;
    }

    // If there are no transforms, just return the processed style
    if (activeTransforms.length === 0) {
      return processedActiveStyle;
    }

    // Add transforms to the style
    return {
      ...processedActiveStyle,
      transform: activeTransforms,
    };
  }, [isActive, activeStyle, processedActiveStyle, activeTransforms]);

  useEffect(() => {
    onActiveChange?.(isActive);
  }, [isActive, onActiveChange]);

  useEffect(() => {
    console.log(
      `Droppable ${id} using string ID: ${stringId}, provided ID: ${
        droppableId || "none"
      }`
    );
  }, [id, stringId, droppableId]);

  const updateDroppablePosition = useCallback(() => {
    runOnUI(() => {
      "worklet";
      const measurement = measure(animatedViewRef);
      if (measurement === null) {
        return;
      }

      if (measurement.width > 0 && measurement.height > 0) {
        // Ensure valid dimensions before registering
        runOnJS(register)(id, {
          id: droppableId || `droppable-${id}`,
          x: measurement.pageX,
          y: measurement.pageY,
          width: measurement.width,
          height: measurement.height,
          onDrop,
          dropAlignment: dropAlignment || "center",
          dropOffset: dropOffset || { x: 0, y: 0 },
          capacity,
        });
      }
    })();
  }, [
    id,
    droppableId,
    onDrop,
    register,
    animatedViewRef,
    dropAlignment,
    dropOffset,
    capacity,
  ]);

  const handleLayoutHandler = useCallback(
    (_event: LayoutChangeEvent) => {
      updateDroppablePosition();
    },
    [updateDroppablePosition]
  );

  useEffect(() => {
    registerPositionUpdateListener(instanceId, updateDroppablePosition);
    return () => {
      unregisterPositionUpdateListener(instanceId);
    };
  }, [
    instanceId,
    registerPositionUpdateListener,
    unregisterPositionUpdateListener,
    updateDroppablePosition,
  ]);

  useEffect(() => {
    if (dropDisabled) {
      unregister(id);
    } else {
      // Initial registration or re-registration if it became enabled
      updateDroppablePosition();
    }
    // Not relying on isRegistered here for initial registration to ensure it always attempts
    // to register if not disabled. The measure call inside updateDroppablePosition is the gatekeeper.
  }, [
    dropDisabled,
    id,
    unregister, // only unregister is truly a dependency for the disabled case
    updateDroppablePosition, // for the enabled case
  ]);

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      unregister(id);
    };
  }, [id, unregister]);

  return {
    viewProps: {
      onLayout: handleLayoutHandler,
      style: combinedActiveStyle,
    },
    isActive,
    activeStyle,
    animatedViewRef,
  };
};
