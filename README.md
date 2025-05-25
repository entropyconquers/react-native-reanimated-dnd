# React Native Reanimated DnD

A powerful, performant drag-and-drop library for React Native using Reanimated 3 and Gesture Handler.

[![npm version](https://badge.fury.io/js/react-native-reanimated-dnd.svg)](https://badge.fury.io/js/react-native-reanimated-dnd)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- 🚀 **High Performance** - Built with Reanimated 3 for 60fps animations
- 🎯 **Flexible API** - Support for both simple and complex drag-and-drop scenarios
- 📱 **React Native First** - Designed specifically for React Native
- 🔧 **TypeScript Support** - Full TypeScript support with comprehensive type definitions
- 🎨 **Customizable** - Highly customizable animations and behaviors
- 📦 **Multiple Components** - Draggable, Droppable, and Sortable components
- 🎪 **Collision Detection** - Multiple collision algorithms (center, intersect, contain)
- 📜 **Auto Scrolling** - Automatic scrolling for sortable lists
- 🎭 **Drag Handles** - Support for drag handles within items

## Installation

```bash
npm install react-native-reanimated-dnd
```

### Peer Dependencies

Make sure you have the required peer dependencies installed:

```bash
npm install react-native-reanimated react-native-gesture-handler
```

Follow the installation guides for:

- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/installation)
- [React Native Gesture Handler](https://docs.swmansion.com/react-native-gesture-handler/docs/installation)

## Quick Start

### Basic Draggable

```tsx
import React from "react";
import { View, Text } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Draggable, DropProvider } from "react-native-reanimated-dnd";

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <DropProvider>
        <View style={{ flex: 1, padding: 20 }}>
          <Draggable data={{ id: "1", title: "Drag me!" }}>
            <View
              style={{
                padding: 20,
                backgroundColor: "#007AFF",
                borderRadius: 8,
              }}
            >
              <Text style={{ color: "white" }}>Drag me around!</Text>
            </View>
          </Draggable>
        </View>
      </DropProvider>
    </GestureHandlerRootView>
  );
}
```

### Sortable List

```tsx
import React, { useState } from "react";
import { View, Text } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Sortable, SortableItem } from "react-native-reanimated-dnd";

interface Task {
  id: string;
  title: string;
}

export default function SortableExample() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: "1", title: "Learn React Native" },
    { id: "2", title: "Build an app" },
    { id: "3", title: "Deploy to store" },
  ]);

  const renderTask = ({ item, id, positions, ...props }) => (
    <SortableItem
      key={id}
      id={id}
      positions={positions}
      {...props}
      onMove={(itemId, from, to) => {
        const newTasks = [...tasks];
        const [movedTask] = newTasks.splice(from, 1);
        newTasks.splice(to, 0, movedTask);
        setTasks(newTasks);
      }}
    >
      <View
        style={{
          padding: 16,
          backgroundColor: "white",
          marginVertical: 4,
          borderRadius: 8,
          shadowOpacity: 0.1,
          shadowRadius: 4,
        }}
      >
        <Text>{item.title}</Text>
      </View>
    </SortableItem>
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Sortable
        data={tasks}
        renderItem={renderTask}
        itemHeight={60}
        style={{ flex: 1, padding: 16 }}
      />
    </GestureHandlerRootView>
  );
}
```

## API Reference

### Components

#### `<Draggable>`

Makes any component draggable.

**Props:**

- `data: any` - Data associated with the draggable item
- `onDragStart?: (data: any) => void` - Called when dragging starts
- `onDragEnd?: (data: any) => void` - Called when dragging ends
- `dragDisabled?: boolean` - Disable dragging
- `collisionAlgorithm?: 'center' | 'intersect' | 'contain'` - Collision detection method

#### `<Droppable>`

Creates a drop zone for draggable items.

**Props:**

- `onDrop: (data: any) => void` - Called when an item is dropped
- `onDragEnter?: (data: any) => void` - Called when an item enters the drop zone
- `onDragLeave?: (data: any) => void` - Called when an item leaves the drop zone

#### `<Sortable>`

High-level component for sortable lists.

**Props:**

- `data: Array<{ id: string }>` - Array of items to render
- `renderItem: (props: SortableRenderItemProps) => React.ReactNode` - Render function for items
- `itemHeight: number` - Height of each item
- `itemKeyExtractor?: (item: any, index: number) => string` - Custom key extractor

#### `<SortableItem>`

Individual item within a sortable list.

**Props:**

- `id: string` - Unique identifier
- `onMove?: (id: string, from: number, to: number) => void` - Called when item is moved
- `onDragStart?: (id: string, position: number) => void` - Called when dragging starts
- `onDrop?: (id: string, position: number) => void` - Called when item is dropped

### Hooks

#### `useDraggable(options)`

Hook for creating draggable functionality.

#### `useDroppable(options)`

Hook for creating droppable functionality.

#### `useSortable(options)`

Hook for individual sortable items.

#### `useSortableList(options)`

Hook for managing sortable lists.

### Context

#### `<DropProvider>`

Required context provider that manages drag-and-drop state. Must wrap all draggable and droppable components.

## Advanced Usage

### Drag Handles

```tsx
<SortableItem id={item.id} {...props}>
  <View style={styles.itemContainer}>
    <Text>{item.title}</Text>

    <SortableItem.Handle style={styles.dragHandle}>
      <Text>⋮⋮</Text>
    </SortableItem.Handle>
  </View>
</SortableItem>
```

### Custom Animations

```tsx
const customAnimation = (toValue) => {
  "worklet";
  return withTiming(toValue, {
    duration: 300,
    easing: Easing.bezier(0.25, 0.1, 0.25, 1),
  });
};

<Draggable data={data} animationFunction={customAnimation}>
  {/* content */}
</Draggable>;
```

### Collision Detection

```tsx
// Center point collision (precise)
<Draggable collisionAlgorithm="center" data={data}>
  {/* content */}
</Draggable>

// Intersection collision (default, forgiving)
<Draggable collisionAlgorithm="intersect" data={data}>
  {/* content */}
</Draggable>

// Containment collision (strict)
<Draggable collisionAlgorithm="contain" data={data}>
  {/* content */}
</Draggable>
```

## Examples

Check out the [examples](./examples) directory for more comprehensive examples including:

- Basic drag and drop
- Sortable lists with reordering
- Drag handles
- Custom animations
- Multiple drop zones
- Nested draggables

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## License

MIT © [Vishesh Raheja](https://github.com/entropyconquers)

## Acknowledgments

- Built with [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)
- Gesture handling by [React Native Gesture Handler](https://docs.swmansion.com/react-native-gesture-handler/)
- Inspired by the React ecosystem's drag-and-drop libraries
