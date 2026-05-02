import { render } from '@testing-library/react-native';
import React from 'react';

import { ThemeProvider } from '../theme/ThemeProvider';

function Wrapper({ children }: { children: React.ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}

export function renderWithTheme(ui: React.ReactElement) {
  return render(ui, { wrapper: Wrapper });
}
