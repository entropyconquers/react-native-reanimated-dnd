---
title: useHorizontalSortableList
description: API reference for the useHorizontalSortableList hook
---

Hook for managing horizontal sortable lists with drag-and-drop reordering capabilities.

## Import

```typescript
import { useHorizontalSortableList } from "react-native-reanimated-dnd";
```

## Type Signature

```typescript
function useHorizontalSortableList<TData extends { id: string }>(
  options: UseHorizontalSortableListOptions<TData>
): UseHorizontalSortableListReturn<TData>;
```

## Parameters

### UseHorizontalSortableListOptions\<TData\>

| Property            | Type                                     | Required | Default           | Description                                     |
| ------------------- | ---------------------------------------- | -------- | ----------------- | ----------------------------------------------- |
| `data`              | `TData[]`                                | Yes      | -                 | Array of data items to render as sortable items |
| `itemWidth`         | `number`                                 | Yes      | -                 | Width of each item in pixels                    |
| `gap`               | `number`                                 | No       | `0`               | Gap between items in pixels                     |
| `paddingHorizontal` | `number`                                 | No       | `0`               | Container horizontal padding in pixels          |
| `itemKeyExtractor`  | `(item: TData, index: number) => string` | No       | `item => item.id` | Function to extract unique key from each item   |

## Return Value

### UseHorizontalSortableListReturn\<TData\>

| Property          | Type                                        | Description                                     |
| ----------------- | ------------------------------------------- | ----------------------------------------------- |
| `positions`       | `SharedValue<{[id: string]: number}>`       | Current positions of all items mapped by ID     |
| `scrollX`         | `SharedValue<number>`                       | Current horizontal scroll position              |
| `autoScroll`      | `SharedValue<HorizontalScrollDirection>`    | Auto-scroll direction state                     |
| `scrollViewRef`   | `AnimatedRef`                               | Ref for the scroll view component               |
| `dropProviderRef` | `RefObject<DropProviderRef>`                | Ref for the drop provider context               |
| `handleScroll`    | `any`                                       | Scroll handler to attach to ScrollView          |
| `handleScrollEnd` | `() => void`                                | Callback for scroll end events                  |
| `contentWidth`    | `number`                                    | Total width of scrollable content               |
| `getItemProps`    | `(item: TData, index: number) => ItemProps` | Helper function to get props for sortable items |

### getItemProps Return Type

```typescript
interface ItemProps {
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

## Content Width Calculation

The hook automatically calculates the total content width using the formula:

```
contentWidth = (itemsCount * itemWidth) + ((itemsCount - 1) * gap) + (paddingHorizontal * 2)
```

For example:

- 5 items × 120px width = 600px
- 4 gaps × 10px gap = 40px
- 2 × 16px padding = 32px
- **Total: 672px**

## Example

```typescript
import { useHorizontalSortableList } from 'react-native-reanimated-dnd';

const {
  scrollViewRef,
  dropProviderRef,
  handleScroll,
  handleScrollEnd,
  contentWidth,
  getItemProps,
} = useHorizontalSortableList({
  data: items,
  itemWidth: 120,
  gap: 10,
  paddingHorizontal: 16,
});

// Use with ScrollView
<Animated.ScrollView
  ref={scrollViewRef}
  onScroll={handleScroll}
  onScrollEndDrag={handleScrollEnd}
  horizontal={true}
  contentContainerStyle={{ width: contentWidth }}
>
  {items.map((item, index) => {
    const itemProps = getItemProps(item, index);
    return (
      <HorizontalSortableItem key={item.id} {...itemProps}>
        <ItemContent item={item} />
      </HorizontalSortableItem>
    );
  })}
</Animated.ScrollView>
```

## Related Types

### HorizontalScrollDirection

```typescript
enum HorizontalScrollDirection {
  None = "none",
  Left = "left",
  Right = "right",
}
```

### DropProviderRef

```typescript
interface DropProviderRef {
  requestPositionUpdate: () => void;
  getDroppedItems: () => DroppedItemsMap;
}
```

## See Also

- [useHorizontalSortable](./useHorizontalSortable)
- [useSortableList](./useSortableList)
- [UseHorizontalSortableListOptions](../types/sortable-types#usehorizontalsortablelistoptions)
- [UseHorizontalSortableListReturn](../types/sortable-types#usehorizontalsortablelistreturn)
