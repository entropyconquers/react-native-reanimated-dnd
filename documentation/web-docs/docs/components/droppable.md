---
title: "Droppable"
---

The `Droppable` component creates drop zones that can receive draggable items with visual feedback, flexible positioning, capacity limits, and custom alignment options.

## Overview

Droppable components define areas where draggable items can be dropped. They provide visual feedback during hover states, handle drop logic when items are released, and offer precise control over where dropped items are positioned within the drop zone.

## Basic Usage

```tsx
import { Droppable } from "react-native-reanimated-dnd";

function MyDropZone() {
  const handleDrop = (data) => {
    console.log("Item dropped:", data);
    // Handle the dropped item - update state, make API calls, etc.
  };

  return (
    <Droppable onDrop={handleDrop}>
      <View style={styles.dropZone}>
        <Text>Drop items here</Text>
      </View>
    </Droppable>
  );
}
```

## Props Reference

### Core Props

| Prop          | Type                    | Default        | Description                            |
| ------------- | ----------------------- | -------------- | -------------------------------------- |
| `onDrop`      | `(data: TData) => void` | **Required**   | Callback when item is dropped          |
| `children`    | `ReactNode`             | **Required**   | Content to render inside the droppable |
| `droppableId` | `string`                | auto-generated | Unique identifier for the droppable    |
| `style`       | `StyleProp<ViewStyle>`  | -              | Style for the container                |

### Interaction Props

| Prop             | Type                          | Default | Description                         |
| ---------------- | ----------------------------- | ------- | ----------------------------------- |
| `dropDisabled`   | `boolean`                     | `false` | Whether dropping is disabled        |
| `onActiveChange` | `(isActive: boolean) => void` | -       | Callback when hover state changes   |
| `activeStyle`    | `StyleProp<ViewStyle>`        | -       | Style applied when item is hovering |

### Positioning Props

| Prop            | Type            | Default          | Description                       |
| --------------- | --------------- | ---------------- | --------------------------------- |
| `dropAlignment` | `DropAlignment` | `'center'`       | How dropped items are positioned  |
| `dropOffset`    | `DropOffset`    | `{ x: 0, y: 0 }` | Additional positioning offset     |
| `capacity`      | `number`        | `1`              | Maximum items that can be dropped |

## Drop Alignment Options

Control exactly where dropped items are positioned within the droppable:

### Alignment Types

```tsx
type DropAlignment =
  | "center" // Center of droppable (default)
  | "top-left" // Top-left corner
  | "top-center" // Top edge, centered horizontally
  | "top-right" // Top-right corner
  | "center-left" // Left edge, centered vertically
  | "center-right" // Right edge, centered vertically
  | "bottom-left" // Bottom-left corner
  | "bottom-center" // Bottom edge, centered horizontally
  | "bottom-right"; // Bottom-right corner
```

### Alignment Examples

```tsx
// Center alignment (default)
<Droppable onDrop={handleDrop} dropAlignment="center">
  <DropZone />
</Droppable>

// Top-left corner positioning
<Droppable onDrop={handleDrop} dropAlignment="top-left">
  <DropZone />
</Droppable>

// Bottom edge, centered horizontally
<Droppable onDrop={handleDrop} dropAlignment="bottom-center">
  <DropZone />
</Droppable>
```

### Fine-tuning with Offsets

```tsx
<Droppable
  onDrop={handleDrop}
  dropAlignment="top-left"
  dropOffset={{ x: 10, y: 5 }} // 10px right, 5px down from top-left
>
  <DropZone />
</Droppable>
```

## Examples

### Basic Drop Zone with Visual Feedback

```tsx
function VisualDropZone() {
  const [isHovered, setIsHovered] = useState(false);
  const [droppedItems, setDroppedItems] = useState([]);

  const handleDrop = (data) => {
    console.log("Dropped:", data.name);
    setDroppedItems((prev) => [...prev, data]);

    // Show success feedback
    showToast(`${data.name} added successfully!`);
  };

  return (
    <Droppable
      onDrop={handleDrop}
      onActiveChange={setIsHovered}
      activeStyle={{
        backgroundColor: "rgba(0, 255, 0, 0.2)",
        borderColor: "#00ff00",
        borderWidth: 2,
        transform: [{ scale: 1.05 }],
      }}
      style={styles.dropZone}
    >
      <View style={[styles.dropContent, isHovered && styles.hoveredContent]}>
        <Icon
          name="cloud-upload"
          size={32}
          color={isHovered ? "#00ff00" : "#666"}
        />
        <Text style={styles.dropText}>
          {isHovered ? "Release to drop" : "Drag files here"}
        </Text>
        <Text style={styles.itemCount}>{droppedItems.length} items</Text>
      </View>
    </Droppable>
  );
}

const styles = StyleSheet.create({
  dropZone: {
    width: 200,
    height: 150,
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#ccc",
    backgroundColor: "#f9f9f9",
  },
  dropContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  hoveredContent: {
    backgroundColor: "rgba(0, 255, 0, 0.1)",
  },
  dropText: {
    marginTop: 8,
    fontSize: 14,
    textAlign: "center",
    color: "#666",
  },
  itemCount: {
    marginTop: 4,
    fontSize: 12,
    color: "#999",
  },
});
```

### Kanban Column with Capacity

```tsx
function TaskColumn({ title, status, maxTasks = 5 }) {
  const [tasks, setTasks] = useState([]);
  const [isOverCapacity, setIsOverCapacity] = useState(false);

  const handleDrop = (task) => {
    if (tasks.length >= maxTasks) {
      showError(`Column is full! Maximum ${maxTasks} tasks allowed.`);
      return;
    }

    setTasks((prev) => [...prev, task]);
    updateTaskStatus(task.id, status);

    // Analytics
    analytics.track("task_moved", {
      taskId: task.id,
      fromStatus: task.status,
      toStatus: status,
    });
  };

  const handleActiveChange = (isActive) => {
    setIsOverCapacity(isActive && tasks.length >= maxTasks);
  };

  return (
    <Droppable
      droppableId={`column-${status}`}
      onDrop={handleDrop}
      onActiveChange={handleActiveChange}
      dropAlignment="top-center"
      dropOffset={{ x: 0, y: 10 }}
      capacity={maxTasks}
      activeStyle={{
        backgroundColor: isOverCapacity
          ? "rgba(239, 68, 68, 0.1)"
          : "rgba(59, 130, 246, 0.1)",
        borderColor: isOverCapacity ? "#ef4444" : "#3b82f6",
        borderWidth: 2,
        borderStyle: "dashed",
      }}
      style={styles.column}
    >
      <View style={styles.columnHeader}>
        <Text style={styles.columnTitle}>{title}</Text>
        <Text style={styles.taskCount}>
          {tasks.length}/{maxTasks}
        </Text>
      </View>

      <ScrollView style={styles.taskList}>
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </ScrollView>

      {tasks.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Drop tasks here</Text>
        </View>
      )}

      {isOverCapacity && (
        <View style={styles.capacityWarning}>
          <Text style={styles.warningText}>Column is full!</Text>
        </View>
      )}
    </Droppable>
  );
}
```

### File Upload Drop Zone

```tsx
function FileUploadZone() {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const handleFileDrop = async (fileData) => {
    // Validate file type and size
    if (!isValidFileType(fileData.type)) {
      showError("Only images, PDFs, and documents are allowed");
      return;
    }

    if (fileData.size > 10000000) {
      // 10MB limit
      showError("File size must be under 10MB");
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress(0);

      const result = await uploadFile(fileData, (progress) => {
        setUploadProgress(progress);
      });

      setUploadedFiles((prev) => [...prev, result]);
      showSuccess(`${fileData.name} uploaded successfully!`);
    } catch (error) {
      showError(`Upload failed: ${error.message}`);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <Droppable
      onDrop={handleFileDrop}
      dropDisabled={isUploading}
      onActiveChange={(active) => {
        if (active && isUploading) {
          showTooltip("Upload in progress...");
        }
      }}
      activeStyle={{
        backgroundColor: isUploading
          ? "rgba(239, 68, 68, 0.1)"
          : "rgba(34, 197, 94, 0.1)",
        borderColor: isUploading ? "#ef4444" : "#22c55e",
        transform: [{ scale: 1.02 }],
      }}
      style={[styles.uploadZone, isUploading && styles.uploading]}
    >
      <View style={styles.uploadContent}>
        {isUploading ? (
          <>
            <ActivityIndicator size="large" color="#3b82f6" />
            <ProgressBar progress={uploadProgress} style={styles.progressBar} />
            <Text style={styles.uploadText}>
              Uploading... {Math.round(uploadProgress * 100)}%
            </Text>
          </>
        ) : (
          <>
            <Icon name="cloud-upload" size={48} color="#22c55e" />
            <Text style={styles.uploadTitle}>Drop files to upload</Text>
            <Text style={styles.uploadSubtitle}>
              Images, PDFs, and documents (max 10MB)
            </Text>
            <Text style={styles.fileCount}>
              {uploadedFiles.length} files uploaded
            </Text>
          </>
        )}
      </View>
    </Droppable>
  );
}
```

### Shopping Cart Drop Zone

```tsx
function ShoppingCart() {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);

  const handleAddToCart = (product) => {
    const existingItem = cartItems.find((item) => item.id === product.id);

    if (existingItem) {
      // Increase quantity
      setCartItems((prev) =>
        prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      // Add new item
      setCartItems((prev) => [...prev, { ...product, quantity: 1 }]);
    }

    // Update total
    setTotal((prev) => prev + product.price);

    // Haptic feedback
    hapticFeedback();

    // Show success animation
    showAddToCartAnimation(product);
  };

  return (
    <Droppable
      onDrop={handleAddToCart}
      dropAlignment="center"
      activeStyle={{
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        borderColor: "#3b82f6",
        borderWidth: 2,
        transform: [{ scale: 1.05 }],
      }}
      style={styles.cart}
    >
      <View style={styles.cartHeader}>
        <Icon name="shopping-cart" size={24} color="#3b82f6" />
        <Text style={styles.cartTitle}>Shopping Cart</Text>
      </View>

      <ScrollView style={styles.cartItems}>
        {cartItems.map((item) => (
          <CartItem key={item.id} item={item} />
        ))}
      </ScrollView>

      <View style={styles.cartFooter}>
        <Text style={styles.itemCount}>{cartItems.length} items</Text>
        <Text style={styles.total}>Total: ${total.toFixed(2)}</Text>
      </View>

      {cartItems.length === 0 && (
        <View style={styles.emptyCart}>
          <Text style={styles.emptyText}>
            Drop products here to add to cart
          </Text>
        </View>
      )}
    </Droppable>
  );
}
```

### Conditional Drop Zone

```tsx
function ConditionalDropZone({ acceptedTypes, isEnabled }) {
  const [rejectedAttempts, setRejectedAttempts] = useState(0);

  const handleDrop = (data) => {
    // Validate item type
    if (!acceptedTypes.includes(data.type)) {
      setRejectedAttempts((prev) => prev + 1);
      showError(`Only ${acceptedTypes.join(", ")} items are accepted here`);

      // Shake animation for rejection
      shakeAnimation();
      return;
    }

    // Process valid drop
    processItem(data);
    setRejectedAttempts(0);
  };

  const handleActiveChange = (isActive) => {
    if (isActive && !isEnabled) {
      showTooltip("This drop zone is currently disabled");
    }
  };

  return (
    <Droppable
      onDrop={handleDrop}
      dropDisabled={!isEnabled}
      onActiveChange={handleActiveChange}
      activeStyle={{
        backgroundColor: isEnabled
          ? "rgba(34, 197, 94, 0.1)"
          : "rgba(239, 68, 68, 0.1)",
        borderColor: isEnabled ? "#22c55e" : "#ef4444",
        borderWidth: 2,
      }}
      style={[
        styles.conditionalZone,
        !isEnabled && styles.disabled,
        rejectedAttempts > 0 && styles.rejected,
      ]}
    >
      <View style={styles.zoneContent}>
        <Icon
          name={isEnabled ? "check-circle" : "x-circle"}
          size={32}
          color={isEnabled ? "#22c55e" : "#ef4444"}
        />
        <Text style={styles.zoneTitle}>
          {isEnabled ? "Drop Zone Active" : "Drop Zone Disabled"}
        </Text>
        <Text style={styles.acceptedTypes}>
          Accepts: {acceptedTypes.join(", ")}
        </Text>
        {rejectedAttempts > 0 && (
          <Text style={styles.rejectionCount}>
            {rejectedAttempts} rejected attempts
          </Text>
        )}
      </View>
    </Droppable>
  );
}
```

## Capacity Management

Control how many items can be dropped in a single droppable:

```tsx
function LimitedDropZone() {
  const maxItems = 3;
  const [currentItems, setCurrentItems] = useState([]);

  return (
    <Droppable
      onDrop={(data) => {
        if (currentItems.length < maxItems) {
          setCurrentItems((prev) => [...prev, data]);
        }
      }}
      capacity={maxItems}
      activeStyle={{
        backgroundColor:
          currentItems.length >= maxItems
            ? "rgba(239, 68, 68, 0.1)"
            : "rgba(34, 197, 94, 0.1)",
      }}
    >
      <Text>
        Capacity: {currentItems.length}/{maxItems}
      </Text>
    </Droppable>
  );
}
```

## TypeScript Support

The Droppable component is fully typed with generic support:

```tsx
interface FileData {
  id: string;
  name: string;
  type: string;
  size: number;
}

// Fully typed droppable
<Droppable<FileData>
  onDrop={(data: FileData) => {
    // data is fully typed with FileData properties
    console.log(data.name, data.size);
    processFile(data);
  }}
>
  <FileDropZone />
</Droppable>;
```

## Performance Tips

- Use `React.memo` for drop zone content that doesn't change frequently
- Avoid heavy computations in `onDrop` callbacks
- Use `useCallback` for stable callback references
- Consider debouncing `onActiveChange` for performance-critical apps

## Accessibility

The Droppable component supports accessibility features:

```tsx
<Droppable onDrop={handleDrop} style={styles.accessibleDropZone}>
  <View
    accessible={true}
    accessibilityRole="button"
    accessibilityLabel="Drop zone for files"
    accessibilityHint="Drop draggable items here to add them"
    accessibilityState={{ disabled: dropDisabled }}
  >
    <Text>Accessible Drop Zone</Text>
  </View>
</Droppable>
```

## Animation Integration

Combine with Reanimated for custom animations:

```tsx
function AnimatedDropZone() {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Droppable
      onDrop={handleDrop}
      onActiveChange={(isActive) => {
        scale.value = withSpring(isActive ? 1.1 : 1);
        opacity.value = withTiming(isActive ? 0.8 : 1);
      }}
    >
      <Animated.View style={[styles.dropZone, animatedStyle]}>
        <Text>Animated Drop Zone</Text>
      </Animated.View>
    </Droppable>
  );
}
```

## See Also

- [Draggable](./draggable) - Create draggable items that can be dropped
- [useDroppable Hook](../hooks/useDroppable) - Underlying hook for custom implementations
- [Basic Concepts](../getting-started/basic-concepts) - Understanding drop alignment and positioning
- [Examples](../examples/drop-zones) - More comprehensive examples
