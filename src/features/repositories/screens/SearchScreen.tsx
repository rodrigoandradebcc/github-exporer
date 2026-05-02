import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Box, GlassView, Heading, Input, useTheme } from '@/design-system';
import { useSearchRepositories } from '@/features/repositories/hooks/useSearchRepositories';
import { useDebounce } from '@/hooks/useDebounce';
import { ApiError } from '@/services/api/client';
import type { Repository } from '@/services/api/types';

import { SearchBottomTabBar } from '../components/SearchBottomTabBar';
import { SearchContent } from '../components/SearchContent';

export function SearchScreen() {
  const router = useRouter();
  const { colors } = useTheme();
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

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Stack.Screen options={{ headerShown: false }} />

      <SearchContent
        repos={repos}
        query={debouncedQuery}
        hasQuery={hasQuery}
        isLoading={isLoading}
        isError={isError}
        isRateLimit={isRateLimit}
        isFetchingNextPage={isFetchingNextPage}
        isRefetching={isRefetching}
        headerHeight={headerHeight}
        tabBarHeight={tabBarHeight}
        onSelectTopic={setInputValue}
        onRetry={refetch}
        onRefresh={refetch}
        onEndReached={handleEndReached}
        onRepoPress={handleRepoPress}
      />

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
