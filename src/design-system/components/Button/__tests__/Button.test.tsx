import { fireEvent, screen } from '@testing-library/react-native';
import React from 'react';
import { StyleSheet } from 'react-native';

import { renderWithTheme } from '../../../__test-utils__/renderWithTheme';
import { Button } from '../index';

describe('Button', () => {
  it('renders children', () => {
    renderWithTheme(<Button testID="btn">Press me</Button>);
    expect(screen.getByText('Press me')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    renderWithTheme(
      <Button testID="btn" onPress={onPress}>
        Press
      </Button>,
    );
    fireEvent.press(screen.getByTestId('btn'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('shows ActivityIndicator when loading and hides text', () => {
    renderWithTheme(
      <Button testID="btn" loading>
        Press
      </Button>,
    );
    expect(screen.getByTestId('button-loading-indicator')).toBeTruthy();
    expect(screen.queryByText('Press')).toBeNull();
  });

  it('does not call onPress when disabled', () => {
    const onPress = jest.fn();
    renderWithTheme(
      <Button testID="btn" disabled onPress={onPress}>
        Press
      </Button>,
    );
    fireEvent.press(screen.getByTestId('btn'));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('primary variant uses primary background', () => {
    renderWithTheme(
      <Button testID="btn" variant="primary">
        Primary
      </Button>,
    );
    const style = StyleSheet.flatten(screen.getByTestId('btn').props.style);
    expect(style.backgroundColor).toBe('#D658B3');
  });

  it('outline variant has border', () => {
    renderWithTheme(
      <Button testID="btn" variant="outline">
        Outline
      </Button>,
    );
    const style = StyleSheet.flatten(screen.getByTestId('btn').props.style);
    expect(style.borderWidth).toBe(1);
    expect(style.borderColor).toBe('#D658B3');
  });

  it('is visually dimmed when disabled', () => {
    renderWithTheme(
      <Button testID="btn" disabled>
        Disabled
      </Button>,
    );
    const style = StyleSheet.flatten(screen.getByTestId('btn').props.style);
    expect(style.opacity).toBe(0.5);
  });

  it('ghost variant has no background or border', () => {
    renderWithTheme(
      <Button testID="btn" variant="ghost">
        Ghost
      </Button>,
    );
    const style = StyleSheet.flatten(screen.getByTestId('btn').props.style);
    expect(style.backgroundColor).toBe('transparent');
    expect(style.borderWidth).toBeUndefined();
  });
});
