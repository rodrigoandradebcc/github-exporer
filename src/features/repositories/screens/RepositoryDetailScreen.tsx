import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { ScrollView } from 'react-native';

import { Avatar, Badge, Box, Button, Card, Heading, Skeleton, Text } from '@/design-system';
import { useRepository } from '@/features/repositories/hooks/useRepository';
import { ApiError } from '@/services/api/client';

function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

function DetailSkeleton() {
  return (
    <ScrollView>
      <Box padding="md" direction="column" gap="md">
        <Card>
          <Box direction="column" gap="sm">
            <Box direction="row" align="center" gap="md">
              <Skeleton width={64} height={64} radius="lg" />
              <Box direction="column" gap="xs" flex={1}>
                <Skeleton width="40%" height={12} />
                <Skeleton width="70%" height={24} />
              </Box>
            </Box>
            <Skeleton width="90%" height={14} />
            <Skeleton width="80%" height={14} />
          </Box>
        </Card>
        <Card>
          <Box direction="row" gap="sm">
            <Skeleton width={80} height={28} radius="lg" />
            <Skeleton width={80} height={28} radius="lg" />
            <Skeleton width={80} height={28} radius="lg" />
            <Skeleton width={80} height={28} radius="lg" />
          </Box>
        </Card>
        <Skeleton height={44} />
      </Box>
    </ScrollView>
  );
}

export function RepositoryDetailScreen() {
  const { owner, repo } = useLocalSearchParams<{ owner: string; repo: string }>();
  const router = useRouter();
  const { data, isLoading, isError, error, refetch } = useRepository(owner, repo);

  const isRateLimit = error instanceof ApiError && error.isRateLimit;

  if (isLoading) {
    return (
      <>
        <Stack.Screen options={{ title: repo }} />
        <DetailSkeleton />
      </>
    );
  }

  if (isError) {
    return (
      <>
        <Stack.Screen options={{ title: repo }} />
        <Box flex={1} align="center" justify="center" padding="xl" testID="detail-error">
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
                Could not load repository details.
              </Text>
              <Button variant="outline" onPress={refetch} testID="detail-retry-button">
                Try again
              </Button>
            </Box>
          )}
        </Box>
      </>
    );
  }

  if (data === undefined) return null;

  return (
    <>
      <Stack.Screen options={{ title: `${data.owner.login}/${data.name}` }} />
      <ScrollView testID="repo-detail-scroll">
        <Box padding="md" direction="column" gap="md">
          <Card testID="repo-detail-header">
            <Box direction="column" gap="sm">
              <Box direction="row" align="center" gap="md">
                <Avatar uri={data.owner.avatar_url} fallback={data.owner.login} size="lg" />
                <Box direction="column" gap="xs" flex={1}>
                  <Text variant="label" size="xs" tone="muted">
                    {data.owner.login}
                  </Text>
                  <Heading level={1}>{data.name}</Heading>
                </Box>
              </Box>
              {data.description !== null && <Text tone="muted">{data.description}</Text>}
            </Box>
          </Card>

          <Card testID="repo-detail-stats">
            <Box direction="row" gap="sm" align="center" wrap>
              {data.language !== null && <Badge tone="info">{data.language}</Badge>}
              <Badge tone="warning">★ {formatCount(data.stargazers_count)}</Badge>
              <Badge>Forks {formatCount(data.forks_count)}</Badge>
              <Badge>Watchers {formatCount(data.watchers_count)}</Badge>
            </Box>
          </Card>

          <Button
            testID="view-issues-button"
            leftIcon={<Ionicons name="bug-outline" size={16} color="#FFFFFF" />}
            onPress={() => router.push(`/repository/${owner}/${repo}/issues`)}
          >
            Ver Issues
          </Button>
        </Box>
      </ScrollView>
    </>
  );
}
