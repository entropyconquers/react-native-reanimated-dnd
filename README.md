# React Native Reanimated DnD 🎯

<p align="center">

https://github.com/user-attachments/assets/023c0a9c-194a-45a9-bb88-ac8f16f5ffd5

</p>
<div align="center">
  
**A drag-and-drop library that _finally_ works on React Native** ✨

_Powerful, performant, and built for the modern React Native developer_

[![npm version](https://badge.fury.io/js/react-native-reanimated-dnd.svg)](https://badge.fury.io/js/react-native-reanimated-dnd)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![React Native](https://img.shields.io/badge/React%20Native-0.80+-green.svg)](https://reactnative.dev/)

<br />

<a href="https://www.npmjs.com/package/react-native-reanimated-dnd" target="_blank">
  <img src="https://img.shields.io/badge/📦%20View%20on%20NPM-cb3837?style=for-the-badge&logo=npm&logoColor=white&labelColor=1e293b&fontSize=24" alt="NPM Package" height="36"/>
</a>
<a href="https://reanimated-dnd-docs.vercel.app/" target="_blank">
  <img src="https://img.shields.io/badge/📖%20Read%20the%20Docs-4f46e5?style=for-the-badge&logo=gitbook&logoColor=white&labelColor=1e293b&color=6366f1&fontSize=24" alt="Documentation"  height="36"/>
</a>
<a href="#-interactive-examples" target="_blank">
  <img src="https://img.shields.io/badge/📱%20Try%20Live%20Demo-fcba03?style=for-the-badge&logo=expo&logoColor=white&labelColor=1e293b&fontSize=24" alt="Live Demo" height="36"/>
</a>

</div>

---

## 🚀 Why This Library?

After countless attempts with drag-and-drop solutions that don't work or are simply outdated, this is something that _finally_ works. And it is not just another DnD library, but a **complete ecosystem** built from the ground up for React Native, offering a **best-in-class developer experience** and **production-ready performance**.

**Highly feature-packed** with every interaction pattern you'll ever need, yet **simple enough** to get started in minutes. Built for developers who demand both power and simplicity.

## ✨ Features

- 🚀 **High Performance** - Built with Reanimated 4 and Worklets for buttery-smooth 60fps animations
- 🏗️ **New Architecture Ready** - Built for the modern React Native architecture used by Expo SDK 55+
- 📦 **Expo Compatible** - Tested against Expo SDK 55 and React Native 0.83
- 🪶 **Tiny Bundle Size** - Only 70kb unpacked size, won't bloat your app
- 🎯 **Flexible API** - From simple drag-and-drop to complex sortable lists
- 📱 **React Native First** - Designed specifically for mobile, not ported from web
- 🔧 **TypeScript Ready** - Full type safety with comprehensive definitions
- 🎨 **Infinitely Customizable** - Every animation, behavior, and style is configurable
- 📦 **Complete Component Suite** - Draggable, Droppable, Sortable, and more
- 🎪 **Smart Collision Detection** - Multiple algorithms (center, intersect, contain)
- 📜 **Vertical & Horizontal Sortable Lists** - Drag and drop to sort lists in any direction with automatic scrolling
- 🔲 **Sortable Grids** - 2D grid drag-and-drop with flexible layouts, insert and swap modes
- ↕ **Dynamic Heights** - Sortable lists with variable item heights
- ⚡ **FlatList Performance** - Optional FlatList rendering for large datasets with virtualization
- 🎭 **Drag Handles** - Precise control with dedicated drag areas
- 🎬 **Custom Animations** - Spring, timing, or bring your own animation functions
- 📐 **Pixel-Perfect Positioning** - 9-point alignment system with custom offsets
- 📦 **Boundary Constraints** - Keep draggables within specific areas
- ⚡ **State Management** - Complete lifecycle tracking and callbacks
- 🎯 **Developer Experience** - Intuitive APIs, helpful warnings, and extensive examples

## 📱 Interactive Examples

**See it in action!** A comprehensive example app with **18 interactive demos** showcasing every feature and use case.

<div align="center">

### 🎮 Try the Example App

<table>
<tr>
<td align="center" width="50%">

**📱 Scan & Play**

<img src="https://github.com/user-attachments/assets/80f923f6-7c5f-42e9-9817-7770ee27a70b" alt="Expo QR Code" width="200" height="200" />

_Scan with your camera to open in development build_

</td>
<td align="center" width="50%">

**🚀 Quick Start**

1. Build the example app with `npx expo run:ios` or `npx expo run:android`
2. Scan the QR code with your camera
3. Open the link in the development build
4. Explore 18 interactive examples!

**Or browse the code:**
[**📂 View Example App →**](./example-app/README.md)

</td>
</tr>
</table>

### 📚 Complete Documentation

<a href="https://reanimated-dnd-docs.vercel.app/" target="_blank">
  <img src="https://img.shields.io/badge/📖%20Documentation-Visit%20Docs-4f46e5?style=for-the-badge&logo=gitbook&logoColor=white&labelColor=1e293b" alt="Documentation" />
</a>

_Comprehensive guides, API reference, and interactive examples_

</div>

The example app includes:

- 🎵 **Sortable Music Queue** - Complete list reordering with drag handles
- ⇌ **Horizontal Sortable** - Reorderable horizontal scrolling list
- 🔲 **Sortable Grid** - 2D grid reordering with insert/swap modes
- ↕ **Dynamic Heights** - Sortable list with variable item heights
- 🎯 **Basic Drag & Drop** - Drag items to drop zones with pre-drag delay
- 🎪 **Drag Handles** - Dedicated drag regions for precise control
- 🎬 **Custom Animations** - Spring, timing, bounce & easing curves
- ✨ **Active Drop Styles** - Visual feedback on hover
- 📐 **Alignment & Offset** - Precise drop positioning with offsets
- 📦 **Boundary Constraints** - Axis-locked and bounded dragging
- 🎯 **Collision Detection** - Center, intersect & contain algorithms
- 🗺️ **Dropped Items Map** - Track items across multiple zones
- ⚡ **Drag State** - State enum & onStateChange lifecycle
- ⚙️ **Custom Draggable** - useDraggable hook implementation

## 🎬 Demo Showcase

<div align="center">

<table>
<tr>
<td align="center" width="33%">

### 🎵 Sortable Music Queue

_Vertical list reordering with drag handles_

https://github.com/user-attachments/assets/6493c05f-571c-416d-b81d-90bee98738b4

**Features:** Auto-scrolling • Drag handles • Smooth transitions

</td>
<td align="center" width="33%">

### ⇌ Horizontal Sortable

_Reorderable horizontal scrolling list_

https://github.com/user-attachments/assets/909c687e-146d-4233-a6e9-4bc3e7b69a35

**Features:** Horizontal scroll • Handle & full item modes

</td>
<td align="center" width="33%">

### 🔲 Grid Sortable

_2D grid reordering with insert & swap_

https://github.com/user-attachments/assets/9647af01-098c-485f-92ba-cfc39d1bba0c

**Features:** Grid layout • Insert & swap modes

</td>
</tr>
<tr>
<td align="center" width="33%">

### ↕ Dynamic Heights

_Sortable list with variable item heights_

https://github.com/user-attachments/assets/b53078ca-51ab-4675-9389-e8fe69492370

**Features:** Variable heights • Expand/collapse • Auto-scroll

</td>
<td align="center" width="33%">

### 🎯 Basic Drag & Drop

_Drag items to drop zones_

https://github.com/user-attachments/assets/05859d25-6749-41b7-ae7e-cad5f864a268

**Features:** Drop zones • Pre-drag delay • Visual feedback

</td>
<td align="center" width="33%">

### 🎭 Drag Handles

_Dedicated regions for drag control_

https://github.com/user-attachments/assets/f8be7bea-0f24-4446-83be-06ede43fa02a

**Features:** Full handle • Bar handle • Header handle

</td>
</tr>
<tr>
<td align="center" width="33%">

### ✨ Active Drop Styles

_Visual hover effects on drop zones_

https://github.com/user-attachments/assets/d4124110-6eb7-4a15-8f97-3e58b392d62e

**Feedback:** Pulse effect • Glow effect • Hover states

</td>
<td align="center" width="33%">

### 📐 Alignment & Offset

_Precise drop positioning with offsets_

https://github.com/user-attachments/assets/07fd39d0-a0d8-471c-86be-b73d70027163

**Features:** 9-point alignment • X/Y offset controls

</td>
<td align="center" width="33%">

### 📦 Bounded Dragging

_Constrain movement within boundaries_

https://github.com/user-attachments/assets/ce43a226-ec42-49c1-b528-df6599d294e1

**Constraints:** Container bounds • Axis-locked • Custom limits

</td>
</tr>
<tr>
<td align="center" width="33%">

### 🎪 Collision Detection

_Center, intersect & contain algorithms_

https://github.com/user-attachments/assets/1ac1860a-acc1-469a-ae3e-644a22393b86

**Algorithms:** Center • Intersect • Contain

</td>
<td align="center" width="33%">

### 🗺️ Dropped Items Map

_Track items across multiple zones_

https://github.com/user-attachments/assets/e4effc88-7161-4c5c-af6e-c06152cfbd09

**Features:** Multi-zone tracking • Real-time mapping

</td>
<td align="center" width="33%">

### ⚡ Drag State

_State lifecycle tracking & callbacks_

https://github.com/user-attachments/assets/bceb9e7c-8f29-4630-81b0-945a7bcf29c5

**States:** Idle • Dragging • Dropped

</td>
</tr>
</table>

</div>

## 🚀 Installation

```bash
npm install react-native-reanimated-dnd
```

### Peer Dependencies

```bash
npm install react-native-reanimated react-native-gesture-handler react-native-worklets
```

Follow the setup guides:

- [React Native Worklets](https://docs.swmansion.com/react-native-worklets/docs/getting-started/installation/)
- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/getting-started/)
- [React Native Gesture Handler](https://docs.swmansion.com/react-native-gesture-handler/docs/installation)

Make sure your Babel config uses `"react-native-worklets/plugin"` as the last plugin and that your app is running on the New Architecture, which is required by Reanimated 4.

## 📋 Requirements

### Data Structure

All items in your data array **MUST** have an `id` property of type string:

```typescript
interface YourDataType {
  id: string; // Required!
  // ... your other properties
}
```

This is essential for the library to track items during reordering.

**Example:**

```typescript
// ✅ Good - Each item has a unique string id
const tasks = [
  { id: "1", title: "Learn React Native", completed: false },
  { id: "2", title: "Build an app", completed: false },
  { id: "3", title: "Deploy to store", completed: true },
];

// ❌ Bad - Missing id properties
const badTasks = [{ title: "Task 1" }, { title: "Task 2" }];

// ❌ Bad - Non-string ids
const badTasksWithNumbers = [
  { id: 1, title: "Task 1" },
  { id: 2, title: "Task 2" },
];
```

The library includes runtime validation in development mode that will warn you if items are missing valid ID properties.

## State Management Guidelines

**IMPORTANT**: Sortable components maintain their own internal state for optimal performance and animation consistency.

### Do NOT Do This

- Never update external state (arrays, Redux, Zustand, etc.) directly in `onMove` callbacks
- Never call `setItems()`, `setTasks()`, or similar functions during drag operations
- Never manually splice or reorder external arrays in response to drag events

### Correct Approach

- Use `onMove` for logging, analytics, or side effects only
- Use `onDrop` with `allPositions` parameter for read-only position tracking
- Let sortable components handle their internal reordering automatically
- Use external state only for the initial data and for non-reordering updates

### Future Features

Programmatic list operations (add, update, delete, reorder items) that work correctly with internal state management will be added in upcoming releases. This will provide safe methods to modify sortable lists externally.

## 🏃‍♂️ Quick Start

### Basic Drag & Drop

```tsx
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Draggable, Droppable, DropProvider } from "react-native-reanimated-dnd";

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <DropProvider>
        <Droppable onDrop={(data) => console.log("Dropped:", data)}>
          <View style={styles.dropZone}>
            <Text>Drop here</Text>
          </View>
        </Droppable>

        <Draggable data={{ id: "1", title: "Drag me!" }}>
          <View style={styles.item}>
            <Text>Drag me around!</Text>
          </View>
        </Draggable>
      </DropProvider>
    </GestureHandlerRootView>
  );
}
```

### Sortable List

```tsx
import { Sortable, SortableItem, SortableRenderItemProps } from "react-native-reanimated-dnd";

const tasks = [
  { id: "1", title: "Learn React Native" },
  { id: "2", title: "Build an app" },
  { id: "3", title: "Deploy to store" },
];

function TaskList() {
  const renderItem = useCallback((props: SortableRenderItemProps<typeof tasks[0]>) => {
    const { item, id, ...rest } = props;
    return (
      <SortableItem key={id} id={id} data={item} {...rest}>
        <View style={styles.task}>
          <Text>{item.title}</Text>
          <SortableItem.Handle>
            <Text>⋮⋮</Text>
          </SortableItem.Handle>
        </View>
      </SortableItem>
    );
  }, []);

  return <Sortable data={tasks} renderItem={renderItem} itemHeight={60} />;
}
```

### Sortable Grid

```tsx
import { SortableGrid, SortableGridItem } from "react-native-reanimated-dnd";

const apps = [
  { id: "1", label: "Photos" },
  { id: "2", label: "Music" },
  { id: "3", label: "Settings" },
  { id: "4", label: "Mail" },
];

function AppGrid() {
  const renderItem = useCallback((props) => {
    const { item, id, ...rest } = props;
    return (
      <SortableGridItem key={id} id={id} {...rest}>
        <View style={styles.gridItem}>
          <Text>{item.label}</Text>
        </View>
      </SortableGridItem>
    );
  }, []);

  return (
    <SortableGrid
      data={apps}
      renderItem={renderItem}
      dimensions={{ columns: 4, itemWidth: 80, itemHeight: 80, rowGap: 12, columnGap: 12 }}
    />
  );
}
```

> **More examples:** [Quick Start Guide](https://reanimated-dnd-docs.vercel.app/docs/getting-started/quick-start) · [Sortable Lists](https://reanimated-dnd-docs.vercel.app/docs/examples/sortable-lists) · [Sortable Grids](https://reanimated-dnd-docs.vercel.app/docs/api/components/sortable-grid) · [All Examples](https://reanimated-dnd-docs.vercel.app/docs/examples/basic-drag-drop)

## 📚 Documentation

Visit **[reanimated-dnd-docs.vercel.app](https://reanimated-dnd-docs.vercel.app/)** for the full documentation:

- **[Getting Started](https://reanimated-dnd-docs.vercel.app/docs/getting-started/installation)** — Installation, setup, and quick start
- **[Components](https://reanimated-dnd-docs.vercel.app/docs/api/components/draggable)** — Draggable, Droppable, Sortable, SortableGrid, SortableItem
- **[Hooks](https://reanimated-dnd-docs.vercel.app/docs/api/hooks/useDraggable)** — useDraggable, useDroppable, useSortable, useGridSortable
- **[Guides](https://reanimated-dnd-docs.vercel.app/docs/guides/animations)** — Animations, collision algorithms, performance, accessibility
- **[Examples](https://reanimated-dnd-docs.vercel.app/docs/examples/basic-drag-drop)** — Interactive code examples for every feature
- **[API Reference](https://reanimated-dnd-docs.vercel.app/docs/api/overview)** — Complete types, enums, and utilities

## 🏃‍♂️ Running the Example App

1. Clone the repository:

```bash
git clone https://github.com/entropyconquers/react-native-reanimated-dnd.git
cd react-native-reanimated-dnd
```

2. Install dependencies (uses npm workspaces):

```bash
npm install
```

3. Run the example app:

```bash
# iOS
npm run start --workspace example-app
# then press 'i' for iOS or 'a' for Android

# Or run directly:
npx expo run:ios --cwd example-app
npx expo run:android --cwd example-app
```

**Note:** Reanimated 4 requires the New Architecture, so you must use a development build (`npx expo run:ios` / `npx expo run:android`), not Expo Go.

The example app includes all 18 interactive examples showcasing every feature of the library.

## 🗺️ Project Roadmap

I am constantly working to improve React Native Reanimated DnD. Here's what's coming next:

### ✅ v2.0.0 (Current)

**Reanimated 4 + Worklets Migration**

- 🚀 **Reanimated 4 & Worklets** - Migrated from Reanimated 3 to Reanimated 4 with react-native-worklets
- 🏗️ **New Architecture** - Built for React Native's New Architecture (required by Reanimated 4)
- 📦 **Expo SDK 55** - Tested and compatible with Expo SDK 55 and React Native 0.83
- 🔧 **Handle Registration** - Replaced tree-walking handle detection with a registration pattern
- ⚡ **Improved Scheduling** - Uses `scheduleOnRN`/`scheduleOnUI` for better worklet-to-JS communication
- 🎯 **Pre-drag Delay** - New `preDragDelay` prop for distinguishing taps from drags
- 📐 **npm Workspaces** - Example app now uses workspace-based development setup
- 🔲 **Sortable Grids** - 2D grid drag-and-drop with flexible layouts and insert/swap modes
- ↕ **Dynamic Heights** - Sortable list support for variable item heights

### 🎯 Next Release

**Focus: Enhanced Functionality & New Features**

- 🐛 **Bug Fixes & Issues Resolution**

  - Address existing reported issues
  - Performance optimizations
  - Gesture handling improvements
  - API Improvements

- 🪆 **Nested Sortable Lists**

  - Multi-level hierarchy support
  - Collapse/expand functionality
  - Parent-child relationship management
  - Tree-like data structure handling

- 📋 **Kanban Board Support**
  - Cross-list dragging capabilities
  - Multiple column support
  - Inter-list item transfer
  - Board-level state management

### 💡 Community Requests

Vote on features you'd like to see by raising an issue.

**Have an idea?** [Open a feature request](https://github.com/entropyconquers/react-native-reanimated-dnd/issues/new?assignees=&labels=enhancement&template=feature_request.md) and let me know!

## 🤖 AI Integration Skill

Speed up development with the official [agent skill](https://agentskills.io). It teaches AI coding agents (Claude Code, Codex, Cursor, Gemini CLI, Copilot, and 30+ more) the full API so they generate correct code — no hallucinated props.

```bash
# Install via npx skills (auto-detects your agents)
npx skills add entropyconquers/react-native-reanimated-dnd

# Or install globally
npx skills add entropyconquers/react-native-reanimated-dnd -g
```

Once installed, just describe what you want:

> "Add a sortable list where I can reorder items by dragging"

> "Create a drag and drop interface with drop zones"

> "Make a reorderable 3-column grid"

Your agent will generate complete, working implementations with correct imports, props, and state management.

The skill ships in both `.claude/skills/` (Claude Code) and `.agents/skills/` (Codex, Cursor, Gemini CLI, Copilot, and others) for universal agent compatibility. See the [AI Integration Skill docs](https://reanimated-dnd-docs.vercel.app/docs/getting-started/ai-skill) for all installation options and the full agent compatibility table.

## 🤝 Contributing

Contributions are always welcome! We believe in building this library together with the community.

**Ways to contribute:**

- 🐛 Report bugs and issues
- ✨ Suggest new features
- 🔧 Submit pull requests
- 📚 Improve documentation
- 🧪 Write tests
- 💬 Help others in discussions

Please see our [**Contributing Guide**](CONTRIBUTING.md) for detailed information on:

- Setting up the development environment
- Code style guidelines
- Pull request process
- Testing requirements
- Community guidelines

## 📄 License

MIT © [Vishesh Raheja](https://github.com/entropyconquers)

## 🙏 Acknowledgments

- Built with [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/) for smooth 60fps animations
- Gesture handling powered by [React Native Gesture Handler](https://docs.swmansion.com/react-native-gesture-handler/)
- Inspired by the React ecosystem's drag-and-drop libraries
- Special thanks to the React Native community for feedback and contributions

## ☕ Support the Project

<div align="center">
<body>
If this library has helped you build amazing apps, consider supporting its development!
</br></br>
    <a href="https://www.buymeacoffee.com/entropyconquers" target="_blank">
        <img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me a Coffee" style="height: 60px; width: 217px;">
    </a>
    </br>
</br>
  Your support helps maintain and improve this library for the entire React Native community! 🚀
</body>
</html>

</div>
<br/>

---

<div align="center">

**Made with ❤️ for the React Native community**

[⭐ Star on GitHub](https://github.com/entropyconquers/react-native-reanimated-dnd) • [📱 Try the Demo](https://github.com/entropyconquers/react-native-reanimated-dnd/tree/main/example-app) • [📖 Documentation](https://reanimated-dnd-docs.vercel.app/)

</div>
