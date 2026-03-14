---
sidebar_position: 2
---

# DragDropContext

The `DragDropContext` (exported as `SlotsContext`) is the React context that provides the underlying infrastructure for drag-and-drop functionality. It's automatically created by the `DropProvider` and consumed by draggable and droppable components throughout the library.

## Overview

The DragDropContext manages:

- **Drop Zone Registration**: Tracks all registered droppable areas
- **Active State Management**: Monitors which drop zones are currently active
- **Position Updates**: Handles layout changes and position recalculations
- **Dropped Items Tracking**: Maintains state of which items are dropped where
- **Capacity Management**: Enforces drop zone capacity limits
- **Event Coordination**: Coordinates drag events across components

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

### DropSlot Interface

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

## Accessing the Context

### Using useContext Hook

```tsx
import { useContext } from "react";
import { SlotsContext } from "react-native-reanimated-dnd";

function CustomDragComponent() {
  const context = useContext(SlotsContext);

  if (!context) {
    throw new Error("CustomDragComponent must be used within a DropProvider");
  }

  const { getSlots, getDroppedItems, hasAvailableCapacity, activeHoverSlotId } =
    context;

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
import { SlotsContext } from "react-native-reanimated-dnd";

function useDragDropContext() {
  const context = useContext(SlotsContext);

  if (!context) {
    throw new Error("useDragDropContext must be used within a DropProvider");
  }

  return context;
}

// Usage
function MyComponent() {
  const { getDroppedItems, hasAvailableCapacity } = useDragDropContext();

  const droppedItems = getDroppedItems();
  const canDrop = hasAvailableCapacity("my-drop-zone");

  return (
    <View>
      <Text>Items: {Object.keys(droppedItems).length}</Text>
      <Text>Can Drop: {canDrop ? "Yes" : "No"}</Text>
    </View>
  );
}
```

## Context Methods

### Drop Zone Management

#### register(id, slot)

Registers a new drop zone with the context.

```tsx
function CustomDroppable({ children, onDrop }) {
  const context = useDragDropContext();
  const viewRef = useRef<View>(null);
  const slotId = useRef(Math.random());

  useEffect(() => {
    const measureAndRegister = () => {
      viewRef.current?.measure((x, y, width, height, pageX, pageY) => {
        context.register(slotId.current, {
          id: "custom-droppable",
          x: pageX,
          y: pageY,
          width,
          height,
          onDrop,
          dropAlignment: "center",
          capacity: 1,
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

#### unregister(id)

Removes a drop zone from the context.

```tsx
useEffect(() => {
  // Register drop zone
  context.register(slotId, slotData);

  // Cleanup on unmount
  return () => {
    context.unregister(slotId);
  };
}, []);
```

#### getSlots()

Returns all currently registered drop zones.

```tsx
function DropZoneDebugger() {
  const { getSlots } = useDragDropContext();
  const slots = getSlots();

  return (
    <View style={styles.debugger}>
      <Text style={styles.title}>Registered Drop Zones</Text>
      {Object.entries(slots).map(([id, slot]) => (
        <View key={id} style={styles.slotInfo}>
          <Text>ID: {slot.id}</Text>
          <Text>
            Position: ({slot.x}, {slot.y})
          </Text>
          <Text>
            Size: {slot.width}×{slot.height}
          </Text>
          <Text>Capacity: {slot.capacity || "Unlimited"}</Text>
        </View>
      ))}
    </View>
  );
}
```

### Active State Management

#### setActiveHoverSlot(id)

Sets the currently active (hovered) drop zone.

```tsx
function CustomDraggable({ data, children }) {
  const { setActiveHoverSlot, getSlots } = useDragDropContext();

  const handleDragMove = (x: number, y: number) => {
    const slots = getSlots();
    let activeSlot = null;

    // Find which slot the draggable is over
    Object.entries(slots).forEach(([slotId, slot]) => {
      if (
        x >= slot.x &&
        x <= slot.x + slot.width &&
        y >= slot.y &&
        y <= slot.y + slot.height
      ) {
        activeSlot = parseInt(slotId);
      }
    });

    setActiveHoverSlot(activeSlot);
  };

  return (
    <GestureDetector gesture={handleDragMove}>
      {children}
    </GestureDetector>
  );
}
```

### Position Updates

#### registerPositionUpdateListener(id, listener)

Registers a listener for position updates.

```tsx
function ResponsiveDroppable({ children }) {
  const { registerPositionUpdateListener, unregisterPositionUpdateListener } =
    useDragDropContext();
  const listenerId = useRef(`listener-${Math.random()}`);

  useEffect(() => {
    const updatePosition = () => {
      // Re-measure and update position
      measureAndUpdatePosition();
    };

    registerPositionUpdateListener(listenerId.current, updatePosition);

    return () => {
      unregisterPositionUpdateListener(listenerId.current);
    };
  }, []);

  return <View>{children}</View>;
}
```

#### requestPositionUpdate()

Triggers position updates for all registered listeners.

```tsx
function LayoutChangeHandler() {
  const { requestPositionUpdate } = useDragDropContext();

  const handleLayoutChange = useCallback(() => {
    // Trigger position updates after layout changes
    requestPositionUpdate();
  }, [requestPositionUpdate]);

  return <ScrollView onLayout={handleLayoutChange}>{/* Content */}</ScrollView>;
}
```

### Dropped Items Management

#### registerDroppedItem(draggableId, droppableId, itemData)

Records that an item has been dropped in a specific zone.

```tsx
function CustomDropHandler() {
  const { registerDroppedItem } = useDragDropContext();

  const handleDrop = (draggableData, droppableId) => {
    // Register the drop
    registerDroppedItem(draggableData.id, droppableId, draggableData);

    // Handle the drop in your app logic
    moveItemToZone(draggableData, droppableId);
  };

  return <DropZone onDrop={handleDrop} />;
}
```

#### getDroppedItems()

Returns the current mapping of dropped items.

```tsx
function DroppedItemsDisplay() {
  const { getDroppedItems } = useDragDropContext();
  const droppedItems = getDroppedItems();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dropped Items</Text>
      {Object.entries(droppedItems).map(
        ([draggableId, { droppableId, data }]) => (
          <View key={draggableId} style={styles.item}>
            <Text>Item: {data.name}</Text>
            <Text>Zone: {droppableId}</Text>
          </View>
        )
      )}
    </View>
  );
}
```

### Capacity Management

#### hasAvailableCapacity(droppableId)

Checks if a drop zone has available capacity.

```tsx
function CapacityAwareDropZone({ droppableId, maxItems, children }) {
  const { hasAvailableCapacity } = useDragDropContext();
  const [canAcceptDrop, setCanAcceptDrop] = useState(true);

  useEffect(() => {
    const checkCapacity = () => {
      const hasCapacity = hasAvailableCapacity(droppableId);
      setCanAcceptDrop(hasCapacity);
    };

    // Check capacity periodically or on context changes
    checkCapacity();
  }, [droppableId, hasAvailableCapacity]);

  return (
    <View style={[styles.dropZone, !canAcceptDrop && styles.fullDropZone]}>
      {children}
      {!canAcceptDrop && <Text style={styles.fullText}>Zone Full</Text>}
    </View>
  );
}
```

## Advanced Usage Examples

### Real-time Drop Zone Visualization

```tsx
function DropZoneVisualizer() {
  const { getSlots, activeHoverSlotId } = useDragDropContext();
  const [slots, setSlots] = useState({});

  useEffect(() => {
    const updateSlots = () => {
      setSlots(getSlots());
    };

    // Update slots periodically
    const interval = setInterval(updateSlots, 100);
    return () => clearInterval(interval);
  }, [getSlots]);

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {Object.entries(slots).map(([id, slot]) => (
        <View
          key={id}
          style={[
            styles.slotOverlay,
            {
              left: slot.x,
              top: slot.y,
              width: slot.width,
              height: slot.height,
            },
            parseInt(id) === activeHoverSlotId && styles.activeSlotOverlay,
          ]}
        >
          <Text style={styles.slotLabel}>{slot.id}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  slotOverlay: {
    position: "absolute",
    borderWidth: 2,
    borderColor: "rgba(59, 130, 246, 0.5)",
    borderStyle: "dashed",
    backgroundColor: "rgba(59, 130, 246, 0.1)",
  },
  activeSlotOverlay: {
    borderColor: "rgba(34, 197, 94, 0.8)",
    backgroundColor: "rgba(34, 197, 94, 0.2)",
  },
  slotLabel: {
    fontSize: 10,
    color: "#3b82f6",
    fontWeight: "bold",
    padding: 2,
  },
});
```

### Context-Aware Analytics

```tsx
function DragDropAnalytics() {
  const context = useDragDropContext();
  const [analytics, setAnalytics] = useState({
    totalSlots: 0,
    totalDroppedItems: 0,
    activeSlots: 0,
    capacityUtilization: 0,
  });

  useEffect(() => {
    const updateAnalytics = () => {
      const slots = context.getSlots();
      const droppedItems = context.getDroppedItems();

      const totalSlots = Object.keys(slots).length;
      const totalDroppedItems = Object.keys(droppedItems).length;
      const activeSlots = context.activeHoverSlotId ? 1 : 0;

      // Calculate capacity utilization
      const totalCapacity = Object.values(slots).reduce(
        (sum, slot) => sum + (slot.capacity || 1),
        0
      );
      const capacityUtilization =
        totalCapacity > 0 ? (totalDroppedItems / totalCapacity) * 100 : 0;

      setAnalytics({
        totalSlots,
        totalDroppedItems,
        activeSlots,
        capacityUtilization,
      });
    };

    const interval = setInterval(updateAnalytics, 1000);
    return () => clearInterval(interval);
  }, [context]);

  return (
    <View style={styles.analyticsPanel}>
      <Text style={styles.analyticsTitle}>Drag & Drop Analytics</Text>
      <Text>Total Drop Zones: {analytics.totalSlots}</Text>
      <Text>Dropped Items: {analytics.totalDroppedItems}</Text>
      <Text>Active Zones: {analytics.activeSlots}</Text>
      <Text>Capacity Usage: {analytics.capacityUtilization.toFixed(1)}%</Text>
    </View>
  );
}
```

### Custom Collision Detection

```tsx
function CustomCollisionDetector() {
  const { getSlots, setActiveHoverSlot } = useDragDropContext();

  const detectCollision = useCallback(
    (dragX: number, dragY: number, dragWidth: number, dragHeight: number) => {
      const slots = getSlots();
      let collisionSlotId = null;

      Object.entries(slots).forEach(([id, slot]) => {
        // Custom collision algorithm - center point must be within slot
        const dragCenterX = dragX + dragWidth / 2;
        const dragCenterY = dragY + dragHeight / 2;

        if (
          dragCenterX >= slot.x &&
          dragCenterX <= slot.x + slot.width &&
          dragCenterY >= slot.y &&
          dragCenterY <= slot.y + slot.height
        ) {
          collisionSlotId = parseInt(id);
        }
      });

      setActiveHoverSlot(collisionSlotId);
      return collisionSlotId;
    },
    [getSlots, setActiveHoverSlot]
  );

  return { detectCollision };
}
```

### Context State Synchronization

```tsx
function ContextStateSyncer() {
  const context = useDragDropContext();
  const [globalState, setGlobalState] = useGlobalState();

  // Sync dropped items with global state
  useEffect(() => {
    const syncDroppedItems = () => {
      const droppedItems = context.getDroppedItems();
      setGlobalState((prev) => ({
        ...prev,
        droppedItems,
      }));
    };

    const interval = setInterval(syncDroppedItems, 500);
    return () => clearInterval(interval);
  }, [context, setGlobalState]);

  // Sync slots with global state
  useEffect(() => {
    const syncSlots = () => {
      const slots = context.getSlots();
      setGlobalState((prev) => ({
        ...prev,
        availableSlots: Object.keys(slots).length,
        activeSlot: context.activeHoverSlotId,
      }));
    };

    const interval = setInterval(syncSlots, 1000);
    return () => clearInterval(interval);
  }, [context, setGlobalState]);

  return null; // This component only handles synchronization
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

1. **Minimize Context Reads**: Cache context values when possible
2. **Throttle Updates**: Limit frequency of position updates
3. **Selective Subscriptions**: Only subscribe to needed context changes
4. **Memory Management**: Clean up listeners and registrations

```tsx
function OptimizedContextConsumer() {
  const context = useDragDropContext();

  // Cache frequently accessed values
  const slots = useMemo(() => context.getSlots(), [context]);
  const droppedItems = useMemo(() => context.getDroppedItems(), [context]);

  // Throttle expensive operations
  const throttledPositionUpdate = useMemo(
    () => throttle(context.requestPositionUpdate, 100),
    [context.requestPositionUpdate]
  );

  return <View>{/* Your component */}</View>;
}
```

## TypeScript Support

The context is fully typed with generic support:

```tsx
interface CustomData {
  id: string;
  name: string;
  type: "task" | "file" | "note";
}

function TypedContextConsumer() {
  const context = useContext(SlotsContext) as SlotsContextValue<CustomData>;

  const droppedItems = context.getDroppedItems();

  // droppedItems is typed with CustomData
  Object.entries(droppedItems).forEach(([id, { data }]) => {
    // data is typed as CustomData
    console.log(`${data.type}: ${data.name}`);
  });

  return <View />;
}
```

## See Also

- [DropProvider](./DropProvider) - The provider component that creates this context
- [useDraggable Hook](../hooks/useDraggable) - Hook that consumes this context
- [useDroppable Hook](../hooks/useDroppable) - Hook that consumes this context
- [Basic Concepts](../getting-started/basic-concepts) - Understanding the fundamentals
