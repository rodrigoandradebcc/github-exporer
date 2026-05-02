import { screen } from '@testing-library/react-native';
import React from 'react';

import { renderWithTheme } from '@/design-system/__test-utils__/renderWithTheme';
import { useRepositoryIssues } from '@/features/issues/hooks/useRepositoryIssues';
import { ApiError } from '@/services/api/client';
import type { Issue } from '@/services/api/types';

import { IssuesScreen } from '../IssuesScreen';

// ── mocks ─────────────────────────────────────────────────────────────────────

jest.mock('expo-router', () => ({
  useLocalSearchParams: () => ({ owner: 'facebook', repo: 'react' }),
  Stack: { Screen: () => null },
}));

jest.mock('@/features/issues/hooks/useRepositoryIssues');
const mockHook = useRepositoryIssues as jest.MockedFunction<typeof useRepositoryIssues>;

// ── helpers ───────────────────────────────────────────────────────────────────

const makeIssue = (overrides: Partial<Issue> = {}): Issue => ({
  id: 1,
  number: 1,
  title: 'Fix memory leak in useEffect',
  body: null,
  state: 'open',
  user: {
    id: 1,
    login: 'torvalds',
    avatar_url: 'https://example.com/avatar.png',
    html_url: 'https://github.com/torvalds',
    type: 'User',
  },
  labels: [],
  comments: 0,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  closed_at: null,
  html_url: 'https://github.com/facebook/react/issues/1',
  ...overrides,
});

function withData(overrides: Partial<ReturnType<typeof useRepositoryIssues>> = {}) {
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
  } as unknown as ReturnType<typeof useRepositoryIssues>);
}

// ── tests ─────────────────────────────────────────────────────────────────────

beforeEach(() => {
  jest.clearAllMocks();
  withData();
});

describe('IssuesScreen', () => {
  it('shows skeleton while loading', () => {
    withData({ isLoading: true });
    renderWithTheme(<IssuesScreen />);
    expect(screen.getByTestId('issues-skeleton')).toBeTruthy();
  });

  it('shows generic error with retry button', () => {
    withData({ isError: true, error: new Error('Network error') });
    renderWithTheme(<IssuesScreen />);
    expect(screen.getByTestId('issues-error')).toBeTruthy();
    expect(screen.getByTestId('issues-retry-button')).toBeTruthy();
  });

  it('shows rate-limit error with token hint', () => {
    withData({ isError: true, error: new ApiError(403, 'rate limit exceeded', true) });
    renderWithTheme(<IssuesScreen />);
    expect(screen.getByTestId('issues-error')).toBeTruthy();
    expect(screen.getByText(/EXPO_PUBLIC_GITHUB_TOKEN/)).toBeTruthy();
    expect(screen.queryByTestId('issues-retry-button')).toBeNull();
  });

  it('shows empty state when there are no open issues', () => {
    withData({ data: { pages: [[]], pageParams: [1] } });
    renderWithTheme(<IssuesScreen />);
    expect(screen.getByTestId('issues-empty')).toBeTruthy();
  });

  it('shows empty state when all items are pull requests', () => {
    const pr = makeIssue({ id: 1, pull_request: { url: 'https://github.com/facebook/react/pull/1' } });
    withData({ data: { pages: [[pr]], pageParams: [1] } });
    renderWithTheme(<IssuesScreen />);
    expect(screen.getByTestId('issues-empty')).toBeTruthy();
  });

  it('renders issues list when data is available', () => {
    const issues = [
      makeIssue({ id: 1, title: 'Fix memory leak in useEffect' }),
      makeIssue({ id: 2, title: 'Add TypeScript support' }),
    ];
    withData({ data: { pages: [issues], pageParams: [1] } });
    renderWithTheme(<IssuesScreen />);
    expect(screen.getByTestId('issues-list')).toBeTruthy();
    expect(screen.getByText('Fix memory leak in useEffect')).toBeTruthy();
    expect(screen.getByText('Add TypeScript support')).toBeTruthy();
  });

  it('filters out pull requests from the issues list', () => {
    const pr = makeIssue({ id: 1, title: 'PR: Add new feature', pull_request: { url: 'https://...' } });
    const issue = makeIssue({ id: 2, title: 'Real issue' });
    withData({ data: { pages: [[pr, issue]], pageParams: [1] } });
    renderWithTheme(<IssuesScreen />);
    expect(screen.getByText('Real issue')).toBeTruthy();
    expect(screen.queryByText('PR: Add new feature')).toBeNull();
  });

  it('renders issue labels as badges', () => {
    const issues = [
      makeIssue({
        id: 1,
        labels: [
          { id: 10, name: 'bug', color: 'd73a4a', description: null },
          { id: 11, name: 'good first issue', color: '7057ff', description: null },
        ],
      }),
    ];
    withData({ data: { pages: [issues], pageParams: [1] } });
    renderWithTheme(<IssuesScreen />);
    expect(screen.getByText('bug')).toBeTruthy();
    expect(screen.getByText('good first issue')).toBeTruthy();
  });
});
