import { useInfiniteQuery } from '@tanstack/react-query';

import { PER_PAGE, searchRepositories } from '@/services/api/github';

export function useSearchRepositories(query: string) {
  return useInfiniteQuery({
    queryKey: ['repositories', 'search', query] as const,
    queryFn: ({ pageParam }) => searchRepositories({ query, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const loadedCount = allPages.length * PER_PAGE;
      if (loadedCount >= lastPage.total_count) return undefined;
      return allPages.length + 1;
    },
    enabled: query.trim().length > 0,
    staleTime: 5 * 60 * 1000,
  });
}
