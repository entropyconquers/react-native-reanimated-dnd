---
title: "Enums"
---

Complete enumeration definitions used throughout the library.

## DraggableState

Represents the different states a draggable item can be in during its lifecycle.

```tsx
enum DraggableState {
  /** Item is at rest in its original or dropped position */
  IDLE = "IDLE",
  /** Item is currently being dragged by the user */
  DRAGGING = "DRAGGING",
  /** Item has been successfully dropped on a valid drop zone */
  DROPPED = "DROPPED",
}
```

### Values

#### IDLE

- **Value**: `"IDLE"`
- **Description**: Item is at rest in its original or dropped position. This is the default state when the item is not being interacted with.

#### DRAGGING

- **Value**: `"DRAGGING"`
- **Description**: Item is currently being dragged by the user. The item is actively following the user's finger/cursor movement.

#### DROPPED

- **Value**: `"DROPPED"`
- **Description**: Item has been successfully dropped on a valid drop zone. This state is typically brief, as the item usually transitions back to IDLE after the drop animation completes.

### Usage Examples

#### State Change Handling

```tsx
import { DraggableState } from "react-native-reanimated-dnd";

function TaskItem({ task }: { task: TaskData }) {
  const [currentState, setCurrentState] = useState<DraggableState>(
    DraggableState.IDLE
  );

  const handleStateChange = (state: DraggableState) => {
    setCurrentState(state);

    switch (state) {
      case DraggableState.IDLE:
        console.log("Task is at rest");
        setItemOpacity(1.0);
        break;

      case DraggableState.DRAGGING:
        console.log("Task is being dragged");
        setItemOpacity(0.8);
        hapticFeedback();
        break;

      case DraggableState.DROPPED:
        console.log("Task was successfully dropped");
        showSuccessAnimation();
        playDropSound();
        break;
    }
  };

  return (
    <Draggable data={task} onStateChange={handleStateChange}>
      <View
        style={[
          styles.taskItem,
          currentState === DraggableState.DRAGGING && styles.dragging,
          currentState === DraggableState.DROPPED && styles.dropped,
        ]}
      >
        <Text>{task.title}</Text>
      </View>
    </Draggable>
  );
}
```

#### Conditional Rendering Based on State

```tsx
function DraggableCard({ data }: { data: CardData }) {
  const [state, setState] = useState<DraggableState>(DraggableState.IDLE);

  const renderStateIndicator = () => {
    switch (state) {
      case DraggableState.IDLE:
        return <Icon name="grip-vertical" color="#666" />;
      case DraggableState.DRAGGING:
        return <Icon name="move" color="#3b82f6" />;
      case DraggableState.DROPPED:
        return <Icon name="check" color="#22c55e" />;
      default:
        return null;
    }
  };

  return (
    <Draggable data={data} onStateChange={setState}>
      <View style={styles.card}>
        <View style={styles.header}>
          {renderStateIndicator()}
          <Text style={styles.title}>{data.title}</Text>
        </View>

        {state === DraggableState.DRAGGING && (
          <View style={styles.dragOverlay}>
            <Text style={styles.dragText}>Release to drop</Text>
          </View>
        )}

        <Text style={styles.content}>{data.content}</Text>
      </View>
    </Draggable>
  );
}
```

#### Analytics and State Tracking

```tsx
function useAnalytics() {
  const [analytics, setAnalytics] = useState({
    totalDrags: 0,
    totalDrops: 0,
    averageDragDuration: 0,
    stateHistory: [] as Array<{ state: DraggableState; timestamp: number }>,
  });

  const trackStateChange = useCallback((state: DraggableState) => {
    const timestamp = Date.now();

    setAnalytics((prev) => {
      const newHistory = [...prev.stateHistory, { state, timestamp }];

      // Calculate metrics
      let totalDrags = prev.totalDrags;
      let totalDrops = prev.totalDrops;
      let averageDragDuration = prev.averageDragDuration;

      if (state === DraggableState.DRAGGING) {
        totalDrags++;
      } else if (state === DraggableState.DROPPED) {
        totalDrops++;

        // Calculate drag duration
        const dragStart = newHistory
          .slice()
          .reverse()
          .find((entry) => entry.state === DraggableState.DRAGGING);

        if (dragStart) {
          const duration = timestamp - dragStart.timestamp;
          averageDragDuration = (averageDragDuration + duration) / 2;
        }
      }

      return {
        totalDrags,
        totalDrops,
        averageDragDuration,
        stateHistory: newHistory.slice(-100), // Keep last 100 entries
      };
    });
  }, []);

  return { analytics, trackStateChange };
}
```

## ScrollDirection

Represents the auto-scroll direction during drag operations in sortable lists.

```tsx
enum ScrollDirection {
  None = "none",
  Up = "up",
  Down = "down",
}
```

### Values

#### None

- **Value**: `"none"`
- **Description**: No auto-scrolling is occurring. The dragged item is not near the edges of the scrollable container.

#### Up

- **Value**: `"up"`
- **Description**: Auto-scrolling upward. The dragged item is near the top edge of the container, triggering automatic upward scrolling.

#### Down

- **Value**: `"down"`
- **Description**: Auto-scrolling downward. The dragged item is near the bottom edge of the container, triggering automatic downward scrolling.

### Usage Examples

#### Auto-Scroll Indicator

```tsx
import { ScrollDirection } from "react-native-reanimated-dnd";

function AutoScrollIndicator({ direction }: { direction: ScrollDirection }) {
  if (direction === ScrollDirection.None) {
    return null;
  }

  return (
    <View
      style={[
        styles.scrollIndicator,
        direction === ScrollDirection.Up ? styles.scrollUp : styles.scrollDown,
      ]}
    >
      <Icon
        name={direction === ScrollDirection.Up ? "chevron-up" : "chevron-down"}
        size={20}
        color="#3b82f6"
      />
      <Text style={styles.scrollText}>Auto-scrolling {direction}</Text>
    </View>
  );
}
```

#### Scroll Direction Monitoring

```tsx
function SortableListWithIndicator() {
  const [scrollDirection, setScrollDirection] = useState<ScrollDirection>(
    ScrollDirection.None
  );

  const { autoScroll, getItemProps, ...listProps } = useSortableList({
    data: items,
    itemHeight: 80,
  });

  // Monitor scroll direction changes
  useEffect(() => {
    const unsubscribe = autoScroll.addListener(({ value }) => {
      setScrollDirection(value as ScrollDirection);
    });

    return unsubscribe;
  }, [autoScroll]);

  return (
    <View style={styles.container}>
      <AutoScrollIndicator direction={scrollDirection} />

      <Animated.ScrollView {...listProps}>
        <View style={{ height: listProps.contentHeight }}>
          {items.map((item, index) => {
            const itemProps = getItemProps(item, index);
            return (
              <SortableItem key={itemProps.id} {...itemProps}>
                <ItemCard item={item} />
              </SortableItem>
            );
          })}
        </View>
      </Animated.ScrollView>

      {scrollDirection !== ScrollDirection.None && (
        <View style={styles.scrollOverlay}>
          <Text>Scrolling {scrollDirection}...</Text>
        </View>
      )}
    </View>
  );
}
```

#### Custom Auto-Scroll Behavior

```tsx
function CustomSortableList() {
  const [scrollDirection, setScrollDirection] = useState<ScrollDirection>(
    ScrollDirection.None
  );
  const [scrollSpeed, setScrollSpeed] = useState(0);

  const handleScrollDirectionChange = useCallback(
    (direction: ScrollDirection) => {
      setScrollDirection(direction);

      // Adjust scroll speed based on direction
      switch (direction) {
        case ScrollDirection.None:
          setScrollSpeed(0);
          break;
        case ScrollDirection.Up:
          setScrollSpeed(-50); // Negative for upward
          break;
        case ScrollDirection.Down:
          setScrollSpeed(50); // Positive for downward
          break;
      }

      // Provide haptic feedback
      if (direction !== ScrollDirection.None) {
        hapticFeedback("light");
      }
    },
    []
  );

  const getScrollIndicatorStyle = () => {
    const baseStyle = styles.scrollIndicator;

    switch (scrollDirection) {
      case ScrollDirection.Up:
        return [baseStyle, styles.scrollUp, { opacity: 0.8 }];
      case ScrollDirection.Down:
        return [baseStyle, styles.scrollDown, { opacity: 0.8 }];
      default:
        return [baseStyle, { opacity: 0 }];
    }
  };

  return (
    <View style={styles.container}>
      <Animated.View style={getScrollIndicatorStyle()}>
        <Text>Auto-scroll: {scrollDirection}</Text>
        <Text>Speed: {Math.abs(scrollSpeed)}px/s</Text>
      </Animated.View>

      {/* Your sortable list implementation */}
    </View>
  );
}
```

#### Scroll Direction Analytics

```tsx
function useScrollAnalytics() {
  const [analytics, setAnalytics] = useState({
    totalScrollEvents: 0,
    upScrollCount: 0,
    downScrollCount: 0,
    averageScrollDuration: 0,
    scrollHistory: [] as Array<{
      direction: ScrollDirection;
      timestamp: number;
      duration?: number;
    }>,
  });

  const trackScrollDirection = useCallback((direction: ScrollDirection) => {
    const timestamp = Date.now();

    setAnalytics((prev) => {
      const newHistory = [...prev.scrollHistory];

      if (direction === ScrollDirection.None) {
        // End of scroll - calculate duration
        const lastScroll = newHistory[newHistory.length - 1];
        if (lastScroll && !lastScroll.duration) {
          lastScroll.duration = timestamp - lastScroll.timestamp;
        }
      } else {
        // Start of new scroll
        newHistory.push({ direction, timestamp });
      }

      // Calculate metrics
      const totalScrollEvents = newHistory.length;
      const upScrollCount = newHistory.filter(
        (s) => s.direction === ScrollDirection.Up
      ).length;
      const downScrollCount = newHistory.filter(
        (s) => s.direction === ScrollDirection.Down
      ).length;

      const completedScrolls = newHistory.filter((s) => s.duration);
      const averageScrollDuration =
        completedScrolls.length > 0
          ? completedScrolls.reduce((sum, s) => sum + (s.duration || 0), 0) /
            completedScrolls.length
          : 0;

      return {
        totalScrollEvents,
        upScrollCount,
        downScrollCount,
        averageScrollDuration,
        scrollHistory: newHistory.slice(-50), // Keep last 50 entries
      };
    });
  }, []);

  return { analytics, trackScrollDirection };
}
```

## Type Guards

Utility functions for type checking with enums.

### isDraggableState

```tsx
function isDraggableState(value: any): value is DraggableState {
  return Object.values(DraggableState).includes(value);
}

// Usage
function handleUnknownState(state: unknown) {
  if (isDraggableState(state)) {
    // state is now typed as DraggableState
    console.log(`Valid draggable state: ${state}`);
  } else {
    console.error("Invalid draggable state:", state);
  }
}
```

### isScrollDirection

```tsx
function isScrollDirection(value: any): value is ScrollDirection {
  return Object.values(ScrollDirection).includes(value);
}

// Usage
function handleScrollEvent(direction: unknown) {
  if (isScrollDirection(direction)) {
    // direction is now typed as ScrollDirection
    updateScrollIndicator(direction);
  } else {
    console.error("Invalid scroll direction:", direction);
  }
}
```

## Enum Utilities

### State Transitions

```tsx
const VALID_STATE_TRANSITIONS: Record<DraggableState, DraggableState[]> = {
  [DraggableState.IDLE]: [DraggableState.DRAGGING],
  [DraggableState.DRAGGING]: [DraggableState.DROPPED, DraggableState.IDLE],
  [DraggableState.DROPPED]: [DraggableState.IDLE],
};

function isValidStateTransition(
  from: DraggableState,
  to: DraggableState
): boolean {
  return VALID_STATE_TRANSITIONS[from].includes(to);
}

// Usage
function validateStateChange(
  currentState: DraggableState,
  newState: DraggableState
) {
  if (!isValidStateTransition(currentState, newState)) {
    console.warn(`Invalid state transition: ${currentState} -> ${newState}`);
    return false;
  }
  return true;
}
```

### Enum Mapping

```tsx
const STATE_COLORS: Record<DraggableState, string> = {
  [DraggableState.IDLE]: "#6b7280",
  [DraggableState.DRAGGING]: "#3b82f6",
  [DraggableState.DROPPED]: "#22c55e",
};

const SCROLL_ICONS: Record<ScrollDirection, string> = {
  [ScrollDirection.None]: "minus",
  [ScrollDirection.Up]: "chevron-up",
  [ScrollDirection.Down]: "chevron-down",
};

// Usage
function getStateColor(state: DraggableState): string {
  return STATE_COLORS[state];
}

function getScrollIcon(direction: ScrollDirection): string {
  return SCROLL_ICONS[direction];
}
```

## See Also

- [Draggable Types](./draggable-types) - Types that use DraggableState
- [Sortable Types](./sortable-types) - Types that use ScrollDirection
- [Draggable Component](../../components/draggable) - Component that uses DraggableState
- [Sortable Component](../../components/sortable) - Component that uses ScrollDirection
