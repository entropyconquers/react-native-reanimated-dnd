---
sidebar_position: 5
---

# SortableGrid Component

A high-level component for creating sortable grids with smooth reordering animations, multi-directional auto-scrolling, and configurable reordering strategies.

## Overview

The `SortableGrid` component provides a complete solution for sortable grids, handling all the complex state management, gesture handling, and animations internally. It renders a scrollable grid where items can be dragged to reorder them with smooth animations and auto-scrolling support. It supports both vertical and horizontal orientations, as well as insert and swap reordering strategies.

## Import

```tsx
import { SortableGrid } from "react-native-reanimated-dnd";
```

## Props

### Core Props

#### data

- **Type**: `TData[]` (where `TData extends { id: string }`)
- **Required**: Yes
- **Description**: Array of data items to render in the sortable grid. Each item must have an `id` property for tracking.

```tsx
const items = [
  { id: "1", label: "Music", emoji: "music", color: "#FF3B30" },
  { id: "2", label: "Games", emoji: "games", color: "#FF9500" },
  { id: "3", label: "Camera", emoji: "camera", color: "#FFCC00" },
  { id: "4", label: "Art", emoji: "art", color: "#34C759" },
];

<SortableGrid
  data={items}
  renderItem={renderItem}
  dimensions={{ columns: 3, itemWidth: 100, itemHeight: 100 }}
/>;
```

#### renderItem

- **Type**: `(props: SortableGridRenderItemProps<TData>) => React.ReactElement`
- **Required**: Yes
- **Description**: Function that renders each item in the grid. Receives item data and sortable grid props.

```tsx
const renderItem = ({ item, id, positions, ...props }) => (
  <SortableGridItem key={id} id={id} data={item} positions={positions} {...props}>
    <View style={styles.gridItem}>
      <Text>{item.emoji}</Text>
      <Text>{item.label}</Text>
    </View>
  </SortableGridItem>
);
```

#### dimensions

- **Type**: `GridDimensions`
- **Required**: Yes
- **Description**: Configuration object defining the grid layout dimensions.

##### dimensions.columns

- **Type**: `number`
- **Required**: Yes (when `orientation` is `Vertical`)
- **Description**: Number of columns in the grid. Required for vertical orientation.

##### dimensions.rows

- **Type**: `number`
- **Required**: Yes (when `orientation` is `Horizontal`)
- **Description**: Number of rows in the grid. Required for horizontal orientation.

##### dimensions.itemWidth

- **Type**: `number`
- **Required**: Yes
- **Description**: Width of each item in pixels.

##### dimensions.itemHeight

- **Type**: `number`
- **Required**: Yes
- **Description**: Height of each item in pixels.

##### dimensions.rowGap

- **Type**: `number`
- **Default**: `0`
- **Description**: Vertical spacing between rows in pixels.

##### dimensions.columnGap

- **Type**: `number`
- **Default**: `0`
- **Description**: Horizontal spacing between columns in pixels.

```tsx
<SortableGrid
  data={data}
  renderItem={renderItem}
  dimensions={{
    columns: 4,
    itemWidth: 80,
    itemHeight: 80,
    rowGap: 12,
    columnGap: 12,
  }}
/>
```

### Optional Props

#### orientation

- **Type**: `GridOrientation`
- **Default**: `GridOrientation.Vertical`
- **Description**: Determines the primary scrolling direction of the grid. Vertical grids fill rows left to right and scroll vertically. Horizontal grids fill columns top to bottom and scroll horizontally.

```tsx
import { GridOrientation } from "react-native-reanimated-dnd";

<SortableGrid
  data={data}
  renderItem={renderItem}
  dimensions={{ columns: 3, itemWidth: 100, itemHeight: 100 }}
  orientation={GridOrientation.Vertical}
/>
```

#### strategy

- **Type**: `GridStrategy`
- **Default**: `GridStrategy.Insert`
- **Description**: Determines how items are reordered when an item is dragged to a new position. `Insert` shifts items between source and target to fill the gap. `Swap` directly swaps the source and target items.

```tsx
import { GridStrategy } from "react-native-reanimated-dnd";

<SortableGrid
  data={data}
  renderItem={renderItem}
  dimensions={{ columns: 3, itemWidth: 100, itemHeight: 100 }}
  strategy={GridStrategy.Swap}
/>
```

#### style

- **Type**: `StyleProp<ViewStyle>`
- **Default**: `undefined`
- **Description**: Style applied to the scroll view of the sortable grid.

```tsx
<SortableGrid
  data={data}
  renderItem={renderItem}
  dimensions={{ columns: 3, itemWidth: 100, itemHeight: 100 }}
  style={{
    flex: 1,
    backgroundColor: "#f5f5f5",
  }}
/>
```

#### contentContainerStyle

- **Type**: `StyleProp<ViewStyle>`
- **Default**: `undefined`
- **Description**: Style applied to the scroll view's content container.

```tsx
<SortableGrid
  data={data}
  renderItem={renderItem}
  dimensions={{ columns: 3, itemWidth: 100, itemHeight: 100 }}
  contentContainerStyle={{
    paddingHorizontal: 16,
    paddingVertical: 16,
  }}
/>
```

#### itemKeyExtractor

- **Type**: `(item: TData, index: number) => string`
- **Default**: `(item) => item.id`
- **Description**: Function to extract unique keys from items. Useful when your data doesn't use `id` as the key field.

```tsx
interface CustomItem {
  uuid: string;
  name: string;
}

<SortableGrid
  data={customItems}
  renderItem={renderItem}
  dimensions={{ columns: 3, itemWidth: 100, itemHeight: 100 }}
  itemKeyExtractor={(item) => item.uuid}
/>;
```

#### scrollEnabled

- **Type**: `boolean`
- **Default**: `true`
- **Description**: Whether scrolling is enabled on the grid's scroll view.

```tsx
<SortableGrid
  data={data}
  renderItem={renderItem}
  dimensions={{ columns: 3, itemWidth: 100, itemHeight: 100 }}
  scrollEnabled={false}
/>
```

## SortableGridRenderItemProps

The render function receives these props:

```tsx
interface SortableGridRenderItemProps<TData> {
  item: TData; // The data item
  index: number; // Index in the original data array
  id: string; // Unique identifier
  positions: SharedValue<GridPositions>; // Position mapping
  scrollY: SharedValue<number>; // Vertical scroll position
  scrollX: SharedValue<number>; // Horizontal scroll position
  autoScrollDirection: SharedValue<GridScrollDirection>; // Auto-scroll direction
  itemsCount: number; // Total number of items
  dimensions: GridDimensions; // Grid dimensions config
  orientation: GridOrientation; // Grid orientation
  strategy: GridStrategy; // Reordering strategy
}
```

## Usage Examples

### Basic Sortable Grid

```tsx
import {
  SortableGrid,
  SortableGridItem,
  SortableGridRenderItemProps,
  GridOrientation,
} from "react-native-reanimated-dnd";

interface GridItem {
  id: string;
  label: string;
  color: string;
  emoji: string;
}

function AppGrid() {
  const [items, setItems] = useState<GridItem[]>([
    { id: "1", label: "Music", color: "#FF3B30", emoji: "music" },
    { id: "2", label: "Games", color: "#FF9500", emoji: "games" },
    { id: "3", label: "Camera", color: "#FFCC00", emoji: "camera" },
    { id: "4", label: "Art", color: "#34C759", emoji: "art" },
    { id: "5", label: "Books", color: "#007AFF", emoji: "books" },
    { id: "6", label: "Power", color: "#5856D6", emoji: "power" },
  ]);

  const dimensions = useMemo(
    () => ({
      columns: 3,
      itemWidth: 100,
      itemHeight: 100,
      columnGap: 12,
      rowGap: 12,
    }),
    []
  );

  const renderItem = useCallback(
    ({ item, id, positions, ...props }: SortableGridRenderItemProps<GridItem>) => (
      <SortableGridItem
        key={id}
        id={id}
        data={item}
        positions={positions}
        {...props}
        onDrop={(currentId, position, allPositions) => {
          if (allPositions) {
            const entries = Object.entries(allPositions);
            entries.sort((a, b) => a[1].index - b[1].index);
            const reordered = entries
              .map(([itemId]) => items.find((d) => d.id === itemId))
              .filter(Boolean) as GridItem[];
            setItems(reordered);
          }
        }}
      >
        <View style={[styles.gridItem, { backgroundColor: item.color }]}>
          <Text style={styles.emoji}>{item.emoji}</Text>
          <Text style={styles.label}>{item.label}</Text>
        </View>
      </SortableGridItem>
    ),
    [items]
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Apps</Text>
      <SortableGrid
        data={items}
        renderItem={renderItem}
        dimensions={dimensions}
        orientation={GridOrientation.Vertical}
        style={styles.grid}
        contentContainerStyle={styles.gridContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    padding: 16,
  },
  grid: {
    flex: 1,
  },
  gridContent: {
    padding: 16,
  },
  gridItem: {
    flex: 1,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  emoji: {
    fontSize: 28,
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: "#fff",
  },
});
```

### Grid with Swap Strategy

```tsx
import { GridStrategy } from "react-native-reanimated-dnd";

function SwapGrid() {
  const [items, setItems] = useState(initialItems);

  const renderItem = useCallback(
    ({ item, id, positions, ...props }: SortableGridRenderItemProps<GridItem>) => (
      <SortableGridItem
        key={id}
        id={id}
        data={item}
        positions={positions}
        {...props}
        onDrop={(currentId, position, allPositions) => {
          if (allPositions) {
            const entries = Object.entries(allPositions);
            entries.sort((a, b) => a[1].index - b[1].index);
            const reordered = entries
              .map(([itemId]) => items.find((d) => d.id === itemId))
              .filter(Boolean) as GridItem[];
            setItems(reordered);
          }
        }}
      >
        <View style={[styles.gridItem, { backgroundColor: item.color }]}>
          <Text style={styles.emoji}>{item.emoji}</Text>
          <Text style={styles.label}>{item.label}</Text>
        </View>
      </SortableGridItem>
    ),
    [items]
  );

  return (
    <SortableGrid
      data={items}
      renderItem={renderItem}
      dimensions={{
        columns: 4,
        itemWidth: 80,
        itemHeight: 80,
        columnGap: 8,
        rowGap: 8,
      }}
      strategy={GridStrategy.Swap}
      style={styles.grid}
    />
  );
}
```

### Sortable Grid with Callbacks

```tsx
function GridWithCallbacks() {
  const [items, setItems] = useState(initialItems);
  const [draggingItem, setDraggingItem] = useState<string | null>(null);
  const [lastAction, setLastAction] = useState("Ready to drag");

  const renderItem = useCallback(
    ({ item, id, positions, ...props }: SortableGridRenderItemProps<GridItem>) => (
      <SortableGridItem
        key={id}
        id={id}
        data={item}
        positions={positions}
        {...props}
        onDragStart={(currentId, position) => {
          setDraggingItem(currentId);
          setLastAction(`Dragging: ${item.label}`);

          if (Platform.OS === "ios") {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          }
        }}
        onDrop={(currentId, position, allPositions) => {
          setDraggingItem(null);
          setLastAction(`Dropped: ${item.label} at position ${position}`);

          if (allPositions) {
            const entries = Object.entries(allPositions);
            entries.sort((a, b) => a[1].index - b[1].index);
            const reordered = entries
              .map(([itemId]) => items.find((d) => d.id === itemId))
              .filter(Boolean) as GridItem[];
            setItems(reordered);
          }
        }}
        onMove={(currentId, from, to) => {
          setLastAction(`${item.label}: ${from} → ${to}`);

          analytics.track("grid_item_reordered", {
            itemId: currentId,
            from,
            to,
            totalItems: items.length,
          });
        }}
        onDragging={(currentId, overItemId, x, y) => {
          if (overItemId) {
            console.log(`Item ${currentId} hovering over ${overItemId} at (${x}, ${y})`);
          }
        }}
      >
        <View
          style={[
            styles.gridItem,
            { backgroundColor: item.color },
            draggingItem === id && styles.draggingItem,
          ]}
        >
          <Text style={styles.emoji}>{item.emoji}</Text>
          <Text style={styles.label}>{item.label}</Text>
        </View>
      </SortableGridItem>
    ),
    [items, draggingItem]
  );

  return (
    <View style={styles.container}>
      <Text style={styles.statusText}>{lastAction}</Text>
      <SortableGrid
        data={items}
        renderItem={renderItem}
        dimensions={{
          columns: 4,
          itemWidth: 80,
          itemHeight: 80,
          columnGap: 12,
          rowGap: 12,
        }}
        style={styles.grid}
        contentContainerStyle={styles.gridContent}
      />
    </View>
  );
}
```

### Custom Key Extractor

```tsx
interface CustomGridItem {
  uuid: string;
  name: string;
  icon: string;
  order: number;
}

function CustomGrid() {
  const [items, setItems] = useState<CustomGridItem[]>(data);

  const renderItem = useCallback(
    ({ item, id, positions, ...props }: SortableGridRenderItemProps<CustomGridItem>) => (
      <SortableGridItem key={id} id={id} data={item} positions={positions} {...props}>
        <View style={styles.gridItem}>
          <Text style={styles.icon}>{item.icon}</Text>
          <Text style={styles.name}>{item.name}</Text>
        </View>
      </SortableGridItem>
    ),
    []
  );

  return (
    <SortableGrid
      data={items}
      renderItem={renderItem}
      dimensions={{
        columns: 3,
        itemWidth: 100,
        itemHeight: 100,
        columnGap: 8,
        rowGap: 8,
      }}
      itemKeyExtractor={(item) => item.uuid}
      style={styles.grid}
    />
  );
}
```

## Internal Layout

The `SortableGrid` component renders items inside a nested `View` with exact grid dimensions (`contentWidth` x `contentHeight`). This inner view provides proper absolute positioning for grid items, ensuring that padding or other styles on the scroll view's content container do not affect item placement.

```tsx
// Simplified internal structure:
<AnimatedScrollView contentContainerStyle={contentContainerStyle}>
  <View style={{ width: contentWidth, height: contentHeight, position: "relative" }}>
    {/* Grid items are absolutely positioned inside this View */}
    {renderGridItems()}
  </View>
</AnimatedScrollView>
```

This means `contentContainerStyle` can safely include padding without breaking the grid layout.

## Auto-Scrolling

The SortableGrid component automatically handles scrolling when dragging items near the edges:

- **Scroll Threshold**: 50px from edges
- **Multi-Directional**: Supports up, down, left, right, and diagonal scrolling
- **Smooth Scrolling**: Uses native scroll animations
- **Adaptive**: Adjusts to the grid orientation

```tsx
// Auto-scrolling is enabled by default
<SortableGrid
  data={data}
  renderItem={renderItem}
  dimensions={{ columns: 3, itemWidth: 100, itemHeight: 100 }}
  // Auto-scrolling works automatically when dragging near edges
/>
```

## Performance Considerations

### Large Grids

For grids with many items (>50), consider:

1. **Memoization**: Use `React.memo` for item components
2. **Key Extraction**: Ensure stable, unique keys
3. **Minimal Re-renders**: Use `useCallback` for the render function

```tsx
// Good: Memoized component
const MemoizedGridContent = React.memo(({ item }) => (
  <View style={[styles.gridItem, { backgroundColor: item.color }]}>
    <Text style={styles.emoji}>{item.emoji}</Text>
    <Text style={styles.label}>{item.label}</Text>
  </View>
));

// Good: Stable render function
const renderItem = useCallback(
  ({ item, id, positions, ...props }) => (
    <SortableGridItem key={id} id={id} data={item} positions={positions} {...props}>
      <MemoizedGridContent item={item} />
    </SortableGridItem>
  ),
  []
);
```

## TypeScript Support

The SortableGrid component is fully typed with generics:

```tsx
interface AppItem {
  id: string;
  label: string;
  icon: string;
  category: "utility" | "game" | "social";
}

// TypeScript infers the correct types
<SortableGrid<AppItem>
  data={appItems}
  renderItem={({ item, id, positions, ...props }) => {
    // item is correctly typed as AppItem
    // id is string
    // positions is SharedValue<GridPositions>
    return (
      <SortableGridItem key={id} id={id} data={item} positions={positions} {...props}>
        <AppItemComponent item={item} />
      </SortableGridItem>
    );
  }}
  dimensions={{ columns: 4, itemWidth: 80, itemHeight: 80 }}
/>;
```

## See Also

- [SortableGridItem Component](./sortable-grid-item) - Individual grid items
- [useGridSortableList Hook](../hooks/useGridSortableList) - Underlying hook
- [Grid Types](../types/grid-types) - Complete type definitions
- [Sortable Component](./sortable) - Vertical sortable list alternative
