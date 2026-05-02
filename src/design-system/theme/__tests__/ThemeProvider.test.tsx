import AsyncStorage from '@react-native-async-storage/async-storage';
import { act, fireEvent, render, screen } from '@testing-library/react-native';
import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

import { ThemeProvider, useTheme } from '../ThemeProvider';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn().mockResolvedValue(null),
  setItem: jest.fn().mockResolvedValue(undefined),
}));

const mockAsyncStorage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;

function TestConsumer() {
  const { mode, toggleMode, colors, spacing, sizes, radius } = useTheme();
  return (
    <>
      <Text testID="mode">{mode}</Text>
      <Text testID="bg-color">{colors.background}</Text>
      <Text testID="spacing-md">{spacing.md}</Text>
      <Text testID="size-md">{sizes.md}</Text>
      <Text testID="radius-md">{radius.md}</Text>
      <TouchableOpacity testID="toggle" onPress={toggleMode} />
    </>
  );
}

describe('ThemeProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAsyncStorage.getItem.mockResolvedValue(null);
  });

  it('provides light mode by default', () => {
    render(
      <ThemeProvider>
        <TestConsumer />
      </ThemeProvider>,
    );

    expect(screen.getByTestId('mode').props.children).toBe('light');
    expect(screen.getByTestId('bg-color').props.children).toBe('#FFFFFF');
  });

  it('toggles from light to dark and persists the choice', async () => {
    render(
      <ThemeProvider>
        <TestConsumer />
      </ThemeProvider>,
    );

    await act(async () => {
      fireEvent.press(screen.getByTestId('toggle'));
    });

    expect(screen.getByTestId('mode').props.children).toBe('dark');
    expect(screen.getByTestId('bg-color').props.children).toBe('#0D1117');
    expect(mockAsyncStorage.setItem).toHaveBeenCalledWith('@github_explorer/theme_mode', 'dark');
  });

  it('toggles back from dark to light', async () => {
    render(
      <ThemeProvider initialMode="dark">
        <TestConsumer />
      </ThemeProvider>,
    );

    await act(async () => {
      fireEvent.press(screen.getByTestId('toggle'));
    });

    expect(screen.getByTestId('mode').props.children).toBe('light');
    expect(mockAsyncStorage.setItem).toHaveBeenCalledWith('@github_explorer/theme_mode', 'light');
  });

  it('restores persisted mode from AsyncStorage', async () => {
    mockAsyncStorage.getItem.mockResolvedValue('dark');

    render(
      <ThemeProvider>
        <TestConsumer />
      </ThemeProvider>,
    );

    // wait for the useEffect to resolve
    await act(async () => {});

    expect(screen.getByTestId('mode').props.children).toBe('dark');
  });

  it('exposes correct token values', () => {
    render(
      <ThemeProvider>
        <TestConsumer />
      </ThemeProvider>,
    );

    expect(screen.getByTestId('spacing-md').props.children).toBe(16);
    expect(screen.getByTestId('size-md').props.children).toBe(16);
    expect(screen.getByTestId('radius-md').props.children).toBe(8);
  });

  it('throws when useTheme is called outside a provider', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<TestConsumer />)).toThrow('useTheme must be used within a ThemeProvider');
    spy.mockRestore();
  });
});
