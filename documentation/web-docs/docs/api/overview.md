---
title: "API Overview"
---

Complete API reference for React Native Reanimated DnD library. This section provides detailed documentation for all components, hooks, types, and utilities.

## Quick Navigation

### 🧩 [Components](./components/draggable)

High-level React components for implementing drag-and-drop functionality:

- **[Draggable](./components/draggable)** - Make any component draggable (includes `Draggable.Handle`)
- **[Droppable](./components/droppable)** - Create drop zones for draggable items
- **[Sortable](./components/sortable)** - High-level sortable list component
- **[SortableItem](./components/sortable-item)** - Individual items in sortable lists (includes `SortableItem.Handle`)
- **[SortableGrid](./components/sortable-grid)** - High-level sortable grid component
- **[SortableGridItem](./components/sortable-grid-item)** - Individual items in sortable grids (includes `SortableGridItem.Handle`)

### 🪝 [Hooks](./hooks/useDraggable)

Low-level hooks for custom implementations:

- **[useDraggable](./hooks/useDraggable)** - Core draggable functionality
- **[useDroppable](./hooks/useDroppable)** - Core droppable functionality
- **[useSortable](./hooks/useSortable)** - Individual sortable item logic
- **[useSortableList](./hooks/useSortableList)** - Sortable list management
- **[useGridSortable](./hooks/useGridSortable)** - Individual grid sortable item logic
- **[useGridSortableList](./hooks/useGridSortableList)** - Grid sortable list management

### 🏗️ [Context & Providers](./context/DropProvider)

Context providers and their APIs:

- **[DropProvider](./context/DropProvider)** - Main context provider for drag-and-drop
- **[DragDropContext](./context/DragDropContext)** - Context value and methods

### 📝 [Types & Interfaces](./types/draggable-types)

Complete TypeScript definitions:

- **[Draggable Types](./types/draggable-types)** - Types for draggable functionality
- **[Droppable Types](./types/droppable-types)** - Types for droppable functionality
- **[Sortable Types](./types/sortable-types)** - Types for sortable functionality
- **[Grid Types](./types/grid-types)** - Types for sortable grid functionality
- **[Context Types](./types/context-types)** - Types for context and providers
- **[Enums](./types/enums)** - Enumeration definitions

### 🛠️ [Utilities](./utilities/collision-algorithms)

Helper functions and algorithms:

- **[Collision Algorithms](./utilities/collision-algorithms)** - Collision detection methods
- **[Animation Functions](./utilities/animation-functions)** - Custom animation utilities
- **[Helper Functions](./utilities/helper-functions)** - Utility functions

## Library Architecture

### Core Concepts

The library is built around several key concepts:

1. **DropProvider**: The root context provider that manages all drag-and-drop state
2. **Draggable**: Items that can be picked up and moved
3. **Droppable**: Areas where draggable items can be dropped
4. **Sortable**: Special case for reorderable lists
5. **SortableGrid**: 2D grid sorting with insert and swap strategies
6. **Handles**: Optional components that restrict where dragging can be initiated

### Component Hierarchy

```
DropProvider
├── Draggable
│   └── DragHandle (optional)
├── Droppable
├── Sortable
│   └── SortableItem
│       └── SortableHandle (optional)
└── SortableGrid
    └── SortableGridItem
        └── SortableGridHandle (optional)
```

### Data Flow

1. **DropProvider** creates context and manages global state
2. **Draggable** components register with the context
3. **Droppable** components register as drop zones
4. Collision detection determines valid drop targets
5. Drop events trigger callbacks and state updates

## Getting Started with the API

### Basic Usage Pattern

```tsx
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  DropProvider,
  Draggable,
  Droppable,
} from "react-native-reanimated-dnd";

function App() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <DropProvider>
        <Draggable data={{ id: "1", name: "Item 1" }}>
          <Text>Drag me!</Text>
        </Draggable>

        <Droppable onDrop={(data) => console.log("Dropped:", data)}>
          <Text>Drop zone</Text>
        </Droppable>
      </DropProvider>
    </GestureHandlerRootView>
  );
}
```

### Hook-Based Usage

```tsx
import {
  DropProvider,
  useDraggable,
  useDroppable,
} from "react-native-reanimated-dnd";

function CustomDraggable() {
  const { animatedViewProps, gesture } = useDraggable({
    data: { id: "1", name: "Custom Item" },
  });

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View {...animatedViewProps}>
        <Text>Custom draggable</Text>
      </Animated.View>
    </GestureDetector>
  );
}

function CustomDroppable() {
  const { viewProps, isActive } = useDroppable({
    onDrop: (data) => console.log("Dropped:", data),
  });

  return (
    <View {...viewProps} style={[styles.dropZone, isActive && styles.active]}>
      <Text>Custom drop zone</Text>
    </View>
  );
}
```

## TypeScript Support

The library is fully typed with comprehensive TypeScript support:

### Generic Types

```tsx
interface TaskData {
  id: string;
  title: string;
  priority: "low" | "medium" | "high";
}

// Typed draggable
const { animatedViewProps } = useDraggable<TaskData>({
  data: { id: "1", title: "Task 1", priority: "high" },
});

// Typed droppable
const { viewProps } = useDroppable<TaskData>({
  onDrop: (data: TaskData) => {
    // data is properly typed
    console.log(`Dropped task: ${data.title}`);
  },
});
```

### Type Exports

All types are exported for use in your application:

```tsx
import type {
  DraggableState,
  CollisionAlgorithm,
  DropAlignment,
  UseDraggableOptions,
  UseDroppableOptions,
  DroppedItemsMap,
  SlotsContextValue,
} from "react-native-reanimated-dnd";
```

## Performance Considerations

### Optimization Tips

1. **Use `useCallback`** for event handlers to prevent unnecessary re-renders
2. **Memoize expensive calculations** with `useMemo`
3. **Limit collision detection frequency** by choosing appropriate algorithms
4. **Use handles** for large draggable components to improve performance
5. **Throttle position updates** in `onDragging` callbacks

### Memory Management

- Components automatically clean up listeners on unmount
- Position update listeners are managed internally
- Context subscriptions are handled automatically

## Error Handling

### Common Patterns

```tsx
// Context validation
function useSafeDragDropContext() {
  const context = useContext(SlotsContext);

  if (!context) {
    throw new Error("Component must be used within a DropProvider");
  }

  return context;
}

// Error boundaries
function DragDropErrorBoundary({ children }) {
  return (
    <ErrorBoundary
      fallback={<Text>Drag and drop error occurred</Text>}
      onError={(error) => console.error("DnD Error:", error)}
    >
      {children}
    </ErrorBoundary>
  );
}
```

## Migration Guide

### From Other Libraries

If you're migrating from other drag-and-drop libraries:

1. **react-native-draggable**: Replace with `Draggable` component
2. **react-native-sortable-list**: Use `Sortable` or `useSortableList`
3. **react-native-drag-sort**: Migrate to `SortableItem` components

### Version Updates

Check the changelog for breaking changes between versions:

- Type definitions may change
- Component props may be added/removed
- Hook return values may be modified

## Best Practices

### Component Design

1. **Keep draggable content simple** for better performance
2. **Use semantic HTML/React Native elements** for accessibility
3. **Provide visual feedback** during drag operations
4. **Handle edge cases** like rapid gestures or interruptions

### State Management

1. **Sync with your app state** using provider callbacks
2. **Persist important state** to storage when needed
3. **Handle concurrent operations** gracefully
4. **Validate data** before processing drops

### Accessibility

1. **Provide alternative interaction methods** for users with disabilities
2. **Use proper ARIA labels** and semantic elements
3. **Test with screen readers** and other assistive technologies
4. **Ensure sufficient contrast** for visual feedback

## Examples by Use Case

### Task Management

- Kanban boards with drag-and-drop between columns
- Priority reordering within lists
- Task assignment between team members

### File Management

- File organization with drag-and-drop
- Folder creation and management
- Batch operations on multiple files

### Content Creation

- Layout builders with draggable components
- Image galleries with reordering
- Form builders with draggable fields

### Gaming

- Inventory management systems
- Puzzle games with draggable pieces
- Card games with hand management

## Community and Support

### Getting Help

1. **Check the documentation** for comprehensive guides
2. **Search existing issues** on GitHub
3. **Create minimal reproductions** when reporting bugs
4. **Follow the issue template** for faster resolution

### Contributing

1. **Read the contributing guide** before submitting PRs
2. **Add tests** for new features
3. **Update documentation** for API changes
4. **Follow the code style** guidelines

## Related Resources

- [React Native Reanimated Documentation](https://docs.swmansion.com/react-native-reanimated/)
- [React Native Gesture Handler Documentation](https://docs.swmansion.com/react-native-gesture-handler/)
- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

---

This API reference provides complete documentation for all library features. Use the navigation above to explore specific components, hooks, and utilities in detail.
