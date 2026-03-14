---
title: "Context Types"
---

Complete type definitions for context and provider components.

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

- **`center`**: Center the dropped item (default)
- **`top-left`**: Position at top-left corner
- **`top-center`**: Position at top edge, centered horizontally
- **`top-right`**: Position at top-right corner
- **`center-left`**: Position at left edge, centered vertically
- **`center-right`**: Position at right edge, centered vertically
- **`bottom-left`**: Position at bottom-left corner
- **`bottom-center`**: Position at bottom edge, centered horizontally
- **`bottom-right`**: Position at bottom-right corner

#### Usage Examples

```tsx
// Center the dropped item (default)
const centerAlignment: DropAlignment = "center";

// Position at top-left corner
const topLeftAlignment: DropAlignment = "top-left";

// Position at bottom edge, centered horizontally
const bottomCenterAlignment: DropAlignment = "bottom-center";
```

### PositionUpdateListener

Callback function type for position update notifications.

```tsx
type PositionUpdateListener = () => void;
```

#### Description

Function called when position updates are triggered. Used internally by components to recalculate positions after layout changes.

## Interfaces

### DropOffset

Pixel offset to apply after alignment positioning.

```tsx
interface DropOffset {
  x: number;
  y: number;
}
```

#### Properties

##### x

- **Type**: `number`
- **Description**: Horizontal offset in pixels (positive = right, negative = left)

##### y

- **Type**: `number`
- **Description**: Vertical offset in pixels (positive = down, negative = up)

#### Usage Examples

```tsx
// No offset (default)
const noOffset: DropOffset = { x: 0, y: 0 };

// Move 10px right and 5px down from aligned position
const customOffset: DropOffset = { x: 10, y: 5 };

// Move 20px left from aligned position
const leftOffset: DropOffset = { x: -20, y: 0 };
```

### DroppedItemsMap\<TData\>

Mapping of draggable items to their drop locations.

```tsx
interface DroppedItemsMap<TData = unknown> {
  [draggableId: string]: {
    droppableId: string;
    data: TData;
  };
}
```

#### Properties

- **Key**: `string` - The unique ID of the draggable item
- **Value**: Object containing:
  - `droppableId`: ID of the droppable where the item was dropped
  - `data`: The data associated with the dropped item

#### Usage Example

```tsx
const droppedItems: DroppedItemsMap<TaskData> = {
  "task-1": {
    droppableId: "completed-column",
    data: { id: "task-1", title: "Complete project", status: "done" },
  },
  "task-2": {
    droppableId: "in-progress-column",
    data: { id: "task-2", title: "Review code", status: "in-progress" },
  },
};
```

### DropSlot\<TData\>

Configuration for a single drop zone.

```tsx
interface DropSlot<TData = unknown> {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  onDrop: (data: TData) => void;
  dropAlignment?: DropAlignment;
  dropOffset?: DropOffset;
  capacity?: number;
}
```

#### Properties

##### id

- **Type**: `string`
- **Required**: Yes
- **Description**: Unique identifier for the drop slot

##### x

- **Type**: `number`
- **Required**: Yes
- **Description**: X coordinate of the drop slot

##### y

- **Type**: `number`
- **Required**: Yes
- **Description**: Y coordinate of the drop slot

##### width

- **Type**: `number`
- **Required**: Yes
- **Description**: Width of the drop slot

##### height

- **Type**: `number`
- **Required**: Yes
- **Description**: Height of the drop slot

##### onDrop

- **Type**: `(data: TData) => void`
- **Required**: Yes
- **Description**: Callback function called when an item is dropped

##### dropAlignment

- **Type**: `DropAlignment`
- **Required**: No
- **Description**: How dropped items should be aligned within this slot

##### dropOffset

- **Type**: `DropOffset`
- **Required**: No
- **Description**: Additional pixel offset to apply after alignment

##### capacity

- **Type**: `number`
- **Required**: No
- **Description**: Maximum number of items this slot can hold

### SlotsContextValue\<TData\>

The main context value interface providing drag-and-drop functionality.

```tsx
interface SlotsContextValue<TData = unknown> {
  // Drop zone management
  register: (id: number, slot: DropSlot<TData>) => void;
  unregister: (id: number) => void;
  getSlots: () => Record<number, DropSlot<TData>>;
  isRegistered: (id: number) => boolean;

  // Active state management
  setActiveHoverSlot: (id: number | null) => void;
  activeHoverSlotId: number | null;

  // Position updates
  registerPositionUpdateListener: (
    id: string,
    listener: PositionUpdateListener
  ) => void;
  unregisterPositionUpdateListener: (id: string) => void;
  requestPositionUpdate: () => void;

  // Dropped items management
  registerDroppedItem: (
    draggableId: string,
    droppableId: string,
    itemData: any
  ) => void;
  unregisterDroppedItem: (draggableId: string) => void;
  getDroppedItems: () => DroppedItemsMap<any>;

  // Capacity management
  hasAvailableCapacity: (droppableId: string) => boolean;

  // Event callbacks
  onDragging?: (payload: DraggingPayload) => void;
  onDragStart?: (data: any) => void;
  onDragEnd?: (data: any) => void;
}
```

#### Drop Zone Management Methods

##### register(id, slot)

- **Type**: `(id: number, slot: DropSlot<TData>) => void`
- **Description**: Registers a new drop zone with the context
- **Parameters**:
  - `id`: Unique numeric identifier for the drop zone
  - `slot`: Drop zone configuration object

##### unregister(id)

- **Type**: `(id: number) => void`
- **Description**: Removes a drop zone from the context
- **Parameters**:
  - `id`: Unique identifier of the drop zone to remove

##### getSlots()

- **Type**: `() => Record<number, DropSlot<TData>>`
- **Description**: Returns all currently registered drop zones
- **Returns**: Object mapping slot IDs to their configurations

##### isRegistered(id)

- **Type**: `(id: number) => boolean`
- **Description**: Checks if a drop zone is currently registered
- **Parameters**:
  - `id`: Drop zone ID to check
- **Returns**: True if the drop zone is registered

#### Active State Management

##### setActiveHoverSlot(id)

- **Type**: `(id: number | null) => void`
- **Description**: Sets the currently active (hovered) drop zone
- **Parameters**:
  - `id`: ID of the active drop zone, or null for none

##### activeHoverSlotId

- **Type**: `number | null`
- **Description**: The ID of the currently active drop zone

#### Position Update Methods

##### registerPositionUpdateListener(id, listener)

- **Type**: `(id: string, listener: PositionUpdateListener) => void`
- **Description**: Registers a listener for position updates
- **Parameters**:
  - `id`: Unique identifier for the listener
  - `listener`: Callback function to invoke on updates

##### unregisterPositionUpdateListener(id)

- **Type**: `(id: string) => void`
- **Description**: Removes a position update listener
- **Parameters**:
  - `id`: Unique identifier of the listener to remove

##### requestPositionUpdate()

- **Type**: `() => void`
- **Description**: Triggers position updates for all registered listeners

#### Dropped Items Management

##### registerDroppedItem(draggableId, droppableId, itemData)

- **Type**: `(draggableId: string, droppableId: string, itemData: any) => void`
- **Description**: Records that an item has been dropped in a specific zone
- **Parameters**:
  - `draggableId`: ID of the draggable item
  - `droppableId`: ID of the drop zone
  - `itemData`: Data associated with the dropped item

##### unregisterDroppedItem(draggableId)

- **Type**: `(draggableId: string) => void`
- **Description**: Removes a dropped item from the registry
- **Parameters**:
  - `draggableId`: ID of the draggable item to remove

##### getDroppedItems()

- **Type**: `() => DroppedItemsMap<any>`
- **Description**: Returns the current mapping of dropped items

#### Capacity Management

##### hasAvailableCapacity(droppableId)

- **Type**: `(droppableId: string) => boolean`
- **Description**: Checks if a drop zone has available capacity
- **Parameters**:
  - `droppableId`: ID of the drop zone to check
- **Returns**: True if the drop zone can accept more items

#### Event Callbacks

##### onDragging

- **Type**: `(payload: DraggingPayload) => void`
- **Required**: No
- **Description**: Global callback fired during drag operations

##### onDragStart

- **Type**: `(data: any) => void`
- **Required**: No
- **Description**: Global callback fired when any drag operation starts

##### onDragEnd

- **Type**: `(data: any) => void`
- **Required**: No
- **Description**: Global callback fired when any drag operation ends

### DropProviderProps

Props for the DropProvider component.

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

#### Properties

##### children

- **Type**: `ReactNode`
- **Required**: Yes
- **Description**: The child components that will have access to the drag-and-drop context

##### onLayoutUpdateComplete

- **Type**: `() => void`
- **Required**: No
- **Description**: Callback fired when layout updates are complete. Useful for triggering additional UI updates after position recalculations.

##### onDroppedItemsUpdate

- **Type**: `(droppedItems: DroppedItemsMap) => void`
- **Required**: No
- **Description**: Callback fired when the dropped items mapping changes. Provides access to the current state of which items are dropped where.

##### onDragging

- **Type**: `(payload: DraggingPayload) => void`
- **Required**: No
- **Description**: Global callback fired during drag operations. Receives position updates for all draggable items.

##### onDragStart

- **Type**: `(data: any) => void`
- **Required**: No
- **Description**: Global callback fired when any drag operation starts.

##### onDragEnd

- **Type**: `(data: any) => void`
- **Required**: No
- **Description**: Global callback fired when any drag operation ends.

### DropProviderRef

Imperative handle interface for the DropProvider component.

```tsx
interface DropProviderRef {
  requestPositionUpdate: () => void;
  getDroppedItems: () => DroppedItemsMap;
}
```

#### Methods

##### requestPositionUpdate()

- **Type**: `() => void`
- **Description**: Manually trigger a position update for all registered droppables and draggables. Useful after layout changes or when positions may have become stale.

##### getDroppedItems()

- **Type**: `() => DroppedItemsMap`
- **Description**: Get the current mapping of dropped items.
- **Returns**: Object mapping draggable IDs to their drop information

### DraggingPayload

Payload object for drag event callbacks.

```tsx
interface DraggingPayload {
  x: number; // Original X position
  y: number; // Original Y position
  tx: number; // Current X translation
  ty: number; // Current Y translation
  itemData: any; // Data associated with the draggable item
}
```

#### Properties

- **`x`**: Original X position of the item
- **`y`**: Original Y position of the item
- **`tx`**: Current X translation from original position
- **`ty`**: Current Y translation from original position
- **`itemData`**: The data associated with the draggable item

## Usage Examples

### Basic Context Usage

```tsx
import { useContext } from "react";
import { SlotsContext } from "react-native-reanimated-dnd";

function MyComponent() {
  const context = useContext(SlotsContext);

  if (!context) {
    throw new Error("Component must be used within a DropProvider");
  }

  const { getSlots, getDroppedItems, activeHoverSlotId } = context;

  return (
    <View>
      <Text>Active Slots: {Object.keys(getSlots()).length}</Text>
      <Text>Dropped Items: {Object.keys(getDroppedItems()).length}</Text>
      <Text>Active Hover: {activeHoverSlotId || "None"}</Text>
    </View>
  );
}
```

### Custom Hook for Context Access

```tsx
import { useContext } from "react";
import { SlotsContext, SlotsContextValue } from "react-native-reanimated-dnd";

function useDragDropContext<TData = unknown>(): SlotsContextValue<TData> {
  const context = useContext(SlotsContext);

  if (!context) {
    throw new Error("useDragDropContext must be used within a DropProvider");
  }

  return context as SlotsContextValue<TData>;
}

// Usage
function TaskBoard() {
  const { getDroppedItems, hasAvailableCapacity } =
    useDragDropContext<TaskData>();

  const droppedItems = getDroppedItems();
  const canDrop = hasAvailableCapacity("todo-column");

  return (
    <View>
      <Text>Tasks: {Object.keys(droppedItems).length}</Text>
      <Text>Can Drop: {canDrop ? "Yes" : "No"}</Text>
    </View>
  );
}
```

### Provider with All Callbacks

```tsx
import {
  DropProvider,
  DroppedItemsMap,
  DraggingPayload,
} from "react-native-reanimated-dnd";
import { GestureHandlerRootView } from "react-native-gesture-handler";

function App() {
  const handleDroppedItemsUpdate = (
    droppedItems: DroppedItemsMap<TaskData>
  ) => {
    console.log("Dropped items updated:", droppedItems);
    // Sync with your state management
    updateGlobalState(droppedItems);
  };

  const handleDragStart = (data: TaskData) => {
    console.log("Drag started:", data.title);
    hapticFeedback();
    setDragIndicator(true);
  };

  const handleDragEnd = (data: TaskData) => {
    console.log("Drag ended:", data.title);
    setDragIndicator(false);
  };

  const handleDragging = ({ x, y, tx, ty, itemData }: DraggingPayload) => {
    const currentX = x + tx;
    const currentY = y + ty;
    updateDragPosition(currentX, currentY, itemData);
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <DropProvider
        onDroppedItemsUpdate={handleDroppedItemsUpdate}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragging={handleDragging}
        onLayoutUpdateComplete={() => console.log("Layout updated")}
      >
        <TaskBoard />
      </DropProvider>
    </GestureHandlerRootView>
  );
}
```

### Advanced Context Integration

```tsx
function AdvancedContextConsumer() {
  const context = useDragDropContext<TaskData>();
  const [analytics, setAnalytics] = useState({
    totalSlots: 0,
    activeSlots: 0,
    droppedItems: 0,
    capacityUtilization: 0,
  });

  useEffect(() => {
    const updateAnalytics = () => {
      const slots = context.getSlots();
      const droppedItems = context.getDroppedItems();

      const totalSlots = Object.keys(slots).length;
      const activeSlots = context.activeHoverSlotId ? 1 : 0;
      const totalDroppedItems = Object.keys(droppedItems).length;

      // Calculate capacity utilization
      const totalCapacity = Object.values(slots).reduce(
        (sum, slot) => sum + (slot.capacity || 1),
        0
      );
      const capacityUtilization =
        totalCapacity > 0 ? (totalDroppedItems / totalCapacity) * 100 : 0;

      setAnalytics({
        totalSlots,
        activeSlots,
        droppedItems: totalDroppedItems,
        capacityUtilization,
      });
    };

    const interval = setInterval(updateAnalytics, 1000);
    return () => clearInterval(interval);
  }, [context]);

  return (
    <View style={styles.analytics}>
      <Text>Total Drop Zones: {analytics.totalSlots}</Text>
      <Text>Active Zones: {analytics.activeSlots}</Text>
      <Text>Dropped Items: {analytics.droppedItems}</Text>
      <Text>Capacity Usage: {analytics.capacityUtilization.toFixed(1)}%</Text>
    </View>
  );
}
```

### Custom Drop Slot Registration

```tsx
function CustomDroppable({
  onDrop,
  children,
}: {
  onDrop: (data: TaskData) => void;
  children: ReactNode;
}) {
  const context = useDragDropContext<TaskData>();
  const viewRef = useRef<View>(null);
  const slotId = useRef(Math.random());

  useEffect(() => {
    const measureAndRegister = () => {
      viewRef.current?.measure((x, y, width, height, pageX, pageY) => {
        const slot: DropSlot<TaskData> = {
          id: "custom-droppable",
          x: pageX,
          y: pageY,
          width,
          height,
          onDrop,
          dropAlignment: "center",
          dropOffset: { x: 0, y: 0 },
          capacity: 5,
        };

        context.register(slotId.current, slot);
      });
    };

    measureAndRegister();
    return () => context.unregister(slotId.current);
  }, [context, onDrop]);

  return (
    <View ref={viewRef} onLayout={measureAndRegister}>
      {children}
    </View>
  );
}
```

### Position Update Listener

```tsx
function ResponsiveComponent() {
  const { registerPositionUpdateListener, unregisterPositionUpdateListener } =
    useDragDropContext();
  const listenerId = useRef(`listener-${Math.random()}`);

  useEffect(() => {
    const handlePositionUpdate = () => {
      // Re-measure and update positions
      console.log("Position update triggered");
      remeasureComponent();
    };

    registerPositionUpdateListener(listenerId.current, handlePositionUpdate);

    return () => {
      unregisterPositionUpdateListener(listenerId.current);
    };
  }, [registerPositionUpdateListener, unregisterPositionUpdateListener]);

  return <View>{/* Your component */}</View>;
}
```

### Capacity Management

```tsx
function CapacityManager() {
  const { hasAvailableCapacity, getDroppedItems } = useDragDropContext();
  const [capacityStatus, setCapacityStatus] = useState<Record<string, boolean>>(
    {}
  );

  const dropZones = ["todo", "in-progress", "done"];

  useEffect(() => {
    const checkCapacities = () => {
      const status: Record<string, boolean> = {};
      dropZones.forEach((zoneId) => {
        status[zoneId] = hasAvailableCapacity(zoneId);
      });
      setCapacityStatus(status);
    };

    checkCapacities();
    const interval = setInterval(checkCapacities, 1000);
    return () => clearInterval(interval);
  }, [hasAvailableCapacity]);

  return (
    <View>
      {dropZones.map((zoneId) => (
        <View key={zoneId} style={styles.capacityIndicator}>
          <Text>{zoneId}</Text>
          <Text
            style={[
              styles.status,
              capacityStatus[zoneId] ? styles.available : styles.full,
            ]}
          >
            {capacityStatus[zoneId] ? "Available" : "Full"}
          </Text>
        </View>
      ))}
    </View>
  );
}
```

## TypeScript Support

All context types are fully typed with generic support:

```tsx
interface TaskData {
  id: string;
  title: string;
  priority: "low" | "medium" | "high";
}

// Typed context usage
const context = useContext(SlotsContext) as SlotsContextValue<TaskData>;

// Typed dropped items
const droppedItems: DroppedItemsMap<TaskData> = context.getDroppedItems();

// Typed drop slot
const slot: DropSlot<TaskData> = {
  id: "task-column",
  x: 0,
  y: 0,
  width: 200,
  height: 400,
  onDrop: (data: TaskData) => {
    // data is properly typed as TaskData
    console.log(`Dropped task: ${data.title}`);
  },
  capacity: 10,
};
```

## See Also

- [DropProvider Component](../../context/DropProvider) - Provider component documentation
- [DragDropContext](../../context/DragDropContext) - Context usage guide
- [Draggable Types](./draggable-types) - Related draggable types
- [Droppable Types](./droppable-types) - Related droppable types
