import React from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { Colors, Radius, Shadows, Spacing } from '../../theme/tokens';

// ── Types ──────────────────────────────────────────────────────────
type CardVariant = 'default' | 'glass' | 'lime' | 'flat';

interface CardProps {
  /** Visual variant — controls background & border treatment. */
  variant?: CardVariant;
  /** When true, adds a neon (lime/default) or violet (glass) glow shadow. */
  glow?: boolean;
  /** Additional styles merged onto the container. */
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
}

// ── Component ──────────────────────────────────────────────────────
export function Card({
  variant = 'default',
  glow = false,
  style,
  children,
}: CardProps) {
  return (
    <View
      style={[
        styles.base,
        variantStyles[variant],
        glow && glowStyles[variant],
        style,
      ]}
    >
      {children}
    </View>
  );
}

// ── Styles ─────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  base: {
    borderRadius: Radius.lg,
    padding: Spacing.md,
    overflow: 'hidden',
  },
});

const variantStyles = StyleSheet.create({
  default: {
    backgroundColor: Colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: Colors.surfaceVariant,
  },
  glass: {
    backgroundColor: Colors.glassViolet,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
  },
  lime: {
    backgroundColor: 'rgba(195, 244, 0, 0.06)',
    borderWidth: 1,
    borderColor: Colors.primaryFixedDim,
  },
  flat: {
    backgroundColor: Colors.surface,
    borderWidth: 0,
    borderColor: 'transparent',
  },
});

const glowStyles = StyleSheet.create({
  default: {
    ...Shadows.neonGlow,
  },
  glass: {
    ...Shadows.violetGlow,
  },
  lime: {
    ...Shadows.neonGlow,
  },
  flat: {
    ...Shadows.card,
  },
});
