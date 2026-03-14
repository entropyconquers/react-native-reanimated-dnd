import React, { useCallback, useEffect } from "react";
import { Text, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
  runOnJS,
} from "react-native-reanimated";
import { colors, fonts } from "../theme";

interface AnimatedSplashScreenProps {
  onFinish: () => void;
}

export function AnimatedSplashScreen({ onFinish }: AnimatedSplashScreenProps) {
  const titleOpacity = useSharedValue(0);
  const titleTranslateY = useSharedValue(12);
  const dndOpacity = useSharedValue(0);
  const dndScale = useSharedValue(0.9);
  const underlineWidth = useSharedValue(0);
  const taglineOpacity = useSharedValue(0);
  const containerOpacity = useSharedValue(1);

  const finishSplash = useCallback(() => {
    onFinish();
  }, [onFinish]);

  useEffect(() => {
    const timingConfig = { duration: 400, easing: Easing.out(Easing.cubic) };

    // Staggered entrance
    titleOpacity.value = withDelay(200, withTiming(1, timingConfig));
    titleTranslateY.value = withDelay(
      200,
      withTiming(0, { duration: 500, easing: Easing.out(Easing.cubic) })
    );

    dndOpacity.value = withDelay(450, withTiming(1, timingConfig));
    dndScale.value = withDelay(
      450,
      withTiming(1, { duration: 500, easing: Easing.out(Easing.back(1.5)) })
    );

    underlineWidth.value = withDelay(
      700,
      withTiming(80, { duration: 400, easing: Easing.out(Easing.cubic) })
    );

    taglineOpacity.value = withDelay(900, withTiming(1, { duration: 350 }));

    // Fade out and finish
    containerOpacity.value = withDelay(
      2000,
      withTiming(0, { duration: 400, easing: Easing.in(Easing.cubic) }, () => {
        runOnJS(finishSplash)();
      })
    );
  }, []);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: containerOpacity.value,
  }));

  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleTranslateY.value }],
  }));

  const dndStyle = useAnimatedStyle(() => ({
    opacity: dndOpacity.value,
    transform: [{ scale: dndScale.value }],
  }));

  const underlineStyle = useAnimatedStyle(() => ({
    width: underlineWidth.value,
  }));

  const taglineStyle = useAnimatedStyle(() => ({
    opacity: taglineOpacity.value,
  }));

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      {/* "reanimated" */}
      <Animated.Text style={[styles.reanimatedText, titleStyle]}>
        reanimated
      </Animated.Text>

      {/* "dnd" */}
      <Animated.View style={[styles.dndRow, dndStyle]}>
        <Text style={styles.dndWhite}>dn</Text>
        <Text style={styles.dndRed}>d</Text>
      </Animated.View>

      {/* Underline */}
      <Animated.View style={[styles.underline, underlineStyle]} />

      {/* Tagline */}
      <Animated.Text style={[styles.tagline, taglineStyle]}>
        Drag & Drop for React Native
      </Animated.Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.bg,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  reanimatedText: {
    fontSize: 22,
    fontFamily: fonts.displayBold,
    color: colors.textPrimary,
    opacity: 0.7,
    letterSpacing: -0.3,
    marginBottom: 2,
  },
  dndRow: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  dndWhite: {
    fontSize: 72,
    fontFamily: fonts.displayExtraBold,
    color: colors.textPrimary,
    letterSpacing: -1,
  },
  dndRed: {
    fontSize: 72,
    fontFamily: fonts.displayExtraBold,
    color: colors.primary,
    letterSpacing: -1,
  },
  underline: {
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.primary,
    marginTop: 6,
    opacity: 0.7,
  },
  tagline: {
    fontSize: 14,
    fontFamily: fonts.bodyRegular,
    color: colors.textMuted,
    marginTop: 16,
  },
});
