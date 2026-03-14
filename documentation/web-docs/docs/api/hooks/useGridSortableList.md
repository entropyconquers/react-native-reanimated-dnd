---
sidebar_position: 6
---

# useGridSortableList Hook

A hook for managing sortable grids with drag-and-drop reordering capabilities, position tracking, multi-directional auto-scrolling, and configurable reordering strategies.

## Overview

The `useGridSortableList` hook provides the foundational state management and utilities needed to create sortable grids. It handles position tracking, scroll synchronization, auto-scrolling, and provides helper functions for individual sortable grid items. This is the grid equivalent of `useSortableList`.

## Import

```tsx
import { useGridSortableList } from "react-native-reanimated-dnd";
```

## Parameters

### UseGridSortableListOptions\<TData\>

#### data

- **Type**: `TData[]` (where `TData extends { id: string }`)
- **Required**: Yes
- **Description**: Array of data items to manage in the sortable grid. Each item must have an `id` property.

#### dimensions

- **Type**: `GridDimensions`
- **Required**: Yes
- **Description**: Grid dimension configuration object. Must include `itemWidth` and `itemHeight`. For vertical grids, `columns` is required. For horizontal grids, `rows` is required. Optionally includes `rowGap` and `columnGap`.

```tsx
const sortableProps = useGridSortableList({
  data: items,
  dimensions: {
    columns: 3,
    itemWidth: 100,
    itemHeight: 100,
    rowGap: 8,
    columnGap: 8,
  },
});
```

#### orientation

- **Type**: `GridOrientation`
- **Default**: `GridOrientation.Vertical`
- **Description**: Grid orientation. `Vertical` grids fill rows left to right and scroll vertically. `Horizontal` grids fill columns top to bottom and scroll horizontally.

```tsx
import { GridOrientation } from "react-native-reanimated-dnd";

const sortableProps = useGridSortableList({
  data: items,
  dimensions: {
    rows: 3,
    itemWidth: 100,
    itemHeight: 100,
  },
  orientation: GridOrientation.Horizontal,
});
```

#### strategy

- **Type**: `GridStrategy`
- **Default**: `GridStrategy.Insert`
- **Description**: Reordering strategy. `Insert` shifts items between source and target to fill the gap. `Swap` directly swaps the source and target items.

```tsx
import { GridStrategy } from "react-native-reanimated-dnd";

const sortableProps = useGridSortableList({
  data: items,
  dimensions: { columns: 3, itemWidth: 100, itemHeight: 100 },
  strategy: GridStrategy.Swap,
});
```

#### itemKeyExtractor

- **Type**: `(item: TData, index: number) => string`
- **Default**: `(item) => item.id`
- **Description**: Function to extract unique keys from items. Useful when your data doesn't use `id` as the key field.

```tsx
const sortableProps = useGridSortableList({
  data: items,
  dimensions: { columns: 3, itemWidth: 100, itemHeight: 100 },
  itemKeyExtractor: (item) => item.uuid,
});
```

## Return Value

### UseGridSortableListReturn\<TData\>

#### positions

- **Type**: `SharedValue<GridPositions>`
- **Description**: Shared value containing the position mapping for all items in the grid. Maps item IDs to their current grid position (index, row, column, x, y).

```tsx
// positions.value might look like:
{
  'item-1': { index: 0, row: 0, column: 0, x: 0, y: 0 },
  'item-2': { index: 1, row: 0, column: 1, x: 108, y: 0 },
  'item-3': { index: 2, row: 0, column: 2, x: 216, y: 0 },
  'item-4': { index: 3, row: 1, column: 0, x: 0, y: 108 },
}
```

#### scrollY

- **Type**: `SharedValue<number>`
- **Description**: Shared value tracking the current vertical scroll position. Used for auto-scrolling during drag operations.

#### scrollX

- **Type**: `SharedValue<number>`
- **Description**: Shared value tracking the current horizontal scroll position. Used for auto-scrolling during drag operations.

#### autoScrollDirection

- **Type**: `SharedValue<GridScrollDirection>`
- **Description**: Shared value indicating the current auto-scroll direction. Supports eight directions plus none: `None`, `Up`, `Down`, `Left`, `Right`, `UpLeft`, `UpRight`, `DownLeft`, `DownRight`.

#### scrollViewRef

- **Type**: `ReturnType<typeof useAnimatedRef>`
- **Description**: Animated ref for the scroll view container. Used for programmatic scrolling during drag operations.

#### dropProviderRef

- **Type**: `React.RefObject<DropProviderRef>`
- **Description**: Ref for the DropProvider context. Used for triggering position updates after scroll events.

#### handleScroll

- **Type**: `any`
- **Description**: Animated scroll handler to attach to the ScrollView's `onScroll` prop. Tracks both vertical and horizontal scroll positions.

#### handleScrollEnd

- **Type**: `() => void`
- **Description**: Handler for scroll end events. Attach to `onScrollEndDrag` and `onMomentumScrollEnd`. Triggers position recalculation for accurate drop zone detection.

#### contentWidth

- **Type**: `number`
- **Description**: Calculated total width of the grid content based on item count, dimensions, and orientation.

#### contentHeight

- **Type**: `number`
- **Description**: Calculated total height of the grid content based on item count, dimensions, and orientation.

#### getItemProps

- **Type**: `(item: TData, index: number) => { id: string; positions: SharedValue<GridPositions>; scrollY: SharedValue<number>; scrollX: SharedValue<number>; autoScrollDirection: SharedValue<GridScrollDirection>; itemsCount: number; dimensions: GridDimensions; orientation: GridOrientation; strategy: GridStrategy; }`
- **Description**: Function that returns core props needed for each sortable grid item. These props should be spread onto SortableGridItem components along with additional props like data, children, and callbacks.

```tsx
const { getItemProps } = useGridSortableList({
  data: items,
  dimensions: { columns: 3, itemWidth: 100, itemHeight: 100 },
});

// For each item in your render
const itemProps = getItemProps(item, index);
// Returns: { id, positions, scrollY, scrollX, autoScrollDirection, itemsCount, dimensions, orientation, strategy }

// Use with SortableGridItem
<SortableGridItem {...itemProps} data={item} onDrop={handleDrop}>
  <GridItemContent item={item} />
</SortableGridItem>;
```

## Usage Examples

### Basic Grid Setup

```tsx
import { useGridSortableList } from "react-native-reanimated-dnd";
import { SortableGridItem } from "react-native-reanimated-dnd";
import { DropProvider } from "react-native-reanimated-dnd";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";

interface GridItem {
  id: string;
  label: string;
  emoji: string;
  color: string;
}

function CustomGrid() {
  const [items, setItems] = useState<GridItem[]>([
    { id: "1", label: "Music", emoji: "music", color: "#FF3B30" },
    { id: "2", label: "Games", emoji: "games", color: "#FF9500" },
    { id: "3", label: "Camera", emoji: "camera", color: "#FFCC00" },
    { id: "4", label: "Art", emoji: "art", color: "#34C759" },
    { id: "5", label: "Books", emoji: "books", color: "#007AFF" },
    { id: "6", label: "Power", emoji: "power", color: "#5856D6" },
  ]);

  const {
    scrollViewRef,
    dropProviderRef,
    handleScroll,
    handleScrollEnd,
    contentWidth,
    contentHeight,
    getItemProps,
  } = useGridSortableList({
    data: items,
    dimensions: {
      columns: 3,
      itemWidth: 100,
      itemHeight: 100,
      columnGap: 12,
      rowGap: 12,
    },
  });

  return (
    <GestureHandlerRootView style={styles.container}>
      <DropProvider ref={dropProviderRef}>
        <Animated.ScrollView
          ref={scrollViewRef}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          style={styles.scrollView}
          onScrollEndDrag={handleScrollEnd}
          onMomentumScrollEnd={handleScrollEnd}
        >
          <View style={{ width: contentWidth, height: contentHeight, position: "relative" }}>
            {items.map((item, index) => {
              const itemProps = getItemProps(item, index);
              return (
                <SortableGridItem
                  key={item.id}
                  {...itemProps}
                  data={item}
                  onDrop={(id, position, allPositions) => {
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
                  <View
                    style={[
                      styles.gridItem,
                      { backgroundColor: item.color },
                    ]}
                  >
                    <Text style={styles.emoji}>{item.emoji}</Text>
                    <Text style={styles.label}>{item.label}</Text>
                  </View>
                </SortableGridItem>
              );
            })}
          </View>
        </Animated.ScrollView>
      </DropProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollView: {
    flex: 1,
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

### Custom Grid with Swap Strategy

```tsx
import { GridStrategy, GridOrientation } from "react-native-reanimated-dnd";

function SwapGridExample() {
  const [items, setItems] = useState(initialItems);

  const handleDrop = useCallback(
    (id: string, position: number, allPositions?: GridPositions) => {
      if (allPositions) {
        const entries = Object.entries(allPositions);
        entries.sort((a, b) => a[1].index - b[1].index);
        const reordered = entries
          .map(([itemId]) => items.find((d) => d.id === itemId))
          .filter(Boolean) as GridItem[];
        setItems(reordered);
      }
    },
    [items]
  );

  const {
    scrollViewRef,
    dropProviderRef,
    handleScroll,
    handleScrollEnd,
    contentWidth,
    contentHeight,
    getItemProps,
  } = useGridSortableList({
    data: items,
    dimensions: {
      columns: 4,
      itemWidth: 80,
      itemHeight: 80,
      columnGap: 8,
      rowGap: 8,
    },
    orientation: GridOrientation.Vertical,
    strategy: GridStrategy.Swap,
  });

  return (
    <GestureHandlerRootView style={styles.container}>
      <DropProvider ref={dropProviderRef}>
        <Animated.ScrollView
          ref={scrollViewRef}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          style={styles.scrollView}
          onScrollEndDrag={handleScrollEnd}
          onMomentumScrollEnd={handleScrollEnd}
        >
          <View style={{ width: contentWidth, height: contentHeight, position: "relative" }}>
            {items.map((item, index) => {
              const itemProps = getItemProps(item, index);
              return (
                <SortableGridItem
                  key={item.id}
                  {...itemProps}
                  data={item}
                  onDrop={handleDrop}
                  onDragStart={(id, position) => {
                    hapticFeedback();
                    console.log(`Started dragging ${id} from position ${position}`);
                  }}
                >
                  <View
                    style={[
                      styles.gridItem,
                      { backgroundColor: item.color },
                    ]}
                  >
                    <Text style={styles.emoji}>{item.emoji}</Text>
                    <Text style={styles.label}>{item.label}</Text>
                  </View>
                </SortableGridItem>
              );
            })}
          </View>
        </Animated.ScrollView>
      </DropProvider>
    </GestureHandlerRootView>
  );
}
```

### Grid with Reordering Logic

```tsx
function ReorderableGrid() {
  const [items, setItems] = useState(initialItems);

  const handleReorder = useCallback(
    (id: string, from: number, to: number) => {
      console.log(`Item ${id} moved from position ${from} to ${to}`);

      // Optional: Analytics
      analytics.track("grid_item_reordered", {
        itemId: id,
        from,
        to,
        totalItems: items.length,
      });
    },
    [items.length]
  );

  const sortableProps = useGridSortableList({
    data: items,
    dimensions: {
      columns: 3,
      itemWidth: 100,
      itemHeight: 100,
      columnGap: 12,
      rowGap: 12,
    },
  });

  const {
    scrollViewRef,
    dropProviderRef,
    handleScroll,
    handleScrollEnd,
    contentWidth,
    contentHeight,
    getItemProps,
  } = sortableProps;

  return (
    <GestureHandlerRootView style={styles.container}>
      <DropProvider ref={dropProviderRef}>
        <Animated.ScrollView
          ref={scrollViewRef}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          style={styles.scrollView}
          onScrollEndDrag={handleScrollEnd}
          onMomentumScrollEnd={handleScrollEnd}
        >
          <View style={{ width: contentWidth, height: contentHeight, position: "relative" }}>
            {items.map((item, index) => {
              const itemProps = getItemProps(item, index);
              return (
                <SortableGridItem
                  key={item.id}
                  {...itemProps}
                  data={item}
                  onMove={handleReorder}
                  onDragStart={(id, position) => {
                    hapticFeedback();
                  }}
                  onDrop={(id, position, allPositions) => {
                    if (allPositions) {
                      const entries = Object.entries(allPositions);
                      entries.sort((a, b) => a[1].index - b[1].index);
                      const reordered = entries
                        .map(([itemId]) => items.find((d) => d.id === itemId))
                        .filter(Boolean);
                      setItems(reordered);
                    }
                  }}
                >
                  <GridItemContent item={item} />
                </SortableGridItem>
              );
            })}
          </View>
        </Animated.ScrollView>
      </DropProvider>
    </GestureHandlerRootView>
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

function CustomKeyGrid() {
  const [items, setItems] = useState<CustomGridItem[]>(data);

  const sortableProps = useGridSortableList({
    data: items,
    dimensions: {
      columns: 3,
      itemWidth: 100,
      itemHeight: 100,
      columnGap: 8,
      rowGap: 8,
    },
    itemKeyExtractor: (item) => item.uuid, // Use uuid instead of id
  });

  const {
    scrollViewRef,
    dropProviderRef,
    handleScroll,
    handleScrollEnd,
    contentWidth,
    contentHeight,
    getItemProps,
  } = sortableProps;

  return (
    <GestureHandlerRootView style={styles.container}>
      <DropProvider ref={dropProviderRef}>
        <Animated.ScrollView
          ref={scrollViewRef}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          style={styles.scrollView}
          onScrollEndDrag={handleScrollEnd}
          onMomentumScrollEnd={handleScrollEnd}
        >
          <View style={{ width: contentWidth, height: contentHeight, position: "relative" }}>
            {items.map((item, index) => {
              const itemProps = getItemProps(item, index);
              return (
                <SortableGridItem key={item.uuid} {...itemProps} data={item}>
                  <View style={styles.customItem}>
                    <Text style={styles.itemIcon}>{item.icon}</Text>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemOrder}>Order: {item.order}</Text>
                  </View>
                </SortableGridItem>
              );
            })}
          </View>
        </Animated.ScrollView>
      </DropProvider>
    </GestureHandlerRootView>
  );
}
```

## TypeScript Support

The hook is fully typed with generic support:

```tsx
interface AppItem {
  id: string;
  label: string;
  icon: string;
  category: "utility" | "game" | "social";
}

function TypedGrid() {
  const [items, setItems] = useState<AppItem[]>(appData);

  const {
    scrollViewRef,
    dropProviderRef,
    handleScroll,
    handleScrollEnd,
    contentWidth,
    contentHeight,
    getItemProps,
  } = useGridSortableList<AppItem>({
    data: items,
    dimensions: {
      columns: 4,
      itemWidth: 80,
      itemHeight: 80,
    },
    itemKeyExtractor: (item: AppItem) => item.id, // Properly typed
  });

  return (
    <GestureHandlerRootView style={styles.container}>
      <DropProvider ref={dropProviderRef}>
        <Animated.ScrollView
          ref={scrollViewRef}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          onScrollEndDrag={handleScrollEnd}
          onMomentumScrollEnd={handleScrollEnd}
        >
          <View style={{ width: contentWidth, height: contentHeight, position: "relative" }}>
            {items.map((item: AppItem, index: number) => {
              const itemProps = getItemProps(item, index);
              return (
                <SortableGridItem key={item.id} {...itemProps} data={item}>
                  <Text>{item.label}</Text>
                </SortableGridItem>
              );
            })}
          </View>
        </Animated.ScrollView>
      </DropProvider>
    </GestureHandlerRootView>
  );
}
```

## Performance Tips

1. **Use `React.memo`** for item components to prevent unnecessary re-renders
2. **Memoize callback functions** with `useCallback`
3. **Use stable key extractors** for consistent performance
4. **Throttle position updates** for large grids

```tsx
// Good: Memoized components and callbacks
const MemoizedGridItem = React.memo(({ item, ...props }) => (
  <SortableGridItem {...props}>
    <ItemContent item={item} />
  </SortableGridItem>
));

const handleDrop = useCallback((id, position, allPositions) => {
  saveNewOrder(allPositions);
}, []);
```

## Common Patterns

### Container Component Pattern

```tsx
function GridContainer({ children, ...sortableProps }) {
  const {
    scrollViewRef,
    dropProviderRef,
    handleScroll,
    handleScrollEnd,
    contentWidth,
    contentHeight,
  } = sortableProps;

  return (
    <GestureHandlerRootView style={styles.container}>
      <DropProvider ref={dropProviderRef}>
        <Animated.ScrollView
          ref={scrollViewRef}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          style={styles.scrollView}
          onScrollEndDrag={handleScrollEnd}
          onMomentumScrollEnd={handleScrollEnd}
        >
          <View style={{ width: contentWidth, height: contentHeight, position: "relative" }}>
            {children}
          </View>
        </Animated.ScrollView>
      </DropProvider>
    </GestureHandlerRootView>
  );
}

// Usage
function MyGrid() {
  const sortableProps = useGridSortableList({
    data,
    dimensions: { columns: 3, itemWidth: 100, itemHeight: 100 },
  });

  return (
    <GridContainer {...sortableProps}>
      {data.map((item, index) => (
        <SortableGridItem
          key={item.id}
          {...sortableProps.getItemProps(item, index)}
          data={item}
        >
          <ItemContent item={item} />
        </SortableGridItem>
      ))}
    </GridContainer>
  );
}
```

## See Also

- [SortableGrid Component](../../components/sortable-grid) - High-level component using this hook
- [SortableGridItem Component](../../components/sortable-grid-item) - Individual item component
- [useGridSortable Hook](./useGridSortable) - Individual grid item hook
- [DropProvider](../../context/DropProvider) - Drag-and-drop context
- [GridScrollDirection Enum](../types/grid-types#gridscrolldirection) - Auto-scroll direction values
- [UseGridSortableListOptions Type](../types/grid-types#usegridsortablelistoptionstdata) - Complete type definitions
