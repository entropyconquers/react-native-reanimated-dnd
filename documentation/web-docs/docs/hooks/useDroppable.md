---
title: "useDroppable"
---

The `useDroppable` hook creates drop zones that can receive draggable items with visual feedback, flexible positioning, capacity limits, and custom alignment options.

## Overview

This hook handles the registration of drop zones, collision detection with draggable items, visual feedback during hover states, and proper positioning of dropped items within the zone. It integrates seamlessly with the drag-and-drop context to provide a complete solution.

## Basic Usage

```tsx
import { useDroppable } from "react-native-reanimated-dnd";

function BasicDropZone() {
  const { viewProps, isActive } = useDroppable({
    onDrop: (data) => {
      console.log("Item dropped:", data);
      // Handle the dropped item
    },
  });

  return (
    <Animated.View
      {...viewProps}
      style={[
        styles.dropZone,
        viewProps.style, // Important: include the active style
        isActive && styles.highlighted,
      ]}
    >
      <Text>Drop items here</Text>
    </Animated.View>
  );
}
```

## Parameters

### UseDroppableOptions&lt;TData&gt;

| Option           | Type                          | Default          | Description                         |
| ---------------- | ----------------------------- | ---------------- | ----------------------------------- |
| `onDrop`         | `(data: TData) => void`       | **Required**     | Callback when item is dropped       |
| `droppableId`    | `string`                      | auto-generated   | Unique identifier for the droppable |
| `dropDisabled`   | `boolean`                     | `false`          | Whether dropping is disabled        |
| `onActiveChange` | `(isActive: boolean) => void` | -                | Callback when hover state changes   |
| `dropAlignment`  | `DropAlignment`               | `'center'`       | How dropped items are positioned    |
| `dropOffset`     | `DropOffset`                  | `{ x: 0, y: 0 }` | Additional positioning offset       |
| `activeStyle`    | `StyleProp<ViewStyle>`        | -                | Style applied when item is hovering |
| `capacity`       | `number`                      | `1`              | Maximum items that can be dropped   |

### DropAlignment Options

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

### DropOffset

```tsx
interface DropOffset {
  x: number; // Horizontal offset in pixels
  y: number; // Vertical offset in pixels
}
```

## Return Value

### UseDroppableReturn

| Property             | Type            | Description                               |
| -------------------- | --------------- | ----------------------------------------- |
| `viewProps`          | `object`        | Props to spread on the droppable view     |
| `viewProps.style`    | `AnimatedStyle` | Animated styles including active state    |
| `viewProps.onLayout` | `function`      | Layout handler for measurements           |
| `isActive`           | `boolean`       | Whether a draggable is currently hovering |
| `animatedViewRef`    | `AnimatedRef`   | Ref for the droppable view                |

## Examples

### Basic Drop Zone with Visual Feedback

```tsx
function VisualDropZone() {
  const [droppedItems, setDroppedItems] = useState([]);
  const [feedbackMessage, setFeedbackMessage] = useState("");

  const { viewProps, isActive } = useDroppable({
    onDrop: (data) => {
      console.log("Dropped:", data.name);
      setDroppedItems((prev) => [...prev, data]);
      setFeedbackMessage(`${data.name} added successfully!`);

      // Clear message after 2 seconds
      setTimeout(() => setFeedbackMessage(""), 2000);
    },
    onActiveChange: (active) => {
      if (active) {
        setFeedbackMessage("Release to drop");
      } else {
        setFeedbackMessage("");
      }
    },
    activeStyle: {
      backgroundColor: "rgba(0, 255, 0, 0.2)",
      borderColor: "#00ff00",
      borderWidth: 2,
      borderStyle: "dashed",
      transform: [{ scale: 1.05 }],
    },
  });

  return (
    <Animated.View {...viewProps} style={[styles.dropZone, viewProps.style]}>
      <View style={styles.dropContent}>
        <Icon
          name="cloud-upload"
          size={32}
          color={isActive ? "#00ff00" : "#666"}
        />
        <Text style={[styles.dropText, isActive && styles.activeText]}>
          {isActive ? "Release to drop" : "Drag files here"}
        </Text>
        {feedbackMessage ? (
          <Text style={styles.feedbackMessage}>{feedbackMessage}</Text>
        ) : null}
        <Text style={styles.itemCount}>
          {droppedItems.length} items dropped
        </Text>
      </View>
    </Animated.View>
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
    justifyContent: "center",
    alignItems: "center",
  },
  dropContent: {
    alignItems: "center",
    padding: 20,
  },
  dropText: {
    marginTop: 8,
    fontSize: 14,
    textAlign: "center",
    color: "#666",
  },
  activeText: {
    color: "#00ff00",
    fontWeight: "bold",
  },
  feedbackMessage: {
    marginTop: 4,
    fontSize: 12,
    color: "#007AFF",
    fontWeight: "bold",
  },
  itemCount: {
    marginTop: 8,
    fontSize: 12,
    color: "#999",
  },
});
```

### Kanban Column with Capacity and Alignment

```tsx
function TaskColumn({ title, status, maxTasks = 5 }) {
  const [tasks, setTasks] = useState([]);
  const [isOverCapacity, setIsOverCapacity] = useState(false);

  const { viewProps, isActive } = useDroppable({
    droppableId: `column-${status}`,
    onDrop: (task) => {
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
        columnCapacity: `${tasks.length + 1}/${maxTasks}`,
      });
    },
    onActiveChange: (active) => {
      setIsOverCapacity(active && tasks.length >= maxTasks);
    },
    dropAlignment: "top-center",
    dropOffset: { x: 0, y: 10 },
    capacity: maxTasks,
    activeStyle: {
      backgroundColor: isOverCapacity
        ? "rgba(239, 68, 68, 0.1)"
        : "rgba(59, 130, 246, 0.1)",
      borderColor: isOverCapacity ? "#ef4444" : "#3b82f6",
      borderWidth: 2,
      borderStyle: "dashed",
    },
  });

  return (
    <Animated.View {...viewProps} style={[styles.column, viewProps.style]}>
      <View style={styles.columnHeader}>
        <Text style={styles.columnTitle}>{title}</Text>
        <View style={styles.capacityIndicator}>
          <Text
            style={[
              styles.taskCount,
              tasks.length >= maxTasks && styles.fullCapacity,
            ]}
          >
            {tasks.length}/{maxTasks}
          </Text>
          {tasks.length >= maxTasks && (
            <Icon name="warning" size={16} color="#ef4444" />
          )}
        </View>
      </View>

      <ScrollView style={styles.taskList} showsVerticalScrollIndicator={false}>
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </ScrollView>

      {tasks.length === 0 && !isActive && (
        <View style={styles.emptyState}>
          <Icon name="inbox" size={24} color="#ccc" />
          <Text style={styles.emptyText}>Drop tasks here</Text>
        </View>
      )}

      {isActive && (
        <View
          style={[
            styles.dropIndicator,
            isOverCapacity && styles.errorIndicator,
          ]}
        >
          <Text
            style={[
              styles.dropIndicatorText,
              isOverCapacity && styles.errorText,
            ]}
          >
            {isOverCapacity ? "Column is full!" : "Drop task here"}
          </Text>
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  column: {
    width: 280,
    minHeight: 400,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    padding: 16,
    margin: 8,
  },
  columnHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  columnTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1f2937",
  },
  capacityIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  taskCount: {
    fontSize: 14,
    color: "#6b7280",
    fontWeight: "500",
  },
  fullCapacity: {
    color: "#ef4444",
    fontWeight: "bold",
  },
  taskList: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    opacity: 0.5,
  },
  emptyText: {
    marginTop: 8,
    fontSize: 14,
    color: "#9ca3af",
  },
  dropIndicator: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
    padding: 12,
    backgroundColor: "rgba(59, 130, 246, 0.1)",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#3b82f6",
    borderStyle: "dashed",
  },
  errorIndicator: {
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    borderColor: "#ef4444",
  },
  dropIndicatorText: {
    textAlign: "center",
    fontSize: 14,
    color: "#3b82f6",
    fontWeight: "500",
  },
  errorText: {
    color: "#ef4444",
  },
});
```

### File Upload Drop Zone with Validation

```tsx
function FileUploadZone() {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [validationError, setValidationError] = useState("");

  const validateFile = (fileData) => {
    const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!allowedTypes.includes(fileData.type)) {
      return "Only JPEG, PNG, and PDF files are allowed";
    }

    if (fileData.size > maxSize) {
      return "File size must be under 10MB";
    }

    return null;
  };

  const { viewProps, isActive } = useDroppable({
    onDrop: async (fileData) => {
      const error = validateFile(fileData);
      if (error) {
        setValidationError(error);
        setTimeout(() => setValidationError(""), 3000);
        return;
      }

      try {
        setIsUploading(true);
        setUploadProgress(0);
        setValidationError("");

        const result = await uploadFile(fileData, (progress) => {
          setUploadProgress(progress);
        });

        setUploadedFiles((prev) => [...prev, result]);
        showSuccess(`${fileData.name} uploaded successfully!`);
      } catch (error) {
        setValidationError(`Upload failed: ${error.message}`);
      } finally {
        setIsUploading(false);
        setUploadProgress(0);
      }
    },
    dropDisabled: isUploading,
    onActiveChange: (active) => {
      if (active && isUploading) {
        setValidationError("Upload in progress...");
      } else if (!active) {
        setValidationError("");
      }
    },
    activeStyle: {
      backgroundColor: isUploading
        ? "rgba(239, 68, 68, 0.1)"
        : "rgba(34, 197, 94, 0.1)",
      borderColor: isUploading ? "#ef4444" : "#22c55e",
      borderWidth: 2,
      borderStyle: "dashed",
      transform: [{ scale: 1.02 }],
    },
  });

  return (
    <View style={styles.container}>
      <Animated.View
        {...viewProps}
        style={[
          styles.uploadZone,
          viewProps.style,
          isUploading && styles.uploading,
        ]}
      >
        <View style={styles.uploadContent}>
          {isUploading ? (
            <>
              <ActivityIndicator size="large" color="#3b82f6" />
              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${uploadProgress * 100}%` },
                    ]}
                  />
                </View>
                <Text style={styles.progressText}>
                  {Math.round(uploadProgress * 100)}%
                </Text>
              </View>
              <Text style={styles.uploadText}>Uploading...</Text>
            </>
          ) : (
            <>
              <Icon
                name="cloud-upload"
                size={48}
                color={isActive ? "#22c55e" : "#6b7280"}
              />
              <Text
                style={[styles.uploadTitle, isActive && styles.activeTitle]}
              >
                {isActive ? "Release to upload" : "Drop files to upload"}
              </Text>
              <Text style={styles.uploadSubtitle}>
                JPEG, PNG, PDF (max 10MB)
              </Text>
              {uploadedFiles.length > 0 && (
                <Text style={styles.fileCount}>
                  {uploadedFiles.length} files uploaded
                </Text>
              )}
            </>
          )}
        </View>
      </Animated.View>

      {validationError ? (
        <View style={styles.errorContainer}>
          <Icon name="alert-circle" size={16} color="#ef4444" />
          <Text style={styles.errorText}>{validationError}</Text>
        </View>
      ) : null}

      {uploadedFiles.length > 0 && (
        <View style={styles.fileList}>
          <Text style={styles.fileListTitle}>Uploaded Files:</Text>
          {uploadedFiles.map((file, index) => (
            <View key={index} style={styles.fileItem}>
              <Icon name="file" size={16} color="#6b7280" />
              <Text style={styles.fileName}>{file.name}</Text>
              <Text style={styles.fileSize}>{formatFileSize(file.size)}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}
```

### Shopping Cart Drop Zone

```tsx
function ShoppingCart() {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [lastAddedItem, setLastAddedItem] = useState(null);

  const { viewProps, isActive } = useDroppable({
    onDrop: (product) => {
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

      // Show last added item
      setLastAddedItem(product);
      setTimeout(() => setLastAddedItem(null), 2000);

      // Haptic feedback
      hapticFeedback();

      // Analytics
      analytics.track("product_added_to_cart", {
        productId: product.id,
        productName: product.name,
        price: product.price,
        cartTotal: total + product.price,
        cartItemCount: cartItems.length + (existingItem ? 0 : 1),
      });
    },
    dropAlignment: "center",
    activeStyle: {
      backgroundColor: "rgba(59, 130, 246, 0.1)",
      borderColor: "#3b82f6",
      borderWidth: 2,
      borderStyle: "dashed",
      transform: [{ scale: 1.05 }],
    },
  });

  const removeItem = (productId) => {
    const item = cartItems.find((item) => item.id === productId);
    if (item) {
      setTotal((prev) => prev - item.price * item.quantity);
      setCartItems((prev) => prev.filter((item) => item.id !== productId));
    }
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity === 0) {
      removeItem(productId);
      return;
    }

    setCartItems((prev) =>
      prev.map((item) => {
        if (item.id === productId) {
          const quantityDiff = newQuantity - item.quantity;
          setTotal((prevTotal) => prevTotal + item.price * quantityDiff);
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  return (
    <Animated.View {...viewProps} style={[styles.cart, viewProps.style]}>
      <View style={styles.cartHeader}>
        <View style={styles.cartTitleContainer}>
          <Icon name="shopping-cart" size={24} color="#3b82f6" />
          <Text style={styles.cartTitle}>Shopping Cart</Text>
        </View>
        {isActive && (
          <View style={styles.dropHint}>
            <Text style={styles.dropHintText}>Drop to add</Text>
          </View>
        )}
      </View>

      {lastAddedItem && (
        <View style={styles.addedItemNotification}>
          <Icon name="check-circle" size={16} color="#22c55e" />
          <Text style={styles.addedItemText}>Added {lastAddedItem.name}</Text>
        </View>
      )}

      <ScrollView style={styles.cartItems} showsVerticalScrollIndicator={false}>
        {cartItems.map((item) => (
          <View key={item.id} style={styles.cartItem}>
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
            </View>
            <View style={styles.quantityControls}>
              <Pressable
                style={styles.quantityButton}
                onPress={() => updateQuantity(item.id, item.quantity - 1)}
              >
                <Text style={styles.quantityButtonText}>-</Text>
              </Pressable>
              <Text style={styles.quantity}>{item.quantity}</Text>
              <Pressable
                style={styles.quantityButton}
                onPress={() => updateQuantity(item.id, item.quantity + 1)}
              >
                <Text style={styles.quantityButtonText}>+</Text>
              </Pressable>
            </View>
            <Pressable
              style={styles.removeButton}
              onPress={() => removeItem(item.id)}
            >
              <Icon name="trash" size={16} color="#ef4444" />
            </Pressable>
          </View>
        ))}
      </ScrollView>

      <View style={styles.cartFooter}>
        <View style={styles.cartSummary}>
          <Text style={styles.itemCount}>{cartItems.length} items</Text>
          <Text style={styles.total}>Total: ${total.toFixed(2)}</Text>
        </View>
        {cartItems.length > 0 && (
          <Pressable style={styles.checkoutButton}>
            <Text style={styles.checkoutButtonText}>Checkout</Text>
          </Pressable>
        )}
      </View>

      {cartItems.length === 0 && !isActive && (
        <View style={styles.emptyCart}>
          <Icon name="shopping-cart" size={32} color="#ccc" />
          <Text style={styles.emptyText}>
            Drop products here to add to cart
          </Text>
        </View>
      )}
    </Animated.View>
  );
}
```

### Conditional Drop Zone with Dynamic Validation

```tsx
function ConditionalDropZone({ acceptedTypes, isEnabled, maxItems = 5 }) {
  const [droppedItems, setDroppedItems] = useState([]);
  const [rejectionReason, setRejectionReason] = useState("");

  const validateDrop = (data) => {
    if (!isEnabled) {
      return "Drop zone is currently disabled";
    }

    if (droppedItems.length >= maxItems) {
      return `Maximum ${maxItems} items allowed`;
    }

    if (!acceptedTypes.includes(data.type)) {
      return `Only ${acceptedTypes.join(", ")} items are accepted`;
    }

    if (droppedItems.some((item) => item.id === data.id)) {
      return "Item already exists in this zone";
    }

    return null;
  };

  const { viewProps, isActive } = useDroppable({
    onDrop: (data) => {
      const error = validateDrop(data);
      if (error) {
        setRejectionReason(error);
        setTimeout(() => setRejectionReason(""), 3000);

        // Shake animation for rejection
        shakeAnimation();
        return;
      }

      // Process valid drop
      setDroppedItems((prev) => [...prev, data]);
      setRejectionReason("");

      // Success feedback
      showToast(`${data.name} added successfully`);
    },
    dropDisabled: !isEnabled,
    onActiveChange: (active) => {
      if (active) {
        const error = validateDrop({ type: "unknown", id: "temp" });
        if (error && error !== "Item already exists in this zone") {
          setRejectionReason(error);
        }
      } else {
        setRejectionReason("");
      }
    },
    activeStyle: {
      backgroundColor:
        isEnabled && droppedItems.length < maxItems
          ? "rgba(34, 197, 94, 0.1)"
          : "rgba(239, 68, 68, 0.1)",
      borderColor:
        isEnabled && droppedItems.length < maxItems ? "#22c55e" : "#ef4444",
      borderWidth: 2,
      borderStyle: "dashed",
    },
  });

  const removeItem = (itemId) => {
    setDroppedItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  return (
    <View style={styles.container}>
      <Animated.View
        {...viewProps}
        style={[
          styles.conditionalZone,
          viewProps.style,
          !isEnabled && styles.disabled,
          droppedItems.length >= maxItems && styles.full,
        ]}
      >
        <View style={styles.zoneHeader}>
          <Icon
            name={isEnabled ? "check-circle" : "x-circle"}
            size={24}
            color={isEnabled ? "#22c55e" : "#ef4444"}
          />
          <Text style={styles.zoneTitle}>
            {isEnabled ? "Drop Zone Active" : "Drop Zone Disabled"}
          </Text>
        </View>

        <Text style={styles.acceptedTypes}>
          Accepts: {acceptedTypes.join(", ")}
        </Text>

        <Text style={styles.capacity}>
          Capacity: {droppedItems.length}/{maxItems}
        </Text>

        {rejectionReason ? (
          <View style={styles.rejectionContainer}>
            <Icon name="alert-triangle" size={16} color="#ef4444" />
            <Text style={styles.rejectionText}>{rejectionReason}</Text>
          </View>
        ) : null}

        {droppedItems.length > 0 && (
          <View style={styles.itemsList}>
            <Text style={styles.itemsTitle}>Dropped Items:</Text>
            {droppedItems.map((item) => (
              <View key={item.id} style={styles.droppedItem}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Pressable
                  style={styles.removeItemButton}
                  onPress={() => removeItem(item.id)}
                >
                  <Icon name="x" size={14} color="#ef4444" />
                </Pressable>
              </View>
            ))}
          </View>
        )}

        {droppedItems.length === 0 && !rejectionReason && (
          <Text style={styles.emptyMessage}>
            {isActive ? "Release to drop" : "Drop items here"}
          </Text>
        )}
      </Animated.View>
    </View>
  );
}
```

## Drop Alignment and Positioning

### Alignment Examples

```tsx
// Center alignment (default)
const centerDroppable = useDroppable({
  onDrop: handleDrop,
  dropAlignment: "center",
});

// Top-left corner positioning
const topLeftDroppable = useDroppable({
  onDrop: handleDrop,
  dropAlignment: "top-left",
});

// Bottom edge, centered horizontally
const bottomCenterDroppable = useDroppable({
  onDrop: handleDrop,
  dropAlignment: "bottom-center",
});
```

### Fine-tuning with Offsets

```tsx
const preciseDroppable = useDroppable({
  onDrop: handleDrop,
  dropAlignment: "top-left",
  dropOffset: { x: 10, y: 5 }, // 10px right, 5px down from top-left
});
```

## Capacity Management

```tsx
function LimitedDropZone() {
  const maxItems = 3;
  const [currentItems, setCurrentItems] = useState([]);

  const { viewProps, isActive } = useDroppable({
    onDrop: (data) => {
      if (currentItems.length < maxItems) {
        setCurrentItems((prev) => [...prev, data]);
      }
    },
    capacity: maxItems,
    activeStyle: {
      backgroundColor:
        currentItems.length >= maxItems
          ? "rgba(239, 68, 68, 0.1)"
          : "rgba(34, 197, 94, 0.1)",
    },
  });

  return (
    <Animated.View {...viewProps}>
      <Text>
        Capacity: {currentItems.length}/{maxItems}
      </Text>
    </Animated.View>
  );
}
```

## TypeScript Support

The hook is fully typed with generic support:

```tsx
interface FileData {
  id: string;
  name: string;
  type: string;
  size: number;
}

// Fully typed droppable
const { viewProps, isActive } = useDroppable<FileData>({
  onDrop: (data: FileData) => {
    // data is fully typed with FileData properties
    console.log(data.name, data.size);
    processFile(data);
  },
});
```

## Performance Tips

- Use `React.memo` for drop zone content that doesn't change frequently
- Avoid heavy computations in `onDrop` callbacks
- Use `useCallback` for stable callback references
- Consider debouncing `onActiveChange` for performance-critical apps

## Context Integration

The hook automatically integrates with the drag-and-drop context when used within a `DropProvider`:

```tsx
<DropProvider>
  <CustomDroppableComponent />
</DropProvider>
```

## See Also

- [Droppable Component](../components/droppable) - High-level component using this hook
- [useDraggable](./useDraggable) - Hook for creating draggable items
- [Basic Concepts](../getting-started/basic-concepts) - Understanding drop alignment and positioning
- [Examples](../examples/drop-zones) - More comprehensive examples
