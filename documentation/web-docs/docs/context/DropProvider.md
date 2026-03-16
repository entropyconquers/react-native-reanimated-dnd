---
title: "DropProvider"
---

The `DropProvider` component is the foundational context provider that enables drag-and-drop functionality throughout your application. It manages drop zone registration, collision detection, state tracking, and provides the necessary context for all draggable and droppable components.

## Overview

The DropProvider creates a context that allows draggable and droppable components to communicate with each other. It handles:

- **Drop Zone Registration**: Manages all registered droppable areas
- **Collision Detection**: Determines when draggables intersect with droppables
- **State Management**: Tracks which items are dropped where
- **Position Updates**: Handles layout changes and position recalculations
- **Capacity Management**: Enforces drop zone capacity limits
- **Global Callbacks**: Provides application-wide drag event handling

## Basic Usage

```tsx
import { DropProvider } from "react-native-reanimated-dnd";
import { Draggable, Droppable } from "react-native-reanimated-dnd";

function App() {
  return (
    <DropProvider>
      <View style={styles.container}>
        <Draggable data={{ id: "1", name: "Task 1" }}>
          <View style={styles.draggableItem}>
            <Text>Drag me!</Text>
          </View>
        </Draggable>

        <Droppable onDrop={(data) => console.log("Dropped:", data)}>
          <View style={styles.dropZone}>
            <Text>Drop zone</Text>
          </View>
        </Droppable>
      </View>
    </DropProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  draggableItem: {
    width: 100,
    height: 50,
    backgroundColor: "#3b82f6",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  dropZone: {
    width: 200,
    height: 100,
    backgroundColor: "#f3f4f6",
    borderRadius: 8,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#d1d5db",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
});
```

## Props

### DropProviderProps

| Prop                     | Type                                      | Default      | Description                                                     |
| ------------------------ | ----------------------------------------- | ------------ | --------------------------------------------------------------- |
| `children`               | `ReactNode`                               | **Required** | Child components that will have access to drag-and-drop context |
| `onLayoutUpdateComplete` | `() => void`                              | -            | Callback fired when layout updates are complete                 |
| `onDroppedItemsUpdate`   | `(droppedItems: DroppedItemsMap) => void` | -            | Callback fired when dropped items mapping changes               |
| `onDragging`             | `(payload: DraggingPayload) => void`      | -            | Global callback fired during drag operations                    |
| `onDragStart`            | `(data: any) => void`                     | -            | Global callback fired when any drag operation starts            |
| `onDragEnd`              | `(data: any) => void`                     | -            | Global callback fired when any drag operation ends              |

### DraggingPayload

```tsx
interface DraggingPayload {
  x: number; // Original X position
  y: number; // Original Y position
  tx: number; // Current X translation
  ty: number; // Current Y translation
  itemData: any; // Data associated with the draggable item
}
```

### DroppedItemsMap

```tsx
interface DroppedItemsMap<TData = unknown> {
  [draggableId: string]: {
    droppableId: string;
    data: TData;
  };
}
```

## Imperative Handle

The DropProvider exposes an imperative handle that provides methods for programmatic control:

### DropProviderRef

```tsx
interface DropProviderRef {
  requestPositionUpdate: () => void;
  getDroppedItems: () => DroppedItemsMap;
}
```

| Method                    | Description                                                     |
| ------------------------- | --------------------------------------------------------------- |
| `requestPositionUpdate()` | Manually trigger position updates for all registered components |
| `getDroppedItems()`       | Get current mapping of dropped items                            |

## Examples

### Basic Setup with State Management

```tsx
function TaskManager() {
  const [tasks, setTasks] = useState([
    { id: "1", title: "Design UI", status: "todo" },
    { id: "2", title: "Implement API", status: "todo" },
    { id: "3", title: "Write Tests", status: "todo" },
  ]);

  const [droppedItems, setDroppedItems] = useState({});

  const handleDrop = (task, newStatus) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === task.id ? { ...t, status: newStatus } : t))
    );
  };

  return (
    <DropProvider
      onDroppedItemsUpdate={setDroppedItems}
      onDragStart={(data) => {
        console.log("Started dragging:", data.title);
        hapticFeedback();
      }}
      onDragEnd={(data) => {
        console.log("Finished dragging:", data.title);
      }}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Task Manager</Text>

        {/* Draggable Tasks */}
        <View style={styles.tasksContainer}>
          {tasks
            .filter((task) => task.status === "todo")
            .map((task) => (
              <Draggable key={task.id} data={task}>
                <TaskCard task={task} />
              </Draggable>
            ))}
        </View>

        {/* Drop Zones */}
        <View style={styles.columnsContainer}>
          <Droppable
            droppableId="in-progress"
            onDrop={(task) => handleDrop(task, "in-progress")}
          >
            <Column
              title="In Progress"
              tasks={tasks.filter((t) => t.status === "in-progress")}
            />
          </Droppable>

          <Droppable
            droppableId="done"
            onDrop={(task) => handleDrop(task, "done")}
          >
            <Column
              title="Done"
              tasks={tasks.filter((t) => t.status === "done")}
            />
          </Droppable>
        </View>
      </View>
    </DropProvider>
  );
}
```

### Advanced Setup with Ref and Analytics

```tsx
function AdvancedTaskBoard() {
  const dropProviderRef = useRef<DropProviderRef>(null);
  const [analytics, setAnalytics] = useState({
    totalDrags: 0,
    totalDrops: 0,
    averageDragDuration: 0,
  });
  const dragStartTime = useRef<number>(0);

  const handleLayoutChange = useCallback(() => {
    // Trigger position update after layout changes
    dropProviderRef.current?.requestPositionUpdate();
  }, []);

  const handleDragStart = useCallback((data) => {
    dragStartTime.current = Date.now();
    setAnalytics((prev) => ({ ...prev, totalDrags: prev.totalDrags + 1 }));

    // Global drag start logic
    showDragOverlay(data);
    updateGlobalDragState(true);
  }, []);

  const handleDragEnd = useCallback((data) => {
    const duration = Date.now() - dragStartTime.current;
    setAnalytics((prev) => ({
      ...prev,
      averageDragDuration: (prev.averageDragDuration + duration) / 2,
    }));

    // Global drag end logic
    hideDragOverlay();
    updateGlobalDragState(false);
  }, []);

  const handleDragging = useCallback(({ x, y, tx, ty, itemData }) => {
    // Real-time position tracking
    updateDragPosition(x + tx, y + ty);

    // Update global drag indicator
    updateGlobalDragIndicator({
      position: { x: x + tx, y: y + ty },
      item: itemData,
    });
  }, []);

  const handleDroppedItemsUpdate = useCallback((droppedItems) => {
    const dropCount = Object.keys(droppedItems).length;
    setAnalytics((prev) => ({ ...prev, totalDrops: dropCount }));

    // Persist state
    saveDroppedItemsToStorage(droppedItems);

    // Update global state
    updateGlobalDroppedItems(droppedItems);
  }, []);

  return (
    <GestureHandlerRootView style={styles.container}>
      <DropProvider
        ref={dropProviderRef}
        onLayoutUpdateComplete={() => {
          console.log("Layout update complete");
          // Trigger any additional UI updates
        }}
        onDroppedItemsUpdate={handleDroppedItemsUpdate}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragging={handleDragging}
      >
        <ScrollView
          style={styles.scrollView}
          onLayout={handleLayoutChange}
          onContentSizeChange={handleLayoutChange}
        >
          <View style={styles.analyticsPanel}>
            <Text>Total Drags: {analytics.totalDrags}</Text>
            <Text>Total Drops: {analytics.totalDrops}</Text>
            <Text>
              Avg Duration: {Math.round(analytics.averageDragDuration)}ms
            </Text>
          </View>

          <TaskBoard />
        </ScrollView>
      </DropProvider>
    </GestureHandlerRootView>
  );
}
```

### Multi-Zone Setup with Capacity Limits

```tsx
function FileOrganizer() {
  const [files, setFiles] = useState(initialFiles);
  const [folders, setFolders] = useState([
    { id: "documents", name: "Documents", maxFiles: 10 },
    { id: "images", name: "Images", maxFiles: 20 },
    { id: "videos", name: "Videos", maxFiles: 5 },
  ]);

  const moveFileToFolder = useCallback((file, folderId) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === file.id ? { ...f, folderId } : f))
    );
  }, []);

  return (
    <DropProvider
      onDroppedItemsUpdate={(droppedItems) => {
        // Update file locations based on drops
        Object.entries(droppedItems).forEach(([fileId, { droppableId }]) => {
          const file = files.find((f) => f.id === fileId);
          if (file && file.folderId !== droppableId) {
            moveFileToFolder(file, droppableId);
          }
        });
      }}
    >
      <View style={styles.organizer}>
        {/* File List */}
        <View style={styles.fileList}>
          <Text style={styles.sectionTitle}>Files</Text>
          {files
            .filter((file) => !file.folderId)
            .map((file) => (
              <Draggable key={file.id} data={file}>
                <FileItem file={file} />
              </Draggable>
            ))}
        </View>

        {/* Folder Drop Zones */}
        <View style={styles.foldersContainer}>
          {folders.map((folder) => {
            const folderFiles = files.filter((f) => f.folderId === folder.id);
            const isAtCapacity = folderFiles.length >= folder.maxFiles;

            return (
              <Droppable
                key={folder.id}
                droppableId={folder.id}
                capacity={folder.maxFiles}
                onDrop={(file) => {
                  if (!isAtCapacity) {
                    moveFileToFolder(file, folder.id);
                    showToast(`${file.name} moved to ${folder.name}`);
                  } else {
                    showError(`${folder.name} is full!`);
                  }
                }}
                activeStyle={{
                  backgroundColor: isAtCapacity ? "#fee2e2" : "#dcfce7",
                  borderColor: isAtCapacity ? "#ef4444" : "#22c55e",
                }}
              >
                <FolderDropZone
                  folder={folder}
                  files={folderFiles}
                  isAtCapacity={isAtCapacity}
                />
              </Droppable>
            );
          })}
        </View>
      </View>
    </DropProvider>
  );
}
```

### Real-time Collaboration Setup

```tsx
function CollaborativeBoard() {
  const dropProviderRef = useRef<DropProviderRef>(null);
  const [collaborators, setCollaborators] = useState([]);
  const [realTimeUpdates, setRealTimeUpdates] = useState([]);

  // WebSocket connection for real-time updates
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080/board");

    ws.onmessage = (event) => {
      const update = JSON.parse(event.data);
      if (update.type === "ITEM_MOVED") {
        // Update local state based on remote changes
        handleRemoteItemMove(update.payload);

        // Trigger position update to reflect changes
        dropProviderRef.current?.requestPositionUpdate();
      }
    };

    return () => ws.close();
  }, []);

  const handleDragStart = useCallback((data) => {
    // Broadcast drag start to other users
    broadcastToCollaborators({
      type: "DRAG_START",
      userId: currentUser.id,
      itemId: data.id,
      timestamp: Date.now(),
    });
  }, []);

  const handleDragging = useCallback(({ x, y, tx, ty, itemData }) => {
    // Broadcast real-time position updates
    throttledBroadcast({
      type: "DRAGGING",
      userId: currentUser.id,
      itemId: itemData.id,
      position: { x: x + tx, y: y + ty },
      timestamp: Date.now(),
    });
  }, []);

  const handleDroppedItemsUpdate = useCallback((droppedItems) => {
    // Broadcast final positions to other users
    broadcastToCollaborators({
      type: "ITEMS_UPDATED",
      userId: currentUser.id,
      droppedItems,
      timestamp: Date.now(),
    });

    // Save to backend
    saveToBackend(droppedItems);
  }, []);

  return (
    <DropProvider
      ref={dropProviderRef}
      onDragStart={handleDragStart}
      onDragging={handleDragging}
      onDragEnd={(data) => {
        broadcastToCollaborators({
          type: "DRAG_END",
          userId: currentUser.id,
          itemId: data.id,
          timestamp: Date.now(),
        });
      }}
      onDroppedItemsUpdate={handleDroppedItemsUpdate}
    >
      <View style={styles.collaborativeBoard}>
        {/* Show other users' cursors */}
        {collaborators.map((collaborator) => (
          <CollaboratorCursor
            key={collaborator.id}
            collaborator={collaborator}
          />
        ))}

        {/* Real-time update indicators */}
        {realTimeUpdates.map((update) => (
          <UpdateIndicator key={update.id} update={update} />
        ))}

        <BoardContent />
      </View>
    </DropProvider>
  );
}
```

## Context Integration

The DropProvider creates a context that can be accessed by child components:

```tsx
import { useContext } from "react";
import { SlotsContext } from "react-native-reanimated-dnd";

function CustomComponent() {
  const context = useContext(SlotsContext);

  // Access context methods
  const droppedItems = context.getDroppedItems();
  const hasCapacity = context.hasAvailableCapacity("my-droppable");

  return (
    <View>
      <Text>Dropped Items: {Object.keys(droppedItems).length}</Text>
      <Text>Has Capacity: {hasCapacity ? "Yes" : "No"}</Text>
    </View>
  );
}
```

## Performance Considerations

### Optimization Tips

1. **Minimize Re-renders**: Use `useCallback` for event handlers
2. **Throttle Updates**: Limit frequency of `onDragging` callbacks
3. **Lazy Loading**: Load drop zones only when needed
4. **Memory Management**: Clean up listeners and refs properly

```tsx
function OptimizedProvider({ children }) {
  // Memoize callbacks to prevent unnecessary re-renders
  const handleDragStart = useCallback((data) => {
    // Optimized drag start logic
  }, []);

  const handleDragging = useMemo(
    () =>
      throttle(({ x, y, tx, ty, itemData }) => {
        // Throttled dragging updates
      }, 16), // 60fps
    []
  );

  return (
    <DropProvider onDragStart={handleDragStart} onDragging={handleDragging}>
      {children}
    </DropProvider>
  );
}
```

## Error Handling

```tsx
function RobustProvider({ children }) {
  const [error, setError] = useState(null);

  const handleError = useCallback((error) => {
    console.error("Drag and drop error:", error);
    setError(error);

    // Report to error tracking service
    errorTracker.captureException(error);
  }, []);

  if (error) {
    return <ErrorFallback error={error} onRetry={() => setError(null)} />;
  }

  return (
    <ErrorBoundary onError={handleError}>
      <DropProvider>{children}</DropProvider>
    </ErrorBoundary>
  );
}
```

## TypeScript Support

The DropProvider is fully typed with generic support:

```tsx
interface TaskData {
  id: string;
  title: string;
  priority: "low" | "medium" | "high";
}

function TypedTaskBoard() {
  const handleDroppedItemsUpdate = useCallback(
    (droppedItems: DroppedItemsMap<TaskData>) => {
      // droppedItems is fully typed
      Object.entries(droppedItems).forEach(
        ([taskId, { data, droppableId }]) => {
          // data is typed as TaskData
          console.log(`Task ${data.title} dropped in ${droppableId}`);
        }
      );
    },
    []
  );

  return (
    <DropProvider onDroppedItemsUpdate={handleDroppedItemsUpdate}>
      {/* Your components */}
    </DropProvider>
  );
}
```

## Best Practices

1. **Single Provider**: Use one DropProvider at the root of your drag-and-drop area
2. **Ref Management**: Store the provider ref for programmatic control
3. **State Synchronization**: Keep dropped items in sync with your app state
4. **Error Boundaries**: Wrap the provider in error boundaries for robustness
5. **Performance Monitoring**: Track drag performance and optimize as needed

## See Also

- [Draggable Component](../components/draggable) - Creating draggable items
- [Droppable Component](../components/droppable) - Creating drop zones
- [useDraggable Hook](../hooks/useDraggable) - Draggable hook API
- [useDroppable Hook](../hooks/useDroppable) - Droppable hook API
- [Basic Concepts](../getting-started/basic-concepts) - Understanding the fundamentals
