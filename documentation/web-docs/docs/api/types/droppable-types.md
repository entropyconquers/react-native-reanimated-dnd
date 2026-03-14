---
title: "Droppable Types"
---

Complete type definitions for droppable components and hooks.

## Interfaces

### UseDroppableOptions\<TData\>

Configuration options for the useDroppable hook.

```tsx
interface UseDroppableOptions<TData = unknown> {
  onDrop: (data: TData) => void;
  dropDisabled?: boolean;
  onActiveChange?: (isActive: boolean) => void;
  dropAlignment?: DropAlignment;
  dropOffset?: DropOffset;
  activeStyle?: StyleProp<ViewStyle>;
  droppableId?: string;
  capacity?: number;
}
```

#### Properties

##### onDrop

- **Type**: `(data: TData) => void`
- **Required**: Yes
- **Description**: Callback function fired when an item is successfully dropped on this droppable. This is where you handle the drop logic for your application.

```tsx
const handleDrop = (data: TaskData) => {
  console.log("Task dropped:", data.name);
  moveTaskToColumn(data.id, "completed");
  showNotification(`${data.name} completed!`);
};
```

##### dropDisabled

- **Type**: `boolean`
- **Default**: `false`
- **Description**: Whether this droppable is disabled. When true, items cannot be dropped here. Useful for conditionally enabling/disabling drop functionality.

```tsx
const isDisabled = user.role !== "admin";

const { viewProps } = useDroppable({
  onDrop: handleDrop,
  dropDisabled: isDisabled,
});
```

##### onActiveChange

- **Type**: `(isActive: boolean) => void`
- **Required**: No
- **Description**: Callback fired when the active state of this droppable changes. Active state indicates whether a draggable item is currently hovering over this droppable.

```tsx
const handleActiveChange = (isActive: boolean) => {
  if (isActive) {
    playHoverSound();
    setHighlighted(true);
  } else {
    setHighlighted(false);
  }
};
```

##### dropAlignment

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
const { viewProps } = useDroppable({
  onDrop: handleDrop,
  dropAlignment: "top-left",
});
```

##### dropOffset

- **Type**: `DropOffset`
- **Required**: No
- **Description**: Additional pixel offset to apply after alignment. Useful for fine-tuning the exact position where items are dropped.

```tsx
// Drop items 10px to the right and 5px down from the center
const { viewProps } = useDroppable({
  onDrop: handleDrop,
  dropAlignment: "center",
  dropOffset: { x: 10, y: 5 },
});
```

##### activeStyle

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

const { viewProps } = useDroppable({
  onDrop: handleDrop,
  activeStyle,
});
```

##### droppableId

- **Type**: `string`
- **Required**: No
- **Description**: Unique identifier for this droppable. If not provided, one will be generated automatically. Used for tracking which droppable items are dropped on.

```tsx
const { viewProps } = useDroppable({
  droppableId: "todo-column",
  onDrop: handleDrop,
});
```

##### capacity

- **Type**: `number`
- **Default**: `1`
- **Description**: Maximum number of items that can be dropped on this droppable. When capacity is reached, additional items cannot be dropped here.

```tsx
// Allow up to 5 items in this drop zone
const { viewProps } = useDroppable({
  onDrop: handleDrop,
  capacity: 5,
});

// Unlimited capacity
const { viewProps } = useDroppable({
  onDrop: handleDrop,
  capacity: Infinity,
});
```

### UseDroppableReturn

Return value from the useDroppable hook.

```tsx
interface UseDroppableReturn {
  viewProps: {
    onLayout: (event: LayoutChangeEvent) => void;
    style?: StyleProp<ViewStyle>;
  };
  isActive: boolean;
  activeStyle?: StyleProp<ViewStyle>;
  animatedViewRef: ReturnType<typeof useAnimatedRef<Animated.View>>;
}
```

#### Properties

##### viewProps

- **Type**: `{ onLayout: (event: LayoutChangeEvent) => void; style?: StyleProp<ViewStyle>; }`
- **Description**: Props to spread on the view that will act as a drop zone. Contains layout handler and conditional active styling.

##### isActive

- **Type**: `boolean`
- **Description**: Whether a draggable item is currently hovering over this droppable. Useful for conditional rendering or additional visual feedback.

##### activeStyle

- **Type**: `StyleProp<ViewStyle>`
- **Description**: The active style that was passed in options. Useful for external styling logic.

##### animatedViewRef

- **Type**: `ReturnType<typeof useAnimatedRef<Animated.View>>`
- **Description**: Animated ref for the droppable view. Used internally for measurements.

### DroppableProps\<TData\>

Props for the Droppable component.

```tsx
interface DroppableProps<TData = unknown> extends UseDroppableOptions<TData> {
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
}
```

#### Properties

##### style

- **Type**: `StyleProp<ViewStyle>`
- **Required**: No
- **Description**: Style to apply to the droppable container.

##### children

- **Type**: `React.ReactNode`
- **Required**: Yes
- **Description**: The content to render inside the droppable.

## Type Aliases

### DropAlignment

Alignment options for positioning dropped items within a droppable area.

```tsx
type DropAlignment =
  | "center"
  | "top-left"
  | "top-center"
  | "top-right"
  | "center-left"
  | "center-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";
```

#### Values

- **`center`**: Center the item within the droppable (default)
- **`top-left`**: Align to top-left corner
- **`top-center`**: Align to top edge, centered horizontally
- **`top-right`**: Align to top-right corner
- **`center-left`**: Align to left edge, centered vertically
- **`center-right`**: Align to right edge, centered vertically
- **`bottom-left`**: Align to bottom-left corner
- **`bottom-center`**: Align to bottom edge, centered horizontally
- **`bottom-right`**: Align to bottom-right corner

### DropOffset

Pixel offset configuration for fine-tuning drop positioning.

```tsx
interface DropOffset {
  x: number;
  y: number;
}
```

#### Properties

- **`x`**: Horizontal offset in pixels (positive = right, negative = left)
- **`y`**: Vertical offset in pixels (positive = down, negative = up)

## Usage Examples

### Basic Droppable

```tsx
import { useDroppable } from "react-native-reanimated-dnd";

interface TaskData {
  id: string;
  title: string;
  status: "todo" | "in-progress" | "done";
}

function DropZone({ status }: { status: string }) {
  const { viewProps, isActive } = useDroppable({
    onDrop: (data: TaskData) => {
      console.log(`Task ${data.title} dropped in ${status}`);
      updateTaskStatus(data.id, status);
    },
    droppableId: `${status}-column`,
  });

  return (
    <View {...viewProps} style={[styles.dropZone, isActive && styles.active]}>
      <Text>{status.toUpperCase()}</Text>
      {isActive && <Text>Drop here!</Text>}
    </View>
  );
}
```

### Droppable with Visual Feedback

```tsx
function VisualDropZone() {
  const activeStyle = {
    backgroundColor: "rgba(34, 197, 94, 0.2)",
    borderColor: "#22c55e",
    borderWidth: 2,
    borderStyle: "dashed" as const,
    transform: [{ scale: 1.02 }],
  };

  const { viewProps, isActive } = useDroppable({
    onDrop: (data) => handleDrop(data),
    activeStyle,
    onActiveChange: (active) => {
      if (active) {
        hapticFeedback();
        playSound("hover");
      }
    },
  });

  return (
    <Animated.View {...viewProps} style={styles.dropZone}>
      <Icon
        name={isActive ? "check-circle" : "plus-circle"}
        size={24}
        color={isActive ? "#22c55e" : "#6b7280"}
      />
      <Text style={[styles.text, isActive && styles.activeText]}>
        {isActive ? "Release to drop" : "Drop items here"}
      </Text>
    </Animated.View>
  );
}
```

### Capacity-Limited Droppable

```tsx
function LimitedDropZone({ maxItems = 3 }: { maxItems?: number }) {
  const [droppedItems, setDroppedItems] = useState<TaskData[]>([]);
  const isFull = droppedItems.length >= maxItems;

  const { viewProps, isActive } = useDroppable({
    onDrop: (data: TaskData) => {
      if (!isFull) {
        setDroppedItems((prev) => [...prev, data]);
        showToast(`${data.title} added`);
      } else {
        showError("Drop zone is full!");
      }
    },
    capacity: maxItems,
    dropDisabled: isFull,
    activeStyle: {
      backgroundColor: isFull
        ? "rgba(239, 68, 68, 0.2)"
        : "rgba(34, 197, 94, 0.2)",
      borderColor: isFull ? "#ef4444" : "#22c55e",
    },
  });

  return (
    <View {...viewProps} style={[styles.dropZone, isFull && styles.fullZone]}>
      <Text>
        Items: {droppedItems.length}/{maxItems}
      </Text>
      {droppedItems.map((item) => (
        <Text key={item.id} style={styles.item}>
          {item.title}
        </Text>
      ))}
      {isFull && <Text style={styles.fullText}>Zone Full</Text>}
    </View>
  );
}
```

### Aligned Droppable

```tsx
function AlignedDropZones() {
  const alignments: DropAlignment[] = [
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
        const { viewProps } = useDroppable({
          onDrop: (data) => console.log(`Dropped at ${alignment}:`, data),
          dropAlignment: alignment,
          dropOffset: { x: 5, y: 5 }, // Small offset for visual clarity
        });

        return (
          <View key={alignment} {...viewProps} style={styles.alignedZone}>
            <Text style={styles.alignmentLabel}>{alignment}</Text>
          </View>
        );
      })}
    </View>
  );
}
```

### File Upload Droppable

```tsx
interface FileData {
  id: string;
  name: string;
  size: number;
  type: string;
}

function FileUploadZone() {
  const [uploadedFiles, setUploadedFiles] = useState<FileData[]>([]);

  const { viewProps, isActive } = useDroppable({
    onDrop: (file: FileData) => {
      setUploadedFiles((prev) => [...prev, file]);
      uploadFile(file);
    },
    capacity: 10,
    activeStyle: {
      backgroundColor: "rgba(59, 130, 246, 0.1)",
      borderColor: "#3b82f6",
      borderWidth: 2,
      borderStyle: "dashed" as const,
    },
    onActiveChange: (active) => {
      if (active) {
        setDropHint("Release to upload");
      } else {
        setDropHint("Drag files here");
      }
    },
  });

  return (
    <View
      {...viewProps}
      style={[styles.uploadZone, isActive && styles.activeUpload]}
    >
      <Icon
        name="cloud-upload"
        size={48}
        color={isActive ? "#3b82f6" : "#6b7280"}
      />
      <Text style={styles.uploadText}>
        {isActive ? "Release to upload" : "Drag files here"}
      </Text>
      <Text style={styles.fileCount}>
        {uploadedFiles.length}/10 files uploaded
      </Text>

      {uploadedFiles.map((file) => (
        <View key={file.id} style={styles.fileItem}>
          <Text>{file.name}</Text>
          <Text style={styles.fileSize}>{formatFileSize(file.size)}</Text>
        </View>
      ))}
    </View>
  );
}
```

### Conditional Droppable

```tsx
function ConditionalDropZone({ allowedTypes }: { allowedTypes: string[] }) {
  const { viewProps, isActive } = useDroppable({
    onDrop: (data: TaskData) => {
      if (allowedTypes.includes(data.type)) {
        handleValidDrop(data);
      } else {
        showError(`${data.type} items not allowed here`);
      }
    },
    onActiveChange: (active) => {
      // Check if the hovering item is valid
      const hoveringItem = getCurrentHoveringItem();
      if (active && hoveringItem) {
        const isValid = allowedTypes.includes(hoveringItem.type);
        setValidDrop(isValid);
      }
    },
    activeStyle: {
      backgroundColor: validDrop
        ? "rgba(34, 197, 94, 0.2)"
        : "rgba(239, 68, 68, 0.2)",
      borderColor: validDrop ? "#22c55e" : "#ef4444",
    },
  });

  return (
    <View {...viewProps} style={styles.conditionalZone}>
      <Text>Accepts: {allowedTypes.join(", ")}</Text>
      {isActive && (
        <Text
          style={[styles.feedback, validDrop ? styles.valid : styles.invalid]}
        >
          {validDrop ? "Valid drop target" : "Invalid item type"}
        </Text>
      )}
    </View>
  );
}
```

## See Also

- [Droppable Component](../../components/droppable) - Component documentation
- [useDroppable Hook](../../hooks/useDroppable) - Hook documentation
- [Draggable Types](./draggable-types) - Related draggable types
- [Context Types](./context-types) - Context-related types
