import { Component } from 'react';
import { AnimatedRef, measure } from 'react-native-reanimated';

/**
 * Worklet-safe wrapper around Reanimated's `measure(ref)`.
 *
 * On RN >= 0.81, `measure(ref)` can throw on the UI thread
 * if the ref isn't attached to a native view yet, causing an
 * app crash with JSI error: "Value is null, expected an Object".
 */
export const safeMeasure = <T extends Component>(ref: AnimatedRef<T>) => {
  'worklet';

  try {
    const measurement = measure(ref);

    if (!measurement || (measurement.width === 0 && measurement.height === 1)) {
      return null;
    }

    return measurement;
  } catch {
    return null;
  }
};