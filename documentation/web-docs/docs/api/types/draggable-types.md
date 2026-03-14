---
sidebar_position: 1
---

# Draggable Types

Complete type definitions for draggable components and hooks.

## Enums

### DraggableState

Represents the different states a draggable item can be in.

```tsx
enum DraggableState {
  /** Item is at rest in its original or dropped position */
  IDLE = "IDLE",
  /** Item is currently being dragged by the user */
  DRAGGING = "DRAGGING",
  /** Item has been successfully dropped on a valid drop zone */
  DROPPED = "DROPPED",
}
```

#### Usage Example

```tsx
import { DraggableState } from "react-native-reanimated-dnd";

const handleStateChange = (state: DraggableState) => {
  switch (state) {
    case DraggableState.IDLE:
      console.log("Item is at rest");
      break;
    case DraggableState.DRAGGING:
      console.log("Item is being dragged");
      break;
    case DraggableState.DROPPED:
      console.log("Item was successfully dropped");
      break;
  }
};
```

## Type Aliases

### AnimationFunction

Custom animation function type for controlling how draggable items animate.

```tsx
type AnimationFunction = (toValue: number) => number;
```

#### Parameters

- `toValue` (`number`): The target value to animate to

#### Returns

- `number`: The animated value (typically from withSpring, withTiming, etc.)

#### Example

```tsx
import { withTiming, Easing } from "react-native-reanimated";

const customAnimation: AnimationFunction = (toValue) => {
  "worklet";
  return withTiming(toValue, {
    duration: 500,
    easing: Easing.bounce,
  });
};
```

### CollisionAlgorithm

Collision detection algorithms for determining when a draggable overlaps with a droppable.

```tsx
type CollisionAlgorithm = "center" | "intersect" | "contain";
```

#### Values

- **`center`**: Collision detected when the center point of the draggable is over the droppable
- **`intersect`**: Collision detected when any part of the draggable overlaps with the droppable (default)
- **`contain`**: Collision detected when the entire draggable is contained within the droppable

#### Usage Examples

```tsx
// For precise dropping, use center collision
const preciseDraggable = useDraggable({
  data: myData,
  collisionAlgorithm: "center",
});

// For easy dropping, use intersect (default)
const easyDraggable = useDraggable({
  data: myData,
  collisionAlgorithm: "intersect",
});

// For strict containment, use contain
const strictDraggable = useDraggable({
  data: myData,
  collisionAlgorithm: "contain",
});
```

## Interfaces

### UseDraggableOptions\<TData\>

Configuration options for the useDraggable hook.

```tsx
interface UseDraggableOptions<TData = unknown> {
  data: TData;
  draggableId?: string;
  dragDisabled?: boolean;
  preDragDelay?: number;
  onDragStart?: (data: TData) => void;
  onDragEnd?: (data: TData) => void;
  onDragging?: (payload: DraggingPayload<TData>) => void;
  onStateChange?: (state: DraggableState) => void;
  animationFunction?: AnimationFunction;
  dragBoundsRef?: React.RefObject<Animated.View | View>;
  dragAxis?: "x" | "y" | "both";
  collisionAlgorithm?: CollisionAlgorithm;
}
```

#### Properties

##### data

- **Type**: `TData`
- **Required**: Yes
- **Description**: Data payload associated with this draggable item. This data is passed to drop handlers when the item is successfully dropped.

```tsx
const data = { id: "1", name: "Task 1", priority: "high" };
```

##### draggableId

- **Type**: `string`
- **Required**: No
- **Description**: Unique identifier for this draggable item. If not provided, one will be generated automatically.

##### dragDisabled

- **Type**: `boolean`
- **Default**: `false`
- **Description**: Whether dragging is disabled for this item. When true, the item cannot be dragged.

##### preDragDelay

- **Type**: `number`
- **Default**: `0`
- **Description**: Delay in milliseconds before dragging starts. Useful for preventing accidental drags.

```tsx
const handlePressDelay = useDraggable({
  data: myData,
  preDragDelay: 200, // 200ms delay before drag activates
});
```

##### onDragStart

- **Type**: `(data: TData) => void`
- **Required**: No
- **Description**: Callback fired when dragging starts.

```tsx
const handleDragStart = (data) => {
  console.log("Started dragging:", data.name);
  setIsDragging(true);
};
```

##### onDragEnd

- **Type**: `(data: TData) => void`
- **Required**: No
- **Description**: Callback fired when dragging ends (regardless of whether it was dropped successfully).

```tsx
const handleDragEnd = (data) => {
  console.log("Finished dragging:", data.name);
  setIsDragging(false);
};
```

##### onDragging

- **Type**: `(payload: DraggingPayload<TData>) => void`
- **Required**: No
- **Description**: Callback fired continuously while dragging. Useful for real-time feedback.

```tsx
const handleDragging = ({ x, y, tx, ty, itemData }) => {
  const currentX = x + tx;
  const currentY = y + ty;
  console.log(`${itemData.name} is at (${currentX}, ${currentY})`);
};
```

##### onStateChange

- **Type**: `(state: DraggableState) => void`
- **Required**: No
- **Description**: Callback fired when the draggable state changes.

```tsx
const handleStateChange = (state) => {
  if (state === DraggableState.DROPPED) {
    showSuccessMessage();
  }
};
```

##### animationFunction

- **Type**: `AnimationFunction`
- **Required**: No
- **Description**: Custom animation function for controlling how the item animates when dropped. If not provided, uses default spring animation.

```tsx
const bounceAnimation = (toValue) => {
  "worklet";
  return withTiming(toValue, {
    duration: 600,
    easing: Easing.bounce,
  });
};
```

##### dragBoundsRef

- **Type**: `React.RefObject<Animated.View | View>`
- **Required**: No
- **Description**: Reference to a View that defines the dragging boundaries. The draggable item will be constrained within this view's bounds.

```tsx
const boundsRef = useRef<View>(null);

return (
  <View ref={boundsRef} style={styles.container}>
    <Draggable dragBoundsRef={boundsRef} data={data}>
      <Text>Bounded draggable</Text>
    </Draggable>
  </View>
);
```

##### dragAxis

- **Type**: `"x" | "y" | "both"`
- **Default**: `"both"`
- **Description**: Constrains dragging to a specific axis.

```tsx
// Horizontal slider
const horizontalDraggable = useDraggable({
  data: sliderData,
  dragAxis: "x",
});

// Vertical slider
const verticalDraggable = useDraggable({
  data: sliderData,
  dragAxis: "y",
});
```

##### collisionAlgorithm

- **Type**: `CollisionAlgorithm`
- **Default**: `"intersect"`
- **Description**: Algorithm used for collision detection with drop zones.

### UseDraggableReturn

Return value from the useDraggable hook.

```tsx
interface UseDraggableReturn {
  animatedViewProps: {
    style: AnimatedStyle<ViewStyle>;
    onLayout: (event: LayoutChangeEvent) => void;
  };
  gesture: GestureType;
  state: DraggableState;
  animatedViewRef: ReturnType<typeof useAnimatedRef<Animated.View>>;
  hasHandle: boolean;
}
```

#### Properties

##### animatedViewProps

- **Type**: `{ style: AnimatedStyle<ViewStyle>; onLayout: (event: LayoutChangeEvent) => void; }`
- **Description**: Props to spread on the animated view that will be draggable. Contains the animated style and layout handler.

##### gesture

- **Type**: `GestureType`
- **Description**: Gesture object to attach to GestureDetector for handling drag interactions. Only used when no handle is present (entire component is draggable).

##### state

- **Type**: `DraggableState`
- **Description**: Current state of the draggable item.

##### animatedViewRef

- **Type**: `ReturnType<typeof useAnimatedRef<Animated.View>>`
- **Description**: Animated ref for the draggable view. Used internally for measurements.

##### hasHandle

- **Type**: `boolean`
- **Description**: Whether this draggable has a handle component. When true, only the handle can initiate dragging. When false, the entire component is draggable.

### DraggingPayload\<TData\>

Payload object passed to the onDragging callback.

```tsx
interface DraggingPayload<TData = unknown> {
  x: number; // Original X position
  y: number; // Original Y position
  tx: number; // Current X translation
  ty: number; // Current Y translation
  itemData: TData; // Data associated with the draggable item
}
```

#### Properties

- **`x`**: Original X position of the item
- **`y`**: Original Y position of the item
- **`tx`**: Current X translation from original position
- **`ty`**: Current Y translation from original position
- **`itemData`**: The data associated with the draggable item

### DraggableContextValue

Context value for draggable components (used internally).

```tsx
interface DraggableContextValue {
  gesture: any;
  state: DraggableState;
}
```

### DraggableProps\<TData\>

Props for the Draggable component.

```tsx
interface DraggableProps<TData = unknown> extends UseDraggableOptions<TData> {
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
  onStateChange?: (state: DraggableState) => void;
}
```

#### Properties

##### style

- **Type**: `StyleProp<ViewStyle>`
- **Required**: No
- **Description**: Style to apply to the draggable container.

##### children

- **Type**: `React.ReactNode`
- **Required**: Yes
- **Description**: The content to render inside the draggable.

##### onStateChange

- **Type**: `(state: DraggableState) => void`
- **Required**: No
- **Description**: Callback fired when the draggable state changes.

### DraggableHandleProps

Props for the DraggableHandle component.

```tsx
interface DraggableHandleProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}
```

#### Properties

##### children

- **Type**: `React.ReactNode`
- **Required**: Yes
- **Description**: The content to render inside the handle.

##### style

- **Type**: `StyleProp<ViewStyle>`
- **Required**: No
- **Description**: Optional style to apply to the handle.

## Usage Examples

### Basic Draggable

```tsx
import { useDraggable, DraggableState } from "react-native-reanimated-dnd";

interface TaskData {
  id: string;
  title: string;
  priority: "low" | "medium" | "high";
}

function TaskItem({ task }: { task: TaskData }) {
  const { animatedViewProps, gesture, state } = useDraggable({
    data: task,
    onDragStart: (data) => console.log("Started dragging:", data.title),
    onDragEnd: (data) => console.log("Finished dragging:", data.title),
    onStateChange: (state) => {
      if (state === DraggableState.DROPPED) {
        showSuccessAnimation();
      }
    },
  });

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View {...animatedViewProps}>
        <Text>{task.title}</Text>
        <Text>Priority: {task.priority}</Text>
      </Animated.View>
    </GestureDetector>
  );
}
```

### Draggable with Handle

```tsx
import { Draggable, DraggableHandle } from "react-native-reanimated-dnd";

function TaskCard({ task }: { task: TaskData }) {
  return (
    <Draggable data={task}>
      <View style={styles.card}>
        <DraggableHandle style={styles.handle}>
          <Icon name="drag-handle" size={20} />
        </DraggableHandle>
        <View style={styles.content}>
          <Text>{task.title}</Text>
          <Text>{task.description}</Text>
        </View>
      </View>
    </Draggable>
  );
}
```

### Bounded Draggable

```tsx
function BoundedDraggable() {
  const boundsRef = useRef<View>(null);

  return (
    <View ref={boundsRef} style={styles.container}>
      <Draggable
        data={{ id: "1", name: "Bounded Item" }}
        dragBoundsRef={boundsRef}
        dragAxis="x"
      >
        <View style={styles.slider}>
          <Text>Drag me horizontally</Text>
        </View>
      </Draggable>
    </View>
  );
}
```

### Custom Animation

```tsx
import { withSpring, withTiming, Easing } from "react-native-reanimated";

const customBounce: AnimationFunction = (toValue) => {
  "worklet";
  return withSpring(toValue, {
    damping: 10,
    stiffness: 100,
    mass: 1,
  });
};

const customTiming: AnimationFunction = (toValue) => {
  "worklet";
  return withTiming(toValue, {
    duration: 800,
    easing: Easing.elastic(2),
  });
};

function AnimatedDraggable() {
  return (
    <Draggable data={{ id: "1" }} animationFunction={customBounce}>
      <Text>Bouncy draggable</Text>
    </Draggable>
  );
}
```

## See Also

- [Draggable Component](../../components/draggable) - Component documentation
- [useDraggable Hook](../../hooks/useDraggable) - Hook documentation
- [Droppable Types](./droppable-types) - Related droppable types
- [Context Types](./context-types) - Context-related types
