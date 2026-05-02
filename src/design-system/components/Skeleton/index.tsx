import React, { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';

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
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.9,
          duration: 700,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.4,
          duration: 700,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [opacity]);

  return (
    <Animated.View
      testID={testID}
      style={{
        width,
        height,
        borderRadius: radiusTokens[radius],
        backgroundColor: colors.border,
        opacity,
      }}
    />
  );
}
