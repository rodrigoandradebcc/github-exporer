import { screen } from '@testing-library/react-native';
import React from 'react';
import { Text } from 'react-native';

import { renderWithTheme } from '../../../__test-utils__/renderWithTheme';
import { Card } from '../index';

describe('Card', () => {
  it('renders children', () => {
    renderWithTheme(
      <Card testID="card">
        <Text testID="child">Content</Text>
      </Card>,
    );
    expect(screen.getByTestId('child')).toBeTruthy();
  });

  it('applies sm padding (spacing.sm = 8)', () => {
    renderWithTheme(
      <Card testID="card" padding="sm">
        <Text>Content</Text>
      </Card>,
    );
    expect(screen.getByTestId('card').props.style.padding).toBe(8);
  });

  it('applies lg padding (spacing.lg = 24)', () => {
    renderWithTheme(
      <Card testID="card" padding="lg">
        <Text>Content</Text>
      </Card>,
    );
    expect(screen.getByTestId('card').props.style.padding).toBe(24);
  });

  it('uses surface background color', () => {
    renderWithTheme(
      <Card testID="card">
        <Text>Content</Text>
      </Card>,
    );
    expect(screen.getByTestId('card').props.style.backgroundColor).toBe('#F6F8FA');
  });

  it('has border', () => {
    renderWithTheme(
      <Card testID="card">
        <Text>Content</Text>
      </Card>,
    );
    expect(screen.getByTestId('card').props.style.borderWidth).toBe(1);
  });
});
