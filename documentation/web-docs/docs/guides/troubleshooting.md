---
title: "Troubleshooting"
---

Common issues and their solutions when using React Native Reanimated DnD.

## Setup Issues

### "Component must be used within a DropProvider"

All `Draggable`, `Droppable`, `Sortable`, and `SortableGrid` components must be children of a `DropProvider`:

```tsx
// Missing DropProvider
<View>
  <Draggable data={data}>...</Draggable>
</View>

// Wrapped in DropProvider
<DropProvider>
  <View>
    <Draggable data={data}>...</Draggable>
  </View>
</DropProvider>
```

### Gestures Not Working

**Missing GestureHandlerRootView**: The app must be wrapped in `GestureHandlerRootView`, typically at the root:

```tsx
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <DropProvider>
        {/* Your app content */}
      </DropProvider>
    </GestureHandlerRootView>
  );
}
```

**Gesture conflict with ScrollView**: If a draggable is inside a ScrollView, the scroll gesture may intercept the drag. Solutions:

1. Use a drag handle so only the handle triggers dragging
2. Use `activationDelay` to require a long press before dragging
3. Set `simultaneousHandlers` on the scroll view if using hooks directly

### "Reanimated 4 is required"

This library requires React Native Reanimated 4.x. Check your installed version:

```bash
npm ls react-native-reanimated
```

If you're on Reanimated 3.x, upgrade:

```bash
npm install react-native-reanimated@latest
```

After upgrading, rebuild your native project:

```bash
# Expo
npx expo prebuild --clean
npx expo run:ios

# React Native CLI
cd ios && pod install && cd ..
npx react-native run-ios
```

## Drag-and-Drop Issues

### Draggable Item Not Moving

1. **Check `dragDisabled`** — Ensure it's not set to `true`:
   ```tsx
   <Draggable data={data} dragDisabled={false}>
   ```

2. **Check for competing gesture handlers** — If the draggable is inside a component that handles gestures (ScrollView, PanResponder, etc.), gestures may be intercepted.

3. **Check layout** — The draggable needs to have non-zero dimensions. Verify with a background color:
   ```tsx
   <Draggable data={data}>
     <View style={{ width: 100, height: 100, backgroundColor: "red" }}>
       <Text>Test</Text>
     </View>
   </Draggable>
   ```

### Drop Not Registering

1. **Verify collision algorithm** — With `contain`, the draggable must be fully inside the droppable. Try `intersect` for easier testing:
   ```tsx
   <Draggable data={data} collisionAlgorithm="intersect">
   ```

2. **Check droppable capacity** — If the droppable has a `capacity` limit that's been reached, drops will be rejected:
   ```tsx
   <Droppable
     onDrop={handleDrop}
     capacity={5} // Max 5 items
   >
   ```

3. **Verify DropProvider scope** — The Draggable and Droppable must share the same `DropProvider`:
   ```tsx
   // Different providers — drops won't connect
   <DropProvider>
     <Draggable data={data}>...</Draggable>
   </DropProvider>
   <DropProvider>
     <Droppable onDrop={handleDrop}>...</Droppable>
   </DropProvider>

   // Same provider
   <DropProvider>
     <Draggable data={data}>...</Draggable>
     <Droppable onDrop={handleDrop}>...</Droppable>
   </DropProvider>
   ```

### Item Snaps Back Instead of Dropping

When a draggable doesn't collide with any droppable zone, it animates back to its original position. This is expected behavior. To debug:

- Add `activeStyle` to your Droppable to see when collision is detected:
  ```tsx
  <Droppable
    activeStyle={{ borderColor: "green", borderWidth: 3 }}
    onDrop={handleDrop}
  >
  ```

- Check that the droppable has non-zero dimensions

## Sortable List Issues

### Items Not Reordering

1. **Ensure `onMove` is implemented correctly** — You must update your data array in response to the move callback:
   ```tsx
   <SortableItem
     onMove={(id, from, to) => {
       const newItems = [...items];
       const [moved] = newItems.splice(from, 1);
       newItems.splice(to, 0, moved);
       setItems(newItems);
     }}
   >
   ```

2. **Each item needs a unique `id`** — Duplicate IDs cause position tracking to break:
   ```tsx
   // Duplicate IDs
   const items = [{ id: "1" }, { id: "1" }];

   // Unique IDs
   const items = [{ id: "1" }, { id: "2" }];
   ```

3. **`itemHeight` must be accurate** — If `itemHeight` doesn't match the actual rendered height, position calculations will be wrong.

### Auto-scroll Not Working

Auto-scroll triggers when a dragged item approaches the edges of the ScrollView. Ensure:

- The list is actually scrollable (content taller than container)
- You're using the `Sortable` component (it handles auto-scroll internally)
- The scroll container has proper dimensions

## Grid Issues

### Grid Items Not Visible

This is usually caused by incorrect dimensions or the GestureDetector wrapper collapsing. Ensure:

1. **Dimensions are provided correctly:**
   ```tsx
   <SortableGrid
     dimensions={{
       columns: 4,
       itemWidth: 80,
       itemHeight: 80,
       rowGap: 12,
       columnGap: 12,
     }}
   >
   ```

2. **Items have explicit sizes** — Grid items are absolutely positioned, so they need explicit width/height from the dimensions config.

### Grid Items Overlapping

This usually means `rowGap` or `columnGap` in your dimensions don't match the actual spacing. The grid calculates positions using these values, so they must be accurate.

## Animation Issues

### "Reading from value during render" Warning

This Reanimated 4 warning appears when you read a shared value's `.value` during the render phase:

```tsx
// Triggers warning
const Component = () => {
  const offset = useSharedValue(0);
  const value = offset.value; // Reading during render
  return <Text>{value}</Text>;
};

// Use useAnimatedStyle or useDerivedValue instead
const Component = () => {
  const offset = useSharedValue(0);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: offset.value }],
  }));
  return <Animated.View style={animatedStyle} />;
};
```

### Custom Animation Not Working

Ensure your animation function includes the `"worklet"` directive:

```tsx
// Missing worklet directive
const animation = (toValue: number) => {
  return withSpring(toValue);
};

// Correct
const animation = (toValue: number) => {
  "worklet";
  return withSpring(toValue);
};
```

## Build Issues

### iOS Pod Install Failures

After installing or upgrading the library:

```bash
cd ios
pod deintegrate
pod install
cd ..
```

If using Expo:

```bash
npx expo prebuild --clean
```

### Metro Bundler Cache

Stale Metro cache can cause mysterious errors. Clear it:

```bash
# Expo
npx expo start --clear

# React Native CLI
npx react-native start --reset-cache
```

### Duplicate Module Errors

If you see errors about duplicate Reanimated or Worklets modules, clean your node_modules:

```bash
rm -rf node_modules
npm install  # or bun install / yarn install

# Then rebuild native:
cd ios && pod install && cd ..
```

## Still Stuck?

1. **Check the [GitHub Issues](https://github.com/entropyconquers/react-native-reanimated-dnd/issues)** — Your issue may already be reported
2. **Create a minimal reproduction** — Isolate the problem in a fresh project
3. **File a new issue** with:
   - Library version
   - React Native version
   - Reanimated version
   - Platform (iOS/Android)
   - Minimal code to reproduce

## See Also

- [Installation Guide](/docs/getting-started/installation) — Setup and dependency requirements
- [Basic Concepts](/docs/getting-started/basic-concepts) — Understanding the architecture
- [Performance Guide](/docs/guides/performance) — Avoiding performance pitfalls
