import React from 'react';
import { Text as RNText } from 'react-native';

import { useTheme } from '../../theme/ThemeProvider';
import type { SizeKey } from '../../tokens/sizes';

export type TextVariant = 'body' | 'caption' | 'label';
export type TextTone = 'default' | 'muted' | 'danger' | 'success';
export type TextWeight = 'regular' | 'medium' | 'bold';

export interface TextProps {
  variant?: TextVariant;
  size?: SizeKey;
  tone?: TextTone;
  weight?: TextWeight;
  children: React.ReactNode;
  numberOfLines?: number;
  testID?: string;
}

const fontWeights = {
  regular: '400' as const,
  medium: '500' as const,
  bold: '700' as const,
};

export function Text({
  variant = 'body',
  size = 'md',
  tone = 'default',
  weight = 'regular',
  children,
  numberOfLines,
  testID,
}: TextProps) {
  const { colors, sizes } = useTheme();

  const color = {
    default: colors.text,
    muted: colors.muted,
    danger: colors.danger,
    success: colors.success,
  }[tone];

  return (
    <RNText
      testID={testID}
      numberOfLines={numberOfLines}
      style={{
        fontSize: sizes[size],
        color,
        fontWeight: fontWeights[weight],
        letterSpacing: variant === 'label' ? 0.5 : undefined,
        textTransform: variant === 'label' ? 'uppercase' : undefined,
      }}
    >
      {children}
    </RNText>
  );
}
