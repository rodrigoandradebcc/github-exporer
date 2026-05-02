import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';

import { useTheme } from '@/design-system';
import { useRepository } from '@/features/repositories/hooks/useRepository';
import { ApiError } from '@/services/api/client';

import { RepositoryDetailContent } from '../components/RepositoryDetailContent';
import { RepositoryDetailError } from '../components/RepositoryDetailError';
import { RepositoryDetailSkeleton } from '../components/RepositoryDetailSkeleton';

export function RepositoryDetailScreen() {
  const { owner, repo } = useLocalSearchParams<{ owner: string; repo: string }>();
  const router = useRouter();
  const { colors } = useTheme();
  const { data, isLoading, isError, error, refetch } = useRepository(owner, repo);

  const isRateLimit = error instanceof ApiError && error.isRateLimit;

  if (isLoading) {
    return (
      <>
        <Stack.Screen
          options={{
            title: repo,
            headerStyle: { backgroundColor: colors.background },
            headerTintColor: colors.text,
            headerBackTitle: '',
          }}
        />
        <RepositoryDetailSkeleton />
      </>
    );
  }

  if (isError) {
    return (
      <>
        <Stack.Screen
          options={{
            title: repo,
            headerStyle: { backgroundColor: colors.background },
            headerTintColor: colors.text,
            headerBackTitle: '',
          }}
        />
        <RepositoryDetailError isRateLimit={isRateLimit} onRetry={refetch} />
      </>
    );
  }

  if (data === undefined) return null;

  return (
    <>
      <Stack.Screen
        options={{
          title: `${data.owner.login}/${data.name}`,
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          headerBackTitle: '',
        }}
      />
      <RepositoryDetailContent
        repository={data}
        onViewIssues={() => router.push(`/repository/${owner}/${repo}/issues`)}
      />
    </>
  );
}
