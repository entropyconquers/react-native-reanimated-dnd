---
title: "Animation Functions"
---

Custom animation functions for controlling how draggable items animate during and after drag operations.

## Overview

Animation functions allow you to customize how draggable items animate when they return to their original position or snap to a drop zone. The library uses React Native Reanimated for smooth, performant animations that run on the UI thread.

## AnimationFunction Type

```tsx
type AnimationFunction = (toValue: number) => number;
```

Animation functions are worklets that take a target value and return an animated value using Reanimated's animation functions.

### Parameters

- `toValue`: The target value to animate to (typically 0 for returning to original position)

### Returns

An animated value created using Reanimated animation functions like `withSpring`, `withTiming`, etc.

## Built-in Animation Patterns

### Spring Animations

Spring animations provide natural, bouncy motion that feels responsive and organic.

#### Basic Spring

```tsx
const springAnimation = (toValue) => {
  "worklet";
  return withSpring(toValue);
};

<Draggable data={data} animationFunction={springAnimation}>
  <Text>Spring animation</Text>
</Draggable>;
```

#### Custom Spring Configuration

```tsx
const customSpring = (toValue) => {
  "worklet";
  return withSpring(toValue, {
    damping: 15, // Controls oscillation (higher = less bouncy)
    stiffness: 150, // Controls speed (higher = faster)
    mass: 1, // Controls inertia (higher = slower)
    overshootClamping: false, // Allow overshooting
    restDisplacementThreshold: 0.01,
    restSpeedThreshold: 2,
  });
};
```

#### Bouncy Spring

```tsx
const bouncySpring = (toValue) => {
  "worklet";
  return withSpring(toValue, {
    damping: 8, // Low damping for more bounce
    stiffness: 100,
    mass: 0.8,
  });
};
```

#### Gentle Spring

```tsx
const gentleSpring = (toValue) => {
  "worklet";
  return withSpring(toValue, {
    damping: 20, // High damping for smooth motion
    stiffness: 120,
    mass: 1.2,
  });
};
```

### Timing Animations

Timing animations provide precise control over duration and easing curves.

#### Basic Timing

```tsx
const timingAnimation = (toValue) => {
  "worklet";
  return withTiming(toValue, {
    duration: 300,
    easing: Easing.out(Easing.cubic),
  });
};
```

#### Elastic Timing

```tsx
import { Easing } from "react-native-reanimated";

const elasticTiming = (toValue) => {
  "worklet";
  return withTiming(toValue, {
    duration: 600,
    easing: Easing.elastic(2), // Elastic effect
  });
};
```

#### Bounce Timing

```tsx
const bounceTiming = (toValue) => {
  "worklet";
  return withTiming(toValue, {
    duration: 800,
    easing: Easing.bounce,
  });
};
```

#### Smooth Timing

```tsx
const smoothTiming = (toValue) => {
  "worklet";
  return withTiming(toValue, {
    duration: 250,
    easing: Easing.bezier(0.25, 0.1, 0.25, 1), // Material Design curve
  });
};
```

## Advanced Animation Patterns

### Sequential Animations

```tsx
const sequentialAnimation = (toValue) => {
  "worklet";
  return withSequence(
    withTiming(toValue * 1.1, { duration: 100 }), // Slight overshoot
    withSpring(toValue, { damping: 15 }) // Spring back
  );
};
```

### Delayed Animations

```tsx
const delayedAnimation = (toValue) => {
  "worklet";
  return withDelay(
    200, // 200ms delay
    withSpring(toValue)
  );
};
```

### Repeated Animations

```tsx
const pulseAnimation = (toValue) => {
  "worklet";
  return withRepeat(
    withSequence(
      withTiming(toValue * 0.95, { duration: 150 }),
      withTiming(toValue, { duration: 150 })
    ),
    3, // Repeat 3 times
    false // Don't reverse
  );
};
```

### Conditional Animations

```tsx
const conditionalAnimation = (toValue) => {
  "worklet";
  // Different animation based on target value
  if (toValue === 0) {
    // Returning to original position - use spring
    return withSpring(toValue, { damping: 15 });
  } else {
    // Snapping to drop zone - use timing
    return withTiming(toValue, { duration: 200 });
  }
};
```

## Context-Aware Animations

### State-Based Animations

```tsx
function StatefulDraggable({ data, isSuccess }) {
  const getAnimation = useCallback(
    (toValue) => {
      "worklet";
      if (isSuccess) {
        // Success animation - bouncy and celebratory
        return withSequence(
          withTiming(toValue * 1.2, { duration: 100 }),
          withSpring(toValue, { damping: 8, stiffness: 150 })
        );
      } else {
        // Default animation - smooth return
        return withSpring(toValue, { damping: 15 });
      }
    },
    [isSuccess]
  );

  return (
    <Draggable data={data} animationFunction={getAnimation}>
      <Text>State-aware animation</Text>
    </Draggable>
  );
}
```

### Performance-Based Animations

```tsx
function PerformanceDraggable({ data, isLowEndDevice }) {
  const getAnimation = useCallback(
    (toValue) => {
      "worklet";
      if (isLowEndDevice) {
        // Simple, fast animation for low-end devices
        return withTiming(toValue, { duration: 150 });
      } else {
        // Rich animation for high-end devices
        return withSequence(
          withTiming(toValue * 1.1, { duration: 100 }),
          withSpring(toValue, { damping: 12, stiffness: 200 })
        );
      }
    },
    [isLowEndDevice]
  );

  return (
    <Draggable data={data} animationFunction={getAnimation}>
      <Text>Performance-aware animation</Text>
    </Draggable>
  );
}
```

## Animation Presets

### Material Design Animations

```tsx
// Material Design motion curves
const materialAnimations = {
  standard: (toValue) => {
    "worklet";
    return withTiming(toValue, {
      duration: 300,
      easing: Easing.bezier(0.4, 0.0, 0.2, 1),
    });
  },

  decelerate: (toValue) => {
    "worklet";
    return withTiming(toValue, {
      duration: 250,
      easing: Easing.bezier(0.0, 0.0, 0.2, 1),
    });
  },

  accelerate: (toValue) => {
    "worklet";
    return withTiming(toValue, {
      duration: 200,
      easing: Easing.bezier(0.4, 0.0, 1, 1),
    });
  },
};
```

### iOS-Style Animations

```tsx
const iOSAnimations = {
  default: (toValue) => {
    "worklet";
    return withSpring(toValue, {
      damping: 20,
      stiffness: 300,
      mass: 1,
    });
  },

  gentle: (toValue) => {
    "worklet";
    return withTiming(toValue, {
      duration: 350,
      easing: Easing.out(Easing.cubic),
    });
  },

  snappy: (toValue) => {
    "worklet";
    return withSpring(toValue, {
      damping: 15,
      stiffness: 400,
      mass: 0.8,
    });
  },
};
```

### Game-Style Animations

```tsx
const gameAnimations = {
  powerUp: (toValue) => {
    "worklet";
    return withSequence(
      withTiming(toValue * 1.3, { duration: 100 }),
      withTiming(toValue * 0.9, { duration: 100 }),
      withSpring(toValue, { damping: 10 })
    );
  },

  impact: (toValue) => {
    "worklet";
    return withSequence(
      withTiming(toValue * 0.8, { duration: 50 }),
      withSpring(toValue, { damping: 8, stiffness: 200 })
    );
  },

  float: (toValue) => {
    "worklet";
    return withRepeat(
      withSequence(
        withTiming(toValue - 5, { duration: 1000 }),
        withTiming(toValue + 5, { duration: 1000 })
      ),
      -1, // Infinite
      true // Reverse
    );
  },
};
```

## Dynamic Animation Selection

### Animation Factory

```tsx
class AnimationFactory {
  static create(type: string, options: any = {}) {
    const animations = {
      spring: (toValue) => {
        "worklet";
        return withSpring(toValue, {
          damping: options.damping || 15,
          stiffness: options.stiffness || 150,
          ...options,
        });
      },

      timing: (toValue) => {
        "worklet";
        return withTiming(toValue, {
          duration: options.duration || 300,
          easing: options.easing || Easing.out(Easing.cubic),
          ...options,
        });
      },

      bounce: (toValue) => {
        "worklet";
        return withTiming(toValue, {
          duration: options.duration || 600,
          easing: Easing.bounce,
          ...options,
        });
      },

      elastic: (toValue) => {
        "worklet";
        return withTiming(toValue, {
          duration: options.duration || 800,
          easing: Easing.elastic(options.elasticity || 2),
          ...options,
        });
      },
    };

    return animations[type] || animations.spring;
  }
}

// Usage
function ConfigurableDraggable({ animationType, animationOptions }) {
  const animation = AnimationFactory.create(animationType, animationOptions);

  return (
    <Draggable data={data} animationFunction={animation}>
      <Text>Configurable animation</Text>
    </Draggable>
  );
}
```

### Theme-Based Animations

```tsx
const useThemeAnimations = (theme) => {
  return useMemo(() => {
    const animations = {
      light: {
        gentle: (toValue) => {
          "worklet";
          return withSpring(toValue, { damping: 20, stiffness: 200 });
        },
        quick: (toValue) => {
          "worklet";
          return withTiming(toValue, { duration: 200 });
        },
      },

      dark: {
        smooth: (toValue) => {
          "worklet";
          return withTiming(toValue, {
            duration: 300,
            easing: Easing.out(Easing.cubic),
          });
        },
        dramatic: (toValue) => {
          "worklet";
          return withSequence(
            withTiming(toValue * 1.2, { duration: 150 }),
            withSpring(toValue, { damping: 10 })
          );
        },
      },

      playful: {
        bounce: (toValue) => {
          "worklet";
          return withSpring(toValue, { damping: 8, stiffness: 150 });
        },
        wiggle: (toValue) => {
          "worklet";
          return withSequence(
            withTiming(toValue + 5, { duration: 50 }),
            withTiming(toValue - 5, { duration: 50 }),
            withSpring(toValue)
          );
        },
      },
    };

    return animations[theme] || animations.light;
  }, [theme]);
};
```

## Performance Considerations

### Optimized Animations

```tsx
// Prefer spring animations for better performance
const optimizedSpring = (toValue) => {
  "worklet";
  return withSpring(toValue, {
    damping: 15,
    stiffness: 150,
    // Reduce precision for better performance
    restDisplacementThreshold: 0.1,
    restSpeedThreshold: 5,
  });
};

// Use shorter durations for timing animations
const optimizedTiming = (toValue) => {
  "worklet";
  return withTiming(toValue, {
    duration: 200, // Shorter duration
    easing: Easing.out(Easing.quad), // Simpler easing
  });
};
```

### Conditional Performance

```tsx
const adaptiveAnimation = (toValue) => {
  "worklet";
  // Use simpler animations during heavy operations
  const isHeavyOperation = global.isHeavyOperation || false;

  if (isHeavyOperation) {
    return withTiming(toValue, { duration: 100 });
  } else {
    return withSpring(toValue, { damping: 15 });
  }
};
```

## Testing Animations

### Animation Testing Utilities

```tsx
const createTestAnimation = (duration = 100) => {
  return (toValue) => {
    "worklet";
    return withTiming(toValue, { duration });
  };
};

// Use in tests
function TestDraggable() {
  const isTest = process.env.NODE_ENV === "test";
  const animation = isTest
    ? createTestAnimation(0) // Instant for tests
    : springAnimation; // Normal for app

  return (
    <Draggable data={data} animationFunction={animation}>
      <Text>Test-friendly animation</Text>
    </Draggable>
  );
}
```

## Best Practices

### Animation Guidelines

1. **Use spring animations** for natural feel
2. **Keep durations under 500ms** for responsiveness
3. **Match animations to context** (gentle for forms, bouncy for games)
4. **Test on low-end devices** to ensure smooth performance
5. **Provide reduced motion options** for accessibility

### Common Patterns

```tsx
// Good: Contextual animation selection
const getContextualAnimation = (context) => {
  if (context.isForm) {
    return gentleSpring;
  } else if (context.isGame) {
    return bouncySpring;
  } else {
    return standardSpring;
  }
};

// Good: Performance-aware animations
const getPerformanceAnimation = (deviceCapability) => {
  return deviceCapability === "high" ? richAnimation : simpleAnimation;
};

// Avoid: Overly complex animations
const avoidComplexAnimation = (toValue) => {
  "worklet";
  // Too many nested animations can hurt performance
  return withSequence(
    withRepeat(withTiming(toValue * 1.1, { duration: 50 }), 5),
    withDelay(100, withSpring(toValue)),
    withRepeat(withTiming(toValue * 0.9, { duration: 25 }), 3)
  );
};
```

## See Also

- [Draggable Component](../../components/draggable) - Using animation functions
- [useDraggable Hook](../../hooks/useDraggable) - Hook-level animation configuration
- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/) - Animation library documentation
- [Performance Guide](../../guides/performance) - Performance optimization tips
