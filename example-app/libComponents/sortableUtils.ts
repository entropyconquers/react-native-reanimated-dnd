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
