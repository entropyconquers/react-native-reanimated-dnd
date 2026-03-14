---
title: "Constraints & Bounds"
---

A guide to restricting drag movement with axis constraints and bounding regions.

## Overview

By default, draggable items can move freely in any direction. The library provides two mechanisms to constrain movement:

- **`dragAxis`** — Restricts movement to a single axis (horizontal or vertical)
- **`dragBoundsRef`** — Restricts movement within the bounds of a referenced View

These can be used independently or combined.

## Axis Constraints

The `dragAxis` prop limits movement to one direction:

| Value | Movement |
|-------|----------|
| `"both"` | Free movement in X and Y (default) |
| `"x"` | Horizontal only — vertical movement is locked |
| `"y"` | Vertical only — horizontal movement is locked |

### Horizontal-Only Dragging

```tsx
<Draggable data={data} dragAxis="x">
  <View style={styles.slider}>
    <Text>Slide left/right</Text>
  </View>
</Draggable>
```

### Vertical-Only Dragging

```tsx
<Draggable data={data} dragAxis="y">
  <View style={styles.slider}>
    <Text>Slide up/down</Text>
  </View>
</Draggable>
```

### With the Hook

```tsx
const { animatedViewProps, gesture } = useDraggable({
  data: sliderData,
  dragAxis: "x",
});
```

### Practical Example: Horizontal Slider

```tsx
function ColorSlider({ onValueChange }) {
  return (
    <DropProvider>
      <View style={styles.track}>
        <Draggable
          data={{ type: "slider" }}
          dragAxis="x"
          onDragging={({ tx }) => {
            const normalized = Math.max(0, Math.min(1, (tx + 150) / 300));
            onValueChange(normalized);
          }}
        >
          <View style={styles.thumb} />
        </Draggable>
      </View>
    </DropProvider>
  );
}
```

## Bounding Region

The `dragBoundsRef` prop constrains the draggable within another View's bounds. The draggable cannot be moved outside the referenced View.

### Basic Usage

```tsx
import { useRef } from "react";
import { View } from "react-native";

function BoundedExample() {
  const boundsRef = useRef<View>(null);

  return (
    <DropProvider>
      <View ref={boundsRef} style={styles.container}>
        <Draggable data={data} dragBoundsRef={boundsRef}>
          <View style={styles.draggable}>
            <Text>I can't leave this box</Text>
          </View>
        </Draggable>
      </View>
    </DropProvider>
  );
}
```

### How Bounds Work Internally

When `dragBoundsRef` is provided, the library:

1. Measures the bounds View's position and size (`pageX`, `pageY`, `width`, `height`)
2. On each drag update, calculates the allowed range:
   - `minTx = boundsX - originX`
   - `maxTx = boundsX + boundsWidth - originX - itemWidth`
   - `minTy = boundsY - originY`
   - `maxTy = boundsY + boundsHeight - originY - itemHeight`
3. Clamps the translation to stay within these limits

This means the draggable's edges will never extend beyond the bounds View's edges.

### Bounds + Axis Constraints

You can combine both for constrained single-axis movement:

```tsx
function BoundedSlider() {
  const trackRef = useRef<View>(null);

  return (
    <DropProvider>
      <View ref={trackRef} style={styles.track}>
        <Draggable
          data={{ type: "slider" }}
          dragAxis="x"
          dragBoundsRef={trackRef}
        >
          <View style={styles.thumb} />
        </Draggable>
      </View>
    </DropProvider>
  );
}
```

This creates a horizontal slider that can't go beyond the track's edges.

### Practical Example: Bounded Drag Area

```tsx
function DrawingCanvas() {
  const canvasRef = useRef<View>(null);

  return (
    <DropProvider>
      <View ref={canvasRef} style={styles.canvas}>
        <Draggable
          data={{ id: "sticker-1", type: "sticker" }}
          dragBoundsRef={canvasRef}
        >
          <Image source={stickerImage} style={styles.sticker} />
        </Draggable>

        <Draggable
          data={{ id: "sticker-2", type: "sticker" }}
          dragBoundsRef={canvasRef}
        >
          <Image source={anotherSticker} style={styles.sticker} />
        </Draggable>
      </View>
    </DropProvider>
  );
}
```

## Common Patterns

### Constrained Reordering

Combine axis constraints with sortable lists for clean vertical reordering:

```tsx
<Sortable
  data={items}
  renderItem={({ item, id, ...props }) => (
    <SortableItem key={id} id={id} data={item} {...props}>
      <TaskRow task={item} />
    </SortableItem>
  )}
  itemHeight={60}
/>
```

Note: `Sortable` and `SortableItem` already handle axis constraints internally — items only move along the list direction.

### Toggle Constraints Dynamically

Since `dragAxis` is reactive, you can change it at runtime:

```tsx
function ToggleAxisExample() {
  const [axis, setAxis] = useState<"x" | "y" | "both">("both");

  return (
    <DropProvider>
      <View style={styles.controls}>
        <Button title="Free" onPress={() => setAxis("both")} />
        <Button title="Horizontal" onPress={() => setAxis("x")} />
        <Button title="Vertical" onPress={() => setAxis("y")} />
      </View>

      <Draggable data={data} dragAxis={axis}>
        <View style={styles.item}>
          <Text>Axis: {axis}</Text>
        </View>
      </Draggable>
    </DropProvider>
  );
}
```

## Tips

- **Bounds measurement happens automatically** — the library measures the bounds View on mount, on layout changes, and whenever position updates are triggered.
- **The bounds View must be rendered** before the draggable measures it. Place the `ref` on a parent or sibling View that's already laid out.
- **Bounds don't affect drop detection** — collision algorithms still work normally. The draggable just can't physically move outside the bounded area.
- **If bounds measurement fails** (e.g., the View isn't laid out yet), the library logs a warning and the item remains unbounded until the next successful measurement.

## See Also

- [Bounded Dragging Example](/docs/examples/bounded-dragging) — Full working example
- [Axis Constraints Example](/docs/examples/axis-constraints) — Full working example
- [Draggable Component](/docs/components/draggable) — Props reference
- [useDraggable Hook](/docs/hooks/useDraggable) — Hook API reference
