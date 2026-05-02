import React, { useState } from 'react';
import { Text, TextInput, View } from 'react-native';

import { useTheme } from '../../theme/ThemeProvider';

export interface InputProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  helperText?: string;
  placeholder?: string;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad' | 'url' | 'web-search';
  returnKeyType?: 'done' | 'go' | 'next' | 'search' | 'send';
  secureTextEntry?: boolean;
  disabled?: boolean;
  testID?: string;
}

export function Input({
  label,
  value,
  onChangeText,
  error,
  helperText,
  placeholder,
  autoCapitalize,
  keyboardType,
  returnKeyType,
  secureTextEntry,
  disabled = false,
  testID,
}: InputProps) {
  const { colors, spacing, sizes, radius } = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  const borderColor = error ? colors.danger : isFocused ? colors.primary : colors.border;

  return (
    <View style={{ gap: spacing.xs, opacity: disabled ? 0.5 : 1 }}>
      {label !== undefined && (
        <Text style={{ fontSize: sizes.sm, color: colors.text, fontWeight: '500' }}>{label}</Text>
      )}
      <TextInput
        testID={testID}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.muted}
        autoCapitalize={autoCapitalize}
        keyboardType={keyboardType}
        returnKeyType={returnKeyType}
        secureTextEntry={secureTextEntry}
        editable={!disabled}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        style={{
          fontSize: sizes.md,
          color: colors.text,
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor,
          borderRadius: radius.md,
          paddingVertical: spacing.sm,
          paddingHorizontal: spacing.md,
          minHeight: 44,
        }}
      />
      {error !== undefined && (
        <Text style={{ fontSize: sizes.xs, color: colors.danger }}>{error}</Text>
      )}
      {error === undefined && helperText !== undefined && (
        <Text style={{ fontSize: sizes.xs, color: colors.muted }}>{helperText}</Text>
      )}
    </View>
  );
}
