import React from 'react';
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { Colors, Radius, Spacing, Typography } from '../../theme/tokens';

// ── Types ──────────────────────────────────────────────────────────
interface StatCardProps {
  /** Uppercase descriptor shown at the top. */
  label: string;
  /** The primary numeric or text value. */
  value: string;
  /** Unit label shown beside/below the value (e.g. "hrs", "kcal"). */
  unit: string;
  /** Override the value text color (defaults to textPrimary). */
  accentColor?: string;
  /** Additional styles merged onto the outer container. */
  style?: StyleProp<ViewStyle>;
}

// ── Component ──────────────────────────────────────────────────────
export function StatCard({
  label,
  value,
  unit,
  accentColor,
  style,
}: StatCardProps) {
  return (
    <View style={[styles.container, style]}>
      {/* Uppercase label */}
      <Text style={styles.label} numberOfLines={1}>
        {label}
      </Text>

      {/* Value + Unit */}
      <View style={styles.valueRow}>
        <Text
          style={[
            styles.value,
            accentColor != null && { color: accentColor },
          ]}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.7}
        >
          {value}
        </Text>

        <Text style={styles.unit} numberOfLines={1}>
          {unit}
        </Text>
      </View>
    </View>
  );
}

// ── Styles ─────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: Colors.surfaceVariant,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    gap: Spacing.sm,
    minWidth: 120,
  },
  label: {
    ...Typography.labelCaps,
    color: Colors.textMuted,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: Spacing.xs,
  },
  value: {
    ...Typography.headlineLgMobile,
    color: Colors.textPrimary,
  },
  unit: {
    ...Typography.bodyMd,
    color: Colors.textMuted,
  },
});
