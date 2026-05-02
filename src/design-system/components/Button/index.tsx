import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';

import { useTheme } from '../../theme/ThemeProvider';

export type ButtonVariant = 'primary' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  onPress?: () => void;
  children: React.ReactNode;
  leftIcon?: React.ReactNode;
  testID?: string;
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  onPress,
  children,
  leftIcon,
  testID,
}: ButtonProps) {
  const { colors, spacing, sizes, radius } = useTheme();

  const sizeMap = {
    sm: { py: spacing.xs, px: spacing.sm, fontSize: sizes.sm },
    md: { py: spacing.sm, px: spacing.md, fontSize: sizes.md },
    lg: { py: spacing.md, px: spacing.lg, fontSize: sizes.lg },
  }[size];

  const variantMap = {
    primary: {
      container: { backgroundColor: colors.primary } as const,
      text: '#FFFFFF',
      indicator: '#FFFFFF',
    },
    outline: {
      container: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: colors.primary,
      } as const,
      text: colors.primary,
      indicator: colors.primary,
    },
    ghost: {
      container: { backgroundColor: 'transparent' } as const,
      text: colors.primary,
      indicator: colors.primary,
    },
  }[variant];

  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      testID={testID}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: radius.md,
          paddingVertical: sizeMap.py,
          paddingHorizontal: sizeMap.px,
          opacity: isDisabled ? 0.5 : 1,
        },
        variantMap.container,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          testID="button-loading-indicator"
          color={variantMap.indicator}
          size="small"
        />
      ) : (
        <>
          {leftIcon !== undefined && <View style={{ marginRight: spacing.xs }}>{leftIcon}</View>}
          <Text style={{ fontSize: sizeMap.fontSize, fontWeight: '600', color: variantMap.text }}>
            {children}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
}
