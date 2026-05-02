import React from 'react';
import { TouchableOpacity } from 'react-native';

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
  return (
    <TouchableOpacity activeOpacity={0.75} onPress={onPress} testID={testID}>
      <Card padding="md">
        <Box direction="column" gap="xs">
          {/* Owner row */}
          <Box direction="row" align="center" gap="xs">
            <Avatar uri={repo.owner.avatar_url} fallback={repo.owner.login} size="sm" />
            <Text variant="label" size="xs" tone="muted">
              {repo.owner.login}
            </Text>
          </Box>

          {/* Repository name */}
          <Heading level={3}>{repo.name}</Heading>

          {/* Description */}
          {repo.description !== null && (
            <Text tone="muted" numberOfLines={2}>
              {repo.description}
            </Text>
          )}

          {/* Footer */}
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
    </TouchableOpacity>
  );
}
