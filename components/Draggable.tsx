import React, { createContext, useContext } from "react";
import { StyleProp, ViewStyle } from "react-native";
import Animated from "react-native-reanimated";
import { GestureDetector } from "react-native-gesture-handler";
import { useDraggable } from "../hooks/useDraggable";
import {
  DraggableState,
  DraggableContextValue,
  DraggableProps,
  HandleProps,
  UseDraggableOptions,
} from "../types/draggable";

// Re-export types if they're meant to be part of the public API of Draggable component
export { DraggableState };

const DraggableContext = createContext<DraggableContextValue | null>(null);

/**
 * A handle component that can be used within Draggable to create a specific
 * draggable area. When a Handle is present, only the handle area can initiate
 * dragging, while the rest of the draggable remains non-interactive for dragging.
 *
 * @param props - Props for the handle component
 *
 * @example
 * Basic drag handle:
 * ```typescript
 * <Draggable data={{ id: '1', name: 'Item 1' }}>
 *   <View style={styles.itemContent}>
 *     <Text>Item content (not draggable)</Text>
 *
 *     <Draggable.Handle style={styles.dragHandle}>
 *       <Icon name="drag-handle" size={20} />
 *     </Draggable.Handle>
 *   </View>
 * </Draggable>
 * ```
 *
 * @example
 * Custom styled handle:
 * ```typescript
 * <Draggable data={{ id: '2', type: 'card' }}>
 *   <View style={styles.card}>
 *     <Text style={styles.title}>Card Title</Text>
 *     <Text style={styles.content}>Card content...</Text>
 *
 *     <Draggable.Handle style={styles.customHandle}>
 *       <View style={styles.handleDots}>
 *         <View style={styles.dot} />
 *         <View style={styles.dot} />
 *         <View style={styles.dot} />
 *       </View>
 *     </Draggable.Handle>
 *   </View>
 * </Draggable>
 * ```
 */
const Handle = ({ children, style }: HandleProps) => {
  const draggableContext = useContext(DraggableContext);

  if (!draggableContext) {
    console.warn("Draggable.Handle must be used within a Draggable component");
    return <>{children}</>;
  }

  return (
    <GestureDetector gesture={draggableContext.gesture}>
      <Animated.View style={style}>{children}</Animated.View>
    </GestureDetector>
  );
};

/**
 * A versatile draggable component with advanced features like collision detection,
 * bounded dragging, axis constraints, and custom animations.
 *
 * The Draggable component provides a complete drag-and-drop solution that can be
 * used standalone or within a DropProvider context for drop zone interactions.
 * It supports both full-item dragging and handle-based dragging patterns.
 *
 * @template TData - The type of data associated with the draggable item
 * @param props - Configuration props for the draggable component
 */
const DraggableComponent = <TData = unknown,>({
  // Destructure component-specific props first
  style: componentStyle,
  children,
  // Collect all other props (which are now the modified UseDraggableOptions)
  ...useDraggableHookOptions
}: DraggableProps<TData>) => {
  const { animatedViewProps, gesture, state, animatedViewRef, hasHandle } =
    useDraggable({
      ...useDraggableHookOptions,
      children,
      handleComponent: Handle,
    } as UseDraggableOptions<TData>);

  // Create the context value
  const contextValue: DraggableContextValue = {
    gesture,
    state,
  };

  return (
    <DraggableContext.Provider value={contextValue}>
      {hasHandle ? (
        // When there's a handle, wrap in a regular Animated.View
        <Animated.View
          ref={animatedViewRef}
          style={[componentStyle, animatedViewProps.style]}
          onLayout={animatedViewProps.onLayout}
        >
          {children}
        </Animated.View>
      ) : (
        // When there's no handle, the entire component is draggable
        <GestureDetector gesture={gesture}>
          <Animated.View
            ref={animatedViewRef}
            style={[componentStyle, animatedViewProps.style]}
            onLayout={animatedViewProps.onLayout}
          >
            {children}
          </Animated.View>
        </GestureDetector>
      )}
    </DraggableContext.Provider>
  );
};

// Attach the Handle component as a static property
DraggableComponent.Handle = Handle;

// Export the component with proper typing
export const Draggable = DraggableComponent as typeof DraggableComponent & {
  Handle: typeof Handle;
};
