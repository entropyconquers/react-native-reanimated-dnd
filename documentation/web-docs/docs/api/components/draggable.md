---
title: "Draggable Component"
---

A versatile draggable component with advanced features like collision detection, bounded dragging, axis constraints, and custom animations.

## Overview

The `Draggable` component provides a complete drag-and-drop solution that can be used standalone or within a `DropProvider` context for drop zone interactions. It supports both full-item dragging and handle-based dragging patterns.

## Import

```tsx
import { Draggable } from "react-native-reanimated-dnd";
```

## Props

### Core Props

#### data

- **Type**: `TData`
- **Required**: Yes
- **Description**: Data payload associated with this draggable item. This data is passed to drop handlers when the item is successfully dropped.

```tsx
const taskData = { id: "1", title: "Complete project", priority: "high" };

<Draggable data={taskData}>
  <Text>Drag me!</Text>
</Draggable>;
```

#### children

- **Type**: `React.ReactNode`
- **Required**: Yes
- **Description**: The content to render inside the draggable component.

#### style

- **Type**: `StyleProp<ViewStyle>`
- **Required**: No
- **Description**: Style to apply to the draggable container.

```tsx
<Draggable
  data={data}
  style={[styles.draggableItem, { backgroundColor: "#f0f0f0" }]}
>
  <Text>Styled draggable</Text>
</Draggable>
```

### Interaction Props

#### dragDisabled

- **Type**: `boolean`
- **Default**: `false`
- **Description**: Whether dragging is disabled for this item. When true, the item cannot be dragged.

```tsx
<Draggable data={data} dragDisabled={!user.canDrag}>
  <Text>Conditionally draggable</Text>
</Draggable>
```

#### draggableId

- **Type**: `string`
- **Required**: No
- **Description**: Unique identifier for this draggable item. If not provided, one will be generated automatically.

### Callback Props

#### onDragStart

- **Type**: `(data: TData) => void`
- **Required**: No
- **Description**: Callback fired when dragging starts.

```tsx
<Draggable
  data={data}
  onDragStart={(data) => {
    console.log("Started dragging:", data.title);
    hapticFeedback();
  }}
>
  <Text>Drag me!</Text>
</Draggable>
```

#### onDragEnd

- **Type**: `(data: TData) => void`
- **Required**: No
- **Description**: Callback fired when dragging ends (regardless of whether it was dropped successfully).

```tsx
<Draggable
  data={data}
  onDragEnd={(data) => {
    console.log("Finished dragging:", data.title);
    setIsDragging(false);
  }}
>
  <Text>Drag me!</Text>
</Draggable>
```

#### onDragging

- **Type**: `(payload: DraggingPayload<TData>) => void`
- **Required**: No
- **Description**: Callback fired continuously while dragging. Useful for real-time feedback.

```tsx
<Draggable
  data={data}
  onDragging={({ x, y, tx, ty, itemData }) => {
    const currentX = x + tx;
    const currentY = y + ty;
    console.log(`${itemData.title} is at (${currentX}, ${currentY})`);
  }}
>
  <Text>Drag me!</Text>
</Draggable>
```

#### onStateChange

- **Type**: `(state: DraggableState) => void`
- **Required**: No
- **Description**: Callback fired when the draggable state changes.

```tsx
<Draggable
  data={data}
  onStateChange={(state) => {
    if (state === DraggableState.DROPPED) {
      showSuccessMessage();
    }
  }}
>
  <Text>Drag me!</Text>
</Draggable>
```

### Advanced Props

#### animationFunction

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

<Draggable data={data} animationFunction={bounceAnimation}>
  <Text>Bouncy draggable</Text>
</Draggable>;
```

#### dragBoundsRef

- **Type**: `React.RefObject<Animated.View | View>`
- **Required**: No
- **Description**: Reference to a View that defines the dragging boundaries. The draggable item will be constrained within this view's bounds.

```tsx
const boundsRef = useRef<View>(null);

return (
  <View ref={boundsRef} style={styles.container}>
    <Draggable data={data} dragBoundsRef={boundsRef}>
      <Text>Bounded draggable</Text>
    </Draggable>
  </View>
);
```

#### dragAxis

- **Type**: `"x" | "y" | "both"`
- **Default**: `"both"`
- **Description**: Constrains dragging to a specific axis.

```tsx
// Horizontal slider
<Draggable
  data={data}
  dragAxis="x"
>
  <Text>Horizontal only</Text>
</Draggable>

// Vertical slider
<Draggable
  data={data}
  dragAxis="y"
>
  <Text>Vertical only</Text>
</Draggable>
```

#### collisionAlgorithm

- **Type**: `CollisionAlgorithm`
- **Default**: `"intersect"`
- **Description**: Algorithm used for collision detection with drop zones.

Available algorithms:

- `intersect`: Collision when any part overlaps (default)
- `center`: Collision when center point is over droppable
- `contain`: Collision when entire draggable is contained

```tsx
<Draggable data={data} collisionAlgorithm="center">
  <Text>Precise dropping</Text>
</Draggable>
```

## Draggable.Handle

A handle component that can be used within `Draggable` to create a specific draggable area. When a Handle is present, only the handle area can initiate dragging.

### Props

#### children

- **Type**: `React.ReactNode`
- **Required**: Yes
- **Description**: The content to render inside the handle.

#### style

- **Type**: `StyleProp<ViewStyle>`
- **Required**: No
- **Description**: Optional style to apply to the handle.

### Handle Examples

```tsx
// Basic drag handle
<Draggable data={data}>
  <View style={styles.itemContent}>
    <Text>Item content (not draggable)</Text>

    <Draggable.Handle style={styles.dragHandle}>
      <Icon name="drag-handle" size={20} />
    </Draggable.Handle>
  </View>
</Draggable>

// Custom styled handle
<Draggable data={data}>
  <View style={styles.card}>
    <Text style={styles.title}>Card Title</Text>
    <Text style={styles.content}>Card content...</Text>

    <Draggable.Handle style={styles.customHandle}>
      <View style={styles.handleDots}>
        <View style={styles.dot} />
        <View style={styles.dot} />
        <View style={styles.dot} />
      </View>
    </Draggable.Handle>
  </View>
</Draggable>
```

## Usage Examples

### Basic Draggable

```tsx
import { Draggable, DraggableState } from "react-native-reanimated-dnd";

function TaskItem({ task }) {
  return (
    <Draggable
      data={task}
      onDragStart={(data) => console.log("Started dragging:", data.title)}
      onDragEnd={(data) => console.log("Finished dragging:", data.title)}
    >
      <View style={styles.taskItem}>
        <Text>{task.title}</Text>
        <Text>Priority: {task.priority}</Text>
      </View>
    </Draggable>
  );
}
```

### Draggable with Handle

```tsx
function TaskCard({ task }) {
  return (
    <Draggable data={task}>
      <View style={styles.card}>
        <Draggable.Handle style={styles.handle}>
          <Icon name="drag-handle" size={20} />
        </Draggable.Handle>

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

### State-Aware Draggable

```tsx
function StatefulDraggable({ task }) {
  const [dragState, setDragState] = useState(DraggableState.IDLE);

  return (
    <Draggable
      data={task}
      onStateChange={setDragState}
      style={[
        styles.item,
        dragState === DraggableState.DRAGGING && styles.dragging,
        dragState === DraggableState.DROPPED && styles.dropped,
      ]}
    >
      <View style={styles.content}>
        <Text>{task.title}</Text>
        <Text>State: {dragState}</Text>
      </View>
    </Draggable>
  );
}
```

### Custom Animation

```tsx
import { withSpring, withTiming, Easing } from "react-native-reanimated";

const customBounce = (toValue) => {
  "worklet";
  return withSpring(toValue, {
    damping: 10,
    stiffness: 100,
    mass: 1,
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

### File Drag and Drop

```tsx
import { GestureHandlerRootView } from "react-native-gesture-handler";

function FileDragDrop() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <DropProvider>
        <View style={styles.content}>
          <Draggable
            data={{ id: "1", type: "file", name: "document.pdf" }}
            collisionAlgorithm="intersect"
            onDragStart={(data) => {
              hapticFeedback();
              setDraggedFile(data);
            }}
            onDragEnd={(data) => {
              setDraggedFile(null);
            }}
          >
            <View style={styles.fileItem}>
              <Icon name="file-pdf" size={24} />
              <Text>{data.name}</Text>
            </View>
          </Draggable>

          <Droppable
            onDrop={(data) => {
              console.log("File dropped:", data.name);
              moveToTrash(data.id);
            }}
          >
            <View style={styles.trashZone}>
              <Icon name="trash" size={32} />
              <Text>Drop files here to delete</Text>
            </View>
          </Droppable>
        </View>
      </DropProvider>
    </GestureHandlerRootView>
  );
}
```

### Conditional Dragging

```tsx
function ConditionalDraggable({ item, canDrag }) {
  return (
    <Draggable
      data={item}
      dragDisabled={!canDrag}
      onDragStart={(data) => {
        if (data.locked) {
          showError("This item is locked");
          return;
        }
        analytics.track("drag_start", { itemId: data.id });
      }}
      style={[styles.item, !canDrag && styles.disabled]}
    >
      <View style={styles.itemContent}>
        <Text style={styles.itemTitle}>{item.title}</Text>
        {item.locked && <Icon name="lock" size={16} />}
        {!canDrag && <Text style={styles.disabledText}>Drag disabled</Text>}
      </View>
    </Draggable>
  );
}
```

## TypeScript Support

The component is fully typed with generic support:

```tsx
interface TaskData {
  id: string;
  title: string;
  priority: "low" | "medium" | "high";
}

function TypedDraggable() {
  return (
    <Draggable<TaskData>
      data={{ id: "1", title: "Task 1", priority: "high" }}
      onDragStart={(data: TaskData) => {
        // data is properly typed
        console.log(`Started dragging: ${data.title}`);
      }}
    >
      <Text>Typed draggable</Text>
    </Draggable>
  );
}
```

## Performance Tips

1. **Use `useCallback`** for event handlers to prevent unnecessary re-renders
2. **Memoize expensive calculations** with `useMemo`
3. **Use handles** for large draggable components to improve performance
4. **Throttle position updates** in `onDragging` callbacks

## Accessibility

- The component automatically handles accessibility for drag operations
- Provide meaningful content for screen readers
- Consider alternative interaction methods for users with disabilities

## See Also

- [useDraggable Hook](../../hooks/useDraggable) - Underlying hook implementation
- [Droppable Component](./droppable) - Drop zone component
- [DraggableState](../types/enums#draggablestate) - State management
- [CollisionAlgorithm](../types/draggable-types#collisionalgorithm) - Collision detection
