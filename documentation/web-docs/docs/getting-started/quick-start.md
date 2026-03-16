---
title: "Quick Start"
---

Get up and running with React Native Reanimated DnD in minutes.

## Basic Setup

### 1. Wrap your app with DropProvider

The `DropProvider` is the foundation that enables communication between draggable and droppable components. It must wrap all drag-and-drop functionality in your app.

```tsx
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { DropProvider } from "react-native-reanimated-dnd";

function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <DropProvider>{/* Your app content */}</DropProvider>
    </GestureHandlerRootView>
  );
}
```

### 2. Create your first draggable

```tsx
import { Draggable } from "react-native-reanimated-dnd";

function MyDraggable() {
  return (
    <Draggable data={{ id: "1", name: "First Item" }}>
      <View style={styles.draggableItem}>
        <Text>Drag me!</Text>
      </View>
    </Draggable>
  );
}
```

### 3. Add a drop zone

```tsx
import { Droppable } from "react-native-reanimated-dnd";

function MyDropZone() {
  return (
    <Droppable onDrop={(data) => console.log("Dropped:", data)}>
      <View style={styles.dropZone}>
        <Text>Drop items here</Text>
      </View>
    </Droppable>
  );
}
```

## Complete Example

Here's a complete working example that demonstrates basic drag-and-drop functionality:

```tsx
import React, { useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  DropProvider,
  Draggable,
  Droppable,
} from "react-native-reanimated-dnd";

interface Item {
  id: string;
  title: string;
  color: string;
}

export default function QuickStartExample() {
  const [items] = useState<Item[]>([
    { id: "1", title: "Item 1", color: "#FF6B6B" },
    { id: "2", title: "Item 2", color: "#4ECDC4" },
    { id: "3", title: "Item 3", color: "#45B7D1" },
  ]);

  const handleDrop = (data: Item) => {
    Alert.alert("Success!", `${data.title} was dropped!`);
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <DropProvider>
        <View style={styles.content}>
          <Text style={styles.title}>Quick Start Example</Text>

          {/* Draggable Items */}
          <View style={styles.itemsContainer}>
            {items.map((item) => (
              <Draggable key={item.id} data={item}>
                <View
                  style={[
                    styles.draggableItem,
                    { backgroundColor: item.color },
                  ]}
                >
                  <Text style={styles.itemText}>{item.title}</Text>
                </View>
              </Draggable>
            ))}
          </View>

          {/* Drop Zone */}
          <Droppable onDrop={handleDrop}>
            <View style={styles.dropZone}>
              <Text style={styles.dropZoneText}>Drop items here</Text>
            </View>
          </Droppable>
        </View>
      </DropProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
    color: "#333",
  },
  itemsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 50,
  },
  draggableItem: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  itemText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 12,
    textAlign: "center",
  },
  dropZone: {
    height: 150,
    backgroundColor: "#e0e0e0",
    borderWidth: 2,
    borderColor: "#999",
    borderStyle: "dashed",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  dropZoneText: {
    fontSize: 18,
    color: "#666",
    fontWeight: "500",
  },
});
```

## Key Points

- **DropProvider**: Must wrap all draggable and droppable components
- **GestureHandlerRootView**: Required for gesture handling to work properly
- **data prop**: Pass data that will be available in drop handlers
- **onDrop callback**: Handle successful drop events

## Next Steps

- Learn about [Basic Concepts](./basic-concepts) for deeper understanding
- Explore [Advanced Features](../examples/advanced-features) for more complex use cases
- Check out [Performance Tips](../guides/performance) for optimization strategies

## Data Requirements

When working with sortable lists, all data items **MUST** have an `id` property of type string:

```tsx
// Correct - Each item has a unique string id
const items = [
  { id: "1", title: "First Item" },
  { id: "2", title: "Second Item" },
  { id: "3", title: "Third Item" },
];

// Incorrect - Missing id properties
const badItems = [{ title: "Item without ID" }, { name: "Another item" }];

// Incorrect - Non-string ids
const badIds = [
  { id: 1, title: "Numeric ID" },
  { id: null, title: "Null ID" },
];
```

This `id` property is essential for the library to track items during reordering operations. The library includes runtime validation in development mode to warn you about invalid IDs.

## Sortable Lists

For reorderable lists, use the `Sortable` and `SortableItem` components:

```tsx
import { Sortable, SortableItem } from "react-native-reanimated-dnd";

function SortableExample() {
  const [items, setItems] = useState([
    { id: "1", title: "First Item" },
    { id: "2", title: "Second Item" },
    { id: "3", title: "Third Item" },
  ]);

  const renderItem = ({ item, ...props }) => (
    <SortableItem {...props}>
      <View style={styles.sortableItem}>
        <Text>{item.title}</Text>
        <Text style={styles.dragIndicator}>⋮⋮</Text>
      </View>
    </SortableItem>
  );

  return (
    <Sortable
      data={items}
      renderItem={renderItem}
      itemHeight={60}
      style={styles.sortableList}
    />
  );
}
```

## Key Features Demonstrated

### Data Flow

- **Draggable** components carry data through the `data` prop
- **Droppable** components receive this data via the `onDrop` callback
- Data can be any JavaScript object (strings, numbers, objects, arrays)

### Visual Feedback

- Items automatically animate when dragged
- Drop zones can show visual feedback when items hover over them
- Smooth return animations when items are dropped outside valid zones

### State Management

- Use React state to track dropped items
- Update your application state in drop handlers
- Integrate with your existing state management solution

## Advanced Features Preview

The library includes many advanced features you can explore:

- **Drag Handles**: Specific areas that initiate dragging
- **Collision Detection**: Multiple algorithms (center, intersect, contain)
- **Bounded Dragging**: Constrain movement within specific areas
- **Axis Constraints**: Limit movement to horizontal or vertical
- **Custom Animations**: Define your own animation functions
- **Auto-scrolling**: Automatic scrolling in sortable lists

## AI Integration Skill

Want AI coding agents to write correct integration code for you? Install the official [agent skill](https://agentskills.io) — it works with Claude Code, Codex, Cursor, Gemini CLI, GitHub Copilot, and 30+ more:

```bash
npx skills add entropyconquers/react-native-reanimated-dnd
```

Once installed, just describe what you want in natural language and your agent will generate working code with correct imports, props, and state management. See the [AI Integration Skill](./ai-skill) page for all installation options.

## What's Next?

- [Basic Concepts](./basic-concepts) - Understand the core concepts and architecture
- [Setup Provider](./setup-provider) - Learn about provider configuration and callbacks
- [AI Integration Skill](./ai-skill) - Use AI agents to generate integration code
- [Components Overview](../components/draggable) - Explore all available components
- [Examples](../examples/basic-drag-drop) - See more detailed examples
