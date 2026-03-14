---
title: "SortableItem Component"
---

A component for individual items within a sortable list, providing drag-and-drop functionality with gesture recognition, position animations, and reordering logic.

## Overview

The `SortableItem` component handles the drag-and-drop functionality for individual list items. It can be used with or without drag handles for different interaction patterns and integrates seamlessly with the `Sortable` component or `useSortableList` hook.

## Import

```tsx
import { SortableItem } from "react-native-reanimated-dnd";
```

## Props

### Core Props

#### id

- **Type**: `string`
- **Required**: Yes
- **Description**: Unique identifier for this sortable item. Used for tracking position and reordering.

```tsx
<SortableItem id="task-1" positions={positions} {...props}>
  <Text>Task content</Text>
</SortableItem>
```

#### positions

- **Type**: `SharedValue<{ [id: string]: number }>`
- **Required**: Yes
- **Description**: Shared value containing the position mapping for all items in the sortable list.

#### children

- **Type**: `React.ReactNode`
- **Required**: Yes
- **Description**: The content to render inside the sortable item.

### Layout Props

#### itemHeight

- **Type**: `number`
- **Required**: Yes
- **Description**: Height of this item in pixels. Used for position calculations and animations.

#### itemsCount

- **Type**: `number`
- **Required**: Yes
- **Description**: Total number of items in the sortable list.

#### containerHeight

- **Type**: `number`
- **Required**: Yes
- **Description**: Height of the container holding the sortable list.

### Scroll Props

#### lowerBound

- **Type**: `SharedValue<number>`
- **Required**: Yes
- **Description**: Lower boundary for auto-scrolling calculations.

#### autoScrollDirection

- **Type**: `SharedValue<ScrollDirection>`
- **Required**: Yes
- **Description**: Current auto-scroll direction state.

### Optional Props

#### data

- **Type**: `T`
- **Required**: No
- **Description**: Data payload associated with this item. Passed to callback functions.

#### style

- **Type**: `StyleProp<ViewStyle>`
- **Required**: No
- **Description**: Style applied to the item container.

#### animatedStyle

- **Type**: `AnimatedStyle<ViewStyle>`
- **Required**: No
- **Description**: Custom animated styles applied to the item.

### Callback Props

#### onMove

- **Type**: `(id: string, from: number, to: number) => void`
- **Required**: No
- **Description**: Callback fired when the item is moved to a new position.

```tsx
<SortableItem
  id="task-1"
  positions={positions}
  onMove={(id, from, to) => {
    console.log(`Item ${id} moved from position ${from} to ${to}`);
    reorderItems(id, from, to);
  }}
  {...props}
>
  <Text>Moveable item</Text>
</SortableItem>
```

#### onDragStart

- **Type**: `(id: string, position: number) => void`
- **Required**: No
- **Description**: Callback fired when dragging starts.

```tsx
<SortableItem
  id="task-1"
  positions={positions}
  onDragStart={(id, position) => {
    console.log(`Started dragging item ${id} at position ${position}`);
    hapticFeedback();
  }}
  {...props}
>
  <Text>Draggable item</Text>
</SortableItem>
```

#### onDrop

- **Type**: `(id: string, position: number) => void`
- **Required**: No
- **Description**: Callback fired when dragging ends.

#### onDragging

- **Type**: `(id: string, overItemId: string | null, yPosition: number) => void`
- **Required**: No
- **Description**: Callback fired continuously while dragging. Provides information about which item is being hovered over.

## SortableItem.Handle

A handle component that creates a specific draggable area within the sortable item. When a handle is present, only the handle area can initiate dragging.

### Props

#### children

- **Type**: `React.ReactNode`
- **Required**: Yes
- **Description**: The content to render inside the handle.

#### style

- **Type**: `StyleProp<ViewStyle>`
- **Required**: No
- **Description**: Style applied to the handle container.

## Usage Examples

### Basic Sortable Item

```tsx
import { SortableItem } from "react-native-reanimated-dnd";

function TaskItem({ task, positions, ...sortableProps }) {
  return (
    <SortableItem
      id={task.id}
      data={task}
      positions={positions}
      {...sortableProps}
      onMove={(id, from, to) => {
        console.log(`Task ${id} moved from ${from} to ${to}`);
        reorderTasks(id, from, to);
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
    backgroundColor: "#fff",
    padding: 16,
    marginVertical: 4,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
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
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    marginVertical: 4,
    borderRadius: 8,
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
    height: 16,
    justifyContent: "space-between",
  },
  handleLine: {
    height: 2,
    backgroundColor: "#999",
    borderRadius: 1,
  },
});
```

### Advanced Sortable Item with State Tracking

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
          setIsHovered(true);
          // Show visual feedback for item being hovered over
          highlightItem(overItemId);
        } else {
          setIsHovered(false);
        }
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
        {isDragging && <Text style={styles.dragIndicator}>Dragging...</Text>}
      </View>
    </SortableItem>
  );
}

const styles = StyleSheet.create({
  taskItem: {
    backgroundColor: "#fff",
    padding: 16,
    marginVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  draggingItem: {
    opacity: 0.8,
    transform: [{ scale: 1.05 }],
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  hoveredItem: {
    borderColor: "#007AFF",
    backgroundColor: "#f0f8ff",
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
    fontSize: 14,
    color: "#666",
  },
  dragIndicator: {
    fontSize: 12,
    color: "#007AFF",
    fontStyle: "italic",
    marginTop: 4,
  },
});
```

### File List Sortable Item

```tsx
interface FileItem {
  id: string;
  name: string;
  size: number;
  type: string;
  lastModified: Date;
}

function FileListItem({ file, positions, ...sortableProps }) {
  const [isSelected, setIsSelected] = useState(false);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return "📄";
      case "image":
        return "🖼️";
      case "video":
        return "🎥";
      case "audio":
        return "🎵";
      default:
        return "📁";
    }
  };

  return (
    <SortableItem
      id={file.id}
      data={file}
      positions={positions}
      {...sortableProps}
      onMove={(id, from, to) => {
        reorderFiles(id, from, to);
        showToast(`${file.name} moved`);
      }}
    >
      <TouchableOpacity
        onPress={() => setIsSelected(!isSelected)}
        style={[styles.fileItem, isSelected && styles.selectedFile]}
      >
        <View style={styles.fileIcon}>
          <Text style={styles.iconText}>{getFileIcon(file.type)}</Text>
        </View>

        <View style={styles.fileInfo}>
          <Text style={styles.fileName}>{file.name}</Text>
          <Text style={styles.fileDetails}>
            {formatFileSize(file.size)} •{" "}
            {file.lastModified.toLocaleDateString()}
          </Text>
        </View>

        <SortableItem.Handle style={styles.fileHandle}>
          <View style={styles.handleDots}>
            <View style={styles.dot} />
            <View style={styles.dot} />
            <View style={styles.dot} />
            <View style={styles.dot} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>
        </SortableItem.Handle>
      </TouchableOpacity>
    </SortableItem>
  );
}

const styles = StyleSheet.create({
  fileItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    marginVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  selectedFile: {
    backgroundColor: "#e3f2fd",
    borderColor: "#2196f3",
  },
  fileIcon: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  iconText: {
    fontSize: 24,
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 2,
  },
  fileDetails: {
    fontSize: 12,
    color: "#666",
  },
  fileHandle: {
    padding: 8,
  },
  handleDots: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: 12,
    height: 12,
  },
  dot: {
    width: 2,
    height: 2,
    backgroundColor: "#999",
    borderRadius: 1,
    margin: 1,
  },
});
```

### Custom Animated Sortable Item

```tsx
function AnimatedTaskItem({ task, positions, ...sortableProps }) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

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
      <View style={styles.animatedTask}>
        <Text style={styles.taskTitle}>{task.title}</Text>
        <Text style={styles.taskDescription}>{task.description}</Text>
      </View>
    </SortableItem>
  );
}
```

### Photo Gallery Sortable Item

```tsx
function PhotoGalleryItem({ photo, positions, ...sortableProps }) {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <SortableItem
      id={photo.id}
      data={photo}
      positions={positions}
      {...sortableProps}
      onMove={(id, from, to) => {
        reorderPhotos(id, from, to);
      }}
    >
      <View style={styles.photoItem}>
        <Image
          source={{ uri: photo.uri }}
          style={styles.photoImage}
          onLoad={() => setImageLoaded(true)}
        />

        {!imageLoaded && (
          <View style={styles.photoPlaceholder}>
            <ActivityIndicator size="small" color="#666" />
          </View>
        )}

        <View style={styles.photoOverlay}>
          <Text style={styles.photoTitle}>{photo.title}</Text>

          <SortableItem.Handle style={styles.photoHandle}>
            <View style={styles.handleIcon}>
              <Icon name="drag-handle" size={20} color="#fff" />
            </View>
          </SortableItem.Handle>
        </View>
      </View>
    </SortableItem>
  );
}

const styles = StyleSheet.create({
  photoItem: {
    position: "relative",
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    overflow: "hidden",
    marginVertical: 4,
  },
  photoImage: {
    width: "100%",
    height: 120,
    resizeMode: "cover",
  },
  photoPlaceholder: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  photoOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    padding: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  photoTitle: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
    flex: 1,
  },
  photoHandle: {
    padding: 4,
  },
  handleIcon: {
    opacity: 0.8,
  },
});
```

## TypeScript Support

The component is fully typed with generic support:

```tsx
interface TaskData {
  id: string;
  title: string;
  priority: "low" | "medium" | "high";
  completed: boolean;
}

function TypedSortableItem({ task, positions, ...props }) {
  return (
    <SortableItem<TaskData>
      id={task.id}
      data={task}
      positions={positions}
      {...props}
      onMove={(id: string, from: number, to: number) => {
        // All parameters are properly typed
        console.log(`Task ${id} moved from ${from} to ${to}`);
      }}
      onDragStart={(id: string, position: number) => {
        // Parameters are typed
        console.log(`Started dragging task ${id} at position ${position}`);
      }}
    >
      <Text>{task.title}</Text>
    </SortableItem>
  );
}
```

## Performance Tips

1. **Use `React.memo`** for item components to prevent unnecessary re-renders
2. **Memoize callback functions** with `useCallback`
3. **Avoid complex calculations** in render functions
4. **Use stable keys** for consistent performance

```tsx
// Good: Memoized component
const MemoizedSortableItem = React.memo(({ item, positions, ...props }) => (
  <SortableItem id={item.id} positions={positions} {...props}>
    <ItemContent item={item} />
  </SortableItem>
));

// Good: Memoized callbacks
const handleMove = useCallback((id, from, to) => {
  reorderItems(id, from, to);
}, []);
```

## Accessibility

The component includes accessibility features:

```tsx
<SortableItem
  id="task-1"
  positions={positions}
  {...props}
  accessible={true}
  accessibilityRole="button"
  accessibilityLabel={`Reorder ${task.title}`}
  accessibilityHint="Double tap and hold to drag"
>
  <Text>{task.title}</Text>
</SortableItem>
```

## See Also

- [Sortable Component](./sortable) - High-level sortable list component
- [useSortable Hook](../hooks/useSortable) - Underlying hook
- [useSortableList Hook](../hooks/useSortableList) - List management hook
- [SortableItemProps](../types/sortable-types#sortableitempropst) - Component props
