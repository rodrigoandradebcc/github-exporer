import { Ionicons } from '@expo/vector-icons';
import React from 'react';

import { Box, Button, Text, useTheme } from '@/design-system';

export function SearchRateLimitError() {
  const { colors } = useTheme();

  return (
    <Box flex={1} align="center" justify="center" padding="xl" testID="rate-limit-error">
      <Ionicons name="warning-outline" size={48} color={colors.warning} />
      <Box paddingTop="md">
        <Text weight="bold" tone="danger">
          Limite da API do GitHub atingido
        </Text>
      </Box>
      <Box paddingTop="sm">
        <Text tone="muted" size="sm">
          Limite de requisições sem autenticação atingido. Adicione EXPO_PUBLIC_GITHUB_TOKEN no .env
          para aumentar o limite para 5.000 requisições/hora.
        </Text>
      </Box>
    </Box>
  );
}

export function SearchGenericError({ onRetry }: { onRetry: () => void }) {
  const { colors } = useTheme();

  return (
    <Box flex={1} align="center" justify="center" padding="xl" testID="generic-error">
      <Ionicons name="cloud-offline-outline" size={48} color={colors.muted} />
      <Box paddingTop="md">
        <Text tone="danger" weight="bold">
          Algo deu errado
        </Text>
      </Box>
      <Box paddingTop="sm">
        <Text tone="muted" size="sm">
          Não foi possível acessar o GitHub. Verifique sua conexão e tente novamente.
        </Text>
      </Box>
      <Box paddingTop="md">
        <Button variant="outline" onPress={onRetry}>
          Tentar novamente
        </Button>
      </Box>
    </Box>
  );
}
