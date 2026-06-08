import React from 'react';
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { Colors, FontFamily, Radius, Spacing } from '../../theme/tokens';

// ── Types ──────────────────────────────────────────────────────────
type BadgeVariant = 'lime' | 'violet' | 'cyan' | 'muted';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  style?: StyleProp<ViewStyle>;
}

// ── Variant color map ──────────────────────────────────────────────
const VARIANT_COLORS: Record<BadgeVariant, { bg: string; text: string }> = {
  lime: {
    bg: 'rgba(195, 244, 0, 0.15)',
    text: Colors.primaryContainer,
  },
  violet: {
    bg: 'rgba(119, 1, 208, 0.20)',
    text: Colors.secondary,
  },
  cyan: {
    bg: 'rgba(0, 218, 243, 0.12)',
    text: Colors.tertiaryFixedDim,
  },
  muted: {
    bg: Colors.surfaceContainerHigh,
    text: Colors.textMuted,
  },
};

// ── Component ──────────────────────────────────────────────────────
export function Badge({ label, variant = 'muted', style }: BadgeProps) {
  const colors = VARIANT_COLORS[variant];

  return (
    <View style={[styles.pill, { backgroundColor: colors.bg }, style]}>
      <Text style={[styles.label, { color: colors.text }]}>
        {label}
      </Text>
    </View>
  );
}

// ── Styles ─────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  pill: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.sm + 2, // 10px
    paddingVertical: Spacing.xs,       // 4px
    borderRadius: Radius.full,
  },
  label: {
    fontFamily: FontFamily.bodyBold,
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
});
