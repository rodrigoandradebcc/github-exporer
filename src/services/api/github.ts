import { apiClient } from './client';
import type { Issue, RepositoryDetail, SearchRepositoriesResponse } from './types';

const PER_PAGE = 30;

export interface SearchRepositoriesParams {
  query: string;
  page?: number;
}

export async function searchRepositories({
  query,
  page = 1,
}: SearchRepositoriesParams): Promise<SearchRepositoriesResponse> {
  const { data } = await apiClient.get<SearchRepositoriesResponse>('/search/repositories', {
    params: { q: query, page, per_page: PER_PAGE },
  });
  return data;
}

export interface GetRepositoryParams {
  owner: string;
  repo: string;
}

export async function getRepository({
  owner,
  repo,
}: GetRepositoryParams): Promise<RepositoryDetail> {
  const { data } = await apiClient.get<RepositoryDetail>(`/repos/${owner}/${repo}`);
  return data;
}

export interface GetRepositoryIssuesParams {
  owner: string;
  repo: string;
  page?: number;
}

export async function getRepositoryIssues({
  owner,
  repo,
  page = 1,
}: GetRepositoryIssuesParams): Promise<Issue[]> {
  const { data } = await apiClient.get<Issue[]>(`/repos/${owner}/${repo}/issues`, {
    params: { state: 'open', page, per_page: PER_PAGE },
  });
  return data;
}

export { PER_PAGE };
