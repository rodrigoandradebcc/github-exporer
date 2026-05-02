import { Stack } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';

import {
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  Heading,
  Input,
  Skeleton,
  Switch,
  Text,
  useTheme,
} from '@/design-system';
import type {
  AvatarSize,
  BadgeSize,
  BadgeTone,
  ButtonSize,
  ButtonVariant,
  CardPadding,
  ColorKey,
  SpacingKey,
} from '@/design-system';

// ── Local helpers ─────────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const { colors } = useTheme();
  return (
    <Box direction="column" gap="md">
      <Box direction="column" gap="xs">
        <Heading level={2}>{title}</Heading>
        {/* Divider — inline style required: no DS component maps to a 1px separator */}
        <View style={{ height: 1, backgroundColor: colors.border }} />
      </Box>
      {children}
    </Box>
  );
}

function Label({ children }: { children: string }) {
  return (
    <Text variant="label" size="xs" tone="muted">
      {children}
    </Text>
  );
}

// ── Screen ────────────────────────────────────────────────────────────────────

export default function ShowcaseScreen() {
  const { colors, spacing, radius, mode, toggleMode } = useTheme();
  const [controlled, setControlled] = useState('');

  return (
    <>
      <Stack.Screen options={{ title: 'Design System' }} />
      <ScrollView>
        <Box padding="md" direction="column" gap="xl" paddingBottom="xl">
          {/* ── 1. Theme ─────────────────────────────────────────────── */}
          <Section title="Theme">
            <Card>
              <Box direction="row" align="center" justify="space-between">
                <Box direction="column" gap="xs">
                  <Text weight="medium">Color mode</Text>
                  <Text tone="muted" size="sm">
                    {mode === 'light' ? 'Light' : 'Dark'}
                  </Text>
                </Box>
                <Switch value={mode === 'dark'} onValueChange={toggleMode} />
              </Box>
            </Card>
          </Section>

          {/* ── 2. Colors ────────────────────────────────────────────── */}
          <Section title="Colors">
            <Box direction="column" gap="sm">
              {(Object.entries(colors) as [ColorKey, string][]).map(([key, value]) => (
                <Box key={key} direction="row" align="center" gap="md">
                  {/* Swatch — inline backgroundColor required to show the actual token value */}
                  <View
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: radius.md,
                      backgroundColor: value,
                      borderWidth: 1,
                      borderColor: colors.border,
                    }}
                  />
                  <Box direction="column" gap="xs" flex={1}>
                    <Text weight="medium">{key}</Text>
                    <Text tone="muted" size="xs">
                      {value.toUpperCase()}
                    </Text>
                  </Box>
                </Box>
              ))}
            </Box>
          </Section>

          {/* ── 3. Spacing ───────────────────────────────────────────── */}
          <Section title="Spacing">
            <Box direction="column" gap="sm">
              {(Object.entries(spacing) as [SpacingKey, number][]).map(([key, value]) => (
                <Box key={key} direction="row" align="center" gap="md">
                  {/* Bar width proportional to token — inline style required */}
                  <View
                    style={{
                      width: value * 5,
                      height: 20,
                      borderRadius: radius.sm,
                      backgroundColor: colors.primary,
                      opacity: 0.7,
                    }}
                  />
                  <Text tone="muted" size="sm">
                    {key} — {value}px
                  </Text>
                </Box>
              ))}
            </Box>
          </Section>

          {/* ── 4. Typography ────────────────────────────────────────── */}
          <Section title="Typography">
            <Box direction="column" gap="lg">
              <Box direction="column" gap="xs">
                <Label>HEADINGS</Label>
                <Heading level={1}>Heading 1 — xl</Heading>
                <Heading level={2}>Heading 2 — lg</Heading>
                <Heading level={3}>Heading 3 — md</Heading>
              </Box>

              <Box direction="column" gap="xs">
                <Label>TEXT SIZES</Label>
                <Text size="xl">xl — 28px</Text>
                <Text size="lg">lg — 20px</Text>
                <Text size="md">md — 16px (default)</Text>
                <Text size="sm">sm — 14px</Text>
                <Text size="xs">xs — 12px</Text>
              </Box>

              <Box direction="column" gap="xs">
                <Label>VARIANTS</Label>
                <Text variant="body">Body — default prose text</Text>
                <Text variant="caption">Caption — secondary information</Text>
                <Text variant="label">Label — uppercase metadata</Text>
              </Box>

              <Box direction="column" gap="xs">
                <Label>WEIGHTS</Label>
                <Text weight="regular">Regular 400</Text>
                <Text weight="medium">Medium 500</Text>
                <Text weight="bold">Bold 700</Text>
              </Box>

              <Box direction="column" gap="xs">
                <Label>TONES</Label>
                <Text tone="default">Default — primary content</Text>
                <Text tone="muted">Muted — secondary content</Text>
                <Text tone="danger">Danger — errors and warnings</Text>
                <Text tone="success">Success — positive feedback</Text>
              </Box>
            </Box>
          </Section>

          {/* ── 5. Buttons ───────────────────────────────────────────── */}
          <Section title="Buttons">
            <Box direction="column" gap="md">
              {(['primary', 'outline', 'ghost'] as ButtonVariant[]).map((variant) => (
                <Box key={variant} direction="column" gap="xs">
                  <Label>{variant.toUpperCase()}</Label>
                  <Box direction="row" align="center" gap="sm">
                    {(['sm', 'md', 'lg'] as ButtonSize[]).map((size) => (
                      <Button key={size} variant={variant} size={size} onPress={() => {}}>
                        {size}
                      </Button>
                    ))}
                  </Box>
                </Box>
              ))}

              <Box direction="column" gap="xs">
                <Label>STATES</Label>
                <Box direction="row" align="center" gap="sm">
                  <Button loading onPress={() => {}}>
                    Loading
                  </Button>
                  <Button disabled onPress={() => {}}>
                    Disabled
                  </Button>
                </Box>
              </Box>
            </Box>
          </Section>

          {/* ── 6. Inputs ────────────────────────────────────────────── */}
          <Section title="Inputs">
            <Box direction="column" gap="md">
              <Input label="Empty" value="" onChangeText={() => {}} placeholder="Placeholder…" />
              <Input label="With value" value="facebook/react" onChangeText={() => {}} />
              <Input
                label="Error state"
                value="invalid@name"
                onChangeText={() => {}}
                error="Repository name cannot contain @"
              />
              <Input
                label="Helper text (interactive)"
                value={controlled}
                onChangeText={setControlled}
                placeholder="e.g. torvalds"
                helperText="Enter a GitHub username or organisation"
              />
              <Input label="Disabled" value="read-only value" onChangeText={() => {}} disabled />
            </Box>
          </Section>

          {/* ── 7. Cards ─────────────────────────────────────────────── */}
          <Section title="Cards">
            <Box direction="column" gap="sm">
              {(['sm', 'md', 'lg'] as CardPadding[]).map((p) => (
                <Card key={p} padding={p}>
                  <Box direction="row" align="center" justify="space-between">
                    <Text weight="medium">{`padding="${p}"`}</Text>
                    <Badge tone="default" size="sm">
                      {spacing[p]}px
                    </Badge>
                  </Box>
                </Card>
              ))}
            </Box>
          </Section>

          {/* ── 8. Badges ────────────────────────────────────────────── */}
          <Section title="Badges">
            <Box direction="column" gap="sm">
              {(['default', 'success', 'warning', 'danger', 'info'] as BadgeTone[]).map((tone) => (
                <Box key={tone} direction="column" gap="xs">
                  <Label>{tone.toUpperCase()}</Label>
                  <Box direction="row" align="center" gap="sm">
                    {(['sm', 'md'] as BadgeSize[]).map((size) => (
                      <Badge key={size} tone={tone} size={size}>
                        {tone} · {size}
                      </Badge>
                    ))}
                  </Box>
                </Box>
              ))}
            </Box>
          </Section>

          {/* ── 9. Avatars ───────────────────────────────────────────── */}
          <Section title="Avatars">
            <Box direction="column" gap="md">
              <Box direction="column" gap="xs">
                <Label>WITH URI — sm / md / lg</Label>
                <Box direction="row" align="center" gap="md">
                  {(['sm', 'md', 'lg'] as AvatarSize[]).map((size) => (
                    <Avatar
                      key={size}
                      uri="https://avatars.githubusercontent.com/u/69631?v=4"
                      fallback="FB"
                      size={size}
                    />
                  ))}
                </Box>
              </Box>
              <Box direction="column" gap="xs">
                <Label>FALLBACK ONLY — sm / md / lg</Label>
                <Box direction="row" align="center" gap="md">
                  {(['sm', 'md', 'lg'] as AvatarSize[]).map((size) => (
                    <Avatar key={size} fallback="Rodrigo" size={size} />
                  ))}
                </Box>
              </Box>
            </Box>
          </Section>

          {/* ── 10. Skeletons ────────────────────────────────────────── */}
          <Section title="Skeletons">
            <Card>
              <Box direction="column" gap="sm">
                <Box direction="row" align="center" gap="sm">
                  <Skeleton width={48} height={48} radius="lg" />
                  <Box direction="column" gap="xs" flex={1}>
                    <Skeleton width="40%" height={12} />
                    <Skeleton width="70%" height={18} />
                  </Box>
                </Box>
                <Skeleton width="100%" height={14} />
                <Skeleton width="85%" height={14} />
                <Box direction="row" gap="sm">
                  <Skeleton width={64} height={22} radius="lg" />
                  <Skeleton width={50} height={22} radius="sm" />
                </Box>
              </Box>
            </Card>
          </Section>
        </Box>
      </ScrollView>
    </>
  );
}
