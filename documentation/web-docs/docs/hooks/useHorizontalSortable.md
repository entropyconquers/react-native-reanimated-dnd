---
title: useHorizontalSortable
description: Hook for creating individual horizontal sortable items
---

A hook for creating horizontal sortable list items with drag-and-drop reordering capabilities. This hook provides the core functionality for individual items within a horizontal sortable list, handling drag gestures, position animations, auto-scrolling, and reordering logic.

## Import

```typescript
import { useHorizontalSortable } from "react-native-reanimated-dnd";
```

## Parameters

The hook accepts a single options object with the following properties:

| Parameter             | Type                                                                  | Required | Default | Description                                    |
| --------------------- | --------------------------------------------------------------------- | -------- | ------- | ---------------------------------------------- |
| `id`                  | `string`                                                              | Yes      | -       | Unique identifier for this sortable item       |
| `positions`           | `SharedValue<{[id: string]: number}>`                                 | Yes      | -       | Shared value containing positions of all items |
| `leftBound`           | `SharedValue<number>`                                                 | Yes      | -       | Current horizontal scroll position             |
| `autoScrollDirection` | `SharedValue<HorizontalScrollDirection>`                              | Yes      | -       | Auto-scroll direction state                    |
| `itemsCount`          | `number`                                                              | Yes      | -       | Total number of items in the list              |
| `itemWidth`           | `number`                                                              | Yes      | -       | Width of each item in pixels                   |
| `gap`                 | `number`                                                              | No       | `0`     | Gap between items in pixels                    |
| `paddingHorizontal`   | `number`                                                              | No       | `0`     | Container horizontal padding                   |
| `containerWidth`      | `number`                                                              | No       | `500`   | Container width for auto-scroll calculations   |
| `onMove`              | `(id: string, from: number, to: number) => void`                      | No       | -       | Callback when item position changes            |
| `onDragStart`         | `(id: string, position: number) => void`                              | No       | -       | Callback when dragging starts                  |
| `onDrop`              | `(id: string, position: number) => void`                              | No       | -       | Callback when dragging ends                    |
| `onDragging`          | `(id: string, overItemId: string \| null, xPosition: number) => void` | No       | -       | Callback during dragging with position updates |

## Return Value

The hook returns an object with the following properties:

| Property            | Type                   | Description                                                |
| ------------------- | ---------------------- | ---------------------------------------------------------- |
| `animatedStyle`     | `StyleProp<ViewStyle>` | Animated style for the sortable item containing transforms |
| `panGestureHandler` | `GestureType`          | Pan gesture to pass to GestureDetector                     |
| `isMoving`          | `boolean`              | Whether the item is currently being dragged                |
| `hasHandle`         | `boolean`              | Whether the item has a drag handle component               |
| `registerHandle`   | `(registered: boolean) => void` | Callback for handle registration                  |

## Basic Usage

```typescript
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import { useHorizontalSortable } from 'react-native-reanimated-dnd';

interface TagItemProps {
  tag: {
    id: string;
    label: string;
    color: string;
  };
  positions: any;
  leftBound: any;
  autoScrollDirection: any;
  itemsCount: number;
  itemWidth: number;
  gap?: number;
  paddingHorizontal?: number;
}

function HorizontalSortableTag({
  tag,
  positions,
  leftBound,
  autoScrollDirection,
  itemsCount,
  itemWidth,
  gap = 0,
  paddingHorizontal = 0
}: TagItemProps) {
  const { animatedStyle, panGestureHandler, isMoving } = useHorizontalSortable({
    id: tag.id,
    positions,
    leftBound,
    autoScrollDirection,
    itemsCount,
    itemWidth,
    gap,
    paddingHorizontal,
    onMove: (id, from, to) => {
      console.log(`Tag ${id} moved from ${from} to ${to}`);
      // Handle reordering logic here
    },
    onDragStart: (id, position) => {
      console.log(`Started dragging tag ${id} from position ${position}`);
    },
    onDrop: (id, position) => {
      console.log(`Dropped tag ${id} at position ${position}`);
    }
  });

  return (
    <GestureDetector gesture={panGestureHandler}>
      <Animated.View style={[styles.tagItem, animatedStyle]}>
        <View style={[
          styles.tagContent,
          { backgroundColor: tag.color },
          isMoving && styles.dragging
        ]}>
          <Text style={styles.tagText}>{tag.label}</Text>
        </View>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  tagItem: {
    height: 40,
  },
  tagContent: {
    flex: 1,
    paddingHorizontal: 16,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tagText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  dragging: {
    opacity: 0.8,
    transform: [{ scale: 1.05 }],
  },
});
```

## Advanced Usage with Drag Handle

```typescript
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import { useHorizontalSortable } from 'react-native-reanimated-dnd';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Handle component that will be detected by the hook
const SortableHandle = ({ children, style }) => (
  <View style={style}>{children}</View>
);

function HorizontalSortableCard({
  item,
  positions,
  leftBound,
  autoScrollDirection,
  itemsCount,
  itemWidth,
  gap = 0,
  paddingHorizontal = 0
}) {
  const { animatedStyle, panGestureHandler, hasHandle } = useHorizontalSortable({
    id: item.id,
    positions,
    leftBound,
    autoScrollDirection,
    itemsCount,
    itemWidth,
    gap,
    paddingHorizontal,
    onMove: (id, from, to) => {
      // Handle reordering
      reorderItems(id, from, to);
    }
  });

  const content = (
    <Animated.View style={[styles.card, animatedStyle]}>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardSubtitle}>{item.subtitle}</Text>

        <SortableHandle style={styles.dragHandle}>
          <Icon name="drag-handle" size={16} color="#999" />
        </SortableHandle>
      </View>
    </Animated.View>
  );

  // The GestureDetector wraps the content regardless;
  // when a handle is present, only the handle area initiates dragging.
  return (
    <GestureDetector gesture={panGestureHandler}>
      {content}
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    height: 80,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  dragHandle: {
    position: 'absolute',
    top: 4,
    right: 4,
    padding: 4,
  },
});
```

## Callback Examples

### onMove Callback

Called when the item's position changes:

```typescript
const handleMove = (id: string, from: number, to: number) => {
  console.log(`Item ${id} moved from position ${from} to ${to}`);

  // Update your data model
  setItems((prevItems) => {
    const newItems = [...prevItems];
    const [movedItem] = newItems.splice(from, 1);
    newItems.splice(to, 0, movedItem);
    return newItems;
  });

  // Analytics tracking
  analytics.track("horizontal_item_reordered", {
    itemId: id,
    fromPosition: from,
    toPosition: to,
  });
};
```

### onDragStart Callback

Called when dragging begins:

```typescript
const handleDragStart = (id: string, position: number) => {
  console.log(`Started dragging item ${id} from position ${position}`);

  // Haptic feedback
  HapticFeedback.impactAsync(HapticFeedback.ImpactFeedbackStyle.Medium);

  // Update UI state
  setDraggingItemId(id);

  // Show visual hints
  setShowDropZones(true);
};
```

### onDrop Callback

Called when dragging ends:

```typescript
const handleDrop = (id: string, position: number) => {
  console.log(`Dropped item ${id} at position ${position}`);

  // Clean up UI state
  setDraggingItemId(null);
  setShowDropZones(false);

  // Save changes
  saveItemOrder();

  // Show success feedback
  showToast("Item reordered successfully");
};
```

### onDragging Callback

Called continuously during dragging:

```typescript
const handleDragging = (
  id: string,
  overItemId: string | null,
  xPosition: number
) => {
  // Update hover states
  if (overItemId) {
    setHoveredItemId(overItemId);
  } else {
    setHoveredItemId(null);
  }

  // Custom visual feedback based on position
  if (xPosition < 100) {
    setScrollHint("left");
  } else if (xPosition > containerWidth - 100) {
    setScrollHint("right");
  } else {
    setScrollHint(null);
  }
};
```

## Auto-scrolling

The hook automatically handles horizontal scrolling when dragging near container edges:

```typescript
// Auto-scroll triggers when dragging within 60px of edges
const { animatedStyle, panGestureHandler } = useHorizontalSortable({
  id: item.id,
  positions,
  leftBound,
  autoScrollDirection, // Managed by useHorizontalSortableList
  itemsCount,
  itemWidth,
  containerWidth: 400, // Used for auto-scroll calculations
  // ... other props
});
```

## Performance Tips

1. **Memoize callbacks**: Use `useCallback` for event handlers to prevent unnecessary re-renders
2. **Optimize children**: If using drag handles, memoize the children prop
3. **Stable IDs**: Ensure item IDs are stable across re-renders
4. **Reasonable item counts**: For very large lists, consider virtualization

```typescript
const handleMove = useCallback((id: string, from: number, to: number) => {
  // Reordering logic
}, []);

const memoizedChildren = useMemo(() => (
  <CardContent item={item} />
), [item]);
```

## Integration with useHorizontalSortableList

This hook is typically used in conjunction with `useHorizontalSortableList`:

```typescript
function HorizontalSortableList() {
  const { getItemProps, ...listProps } = useHorizontalSortableList({
    data: items,
    itemWidth: 120,
    gap: 12,
    paddingHorizontal: 16,
  });

  return (
    <ScrollView {...listProps}>
      {items.map((item, index) => {
        const itemProps = getItemProps(item, index);
        return (
          <HorizontalSortableItem
            key={item.id}
            item={item}
            {...itemProps}
          />
        );
      })}
    </ScrollView>
  );
}
```

## See Also

- [useHorizontalSortableList](./useHorizontalSortableList) - For managing horizontal sortable lists
- [useSortable](./useSortable) - For vertical sortable items
- [SortableItem](../components/sortable-item) - High-level sortable item component
- [Horizontal Sortable Example](../examples/horizontal-sortable) - Complete implementation example
