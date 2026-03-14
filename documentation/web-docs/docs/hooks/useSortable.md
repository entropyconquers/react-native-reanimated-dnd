---
sidebar_position: 3
---

# useSortable

The `useSortable` hook provides the core functionality for individual items within a sortable list, handling drag gestures, position animations, auto-scrolling, and reordering logic.

## Overview

This hook works in conjunction with `useSortableList` to provide a complete sortable solution. It handles the drag interactions for individual items, manages their position within the list, and provides smooth animations during reordering.

## Basic Usage

```tsx
import { useSortable } from "react-native-reanimated-dnd";
import { GestureDetector } from "react-native-gesture-handler";

function SortableTaskItem({ task, positions, ...sortableProps }) {
  const { animatedStyle, panGestureHandler, isMoving } = useSortable({
    id: task.id,
    positions,
    ...sortableProps,
    onMove: (id, from, to) => {
      console.log(`Task ${id} moved from ${from} to ${to}`);
      reorderTasks(id, from, to);
    },
  });

  return (
    <GestureDetector gesture={panGestureHandler}>
      <Animated.View style={[styles.taskItem, animatedStyle]}>
        <Text style={[styles.taskText, isMoving && styles.dragging]}>
          {task.title}
        </Text>
      </Animated.View>
    </GestureDetector>
  );
}
```

## Parameters

### UseSortableOptions&lt;T&gt;

| Option                | Type                                                                  | Default      | Description                             |
| --------------------- | --------------------------------------------------------------------- | ------------ | --------------------------------------- |
| `id`                  | `string`                                                              | **Required** | Unique identifier for the sortable item |
| `positions`           | `SharedValue<{[id: string]: number}>`                                 | **Required** | Shared value tracking item positions    |
| `lowerBound`          | `SharedValue<number>`                                                 | **Required** | Lower scroll boundary for auto-scroll   |
| `autoScrollDirection` | `SharedValue<ScrollDirection>`                                        | **Required** | Auto-scroll direction state             |
| `itemsCount`          | `number`                                                              | **Required** | Total number of items in the list       |
| `itemHeight`          | `number`                                                              | **Required** | Height of each item in pixels           |
| `containerHeight`     | `number`                                                              | -            | Height of the container                 |
| `onMove`              | `(id: string, from: number, to: number) => void`                      | -            | Callback when item is moved             |
| `onDragStart`         | `(id: string, position: number) => void`                              | -            | Callback when dragging starts           |
| `onDrop`              | `(id: string, position: number) => void`                              | -            | Callback when dragging ends             |
| `onDragging`          | `(id: string, overItemId: string \| null, yPosition: number) => void` | -            | Callback during dragging                |

### ScrollDirection Enum

```tsx
enum ScrollDirection {
  None = "none",
  Up = "up",
  Down = "down",
}
```

## Return Value

### UseSortableReturn

| Property            | Type                   | Description                                 |
| ------------------- | ---------------------- | ------------------------------------------- |
| `animatedStyle`     | `StyleProp<ViewStyle>` | Animated styles for position and transforms |
| `panGestureHandler` | `GestureType`          | Pan gesture to pass to GestureDetector      |
| `isMoving`          | `boolean`              | Whether the item is currently being dragged |
| `hasHandle`         | `boolean`              | Whether the item has a drag handle          |
| `registerHandle`   | `(registered: boolean) => void` | Callback for handle registration  |

## Examples

### Basic Sortable Item with Callbacks

```tsx
function TaskItem({ task, positions, ...sortableProps }) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartTime, setDragStartTime] = useState(0);

  const { animatedStyle, panGestureHandler, isMoving } = useSortable({
    id: task.id,
    positions,
    ...sortableProps,
    onMove: (id, from, to) => {
      console.log(`Task ${id} moved from position ${from} to ${to}`);

      // Update data
      reorderTasks(id, from, to);

      // Analytics
      analytics.track("task_reordered", {
        taskId: id,
        fromPosition: from,
        toPosition: to,
        taskTitle: task.title,
        dragDuration: Date.now() - dragStartTime,
      });

      // Auto-save
      saveTasks();
    },
    onDragStart: (id, position) => {
      setIsDragging(true);
      setDragStartTime(Date.now());
      hapticFeedback();

      console.log(`Started dragging task ${id} at position ${position}`);

      // Show global drag feedback
      showDragOverlay(task);
    },
    onDrop: (id, position) => {
      setIsDragging(false);
      hideDragOverlay();

      console.log(`Dropped task ${id} at position ${position}`);

      // Success feedback
      showToast("Task reordered successfully");
    },
    onDragging: (id, overItemId, yPosition) => {
      if (overItemId) {
        // Highlight the item being hovered over
        highlightItem(overItemId);
      }

      // Update drag position for global overlay
      updateDragPosition(yPosition);
    },
  });

  return (
    <GestureDetector gesture={panGestureHandler}>
      <Animated.View style={[styles.taskItem, animatedStyle]}>
        <View
          style={[
            styles.taskContent,
            isDragging && styles.draggingContent,
            isMoving && styles.movingContent,
          ]}
        >
          <Text style={styles.taskTitle}>{task.title}</Text>
          <Text style={styles.taskDescription}>{task.description}</Text>
          <View style={styles.taskMeta}>
            <Text style={styles.taskPriority}>{task.priority}</Text>
            <Text style={styles.taskDue}>{task.dueDate}</Text>
          </View>
          {isDragging && (
            <View style={styles.dragIndicator}>
              <Text style={styles.dragText}>Dragging...</Text>
            </View>
          )}
        </View>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  taskItem: {
    marginHorizontal: 16,
    marginVertical: 4,
  },
  taskContent: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  draggingContent: {
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    backgroundColor: "#f8f9fa",
  },
  movingContent: {
    opacity: 0.8,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
    color: "#1f2937",
  },
  taskDescription: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 8,
  },
  taskMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  taskPriority: {
    fontSize: 12,
    fontWeight: "bold",
    textTransform: "uppercase",
    color: "#ef4444",
  },
  taskDue: {
    fontSize: 12,
    color: "#9ca3af",
  },
  dragIndicator: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(59, 130, 246, 0.1)",
    borderRadius: 4,
    padding: 4,
  },
  dragText: {
    fontSize: 10,
    color: "#3b82f6",
    fontWeight: "bold",
  },
});
```

### Sortable Item with Drag Handle

```tsx
import { SortableHandle } from "react-native-reanimated-dnd";

function TaskWithHandle({ task, positions, ...sortableProps }) {
  const { animatedStyle, panGestureHandler, hasHandle, isMoving } = useSortable(
    {
      id: task.id,
      positions,
      ...sortableProps,
    }
  );

  return (
    <GestureDetector gesture={panGestureHandler}>
      <Animated.View style={[styles.taskContainer, animatedStyle]}>
        <View style={[styles.taskContent, isMoving && styles.movingTask]}>
          <View style={styles.taskInfo}>
            <Text style={styles.taskTitle}>{task.title}</Text>
            <Text style={styles.taskSubtitle}>{task.subtitle}</Text>
          </View>

          {/* Only this handle can initiate dragging */}
          <SortableHandle style={styles.dragHandle}>
            <View style={styles.handleIcon}>
              <View style={styles.handleDot} />
              <View style={styles.handleDot} />
              <View style={styles.handleDot} />
              <View style={styles.handleDot} />
              <View style={styles.handleDot} />
              <View style={styles.handleDot} />
            </View>
          </SortableHandle>
        </View>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  taskContainer: {
    marginHorizontal: 16,
    marginVertical: 4,
  },
  taskContent: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 16,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  movingTask: {
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    transform: [{ scale: 1.02 }],
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
    color: "#1f2937",
  },
  taskSubtitle: {
    fontSize: 14,
    color: "#6b7280",
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
    backgroundColor: "#9ca3af",
    borderRadius: 1.5,
  },
});
```

### Advanced Sortable Item with State Management

```tsx
function AdvancedSortableItem({ item, positions, ...sortableProps }) {
  const [localState, setLocalState] = useState({
    isDragging: false,
    isHovered: false,
    dragStartPosition: null,
    dragDistance: 0,
  });

  const { animatedStyle, panGestureHandler, isMoving } = useSortable({
    id: item.id,
    positions,
    ...sortableProps,
    onMove: (id, from, to) => {
      // Calculate drag distance
      const distance = Math.abs(to - from);
      setLocalState((prev) => ({ ...prev, dragDistance: distance }));

      // Update global state
      dispatch(reorderItems({ id, from, to }));

      // Complex analytics
      analytics.track("item_reordered", {
        itemId: id,
        fromPosition: from,
        toPosition: to,
        dragDistance: distance,
        itemType: item.type,
        category: item.category,
        timestamp: Date.now(),
      });

      // Conditional auto-save based on distance
      if (distance > 2) {
        debouncedSave();
      } else {
        immediateSave();
      }
    },
    onDragStart: (id, position) => {
      setLocalState((prev) => ({
        ...prev,
        isDragging: true,
        dragStartPosition: position,
        dragDistance: 0,
      }));

      // Global state updates
      dispatch(setDraggedItem(id));

      // Haptic feedback based on item type
      if (item.type === "important") {
        strongHapticFeedback();
      } else {
        lightHapticFeedback();
      }
    },
    onDrop: (id, position) => {
      setLocalState((prev) => ({
        ...prev,
        isDragging: false,
        dragStartPosition: null,
      }));

      // Clear global drag state
      dispatch(clearDraggedItem());

      // Success feedback with position info
      const moved = localState.dragStartPosition !== position;
      if (moved) {
        showToast(`Moved ${item.name} to position ${position + 1}`);
      }
    },
    onDragging: (id, overItemId, yPosition) => {
      // Update hover state
      setLocalState((prev) => ({
        ...prev,
        isHovered: !!overItemId,
      }));

      // Real-time position feedback
      if (overItemId) {
        showPositionIndicator(overItemId, yPosition);
      }

      // Update global drag position for overlays
      dispatch(updateDragPosition({ itemId: id, yPosition }));
    },
  });

  // Derived state for styling
  const itemStyle = useMemo(() => {
    const baseStyle = [styles.item, animatedStyle];

    if (localState.isDragging) {
      baseStyle.push(styles.dragging);
    }

    if (localState.isHovered) {
      baseStyle.push(styles.hovered);
    }

    if (isMoving) {
      baseStyle.push(styles.moving);
    }

    // Style based on item properties
    if (item.priority === "high") {
      baseStyle.push(styles.highPriority);
    }

    return baseStyle;
  }, [animatedStyle, localState, isMoving, item.priority]);

  return (
    <GestureDetector gesture={panGestureHandler}>
      <Animated.View style={itemStyle}>
        <View style={styles.itemContent}>
          <View style={styles.itemHeader}>
            <Text style={styles.itemTitle}>{item.name}</Text>
            {localState.isDragging && (
              <View style={styles.dragBadge}>
                <Text style={styles.dragBadgeText}>
                  {localState.dragDistance > 0
                    ? `+${localState.dragDistance}`
                    : "Dragging"}
                </Text>
              </View>
            )}
          </View>

          <Text style={styles.itemDescription}>{item.description}</Text>

          <View style={styles.itemFooter}>
            <Text style={styles.itemCategory}>{item.category}</Text>
            <Text style={styles.itemPosition}>
              Position: {positions.value[item.id] + 1}
            </Text>
          </View>
        </View>
      </Animated.View>
    </GestureDetector>
  );
}
```

### File List Sortable Item

```tsx
function SortableFileItem({ file, positions, ...sortableProps }) {
  const [isSelected, setIsSelected] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const { animatedStyle, panGestureHandler, isMoving } = useSortable({
    id: file.id,
    positions,
    ...sortableProps,
    onMove: (id, from, to) => {
      reorderFiles(id, from, to);

      // File-specific analytics
      analytics.track("file_reordered", {
        fileId: id,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        fromPosition: from,
        toPosition: to,
      });
    },
  });

  const getFileIcon = (type) => {
    switch (type) {
      case "image":
        return "image";
      case "video":
        return "video";
      case "audio":
        return "music";
      case "document":
        return "file-text";
      default:
        return "file";
    }
  };

  const getFileColor = (type) => {
    switch (type) {
      case "image":
        return "#10b981";
      case "video":
        return "#3b82f6";
      case "audio":
        return "#8b5cf6";
      case "document":
        return "#f59e0b";
      default:
        return "#6b7280";
    }
  };

  return (
    <GestureDetector gesture={panGestureHandler}>
      <Animated.View style={[styles.fileItem, animatedStyle]}>
        <Pressable
          style={[
            styles.fileContent,
            isSelected && styles.selectedFile,
            isMoving && styles.movingFile,
          ]}
          onPress={() => setIsSelected(!isSelected)}
          onLongPress={() => setShowPreview(true)}
        >
          <View style={styles.fileIcon}>
            <Icon
              name={getFileIcon(file.type)}
              size={24}
              color={getFileColor(file.type)}
            />
          </View>

          <View style={styles.fileInfo}>
            <Text style={styles.fileName} numberOfLines={1}>
              {file.name}
            </Text>
            <View style={styles.fileDetails}>
              <Text style={styles.fileSize}>{formatFileSize(file.size)}</Text>
              <Text style={styles.fileDate}>
                {formatDate(file.modifiedDate)}
              </Text>
            </View>
          </View>

          <View style={styles.fileActions}>
            {isSelected && (
              <View style={styles.selectedIndicator}>
                <Icon name="check" size={16} color="#3b82f6" />
              </View>
            )}

            <SortableHandle style={styles.dragHandle}>
              <Icon name="grip-vertical" size={16} color="#9ca3af" />
            </SortableHandle>
          </View>
        </Pressable>

        {showPreview && (
          <FilePreview file={file} onClose={() => setShowPreview(false)} />
        )}
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  fileItem: {
    marginHorizontal: 16,
    marginVertical: 2,
  },
  fileContent: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  selectedFile: {
    backgroundColor: "#eff6ff",
    borderColor: "#3b82f6",
  },
  movingFile: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
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
    color: "#1f2937",
  },
  fileDetails: {
    flexDirection: "row",
    gap: 8,
  },
  fileSize: {
    fontSize: 12,
    color: "#6b7280",
  },
  fileDate: {
    fontSize: 12,
    color: "#9ca3af",
  },
  fileActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  selectedIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#dbeafe",
    justifyContent: "center",
    alignItems: "center",
  },
  dragHandle: {
    padding: 4,
  },
});
```

### Custom Animation Sortable Item

```tsx
function AnimatedSortableItem({ item, positions, ...sortableProps }) {
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);
  const opacity = useSharedValue(1);

  const { animatedStyle, panGestureHandler, isMoving } = useSortable({
    id: item.id,
    positions,
    ...sortableProps,
    onDragStart: () => {
      // Custom drag start animation
      scale.value = withSpring(1.05, { damping: 15 });
      rotation.value = withSpring(2, { damping: 20 });
      opacity.value = withTiming(0.9, { duration: 200 });
    },
    onDrop: () => {
      // Custom drop animation
      scale.value = withSpring(1, { damping: 15 });
      rotation.value = withSpring(0, { damping: 20 });
      opacity.value = withTiming(1, { duration: 200 });
    },
  });

  const customAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { rotate: `${rotation.value}deg` }],
    opacity: opacity.value,
  }));

  return (
    <GestureDetector gesture={panGestureHandler}>
      <Animated.View
        style={[styles.animatedItem, animatedStyle, customAnimatedStyle]}
      >
        <View style={styles.itemContent}>
          <Text style={styles.itemTitle}>{item.title}</Text>
          <Text style={styles.itemSubtitle}>{item.subtitle}</Text>
          {isMoving && (
            <View style={styles.movingIndicator}>
              <Text style={styles.movingText}>Moving...</Text>
            </View>
          )}
        </View>
      </Animated.View>
    </GestureDetector>
  );
}
```

## Auto-scrolling

The hook automatically handles scrolling when dragging items near the edges:

- **Scroll Up**: When dragging near the top of the container
- **Scroll Down**: When dragging near the bottom of the container
- **Smooth Scrolling**: Uses momentum-based scrolling for natural feel
- **Configurable Threshold**: Auto-scroll triggers based on proximity to edges

## Handle Detection

Handle detection uses a registration pattern. When a `SortableItem.Handle` component mounts inside a sortable item, it calls `registerHandle(true)`, which sets `hasHandle` to `true`. When the handle unmounts, it calls `registerHandle(false)`.

```tsx
// Without handle - entire item is draggable
const { hasHandle } = useSortable({
  id: item.id,
  // ... other props
});
// hasHandle will be false

// With handle - the handle registers itself on mount
// Inside SortableItem, simply include SortableItem.Handle as a child:
<SortableItem {...props}>
  <View>
    <Text>Content</Text>
    <SortableItem.Handle>
      <Icon name="drag" />
    </SortableItem.Handle>
  </View>
</SortableItem>
// hasHandle will be true (set automatically via registerHandle)
```

## Performance Tips

- Use `React.memo` for item content that doesn't change frequently
- Avoid heavy computations in drag callbacks
- Use `useCallback` for stable callback references
- Keep item heights consistent for better performance
- Minimize the number of animated styles

## TypeScript Support

The hook is fully typed with generic support:

```tsx
interface TaskData {
  id: string;
  title: string;
  priority: "low" | "medium" | "high";
  completed: boolean;
}

// Fully typed hook usage
const { animatedStyle, panGestureHandler } = useSortable<TaskData>({
  id: task.id,
  positions,
  // ... other props
  onMove: (id: string, from: number, to: number) => {
    // Fully typed callback
    reorderTasks(id, from, to);
  },
});
```

## Integration with useSortableList

This hook is designed to work with `useSortableList`:

```tsx
function SortableList() {
  const { getItemProps, ...listProps } = useSortableList({
    data: items,
    itemHeight: 60,
  });

  return (
    <SortableListContainer {...listProps}>
      {items.map((item, index) => {
        const itemProps = getItemProps(item, index);
        return <SortableItemComponent key={item.id} {...itemProps} />;
      })}
    </SortableListContainer>
  );
}
```

## See Also

- [useSortableList](./useSortableList) - Hook for managing sortable lists
- [SortableItem Component](../components/sortable-item) - High-level component using this hook
- [Sortable Component](../components/sortable) - Complete sortable list solution
- [Examples](../examples/sortable-lists) - More comprehensive examples
