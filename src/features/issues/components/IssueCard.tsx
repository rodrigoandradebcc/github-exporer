import { Ionicons } from '@expo/vector-icons';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import React from 'react';
import Animated, { FadeInDown, useReducedMotion } from 'react-native-reanimated';

import { Avatar, Badge, Box, Card, Text, useTheme } from '@/design-system';
import type { Issue } from '@/services/api/types';

import { labelColorToTone } from '../utils/labelColorToTone';

interface IssueCardProps {
  issue: Issue;
  index?: number;
}

export function IssueCard({ issue, index = 0 }: IssueCardProps) {
  const { colors } = useTheme();
  const reducedMotion = useReducedMotion();
  const entering = reducedMotion ? undefined : FadeInDown.delay(index * 50).duration(300);

  return (
    <Animated.View entering={entering}>
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

          <Box direction="row" align="center" justify="space-between">
            <Box direction="row" align="center" gap="xs" flex={1}>
              <Avatar uri={issue.user.avatar_url} fallback={issue.user.login} size="sm" />
              <Text size="xs" tone="muted" numberOfLines={1}>
                {issue.user.login} ·{' '}
                {formatDistanceToNow(new Date(issue.created_at), { addSuffix: true, locale: ptBR })}
              </Text>
            </Box>
            <Text size="xs" tone="muted" weight="medium">
              #{issue.number}
            </Text>
          </Box>
        </Box>
      </Card>
    </Animated.View>
  );
}
