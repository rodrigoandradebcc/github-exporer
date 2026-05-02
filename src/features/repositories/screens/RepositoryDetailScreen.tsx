import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, View } from 'react-native';

import { Avatar, Box, Button, Card, Heading, Skeleton, Text, useTheme } from '@/design-system';
import { useRepository } from '@/features/repositories/hooks/useRepository';
import { ApiError } from '@/services/api/client';

function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

function StatItem({
  icon,
  value,
  label,
  iconColor,
}: {
  icon: string;
  value: string;
  label: string;
  iconColor: string;
}) {
  const { spacing } = useTheme();
  return (
    <View
      style={{
        width: '50%',
        alignItems: 'center',
        paddingVertical: spacing.sm,
      }}
    >
      <Ionicons
        name={icon as React.ComponentProps<typeof Ionicons>['name']}
        size={20}
        color={iconColor}
      />
      <Text weight="bold" size="lg">
        {value}
      </Text>
      <Text size="xs" tone="muted">
        {label}
      </Text>
    </View>
  );
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
            headerBackButtonDisplayMode: 'minimal',
          }}
        />
        <DetailSkeleton />
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
            headerBackButtonDisplayMode: 'minimal',
          }}
        />
        <Box flex={1} align="center" justify="center" padding="xl" testID="detail-error">
          {isRateLimit ? (
            <Box direction="column" align="center" gap="sm">
              <Ionicons name="warning-outline" size={48} color={colors.warning} />
              <Text weight="bold" tone="danger">
                Limite da API do GitHub atingido
              </Text>
              <Text tone="muted" size="sm">
                Adicione EXPO_PUBLIC_GITHUB_TOKEN no .env para aumentar o limite para 5.000
                requisições/hora.
              </Text>
            </Box>
          ) : (
            <Box direction="column" align="center" gap="md">
              <Ionicons name="cloud-offline-outline" size={48} color={colors.muted} />
              <Text tone="danger" weight="bold">
                Algo deu errado
              </Text>
              <Text tone="muted" size="sm">
                Não foi possível carregar os detalhes do repositório.
              </Text>
              <Button variant="outline" onPress={refetch} testID="detail-retry-button">
                Tentar novamente
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
      <Stack.Screen
        options={{
          title: `${data.owner.login}/${data.name}`,
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          headerBackTitle: '',
        }}
      />
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
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              <StatItem
                icon="star-outline"
                value={formatCount(data.stargazers_count)}
                label="Stars"
                iconColor={colors.warning}
              />
              <StatItem
                icon="git-branch-outline"
                value={formatCount(data.forks_count)}
                label="Forks"
                iconColor={colors.success}
              />
              <StatItem
                icon="eye-outline"
                value={formatCount(data.watchers_count)}
                label="Watchers"
                iconColor={colors.info}
              />
              {data.language !== null && (
                <StatItem
                  icon="code-slash-outline"
                  value={data.language}
                  label="Linguagem"
                  iconColor={colors.primary}
                />
              )}
            </View>
          </Card>

          <Button
            testID="view-issues-button"
            size="lg"
            onPress={() => router.push(`/repository/${owner}/${repo}/issues`)}
          >
            Ver Issues
          </Button>
        </Box>
      </ScrollView>
    </>
  );
}
