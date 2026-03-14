---
title: useHorizontalSortableList
description: Hook for managing horizontal sortable lists
---

A hook for managing horizontal sortable lists with drag-and-drop reordering capabilities. This hook provides the foundational state management and utilities needed to create horizontal sortable lists, handling position tracking, scroll synchronization, auto-scrolling, gap management, and providing helper functions for individual sortable items.

## Import

```typescript
import { useHorizontalSortableList } from "react-native-reanimated-dnd";
```

## Parameters

The hook accepts a single options object with the following properties:

| Parameter           | Type                                     | Required | Default           | Description                                                   |
| ------------------- | ---------------------------------------- | -------- | ----------------- | ------------------------------------------------------------- |
| `data`              | `TData[]`                                | ✅       | -                 | Array of data items to render as sortable items               |
| `itemWidth`         | `number`                                 | ✅       | -                 | Width of each item in pixels (all items must have same width) |
| `gap`               | `number`                                 | ❌       | `0`               | Gap between items in pixels                                   |
| `paddingHorizontal` | `number`                                 | ❌       | `0`               | Container horizontal padding in pixels                        |
| `itemKeyExtractor`  | `(item: TData, index: number) => string` | ❌       | `item => item.id` | Function to extract unique key from each item                 |

## Return Value

The hook returns an object with the following properties:

| Property          | Type                                     | Description                                     |
| ----------------- | ---------------------------------------- | ----------------------------------------------- |
| `positions`       | `SharedValue<{[id: string]: number}>`    | Current positions of all items mapped by ID     |
| `scrollX`         | `SharedValue<number>`                    | Current horizontal scroll position              |
| `autoScroll`      | `SharedValue<HorizontalScrollDirection>` | Auto-scroll direction state                     |
| `scrollViewRef`   | `AnimatedRef`                            | Ref for the scroll view component               |
| `dropProviderRef` | `RefObject<DropProviderRef>`             | Ref for the drop provider context               |
| `handleScroll`    | `any`                                    | Scroll handler to attach to ScrollView          |
| `handleScrollEnd` | `() => void`                             | Callback for scroll end events                  |
| `contentWidth`    | `number`                                 | Total width of scrollable content               |
| `getItemProps`    | `(item: TData, index: number) => object` | Helper function to get props for sortable items |

## getItemProps Function

The `getItemProps` function returns an object with the following properties for each sortable item:

```typescript
{
  id: string; // Unique identifier
  positions: SharedValue<{ [id: string]: number }>; // Positions map
  leftBound: SharedValue<number>; // Scroll position
  autoScrollDirection: SharedValue<HorizontalScrollDirection>; // Auto-scroll state
  itemsCount: number; // Total item count
  itemWidth: number; // Item width
  gap: number; // Gap between items
  paddingHorizontal: number; // Container padding
}
```

## Basic Usage

```typescript
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import {
  useHorizontalSortableList,
  DropProvider
} from 'react-native-reanimated-dnd';
import { HorizontalSortableItem } from './HorizontalSortableItem';

interface Tag {
  id: string;
  label: string;
  color: string;
}

function HorizontalTagList() {
  const [tags, setTags] = useState<Tag[]>([
    { id: '1', label: 'React', color: '#61dafb' },
    { id: '2', label: 'TypeScript', color: '#3178c6' },
    { id: '3', label: 'React Native', color: '#0fa5e9' },
    { id: '4', label: 'JavaScript', color: '#f7df1e' },
    { id: '5', label: 'Node.js', color: '#339933' },
  ]);

  const {
    scrollViewRef,
    dropProviderRef,
    handleScroll,
    handleScrollEnd,
    contentWidth,
    getItemProps,
  } = useHorizontalSortableList({
    data: tags,
    itemWidth: 120,
    gap: 10,
    paddingHorizontal: 16,
  });

  return (
    <GestureHandlerRootView style={styles.container}>
      <DropProvider ref={dropProviderRef}>
        <Animated.ScrollView
          ref={scrollViewRef}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          horizontal={true}
          style={styles.scrollView}
          contentContainerStyle={{ width: contentWidth }}
          onScrollEndDrag={handleScrollEnd}
          onMomentumScrollEnd={handleScrollEnd}
          showsHorizontalScrollIndicator={false}
        >
          {tags.map((tag, index) => {
            const itemProps = getItemProps(tag, index);
            return (
              <HorizontalSortableItem key={tag.id} {...itemProps}>
                <View style={[styles.tagItem, { backgroundColor: tag.color }]}>
                  <Text style={styles.tagText}>{tag.label}</Text>
                </View>
              </HorizontalSortableItem>
            );
          })}
        </Animated.ScrollView>
      </DropProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    height: 60,
  },
  tagItem: {
    height: 40,
    paddingHorizontal: 16,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tagText: {
    color: 'white',
    fontWeight: '600',
  },
});
```

## Advanced Usage with Reordering

```typescript
import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useHorizontalSortableList } from 'react-native-reanimated-dnd';

interface Category {
  id: string;
  name: string;
  icon: string;
  count: number;
}

function ReorderableCategoryList() {
  const [categories, setCategories] = useState<Category[]>([
    { id: '1', name: 'Work', icon: 'work', count: 12 },
    { id: '2', name: 'Personal', icon: 'person', count: 8 },
    { id: '3', name: 'Shopping', icon: 'shopping-cart', count: 5 },
    { id: '4', name: 'Health', icon: 'favorite', count: 3 },
    { id: '5', name: 'Travel', icon: 'flight', count: 7 },
  ]);

  // Handle reordering when items are moved
  const handleReorder = useCallback((id: string, from: number, to: number) => {
    setCategories(prevCategories => {
      const newCategories = [...prevCategories];
      const [movedCategory] = newCategories.splice(from, 1);
      newCategories.splice(to, 0, movedCategory);
      return newCategories;
    });

    // Save to persistent storage
    saveCategoryOrder(newCategories);

    // Analytics
    analytics.track('category_reordered', {
      categoryId: id,
      fromPosition: from,
      toPosition: to
    });
  }, []);

  const sortableProps = useHorizontalSortableList({
    data: categories,
    itemWidth: 140,
    gap: 16,
    paddingHorizontal: 20,
  });

  return (
    <HorizontalSortableContainer {...sortableProps}>
      {categories.map((category, index) => {
        const itemProps = sortableProps.getItemProps(category, index);
        return (
          <HorizontalSortableItem
            key={category.id}
            {...itemProps}
            onMove={handleReorder}
          >
            <CategoryCard category={category} />
          </HorizontalSortableItem>
        );
      })}
    </HorizontalSortableContainer>
  );
}
```

## Custom Key Extractor

For items that don't have an `id` property, provide a custom key extractor:

```typescript
interface CustomItem {
  uuid: string;
  name: string;
  order: number;
}

const { getItemProps, ...listProps } = useHorizontalSortableList({
  data: customItems,
  itemWidth: 100,
  gap: 8,
  itemKeyExtractor: (item) => item.uuid, // Use uuid instead of id
});
```

## Content Width Calculation

The hook automatically calculates the total content width based on your configuration:

```typescript
// For 5 items with width 120, gap 10, padding 16:
// contentWidth = (5 * 120) + (4 * 10) + (2 * 16) = 672px

const { contentWidth } = useHorizontalSortableList({
  data: items, // 5 items
  itemWidth: 120, // Each item is 120px wide
  gap: 10, // 10px gap between items
  paddingHorizontal: 16, // 16px padding on each side
});

console.log(contentWidth); // 672
```

## Auto-scrolling Configuration

The hook manages auto-scrolling automatically when items are dragged near container edges:

```typescript
const {
  autoScroll, // Current auto-scroll direction
  scrollX, // Current scroll position
  handleScroll, // Scroll event handler
} = useHorizontalSortableList({
  data: items,
  itemWidth: 120,
  // Auto-scroll triggers when dragging within 60px of edges
});

// Auto-scroll directions:
// - HorizontalScrollDirection.None: No scrolling
// - HorizontalScrollDirection.Left: Scrolling left
// - HorizontalScrollDirection.Right: Scrolling right
```

## Performance Optimization

### Memoization

```typescript
const memoizedData = useMemo(
  () => items.map((item) => ({ ...item, processed: true })),
  [items]
);

const sortableProps = useHorizontalSortableList({
  data: memoizedData,
  itemWidth: 120,
  gap: 10,
});
```

### Callback Optimization

```typescript
const handleReorder = useCallback((id: string, from: number, to: number) => {
  // Reordering logic
}, []);

const getItemProps = useCallback(
  (item, index) => {
    const baseProps = sortableProps.getItemProps(item, index);
    return {
      ...baseProps,
      onMove: handleReorder,
    };
  },
  [sortableProps.getItemProps, handleReorder]
);
```

## Integration with High-Level Components

This hook is used internally by the `Sortable` component when `direction="horizontal"`:

```typescript
// These are equivalent:

// Using the hook directly
const listProps = useHorizontalSortableList({
  data: items,
  itemWidth: 120,
  gap: 10,
});

// Using the high-level Sortable component
<Sortable
  data={items}
  direction="horizontal"
  itemWidth={120}
  gap={10}
  renderItem={renderItem}
/>
```

## Error Handling

The hook includes validation for required parameters:

```typescript
// This will throw an error - itemWidth is required
const { getItemProps } = useHorizontalSortableList({
  data: items,
  // itemWidth: 120, // Missing required prop
});

// This will work correctly
const { getItemProps } = useHorizontalSortableList({
  data: items,
  itemWidth: 120, // Required for horizontal layout
  gap: 10,
  paddingHorizontal: 16,
});
```

## Common Patterns

### Loading States

```typescript
function HorizontalListWithLoading() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const sortableProps = useHorizontalSortableList({
    data: items,
    itemWidth: 120,
    gap: 10,
  });

  if (loading) {
    return <LoadingSpinner />;
  }

  if (items.length === 0) {
    return <EmptyState />;
  }

  return <HorizontalSortableList {...sortableProps} />;
}
```

### Dynamic Item Widths

```typescript
// All items must have the same width, but you can calculate it dynamically
const itemWidth = useMemo(() => {
  const containerWidth = Dimensions.get("window").width;
  const availableWidth = containerWidth - paddingHorizontal * 2;
  const itemsPerView = 3;
  const totalGaps = (itemsPerView - 1) * gap;
  return (availableWidth - totalGaps) / itemsPerView;
}, []);

const sortableProps = useHorizontalSortableList({
  data: items,
  itemWidth,
  gap: 10,
  paddingHorizontal: 20,
});
```

## Troubleshooting

### Items Not Positioning Correctly

- Ensure `itemWidth` is set correctly and matches your item components
- Verify that all items have the same width
- Check `gap` and `paddingHorizontal` values

### Auto-scroll Not Working

- Make sure the content width exceeds the container width
- Verify that scroll events are being handled correctly
- Check that drag gestures aren't being blocked by other components

### Performance Issues

- Use `React.memo` for item components
- Memoize callback functions with `useCallback`
- Consider reducing the number of items for very large lists

## See Also

- [useSortableList](./useSortableList) - For vertical sortable lists
- [useHorizontalSortable](./useHorizontalSortable) - For individual horizontal sortable items
- [Sortable](../components/sortable) - High-level sortable component
- [Horizontal Sortable Example](../examples/horizontal-sortable) - Complete implementation example
