// App.tsx
import React, { useCallback, useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AppNavigator } from "./navigation/AppNavigator";
import { LogBox, Platform, StyleSheet, View } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import {
  Syne_400Regular,
  Syne_500Medium,
  Syne_600SemiBold,
  Syne_700Bold,
  Syne_800ExtraBold,
} from "@expo-google-fonts/syne";
import {
  Outfit_400Regular,
  Outfit_500Medium,
  Outfit_600SemiBold,
  Outfit_700Bold,
} from "@expo-google-fonts/outfit";
import {
  MajorMonoDisplay_400Regular,
} from "@expo-google-fonts/major-mono-display";
import { colors } from "./theme";
import { ToastProvider } from "./components/toast";
import { AnimatedSplashScreen } from "./components/AnimatedSplashScreen";

// Keep the native splash screen visible while we load fonts
SplashScreen.preventAutoHideAsync();

// Suppress InteractionManager deprecation warning from @react-navigation/stack
// (fixed in v8, not yet stable)
LogBox.ignoreLogs(["InteractionManager has been deprecated"]);

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  const [fontsLoaded] = useFonts({
    Syne_400Regular,
    Syne_500Medium,
    Syne_600SemiBold,
    Syne_700Bold,
    Syne_800ExtraBold,
    Outfit_400Regular,
    Outfit_500Medium,
    Outfit_600SemiBold,
    Outfit_700Bold,
    MajorMonoDisplay_400Regular,
    "SFProDisplay-Regular": require("./assets/fonts/SF-Pro-Display-Regular.otf"),
    "SFProDisplay-Medium": require("./assets/fonts/SF-Pro-Display-Medium.otf"),
    "SFProDisplay-Semibold": require("./assets/fonts/SF-Pro-Display-Semibold.otf"),
    "SFProDisplay-Bold": require("./assets/fonts/SF-Pro-Display-Bold.otf"),
    "SFProText-Regular": require("./assets/fonts/SF-Pro-Text-Regular.otf"),
    "SFProText-Medium": require("./assets/fonts/SF-Pro-Text-Medium.otf"),
    "SFProText-Semibold": require("./assets/fonts/SF-Pro-Text-Semibold.otf"),
    "SFProText-Bold": require("./assets/fonts/SF-Pro-Text-Bold.otf"),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  const handleSplashFinish = useCallback(() => {
    setShowSplash(false);
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.bg }}>
      <ToastProvider>
        <View
          style={{
            flex: 1,
            backgroundColor: colors.bg,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <View
            style={
              Platform.OS === "web" ? styles.webContainer : styles.container
            }
          >
            <AppNavigator />
            {showSplash && (
              <AnimatedSplashScreen onFinish={handleSplashFinish} />
            )}
          </View>
        </View>
      </ToastProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  webContainer: {
    maxHeight: 750,
    maxWidth: 350,
    height: "100%",
    width: "100%",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.08)",
    borderRadius: 50,
    backgroundColor: colors.bg,
    overflow: "hidden",
    paddingVertical: 12,
    paddingTop: 20,
  },
  container: {
    flex: 1,
    height: "100%",
    width: "100%",
    backgroundColor: colors.bg,
  },
});
