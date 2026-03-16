---
name: reanimated-dnd
description: "Integrate react-native-reanimated-dnd for drag-and-drop, sortable lists, sortable grids, and drop zones in React Native apps. Covers components, hooks, and all configuration options."
autoInvoke: true
priority: high
triggers:
  - "drag and drop"
  - "drag drop"
  - "dnd"
  - "sortable"
  - "sortable list"
  - "sortable grid"
  - "reorder"
  - "reorderable"
  - "draggable"
  - "droppable"
  - "drop zone"
  - "react-native-reanimated-dnd"
  - "reanimated dnd"
  - "drag handle"
  - "sortable items"
  - "grid reorder"
allowed-tools: Read, Grep, Glob, Edit, Write, Bash
model: sonnet
---

# react-native-reanimated-dnd Integration Skill

**Version:** 2.0.0
**Category:** UI / Drag and Drop
**Platform:** React Native (requires react-native-reanimated >=4.2.0, react-native-gesture-handler >=2.28.0, react-native-worklets >=0.7.0)

---

## Overview

`react-native-reanimated-dnd` provides performant drag-and-drop primitives for React Native. It offers both high-level components and low-level hooks for:

- **Drag & Drop**: Move items between drop zones
- **Sortable Lists**: Vertical and horizontal reorderable lists
- **Sortable Grids**: 2D grids with insert or swap reordering
- **Constraints**: Axis locking, bounded dragging, collision detection
- **Dynamic Heights**: Auto-measuring variable-height items in lists

All animations run on the UI thread via Reanimated worklets.

---

## Installation

```bash
npm install react-native-reanimated-dnd
# or
yarn add react-native-reanimated-dnd
```

### Peer dependencies (must be installed separately)

```bash
npm install react-native-reanimated react-native-gesture-handler react-native-worklets
```

### Required setup

Wrap your app root with `GestureHandlerRootView`:

```tsx
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/* Your app content */}
    </GestureHandlerRootView>
  );
}
```

---

## Core Architecture

```
DropProvider (context - required for Draggable/Droppable)
├── Draggable (items that can be picked up)
│   └── Draggable.Handle (optional restricted drag area)
└── Droppable (zones that accept drops)

Sortable (self-contained vertical/horizontal list)
├── SortableItem (individual reorderable item)
│   └── SortableItem.Handle (optional restricted drag area)

SortableGrid (self-contained 2D grid)
├── SortableGridItem (individual grid cell)
│   └── SortableGridItem.Handle (optional restricted drag area)
```

**Key rule**: All data items MUST have an `id: string` property for tracking.

---

## Pattern 1: Basic Drag & Drop

Use `DropProvider` + `Draggable` + `Droppable` to move items into drop zones.

```tsx
import {
  DropProvider,
  Draggable,
  Droppable,
} from 'react-native-reanimated-dnd';

function DragDropExample() {
  const [droppedItem, setDroppedItem] = useState<string | null>(null);

  return (
    <DropProvider>
      <View style={styles.items}>
        <Draggable data={{ id: '1', label: 'Item A' }}>
          <View style={styles.item}>
            <Text>Item A</Text>
          </View>
        </Draggable>

        <Draggable data={{ id: '2', label: 'Item B' }}>
          <View style={styles.item}>
            <Text>Item B</Text>
          </View>
        </Draggable>
      </View>

      <Droppable onDrop={(data) => setDroppedItem(data.label)}>
        <View style={styles.dropZone}>
          <Text>{droppedItem ?? 'Drop here'}</Text>
        </View>
      </Droppable>
    </DropProvider>
  );
}
```

### Draggable Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `TData` | required | Payload passed to drop handlers |
| `draggableId` | `string` | auto | Unique identifier |
| `dragDisabled` | `boolean` | `false` | Disable dragging |
| `preDragDelay` | `number` | `0` | Delay in ms before drag starts |
| `dragAxis` | `"x" \| "y" \| "both"` | `"both"` | Constrain movement axis |
| `dragBoundsRef` | `RefObject<View>` | - | Constrain within a view |
| `collisionAlgorithm` | `"center" \| "intersect" \| "contain"` | `"intersect"` | How to detect overlap with droppables |
| `animationFunction` | `(toValue: number) => number` | - | Custom return animation |
| `onDragStart` | `(data: TData) => void` | - | Called when drag begins |
| `onDragEnd` | `(data: TData) => void` | - | Called when drag ends |
| `onDragging` | `({ x, y, tx, ty, itemData }) => void` | - | Real-time position updates |
| `onStateChange` | `(state: DraggableState) => void` | - | State transition callback |

### Droppable Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onDrop` | `(data: TData) => void` | required | Handle dropped items |
| `dropDisabled` | `boolean` | `false` | Disable dropping |
| `capacity` | `number` | `1` | Max items allowed |
| `dropAlignment` | `DropAlignment` | `"center"` | Position alignment for dropped items |
| `dropOffset` | `{ x: number, y: number }` | - | Fine-tune position after alignment |
| `activeStyle` | `StyleProp<ViewStyle>` | - | Style applied when item hovers over |
| `onActiveChange` | `(isActive: boolean) => void` | - | Called when hover state changes |
| `droppableId` | `string` | auto | Unique identifier for the drop zone |

### DropProvider Props

| Prop | Type | Description |
|------|------|-------------|
| `onDroppedItemsUpdate` | `(items: DroppedItemsMap) => void` | Track items across all zones |
| `onDragging` | `({ x, y, tx, ty, itemData }) => void` | Global drag position tracking |
| `onDragStart` | `(data) => void` | Any drag begins |
| `onDragEnd` | `(data) => void` | Any drag ends |
| `onLayoutUpdateComplete` | `() => void` | Called when layout updates finish |

### DropAlignment values
`"center"` | `"top-left"` | `"top-center"` | `"top-right"` | `"center-left"` | `"center-right"` | `"bottom-left"` | `"bottom-center"` | `"bottom-right"`

---

## Pattern 2: Drag Handles

Restrict the draggable area to a specific handle region using `Draggable.Handle`:

```tsx
<Draggable data={{ id: '1', label: 'Card' }}>
  <View style={styles.card}>
    <Draggable.Handle>
      <View style={styles.handleBar}>
        <Text>Drag here</Text>
      </View>
    </Draggable.Handle>
    <View style={styles.cardContent}>
      <Text>This area does NOT initiate drag</Text>
    </View>
  </View>
</Draggable>
```

The same pattern works for sortable items with `SortableItem.Handle`.

---

## Pattern 3: Vertical Sortable List

Use the `Sortable` component for a reorderable list:

```tsx
import { Sortable, SortableItem } from 'react-native-reanimated-dnd';

interface Item {
  id: string;
  title: string;
}

const ITEM_HEIGHT = 60;

function SortableListExample() {
  const [items, setItems] = useState<Item[]>([
    { id: '1', title: 'First' },
    { id: '2', title: 'Second' },
    { id: '3', title: 'Third' },
  ]);

  const renderItem = useCallback(({ item, ...props }) => (
    <SortableItem
      key={item.id}
      id={item.id}
      data={item}
      onMove={(id, from, to) => {
        setItems(prev => {
          const next = [...prev];
          const [moved] = next.splice(from, 1);
          next.splice(to, 0, moved);
          return next;
        });
      }}
      {...props}
    >
      <View style={styles.listItem}>
        <Text>{item.title}</Text>
      </View>
    </SortableItem>
  ), []);

  return (
    <Sortable
      data={items}
      renderItem={renderItem}
      itemHeight={ITEM_HEIGHT}
    />
  );
}
```

### Sortable Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `TData[]` | required | Items (each must have `id: string`) |
| `renderItem` | `(props) => ReactNode` | required | Item renderer |
| `direction` | `"vertical" \| "horizontal"` | `"vertical"` | List direction |
| `itemHeight` | `number \| number[] \| (item, i) => number` | - | Item height (required for vertical) |
| `itemWidth` | `number` | - | Item width (required for horizontal) |
| `gap` | `number` | `0` | Gap between items (horizontal only) |
| `paddingHorizontal` | `number` | `0` | Container padding (horizontal only) |
| `enableDynamicHeights` | `boolean` | `false` | Auto-measure item heights |
| `estimatedItemHeight` | `number` | `60` | Fallback height for unmeasured items |
| `onHeightsMeasured` | `(heights) => void` | - | Called with measured heights |
| `useFlatList` | `boolean` | `true` | Use FlatList for virtualization |
| `itemKeyExtractor` | `(item, index) => string` | `item.id` | Custom key extraction function |
| `style` | `StyleProp<ViewStyle>` | - | ScrollView/FlatList style |
| `contentContainerStyle` | `StyleProp<ViewStyle>` | - | Content container style |

### SortableItem Props

| Prop | Type | Description |
|------|------|-------------|
| `id` | `string` | Unique item identifier |
| `data` | `T` | Item data |
| `onMove` | `(id, from, to) => void` | Called on position change |
| `onDragStart` | `(id, position) => void` | Drag started |
| `onDrop` | `(id, position, allPositions?) => void` | Item dropped |
| `onDragging` | `(id, overItemId, yPosition) => void` | Real-time drag position |
| `style` | `StyleProp<ViewStyle>` | Container style |
| `animatedStyle` | `StyleProp<ViewStyle>` | Animated style |

---

## Pattern 4: Horizontal Sortable List

```tsx
import {
  Sortable,
  SortableItem,
  SortableDirection,
} from 'react-native-reanimated-dnd';

const ITEM_WIDTH = 120;

function HorizontalSortableExample() {
  const [items, setItems] = useState([
    { id: '1', label: 'Tag A' },
    { id: '2', label: 'Tag B' },
    { id: '3', label: 'Tag C' },
  ]);

  const renderItem = useCallback(({ item, ...props }) => (
    <SortableItem
      key={item.id}
      id={item.id}
      data={item}
      onMove={(id, from, to) => {
        setItems(prev => {
          const next = [...prev];
          const [moved] = next.splice(from, 1);
          next.splice(to, 0, moved);
          return next;
        });
      }}
      {...props}
    >
      <View style={styles.tag}>
        <Text>{item.label}</Text>
      </View>
    </SortableItem>
  ), []);

  return (
    <Sortable
      data={items}
      renderItem={renderItem}
      direction={SortableDirection.Horizontal}
      itemWidth={ITEM_WIDTH}
      gap={12}
      paddingHorizontal={12}
    />
  );
}
```

---

## Pattern 5: Sortable Grid

```tsx
import {
  SortableGrid,
  SortableGridItem,
  GridOrientation,
  GridStrategy,
} from 'react-native-reanimated-dnd';

function GridExample() {
  const [items, setItems] = useState([
    { id: '1', label: 'A' },
    { id: '2', label: 'B' },
    { id: '3', label: 'C' },
    { id: '4', label: 'D' },
    { id: '5', label: 'E' },
    { id: '6', label: 'F' },
  ]);

  const renderItem = useCallback(({ item, ...props }) => (
    <SortableGridItem
      key={item.id}
      id={item.id}
      data={item}
      onMove={(id, from, to) => {
        setItems(prev => {
          const next = [...prev];
          const [moved] = next.splice(from, 1);
          next.splice(to, 0, moved);
          return next;
        });
      }}
      {...props}
    >
      <View style={styles.gridCell}>
        <Text>{item.label}</Text>
      </View>
    </SortableGridItem>
  ), []);

  return (
    <SortableGrid
      data={items}
      renderItem={renderItem}
      dimensions={{
        columns: 3,
        itemWidth: 100,
        itemHeight: 100,
        rowGap: 8,
        columnGap: 8,
      }}
      orientation={GridOrientation.Vertical}
      strategy={GridStrategy.Insert}
    />
  );
}
```

### SortableGrid Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `TData[]` | required | Grid items (each must have `id: string`) |
| `renderItem` | `(props) => ReactNode` | required | Item renderer |
| `dimensions` | `GridDimensions` | required | Grid configuration (see below) |
| `orientation` | `"vertical" \| "horizontal"` | `"vertical"` | Grid orientation |
| `strategy` | `"insert" \| "swap"` | `"insert"` | How items reorder: insert shifts others, swap exchanges two |
| `scrollEnabled` | `boolean` | `true` | Enable scrolling |
| `itemKeyExtractor` | `(item, index) => string` | `item.id` | Custom key extraction |
| `style` | `StyleProp<ViewStyle>` | - | ScrollView style |
| `contentContainerStyle` | `StyleProp<ViewStyle>` | - | Content style |

### GridDimensions

| Prop | Type | Description |
|------|------|-------------|
| `columns` | `number` | Columns (vertical orientation) |
| `rows` | `number` | Rows (horizontal orientation) |
| `itemWidth` | `number` | Item width |
| `itemHeight` | `number` | Item height |
| `rowGap` | `number` | Gap between rows |
| `columnGap` | `number` | Gap between columns |

### SortableGridItem Props

| Prop | Type | Description |
|------|------|-------------|
| `id` | `string` | Unique identifier |
| `data` | `T` | Item data |
| `activationDelay` | `number` | Delay in ms before drag starts |
| `onMove` | `(id, from, to) => void` | Position changed |
| `onDragStart` | `(id, position) => void` | Drag started |
| `onDrop` | `(id, position, allPositions?) => void` | Item dropped |
| `onDragging` | `(id, overItemId, x, y) => void` | Real-time position |
| `isBeingRemoved` | `boolean` | Trigger removal animation |
| `style` | `StyleProp<ViewStyle>` | Container style |
| `animatedStyle` | `StyleProp<ViewStyle>` | Animated style |

---

## Pattern 6: Dynamic Heights

For lists where items have variable heights:

```tsx
<Sortable
  data={items}
  renderItem={renderItem}
  enableDynamicHeights
  estimatedItemHeight={80}
  onHeightsMeasured={(heights) => {
    // { [id]: measuredHeight }
  }}
/>
```

Or provide explicit heights per item:

```tsx
<Sortable
  data={items}
  renderItem={renderItem}
  itemHeight={(item, index) => item.expanded ? 120 : 60}
/>

// Or as an array:
<Sortable
  data={items}
  renderItem={renderItem}
  itemHeight={[60, 80, 120, 60, 100]}
/>
```

---

## Pattern 7: Axis Constraints

Lock dragging to a single axis:

```tsx
// Horizontal only
<Draggable data={data} dragAxis="x">
  <View>{/* content */}</View>
</Draggable>

// Vertical only
<Draggable data={data} dragAxis="y">
  <View>{/* content */}</View>
</Draggable>
```

---

## Pattern 8: Bounded Dragging

Constrain dragging within a container:

```tsx
function BoundedExample() {
  const boundsRef = useRef<View>(null);

  return (
    <DropProvider>
      <View ref={boundsRef} style={styles.boundary}>
        <Draggable data={{ id: '1' }} dragBoundsRef={boundsRef}>
          <View style={styles.item}>
            <Text>Cannot escape boundary</Text>
          </View>
        </Draggable>
      </View>
    </DropProvider>
  );
}
```

Combine with axis constraints:

```tsx
<Draggable data={data} dragBoundsRef={boundsRef} dragAxis="y">
  {/* Vertical movement only, within bounds */}
</Draggable>
```

---

## Pattern 9: Collision Detection

Three algorithms control when a draggable "activates" a droppable:

```tsx
// Default: any overlap triggers
<Draggable data={data} collisionAlgorithm="intersect">

// Center point must be over the droppable
<Draggable data={data} collisionAlgorithm="center">

// Entire draggable must be inside the droppable
<Draggable data={data} collisionAlgorithm="contain">
```

---

## Pattern 10: Drop Zone Capacity

Limit how many items a zone accepts:

```tsx
<Droppable onDrop={handleDrop} capacity={1}>
  {/* Accepts exactly one item */}
</Droppable>

<Droppable onDrop={handleDrop} capacity={3}>
  {/* Accepts up to three items */}
</Droppable>

<Droppable onDrop={handleDrop} capacity={Infinity}>
  {/* Unlimited */}
</Droppable>
```

---

## Pattern 11: Tracking Items Across Zones

Use `DropProvider.onDroppedItemsUpdate` to track which items are in which zones:

```tsx
<DropProvider
  onDroppedItemsUpdate={(droppedItems) => {
    // droppedItems is: { [draggableId]: { droppableId, data } }
    setMapping(droppedItems);
  }}
>
  {/* Draggables and Droppables */}
</DropProvider>
```

Access programmatically via ref:

```tsx
const providerRef = useRef<DropProviderRef>(null);

<DropProvider ref={providerRef}>
  {/* ... */}
</DropProvider>

// Later:
const items = providerRef.current?.getDroppedItems();
providerRef.current?.requestPositionUpdate();
```

---

## Pattern 12: Active Styles on Drop Zones

Visual feedback when an item hovers over a drop zone:

```tsx
<Droppable
  onDrop={handleDrop}
  activeStyle={{
    borderColor: 'blue',
    borderWidth: 2,
    backgroundColor: 'rgba(0, 0, 255, 0.1)',
  }}
  onActiveChange={(isActive) => {
    // true when item is hovering, false when it leaves
  }}
>
  <View style={styles.zone}>
    <Text>Drop Zone</Text>
  </View>
</Droppable>
```

---

## Pattern 13: Custom Animation

Provide a custom animation for when items snap back or into place:

```tsx
import { withSpring, withTiming, Easing } from 'react-native-reanimated';

// Spring animation
<Draggable
  data={data}
  animationFunction={(toValue) =>
    withSpring(toValue, { damping: 15, stiffness: 150 })
  }
>

// Timing animation with easing
<Draggable
  data={data}
  animationFunction={(toValue) =>
    withTiming(toValue, { duration: 300, easing: Easing.bezier(0.25, 0.1, 0.25, 1) })
  }
>
```

---

## Pattern 14: Drag State Tracking

Monitor drag lifecycle:

```tsx
import { DraggableState } from 'react-native-reanimated-dnd';

<Draggable
  data={data}
  onStateChange={(state) => {
    // DraggableState.IDLE | DraggableState.DRAGGING | DraggableState.DROPPED
  }}
  onDragStart={(data) => { /* drag began */ }}
  onDragEnd={(data) => { /* drag ended */ }}
  onDragging={({ x, y, tx, ty, itemData }) => {
    // real-time position while dragging
  }}
>
```

---

## Hooks API (Low-Level)

For full control, use hooks instead of components:

### useDraggable

```tsx
import { useDraggable } from 'react-native-reanimated-dnd';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';

function CustomDraggable({ data }) {
  const {
    animatedViewProps,  // { style, onLayout }
    gesture,            // pan gesture
    state,              // DraggableState
  } = useDraggable({
    data,
    onDragStart: (d) => {},
    onDragEnd: (d) => {},
    collisionAlgorithm: 'intersect',
  });

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View {...animatedViewProps}>
        <Text>Custom Draggable</Text>
      </Animated.View>
    </GestureDetector>
  );
}
```

### useDroppable

```tsx
import { useDroppable } from 'react-native-reanimated-dnd';

function CustomDropZone() {
  const {
    viewProps,   // { onLayout, style? }
    isActive,    // boolean
  } = useDroppable({
    onDrop: (data) => {},
    capacity: 1,
    activeStyle: { borderColor: 'green' },
  });

  return (
    <Animated.View {...viewProps}>
      <Text>{isActive ? 'Release to drop' : 'Drop here'}</Text>
    </Animated.View>
  );
}
```

### useSortableList + useSortable

For custom sortable list implementations:

```tsx
import { useSortableList, useSortable } from 'react-native-reanimated-dnd';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';

function CustomSortableList({ data }) {
  const {
    positions,
    scrollY,
    autoScroll,
    scrollViewRef,
    handleScroll,
    handleScrollEnd,
    contentHeight,
    getItemProps,
  } = useSortableList({ data, itemHeight: 60 });

  return (
    <Animated.ScrollView
      ref={scrollViewRef}
      onScroll={handleScroll}
      onMomentumScrollEnd={handleScrollEnd}
      style={{ height: 400 }}
      contentContainerStyle={{ height: contentHeight }}
    >
      {data.map((item, index) => (
        <CustomSortableItem
          key={item.id}
          item={item}
          {...getItemProps(item, index)}
        />
      ))}
    </Animated.ScrollView>
  );
}

function CustomSortableItem({ item, ...sortableProps }) {
  const {
    animatedStyle,
    panGestureHandler,
  } = useSortable({
    ...sortableProps,
    onMove: (id, from, to) => {},
  });

  return (
    <GestureDetector gesture={panGestureHandler}>
      <Animated.View style={animatedStyle}>
        <Text>{item.title}</Text>
      </Animated.View>
    </GestureDetector>
  );
}
```

### useHorizontalSortableList + useHorizontalSortable

Same pattern as vertical, but for horizontal lists:

```tsx
import {
  useHorizontalSortableList,
  useHorizontalSortable,
} from 'react-native-reanimated-dnd';

const {
  positions,
  scrollX,
  autoScroll,
  scrollViewRef,
  handleScroll,
  handleScrollEnd,
  contentWidth,
  getItemProps,
} = useHorizontalSortableList({
  data,
  itemWidth: 120,
  gap: 12,
  paddingHorizontal: 12,
});
```

### useGridSortableList + useGridSortable

For custom grid implementations:

```tsx
import {
  useGridSortableList,
  useGridSortable,
  GridOrientation,
  GridStrategy,
} from 'react-native-reanimated-dnd';

const {
  positions,
  scrollY,
  scrollX,
  autoScrollDirection,
  scrollViewRef,
  handleScroll,
  handleScrollEnd,
  contentWidth,
  contentHeight,
  getItemProps,
} = useGridSortableList({
  data,
  dimensions: { columns: 3, itemWidth: 100, itemHeight: 100 },
  orientation: GridOrientation.Vertical,
  strategy: GridStrategy.Insert,
});
```

---

## Type Reference

```typescript
// All sortable data must have an id
interface SortableData {
  id: string;
}

// Drag state enum
enum DraggableState {
  IDLE = "IDLE",
  DRAGGING = "DRAGGING",
  DROPPED = "DROPPED",
}

// Scroll directions
enum ScrollDirection { None, Up, Down }
enum HorizontalScrollDirection { None, Left, Right }

// List direction
enum SortableDirection { Vertical = "vertical", Horizontal = "horizontal" }

// Grid types
enum GridOrientation { Vertical = "vertical", Horizontal = "horizontal" }
enum GridStrategy { Insert = "insert", Swap = "swap" }
enum GridScrollDirection { None, Up, Down, Left, Right, UpLeft, UpRight, DownLeft, DownRight }

interface GridDimensions {
  columns?: number;
  rows?: number;
  itemWidth: number;
  itemHeight: number;
  rowGap?: number;
  columnGap?: number;
}

interface GridPosition {
  index: number;
  row: number;
  column: number;
  x: number;
  y: number;
}

// Collision detection
type CollisionAlgorithm = "center" | "intersect" | "contain";

// Drop alignment
type DropAlignment =
  | "center" | "top-left" | "top-center" | "top-right"
  | "center-left" | "center-right"
  | "bottom-left" | "bottom-center" | "bottom-right";

// Dropped items tracking
interface DroppedItemsMap<TData = unknown> {
  [draggableId: string]: {
    droppableId: string;
    data: TData;
  };
}

// DropProvider imperative handle
interface DropProviderRef {
  requestPositionUpdate: () => void;
  getDroppedItems: () => DroppedItemsMap;
}

// Grid positions shared value type
interface GridPositions {
  [id: string]: GridPosition;
}
```

---

## Common Recipes

### Sortable list with handles

```tsx
<SortableItem id={item.id} data={item} {...props}>
  <View style={styles.row}>
    <SortableItem.Handle>
      <View style={styles.handle}>
        <Text>|||</Text>
      </View>
    </SortableItem.Handle>
    <Text style={styles.content}>{item.title}</Text>
  </View>
</SortableItem>
```

### Grid with swap reordering

```tsx
<SortableGrid
  data={items}
  renderItem={renderItem}
  dimensions={{ columns: 4, itemWidth: 80, itemHeight: 80 }}
  strategy={GridStrategy.Swap}
/>
```

### Grid item with drag handle

```tsx
<SortableGridItem id={item.id} data={item} {...props}>
  <View style={styles.cell}>
    <SortableGridItem.Handle>
      <View style={styles.handle}>
        <Text>Drag</Text>
      </View>
    </SortableGridItem.Handle>
    <Text>{item.label}</Text>
  </View>
</SortableGridItem>
```

### Grid with activation delay (prevent accidental drags)

```tsx
<SortableGridItem
  id={item.id}
  data={item}
  activationDelay={300}
  {...props}
>
```

### Pre-drag delay on draggable

```tsx
<Draggable data={data} preDragDelay={200}>
  {/* Must hold 200ms before drag activates */}
</Draggable>
```

### Drop alignment with offset

```tsx
<Droppable
  onDrop={handleDrop}
  dropAlignment="top-left"
  dropOffset={{ x: 10, y: 10 }}
>
```

### Dynamically adding items to a sortable list

Items must always have unique `id` fields. Just update the state array:

```tsx
const addItem = () => {
  setItems(prev => [...prev, { id: String(Date.now()), title: 'New Item' }]);
};
```

### Removing items from a grid with animation

```tsx
<SortableGridItem isBeingRemoved={item.removing} {...props}>
```

---

## Gotchas & What NOT To Do

### Data Requirements

1. **Every item MUST have `id: string`** — Missing or undefined IDs cause broken reordering and silent failures. In dev mode you get a `console.error`; in production it silently breaks.
2. **IDs MUST be unique** — Duplicate IDs cause items to share positions. The library maps `id -> index` internally; duplicates overwrite each other.
3. **Do NOT mutate item objects** — Always create new arrays/objects when updating state. The library captures data in gesture closures, so mutating the original object leads to stale data in callbacks.

### Context & Wrapping

4. **Draggable/Droppable REQUIRE a DropProvider ancestor** — Without it, drops silently fail (no crash, no error in production). Always wrap Draggable/Droppable usage in a `<DropProvider>`.
5. **Do NOT wrap Sortable or SortableGrid in DropProvider** — They create their own internal DropProvider. Nesting providers causes broken collision detection.
6. **Do NOT wrap Sortable or SortableGrid in GestureHandlerRootView** — They wrap themselves internally. Double-wrapping causes gesture conflicts. Only use `GestureHandlerRootView` at the app root for Draggable/Droppable patterns.
7. **Handle components MUST be direct descendants of their parent** — `Draggable.Handle` must be inside `Draggable`, `SortableItem.Handle` inside `SortableItem`, `SortableGridItem.Handle` inside `SortableGridItem`. Used outside, they render children but have no drag functionality (with a dev-mode warning).

### Required Props (Will Throw if Missing)

8. **`itemHeight` is required for vertical Sortable** — Either pass a fixed number, an array, a function, or set `enableDynamicHeights={true}`. Missing this throws an error.
9. **`itemWidth` is required for horizontal Sortable** — No dynamic width mode exists. Must be a fixed number.
10. **Grid dimensions must include `itemWidth` + `itemHeight` + `columns` (vertical) or `rows` (horizontal)** — Missing any of these throws an error.

### State Management

11. **`onMove` MUST update your state array** — The library only animates positions visually. If you don't reorder your `data` array in `onMove`, the visual order and data order will diverge.

```tsx
// CORRECT
onMove={(id, from, to) => {
  setItems(prev => {
    const next = [...prev];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    return next;
  });
}}

// WRONG — visual reorder happens but data stays stale
onMove={(id, from, to) => {
  console.log('moved', id, from, to); // not updating state!
}}
```

12. **Do NOT read `data` props inside `onDragStart`/`onDragEnd` from external state** — These callbacks capture `data` at gesture creation time. If the data object changes between gesture creation and callback firing, the callback sees the stale version. Use the `data` argument passed to the callback instead.

13. **Default Droppable capacity is 1, NOT infinite** — If you don't set `capacity`, only one item can be dropped per zone. Set `capacity={Infinity}` for unlimited.

### Animation

14. **`animationFunction` MUST return a Reanimated animation value** — It runs on the UI thread via worklets. Always return `withSpring`, `withTiming`, or another Reanimated animation. Returning a plain number skips the animation entirely (the item snaps instantly with no transition).

```tsx
// CORRECT — returns a Reanimated animation
animationFunction={(toValue) => withSpring(toValue, { damping: 15 })}

// CORRECT — timing with easing
animationFunction={(toValue) => withTiming(toValue, { duration: 200 })}

// BAD — returns plain number, item snaps with no animation
animationFunction={(toValue) => toValue}
```

15. **Default animation is `withSpring` (bouncy)** — Items bounce back to position by default. If you want a snappy feel, provide `withTiming`:

```tsx
animationFunction={(toValue) => withTiming(toValue, { duration: 200 })}
```

16. **`activeStyle` on Droppable is NOT animated** — It applies instantly (not a transition). If you need animated hover feedback, use `onActiveChange` with Reanimated's `useAnimatedStyle` instead.

### Gesture Handling

17. **Sortable items have a hardcoded 200ms long-press activation** — You cannot customize this for `SortableItem` or horizontal sortable. Only `SortableGridItem` exposes `activationDelay`. This prevents accidental drags but means sortable items always require a brief hold.

18. **`preDragDelay={0}` on Draggable conflicts with ScrollViews** — With zero delay, the pan gesture activates immediately and steals touch from scroll gestures. Use `preDragDelay={100}` or higher if your Draggable is inside a ScrollView.

19. **Overlapping droppables: first-match wins** — If two droppables overlap spatially, the one registered first wins collision detection. There is no "closest center" algorithm. Avoid overlapping droppables.

20. **`contain` collision never triggers if draggable is larger than droppable** — The entire draggable must fit inside the droppable. If the draggable is bigger, use `"intersect"` or `"center"` instead.

### Platform-Specific

21. **Drag shadow is iOS-only** — When an item is being dragged, the library applies `shadowColor`/`shadowOpacity`/`shadowRadius` for visual feedback. These are iOS-only properties. On Android, there is no drag shadow. If you need Android feedback, apply your own `elevation` via `animatedStyle`.

22. **`collapsable={false}` is critical on Android** — The library sets this internally on Draggable/Droppable views. If you use the hooks API (`useDraggable`/`useDroppable`) with custom views, you MUST set `collapsable={false}` on your `Animated.View`, or Android will optimize away the native view and measurements return zeros.

```tsx
// When using hooks directly
<Animated.View collapsable={false} {...animatedViewProps}>
```

### Performance

23. **Sortable remounts the entire list when the data array changes** — `Sortable` uses a hash of all item IDs as a React key, forcing a full remount on any data change (including reorders, additions, and removals). This resets scroll position and all animation state. For frequent data changes, consider using the hooks API (`useSortableList` + `useSortable`) directly for more control.

24. **`SortableGrid` does NOT remount on data changes** — Unlike Sortable, SortableGrid handles data changes more efficiently without full remounts.

25. **Keep `onDragging` handlers lightweight** — They fire ~20 times/second (50ms throttle) and bridge from the UI thread to JS. Heavy computation in these callbacks causes jank.

26. **Sortable has a hardcoded `backgroundColor: "white"`** — The internal ScrollView/FlatList has `backgroundColor: "white"` hardcoded. For dark mode, override it via the `style` prop:

```tsx
<Sortable
  data={items}
  renderItem={renderItem}
  itemHeight={60}
  style={{ backgroundColor: '#1a1a1a' }}
/>
```

### Dynamic Heights

27. **Dynamic height changes under 1px are ignored** — The library rounds heights and ignores changes smaller than 1px to prevent infinite re-render loops. Sub-pixel height adjustments are dropped.

28. **Initial dynamic heights are computed once from the first data snapshot** — If data changes before the initial render completes, heights may be stale until items are re-measured.

---

## Best Practices

### Data Structure

```tsx
// GOOD — simple, flat data with string IDs
const items = [
  { id: '1', title: 'Item 1' },
  { id: '2', title: 'Item 2' },
];

// GOOD — use stable unique IDs (not array indices)
const items = tasks.map(task => ({ ...task, id: task.uuid }));

// BAD — numeric IDs (must be strings)
const items = [{ id: 1, title: 'Item 1' }];

// BAD — using array index as ID (breaks on reorder)
const items = data.map((d, i) => ({ ...d, id: String(i) }));

// BAD — missing ID field
const items = [{ title: 'Item 1' }];
```

### Memoize renderItem

Always `useCallback` your `renderItem` to avoid unnecessary re-renders:

```tsx
// GOOD
const renderItem = useCallback(({ item, ...props }) => (
  <SortableItem key={item.id} id={item.id} data={item} {...props}>
    <MyItemComponent item={item} />
  </SortableItem>
), []);

// BAD — creates new function on every render
const renderItem = ({ item, ...props }) => (
  <SortableItem key={item.id} id={item.id} data={item} {...props}>
    <MyItemComponent item={item} />
  </SortableItem>
);
```

### Spread renderItem props

The `renderItem` callback receives shared values and configuration from the parent Sortable/SortableGrid. Always spread them onto the item component:

```tsx
// GOOD — spread all props from renderItem
const renderItem = useCallback(({ item, ...props }) => (
  <SortableItem id={item.id} data={item} {...props}>
    {/* content */}
  </SortableItem>
), []);

// BAD — manually passing individual props (easy to miss required ones)
const renderItem = useCallback(({ item, positions, lowerBound }) => (
  <SortableItem id={item.id} data={item} positions={positions} lowerBound={lowerBound}>
    {/* missing autoScrollDirection, itemsCount, etc. */}
  </SortableItem>
), []);
```

### Use Handles for Interactive Content

If your sortable items contain buttons, inputs, or other interactive elements, use handles to avoid drag conflicts:

```tsx
// GOOD — only the handle initiates drag, buttons work normally
<SortableItem id={item.id} data={item} {...props}>
  <View style={styles.row}>
    <SortableItem.Handle>
      <View style={styles.dragHandle} />
    </SortableItem.Handle>
    <Text>{item.title}</Text>
    <Button onPress={onDelete} title="Delete" />
  </View>
</SortableItem>

// PROBLEMATIC — entire item is draggable, button taps may trigger drag
<SortableItem id={item.id} data={item} {...props}>
  <View style={styles.row}>
    <Text>{item.title}</Text>
    <Button onPress={onDelete} title="Delete" />
  </View>
</SortableItem>
```

### Grid Activation Delay

For grids where items are tappable, use `activationDelay` to distinguish taps from drags:

```tsx
<SortableGridItem
  id={item.id}
  data={item}
  activationDelay={250}
  {...props}
>
  <Pressable onPress={() => navigateTo(item)}>
    {/* Grid cell content */}
  </Pressable>
</SortableGridItem>
```

### Hooks API for Complex Layouts

When you need full control over the container (custom scroll behavior, nested lists, non-standard layouts), use the hooks instead of the component API:

```tsx
// Hooks give you raw shared values and gesture handlers
const { positions, scrollY, autoScroll, scrollViewRef, handleScroll, contentHeight, getItemProps } =
  useSortableList({ data, itemHeight: 60 });

// You control the ScrollView entirely
<Animated.ScrollView
  ref={scrollViewRef}
  onScroll={handleScroll}
  contentContainerStyle={{ height: contentHeight }}
  // Add your own custom scroll props
  showsVerticalScrollIndicator={false}
  bounces={false}
>
  {data.map((item, index) => (
    <CustomItem key={item.id} item={item} {...getItemProps(item, index)} />
  ))}
</Animated.ScrollView>
```

### Avoid Nesting Sortables

Do NOT nest `Sortable` inside another `Sortable` or `SortableGrid`. Each creates its own `DropProvider` and `GestureHandlerRootView`, and nested gesture handlers will conflict. If you need nested reorderable lists, use the hooks API with a single shared gesture root.
