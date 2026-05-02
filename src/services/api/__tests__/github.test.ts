import { apiClient } from '../client';
import { getRepository, getRepositoryIssues, searchRepositories } from '../github';
import type { Issue, RepositoryDetail, SearchRepositoriesResponse } from '../types';

jest.mock('../client', () => ({
  apiClient: { get: jest.fn() },
  ApiError: class ApiError extends Error {
    status: number;
    isRateLimit: boolean;
    constructor(status: number, message: string, isRateLimit = false) {
      super(message);
      this.name = 'ApiError';
      this.status = status;
      this.isRateLimit = isRateLimit;
    }
  },
}));

const mockGet = apiClient.get as jest.Mock;

const mockRepository: RepositoryDetail = {
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
  topics: ['javascript', 'react'],
  updated_at: '2024-01-01T00:00:00Z',
  created_at: '2013-05-24T00:00:00Z',
  pushed_at: '2024-01-01T00:00:00Z',
  private: false,
  watchers_count: 200000,
  subscribers_count: 7000,
  network_count: 40000,
  size: 150000,
  default_branch: 'main',
  license: { key: 'mit', name: 'MIT License', spdx_id: 'MIT' },
};

const mockSearchResponse: SearchRepositoriesResponse = {
  total_count: 1,
  incomplete_results: false,
  items: [mockRepository],
};

const mockIssue: Issue = {
  id: 42,
  number: 42,
  title: 'Bug: something is broken',
  body: 'Description of the bug',
  state: 'open',
  user: mockRepository.owner,
  labels: [{ id: 1, name: 'bug', color: 'ee0701', description: null }],
  comments: 3,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-02T00:00:00Z',
  closed_at: null,
  html_url: 'https://github.com/facebook/react/issues/42',
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('searchRepositories', () => {
  it('calls /search/repositories with correct params', async () => {
    mockGet.mockResolvedValueOnce({ data: mockSearchResponse });

    const result = await searchRepositories({ query: 'react', page: 2 });

    expect(mockGet).toHaveBeenCalledWith('/search/repositories', {
      params: { q: 'react', page: 2, per_page: 30 },
    });
    expect(result).toEqual(mockSearchResponse);
  });

  it('defaults to page 1', async () => {
    mockGet.mockResolvedValueOnce({ data: mockSearchResponse });

    await searchRepositories({ query: 'expo' });

    expect(mockGet).toHaveBeenCalledWith('/search/repositories', {
      params: { q: 'expo', page: 1, per_page: 30 },
    });
  });

  it('propagates errors', async () => {
    mockGet.mockRejectedValueOnce(new Error('Network error'));
    await expect(searchRepositories({ query: 'react' })).rejects.toThrow('Network error');
  });
});

describe('getRepository', () => {
  it('calls /repos/{owner}/{repo}', async () => {
    mockGet.mockResolvedValueOnce({ data: mockRepository });

    const result = await getRepository({ owner: 'facebook', repo: 'react' });

    expect(mockGet).toHaveBeenCalledWith('/repos/facebook/react');
    expect(result).toEqual(mockRepository);
  });

  it('propagates errors', async () => {
    mockGet.mockRejectedValueOnce(new Error('Not found'));
    await expect(getRepository({ owner: 'x', repo: 'y' })).rejects.toThrow('Not found');
  });
});

describe('getRepositoryIssues', () => {
  it('calls /repos/{owner}/{repo}/issues with state=open', async () => {
    mockGet.mockResolvedValueOnce({ data: [mockIssue] });

    const result = await getRepositoryIssues({ owner: 'facebook', repo: 'react' });

    expect(mockGet).toHaveBeenCalledWith('/repos/facebook/react/issues', {
      params: { state: 'open', page: 1, per_page: 30 },
    });
    expect(result).toEqual([mockIssue]);
  });

  it('uses the provided page param', async () => {
    mockGet.mockResolvedValueOnce({ data: [] });

    await getRepositoryIssues({ owner: 'facebook', repo: 'react', page: 3 });

    expect(mockGet).toHaveBeenCalledWith('/repos/facebook/react/issues', {
      params: { state: 'open', page: 3, per_page: 30 },
    });
  });

  it('propagates errors', async () => {
    mockGet.mockRejectedValueOnce(new Error('Rate limited'));
    await expect(getRepositoryIssues({ owner: 'facebook', repo: 'react' })).rejects.toThrow(
      'Rate limited',
    );
  });
});
