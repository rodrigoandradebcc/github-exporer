import { Stack, useLocalSearchParams } from 'expo-router';
import React, { useCallback } from 'react';
import { ActivityIndicator, FlatList } from 'react-native';

import { Box, useTheme } from '@/design-system';
import { GithubApiErrorState } from '@/features/github/components/GithubApiErrorState';
import { getGithubStackScreenOptions } from '@/features/github/navigation/getGithubStackScreenOptions';
import { IssueCard } from '@/features/issues/components/IssueCard';
import { IssuesEmptyState } from '@/features/issues/components/IssuesEmptyState';
import { IssuesSkeletonList } from '@/features/issues/components/IssuesSkeletonList';
import { useRepositoryIssues } from '@/features/issues/hooks/useRepositoryIssues';
import { ApiError } from '@/services/api/client';
import type { Issue } from '@/services/api/types';

export function IssuesScreen() {
  const { owner, repo } = useLocalSearchParams<{ owner: string; repo: string }>();
  const { spacing, colors } = useTheme();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useRepositoryIssues(owner, repo);

  const isRateLimit = error instanceof ApiError && error.isRateLimit;
  const issues = data?.pages.flatMap((page) => page).filter((i) => !i.pull_request) ?? [];

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) void fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const renderItem = useCallback(
    ({ item, index }: { item: Issue; index: number }) => (
      <Box paddingHorizontal="md" paddingBottom="sm">
        <IssueCard issue={item} index={index} />
      </Box>
    ),
    [],
  );

  const ListFooter = isFetchingNextPage ? (
    <Box paddingVertical="md" align="center">
      <ActivityIndicator color={colors.primary} />
    </Box>
  ) : null;

  const title = `Issues · ${repo}`;
  const headerOptions = getGithubStackScreenOptions({ title, colors });

  if (isLoading) {
    return (
      <>
        <Stack.Screen options={headerOptions} />
        <IssuesSkeletonList />
      </>
    );
  }

  if (isError) {
    return (
      <>
        <Stack.Screen options={headerOptions} />
        <GithubApiErrorState
          isRateLimit={isRateLimit}
          genericMessage="Não foi possível carregar as issues."
          testID="issues-error"
          retryTestID="issues-retry-button"
          onRetry={refetch}
        />
      </>
    );
  }

  if (issues.length === 0) {
    return (
      <>
        <Stack.Screen options={headerOptions} />
        <IssuesEmptyState />
      </>
    );
  }

  return (
    <>
      <Stack.Screen options={headerOptions} />
      <FlatList
        data={issues}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        onRefresh={refetch}
        refreshing={isRefetching}
        ListHeaderComponent={<Box paddingTop="sm" />}
        ListFooterComponent={ListFooter}
        contentContainerStyle={{ paddingBottom: spacing.xl }}
        contentInsetAdjustmentBehavior="automatic"
        testID="issues-list"
      />
    </>
  );
}
