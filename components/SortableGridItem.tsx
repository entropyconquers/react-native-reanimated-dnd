import React, { createContext, useContext, useEffect } from "react";
import { StyleProp, ViewStyle, View } from "react-native";
import Animated from "react-native-reanimated";
import { GestureDetector } from "react-native-gesture-handler";
import { useGridSortable } from "../hooks/useGridSortable";
import {
  SortableGridItemProps,
  GridStrategy,
  GridOrientation,
  UseGridSortableOptions,
} from "../types/grid";
import { SortableHandleProps, SortableContextValue } from "../types/sortable";

// Create a context to share gesture between SortableGridItem and SortableGridHandle
const SortableGridContext = createContext<SortableContextValue | null>(null);

/**
 * A handle component for SortableGridItem that creates a specific draggable area.
 * When present, only the handle area can initiate dragging.
 *
 * @param props - Props for the handle component
 *
 * @example
 * ```typescript
 * <SortableGridItem id="item-1" {...gridItemProps}>
 *   <View style={styles.itemContent}>
 *     <Text>Item content (not draggable)</Text>
 *
 *     <SortableGridItem.Handle style={styles.dragHandle}>
 *       <Icon name="drag-handle" size={20} />
 *     </SortableGridItem.Handle>
 *   </View>
 * </SortableGridItem>
 * ```
 */
const SortableGridHandle = ({ children, style }: SortableHandleProps) => {
  const gridContext = useContext(SortableGridContext);

  useEffect(() => {
    gridContext?.registerHandle(true);
    return () => {
      gridContext?.registerHandle(false);
    };
  }, [gridContext]);

  if (!gridContext) {
    console.warn(
      "SortableGridHandle must be used within a SortableGridItem component"
    );
    return <>{children}</>;
  }

  return (
    <GestureDetector gesture={gridContext.panGestureHandler}>
      <Animated.View style={style}>{children}</Animated.View>
    </GestureDetector>
  );
};

function renderSortableGridContent(
  animatedStyle: StyleProp<ViewStyle>,
  customAnimatedStyle: SortableGridItemProps<unknown>["animatedStyle"],
  style: StyleProp<ViewStyle> | undefined,
  children: React.ReactNode,
  panGestureHandler: SortableContextValue["panGestureHandler"],
  handlePanGestureHandler: SortableContextValue["panGestureHandler"],
  registerHandle: SortableContextValue["registerHandle"],
) {
  // The outer Animated.View handles absolute positioning within the grid.
  // GestureDetector creates an implicit wrapper — by placing it INSIDE
  // the positioned container, the wrapper fills the item and gestures work.
  return (
    <Animated.View style={[animatedStyle, customAnimatedStyle]}>
      <GestureDetector gesture={panGestureHandler}>
        <Animated.View style={{ flex: 1 }}>
          <SortableGridContext.Provider value={{ panGestureHandler: handlePanGestureHandler, registerHandle }}>
            <Animated.View style={[{ flex: 1 }, style]}>{children}</Animated.View>
          </SortableGridContext.Provider>
        </Animated.View>
      </GestureDetector>
    </Animated.View>
  );
}

/**
 * A component for individual items within a sortable grid.
 *
 * SortableGridItem provides the drag-and-drop functionality for individual grid items,
 * handling gesture recognition, position animations, and reordering logic.
 * It can be used with or without drag handles for different interaction patterns.
 *
 * @template T - The type of data associated with this grid item
 * @param props - Configuration props for the sortable grid item
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
  orientation,
  strategy = GridStrategy.Insert,
  containerWidth,
  containerHeight,
  activationDelay,
  children,
  style,
  animatedStyle: customAnimatedStyle,
  onMove,
  onDragStart,
  onDrop,
  onDragging,
  isBeingRemoved,
}: SortableGridItemProps<T>) {
  const gridSortableOptions: UseGridSortableOptions<T> = {
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
    isBeingRemoved,
  };

  const { animatedStyle, panGestureHandler, handlePanGestureHandler, registerHandle } =
    useGridSortable<T>(gridSortableOptions);

  return renderSortableGridContent(
    animatedStyle,
    customAnimatedStyle,
    style,
    children,
    panGestureHandler,
    handlePanGestureHandler,
    registerHandle,
  );
}

// Attach the SortableGridHandle as a static property
SortableGridItem.Handle = SortableGridHandle;
