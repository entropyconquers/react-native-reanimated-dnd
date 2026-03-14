---
title: "useSortable Hook"
---

A hook for creating sortable list items with drag-and-drop reordering capabilities, position animations, and auto-scrolling support.

## Overview

The `useSortable` hook provides the core functionality for individual items within a sortable list, handling drag gestures, position animations, auto-scrolling, and reordering logic. It works in conjunction with `useSortableList` to provide a complete sortable solution.

## Import

```tsx
import { useSortable } from "react-native-reanimated-dnd";
```

## Parameters

### UseSortableOptions\<T\>

#### Core Parameters

##### id

- **Type**: `string`
- **Required**: Yes
- **Description**: Unique identifier for this sortable item. Used for tracking position and reordering.

##### positions

- **Type**: `SharedValue<{ [id: string]: number }>`
- **Required**: Yes
- **Description**: Shared value containing the position mapping for all items in the sortable list.

##### itemsCount

- **Type**: `number`
- **Required**: Yes
- **Description**: Total number of items in the sortable list.

##### itemHeight

- **Type**: `number`
- **Required**: Yes
- **Description**: Height of each item in pixels. Used for position calculations and animations.

##### lowerBound

- **Type**: `SharedValue<number>`
- **Required**: Yes
- **Description**: Lower boundary for auto-scrolling calculations.

##### autoScrollDirection

- **Type**: `SharedValue<ScrollDirection>`
- **Required**: Yes
- **Description**: Current auto-scroll direction state.

```tsx
const { animatedStyle, panGestureHandler } = useSortable({
  id: "task-1",
  positions: positionsSharedValue,
  itemsCount: 10,
  itemHeight: 60,
  lowerBound: scrollBound,
  autoScrollDirection: scrollDirection,
});
```

#### Optional Parameters

##### containerHeight

- **Type**: `number`
- **Required**: No
- **Description**: Height of the container holding the sortable list. Used for auto-scrolling calculations.

##### onMove

- **Type**: `(id: string, from: number, to: number) => void`
- **Required**: No
- **Description**: Callback fired when the item is moved to a new position.

```tsx
const { animatedStyle, panGestureHandler } = useSortable({
  id: "task-1",
  positions,
  itemsCount: 10,
  itemHeight: 60,
  lowerBound,
  autoScrollDirection,
  onMove: (id, from, to) => {
    console.log(`Item ${id} moved from position ${from} to ${to}`);
    reorderItems(id, from, to);
  },
});
```

##### onDragStart

- **Type**: `(id: string, position: number) => void`
- **Required**: No
- **Description**: Callback fired when dragging starts.

##### onDrop

- **Type**: `(id: string, position: number) => void`
- **Required**: No
- **Description**: Callback fired when dragging ends.

##### onDragging

- **Type**: `(id: string, overItemId: string | null, yPosition: number) => void`
- **Required**: No
- **Description**: Callback fired continuously while dragging. Provides information about which item is being hovered over.

## Return Value

### UseSortableReturn

#### animatedStyle

- **Type**: `StyleProp<ViewStyle>`
- **Description**: Animated styles to apply to the sortable item. Contains position and transformation animations.

```tsx
const { animatedStyle, panGestureHandler } = useSortable(options);

return (
  <GestureDetector gesture={panGestureHandler}>
    <Animated.View style={[styles.item, animatedStyle]}>
      <Text>Sortable content</Text>
    </Animated.View>
  </GestureDetector>
);
```

#### panGestureHandler

- **Type**: `GestureType`
- **Description**: Pan gesture definition to pass to a GestureDetector for handling drag interactions.

#### isMoving

- **Type**: `boolean`
- **Description**: Whether this item is currently being dragged.

```tsx
const { animatedStyle, panGestureHandler, isMoving } = useSortable(options);

return (
  <GestureDetector gesture={panGestureHandler}>
    <Animated.View
      style={[styles.item, animatedStyle, isMoving && styles.dragging]}
    >
      <Text>Item content</Text>
    </Animated.View>
  </GestureDetector>
);
```

#### hasHandle

- **Type**: `boolean`
- **Description**: Whether this sortable item has a handle component. When true, only the handle can initiate dragging.

#### registerHandle

- **Type**: `(registered: boolean) => void`
- **Description**: Callback for handle components to register/unregister themselves. Called with `true` when a handle mounts, `false` when it unmounts.

## Usage Examples

### Basic Sortable Item

```tsx
import { useSortable } from "react-native-reanimated-dnd";
import { GestureDetector } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";

function SortableTaskItem({ task, positions, ...sortableProps }) {
  const { animatedStyle, panGestureHandler, isMoving } = useSortable({
    id: task.id,
    positions,
    ...sortableProps,
    onMove: (id, from, to) => {
      console.log(`Task ${id} moved from ${from} to ${to}`);
      reorderTasks(id, from, to);
    },
    onDragStart: (id, position) => {
      console.log(`Started dragging task ${id} at position ${position}`);
      hapticFeedback();
    },
  });

  return (
    <GestureDetector gesture={panGestureHandler}>
      <Animated.View
        style={[styles.taskItem, animatedStyle, isMoving && styles.dragging]}
      >
        <Text style={[styles.taskText, isMoving && styles.draggingText]}>
          {task.title}
        </Text>
        <Text style={styles.taskStatus}>
          {task.completed ? "Done" : "Pending"}
        </Text>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  taskItem: {
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
  dragging: {
    opacity: 0.8,
    transform: [{ scale: 1.05 }],
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  taskText: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  draggingText: {
    color: "#007AFF",
  },
  taskStatus: {
    fontSize: 14,
    color: "#666",
  },
});
```

### Sortable Item with State Tracking

```tsx
function AdvancedSortableItem({ task, positions, ...sortableProps }) {
  const [dragState, setDragState] = useState("idle"); // idle, dragging, dropped
  const [hoverTarget, setHoverTarget] = useState(null);

  const { animatedStyle, panGestureHandler, isMoving } = useSortable({
    id: task.id,
    positions,
    ...sortableProps,
    onDragStart: (id, position) => {
      setDragState("dragging");
      hapticFeedback();
      analytics.track("drag_start", { taskId: id, position });
    },
    onDrop: (id, position) => {
      setDragState("dropped");
      setTimeout(() => setDragState("idle"), 300);
      analytics.track("drag_end", { taskId: id, position });
    },
    onDragging: (id, overItemId, yPosition) => {
      setHoverTarget(overItemId);
      if (overItemId) {
        // Show visual feedback for item being hovered over
        highlightItem(overItemId);
      }
    },
    onMove: (id, from, to) => {
      reorderTasks(id, from, to);
      showToast(`Task moved to position ${to + 1}`);
    },
  });

  return (
    <GestureDetector gesture={panGestureHandler}>
      <Animated.View
        style={[styles.taskItem, animatedStyle, styles[dragState]]}
      >
        <View style={styles.taskContent}>
          <Text style={styles.taskTitle}>{task.title}</Text>
          <Text style={styles.taskPriority}>Priority: {task.priority}</Text>

          {dragState === "dragging" && (
            <Text style={styles.dragIndicator}>
              {hoverTarget ? `Over: ${hoverTarget}` : "Dragging..."}
            </Text>
          )}

          {dragState === "dropped" && (
            <Text style={styles.dropIndicator}>Dropped!</Text>
          )}
        </View>

        <View style={styles.taskMeta}>
          <Text style={styles.taskId}>#{task.id}</Text>
          <Text style={styles.dragState}>{dragState}</Text>
        </View>
      </Animated.View>
    </GestureDetector>
  );
}
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

function SortableFileItem({ file, positions, ...sortableProps }) {
  const [isSelected, setIsSelected] = useState(false);

  const { animatedStyle, panGestureHandler, isMoving } = useSortable({
    id: file.id,
    positions,
    ...sortableProps,
    onMove: (id, from, to) => {
      reorderFiles(id, from, to);
      showToast(`${file.name} moved`);
    },
  });

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
    <GestureDetector gesture={panGestureHandler}>
      <Animated.View
        style={[
          styles.fileItem,
          animatedStyle,
          isSelected && styles.selectedFile,
          isMoving && styles.movingFile,
        ]}
      >
        <TouchableOpacity
          onPress={() => setIsSelected(!isSelected)}
          style={styles.fileContent}
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

          <View style={styles.dragIndicator}>
            <View style={styles.dragDots}>
              <View style={styles.dot} />
              <View style={styles.dot} />
              <View style={styles.dot} />
              <View style={styles.dot} />
              <View style={styles.dot} />
              <View style={styles.dot} />
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    </GestureDetector>
  );
}
```

### Photo Gallery Sortable Item

```tsx
function SortablePhotoItem({ photo, positions, ...sortableProps }) {
  const [imageLoaded, setImageLoaded] = useState(false);

  const { animatedStyle, panGestureHandler, isMoving } = useSortable({
    id: photo.id,
    positions,
    ...sortableProps,
    onMove: (id, from, to) => {
      reorderPhotos(id, from, to);
    },
    onDragStart: () => {
      hapticFeedback();
    },
  });

  return (
    <GestureDetector gesture={panGestureHandler}>
      <Animated.View
        style={[
          styles.photoItem,
          animatedStyle,
          isMoving && styles.movingPhoto,
        ]}
      >
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

### Custom Animated Sortable Item

```tsx
function AnimatedSortableItem({ item, positions, ...sortableProps }) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const rotation = useSharedValue(0);

  const { animatedStyle, panGestureHandler, isMoving } = useSortable({
    id: item.id,
    positions,
    ...sortableProps,
    onDragStart: () => {
      scale.value = withSpring(1.1);
      opacity.value = withTiming(0.9);
      rotation.value = withSpring(2); // Slight rotation
    },
    onDrop: () => {
      scale.value = withSpring(1);
      opacity.value = withTiming(1);
      rotation.value = withSpring(0);
    },
  });

  const customAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }, { rotate: `${rotation.value}deg` }],
      opacity: opacity.value,
    };
  });

  return (
    <GestureDetector gesture={panGestureHandler}>
      <Animated.View style={[styles.item, animatedStyle, customAnimatedStyle]}>
        <Text style={styles.itemTitle}>{item.title}</Text>
        <Text style={styles.itemDescription}>{item.description}</Text>
      </Animated.View>
    </GestureDetector>
  );
}
```

### Performance Optimized Sortable Item

```tsx
const MemoizedSortableItem = React.memo(
  ({ item, positions, ...sortableProps }) => {
    const { animatedStyle, panGestureHandler, isMoving } = useSortable({
      id: item.id,
      positions,
      ...sortableProps,
      onMove: useCallback((id, from, to) => {
        reorderItems(id, from, to);
      }, []),
      onDragStart: useCallback((id, position) => {
        hapticFeedback();
      }, []),
    });

    return (
      <GestureDetector gesture={panGestureHandler}>
        <Animated.View style={[styles.item, animatedStyle]}>
          <ItemContent item={item} isMoving={isMoving} />
        </Animated.View>
      </GestureDetector>
    );
  }
);

// Separate memoized content component
const ItemContent = React.memo(({ item, isMoving }) => (
  <View style={[styles.content, isMoving && styles.movingContent]}>
    <Text style={styles.title}>{item.title}</Text>
    <Text style={styles.subtitle}>{item.subtitle}</Text>
  </View>
));
```

### Conditional Sortable Item

```tsx
function ConditionalSortableItem({
  item,
  positions,
  canReorder,
  ...sortableProps
}) {
  const { animatedStyle, panGestureHandler, isMoving } = useSortable({
    id: item.id,
    positions,
    ...sortableProps,
    onDragStart: (id, position) => {
      if (!canReorder) {
        showError("Reordering is disabled");
        return;
      }
      hapticFeedback();
    },
    onMove: canReorder
      ? (id, from, to) => {
          reorderItems(id, from, to);
        }
      : undefined,
  });

  return (
    <GestureDetector gesture={panGestureHandler}>
      <Animated.View
        style={[styles.item, animatedStyle, !canReorder && styles.disabled]}
      >
        <Text style={styles.itemTitle}>{item.title}</Text>
        {!canReorder && (
          <Text style={styles.disabledText}>Reordering disabled</Text>
        )}
        {item.locked && <Icon name="lock" size={16} />}
      </Animated.View>
    </GestureDetector>
  );
}
```

### Real-time Position Tracking

```tsx
function PositionTrackingSortableItem({ item, positions, ...sortableProps }) {
  const [currentPosition, setCurrentPosition] = useState(0);
  const [dragDistance, setDragDistance] = useState(0);
  const startPosition = useRef(0);

  const { animatedStyle, panGestureHandler, isMoving } = useSortable({
    id: item.id,
    positions,
    ...sortableProps,
    onDragStart: (id, position) => {
      startPosition.current = position;
      setCurrentPosition(position);
    },
    onDragging: (id, overItemId, yPosition) => {
      const distance = Math.abs(
        yPosition - startPosition.current * sortableProps.itemHeight
      );
      setDragDistance(distance);
    },
    onMove: (id, from, to) => {
      setCurrentPosition(to);
      reorderItems(id, from, to);
    },
    onDrop: () => {
      setDragDistance(0);
    },
  });

  return (
    <GestureDetector gesture={panGestureHandler}>
      <Animated.View style={[styles.item, animatedStyle]}>
        <View style={styles.itemContent}>
          <Text style={styles.itemTitle}>{item.title}</Text>
          <Text style={styles.positionInfo}>
            Position: {currentPosition + 1}
          </Text>
          {isMoving && (
            <Text style={styles.dragInfo}>
              Drag distance: {Math.round(dragDistance)}px
            </Text>
          )}
        </View>
      </Animated.View>
    </GestureDetector>
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
  completed: boolean;
}

function TypedSortableItem({ task, positions, ...props }) {
  const { animatedStyle, panGestureHandler, isMoving } = useSortable<TaskData>({
    id: task.id,
    positions,
    ...props,
    onMove: (id: string, from: number, to: number) => {
      // All parameters are properly typed
      console.log(`Task ${id} moved from ${from} to ${to}`);
    },
    onDragStart: (id: string, position: number) => {
      // Parameters are typed
      console.log(`Started dragging task ${id} at position ${position}`);
    },
  });

  return (
    <GestureDetector gesture={panGestureHandler}>
      <Animated.View style={[styles.item, animatedStyle]}>
        <Text>{task.title}</Text>
      </Animated.View>
    </GestureDetector>
  );
}
```

## Performance Tips

1. **Use `React.memo`** for item components to prevent unnecessary re-renders
2. **Memoize callback functions** with `useCallback`
3. **Avoid complex calculations** in render functions
4. **Use stable keys** for consistent performance
5. **Throttle position updates** for large lists

```tsx
// Good: Memoized component and callbacks
const MemoizedSortableItem = React.memo(({ item, ...props }) => {
  const handleMove = useCallback((id, from, to) => {
    reorderItems(id, from, to);
  }, []);

  const { animatedStyle, panGestureHandler } = useSortable({
    id: item.id,
    ...props,
    onMove: handleMove,
  });

  return (
    <GestureDetector gesture={panGestureHandler}>
      <Animated.View style={[styles.item, animatedStyle]}>
        <ItemContent item={item} />
      </Animated.View>
    </GestureDetector>
  );
});
```

## Common Patterns

### Handle Detection Pattern

Handle detection uses a registration pattern. When a `SortableItem.Handle` component mounts, it registers itself via `registerHandle(true)`.

```tsx
function SortableWithHandle({ item, positions, ...props }) {
  const { animatedStyle, panGestureHandler, hasHandle } = useSortable({
    id: item.id,
    positions,
    ...props,
  });

  return (
    <GestureDetector gesture={panGestureHandler}>
      <Animated.View style={[styles.item, animatedStyle]}>
        {hasHandle ? (
          // Handle controls dragging
          <View>
            <Text>{item.title}</Text>
            <SortableHandle>
              <Icon name="drag-handle" />
            </SortableHandle>
          </View>
        ) : (
          // Entire item is draggable
          <Text>{item.title}</Text>
        )}
      </Animated.View>
    </GestureDetector>
  );
}
```

## See Also

- [SortableItem Component](../../components/sortable-item) - High-level component using this hook
- [useSortableList Hook](./useSortableList) - List management hook
- [Sortable Component](../../components/sortable) - Complete sortable list solution
- [ScrollDirection Enum](../types/enums#scrolldirection) - Auto-scroll direction values
- [UseSortableOptions Type](../types/sortable-types#usesortableoptionst) - Complete type definitions
