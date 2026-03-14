import React from "react";
import {
  TouchableOpacity,
  StyleSheet,
  View,
  ScrollView,
  Text,
  Platform,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useDerivedValue,
  withSpring,
} from "react-native-reanimated";
import { colors, fonts } from "../theme";

interface BottomSheetProps {
  isVisible: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  duration?: number;
}

export function BottomSheet({
  isVisible,
  onClose,
  title,
  children,
  duration = 300,
}: BottomSheetProps) {
  const height = useSharedValue(0);
  const hiddenOffset = useDerivedValue(() => (height.value || 420) + 60);

  const progress = useDerivedValue(() =>
    withSpring(isVisible ? 0 : 1, {
      damping: 24,
      stiffness: 160,
      mass: 0.8,
    })
  );

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: progress.value * hiddenOffset.value }],
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: 1 - progress.value,
    zIndex: isVisible ? 9999 : 0,
  }));

  return (
    <>
      <Animated.View
        pointerEvents={isVisible ? "auto" : "none"}
        style={[styles.backdrop, backdropStyle]}
      >
        <TouchableOpacity style={styles.backdropTouchable} onPress={onClose} />
      </Animated.View>
      <Animated.View
        pointerEvents={isVisible ? "auto" : "none"}
        onLayout={(e) => {
          height.value = e.nativeEvent.layout.height;
        }}
        style={[styles.sheet, sheetStyle]}
      >
        <View style={styles.handle} />
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
            hitSlop={40}
          >
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {children}
        </ScrollView>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  backdropTouchable: {
    flex: 1,
  },
  sheet: {
    backgroundColor: colors.surface,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 40,
    maxHeight: "90%",
    width: "100%",
    position: "absolute",
    bottom: Platform.OS === "android" ? -72 : 0,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    zIndex: 10000,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: colors.glassBorder,
    boxShadow: "0px -4px 24px rgba(0, 0, 0, 0.5)",
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.textMuted,
    alignSelf: "center",
    marginBottom: 15,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontFamily: fonts.displayBold,
    color: colors.textPrimary,
    letterSpacing: -0.3,
  },
  closeButton: {
    justifyContent: "center",
    alignItems: "center",
  },
  closeText: {
    fontSize: 14,
    borderRadius: 18,
    backgroundColor: colors.surfaceElevated,
    width: 36,
    height: 36,
    textAlign: "center",
    lineHeight: 36,
    color: colors.textSecondary,
    fontWeight: "600",
    overflow: "hidden",
  },
  content: {
    maxHeight: "80%",
  },
});
