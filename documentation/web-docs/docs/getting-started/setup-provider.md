---
title: "Setup Provider"
---

Learn how to configure the DropProvider for your application.

## Basic Setup

The `DropProvider` is the foundation of the drag-and-drop system. It must wrap all draggable and droppable components to enable communication between them.

```tsx
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { DropProvider } from "react-native-reanimated-dnd";

function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <DropProvider>
        {/* Your draggable and droppable components */}
      </DropProvider>
    </GestureHandlerRootView>
  );
}
```

## Provider Props

The `DropProvider` accepts several optional props for customizing behavior and receiving callbacks:

```tsx
interface DropProviderProps {
  children: ReactNode;
  onLayoutUpdateComplete?: () => void;
  onDroppedItemsUpdate?: (droppedItems: DroppedItemsMap) => void;
  onDragging?: (payload: DraggingPayload) => void;
  onDragStart?: (data: any) => void;
  onDragEnd?: (data: any) => void;
}
```

### Basic Provider with Callbacks

```tsx
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { DropProvider } from "react-native-reanimated-dnd";

function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <DropProvider
        onDragStart={(data) => console.log("Drag started:", data)}
        onDragEnd={(data) => console.log("Drag ended:", data)}
        onDroppedItemsUpdate={(items) => console.log("Items updated:", items)}
      >
        <YourComponents />
      </DropProvider>
    </GestureHandlerRootView>
  );
}
```

### Advanced Provider Configuration

```tsx
import React, { useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { DropProvider } from "react-native-reanimated-dnd";

function AdvancedApp() {
  const [droppedItems, setDroppedItems] = useState({});
  const [isDragging, setIsDragging] = useState(false);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <DropProvider
        onDragStart={(data) => {
          setIsDragging(true);
          console.log("Started dragging:", data);
        }}
        onDragEnd={(data) => {
          setIsDragging(false);
          console.log("Finished dragging:", data);
        }}
        onDragging={({ x, y, tx, ty, itemData }) => {
          console.log(`Dragging ${itemData.name} at (${x + tx}, ${y + ty})`);
        }}
        onDroppedItemsUpdate={(items) => {
          setDroppedItems(items);
          console.log("Dropped items updated:", items);
        }}
        onLayoutUpdateComplete={() => {
          console.log("Layout update complete");
        }}
      >
        <YourComponents isDragging={isDragging} droppedItems={droppedItems} />
      </DropProvider>
    </GestureHandlerRootView>
  );
}
```

## Provider with Ref

You can use a ref to access provider methods imperatively:

```tsx
import React, { useRef } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { DropProvider, DropProviderRef } from "react-native-reanimated-dnd";

function AppWithRef() {
  const dropProviderRef = useRef<DropProviderRef>(null);

  const handleLayoutChange = () => {
    // Manually trigger position updates after layout changes
    dropProviderRef.current?.requestPositionUpdate();
  };

  const getDroppedItems = () => {
    const items = dropProviderRef.current?.getDroppedItems();
    console.log("Current dropped items:", items);
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <DropProvider
        ref={dropProviderRef}
        onLayoutUpdateComplete={() => console.log("Layout updated")}
      >
        <ScrollView onLayout={handleLayoutChange}>
          <YourComponents />
        </ScrollView>
      </DropProvider>
    </GestureHandlerRootView>
  );
}
```

## Real-World Examples

### Task Management App

```tsx
import React, { useState, useCallback } from "react";
import { View, ScrollView } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { DropProvider } from "react-native-reanimated-dnd";

interface Task {
  id: string;
  title: string;
  status: "todo" | "in-progress" | "done";
  priority: "low" | "medium" | "high";
}

function TaskManagementApp() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);

  const handleDragStart = useCallback((data: Task) => {
    setDraggedTask(data);
    // Add visual feedback
    hapticFeedback();
  }, []);

  const handleDragEnd = useCallback((data: Task) => {
    setDraggedTask(null);
    // Clean up visual feedback
  }, []);

  const handleDroppedItemsUpdate = useCallback(
    (droppedItems) => {
      // Sync dropped items with your state management
      syncTasksWithDroppedItems(droppedItems);

      // Save to backend
      saveTasks(tasks);

      // Analytics
      analytics.track("tasks_reordered", {
        totalTasks: tasks.length,
        droppedCount: Object.keys(droppedItems).length,
      });
    },
    [tasks]
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <DropProvider
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDroppedItemsUpdate={handleDroppedItemsUpdate}
        onDragging={({ itemData, tx, ty }) => {
          // Real-time position tracking
          updateDragPreview(itemData, tx, ty);
        }}
      >
        <View style={{ flex: 1 }}>
          <TaskBoard tasks={tasks} draggedTask={draggedTask} />
        </View>
      </DropProvider>
    </GestureHandlerRootView>
  );
}
```

### File Manager with Drag & Drop

```tsx
import React, { useState, useRef } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { DropProvider, DropProviderRef } from "react-native-reanimated-dnd";

interface FileItem {
  id: string;
  name: string;
  type: "file" | "folder";
  size: number;
}

function FileManager() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const dropProviderRef = useRef<DropProviderRef>(null);

  const handleFileOperation = useCallback(
    (operation: string, fileId: string) => {
      // Trigger position update after file operations
      setTimeout(() => {
        dropProviderRef.current?.requestPositionUpdate();
      }, 100);
    },
    []
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <DropProvider
        ref={dropProviderRef}
        onDragStart={(file: FileItem) => {
          console.log(`Started dragging: ${file.name}`);
          setSelectedFiles(new Set([file.id]));
        }}
        onDragEnd={(file: FileItem) => {
          console.log(`Finished dragging: ${file.name}`);
        }}
        onDroppedItemsUpdate={(droppedItems) => {
          // Update file organization
          updateFileStructure(droppedItems);
        }}
      >
        <FileExplorer
          files={files}
          selectedFiles={selectedFiles}
          onFileOperation={handleFileOperation}
        />
      </DropProvider>
    </GestureHandlerRootView>
  );
}
```

### E-commerce Product Catalog

```tsx
import React, { useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { DropProvider } from "react-native-reanimated-dnd";

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
}

function ProductCatalog() {
  const [cart, setCart] = useState<Product[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <DropProvider
        onDragStart={(product: Product) => {
          analytics.track("product_drag_start", {
            productId: product.id,
            category: product.category,
          });
        }}
        onDroppedItemsUpdate={(droppedItems) => {
          // Update cart and wishlist based on drops
          updateProductLists(droppedItems);
        }}
        onDragging={({ itemData, tx, ty }) => {
          // Show drag preview
          showProductPreview(itemData, tx, ty);
        }}
      >
        <ProductGrid />
        <ShoppingCart items={cart} />
        <Wishlist items={wishlist} />
      </DropProvider>
    </GestureHandlerRootView>
  );
}
```

## Provider Ref Methods

The `DropProviderRef` interface provides imperative methods:

```tsx
interface DropProviderRef {
  requestPositionUpdate: () => void;
  getDroppedItems: () => DroppedItemsMap;
}
```

### Using Provider Methods

```tsx
function ComponentWithProviderAccess() {
  const providerRef = useRef<DropProviderRef>(null);

  const refreshPositions = () => {
    // Call this after layout changes, orientation changes, etc.
    providerRef.current?.requestPositionUpdate();
  };

  const logDroppedItems = () => {
    const items = providerRef.current?.getDroppedItems();
    console.log("Currently dropped items:", items);
  };

  const handleOrientationChange = () => {
    // Refresh positions after orientation change
    setTimeout(refreshPositions, 100);
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <DropProvider ref={providerRef}>
        <OrientationListener onOrientationChange={handleOrientationChange} />
        <YourComponents />
      </DropProvider>
    </GestureHandlerRootView>
  );
}
```

## Best Practices

### 1. Single Provider per App

Use one `DropProvider` at the root of your drag-and-drop area:

```tsx
// Good: Single provider at the root
<GestureHandlerRootView style={{ flex: 1 }}>
  <DropProvider>
    <App />
  </DropProvider>
</GestureHandlerRootView>

// Bad: Multiple nested providers
<GestureHandlerRootView style={{ flex: 1 }}>
  <DropProvider>
    <Screen1 />
    <DropProvider> {/* Unnecessary nesting */}
      <Screen2 />
    </DropProvider>
  </DropProvider>
</GestureHandlerRootView>
```

### 2. Handle Layout Changes

Always trigger position updates after layout changes:

```tsx
<GestureHandlerRootView style={{ flex: 1 }}>
  <DropProvider
    ref={providerRef}
    onLayoutUpdateComplete={() => {
      // Layout update completed
      console.log("Positions updated");
    }}
  >
    <ScrollView
      onLayout={() => {
        // Trigger update after scroll view layout
        providerRef.current?.requestPositionUpdate();
      }}
    >
      <YourComponents />
    </ScrollView>
  </DropProvider>
</GestureHandlerRootView>
```

### 3. Optimize Callbacks

Use `useCallback` to prevent unnecessary re-renders:

```tsx
const handleDragStart = useCallback((data) => {
  console.log("Drag started:", data);
}, []);

const handleDroppedItemsUpdate = useCallback((items) => {
  updateState(items);
}, []);

<GestureHandlerRootView style={{ flex: 1 }}>
  <DropProvider
    onDragStart={handleDragStart}
    onDroppedItemsUpdate={handleDroppedItemsUpdate}
  >
    <YourComponents />
  </DropProvider>
</GestureHandlerRootView>;
```

## Common Patterns

### State Synchronization

```tsx
function StateSyncExample() {
  const [appState, setAppState] = useState(initialState);

  const syncWithDroppedItems = useCallback((droppedItems) => {
    // Convert dropped items to your app state format
    const newState = convertDroppedItemsToState(droppedItems);
    setAppState(newState);

    // Persist to storage
    AsyncStorage.setItem("appState", JSON.stringify(newState));
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <DropProvider onDroppedItemsUpdate={syncWithDroppedItems}>
        <YourApp state={appState} />
      </DropProvider>
    </GestureHandlerRootView>
  );
}
```

## See Also

- [Basic Concepts](./basic-concepts) - Understanding the core concepts
- [DropProvider API](../api/context/DropProvider) - Complete API reference
- [Performance Guide](../guides/performance) - Optimization tips
