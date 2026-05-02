import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useMemo } from 'react';
import { ActivityIndicator, FlatList, Platform, View } from 'react-native';

import { Box, Input, useTheme } from '@/design-system';
import { GithubApiErrorState } from '@/features/github/components/GithubApiErrorState';
import type { Repository } from '@/services/api/types';

import { RepositoryCard } from './RepositoryCard';
import { SearchEmptyPrompt } from './SearchEmptyPrompt';
import { SearchEmptyResults } from './SearchEmptyResults';
import { SearchSkeletonList } from './SearchSkeletonList';

interface SearchResult {
  repos: Repository[];
  query: string;
  hasQuery: boolean;
  isLoading: boolean;
  isError: boolean;
  isRateLimit: boolean;
  isFetchingNextPage: boolean;
  isRefetching: boolean;
}

interface SearchContentProps {
  searchResult: SearchResult;
  layout: { headerHeight: number; tabBarHeight: number };
  inputValue: string;
  onChangeText: (text: string) => void;
  onSelectTopic: (topic: string) => void;
  onRetry: () => void;
  onRefresh: () => void;
  onEndReached: () => void;
  onRepoPress: (repo: Repository) => void;
}

export function SearchContent({
  searchResult: {
    repos,
    query,
    hasQuery,
    isLoading,
    isError,
    isRateLimit,
    isFetchingNextPage,
    isRefetching,
  },
  layout: { headerHeight, tabBarHeight },
  inputValue,
  onChangeText,
  onSelectTopic,
  onRetry,
  onRefresh,
  onEndReached,
  onRepoPress,
}: SearchContentProps) {
  const { colors, spacing } = useTheme();

  const searchInput = (
    <Box paddingHorizontal="md" paddingTop="sm" paddingBottom="xs">
      <Input
        placeholder="Buscar repositórios no GitHub…"
        value={inputValue}
        onChangeText={onChangeText}
        autoCapitalize="none"
        keyboardType="web-search"
        returnKeyType="search"
        leftIcon={<Ionicons name="search-outline" size={18} color={colors.muted} />}
        testID="search-input"
      />
    </Box>
  );
  const insetStyle = useMemo(
    () => ({ flex: 1, paddingTop: headerHeight, paddingBottom: tabBarHeight }),
    [headerHeight, tabBarHeight],
  );

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

  const listFooter = useMemo(
    () =>
      isFetchingNextPage ? (
        <Box paddingVertical="md" align="center">
          <ActivityIndicator color={colors.primary} />
        </Box>
      ) : null,
    [isFetchingNextPage, colors.primary],
  );

  if (isLoading && hasQuery) {
    return (
      <View style={insetStyle}>
        {searchInput}
        <SearchSkeletonList />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={insetStyle}>
        {searchInput}
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
        {searchInput}
        <SearchEmptyPrompt onSelectTopic={onSelectTopic} />
      </View>
    );
  }

  if (repos.length === 0) {
    return (
      <View style={insetStyle}>
        {searchInput}
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
      ListHeaderComponent={searchInput}
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
