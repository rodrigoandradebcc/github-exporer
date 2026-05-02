import { screen } from '@testing-library/react-native';
import React from 'react';

import { renderWithTheme } from '../../../__test-utils__/renderWithTheme';
import { Text } from '../index';

describe('Text', () => {
  it('renders children', () => {
    renderWithTheme(<Text testID="t">Hello</Text>);
    expect(screen.getByTestId('t').props.children).toBe('Hello');
  });

  it('applies danger tone', () => {
    renderWithTheme(
      <Text testID="t" tone="danger">
        Error
      </Text>,
    );
    // danger color from lightColors
    expect(screen.getByTestId('t').props.style.color).toBe('#FF3B30');
  });

  it('applies muted tone', () => {
    renderWithTheme(
      <Text testID="t" tone="muted">
        Muted
      </Text>,
    );
    expect(screen.getByTestId('t').props.style.color).toBe('#636C76');
  });

  it('applies bold weight', () => {
    renderWithTheme(
      <Text testID="t" weight="bold">
        Bold
      </Text>,
    );
    expect(screen.getByTestId('t').props.style.fontWeight).toBe('700');
  });

  it('applies label variant with uppercase transform', () => {
    renderWithTheme(
      <Text testID="t" variant="label">
        Label
      </Text>,
    );
    expect(screen.getByTestId('t').props.style.textTransform).toBe('uppercase');
  });

  it('applies xs size', () => {
    renderWithTheme(
      <Text testID="t" size="xs">
        Small
      </Text>,
    );
    expect(screen.getByTestId('t').props.style.fontSize).toBe(12);
  });
});
