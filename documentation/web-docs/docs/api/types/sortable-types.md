---
title: "Sortable Types"
---

Complete type definitions for sortable components and hooks.

## Enums

### ScrollDirection

Represents the auto-scroll direction during vertical drag operations.

```tsx
enum ScrollDirection {
  None = "none",
  Up = "up",
  Down = "down",
}
```

#### Values

- **`None`**: No auto-scrolling
- **`Up`**: Auto-scrolling upward
- **`Down`**: Auto-scrolling downward

### HorizontalScrollDirection

Represents the auto-scroll direction during horizontal drag operations.

```tsx
enum HorizontalScrollDirection {
  None = "none",
  Left = "left",
  Right = "right",
}
```

#### Values

- **`None`**: No auto-scrolling
- **`Left`**: Auto-scrolling leftward
- **`Right`**: Auto-scrolling rightward

## Interfaces

### UseSortableOptions\<T\>

Configuration options for the useSortable hook.

```tsx
interface UseSortableOptions<T> {
  id: string;
  positions: SharedValue<{ [id: string]: number }>;
  lowerBound: SharedValue<number>;
  autoScrollDirection: SharedValue<ScrollDirection>;
  itemsCount: number;
  itemHeight: number;
  containerHeight?: number;
  onMove?: (id: string, from: number, to: number) => void;
  onDragStart?: (id: string, position: number) => void;
  onDrop?: (id: string, position: number) => void;
  onDragging?: (
    id: string,
    overItemId: string | null,
    yPosition: number
  ) => void;
}
```

#### Properties

##### id

- **Type**: `string`
- **Required**: Yes
- **Description**: Unique identifier for this sortable item. Must be unique within the sortable list. Used for tracking position changes and managing reordering logic.

```tsx
const itemId = `task-${task.id}`;
```

##### positions

- **Type**: `SharedValue<{ [id: string]: number }>`
- **Required**: Yes
- **Description**: Shared value containing the current positions of all items in the sortable list. This is typically managed by the parent sortable list component.

```tsx
// Managed by useSortableList hook
const positions = useSharedValue({
  "item-1": 0,
  "item-2": 1,
  "item-3": 2,
});
```

##### lowerBound

- **Type**: `SharedValue<number>`
- **Required**: Yes
- **Description**: Shared value representing the current scroll position (lower bound) of the container. Used for auto-scrolling during drag operations.

##### autoScrollDirection

- **Type**: `SharedValue<ScrollDirection>`
- **Required**: Yes
- **Description**: Shared value indicating the current auto-scroll direction. Used to trigger automatic scrolling when dragging near container edges.

##### itemsCount

- **Type**: `number`
- **Required**: Yes
- **Description**: Total number of items in the sortable list. Used for boundary calculations and position validation.

##### itemHeight

- **Type**: `number`
- **Required**: Yes
- **Description**: Height of each item in pixels. All items must have the same height. Used for position calculations and auto-scrolling.

```tsx
const ITEM_HEIGHT = 60; // 60px per item
```

##### containerHeight

- **Type**: `number`
- **Default**: `500`
- **Description**: Height of the scrollable container in pixels. Used for auto-scroll calculations and determining scroll boundaries.

##### onMove

- **Type**: `(id: string, from: number, to: number) => void`
- **Required**: No
- **Description**: Callback fired when an item's position changes within the list. This is called for both the moved item and any items that were displaced.

```tsx
const handleMove = (id: string, from: number, to: number) => {
  console.log(`Item ${id} moved from position ${from} to ${to}`);
  // Update your data model
  reorderItems(id, from, to);
};
```

##### onDragStart

- **Type**: `(id: string, position: number) => void`
- **Required**: No
- **Description**: Callback fired when dragging starts for this item.

```tsx
const handleDragStart = (id: string, position: number) => {
  console.log(`Started dragging item ${id} from position ${position}`);
  setDraggingItem(id);
  hapticFeedback();
};
```

##### onDrop

- **Type**: `(id: string, position: number) => void`
- **Required**: No
- **Description**: Callback fired when dragging ends for this item.

```tsx
const handleDrop = (id: string, position: number) => {
  console.log(`Dropped item ${id} at position ${position}`);
  setDraggingItem(null);
  saveNewOrder();
};
```

##### onDragging

- **Type**: `(id: string, overItemId: string | null, yPosition: number) => void`
- **Required**: No
- **Description**: Callback fired continuously while dragging, providing real-time position updates. Useful for showing visual feedback or updating UI during drag operations.

```tsx
const handleDragging = (
  id: string,
  overItemId: string | null,
  yPosition: number
) => {
  if (overItemId) {
    console.log(`Item ${id} is hovering over ${overItemId}`);
    setHoverTarget(overItemId);
  } else {
    setHoverTarget(null);
  }
};
```

### UseSortableReturn

Return value from the useSortable hook.

```tsx
interface UseSortableReturn {
  animatedStyle: StyleProp<ViewStyle>;
  panGestureHandler: GestureType;
  isMoving: boolean;
  hasHandle: boolean;
  registerHandle: (registered: boolean) => void;
}
```

#### Properties

##### animatedStyle

- **Type**: `StyleProp<ViewStyle>`
- **Description**: Animated style to apply to the sortable item. Contains position transforms and visual effects for dragging state.

##### panGestureHandler

- **Type**: `GestureType`
- **Description**: Pan gesture definition for drag interactions. Attach this to a GestureDetector to enable dragging.

##### isMoving

- **Type**: `boolean`
- **Description**: Whether this item is currently being moved/dragged. Useful for conditional styling or behavior.

##### hasHandle

- **Type**: `boolean`
- **Description**: Whether this sortable item has a handle component. When true, only the handle can initiate dragging. When false, the entire item is draggable.

##### registerHandle

- **Type**: `(registered: boolean) => void`
- **Description**: Function to register or unregister a handle component. Called by the SortableHandle component to notify the sortable item that a handle is present.

### UseSortableListOptions\<TData\>

Configuration options for the useSortableList hook.

```tsx
interface UseSortableListOptions<TData> {
  data: TData[];
  itemHeight: number;
  itemKeyExtractor?: (item: TData, index: number) => string;
}
```

#### Properties

##### data

- **Type**: `TData[]`
- **Required**: Yes
- **Description**: Array of data items to be rendered as sortable list items. Each item must have an `id` property for tracking.

```tsx
const tasks = [
  { id: "1", title: "Task 1", completed: false },
  { id: "2", title: "Task 2", completed: true },
  { id: "3", title: "Task 3", completed: false },
];
```

##### itemHeight

- **Type**: `number`
- **Required**: Yes
- **Description**: Height of each item in pixels. All items must have the same height for proper position calculations and smooth animations.

```tsx
const ITEM_HEIGHT = 80; // Each list item is 80px tall
```

##### itemKeyExtractor

- **Type**: `(item: TData, index: number) => string`
- **Default**: `(item) => item.id`
- **Description**: Function to extract a unique key from each data item. If not provided, defaults to using the `id` property.

```tsx
// Custom key extractor for items without id property
const keyExtractor = (item, index) => `${item.type}-${item.name}-${index}`;

// Using a compound key
const keyExtractor = (item) => `${item.category}_${item.id}`;
```

### UseSortableListReturn\<TData\>

Return value from the useSortableList hook.

```tsx
interface UseSortableListReturn<TData> {
  positions: any;
  scrollY: any;
  autoScroll: any;
  scrollViewRef: any;
  dropProviderRef: React.RefObject<DropProviderRef | null>;
  handleScroll: any;
  handleScrollEnd: () => void;
  contentHeight: number;
  getItemProps: (item: TData, index: number) => SortableItemProps;
}
```

#### Properties

##### positions

- **Type**: `SharedValue<{ [id: string]: number }>`
- **Description**: Shared value containing the current positions of all items. Maps item IDs to their current position indices.

```tsx
// positions.value might look like:
{
  'item-1': 0,
  'item-2': 1,
  'item-3': 2
}
```

##### scrollY

- **Type**: `SharedValue<number>`
- **Description**: Shared value tracking the current scroll position. Used for auto-scrolling during drag operations.

##### autoScroll

- **Type**: `SharedValue<ScrollDirection>`
- **Description**: Shared value indicating the current auto-scroll direction. Used to trigger automatic scrolling when dragging near edges.

##### scrollViewRef

- **Type**: `React.RefObject<Animated.ScrollView>`
- **Description**: Animated ref for the scroll view component. Used for programmatic scrolling during drag operations.

##### dropProviderRef

- **Type**: `React.RefObject<DropProviderRef | null>`
- **Description**: Ref for the drop provider context. Used for triggering position updates after scroll events.

##### handleScroll

- **Type**: `(event: NativeSyntheticEvent<NativeScrollEvent>) => void`
- **Description**: Animated scroll handler to attach to the ScrollView. Tracks scroll position for auto-scroll calculations.

##### handleScrollEnd

- **Type**: `() => void`
- **Description**: Callback to call when scrolling ends. Triggers position recalculation for accurate drop zone detection.

##### contentHeight

- **Type**: `number`
- **Description**: Total height of the scrollable content. Calculated as `data.length * itemHeight`.

##### getItemProps

- **Type**: `(item: TData, index: number) => { id: string; positions: SharedValue<{[id: string]: number}>; lowerBound: SharedValue<number>; autoScrollDirection: SharedValue<ScrollDirection>; itemsCount: number; itemHeight: number; }`
- **Description**: Helper function to get core props for individual sortable items. Returns the essential props that should be spread onto SortableItem components.

```tsx
{
  data.map((item, index) => {
    const itemProps = getItemProps(item, index);
    // itemProps contains: { id, positions, lowerBound, autoScrollDirection, itemsCount, itemHeight }
    return (
      <SortableItem
        key={itemProps.id}
        {...itemProps}
        data={item}
        onMove={handleMove}
      >
        <Text>{item.title}</Text>
      </SortableItem>
    );
  });
}
```

### SortableItemProps\<T\>

Props for the SortableItem component.

```tsx
interface SortableItemProps<T> {
  id: string;
  data: T;
  positions: SharedValue<{ [id: string]: number }>;
  lowerBound: SharedValue<number>;
  autoScrollDirection: SharedValue<ScrollDirection>;
  itemsCount: number;
  itemHeight: number;
  containerHeight?: number;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  animatedStyle?: StyleProp<ViewStyle>;
  onMove?: (id: string, from: number, to: number) => void;
  onDragStart?: (id: string, position: number) => void;
  onDrop?: (id: string, position: number) => void;
  onDragging?: (
    id: string,
    overItemId: string | null,
    yPosition: number
  ) => void;
  onDraggingHorizontal?: (
    id: string,
    overItemId: string | null,
    xPosition: number
  ) => void;
}
```

#### Properties

##### id

- **Type**: `string`
- **Required**: Yes
- **Description**: Unique identifier for this sortable item.

##### data

- **Type**: `T`
- **Required**: Yes
- **Description**: Data associated with this sortable item.

##### positions

- **Type**: `SharedValue<{ [id: string]: number }>`
- **Required**: Yes
- **Description**: Shared value containing positions of all items in the list.

##### lowerBound

- **Type**: `SharedValue<number>`
- **Required**: Yes
- **Description**: Shared value representing the current scroll position.

##### autoScrollDirection

- **Type**: `SharedValue<ScrollDirection>`
- **Required**: Yes
- **Description**: Shared value indicating the current auto-scroll direction.

##### itemsCount

- **Type**: `number`
- **Required**: Yes
- **Description**: Total number of items in the sortable list.

##### itemHeight

- **Type**: `number`
- **Required**: Yes
- **Description**: Height of each item in pixels.

##### containerHeight

- **Type**: `number`
- **Required**: No
- **Description**: Height of the scrollable container (optional).

##### children

- **Type**: `ReactNode`
- **Required**: Yes
- **Description**: Child components to render inside the sortable item.

##### style

- **Type**: `StyleProp<ViewStyle>`
- **Required**: No
- **Description**: Style to apply to the item container.

##### animatedStyle

- **Type**: `StyleProp<ViewStyle>`
- **Required**: No
- **Description**: Additional animated style to apply.

##### onMove

- **Type**: `(id: string, from: number, to: number) => void`
- **Required**: No
- **Description**: Callback fired when item position changes within the list.

##### onDragStart

- **Type**: `(id: string, position: number) => void`
- **Required**: No
- **Description**: Callback fired when dragging starts for this item.

##### onDrop

- **Type**: `(id: string, position: number) => void`
- **Required**: No
- **Description**: Callback fired when dragging ends for this item.

##### onDragging

- **Type**: `(id: string, overItemId: string | null, yPosition: number) => void`
- **Required**: No
- **Description**: Callback fired continuously while dragging vertically, providing real-time position updates. Useful for showing visual feedback or updating UI during drag operations.

##### onDraggingHorizontal

- **Type**: `(id: string, overItemId: string | null, xPosition: number) => void`
- **Required**: No
- **Description**: Callback fired continuously while dragging horizontally, providing real-time position updates. Useful for showing visual feedback or updating UI during horizontal drag operations.

### SortableProps\<TData\>

Props for the Sortable component.

```tsx
interface SortableProps<TData> {
  data: TData[];
  renderItem: (props: SortableRenderItemProps<TData>) => ReactNode;
  itemHeight: number;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  itemKeyExtractor?: (item: TData, index: number) => string;
}
```

#### Properties

##### data

- **Type**: `TData[]`
- **Required**: Yes
- **Description**: Array of data items to render as sortable list.

##### renderItem

- **Type**: `(props: SortableRenderItemProps<TData>) => ReactNode`
- **Required**: Yes
- **Description**: Function to render each sortable item.

##### itemHeight

- **Type**: `number`
- **Required**: Yes
- **Description**: Height of each item in pixels.

##### style

- **Type**: `StyleProp<ViewStyle>`
- **Required**: No
- **Description**: Style to apply to the scroll view.

##### contentContainerStyle

- **Type**: `StyleProp<ViewStyle>`
- **Required**: No
- **Description**: Style to apply to the scroll view content container.

##### itemKeyExtractor

- **Type**: `(item: TData, index: number) => string`
- **Required**: No
- **Description**: Function to extract unique key from each item.

### SortableRenderItemProps\<TData\>

Props passed to the renderItem function in Sortable component.

```tsx
interface SortableRenderItemProps<TData> {
  item: TData;
  index: number;
  id: string;
  positions: SharedValue<{ [id: string]: number }>;
  lowerBound: SharedValue<number>;
  autoScrollDirection: SharedValue<ScrollDirection>;
  itemsCount: number;
  itemHeight: number;
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

- **Type**: `SharedValue<{ [id: string]: number }>`
- **Description**: Shared value containing positions of all items.

##### lowerBound

- **Type**: `SharedValue<number>`
- **Description**: Shared value representing the current scroll position.

##### autoScrollDirection

- **Type**: `SharedValue<ScrollDirection>`
- **Description**: Shared value indicating the current auto-scroll direction.

##### itemsCount

- **Type**: `number`
- **Description**: Total number of items in the list.

##### itemHeight

- **Type**: `number`
- **Description**: Height of each item in pixels.

### SortableContextValue

Context value for sortable components (used internally).

```tsx
interface SortableContextValue {
  panGestureHandler: GestureType;
  registerHandle: (registered: boolean) => void;
}
```

### SortableHandleProps

Props for the SortableHandle component.

```tsx
interface SortableHandleProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}
```

#### Properties

##### children

- **Type**: `React.ReactNode`
- **Required**: Yes
- **Description**: The content to render inside the handle.

##### style

- **Type**: `StyleProp<ViewStyle>`
- **Required**: No
- **Description**: Optional style to apply to the handle.

## Usage Examples

### Basic Sortable List

```tsx
import { useSortableList, SortableItem } from "react-native-reanimated-dnd";

interface Task {
  id: string;
  title: string;
  completed: boolean;
}

function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: "1", title: "Learn React Native", completed: false },
    { id: "2", title: "Build an app", completed: false },
    { id: "3", title: "Deploy to store", completed: false },
  ]);

  const {
    positions,
    scrollY,
    autoScroll,
    scrollViewRef,
    handleScroll,
    handleScrollEnd,
    contentHeight,
    getItemProps,
  } = useSortableList({
    data: tasks,
    itemHeight: 80,
  });

  return (
    <Animated.ScrollView
      ref={scrollViewRef}
      onScroll={handleScroll}
      onMomentumScrollEnd={handleScrollEnd}
      scrollEventThrottle={16}
      style={styles.container}
    >
      <View style={{ height: contentHeight }}>
        {tasks.map((task, index) => {
          const itemProps = getItemProps(task, index);
          return (
            <SortableItem
              key={itemProps.id}
              {...itemProps}
              onMove={(id, from, to) => {
                // Update task order
                const newTasks = [...tasks];
                const [movedTask] = newTasks.splice(from, 1);
                newTasks.splice(to, 0, movedTask);
                setTasks(newTasks);
              }}
            >
              <TaskCard task={task} />
            </SortableItem>
          );
        })}
      </View>
    </Animated.ScrollView>
  );
}
```

### Sortable with Handle

```tsx
import { SortableItem, SortableHandle } from "react-native-reanimated-dnd";

function TaskCard({ task }: { task: Task }) {
  return (
    <View style={styles.taskCard}>
      <SortableHandle style={styles.handle}>
        <Icon name="drag-handle" size={20} color="#666" />
      </SortableHandle>

      <View style={styles.content}>
        <Text style={styles.title}>{task.title}</Text>
        <Text style={styles.status}>
          {task.completed ? "Completed" : "Pending"}
        </Text>
      </View>

      <TouchableOpacity onPress={() => toggleTask(task.id)}>
        <Icon
          name={task.completed ? "check-circle" : "circle"}
          size={24}
          color={task.completed ? "#22c55e" : "#d1d5db"}
        />
      </TouchableOpacity>
    </View>
  );
}
```

### Advanced Sortable with Callbacks

```tsx
function AdvancedTaskList() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [analytics, setAnalytics] = useState({
    totalMoves: 0,
    averageMoveDistance: 0,
  });

  const { getItemProps, ...listProps } = useSortableList({
    data: tasks,
    itemHeight: 80,
    itemKeyExtractor: (item) => `task-${item.id}`,
  });

  const handleMove = useCallback(
    (id: string, from: number, to: number) => {
      // Update analytics
      const distance = Math.abs(to - from);
      setAnalytics((prev) => ({
        totalMoves: prev.totalMoves + 1,
        averageMoveDistance: (prev.averageMoveDistance + distance) / 2,
      }));

      // Update task order
      setTasks((prev) => {
        const newTasks = [...prev];
        const [movedTask] = newTasks.splice(from, 1);
        newTasks.splice(to, 0, movedTask);
        return newTasks;
      });

      // Save to backend
      saveTaskOrder(tasks);
    },
    [tasks]
  );

  const handleDragStart = useCallback((id: string, position: number) => {
    setDraggedItem(id);
    hapticFeedback();
    console.log(`Started dragging task ${id} from position ${position}`);
  }, []);

  const handleDrop = useCallback((id: string, position: number) => {
    setDraggedItem(null);
    console.log(`Dropped task ${id} at position ${position}`);
  }, []);

  const handleDragging = useCallback(
    (id: string, overItemId: string | null, yPosition: number) => {
      if (overItemId && overItemId !== id) {
        // Show visual feedback for the item being hovered over
        setHoverTarget(overItemId);
      } else {
        setHoverTarget(null);
      }
    },
    []
  );

  return (
    <View style={styles.container}>
      <View style={styles.analytics}>
        <Text>Total Moves: {analytics.totalMoves}</Text>
        <Text>Avg Distance: {analytics.averageMoveDistance.toFixed(1)}</Text>
      </View>

      <Animated.ScrollView {...listProps}>
        <View style={{ height: listProps.contentHeight }}>
          {tasks.map((task, index) => {
            const itemProps = getItemProps(task, index);
            const isDragging = draggedItem === task.id;
            const isHovered = hoverTarget === task.id;

            return (
              <SortableItem
                key={itemProps.id}
                {...itemProps}
                onMove={handleMove}
                onDragStart={handleDragStart}
                onDrop={handleDrop}
                onDragging={handleDragging}
                style={[
                  styles.item,
                  isDragging && styles.draggingItem,
                  isHovered && styles.hoveredItem,
                ]}
              >
                <TaskCard task={task} />
              </SortableItem>
            );
          })}
        </View>
      </Animated.ScrollView>
    </View>
  );
}
```

### Custom Key Extractor

```tsx
interface FileItem {
  name: string;
  type: "folder" | "file";
  size?: number;
  path: string;
}

function FileList() {
  const [files, setFiles] = useState<FileItem[]>(fileData);

  const { getItemProps, ...listProps } = useSortableList({
    data: files,
    itemHeight: 60,
    // Custom key extractor for items without id property
    itemKeyExtractor: (item, index) => `${item.type}-${item.name}-${index}`,
  });

  return (
    <Animated.ScrollView {...listProps}>
      <View style={{ height: listProps.contentHeight }}>
        {files.map((file, index) => {
          const itemProps = getItemProps(file, index);
          return (
            <SortableItem
              key={itemProps.id}
              {...itemProps}
              onMove={(id, from, to) => {
                const newFiles = [...files];
                const [movedFile] = newFiles.splice(from, 1);
                newFiles.splice(to, 0, movedFile);
                setFiles(newFiles);
              }}
            >
              <FileCard file={file} />
            </SortableItem>
          );
        })}
      </View>
    </Animated.ScrollView>
  );
}
```

### High-Level Sortable Component

```tsx
function SimpleSortableList() {
  const [items, setItems] = useState(initialItems);

  return (
    <Sortable
      data={items}
      itemHeight={70}
      renderItem={({ item, id, positions, ...props }) => (
        <SortableItem
          id={id}
          positions={positions}
          {...props}
          onMove={(id, from, to) => {
            const newItems = [...items];
            const [movedItem] = newItems.splice(from, 1);
            newItems.splice(to, 0, movedItem);
            setItems(newItems);
          }}
        >
          <ItemCard item={item} />
        </SortableItem>
      )}
      style={styles.list}
      contentContainerStyle={styles.content}
    />
  );
}
```

## Horizontal Sortable Types

### UseHorizontalSortableOptions\<T\>

Configuration options for the useHorizontalSortable hook.

```tsx
interface UseHorizontalSortableOptions<T> {
  id: string;
  positions: SharedValue<{ [id: string]: number }>;
  leftBound: SharedValue<number>;
  autoScrollDirection: SharedValue<HorizontalScrollDirection>;
  itemsCount: number;
  itemWidth: number;
  gap?: number;
  paddingHorizontal?: number;
  containerWidth?: number;
  onMove?: (id: string, from: number, to: number) => void;
  onDragStart?: (id: string, position: number) => void;
  onDrop?: (id: string, position: number) => void;
  onDragging?: (
    id: string,
    overItemId: string | null,
    xPosition: number
  ) => void;
}
```

#### Key Differences from Vertical

- **`leftBound`**: Tracks horizontal scroll position instead of vertical
- **`autoScrollDirection`**: Uses `HorizontalScrollDirection` enum
- **`itemWidth`**: Required instead of `itemHeight`
- **`gap`**: Horizontal spacing between items
- **`paddingHorizontal`**: Container horizontal padding
- **`containerWidth`**: Container width for auto-scroll calculations
- **`onDragging`**: Provides `xPosition` instead of `yPosition`

### UseHorizontalSortableReturn

Return value from the useHorizontalSortable hook.

```tsx
interface UseHorizontalSortableReturn {
  animatedStyle: StyleProp<ViewStyle>;
  panGestureHandler: GestureType;
  isMoving: boolean;
  hasHandle: boolean;
  registerHandle: (registered: boolean) => void;
}
```

### UseHorizontalSortableListOptions\<TData\>

Configuration options for the useHorizontalSortableList hook.

```tsx
interface UseHorizontalSortableListOptions<TData> {
  data: TData[];
  itemWidth: number;
  gap?: number;
  paddingHorizontal?: number;
  itemKeyExtractor?: (item: TData, index: number) => string;
}
```

### UseHorizontalSortableListReturn\<TData\>

Return value from the useHorizontalSortableList hook.

```tsx
interface UseHorizontalSortableListReturn<TData> {
  positions: SharedValue<{ [id: string]: number }>;
  scrollX: SharedValue<number>;
  autoScroll: SharedValue<HorizontalScrollDirection>;
  scrollViewRef: React.RefObject<Animated.ScrollView>;
  dropProviderRef: React.RefObject<DropProviderRef | null>;
  handleScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  handleScrollEnd: () => void;
  contentWidth: number;
  getItemProps: (item: TData, index: number) => HorizontalItemProps;
}
```

#### Key Differences from Vertical

- **`scrollX`**: Tracks horizontal scroll instead of `scrollY`
- **`autoScroll`**: Uses `HorizontalScrollDirection`
- **`contentWidth`**: Total content width instead of `contentHeight`
- **`getItemProps`**: Returns horizontal-specific props

### HorizontalItemProps

Props returned by `getItemProps` for horizontal sortable items.

```tsx
interface HorizontalItemProps {
  id: string;
  positions: SharedValue<{ [id: string]: number }>;
  leftBound: SharedValue<number>;
  autoScrollDirection: SharedValue<HorizontalScrollDirection>;
  itemsCount: number;
  itemWidth: number;
  gap: number;
  paddingHorizontal: number;
}
```

## See Also

- [Sortable Component](../../components/sortable) - Component documentation
- [SortableItem Component](../../components/sortable-item) - Item component documentation
- [useSortable Hook](../../hooks/useSortable) - Individual vertical item hook
- [useHorizontalSortable Hook](../../hooks/useHorizontalSortable) - Individual horizontal item hook
- [useSortableList Hook](../../hooks/useSortableList) - Vertical list management hook
- [useHorizontalSortableList Hook](../../hooks/useHorizontalSortableList) - Horizontal list management hook
- [Draggable Types](./draggable-types) - Related draggable types
