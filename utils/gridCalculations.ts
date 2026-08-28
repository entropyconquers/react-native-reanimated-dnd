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
 * Items without an entry in `dimensions.itemHeights` fall back to `itemHeight`.
 */
export function getGridItemHeight(
  itemId: string,
  dimensions: GridDimensions
): number {
  "worklet";

  const customHeight = dimensions.itemHeights
    ? dimensions.itemHeights[itemId]
    : undefined;

  return customHeight !== undefined && customHeight > 0
    ? customHeight
    : dimensions.itemHeight;
}

/**
 * Row span for an item (vertical orientation). Anything below 2 is a normal
 * single-row item.
 */
export function getGridItemRowSpan(
  itemId: string,
  dimensions: GridDimensions
): number {
  "worklet";

  const customSpan = dimensions.itemRowSpans
    ? dimensions.itemRowSpans[itemId]
    : undefined;

  return customSpan !== undefined && customSpan > 1
    ? Math.floor(customSpan)
    : 1;
}

/**
 * Column span for an item (vertical orientation). Anything below 2 is a
 * normal single-column item.
 */
export function getGridItemColumnSpan(
  itemId: string,
  dimensions: GridDimensions
): number {
  "worklet";

  const customSpan = dimensions.itemColumnSpans
    ? dimensions.itemColumnSpans[itemId]
    : undefined;

  return customSpan !== undefined && customSpan > 1
    ? Math.floor(customSpan)
    : 1;
}

/**
 * Rendered width of an item. Column-span items stretch to the summed width
 * of the columns they cover (plus gaps); other items keep `itemWidth`.
 */
export function getGridItemSpanWidth(
  itemId: string,
  dimensions: GridDimensions
): number {
  "worklet";

  const span = getGridItemColumnSpan(itemId, dimensions);
  if (span <= 1) {
    return dimensions.itemWidth;
  }

  return span * dimensions.itemWidth + (span - 1) * (dimensions.columnGap ?? 0);
}

/**
 * Rendered height of an item. Spanning items stretch to the summed height of
 * the bands they cover (plus gaps); other items keep their own height.
 */
export function getGridItemSpanHeight(
  itemId: string,
  row: number,
  bandHeights: number[],
  rowGap: number,
  dimensions: GridDimensions
): number {
  "worklet";

  const span = getGridItemRowSpan(itemId, dimensions);
  if (span <= 1 || bandHeights.length === 0) {
    return getGridItemHeight(itemId, dimensions);
  }

  let total = 0;
  let bands = 0;
  for (let b = row; b < row + span && b < bandHeights.length; b++) {
    total += bandHeights[b];
    bands++;
  }

  return bands > 0
    ? total + (bands - 1) * rowGap
    : getGridItemHeight(itemId, dimensions);
}

/**
 * Pack items into cells. Row-span items anchor to the top row of their
 * column (sequence slot picks the column, taken footprints scan right) so
 * nothing ever sits above them. Column-span items claim adjacent cells in
 * one row, wrapping when they do not fit. Remaining items fill the cells
 * row-major. Without spans this is identical to sequential index arithmetic.
 */
export function packGridCells(
  orderedIds: string[],
  dimensions: GridDimensions,
  orientation: GridOrientation,
  itemsCount: number
): {
  indexById: { [id: string]: number };
  rowById: { [id: string]: number };
  columnById: { [id: string]: number };
  rowsUsed: number;
} {
  "worklet";

  const { columns = 3, rows = 3 } = dimensions;
  const indexById: { [id: string]: number } = {};
  const rowById: { [id: string]: number } = {};
  const columnById: { [id: string]: number } = {};
  let rowsUsed = 0;

  if (orientation === GridOrientation.Vertical) {
    const occupied: { [key: string]: boolean } = {};
    const key = (r: number, c: number) => r + ":" + c;
    const fitsAt = (
      r: number,
      c: number,
      rowSpan: number,
      colSpan: number
    ) => {
      for (let rr = r; rr < r + rowSpan; rr++) {
        for (let cc = c; cc < c + colSpan; cc++) {
          if (occupied[key(rr, cc)]) {
            return false;
          }
        }
      }
      return true;
    };
    const claim = (
      id: string,
      row: number,
      column: number,
      rowSpan: number,
      colSpan: number
    ) => {
      for (let rr = row; rr < row + rowSpan; rr++) {
        for (let cc = column; cc < column + colSpan; cc++) {
          occupied[key(rr, cc)] = true;
        }
      }
      indexById[id] = row * columns + column;
      rowById[id] = row;
      columnById[id] = column;
      if (row + rowSpan > rowsUsed) {
        rowsUsed = row + rowSpan;
      }
    };

    // Pass 1 — row-span items anchor to row 0. The implied column comes from
    // the sequence slot so dragging a span between columns keeps working; if
    // that footprint is taken, scan right for the next free column.
    for (let i = 0; i < orderedIds.length; i++) {
      const id = orderedIds[i];
      const rowSpan = getGridItemRowSpan(id, dimensions);
      if (rowSpan <= 1) {
        continue;
      }
      let placed = false;
      for (let attempt = 0; attempt < columns && !placed; attempt++) {
        const column = (i + attempt) % columns;
        if (fitsAt(0, column, rowSpan, 1)) {
          claim(id, 0, column, rowSpan, 1);
          placed = true;
        }
      }
      if (!placed) {
        // Degenerate (more spanning items than columns): fall back to the
        // first cell whose full footprint is free.
        let scanRow = 0;
        let scanColumn = 0;
        while (!fitsAt(scanRow, scanColumn, rowSpan, 1)) {
          scanColumn++;
          if (scanColumn >= columns) {
            scanColumn = 0;
            scanRow++;
          }
        }
        claim(id, scanRow, scanColumn, rowSpan, 1);
      }
    }

    // Pass 2 — remaining items fill cells row-major. Column-span items claim
    // adjacent cells in the same row, wrapping to the next row when they do
    // not fit before the row ends.
    for (let i = 0; i < orderedIds.length; i++) {
      const id = orderedIds[i];
      if (indexById[id] !== undefined) {
        continue;
      }
      const colSpan = Math.min(getGridItemColumnSpan(id, dimensions), columns);
      let scanRow = 0;
      let scanColumn = 0;
      for (;;) {
        if (scanColumn + colSpan > columns) {
          scanColumn = 0;
          scanRow++;
          continue;
        }
        if (fitsAt(scanRow, scanColumn, 1, colSpan)) {
          claim(id, scanRow, scanColumn, 1, colSpan);
          break;
        }
        scanColumn++;
      }
    }
  } else {
    // Horizontal grids flow column-major over fixed rows; row spans are a
    // vertical-orientation feature and are ignored here.
    for (let i = 0; i < orderedIds.length; i++) {
      const id = orderedIds[i];
      const column = Math.floor(i / rows);
      const row = i % rows;
      indexById[id] = column * rows + row;
      rowById[id] = row;
      columnById[id] = column;
    }
    rowsUsed = Math.min(rows, Math.max(itemsCount, 1));
  }

  return { indexById, rowById, columnById, rowsUsed };
}

/**
 * Find the item whose footprint (including row/column spans) covers a cell.
 */
export function findItemIdAtCell(
  positions: GridPositions,
  row: number,
  column: number,
  dimensions: GridDimensions,
  orientation: GridOrientation
): string | null {
  "worklet";

  let best: string | null = null;
  for (const id in positions) {
    const position = positions[id];
    const vertical = orientation === GridOrientation.Vertical;
    const rowSpan = vertical ? getGridItemRowSpan(id, dimensions) : 1;
    const colSpan = vertical ? getGridItemColumnSpan(id, dimensions) : 1;
    if (
      column >= position.column &&
      column < position.column + colSpan &&
      row >= position.row &&
      row < position.row + rowSpan
    ) {
      if (best === null || position.index < positions[best].index) {
        best = id;
      }
    }
  }
  return best;
}

/**
 * Row-band heights for an id -> index assignment: each band (vertical:
 * floor(index / columns), horizontal: index % rows) is sized to its tallest
 * item. Single source of truth for variable-height geometry. Spanning items
 * do not inflate bands — they stretch to the bands they cover instead. The
 * vertical band count extends to cover any span that crosses the last row.
 */
export function computeGridBandHeights(
  indexById: { [id: string]: number },
  dimensions: GridDimensions,
  orientation: GridOrientation,
  itemsCount: number
): number[] {
  "worklet";

  const { columns = 3, rows = 3, itemHeight } = dimensions;

  let bandCount: number;
  if (orientation === GridOrientation.Vertical) {
    bandCount = 0;
    for (const id in indexById) {
      const index = indexById[id];
      // Only excluded items (index -1) are ignored. Span layouts legitimately
      // produce indices >= itemsCount when packing pushes items past the
      // list-depth boundary, and those rows must still count toward the
      // band count.
      if (index < 0) {
        continue;
      }
      const bandEnd =
        Math.floor(index / columns) + getGridItemRowSpan(id, dimensions);
      if (bandEnd > bandCount) {
        bandCount = bandEnd;
      }
    }
    if (bandCount === 0 && itemsCount > 0) {
      bandCount = Math.ceil(itemsCount / columns);
    }
  } else {
    bandCount = rows;
  }

  const bandHeights: number[] = [];
  for (let band = 0; band < bandCount; band++) {
    bandHeights.push(0);
  }

  for (const id in indexById) {
    const index = indexById[id];
    if (index < 0) {
      continue;
    }
    // Spanning items derive their height from the bands, never the reverse.
    if (
      orientation === GridOrientation.Vertical &&
      getGridItemRowSpan(id, dimensions) > 1
    ) {
      continue;
    }
    const band =
      orientation === GridOrientation.Vertical
        ? Math.floor(index / columns)
        : index % rows;
    const height = getGridItemHeight(id, dimensions);
    if (height > bandHeights[band]) {
      bandHeights[band] = height;
    }
  }

  // Empty bands (fewer items than fixed rows) keep the default slot height
  for (let band = 0; band < bandCount; band++) {
    if (bandHeights[band] <= 0) {
      bandHeights[band] = itemHeight;
    }
  }

  return bandHeights;
}

/**
 * Row-band heights for the live positions object.
 */
export function computeGridBands(
  positions: GridPositions,
  dimensions: GridDimensions,
  orientation: GridOrientation,
  itemsCount: number
): number[] {
  "worklet";

  const indexById: { [id: string]: number } = {};
  for (const id in positions) {
    indexById[id] = positions[id].index;
  }

  return computeGridBandHeights(indexById, dimensions, orientation, itemsCount);
}

/**
 * Y offset of a band, summing the variable heights of all preceding bands.
 */
export function getGridBandTop(
  band: number,
  bandHeights: number[],
  rowGap: number
): number {
  "worklet";

  let top = 0;
  for (let b = 0; b < band && b < bandHeights.length; b++) {
    top += bandHeights[b] + rowGap;
  }
  return top;
}

/**
 * Band containing y. The rowGap below a band belongs to it, matching the
 * uniform `floor(y / (itemHeight + rowGap))` behavior.
 */
export function getGridBandFromY(
  y: number,
  bandHeights: number[],
  rowGap: number
): number {
  "worklet";

  if (bandHeights.length === 0) {
    return 0;
  }

  let top = 0;
  for (let band = 0; band < bandHeights.length; band++) {
    const bandEnd = top + bandHeights[band] + rowGap;
    if (y < bandEnd || band === bandHeights.length - 1) {
      return band;
    }
    top = bandEnd;
  }
  return bandHeights.length - 1;
}

/**
 * Calculate grid position from linear index
 */
export function calculateGridPosition(
  index: number,
  dimensions: GridDimensions,
  orientation: GridOrientation,
  bandHeights?: number[]
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
  const y = bandHeights
    ? getGridBandTop(row, bandHeights, rowGap)
    : row * (itemHeight + rowGap);

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
 * Layout a sequence of item ids: pack into cells, size bands, compute x/y.
 */
function layoutGridSequence(
  orderedIds: string[],
  dimensions: GridDimensions,
  orientation: GridOrientation
): GridPositions {
  "worklet";

  const packed = packGridCells(
    orderedIds,
    dimensions,
    orientation,
    orderedIds.length
  );
  const bandHeights = computeGridBandHeights(
    packed.indexById,
    dimensions,
    orientation,
    orderedIds.length
  );
  const rowGap = dimensions.rowGap ?? 0;
  const columnStride = dimensions.itemWidth + (dimensions.columnGap ?? 0);

  const positions: GridPositions = {};
  for (let i = 0; i < orderedIds.length; i++) {
    const id = orderedIds[i];
    const row = packed.rowById[id];
    const column = packed.columnById[id];
    positions[id] = {
      index: packed.indexById[id],
      row,
      column,
      x: column * columnStride,
      y: getGridBandTop(row, bandHeights, rowGap),
    };
  }

  return positions;
}

/**
 * Convert data array to grid positions object
 */
export function listToGridObject<T extends SortableData>(
  list: T[],
  dimensions: GridDimensions,
  orientation: GridOrientation
): GridPositions {
  return layoutGridSequence(
    list.map((item) => item.id),
    dimensions,
    orientation
  );
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
  totalItems: number,
  bandHeights?: number[]
): { row: number; column: number; index: number } {
  "worklet";

  const {
    itemWidth,
    itemHeight,
    rowGap = 0,
    columnGap = 0,
  } = dimensions;

  // Calculate which column and row the coordinates fall into
  const column = Math.floor(x / (itemWidth + columnGap));
  const row = bandHeights
    ? getGridBandFromY(y, bandHeights, rowGap)
    : Math.floor(y / (itemHeight + rowGap));

  // Calculate the linear index
  const index = calculateIndexFromRowColumn(row, column, dimensions, orientation);

  // Clamp to valid range
  const clampedIndex = clamp(index, 0, totalItems - 1);
  const clampedPosition = calculateGridPosition(
    clampedIndex,
    dimensions,
    orientation,
    bandHeights
  );

  return {
    row: clampedPosition.row,
    column: clampedPosition.column,
    index: clampedIndex,
  };
}

/**
 * Reorder grid positions using insert strategy.
 * The active item is moved to the target slot in the visual sequence and the
 * whole grid is re-packed, so spanning items always keep a valid footprint.
 */
export function reorderGridInsert(
  positions: GridPositions,
  activeId: string,
  targetIndex: number,
  dimensions: GridDimensions,
  orientation: GridOrientation
): GridPositions {
  "worklet";

  const activePosition = positions[activeId];
  if (!activePosition) {
    return positions;
  }
  const fromIndex = activePosition.index;

  if (fromIndex === targetIndex) {
    return positions;
  }

  const sequence = Object.keys(positions).sort(
    (a, b) => positions[a].index - positions[b].index
  );
  const fromSeq = sequence.indexOf(activeId);
  if (fromSeq === -1) {
    return positions;
  }
  sequence.splice(fromSeq, 1);

  const movingUp = targetIndex < fromIndex;
  const targetSeq = sequence.findIndex(
    (id) => positions[id].index === targetIndex
  );
  let insertAt: number;
  if (movingUp) {
    insertAt = targetSeq === -1 ? 0 : targetSeq;
  } else {
    insertAt = targetSeq === -1 ? sequence.length : targetSeq + 1;
  }
  sequence.splice(insertAt, 0, activeId);

  return layoutGridSequence(sequence, dimensions, orientation);
}

/**
 * Reorder grid positions using swap strategy.
 * The two items exchange places in the sequence and the grid is re-packed so
 * spanning footprints stay valid.
 */
export function reorderGridSwap(
  positions: GridPositions,
  activeId: string,
  targetId: string,
  dimensions: GridDimensions,
  orientation: GridOrientation
): GridPositions {
  "worklet";

  const activePosition = positions[activeId];
  const targetPosition = positions[targetId];
  if (!activePosition || !targetPosition) {
    return positions;
  }

  const activeIndex = activePosition.index;
  const targetIndex = targetPosition.index;
  if (activeIndex === targetIndex) {
    return positions;
  }

  const sequence = Object.keys(positions).sort(
    (a, b) => positions[a].index - positions[b].index
  );
  const activeSeq = sequence.indexOf(activeId);
  const targetSeq = sequence.indexOf(targetId);
  if (activeSeq === -1 || targetSeq === -1) {
    return positions;
  }
  sequence[activeSeq] = targetId;
  sequence[targetSeq] = activeId;

  return layoutGridSequence(sequence, dimensions, orientation);
}

/**
 * Update grid positions based on drag position.
 * (x, y) are content-space coordinates (already scroll-compensated by the
 * pan gesture). Hit testing uses pre-reorder band geometry; reordering
 * re-lays out.
 */
export function setGridPosition(
  x: number,
  y: number,
  itemsCount: number,
  positions: SharedValue<GridPositions>,
  id: string,
  dimensions: GridDimensions,
  orientation: GridOrientation,
  strategy: GridStrategy
): void {
  "worklet";

  // (x, y) are content-space coordinates — the same space as the dragged
  // item's top/left — so no scroll adjustment is applied here. Adding the
  // scroll offset would double-count it and drift the drop target.
  const bandHeights = computeGridBands(
    positions.value,
    dimensions,
    orientation,
    itemsCount
  );

  // Get target cell
  const targetCell = getGridCellFromCoordinates(
    x,
    y,
    dimensions,
    orientation,
    itemsCount,
    bandHeights
  );

  const currentIndex = positions.value[id].index;

  if (targetCell.index === currentIndex) {
    return;
  }

  // Resolve the cell to the item whose footprint covers it — a spanned cell
  // belongs to the item that claimed it, not to the raw cell index.
  const targetId = findItemIdAtCell(
    positions.value,
    targetCell.row,
    targetCell.column,
    dimensions,
    orientation
  );
  const targetIndex = targetId
    ? positions.value[targetId].index
    : targetCell.index;

  // Apply reordering strategy
  if (strategy === GridStrategy.Insert) {
    positions.value = reorderGridInsert(
      positions.value,
      id,
      targetIndex,
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
  orientation: GridOrientation,
  bandHeights?: number[]
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
    let bandTotal = 0;
    if (bandHeights && bandHeights.length > 0) {
      for (let i = 0; i < bandHeights.length; i++) {
        bandTotal += bandHeights[i];
      }
    }
    const height =
      bandHeights && bandHeights.length > 0
        ? bandTotal + (bandHeights.length - 1) * rowGap
        : totalRows * itemHeight + (totalRows - 1) * rowGap;
    return { width, height };
  } else {
    // Calculate number of columns needed
    const totalColumns = Math.ceil(itemsCount / rows);
    const width = totalColumns * itemWidth + (totalColumns - 1) * columnGap;
    let bandTotal = 0;
    if (bandHeights && bandHeights.length > 0) {
      for (let i = 0; i < bandHeights.length; i++) {
        bandTotal += bandHeights[i];
      }
    }
    const height =
      bandHeights && bandHeights.length > 0
        ? bandTotal + (bandHeights.length - 1) * rowGap
        : rows * itemHeight + (rows - 1) * rowGap;
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
