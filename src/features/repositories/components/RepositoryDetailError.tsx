import { Ionicons } from '@expo/vector-icons';
import React from 'react';

import { Box, Button, Text, useTheme } from '@/design-system';

interface RepositoryDetailErrorProps {
  isRateLimit: boolean;
  onRetry: () => void;
}

export function RepositoryDetailError({ isRateLimit, onRetry }: RepositoryDetailErrorProps) {
  const { colors } = useTheme();

  return (
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
          <Button variant="outline" onPress={onRetry} testID="detail-retry-button">
            Tentar novamente
          </Button>
        </Box>
      )}
    </Box>
  );
}
