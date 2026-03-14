---
sidebar_position: 6
---

# Grid Types

Complete type definitions for sortable grid components and hooks.

## Enums

### GridScrollDirection

Represents the auto-scroll direction during grid drag operations. Supports multi-directional scrolling including diagonal.

```tsx
enum GridScrollDirection {
  None = "none",
  Up = "up",
  Down = "down",
  Left = "left",
  Right = "right",
  UpLeft = "up-left",
  UpRight = "up-right",
  DownLeft = "down-left",
  DownRight = "down-right",
}
```

#### Values

- **`None`**: No auto-scrolling
- **`Up`**: Auto-scrolling upward
- **`Down`**: Auto-scrolling downward
- **`Left`**: Auto-scrolling leftward
- **`Right`**: Auto-scrolling rightward
- **`UpLeft`**: Auto-scrolling diagonally up-left
- **`UpRight`**: Auto-scrolling diagonally up-right
- **`DownLeft`**: Auto-scrolling diagonally down-left
- **`DownRight`**: Auto-scrolling diagonally down-right

### GridOrientation

Represents the primary layout direction of the grid.

```tsx
enum GridOrientation {
  Vertical = "vertical",
  Horizontal = "horizontal",
}
```

#### Values

- **`Vertical`**: Items fill rows left to right, grid scrolls vertically. Requires `columns` in dimensions.
- **`Horizontal`**: Items fill columns top to bottom, grid scrolls horizontally. Requires `rows` in dimensions.

### GridStrategy

Represents the reordering strategy when an item is dragged to a new position.

```tsx
enum GridStrategy {
  Insert = "insert",
  Swap = "swap",
}
```

#### Values

- **`Insert`**: Items between source and target shift to fill the gap, similar to reordering app icons on iOS.
- **`Swap`**: Source and target items directly swap positions.

## Interfaces

### GridPosition

Represents the position of a single item within the grid.

```tsx
interface GridPosition {
  index: number;
  row: number;
  column: number;
  x: number;
  y: number;
}
```

#### Properties

##### index

- **Type**: `number`
- **Description**: The linear index of the item in the grid (0-based). This is the item's position in the flattened array.

##### row

- **Type**: `number`
- **Description**: The row number the item occupies (0-based).

##### column

- **Type**: `number`
- **Description**: The column number the item occupies (0-based).

##### x

- **Type**: `number`
- **Description**: The horizontal pixel offset of the item from the grid origin.

##### y

- **Type**: `number`
- **Description**: The vertical pixel offset of the item from the grid origin.

```tsx
// Example GridPosition for an item at row 1, column 2 in a grid with
// itemWidth=100, itemHeight=100, columnGap=8, rowGap=8:
{
  index: 5,
  row: 1,
  column: 2,
  x: 216, // 2 * (100 + 8)
  y: 108, // 1 * (100 + 8)
}
```

### GridPositions

A map of item IDs to their grid positions.

```tsx
interface GridPositions {
  [id: string]: GridPosition;
}
```

```tsx
// Example GridPositions for a 3-column grid:
{
  'item-1': { index: 0, row: 0, column: 0, x: 0, y: 0 },
  'item-2': { index: 1, row: 0, column: 1, x: 108, y: 0 },
  'item-3': { index: 2, row: 0, column: 2, x: 216, y: 0 },
  'item-4': { index: 3, row: 1, column: 0, x: 0, y: 108 },
}
```

### GridDimensions

Configuration object for grid layout dimensions.

```tsx
interface GridDimensions {
  columns?: number;
  rows?: number;
  itemWidth: number;
  itemHeight: number;
  rowGap?: number;
  columnGap?: number;
}
```

#### Properties

##### columns

- **Type**: `number`
- **Required**: Yes (when orientation is `Vertical`)
- **Description**: Number of columns in the grid. Required for vertical orientation.

##### rows

- **Type**: `number`
- **Required**: Yes (when orientation is `Horizontal`)
- **Description**: Number of rows in the grid. Required for horizontal orientation.

##### itemWidth

- **Type**: `number`
- **Required**: Yes
- **Description**: Width of each grid item in pixels.

##### itemHeight

- **Type**: `number`
- **Required**: Yes
- **Description**: Height of each grid item in pixels.

##### rowGap

- **Type**: `number`
- **Default**: `0`
- **Description**: Vertical spacing between rows in pixels.

##### columnGap

- **Type**: `number`
- **Default**: `0`
- **Description**: Horizontal spacing between columns in pixels.

```tsx
// Example: 4-column grid with gaps
const dimensions: GridDimensions = {
  columns: 4,
  itemWidth: 80,
  itemHeight: 80,
  rowGap: 12,
  columnGap: 12,
};

// Example: Horizontal 3-row grid
const horizontalDimensions: GridDimensions = {
  rows: 3,
  itemWidth: 100,
  itemHeight: 100,
  rowGap: 8,
  columnGap: 8,
};
```

### UseGridSortableOptions\<T\>

Configuration options for the useGridSortable hook.

```tsx
interface UseGridSortableOptions<T> {
  id: string;
  positions: SharedValue<GridPositions>;
  scrollY: SharedValue<number>;
  scrollX: SharedValue<number>;
  autoScrollDirection: SharedValue<GridScrollDirection>;
  itemsCount: number;
  dimensions: GridDimensions;
  orientation: GridOrientation;
  strategy?: GridStrategy;
  containerWidth?: number;
  containerHeight?: number;
  activationDelay?: number;
  onMove?: (id: string, from: number, to: number) => void;
  onDragStart?: (id: string, position: number) => void;
  onDrop?: (id: string, position: number, allPositions?: GridPositions) => void;
  onDragging?: (
    id: string,
    overItemId: string | null,
    x: number,
    y: number
  ) => void;
  isBeingRemoved?: boolean;
}
```

#### Properties

##### id

- **Type**: `string`
- **Required**: Yes
- **Description**: Unique identifier for this grid item. Must be unique within the grid. Used for tracking position changes and managing reordering logic.

##### positions

- **Type**: `SharedValue<GridPositions>`
- **Required**: Yes
- **Description**: Shared value containing the current positions of all items in the grid. Managed by the parent grid list.

##### scrollY

- **Type**: `SharedValue<number>`
- **Required**: Yes
- **Description**: Shared value tracking the current vertical scroll position.

##### scrollX

- **Type**: `SharedValue<number>`
- **Required**: Yes
- **Description**: Shared value tracking the current horizontal scroll position.

##### autoScrollDirection

- **Type**: `SharedValue<GridScrollDirection>`
- **Required**: Yes
- **Description**: Shared value indicating the current auto-scroll direction.

##### itemsCount

- **Type**: `number`
- **Required**: Yes
- **Description**: Total number of items in the grid. Used for boundary calculations and position validation.

##### dimensions

- **Type**: `GridDimensions`
- **Required**: Yes
- **Description**: Grid dimension configuration.

##### orientation

- **Type**: `GridOrientation`
- **Required**: Yes
- **Description**: Grid orientation (vertical or horizontal).

##### strategy

- **Type**: `GridStrategy`
- **Default**: `GridStrategy.Insert`
- **Description**: Reordering strategy (insert or swap).

##### containerWidth

- **Type**: `number`
- **Default**: `500`
- **Description**: Width of the scrollable container in pixels.

##### containerHeight

- **Type**: `number`
- **Default**: `500`
- **Description**: Height of the scrollable container in pixels.

##### activationDelay

- **Type**: `number`
- **Required**: No
- **Description**: Delay in ms before drag activates.

##### onMove

- **Type**: `(id: string, from: number, to: number) => void`
- **Required**: No
- **Description**: Callback fired when an item's position changes within the grid.

```tsx
const handleMove = (id: string, from: number, to: number) => {
  console.log(`Item ${id} moved from position ${from} to ${to}`);
};
```

##### onDragStart

- **Type**: `(id: string, position: number) => void`
- **Required**: No
- **Description**: Callback fired when dragging starts for this item.

##### onDrop

- **Type**: `(id: string, position: number, allPositions?: GridPositions) => void`
- **Required**: No
- **Description**: Callback fired when dragging ends. Receives the complete positions map for data reconstruction.

```tsx
const handleDrop = (
  id: string,
  position: number,
  allPositions?: GridPositions
) => {
  if (allPositions) {
    const entries = Object.entries(allPositions);
    entries.sort((a, b) => a[1].index - b[1].index);
    const reordered = entries
      .map(([itemId]) => data.find((d) => d.id === itemId))
      .filter(Boolean);
    setData(reordered);
  }
};
```

##### onDragging

- **Type**: `(id: string, overItemId: string | null, x: number, y: number) => void`
- **Required**: No
- **Description**: Callback fired continuously while dragging. Provides the item being hovered over and current content coordinates. Throttled at 50ms intervals.

##### isBeingRemoved

- **Type**: `boolean`
- **Default**: `false`
- **Description**: When true, triggers a removal animation (fade out and scale down).

### UseGridSortableReturn

Return value from the useGridSortable hook.

```tsx
import { GestureType } from "react-native-gesture-handler";

interface UseGridSortableReturn {
  animatedStyle: StyleProp<ViewStyle>;
  panGestureHandler: GestureType;
  handlePanGestureHandler: GestureType;
  isMoving: boolean;
  hasHandle: boolean;
  registerHandle: (registered: boolean) => void;
}
```

#### Properties

##### animatedStyle

- **Type**: `StyleProp<ViewStyle>`
- **Description**: Animated style to apply to the grid item. Contains absolute positioning, dimensions, z-index, shadow, and scale transform animations.

##### panGestureHandler

- **Type**: `GestureType`
- **Description**: Pan gesture for full-item drag interactions. Created with `Gesture.Pan()` from react-native-gesture-handler. Automatically disabled when a handle is registered. Use with `GestureDetector`.

##### handlePanGestureHandler

- **Type**: `GestureType`
- **Description**: Pan gesture for handle-only drag interactions. A separate gesture instance to avoid sharing a gesture object between two `GestureDetector` components. Use with `GestureDetector` inside a handle component.

##### isMoving

- **Type**: `boolean`
- **Description**: Whether this item is currently being moved/dragged.

##### hasHandle

- **Type**: `boolean`
- **Description**: Whether this grid item has a handle component. When true, only the handle can initiate dragging. When false, the entire item is draggable.

##### registerHandle

- **Type**: `(registered: boolean) => void`
- **Description**: Callback for handle components to register or unregister themselves. When a handle registers (`true`), the main `panGestureHandler` is disabled so that only the handle area can initiate dragging. Call with `false` to unregister.

### UseGridSortableListOptions\<TData\>

Configuration options for the useGridSortableList hook.

```tsx
interface UseGridSortableListOptions<TData extends SortableData> {
  data: TData[];
  dimensions: GridDimensions;
  orientation?: GridOrientation;
  strategy?: GridStrategy;
  itemKeyExtractor?: (item: TData, index: number) => string;
}
```

#### Properties

##### data

- **Type**: `TData[]`
- **Required**: Yes
- **Description**: Array of data items to be rendered as sortable grid items. Each item must have an `id` property for tracking.

```tsx
const items = [
  { id: "1", label: "Music", emoji: "🎵" },
  { id: "2", label: "Games", emoji: "🎮" },
  { id: "3", label: "Camera", emoji: "📸" },
];
```

##### dimensions

- **Type**: `GridDimensions`
- **Required**: Yes
- **Description**: Grid dimension configuration. All items must have the same dimensions for proper position calculations and smooth animations.

##### orientation

- **Type**: `GridOrientation`
- **Default**: `GridOrientation.Vertical`
- **Description**: Grid orientation.

##### strategy

- **Type**: `GridStrategy`
- **Default**: `GridStrategy.Insert`
- **Description**: Reordering strategy.

##### itemKeyExtractor

- **Type**: `(item: TData, index: number) => string`
- **Default**: `(item) => item.id`
- **Description**: Function to extract a unique key from each data item.

```tsx
const keyExtractor = (item, index) => `${item.category}-${item.name}`;
```

### UseGridSortableListReturn\<TData\>

Return value from the useGridSortableList hook.

```tsx
interface UseGridSortableListReturn<TData extends SortableData> {
  positions: SharedValue<GridPositions>;
  scrollY: SharedValue<number>;
  scrollX: SharedValue<number>;
  autoScrollDirection: SharedValue<GridScrollDirection>;
  scrollViewRef: any;
  dropProviderRef: React.RefObject<DropProviderRef>;
  handleScroll: any;
  handleScrollEnd: () => void;
  contentWidth: number;
  contentHeight: number;
  getItemProps: (item: TData, index: number) => GridItemProps;
}
```

#### Properties

##### positions

- **Type**: `SharedValue<GridPositions>`
- **Description**: Shared value containing the current positions of all items. Maps item IDs to their grid positions.

##### scrollY

- **Type**: `SharedValue<number>`
- **Description**: Shared value tracking the current vertical scroll position.

##### scrollX

- **Type**: `SharedValue<number>`
- **Description**: Shared value tracking the current horizontal scroll position.

##### autoScrollDirection

- **Type**: `SharedValue<GridScrollDirection>`
- **Description**: Shared value indicating the current auto-scroll direction.

##### scrollViewRef

- **Type**: `React.RefObject<Animated.ScrollView>`
- **Description**: Animated ref for the scroll view component. Used for programmatic scrolling.

##### dropProviderRef

- **Type**: `React.RefObject<DropProviderRef>`
- **Description**: Ref for the drop provider context. Used for triggering position updates after scroll events.

##### handleScroll

- **Type**: `(event: NativeSyntheticEvent<NativeScrollEvent>) => void`
- **Description**: Animated scroll handler to attach to the ScrollView. Tracks both vertical and horizontal scroll positions.

##### handleScrollEnd

- **Type**: `() => void`
- **Description**: Callback to call when scrolling ends. Triggers position recalculation.

##### contentWidth

- **Type**: `number`
- **Description**: Total width of the grid content. Calculated from item count, dimensions, and orientation.

##### contentHeight

- **Type**: `number`
- **Description**: Total height of the grid content. Calculated from item count, dimensions, and orientation.

##### getItemProps

- **Type**: `(item: TData, index: number) => { id: string; positions: SharedValue<GridPositions>; scrollY: SharedValue<number>; scrollX: SharedValue<number>; autoScrollDirection: SharedValue<GridScrollDirection>; itemsCount: number; dimensions: GridDimensions; orientation: GridOrientation; strategy: GridStrategy; }`
- **Description**: Helper function to get core props for individual sortable grid items.

```tsx
{
  data.map((item, index) => {
    const itemProps = getItemProps(item, index);
    return (
      <SortableGridItem
        key={itemProps.id}
        {...itemProps}
        data={item}
        onDrop={handleDrop}
      >
        <Text>{item.label}</Text>
      </SortableGridItem>
    );
  });
}
```

### SortableGridItemProps\<T\>

Props for the SortableGridItem component.

```tsx
interface SortableGridItemProps<T> {
  id: string;
  data: T;
  positions: SharedValue<GridPositions>;
  scrollY: SharedValue<number>;
  scrollX: SharedValue<number>;
  autoScrollDirection: SharedValue<GridScrollDirection>;
  itemsCount: number;
  dimensions: GridDimensions;
  orientation: GridOrientation;
  strategy?: GridStrategy;
  containerWidth?: number;
  containerHeight?: number;
  activationDelay?: number;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  animatedStyle?: StyleProp<ViewStyle>;
  onMove?: (id: string, from: number, to: number) => void;
  onDragStart?: (id: string, position: number) => void;
  onDrop?: (
    id: string,
    position: number,
    allPositions?: GridPositions
  ) => void;
  onDragging?: (
    id: string,
    overItemId: string | null,
    x: number,
    y: number
  ) => void;
  isBeingRemoved?: boolean;
}
```

#### Properties

##### id

- **Type**: `string`
- **Required**: Yes
- **Description**: Unique identifier for this grid item.

##### data

- **Type**: `T`
- **Required**: Yes
- **Description**: Data associated with this grid item.

##### positions

- **Type**: `SharedValue<GridPositions>`
- **Required**: Yes
- **Description**: Shared value containing positions of all items in the grid.

##### scrollY

- **Type**: `SharedValue<number>`
- **Required**: Yes
- **Description**: Shared value tracking the current vertical scroll position.

##### scrollX

- **Type**: `SharedValue<number>`
- **Required**: Yes
- **Description**: Shared value tracking the current horizontal scroll position.

##### autoScrollDirection

- **Type**: `SharedValue<GridScrollDirection>`
- **Required**: Yes
- **Description**: Shared value indicating the current auto-scroll direction.

##### itemsCount

- **Type**: `number`
- **Required**: Yes
- **Description**: Total number of items in the grid.

##### dimensions

- **Type**: `GridDimensions`
- **Required**: Yes
- **Description**: Grid dimension configuration.

##### orientation

- **Type**: `GridOrientation`
- **Required**: Yes
- **Description**: Grid orientation.

##### strategy

- **Type**: `GridStrategy`
- **Default**: `GridStrategy.Insert`
- **Description**: Reordering strategy.

##### containerWidth

- **Type**: `number`
- **Required**: No
- **Description**: Width of the scrollable container.

##### containerHeight

- **Type**: `number`
- **Required**: No
- **Description**: Height of the scrollable container.

##### activationDelay

- **Type**: `number`
- **Default**: `200`
- **Description**: Delay in ms before drag activates (long press threshold).

##### children

- **Type**: `ReactNode`
- **Required**: Yes
- **Description**: Child components to render inside the grid item.

##### style

- **Type**: `StyleProp<ViewStyle>`
- **Required**: No
- **Description**: Style to apply to the inner item container.

##### animatedStyle

- **Type**: `StyleProp<ViewStyle>`
- **Required**: No
- **Description**: Additional animated style to apply.

##### onMove

- **Type**: `(id: string, from: number, to: number) => void`
- **Required**: No
- **Description**: Callback fired when item position changes within the grid.

##### onDragStart

- **Type**: `(id: string, position: number) => void`
- **Required**: No
- **Description**: Callback fired when dragging starts.

##### onDrop

- **Type**: `(id: string, position: number, allPositions?: GridPositions) => void`
- **Required**: No
- **Description**: Callback fired when dragging ends. Receives complete positions map.

##### onDragging

- **Type**: `(id: string, overItemId: string | null, x: number, y: number) => void`
- **Required**: No
- **Description**: Callback fired continuously while dragging with x/y coordinates.

##### isBeingRemoved

- **Type**: `boolean`
- **Default**: `false`
- **Description**: Triggers removal animation when true.

### SortableGridProps\<TData\>

Props for the SortableGrid component.

```tsx
interface SortableGridProps<TData extends SortableData> {
  data: TData[];
  renderItem: (props: SortableGridRenderItemProps<TData>) => ReactNode;
  dimensions: GridDimensions;
  orientation?: GridOrientation;
  strategy?: GridStrategy;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  itemContainerStyle?: StyleProp<ViewStyle>;
  itemKeyExtractor?: (item: TData, index: number) => string;
  scrollEnabled?: boolean;
}
```

#### Properties

##### data

- **Type**: `TData[]`
- **Required**: Yes
- **Description**: Array of data items to render as sortable grid.

##### renderItem

- **Type**: `(props: SortableGridRenderItemProps<TData>) => ReactNode`
- **Required**: Yes
- **Description**: Function to render each sortable grid item.

##### dimensions

- **Type**: `GridDimensions`
- **Required**: Yes
- **Description**: Grid dimension configuration.

##### orientation

- **Type**: `GridOrientation`
- **Default**: `GridOrientation.Vertical`
- **Description**: Grid orientation.

##### strategy

- **Type**: `GridStrategy`
- **Default**: `GridStrategy.Insert`
- **Description**: Reordering strategy.

##### style

- **Type**: `StyleProp<ViewStyle>`
- **Required**: No
- **Description**: Style to apply to the scroll view.

##### contentContainerStyle

- **Type**: `StyleProp<ViewStyle>`
- **Required**: No
- **Description**: Style to apply to the scroll view content container.

##### itemContainerStyle

- **Type**: `StyleProp<ViewStyle>`
- **Required**: No
- **Description**: Style to apply to each item container.

##### itemKeyExtractor

- **Type**: `(item: TData, index: number) => string`
- **Required**: No
- **Description**: Function to extract unique key from each item.

##### scrollEnabled

- **Type**: `boolean`
- **Default**: `true`
- **Description**: Whether scrolling is enabled on the grid.

### SortableGridRenderItemProps\<TData\>

Props passed to the renderItem function in SortableGrid component.

```tsx
interface SortableGridRenderItemProps<TData extends SortableData> {
  item: TData;
  index: number;
  id: string;
  positions: SharedValue<GridPositions>;
  scrollY: SharedValue<number>;
  scrollX: SharedValue<number>;
  autoScrollDirection: SharedValue<GridScrollDirection>;
  itemsCount: number;
  dimensions: GridDimensions;
  orientation: GridOrientation;
  strategy: GridStrategy;
}
```

#### Properties

##### item

- **Type**: `TData`
- **Description**: The data item being rendered.

##### index

- **Type**: `number`
- **Description**: Index of the item in the original data array.

##### id

- **Type**: `string`
- **Description**: Unique identifier for this item.

##### positions

- **Type**: `SharedValue<GridPositions>`
- **Description**: Shared value containing positions of all items.

##### scrollY

- **Type**: `SharedValue<number>`
- **Description**: Shared value tracking the current vertical scroll position.

##### scrollX

- **Type**: `SharedValue<number>`
- **Description**: Shared value tracking the current horizontal scroll position.

##### autoScrollDirection

- **Type**: `SharedValue<GridScrollDirection>`
- **Description**: Shared value indicating the current auto-scroll direction.

##### itemsCount

- **Type**: `number`
- **Description**: Total number of items in the grid.

##### dimensions

- **Type**: `GridDimensions`
- **Description**: Grid dimension configuration.

##### orientation

- **Type**: `GridOrientation`
- **Description**: Grid orientation.

##### strategy

- **Type**: `GridStrategy`
- **Description**: Reordering strategy.

## Usage Examples

### Basic Sortable Grid

```tsx
import {
  useGridSortableList,
  SortableGridItem,
  GridOrientation,
  GridStrategy,
  GridPositions,
} from "react-native-reanimated-dnd";

interface GridItem {
  id: string;
  label: string;
  emoji: string;
  color: string;
}

function AppGrid() {
  const [items, setItems] = useState<GridItem[]>([
    { id: "1", label: "Music", emoji: "🎵", color: "#FF3B30" },
    { id: "2", label: "Games", emoji: "🎮", color: "#FF9500" },
    { id: "3", label: "Camera", emoji: "📸", color: "#FFCC00" },
  ]);

  const dimensions: GridDimensions = {
    columns: 3,
    itemWidth: 100,
    itemHeight: 100,
    columnGap: 8,
    rowGap: 8,
  };

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
    dimensions,
    orientation: GridOrientation.Vertical,
    strategy: GridStrategy.Insert,
  });

  return (
    <Animated.ScrollView
      ref={scrollViewRef}
      onScroll={handleScroll}
      onMomentumScrollEnd={handleScrollEnd}
      scrollEventThrottle={16}
    >
      <View style={{ width: contentWidth, height: contentHeight, position: "relative" }}>
      {items.map((item, index) => {
        const itemProps = getItemProps(item, index);
        return (
          <SortableGridItem
            key={itemProps.id}
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
              <Text>{item.emoji}</Text>
              <Text>{item.label}</Text>
            </View>
          </SortableGridItem>
        );
      })}
      </View>
    </Animated.ScrollView>
  );
}
```

### High-Level SortableGrid Component

```tsx
import {
  SortableGrid,
  SortableGridItem,
  SortableGridRenderItemProps,
  GridOrientation,
  GridStrategy,
} from "react-native-reanimated-dnd";

function SimpleGrid() {
  const [items, setItems] = useState(initialItems);

  return (
    <SortableGrid
      data={items}
      dimensions={{
        columns: 4,
        itemWidth: 80,
        itemHeight: 80,
        columnGap: 12,
        rowGap: 12,
      }}
      orientation={GridOrientation.Vertical}
      strategy={GridStrategy.Insert}
      renderItem={({ item, id, positions, ...props }) => (
        <SortableGridItem
          key={id}
          id={id}
          data={item}
          positions={positions}
          {...props}
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
      )}
      style={styles.grid}
      contentContainerStyle={styles.gridContent}
    />
  );
}
```

## See Also

- [SortableGrid Component](../../components/sortable-grid) - Grid component documentation
- [SortableGridItem Component](../../components/sortable-grid-item) - Grid item component documentation
- [useGridSortable Hook](../../hooks/useGridSortable) - Individual grid item hook
- [useGridSortableList Hook](../../hooks/useGridSortableList) - Grid list management hook
- [Sortable Types](./sortable-types) - Related sortable list types
- [Draggable Types](./draggable-types) - Related draggable types
