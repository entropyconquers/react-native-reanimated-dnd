---
title: "Sortable"
---

The `Sortable` component creates reorderable lists with smooth animations, auto-scrolling, and gesture handling for intuitive drag-and-drop reordering. Supports both **vertical and horizontal** directions with FlatList virtualization for optimal performance.

## Overview

The Sortable component provides a complete solution for both **vertical and horizontal** sortable lists, handling all the complex state management, gesture handling, and animations internally. It renders a scrollable list where items can be dragged to reorder them with smooth animations and auto-scrolling support when dragging near edges.

### Key Features

- **Bi-directional Support**: Works with both vertical (default) and horizontal layouts
- **FlatList Virtualization**: Performance optimization for large datasets (enabled by default)
- **Auto-scrolling**: Automatic scrolling when dragging near container edges
- **Gap Support**: Built-in spacing for horizontal layouts
- **Data Hashing**: Optimized re-rendering with automatic data change detection

## Important: State Management

**DO NOT** update external state directly in response to sortable operations. The Sortable component maintains its own internal state for optimal performance and animation consistency. Updating external state (like calling `setTasks()` in `onMove`) will break the internal state management and cause issues.

### Correct Approach

- Use `onMove` for logging, analytics, or side effects
- Use `onDrop` with `allPositions` parameter for read-only tracking
- Let the Sortable component manage its own internal state

### Incorrect Approach

- Never call `setItems()`, `setTasks()`, or similar in `onMove`
- Never manually splice/reorder external arrays in drag callbacks
- Never update Redux/Zustand stores directly from drag events

### Future Releases

Programmatic operations (add, update, delete, reorder) that work correctly with internal state will be added in future releases.

## Basic Usage

```tsx
import {
  Sortable,
  SortableItem,
  SortableDirection,
} from "react-native-reanimated-dnd";

interface Task {
  id: string;
  title: string;
  completed: boolean;
}

function TaskList() {
  const [tasks] = useState<Task[]>([
    { id: "1", title: "Learn React Native", completed: false },
    { id: "2", title: "Build an app", completed: false },
    { id: "3", title: "Deploy to store", completed: false },
  ]);

  const renderTask = ({
    item,
    id,
    positions,
    lowerBound,
    autoScrollDirection,
    itemsCount,
    itemHeight,
  }) => (
    <SortableItem
      key={id}
      id={id}
      data={item}
      positions={positions}
      lowerBound={lowerBound}
      autoScrollDirection={autoScrollDirection}
      itemsCount={itemsCount}
      itemHeight={itemHeight}
      onMove={(itemId, from, to) => {
        console.log(`Task ${itemId} moved from ${from} to ${to}`);
      }}
      onDrop={(itemId, position, allPositions) => {
        if (allPositions) {
          console.log("Current positions:", allPositions);
          // Use for tracking, analytics, etc. - NOT for updating state
        }
      }}
    >
      <View style={styles.taskItem}>
        <Text>{item.title}</Text>
        <Text>{item.completed ? "✓" : "○"}</Text>
      </View>
    </SortableItem>
  );

  return (
    <Sortable
      data={tasks}
      renderItem={renderTask}
      itemHeight={60}
      style={styles.list}
    />
  );
}
```

## Props Reference

### Core Props

| Prop                    | Type                         | Default                        | Description                                   |
| ----------------------- | ---------------------------- | ------------------------------ | --------------------------------------------- |
| `data`                  | `TData[]`                    | **Required**                   | Array of data items (must have `id` property) |
| `renderItem`            | `RenderItemFunction`         | **Required**                   | Function to render each item                  |
| `direction`             | `"vertical" \| "horizontal"` | `"vertical"`                   | Direction of the sortable list                |
| `itemHeight`            | `number`                     | ⚠️ **Required for vertical**   | Height of each item in pixels                 |
| `itemWidth`             | `number`                     | ⚠️ **Required for horizontal** | Width of each item in pixels                  |
| `gap`                   | `number`                     | `0`                            | Gap between items (horizontal only)           |
| `paddingHorizontal`     | `number`                     | `0`                            | Horizontal padding (horizontal only)          |
| `style`                 | `StyleProp<ViewStyle>`       | -                              | Style for the container                       |
| `contentContainerStyle` | `StyleProp<ViewStyle>`       | -                              | Style for the scroll content                  |

### Advanced Props

| Prop               | Type                      | Default             | Description                                   |
| ------------------ | ------------------------- | ------------------- | --------------------------------------------- |
| `itemKeyExtractor` | `(item: TData) => string` | `(item) => item.id` | Function to extract unique key from item      |
| `useFlatList`      | `boolean`                 | `true`              | Use FlatList for virtualization (performance) |

## Render Item Function

The `renderItem` function receives props needed for sortable functionality:

```tsx
interface SortableRenderItemProps<TData> {
  item: TData; // The data item
  id: string; // Unique identifier
  positions: SharedValue<number[]>; // Shared value for positions
  lowerBound: SharedValue<number>; // Lower scroll bound
  autoScrollDirection: SharedValue<ScrollDirection>; // Auto-scroll state
  itemsCount: number; // Total number of items
  itemHeight: number; // Height of each item
  containerHeight: SharedValue<number>; // Container height
}

type RenderItemFunction<TData> = (
  props: SortableRenderItemProps<TData>
) => React.ReactElement;
```

## Examples

### Horizontal Sortable List

```tsx
function HorizontalTagList() {
  const [tags] = useState([
    { id: "1", label: "React", color: "#61dafb" },
    { id: "2", label: "TypeScript", color: "#3178c6" },
    { id: "3", label: "React Native", color: "#0fa5e9" },
    { id: "4", label: "JavaScript", color: "#f7df1e" },
    { id: "5", label: "Node.js", color: "#339933" },
  ]);

  const renderTag = ({
    item,
    id,
    positions,
    leftBound,
    autoScrollHorizontalDirection,
    itemsCount,
    itemWidth,
    gap,
    paddingHorizontal,
  }) => (
    <SortableItem
      key={id}
      id={id}
      data={item}
      positions={positions}
      leftBound={leftBound}
      autoScrollHorizontalDirection={autoScrollHorizontalDirection}
      itemsCount={itemsCount}
      direction={SortableDirection.Horizontal}
      itemWidth={itemWidth}
      gap={gap}
      paddingHorizontal={paddingHorizontal}
      onMove={(itemId, from, to) => {
        console.log(`Tag ${itemId} moved from ${from} to ${to}`);
      }}
      onDrop={(itemId, position, allPositions) => {
        if (allPositions) {
          console.log("Current positions:", allPositions);
        }
      }}
    >
      <View style={[styles.tagItem, { backgroundColor: item.color }]}>
        <Text style={styles.tagText}>{item.label}</Text>
      </View>
    </SortableItem>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Drag to reorder tags</Text>
      <Sortable
        data={tags}
        renderItem={renderTag}
        direction={SortableDirection.Horizontal}
        itemWidth={120}
        gap={12}
        paddingHorizontal={16}
        style={styles.horizontalList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  horizontalList: {
    height: 60,
  },
  tagItem: {
    height: 40,
    paddingHorizontal: 16,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  tagText: {
    color: "white",
    fontWeight: "600",
  },
});
```

### Basic Task List

```tsx
function BasicTaskList() {
  const [tasks] = useState([
    { id: "1", title: "Design UI mockups", priority: "high", completed: false },
    {
      id: "2",
      title: "Implement authentication",
      priority: "medium",
      completed: false,
    },
    { id: "3", title: "Write unit tests", priority: "low", completed: false },
    {
      id: "4",
      title: "Deploy to staging",
      priority: "medium",
      completed: true,
    },
  ]);

  const renderTask = ({
    item,
    id,
    positions,
    lowerBound,
    autoScrollDirection,
    itemsCount,
    itemHeight,
  }) => (
    <SortableItem
      key={id}
      id={id}
      data={item}
      positions={positions}
      lowerBound={lowerBound}
      autoScrollDirection={autoScrollDirection}
      itemsCount={itemsCount}
      itemHeight={itemHeight}
      onMove={(itemId, from, to) => {
        console.log(`Task ${itemId} moved from ${from} to ${to}`);
      }}
    >
      <View
        style={[
          styles.taskItem,
          item.completed && styles.completedTask,
          getPriorityStyle(item.priority),
        ]}
      >
        <View style={styles.taskContent}>
          <Text style={styles.taskTitle}>{item.title}</Text>
          <Text style={styles.taskPriority}>{item.priority}</Text>
        </View>
        <View style={styles.taskStatus}>
          <Text>{item.completed ? "Done" : "Pending"}</Text>
        </View>
      </View>
    </SortableItem>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Tasks ({tasks.length})</Text>
      <Sortable
        data={tasks}
        renderItem={renderTask}
        itemHeight={80}
        style={styles.sortableList}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    padding: 20,
    backgroundColor: "white",
  },
  sortableList: {
    flex: 1,
  },
  listContent: {
    padding: 16,
  },
  taskItem: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  completedTask: {
    opacity: 0.6,
    backgroundColor: "#f0f0f0",
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  taskPriority: {
    fontSize: 12,
    textTransform: "uppercase",
    fontWeight: "bold",
  },
  taskStatus: {
    marginLeft: 12,
  },
});

function getPriorityStyle(priority) {
  switch (priority) {
    case "high":
      return { borderLeftColor: "#ef4444", borderLeftWidth: 4 };
    case "medium":
      return { borderLeftColor: "#f59e0b", borderLeftWidth: 4 };
    case "low":
      return { borderLeftColor: "#10b981", borderLeftWidth: 4 };
    default:
      return {};
  }
}
```

### Sortable List with Drag Handles

```tsx
function SortableWithHandles() {
  const [items, setItems] = useState([
    { id: "1", title: "First Item", subtitle: "Description for first item" },
    { id: "2", title: "Second Item", subtitle: "Description for second item" },
    { id: "3", title: "Third Item", subtitle: "Description for third item" },
  ]);

  const renderItem = ({ item, id, positions, ...props }) => (
    <SortableItem key={id} id={id} positions={positions} {...props}>
      <View style={styles.itemContainer}>
        <View style={styles.itemContent}>
          <Text style={styles.itemTitle}>{item.title}</Text>
          <Text style={styles.itemSubtitle}>{item.subtitle}</Text>
        </View>

        {/* Only this handle area can initiate dragging */}
        <SortableItem.Handle style={styles.dragHandle}>
          <View style={styles.handleIcon}>
            <View style={styles.handleDot} />
            <View style={styles.handleDot} />
            <View style={styles.handleDot} />
            <View style={styles.handleDot} />
            <View style={styles.handleDot} />
            <View style={styles.handleDot} />
          </View>
        </SortableItem.Handle>
      </View>
    </SortableItem>
  );

  return (
    <Sortable
      data={items}
      renderItem={renderItem}
      itemHeight={70}
      style={styles.list}
    />
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  itemSubtitle: {
    fontSize: 14,
    color: "#666",
  },
  dragHandle: {
    padding: 8,
    marginLeft: 12,
  },
  handleIcon: {
    width: 20,
    height: 20,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignContent: "space-between",
  },
  handleDot: {
    width: 3,
    height: 3,
    backgroundColor: "#999",
    borderRadius: 1.5,
  },
});
```

### Custom Key Extractor

```tsx
interface CustomItem {
  uuid: string; // Using uuid instead of id
  name: string;
  order: number;
  category: string;
}

function CustomSortableList() {
  const [items, setItems] = useState<CustomItem[]>([
    { uuid: "a1b2c3", name: "Item Alpha", order: 1, category: "work" },
    { uuid: "d4e5f6", name: "Item Beta", order: 2, category: "personal" },
    { uuid: "g7h8i9", name: "Item Gamma", order: 3, category: "work" },
  ]);

  const renderItem = ({ item, id, positions, ...props }) => (
    <SortableItem key={id} id={id} positions={positions} {...props}>
      <View style={styles.customItem}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemOrder}>Order: {item.order}</Text>
        <Text style={styles.itemCategory}>{item.category}</Text>
      </View>
    </SortableItem>
  );

  return (
    <Sortable
      data={items}
      renderItem={renderItem}
      itemHeight={60}
      itemKeyExtractor={(item) => item.uuid} // Use uuid instead of id
      style={styles.list}
    />
  );
}
```

### External State Tracking (Read-Only)

```tsx
function ExternalStateTracking() {
  const [items] = useState(initialItems);
  const [externalPositions, setExternalPositions] = useState({});
  const [isReordering, setIsReordering] = useState(false);

  const renderItem = ({ item, id, positions, ...props }) => (
    <SortableItem
      key={id}
      id={id}
      positions={positions}
      {...props}
      onMove={(itemId, from, to) => {
        console.log(`Item ${itemId} moved from ${from} to ${to}`);
        // Only log or track - do NOT update state here
      }}
      onDrop={(itemId, position, allPositions) => {
        if (allPositions) {
          // Correct: Use allPositions for external tracking only
          setExternalPositions(allPositions);
          console.log("Updated external positions:", allPositions);

          // You can use this data for:
          // - Analytics tracking
          // - Saving to external store (not for reordering)
          // - Logging/debugging
          // - External state synchronization (read-only)
        }
        setIsReordering(false);
      }}
      onDragStart={() => setIsReordering(true)}
    >
      <View style={[styles.item, isReordering && styles.reorderingMode]}>
        <Text>{item.title}</Text>
        <Text style={styles.positionInfo}>
          External position: {externalPositions[item.id] ?? "Unknown"}
        </Text>
      </View>
    </SortableItem>
  );

  return (
    <View style={styles.container}>
      {isReordering && (
        <Text style={styles.reorderingIndicator}>Reordering items...</Text>
      )}
      <Sortable data={items} renderItem={renderItem} itemHeight={70} />
    </View>
  );
}
```

## Auto-scrolling

The Sortable component automatically scrolls when dragging items near the edges:

- **Top edge**: Scrolls up when dragging near the top
- **Bottom edge**: Scrolls down when dragging near the bottom
- **Smooth scrolling**: Uses momentum-based scrolling for natural feel
- **Configurable**: Auto-scroll behavior is built-in and optimized

## Performance Optimization

### FlatList Virtualization

The Sortable component uses FlatList by default for optimal performance with large datasets:

```tsx
// FlatList (default) - better for large lists
<Sortable
  data={largeDataset}
  renderItem={renderItem}
  itemHeight={60}
  useFlatList={true}  // Default
/>

// ScrollView - renders all items at once
<Sortable
  data={smallDataset}
  renderItem={renderItem}
  itemHeight={60}
  useFlatList={false}
/>
```

**Benefits of FlatList:**

- **Virtualization**: Only renders visible items
- **Memory efficiency**: Reduces memory usage for large lists
- **Smooth scrolling**: Better performance during scrolling
- **Automatic optimization**: Built-in performance optimizations

### Data Hashing

For optimal performance, the Sortable component is memoized using a hash of the data prop's id fields:

```tsx
// The component automatically generates a stable key from your data
// This ensures re-renders only happen when data composition changes
<Sortable
  data={tasks} // Hash generated from tasks.map(t => t.id)
  renderItem={renderItem}
  itemHeight={60}
/>;

// Providing stable data references improves performance
const memoizedData = useMemo(
  () => tasks.map((task) => ({ ...task, processed: true })),
  [tasks]
);
```

### Large Lists

For large lists, consider these optimizations:

```tsx
function OptimizedSortableList({ data }) {
  // Memoize render function to prevent unnecessary re-renders
  const renderItem = useCallback(
    ({ item, id, positions, ...props }) => (
      <SortableItem key={id} id={id} positions={positions} {...props}>
        <MemoizedItemComponent item={item} />
      </SortableItem>
    ),
    []
  );

  return (
    <Sortable
      data={data}
      renderItem={renderItem}
      itemHeight={ITEM_HEIGHT}
      // Use consistent item height for better performance
    />
  );
}

// Memoize item components
const MemoizedItemComponent = React.memo(({ item }) => (
  <View style={styles.item}>
    <Text>{item.title}</Text>
  </View>
));
```

### Memory Management

```tsx
function MemoryEfficientSortable() {
  // Use stable references for callbacks
  const handleMove = useCallback((itemId, from, to) => {
    // Handle reordering
  }, []);

  const handleDragStart = useCallback((itemId) => {
    // Handle drag start
  }, []);

  const renderItem = useCallback(
    ({ item, id, positions, ...props }) => (
      <SortableItem
        key={id}
        id={id}
        positions={positions}
        {...props}
        onMove={handleMove}
        onDragStart={handleDragStart}
      >
        <ItemComponent item={item} />
      </SortableItem>
    ),
    [handleMove, handleDragStart]
  );

  return (
    <Sortable data={data} renderItem={renderItem} itemHeight={ITEM_HEIGHT} />
  );
}
```

## TypeScript Support

The Sortable component is fully typed with generic support:

```tsx
interface TaskData {
  id: string;
  title: string;
  priority: "low" | "medium" | "high";
  completed: boolean;
  assignee?: string;
}

// Fully typed sortable
<Sortable<TaskData>
  data={tasks}
  renderItem={({ item, id, positions, ...props }) => (
    <SortableItem key={id} id={id} positions={positions} {...props}>
      {/* item is fully typed with TaskData properties */}
      <TaskComponent task={item} />
    </SortableItem>
  )}
  itemHeight={80}
/>;
```

## External State Management Guidelines

**IMPORTANT**: Never update external state (Redux, Zustand, Context, etc.) directly from sortable callbacks like `onMove`. This breaks the internal state management.

### Correct: Read-Only Position Tracking

```tsx
function CorrectStateIntegration() {
  const dispatch = useDispatch();
  const tasks = useSelector(selectTasks);

  const renderItem = ({ item, id, positions, ...props }) => (
    <SortableItem
      key={id}
      id={id}
      positions={positions}
      {...props}
      onMove={(itemId, from, to) => {
        // Correct: Only log for analytics/debugging
        console.log(`Task ${itemId} moved from ${from} to ${to}`);
        // DO NOT: dispatch(reorderTasks({ itemId, from, to }));
      }}
      onDrop={(itemId, position, allPositions) => {
        if (allPositions) {
          // Correct: Use for external tracking only
          console.log("Final positions:", allPositions);
          // You can save this to external state for tracking purposes
          dispatch(savePositionsForAnalytics(allPositions));
        }
      }}
    >
      <TaskItem task={item} />
    </SortableItem>
  );

  return <Sortable data={tasks} renderItem={renderItem} itemHeight={70} />;
}
```

### Incorrect Examples

```tsx
// DO NOT DO THIS - This will break sortable functionality
function IncorrectReduxExample() {
  const renderItem = ({ item, id, positions, ...props }) => (
    <SortableItem
      onMove={(itemId, from, to) => {
        // This breaks internal state management
        dispatch(reorderTasks({ itemId, from, to }));
      }}
      // ... other props
    />
  );
}

// DO NOT DO THIS - This will break sortable functionality
function IncorrectZustandExample() {
  const { reorderItems } = useStore();

  const renderItem = ({ item, id, positions, ...props }) => (
    <SortableItem
      onMove={reorderItems} // This breaks internal state
      // ... other props
    />
  );
}
```

## Accessibility

The Sortable component supports accessibility features:

```tsx
<Sortable
  data={data}
  renderItem={({ item, id, positions, ...props }) => (
    <SortableItem key={id} id={id} positions={positions} {...props}>
      <View
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={`Sortable item: ${item.title}`}
        accessibilityHint="Double tap and hold to reorder this item"
        accessibilityActions={[
          { name: "move-up", label: "Move up" },
          { name: "move-down", label: "Move down" },
        ]}
        onAccessibilityAction={(event) => {
          if (event.nativeEvent.actionName === "move-up") {
            // Handle move up
          } else if (event.nativeEvent.actionName === "move-down") {
            // Handle move down
          }
        }}
      >
        <Text>{item.title}</Text>
      </View>
    </SortableItem>
  )}
  itemHeight={70}
/>
```

## See Also

- [SortableItem](./sortable-item) - Individual sortable item component
- [useSortableList Hook](../hooks/useSortableList) - Underlying hook for custom implementations
- [useSortable Hook](../hooks/useSortable) - Hook for individual sortable items
- [Examples](../examples/sortable-lists) - More comprehensive examples
