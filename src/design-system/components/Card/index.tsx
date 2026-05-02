import React from 'react';
import { View } from 'react-native';

import { useTheme } from '../../theme/ThemeProvider';
import type { SpacingKey } from '../../tokens/spacing';

export type CardPadding = Extract<SpacingKey, 'sm' | 'md' | 'lg'>;

export interface CardProps {
  padding?: CardPadding;
  children: React.ReactNode;
  testID?: string;
}

export function Card({ padding = 'md', children, testID }: CardProps) {
  const { colors, spacing, radius } = useTheme();

  return (
    <View
      testID={testID}
      style={{
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radius.md,
        padding: spacing[padding],
      }}
    >
      {children}
    </View>
  );
}
