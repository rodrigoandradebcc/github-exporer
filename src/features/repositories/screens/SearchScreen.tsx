import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, Platform, Pressable, Text as RNText, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Badge, Box, Button, Heading, Input, Text, useTheme } from '@/design-system';
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

const SUGGESTED_TOPICS = ['react-native', 'typescript', 'expo', 'next.js', 'tailwindcss', 'python'];

function EmptyPrompt({ onSelectTopic }: { onSelectTopic: (topic: string) => void }) {
  const { colors } = useTheme();
  return (
    <Box flex={1} testID="empty-prompt">
      {/* Centered icon + text */}
      <Box flex={1} align="center" justify="center" padding="xl">
        <Ionicons name="search-outline" size={52} color={colors.border} />
        <Box paddingTop="md">
          <Text tone="muted" size="lg" weight="medium">
            Buscar repositórios
          </Text>
        </Box>
        <Box paddingTop="xs">
          <Text tone="muted" size="sm">
            Digite um nome ou tópico para começar
          </Text>
        </Box>
      </Box>

      {/* Suggestions section at the bottom */}
      <Box paddingHorizontal="xl" paddingBottom="xl">
        <Text variant="label" size="xs" tone="muted">
          SUGESTÕES
        </Text>
        <Box paddingTop="sm">
          <Box direction="row" wrap gap="sm">
            {SUGGESTED_TOPICS.map((topic) => (
              <Pressable key={topic} onPress={() => onSelectTopic(topic)}>
                <Badge tone="info" size="sm">
                  {topic}
                </Badge>
              </Pressable>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

function EmptyResults({ query }: { query: string }) {
  const { colors } = useTheme();
  return (
    <Box flex={1} align="center" justify="center" padding="xl" testID="empty-results">
      <Ionicons name="albums-outline" size={48} color={colors.border} />
      <Box paddingTop="md">
        <Text tone="muted" weight="medium">
          {`Nenhum resultado para "${query}"`}
        </Text>
      </Box>
      <Box paddingTop="xs">
        <Text tone="muted" size="sm">
          Tente outros termos de busca
        </Text>
      </Box>
    </Box>
  );
}

function RateLimitError() {
  const { colors } = useTheme();
  return (
    <Box flex={1} align="center" justify="center" padding="xl" testID="rate-limit-error">
      <Ionicons name="warning-outline" size={48} color={colors.warning} />
      <Box paddingTop="md">
        <Text weight="bold" tone="danger">
          Limite da API do GitHub atingido
        </Text>
      </Box>
      <Box paddingTop="sm">
        <Text tone="muted" size="sm">
          Limite de requisições sem autenticação atingido. Adicione EXPO_PUBLIC_GITHUB_TOKEN no .env
          para aumentar o limite para 5.000 requisições/hora.
        </Text>
      </Box>
    </Box>
  );
}

function GenericError({ onRetry }: { onRetry: () => void }) {
  const { colors } = useTheme();
  return (
    <Box flex={1} align="center" justify="center" padding="xl" testID="generic-error">
      <Ionicons name="cloud-offline-outline" size={48} color={colors.muted} />
      <Box paddingTop="md">
        <Text tone="danger" weight="bold">
          Algo deu errado
        </Text>
      </Box>
      <Box paddingTop="sm">
        <Text tone="muted" size="sm">
          Não foi possível acessar o GitHub. Verifique sua conexão e tente novamente.
        </Text>
      </Box>
      <Box paddingTop="md">
        <Button variant="outline" onPress={onRetry}>
          Tentar novamente
        </Button>
      </Box>
    </Box>
  );
}

export function SearchScreen() {
  const router = useRouter();
  const { spacing, colors } = useTheme();
  const insets = useSafeAreaInsets();
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
    if (!hasQuery) return <EmptyPrompt onSelectTopic={setInputValue} />;
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
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Status bar safe area */}
      <View style={{ height: insets.top }} />

      {/* App title */}
      <Box paddingHorizontal="md" paddingTop="sm" paddingBottom="xs">
        <Heading level={2}>GitHub Explorer</Heading>
      </Box>

      {/* Search input */}
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

      {/* Content area */}
      <View style={{ flex: 1 }}>{renderContent()}</View>

      {/* Bottom tab bar */}
      <View
        style={{
          flexDirection: 'row',
          borderTopWidth: 1,
          borderTopColor: colors.border,
          backgroundColor: colors.surface,
          paddingTop: spacing.xs,
          paddingBottom: Math.max(insets.bottom, spacing.sm),
        }}
      >
        {(
          [
            { key: 'busca', label: 'Busca', icon: 'search-outline', iconActive: 'search', active: true, onPress: undefined },
            {
              key: 'ds',
              label: 'Design',
              icon: 'color-palette-outline',
              iconActive: 'color-palette',
              active: false,
              onPress: () => router.push('/showcase'),
            },
          ] as const
        ).map((tab) => (
          <Pressable
            key={tab.key}
            onPress={tab.onPress}
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 3, paddingVertical: spacing.xs }}
          >
            <Ionicons
              name={tab.active ? tab.iconActive : tab.icon}
              size={24}
              color={tab.active ? colors.primary : colors.muted}
            />
            <RNText
              style={{
                fontSize: 11,
                color: tab.active ? colors.primary : colors.muted,
                fontWeight: tab.active ? '600' : '400',
              }}
            >
              {tab.label}
            </RNText>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
