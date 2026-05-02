import { useInfiniteQuery } from '@tanstack/react-query';

import { PER_PAGE, getRepositoryIssues } from '@/services/api/github';
import { queryKeys } from '@/services/queryKeys';

export function useRepositoryIssues(owner: string, repo: string) {
  return useInfiniteQuery({
    queryKey: queryKeys.repositories.issues(owner, repo),
    queryFn: ({ pageParam }) => getRepositoryIssues({ owner, repo, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < PER_PAGE) return undefined;
      return allPages.length + 1;
    },
    enabled: owner.length > 0 && repo.length > 0,
    staleTime: 5 * 60 * 1000,
  });
}
