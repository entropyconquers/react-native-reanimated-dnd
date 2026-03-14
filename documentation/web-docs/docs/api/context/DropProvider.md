---
title: "DropProvider API"
---

Complete API reference for the `DropProvider` component.

## Import

```tsx
import { DropProvider } from "react-native-reanimated-dnd";
```

## Component Signature

```tsx
const DropProvider = forwardRef<DropProviderRef, DropProviderProps>(
  (props, ref) => React.ReactElement
);
```

## Props

### DropProviderProps

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

#### children

- **Type**: `ReactNode`
- **Required**: Yes
- **Description**: Child components that will have access to the drag-and-drop context

#### onLayoutUpdateComplete

- **Type**: `() => void`
- **Required**: No
- **Description**: Callback fired when layout updates are complete
- **Use Case**: Trigger additional UI updates after position recalculations

#### onDroppedItemsUpdate

- **Type**: `(droppedItems: DroppedItemsMap) => void`
- **Required**: No
- **Description**: Callback fired when the dropped items mapping changes
- **Parameters**:
  - `droppedItems`: Current mapping of draggable IDs to their drop locations

#### onDragging

- **Type**: `(payload: DraggingPayload) => void`
- **Required**: No
- **Description**: Global callback fired during drag operations
- **Parameters**:
  - `payload`: Position and data information for the dragging item

#### onDragStart

- **Type**: `(data: any) => void`
- **Required**: No
- **Description**: Global callback fired when any drag operation starts
- **Parameters**:
  - `data`: The data associated with the draggable item

#### onDragEnd

- **Type**: `(data: any) => void`
- **Required**: No
- **Description**: Global callback fired when any drag operation ends
- **Parameters**:
  - `data`: The data associated with the draggable item

## Ref Interface

### DropProviderRef

```tsx
interface DropProviderRef {
  requestPositionUpdate: () => void;
  getDroppedItems: () => DroppedItemsMap;
}
```

#### requestPositionUpdate()

- **Type**: `() => void`
- **Description**: Manually trigger position updates for all registered components
- **Use Case**: Call after layout changes or when positions may have become stale

#### getDroppedItems()

- **Type**: `() => DroppedItemsMap`
- **Returns**: Object mapping draggable IDs to their drop information
- **Description**: Get the current mapping of dropped items

## Type Definitions

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

## Context Value

The DropProvider creates a context with the following value:

### SlotsContextValue

```tsx
interface SlotsContextValue<TData = unknown> {
  register: (id: number, slot: DropSlot<TData>) => void;
  unregister: (id: number) => void;
  getSlots: () => Record<number, DropSlot<TData>>;
  isRegistered: (id: number) => boolean;
  setActiveHoverSlot: (id: number | null) => void;
  activeHoverSlotId: number | null;
  registerPositionUpdateListener: (
    id: string,
    listener: PositionUpdateListener
  ) => void;
  unregisterPositionUpdateListener: (id: string) => void;
  requestPositionUpdate: () => void;
  registerDroppedItem: (
    draggableId: string,
    droppableId: string,
    itemData: any
  ) => void;
  unregisterDroppedItem: (draggableId: string) => void;
  getDroppedItems: () => DroppedItemsMap<any>;
  hasAvailableCapacity: (droppableId: string) => boolean;
  onDragging?: (payload: DraggingPayload) => void;
  onDragStart?: (data: any) => void;
  onDragEnd?: (data: any) => void;
}
```

## Usage Examples

### Basic Usage

```tsx
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { DropProvider } from "react-native-reanimated-dnd";

function App() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <DropProvider>
        <YourDragDropComponents />
      </DropProvider>
    </GestureHandlerRootView>
  );
}
```

### With Ref

```tsx
import { useRef } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { DropProvider, DropProviderRef } from "react-native-reanimated-dnd";

function App() {
  const dropProviderRef = useRef<DropProviderRef>(null);

  const handleLayoutChange = () => {
    dropProviderRef.current?.requestPositionUpdate();
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <DropProvider ref={dropProviderRef}>
        <ScrollView onLayout={handleLayoutChange}>
          <YourDragDropComponents />
        </ScrollView>
      </DropProvider>
    </GestureHandlerRootView>
  );
}
```

### With All Callbacks

```tsx
import { GestureHandlerRootView } from "react-native-gesture-handler";

function App() {
  const handleDroppedItemsUpdate = (droppedItems: DroppedItemsMap) => {
    console.log("Dropped items updated:", droppedItems);
  };

  const handleDragStart = (data: any) => {
    console.log("Drag started:", data);
  };

  const handleDragEnd = (data: any) => {
    console.log("Drag ended:", data);
  };

  const handleDragging = ({ x, y, tx, ty, itemData }: DraggingPayload) => {
    console.log(`Dragging ${itemData.name} at (${x + tx}, ${y + ty})`);
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
        <YourDragDropComponents />
      </DropProvider>
    </GestureHandlerRootView>
  );
}
```

## Performance Notes

- The provider uses `useMemo` and `useCallback` internally to minimize re-renders
- Position updates are throttled to maintain 60fps performance
- Context value is memoized to prevent unnecessary child re-renders
- Cleanup is handled automatically on unmount

## Error Handling

The DropProvider includes built-in error handling:

- Validates context usage within provider boundaries
- Provides helpful error messages in development
- Gracefully handles missing or invalid props
- Includes TypeScript support for compile-time error checking

## See Also

- [DropProvider Guide](../../context/DropProvider) - Comprehensive usage guide
- [DragDropContext API](./DragDropContext) - Context API reference
- [useDraggable API](../hooks/useDraggable) - Draggable hook API
- [useDroppable API](../hooks/useDroppable) - Droppable hook API
