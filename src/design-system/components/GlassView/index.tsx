import { BlurView } from 'expo-blur';
import React from 'react';
import { LayoutChangeEvent, Platform, StyleSheet, View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';

import { useTheme } from '../../theme/ThemeProvider';

export interface GlassViewProps {
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
  intensity?: number;
  onLayout?: (e: LayoutChangeEvent) => void;
}

export function GlassView({ style, children, intensity = 60, onLayout }: GlassViewProps) {
  const { mode } = useTheme();

  if (Platform.OS === 'ios') {
    return (
      <BlurView
        style={[styles.base, style]}
        intensity={intensity}
        tint={mode === 'dark' ? 'systemMaterialDark' : 'systemMaterialLight'}
        onLayout={onLayout}
      >
        {children}
      </BlurView>
    );
  }

  return (
    <View
      style={[
        styles.base,
        { backgroundColor: mode === 'dark' ? 'rgba(28,28,30,0.92)' : 'rgba(242,242,247,0.92)' },
        style,
      ]}
      onLayout={onLayout}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    overflow: 'hidden',
  },
});
