# Grid Implementation Porting Plan for react-native-reanimated-dnd

## Executive Summary

This document outlines a comprehensive plan for porting the grid functionality from `react-native-sortables` to the `react-native-reanimated-dnd` library. The implementation must strictly adhere to Reanimated 3 patterns and maintain compatibility with the existing DND architecture.

## Current State Analysis

### react-native-sortables Grid Architecture

- **Component**: `SortableGrid` with provider-based architecture
- **Layout System**: Dynamic grid layout with flexible columns/rows
- **Strategies**: Insert and swap reordering strategies
- **Auto-adjustment**: Cross-axis offset adjustment for collapsible items
- **Gap Support**: Row and column gap animations
- **Orientation**: Vertical (columns) and horizontal (rows) grids

### react-native-reanimated-dnd Current Architecture

- **Components**: Sortable, SortableItem, Draggable, Droppable
- **Hooks**: useSortable, useSortableList, useHorizontalSortable
- **Context**: DropProvider for managing drop zones
- **Directions**: Vertical and horizontal lists (not grids)
- **Limitations**: Linear sorting only, no 2D grid support

## Implementation Strategy

### Phase 1: Core Grid Infrastructure

#### 1.1 Grid Layout System

**New Files Required:**

- `hooks/useGridSortable.ts` - Core grid sorting hook
- `hooks/useGridSortableList.ts` - Grid list management
- `components/SortableGrid.tsx` - High-level grid component
- `components/SortableGridItem.tsx` - Grid item wrapper
- `lib/gridCalculations.ts` - Grid position calculations
- `types/grid.ts` - Grid-specific type definitions

**Key Implementation Points:**

```typescript
// Grid position calculation (following Reanimated rules)
const calculateGridPosition = (
  index: number,
  columns: number,
  itemSize: { width: number; height: number },
  gaps: { row: number; column: number }
) => {
  "worklet";
  const row = Math.floor(index / columns);
  const col = index % columns;
  return {
    x: col * (itemSize.width + gaps.column),
    y: row * (itemSize.height + gaps.row),
  };
};
```

#### 1.2 Grid Positions Management

**Shared Values Structure:**

```typescript
interface GridPositions {
  [id: string]: {
    index: number;
    row: number;
    column: number;
    x: SharedValue<number>;
    y: SharedValue<number>;
  };
}
```

### Phase 2: Grid Sorting Strategies

#### 2.1 Insert Strategy

- Shift items between dragged and target position
- Maintain grid flow (left-to-right, top-to-bottom)
- Handle edge cases for last row/column

#### 2.2 Swap Strategy

- Direct position exchange between two items
- Column-aware shifting for maintaining visual consistency
- Special handling for grid boundaries

**Implementation Approach:**

```typescript
const reorderGridInsert = (
  positions: GridPositions,
  activeId: string,
  targetId: string,
  columns: number
) => {
  "worklet";
  // Must run entirely on UI thread
  // No runOnJS calls allowed
  const activeIndex = positions[activeId].index;
  const targetIndex = positions[targetId].index;

  // Reorder logic here
  // Update all affected positions
};
```

### Phase 3: Grid-Specific Features

#### 3.1 Auto-scroll for Grids

**Requirements:**

- Horizontal + vertical scroll detection
- Corner zones for diagonal scrolling
- Speed variation based on distance from edge

#### 3.2 Dynamic Grid Dimensions

**Features to Implement:**

- Variable item sizes per row/column
- Responsive column count
- Auto-fit vs auto-fill modes

#### 3.3 Drop Zones in Grid

**Enhancements:**

- Between-item drop zones
- Empty cell detection
- Grid boundary expansion

### Phase 4: Integration with Existing Library

#### 4.1 Backward Compatibility

- Maintain all existing APIs
- Add grid as new feature set
- Share common utilities

#### 4.2 Unified Component Interface

```typescript
<Sortable
  data={items}
  renderItem={renderItem}
  layout="grid" // new prop
  columns={3}    // grid-specific
  rowGap={10}    // grid-specific
  columnGap={10} // grid-specific
  strategy="insert" // or "swap"
/>
```

## Critical Reanimated 3 Requirements

### ✅ MUST Follow:

1. **Worklet Annotations**
   - ALL functions that run on UI thread must have 'worklet' directive
   - Position calculations, gesture handlers, animations

2. **Shared Values Only**

   ```typescript
   // ✅ Correct
   const gridPositions = useSharedValue<GridPositions>({});

   // ❌ Wrong - no useState for animated values
   const [positions, setPositions] = useState({});
   ```

3. **No Bridge Crossing in Worklets**

   ```typescript
   const handleGesture = () => {
     "worklet";
     // ❌ NEVER do this in worklet
     console.log("dragging");
     runOnJS(updateState)(newValue);

     // ✅ Update shared values directly
     position.value = newValue;
   };
   ```

4. **Animated Styles Pattern**

   ```typescript
   const animatedStyle = useAnimatedStyle(() => ({
     transform: [
       { translateX: withSpring(position.value.x) },
       { translateY: withSpring(position.value.y) },
     ],
     zIndex: isDragging.value ? 1000 : 1,
   }));
   ```

5. **Gesture Handler Integration**
   ```typescript
   const gesture = Gesture.Pan()
     .onStart(() => {
       "worklet";
       startPosition.value = { ...position.value };
     })
     .onUpdate((e) => {
       "worklet";
       position.value = {
         x: startPosition.value.x + e.translationX,
         y: startPosition.value.y + e.translationY,
       };
     })
     .onEnd(() => {
       "worklet";
       // Calculate target position
       // Animate to grid slot
     });
   ```

## Edge Cases & Challenges

### 1. Grid Boundary Handling

- **Issue**: Items at edges need special treatment
- **Solution**: Boundary detection in worklets, conditional swap zones

### 2. Variable Item Sizes

- **Issue**: Different sized items break grid alignment
- **Solution**:
  - Option 1: Force uniform sizing
  - Option 2: Masonry-style layout with complex position tracking
  - Recommendation: Start with uniform, add masonry in v2

### 3. Performance with Large Grids

- **Issue**: Too many animated values can cause lag
- **Solution**:
  - Virtualization for off-screen items
  - Lazy position calculation
  - Batch updates using `runOnUI`

### 4. Scroll Synchronization

- **Issue**: Grid scroll vs drag scroll conflict
- **Solution**:
  - Lock scroll during drag
  - Auto-scroll zones with deadband
  - Gesture handler simultaneousHandlers prop

### 5. Rotation/Orientation Changes

- **Issue**: Grid layout breaks on rotation
- **Solution**:
  - Recalculate positions on dimension change
  - Animate transitions smoothly
  - Store relative positions, not absolute

### 6. Accessibility

- **Issue**: Grid navigation for screen readers
- **Solution**:
  - Proper ARIA labels
  - Keyboard navigation support
  - Announce position changes

## Implementation Phases

### Phase 1: Foundation

- [ ] Create grid types and interfaces
- [ ] Implement basic grid position calculations
- [ ] Build useGridSortable hook
- [ ] Create SortableGrid component

### Phase 2: Core Features

- [ ] Implement insert strategy
- [ ] Implement swap strategy
- [ ] Add gesture handling for grid items
- [ ] Integrate with existing DropProvider

### Phase 3: Advanced Features

- [ ] Add auto-scroll for grids
- [ ] Implement gap animations
- [ ] Add drop indicators
- [ ] Handle dynamic grid sizing

### Phase 4: Polish & Testing

- [ ] Performance optimization
- [ ] Edge case handling
- [ ] Animation fine-tuning
- [ ] Comprehensive testing

## Testing Strategy

### Unit Tests

- Grid position calculations
- Reorder algorithms
- Strategy implementations

### Integration Tests

- Grid with existing components
- Provider interactions
- Gesture handling

### Performance Tests

- Large grid rendering (100+ items)
- Smooth animation at 60fps
- Memory usage monitoring

### Device Testing

- iOS: iPhone, iPad
- Android: Various screen sizes
- Orientation changes
- Different React Native versions

## Migration Guide for Users

### From Linear to Grid

```typescript
// Before (Linear List)
<Sortable
  data={items}
  renderItem={renderItem}
  itemHeight={60}
  direction="vertical"
/>

// After (Grid)
<Sortable
  data={items}
  renderItem={renderItem}
  layout="grid"
  columns={3}
  itemHeight={100}
  itemWidth={100}
  rowGap={10}
  columnGap={10}
/>
```

### Custom Grid Item

```typescript
const renderGridItem = ({ item, id, positions, ...props }) => (
  <SortableGridItem
    key={id}
    id={id}
    positions={positions}
    {...props}
  >
    <View style={styles.gridItem}>
      <Image source={item.image} />
      <Text>{item.title}</Text>
    </View>
  </SortableGridItem>
);
```

## API Design

### SortableGrid Props

```typescript
interface SortableGridProps<T> {
  // Data
  data: T[];
  renderItem: (props: GridRenderItemProps<T>) => ReactNode;
  keyExtractor?: (item: T, index: number) => string;

  // Layout
  columns?: number; // For vertical grids
  rows?: number; // For horizontal grids
  itemWidth?: number; // Fixed or auto
  itemHeight?: number; // Fixed or auto

  // Gaps
  rowGap?: number;
  columnGap?: number;

  // Behavior
  strategy?: "insert" | "swap" | CustomStrategy;
  onReorder?: (items: T[], from: number, to: number) => void;
  onDragStart?: (item: T, index: number) => void;
  onDragEnd?: (item: T, index: number) => void;

  // Styling
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;
  itemContainerStyle?: ViewStyle;

  // Performance
  virtualized?: boolean;
  windowSize?: number;
}
```

## Reanimated-Specific Gotchas

### ❌ Common Mistakes to Avoid:

1. **Using console.log in worklets**

   ```typescript
   // ❌ Will crash
   const gesture = () => {
     "worklet";
     console.log("dragging"); // CRASH!
   };

   // ✅ Use runOnJS for logging
   const log = (msg: string) => console.log(msg);
   const gesture = () => {
     "worklet";
     runOnJS(log)("dragging");
   };
   ```

2. **Accessing component state in worklets**

   ```typescript
   // ❌ Won't work
   const [columns, setColumns] = useState(3);
   const calculatePosition = () => {
     "worklet";
     return index % columns; // Can't access columns!
   };

   // ✅ Use shared values
   const columns = useSharedValue(3);
   const calculatePosition = () => {
     "worklet";
     return index % columns.value;
   };
   ```

3. **Modifying objects directly**

   ```typescript
   // ❌ Won't trigger updates
   positions.value[id] = newPosition;

   // ✅ Create new object
   positions.value = {
     ...positions.value,
     [id]: newPosition,
   };
   ```

4. **Using hooks conditionally**

   ```typescript
   // ❌ Breaks rules of hooks
   if (isGrid) {
     const gridPositions = useSharedValue({});
   }

   // ✅ Always call hooks
   const gridPositions = useSharedValue({});
   // Use conditionally later
   ```

5. **Forgetting worklet directive**

   ```typescript
   // ❌ Will run on JS thread
   const onGestureUpdate = (e) => {
     position.value = e.translationX;
   };

   // ✅ Runs on UI thread
   const onGestureUpdate = (e) => {
     "worklet";
     position.value = e.translationX;
   };
   ```

## Success Criteria

### Functionality

- [ ] Grid items can be dragged and reordered
- [ ] Both insert and swap strategies work
- [ ] Auto-scroll functions in all directions
- [ ] Smooth animations at 60fps
- [ ] No bridge crossing in hot paths

### Performance

- [ ] < 16ms frame time during drag
- [ ] < 100ms initial render for 50 items
- [ ] < 200MB memory usage for 100 items
- [ ] No JS thread blocking

### Quality

- [ ] TypeScript types for all APIs
- [ ] Zero console warnings
- [ ] Comprehensive documentation
- [ ] Example app with all features
- [ ] 90%+ test coverage

### Compatibility

- [ ] Works with RN 0.70+
- [ ] Works with Reanimated 3.0+
- [ ] iOS 13+ support
- [ ] Android 5.0+ support
- [ ] Web support (stretch goal)

## Conclusion

This porting plan provides a structured approach to implementing grid functionality in react-native-reanimated-dnd while strictly adhering to Reanimated 3 requirements. The key to success is:

1. **Always think in worklets** - UI thread first
2. **Use shared values exclusively** - No useState for animations
3. **Test performance early** - Profile with 100+ items
4. **Handle edge cases** - Boundaries, rotations, empty states
5. **Maintain backward compatibility** - Don't break existing features

The implementation should be done incrementally, with each phase thoroughly tested before moving to the next. The grid feature will significantly enhance the library's capabilities while maintaining the performance and smoothness that Reanimated 3 provides.
