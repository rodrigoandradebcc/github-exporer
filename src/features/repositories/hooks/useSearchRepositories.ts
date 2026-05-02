import { useInfiniteQuery } from '@tanstack/react-query';

import { PER_PAGE, searchRepositories } from '@/services/api/github';
import { queryKeys } from '@/services/queryKeys';

const FIVE_MINUTES_MS = 5 * 60 * 1000;

export function useSearchRepositories(query: string) {
  return useInfiniteQuery({
    queryKey: queryKeys.repositories.search(query),
    queryFn: ({ pageParam }) => searchRepositories({ query, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const loadedCount = allPages.length * PER_PAGE;
      if (loadedCount >= lastPage.total_count) return undefined;
      return allPages.length + 1;
    },
    enabled: query.trim().length > 0,
    staleTime: FIVE_MINUTES_MS,
  });
}
