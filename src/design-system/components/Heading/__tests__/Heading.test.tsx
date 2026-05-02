import { screen } from '@testing-library/react-native';
import React from 'react';

import { renderWithTheme } from '../../../__test-utils__/renderWithTheme';
import { Heading } from '../index';

describe('Heading', () => {
  it('renders children', () => {
    renderWithTheme(<Heading testID="h">Title</Heading>);
    expect(screen.getByTestId('h').props.children).toBe('Title');
  });

  it('level 1 has larger font size than level 3', () => {
    renderWithTheme(
      <>
        <Heading testID="h1" level={1}>
          H1
        </Heading>
        <Heading testID="h3" level={3}>
          H3
        </Heading>
      </>,
    );
    expect(screen.getByTestId('h1').props.style.fontSize).toBeGreaterThan(
      screen.getByTestId('h3').props.style.fontSize,
    );
  });

  it('level 1 font size is 28', () => {
    renderWithTheme(
      <Heading testID="h" level={1}>
        H1
      </Heading>,
    );
    expect(screen.getByTestId('h').props.style.fontSize).toBe(28);
  });

  it('level 2 font size is 20', () => {
    renderWithTheme(
      <Heading testID="h" level={2}>
        H2
      </Heading>,
    );
    expect(screen.getByTestId('h').props.style.fontSize).toBe(20);
  });

  it('applies muted tone', () => {
    renderWithTheme(
      <Heading testID="h" tone="muted">
        Muted
      </Heading>,
    );
    expect(screen.getByTestId('h').props.style.color).toBe('#756C71');
  });

  it('always renders with bold weight', () => {
    renderWithTheme(<Heading testID="h">Title</Heading>);
    expect(screen.getByTestId('h').props.style.fontWeight).toBe('700');
  });

  it('has header accessibility role', () => {
    renderWithTheme(<Heading testID="h">Title</Heading>);
    expect(screen.getByTestId('h').props.accessibilityRole).toBe('header');
  });
});
