import { fireEvent, screen } from '@testing-library/react-native';
import React from 'react';

import { renderWithTheme } from '../../../__test-utils__/renderWithTheme';
import { Input } from '../index';

describe('Input', () => {
  it('renders with label', () => {
    renderWithTheme(
      <Input label="Email" value="" onChangeText={jest.fn()} testID="input" />,
    );
    expect(screen.getByText('Email')).toBeTruthy();
  });

  it('calls onChangeText on input', () => {
    const onChangeText = jest.fn();
    renderWithTheme(
      <Input value="" onChangeText={onChangeText} testID="input" />,
    );
    fireEvent.changeText(screen.getByTestId('input'), 'hello');
    expect(onChangeText).toHaveBeenCalledWith('hello');
  });

  it('shows error message when error prop provided', () => {
    renderWithTheme(
      <Input
        value=""
        onChangeText={jest.fn()}
        testID="input"
        error="This field is required"
      />,
    );
    expect(screen.getByText('This field is required')).toBeTruthy();
  });

  it('shows helper text when no error', () => {
    renderWithTheme(
      <Input
        value=""
        onChangeText={jest.fn()}
        testID="input"
        helperText="Max 100 characters"
      />,
    );
    expect(screen.getByText('Max 100 characters')).toBeTruthy();
  });

  it('hides helper text when error is present', () => {
    renderWithTheme(
      <Input
        value=""
        onChangeText={jest.fn()}
        testID="input"
        error="Error message"
        helperText="Helper text"
      />,
    );
    expect(screen.queryByText('Helper text')).toBeNull();
  });

  it('uses danger border color when error is set', () => {
    renderWithTheme(
      <Input value="" onChangeText={jest.fn()} testID="input" error="Oops" />,
    );
    expect(screen.getByTestId('input').props.style.borderColor).toBe('#FF3B30');
  });
});
