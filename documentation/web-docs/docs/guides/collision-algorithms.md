---
title: "Collision Algorithms"
---

A guide to choosing and using collision detection algorithms for determining when a draggable item overlaps with a droppable zone.

## How Collision Detection Works

When you drag an item across the screen, the library continuously checks whether the draggable overlaps with any registered droppable zones. The **collision algorithm** determines what counts as an "overlap."

The algorithm is set on the **Draggable** (not the Droppable), because the draggable is the moving element whose position is being tested against all registered drop zones.

```tsx
<Draggable
  data={myData}
  collisionAlgorithm="center" // Set here
>
  <Text>Drag me</Text>
</Draggable>
```

## The Three Algorithms

### `intersect` (Default)

Collision is detected when **any part** of the draggable overlaps with **any part** of the droppable.

```
Draggable:     [====]
Droppable: [----------]
Result:    -> Collision (any overlap counts)

Draggable: [====]
Droppable:       [----------]
Result:    -> No collision (no overlap)
```

This is the most forgiving algorithm. Use it when you want dropping to feel easy and natural — especially on mobile where touch precision is limited.

```tsx
// This is the default — you don't need to specify it
<Draggable data={data}>
  <Text>Easy to drop</Text>
</Draggable>
```

### `center`

Collision is detected only when the **center point** of the draggable is inside the droppable's bounds.

```
Draggable:     [==•==]  (• = center)
Droppable: [----------]
Result:    -> Collision (center is inside)

Draggable: [==•==]
Droppable:       [----------]
Result:    -> No collision (center is outside)
```

This provides a balance between ease of use and precision. The user needs to aim roughly at the target but doesn't need pixel-perfect accuracy.

```tsx
<Draggable data={data} collisionAlgorithm="center">
  <Text>Precise dropping</Text>
</Draggable>
```

### `contain`

Collision is detected only when the **entire** draggable is completely inside the droppable.

```
Draggable:   [====]
Droppable: [----------]
Result:    -> Collision (fully contained)

Draggable: [====]
Droppable:   [------]
Result:    -> No collision (not fully inside)
```

This is the most restrictive algorithm. The droppable must be larger than the draggable for this to ever trigger.

```tsx
<Draggable data={data} collisionAlgorithm="contain">
  <Text>Must fit completely</Text>
</Draggable>
```

## Choosing the Right Algorithm

| Scenario | Recommended | Why |
|----------|-------------|-----|
| Mobile app with finger-based dragging | `intersect` | Fingers obscure the item; forgiving detection reduces frustration |
| Kanban board with large columns | `intersect` or `center` | Columns are big targets; either works well |
| Small, tightly packed drop zones | `intersect` | Small targets need the most forgiving algorithm |
| Precise placement (e.g., puzzle pieces) | `center` | Users expect intentional positioning |
| Container-based UI (e.g., file into folder) | `contain` | Semantically matches "putting something inside" |
| Desktop-style interface with mouse | `center` | Mouse provides precise control |

## Practical Examples

### Kanban Board

For a Kanban board with multiple columns, `intersect` works best because columns are large and users want quick task movement:

```tsx
function KanbanCard({ task }) {
  return (
    <Draggable
      data={task}
      collisionAlgorithm="intersect"
      onDragEnd={() => console.log("Card released")}
    >
      <View style={styles.card}>
        <Text>{task.title}</Text>
      </View>
    </Draggable>
  );
}
```

### Inventory Grid

For a game inventory where items must be placed precisely into slots, `center` gives a good balance:

```tsx
function InventoryItem({ item }) {
  return (
    <Draggable
      data={item}
      collisionAlgorithm="center"
    >
      <View style={styles.inventorySlot}>
        <Image source={item.icon} />
      </View>
    </Draggable>
  );
}
```

### File Manager with Folders

For dropping files into folders where the visual metaphor is "put inside," `contain` makes sense — but only if your folder drop zone is significantly larger than the file icon:

```tsx
function FileIcon({ file }) {
  return (
    <Draggable
      data={file}
      collisionAlgorithm="contain"
    >
      <View style={styles.fileIcon}>
        <Text>{file.name}</Text>
      </View>
    </Draggable>
  );
}
```

## Using with Hooks

The collision algorithm is configured the same way when using the `useDraggable` hook directly:

```tsx
function CustomDraggable({ data }) {
  const { animatedViewProps, gesture } = useDraggable({
    data,
    collisionAlgorithm: "center",
  });

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View {...animatedViewProps}>
        <Text>Hook-based draggable</Text>
      </Animated.View>
    </GestureDetector>
  );
}
```

## How It Works Internally

The collision check runs on each drag update. Here's the logic for each algorithm:

- **intersect**: Standard AABB (axis-aligned bounding box) overlap test — checks if any edges overlap
- **center**: Calculates the center point of the draggable and tests if it falls within the droppable's rectangle
- **contain**: Checks that all four corners of the draggable are inside the droppable

All collision checks run efficiently since they're simple rectangle math with no complex geometry.

## See Also

- [Collision Algorithms API Reference](/docs/api/utilities/collision-algorithms) — Detailed API docs with more code examples
- [Draggable Component](/docs/components/draggable) — Component-level configuration
- [useDraggable Hook](/docs/hooks/useDraggable) — Hook-level configuration
