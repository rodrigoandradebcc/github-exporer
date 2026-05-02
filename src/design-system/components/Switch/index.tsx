import React from 'react';
import { Switch as RNSwitch } from 'react-native';

import { useTheme } from '../../theme/ThemeProvider';

export interface SwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  testID?: string;
}

export function Switch({ value, onValueChange, testID }: SwitchProps) {
  const { colors } = useTheme();
  return (
    <RNSwitch
      testID={testID}
      value={value}
      onValueChange={onValueChange}
      trackColor={{ false: colors.border, true: colors.primary }}
      thumbColor={value ? '#FFFFFF' : colors.surface}
      ios_backgroundColor={colors.border}
    />
  );
}
