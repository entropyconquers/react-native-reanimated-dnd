---
sidebar_position: 1
---

# Installation

Get started with React Native Reanimated DnD in your project.

## Prerequisites

Before installing React Native Reanimated DnD, ensure you have the following dependencies:

### Required Dependencies

1. **React Native Reanimated 4.x**
2. **React Native Gesture Handler 2.x**
3. **React Native Worklets 0.7+**

These are peer dependencies and must be installed separately.

## Installation Steps

### 1. Install the Package

```bash
npm install react-native-reanimated-dnd
```

or with yarn:

```bash
yarn add react-native-reanimated-dnd
```

### 2. Install Peer Dependencies

Install React Native Reanimated and Gesture Handler if you haven't already:

```bash
npm install react-native-reanimated react-native-gesture-handler react-native-worklets
```

or with yarn:

```bash
yarn add react-native-reanimated react-native-gesture-handler react-native-worklets
```

### 3. Platform Setup

#### For React Native CLI Projects

##### iOS Setup

For iOS, you need to run pod install:

```bash
cd ios && pod install
```

##### Android Setup

For Android, the dependencies should be automatically linked. If you encounter issues, ensure your `android/app/build.gradle` includes:

```gradle
implementation 'com.swmansion.reanimated:reanimated:4.x.x'
implementation 'com.swmansion.gesturehandler:react-native-gesture-handler:2.x.x'
```

#### For Expo Projects

If you're using Expo, you'll need to install the dependencies through Expo:

```bash
npx expo install react-native-reanimated react-native-worklets react-native-gesture-handler
```

**Note**: You'll need to use a development build or eject to a bare workflow to use this library, as it requires native code that's not available in Expo Go.

##### Creating a Development Build

If you're using Expo SDK 55+, create a development build:

```bash
# Install the library
npx expo install react-native-reanimated-dnd react-native-reanimated react-native-worklets react-native-gesture-handler

# Create a development build
npx expo run:ios
# or
npx expo run:android
```

##### Expo Configuration

Reanimated 4 requires the New Architecture and the Worklets package. Add `react-native-worklets` to your Expo config:

```json
{
  "expo": {
    "plugins": ["react-native-worklets"]
  }
}
```

Or if using `app.config.js`:

```javascript
export default {
  expo: {
    plugins: ["react-native-worklets"],
  },
};
```

### 4. Configure Reanimated

Add the Worklets Babel plugin to your `babel.config.js`:

```javascript
module.exports = {
  presets: ["babel-preset-expo"],
  plugins: [
    "react-native-worklets/plugin", // This must be last
  ],
};
```

**Important**: The Worklets plugin must be the last item in the plugins array.

### 5. Configure Gesture Handler

#### For React Native 0.80+

Add the following to the top of your `index.js` (or `App.js`):

```javascript
import "react-native-gesture-handler";
```

#### For Expo

The gesture handler import is handled automatically in Expo projects, but you still need to ensure `GestureHandlerRootView` wraps your app:

```tsx
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/* Your app content */}
    </GestureHandlerRootView>
  );
}
```

## Verification

To verify the installation, create a simple test component:

```tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  DropProvider,
  Draggable,
  Droppable,
} from "react-native-reanimated-dnd";

export default function InstallationTest() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <DropProvider>
        <View style={styles.content}>
          <Text style={styles.title}>Installation Test</Text>

          <Draggable data={{ id: "1", name: "Test Item" }}>
            <View style={styles.draggable}>
              <Text>Drag me!</Text>
            </View>
          </Draggable>

          <Droppable onDrop={(data) => console.log("Dropped:", data)}>
            <View style={styles.droppable}>
              <Text>Drop here!</Text>
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
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 40,
    color: "#333",
  },
  draggable: {
    width: 100,
    height: 100,
    backgroundColor: "#4CAF50",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
  },
  droppable: {
    width: 200,
    height: 100,
    backgroundColor: "#2196F3",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#1976D2",
  },
});
```

If you can drag the green box and drop it on the blue area, your installation is successful!

## Troubleshooting

### Common Issues

#### 1. "Cannot read property 'install' of undefined"

This usually means React Native Reanimated is not properly installed. Ensure you:

- Added the Reanimated plugin to `babel.config.js`
- Restarted your Metro bundler
- Rebuilt your app

#### 2. "RNGestureHandlerModule is null"

This indicates React Native Gesture Handler is not properly linked:

- For iOS: Run `cd ios && pod install`
- For Android: Ensure the package is properly linked
- For Expo: Make sure you're using a development build, not Expo Go
- Restart your app completely

#### 3. Metro bundler issues

If you encounter Metro bundler issues, try:

```bash
# Clear Metro cache
npx react-native start --reset-cache

# For Expo
npx expo start -c
```

#### 4. TypeScript errors

If you're using TypeScript and encounter type errors, ensure you have the latest type definitions:

```bash
npm install @types/react @types/react-native
```

#### 5. Expo Go Limitations

This library requires native code and cannot run in Expo Go. You must:

- Use a development build (`npx expo run:ios` or `npx expo run:android`)
- Or eject to a bare workflow
- Or use EAS Build for production apps

### Platform-Specific Issues

#### iOS

- If you encounter build errors, try cleaning your build folder in Xcode
- For M1 Macs, you might need to run `arch -x86_64 pod install`

#### Android

- Ensure your Android SDK is up to date
- If you encounter Gradle issues, try cleaning your project:
  ```bash
  cd android && ./gradlew clean
  ```

#### Expo Development Builds

- Make sure you've created a development build after adding the library
- Verify the Reanimated plugin is in your `app.json` or `app.config.js`
- Check that you're not trying to run in Expo Go

## Version Compatibility

| React Native Reanimated DnD | React Native | Reanimated | Gesture Handler | Worklets | Expo SDK |
| --------------------------- | ------------ | ---------- | --------------- | -------- | -------- |
| 2.x.x                       | 0.80+        | 4.x.x      | 2.28+           | 0.7+     | 55+      |

## Next Steps

Once installation is complete:

1. **[Quick Start](./quick-start)** - Build your first drag-and-drop interface
2. **[Basic Concepts](./basic-concepts)** - Understand the core concepts
3. **[Setup Provider](./setup-provider)** - Configure the DropProvider
4. **[API Reference](../api/overview)** - Explore all available components

## Getting Help

If you encounter issues during installation:

1. Check the [troubleshooting section](#troubleshooting) above
2. Search existing [GitHub issues](https://github.com/entropyconquers/react-native-reanimated-dnd/issues)
3. Create a new issue with:
   - Your React Native version
   - Your platform (iOS/Android)
   - Whether you're using Expo or React Native CLI
   - Complete error messages
   - Steps to reproduce
