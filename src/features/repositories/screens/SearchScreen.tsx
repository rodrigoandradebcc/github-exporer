import { Stack, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, Platform } from 'react-native';

import { Box, Button, Input, Text, useTheme } from '@/design-system';
import { useSearchRepositories } from '@/features/repositories/hooks/useSearchRepositories';
import { useDebounce } from '@/hooks/useDebounce';
import { ApiError } from '@/services/api/client';
import type { Repository } from '@/services/api/types';

import { RepositoryCard } from '../components/RepositoryCard';
import { RepositoryCardSkeleton } from '../components/RepositoryCardSkeleton';

const SKELETON_COUNT = 6;
const SKELETON_KEYS = Array.from({ length: SKELETON_COUNT }, (_, i) => String(i));

function SkeletonList() {
  return (
    <Box flex={1} paddingTop="sm" testID="skeleton-list">
      {SKELETON_KEYS.map((key) => (
        <Box key={key} paddingHorizontal="md" paddingBottom="sm">
          <RepositoryCardSkeleton testID={`repo-card-skeleton-${key}`} />
        </Box>
      ))}
    </Box>
  );
}

function EmptyPrompt() {
  return (
    <Box flex={1} align="center" justify="center" padding="xl" testID="empty-prompt">
      <Text tone="muted" size="lg">
        Search GitHub repositories
      </Text>
      <Box paddingTop="xs">
        <Text tone="muted" size="sm">
          Type a repository name or topic to get started
        </Text>
      </Box>
    </Box>
  );
}

function EmptyResults({ query }: { query: string }) {
  return (
    <Box flex={1} align="center" justify="center" padding="xl" testID="empty-results">
      <Text tone="muted">No repositories found for {query}</Text>
    </Box>
  );
}

function RateLimitError() {
  return (
    <Box flex={1} align="center" justify="center" padding="xl" testID="rate-limit-error">
      <Text weight="bold" tone="danger">
        GitHub rate limit reached
      </Text>
      <Box paddingTop="sm">
        <Text tone="muted" size="sm">
          You have exceeded the unauthenticated API limit. Add your EXPO_PUBLIC_GITHUB_TOKEN to .env
          to increase the limit to 5 000 requests/hour.
        </Text>
      </Box>
    </Box>
  );
}

function GenericError({ onRetry }: { onRetry: () => void }) {
  return (
    <Box flex={1} align="center" justify="center" padding="xl" testID="generic-error">
      <Text tone="danger" weight="bold">
        Something went wrong
      </Text>
      <Box paddingTop="sm">
        <Text tone="muted" size="sm">
          Could not reach GitHub. Check your connection and try again.
        </Text>
      </Box>
      <Box paddingTop="md">
        <Button variant="outline" onPress={onRetry}>
          Try again
        </Button>
      </Box>
    </Box>
  );
}

export function SearchScreen() {
  const router = useRouter();
  const { spacing, colors } = useTheme();
  const [inputValue, setInputValue] = useState('');
  const debouncedQuery = useDebounce(inputValue, 500);

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
  } = useSearchRepositories(debouncedQuery);

  const repos: Repository[] = data?.pages.flatMap((page) => page.items) ?? [];
  const hasQuery = debouncedQuery.trim().length > 0;
  const isRateLimit = error instanceof ApiError && error.isRateLimit;

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      void fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleRepoPress = useCallback(
    (repo: Repository) => {
      router.push(`/repository/${repo.owner.login}/${repo.name}`);
    },
    [router],
  );

  const renderItem = useCallback(
    ({ item }: { item: Repository }) => (
      <Box paddingHorizontal="md" paddingBottom="sm">
        <RepositoryCard
          repo={item}
          onPress={() => handleRepoPress(item)}
          testID={`repo-card-${item.id}`}
        />
      </Box>
    ),
    [handleRepoPress],
  );

  const ListFooter = isFetchingNextPage ? (
    <Box paddingVertical="md" align="center">
      <ActivityIndicator color={colors.primary} />
    </Box>
  ) : null;

  const renderContent = () => {
    if (isLoading && hasQuery) return <SkeletonList />;
    if (isError) return isRateLimit ? <RateLimitError /> : <GenericError onRetry={refetch} />;
    if (!hasQuery) return <EmptyPrompt />;
    if (repos.length === 0) return <EmptyResults query={debouncedQuery} />;

    return (
      <FlatList
        data={repos}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        onRefresh={refetch}
        refreshing={isRefetching}
        ListHeaderComponent={<Box paddingTop="sm" />}
        ListFooterComponent={ListFooter}
        contentContainerStyle={{ paddingBottom: spacing.xl }}
        keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
        testID="repos-list"
      />
    );
  };

  return (
    <Box flex={1}>
      <Stack.Screen
        options={{
          title: 'GitHub Explorer',
          headerRight: () => (
            <Box paddingRight="sm">
              <Button variant="ghost" size="sm" onPress={() => router.push('/showcase')}>
                DS
              </Button>
            </Box>
          ),
        }}
      />
      <Box paddingHorizontal="md" paddingTop="sm" paddingBottom="xs">
        <Input
          placeholder="Search GitHub repositories…"
          value={inputValue}
          onChangeText={setInputValue}
          autoCapitalize="none"
          returnKeyType="search"
          testID="search-input"
        />
      </Box>
      {renderContent()}
    </Box>
  );
}
