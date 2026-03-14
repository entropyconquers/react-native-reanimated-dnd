---
title: "Performance"
---

Tips and patterns for keeping drag-and-drop interactions smooth at 60fps.

## Architecture Advantages

React Native Reanimated DnD is built on Reanimated 4 and Gesture Handler, which means:

- **Gesture recognition runs on the UI thread** — no JS bridge round-trips during a drag
- **Animations run on the UI thread** — position updates don't wait for JavaScript
- **Collision detection is lightweight** — simple rectangle math, no complex geometry

This architecture gives you 60fps performance by default. The tips below help you avoid common pitfalls that can degrade it.

## Avoid Re-renders During Drag

The biggest performance risk is triggering React re-renders while a drag is in progress.

### Use `scheduleOnRN` Sparingly

The `onDragging` callback fires on every drag movement frame. If your callback triggers state updates, each update causes a re-render:

```tsx
// Bad: State update on every frame
<Draggable
  data={data}
  onDragging={({ tx, ty }) => {
    setPosition({ x: tx, y: ty }); // Re-render every frame!
  }}
>
```

```tsx
// Good: Only update when necessary
<Draggable
  data={data}
  onDragging={({ tx, ty }) => {
    // Throttle updates or use shared values instead
    if (Math.abs(tx - lastTx.current) > 10) {
      lastTx.current = tx;
      // Update only when significant movement occurs
    }
  }}
>
```

### Use Shared Values for Real-time Data

If you need to track drag position in real-time, use Reanimated shared values instead of React state:

```tsx
const dragX = useSharedValue(0);
const dragY = useSharedValue(0);

<Draggable
  data={data}
  onDragging={({ tx, ty }) => {
    dragX.value = tx;
    dragY.value = ty;
  }}
>
```

## Memoize Callbacks and Data

### Stable `data` Objects

The `data` prop is passed through the drag system. Create it outside the render or memoize it:

```tsx
// Bad: New object every render
<Draggable data={{ id: "1", name: "Task" }}>

// Good: Stable reference
const data = useMemo(() => ({ id: "1", name: "Task" }), []);
<Draggable data={data}>
```

### Stable Callbacks

```tsx
// Memoize event handlers
const handleDrop = useCallback((data) => {
  processItem(data);
}, []);

<Droppable onDrop={handleDrop}>
```

### Stable Animation Functions

```tsx
// Define outside component or memoize
const springAnimation = (toValue: number) => {
  "worklet";
  return withSpring(toValue, { damping: 15 });
};

// Or inside component with useCallback
const animation = useCallback((toValue: number) => {
  "worklet";
  return withSpring(toValue, { damping: 15 });
}, []);
```

## Sortable List Performance

### Use the Built-in Sortable Component

`Sortable` and `SortableItem` are optimized for list reordering. They handle position calculations on the UI thread and minimize JS bridge traffic.

### FlatList Virtualization

For long lists, `Sortable` supports FlatList-style virtualization out of the box. Only visible items are rendered:

```tsx
<Sortable
  data={items} // Can be hundreds of items
  renderItem={({ item, id, ...props }) => (
    <SortableItem key={id} id={id} data={item} {...props}>
      <TaskRow task={item} />
    </SortableItem>
  )}
  itemHeight={60}
/>
```

### Keep Item Components Light

Heavy item components slow down reordering animations:

```tsx
// Avoid: Complex rendering in each item
<SortableItem ...>
  <ExpensiveChart data={item.chartData} />
  <ComplexForm fields={item.fields} />
</SortableItem>

// Better: Simple presentation
<SortableItem ...>
  <View style={styles.row}>
    <Text>{item.title}</Text>
    <Text>{item.subtitle}</Text>
  </View>
</SortableItem>
```

## Grid Performance

### Set Correct Dimensions

`SortableGrid` uses absolute positioning. Providing accurate `dimensions` avoids layout thrashing:

```tsx
<SortableGrid
  data={items}
  dimensions={{
    columns: 4,
    itemWidth: 80,
    itemHeight: 80,
    rowGap: 12,
    columnGap: 12,
  }}
  renderItem={...}
/>
```

### Limit Grid Size

Grids with many items (50+) may experience slower reorder calculations. For very large grids, consider pagination or virtualization.

## Collision Algorithm Performance

The three algorithms have slightly different costs:

1. **`intersect`** — Fastest. Four comparisons (AABB overlap).
2. **`center`** — Fast. Two comparisons (point-in-rectangle).
3. **`contain`** — Slightly slower. Four comparisons but all must pass.

In practice the difference is negligible, but if you have many droppable zones (20+) and need maximum performance, `intersect` is the safest choice.

## Drag Handles

Use drag handles for large or complex draggable components. When a handle is present, only the handle area responds to gestures — this reduces the gesture recognition surface and avoids conflicts with scrollable content inside the draggable:

```tsx
<Draggable data={data}>
  <View style={styles.card}>
    <Draggable.Handle>
      <View style={styles.handle}>
        <Text>⠿</Text>
      </View>
    </Draggable.Handle>
    <ScrollView>
      {/* Complex scrollable content */}
    </ScrollView>
  </View>
</Draggable>
```

## General Tips

1. **Profile on a real device** — Simulators don't accurately represent gesture and animation performance.

2. **Use Reanimated's `useAnimatedReaction`** instead of `useEffect` for responding to shared value changes — it stays on the UI thread.

3. **Avoid `console.log` in drag callbacks** — Logging during drag can cause frame drops. Use it only for debugging.

4. **Keep the component tree shallow** inside draggable items — fewer nested Views means faster layout calculations.

5. **Test with production builds** — Development mode includes extra checks that slow down rendering. Always benchmark with `--release` or production builds.

## See Also

- [Sortable Component](/docs/components/sortable) — Optimized list reordering
- [SortableGrid Component](/docs/api/components/sortable-grid) — Optimized grid reordering
- [React Native Reanimated Performance](https://docs.swmansion.com/react-native-reanimated/) — Reanimated performance docs
