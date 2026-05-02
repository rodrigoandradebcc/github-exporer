import { fireEvent, screen } from '@testing-library/react-native';
import React from 'react';

import { renderWithTheme } from '@/design-system/__test-utils__/renderWithTheme';
import { useRepository } from '@/features/repositories/hooks/useRepository';
import { ApiError } from '@/services/api/client';
import type { RepositoryDetail } from '@/services/api/types';

import { RepositoryDetailScreen } from '../RepositoryDetailScreen';

// ── mocks ─────────────────────────────────────────────────────────────────────

const mockPush = jest.fn();

jest.mock('expo-router', () => ({
  useLocalSearchParams: () => ({ owner: 'facebook', repo: 'react' }),
  useRouter: () => ({ push: mockPush }),
  Stack: { Screen: () => null },
}));

jest.mock('@/features/repositories/hooks/useRepository');
const mockHook = useRepository as jest.MockedFunction<typeof useRepository>;

// ── helpers ───────────────────────────────────────────────────────────────────

const makeDetail = (overrides: Partial<RepositoryDetail> = {}): RepositoryDetail => ({
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
  watchers_count: 200000,
  subscribers_count: 10000,
  network_count: 40000,
  size: 1000,
  default_branch: 'main',
  license: null,
  pushed_at: '2024-01-01T00:00:00Z',
  ...overrides,
});

function withData(overrides: Partial<ReturnType<typeof useRepository>> = {}) {
  mockHook.mockReturnValue({
    data: undefined,
    isLoading: false,
    isError: false,
    error: null,
    refetch: jest.fn(),
    ...overrides,
  } as unknown as ReturnType<typeof useRepository>);
}

// ── tests ─────────────────────────────────────────────────────────────────────

beforeEach(() => {
  jest.clearAllMocks();
  withData();
});

describe('RepositoryDetailScreen', () => {
  it('does not render content cards while loading', () => {
    withData({ isLoading: true });
    renderWithTheme(<RepositoryDetailScreen />);
    expect(screen.queryByTestId('repo-detail-header')).toBeNull();
    expect(screen.queryByTestId('repo-detail-stats')).toBeNull();
  });

  it('shows generic error with retry button', () => {
    withData({ isError: true, error: new Error('Network error') });
    renderWithTheme(<RepositoryDetailScreen />);
    expect(screen.getByTestId('detail-error')).toBeTruthy();
    expect(screen.getByTestId('detail-retry-button')).toBeTruthy();
  });

  it('calls refetch when retry button is pressed', () => {
    const refetch = jest.fn();
    withData({ isError: true, error: new Error('fail'), refetch });
    renderWithTheme(<RepositoryDetailScreen />);
    fireEvent.press(screen.getByTestId('detail-retry-button'));
    expect(refetch).toHaveBeenCalledTimes(1);
  });

  it('shows rate-limit error with token hint', () => {
    withData({ isError: true, error: new ApiError(403, 'rate limit', true) });
    renderWithTheme(<RepositoryDetailScreen />);
    expect(screen.getByTestId('detail-error')).toBeTruthy();
    expect(screen.getByText(/EXPO_PUBLIC_GITHUB_TOKEN/)).toBeTruthy();
    expect(screen.queryByTestId('detail-retry-button')).toBeNull();
  });

  it('renders repository header and stats when data loads', () => {
    withData({ data: makeDetail() });
    renderWithTheme(<RepositoryDetailScreen />);
    expect(screen.getByTestId('repo-detail-header')).toBeTruthy();
    expect(screen.getByTestId('repo-detail-stats')).toBeTruthy();
    expect(screen.getByText('react')).toBeTruthy();
    expect(screen.getByText('facebook')).toBeTruthy();
    expect(screen.getByText('A declarative UI library')).toBeTruthy();
  });

  it('omits description when null', () => {
    withData({ data: makeDetail({ description: null }) });
    renderWithTheme(<RepositoryDetailScreen />);
    expect(screen.queryByText('A declarative UI library')).toBeNull();
  });

  it('navigates to issues when "Ver Issues" is pressed', () => {
    withData({ data: makeDetail() });
    renderWithTheme(<RepositoryDetailScreen />);
    fireEvent.press(screen.getByTestId('view-issues-button'));
    expect(mockPush).toHaveBeenCalledWith('/repository/facebook/react/issues');
  });
});
