import React, { useEffect } from 'react';
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { useTheme } from '../../theme/ThemeProvider';
import type { RadiusKey } from '../../tokens/radius';

export interface SkeletonProps {
  width?: number | `${number}%`;
  height?: number;
  radius?: RadiusKey;
  testID?: string;
}

export function Skeleton({ width = '100%', height = 16, radius = 'sm', testID }: SkeletonProps) {
  const { colors, radius: radiusTokens } = useTheme();
  const reducedMotion = useReducedMotion();
  const opacity = useSharedValue(0.4);

  useEffect(() => {
    if (reducedMotion) {
      cancelAnimation(opacity);
      return;
    }
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.9, { duration: 700, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.4, { duration: 700, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
    );
  }, [opacity, reducedMotion]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      testID={testID}
      style={[
        {
          width,
          height,
          borderRadius: radiusTokens[radius],
          backgroundColor: colors.border,
        },
        animatedStyle,
      ]}
    />
  );
}
