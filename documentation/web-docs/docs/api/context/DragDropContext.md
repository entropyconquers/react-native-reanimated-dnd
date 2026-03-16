---
title: "DragDropContext API"
---

Complete API reference for the `DragDropContext` (exported as `SlotsContext`).

## Import

```tsx
import { SlotsContext } from "react-native-reanimated-dnd";
```

## Context Value

### SlotsContextValue Interface

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

## Methods

### Drop Zone Management

#### register(id, slot)

Registers a new drop zone with the context.

- **Parameters**:
  - `id` (`number`): Unique identifier for the drop zone
  - `slot` (`DropSlot<TData>`): Drop zone configuration object
- **Returns**: `void`
- **Description**: Adds a drop zone to the context's registry

#### unregister(id)

Removes a drop zone from the context.

- **Parameters**:
  - `id` (`number`): Unique identifier of the drop zone to remove
- **Returns**: `void`
- **Description**: Removes a drop zone from the context's registry

#### getSlots()

Returns all currently registered drop zones.

- **Parameters**: None
- **Returns**: `Record<number, DropSlot<TData>>`
- **Description**: Gets a mapping of all registered drop zones by their IDs

#### isRegistered(id)

Checks if a drop zone is currently registered.

- **Parameters**:
  - `id` (`number`): Drop zone ID to check
- **Returns**: `boolean`
- **Description**: Returns true if the drop zone is registered

### Active State Management

#### setActiveHoverSlot(id)

Sets the currently active (hovered) drop zone.

- **Parameters**:
  - `id` (`number | null`): ID of the active drop zone, or null for none
- **Returns**: `void`
- **Description**: Updates which drop zone is currently being hovered over

#### activeHoverSlotId

The ID of the currently active drop zone.

- **Type**: `number | null`
- **Description**: Read-only property indicating which drop zone is active

### Position Updates

#### registerPositionUpdateListener(id, listener)

Registers a listener for position updates.

- **Parameters**:
  - `id` (`string`): Unique identifier for the listener
  - `listener` (`PositionUpdateListener`): Callback function to invoke on updates
- **Returns**: `void`
- **Description**: Adds a listener that will be called when positions need updating

#### unregisterPositionUpdateListener(id)

Removes a position update listener.

- **Parameters**:
  - `id` (`string`): Unique identifier of the listener to remove
- **Returns**: `void`
- **Description**: Removes a previously registered position update listener

#### requestPositionUpdate()

Triggers position updates for all registered listeners.

- **Parameters**: None
- **Returns**: `void`
- **Description**: Manually triggers position recalculation for all components

### Dropped Items Management

#### registerDroppedItem(draggableId, droppableId, itemData)

Records that an item has been dropped in a specific zone.

- **Parameters**:
  - `draggableId` (`string`): ID of the draggable item
  - `droppableId` (`string`): ID of the drop zone
  - `itemData` (`any`): Data associated with the dropped item
- **Returns**: `void`
- **Description**: Registers a successful drop operation

#### unregisterDroppedItem(draggableId)

Removes a dropped item from the registry.

- **Parameters**:
  - `draggableId` (`string`): ID of the draggable item to remove
- **Returns**: `void`
- **Description**: Unregisters a previously dropped item

#### getDroppedItems()

Returns the current mapping of dropped items.

- **Parameters**: None
- **Returns**: `DroppedItemsMap<any>`
- **Description**: Gets all currently dropped items and their locations

### Capacity Management

#### hasAvailableCapacity(droppableId)

Checks if a drop zone has available capacity.

- **Parameters**:
  - `droppableId` (`string`): ID of the drop zone to check
- **Returns**: `boolean`
- **Description**: Returns true if the drop zone can accept more items

## Type Definitions

### DropSlot

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

- `id`: Unique string identifier for the drop zone
- `x`: X coordinate of the drop zone
- `y`: Y coordinate of the drop zone
- `width`: Width of the drop zone
- `height`: Height of the drop zone
- `onDrop`: Callback function called when an item is dropped
- `dropAlignment`: Optional alignment configuration for dropped items
- `dropOffset`: Optional offset configuration for dropped items
- `capacity`: Optional maximum number of items the zone can hold

### DropAlignment

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

### DropOffset

```tsx
interface DropOffset {
  x: number;
  y: number;
}
```

### PositionUpdateListener

```tsx
type PositionUpdateListener = () => void;
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

## Usage Examples

### Accessing the Context

```tsx
import { useContext } from "react";
import { SlotsContext } from "react-native-reanimated-dnd";

function MyComponent() {
  const context = useContext(SlotsContext);

  if (!context) {
    throw new Error("Component must be used within a DropProvider");
  }

  return <View />;
}
```

### Custom Hook

```tsx
import { useContext } from "react";
import { SlotsContext } from "react-native-reanimated-dnd";

function useDragDropContext() {
  const context = useContext(SlotsContext);

  if (!context) {
    throw new Error("useDragDropContext must be used within a DropProvider");
  }

  return context;
}
```

### Registering a Drop Zone

```tsx
function CustomDroppable({ onDrop, children }) {
  const context = useDragDropContext();
  const viewRef = useRef<View>(null);
  const slotId = useRef(Math.random());

  useEffect(() => {
    const measureAndRegister = () => {
      viewRef.current?.measure((x, y, width, height, pageX, pageY) => {
        context.register(slotId.current, {
          id: "custom-drop-zone",
          x: pageX,
          y: pageY,
          width,
          height,
          onDrop,
          dropAlignment: "center",
          capacity: 5,
        });
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

### Monitoring Active State

```tsx
function ActiveStateMonitor() {
  const { activeHoverSlotId, getSlots } = useDragDropContext();

  const activeSlot = useMemo(() => {
    if (!activeHoverSlotId) return null;
    const slots = getSlots();
    return slots[activeHoverSlotId] || null;
  }, [activeHoverSlotId, getSlots]);

  return (
    <View>
      {activeSlot ? (
        <Text>Active Zone: {activeSlot.id}</Text>
      ) : (
        <Text>No active zone</Text>
      )}
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
    };

    registerPositionUpdateListener(listenerId.current, handlePositionUpdate);

    return () => {
      unregisterPositionUpdateListener(listenerId.current);
    };
  }, [registerPositionUpdateListener, unregisterPositionUpdateListener]);

  return <View />;
}
```

### Dropped Items Tracking

```tsx
function DroppedItemsTracker() {
  const { getDroppedItems } = useDragDropContext();
  const [droppedItems, setDroppedItems] = useState({});

  useEffect(() => {
    const updateDroppedItems = () => {
      setDroppedItems(getDroppedItems());
    };

    const interval = setInterval(updateDroppedItems, 1000);
    return () => clearInterval(interval);
  }, [getDroppedItems]);

  return (
    <View>
      <Text>Dropped Items: {Object.keys(droppedItems).length}</Text>
      {Object.entries(droppedItems).map(([id, { droppableId, data }]) => (
        <Text key={id}>
          {data.name} → {droppableId}
        </Text>
      ))}
    </View>
  );
}
```

### Capacity Checking

```tsx
function CapacityChecker({ droppableId }) {
  const { hasAvailableCapacity } = useDragDropContext();
  const [canAcceptDrop, setCanAcceptDrop] = useState(true);

  useEffect(() => {
    const checkCapacity = () => {
      setCanAcceptDrop(hasAvailableCapacity(droppableId));
    };

    checkCapacity();
    const interval = setInterval(checkCapacity, 500);
    return () => clearInterval(interval);
  }, [droppableId, hasAvailableCapacity]);

  return (
    <View
      style={[
        styles.indicator,
        { backgroundColor: canAcceptDrop ? "green" : "red" },
      ]}
    >
      <Text>{canAcceptDrop ? "Available" : "Full"}</Text>
    </View>
  );
}
```

## Error Handling

### Context Validation

```tsx
function validateContext(
  context: SlotsContextValue | null
): asserts context is SlotsContextValue {
  if (!context) {
    throw new Error(
      "DragDropContext not found. Make sure your component is wrapped in a DropProvider."
    );
  }
}
```

### Safe Context Access

```tsx
function SafeContextConsumer() {
  const context = useContext(SlotsContext);

  try {
    validateContext(context);

    // Safe to use context methods
    const slots = context.getSlots();

    return <View>{/* Your component */}</View>;
  } catch (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error.message}</Text>
      </View>
    );
  }
}
```

## Performance Considerations

- Context reads should be minimized and cached when possible
- Position updates are automatically throttled
- Listeners are cleaned up automatically on component unmount
- Use `useMemo` and `useCallback` for expensive operations

## TypeScript Support

The context is fully typed with generic support:

```tsx
interface TaskData {
  id: string;
  title: string;
  priority: "low" | "medium" | "high";
}

function TypedComponent() {
  const context = useContext(SlotsContext) as SlotsContextValue<TaskData>;

  // All methods are properly typed
  const droppedItems = context.getDroppedItems();

  return <View />;
}
```

## See Also

- [DropProvider API](./DropProvider) - Provider component API
- [DragDropContext Guide](../../context/DragDropContext) - Comprehensive usage guide
- [useDraggable API](../hooks/useDraggable) - Draggable hook API
- [useDroppable API](../hooks/useDroppable) - Droppable hook API
