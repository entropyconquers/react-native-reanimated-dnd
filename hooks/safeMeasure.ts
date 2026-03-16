import { Component } from "react";
import { AnimatedRef, measure } from "react-native-reanimated";

/**
 * Reanimated can throw before returning `null` when a node is not attached yet.
 * Guarding this keeps early Fabric measurements from taking down the app.
 */
export const safeMeasure = <T extends Component>(ref: AnimatedRef<T>) => {
  "worklet";

  try {
    const measurement = measure(ref);

    if (!measurement) {
      return null;
    }

    if (measurement.width <= 0 || measurement.height <= 0) {
      return null;
    }

    return measurement;
  } catch {
    return null;
  }
};
