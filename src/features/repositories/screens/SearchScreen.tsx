import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, Platform, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Box, GlassView, Heading, Input, useTheme } from '@/design-system';
import { GithubApiErrorState } from '@/features/github/components/GithubApiErrorState';
import { useSearchRepositories } from '@/features/repositories/hooks/useSearchRepositories';
import { useDebounce } from '@/hooks/useDebounce';
import { ApiError } from '@/services/api/client';
import type { Repository } from '@/services/api/types';

import { SearchBottomTabBar } from '../components/SearchBottomTabBar';
import { SearchEmptyPrompt } from '../components/SearchEmptyPrompt';
import { SearchEmptyResults } from '../components/SearchEmptyResults';
import { RepositoryCard } from '../components/RepositoryCard';
import { SearchSkeletonList } from '../components/SearchSkeletonList';

export function SearchScreen() {
  const router = useRouter();
  const { spacing, colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [inputValue, setInputValue] = useState('');
  const debouncedQuery = useDebounce(inputValue, 500);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [tabBarHeight, setTabBarHeight] = useState(0);

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
    ({ item, index }: { item: Repository; index: number }) => (
      <Box paddingHorizontal="md" paddingBottom="sm">
        <RepositoryCard
          repo={item}
          onPress={() => handleRepoPress(item)}
          testID={`repo-card-${item.id}`}
          index={index}
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
    const insetStyle = { flex: 1, paddingTop: headerHeight, paddingBottom: tabBarHeight };

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
            onRetry={refetch}
          />
        </View>
      );
    }
    if (!hasQuery) {
      return (
        <View style={insetStyle}>
          <SearchEmptyPrompt onSelectTopic={setInputValue} />
        </View>
      );
    }
    if (repos.length === 0) {
      return (
        <View style={insetStyle}>
          <SearchEmptyResults query={debouncedQuery} />
        </View>
      );
    }

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
        contentContainerStyle={{
          paddingTop: headerHeight,
          paddingBottom: tabBarHeight + spacing.xl,
        }}
        scrollIndicatorInsets={{ top: headerHeight, bottom: tabBarHeight }}
        keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
        testID="repos-list"
      />
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Stack.Screen options={{ headerShown: false }} />

      {renderContent()}

      <GlassView
        style={[styles.header, { paddingTop: insets.top }]}
        onLayout={(e) => setHeaderHeight(e.nativeEvent.layout.height)}
      >
        <Box paddingHorizontal="md" paddingTop="sm" paddingBottom="xs">
          <Heading level={2}>GitHub Explorer</Heading>
        </Box>
        <Box paddingHorizontal="md" paddingBottom="xs">
          <Input
            placeholder="Buscar repositórios no GitHub…"
            value={inputValue}
            onChangeText={setInputValue}
            autoCapitalize="none"
            keyboardType="web-search"
            returnKeyType="search"
            leftIcon={<Ionicons name="search-outline" size={18} color={colors.muted} />}
            testID="search-input"
          />
        </Box>
      </GlassView>

      <SearchBottomTabBar
        bottomInset={insets.bottom}
        onDesignPress={() => router.push('/showcase')}
        onLayout={(e) => setTabBarHeight(e.nativeEvent.layout.height)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(120,120,128,0.20)',
  },
});
