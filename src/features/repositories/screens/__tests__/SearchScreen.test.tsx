import { fireEvent, screen, waitFor } from '@testing-library/react-native';
import React from 'react';

import { renderWithTheme } from '@/design-system/__test-utils__/renderWithTheme';
import { useSearchRepositories } from '@/features/repositories/hooks/useSearchRepositories';
import { ApiError } from '@/services/api/client';
import type { Repository } from '@/services/api/types';

import { SearchScreen } from '../SearchScreen';

// ── mocks ─────────────────────────────────────────────────────────────────────

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: jest.fn() }),
  Stack: { Screen: () => null },
}));

jest.mock('@/features/repositories/hooks/useSearchRepositories');

const mockHook = useSearchRepositories as jest.MockedFunction<typeof useSearchRepositories>;

// ── helpers ───────────────────────────────────────────────────────────────────

const makeRepo = (overrides: Partial<Repository> = {}): Repository => ({
  id: 1,
  name: 'react',
  full_name: 'facebook/react',
  owner: {
    id: 1,
    login: 'facebook',
    avatar_url: 'https://example.com/avatar.png',
    html_url: 'https://github.com/facebook',
    type: 'Organization',
  },
  description: 'A declarative UI library',
  html_url: 'https://github.com/facebook/react',
  language: 'JavaScript',
  stargazers_count: 200000,
  forks_count: 40000,
  open_issues_count: 100,
  topics: [],
  updated_at: '2024-01-01T00:00:00Z',
  created_at: '2013-05-24T00:00:00Z',
  private: false,
  ...overrides,
});

function idleHook(overrides = {}) {
  mockHook.mockReturnValue({
    data: undefined,
    isLoading: false,
    isError: false,
    error: null,
    fetchNextPage: jest.fn(),
    hasNextPage: false,
    isFetchingNextPage: false,
    refetch: jest.fn(),
    isRefetching: false,
    ...overrides,
  } as unknown as ReturnType<typeof useSearchRepositories>);
}

// ── tests ─────────────────────────────────────────────────────────────────────

beforeEach(() => {
  jest.clearAllMocks();
  idleHook();
});

describe('SearchScreen', () => {
  it('renders the search input', () => {
    renderWithTheme(<SearchScreen />);
    expect(screen.getByTestId('search-input')).toBeTruthy();
  });

  it('shows the empty prompt when no query is typed', () => {
    renderWithTheme(<SearchScreen />);
    expect(screen.getByTestId('empty-prompt')).toBeTruthy();
  });

  it('shows skeletons during initial loading', async () => {
    idleHook({ isLoading: true, data: undefined });

    renderWithTheme(<SearchScreen />);

    // Simulate typing to set a debouncedQuery — but since debounce is 500ms
    // and loading=true, after the debounce fires the skeletons should appear.
    // We advance by triggering the hook directly via the isLoading flag.
    // The skeleton should be visible once query is set + isLoading = true.
    fireEvent.changeText(screen.getByTestId('search-input'), 'react');

    await waitFor(() => {
      expect(screen.getAllByTestId(/repo-card-skeleton/).length).toBeGreaterThan(0);
    });
  });

  it('renders repository list when data is available', async () => {
    const repos = [makeRepo({ id: 1 }), makeRepo({ id: 2, name: 'redux' })];
    idleHook({
      data: {
        pages: [{ total_count: 2, incomplete_results: false, items: repos }],
        pageParams: [1],
      },
    });

    renderWithTheme(<SearchScreen />);
    fireEvent.changeText(screen.getByTestId('search-input'), 'react');

    await waitFor(() => {
      expect(screen.getByTestId('repos-list')).toBeTruthy();
    });
  });

  it('shows empty-results message when query returns no items', async () => {
    idleHook({
      data: { pages: [{ total_count: 0, incomplete_results: false, items: [] }], pageParams: [1] },
    });

    renderWithTheme(<SearchScreen />);
    fireEvent.changeText(screen.getByTestId('search-input'), 'xyznothing123');

    await waitFor(() => {
      expect(screen.getByTestId('empty-results')).toBeTruthy();
    });
  });

  it('shows rate-limit error with token hint', async () => {
    const rateLimitErr = new ApiError(403, 'rate limit exceeded', true);
    idleHook({ isError: true, error: rateLimitErr });

    renderWithTheme(<SearchScreen />);
    fireEvent.changeText(screen.getByTestId('search-input'), 'react');

    await waitFor(() => {
      expect(screen.getByTestId('rate-limit-error')).toBeTruthy();
      expect(screen.getByText(/EXPO_PUBLIC_GITHUB_TOKEN/)).toBeTruthy();
    });
  });

  it('shows generic error with retry button', async () => {
    const genericErr = new Error('Network Error');
    idleHook({ isError: true, error: genericErr });

    renderWithTheme(<SearchScreen />);
    fireEvent.changeText(screen.getByTestId('search-input'), 'react');

    await waitFor(() => {
      expect(screen.getByTestId('generic-error')).toBeTruthy();
      expect(screen.getByText('Try again')).toBeTruthy();
    });
  });

  it('calls refetch when retry button is pressed', async () => {
    const refetch = jest.fn();
    idleHook({ isError: true, error: new Error('fail'), refetch });

    renderWithTheme(<SearchScreen />);
    fireEvent.changeText(screen.getByTestId('search-input'), 'react');

    await waitFor(() => screen.getByText('Try again'));
    fireEvent.press(screen.getByText('Try again'));
    expect(refetch).toHaveBeenCalledTimes(1);
  });
});
