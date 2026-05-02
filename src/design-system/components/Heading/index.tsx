import React from 'react';
import { Text } from 'react-native';

import { useTheme } from '../../theme/ThemeProvider';
import type { SizeKey } from '../../tokens/sizes';

export type HeadingLevel = 1 | 2 | 3;
export type HeadingTone = 'default' | 'muted' | 'danger' | 'success';

export interface HeadingProps {
  level?: HeadingLevel;
  tone?: HeadingTone;
  children: React.ReactNode;
  testID?: string;
}

const levelToSize: Record<HeadingLevel, SizeKey> = {
  1: 'xl',
  2: 'lg',
  3: 'md',
};

export function Heading({ level = 1, tone = 'default', children, testID }: HeadingProps) {
  const { colors, sizes } = useTheme();

  const color = {
    default: colors.text,
    muted: colors.muted,
    danger: colors.danger,
    success: colors.success,
  }[tone];

  return (
    <Text
      testID={testID}
      accessibilityRole="header"
      style={{
        fontSize: sizes[levelToSize[level]],
        color,
        fontWeight: '700',
        lineHeight: sizes[levelToSize[level]] * 1.3,
      }}
    >
      {children}
    </Text>
  );
}
