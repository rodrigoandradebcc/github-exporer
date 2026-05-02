import React from 'react';
import { Image, Text, View } from 'react-native';

import { useTheme } from '../../theme/ThemeProvider';
import type { SizeKey } from '../../tokens/sizes';

export type AvatarSize = 'sm' | 'md' | 'lg';

export interface AvatarProps {
  uri?: string;
  size?: AvatarSize;
  fallback: string;
  testID?: string;
}

const dimensionMap: Record<AvatarSize, number> = {
  sm: 32,
  md: 48,
  lg: 64,
};

const fallbackSizeMap: Record<AvatarSize, SizeKey> = {
  sm: 'xs',
  md: 'sm',
  lg: 'md',
};

export function Avatar({ uri, size = 'md', fallback, testID }: AvatarProps) {
  const { colors, sizes } = useTheme();
  const dimension = dimensionMap[size];

  return (
    <View
      testID={testID}
      style={{
        width: dimension,
        height: dimension,
        borderRadius: dimension / 2,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {uri !== undefined ? (
        <Image
          testID="avatar-image"
          source={{ uri }}
          style={{ width: dimension, height: dimension }}
          resizeMode="cover"
        />
      ) : (
        <Text
          testID="avatar-fallback"
          style={{
            fontSize: sizes[fallbackSizeMap[size]],
            color: colors.text,
            fontWeight: '600',
          }}
        >
          {fallback.slice(0, 2).toUpperCase()}
        </Text>
      )}
    </View>
  );
}
