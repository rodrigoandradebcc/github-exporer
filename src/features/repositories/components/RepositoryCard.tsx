import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable } from 'react-native';
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { Avatar, Badge, Box, Card, Heading, Text, useTheme } from '@/design-system';
import type { Repository } from '@/services/api/types';

interface RepositoryCardProps {
  repo: Repository;
  onPress: () => void;
  testID?: string;
  index?: number;
}

function formatStars(count: number): string {
  if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
  return `${count}`;
}

export function RepositoryCard({ repo, onPress, testID, index = 0 }: RepositoryCardProps) {
  const { colors } = useTheme();
  const reducedMotion = useReducedMotion();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.97, { stiffness: 400, damping: 30 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { stiffness: 400, damping: 30 });
  };

  const entering = reducedMotion
    ? undefined
    : FadeInDown.delay(index * 50).duration(300);

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
      <Animated.View style={animatedStyle} entering={entering}>
        <Card padding="lg">
          <Box direction="column" gap="xs">
            {/* Top row: avatar + owner on left, star count on right */}
            <Box direction="row" align="center" justify="space-between">
              <Box direction="row" align="center" gap="xs">
                <Avatar uri={repo.owner.avatar_url} fallback={repo.owner.login} size="sm" />
                <Text variant="label" size="xs" tone="muted">
                  {repo.owner.login}
                </Text>
              </Box>
              <Box direction="row" align="center" gap="xs">
                <Ionicons name="star" size={14} color={colors.warning} />
                <Text size="sm" weight="medium">
                  {formatStars(repo.stargazers_count)}
                </Text>
              </Box>
            </Box>

            {/* Repo name as hero */}
            <Heading level={3}>{repo.name}</Heading>

            {/* Description */}
            {repo.description !== null && (
              <Text tone="muted" size="sm" numberOfLines={2}>
                {repo.description}
              </Text>
            )}

            {/* Language badge */}
            {repo.language !== null && (
              <Box direction="row">
                <Badge tone="info" size="sm">
                  {repo.language}
                </Badge>
              </Box>
            )}
          </Box>
        </Card>
      </Animated.View>
    </Pressable>
  );
}
