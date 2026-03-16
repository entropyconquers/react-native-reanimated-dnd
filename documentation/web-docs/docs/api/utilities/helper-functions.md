---
title: "Helper Functions"
---

Utility functions for working with sortable lists, position calculations, and data transformations.

## Overview

The library provides several helper functions that are used internally but can also be useful in your application code. These functions handle common operations like position calculations, data transformations, and scroll management.

## Position Utilities

### clamp

Constrains a value between a minimum and maximum bound.

#### Signature

```tsx
function clamp(value: number, lowerBound: number, upperBound: number): number;
```

#### Parameters

- `value`: The value to constrain
- `lowerBound`: The minimum allowed value
- `upperBound`: The maximum allowed value

#### Returns

The constrained value between lowerBound and upperBound

#### Example

```tsx
import { clamp } from "react-native-reanimated-dnd";

// Basic usage
const constrainedValue = clamp(150, 0, 100); // Returns 100
const validValue = clamp(50, 0, 100); // Returns 50
const negativeValue = clamp(-10, 0, 100); // Returns 0

// In a draggable context
function BoundedSlider() {
  const [value, setValue] = useState(50);

  const handleDrag = ({ tx }) => {
    const newValue = clamp(value + tx, 0, 100);
    setValue(newValue);
  };

  return (
    <Draggable data={{ value }} onDragging={handleDrag} dragAxis="x">
      <Text>Value: {value}</Text>
    </Draggable>
  );
}
```

### setPosition

Updates the position of an item in a sortable list based on its Y coordinate.

#### Signature

```tsx
function setPosition(
  positionY: number,
  itemsCount: number,
  positions: SharedValue<{ [id: string]: number }>,
  id: string,
  itemHeight: number
): void;
```

#### Parameters

- `positionY`: Current Y position of the dragged item
- `itemsCount`: Total number of items in the list
- `positions`: Shared value containing position mapping
- `id`: Unique identifier of the item being moved
- `itemHeight`: Height of each item in pixels

#### Example

```tsx
import { setPosition } from "react-native-reanimated-dnd";

function CustomSortableItem({ id, itemHeight, positions, itemsCount }) {
  const { animatedViewProps, gesture } = useDraggable({
    data: { id },
    onDragging: ({ y, ty }) => {
      "worklet";
      const currentY = y + ty;
      setPosition(currentY, itemsCount, positions, id, itemHeight);
    },
  });

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View {...animatedViewProps}>
        <Text>Sortable Item {id}</Text>
      </Animated.View>
    </GestureDetector>
  );
}
```

## Data Transformation Utilities

### objectMove

Swaps the positions of two items in a position mapping object.

#### Signature

```tsx
function objectMove(
  object: { [id: string]: number },
  from: number,
  to: number
): { [id: string]: number };
```

#### Parameters

- `object`: Position mapping object
- `from`: Source position index
- `to`: Target position index

#### Returns

New object with swapped positions

#### Example

```tsx
import { objectMove } from "react-native-reanimated-dnd";

// Basic usage
const positions = { item1: 0, item2: 1, item3: 2 };
const newPositions = objectMove(positions, 0, 2);
// Result: { 'item1': 2, 'item2': 1, 'item3': 0 }

// In a sortable context
function CustomSortableList() {
  const [positions, setPositions] = useState({
    task1: 0,
    task2: 1,
    task3: 2,
  });

  const handleMove = (fromIndex, toIndex) => {
    const newPositions = objectMove(positions, fromIndex, toIndex);
    setPositions(newPositions);
  };

  return (
    <View>
      {Object.entries(positions)
        .sort(([, a], [, b]) => a - b)
        .map(([id, position]) => (
          <SortableItem key={id} id={id} onMove={handleMove} />
        ))}
    </View>
  );
}
```

### listToObject

Converts an array of items with `id` properties to a position mapping object.

#### Signature

```tsx
function listToObject<T extends { id: string }>(
  list: T[]
): { [id: string]: number };
```

#### Parameters

- `list`: Array of items with `id` properties

#### Returns

Object mapping item IDs to their array indices

#### Example

```tsx
import { listToObject } from "react-native-reanimated-dnd";

// Basic usage
const tasks = [
  { id: "task1", title: "First Task" },
  { id: "task2", title: "Second Task" },
  { id: "task3", title: "Third Task" },
];

const positions = listToObject(tasks);
// Result: { 'task1': 0, 'task2': 1, 'task3': 2 }

// In a sortable list setup
function TaskList() {
  const [tasks, setTasks] = useState(initialTasks);
  const positions = useSharedValue(listToObject(tasks));

  // Update positions when tasks change
  useEffect(() => {
    positions.value = listToObject(tasks);
  }, [tasks]);

  return (
    <View>
      {tasks.map((task, index) => (
        <SortableItem
          key={task.id}
          id={task.id}
          positions={positions}
          data={task}
        />
      ))}
    </View>
  );
}
```

## Scroll Utilities

### setAutoScroll

Determines the auto-scroll direction based on the current drag position.

#### Signature

```tsx
function setAutoScroll(
  positionY: number,
  lowerBound: number,
  upperBound: number,
  scrollThreshold: number,
  autoScroll: SharedValue<ScrollDirection>
): void;
```

#### Parameters

- `positionY`: Current Y position of the dragged item
- `lowerBound`: Top boundary of the scroll container
- `upperBound`: Bottom boundary of the scroll container
- `scrollThreshold`: Distance from edges to trigger auto-scroll
- `autoScroll`: Shared value to store the scroll direction

#### Example

```tsx
import { setAutoScroll, ScrollDirection } from "react-native-reanimated-dnd";

function AutoScrollContainer() {
  const scrollY = useSharedValue(0);
  const autoScrollDirection = useSharedValue(ScrollDirection.None);
  const containerHeight = 400;
  const scrollThreshold = 50;

  const handleDrag = ({ y, ty }) => {
    "worklet";
    const currentY = y + ty;
    const lowerBound = scrollY.value;
    const upperBound = scrollY.value + containerHeight;

    setAutoScroll(
      currentY,
      lowerBound,
      upperBound,
      scrollThreshold,
      autoScrollDirection
    );
  };

  return (
    <Animated.ScrollView onScroll={scrollHandler} scrollEventThrottle={16}>
      <Draggable data={{ id: "1" }} onDragging={handleDrag}>
        <Text>Auto-scrolling item</Text>
      </Draggable>
    </Animated.ScrollView>
  );
}
```

## Advanced Usage Examples

### Custom Position Manager

```tsx
import { clamp, objectMove, listToObject } from "react-native-reanimated-dnd";

class PositionManager {
  private positions: { [id: string]: number } = {};
  private itemHeight: number;
  private containerHeight: number;

  constructor(
    items: Array<{ id: string }>,
    itemHeight: number,
    containerHeight: number
  ) {
    this.positions = listToObject(items);
    this.itemHeight = itemHeight;
    this.containerHeight = containerHeight;
  }

  updatePosition(id: string, y: number): boolean {
    const maxItems = Math.floor(this.containerHeight / this.itemHeight);
    const newIndex = clamp(Math.floor(y / this.itemHeight), 0, maxItems - 1);

    const currentIndex = this.positions[id];
    if (newIndex !== currentIndex) {
      this.positions = objectMove(this.positions, currentIndex, newIndex);
      return true; // Position changed
    }
    return false; // No change
  }

  getPosition(id: string): number {
    return this.positions[id];
  }

  getAllPositions(): { [id: string]: number } {
    return { ...this.positions };
  }
}

// Usage
function ManagedSortableList() {
  const [items, setItems] = useState(initialItems);
  const positionManager = useRef(new PositionManager(items, 60, 400));

  const handleDrag = (id: string, y: number) => {
    if (positionManager.current.updatePosition(id, y)) {
      // Position changed, update UI
      const newPositions = positionManager.current.getAllPositions();
      updateItemOrder(newPositions);
    }
  };

  return (
    <View>
      {items.map((item) => (
        <Draggable
          key={item.id}
          data={item}
          onDragging={({ y, ty }) => handleDrag(item.id, y + ty)}
        >
          <Text>{item.title}</Text>
        </Draggable>
      ))}
    </View>
  );
}
```

### Smooth Scroll Controller

```tsx
import { setAutoScroll, ScrollDirection } from "react-native-reanimated-dnd";

function SmoothScrollController() {
  const scrollY = useSharedValue(0);
  const autoScrollDirection = useSharedValue(ScrollDirection.None);
  const scrollViewRef = useRef<Animated.ScrollView>(null);

  // Auto-scroll effect
  useAnimatedReaction(
    () => autoScrollDirection.value,
    (direction) => {
      if (direction !== ScrollDirection.None) {
        const scrollSpeed = 5; // pixels per frame
        const newScrollY =
          direction === ScrollDirection.Up
            ? Math.max(0, scrollY.value - scrollSpeed)
            : scrollY.value + scrollSpeed;

        scheduleOnRN(() => {
          scrollViewRef.current?.scrollTo({
            y: newScrollY,
            animated: false,
          });
        });
      }
    }
  );

  const handleScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const handleDrag = ({ y, ty }) => {
    "worklet";
    setAutoScroll(
      y + ty,
      scrollY.value,
      scrollY.value + 400, // container height
      50, // threshold
      autoScrollDirection
    );
  };

  return (
    <Animated.ScrollView
      ref={scrollViewRef}
      onScroll={handleScroll}
      scrollEventThrottle={16}
    >
      <Draggable data={{ id: "1" }} onDragging={handleDrag}>
        <Text>Smooth scrolling item</Text>
      </Draggable>
    </Animated.ScrollView>
  );
}
```

### Data Synchronization Helper

```tsx
import { listToObject, objectMove } from "react-native-reanimated-dnd";

function useDataSync<T extends { id: string }>(initialData: T[]) {
  const [data, setData] = useState(initialData);
  const positions = useSharedValue(listToObject(initialData));

  // Sync positions when data changes
  useEffect(() => {
    positions.value = listToObject(data);
  }, [data]);

  const moveItem = useCallback((fromIndex: number, toIndex: number) => {
    // Update positions
    positions.value = objectMove(positions.value, fromIndex, toIndex);

    // Update data array
    setData((prevData) => {
      const newData = [...prevData];
      const [movedItem] = newData.splice(fromIndex, 1);
      newData.splice(toIndex, 0, movedItem);
      return newData;
    });
  }, []);

  const getItemPosition = useCallback((id: string) => {
    return positions.value[id];
  }, []);

  const getSortedData = useCallback(() => {
    return data.sort((a, b) => positions.value[a.id] - positions.value[b.id]);
  }, [data]);

  return {
    data,
    positions,
    moveItem,
    getItemPosition,
    getSortedData,
    setData,
  };
}

// Usage
function SyncedSortableList() {
  const { data, positions, moveItem, getSortedData } =
    useDataSync(initialTasks);

  return (
    <View>
      {getSortedData().map((item, index) => (
        <SortableItem
          key={item.id}
          id={item.id}
          data={item}
          positions={positions}
          onMove={moveItem}
        />
      ))}
    </View>
  );
}
```

## Performance Optimization

### Worklet Utilities

All position calculation functions are marked with `'worklet'` and can run on the UI thread:

```tsx
// These functions can be used in worklets
const optimizedDragHandler = ({ y, ty }) => {
  "worklet";

  // All these functions run on UI thread
  const constrainedY = clamp(y + ty, 0, maxY);
  setPosition(constrainedY, itemCount, positions, itemId, itemHeight);
  setAutoScroll(constrainedY, lowerBound, upperBound, threshold, autoScroll);
};
```

### Batched Updates

```tsx
function BatchedPositionUpdater() {
  const pendingUpdates = useRef<Array<() => void>>([]);

  const batchUpdate = (updateFn: () => void) => {
    pendingUpdates.current.push(updateFn);

    // Process all updates in next frame
    requestAnimationFrame(() => {
      pendingUpdates.current.forEach((fn) => fn());
      pendingUpdates.current = [];
    });
  };

  const handleMultipleDrags = (items: Array<{ id: string; y: number }>) => {
    items.forEach(({ id, y }) => {
      batchUpdate(() => {
        setPosition(y, itemCount, positions, id, itemHeight);
      });
    });
  };

  return { handleMultipleDrags };
}
```

## TypeScript Support

All helper functions are fully typed:

```tsx
// Type-safe usage
interface TaskItem {
  id: string;
  title: string;
  priority: number;
}

const tasks: TaskItem[] = [
  { id: "1", title: "Task 1", priority: 1 },
  { id: "2", title: "Task 2", priority: 2 },
];

// TypeScript infers the correct types
const positions: { [id: string]: number } = listToObject(tasks);
const newPositions = objectMove(positions, 0, 1);
const clampedValue: number = clamp(150, 0, 100);
```

## See Also

- [Sortable Component](../../components/sortable) - Uses these utilities internally
- [useSortableList Hook](../../hooks/useSortableList) - Hook that uses these utilities
- [ScrollDirection Enum](../types/enums#scrolldirection) - Auto-scroll direction values
- [Animation Functions](./animation-functions) - Custom animation utilities
