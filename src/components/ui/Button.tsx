import React, { useCallback } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { Colors, FontFamily, Radius, Spacing } from '../../theme/tokens';

// ── Animated wrapper ───────────────────────────────────────────────
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// ── Types ──────────────────────────────────────────────────────────
type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  /** Optional icon element rendered before the label. */
  icon?: React.ReactElement;
}

// ── Spring config ──────────────────────────────────────────────────
const SPRING_CONFIG = {
  damping: 15,
  stiffness: 300,
  mass: 0.8,
} as const;

// ── Component ──────────────────────────────────────────────────────
export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  style,
  icon,
}: ButtonProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.97, SPRING_CONFIG);
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, SPRING_CONFIG);
  }, [scale]);

  const handlePress = useCallback(() => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  }, [onPress]);

  const containerVariant = variantContainerStyles[variant];
  const textVariant = variantTextStyles[variant];
  const sizeStyle = sizeStyles[size];
  const textSize = sizeTextStyles[size];

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      style={[
        styles.base,
        sizeStyle,
        containerVariant,
        disabled && styles.disabled,
        animatedStyle,
        style,
      ]}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      accessibilityLabel={label}
    >
      <View style={styles.content}>
        {icon && <View style={styles.iconWrapper}>{icon}</View>}
        <Text
          style={[
            styles.label,
            textSize,
            textVariant,
            disabled && styles.disabledText,
          ]}
          numberOfLines={1}
        >
          {label}
        </Text>
      </View>
    </AnimatedPressable>
  );
}

// ── Base Styles ────────────────────────────────────────────────────
const styles = StyleSheet.create({
  base: {
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontFamily: FontFamily.bodyBold,
    textAlign: 'center',
  },
  disabled: {
    opacity: 0.4,
  },
  disabledText: {
    opacity: 0.6,
  },
});

// ── Size Variants ──────────────────────────────────────────────────
const sizeStyles = StyleSheet.create({
  sm: {
    height: 36,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.sm,
  },
  md: {
    height: 48,
    paddingHorizontal: Spacing.lg,
    borderRadius: Radius.md,
  },
  lg: {
    height: 56,
    paddingHorizontal: Spacing.xl,
    borderRadius: Radius.lg,
  },
});

const sizeTextStyles = StyleSheet.create({
  sm: {
    fontSize: 13,
    lineHeight: 18,
  },
  md: {
    fontSize: 15,
    lineHeight: 20,
  },
  lg: {
    fontSize: 17,
    lineHeight: 24,
  },
});

// ── Variant Container Styles ───────────────────────────────────────
const variantContainerStyles = StyleSheet.create({
  primary: {
    backgroundColor: Colors.primaryContainer,
  },
  secondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.secondaryContainer,
  },
  ghost: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.surfaceVariant,
  },
  danger: {
    backgroundColor: 'rgba(147, 0, 10, 0.25)',
    borderWidth: 1,
    borderColor: Colors.errorContainer,
  },
});

// ── Variant Text Styles ────────────────────────────────────────────
const variantTextStyles = StyleSheet.create({
  primary: {
    color: Colors.black,
  },
  secondary: {
    color: Colors.secondary,
  },
  ghost: {
    color: Colors.textPrimary,
  },
  danger: {
    color: Colors.error,
  },
});
