---
title: "Draggable"
---

The `Draggable` component makes any React Native component draggable with smooth animations, collision detection, and advanced features like handles, constraints, and custom animations.

## Overview

The Draggable component wraps your content and enables drag-and-drop functionality. It supports various features like collision detection, bounded dragging, axis constraints, custom animations, and drag handles for precise interaction control.

## Basic Usage

```tsx
import { Draggable } from "react-native-reanimated-dnd";

function MyDraggable() {
  return (
    <Draggable data={{ id: "1", name: "Item 1", type: "task" }}>
      <View style={styles.item}>
        <Text>Drag me!</Text>
      </View>
    </Draggable>
  );
}
```

## Props Reference

### Core Props

| Prop          | Type                   | Default        | Description                            |
| ------------- | ---------------------- | -------------- | -------------------------------------- |
| `data`        | `TData`                | **Required**   | Data payload passed to drop handlers   |
| `children`    | `ReactNode`            | **Required**   | Content to render inside the draggable |
| `draggableId` | `string`               | auto-generated | Unique identifier for the draggable    |
| `style`       | `StyleProp<ViewStyle>` | -              | Style for the container                |

### Interaction Props

| Prop            | Type                    | Default | Description                                 |
| --------------- | ----------------------- | ------- | ------------------------------------------- |
| `dragDisabled`  | `boolean`               | `false` | Whether dragging is disabled                |
| `onDragStart`   | `(data: TData) => void` | -       | Callback when dragging starts               |
| `onDragEnd`     | `(data: TData) => void` | -       | Callback when dragging ends                 |
| `onDragging`    | `(payload) => void`     | -       | Callback during dragging with position info |
| `onStateChange` | `(state) => void`       | -       | Callback when draggable state changes       |

### Advanced Props

| Prop                 | Type                   | Default       | Description                      |
| -------------------- | ---------------------- | ------------- | -------------------------------- |
| `animationFunction`  | `AnimationFunction`    | spring        | Custom animation function        |
| `dragBoundsRef`      | `RefObject<View>`      | -             | Bounds for constraining dragging |
| `dragAxis`           | `'x' \| 'y' \| 'both'` | `'both'`      | Axis constraints for movement    |
| `collisionAlgorithm` | `CollisionAlgorithm`   | `'intersect'` | Collision detection method       |

## Collision Algorithms

Choose the right collision detection algorithm for your use case:

### intersect (Default)

Best for general use cases and easy dropping:

```tsx
<Draggable
  data={data}
  collisionAlgorithm="intersect" // Any overlap triggers collision
>
  <TaskCard />
</Draggable>
```

### center

Best for precise positioning and slot-based interfaces:

```tsx
<Draggable
  data={data}
  collisionAlgorithm="center" // Center point must be over droppable
>
  <GamePiece />
</Draggable>
```

### contain

Best for strict containment requirements:

```tsx
<Draggable
  data={data}
  collisionAlgorithm="contain" // Entire item must be within droppable
>
  <FileIcon />
</Draggable>
```

## Examples

### Basic Draggable with Callbacks

```tsx
function TaskCard({ task }) {
  return (
    <Draggable
      data={task}
      onDragStart={(data) => {
        console.log("Started dragging:", data.title);
        // Show global drag feedback
        setDraggedItem(data);
        hapticFeedback();
      }}
      onDragEnd={(data) => {
        console.log("Finished dragging:", data.title);
        // Hide global drag feedback
        setDraggedItem(null);
      }}
      onDragging={({ x, y, tx, ty, itemData }) => {
        const currentX = x + tx;
        const currentY = y + ty;
        console.log(`${itemData.title} at (${currentX}, ${currentY})`);

        // Update cursor position or proximity indicators
        updateDragPosition(currentX, currentY);
      }}
      onStateChange={(state) => {
        if (state === DraggableState.DROPPED) {
          showSuccessAnimation();
        }
      }}
    >
      <View style={styles.taskCard}>
        <Text style={styles.title}>{task.title}</Text>
        <Text style={styles.priority}>{task.priority}</Text>
      </View>
    </Draggable>
  );
}
```

### Constrained Dragging

```tsx
function BoundedSlider() {
  const boundsRef = useRef(null);

  return (
    <View ref={boundsRef} style={styles.sliderContainer}>
      <Text>Horizontal Slider</Text>

      <Draggable
        data={{ value: 50 }}
        dragBoundsRef={boundsRef}
        dragAxis="x" // Only horizontal movement
        collisionAlgorithm="center"
        animationFunction={(toValue) => {
          "worklet";
          return withTiming(toValue, { duration: 200 });
        }}
      >
        <View style={styles.sliderThumb}>
          <Text>●</Text>
        </View>
      </Draggable>
    </View>
  );
}

const styles = StyleSheet.create({
  sliderContainer: {
    height: 60,
    backgroundColor: "#f0f0f0",
    borderRadius: 30,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  sliderThumb: {
    width: 40,
    height: 40,
    backgroundColor: "#007AFF",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});
```

### Draggable with Handle

```tsx
function CardWithHandle({ card }) {
  const [dragState, setDragState] = useState(DraggableState.IDLE);

  return (
    <Draggable
      data={card}
      onStateChange={setDragState}
      style={[
        styles.card,
        dragState === DraggableState.DRAGGING && styles.dragging,
      ]}
    >
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{card.title}</Text>
        <Text style={styles.cardDescription}>{card.description}</Text>

        {/* Only this handle can initiate dragging */}
        <Draggable.Handle style={styles.dragHandle}>
          <View style={styles.handleIcon}>
            <Text style={styles.handleText}>⋮⋮</Text>
          </View>
        </Draggable.Handle>
      </View>
    </Draggable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    margin: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dragging: {
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    transform: [{ scale: 1.05 }],
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,
  },
  cardDescription: {
    fontSize: 14,
    color: "#666",
    flex: 2,
  },
  dragHandle: {
    padding: 8,
    marginLeft: 8,
  },
  handleIcon: {
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  handleText: {
    fontSize: 16,
    color: "#999",
    fontWeight: "bold",
  },
});
```

### File Drag and Drop

```tsx
function FileItem({ file }) {
  const [isDragging, setIsDragging] = useState(false);

  return (
    <Draggable
      data={file}
      collisionAlgorithm="intersect"
      onDragStart={(data) => {
        setIsDragging(true);
        hapticFeedback();
        showDragOverlay(data);
      }}
      onDragEnd={(data) => {
        setIsDragging(false);
        hideDragOverlay();
      }}
      style={[styles.fileItem, isDragging && styles.draggingFile]}
    >
      <View style={styles.fileContent}>
        <Icon
          name={getFileIcon(file.type)}
          size={32}
          color={getFileColor(file.type)}
        />
        <View style={styles.fileInfo}>
          <Text style={styles.fileName}>{file.name}</Text>
          <Text style={styles.fileSize}>{formatFileSize(file.size)}</Text>
        </View>
        {isDragging && (
          <View style={styles.dragIndicator}>
            <Text style={styles.dragText}>Dragging...</Text>
          </View>
        )}
      </View>
    </Draggable>
  );
}
```

### Custom Animation Functions

```tsx
function AnimatedDraggable({ data }) {
  // Bounce animation
  const bounceAnimation = (toValue) => {
    "worklet";
    return withTiming(toValue, {
      duration: 600,
      easing: Easing.bounce,
    });
  };

  // Spring animation with custom config
  const customSpring = (toValue) => {
    "worklet";
    return withSpring(toValue, {
      damping: 15,
      stiffness: 150,
      mass: 1,
    });
  };

  // Sequence animation
  const sequenceAnimation = (toValue) => {
    "worklet";
    return withSequence(
      withTiming(toValue * 1.1, { duration: 100 }),
      withSpring(toValue, { damping: 12 })
    );
  };

  return (
    <Draggable
      data={data}
      animationFunction={bounceAnimation} // Try different animations
    >
      <View style={styles.animatedItem}>
        <Text>Custom Animation</Text>
      </View>
    </Draggable>
  );
}
```

## Draggable States

The component tracks three distinct states:

```tsx
enum DraggableState {
  IDLE = "IDLE", // At rest position
  DRAGGING = "DRAGGING", // Being actively dragged
  DROPPED = "DROPPED", // Successfully dropped
}
```

### State-based Styling

```tsx
function StatefulDraggable({ data }) {
  const [state, setState] = useState(DraggableState.IDLE);

  const getStateStyle = () => {
    switch (state) {
      case DraggableState.IDLE:
        return styles.idle;
      case DraggableState.DRAGGING:
        return styles.dragging;
      case DraggableState.DROPPED:
        return styles.dropped;
      default:
        return {};
    }
  };

  return (
    <Draggable
      data={data}
      onStateChange={setState}
      style={[styles.base, getStateStyle()]}
    >
      <View style={styles.content}>
        <Text>State: {state}</Text>
      </View>
    </Draggable>
  );
}
```

## Drag Handle Component

The `Draggable.Handle` component creates specific draggable areas:

### Handle Props

| Prop       | Type                   | Description                         |
| ---------- | ---------------------- | ----------------------------------- |
| `children` | `ReactNode`            | Content to render inside the handle |
| `style`    | `StyleProp<ViewStyle>` | Style for the handle container      |

### Handle Examples

```tsx
// Icon handle
<Draggable.Handle style={styles.iconHandle}>
  <Icon name="drag-handle" size={24} color="#666" />
</Draggable.Handle>

// Custom dots handle
<Draggable.Handle style={styles.dotsHandle}>
  <View style={styles.dotsContainer}>
    <View style={styles.dot} />
    <View style={styles.dot} />
    <View style={styles.dot} />
  </View>
</Draggable.Handle>

// Text handle
<Draggable.Handle style={styles.textHandle}>
  <Text style={styles.handleText}>≡</Text>
</Draggable.Handle>
```

## TypeScript Support

The Draggable component is fully typed with generic support:

```tsx
interface TaskData {
  id: string;
  title: string;
  priority: "low" | "medium" | "high";
  assignee?: string;
}

// Fully typed draggable
<Draggable<TaskData>
  data={taskData}
  onDragStart={(data: TaskData) => {
    // data is fully typed with TaskData properties
    console.log(data.title, data.priority);
  }}
>
  <TaskComponent />
</Draggable>;
```

## Performance Tips

- Use `React.memo` for draggable content that doesn't change frequently
- Avoid heavy computations in drag callbacks
- Use `useCallback` for stable callback references
- Consider virtualization for large lists of draggables

## Accessibility

The Draggable component supports accessibility features:

```tsx
<Draggable data={data} style={styles.accessibleDraggable}>
  <View
    accessible={true}
    accessibilityRole="button"
    accessibilityLabel={`Draggable item: ${data.title}`}
    accessibilityHint="Double tap and hold to drag this item"
  >
    <Text>{data.title}</Text>
  </View>
</Draggable>
```

## See Also

- [Droppable](./droppable) - Create drop zones for draggable items
- [useDraggable Hook](../hooks/useDraggable) - Underlying hook for custom implementations
- [Basic Concepts](../getting-started/basic-concepts) - Understanding collision detection and states
- [Examples](../examples/basic-drag-drop) - More comprehensive examples
