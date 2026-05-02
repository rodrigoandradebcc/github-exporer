import { screen } from '@testing-library/react-native';
import React from 'react';

import { renderWithTheme } from '../../../__test-utils__/renderWithTheme';
import { Badge } from '../index';

describe('Badge', () => {
  it('renders children', () => {
    renderWithTheme(<Badge testID="badge">Active</Badge>);
    expect(screen.getByText('Active')).toBeTruthy();
  });

  it('renders with default tone', () => {
    renderWithTheme(<Badge testID="badge">Label</Badge>);
    const badge = screen.getByTestId('badge');
    expect(badge.props.style.backgroundColor).toBe('#F4F1F2');
  });

  it('renders with success tone', () => {
    renderWithTheme(
      <Badge testID="badge" tone="success">
        Success
      </Badge>,
    );
    const badge = screen.getByTestId('badge');
    expect(badge.props.style.backgroundColor).toContain('#45B442');
  });

  it('renders with danger tone', () => {
    renderWithTheme(
      <Badge testID="badge" tone="danger">
        Error
      </Badge>,
    );
    const badge = screen.getByTestId('badge');
    expect(badge.props.style.backgroundColor).toContain('#FF3B30');
  });

  it('applies sm size (smaller font)', () => {
    renderWithTheme(
      <Badge testID="badge" size="sm">
        Sm
      </Badge>,
    );
    const text = screen.getByText('Sm');
    expect(text.props.style.fontSize).toBe(12); // sizes.xs
  });

  it('applies md size', () => {
    renderWithTheme(
      <Badge testID="badge" size="md">
        Md
      </Badge>,
    );
    const text = screen.getByText('Md');
    expect(text.props.style.fontSize).toBe(14); // sizes.sm
  });
});
