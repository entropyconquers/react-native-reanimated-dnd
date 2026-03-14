---
title: "Animations"
---

A guide to customizing drag-and-drop animations using Reanimated worklets.

## How Animations Work

When a drag ends, the library animates the item either back to its original position or to the drop zone's position. By default, this uses a spring animation (`withSpring`). You can override this with a custom `animationFunction`.

Animation functions are **worklets** — they run on the UI thread for 60fps performance. They receive a target value and must return an animated value:

```tsx
const myAnimation = (toValue: number) => {
  "worklet";
  return withSpring(toValue);
};
```

## Using Custom Animations

### With the Draggable Component

```tsx
import { withTiming, Easing } from "react-native-reanimated";

const smoothAnimation = (toValue: number) => {
  "worklet";
  return withTiming(toValue, {
    duration: 300,
    easing: Easing.out(Easing.cubic),
  });
};

<Draggable data={data} animationFunction={smoothAnimation}>
  <Text>Smooth return</Text>
</Draggable>
```

### With the useDraggable Hook

```tsx
const { animatedViewProps, gesture } = useDraggable({
  data: myData,
  animationFunction: (toValue) => {
    "worklet";
    return withSpring(toValue, { damping: 12, stiffness: 200 });
  },
});
```

## Spring Animations

Springs provide natural, physics-based motion. They're the best default choice for drag-and-drop.

### Default Spring

The library's default when no `animationFunction` is provided:

```tsx
// This is what happens internally
const defaultAnimation = (toValue: number) => {
  "worklet";
  return withSpring(toValue);
};
```

### Bouncy Spring

Low damping creates a playful bounce effect, good for games or casual apps:

```tsx
const bouncySpring = (toValue: number) => {
  "worklet";
  return withSpring(toValue, {
    damping: 8,
    stiffness: 100,
    mass: 0.8,
  });
};
```

### Stiff Spring

High damping and stiffness for a snappy, controlled feel:

```tsx
const snappySpring = (toValue: number) => {
  "worklet";
  return withSpring(toValue, {
    damping: 20,
    stiffness: 400,
    mass: 0.8,
  });
};
```

### Gentle Spring

High damping with lower stiffness for slow, smooth settling:

```tsx
const gentleSpring = (toValue: number) => {
  "worklet";
  return withSpring(toValue, {
    damping: 25,
    stiffness: 120,
    mass: 1.2,
  });
};
```

## Timing Animations

Timing animations give you precise control over duration and easing curves.

### Linear Timing

```tsx
const linearAnimation = (toValue: number) => {
  "worklet";
  return withTiming(toValue, { duration: 300 });
};
```

### Eased Timing

```tsx
import { Easing } from "react-native-reanimated";

const easedAnimation = (toValue: number) => {
  "worklet";
  return withTiming(toValue, {
    duration: 250,
    easing: Easing.bezier(0.25, 0.1, 0.25, 1), // CSS ease equivalent
  });
};
```

### Bounce Timing

```tsx
const bounceAnimation = (toValue: number) => {
  "worklet";
  return withTiming(toValue, {
    duration: 600,
    easing: Easing.bounce,
  });
};
```

## Composed Animations

Reanimated provides composition functions to create more complex effects.

### Overshoot and Settle

```tsx
import { withSequence } from "react-native-reanimated";

const overshootAnimation = (toValue: number) => {
  "worklet";
  return withSequence(
    withTiming(toValue * 1.1, { duration: 100 }), // Overshoot 10%
    withSpring(toValue, { damping: 15 })           // Spring back
  );
};
```

### Delayed Return

```tsx
import { withDelay } from "react-native-reanimated";

const delayedAnimation = (toValue: number) => {
  "worklet";
  return withDelay(
    200,
    withSpring(toValue, { damping: 15 })
  );
};
```

## Practical Recipes

### iOS-Style Animation

Matches the feel of iOS system interactions:

```tsx
const iosAnimation = (toValue: number) => {
  "worklet";
  return withSpring(toValue, {
    damping: 20,
    stiffness: 300,
    mass: 1,
  });
};
```

### Material Design Animation

Follows Material motion principles:

```tsx
const materialAnimation = (toValue: number) => {
  "worklet";
  return withTiming(toValue, {
    duration: 300,
    easing: Easing.bezier(0.4, 0.0, 0.2, 1),
  });
};
```

### Instant (No Animation)

For testing or when animation is not desired:

```tsx
const instantAnimation = (toValue: number) => {
  "worklet";
  return withTiming(toValue, { duration: 0 });
};
```

## Important Notes

1. **Always include the `"worklet"` directive** — animation functions run on the UI thread, so they must be worklets.

2. **The function receives target values for both X and Y** — the same animation function is applied to both axes. If you need different behavior per axis, the animation itself should be axis-agnostic (which it naturally is since it just transforms a single number).

3. **Keep animations simple** — complex sequences with many steps can feel janky during rapid interactions. Spring or simple timing animations generally work best.

4. **Memoize with `useCallback`** if creating animations inline to prevent unnecessary re-renders:

```tsx
const animation = useCallback((toValue: number) => {
  "worklet";
  return withSpring(toValue, { damping: 15 });
}, []);

<Draggable data={data} animationFunction={animation}>
  <Text>Memoized animation</Text>
</Draggable>
```

## See Also

- [Animation Functions API Reference](/docs/api/utilities/animation-functions) — Complete API docs with preset examples
- [Draggable Component](/docs/components/draggable) — Using `animationFunction` prop
- [React Native Reanimated Docs](https://docs.swmansion.com/react-native-reanimated/) — Full Reanimated animation API
