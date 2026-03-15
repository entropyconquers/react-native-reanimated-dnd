import { SharedValue } from "react-native-reanimated";

export enum ScrollDirection {
  None = "none",
  Up = "up",
  Down = "down",
}

export enum HorizontalScrollDirection {
  None = "none",
  Left = "left",
  Right = "right",
}

export function clamp(value: number, lowerBound: number, upperBound: number) {
  "worklet";
  return Math.max(lowerBound, Math.min(value, upperBound));
}

export function objectMove(
  object: { [id: string]: number },
  from: number,
  to: number
) {
  "worklet";
  const newObject = Object.assign({}, object);

  for (const id in object) {
    if (object[id] === from) {
      newObject[id] = to;
    }

    if (object[id] === to) {
      newObject[id] = from;
    }
  }

  return newObject;
}

export function listToObject<T extends { id: string }>(list: T[]) {
  const values = Object.values(list);
  const object: { [id: string]: number } = {};

  for (let i = 0; i < values.length; i++) {
    object[values[i].id] = i;
  }

  return object;
}

export function setPosition(
  positionY: number,
  itemsCount: number,
  positions: SharedValue<{ [id: string]: number }>,
  id: string,
  itemHeight: number
) {
  "worklet";
  const newPosition = clamp(
    Math.floor(positionY / itemHeight),
    0,
    itemsCount - 1
  );

  if (newPosition !== positions.value[id]) {
    positions.value = objectMove(
      positions.value,
      positions.value[id],
      newPosition
    );
  }
}

export function setAutoScroll(
  positionY: number,
  lowerBound: number,
  upperBound: number,
  scrollThreshold: number,
  autoScroll: SharedValue<ScrollDirection>
) {
  "worklet";
  if (positionY <= lowerBound + scrollThreshold) {
    autoScroll.value = ScrollDirection.Up;
  } else if (positionY >= upperBound - scrollThreshold) {
    autoScroll.value = ScrollDirection.Down;
  } else {
    autoScroll.value = ScrollDirection.None;
  }
}

export function getItemXPosition(
  position: number,
  itemWidth: number,
  gap: number = 0,
  paddingHorizontal: number = 0
) {
  "worklet";
  return paddingHorizontal + position * (itemWidth + gap);
}

export function getContentWidth(
  itemsCount: number,
  itemWidth: number,
  gap: number = 0,
  paddingHorizontal: number = 0
) {
  "worklet";
  if (itemsCount === 0) return paddingHorizontal * 2;

  const totalItemsWidth = itemsCount * itemWidth;
  const totalGaps = Math.max(0, itemsCount - 1) * gap;
  return totalItemsWidth + totalGaps + paddingHorizontal * 2;
}

export function setHorizontalPosition(
  positionX: number,
  itemsCount: number,
  positions: SharedValue<{ [id: string]: number }>,
  id: string,
  itemWidth: number,
  gap: number = 0,
  paddingHorizontal: number = 0
) {
  "worklet";
  const adjustedX = positionX - paddingHorizontal;

  const itemWithGapWidth = itemWidth + gap;
  const newPosition = clamp(
    Math.floor(adjustedX / itemWithGapWidth),
    0,
    itemsCount - 1
  );

  if (newPosition !== positions.value[id]) {
    positions.value = objectMove(
      positions.value,
      positions.value[id],
      newPosition
    );
  }
}

/**
 * Sets the horizontal auto-scroll direction based on current position and boundaries.
 * This function determines when to trigger left or right auto-scrolling when dragging
 * items near the edges of the container.
 *
 * @param positionX - Current X position of the dragged item
 * @param leftBound - Left boundary (scroll position)
 * @param rightBound - Right boundary (left + container width)
 * @param scrollThreshold - Distance from edge to trigger auto-scroll
 * @param autoScrollDirection - Shared value for auto-scroll state
 */
export function setHorizontalAutoScroll(
  positionX: number,
  leftBound: number,
  rightBound: number,
  scrollThreshold: number,
  autoScrollDirection: SharedValue<HorizontalScrollDirection>
) {
  "worklet";

  // Use a more conservative threshold (minimum 60px or provided threshold)
  const effectiveThreshold = Math.max(scrollThreshold, 60);

  const leftEdge = leftBound + effectiveThreshold;
  const rightEdge = rightBound - effectiveThreshold;

  if (positionX < leftEdge) {
    autoScrollDirection.value = HorizontalScrollDirection.Left;
  } else if (positionX > rightEdge) {
    autoScrollDirection.value = HorizontalScrollDirection.Right;
  } else {
    autoScrollDirection.value = HorizontalScrollDirection.None;
  }
}

/**
 * Resolves the height for a specific item based on the itemHeight prop format.
 * Supports number (uniform), array (per-index), function (computed), or fallback.
 * NOT a worklet — supports function callbacks on JS thread.
 */
export function resolveItemHeight<TData>(
  itemHeightProp:
    | number
    | number[]
    | ((item: TData, index: number) => number)
    | undefined,
  item: TData,
  index: number,
  fallback: number
): number {
  if (typeof itemHeightProp === "number") return itemHeightProp;
  if (Array.isArray(itemHeightProp)) return itemHeightProp[index] ?? fallback;
  if (typeof itemHeightProp === "function") return itemHeightProp(item, index);
  return fallback;
}

/**
 * Recalculates cumulative Y offsets based on current positions and item heights.
 * Items are laid out in order of their logical position index.
 * Uses position-indexed array (O(n)) instead of sort (O(n log n)).
 */
export function recalculateCumulativeHeights(
  positions: { [id: string]: number },
  itemHeights: { [id: string]: number },
  estimatedHeight: number
): { cumulative: { [id: string]: number }; total: number } {
  "worklet";
  // Build position-indexed array — positions are 0..n-1 integers,
  // so we can use them as direct indices instead of sorting.
  let count = 0;
  for (const _id in positions) {
    count++;
  }
  const idsByPosition: (string | undefined)[] = new Array(count);
  for (const id in positions) {
    idsByPosition[positions[id]] = id;
  }

  const cumulative: { [id: string]: number } = {};
  let total = 0;

  for (let i = 0; i < count; i++) {
    const itemId = idsByPosition[i];
    if (itemId !== undefined) {
      cumulative[itemId] = total;
      total += itemHeights[itemId] ?? estimatedHeight;
    }
  }

  return { cumulative, total };
}

/**
 * Finds the logical position index for a given Y coordinate using item heights.
 * Equivalent to Math.floor(positionY / itemHeight) for fixed heights.
 * Computes cumulative offsets inline (O(n)) to avoid maintaining a separate shared value.
 */
export function findPositionForY(
  positionY: number,
  positions: { [id: string]: number },
  itemHeights: { [id: string]: number },
  estimatedHeight: number,
  itemsCount: number
): number {
  "worklet";
  // Build position-indexed lookup (positions are 0..n-1 integers)
  let count = 0;
  for (const _id in positions) count++;
  const idsByPosition: (string | undefined)[] = new Array(count);
  for (const id in positions) {
    idsByPosition[positions[id]] = id;
  }

  // Walk positions in order, accumulating heights to find which slot positionY falls into
  let cumY = 0;
  let result = 0;
  for (let i = 0; i < count; i++) {
    const itemId = idsByPosition[i];
    if (itemId !== undefined) {
      if (positionY >= cumY) {
        result = i;
      }
      cumY += itemHeights[itemId] ?? estimatedHeight;
    }
  }

  return clamp(result, 0, itemsCount - 1);
}

/**
 * Calculates the Y position for a specific item by summing heights
 * of all items with lower position indices.
 * Uses for...in instead of Object.entries() to avoid allocation in worklets.
 */
export function getItemCumulativeY(
  id: string,
  positions: { [id: string]: number },
  itemHeights: { [id: string]: number },
  estimatedHeight: number
): number {
  "worklet";
  const targetPos = positions[id] ?? 0;
  let y = 0;

  for (const itemId in positions) {
    if (positions[itemId] < targetPos) {
      y += itemHeights[itemId] ?? estimatedHeight;
    }
  }

  return y;
}

/**
 * Returns a hash code based on the data
 * @param  {any[]} data The data to hash.
 * @return {string}    A 32bit integer
 */
export const dataHash = (data: any[]): string => {
  const str = data.reduce((acc, item) => acc + item.id, "");
  let hash = 0;
  for (let i = 0, len = str.length; i < len; i++) {
    let chr = str.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash.toString();
};
