---
title: "Accessibility"
---

Guidelines for making drag-and-drop interfaces accessible to all users.

## The Challenge

Drag-and-drop interactions are inherently gesture-based, which presents challenges for users who:

- Use screen readers (VoiceOver, TalkBack)
- Have limited motor control
- Cannot perform precise touch gestures
- Rely on keyboard or switch access

While React Native's gesture-based paradigm makes full screen reader accessibility for drag-and-drop complex, there are patterns you can follow to improve the experience.

## Accessible Labels

Always provide accessibility labels that describe the draggable item and its purpose:

```tsx
<Draggable data={task}>
  <View
    accessible={true}
    accessibilityLabel={`Task: ${task.title}. Draggable.`}
    accessibilityHint="Long press and drag to reorder"
    accessibilityRole="button"
  >
    <Text>{task.title}</Text>
  </View>
</Draggable>
```

For droppable zones:

```tsx
<Droppable onDrop={handleDrop}>
  <View
    accessible={true}
    accessibilityLabel={`Drop zone: ${zone.name}. ${zone.items.length} items.`}
    accessibilityHint="Drag items here to add them"
  >
    <Text>{zone.name}</Text>
  </View>
</Droppable>
```

## Alternative Interaction Methods

The most impactful accessibility improvement is providing non-drag alternatives for the same actions.

### Move Buttons for Sortable Lists

Add up/down buttons that are visible (or at least accessible) as an alternative to dragging:

```tsx
function AccessibleSortableItem({ item, index, onMoveUp, onMoveDown, total }) {
  return (
    <SortableItem id={item.id} data={item} {...sortableProps}>
      <View style={styles.row}>
        <Text>{item.title}</Text>
        <View style={styles.actions}>
          {index > 0 && (
            <Pressable
              onPress={() => onMoveUp(index)}
              accessibilityLabel={`Move ${item.title} up`}
              accessibilityRole="button"
            >
              <Text>▲</Text>
            </Pressable>
          )}
          {index < total - 1 && (
            <Pressable
              onPress={() => onMoveDown(index)}
              accessibilityLabel={`Move ${item.title} down`}
              accessibilityRole="button"
            >
              <Text>▼</Text>
            </Pressable>
          )}
        </View>
      </View>
    </SortableItem>
  );
}
```

### Action Menus for Drag-and-Drop

For drag-to-drop-zone interactions, provide a tap-based alternative:

```tsx
function AccessibleCard({ task, columns }) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <Draggable data={task}>
      <View style={styles.card}>
        <Text>{task.title}</Text>
        <Pressable
          onPress={() => setShowMenu(true)}
          accessibilityLabel={`Move ${task.title} to another column`}
          accessibilityRole="button"
        >
          <Text>Move to...</Text>
        </Pressable>

        {showMenu && (
          <View accessibilityRole="menu">
            {columns.map((col) => (
              <Pressable
                key={col.id}
                onPress={() => {
                  moveTask(task.id, col.id);
                  setShowMenu(false);
                }}
                accessibilityLabel={`Move to ${col.name}`}
                accessibilityRole="menuitem"
              >
                <Text>{col.name}</Text>
              </Pressable>
            ))}
          </View>
        )}
      </View>
    </Draggable>
  );
}
```

## Visual Feedback

Ensure visual feedback during drag operations is clear and high-contrast:

### Active Drop Zone Styling

```tsx
<Droppable
  onDrop={handleDrop}
  activeStyle={{
    borderColor: "#007AFF",
    borderWidth: 3,
    backgroundColor: "rgba(0, 122, 255, 0.15)",
  }}
>
  <View style={styles.dropZone}>
    <Text>Drop here</Text>
  </View>
</Droppable>
```

### State-Based Feedback

Use `onStateChange` to provide visual feedback about the drag state:

```tsx
function FeedbackDraggable({ item }) {
  const [state, setState] = useState(DraggableState.IDLE);

  return (
    <Draggable data={item} onStateChange={setState}>
      <View
        style={[
          styles.item,
          state === DraggableState.DRAGGING && styles.dragging,
          state === DraggableState.DROPPED && styles.dropped,
        ]}
        accessibilityLabel={`${item.title}. ${
          state === DraggableState.DRAGGING
            ? "Currently dragging"
            : state === DraggableState.DROPPED
              ? "Dropped successfully"
              : "Ready to drag"
        }`}
      >
        <Text>{item.title}</Text>
      </View>
    </Draggable>
  );
}
```

## Reduced Motion

Respect the user's reduced motion preference by providing simpler animations:

```tsx
import { AccessibilityInfo } from "react-native";

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduced);
    const subscription = AccessibilityInfo.addEventListener(
      "reduceMotionChanged",
      setReduced
    );
    return () => subscription.remove();
  }, []);

  return reduced;
}

function AccessibleDraggable({ data, children }) {
  const reduceMotion = useReducedMotion();

  const animation = useCallback(
    (toValue: number) => {
      "worklet";
      if (reduceMotion) {
        return withTiming(toValue, { duration: 0 });
      }
      return withSpring(toValue, { damping: 15 });
    },
    [reduceMotion]
  );

  return (
    <Draggable data={data} animationFunction={animation}>
      {children}
    </Draggable>
  );
}
```

## Announcements

Use `AccessibilityInfo.announceForAccessibility` to provide screen reader announcements for drag events:

```tsx
import { AccessibilityInfo } from "react-native";

<Draggable
  data={task}
  onDragStart={() => {
    AccessibilityInfo.announceForAccessibility(
      `Started dragging ${task.title}`
    );
  }}
  onDragEnd={() => {
    AccessibilityInfo.announceForAccessibility(
      `Finished dragging ${task.title}`
    );
  }}
>
  <Text>{task.title}</Text>
</Draggable>

<Droppable
  onDrop={(data) => {
    handleDrop(data);
    AccessibilityInfo.announceForAccessibility(
      `${data.title} dropped into ${zoneName}`
    );
  }}
>
  <Text>{zoneName}</Text>
</Droppable>
```

## Checklist

- [ ] All draggable items have `accessibilityLabel` and `accessibilityHint`
- [ ] All drop zones have descriptive `accessibilityLabel`
- [ ] Alternative non-drag methods exist for critical actions
- [ ] Visual feedback uses sufficient contrast (4.5:1 ratio minimum)
- [ ] Reduced motion preference is respected
- [ ] Screen reader announcements are provided for drag events
- [ ] Touch targets are at least 44x44 points (Apple HIG) or 48x48 dp (Material)

## See Also

- [React Native Accessibility Docs](https://reactnative.dev/docs/accessibility)
- [Apple Human Interface Guidelines: Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility)
- [Material Design: Accessibility](https://m3.material.io/foundations/overview)
