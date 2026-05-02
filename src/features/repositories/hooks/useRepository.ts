import { useQuery } from '@tanstack/react-query';

import { getRepository } from '@/services/api/github';

export function useRepository(owner: string, repo: string) {
  return useQuery({
    queryKey: ['repository', owner, repo] as const,
    queryFn: () => getRepository({ owner, repo }),
    enabled: owner.length > 0 && repo.length > 0,
    staleTime: 60 * 1000,
  });
}
