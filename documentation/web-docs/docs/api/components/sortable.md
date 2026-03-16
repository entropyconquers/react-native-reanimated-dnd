---
title: "Sortable Component"
---

A high-level component for creating sortable lists with smooth reordering animations and auto-scrolling support.

## Overview

The `Sortable` component provides a complete solution for sortable lists, handling all the complex state management, gesture handling, and animations internally. It renders a scrollable list where items can be dragged to reorder them with smooth animations and auto-scrolling support.

## Import

```tsx
import { Sortable } from "react-native-reanimated-dnd";
```

## Props

### Core Props

#### data

- **Type**: `TData[]` (where `TData extends { id: string }`)
- **Required**: Yes
- **Description**: Array of data items to render in the sortable list. Each item must have an `id` property for tracking.

```tsx
const tasks = [
  { id: "1", title: "Learn React Native", completed: false },
  { id: "2", title: "Build an app", completed: false },
  { id: "3", title: "Deploy to store", completed: false },
];

<Sortable data={tasks} renderItem={renderTask} itemHeight={60} />;
```

#### renderItem

- **Type**: `(props: SortableRenderItemProps<TData>) => React.ReactElement`
- **Required**: Yes
- **Description**: Function that renders each item in the list. Receives item data and sortable props.

```tsx
const renderTask = ({ item, id, positions, ...props }) => (
  <SortableItem key={id} id={id} positions={positions} {...props}>
    <View style={styles.taskItem}>
      <Text>{item.title}</Text>
      <Text>{item.completed ? "✓" : "○"}</Text>
    </View>
  </SortableItem>
);
```

#### itemHeight

- **Type**: `number`
- **Required**: Yes
- **Description**: Height of each item in pixels. Used for position calculations and auto-scrolling.

```tsx
<Sortable
  data={data}
  renderItem={renderItem}
  itemHeight={80} // Each item is 80px tall
/>
```

### Optional Props

#### style

- **Type**: `StyleProp<ViewStyle>`
- **Default**: `undefined`
- **Description**: Style applied to the outer container of the sortable list.

```tsx
<Sortable
  data={data}
  renderItem={renderItem}
  itemHeight={60}
  style={{
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 16,
  }}
/>
```

#### contentContainerStyle

- **Type**: `StyleProp<ViewStyle>`
- **Default**: `undefined`
- **Description**: Style applied to the scroll view's content container.

```tsx
<Sortable
  data={data}
  renderItem={renderItem}
  itemHeight={60}
  contentContainerStyle={{
    paddingVertical: 20,
    paddingBottom: 100, // Extra space at bottom
  }}
/>
```

#### itemKeyExtractor

- **Type**: `(item: TData) => string`
- **Default**: `(item) => item.id`
- **Description**: Function to extract unique keys from items. Useful when your data doesn't use `id` as the key field.

```tsx
interface CustomItem {
  uuid: string;
  name: string;
}

<Sortable
  data={customItems}
  renderItem={renderItem}
  itemHeight={60}
  itemKeyExtractor={(item) => item.uuid} // Use uuid instead of id
/>;
```

## SortableRenderItemProps

The render function receives these props:

```tsx
interface SortableRenderItemProps<TData> {
  item: TData; // The data item
  id: string; // Unique identifier
  positions: SharedValue<{ [id: string]: number }>; // Position mapping
  scrollY: SharedValue<number>; // Scroll position
  scrollViewHeight: number; // Container height
  itemHeight: number; // Height of each item
  itemsCount: number; // Total number of items
}
```

## Usage Examples

### Basic Sortable List

```tsx
import { Sortable, SortableItem } from "react-native-reanimated-dnd";

interface Task {
  id: string;
  title: string;
  completed: boolean;
}

function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: "1", title: "Learn React Native", completed: false },
    { id: "2", title: "Build an app", completed: false },
    { id: "3", title: "Deploy to store", completed: false },
  ]);

  const renderTask = ({ item, id, positions, ...props }) => (
    <SortableItem key={id} id={id} positions={positions} {...props}>
      <View style={styles.taskItem}>
        <Text style={styles.taskTitle}>{item.title}</Text>
        <Text style={styles.taskStatus}>
          {item.completed ? "✓ Completed" : "○ Pending"}
        </Text>
      </View>
    </SortableItem>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Tasks</Text>
      <Sortable
        data={tasks}
        renderItem={renderTask}
        itemHeight={60}
        style={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    padding: 16,
  },
  list: {
    flex: 1,
    paddingHorizontal: 16,
  },
  taskItem: {
    backgroundColor: "#f8f9fa",
    padding: 16,
    marginVertical: 4,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: "500",
  },
  taskStatus: {
    fontSize: 14,
    color: "#666",
  },
});
```

### Sortable List with Callbacks

```tsx
function AdvancedTaskList() {
  const [tasks, setTasks] = useState(initialTasks);
  const [draggingTask, setDraggingTask] = useState<string | null>(null);

  const renderTask = ({ item, id, positions, ...props }) => (
    <SortableItem
      key={id}
      id={id}
      positions={positions}
      {...props}
      onMove={(itemId, fromIndex, toIndex) => {
        // Update data when items are reordered
        const newTasks = [...tasks];
        const [movedTask] = newTasks.splice(fromIndex, 1);
        newTasks.splice(toIndex, 0, movedTask);
        setTasks(newTasks);

        // Analytics tracking
        analytics.track("task_reordered", {
          taskId: itemId,
          from: fromIndex,
          to: toIndex,
          totalTasks: tasks.length,
        });
      }}
      onDragStart={(itemId) => {
        // Haptic feedback
        if (Platform.OS === "ios") {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }
        setDraggingTask(itemId);
      }}
      onDrop={(itemId) => {
        setDraggingTask(null);
        // Save to backend
        saveTasks(tasks);
      }}
    >
      <Animated.View
        style={[
          styles.taskItem,
          item.priority === "high" && styles.highPriorityTask,
          draggingTask === id && styles.draggingTask,
        ]}
      >
        <View style={styles.taskContent}>
          <Text style={styles.taskTitle}>{item.title}</Text>
          <Text style={styles.taskDue}>Due: {item.dueDate}</Text>
          <View style={styles.taskMeta}>
            <Text style={styles.taskPriority}>{item.priority}</Text>
            <Text style={styles.taskCategory}>{item.category}</Text>
          </View>
        </View>

        <View style={styles.taskActions}>
          <TouchableOpacity onPress={() => toggleComplete(item.id)}>
            <Icon
              name={item.completed ? "check-circle" : "circle"}
              size={24}
              color={item.completed ? "#4CAF50" : "#ccc"}
            />
          </TouchableOpacity>
        </View>
      </Animated.View>
    </SortableItem>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Tasks ({tasks.length})</Text>
        <TouchableOpacity onPress={addNewTask}>
          <Icon name="plus" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      <Sortable
        data={tasks}
        renderItem={renderTask}
        itemHeight={100}
        style={styles.sortableList}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}
```

### Sortable List with Drag Handles

```tsx
function SortableWithHandles() {
  const [items, setItems] = useState(data);

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
    <View style={styles.container}>
      <Text style={styles.title}>Drag by Handle Only</Text>
      <Sortable
        data={items}
        renderItem={renderItem}
        itemHeight={70}
        style={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    marginVertical: 2,
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
    flexDirection: "row",
    flexWrap: "wrap",
    width: 12,
    height: 12,
  },
  handleDot: {
    width: 3,
    height: 3,
    backgroundColor: "#999",
    borderRadius: 1.5,
    margin: 1,
  },
});
```

### Custom Key Extractor

```tsx
interface CustomItem {
  uuid: string;
  name: string;
  order: number;
  category: string;
}

function CustomSortableList() {
  const [items, setItems] = useState<CustomItem[]>(data);

  const renderItem = ({ item, id, positions, ...props }) => (
    <SortableItem key={id} id={id} positions={positions} {...props}>
      <View style={styles.customItem}>
        <View style={styles.itemInfo}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemCategory}>{item.category}</Text>
        </View>
        <Text style={styles.itemOrder}>#{item.order}</Text>
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

### Photo Gallery Sortable

```tsx
interface Photo {
  id: string;
  uri: string;
  title: string;
  size: number;
}

function PhotoGallery() {
  const [photos, setPhotos] = useState<Photo[]>(photoData);

  const renderPhoto = ({ item, id, positions, ...props }) => (
    <SortableItem key={id} id={id} positions={positions} {...props}>
      <View style={styles.photoItem}>
        <Image source={{ uri: item.uri }} style={styles.photoImage} />
        <View style={styles.photoInfo}>
          <Text style={styles.photoTitle}>{item.title}</Text>
          <Text style={styles.photoSize}>{formatFileSize(item.size)}</Text>
        </View>
        <View style={styles.photoActions}>
          <TouchableOpacity onPress={() => editPhoto(item.id)}>
            <Icon name="edit" size={20} color="#007AFF" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => deletePhoto(item.id)}>
            <Icon name="trash" size={20} color="#FF3B30" />
          </TouchableOpacity>
        </View>
      </View>
    </SortableItem>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.galleryTitle}>Photo Gallery ({photos.length})</Text>
      <Sortable
        data={photos}
        renderItem={renderPhoto}
        itemHeight={80}
        style={styles.gallery}
        contentContainerStyle={styles.galleryContent}
      />
    </View>
  );
}
```

### Performance Optimized List

```tsx
function LargeSortableList() {
  const [items, setItems] = useState(generateLargeDataset(1000));

  // Memoize render function for performance
  const renderItem = useCallback(
    ({ item, id, positions, ...props }) => (
      <SortableItem key={id} id={id} positions={positions} {...props}>
        <MemoizedListItem item={item} />
      </SortableItem>
    ),
    []
  );

  return (
    <Sortable
      data={items}
      renderItem={renderItem}
      itemHeight={50}
      style={styles.performanceList}
    />
  );
}

// Memoized item component for better performance
const MemoizedListItem = React.memo(({ item }) => (
  <View style={styles.performanceItem}>
    <Text style={styles.itemText}>{item.title}</Text>
    <Text style={styles.itemIndex}>#{item.index}</Text>
  </View>
));
```

## Auto-Scrolling

The Sortable component automatically handles scrolling when dragging items near the edges:

- **Scroll Threshold**: 50px from top/bottom edges
- **Scroll Speed**: Adaptive based on proximity to edge
- **Smooth Scrolling**: Uses native scroll animations

```tsx
// Auto-scrolling is enabled by default
<Sortable
  data={data}
  renderItem={renderItem}
  itemHeight={60}
  // Auto-scrolling works automatically when dragging near edges
/>
```

## Performance Considerations

### Large Lists

For lists with many items (>100), consider:

1. **Memoization**: Use `React.memo` for item components
2. **Key Extraction**: Ensure stable, unique keys
3. **Minimal Re-renders**: Avoid inline functions in render

```tsx
// Good: Memoized component
const MemoizedItem = React.memo(({ item }) => (
  <View style={styles.item}>
    <Text>{item.title}</Text>
  </View>
));

// Good: Stable render function
const renderItem = useCallback(
  ({ item, id, positions, ...props }) => (
    <SortableItem key={id} id={id} positions={positions} {...props}>
      <MemoizedItem item={item} />
    </SortableItem>
  ),
  []
);
```

### Memory Management

```tsx
// Clean up resources when component unmounts
useEffect(() => {
  return () => {
    // Cleanup any subscriptions or timers
    clearTimeout(saveTimeout);
  };
}, []);
```

## TypeScript Support

The Sortable component is fully typed with generics:

```tsx
interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
}

// TypeScript infers the correct types
<Sortable<Task>
  data={tasks}
  renderItem={({ item, id, positions, ...props }) => {
    // item is correctly typed as Task
    // id is string
    // positions is SharedValue<{ [id: string]: number }>
    return (
      <SortableItem key={id} id={id} positions={positions} {...props}>
        <TaskComponent task={item} />
      </SortableItem>
    );
  }}
  itemHeight={60}
/>;
```

## Accessibility

The Sortable component includes accessibility features:

```tsx
<Sortable
  data={data}
  renderItem={({ item, id, positions, ...props }) => (
    <SortableItem
      key={id}
      id={id}
      positions={positions}
      {...props}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={`Reorder ${item.title}`}
      accessibilityHint="Double tap and hold to drag"
    >
      <Text>{item.title}</Text>
    </SortableItem>
  )}
  itemHeight={60}
/>
```

## See Also

- [SortableItem Component](./sortable-item) - Individual sortable items
- [useSortableList Hook](../hooks/useSortableList) - Underlying hook
- [SortableRenderItemProps](../types/sortable-types#sortablerenderitempropstdata) - Render function props
- [Performance Guide](../../guides/performance) - Optimization tips
