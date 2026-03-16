import React, { useCallback, useEffect } from "react";
import { StyleSheet, Text, useWindowDimensions } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  runOnJS,
} from "react-native-reanimated";

import { useInternalToast } from "./hooks";

type ToastProps = {
  index: number;
  toastKey: string;
  onDismiss: (toastId: number) => void;
};

const ToastOffset = 20;
const BaseSafeArea = 54;
const FallbackHeight = 80;

const Toast: React.FC<ToastProps> = ({ toastKey, index, onDismiss }) => {
  const { width: windowWidth } = useWindowDimensions();
  const toast = useInternalToast(toastKey);

  const isActiveToast = toast?.id === 0;

  const measuredHeight = useSharedValue(FallbackHeight);

  const initialBottomPosition = isActiveToast
    ? -(ToastOffset + FallbackHeight)
    : BaseSafeArea + ((toast?.id ?? 0) - 1) * ToastOffset;

  const bottom = useSharedValue(initialBottomPosition);

  useEffect(() => {
    if (!toast) return;
    bottom.value = withSpring(BaseSafeArea + toast.id * ToastOffset);
  }, [toast?.id]);

  const translateX = useSharedValue(0);
  const isSwiping = useSharedValue(false);

  const dismissItem = useCallback(() => {
    "worklet";
    if (!toast) return;
    translateX.value = withTiming(-windowWidth, undefined, (isFinished) => {
      if (isFinished) {
        runOnJS(onDismiss)(toast.id);
      }
    });
  }, [onDismiss, toast, translateX, windowWidth]);

  const gesture = Gesture.Pan()
    .enabled(isActiveToast)
    .onBegin(() => {
      isSwiping.value = true;
    })
    .onUpdate((event) => {
      if (event.translationX > 0) return;
      translateX.value = event.translationX;
    })
    .onEnd((event) => {
      if (event.translationX < -50) {
        dismissItem();
      } else {
        translateX.value = withSpring(0);
      }
    })
    .onFinalize(() => {
      isSwiping.value = false;
    });

  useEffect(() => {
    if (!toast?.autodismiss || !isActiveToast) return;
    const timeout = setTimeout(() => {
      dismissItem();
    }, 2500);
    return () => clearTimeout(timeout);
  }, [dismissItem, isActiveToast, toast?.autodismiss]);

  const rToastStyle = useAnimatedStyle(() => {
    if (!toast) return {};
    const baseScale = 1 - toast.id * 0.05;
    const scale = isSwiping.value ? baseScale * 0.96 : baseScale;

    return {
      bottom: bottom.value,
      zIndex: 1000 - toast.id,
      transform: [
        { scale: withTiming(scale) },
        { translateX: translateX.value },
      ],
    };
  }, [toast?.id]);

  const rVisibleContainerStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming((toast?.id ?? 0) <= 1 ? 1 : 0),
    };
  }, [toast?.id]);

  if (!toast) return null;

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        key={index}
        onLayout={(e) => {
          measuredHeight.value = e.nativeEvent.layout.height;
        }}
        style={[
          {
            width: windowWidth * 0.9,
            left: windowWidth * 0.05,
            zIndex: 100 - toast.id,
          },
          styles.container,
          rToastStyle,
        ]}
      >
        <Animated.View style={styles.textContainer}>
          <Animated.View style={[rVisibleContainerStyle, styles.columnCenter]}>
            <Text style={styles.title}>{toast.title}</Text>
            {toast.subtitle && (
              <Text style={styles.subtitle}>{toast.subtitle}</Text>
            )}
          </Animated.View>
        </Animated.View>
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1E2030",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#2A2D3A",
    paddingHorizontal: 24,
    paddingVertical: 14,
    position: "absolute",
    boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.6)",
  },
  textContainer: {
    alignItems: "flex-start",
    justifyContent: "center",
  },
  columnCenter: {
    flexDirection: "column",
    justifyContent: "center",
  },
  title: {
    color: "#FF3B30",
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: -0.2,
  },
  subtitle: {
    color: "#94A3B8",
    fontSize: 13,
    fontFamily: "Outfit_400Regular",
    marginTop: 3,
  },
});

export { Toast };
