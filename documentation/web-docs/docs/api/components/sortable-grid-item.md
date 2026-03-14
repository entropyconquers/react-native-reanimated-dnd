---
sidebar_position: 6
---

# SortableGridItem Component

A component for individual items within a sortable grid, providing drag-and-drop functionality with gesture recognition, position animations, and reordering logic.

## Overview

The `SortableGridItem` component handles the drag-and-drop functionality for individual grid items. It can be used with or without drag handles for different interaction patterns and integrates seamlessly with the `SortableGrid` component or `useGridSortableList` hook. Items are positioned absolutely within the grid container and animate smoothly when reordered.

## Import

```tsx
import { SortableGridItem } from "react-native-reanimated-dnd";
```

## Props

### Core Props

#### id

- **Type**: `string`
- **Required**: Yes
- **Description**: Unique identifier for this sortable grid item. Used for tracking position and reordering.

```tsx
<SortableGridItem id="item-1" data={item} positions={positions} {...props}>
  <Text>Grid item content</Text>
</SortableGridItem>
```

#### data

- **Type**: `T`
- **Required**: Yes
- **Description**: Data payload associated with this grid item. Passed through for use in render logic.

#### positions

- **Type**: `SharedValue<GridPositions>`
- **Required**: Yes
- **Description**: Shared value containing the position mapping for all items in the sortable grid. Each position includes index, row, column, x, and y coordinates.

#### children

- **Type**: `React.ReactNode`
- **Required**: Yes
- **Description**: The content to render inside the sortable grid item.

### Scroll Props

#### scrollY

- **Type**: `SharedValue<number>`
- **Required**: Yes
- **Description**: Shared value tracking the current vertical scroll position. Used for position calculations during drag.

#### scrollX

- **Type**: `SharedValue<number>`
- **Required**: Yes
- **Description**: Shared value tracking the current horizontal scroll position. Used for position calculations during drag.

#### autoScrollDirection

- **Type**: `SharedValue<GridScrollDirection>`
- **Required**: Yes
- **Description**: Shared value indicating the current auto-scroll direction. Supports multi-directional scrolling including diagonal directions.

### Layout Props

#### itemsCount

- **Type**: `number`
- **Required**: Yes
- **Description**: Total number of items in the sortable grid. Used for boundary calculations and position validation.

#### dimensions

- **Type**: `GridDimensions`
- **Required**: Yes
- **Description**: Grid dimension configuration object containing `columns`, `rows`, `itemWidth`, `itemHeight`, `rowGap`, and `columnGap`.

```tsx
<SortableGridItem
  id="item-1"
  data={item}
  positions={positions}
  dimensions={{
    columns: 3,
    itemWidth: 100,
    itemHeight: 100,
    rowGap: 8,
    columnGap: 8,
  }}
  {...props}
>
  <Text>Content</Text>
</SortableGridItem>
```

#### orientation

- **Type**: `GridOrientation`
- **Required**: Yes
- **Description**: Grid orientation (`Vertical` or `Horizontal`). Determines how items flow within the grid.

#### strategy

- **Type**: `GridStrategy`
- **Default**: `GridStrategy.Insert`
- **Description**: Reordering strategy. `Insert` shifts items between source and target. `Swap` directly swaps the two items.

### Optional Props

#### containerWidth

- **Type**: `number`
- **Default**: `500`
- **Description**: Width of the scrollable container in pixels. Used for auto-scroll calculations.

#### containerHeight

- **Type**: `number`
- **Default**: `500`
- **Description**: Height of the scrollable container in pixels. Used for auto-scroll calculations.

#### activationDelay

- **Type**: `number`
- **Default**: `200`
- **Description**: Delay in milliseconds before drag activates. This is a long-press threshold that prevents accidental drags during scrolling.

```tsx
<SortableGridItem
  id="item-1"
  data={item}
  positions={positions}
  activationDelay={300} // Require 300ms long press to start drag
  {...props}
>
  <Text>Long press to drag</Text>
</SortableGridItem>
```

#### style

- **Type**: `StyleProp<ViewStyle>`
- **Required**: No
- **Description**: Style applied to the inner item container.

#### animatedStyle

- **Type**: `StyleProp<ViewStyle>`
- **Required**: No
- **Description**: Custom animated styles applied in addition to the built-in grid positioning animated style.

#### isBeingRemoved

- **Type**: `boolean`
- **Default**: `false`
- **Description**: When set to `true`, triggers a removal animation (fade out and scale down) on the item.

### Callback Props

#### onMove

- **Type**: `(id: string, from: number, to: number) => void`
- **Required**: No
- **Description**: Callback fired when the item's position changes within the grid. Called for both the actively dragged item and any displaced items.

```tsx
<SortableGridItem
  id="item-1"
  data={item}
  positions={positions}
  onMove={(id, from, to) => {
    console.log(`Item ${id} moved from position ${from} to ${to}`);
  }}
  {...props}
>
  <Text>Moveable item</Text>
</SortableGridItem>
```

#### onDragStart

- **Type**: `(id: string, position: number) => void`
- **Required**: No
- **Description**: Callback fired when dragging starts for this item.

```tsx
<SortableGridItem
  id="item-1"
  data={item}
  positions={positions}
  onDragStart={(id, position) => {
    console.log(`Started dragging item ${id} from position ${position}`);
    hapticFeedback();
  }}
  {...props}
>
  <Text>Draggable item</Text>
</SortableGridItem>
```

#### onDrop

- **Type**: `(id: string, position: number, allPositions?: GridPositions) => void`
- **Required**: No
- **Description**: Callback fired when dragging ends. Optionally receives the complete positions map for all items, which can be used to reconstruct the reordered data array.

```tsx
<SortableGridItem
  id="item-1"
  data={item}
  positions={positions}
  onDrop={(id, position, allPositions) => {
    console.log(`Dropped item ${id} at position ${position}`);
    if (allPositions) {
      // Reconstruct ordered data from positions
      const entries = Object.entries(allPositions);
      entries.sort((a, b) => a[1].index - b[1].index);
      const reordered = entries
        .map(([itemId]) => data.find((d) => d.id === itemId))
        .filter(Boolean);
      setData(reordered);
    }
  }}
  {...props}
>
  <Text>Droppable item</Text>
</SortableGridItem>
```

#### onDragging

- **Type**: `(id: string, overItemId: string | null, x: number, y: number) => void`
- **Required**: No
- **Description**: Callback fired continuously while dragging. Provides the id of the item currently being hovered over and the current x/y content coordinates. Throttled internally for performance.

```tsx
<SortableGridItem
  id="item-1"
  data={item}
  positions={positions}
  onDragging={(id, overItemId, x, y) => {
    if (overItemId) {
      console.log(`Item ${id} is hovering over ${overItemId} at (${x}, ${y})`);
      setHoverTarget(overItemId);
    } else {
      setHoverTarget(null);
    }
  }}
  {...props}
>
  <Text>Item with drag tracking</Text>
</SortableGridItem>
```

## SortableGridItem.Handle

A handle component that creates a specific draggable area within the sortable grid item. When a handle is present, only the handle area can initiate dragging. The handle uses the `registerHandle` callback to register itself with the parent item on mount and unregister on unmount. Internally, it renders a `GestureDetector` wrapping the handle content with the `handlePanGestureHandler` gesture.

### Props

#### children

- **Type**: `React.ReactNode`
- **Required**: Yes
- **Description**: The content to render inside the handle.

#### style

- **Type**: `StyleProp<ViewStyle>`
- **Required**: No
- **Description**: Style applied to the handle container.

```tsx
<SortableGridItem id="item-1" data={item} positions={positions} {...props}>
  <View style={styles.gridItemContent}>
    <Text style={styles.itemLabel}>{item.label}</Text>

    {/* Only this handle area can initiate dragging */}
    <SortableGridItem.Handle style={styles.dragHandle}>
      <View style={styles.handleIcon}>
        <View style={styles.handleDot} />
        <View style={styles.handleDot} />
        <View style={styles.handleDot} />
        <View style={styles.handleDot} />
      </View>
    </SortableGridItem.Handle>
  </View>
</SortableGridItem>
```

## Usage Examples

### Basic Sortable Grid Item

```tsx
import { SortableGridItem } from "react-native-reanimated-dnd";

function GridItemComponent({ item, positions, ...sortableProps }) {
  return (
    <SortableGridItem
      id={item.id}
      data={item}
      positions={positions}
      {...sortableProps}
      onMove={(id, from, to) => {
        console.log(`Item ${id} moved from ${from} to ${to}`);
      }}
    >
      <View style={[styles.gridItem, { backgroundColor: item.color }]}>
        <Text style={styles.emoji}>{item.emoji}</Text>
        <Text style={styles.label}>{item.label}</Text>
      </View>
    </SortableGridItem>
  );
}

const styles = StyleSheet.create({
  gridItem: {
    flex: 1,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  emoji: {
    fontSize: 28,
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: "#fff",
    textAlign: "center",
  },
});
```

### Grid Item with Drag Handle

```tsx
function GridItemWithHandle({ item, positions, ...sortableProps }) {
  return (
    <SortableGridItem
      id={item.id}
      data={item}
      positions={positions}
      {...sortableProps}
    >
      <View style={styles.gridItemContainer}>
        <View style={styles.itemContent}>
          <Text style={styles.itemEmoji}>{item.emoji}</Text>
          <Text style={styles.itemLabel}>{item.label}</Text>
        </View>

        {/* Only this handle can initiate dragging */}
        <SortableGridItem.Handle style={styles.dragHandle}>
          <View style={styles.handleLines}>
            <View style={styles.handleLine} />
            <View style={styles.handleLine} />
            <View style={styles.handleLine} />
          </View>
        </SortableGridItem.Handle>
      </View>
    </SortableGridItem>
  );
}

const styles = StyleSheet.create({
  gridItemContainer: {
    flex: 1,
    borderRadius: 12,
    backgroundColor: "#f0f0f0",
    padding: 8,
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemContent: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  itemEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  itemLabel: {
    fontSize: 11,
    fontWeight: "500",
    color: "#333",
    textAlign: "center",
  },
  dragHandle: {
    padding: 4,
  },
  handleLines: {
    width: 20,
    height: 10,
    justifyContent: "space-between",
  },
  handleLine: {
    height: 2,
    backgroundColor: "#999",
    borderRadius: 1,
  },
});
```

### Advanced Grid Item with State Tracking

```tsx
function AdvancedGridItem({ item, positions, ...sortableProps }) {
  const [isDragging, setIsDragging] = useState(false);

  return (
    <SortableGridItem
      id={item.id}
      data={item}
      positions={positions}
      {...sortableProps}
      onDragStart={(id, position) => {
        setIsDragging(true);
        hapticFeedback();
        analytics.track("grid_drag_start", { itemId: id, position });
      }}
      onDrop={(id, position, allPositions) => {
        setIsDragging(false);
        analytics.track("grid_drag_end", { itemId: id, position });
        if (allPositions) {
          saveNewOrder(allPositions);
        }
      }}
      onMove={(id, from, to) => {
        console.log(`${item.label}: ${from} → ${to}`);
      }}
    >
      <View
        style={[
          styles.gridItem,
          { backgroundColor: item.color },
          isDragging && styles.draggingItem,
        ]}
      >
        <Text style={styles.emoji}>{item.emoji}</Text>
        <Text style={styles.label}>{item.label}</Text>
        {isDragging && <Text style={styles.dragIndicator}>Moving...</Text>}
      </View>
    </SortableGridItem>
  );
}

const styles = StyleSheet.create({
  gridItem: {
    flex: 1,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  draggingItem: {
    opacity: 0.9,
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
  dragIndicator: {
    fontSize: 10,
    color: "rgba(255, 255, 255, 0.7)",
    fontStyle: "italic",
    marginTop: 2,
  },
});
```

### Custom Animated Grid Item

```tsx
function AnimatedGridItem({ item, positions, ...sortableProps }) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const customAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <SortableGridItem
      id={item.id}
      data={item}
      positions={positions}
      {...sortableProps}
      animatedStyle={customAnimatedStyle}
      onDragStart={() => {
        scale.value = withSpring(1.1);
        opacity.value = withTiming(0.9);
      }}
      onDrop={() => {
        scale.value = withSpring(1);
        opacity.value = withTiming(1);
      }}
    >
      <View style={[styles.gridItem, { backgroundColor: item.color }]}>
        <Text style={styles.emoji}>{item.emoji}</Text>
        <Text style={styles.label}>{item.label}</Text>
      </View>
    </SortableGridItem>
  );
}
```

## TypeScript Support

The component is fully typed with generic support:

```tsx
interface AppItem {
  id: string;
  label: string;
  icon: string;
  category: "utility" | "game" | "social";
}

function TypedGridItem({ item, positions, ...props }) {
  return (
    <SortableGridItem<AppItem>
      id={item.id}
      data={item}
      positions={positions}
      {...props}
      onMove={(id: string, from: number, to: number) => {
        // All parameters are properly typed
        console.log(`Item ${id} moved from ${from} to ${to}`);
      }}
      onDrop={(id: string, position: number, allPositions?: GridPositions) => {
        // Parameters are typed including optional allPositions
        console.log(`Dropped item ${id} at position ${position}`);
      }}
    >
      <Text>{item.label}</Text>
    </SortableGridItem>
  );
}
```

## Performance Tips

1. **Use `React.memo`** for item components to prevent unnecessary re-renders
2. **Memoize callback functions** with `useCallback`
3. **Avoid complex calculations** in render functions
4. **Use stable keys** for consistent performance

```tsx
// Good: Memoized component
const MemoizedGridItem = React.memo(({ item, positions, ...props }) => (
  <SortableGridItem id={item.id} data={item} positions={positions} {...props}>
    <GridItemContent item={item} />
  </SortableGridItem>
));

// Good: Memoized callbacks
const handleMove = useCallback((id, from, to) => {
  reorderItems(id, from, to);
}, []);
```

## See Also

- [SortableGrid Component](./sortable-grid) - High-level sortable grid component
- [useGridSortable Hook](../hooks/useGridSortable) - Underlying hook
- [useGridSortableList Hook](../hooks/useGridSortableList) - Grid list management hook
- [SortableGridItemProps](../types/grid-types#sortablegriditemprops) - Component props
- [SortableItem Component](./sortable-item) - Vertical sortable item alternative
