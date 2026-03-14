---
title: "Introduction"
---

Welcome to React Native Reanimated DnD - a powerful, performant drag-and-drop library built on React Native Reanimated 4 and Worklets and Gesture Handler.

## What is React Native Reanimated DnD?

React Native Reanimated DnD is a comprehensive drag-and-drop solution that provides:

- **Smooth 60fps animations** powered by React Native Reanimated 4 and Worklets
- **Gesture-based interactions** using React Native Gesture Handler
- **Flexible collision detection** with multiple algorithms
- **TypeScript support** with full type safety
- **Cross-platform compatibility** for iOS and Android

## Key Features

### 🎯 **Easy to Use**

Simple API that works out of the box with minimal configuration.

### ⚡ **High Performance**

All animations run on the UI thread for consistent 60fps performance with FlatList virtualization.

### 📜 **Vertical & Horizontal Sortable Lists**

Drag and drop to sort lists in any direction, with automatic scrolling for out-of-view items.

### 🔲 **Sortable Grids**

2D grid drag-and-drop with insert and swap reordering strategies, 8-directional auto-scroll, and handle support.

### 🎨 **Highly Customizable**

Extensive customization options for animations, collision detection, and visual feedback.

### 📱 **Mobile Optimized**

Designed specifically for mobile touch interactions with proper gesture handling.

### 🔧 **TypeScript Ready**

Full TypeScript support with comprehensive type definitions.

## Quick Example

Here's a simple drag-and-drop implementation:

```tsx
import React from "react";
import { View, Text } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  DropProvider,
  Draggable,
  Droppable,
} from "react-native-reanimated-dnd";

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <DropProvider>
        <View style={{ flex: 1, padding: 20 }}>
          <Draggable data={{ id: "1", name: "Task 1" }}>
            <View style={{ padding: 20, backgroundColor: "#e3f2fd" }}>
              <Text>Drag me!</Text>
            </View>
          </Draggable>

          <Droppable onDrop={(data) => console.log("Dropped:", data)}>
            <View
              style={{ padding: 40, backgroundColor: "#f3e5f5", marginTop: 20 }}
            >
              <Text>Drop here!</Text>
            </View>
          </Droppable>
        </View>
      </DropProvider>
    </GestureHandlerRootView>
  );
}
```

## Core Components

### Draggable

Make any component draggable with data payload support:

```tsx
<Draggable data={{ id: "1", name: "Item" }}>
  <YourComponent />
</Draggable>
```

### Droppable

Create drop zones that receive draggable items:

```tsx
<Droppable onDrop={(data) => handleDrop(data)}>
  <YourDropZone />
</Droppable>
```

### SortableGrid

High-level component for reorderable 2D grids:

```tsx
<SortableGrid
  data={items}
  renderItem={({ item, id, ...props }) => (
    <SortableGridItem key={id} id={id} data={item} {...props}>
      <ItemComponent item={item} />
    </SortableGridItem>
  )}
  dimensions={{ columns: 4, itemWidth: 80, itemHeight: 80, rowGap: 12, columnGap: 12 }}
  orientation={GridOrientation.Vertical}
  strategy={GridStrategy.Insert}
/>
```

### Sortable

High-level component for reorderable lists (vertical and horizontal):

```tsx
// Vertical sortable list (default)
<Sortable
  data={items}
  renderItem={({ item, id, positions, lowerBound, autoScrollDirection, itemsCount, itemHeight }) => (
    <SortableItem
      key={id}
      id={id}
      data={item}
      positions={positions}
      lowerBound={lowerBound}
      autoScrollDirection={autoScrollDirection}
      itemsCount={itemsCount}
      itemHeight={itemHeight}
      onMove={(itemId, from, to) => {
        // Handle reordering
        const newItems = [...items];
        const [movedItem] = newItems.splice(from, 1);
        newItems.splice(to, 0, movedItem);
        setItems(newItems);
      }}
    >
      <ItemComponent item={item} />
    </SortableItem>
  )}
  itemHeight={60}
/>

// Horizontal sortable list
<Sortable
  data={tags}
  renderItem={({ item, id, positions, leftBound, autoScrollDirection, itemsCount, itemWidth, gap, paddingHorizontal }) => (
    <SortableItem
      key={id}
      id={id}
      data={item}
      positions={positions}
      leftBound={leftBound}
      autoScrollHorizontalDirection={autoScrollDirection}
      itemsCount={itemsCount}
      direction={SortableDirection.Horizontal}
      itemWidth={itemWidth}
      gap={gap}
      paddingHorizontal={paddingHorizontal}
    >
      <TagComponent tag={item} />
    </SortableItem>
  )}
  direction={SortableDirection.Horizontal}
  itemWidth={120}
  gap={12}
  paddingHorizontal={16}
/>
```

## Use Cases

React Native Reanimated DnD is perfect for:

- **Kanban boards** and task management
- **File managers** with drag-and-drop organization
- **Photo galleries** with reordering
- **Form builders** with draggable components
- **Shopping carts** with drag-to-add functionality
- **Sortable lists** and data tables
- **Game interfaces** with draggable elements

## Why Choose This Library?

### Performance First

- UI thread animations via Reanimated 4 and Worklets
- Optimized collision detection algorithms
- Minimal JavaScript bridge communication
- Smooth interactions even on lower-end devices

### Developer Experience

- Intuitive API design
- Comprehensive TypeScript support
- Extensive documentation with examples
- Active community support

### Production Ready

- Battle-tested in production apps
- Comprehensive error handling
- Memory leak prevention
- Cross-platform consistency

## Getting Started

Ready to add drag-and-drop to your app? Start with our quick setup guide:

1. **[Installation](./getting-started/installation)** - Install the library and dependencies
2. **[Quick Start](./getting-started/quick-start)** - Build your first drag-and-drop interface
3. **[Basic Concepts](./getting-started/basic-concepts)** - Understand the core concepts
4. **[API Reference](./api/overview)** - Explore all available components and hooks

## Community

- **GitHub**: [Repository](https://github.com/entropyconquers/react-native-reanimated-dnd)
- **Issues**: [Bug Reports & Feature Requests](https://github.com/entropyconquers/react-native-reanimated-dnd/issues)
- **Discussions**: [Community Discussions](https://github.com/entropyconquers/react-native-reanimated-dnd/discussions)

## License

MIT License - see the [LICENSE](https://github.com/entropyconquers/react-native-reanimated-dnd/blob/main/LICENSE) file for details.
