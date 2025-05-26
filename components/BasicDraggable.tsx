// components/BasicDraggable.tsx
import React, { useRef } from "react";
import { StyleProp, ViewStyle } from "react-native";
import Animated from "react-native-reanimated";
import { GestureDetector } from "react-native-gesture-handler";
import { useDraggable } from "react-native-reanimated-dnd";
import { UseDraggableOptions, DraggableState } from "@/types/draggable";

export interface BasicDraggableProps<TData = unknown>
  extends UseDraggableOptions<TData> {
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
}

/**
 * A minimal draggable component implementation using the useDraggable hook.
 * This demonstrates the simplest way to create a draggable component.
 */
const BasicDraggableComponent = <TData = unknown,>({
  style,
  children,
  ...useDraggableOptions
}: BasicDraggableProps<TData>) => {
  const { animatedViewProps, gesture, animatedViewRef } =
    useDraggable<TData>(useDraggableOptions);

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        ref={animatedViewRef}
        {...animatedViewProps}
        style={[style, animatedViewProps.style]}
      >
        {children}
      </Animated.View>
    </GestureDetector>
  );
};

export const BasicDraggable = BasicDraggableComponent;
