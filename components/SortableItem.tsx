import React, { createContext, useContext } from "react";
import { StyleProp, ViewStyle } from "react-native";
import Animated from "react-native-reanimated";
import { PanGestureHandler } from "react-native-gesture-handler";
import {
  SortableItemProps,
  SortableContextValue,
  SortableHandleProps,
  UseSortableOptions,
} from "../types/sortable";
import { useSortable } from "../hooks/useSortable";

const SortableContext = createContext<SortableContextValue | null>(null);

/**
 * A handle component that can be used within SortableItem to create a specific
 * draggable area. When a SortableHandle is present, only the handle area can
 * initiate dragging, while the rest of the item remains non-draggable.
 *
 * @param props - Props for the handle component
 */
const SortableHandle = ({ children, style }: SortableHandleProps) => {
  const sortableContext = useContext(SortableContext);

  if (!sortableContext) {
    console.warn("SortableHandle must be used within a SortableItem component");
    return <>{children}</>;
  }

  return (
    <PanGestureHandler onGestureEvent={sortableContext.panGestureHandler}>
      <Animated.View style={style}>{children}</Animated.View>
    </PanGestureHandler>
  );
};

/**
 * A component for individual items within a sortable list.
 *
 * SortableItem provides the drag-and-drop functionality for individual list items,
 * handling gesture recognition, position animations, and reordering logic.
 * It can be used with or without drag handles for different interaction patterns.
 *
 * @template T - The type of data associated with this sortable item
 * @param props - Configuration props for the sortable item
 */
export function SortableItem<T>({
  id,
  data,
  positions,
  lowerBound,
  autoScrollDirection,
  itemsCount,
  itemHeight,
  containerHeight,
  children,
  style,
  animatedStyle: customAnimatedStyle,
  onMove,
  onDragStart,
  onDrop,
  onDragging,
}: SortableItemProps<T>) {
  const { animatedStyle, panGestureHandler, isMoving, hasHandle } = useSortable(
    {
      id,
      positions,
      lowerBound,
      autoScrollDirection,
      itemsCount,
      itemHeight,
      containerHeight,
      onMove,
      onDragStart,
      onDrop,
      onDragging,
      children,
      handleComponent: SortableHandle,
    } as UseSortableOptions<T>
  );

  // Create the context value
  const contextValue: SortableContextValue = {
    panGestureHandler,
  };

  return (
    <SortableContext.Provider value={contextValue}>
      {hasHandle ? (
        // When there's a handle, wrap in a regular Animated.View
        <Animated.View
          style={[
            style,
            animatedStyle,
            customAnimatedStyle,
            isMoving && { zIndex: 1000 },
          ]}
        >
          {children}
        </Animated.View>
      ) : (
        // When there's no handle, the entire item is draggable
        <PanGestureHandler onGestureEvent={panGestureHandler}>
          <Animated.View
            style={[
              style,
              animatedStyle,
              customAnimatedStyle,
              isMoving && { zIndex: 1000 },
            ]}
          >
            {children}
          </Animated.View>
        </PanGestureHandler>
      )}
    </SortableContext.Provider>
  );
}

// Attach the Handle component as a static property
SortableItem.Handle = SortableHandle;
