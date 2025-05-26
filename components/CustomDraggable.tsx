import React, { useRef, createContext, useContext } from "react";
import { ViewStyle, StyleProp } from "react-native";
import Animated from "react-native-reanimated";
import { GestureDetector } from "react-native-gesture-handler";
import { useDraggable } from "react-native-reanimated-dnd";
import { UseDraggableOptions, DraggableState } from "@/types/draggable";

export interface CustomDraggableProps<TData = unknown>
  extends UseDraggableOptions<TData> {
  initialStyle?: StyleProp<ViewStyle>;
  children: React.ReactNode;
}

// Create a context for CustomDraggable
interface CustomDraggableContextValue {
  gesture: any;
}

const CustomDraggableContext =
  createContext<CustomDraggableContextValue | null>(null);

// Handle component for CustomDraggable - completely isolated
interface CustomDraggableHandleProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

const CustomDraggableHandle = ({
  children,
  style,
}: CustomDraggableHandleProps) => {
  const draggableContext = useContext(CustomDraggableContext);

  if (!draggableContext) {
    console.warn(
      "CustomDraggable.Handle must be used within a CustomDraggable component"
    );
    return <>{children}</>;
  }

  return (
    <GestureDetector gesture={draggableContext.gesture}>
      <Animated.View style={style}>{children}</Animated.View>
    </GestureDetector>
  );
};

// Set display name to help with debugging
CustomDraggableHandle.displayName = "CustomDraggableHandle";

const CustomDraggableComponent = <TData = unknown,>({
  children,
  initialStyle,
  ...draggableOptions
}: CustomDraggableProps<TData>) => {
  const { animatedViewProps, gesture, hasHandle, animatedViewRef } =
    useDraggable<TData>({
      ...draggableOptions,
      children,
      handleComponent: CustomDraggableHandle,
    });

  const combinedStyle = [initialStyle, animatedViewProps.style];

  // Create context value
  const contextValue: CustomDraggableContextValue = {
    gesture,
  };

  // Render with context
  const content = (
    <Animated.View
      ref={animatedViewRef}
      {...animatedViewProps}
      style={combinedStyle}
      collapsable={false}
    >
      <CustomDraggableContext.Provider value={contextValue}>
        {children}
      </CustomDraggableContext.Provider>
    </Animated.View>
  );

  // If a handle is found, let the handle control the dragging
  // Otherwise, the entire component is draggable
  if (hasHandle) {
    return content;
  } else {
    return <GestureDetector gesture={gesture}>{content}</GestureDetector>;
  }
};

// Attach Handle as a static property
export const CustomDraggable = Object.assign(CustomDraggableComponent, {
  Handle: CustomDraggableHandle,
});
