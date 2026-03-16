import { SharedValue } from "react-native-reanimated";
import {
  GridPosition,
  GridPositions,
  GridDimensions,
  GridOrientation,
  GridStrategy,
  GridScrollDirection,
} from "../types/grid";
import { SortableData } from "../types/sortable";

/**
 * Calculate grid position from linear index
 */
export function calculateGridPosition(
  index: number,
  dimensions: GridDimensions,
  orientation: GridOrientation
): GridPosition {
  "worklet";

  const {
    columns = 3,
    rows = 3,
    itemWidth,
    itemHeight,
    rowGap = 0,
    columnGap = 0,
  } = dimensions;

  let row: number;
  let column: number;

  if (orientation === GridOrientation.Vertical) {
    // Vertical grid: fixed columns, flow top to bottom, left to right
    row = Math.floor(index / columns);
    column = index % columns;
  } else {
    // Horizontal grid: fixed rows, flow left to right, top to bottom
    column = Math.floor(index / rows);
    row = index % rows;
  }

  const x = column * (itemWidth + columnGap);
  const y = row * (itemHeight + rowGap);

  return {
    index,
    row,
    column,
    x,
    y,
  };
}

/**
 * Calculate linear index from row and column
 */
export function calculateIndexFromRowColumn(
  row: number,
  column: number,
  dimensions: GridDimensions,
  orientation: GridOrientation
): number {
  "worklet";

  const { columns = 3, rows = 3 } = dimensions;

  if (orientation === GridOrientation.Vertical) {
    return row * columns + column;
  } else {
    return column * rows + row;
  }
}

/**
 * Convert data array to grid positions object
 */
export function listToGridObject<T extends SortableData>(
  list: T[],
  dimensions: GridDimensions,
  orientation: GridOrientation
): GridPositions {
  const positions: GridPositions = {};

  for (let i = 0; i < list.length; i++) {
    const position = calculateGridPosition(i, dimensions, orientation);
    positions[list[i].id] = position;
  }

  return positions;
}

/**
 * Clamp value between bounds
 */
export function clamp(value: number, min: number, max: number): number {
  "worklet";
  return Math.max(min, Math.min(value, max));
}

/**
 * Calculate which grid cell contains the given coordinates
 */
export function getGridCellFromCoordinates(
  x: number,
  y: number,
  dimensions: GridDimensions,
  orientation: GridOrientation,
  totalItems: number
): { row: number; column: number; index: number } {
  "worklet";

  const {
    columns = 3,
    rows = 3,
    itemWidth,
    itemHeight,
    rowGap = 0,
    columnGap = 0,
  } = dimensions;

  // Calculate which column and row the coordinates fall into
  const column = Math.floor(x / (itemWidth + columnGap));
  const row = Math.floor(y / (itemHeight + rowGap));

  // Calculate the linear index
  const index = calculateIndexFromRowColumn(row, column, dimensions, orientation);

  // Clamp to valid range
  const clampedIndex = clamp(index, 0, totalItems - 1);
  const clampedPosition = calculateGridPosition(
    clampedIndex,
    dimensions,
    orientation
  );

  return {
    row: clampedPosition.row,
    column: clampedPosition.column,
    index: clampedIndex,
  };
}

/**
 * Reorder grid positions using insert strategy
 * Items between source and target shift by one position
 */
export function reorderGridInsert(
  positions: GridPositions,
  activeId: string,
  targetIndex: number,
  dimensions: GridDimensions,
  orientation: GridOrientation
): GridPositions {
  "worklet";

  const newPositions: GridPositions = {};
  const activePosition = positions[activeId];
  const fromIndex = activePosition.index;

  if (fromIndex === targetIndex) {
    return positions;
  }

  const movingUp = targetIndex < fromIndex;

  // Reassign positions
  for (const id in positions) {
    const currentIndex = positions[id].index;

    if (id === activeId) {
      // Move the active item to target
      newPositions[id] = calculateGridPosition(
        targetIndex,
        dimensions,
        orientation
      );
    } else if (movingUp && currentIndex >= targetIndex && currentIndex < fromIndex) {
      // Shift items down (increase index by 1)
      newPositions[id] = calculateGridPosition(
        currentIndex + 1,
        dimensions,
        orientation
      );
    } else if (!movingUp && currentIndex <= targetIndex && currentIndex > fromIndex) {
      // Shift items up (decrease index by 1)
      newPositions[id] = calculateGridPosition(
        currentIndex - 1,
        dimensions,
        orientation
      );
    } else {
      // Keep the same position
      newPositions[id] = positions[id];
    }
  }

  return newPositions;
}

/**
 * Reorder grid positions using swap strategy
 * Direct exchange between two items
 */
export function reorderGridSwap(
  positions: GridPositions,
  activeId: string,
  targetId: string,
  dimensions: GridDimensions,
  orientation: GridOrientation
): GridPositions {
  "worklet";

  const newPositions: GridPositions = { ...positions };
  const activePosition = positions[activeId];
  const targetPosition = positions[targetId];

  // Swap the two positions
  newPositions[activeId] = targetPosition;
  newPositions[targetId] = activePosition;

  return newPositions;
}

/**
 * Update grid positions based on drag position
 */
export function setGridPosition(
  x: number,
  y: number,
  scrollX: number,
  scrollY: number,
  itemsCount: number,
  positions: SharedValue<GridPositions>,
  id: string,
  dimensions: GridDimensions,
  orientation: GridOrientation,
  strategy: GridStrategy
): void {
  "worklet";

  // Adjust coordinates for scroll offset
  const adjustedX = x + scrollX;
  const adjustedY = y + scrollY;

  // Get target cell
  const targetCell = getGridCellFromCoordinates(
    adjustedX,
    adjustedY,
    dimensions,
    orientation,
    itemsCount
  );

  const currentIndex = positions.value[id].index;

  if (targetCell.index === currentIndex) {
    return;
  }

  // Find the ID of the item at the target position
  let targetId: string | null = null;
  for (const itemId in positions.value) {
    if (positions.value[itemId].index === targetCell.index) {
      targetId = itemId;
      break;
    }
  }

  // Apply reordering strategy
  if (strategy === GridStrategy.Insert) {
    positions.value = reorderGridInsert(
      positions.value,
      id,
      targetCell.index,
      dimensions,
      orientation
    );
  } else if (strategy === GridStrategy.Swap && targetId) {
    positions.value = reorderGridSwap(
      positions.value,
      id,
      targetId,
      dimensions,
      orientation
    );
  }
}

/**
 * Calculate total content dimensions for the grid
 */
export function calculateGridContentDimensions(
  itemsCount: number,
  dimensions: GridDimensions,
  orientation: GridOrientation
): { width: number; height: number } {
  "worklet";

  const {
    columns = 3,
    rows = 3,
    itemWidth,
    itemHeight,
    rowGap = 0,
    columnGap = 0,
  } = dimensions;

  if (orientation === GridOrientation.Vertical) {
    // Calculate number of rows needed
    const totalRows = Math.ceil(itemsCount / columns);
    const width = columns * itemWidth + (columns - 1) * columnGap;
    const height = totalRows * itemHeight + (totalRows - 1) * rowGap;
    return { width, height };
  } else {
    // Calculate number of columns needed
    const totalColumns = Math.ceil(itemsCount / rows);
    const width = totalColumns * itemWidth + (totalColumns - 1) * columnGap;
    const height = rows * itemHeight + (rows - 1) * rowGap;
    return { width, height };
  }
}

/**
 * Determine auto-scroll direction based on drag position
 */
export function setGridAutoScroll(
  x: number,
  y: number,
  scrollX: number,
  scrollY: number,
  containerWidth: number,
  containerHeight: number,
  scrollThreshold: number,
  autoScrollDirection: SharedValue<GridScrollDirection>
): void {
  "worklet";

  const leftBound = scrollX;
  const rightBound = scrollX + containerWidth;
  const topBound = scrollY;
  const bottomBound = scrollY + containerHeight;

  const isNearLeft = x < leftBound + scrollThreshold;
  const isNearRight = x > rightBound - scrollThreshold;
  const isNearTop = y < topBound + scrollThreshold;
  const isNearBottom = y > bottomBound - scrollThreshold;

  // Determine direction (including corners for diagonal scrolling)
  if (isNearTop && isNearLeft) {
    autoScrollDirection.value = GridScrollDirection.UpLeft;
  } else if (isNearTop && isNearRight) {
    autoScrollDirection.value = GridScrollDirection.UpRight;
  } else if (isNearBottom && isNearLeft) {
    autoScrollDirection.value = GridScrollDirection.DownLeft;
  } else if (isNearBottom && isNearRight) {
    autoScrollDirection.value = GridScrollDirection.DownRight;
  } else if (isNearTop) {
    autoScrollDirection.value = GridScrollDirection.Up;
  } else if (isNearBottom) {
    autoScrollDirection.value = GridScrollDirection.Down;
  } else if (isNearLeft) {
    autoScrollDirection.value = GridScrollDirection.Left;
  } else if (isNearRight) {
    autoScrollDirection.value = GridScrollDirection.Right;
  } else {
    autoScrollDirection.value = GridScrollDirection.None;
  }
}

/**
 * Find item ID at a given index
 */
export function findItemIdAtIndex(
  positions: GridPositions,
  index: number
): string | null {
  "worklet";

  for (const id in positions) {
    if (positions[id].index === index) {
      return id;
    }
  }

  return null;
}
