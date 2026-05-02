export interface Owner {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  type: 'User' | 'Organization';
}

export interface Repository {
  id: number;
  name: string;
  full_name: string;
  owner: Owner;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  topics: string[];
  updated_at: string;
  created_at: string;
  private: boolean;
}

export interface RepositoryDetail extends Repository {
  watchers_count: number;
  subscribers_count: number;
  network_count: number;
  size: number;
  default_branch: string;
  license: { key: string; name: string; spdx_id: string } | null;
  pushed_at: string;
}

export interface IssueLabel {
  id: number;
  name: string;
  color: string;
  description: string | null;
}

export interface Issue {
  id: number;
  number: number;
  title: string;
  body: string | null;
  state: 'open' | 'closed';
  user: Owner;
  labels: IssueLabel[];
  comments: number;
  created_at: string;
  updated_at: string;
  closed_at: string | null;
  html_url: string;
  pull_request?: { url: string };
}

export interface SearchRepositoriesResponse {
  total_count: number;
  incomplete_results: boolean;
  items: Repository[];
}
