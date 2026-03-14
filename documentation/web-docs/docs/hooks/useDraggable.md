---
title: "useDraggable"
---

The `useDraggable` hook provides the core functionality for creating draggable components with advanced features like collision detection, bounded dragging, axis constraints, and custom animations.

## Overview

This hook handles gesture recognition, position tracking, collision detection with drop zones, and smooth animations. It's the foundation for the `Draggable` component and can be used to create custom draggable implementations.

## Basic Usage

```tsx
import { useDraggable } from "react-native-reanimated-dnd";
import { GestureDetector } from "react-native-gesture-handler";

function MyDraggable() {
  const { animatedViewProps, gesture, state } = useDraggable({
    data: { id: "1", name: "Draggable Item" },
    onDragStart: (data) => console.log("Started dragging:", data.name),
    onDragEnd: (data) => console.log("Finished dragging:", data.name),
  });

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View {...animatedViewProps}>
        <Text>Drag me!</Text>
      </Animated.View>
    </GestureDetector>
  );
}
```

## Parameters

### UseDraggableOptions&lt;TData&gt;

| Option               | Type                    | Default        | Description                          |
| -------------------- | ----------------------- | -------------- | ------------------------------------ |
| `data`               | `TData`                 | **Required**   | Data payload passed to drop handlers |
| `draggableId`        | `string`                | auto-generated | Unique identifier for the draggable  |
| `dragDisabled`       | `boolean`               | `false`        | Whether dragging is disabled         |
| `onDragStart`        | `(data: TData) => void` | -              | Callback when dragging starts        |
| `onDragEnd`          | `(data: TData) => void` | -              | Callback when dragging ends          |
| `onDragging`         | `(payload) => void`     | -              | Callback during dragging             |
| `onStateChange`      | `(state) => void`       | -              | Callback when state changes          |
| `animationFunction`  | `AnimationFunction`     | spring         | Custom animation function            |
| `dragBoundsRef`      | `RefObject<View>`       | -              | Bounds for constraining dragging     |
| `dragAxis`           | `'x' \| 'y' \| 'both'`  | `'both'`       | Axis constraints                     |
| `collisionAlgorithm` | `CollisionAlgorithm`    | `'intersect'`  | Collision detection method           |

### onDragging Payload

The `onDragging` callback receives an object with:

| Property   | Type     | Description           |
| ---------- | -------- | --------------------- |
| `x`        | `number` | Original X position   |
| `y`        | `number` | Original Y position   |
| `tx`       | `number` | Current X translation |
| `ty`       | `number` | Current Y translation |
| `itemData` | `TData`  | Associated data       |

## Return Value

### UseDraggableReturn

| Property                     | Type             | Description                           |
| ---------------------------- | ---------------- | ------------------------------------- |
| `animatedViewProps`          | `object`         | Props for the animated view           |
| `animatedViewProps.style`    | `AnimatedStyle`  | Animated transform styles             |
| `animatedViewProps.onLayout` | `function`       | Layout handler for measurements       |
| `gesture`                    | `GestureType`    | Pan gesture for drag handling         |
| `state`                      | `DraggableState` | Current draggable state               |
| `animatedViewRef`            | `AnimatedRef`    | Ref for the draggable view            |
| `hasHandle`                  | `boolean`        | Whether a handle component is present |

## Examples

### Basic Draggable with State Tracking

```tsx
function StatefulDraggable() {
  const [dragState, setDragState] = useState(DraggableState.IDLE);

  const { animatedViewProps, gesture } = useDraggable({
    data: { id: "1", type: "task" },
    onStateChange: setDragState,
    onDragging: ({ x, y, tx, ty, itemData }) => {
      const currentX = x + tx;
      const currentY = y + ty;
      console.log(`${itemData.type} at (${currentX}, ${currentY})`);
    },
  });

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        {...animatedViewProps}
        style={[
          animatedViewProps.style,
          styles.draggable,
          dragState === DraggableState.DRAGGING && styles.dragging,
        ]}
      >
        <Text>State: {dragState}</Text>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  draggable: {
    width: 100,
    height: 100,
    backgroundColor: "#3b82f6",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  dragging: {
    opacity: 0.8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
```

### Bounded Draggable with Custom Animation

```tsx
function BoundedDraggable() {
  const boundsRef = useRef<View>(null);

  const { animatedViewProps, gesture } = useDraggable({
    data: { id: "2", type: "bounded" },
    dragBoundsRef: boundsRef,
    dragAxis: "x", // Only horizontal movement
    animationFunction: (toValue) => {
      "worklet";
      return withTiming(toValue, {
        duration: 300,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
    },
    collisionAlgorithm: "center",
    onDragStart: (data) => {
      hapticFeedback();
      console.log("Started dragging bounded item");
    },
  });

  return (
    <View ref={boundsRef} style={styles.container}>
      <Text style={styles.label}>Horizontal Slider</Text>
      <GestureDetector gesture={gesture}>
        <Animated.View {...animatedViewProps} style={styles.slider}>
          <Text style={styles.sliderText}>●</Text>
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 60,
    backgroundColor: "#f0f0f0",
    borderRadius: 30,
    justifyContent: "center",
    paddingHorizontal: 20,
    marginVertical: 20,
  },
  label: {
    position: "absolute",
    top: -25,
    left: 0,
    fontSize: 14,
    color: "#666",
  },
  slider: {
    width: 40,
    height: 40,
    backgroundColor: "#007AFF",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  sliderText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
```

### Draggable with Collision Detection

```tsx
function CollisionDraggable() {
  const [collisionAlgorithm, setCollisionAlgorithm] =
    useState<CollisionAlgorithm>("intersect");
  const [collisionCount, setCollisionCount] = useState(0);

  const { animatedViewProps, gesture, state } = useDraggable({
    data: {
      id: "3",
      name: "Collision Test",
      algorithm: collisionAlgorithm,
    },
    collisionAlgorithm,
    onDragStart: (data) => {
      setCollisionCount(0);
      console.log(`Started dragging with ${data.algorithm} collision`);
    },
    onDragging: ({ itemData }) => {
      // This fires when hovering over droppables
      setCollisionCount((prev) => prev + 1);
    },
    onStateChange: (newState) => {
      if (newState === DraggableState.DROPPED) {
        showToast("Successfully dropped!");
      }
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.controls}>
        <Text style={styles.label}>Collision Algorithm:</Text>
        <Picker
          selectedValue={collisionAlgorithm}
          onValueChange={setCollisionAlgorithm}
          style={styles.picker}
        >
          <Picker.Item label="Intersect (Easy)" value="intersect" />
          <Picker.Item label="Center (Precise)" value="center" />
          <Picker.Item label="Contain (Strict)" value="contain" />
        </Picker>
      </View>

      <GestureDetector gesture={gesture}>
        <Animated.View
          {...animatedViewProps}
          style={[
            animatedViewProps.style,
            styles.draggable,
            getAlgorithmStyle(collisionAlgorithm),
          ]}
        >
          <Text style={styles.algorithmText}>
            {collisionAlgorithm.toUpperCase()}
          </Text>
          <Text style={styles.stateText}>State: {state}</Text>
          <Text style={styles.collisionText}>Collisions: {collisionCount}</Text>
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

function getAlgorithmStyle(algorithm: CollisionAlgorithm) {
  switch (algorithm) {
    case "center":
      return { backgroundColor: "#ef4444" }; // Red for precise
    case "contain":
      return { backgroundColor: "#f59e0b" }; // Orange for strict
    case "intersect":
    default:
      return { backgroundColor: "#10b981" }; // Green for easy
  }
}
```

### Advanced Draggable with Analytics

```tsx
function AnalyticsDraggable() {
  const [dragMetrics, setDragMetrics] = useState({
    dragCount: 0,
    totalDistance: 0,
    averageDuration: 0,
  });
  const dragStartTime = useRef<number>(0);
  const lastPosition = useRef({ x: 0, y: 0 });

  const { animatedViewProps, gesture } = useDraggable({
    data: {
      id: "4",
      type: "analytics",
      metrics: dragMetrics,
    },
    onDragStart: (data) => {
      dragStartTime.current = Date.now();
      lastPosition.current = { x: 0, y: 0 };

      // Analytics
      analytics.track("drag_start", {
        itemId: data.id,
        itemType: data.type,
        timestamp: dragStartTime.current,
      });
    },
    onDragging: ({ x, y, tx, ty, itemData }) => {
      const currentX = x + tx;
      const currentY = y + ty;
      const distance = Math.sqrt(
        Math.pow(currentX - lastPosition.current.x, 2) +
          Math.pow(currentY - lastPosition.current.y, 2)
      );

      setDragMetrics((prev) => ({
        ...prev,
        totalDistance: prev.totalDistance + distance,
      }));

      lastPosition.current = { x: currentX, y: currentY };
    },
    onDragEnd: (data) => {
      const duration = Date.now() - dragStartTime.current;

      setDragMetrics((prev) => {
        const newDragCount = prev.dragCount + 1;
        const newAverageDuration =
          (prev.averageDuration * prev.dragCount + duration) / newDragCount;

        return {
          dragCount: newDragCount,
          totalDistance: prev.totalDistance,
          averageDuration: newAverageDuration,
        };
      });

      // Analytics
      analytics.track("drag_end", {
        itemId: data.id,
        duration,
        distance: dragMetrics.totalDistance,
        timestamp: Date.now(),
      });
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.metrics}>
        <Text style={styles.metricText}>Drags: {dragMetrics.dragCount}</Text>
        <Text style={styles.metricText}>
          Distance: {Math.round(dragMetrics.totalDistance)}px
        </Text>
        <Text style={styles.metricText}>
          Avg Duration: {Math.round(dragMetrics.averageDuration)}ms
        </Text>
      </View>

      <GestureDetector gesture={gesture}>
        <Animated.View
          {...animatedViewProps}
          style={[animatedViewProps.style, styles.analyticsDraggable]}
        >
          <Text style={styles.title}>Analytics Draggable</Text>
          <Text style={styles.subtitle}>Tracking your drags</Text>
        </Animated.View>
      </GestureDetector>
    </View>
  );
}
```

### Custom Animation Functions

```tsx
function CustomAnimationDraggable() {
  const [animationType, setAnimationType] = useState<
    "spring" | "timing" | "bounce"
  >("spring");

  const getAnimationFunction = (type: string): AnimationFunction => {
    switch (type) {
      case "timing":
        return (toValue) => {
          "worklet";
          return withTiming(toValue, {
            duration: 400,
            easing: Easing.bezier(0.25, 0.1, 0.25, 1),
          });
        };
      case "bounce":
        return (toValue) => {
          "worklet";
          return withTiming(toValue, {
            duration: 800,
            easing: Easing.bounce,
          });
        };
      case "spring":
      default:
        return (toValue) => {
          "worklet";
          return withSpring(toValue, {
            damping: 15,
            stiffness: 150,
            mass: 1,
          });
        };
    }
  };

  const { animatedViewProps, gesture } = useDraggable({
    data: { id: "5", animationType },
    animationFunction: getAnimationFunction(animationType),
    onDragEnd: () => {
      console.log(`Dropped with ${animationType} animation`);
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.animationControls}>
        <Text style={styles.label}>Animation Type:</Text>
        {["spring", "timing", "bounce"].map((type) => (
          <Pressable
            key={type}
            style={[
              styles.animationButton,
              animationType === type && styles.activeButton,
            ]}
            onPress={() => setAnimationType(type as any)}
          >
            <Text
              style={[
                styles.buttonText,
                animationType === type && styles.activeButtonText,
              ]}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Text>
          </Pressable>
        ))}
      </View>

      <GestureDetector gesture={gesture}>
        <Animated.View
          {...animatedViewProps}
          style={[animatedViewProps.style, styles.animationDraggable]}
        >
          <Text style={styles.animationText}>
            {animationType.toUpperCase()}
          </Text>
          <Text style={styles.animationSubtext}>
            Drag and release to see animation
          </Text>
        </Animated.View>
      </GestureDetector>
    </View>
  );
}
```

## Draggable States

The hook tracks three distinct states through the `DraggableState` enum:

```tsx
enum DraggableState {
  IDLE = "IDLE", // At rest position
  DRAGGING = "DRAGGING", // Being actively dragged
  DROPPED = "DROPPED", // Successfully dropped
}
```

### State Transitions

- **IDLE → DRAGGING**: When user starts dragging
- **DRAGGING → DROPPED**: When successfully dropped on a droppable
- **DRAGGING → IDLE**: When drag ends without successful drop
- **DROPPED → IDLE**: When animation completes and item returns to position

## Collision Algorithms

### intersect (Default)

- **Use case**: General drag-and-drop, easy dropping
- **Behavior**: Collision detected when any part overlaps
- **Best for**: File uploads, general item moving

### center

- **Use case**: Precise positioning, slot-based interfaces
- **Behavior**: Collision detected when center point is over droppable
- **Best for**: Games, precise placement, grid layouts

### contain

- **Use case**: Strict containment requirements
- **Behavior**: Collision detected when entire item is within droppable
- **Best for**: Folder systems, strict boundaries

## Performance Tips

- Use `useCallback` for stable callback references
- Avoid heavy computations in `onDragging` callback
- Consider debouncing analytics or logging in callbacks
- Use `React.memo` for draggable content that doesn't change frequently

## TypeScript Support

The hook is fully typed with generic support:

```tsx
interface TaskData {
  id: string;
  title: string;
  priority: "low" | "medium" | "high";
}

// Fully typed hook usage
const { animatedViewProps, gesture } = useDraggable<TaskData>({
  data: taskData,
  onDragStart: (data: TaskData) => {
    // data is fully typed with TaskData properties
    console.log(data.title, data.priority);
  },
});
```

## Context Integration

The hook automatically integrates with the drag-and-drop context when used within a `DropProvider`:

```tsx
<DropProvider>
  <CustomDraggableComponent />
</DropProvider>
```

## See Also

- [Draggable Component](../components/draggable) - High-level component using this hook
- [useDroppable](./useDroppable) - Hook for creating drop zones
- [Basic Concepts](../getting-started/basic-concepts) - Understanding collision detection and states
- [Examples](../examples/basic-drag-drop) - More comprehensive examples
