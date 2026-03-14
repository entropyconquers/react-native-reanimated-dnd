---
title: "SortableItem"
---

The `SortableItem` component represents individual items within a sortable list, providing drag-and-drop functionality, gesture handling, and smooth reordering animations.

## Overview

SortableItem provides the drag-and-drop functionality for individual list items within a Sortable component. It handles gesture recognition, position animations, reordering logic, and can be used with or without drag handles for different interaction patterns.

## Important: State Management

**DO NOT** update external state directly in sortable callbacks. SortableItem and its parent Sortable component maintain internal state for optimal performance. Updating external state in `onMove` will break the internal state management.

### Correct Usage

- Use `onMove` for logging, analytics, or side effects only
- Use `onDrop` with `allPositions` for read-only position tracking
- Let the sortable system handle reordering automatically

### Incorrect Usage

- Never call `reorderTasks()`, `setItems()`, or similar in `onMove`
- Never update arrays, Redux stores, or Zustand stores from drag events
- Never manually splice or modify external arrays during drag operations

## Basic Usage

```tsx
import { SortableItem } from "react-native-reanimated-dnd";

function TaskItem({ task, positions, ...sortableProps }) {
  return (
    <SortableItem
      id={task.id}
      data={task}
      positions={positions}
      {...sortableProps}
    >
      <View style={styles.taskContainer}>
        <Text style={styles.taskTitle}>{task.title}</Text>
        <Text style={styles.taskStatus}>
          {task.completed ? "Done" : "Pending"}
        </Text>
      </View>
    </SortableItem>
  );
}
```

## Props Reference

### Core Props

| Prop        | Type                    | Default      | Description                       |
| ----------- | ----------------------- | ------------ | --------------------------------- |
| `id`        | `string`                | **Required** | Unique identifier for the item    |
| `positions` | `SharedValue<number[]>` | **Required** | Shared value for item positions   |
| `children`  | `ReactNode`             | **Required** | Content to render inside the item |
| `data`      | `T`                     | -            | Data associated with this item    |

### Layout Props

| Prop                  | Type                           | Default      | Description                       |
| --------------------- | ------------------------------ | ------------ | --------------------------------- |
| `itemHeight`          | `number`                       | **Required** | Height of the item in pixels      |
| `itemsCount`          | `number`                       | **Required** | Total number of items in the list |
| `containerHeight`     | `SharedValue<number>`          | **Required** | Height of the container           |
| `lowerBound`          | `SharedValue<number>`          | **Required** | Lower scroll boundary             |
| `autoScrollDirection` | `SharedValue<ScrollDirection>` | **Required** | Auto-scroll direction state       |

### Styling Props

| Prop            | Type                           | Default | Description                  |
| --------------- | ------------------------------ | ------- | ---------------------------- |
| `style`         | `StyleProp<ViewStyle>`         | -       | Style for the item container |
| `animatedStyle` | `AnimatedStyleProp<ViewStyle>` | -       | Animated styles for the item |

### Callback Props

| Prop          | Type                                                                              | Default | Description                 |
| ------------- | --------------------------------------------------------------------------------- | ------- | --------------------------- |
| `onMove`      | `(id: string, from: number, to: number) => void`                                  | -       | Called when item is moved   |
| `onDragStart` | `(id: string, position: number) => void`                                          | -       | Called when dragging starts |
| `onDrop`      | `(id: string, position: number, allPositions?: { [id: string]: number }) => void` | -       | Called when dragging ends   |
| `onDragging`  | `(id: string, overItemId?: string, yPosition?: number) => void`                   | -       | Called during dragging      |

## Examples

### Basic Sortable Item

```tsx
function TaskItem({ task, positions, ...sortableProps }) {
  return (
    <SortableItem
      id={task.id}
      data={task}
      positions={positions}
      {...sortableProps}
      onMove={(id, from, to) => {
        console.log(`Task ${id} moved from ${from} to ${to}`);
        // Only log - do NOT call reorderTasks here
      }}
      onDrop={(id, position, allPositions) => {
        if (allPositions) {
          console.log("All positions:", allPositions);
          // Use for tracking only - NOT for state updates
        }
      }}
    >
      <View style={styles.taskContainer}>
        <Text style={styles.taskTitle}>{task.title}</Text>
        <Text style={styles.taskStatus}>
          {task.completed ? "Done" : "Pending"}
        </Text>
      </View>
    </SortableItem>
  );
}

const styles = StyleSheet.create({
  taskContainer: {
    backgroundColor: "white",
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: "500",
    flex: 1,
  },
  taskStatus: {
    fontSize: 14,
    color: "#666",
  },
});
```

### Sortable Item with Drag Handle

```tsx
function TaskItemWithHandle({ task, positions, ...sortableProps }) {
  return (
    <SortableItem
      id={task.id}
      data={task}
      positions={positions}
      {...sortableProps}
    >
      <View style={styles.taskContainer}>
        <View style={styles.taskContent}>
          <Text style={styles.taskTitle}>{task.title}</Text>
          <Text style={styles.taskDescription}>{task.description}</Text>
        </View>

        {/* Only this handle can initiate dragging */}
        <SortableItem.Handle style={styles.dragHandle}>
          <View style={styles.handleIcon}>
            <View style={styles.handleLine} />
            <View style={styles.handleLine} />
            <View style={styles.handleLine} />
          </View>
        </SortableItem.Handle>
      </View>
    </SortableItem>
  );
}

const styles = StyleSheet.create({
  taskContainer: {
    backgroundColor: "white",
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  taskDescription: {
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
    justifyContent: "space-between",
    alignItems: "center",
  },
  handleLine: {
    width: 16,
    height: 2,
    backgroundColor: "#999",
    borderRadius: 1,
  },
});
```

### Advanced Item with State Tracking

```tsx
function AdvancedTaskItem({ task, positions, ...sortableProps }) {
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <SortableItem
      id={task.id}
      data={task}
      positions={positions}
      {...sortableProps}
      onDragStart={(id, position) => {
        setIsDragging(true);
        hapticFeedback();
        analytics.track("drag_start", { taskId: id, position });
      }}
      onDrop={(id, position) => {
        setIsDragging(false);
        analytics.track("drag_end", { taskId: id, position });
      }}
      onDragging={(id, overItemId, yPosition) => {
        if (overItemId) {
          // Show visual feedback for item being hovered over
          setIsHovered(overItemId === task.id);
        }
      }}
      onMove={(id, from, to) => {
        // Only log - do NOT update state here
        console.log(`Task ${id} moved from ${from} to ${to}`);
        analytics.track("task_reordered", { id, from, to });
        // DO NOT: reorderTasks(id, from, to); syncToBackend();
      }}
      style={[
        styles.taskItem,
        isDragging && styles.draggingItem,
        isHovered && styles.hoveredItem,
      ]}
    >
      <View style={styles.taskContent}>
        <Text style={styles.taskTitle}>{task.title}</Text>
        <Text style={styles.taskPriority}>Priority: {task.priority}</Text>
        <Text style={styles.taskDue}>Due: {task.dueDate}</Text>
        {isDragging && <Text style={styles.dragIndicator}>Dragging...</Text>}
      </View>

      <View style={styles.taskMeta}>
        <Text style={styles.taskAssignee}>{task.assignee}</Text>
        <View style={[styles.priorityDot, getPriorityColor(task.priority)]} />
      </View>
    </SortableItem>
  );
}

const styles = StyleSheet.create({
  taskItem: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 4,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  draggingItem: {
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    transform: [{ scale: 1.02 }],
    backgroundColor: "#f8f9fa",
  },
  hoveredItem: {
    backgroundColor: "rgba(59, 130, 246, 0.05)",
    borderColor: "#3b82f6",
    borderWidth: 1,
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  taskPriority: {
    fontSize: 12,
    color: "#666",
    marginBottom: 2,
  },
  taskDue: {
    fontSize: 12,
    color: "#999",
  },
  dragIndicator: {
    fontSize: 12,
    color: "#3b82f6",
    fontWeight: "bold",
    marginTop: 4,
  },
  taskMeta: {
    alignItems: "flex-end",
  },
  taskAssignee: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});

function getPriorityColor(priority) {
  switch (priority) {
    case "high":
      return { backgroundColor: "#ef4444" };
    case "medium":
      return { backgroundColor: "#f59e0b" };
    case "low":
      return { backgroundColor: "#10b981" };
    default:
      return { backgroundColor: "#6b7280" };
  }
}
```

### Custom Animated Styles

```tsx
function AnimatedTaskItem({ task, positions, ...sortableProps }) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <SortableItem
      id={task.id}
      data={task}
      positions={positions}
      {...sortableProps}
      animatedStyle={animatedStyle}
      onDragStart={() => {
        scale.value = withSpring(1.05);
        opacity.value = withTiming(0.9);
      }}
      onDrop={() => {
        scale.value = withSpring(1);
        opacity.value = withTiming(1);
      }}
    >
      <View style={styles.taskItem}>
        <Text style={styles.taskTitle}>{task.title}</Text>
      </View>
    </SortableItem>
  );
}
```

### File List Item

```tsx
function FileListItem({ file, positions, ...sortableProps }) {
  const [isSelected, setIsSelected] = useState(false);

  return (
    <SortableItem
      id={file.id}
      data={file}
      positions={positions}
      {...sortableProps}
      onMove={(id, from, to) => {
        console.log(`File ${id} moved from ${from} to ${to}`);
        // Only show feedback - do NOT call reorderFiles here
        showToast("File reordered");
      }}
    >
      <Pressable
        style={[styles.fileItem, isSelected && styles.selectedFile]}
        onPress={() => setIsSelected(!isSelected)}
      >
        <View style={styles.fileIcon}>
          <Icon
            name={getFileIcon(file.type)}
            size={24}
            color={getFileColor(file.type)}
          />
        </View>

        <View style={styles.fileInfo}>
          <Text style={styles.fileName}>{file.name}</Text>
          <Text style={styles.fileSize}>{formatFileSize(file.size)}</Text>
          <Text style={styles.fileDate}>{formatDate(file.modifiedDate)}</Text>
        </View>

        <SortableItem.Handle style={styles.dragHandle}>
          <Icon name="drag-handle" size={20} color="#999" />
        </SortableItem.Handle>
      </Pressable>
    </SortableItem>
  );
}

const styles = StyleSheet.create({
  fileItem: {
    backgroundColor: "white",
    padding: 12,
    marginHorizontal: 16,
    marginVertical: 2,
    borderRadius: 6,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  selectedFile: {
    backgroundColor: "#eff6ff",
    borderColor: "#3b82f6",
  },
  fileIcon: {
    marginRight: 12,
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 2,
  },
  fileSize: {
    fontSize: 12,
    color: "#666",
  },
  fileDate: {
    fontSize: 11,
    color: "#999",
  },
  dragHandle: {
    padding: 8,
    marginLeft: 8,
  },
});
```

## Handle Component

The `SortableItem.Handle` component creates specific draggable areas within the item:

### Handle Props

| Prop       | Type                   | Description                         |
| ---------- | ---------------------- | ----------------------------------- |
| `children` | `ReactNode`            | Content to render inside the handle |
| `style`    | `StyleProp<ViewStyle>` | Style for the handle container      |

### Handle Examples

```tsx
// Icon handle
<SortableItem.Handle style={styles.iconHandle}>
  <Icon name="drag-handle" size={20} color="#666" />
</SortableItem.Handle>

// Custom dots handle
<SortableItem.Handle style={styles.dotsHandle}>
  <View style={styles.dotsGrid}>
    {Array.from({ length: 6 }).map((_, i) => (
      <View key={i} style={styles.dot} />
    ))}
  </View>
</SortableItem.Handle>

// Lines handle
<SortableItem.Handle style={styles.linesHandle}>
  <View style={styles.linesContainer}>
    <View style={styles.line} />
    <View style={styles.line} />
    <View style={styles.line} />
  </View>
</SortableItem.Handle>

// Text handle
<SortableItem.Handle style={styles.textHandle}>
  <Text style={styles.handleText}>≡</Text>
</SortableItem.Handle>
```

### Handle Styling

```tsx
const handleStyles = StyleSheet.create({
  iconHandle: {
    padding: 8,
    borderRadius: 4,
    backgroundColor: "#f3f4f6",
  },
  dotsHandle: {
    padding: 8,
  },
  dotsGrid: {
    width: 16,
    height: 16,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignContent: "space-between",
  },
  dot: {
    width: 2,
    height: 2,
    backgroundColor: "#9ca3af",
    borderRadius: 1,
  },
  linesHandle: {
    padding: 8,
  },
  linesContainer: {
    width: 16,
    height: 12,
    justifyContent: "space-between",
  },
  line: {
    height: 2,
    backgroundColor: "#9ca3af",
    borderRadius: 1,
  },
  textHandle: {
    padding: 8,
  },
  handleText: {
    fontSize: 16,
    color: "#9ca3af",
    fontWeight: "bold",
  },
});
```

## Callback Details

### onMove Callback

Called when the item is successfully moved to a new position:

```tsx
// INCORRECT - Do NOT do this in onMove
const handleMoveIncorrect = (
  itemId: string,
  fromIndex: number,
  toIndex: number
) => {
  // This breaks sortable functionality
  const newData = [...data];
  const [movedItem] = newData.splice(fromIndex, 1);
  newData.splice(toIndex, 0, movedItem);
  setData(newData); // Never update state in onMove
};

// CORRECT - Use onMove for logging/analytics only
const handleMove = (itemId: string, fromIndex: number, toIndex: number) => {
  console.log(`Item ${itemId} moved from position ${fromIndex} to ${toIndex}`);

  // Use for analytics, logging, side effects only
  analytics.track("item_moved", { itemId, fromIndex, toIndex });

  // DO NOT update state here - sortable handles this internally
};

// Use onDrop for position tracking (read-only)
const handleDrop = (
  itemId: string,
  position: number,
  allPositions?: { [id: string]: number }
) => {
  if (allPositions) {
    // Use for external tracking only
    console.log("Final positions:", allPositions);
    // You can save this for external state synchronization (read-only)
  }
};
```

### onDragStart Callback

Called when dragging begins:

```tsx
const handleDragStart = (itemId: string, position: number) => {
  console.log(`Started dragging item ${itemId} at position ${position}`);

  // Haptic feedback
  hapticFeedback();

  // Update UI state
  setDraggedItemId(itemId);

  // Analytics
  analytics.track("sortable_drag_start", { itemId, position });
};
```

### onDrop Callback

Called when dragging ends:

```tsx
const handleDrop = (
  itemId: string,
  position: number,
  allPositions?: { [id: string]: number }
) => {
  console.log(`Dropped item ${itemId} at position ${position}`);

  // allPositions provides complete position data for advanced use cases
  if (allPositions) {
    console.log("All current positions:", allPositions);

    // IMPORTANT: Use this ONLY for read-only tracking
    // DO NOT update your state arrays directly with this data
    // Use for: analytics, external state synchronization (read-only), logging
  }

  // Clear UI state
  setDraggedItemId(null);

  // Success feedback
  showToast("Item reordered successfully");

  // Analytics
  analytics.track("sortable_drag_end", { itemId, position });
};
```

**Enhanced onDrop with allPositions Parameter**: The third parameter `allPositions` (optional) contains the complete positions object with all items' current positions. This provides additional context for advanced use cases where you need complete visibility into the sortable list state. This parameter is backward compatible - existing code continues to work unchanged.

### onDragging Callback

Called continuously during dragging:

```tsx
const handleDragging = (
  itemId: string,
  overItemId?: string,
  yPosition?: number
) => {
  console.log(`Dragging ${itemId}, over ${overItemId}, at y: ${yPosition}`);

  // Update hover states
  if (overItemId) {
    setHoveredItemId(overItemId);
  }

  // Update drag position for overlays
  if (yPosition !== undefined) {
    updateDragOverlayPosition(yPosition);
  }
};
```

## TypeScript Support

The SortableItem component is fully typed with generic support:

```tsx
interface TaskData {
  id: string;
  title: string;
  priority: "low" | "medium" | "high";
  completed: boolean;
  assignee?: string;
}

// Fully typed sortable item
<SortableItem<TaskData>
  id={task.id}
  data={task}
  positions={positions}
  {...props}
  onMove={(id: string, from: number, to: number) => {
    // Fully typed callback
    reorderTasks(id, from, to);
  }}
>
  <TaskComponent task={task} />
</SortableItem>;
```

## Performance Tips

- Use `React.memo` for item content that doesn't change frequently
- Avoid heavy computations in drag callbacks
- Use `useCallback` for stable callback references
- Keep item heights consistent for better performance
- Minimize the number of animated styles

## Accessibility

The SortableItem component supports accessibility features:

```tsx
<SortableItem id={item.id} data={item} positions={positions} {...props}>
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
        moveItemUp(item.id);
      } else if (event.nativeEvent.actionName === "move-down") {
        moveItemDown(item.id);
      }
    }}
  >
    <Text>{item.title}</Text>
  </View>
</SortableItem>
```

## Common Patterns

### Conditional Handles

```tsx
function ConditionalHandleItem({ item, canReorder, ...props }) {
  return (
    <SortableItem {...props}>
      <View style={styles.item}>
        <Text>{item.title}</Text>
        {canReorder && (
          <SortableItem.Handle style={styles.handle}>
            <Icon name="drag-handle" />
          </SortableItem.Handle>
        )}
      </View>
    </SortableItem>
  );
}
```

### Multi-select Support

```tsx
function MultiSelectItem({ item, isSelected, onSelect, ...props }) {
  return (
    <SortableItem {...props}>
      <Pressable
        style={[styles.item, isSelected && styles.selected]}
        onPress={() => onSelect(item.id)}
      >
        <Checkbox value={isSelected} />
        <Text>{item.title}</Text>
        <SortableItem.Handle style={styles.handle}>
          <Icon name="drag-handle" />
        </SortableItem.Handle>
      </Pressable>
    </SortableItem>
  );
}
```

## See Also

- [Sortable](./sortable) - Parent sortable list component
- [useSortable Hook](../hooks/useSortable) - Underlying hook for custom implementations
- [Basic Concepts](../getting-started/basic-concepts) - Understanding sortable lists
- [Examples](../examples/sortable-lists) - More comprehensive examples
