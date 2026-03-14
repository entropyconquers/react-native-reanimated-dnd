---
sidebar_position: 7
---

# useGridSortable Hook

A hook for creating sortable grid items with drag-and-drop reordering capabilities, position animations, multi-directional auto-scrolling, and configurable reordering strategies.

## Overview

The `useGridSortable` hook provides the core functionality for individual items within a sortable grid, handling drag gestures, position animations, auto-scrolling, and reordering logic. It works in conjunction with `useGridSortableList` to provide a complete sortable grid solution. This is the grid equivalent of `useSortable`.

## Import

```tsx
import { useGridSortable } from "react-native-reanimated-dnd";
```

## Parameters

### UseGridSortableOptions\<T\>

#### Core Parameters

##### id

- **Type**: `string`
- **Required**: Yes
- **Description**: Unique identifier for this sortable grid item. Used for tracking position and reordering.

##### positions

- **Type**: `SharedValue<GridPositions>`
- **Required**: Yes
- **Description**: Shared value containing the position mapping for all items in the sortable grid. Each position includes index, row, column, x, and y coordinates.

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
- **Description**: Current auto-scroll direction state. Supports eight directions plus none.

##### itemsCount

- **Type**: `number`
- **Required**: Yes
- **Description**: Total number of items in the sortable grid.

##### dimensions

- **Type**: `GridDimensions`
- **Required**: Yes
- **Description**: Grid dimension configuration containing `columns`, `rows`, `itemWidth`, `itemHeight`, `rowGap`, and `columnGap`.

##### orientation

- **Type**: `GridOrientation`
- **Required**: Yes
- **Description**: Grid orientation (`Vertical` or `Horizontal`). Determines how items flow and how position calculations are performed.

```tsx
const { animatedStyle, panGestureHandler } = useGridSortable({
  id: "item-1",
  positions: positionsSharedValue,
  scrollY: scrollYSharedValue,
  scrollX: scrollXSharedValue,
  autoScrollDirection: scrollDirectionValue,
  itemsCount: 12,
  dimensions: {
    columns: 3,
    itemWidth: 100,
    itemHeight: 100,
    columnGap: 8,
    rowGap: 8,
  },
  orientation: GridOrientation.Vertical,
});
```

#### Optional Parameters

##### strategy

- **Type**: `GridStrategy`
- **Default**: `GridStrategy.Insert`
- **Description**: Reordering strategy. `Insert` shifts items between source and target to fill the gap. `Swap` directly swaps the source and target items.

```tsx
import { GridStrategy } from "react-native-reanimated-dnd";

const { animatedStyle, panGestureHandler } = useGridSortable({
  id: "item-1",
  positions,
  scrollY,
  scrollX,
  autoScrollDirection,
  itemsCount: 12,
  dimensions,
  orientation: GridOrientation.Vertical,
  strategy: GridStrategy.Swap,
});
```

##### containerWidth

- **Type**: `number`
- **Default**: `500`
- **Description**: Width of the scrollable container in pixels. Used for auto-scroll calculations and determining horizontal scroll boundaries.

##### containerHeight

- **Type**: `number`
- **Default**: `500`
- **Description**: Height of the scrollable container in pixels. Used for auto-scroll calculations and determining vertical scroll boundaries.

##### activationDelay

- **Type**: `number`
- **Default**: `200`
- **Required**: No
- **Description**: Delay in milliseconds before drag activates. The hook internally calls `Gesture.Pan().activateAfterLongPress(activationDelay)` to prevent accidental drags during scrolling.

##### onMove

- **Type**: `(id: string, from: number, to: number) => void`
- **Required**: No
- **Description**: Callback fired when the item's position changes within the grid. Called when the item is displaced by another dragging item.

```tsx
const { animatedStyle, panGestureHandler } = useGridSortable({
  id: "item-1",
  positions,
  scrollY,
  scrollX,
  autoScrollDirection,
  itemsCount: 12,
  dimensions,
  orientation: GridOrientation.Vertical,
  onMove: (id, from, to) => {
    console.log(`Item ${id} moved from position ${from} to ${to}`);
  },
});
```

##### onDragStart

- **Type**: `(id: string, position: number) => void`
- **Required**: No
- **Description**: Callback fired when dragging starts for this item.

##### onDrop

- **Type**: `(id: string, position: number, allPositions?: GridPositions) => void`
- **Required**: No
- **Description**: Callback fired when dragging ends. Receives the final position and optionally the complete positions map for all items.

##### onDragging

- **Type**: `(id: string, overItemId: string | null, x: number, y: number) => void`
- **Required**: No
- **Description**: Callback fired continuously while dragging. Provides information about which item is being hovered over and current coordinates. Internally throttled at 50ms intervals for performance.

##### isBeingRemoved

- **Type**: `boolean`
- **Default**: `false`
- **Description**: When set to `true`, the item plays a removal animation (fade out and scale down over 250ms).

## Return Value

### UseGridSortableReturn

#### animatedStyle

- **Type**: `StyleProp<ViewStyle>`
- **Description**: Animated styles to apply to the sortable grid item. Contains absolute positioning (top, left), dimensions (width, height from grid dimensions), z-index management, shadow effects during drag, and scale transform. When `isBeingRemoved` is true, includes fade-out and scale-down animations.

```tsx
import { GestureDetector } from "react-native-gesture-handler";

const { animatedStyle, panGestureHandler } = useGridSortable(options);

return (
  <Animated.View style={[animatedStyle]}>
    <GestureDetector gesture={panGestureHandler}>
      <Animated.View style={{ flex: 1 }}>
        <Text>Grid item content</Text>
      </Animated.View>
    </GestureDetector>
  </Animated.View>
);
```

#### panGestureHandler

- **Type**: `GestureType` (from `react-native-gesture-handler`)
- **Description**: Pan gesture for full-item drag interactions, created with `Gesture.Pan()`. Automatically disabled when a handle is registered via `registerHandle`. Use with `GestureDetector`. Manages the full drag lifecycle: start, active movement, and finish with snap-back animation.

#### handlePanGestureHandler

- **Type**: `GestureType` (from `react-native-gesture-handler`)
- **Description**: Pan gesture for handle-only drag interactions. A separate gesture instance to avoid sharing a gesture object between two `GestureDetector` components (which would cause a handlerTag mutation warning). Use with `GestureDetector` inside a handle component.

#### isMoving

- **Type**: `boolean`
- **Description**: Whether this item is currently being dragged. Useful for conditional styling or behavior.

```tsx
const { animatedStyle, panGestureHandler, isMoving } = useGridSortable(options);

return (
  <Animated.View style={[animatedStyle, isMoving && styles.dragging]}>
    <GestureDetector gesture={panGestureHandler}>
      <Animated.View style={{ flex: 1 }}>
        <Text>Item content</Text>
      </Animated.View>
    </GestureDetector>
  </Animated.View>
);
```

#### hasHandle

- **Type**: `boolean`
- **Description**: Whether this sortable grid item has a handle component. When true, only the handle can initiate dragging. When false, the entire item is draggable.

#### registerHandle

- **Type**: `(registered: boolean) => void`
- **Description**: Callback for handle components to register or unregister themselves. When a handle calls `registerHandle(true)`, the main `panGestureHandler` is disabled so only the handle area can initiate dragging. Call with `false` to unregister (e.g., on unmount).

## Usage Examples

### Basic Grid Sortable Item

```tsx
import { useGridSortable } from "react-native-reanimated-dnd";
import { GestureDetector } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";

function SortableGridCell({ item, positions, ...sortableProps }) {
  const { animatedStyle, panGestureHandler, isMoving } = useGridSortable({
    id: item.id,
    positions,
    ...sortableProps,
    onMove: (id, from, to) => {
      console.log(`Item ${id} moved from ${from} to ${to}`);
    },
    onDragStart: (id, position) => {
      console.log(`Started dragging item ${id} at position ${position}`);
      hapticFeedback();
    },
  });

  return (
    <Animated.View style={[animatedStyle]}>
      <GestureDetector gesture={panGestureHandler}>
        <Animated.View style={{ flex: 1 }}>
          <View
            style={[
              styles.gridCell,
              { backgroundColor: item.color },
              isMoving && styles.dragging,
            ]}
          >
            <Text style={styles.emoji}>{item.emoji}</Text>
            <Text style={styles.label}>{item.label}</Text>
          </View>
        </Animated.View>
      </GestureDetector>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  gridCell: {
    flex: 1,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  dragging: {
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
});
```

### Grid Item with State Tracking

```tsx
function TrackedGridItem({ item, positions, ...sortableProps }) {
  const [dragState, setDragState] = useState("idle");
  const [hoverTarget, setHoverTarget] = useState(null);

  const { animatedStyle, panGestureHandler, isMoving } = useGridSortable({
    id: item.id,
    positions,
    ...sortableProps,
    onDragStart: (id, position) => {
      setDragState("dragging");
      hapticFeedback();
      analytics.track("grid_drag_start", { itemId: id, position });
    },
    onDrop: (id, position, allPositions) => {
      setDragState("dropped");
      setTimeout(() => setDragState("idle"), 300);
      analytics.track("grid_drag_end", { itemId: id, position });
    },
    onDragging: (id, overItemId, x, y) => {
      setHoverTarget(overItemId);
      if (overItemId) {
        highlightItem(overItemId);
      }
    },
    onMove: (id, from, to) => {
      showToast(`Item moved to position ${to + 1}`);
    },
  });

  return (
    <Animated.View style={[animatedStyle]}>
      <GestureDetector gesture={panGestureHandler}>
        <Animated.View style={{ flex: 1 }}>
          <View style={[styles.gridCell, styles[dragState]]}>
            <Text style={styles.emoji}>{item.emoji}</Text>
            <Text style={styles.label}>{item.label}</Text>

            {dragState === "dragging" && (
              <Text style={styles.dragIndicator}>
                {hoverTarget ? `Over: ${hoverTarget}` : "Dragging..."}
              </Text>
            )}
          </View>
        </Animated.View>
      </GestureDetector>
    </Animated.View>
  );
}
```

### Custom Animated Grid Item

```tsx
function AnimatedGridItem({ item, positions, ...sortableProps }) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const { animatedStyle, panGestureHandler, isMoving } = useGridSortable({
    id: item.id,
    positions,
    ...sortableProps,
    onDragStart: () => {
      scale.value = withSpring(1.1);
      opacity.value = withTiming(0.9);
    },
    onDrop: () => {
      scale.value = withSpring(1);
      opacity.value = withTiming(1);
    },
  });

  const customAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[animatedStyle, customAnimatedStyle]}>
      <GestureDetector gesture={panGestureHandler}>
        <Animated.View style={{ flex: 1 }}>
          <View style={[styles.gridCell, { backgroundColor: item.color }]}>
            <Text style={styles.emoji}>{item.emoji}</Text>
            <Text style={styles.label}>{item.label}</Text>
          </View>
        </Animated.View>
      </GestureDetector>
    </Animated.View>
  );
}
```

### Performance Optimized Grid Item

```tsx
const MemoizedGridItem = React.memo(
  ({ item, positions, ...sortableProps }) => {
    const { animatedStyle, panGestureHandler, isMoving } = useGridSortable({
      id: item.id,
      positions,
      ...sortableProps,
      onMove: useCallback((id, from, to) => {
        reorderItems(id, from, to);
      }, []),
      onDragStart: useCallback((id, position) => {
        hapticFeedback();
      }, []),
    });

    return (
      <Animated.View style={[animatedStyle]}>
        <GestureDetector gesture={panGestureHandler}>
          <Animated.View style={{ flex: 1 }}>
            <GridCellContent item={item} isMoving={isMoving} />
          </Animated.View>
        </GestureDetector>
      </Animated.View>
    );
  }
);

// Separate memoized content component
const GridCellContent = React.memo(({ item, isMoving }) => (
  <View
    style={[
      styles.gridCell,
      { backgroundColor: item.color },
      isMoving && styles.movingCell,
    ]}
  >
    <Text style={styles.emoji}>{item.emoji}</Text>
    <Text style={styles.label}>{item.label}</Text>
  </View>
));
```

### Removable Grid Item

```tsx
function RemovableGridItem({ item, positions, isRemoving, ...sortableProps }) {
  const { animatedStyle, panGestureHandler } = useGridSortable({
    id: item.id,
    positions,
    ...sortableProps,
    isBeingRemoved: isRemoving,
  });

  return (
    <Animated.View style={[animatedStyle]}>
      <GestureDetector gesture={panGestureHandler}>
        <Animated.View style={{ flex: 1 }}>
          <View style={[styles.gridCell, { backgroundColor: item.color }]}>
            <Text style={styles.emoji}>{item.emoji}</Text>
            <Text style={styles.label}>{item.label}</Text>
          </View>
        </Animated.View>
      </GestureDetector>
    </Animated.View>
  );
}
```

## TypeScript Support

The hook is fully typed with generic support:

```tsx
import { GestureDetector } from "react-native-gesture-handler";

interface AppItem {
  id: string;
  label: string;
  icon: string;
  category: "utility" | "game" | "social";
}

function TypedGridItem({ item, positions, ...props }) {
  const { animatedStyle, panGestureHandler, isMoving } =
    useGridSortable<AppItem>({
      id: item.id,
      positions,
      ...props,
      onMove: (id: string, from: number, to: number) => {
        // All parameters are properly typed
        console.log(`Item ${id} moved from ${from} to ${to}`);
      },
      onDrop: (
        id: string,
        position: number,
        allPositions?: GridPositions
      ) => {
        // Parameters are typed including optional allPositions
        console.log(`Dropped item ${id} at position ${position}`);
      },
    });

  return (
    <Animated.View style={[animatedStyle]}>
      <GestureDetector gesture={panGestureHandler}>
        <Animated.View style={{ flex: 1 }}>
          <Text>{item.label}</Text>
        </Animated.View>
      </GestureDetector>
    </Animated.View>
  );
}
```

## Performance Tips

1. **Use `React.memo`** for item components to prevent unnecessary re-renders
2. **Memoize callback functions** with `useCallback`
3. **Avoid complex calculations** in render functions
4. **Use stable keys** for consistent performance
5. **Leverage throttled `onDragging`** - the hook already throttles at 50ms intervals

```tsx
// Good: Memoized component and callbacks
const MemoizedGridItem = React.memo(({ item, ...props }) => {
  const handleMove = useCallback((id, from, to) => {
    reorderItems(id, from, to);
  }, []);

  const { animatedStyle, panGestureHandler } = useGridSortable({
    id: item.id,
    ...props,
    onMove: handleMove,
  });

  return (
    <Animated.View style={[animatedStyle]}>
      <GestureDetector gesture={panGestureHandler}>
        <Animated.View style={{ flex: 1 }}>
          <ItemContent item={item} />
        </Animated.View>
      </GestureDetector>
    </Animated.View>
  );
});
```

## See Also

- [SortableGridItem Component](../../components/sortable-grid-item) - High-level component using this hook
- [useGridSortableList Hook](./useGridSortableList) - Grid list management hook
- [SortableGrid Component](../../components/sortable-grid) - Complete sortable grid solution
- [GridScrollDirection Enum](../types/grid-types#gridscrolldirection) - Auto-scroll direction values
- [UseGridSortableOptions Type](../types/grid-types#usegridsortableoptionst) - Complete type definitions
- [useSortable Hook](./useSortable) - Vertical sortable item hook equivalent
