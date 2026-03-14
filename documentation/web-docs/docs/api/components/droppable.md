---
title: "Droppable Component"
---

A component that creates drop zones for receiving draggable items with visual feedback and flexible positioning options.

## Overview

The `Droppable` component provides visual feedback when draggable items hover over it and handles the drop logic when items are released. It integrates seamlessly with the drag-and-drop context to provide collision detection and proper positioning of dropped items.

## Import

```tsx
import { Droppable } from "react-native-reanimated-dnd";
```

## Props

### Core Props

#### onDrop

- **Type**: `(data: TData) => void`
- **Required**: Yes
- **Description**: Callback function fired when an item is successfully dropped on this droppable. This is where you handle the drop logic for your application.

```tsx
const handleDrop = (data) => {
  console.log("Item dropped:", data.name);
  moveItemToColumn(data.id, "completed");
  showNotification(`${data.name} completed!`);
};

<Droppable onDrop={handleDrop}>
  <Text>Drop zone</Text>
</Droppable>;
```

#### children

- **Type**: `React.ReactNode`
- **Required**: Yes
- **Description**: The content to render inside the droppable.

#### style

- **Type**: `StyleProp<ViewStyle>`
- **Required**: No
- **Description**: Style to apply to the droppable container.

```tsx
<Droppable
  onDrop={handleDrop}
  style={[styles.dropZone, { backgroundColor: "#f0f0f0" }]}
>
  <Text>Styled drop zone</Text>
</Droppable>
```

### Interaction Props

#### dropDisabled

- **Type**: `boolean`
- **Default**: `false`
- **Description**: Whether this droppable is disabled. When true, items cannot be dropped here. Useful for conditionally enabling/disabling drop functionality.

```tsx
const isDisabled = user.role !== "admin";

<Droppable onDrop={handleDrop} dropDisabled={isDisabled}>
  <Text>Admin only drop zone</Text>
</Droppable>;
```

#### droppableId

- **Type**: `string`
- **Required**: No
- **Description**: Unique identifier for this droppable. If not provided, one will be generated automatically. Used for tracking which droppable items are dropped on.

```tsx
<Droppable droppableId="todo-column" onDrop={handleDrop}>
  <Text>Todo Column</Text>
</Droppable>
```

### Callback Props

#### onActiveChange

- **Type**: `(isActive: boolean) => void`
- **Required**: No
- **Description**: Callback fired when the active state of this droppable changes. Active state indicates whether a draggable item is currently hovering over this droppable.

```tsx
const handleActiveChange = (isActive) => {
  if (isActive) {
    playHoverSound();
    setHighlighted(true);
  } else {
    setHighlighted(false);
  }
};

<Droppable onDrop={handleDrop} onActiveChange={handleActiveChange}>
  <Text>Interactive drop zone</Text>
</Droppable>;
```

### Positioning Props

#### dropAlignment

- **Type**: `DropAlignment`
- **Default**: `"center"`
- **Description**: How dropped items should be aligned within this droppable area.

Available alignments:

- `center`: Center the item within the droppable (default)
- `top-left`: Align to top-left corner
- `top-center`: Align to top edge, centered horizontally
- `top-right`: Align to top-right corner
- `center-left`: Align to left edge, centered vertically
- `center-right`: Align to right edge, centered vertically
- `bottom-left`: Align to bottom-left corner
- `bottom-center`: Align to bottom edge, centered horizontally
- `bottom-right`: Align to bottom-right corner

```tsx
// Items dropped here will snap to the top-left corner
<Droppable onDrop={handleDrop} dropAlignment="top-left">
  <Text>Top-left aligned drops</Text>
</Droppable>
```

#### dropOffset

- **Type**: `DropOffset`
- **Required**: No
- **Description**: Additional pixel offset to apply after alignment. Useful for fine-tuning the exact position where items are dropped.

```tsx
// Drop items 10px to the right and 5px down from the center
<Droppable
  onDrop={handleDrop}
  dropAlignment="center"
  dropOffset={{ x: 10, y: 5 }}
>
  <Text>Offset drop zone</Text>
</Droppable>
```

### Visual Feedback Props

#### activeStyle

- **Type**: `StyleProp<ViewStyle>`
- **Required**: No
- **Description**: Style to apply when a draggable item is hovering over this droppable. This provides visual feedback to users about valid drop targets.

```tsx
const activeStyle = {
  backgroundColor: "rgba(0, 255, 0, 0.2)",
  borderColor: "#00ff00",
  borderWidth: 2,
  transform: [{ scale: 1.05 }],
};

<Droppable onDrop={handleDrop} activeStyle={activeStyle}>
  <Text>Visual feedback drop zone</Text>
</Droppable>;
```

### Capacity Props

#### capacity

- **Type**: `number`
- **Default**: `1`
- **Description**: Maximum number of items that can be dropped on this droppable. When capacity is reached, additional items cannot be dropped here.

```tsx
// Allow up to 5 items in this drop zone
<Droppable
  onDrop={handleDrop}
  capacity={5}
>
  <Text>Limited capacity (5 items)</Text>
</Droppable>

// Unlimited capacity
<Droppable
  onDrop={handleDrop}
  capacity={Infinity}
>
  <Text>Unlimited capacity</Text>
</Droppable>
```

## Usage Examples

### Basic Drop Zone

```tsx
import { Droppable } from "react-native-reanimated-dnd";

function BasicDropZone() {
  const handleDrop = (data) => {
    console.log("Item dropped:", data);
    addItemToList(data);
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

### Drop Zone with Visual Feedback

```tsx
function VisualDropZone() {
  const [isHovered, setIsHovered] = useState(false);

  const activeStyle = {
    backgroundColor: "rgba(34, 197, 94, 0.2)",
    borderColor: "#22c55e",
    borderWidth: 2,
    borderStyle: "dashed",
    transform: [{ scale: 1.02 }],
  };

  return (
    <Droppable
      onDrop={(data) => {
        console.log("Dropped:", data.name);
        processDroppedItem(data);
      }}
      onActiveChange={setIsHovered}
      activeStyle={activeStyle}
      style={styles.dropZone}
    >
      <View style={[styles.dropContent, isHovered && styles.hoveredContent]}>
        <Icon
          name={isHovered ? "check-circle" : "plus-circle"}
          size={32}
          color={isHovered ? "#22c55e" : "#6b7280"}
        />
        <Text style={[styles.dropText, isHovered && styles.activeText]}>
          {isHovered ? "Release to drop" : "Drag items here"}
        </Text>
      </View>
    </Droppable>
  );
}
```

### Kanban Column

```tsx
function TaskColumn({ status, tasks, onTaskDrop }) {
  const maxTasks = 10;
  const isFull = tasks.length >= maxTasks;

  return (
    <Droppable
      droppableId={`${status}-column`}
      onDrop={(task) => {
        if (!isFull) {
          onTaskDrop(task, status);
          updateTaskStatus(task.id, status);
        }
      }}
      dropAlignment="top-center"
      dropOffset={{ x: 0, y: 10 }}
      capacity={maxTasks}
      dropDisabled={isFull}
      activeStyle={{
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        borderColor: "#3b82f6",
        borderWidth: 2,
        borderStyle: "dashed",
      }}
      style={[styles.column, isFull && styles.fullColumn]}
    >
      <Text style={styles.columnTitle}>
        {status.toUpperCase()} ({tasks.length}/{maxTasks})
      </Text>

      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}

      {tasks.length === 0 && (
        <Text style={styles.emptyText}>Drop tasks here</Text>
      )}

      {isFull && <Text style={styles.fullText}>Column is full</Text>}
    </Droppable>
  );
}
```

### File Upload Zone

```tsx
function FileUploadZone() {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileDrop = async (fileData) => {
    // Validate file
    if (fileData.size > 10000000) {
      // 10MB limit
      showError("File size must be under 10MB");
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
  };

  return (
    <Droppable
      onDrop={handleFileDrop}
      dropDisabled={isUploading}
      capacity={20}
      activeStyle={{
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        borderColor: "#3b82f6",
        borderWidth: 2,
        borderStyle: "dashed",
      }}
      onActiveChange={(active) => {
        if (active && isUploading) {
          showTooltip("Upload in progress...");
        }
      }}
      style={[styles.uploadZone, isUploading && styles.uploading]}
    >
      <View style={styles.uploadContent}>
        <Icon
          name="cloud-upload"
          size={48}
          color={isUploading ? "#6b7280" : "#3b82f6"}
        />
        <Text style={styles.uploadText}>
          {isUploading ? "Uploading..." : "Drop files here"}
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
    </Droppable>
  );
}
```

### Conditional Drop Zone

```tsx
function ConditionalDropZone({ allowedTypes, userRole }) {
  const [validDrop, setValidDrop] = useState(true);

  const handleDrop = (data) => {
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
  };

  const handleActiveChange = (active) => {
    if (active) {
      // Check if the hovering item is valid
      const hoveringItem = getCurrentHoveringItem();
      if (hoveringItem) {
        const isValidType = allowedTypes.includes(hoveringItem.type);
        const hasPermission = userRole === "admin" || !hoveringItem.restricted;
        setValidDrop(isValidType && hasPermission);
      }
    }
  };

  return (
    <Droppable
      onDrop={handleDrop}
      onActiveChange={handleActiveChange}
      activeStyle={{
        backgroundColor: validDrop
          ? "rgba(34, 197, 94, 0.2)"
          : "rgba(239, 68, 68, 0.2)",
        borderColor: validDrop ? "#22c55e" : "#ef4444",
        borderWidth: 2,
      }}
      style={styles.conditionalZone}
    >
      <View style={styles.zoneContent}>
        <Text style={styles.title}>Restricted Drop Zone</Text>
        <Text style={styles.subtitle}>Accepts: {allowedTypes.join(", ")}</Text>
        <Text style={styles.permission}>Role: {userRole}</Text>

        {!validDrop && (
          <Text style={styles.errorText}>
            Invalid item or insufficient permissions
          </Text>
        )}
      </View>
    </Droppable>
  );
}
```

### Shopping Cart Drop Zone

```tsx
function ShoppingCartDropZone() {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);

  const handleProductDrop = (product) => {
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
  };

  return (
    <Droppable
      onDrop={handleProductDrop}
      capacity={50}
      activeStyle={{
        backgroundColor: "rgba(34, 197, 94, 0.1)",
        borderColor: "#22c55e",
        borderWidth: 2,
        transform: [{ scale: 1.02 }],
      }}
      style={styles.cartZone}
    >
      <View style={styles.cartHeader}>
        <Icon name="shopping-cart" size={24} />
        <Text style={styles.cartTitle}>Shopping Cart</Text>
      </View>

      <Text style={styles.cartTotal}>Total: ${total.toFixed(2)}</Text>

      <Text style={styles.itemCount}>{cartItems.length} items</Text>

      {cartItems.length === 0 ? (
        <Text style={styles.emptyCart}>Drop products here to add to cart</Text>
      ) : (
        <ScrollView style={styles.cartItems}>
          {cartItems.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
        </ScrollView>
      )}
    </Droppable>
  );
}
```

### Aligned Drop Zones Grid

```tsx
function AlignedDropZones() {
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
      {alignments.map((alignment) => (
        <Droppable
          key={alignment}
          onDrop={(data) => console.log(`Dropped at ${alignment}:`, data)}
          dropAlignment={alignment}
          dropOffset={{ x: 5, y: 5 }}
          activeStyle={{
            backgroundColor: "rgba(59, 130, 246, 0.2)",
            borderColor: "#3b82f6",
          }}
          style={styles.alignedZone}
        >
          <Text style={styles.alignmentLabel}>{alignment}</Text>
        </Droppable>
      ))}
    </View>
  );
}
```

## TypeScript Support

The component is fully typed with generic support:

```tsx
interface ProductData {
  id: string;
  name: string;
  price: number;
  category: string;
}

function TypedDroppable() {
  return (
    <Droppable<ProductData>
      onDrop={(data: ProductData) => {
        // data is properly typed
        console.log(`Dropped product: ${data.name} - $${data.price}`);
      }}
    >
      <Text>Product drop zone</Text>
    </Droppable>
  );
}
```

## Performance Tips

1. **Use `useCallback`** for event handlers to prevent unnecessary re-renders
2. **Memoize expensive calculations** in drop handlers
3. **Throttle visual feedback updates** for better performance
4. **Limit capacity** for large lists to prevent performance issues

## Accessibility

- The component automatically handles accessibility for drop operations
- Provide meaningful content and labels for screen readers
- Consider alternative interaction methods for users with disabilities
- Use semantic elements and proper ARIA labels

## See Also

- [useDroppable Hook](../../hooks/useDroppable) - Underlying hook implementation
- [Draggable Component](./draggable) - Draggable component
- [DropAlignment](../types/droppable-types#dropalignment) - Alignment options
- [DropProvider](../../context/DropProvider) - Context provider
