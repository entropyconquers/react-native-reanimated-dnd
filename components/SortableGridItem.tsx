import React, { createContext, useContext } from "react";
import Animated from "react-native-reanimated";
import { PanGestureHandler } from "react-native-gesture-handler";
import { useGridSortable } from "../hooks/useGridSortable";
import {
  SortableGridItemProps,
  GridStrategy,
  GridOrientation,
} from "../types/grid";
import { SortableContextValue, SortableHandleProps } from "../types/sortable";

// Create a context to share gesture between SortableGridItem and SortableGridHandle
const SortableGridContext = createContext<SortableContextValue | null>(null);

/**
 * A handle component for grid items that creates a specific draggable area
 */
const SortableGridHandle = ({ children, style }: SortableHandleProps) => {
  const sortableContext = useContext(SortableGridContext);

  if (!sortableContext) {
    console.warn(
      "SortableGridHandle must be used within a SortableGridItem component"
    );
    return <>{children}</>;
  }

  return (
    <PanGestureHandler onGestureEvent={sortableContext.panGestureHandler}>
      <Animated.View style={style}>{children}</Animated.View>
    </PanGestureHandler>
  );
};

/**
 * A component for individual items within a sortable grid.
 *
 * SortableGridItem provides drag-and-drop functionality for grid items,
 * handling 2D position animations and grid-aware reordering logic.
 *
 * @template T - The type of data associated with this grid item
 * @param props - Configuration props for the grid item
 */
export function SortableGridItem<T>({
  id,
  data,
  positions,
  scrollY,
  scrollX,
  autoScrollDirection,
  itemsCount,
  dimensions,
  orientation = GridOrientation.Vertical,
  strategy = GridStrategy.Insert,
  containerWidth,
  containerHeight,
  activationDelay = 200,
  children,
  style,
  animatedStyle: customAnimatedStyle,
  onMove,
  onDragStart,
  onDrop,
  onDragging,
  isBeingRemoved = false,
}: SortableGridItemProps<T>) {
  // Use grid sortable hook
  const { animatedStyle, panGestureHandler, hasHandle } = useGridSortable<T>({
    id,
    positions,
    scrollY,
    scrollX,
    autoScrollDirection,
    itemsCount,
    dimensions,
    orientation,
    strategy,
    containerWidth,
    containerHeight,
    activationDelay,
    onMove,
    onDragStart,
    onDrop,
    onDragging,
    children,
    handleComponent: SortableGridHandle,
    isBeingRemoved,
  });

  // Combine the default animated style with any custom styles
  const combinedAnimatedStyle = [animatedStyle, customAnimatedStyle];

  // Create the context value
  const contextValue: SortableContextValue = {
    panGestureHandler,
  };

  // Always provide the context to avoid issues when toggling handle modes
  const content = (
    <Animated.View style={combinedAnimatedStyle}>
      <SortableGridContext.Provider value={contextValue}>
        <Animated.View style={style}>{children}</Animated.View>
      </SortableGridContext.Provider>
    </Animated.View>
  );

  // If a handle is found, let the handle control the dragging
  // Otherwise, the entire component is draggable with PanGestureHandler
  if (hasHandle) {
    return content;
  } else {
    return (
      <PanGestureHandler
        onGestureEvent={panGestureHandler}
        activateAfterLongPress={activationDelay}
        shouldCancelWhenOutside={false}
      >
        {content}
      </PanGestureHandler>
    );
  }
}

// Attach the SortableGridHandle as a static property
SortableGridItem.Handle = SortableGridHandle;
