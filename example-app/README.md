# React Native Reanimated DnD - Example App 📱

<div align="center">

**Interactive Examples Showcase**

A comprehensive collection of 15 interactive examples demonstrating every feature of the React Native Reanimated DnD library.

[![React Native](https://img.shields.io/badge/React%20Native-0.83+-blue.svg)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-SDK%2055-black.svg)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

</div>

## 🎯 Overview

This example app provides a hands-on demonstration of all the features available in the `react-native-reanimated-dnd` library. Each example is carefully crafted to showcase specific functionality, from basic drag-and-drop to advanced collision detection and custom animations.

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- React Native development environment
- iOS Simulator or Android Emulator (or physical device)

### Installation & Setup

1. **Clone the repository:**

```bash
git clone https://github.com/entropyconquers/react-native-reanimated-dnd.git
cd react-native-reanimated-dnd
```

2. **Install dependencies:**

```bash
npm install
```

3. **Run the app:**

```bash
# Development server
npm run start --workspace example-app

# iOS development build
npm run ios --workspace example-app

# Android development build
npm run android --workspace example-app
```

## 📚 Examples Catalog

### 🎵 Core Examples

#### **Sortable Music Queue** ♫

_Perfect introduction to sortable lists_

**Features Demonstrated:**

- Reorderable vertical list with smooth animations
- Drag handles for precise control
- Auto-scrolling when dragging near edges
- Real-time position updates and data synchronization
- Long-press activation with haptic feedback

**Key Components:** `Sortable`, `SortableItem`, `SortableItem.Handle`

**Use Cases:** Music playlists, task lists, priority queues, menu reordering

---

#### **Basic Drag & Drop** 👆

_Your first step into drag-and-drop_

**Features Demonstrated:**

- Simple draggable items with multiple drop zones
- Visual feedback when hovering over drop zones
- Basic data transfer between components
- Clean, minimal implementation pattern

**Key Components:** `Draggable`, `Droppable`, `DropProvider`

**Use Cases:** File organization, category sorting, simple workflows

---

### 🔧 Interaction Examples

#### **Drag Handles** 🔧

_Precise control over drag initiation_

**Features Demonstrated:**

- Handle-only dragging (rest of item non-draggable)
- Mixed interaction patterns within single items
- Custom handle styling and positioning
- Accessibility considerations for touch targets

**Key Components:** `Draggable.Handle`

**Use Cases:** Complex UI cards, mixed-interaction lists, accessibility-focused designs

---

#### **Drag State Management** ⚡

_Complete lifecycle state tracking_

**Features Demonstrated:**

- `DraggableState` enum usage (`IDLE`, `DRAGGING`, `ANIMATING`)
- `onStateChange` callback implementation
- Visual state indicators and conditional styling
- State-based UI updates and animations

**Key Components:** State management hooks and callbacks

**Use Cases:** Complex UI feedback, analytics tracking, conditional behaviors

---

#### **Dropped Items Map** 📍

_Real-time tracking of drop relationships_

**Features Demonstrated:**

- Track which draggables are on which droppables
- Real-time mapping updates
- Multi-zone state management
- Persistent state across interactions

**Key Components:** Context state management

**Use Cases:** Kanban boards, inventory management, workspace organization

---

### 🎨 Visual & Animation Examples

#### **Custom Animations** 🎬

_Bring your drag interactions to life_

**Features Demonstrated:**

- Custom timing functions with `withTiming`
- Spring animations with `withSpring`
- Easing variations (bezier, bounce, elastic)
- Duration and damping controls
- Chained and sequential animations

**Key Components:** Animation functions, `animationFunction` prop

**Use Cases:** Premium app experiences, game-like interactions, brand-specific animations

---

#### **Active Drop Styles** ✨

_Beautiful visual feedback_

**Features Demonstrated:**

- Hover state styling with smooth transitions
- Color changes and border effects
- Scale transformations and shadow effects
- Conditional styling based on drop state
- CSS-like transition animations

**Key Components:** `activeStyle` prop, conditional styling

**Use Cases:** File upload zones, shopping carts, interactive dashboards

---

#### **Alignment & Offset** 📐

_Pixel-perfect drop positioning_

**Features Demonstrated:**

- 9-point alignment system (top-left, center, bottom-right, etc.)
- Custom offset values for fine-tuning
- Visual alignment guides and indicators
- Precise positioning control

**Key Components:** `dropAlignment`, `dropOffset` props

**Use Cases:** Layout builders, design tools, precise positioning requirements

---

### 🎯 Advanced Collision Examples

#### **Collision Detection** 🎯

_Different strategies for drop detection_

**Features Demonstrated:**

- **Center Algorithm**: Precise center-point collision detection
- **Intersect Algorithm**: Forgiving overlap detection (default)
- **Contain Algorithm**: Strict containment requirement
- Visual collision indicators and feedback
- Performance implications of each algorithm

**Key Components:** `collisionAlgorithm` prop

**Use Cases:** Games, precise interactions, different UX requirements

---

#### **Drop Zone Capacity** 🗂️

_Smart capacity management_

**Features Demonstrated:**

- Maximum item limits per drop zone
- Visual capacity indicators (3/5 items)
- Overflow handling and rejection
- Dynamic capacity updates
- Full/available state styling

**Key Components:** `capacity` prop, conditional logic

**Use Cases:** Limited slots, inventory systems, resource management

---

### 📦 Constraint Examples

#### **Bounded Dragging** 📦

_Keep items within boundaries_

**Features Demonstrated:**

- Container-based boundary constraints
- Visual boundary indicators
- Smooth edge collision handling
- Responsive boundary updates
- Ref-based boundary definition

**Key Components:** `dragBoundsRef` prop

**Use Cases:** Canvas editors, constrained workspaces, mobile-friendly interactions

---

#### **X-Axis Constraints** ↔️

_Horizontal-only movement_

**Features Demonstrated:**

- Horizontal slider implementations
- Axis-locked dragging behavior
- Custom constraint handling
- Smooth horizontal motion
- Value-based positioning

**Key Components:** `dragAxis="x"` prop

**Use Cases:** Sliders, horizontal timelines, progress controls

---

#### **Y-Axis Constraints** ↕️

_Vertical-only movement_

**Features Demonstrated:**

- Vertical slider controls
- Column-based movement patterns
- Vertical constraint handling
- Smooth vertical motion
- List reordering patterns

**Key Components:** `dragAxis="y"` prop

**Use Cases:** Volume controls, vertical lists, priority ordering

---

#### **Bounded Y-Axis** 📏

_Vertical movement with limits_

**Features Demonstrated:**

- Vertical movement within specific boundaries
- Combined axis and boundary constraints
- Boundary visualization
- Smooth constraint handling
- Range-based interactions

**Key Components:** `dragAxis="y"` + `dragBoundsRef`

**Use Cases:** Range selectors, bounded lists, constrained vertical controls

---

### ⚙️ Custom Implementation

#### **Custom Draggable** ⚙️

_Advanced implementation patterns_

**Features Demonstrated:**

- Direct hook usage (`useDraggable`, `useDroppable`)
- Advanced gesture handling patterns
- Custom animation systems
- Performance optimization techniques
- Low-level API usage

**Key Components:** Core hooks and custom implementations

**Use Cases:** Highly customized interactions, performance-critical apps, unique UX patterns

---

## 🏗️ App Architecture

### Navigation Structure

```
📱 App
├── 🏠 Home (Examples Navigation)
├── 🎵 Sortable Music Queue
├── 👆 Basic Drag & Drop
├── 🔧 Drag Handles
├── ⚡ Drag State Management
├── 📍 Dropped Items Map
├── 🎬 Custom Animations
├── ✨ Active Drop Styles
├── 📐 Alignment & Offset
├── 🎯 Collision Detection
├── 🗂️ Drop Zone Capacity
├── 📦 Bounded Dragging
├── ↔️ X-Axis Constraints
├── ↕️ Y-Axis Constraints
├── 📏 Bounded Y-Axis
└── ⚙️ Custom Draggable
```

### Key Components

#### **ExamplesNavigationPage**

- Beautiful home screen with example cards
- Categorized example organization
- Smooth navigation transitions
- Custom fonts and styling

#### **Example Components**

- Consistent header with back navigation
- Interactive demonstrations
- Real-time feedback and state display
- Clean, educational code patterns

#### **Shared Components**

- `ExampleHeader` - Consistent navigation
- `Footer` - App information and links
- `BottomSheet` - Settings and options

## 🎨 Design System

### Typography

- **Primary Font**: Major Mono Display (headers)
- **Body Font**: Kumbh Sans (content)
- **Weights**: Regular, Medium, SemiBold, Bold

### Color Palette

- **Background**: Deep black (#000000)
- **Cards**: Dark gray with subtle borders
- **Accent**: Red highlights for branding
- **Text**: High contrast white/gray
- **Interactive**: Blue and green for actions

### Animations

- **Duration**: 300ms standard, 200ms quick
- **Easing**: Smooth bezier curves
- **Spring**: Natural physics-based motion
- **Feedback**: Haptic feedback on interactions

## 🔧 Technical Implementation

### Dependencies

```json
{
  "react-native-reanimated": "^3.5.0",
  "react-native-gesture-handler": "^2.13.0",
  "@react-navigation/native": "^6.1.0",
  "@react-navigation/stack": "^6.3.0",
  "expo": "~49.0.0"
}
```

### Performance Optimizations

- **Worklet Functions**: All animations run on UI thread
- **Gesture Handler**: Native gesture recognition
- **Reanimated 3**: Latest performance improvements
- **Memoization**: Optimized re-renders
- **Lazy Loading**: Efficient navigation

### Code Organization

```
📁 example-app/
├── 📁 components/
│   ├── 📁 examples/          # All example implementations
│   ├── ExamplesNavigationPage.tsx
│   ├── ExampleHeader.tsx
│   └── Footer.tsx
├── 📁 navigation/
│   └── AppNavigator.tsx      # React Navigation setup
├── 📁 assets/               # Images and fonts
└── App.tsx                  # Root component
```

## 🎯 Learning Path

### Beginner

1. **Basic Drag & Drop** - Understand core concepts
2. **Sortable Music Queue** - Learn list reordering
3. **Active Drop Styles** - Add visual feedback

### Intermediate

4. **Drag Handles** - Implement precise controls
5. **Collision Detection** - Understand algorithms
6. **Bounded Dragging** - Add constraints
7. **Custom Animations** - Enhance user experience

### Advanced

8. **Drag State Management** - Master state tracking
9. **Dropped Items Map** - Complex state management
10. **Alignment & Offset** - Precise positioning
11. **Capacity Management** - Smart limitations
12. **Axis Constraints** - Specialized interactions
13. **Custom Implementation** - Build from scratch

## 🤝 Contributing to Examples

We welcome contributions to improve and expand the example collection!

### Adding New Examples

1. Create new component in `components/examples/`
2. Add to navigation in `AppNavigator.tsx`
3. Update `ExamplesNavigationPage.tsx`
4. Follow existing patterns and styling

### Improving Existing Examples

1. Enhance visual design
2. Add more interactive features
3. Improve code comments and documentation
4. Optimize performance

## 📱 Device Testing

### Recommended Testing

- **iOS**: iPhone 12+ (iOS 14+)
- **Android**: API 21+ (Android 5.0+)
- **Tablets**: iPad, Android tablets
- **Physical Devices**: Best performance testing

### Performance Notes

- Animations run at 60fps on modern devices
- Gesture recognition is native and responsive
- Memory usage is optimized for mobile
- Works well on both platforms

## 🔗 Related Resources

- **Main Library**: [react-native-reanimated-dnd](https://github.com/entropyconquers/react-native-reanimated-dnd)
- **Documentation**: [API Reference](https://github.com/entropyconquers/react-native-reanimated-dnd#readme)
- **React Native Reanimated**: [Official Docs](https://docs.swmansion.com/react-native-reanimated/)
- **Gesture Handler**: [Official Docs](https://docs.swmansion.com/react-native-gesture-handler/)

---

<div align="center">

**🎯 Ready to explore drag-and-drop interactions?**

Run the app and start with the **Basic Drag & Drop** example!

[📱 Run the App](#quick-start) • [📖 View Source](https://github.com/entropyconquers/react-native-reanimated-dnd) • [⭐ Star on GitHub](https://github.com/entropyconquers/react-native-reanimated-dnd)

</div>
