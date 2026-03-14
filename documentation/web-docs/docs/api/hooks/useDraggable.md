---
sidebar_position: 1
---

# useDraggable Hook

A powerful hook for creating draggable components with advanced features like collision detection, bounded dragging, axis constraints, and custom animations.

## Overview

The `useDraggable` hook provides the core functionality for drag-and-drop interactions, handling gesture recognition, position tracking, collision detection with drop zones, and smooth animations. This is the underlying hook used by the `Draggable` component.

## Import

```tsx
import { useDraggable } from "react-native-reanimated-dnd";
```

## Parameters

### UseDraggableOptions\<TData\>

#### Core Parameters

##### data

- **Type**: `TData`
- **Required**: Yes
- **Description**: Data payload associated with this draggable item. This data is passed to drop handlers when the item is successfully dropped.

```tsx
const { animatedViewProps, gesture } = useDraggable({
  data: { id: "1", title: "Task 1", priority: "high" },
});
```

##### draggableId

- **Type**: `string`
- **Required**: No
- **Description**: Unique identifier for this draggable item. If not provided, one will be generated automatically.

##### dragDisabled

- **Type**: `boolean`
- **Default**: `false`
- **Description**: Whether dragging is disabled for this item. When true, the item cannot be dragged.

```tsx
const { animatedViewProps, gesture } = useDraggable({
  data: taskData,
  dragDisabled: !user.canDrag,
});
```

#### Callback Parameters

##### onDragStart

- **Type**: `(data: TData) => void`
- **Required**: No
- **Description**: Callback fired when dragging starts.

```tsx
const { animatedViewProps, gesture } = useDraggable({
  data: taskData,
  onDragStart: (data) => {
    console.log("Started dragging:", data.title);
    hapticFeedback();
  },
});
```

##### onDragEnd

- **Type**: `(data: TData) => void`
- **Required**: No
- **Description**: Callback fired when dragging ends (regardless of whether it was dropped successfully).

```tsx
const { animatedViewProps, gesture } = useDraggable({
  data: taskData,
  onDragEnd: (data) => {
    console.log("Finished dragging:", data.title);
    setIsDragging(false);
  },
});
```

##### onDragging

- **Type**: `(payload: DraggingPayload<TData>) => void`
- **Required**: No
- **Description**: Callback fired continuously while dragging. Useful for real-time feedback.

```tsx
const { animatedViewProps, gesture } = useDraggable({
  data: taskData,
  onDragging: ({ x, y, tx, ty, itemData }) => {
    const currentX = x + tx;
    const currentY = y + ty;
    console.log(`${itemData.title} is at (${currentX}, ${currentY})`);
  },
});
```

##### onStateChange

- **Type**: `(state: DraggableState) => void`
- **Required**: No
- **Description**: Callback fired when the draggable state changes.

```tsx
const { animatedViewProps, gesture, state } = useDraggable({
  data: taskData,
  onStateChange: (state) => {
    if (state === DraggableState.DROPPED) {
      showSuccessMessage();
    }
  },
});
```

#### Advanced Parameters

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

const { animatedViewProps, gesture } = useDraggable({
  data: taskData,
  animationFunction: bounceAnimation,
});
```

##### dragBoundsRef

- **Type**: `React.RefObject<Animated.View | View>`
- **Required**: No
- **Description**: Reference to a View that defines the dragging boundaries. The draggable item will be constrained within this view's bounds.

```tsx
const boundsRef = useRef<View>(null);

const { animatedViewProps, gesture } = useDraggable({
  data: taskData,
  dragBoundsRef: boundsRef,
});
```

##### dragAxis

- **Type**: `"x" | "y" | "both"`
- **Default**: `"both"`
- **Description**: Constrains dragging to a specific axis.

```tsx
// Horizontal only
const { animatedViewProps, gesture } = useDraggable({
  data: taskData,
  dragAxis: "x",
});

// Vertical only
const { animatedViewProps, gesture } = useDraggable({
  data: taskData,
  dragAxis: "y",
});
```

##### collisionAlgorithm

- **Type**: `CollisionAlgorithm`
- **Default**: `"intersect"`
- **Description**: Algorithm used for collision detection with drop zones.

Available algorithms:

- `intersect`: Collision when any part overlaps (default)
- `center`: Collision when center point is over droppable
- `contain`: Collision when entire draggable is contained

```tsx
const { animatedViewProps, gesture } = useDraggable({
  data: taskData,
  collisionAlgorithm: "center",
});
```


## Return Value

### UseDraggableReturn

#### animatedViewProps

- **Type**: `{ style: AnimatedStyle<ViewStyle>; onLayout: (event: LayoutChangeEvent) => void; }`
- **Description**: Props to spread on the animated view that will be draggable. Contains the animated style and layout handler.

```tsx
const { animatedViewProps, gesture } = useDraggable({ data: taskData });

return (
  <GestureDetector gesture={gesture}>
    <Animated.View {...animatedViewProps}>
      <Text>Draggable content</Text>
    </Animated.View>
  </GestureDetector>
);
```

#### gesture

- **Type**: `GestureType`
- **Description**: Gesture object to attach to GestureDetector for handling drag interactions. Only used when no handle is present (entire component is draggable).

#### state

- **Type**: `DraggableState`
- **Description**: Current state of the draggable item (IDLE, DRAGGING, or DROPPED).

```tsx
const { animatedViewProps, gesture, state } = useDraggable({ data: taskData });

return (
  <GestureDetector gesture={gesture}>
    <Animated.View
      {...animatedViewProps}
      style={[
        animatedViewProps.style,
        { opacity: state === DraggableState.DRAGGING ? 0.7 : 1 },
      ]}
    >
      <Text>State: {state}</Text>
    </Animated.View>
  </GestureDetector>
);
```

#### animatedViewRef

- **Type**: `ReturnType<typeof useAnimatedRef<Animated.View>>`
- **Description**: Animated ref for the draggable view. Used internally for measurements.

#### hasHandle

- **Type**: `boolean`
- **Description**: Whether this draggable has a handle component. When true, only the handle can initiate dragging. When false, the entire component is draggable.

## Usage Examples

### Basic Draggable

```tsx
import { useDraggable, DraggableState } from "react-native-reanimated-dnd";
import { GestureDetector } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";

function BasicDraggable() {
  const { animatedViewProps, gesture, state } = useDraggable({
    data: { id: "1", name: "Draggable Item" },
    onDragStart: (data) => console.log("Started dragging:", data.name),
    onDragEnd: (data) => console.log("Finished dragging:", data.name),
  });

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View {...animatedViewProps}>
        <Text>Drag me!</Text>
        <Text>State: {state}</Text>
      </Animated.View>
    </GestureDetector>
  );
}
```

### Bounded Draggable

```tsx
function BoundedDraggable() {
  const boundsRef = useRef<View>(null);

  const { animatedViewProps, gesture } = useDraggable({
    data: { id: "2", type: "bounded" },
    dragBoundsRef: boundsRef,
    dragAxis: "x", // Only horizontal movement
    animationFunction: (toValue) => {
      "worklet";
      return withTiming(toValue, { duration: 300 });
    },
    collisionAlgorithm: "center",
  });

  return (
    <View ref={boundsRef} style={styles.container}>
      <GestureDetector gesture={gesture}>
        <Animated.View {...animatedViewProps}>
          <Text>Bounded horizontal draggable</Text>
        </Animated.View>
      </GestureDetector>
    </View>
  );
}
```

### State Tracking Draggable

```tsx
function StatefulDraggable() {
  const [dragState, setDragState] = useState(DraggableState.IDLE);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const { animatedViewProps, gesture } = useDraggable({
    data: { id: "3", status: "active" },
    onStateChange: setDragState,
    onDragging: ({ x, y, tx, ty }) => {
      setPosition({ x: x + tx, y: y + ty });
    },
  });

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        {...animatedViewProps}
        style={[
          animatedViewProps.style,
          { opacity: dragState === DraggableState.DRAGGING ? 0.7 : 1 },
        ]}
      >
        <Text>State: {dragState}</Text>
        <Text>
          Position: ({Math.round(position.x)}, {Math.round(position.y)})
        </Text>
      </Animated.View>
    </GestureDetector>
  );
}
```

### Custom Animation Draggable

```tsx
import { withSpring, withTiming, Easing } from "react-native-reanimated";

function CustomAnimationDraggable() {
  const customBounce = useCallback((toValue) => {
    "worklet";
    return withSpring(toValue, {
      damping: 10,
      stiffness: 100,
      mass: 1,
    });
  }, []);

  const { animatedViewProps, gesture } = useDraggable({
    data: { id: "4", type: "bouncy" },
    animationFunction: customBounce,
    onDragStart: () => hapticFeedback(),
  });

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View {...animatedViewProps}>
        <Text>Bouncy draggable</Text>
      </Animated.View>
    </GestureDetector>
  );
}
```

### Analytics Draggable

```tsx
function AnalyticsDraggable() {
  const [analytics, setAnalytics] = useState({
    dragCount: 0,
    totalDistance: 0,
    averageDistance: 0,
  });

  const startPosition = useRef({ x: 0, y: 0 });

  const { animatedViewProps, gesture } = useDraggable({
    data: { id: "5", type: "analytics" },
    onDragStart: (data) => {
      startPosition.current = { x: 0, y: 0 }; // Will be updated in onDragging
      setAnalytics((prev) => ({ ...prev, dragCount: prev.dragCount + 1 }));
    },
    onDragging: ({ x, y, tx, ty }) => {
      if (startPosition.current.x === 0 && startPosition.current.y === 0) {
        startPosition.current = { x, y };
      }
    },
    onDragEnd: (data) => {
      const distance = Math.sqrt(
        Math.pow(startPosition.current.x, 2) +
          Math.pow(startPosition.current.y, 2)
      );

      setAnalytics((prev) => {
        const newTotal = prev.totalDistance + distance;
        const newAverage = newTotal / prev.dragCount;
        return {
          ...prev,
          totalDistance: newTotal,
          averageDistance: newAverage,
        };
      });
    },
  });

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View {...animatedViewProps}>
        <Text>Analytics Draggable</Text>
        <Text>Drags: {analytics.dragCount}</Text>
        <Text>Avg Distance: {Math.round(analytics.averageDistance)}px</Text>
      </Animated.View>
    </GestureDetector>
  );
}
```

### Collision Detection Example

```tsx
function CollisionDraggable() {
  const [collisionAlgorithm, setCollisionAlgorithm] = useState("intersect");

  const { animatedViewProps, gesture } = useDraggable({
    data: { id: "6", type: "collision-test" },
    collisionAlgorithm,
    onDragStart: () => {
      console.log(`Using ${collisionAlgorithm} collision detection`);
    },
  });

  return (
    <View>
      <View style={styles.controls}>
        {["intersect", "center", "contain"].map((algorithm) => (
          <TouchableOpacity
            key={algorithm}
            onPress={() => setCollisionAlgorithm(algorithm)}
            style={[
              styles.button,
              collisionAlgorithm === algorithm && styles.activeButton,
            ]}
          >
            <Text>{algorithm}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <GestureDetector gesture={gesture}>
        <Animated.View {...animatedViewProps}>
          <Text>Collision: {collisionAlgorithm}</Text>
        </Animated.View>
      </GestureDetector>
    </View>
  );
}
```

### Conditional Dragging

```tsx
function ConditionalDraggable({ item, userPermissions }) {
  const canDrag = userPermissions.includes("drag") && !item.locked;

  const { animatedViewProps, gesture } = useDraggable({
    data: item,
    dragDisabled: !canDrag,
    onDragStart: (data) => {
      if (data.sensitive && !userPermissions.includes("sensitive")) {
        showError("Insufficient permissions");
        return;
      }
      analytics.track("drag_start", { itemId: data.id });
    },
  });

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        {...animatedViewProps}
        style={[animatedViewProps.style, !canDrag && styles.disabled]}
      >
        <Text>{item.title}</Text>
        {item.locked && <Icon name="lock" size={16} />}
        {!canDrag && <Text style={styles.disabledText}>Drag disabled</Text>}
      </Animated.View>
    </GestureDetector>
  );
}
```

### Real-time Position Tracking

```tsx
function PositionTracker() {
  const [realTimePosition, setRealTimePosition] = useState({ x: 0, y: 0 });
  const [velocity, setVelocity] = useState({ x: 0, y: 0 });
  const lastPosition = useRef({ x: 0, y: 0, timestamp: 0 });

  const { animatedViewProps, gesture } = useDraggable({
    data: { id: "7", type: "position-tracker" },
    onDragging: ({ x, y, tx, ty }) => {
      const currentX = x + tx;
      const currentY = y + ty;
      const now = Date.now();

      setRealTimePosition({ x: currentX, y: currentY });

      // Calculate velocity
      if (lastPosition.current.timestamp > 0) {
        const deltaTime = now - lastPosition.current.timestamp;
        const deltaX = currentX - lastPosition.current.x;
        const deltaY = currentY - lastPosition.current.y;

        setVelocity({
          x: (deltaX / deltaTime) * 1000, // pixels per second
          y: (deltaY / deltaTime) * 1000,
        });
      }

      lastPosition.current = { x: currentX, y: currentY, timestamp: now };
    },
    onDragEnd: () => {
      setVelocity({ x: 0, y: 0 });
      lastPosition.current = { x: 0, y: 0, timestamp: 0 };
    },
  });

  return (
    <View>
      <View style={styles.info}>
        <Text>
          Position: ({Math.round(realTimePosition.x)},{" "}
          {Math.round(realTimePosition.y)})
        </Text>
        <Text>
          Velocity: ({Math.round(velocity.x)}, {Math.round(velocity.y)}) px/s
        </Text>
      </View>

      <GestureDetector gesture={gesture}>
        <Animated.View {...animatedViewProps}>
          <Text>Position Tracker</Text>
        </Animated.View>
      </GestureDetector>
    </View>
  );
}
```

## TypeScript Support

The hook is fully typed with generic support:

```tsx
interface TaskData {
  id: string;
  title: string;
  priority: "low" | "medium" | "high";
  assignee?: string;
}

function TypedDraggable() {
  const { animatedViewProps, gesture, state } = useDraggable<TaskData>({
    data: { id: "1", title: "Task 1", priority: "high" },
    onDragStart: (data: TaskData) => {
      // data is properly typed
      console.log(`Started dragging: ${data.title} (${data.priority})`);
    },
    onDragEnd: (data: TaskData) => {
      // data is properly typed
      console.log(`Finished dragging: ${data.title}`);
    },
  });

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View {...animatedViewProps}>
        <Text>Typed draggable</Text>
      </Animated.View>
    </GestureDetector>
  );
}
```

## Performance Tips

1. **Use `useCallback`** for event handlers to prevent unnecessary re-renders
2. **Memoize expensive calculations** with `useMemo`
3. **Throttle position updates** in `onDragging` callbacks
4. **Use worklets** for animation functions to run on the UI thread
5. **Avoid complex logic** in drag callbacks for smooth performance

## Common Patterns

### Drag Handle Pattern

```tsx
function DragHandlePattern() {
  return (
    <Draggable data={{ id: "1" }}>
      <View>
        <Text>Content (not draggable)</Text>
        <Draggable.Handle>
          <View style={styles.handle}>
            <Text>Drag here</Text>
          </View>
        </Draggable.Handle>
      </View>
    </Draggable>
  );
}
```

### State Machine Pattern

```tsx
function StateMachineDraggable() {
  const [state, setState] = useState(DraggableState.IDLE);

  const { animatedViewProps, gesture } = useDraggable({
    data: { id: "1" },
    onStateChange: (newState) => {
      // Validate state transitions
      const validTransitions = {
        [DraggableState.IDLE]: [DraggableState.DRAGGING],
        [DraggableState.DRAGGING]: [
          DraggableState.DROPPED,
          DraggableState.IDLE,
        ],
        [DraggableState.DROPPED]: [DraggableState.IDLE],
      };

      if (validTransitions[state].includes(newState)) {
        setState(newState);
      } else {
        console.warn(`Invalid state transition: ${state} -> ${newState}`);
      }
    },
  });

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View {...animatedViewProps}>
        <Text>State Machine Draggable</Text>
        <Text>Current State: {state}</Text>
      </Animated.View>
    </GestureDetector>
  );
}
```

## See Also

- [Draggable Component](../../components/draggable) - High-level component using this hook
- [DraggableState](../types/enums#draggablestate) - State management
- [CollisionAlgorithm](../types/draggable-types#collisionalgorithm) - Collision detection
- [AnimationFunction](../types/draggable-types#animationfunction) - Custom animations
- [useDraggable Types](../types/draggable-types#usedraggableoptionstdata) - Complete type definitions
