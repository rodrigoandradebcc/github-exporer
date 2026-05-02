import React, { useCallback } from 'react';
import { ActivityIndicator, FlatList, Platform, View } from 'react-native';

import { Box, useTheme } from '@/design-system';
import { GithubApiErrorState } from '@/features/github/components/GithubApiErrorState';
import type { Repository } from '@/services/api/types';

import { RepositoryCard } from './RepositoryCard';
import { SearchEmptyPrompt } from './SearchEmptyPrompt';
import { SearchEmptyResults } from './SearchEmptyResults';
import { SearchSkeletonList } from './SearchSkeletonList';

interface SearchContentProps {
  repos: Repository[];
  query: string;
  hasQuery: boolean;
  isLoading: boolean;
  isError: boolean;
  isRateLimit: boolean;
  isFetchingNextPage: boolean;
  isRefetching: boolean;
  headerHeight: number;
  tabBarHeight: number;
  onSelectTopic: (topic: string) => void;
  onRetry: () => void;
  onRefresh: () => void;
  onEndReached: () => void;
  onRepoPress: (repo: Repository) => void;
}

export function SearchContent({
  repos,
  query,
  hasQuery,
  isLoading,
  isError,
  isRateLimit,
  isFetchingNextPage,
  isRefetching,
  headerHeight,
  tabBarHeight,
  onSelectTopic,
  onRetry,
  onRefresh,
  onEndReached,
  onRepoPress,
}: SearchContentProps) {
  const { colors, spacing } = useTheme();
  const insetStyle = { flex: 1, paddingTop: headerHeight, paddingBottom: tabBarHeight };

  const renderItem = useCallback(
    ({ item, index }: { item: Repository; index: number }) => (
      <Box paddingHorizontal="md" paddingBottom="sm">
        <RepositoryCard
          repo={item}
          onPress={() => onRepoPress(item)}
          testID={`repo-card-${item.id}`}
          index={index}
        />
      </Box>
    ),
    [onRepoPress],
  );

  const listFooter = isFetchingNextPage ? (
    <Box paddingVertical="md" align="center">
      <ActivityIndicator color={colors.primary} />
    </Box>
  ) : null;

  if (isLoading && hasQuery) {
    return (
      <View style={insetStyle}>
        <SearchSkeletonList />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={insetStyle}>
        <GithubApiErrorState
          isRateLimit={isRateLimit}
          genericMessage="Não foi possível acessar o GitHub. Verifique sua conexão e tente novamente."
          testID={isRateLimit ? 'rate-limit-error' : 'generic-error'}
          onRetry={onRetry}
        />
      </View>
    );
  }

  if (!hasQuery) {
    return (
      <View style={insetStyle}>
        <SearchEmptyPrompt onSelectTopic={onSelectTopic} />
      </View>
    );
  }

  if (repos.length === 0) {
    return (
      <View style={insetStyle}>
        <SearchEmptyResults query={query} />
      </View>
    );
  }

  return (
    <FlatList
      data={repos}
      keyExtractor={(item) => String(item.id)}
      renderItem={renderItem}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
      onRefresh={onRefresh}
      refreshing={isRefetching}
      ListHeaderComponent={<Box paddingTop="sm" />}
      ListFooterComponent={listFooter}
      contentContainerStyle={{
        paddingTop: headerHeight,
        paddingBottom: tabBarHeight + spacing.xl,
      }}
      scrollIndicatorInsets={{ top: headerHeight, bottom: tabBarHeight }}
      keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
      testID="repos-list"
    />
  );
}
