// components/BasicDraggable.tsx
import React from "react";
import { StyleProp, ViewStyle } from "react-native";
import Animated from "react-native-reanimated";
import { GestureDetector } from "react-native-gesture-handler";
import {
  useDraggable,
  type UseDraggableOptions,
} from "react-native-reanimated-dnd";

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
  const draggableOptions = useDraggableOptions as UseDraggableOptions<TData>;
  const { animatedViewProps, gesture, animatedViewRef } =
    useDraggable<TData>(draggableOptions);

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
