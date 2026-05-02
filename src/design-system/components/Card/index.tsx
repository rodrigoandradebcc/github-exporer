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
  const { colors, spacing, radius, mode } = useTheme();

  return (
    <View
      testID={testID}
      style={{
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radius.lg,
        padding: spacing[padding],
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: mode === 'light' ? 0.06 : 0,
        shadowRadius: 3,
        elevation: mode === 'light' ? 2 : 0,
      }}
    >
      {children}
    </View>
  );
}
