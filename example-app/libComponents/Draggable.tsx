// Node Modules
import React, { useRef, createContext, useContext, useState } from "react";
import { ViewStyle, StyleProp } from "react-native";
import Animated from "react-native-reanimated";
import { GestureDetector } from "react-native-gesture-handler";
import { useDraggable } from "../hooks/useDraggable";
import {
  UseDraggableOptions,
  CollisionAlgorithm,
  DraggableState,
  DraggableContextValue,
  DraggableHandleProps,
  DraggableProps,
} from "../types/draggable";

// Create a context to share gesture and state between Draggable and Handle
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
const Handle = ({ children, style }: DraggableHandleProps) => {
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
 *
 * @example
 * Basic draggable item:
 * ```typescript
 * import { Draggable } from './components/Draggable';
 *
 * function BasicDraggable() {
 *   return (
 *     <Draggable
 *       data={{ id: '1', name: 'Draggable Item', type: 'task' }}
 *       onDragStart={(data) => console.log('Started dragging:', data.name)}
 *       onDragEnd={(data) => console.log('Finished dragging:', data.name)}
 *     >
 *       <View style={styles.item}>
 *         <Text>Drag me anywhere!</Text>
 *       </View>
 *     </Draggable>
 *   );
 * }
 * ```
 *
 * @example
 * Draggable with custom animation and constraints:
 * ```typescript
 * function ConstrainedDraggable() {
 *   const boundsRef = useRef<View>(null);
 *
 *   return (
 *     <View ref={boundsRef} style={styles.container}>
 *       <Draggable
 *         data={{ id: '2', category: 'bounded' }}
 *         dragBoundsRef={boundsRef}
 *         dragAxis="x" // Only horizontal movement
 *         animationFunction={(toValue) => {
 *           'worklet';
 *           return withTiming(toValue, { duration: 300 });
 *         }}
 *         collisionAlgorithm="center"
 *         style={styles.draggableItem}
 *       >
 *         <View style={styles.slider}>
 *           <Text>Horizontal Slider</Text>
 *         </View>
 *       </Draggable>
 *     </View>
 *   );
 * }
 * ```
 *
 * @example
 * Draggable with handle and state tracking:
 * ```typescript
 * function HandleDraggable() {
 *   const [dragState, setDragState] = useState(DraggableState.IDLE);
 *
 *   return (
 *     <Draggable
 *       data={{ id: '3', title: 'Card with Handle' }}
 *       onStateChange={setDragState}
 *       onDragging={({ x, y, tx, ty }) => {
 *         console.log(`Position: (${x + tx}, ${y + ty})`);
 *       }}
 *       style={[
 *         styles.card,
 *         dragState === DraggableState.DRAGGING && styles.dragging
 *       ]}
 *     >
 *       <View style={styles.cardContent}>
 *         <Text style={styles.cardTitle}>Card Title</Text>
 *         <Text style={styles.cardBody}>
 *           This card can only be dragged by its handle.
 *         </Text>
 *
 *         <Draggable.Handle style={styles.dragHandle}>
 *           <View style={styles.handleIcon}>
 *             <Text>⋮⋮</Text>
 *           </View>
 *         </Draggable.Handle>
 *       </View>
 *     </Draggable>
 *   );
 * }
 * ```
 *
 * @example
 * Draggable with collision detection and drop zones:
 * ```typescript
 * function DragDropExample() {
 *   return (
 *     <DropProvider>
 *       <View style={styles.container}>
 *         <Draggable
 *           data={{ id: '4', type: 'file', name: 'document.pdf' }}
 *           collisionAlgorithm="intersect"
 *           onDragStart={(data) => {
 *             hapticFeedback();
 *             setDraggedItem(data);
 *           }}
 *           onDragEnd={(data) => {
 *             setDraggedItem(null);
 *           }}
 *         >
 *           <View style={styles.fileItem}>
 *             <Icon name="file-pdf" size={24} />
 *             <Text>{data.name}</Text>
 *           </View>
 *         </Draggable>
 *
 *         <Droppable
 *           onDrop={(data) => {
 *             console.log('File dropped:', data.name);
 *             moveToTrash(data.id);
 *           }}
 *         >
 *           <View style={styles.trashZone}>
 *             <Icon name="trash" size={32} />
 *             <Text>Drop files here to delete</Text>
 *           </View>
 *         </Droppable>
 *       </View>
 *     </DropProvider>
 *   );
 * }
 * ```
 *
 * @example
 * Draggable with disabled state and conditional behavior:
 * ```typescript
 * function ConditionalDraggable({ item, canDrag }) {
 *   return (
 *     <Draggable
 *       data={item}
 *       dragDisabled={!canDrag}
 *       onDragStart={(data) => {
 *         if (data.locked) {
 *           showError('This item is locked');
 *           return;
 *         }
 *         analytics.track('drag_start', { itemId: data.id });
 *       }}
 *       style={[
 *         styles.item,
 *         !canDrag && styles.disabled
 *       ]}
 *     >
 *       <View style={styles.itemContent}>
 *         <Text style={styles.itemTitle}>{item.title}</Text>
 *         {item.locked && <Icon name="lock" size={16} />}
 *         {!canDrag && <Text style={styles.disabledText}>Drag disabled</Text>}
 *       </View>
 *     </Draggable>
 *   );
 * }
 * ```
 *
 * @see {@link Draggable.Handle} for creating drag handles
 * @see {@link useDraggable} for the underlying hook
 * @see {@link Droppable} for drop zone components
 * @see {@link DraggableState} for state management
 * @see {@link CollisionAlgorithm} for collision detection options
 * @see {@link UseDraggableOptions} for configuration options
 * @see {@link UseDraggableReturn} for hook return details
 * @see {@link DropProvider} for drag-and-drop context setup
 */
const DraggableComponent = <TData = unknown,>({
  // Destructure component-specific props first
  style: componentStyle,
  children,
  // Collect all other props (which are now the modified UseDraggableOptions)
  ...useDraggableHookOptions
}: DraggableProps<TData>) => {
  // Pass the collected useDraggableHookOptions object directly to the hook
  // Also pass children and Handle component reference for handle detection
  const { animatedViewProps, gesture, state, hasHandle, animatedViewRef } =
    useDraggable<TData>({
      ...useDraggableHookOptions,
      children,
      handleComponent: Handle,
    });

  // Create the context value
  const contextValue: DraggableContextValue = {
    gesture,
    state,
  };

  // Render the component
  const content = (
    <Animated.View
      ref={animatedViewRef}
      {...animatedViewProps}
      style={[componentStyle, animatedViewProps.style]}
      collapsable={false}
    >
      <DraggableContext.Provider value={contextValue}>
        {children}
      </DraggableContext.Provider>
    </Animated.View>
  );

  // If a handle is found, let the handle control the dragging
  // Otherwise, the entire component is draggable
  if (hasHandle) {
    return content;
  } else {
    return <GestureDetector gesture={gesture}>{content}</GestureDetector>;
  }
};

// Attach the Handle as a static property
export const Draggable = Object.assign(DraggableComponent, { Handle });
