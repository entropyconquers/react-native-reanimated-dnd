---
title: "Collision Algorithms"
---

Collision detection algorithms for determining when a draggable item overlaps with a droppable zone.

## Overview

The library provides three collision detection algorithms that determine when a draggable item is considered to be "colliding" with a droppable zone. Each algorithm has different use cases and provides different levels of precision.

## Available Algorithms

### intersect (Default)

The most permissive algorithm that detects collision when any part of the draggable overlaps with any part of the droppable.

#### Behavior

- **Collision detected**: When any pixel of the draggable overlaps with any pixel of the droppable
- **Use case**: Easy dropping, forgiving user experience
- **Best for**: Large drop zones, mobile interfaces, quick interactions

#### Example

```tsx
<Draggable
  data={data}
  collisionAlgorithm="intersect" // Default
>
  <Text>Easy to drop</Text>
</Draggable>
```

#### Visual Representation

```
Draggable:     [====]
Droppable: [----------]
Result:    -> Collision (any overlap)
```

### center

A precise algorithm that detects collision only when the center point of the draggable is over the droppable.

#### Behavior

- **Collision detected**: When the center point of the draggable is within the droppable bounds
- **Use case**: Precise dropping, intentional placement
- **Best for**: Small drop zones, precise positioning, desktop interfaces

#### Example

```tsx
<Draggable data={data} collisionAlgorithm="center">
  <Text>Precise dropping</Text>
</Draggable>
```

#### Visual Representation

```
Draggable:     [==•==]  (• = center)
Droppable: [----------]
Result:    -> Collision (center inside)

Draggable: [==•==]
Droppable:     [----------]
Result:    -> No collision (center outside)
```

### contain

The most restrictive algorithm that requires the entire draggable to be contained within the droppable.

#### Behavior

- **Collision detected**: When the entire draggable is completely inside the droppable bounds
- **Use case**: Strict containment, no partial overlaps allowed
- **Best for**: Container-like drop zones, strict placement requirements

#### Example

```tsx
<Draggable data={data} collisionAlgorithm="contain">
  <Text>Must fit completely</Text>
</Draggable>
```

#### Visual Representation

```
Draggable:   [====]
Droppable: [----------]
Result:    -> Collision (fully contained)

Draggable: [====]
Droppable:   [------]
Result:    -> No collision (not fully contained)
```

## Algorithm Comparison

| Algorithm   | Precision | Ease of Use | Best For                                |
| ----------- | --------- | ----------- | --------------------------------------- |
| `intersect` | Low       | High        | Mobile, large zones, quick interactions |
| `center`    | Medium    | Medium      | Precise placement, medium zones         |
| `contain`   | High      | Low         | Strict containment, container zones     |

## Usage Examples

### Dynamic Algorithm Selection

```tsx
function AdaptiveDropZone() {
  const [algorithm, setAlgorithm] = useState("intersect");
  const [dropZoneSize, setDropZoneSize] = useState("large");

  // Automatically adjust algorithm based on drop zone size
  useEffect(() => {
    switch (dropZoneSize) {
      case "small":
        setAlgorithm("intersect"); // More forgiving for small zones
        break;
      case "medium":
        setAlgorithm("center"); // Balanced precision
        break;
      case "large":
        setAlgorithm("contain"); // Strict for large zones
        break;
    }
  }, [dropZoneSize]);

  return (
    <View>
      <Draggable
        data={{ id: "1", name: "Adaptive Item" }}
        collisionAlgorithm={algorithm}
      >
        <Text>Algorithm: {algorithm}</Text>
      </Draggable>

      <Droppable
        onDrop={(data) => console.log("Dropped with", algorithm)}
        style={[styles.dropZone, styles[`${dropZoneSize}Zone`]]}
      >
        <Text>Drop Zone ({dropZoneSize})</Text>
      </Droppable>
    </View>
  );
}
```

### Algorithm Testing Interface

```tsx
function CollisionTester() {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState("intersect");
  const [collisionCount, setCollisionCount] = useState({
    intersect: 0,
    center: 0,
    contain: 0,
  });

  const algorithms = ["intersect", "center", "contain"];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Collision Algorithm Tester</Text>

      {/* Algorithm Selector */}
      <View style={styles.algorithmSelector}>
        {algorithms.map((algorithm) => (
          <TouchableOpacity
            key={algorithm}
            onPress={() => setSelectedAlgorithm(algorithm)}
            style={[
              styles.algorithmButton,
              selectedAlgorithm === algorithm && styles.selectedButton,
            ]}
          >
            <Text>{algorithm}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Test Area */}
      <View style={styles.testArea}>
        <Draggable
          data={{ id: "test-item", algorithm: selectedAlgorithm }}
          collisionAlgorithm={selectedAlgorithm}
          onDragStart={() => console.log(`Testing ${selectedAlgorithm}`)}
        >
          <View style={styles.testDraggable}>
            <Text>Test Item</Text>
            <Text>Algorithm: {selectedAlgorithm}</Text>
          </View>
        </Draggable>

        <Droppable
          onDrop={(data) => {
            setCollisionCount((prev) => ({
              ...prev,
              [data.algorithm]: prev[data.algorithm] + 1,
            }));
          }}
          style={styles.testDroppable}
        >
          <Text>Test Drop Zone</Text>
          <Text>Intersect: {collisionCount.intersect}</Text>
          <Text>Center: {collisionCount.center}</Text>
          <Text>Contain: {collisionCount.contain}</Text>
        </Droppable>
      </View>
    </View>
  );
}
```

### Context-Aware Algorithm Selection

```tsx
function SmartDraggable({ item, context }) {
  // Select algorithm based on context
  const getAlgorithm = () => {
    if (context.isMobile) {
      return "intersect"; // More forgiving on mobile
    }

    if (context.isTouch) {
      return "center"; // Balanced for touch interfaces
    }

    if (context.isPrecisionRequired) {
      return "contain"; // Strict for precision tasks
    }

    return "intersect"; // Default fallback
  };

  return (
    <Draggable data={item} collisionAlgorithm={getAlgorithm()}>
      <Text>{item.name}</Text>
    </Draggable>
  );
}
```

### Multi-Zone with Different Algorithms

```tsx
import { GestureHandlerRootView } from "react-native-gesture-handler";

function MultiZoneExample() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <DropProvider>
        <View style={styles.content}>
          {/* Single draggable item */}
          <Draggable
            data={{ id: "1", name: "Multi-zone item" }}
            collisionAlgorithm="intersect" // Will work with all zones
          >
            <Text>Drag me to different zones</Text>
          </Draggable>

          {/* Easy drop zone */}
          <Droppable
            onDrop={(data) => console.log("Easy drop:", data.name)}
            style={[styles.dropZone, styles.easyZone]}
          >
            <Text>Easy Zone</Text>
            <Text>(Works with intersect)</Text>
          </Droppable>

          {/* Precise drop zone */}
          <Droppable
            onDrop={(data) => console.log("Precise drop:", data.name)}
            style={[styles.dropZone, styles.preciseZone]}
          >
            <Text>Precise Zone</Text>
            <Text>(Requires center alignment)</Text>
          </Droppable>

          {/* Strict drop zone */}
          <Droppable
            onDrop={(data) => console.log("Strict drop:", data.name)}
            style={[styles.dropZone, styles.strictZone]}
          >
            <Text>Strict Zone</Text>
            <Text>(Requires full containment)</Text>
          </Droppable>
        </View>
      </DropProvider>
    </GestureHandlerRootView>
  );
}
```

## Performance Considerations

### Algorithm Performance

1. **intersect**: Fastest - simple bounding box overlap check
2. **center**: Medium - single point-in-rectangle check
3. **contain**: Slowest - requires checking all four corners

### Optimization Tips

```tsx
// Use intersect for frequently moving items
const fastMovingItem = useDraggable({
  data: item,
  collisionAlgorithm: "intersect", // Fastest
  onDragging: throttle(handleDragging, 16), // Throttle for performance
});

// Use contain only when necessary
const precisionItem = useDraggable({
  data: item,
  collisionAlgorithm: "contain", // Only when precision is required
  onDragging: throttle(handleDragging, 32), // Less frequent updates
});
```

## Custom Collision Logic

While the library provides three built-in algorithms, you can implement custom collision logic in your drop handlers by accessing layout information through refs or other means:

```tsx
function CustomCollisionDroppable() {
  const droppableRef = useRef<View>(null);
  const [droppableLayout, setDroppableLayout] = useState(null);

  const handleDrop = (data) => {
    // Custom collision validation using stored layout information
    const customCollisionCheck = (itemData, droppableLayout) => {
      // Access custom properties from your data
      if (itemData.customRect && droppableLayout) {
        const overlapArea = calculateOverlapArea(
          itemData.customRect,
          droppableLayout
        );
        const draggableArea =
          itemData.customRect.width * itemData.customRect.height;
        const overlapPercentage = overlapArea / draggableArea;

        return overlapPercentage > 0.5; // Require 50% overlap
      }
      return true; // Default to accepting the drop
    };

    if (customCollisionCheck(data, droppableLayout)) {
      console.log("Custom collision detected");
      // Handle the drop
      processDroppedItem(data);
    } else {
      console.log("Custom collision failed");
      // You can show an error message, but the drop has already occurred
      showErrorMessage("Drop not allowed in this area");
    }
  };

  const handleLayout = (event) => {
    const { x, y, width, height } = event.nativeEvent.layout;
    setDroppableLayout({ x, y, width, height });
  };

  return (
    <Droppable onDrop={handleDrop} style={styles.customDropZone}>
      <View ref={droppableRef} onLayout={handleLayout}>
        <Text>Custom Collision Zone</Text>
        <Text>Requires 50% overlap</Text>
      </View>
    </Droppable>
  );
}

// Helper function for overlap calculation
function calculateOverlapArea(rect1, rect2) {
  const left = Math.max(rect1.x, rect2.x);
  const right = Math.min(rect1.x + rect1.width, rect2.x + rect2.width);
  const top = Math.max(rect1.y, rect2.y);
  const bottom = Math.min(rect1.y + rect1.height, rect2.y + rect2.height);

  if (left < right && top < bottom) {
    return (right - left) * (bottom - top);
  }
  return 0;
}
```

**Note**: The `onDrop` callback only receives the draggable's data. For custom collision logic, you'll need to store layout information separately and include any necessary geometric data in your draggable's data object.

## Best Practices

### Algorithm Selection Guidelines

1. **Mobile Apps**: Use `intersect` for better touch experience
2. **Desktop Apps**: Use `center` for mouse precision
3. **Container Interfaces**: Use `contain` for strict placement
4. **Games**: Use `center` or custom logic for game mechanics
5. **Form Builders**: Use `intersect` for ease of use

### User Experience Tips

```tsx
// Provide visual feedback based on algorithm
function FeedbackDraggable({ algorithm }) {
  const getFeedbackStyle = () => {
    switch (algorithm) {
      case "intersect":
        return { borderColor: "green", borderWidth: 2 }; // Easy
      case "center":
        return { borderColor: "orange", borderWidth: 2 }; // Medium
      case "contain":
        return { borderColor: "red", borderWidth: 2 }; // Hard
    }
  };

  return (
    <Draggable data={{ algorithm }} collisionAlgorithm={algorithm}>
      <View style={[styles.item, getFeedbackStyle()]}>
        <Text>{algorithm} mode</Text>
      </View>
    </Draggable>
  );
}
```

## See Also

- [Draggable Component](../../components/draggable) - Using collision algorithms
- [Droppable Component](../../components/droppable) - Drop zone configuration
- [useDraggable Hook](../../hooks/useDraggable) - Hook-level collision configuration
- [CollisionAlgorithm Type](../types/draggable-types#collisionalgorithm) - Type definitions
