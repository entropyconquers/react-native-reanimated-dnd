// App.tsx
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AppNavigator } from "./navigation/AppNavigator";

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: "#000000" }}>
      <AppNavigator />
    </GestureHandlerRootView>
  );
}

// Styles are no longer needed here as they are in CustomDndExample.tsx
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fafafa",
//   },
//   slot: {
//     position: "absolute",
//     width: 120,
//     height: 60,
//     borderWidth: 2,
//     borderStyle: "dashed",
//     borderColor: "#666",
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#fff",
//   },
//   slotActive: {
//     backgroundColor: "#e0ffe0",
//     borderColor: "#3c763d",
//   },
//   card: {
//     position: "absolute",
//     width: 100,
//     height: 50,
//     backgroundColor: "#fff",
//     borderRadius: 6,
//     borderWidth: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
// });
