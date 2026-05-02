import React from 'react';
import { ScrollView, View } from 'react-native';
import Animated, { FadeInDown, useReducedMotion } from 'react-native-reanimated';

import { Avatar, Box, Button, Card, Heading, Text, useTheme } from '@/design-system';
import type { RepositoryDetail } from '@/services/api/types';

import { RepositoryStatItem } from './RepositoryStatItem';

interface RepositoryDetailContentProps {
  repository: RepositoryDetail;
  onViewIssues: () => void;
}

function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

export function RepositoryDetailContent({
  repository,
  onViewIssues,
}: RepositoryDetailContentProps) {
  const { colors } = useTheme();
  const reducedMotion = useReducedMotion();

  return (
    <ScrollView testID="repo-detail-scroll" contentInsetAdjustmentBehavior="automatic">
      <Box padding="md" direction="column" gap="md">
        <Animated.View entering={reducedMotion ? undefined : FadeInDown.duration(300)}>
          <Card testID="repo-detail-header">
            <Box direction="column" gap="sm">
              <Box direction="row" align="center" gap="md">
                <Avatar
                  uri={repository.owner.avatar_url}
                  fallback={repository.owner.login}
                  size="lg"
                />
                <Box direction="column" gap="xs" flex={1}>
                  <Text variant="label" size="xs" tone="muted">
                    {repository.owner.login}
                  </Text>
                  <Heading level={1}>{repository.name}</Heading>
                </Box>
              </Box>
              {repository.description !== null && (
                <Text tone="muted">{repository.description}</Text>
              )}
            </Box>
          </Card>
        </Animated.View>

        <Animated.View entering={reducedMotion ? undefined : FadeInDown.delay(100).duration(300)}>
          <Card testID="repo-detail-stats">
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              <RepositoryStatItem
                icon="star-outline"
                value={formatCount(repository.stargazers_count)}
                label="Stars"
                iconColor={colors.warning}
              />
              <RepositoryStatItem
                icon="git-branch-outline"
                value={formatCount(repository.forks_count)}
                label="Forks"
                iconColor={colors.success}
              />
              <RepositoryStatItem
                icon="eye-outline"
                value={formatCount(repository.watchers_count)}
                label="Watchers"
                iconColor={colors.info}
              />
              {repository.language !== null && (
                <RepositoryStatItem
                  icon="code-slash-outline"
                  value={repository.language}
                  label="Linguagem"
                  iconColor={colors.primary}
                />
              )}
            </View>
          </Card>
        </Animated.View>

        <Animated.View entering={reducedMotion ? undefined : FadeInDown.delay(200).duration(300)}>
          <Button testID="view-issues-button" size="lg" onPress={onViewIssues}>
            Ver Issues
          </Button>
        </Animated.View>
      </Box>
    </ScrollView>
  );
}
