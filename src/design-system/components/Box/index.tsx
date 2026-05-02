import React from 'react';
import { View } from 'react-native';

import { useTheme } from '../../theme/ThemeProvider';
import type { SpacingKey } from '../../tokens/spacing';

export interface BoxProps {
  flex?: number;
  direction?: 'row' | 'column';
  align?: 'flex-start' | 'center' | 'flex-end' | 'stretch' | 'baseline';
  justify?:
    | 'flex-start'
    | 'center'
    | 'flex-end'
    | 'space-between'
    | 'space-around'
    | 'space-evenly';
  gap?: SpacingKey;
  padding?: SpacingKey;
  paddingHorizontal?: SpacingKey;
  paddingVertical?: SpacingKey;
  paddingTop?: SpacingKey;
  paddingBottom?: SpacingKey;
  paddingLeft?: SpacingKey;
  paddingRight?: SpacingKey;
  children?: React.ReactNode;
  testID?: string;
}

export function Box({
  flex,
  direction,
  align,
  justify,
  gap,
  padding,
  paddingHorizontal,
  paddingVertical,
  paddingTop,
  paddingBottom,
  paddingLeft,
  paddingRight,
  children,
  testID,
}: BoxProps) {
  const { spacing } = useTheme();

  return (
    <View
      testID={testID}
      style={{
        flex,
        flexDirection: direction,
        alignItems: align,
        justifyContent: justify,
        gap: gap !== undefined ? spacing[gap] : undefined,
        padding: padding !== undefined ? spacing[padding] : undefined,
        paddingHorizontal: paddingHorizontal !== undefined ? spacing[paddingHorizontal] : undefined,
        paddingVertical: paddingVertical !== undefined ? spacing[paddingVertical] : undefined,
        paddingTop: paddingTop !== undefined ? spacing[paddingTop] : undefined,
        paddingBottom: paddingBottom !== undefined ? spacing[paddingBottom] : undefined,
        paddingLeft: paddingLeft !== undefined ? spacing[paddingLeft] : undefined,
        paddingRight: paddingRight !== undefined ? spacing[paddingRight] : undefined,
      }}
    >
      {children}
    </View>
  );
}
