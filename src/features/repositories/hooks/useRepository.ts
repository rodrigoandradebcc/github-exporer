import { useQuery } from '@tanstack/react-query';

import { getRepository } from '@/services/api/github';
import { queryKeys } from '@/services/queryKeys';

export function useRepository(owner: string, repo: string) {
  return useQuery({
    queryKey: queryKeys.repositories.detail(owner, repo),
    queryFn: () => getRepository({ owner, repo }),
    enabled: owner.length > 0 && repo.length > 0,
    staleTime: 60 * 1000,
  });
}
