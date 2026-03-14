# React Native Reanimated DnD

<p align="center">
  <img src="https://github.com/user-attachments/assets/dba6226e-c407-4a12-9feb-e8f588d6c1e3" alt="React Native Reanimated DnD Demo" style="max-width: 100%; width: 100%;" />
</p>
<div align="center">

**A drag-and-drop library that _finally_ works on React Native**

_Powerful, performant, and built for the modern React Native developer_

[![npm version](https://badge.fury.io/js/react-native-reanimated-dnd.svg)](https://badge.fury.io/js/react-native-reanimated-dnd)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![React Native](https://img.shields.io/badge/React%20Native-0.80+-green.svg)](https://reactnative.dev/)

<br />

<a href="https://www.npmjs.com/package/react-native-reanimated-dnd" target="_blank">
  <img src="https://img.shields.io/badge/View%20on%20NPM-cb3837?style=for-the-badge&logo=npm&logoColor=white&labelColor=1e293b&fontSize=24" alt="NPM Package" height="36"/>
</a>
<a href="https://reanimated-dnd-docs.vercel.app/" target="_blank">
  <img src="https://img.shields.io/badge/Read%20the%20Docs-4f46e5?style=for-the-badge&logo=gitbook&logoColor=white&labelColor=1e293b&color=6366f1&fontSize=24" alt="Documentation"  height="36"/>
</a>
<a href="#interactive-examples" target="_blank">
  <img src="https://img.shields.io/badge/Try%20Live%20Demo-fcba03?style=for-the-badge&logo=expo&logoColor=white&labelColor=1e293b&fontSize=24" alt="Live Demo" height="36"/>
</a>

</div>

---

## Why This Library?

After countless attempts with drag-and-drop solutions that don't work or are simply outdated, this is something that _finally_ works. Not just another DnD library — a **complete ecosystem** built from the ground up for React Native, offering **best-in-class developer experience** and **production-ready performance**.

Highly feature-packed with every interaction pattern you'll ever need, yet **simple enough** to get started in minutes.

## Features

- **High Performance** — Reanimated 4 + Worklets for buttery-smooth 60fps UI-thread animations
- **New Architecture Ready** — Built for Expo SDK 55+ and React Native 0.83+
- **Expo Compatible** — Tested against Expo SDK 55 and React Native 0.83
- **Tiny Bundle Size** — Only 70kb unpacked, won't bloat your app
- **Sortable Lists** — Vertical and horizontal with auto-scroll, FlatList virtualization, and drag handles
- **Sortable Grids** — 2D grid drag-and-drop with insert/swap strategies and 8-directional auto-scroll
- **Smart Collision Detection** — Center, intersect, and contain algorithms
- **Custom Animations** — Spring, timing, or bring your own worklet-based animation functions
- **Boundary Constraints** — Axis-locked and bounded dragging
- **Drag Handles** — Precise control with dedicated drag areas
- **TypeScript First** — Full type safety with comprehensive definitions
- **React Native First** — Designed specifically for mobile, not ported from web

## Interactive Examples

**See it in action!** A comprehensive example app with **15 interactive demos** showcasing every feature.

<div align="center">
<table>
<tr>
<td align="center" width="50%">

**Scan & Play**

<img src="https://github.com/user-attachments/assets/80f923f6-7c5f-42e9-9817-7770ee27a70b" alt="Expo QR Code" width="200" height="200" />

_Scan with your camera to open in development build_

</td>
<td align="center" width="50%">

**Quick Start**

1. Build the example app with `npx expo run:ios` or `npx expo run:android`
2. Scan the QR code with your camera
3. Open the link in the development build
4. Explore 15 interactive examples!

[**View Example App**](./example-app/README.md)

</td>
</tr>
</table>
</div>

## Video Demos

<div align="center">
<table>
<tr>
<td align="center" width="50%">

**Sortable Lists**

_Drag and drop to reorder with smooth animations_

https://github.com/user-attachments/assets/1cd1929c-724b-4dda-a916-f3e69f917f7b

</td>
<td align="center" width="50%">

**Collision Detection**

_Multiple algorithms for precise drop targeting_

https://github.com/user-attachments/assets/379040d7-8489-430b-bae4-3fcbde34264e

</td>
</tr>
<tr>
<td align="center" width="50%">

**Drag Handles**

_Precise control with dedicated drag areas_

https://github.com/user-attachments/assets/ec051d5b-8ba0-41b7-86ae-379de26a97dd

</td>
<td align="center" width="50%">

**Bounded Dragging**

_Constrain movement within specific boundaries_

https://github.com/user-attachments/assets/7bd5045b-47c4-4d9b-a0c5-eb89122ec9c0

</td>
</tr>
<tr>
<td align="center" width="50%">

**Active Drop Styles**

_Visual feedback during drag operations_

https://github.com/user-attachments/assets/3b8a3d00-38ad-4532-bd42-173037ea61b9

</td>
<td align="center" width="50%">

**State Management**

_Complete lifecycle tracking and callbacks_

https://github.com/user-attachments/assets/da5e526f-f2d2-4dc5-96b5-3fecc4faf57a

</td>
</tr>
</table>
</div>

## Installation

```bash
npm install react-native-reanimated-dnd
```

### Peer Dependencies

```bash
npm install react-native-reanimated react-native-gesture-handler react-native-worklets
```

Follow the setup guides for [Worklets](https://docs.swmansion.com/react-native-worklets/docs/getting-started/installation/), [Reanimated](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/getting-started/), and [Gesture Handler](https://docs.swmansion.com/react-native-gesture-handler/docs/installation).

Reanimated 4 requires the New Architecture. Make sure `"react-native-worklets/plugin"` is the last plugin in your Babel config.

## Quick Start

### Basic Drag & Drop

```tsx
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Draggable, Droppable, DropProvider } from "react-native-reanimated-dnd";

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <DropProvider>
        <Droppable
          onDrop={(data) => console.log("Dropped:", data.title)}
          activeStyle={{ backgroundColor: "rgba(0, 122, 255, 0.1)" }}
        >
          <View style={styles.dropZone}>
            <Text>Drop Zone</Text>
          </View>
        </Droppable>

        <Draggable data={{ id: "1", title: "My Task" }}>
          <View style={styles.item}>
            <Text>Drag me to the zone!</Text>
          </View>
        </Draggable>
      </DropProvider>
    </GestureHandlerRootView>
  );
}
```

### Sortable List

```tsx
import { Sortable, SortableItem } from "react-native-reanimated-dnd";

function TaskList() {
  const [tasks] = useState([
    { id: "1", title: "Learn React Native" },
    { id: "2", title: "Build an app" },
    { id: "3", title: "Ship it" },
  ]);

  return (
    <Sortable
      data={tasks}
      itemHeight={60}
      renderItem={({ item, id, ...props }) => (
        <SortableItem key={id} id={id} data={item} {...props}>
          <View style={styles.taskRow}>
            <Text>{item.title}</Text>
            <SortableItem.Handle>
              <Text style={styles.handle}>|||</Text>
            </SortableItem.Handle>
          </View>
        </SortableItem>
      )}
    />
  );
}
```

For more examples — sortable grids, collision detection, custom animations, bounded dragging, and more — see the [full documentation](https://reanimated-dnd-docs.vercel.app/docs/getting-started/quick-start).

## API Overview

### Components

| Component | Description | Docs |
|-----------|-------------|------|
| `<Draggable>` | Make any component draggable | [Guide](https://reanimated-dnd-docs.vercel.app/docs/components/draggable) |
| `<Droppable>` | Create drop zones with visual feedback | [Guide](https://reanimated-dnd-docs.vercel.app/docs/components/droppable) |
| `<Sortable>` | Sortable list (vertical & horizontal) | [Guide](https://reanimated-dnd-docs.vercel.app/docs/components/sortable) |
| `<SortableItem>` | Item in a sortable list (with Handle) | [Guide](https://reanimated-dnd-docs.vercel.app/docs/components/sortable-item) |
| `<SortableGrid>` | 2D sortable grid | [API](https://reanimated-dnd-docs.vercel.app/docs/api/components/sortable-grid) |
| `<SortableGridItem>` | Item in a sortable grid (with Handle) | [API](https://reanimated-dnd-docs.vercel.app/docs/api/components/sortable-grid-item) |
| `<DropProvider>` | Required context provider | [Guide](https://reanimated-dnd-docs.vercel.app/docs/context/DropProvider) |

### Hooks

| Hook | Description | Docs |
|------|-------------|------|
| `useDraggable` | Core draggable functionality | [API](https://reanimated-dnd-docs.vercel.app/docs/hooks/useDraggable) |
| `useDroppable` | Core droppable functionality | [API](https://reanimated-dnd-docs.vercel.app/docs/hooks/useDroppable) |
| `useSortable` / `useSortableList` | Sortable list management | [API](https://reanimated-dnd-docs.vercel.app/docs/hooks/useSortable) |
| `useGridSortable` / `useGridSortableList` | Grid sortable management | [API](https://reanimated-dnd-docs.vercel.app/docs/api/hooks/useGridSortable) |

[Full API Reference](https://reanimated-dnd-docs.vercel.app/docs/api/overview)

## Running the Example App

```bash
git clone https://github.com/entropyconquers/react-native-reanimated-dnd.git
cd react-native-reanimated-dnd
npm install

# iOS
npx expo run:ios --cwd example-app

# Android
npx expo run:android --cwd example-app
```

> **Note:** Reanimated 4 requires the New Architecture, so you must use a development build, not Expo Go.

## Contributing

Contributions are always welcome! See the [Contributing Guide](CONTRIBUTING.md) for details on setting up the development environment, code style, and the pull request process.

## License

MIT - [Vishesh Raheja](https://github.com/entropyconquers)

<div align="center">

If this library has helped you build amazing apps, consider supporting its development!

<a href="https://www.buymeacoffee.com/entropyconquers" target="_blank">
    <img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me a Coffee" style="height: 60px; width: 217px;">
</a>

---

[Documentation](https://reanimated-dnd-docs.vercel.app/) | [NPM](https://www.npmjs.com/package/react-native-reanimated-dnd) | [GitHub](https://github.com/entropyconquers/react-native-reanimated-dnd)

</div>
