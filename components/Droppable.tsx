// Node Modules
import React from "react";
import { StyleProp, ViewStyle } from "react-native";
import Animated from "react-native-reanimated";
import { useDroppable } from "../hooks/useDroppable";
import { DroppableProps, UseDroppableOptions } from "../types/droppable";

let _nextDroppableId = 1;
export const _getUniqueDroppableId = (): number => {
  return _nextDroppableId++;
};

export type { DroppableProps };

/**
 * A component that creates drop zones for receiving draggable items.
 *
 * The Droppable component provides visual feedback when draggable items hover over it
 * and handles the drop logic when items are released. It integrates seamlessly with
 * the drag-and-drop context to provide collision detection and proper positioning
 * of dropped items.
 *
 * @template TData - The type of data that can be dropped on this droppable
 * @param props - Configuration props for the droppable component
 */
export const Droppable = <TData = unknown,>({
  onDrop,
  dropDisabled,
  onActiveChange,
  dropAlignment,
  dropOffset,
  activeStyle,
  droppableId,
  capacity,
  style,
  children,
}: DroppableProps<TData>): React.ReactElement => {
  const { viewProps, isActive } = useDroppable<TData>({
    onDrop,
    dropDisabled,
    onActiveChange,
    dropAlignment,
    dropOffset,
    activeStyle,
    droppableId,
    capacity,
  } as UseDroppableOptions<TData>);

  return (
    <Animated.View
      style={[style, viewProps.style]}
      onLayout={viewProps.onLayout}
    >
      {children}
    </Animated.View>
  );
};
