---
title: "useSortableList Hook"
---

A hook for managing sortable lists with drag-and-drop reordering capabilities, position tracking, and auto-scrolling support.

## Overview

The `useSortableList` hook provides the foundational state management and utilities needed to create sortable lists. It handles position tracking, scroll synchronization, auto-scrolling, and provides helper functions for individual sortable items.

## Import

```tsx
import { useSortableList } from "react-native-reanimated-dnd";
```

## Parameters

### UseSortableListOptions\<TData\>

#### data

- **Type**: `TData[]` (where `TData extends { id: string }`)
- **Required**: Yes
- **Description**: Array of data items to manage in the sortable list. Each item must have an `id` property.

#### itemHeight

- **Type**: `number`
- **Required**: Yes
- **Description**: Height of each item in pixels. Used for position calculations and auto-scrolling.

#### itemKeyExtractor

- **Type**: `(item: TData, index: number) => string`
- **Default**: `(item) => item.id`
- **Description**: Function to extract unique keys from items. Useful when your data doesn't use `id` as the key field.

```tsx
const sortableProps = useSortableList({
  data: tasks,
  itemHeight: 60,
  itemKeyExtractor: (item) => item.uuid, // Use uuid instead of id
});
```

## Return Value

### UseSortableListReturn\<TData\>

#### positions

- **Type**: `SharedValue<{ [id: string]: number }>`
- **Description**: Shared value containing the position mapping for all items in the list.

#### scrollY

- **Type**: `SharedValue<number>`
- **Description**: Shared value tracking the current scroll position.

#### autoScroll

- **Type**: `SharedValue<ScrollDirection>`
- **Description**: Shared value controlling auto-scroll direction during dragging.

#### scrollViewRef

- **Type**: `ReturnType<typeof useAnimatedRef<Animated.ScrollView>>`
- **Description**: Animated ref for the scroll view container.

#### dropProviderRef

- **Type**: `React.RefObject<DropProviderRef>`
- **Description**: Ref for the DropProvider context.

#### handleScroll

- **Type**: `any`
- **Description**: Scroll handler to attach to the ScrollView's `onScroll` prop.

#### handleScrollEnd

- **Type**: `() => void`
- **Description**: Handler for scroll end events. Attach to `onScrollEndDrag` and `onMomentumScrollEnd`.

#### contentHeight

- **Type**: `number`
- **Description**: Calculated height of the scroll view content based on item count and height.

#### getItemProps

- **Type**: `(item: TData, index: number) => { id: string; positions: SharedValue<{[id: string]: number}>; lowerBound: SharedValue<number>; autoScrollDirection: SharedValue<ScrollDirection>; itemsCount: number; itemHeight: number; }`
- **Description**: Function that returns core props needed for each sortable item. These props should be spread onto SortableItem components along with additional props like data, children, and callbacks.

```tsx
const { getItemProps } = useSortableList({ data: tasks, itemHeight: 60 });

// For each item in your render
const itemProps = getItemProps(task, index);
// Returns: { id, positions, lowerBound, autoScrollDirection, itemsCount, itemHeight }

// Use with SortableItem
<SortableItem {...itemProps} data={task} onMove={handleMove}>
  <TaskContent task={task} />
</SortableItem>;
```

## Usage Examples

### Basic Sortable List

```tsx
import { useSortableList } from "react-native-reanimated-dnd";
import { SortableItem } from "react-native-reanimated-dnd";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";

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

  const {
    scrollViewRef,
    dropProviderRef,
    handleScroll,
    handleScrollEnd,
    contentHeight,
    getItemProps,
  } = useSortableList({
    data: tasks,
    itemHeight: 60,
  });

  return (
    <GestureHandlerRootView style={styles.container}>
      <DropProvider ref={dropProviderRef}>
        <Animated.ScrollView
          ref={scrollViewRef}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          style={styles.scrollView}
          contentContainerStyle={{ height: contentHeight }}
          onScrollEndDrag={handleScrollEnd}
          onMomentumScrollEnd={handleScrollEnd}
        >
          {tasks.map((task, index) => {
            const itemProps = getItemProps(task, index);
            return (
              <SortableItem key={task.id} {...itemProps}>
                <View style={styles.taskItem}>
                  <Text style={styles.taskTitle}>{task.title}</Text>
                  <Text style={styles.taskStatus}>
                    {task.completed ? "Done" : "Pending"}
                  </Text>
                </View>
              </SortableItem>
            );
          })}
        </Animated.ScrollView>
      </DropProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollView: {
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

### Sortable List with Reordering Logic

```tsx
function ReorderableTaskList() {
  const [tasks, setTasks] = useState(initialTasks);

  const handleReorder = useCallback(
    (id: string, from: number, to: number) => {
      setTasks((prevTasks) => {
        const newTasks = [...prevTasks];
        const [movedTask] = newTasks.splice(from, 1);
        newTasks.splice(to, 0, movedTask);
        return newTasks;
      });

      // Optional: Save to backend
      saveTasks(newTasks);

      // Optional: Analytics
      analytics.track("task_reordered", {
        taskId: id,
        from,
        to,
        totalTasks: tasks.length,
      });
    },
    [tasks.length]
  );

  const sortableProps = useSortableList({
    data: tasks,
    itemHeight: 80,
  });

  const {
    scrollViewRef,
    dropProviderRef,
    handleScroll,
    handleScrollEnd,
    contentHeight,
    getItemProps,
  } = sortableProps;

  return (
    <GestureHandlerRootView style={styles.container}>
      <DropProvider ref={dropProviderRef}>
        <Animated.ScrollView
          ref={scrollViewRef}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          style={styles.scrollView}
          contentContainerStyle={{ height: contentHeight }}
          onScrollEndDrag={handleScrollEnd}
          onMomentumScrollEnd={handleScrollEnd}
        >
          {tasks.map((task, index) => {
            const itemProps = getItemProps(task, index);
            return (
              <SortableItem
                key={task.id}
                {...itemProps}
                onMove={handleReorder}
                onDragStart={(id, position) => {
                  hapticFeedback();
                  console.log(
                    `Started dragging task ${id} at position ${position}`
                  );
                }}
                onDrop={(id, position) => {
                  console.log(`Dropped task ${id} at position ${position}`);
                }}
              >
                <TaskCard task={task} />
              </SortableItem>
            );
          })}
        </Animated.ScrollView>
      </DropProvider>
    </GestureHandlerRootView>
  );
}
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

  const sortableProps = useSortableList({
    data: items,
    itemHeight: 50,
    itemKeyExtractor: (item) => item.uuid, // Use uuid instead of id
  });

  const {
    scrollViewRef,
    dropProviderRef,
    handleScroll,
    handleScrollEnd,
    contentHeight,
    getItemProps,
  } = sortableProps;

  return (
    <GestureHandlerRootView style={styles.container}>
      <DropProvider ref={dropProviderRef}>
        <Animated.ScrollView
          ref={scrollViewRef}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          style={styles.scrollView}
          contentContainerStyle={{ height: contentHeight }}
          onScrollEndDrag={handleScrollEnd}
          onMomentumScrollEnd={handleScrollEnd}
        >
          {items.map((item, index) => {
            const itemProps = getItemProps(item, index);
            return (
              <SortableItem key={item.uuid} {...itemProps}>
                <View style={styles.customItem}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemCategory}>{item.category}</Text>
                  <Text style={styles.itemOrder}>Order: {item.order}</Text>
                </View>
              </SortableItem>
            );
          })}
        </Animated.ScrollView>
      </DropProvider>
    </GestureHandlerRootView>
  );
}
```

### File Manager Sortable List

```tsx
interface FileItem {
  id: string;
  name: string;
  size: number;
  type: "file" | "folder";
  lastModified: Date;
}

function FileManagerList() {
  const [files, setFiles] = useState<FileItem[]>(fileData);
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());

  const handleFileReorder = useCallback(
    (id: string, from: number, to: number) => {
      setFiles((prevFiles) => {
        const newFiles = [...prevFiles];
        const [movedFile] = newFiles.splice(from, 1);
        newFiles.splice(to, 0, movedFile);
        return newFiles;
      });

      showToast(`${files.find((f) => f.id === id)?.name} moved`);
    },
    [files]
  );

  const sortableProps = useSortableList({
    data: files,
    itemHeight: 60,
  });

  const {
    scrollViewRef,
    dropProviderRef,
    handleScroll,
    handleScrollEnd,
    contentHeight,
    getItemProps,
  } = sortableProps;

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Files ({files.length})</Text>
        <Text style={styles.selectedCount}>{selectedFiles.size} selected</Text>
      </View>

      <DropProvider ref={dropProviderRef}>
        <Animated.ScrollView
          ref={scrollViewRef}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          style={styles.scrollView}
          contentContainerStyle={{ height: contentHeight }}
          onScrollEndDrag={handleScrollEnd}
          onMomentumScrollEnd={handleScrollEnd}
        >
          {files.map((file, index) => {
            const itemProps = getItemProps(file, index);
            const isSelected = selectedFiles.has(file.id);

            return (
              <SortableItem
                key={file.id}
                {...itemProps}
                onMove={handleFileReorder}
              >
                <TouchableOpacity
                  onPress={() => {
                    const newSelected = new Set(selectedFiles);
                    if (isSelected) {
                      newSelected.delete(file.id);
                    } else {
                      newSelected.add(file.id);
                    }
                    setSelectedFiles(newSelected);
                  }}
                  style={[styles.fileItem, isSelected && styles.selectedFile]}
                >
                  <View style={styles.fileIcon}>
                    <Text style={styles.iconText}>
                      {file.type === "folder" ? "📁" : "📄"}
                    </Text>
                  </View>

                  <View style={styles.fileInfo}>
                    <Text style={styles.fileName}>{file.name}</Text>
                    <Text style={styles.fileDetails}>
                      {file.type === "file" &&
                        `${formatFileSize(file.size)} • `}
                      {file.lastModified.toLocaleDateString()}
                    </Text>
                  </View>

                  <View style={styles.dragHandle}>
                    <View style={styles.handleDots}>
                      <View style={styles.dot} />
                      <View style={styles.dot} />
                      <View style={styles.dot} />
                      <View style={styles.dot} />
                      <View style={styles.dot} />
                      <View style={styles.dot} />
                    </View>
                  </View>
                </TouchableOpacity>
              </SortableItem>
            );
          })}
        </Animated.ScrollView>
      </DropProvider>
    </GestureHandlerRootView>
  );
}
```

### Photo Gallery Sortable List

```tsx
interface Photo {
  id: string;
  uri: string;
  title: string;
  width: number;
  height: number;
}

function PhotoGalleryList() {
  const [photos, setPhotos] = useState<Photo[]>(photoData);

  const handlePhotoReorder = useCallback(
    (id: string, from: number, to: number) => {
      setPhotos((prevPhotos) => {
        const newPhotos = [...prevPhotos];
        const [movedPhoto] = newPhotos.splice(from, 1);
        newPhotos.splice(to, 0, movedPhoto);
        return newPhotos;
      });
    },
    []
  );

  const sortableProps = useSortableList({
    data: photos,
    itemHeight: 120, // Taller items for photos
  });

  const {
    scrollViewRef,
    dropProviderRef,
    handleScroll,
    handleScrollEnd,
    contentHeight,
    getItemProps,
  } = sortableProps;

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.galleryHeader}>
        <Text style={styles.galleryTitle}>Photo Gallery</Text>
        <Text style={styles.photoCount}>{photos.length} photos</Text>
      </View>

      <DropProvider ref={dropProviderRef}>
        <Animated.ScrollView
          ref={scrollViewRef}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          style={styles.scrollView}
          contentContainerStyle={{ height: contentHeight }}
          onScrollEndDrag={handleScrollEnd}
          onMomentumScrollEnd={handleScrollEnd}
        >
          {photos.map((photo, index) => {
            const itemProps = getItemProps(photo, index);

            return (
              <SortableItem
                key={photo.id}
                {...itemProps}
                onMove={handlePhotoReorder}
                onDragStart={() => hapticFeedback()}
              >
                <View style={styles.photoItem}>
                  <Image
                    source={{ uri: photo.uri }}
                    style={styles.photoThumbnail}
                    resizeMode="cover"
                  />

                  <View style={styles.photoInfo}>
                    <Text style={styles.photoTitle}>{photo.title}</Text>
                    <Text style={styles.photoDimensions}>
                      {photo.width} × {photo.height}
                    </Text>
                  </View>

                  <View style={styles.photoActions}>
                    <TouchableOpacity onPress={() => editPhoto(photo.id)}>
                      <Icon name="edit" size={20} color="#007AFF" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => deletePhoto(photo.id)}>
                      <Icon name="trash" size={20} color="#FF3B30" />
                    </TouchableOpacity>
                  </View>
                </View>
              </SortableItem>
            );
          })}
        </Animated.ScrollView>
      </DropProvider>
    </GestureHandlerRootView>
  );
}
```

### Performance Optimized Large List

```tsx
function LargeSortableList() {
  const [items, setItems] = useState(generateLargeDataset(1000));

  // Memoize the reorder handler
  const handleReorder = useCallback((id: string, from: number, to: number) => {
    setItems((prevItems) => {
      const newItems = [...prevItems];
      const [movedItem] = newItems.splice(from, 1);
      newItems.splice(to, 0, movedItem);
      return newItems;
    });
  }, []);

  const sortableProps = useSortableList({
    data: items,
    itemHeight: 50, // Smaller items for performance
  });

  const {
    scrollViewRef,
    dropProviderRef,
    handleScroll,
    handleScrollEnd,
    contentHeight,
    getItemProps,
  } = sortableProps;

  // Memoize item rendering
  const renderItem = useCallback(
    (item: any, index: number) => {
      const itemProps = getItemProps(item, index);

      return (
        <SortableItem key={item.id} {...itemProps} onMove={handleReorder}>
          <MemoizedListItem item={item} />
        </SortableItem>
      );
    },
    [getItemProps, handleReorder]
  );

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Large List ({items.length} items)</Text>
      </View>

      <DropProvider ref={dropProviderRef}>
        <Animated.ScrollView
          ref={scrollViewRef}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          style={styles.scrollView}
          contentContainerStyle={{ height: contentHeight }}
          onScrollEndDrag={handleScrollEnd}
          onMomentumScrollEnd={handleScrollEnd}
          removeClippedSubviews={true} // Performance optimization
        >
          {items.map(renderItem)}
        </Animated.ScrollView>
      </DropProvider>
    </GestureHandlerRootView>
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

### Conditional Sortable List

```tsx
function ConditionalSortableList({ canReorder, userRole }) {
  const [tasks, setTasks] = useState(taskData);

  const handleReorder = useCallback(
    (id: string, from: number, to: number) => {
      if (!canReorder) {
        showError("Reordering is disabled");
        return;
      }

      setTasks((prevTasks) => {
        const newTasks = [...prevTasks];
        const [movedTask] = newTasks.splice(from, 1);
        newTasks.splice(to, 0, movedTask);
        return newTasks;
      });
    },
    [canReorder]
  );

  const sortableProps = useSortableList({
    data: tasks,
    itemHeight: 70,
  });

  const {
    scrollViewRef,
    dropProviderRef,
    handleScroll,
    handleScrollEnd,
    contentHeight,
    getItemProps,
  } = sortableProps;

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Tasks</Text>
        <Text style={styles.permission}>
          Role: {userRole} | Reorder: {canReorder ? "Enabled" : "Disabled"}
        </Text>
      </View>

      <DropProvider ref={dropProviderRef}>
        <Animated.ScrollView
          ref={scrollViewRef}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          style={styles.scrollView}
          contentContainerStyle={{ height: contentHeight }}
          onScrollEndDrag={handleScrollEnd}
          onMomentumScrollEnd={handleScrollEnd}
        >
          {tasks.map((task, index) => {
            const itemProps = getItemProps(task, index);

            return (
              <SortableItem
                key={task.id}
                {...itemProps}
                onMove={canReorder ? handleReorder : undefined}
                onDragStart={(id, position) => {
                  if (!canReorder) {
                    showError("Reordering is disabled");
                    return;
                  }
                  hapticFeedback();
                }}
              >
                <View
                  style={[styles.taskItem, !canReorder && styles.disabledItem]}
                >
                  <Text style={styles.taskTitle}>{task.title}</Text>
                  {task.locked && <Icon name="lock" size={16} />}
                  {!canReorder && (
                    <Text style={styles.disabledText}>Reorder disabled</Text>
                  )}
                </View>
              </SortableItem>
            );
          })}
        </Animated.ScrollView>
      </DropProvider>
    </GestureHandlerRootView>
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

function TypedSortableList() {
  const [tasks, setTasks] = useState<TaskData[]>(taskData);

  const {
    scrollViewRef,
    dropProviderRef,
    handleScroll,
    handleScrollEnd,
    contentHeight,
    getItemProps,
  } = useSortableList<TaskData>({
    data: tasks,
    itemHeight: 60,
    itemKeyExtractor: (item: TaskData) => item.id, // Properly typed
  });

  return (
    <GestureHandlerRootView style={styles.container}>
      <DropProvider ref={dropProviderRef}>
        <Animated.ScrollView
          ref={scrollViewRef}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          contentContainerStyle={{ height: contentHeight }}
          onScrollEndDrag={handleScrollEnd}
          onMomentumScrollEnd={handleScrollEnd}
        >
          {tasks.map((task: TaskData, index: number) => {
            const itemProps = getItemProps(task, index);
            return (
              <SortableItem key={task.id} {...itemProps}>
                <Text>{task.title}</Text>
              </SortableItem>
            );
          })}
        </Animated.ScrollView>
      </DropProvider>
    </GestureHandlerRootView>
  );
}
```

## Performance Tips

1. **Use `React.memo`** for item components to prevent unnecessary re-renders
2. **Memoize callback functions** with `useCallback`
3. **Use stable key extractors** for consistent performance
4. **Enable `removeClippedSubviews`** for large lists
5. **Throttle scroll events** appropriately

```tsx
// Good: Memoized components and callbacks
const MemoizedSortableItem = React.memo(({ item, ...props }) => (
  <SortableItem {...props}>
    <ItemContent item={item} />
  </SortableItem>
));

const handleReorder = useCallback((id, from, to) => {
  reorderItems(id, from, to);
}, []);
```

## Common Patterns

### Container Component Pattern

```tsx
function SortableListContainer({ children, ...sortableProps }) {
  const {
    scrollViewRef,
    dropProviderRef,
    handleScroll,
    handleScrollEnd,
    contentHeight,
  } = sortableProps;

  return (
    <GestureHandlerRootView style={styles.container}>
      <DropProvider ref={dropProviderRef}>
        <Animated.ScrollView
          ref={scrollViewRef}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          style={styles.scrollView}
          contentContainerStyle={{ height: contentHeight }}
          onScrollEndDrag={handleScrollEnd}
          onMomentumScrollEnd={handleScrollEnd}
        >
          {children}
        </Animated.ScrollView>
      </DropProvider>
    </GestureHandlerRootView>
  );
}

// Usage
function MyList() {
  const sortableProps = useSortableList({ data, itemHeight: 60 });

  return (
    <SortableListContainer {...sortableProps}>
      {data.map((item, index) => (
        <SortableItem
          key={item.id}
          {...sortableProps.getItemProps(item, index)}
        >
          <ItemContent item={item} />
        </SortableItem>
      ))}
    </SortableListContainer>
  );
}
```

## See Also

- [Sortable Component](../../components/sortable) - High-level component using this hook
- [SortableItem Component](../../components/sortable-item) - Individual item component
- [useSortable Hook](./useSortable) - Individual item hook
- [DropProvider](../../context/DropProvider) - Drag-and-drop context
- [ScrollDirection Enum](../types/enums#scrolldirection) - Auto-scroll direction values
- [UseSortableListOptions Type](../types/sortable-types#usesortablelistoptionstdata) - Complete type definitions
