---
title: "useDroppable Hook"
---

A hook for creating drop zones that can receive draggable items with collision detection, visual feedback, and flexible positioning.

## Overview

The `useDroppable` hook handles the registration of drop zones, collision detection with draggable items, visual feedback during hover states, and proper positioning of dropped items within the zone. It integrates seamlessly with the drag-and-drop context to provide a complete solution.

## Import

```tsx
import { useDroppable } from "react-native-reanimated-dnd";
```

## Parameters

### UseDroppableOptions\<TData\>

#### Core Parameters

##### onDrop

- **Type**: `(data: TData) => void`
- **Required**: Yes
- **Description**: Callback function fired when an item is successfully dropped on this droppable.

```tsx
const { viewProps, isActive } = useDroppable({
  onDrop: (data) => {
    console.log("Item dropped:", data);
    addItemToList(data);
  },
});
```

#### Optional Parameters

##### droppableId

- **Type**: `string`
- **Required**: No
- **Description**: Unique identifier for this droppable. If not provided, one will be generated automatically.

##### dropDisabled

- **Type**: `boolean`
- **Default**: `false`
- **Description**: Whether this droppable is disabled. When true, items cannot be dropped here.

```tsx
const { viewProps, isActive } = useDroppable({
  onDrop: handleDrop,
  dropDisabled: !user.canDrop,
});
```

##### onActiveChange

- **Type**: `(isActive: boolean) => void`
- **Required**: No
- **Description**: Callback fired when the active state changes (when items hover over or leave the droppable).

```tsx
const { viewProps, isActive } = useDroppable({
  onDrop: handleDrop,
  onActiveChange: (active) => {
    if (active) {
      playHoverSound();
      setHighlighted(true);
    } else {
      setHighlighted(false);
    }
  },
});
```

##### dropAlignment

- **Type**: `DropAlignment`
- **Default**: `"center"`
- **Description**: How dropped items should be aligned within this droppable area.

Available alignments:

- `center`: Center the item (default)
- `top-left`: Align to top-left corner
- `top-center`: Align to top edge, centered horizontally
- `top-right`: Align to top-right corner
- `center-left`: Align to left edge, centered vertically
- `center-right`: Align to right edge, centered vertically
- `bottom-left`: Align to bottom-left corner
- `bottom-center`: Align to bottom edge, centered horizontally
- `bottom-right`: Align to bottom-right corner

```tsx
const { viewProps, isActive } = useDroppable({
  onDrop: handleDrop,
  dropAlignment: "top-left",
});
```

##### dropOffset

- **Type**: `DropOffset`
- **Required**: No
- **Description**: Additional pixel offset to apply after alignment.

```tsx
const { viewProps, isActive } = useDroppable({
  onDrop: handleDrop,
  dropAlignment: "center",
  dropOffset: { x: 10, y: 5 }, // 10px right, 5px down from center
});
```

##### activeStyle

- **Type**: `StyleProp<ViewStyle>`
- **Required**: No
- **Description**: Style to apply when a draggable item is hovering over this droppable.

```tsx
const { viewProps, isActive } = useDroppable({
  onDrop: handleDrop,
  activeStyle: {
    backgroundColor: "rgba(0, 255, 0, 0.2)",
    borderColor: "#00ff00",
    borderWidth: 2,
    transform: [{ scale: 1.05 }],
  },
});
```

##### capacity

- **Type**: `number`
- **Default**: `1`
- **Description**: Maximum number of items that can be dropped on this droppable.

```tsx
const { viewProps, isActive } = useDroppable({
  onDrop: handleDrop,
  capacity: 5, // Allow up to 5 items
});
```

## Return Value

### UseDroppableReturn

#### viewProps

- **Type**: `{ style: AnimatedStyle<ViewStyle>; onLayout: (event: LayoutChangeEvent) => void; }`
- **Description**: Props to spread on the animated view that will be the droppable. Contains animated style and layout handler.

```tsx
const { viewProps, isActive } = useDroppable({ onDrop: handleDrop });

return (
  <Animated.View {...viewProps}>
    <Text>Drop zone</Text>
  </Animated.View>
);
```

#### isActive

- **Type**: `boolean`
- **Description**: Whether a draggable item is currently hovering over this droppable.

```tsx
const { viewProps, isActive } = useDroppable({ onDrop: handleDrop });

return (
  <Animated.View {...viewProps}>
    <Text>{isActive ? "Release to drop" : "Drag items here"}</Text>
  </Animated.View>
);
```

#### animatedViewRef

- **Type**: `ReturnType<typeof useAnimatedRef<Animated.View>>`
- **Description**: Animated ref for the droppable view. Used internally for measurements.

## Usage Examples

### Basic Drop Zone

```tsx
import { useDroppable } from "react-native-reanimated-dnd";
import Animated from "react-native-reanimated";

function BasicDropZone() {
  const { viewProps, isActive } = useDroppable({
    onDrop: (data) => {
      console.log("Item dropped:", data);
      addItemToList(data);
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
      <Text>{isActive ? "Release to drop" : "Drop items here"}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  dropZone: {
    width: 200,
    height: 150,
    backgroundColor: "#f0f0f0",
    borderWidth: 2,
    borderColor: "#ddd",
    borderStyle: "dashed",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  highlighted: {
    borderColor: "#007AFF",
    backgroundColor: "#e3f2fd",
  },
});
```

### Task Column Drop Zone

```tsx
function TaskColumn({ status, tasks, onTaskDrop }) {
  const maxTasks = 10;
  const isFull = tasks.length >= maxTasks;

  const { viewProps, isActive } = useDroppable({
    droppableId: `${status}-column`,
    onDrop: (task) => {
      if (!isFull) {
        onTaskDrop(task, status);
        updateTaskStatus(task.id, status);
      }
    },
    dropAlignment: "top-center",
    dropOffset: { x: 0, y: 10 },
    capacity: maxTasks,
    dropDisabled: isFull,
    activeStyle: {
      backgroundColor: "rgba(59, 130, 246, 0.1)",
      borderColor: "#3b82f6",
      borderWidth: 2,
      borderStyle: "dashed",
    },
    onActiveChange: (active) => {
      if (active && !isFull) {
        hapticFeedback();
      }
    },
  });

  return (
    <Animated.View
      {...viewProps}
      style={[styles.column, viewProps.style, isFull && styles.fullColumn]}
    >
      <Text style={styles.columnTitle}>
        {status.toUpperCase()} ({tasks.length}/{maxTasks})
      </Text>

      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}

      {tasks.length === 0 && !isActive && (
        <Text style={styles.emptyText}>Drop tasks here</Text>
      )}

      {isActive && !isFull && (
        <Text style={styles.dropHint}>Release to add task</Text>
      )}

      {isFull && <Text style={styles.fullText}>Column is full</Text>}
    </Animated.View>
  );
}
```

### File Upload Drop Zone

```tsx
function FileUploadZone() {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  const { viewProps, isActive } = useDroppable({
    onDrop: async (fileData) => {
      // Validate file
      if (fileData.size > 10000000) {
        // 10MB limit
        showError("File size must be under 10MB");
        return;
      }

      if (
        !["image/jpeg", "image/png", "application/pdf"].includes(fileData.type)
      ) {
        showError("Only JPEG, PNG, and PDF files allowed");
        return;
      }

      setIsUploading(true);
      try {
        await uploadFile(fileData);
        setUploadedFiles((prev) => [...prev, fileData]);
        showSuccess(`${fileData.name} uploaded successfully`);
      } catch (error) {
        showError("Upload failed");
      } finally {
        setIsUploading(false);
      }
    },
    dropDisabled: isUploading,
    capacity: 20,
    activeStyle: {
      backgroundColor: "rgba(59, 130, 246, 0.1)",
      borderColor: "#3b82f6",
      borderWidth: 2,
      borderStyle: "dashed",
      transform: [{ scale: 1.02 }],
    },
    onActiveChange: (active) => {
      if (active && isUploading) {
        showTooltip("Upload in progress...");
      }
    },
  });

  return (
    <Animated.View
      {...viewProps}
      style={[
        styles.uploadZone,
        viewProps.style,
        isUploading && styles.uploading,
      ]}
    >
      <View style={styles.uploadContent}>
        <Icon
          name="cloud-upload"
          size={48}
          color={isUploading ? "#6b7280" : "#3b82f6"}
        />
        <Text style={styles.uploadText}>
          {isUploading
            ? "Uploading..."
            : isActive
              ? "Release to upload"
              : "Drop files here"}
        </Text>
        <Text style={styles.fileCount}>
          {uploadedFiles.length}/20 files uploaded
        </Text>

        {uploadedFiles.slice(-3).map((file) => (
          <View key={file.id} style={styles.recentFile}>
            <Text>{file.name}</Text>
          </View>
        ))}
      </View>
    </Animated.View>
  );
}
```

### Shopping Cart Drop Zone

```tsx
function ShoppingCartDropZone() {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);

  const { viewProps, isActive } = useDroppable({
    onDrop: (product) => {
      // Check if item already in cart
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

      // Show feedback
      showToast(`${product.name} added to cart`);
      hapticFeedback();
    },
    capacity: 50,
    activeStyle: {
      backgroundColor: "rgba(34, 197, 94, 0.1)",
      borderColor: "#22c55e",
      borderWidth: 2,
      transform: [{ scale: 1.02 }],
    },
  });

  return (
    <Animated.View {...viewProps} style={[styles.cartZone, viewProps.style]}>
      <View style={styles.cartHeader}>
        <Icon name="shopping-cart" size={24} />
        <Text style={styles.cartTitle}>Shopping Cart</Text>
      </View>

      <Text style={styles.cartTotal}>Total: ${total.toFixed(2)}</Text>

      <Text style={styles.itemCount}>{cartItems.length} items</Text>

      {cartItems.length === 0 ? (
        <Text style={styles.emptyCart}>
          {isActive ? "Release to add to cart" : "Drop products here"}
        </Text>
      ) : (
        <ScrollView style={styles.cartItems}>
          {cartItems.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
        </ScrollView>
      )}
    </Animated.View>
  );
}
```

### Conditional Drop Zone with Validation

```tsx
function RestrictedDropZone({ allowedTypes, userRole }) {
  const [validDrop, setValidDrop] = useState(true);
  const [hoveringItem, setHoveringItem] = useState(null);

  const { viewProps, isActive } = useDroppable({
    onDrop: (data) => {
      // Validate item type
      if (!allowedTypes.includes(data.type)) {
        showError(`${data.type} items not allowed here`);
        return;
      }

      // Validate user permissions
      if (userRole !== "admin" && data.restricted) {
        showError("Insufficient permissions");
        return;
      }

      handleValidDrop(data);
    },
    activeStyle: {
      backgroundColor: validDrop
        ? "rgba(34, 197, 94, 0.2)"
        : "rgba(239, 68, 68, 0.2)",
      borderColor: validDrop ? "#22c55e" : "#ef4444",
      borderWidth: 2,
    },
    onActiveChange: (active) => {
      if (active) {
        // Check if the hovering item is valid
        const currentItem = getCurrentHoveringItem();
        if (currentItem) {
          const isValidType = allowedTypes.includes(currentItem.type);
          const hasPermission = userRole === "admin" || !currentItem.restricted;
          setValidDrop(isValidType && hasPermission);
          setHoveringItem(currentItem);
        }
      } else {
        setHoveringItem(null);
        setValidDrop(true);
      }
    },
  });

  return (
    <Animated.View
      {...viewProps}
      style={[styles.conditionalZone, viewProps.style]}
    >
      <View style={styles.zoneContent}>
        <Text style={styles.title}>Restricted Drop Zone</Text>
        <Text style={styles.subtitle}>Accepts: {allowedTypes.join(", ")}</Text>
        <Text style={styles.permission}>Role: {userRole}</Text>

        {isActive && hoveringItem && (
          <View style={styles.hoverInfo}>
            <Text style={styles.hoverItem}>
              Hovering: {hoveringItem.name} ({hoveringItem.type})
            </Text>
            {!validDrop && (
              <Text style={styles.errorText}>
                Invalid item or insufficient permissions
              </Text>
            )}
          </View>
        )}
      </View>
    </Animated.View>
  );
}
```

### Multi-Alignment Drop Zones

```tsx
function AlignmentDemo() {
  const alignments = [
    "top-left",
    "top-center",
    "top-right",
    "center-left",
    "center",
    "center-right",
    "bottom-left",
    "bottom-center",
    "bottom-right",
  ];

  return (
    <View style={styles.grid}>
      {alignments.map((alignment) => {
        const { viewProps, isActive } = useDroppable({
          onDrop: (data) => console.log(`Dropped at ${alignment}:`, data),
          dropAlignment: alignment,
          dropOffset: { x: 5, y: 5 },
          activeStyle: {
            backgroundColor: "rgba(59, 130, 246, 0.2)",
            borderColor: "#3b82f6",
          },
        });

        return (
          <Animated.View
            key={alignment}
            {...viewProps}
            style={[styles.alignedZone, viewProps.style]}
          >
            <Text style={styles.alignmentLabel}>{alignment}</Text>
            {isActive && <Text style={styles.activeIndicator}>Active</Text>}
          </Animated.View>
        );
      })}
    </View>
  );
}
```

### Real-time Drop Zone Analytics

```tsx
function AnalyticsDropZone() {
  const [analytics, setAnalytics] = useState({
    totalDrops: 0,
    hoverCount: 0,
    averageHoverTime: 0,
  });
  const hoverStartTime = useRef(null);

  const { viewProps, isActive } = useDroppable({
    onDrop: (data) => {
      setAnalytics((prev) => ({
        ...prev,
        totalDrops: prev.totalDrops + 1,
      }));

      // Track successful drop
      analytics.track("item_dropped", {
        itemType: data.type,
        dropZoneId: "analytics-zone",
        timestamp: Date.now(),
      });
    },
    onActiveChange: (active) => {
      if (active) {
        hoverStartTime.current = Date.now();
        setAnalytics((prev) => ({
          ...prev,
          hoverCount: prev.hoverCount + 1,
        }));
      } else if (hoverStartTime.current) {
        const hoverDuration = Date.now() - hoverStartTime.current;
        setAnalytics((prev) => {
          const newAverage =
            (prev.averageHoverTime * (prev.hoverCount - 1) + hoverDuration) /
            prev.hoverCount;
          return {
            ...prev,
            averageHoverTime: newAverage,
          };
        });
        hoverStartTime.current = null;
      }
    },
    activeStyle: {
      backgroundColor: "rgba(34, 197, 94, 0.1)",
      borderColor: "#22c55e",
      borderWidth: 2,
    },
  });

  return (
    <Animated.View
      {...viewProps}
      style={[styles.analyticsZone, viewProps.style]}
    >
      <Text style={styles.title}>Analytics Drop Zone</Text>
      <Text>Total Drops: {analytics.totalDrops}</Text>
      <Text>Hover Count: {analytics.hoverCount}</Text>
      <Text>Avg Hover Time: {Math.round(analytics.averageHoverTime)}ms</Text>
      {isActive && <Text style={styles.activeText}>Currently hovering</Text>}
    </Animated.View>
  );
}
```

## TypeScript Support

The hook is fully typed with generic support:

```tsx
interface ProductData {
  id: string;
  name: string;
  price: number;
  category: string;
}

function TypedDropZone() {
  const { viewProps, isActive } = useDroppable<ProductData>({
    onDrop: (data: ProductData) => {
      // data is properly typed
      console.log(`Dropped product: ${data.name} - $${data.price}`);
    },
    onActiveChange: (active: boolean) => {
      // active is properly typed
      console.log(`Drop zone active: ${active}`);
    },
  });

  return (
    <Animated.View {...viewProps}>
      <Text>Product drop zone</Text>
    </Animated.View>
  );
}
```

## Performance Tips

1. **Use `useCallback`** for event handlers to prevent unnecessary re-renders
2. **Memoize expensive calculations** in drop handlers
3. **Throttle visual feedback updates** for better performance
4. **Limit capacity** for large lists to prevent performance issues

```tsx
// Good: Memoized handlers
const handleDrop = useCallback((data) => {
  processDroppedItem(data);
}, []);

const handleActiveChange = useCallback((active) => {
  updateVisualFeedback(active);
}, []);
```

## Common Patterns

### Drop Zone State Machine

```tsx
function StateMachineDropZone() {
  const [state, setState] = useState("idle"); // idle, hovering, processing

  const { viewProps, isActive } = useDroppable({
    onDrop: async (data) => {
      setState("processing");
      try {
        await processItem(data);
        setState("idle");
      } catch (error) {
        setState("error");
        setTimeout(() => setState("idle"), 2000);
      }
    },
    onActiveChange: (active) => {
      setState(active ? "hovering" : "idle");
    },
    dropDisabled: state === "processing",
  });

  return (
    <Animated.View {...viewProps} style={[styles.zone, styles[state]]}>
      <Text>{getStateMessage(state)}</Text>
    </Animated.View>
  );
}
```

## See Also

- [Droppable Component](../../components/droppable) - High-level component using this hook
- [useDraggable Hook](./useDraggable) - Draggable counterpart
- [DropAlignment](../types/droppable-types#dropalignment) - Alignment options
- [UseDroppableOptions](../types/droppable-types#usedroppableoptionstdata) - Complete type definitions
