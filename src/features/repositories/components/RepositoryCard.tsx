import React, { useRef } from 'react';
import { Animated, Pressable } from 'react-native';

import { Avatar, Badge, Box, Card, Heading, Text } from '@/design-system';
import type { Repository } from '@/services/api/types';

interface RepositoryCardProps {
  repo: Repository;
  onPress: () => void;
  testID?: string;
}

function formatStars(count: number): string {
  if (count >= 1000) return `${(count / 1000).toFixed(1)}k ★`;
  return `${count} ★`;
}

export function RepositoryCard({ repo, onPress, testID }: RepositoryCardProps) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () =>
    Animated.spring(scale, {
      toValue: 0.97,
      useNativeDriver: true,
      speed: 50,
      bounciness: 0,
    }).start();

  const handlePressOut = () =>
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 0,
    }).start();

  const label = `Repositório ${repo.owner.login}/${repo.name}${repo.description ? `: ${repo.description}` : ''}`;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      testID={testID}
    >
      <Animated.View style={{ transform: [{ scale }] }}>
        <Card padding="md">
          <Box direction="column" gap="xs">
            <Box direction="row" align="center" gap="xs">
              <Avatar uri={repo.owner.avatar_url} fallback={repo.owner.login} size="sm" />
              <Text variant="label" size="xs" tone="muted">
                {repo.owner.login}
              </Text>
            </Box>

            <Heading level={3}>{repo.name}</Heading>

            {repo.description !== null && (
              <Text tone="muted" numberOfLines={2}>
                {repo.description}
              </Text>
            )}

            <Box direction="row" align="center" gap="sm" paddingTop="xs">
              {repo.language !== null && (
                <Badge tone="info" size="sm">
                  {repo.language}
                </Badge>
              )}
              <Text size="xs" tone="muted">
                {formatStars(repo.stargazers_count)}
              </Text>
            </Box>
          </Box>
        </Card>
      </Animated.View>
    </Pressable>
  );
}
