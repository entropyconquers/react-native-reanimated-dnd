---
title: useHorizontalSortable
description: API reference for the useHorizontalSortable hook
---

# useHorizontalSortable

Hook for creating individual horizontal sortable items with drag-and-drop reordering capabilities.

## Import

```typescript
import { useHorizontalSortable } from "react-native-reanimated-dnd";
```

## Type Signature

```typescript
function useHorizontalSortable<T>(
  options: UseHorizontalSortableOptions<T>
): UseHorizontalSortableReturn;
```

## Parameters

### UseHorizontalSortableOptions\<T\>

| Property              | Type                                                                  | Required | Default | Description                                       |
| --------------------- | --------------------------------------------------------------------- | -------- | ------- | ------------------------------------------------- |
| `id`                  | `string`                                                              | ✅       | -       | Unique identifier for this sortable item          |
| `positions`           | `SharedValue<{[id: string]: number}>`                                 | ✅       | -       | Shared value containing positions of all items    |
| `leftBound`           | `SharedValue<number>`                                                 | ✅       | -       | Current horizontal scroll position                |
| `autoScrollDirection` | `SharedValue<HorizontalScrollDirection>`                              | ✅       | -       | Auto-scroll direction state                       |
| `itemsCount`          | `number`                                                              | ✅       | -       | Total number of items in the list                 |
| `itemWidth`           | `number`                                                              | ✅       | -       | Width of each item in pixels                      |
| `gap`                 | `number`                                                              | ❌       | `0`     | Gap between items in pixels                       |
| `paddingHorizontal`   | `number`                                                              | ❌       | `0`     | Container horizontal padding                      |
| `containerWidth`      | `number`                                                              | ❌       | `500`   | Container width for auto-scroll calculations      |
| `onMove`              | `(id: string, from: number, to: number) => void`                      | ❌       | -       | Callback when item position changes               |
| `onDragStart`         | `(id: string, position: number) => void`                              | ❌       | -       | Callback when dragging starts                     |
| `onDrop`              | `(id: string, position: number) => void`                              | ❌       | -       | Callback when dragging ends                       |
| `onDragging`          | `(id: string, overItemId: string \| null, xPosition: number) => void` | ❌       | -       | Callback during dragging                          |

## Return Value

### UseHorizontalSortableReturn

| Property            | Type                   | Description                                  |
| ------------------- | ---------------------- | -------------------------------------------- |
| `animatedStyle`     | `StyleProp<ViewStyle>` | Animated style for the sortable item         |
| `panGestureHandler` | `any`                  | Pan gesture handler for drag interactions    |
| `isMoving`          | `boolean`              | Whether the item is currently being dragged  |
| `hasHandle`         | `boolean`              | Whether the item has a drag handle component |

## Related Types

### HorizontalScrollDirection

```typescript
enum HorizontalScrollDirection {
  None = "none",
  Left = "left",
  Right = "right",
}
```

## Example

```typescript
import { useHorizontalSortable } from "react-native-reanimated-dnd";

const { animatedStyle, panGestureHandler, isMoving } = useHorizontalSortable({
  id: item.id,
  positions,
  leftBound,
  autoScrollDirection,
  itemsCount: 5,
  itemWidth: 120,
  gap: 10,
  paddingHorizontal: 16,
  onMove: (id, from, to) => {
    console.log(`Item ${id} moved from ${from} to ${to}`);
  },
});
```

## See Also

- [useHorizontalSortableList](./useHorizontalSortableList)
- [useSortable](./useSortable)
- [UseHorizontalSortableOptions](../types/sortable-types#usehorizontalsortableoptions)
- [UseHorizontalSortableReturn](../types/sortable-types#usehorizontalsortablereturn)
