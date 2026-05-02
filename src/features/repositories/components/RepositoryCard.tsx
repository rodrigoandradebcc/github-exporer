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
import { formatCount } from '@/utils/formatCount';

interface RepositoryCardProps {
  repo: Repository;
  onPress: () => void;
  testID?: string;
  index?: number;
}

const PRESS_SPRING = { stiffness: 400, damping: 30 };
const STAGGER_MS = 50;
const MAX_STAGGER_INDEX = 5;

export function RepositoryCard({ repo, onPress, testID, index = 0 }: RepositoryCardProps) {
  const { colors } = useTheme();
  const reducedMotion = useReducedMotion();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.97, PRESS_SPRING);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, PRESS_SPRING);
  };

  const entering = reducedMotion
    ? undefined
    : FadeInDown.delay(Math.min(index, MAX_STAGGER_INDEX) * STAGGER_MS).duration(300);

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
                  {formatCount(repo.stargazers_count)}
                </Text>
              </Box>
            </Box>

            <Heading level={3}>{repo.name}</Heading>

            {repo.description !== null && (
              <Text tone="muted" size="sm" numberOfLines={2}>
                {repo.description}
              </Text>
            )}

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
