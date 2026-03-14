---
title: "Basic Concepts"
---

Understanding the core concepts and architecture of React Native Reanimated DnD.

## Architecture Overview

The library is built around a context-based architecture that enables seamless communication between draggable and droppable components.

### Core Components

```
App
├── GestureHandlerRootView (Required)
└── DropProvider (Context)
    ├── Draggable (Items that can be moved)
    ├── Droppable (Areas where items can be dropped)
    └── Sortable (Special case for reorderable lists)
        └── SortableItem (Individual items in sortable lists)
```

### Component Hierarchy

1. **GestureHandlerRootView**: Required wrapper for gesture handling
2. **DropProvider**: Creates the drag-and-drop context
3. **Draggable/Droppable**: Core interaction components
4. **Sortable/SortableItem**: Higher-level components for lists

## Core Concepts

### 1. Context-Based Communication

All drag-and-drop functionality relies on React Context for component communication:

```tsx
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { DropProvider } from "react-native-reanimated-dnd";

// The DropProvider creates a context that enables:
// - Registration of draggable and droppable components
// - Collision detection between components
// - State management for active drags
// - Position tracking and updates

function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <DropProvider>
        {/* All drag-and-drop components must be children of DropProvider */}
        <YourComponents />
      </DropProvider>
    </GestureHandlerRootView>
  );
}
```

### 2. Data-Driven Interactions

Every draggable component carries data that flows through the drag-and-drop system:

```tsx
// Data flows from draggable to droppable
<Draggable data={{ id: '1', name: 'Task 1', priority: 'high' }}>
  <Text>Drag me!</Text>
</Draggable>

<Droppable onDrop={(data) => {
  // Receives: { id: '1', name: 'Task 1', priority: 'high' }
  console.log('Received:', data);
}}>
  <Text>Drop zone</Text>
</Droppable>
```

### 3. Collision Detection

The library automatically handles collision detection between draggable items and drop zones:

```tsx
// Different collision algorithms available:
<Draggable
  data={data}
  collisionAlgorithm="intersect" // Default - any overlap
>
  <Text>Easy to drop</Text>
</Draggable>

<Draggable
  data={data}
  collisionAlgorithm="center" // Center point must be over droppable
>
  <Text>Precise dropping</Text>
</Draggable>

<Draggable
  data={data}
  collisionAlgorithm="contain" // Entire item must be contained
>
  <Text>Strict containment</Text>
</Draggable>
```

### 4. Animation System

Built on React Native Reanimated for smooth, performant animations:

```tsx
// Automatic spring animations on drop
<Draggable
  data={data}
  animationFunction={(toValue) => {
    "worklet";
    return withSpring(toValue, {
      damping: 15,
      stiffness: 150,
    });
  }}
>
  <Text>Custom animation</Text>
</Draggable>
```

## Component Types

### Draggable Components

Make any React Native component draggable:

```tsx
import { Draggable } from "react-native-reanimated-dnd";

function TaskItem({ task }) {
  return (
    <Draggable data={task}>
      <View style={styles.taskCard}>
        <Text>{task.title}</Text>
        <Text>Priority: {task.priority}</Text>
      </View>
    </Draggable>
  );
}
```

**Key Features:**

- Automatic gesture handling
- Collision detection
- Animation support
- Boundary constraints
- Axis restrictions
- Handle-based dragging

### Droppable Components

Create areas where draggable items can be dropped:

```tsx
import { Droppable } from "react-native-reanimated-dnd";

function DropZone({ onTaskDrop }) {
  return (
    <Droppable onDrop={onTaskDrop} dropAlignment="center" capacity={5}>
      <View style={styles.dropZone}>
        <Text>Drop tasks here</Text>
      </View>
    </Droppable>
  );
}
```

**Key Features:**

- Drop event handling
- Visual feedback for active drops
- Alignment options for dropped items
- Capacity limits
- Custom styling for different states

### Sortable Components

High-level components for reorderable lists:

```tsx
import { Sortable, SortableItem } from "react-native-reanimated-dnd";
import { useCallback } from "react";

function TaskList({ tasks, onTaskReorder }) {
  const renderTask = useCallback(
    ({ item, id, positions, ...props }) => (
      <SortableItem
        key={id}
        id={id}
        positions={positions}
        {...props}
        onMove={(itemId, from, to) => {
          // Update task order when items are moved
          const newTasks = [...tasks];
          const [movedTask] = newTasks.splice(from, 1);
          newTasks.splice(to, 0, movedTask);
          onTaskReorder(newTasks);
        }}
      >
        <TaskCard task={item} />
      </SortableItem>
    ),
    [tasks, onTaskReorder]
  );

  return <Sortable data={tasks} renderItem={renderTask} itemHeight={60} />;
}
```

**Key Features:**

- Automatic list reordering
- Smooth item animations
- Handle-based sorting
- Custom item heights
- Performance optimization for large lists

## DropProvider

The `DropProvider` creates a context that enables:

- **Component Registration**: Draggable and droppable components register themselves
- **Collision Detection**: Automatic detection of overlaps between components
- **State Management**: Tracking of active drags and dropped items
- **Position Updates**: Handling layout changes and position recalculations
- **Event Coordination**: Global callbacks for drag events

### Provider Configuration

```tsx
import { GestureHandlerRootView } from "react-native-gesture-handler";

<GestureHandlerRootView style={{ flex: 1 }}>
  <DropProvider
    onDragStart={(data) => console.log("Drag started:", data)}
    onDragEnd={(data) => console.log("Drag ended:", data)}
    onDroppedItemsUpdate={(items) => console.log("Items updated:", items)}
    onDragging={({ x, y, tx, ty, itemData }) => {
      console.log(`${itemData.name} at (${x + tx}, ${y + ty})`);
    }}
  >
    <YourApp />
  </DropProvider>
</GestureHandlerRootView>;
```

## Data Flow

### 1. Registration Phase

When components mount, they register with the DropProvider:

```tsx
// Draggable registers itself with unique ID and data
<Draggable data={{ id: '1', name: 'Item 1' }}>
  {/* Component registers on mount */}
</Draggable>

// Droppable registers itself with position and drop handler
<Droppable onDrop={handleDrop}>
  {/* Component registers on mount */}
</Droppable>
```

### 2. Drag Initiation

When a drag starts:

1. Gesture system detects pan gesture
2. Draggable component becomes active
3. Position tracking begins
4. Global `onDragStart` callback fires

### 3. Collision Detection

During dragging:

1. Real-time position updates
2. Collision algorithm checks overlaps
3. Visual feedback for valid drop zones
4. Global `onDragging` callback fires

### 4. Drop Resolution

When drag ends:

1. Check for valid drop target
2. Execute drop handler if valid
3. Animate item to final position
4. Update dropped items registry
5. Global `onDragEnd` callback fires

## State Management

### Internal State

The DropProvider manages several pieces of internal state:

- **Active Hover Slot**: Currently hovered drop zone
- **Dropped Items Map**: Registry of successfully dropped items
- **Position Update Listeners**: Components that need position updates

### External State Integration

Integrate with your app's state management:

```tsx
function App() {
  const [tasks, setTasks] = useState(initialTasks);
  const [droppedItems, setDroppedItems] = useState({});

  const handleDroppedItemsUpdate = (items) => {
    setDroppedItems(items);

    // Sync with your state management
    const updatedTasks = syncTasksWithDroppedItems(tasks, items);
    setTasks(updatedTasks);

    // Persist to backend
    saveTasks(updatedTasks);
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <DropProvider onDroppedItemsUpdate={handleDroppedItemsUpdate}>
        <TaskBoard tasks={tasks} />
      </DropProvider>
    </GestureHandlerRootView>
  );
}
```

## Performance Considerations

### Automatic Optimizations

The library includes several automatic optimizations:

- **Memoized Context Values**: Prevents unnecessary re-renders
- **Throttled Position Updates**: Maintains 60fps during drags
- **Efficient Collision Detection**: Optimized algorithms for different use cases
- **Automatic Cleanup**: Components clean up on unmount

### Manual Optimizations

You can further optimize performance:

```tsx
// Use React.memo for expensive components
const ExpensiveTaskCard = React.memo(({ task }) => {
  return (
    <Draggable data={task}>
      <ComplexTaskVisualization task={task} />
    </Draggable>
  );
});

// Use useCallback for event handlers
const handleDrop = useCallback((data) => {
  updateTasks(data);
}, []);

// Throttle expensive operations in drag callbacks
const handleDragging = useCallback(
  throttle(({ itemData, tx, ty }) => {
    updateExpensiveVisualization(itemData, tx, ty);
  }, 16), // 60fps
  []
);
```

## Error Handling

### Built-in Error Handling

The library includes automatic error handling:

- Context validation (components must be within DropProvider)
- Type checking with TypeScript
- Graceful degradation for missing props
- Development-time warnings for common mistakes

### Custom Error Handling

Add your own error boundaries:

```tsx
function DragDropErrorBoundary({ children }) {
  return (
    <ErrorBoundary
      fallback={<Text>Drag and drop temporarily unavailable</Text>}
      onError={(error) => {
        console.error("Drag and drop error:", error);
        analytics.track("dnd_error", { error: error.message });
      }}
    >
      {children}
    </ErrorBoundary>
  );
}

function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <DragDropErrorBoundary>
        <DropProvider>
          <YourApp />
        </DropProvider>
      </DragDropErrorBoundary>
    </GestureHandlerRootView>
  );
}
```

## TypeScript Support

The library is fully typed with comprehensive TypeScript support:

```tsx
interface TaskData {
  id: string;
  title: string;
  priority: 'low' | 'medium' | 'high';
}

// Typed draggable
<Draggable<TaskData> data={task}>
  <TaskCard task={task} />
</Draggable>

// Typed droppable
<Droppable<TaskData> onDrop={(data: TaskData) => {
  // data is properly typed
  console.log(`Dropped: ${data.title}`);
}}>
  <DropZone />
</Droppable>

// Typed provider callbacks
<DropProvider
  onDragStart={(data: TaskData) => {
    console.log(`Started dragging: ${data.title}`);
  }}
  onDroppedItemsUpdate={(items: DroppedItemsMap<TaskData>) => {
    // items is properly typed
    updateTaskState(items);
  }}
>
  <TaskBoard />
</DropProvider>
```

## Next Steps

Now that you understand the basic concepts:

1. **[Quick Start](./quick-start)** - Build your first drag-and-drop interface
2. **[Setup Provider](./setup-provider)** - Learn advanced provider configuration
3. **[API Reference](../api/overview)** - Explore all available components and hooks
4. **[Examples](../examples/basic-drag-drop)** - See real-world implementations
5. **[Performance Guide](../guides/performance)** - Optimize your implementation
