import { Ionicons } from '@expo/vector-icons';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Stack, useLocalSearchParams } from 'expo-router';
import React, { useCallback } from 'react';
import { ActivityIndicator, FlatList } from 'react-native';

import { Avatar, Badge, Box, Button, Card, Skeleton, Text, useTheme } from '@/design-system';
import type { BadgeTone } from '@/design-system';
import { useRepositoryIssues } from '@/features/issues/hooks/useRepositoryIssues';
import { ApiError } from '@/services/api/client';
import type { Issue } from '@/services/api/types';

function labelColorToTone(hex: string): BadgeTone {
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  if (r > 180 && g < 100 && b < 100) return 'danger';
  if (g > 160 && r < 140) return 'success';
  if (r > 180 && g > 120 && b < 80) return 'warning';
  if (b > 160 && r < 140) return 'info';
  return 'default';
}

const SKELETON_COUNT = 5;
const SKELETON_KEYS = Array.from({ length: SKELETON_COUNT }, (_, i) => String(i));

function IssueSkeleton() {
  return (
    <Card>
      <Box direction="column" gap="sm">
        <Skeleton width="90%" height={16} />
        <Skeleton width="70%" height={16} />
        <Box direction="row" gap="xs">
          <Skeleton width={56} height={20} radius="lg" />
          <Skeleton width={56} height={20} radius="lg" />
        </Box>
        <Box direction="row" align="center" gap="xs">
          <Skeleton width={24} height={24} radius="lg" />
          <Skeleton width={80} height={12} />
          <Skeleton width={60} height={12} />
        </Box>
      </Box>
    </Card>
  );
}

function IssueCard({ issue }: { issue: Issue }) {
  const { colors } = useTheme();
  return (
    <Card testID={`issue-card-${issue.id}`}>
      <Box direction="column" gap="sm">
        <Box direction="row" align="flex-start" gap="xs">
          <Ionicons name="ellipse" size={10} color={colors.success} style={{ marginTop: 4 }} />
          <Box flex={1}>
            <Text weight="medium" numberOfLines={2}>
              {issue.title}
            </Text>
          </Box>
        </Box>
        {issue.labels.length > 0 && (
          <Box direction="row" gap="xs" wrap>
            {issue.labels.map((label) => (
              <Badge key={label.id} tone={labelColorToTone(label.color)} size="sm">
                {label.name}
              </Badge>
            ))}
          </Box>
        )}
        <Box direction="row" align="center" gap="xs">
          <Avatar uri={issue.user.avatar_url} fallback={issue.user.login} size="sm" />
          <Text size="xs" tone="muted">
            {issue.user.login} ·{' '}
            {formatDistanceToNow(new Date(issue.created_at), { addSuffix: true, locale: ptBR })}
          </Text>
        </Box>
      </Box>
    </Card>
  );
}

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
    ({ item }: { item: Issue }) => (
      <Box paddingHorizontal="md" paddingBottom="sm">
        <IssueCard issue={item} />
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

  if (isLoading) {
    return (
      <>
        <Stack.Screen options={{ title }} />
        <Box flex={1} paddingTop="sm" testID="issues-skeleton">
          {SKELETON_KEYS.map((key) => (
            <Box key={key} paddingHorizontal="md" paddingBottom="sm">
              <IssueSkeleton />
            </Box>
          ))}
        </Box>
      </>
    );
  }

  if (isError) {
    return (
      <>
        <Stack.Screen options={{ title }} />
        <Box flex={1} align="center" justify="center" padding="xl" testID="issues-error">
          {isRateLimit ? (
            <Box direction="column" align="center" gap="sm">
              <Text weight="bold" tone="danger">
                GitHub rate limit reached
              </Text>
              <Text tone="muted" size="sm">
                Add EXPO_PUBLIC_GITHUB_TOKEN to increase the limit to 5 000 requests/hour.
              </Text>
            </Box>
          ) : (
            <Box direction="column" align="center" gap="md">
              <Text tone="danger" weight="bold">
                Something went wrong
              </Text>
              <Text tone="muted" size="sm">
                Could not load issues.
              </Text>
              <Button variant="outline" onPress={refetch} testID="issues-retry-button">
                Try again
              </Button>
            </Box>
          )}
        </Box>
      </>
    );
  }

  if (issues.length === 0) {
    return (
      <>
        <Stack.Screen options={{ title }} />
        <Box flex={1} align="center" justify="center" padding="xl" testID="issues-empty">
          <Text tone="muted" size="lg">
            No open issues
          </Text>
          <Box paddingTop="xs">
            <Text tone="muted" size="sm">
              This repository has no open issues.
            </Text>
          </Box>
        </Box>
      </>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title }} />
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
        testID="issues-list"
      />
    </>
  );
}
