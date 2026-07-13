import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming } from 'react-native-reanimated';
import { Minus, Plus } from 'lucide-react-native';
import { useTranslation } from '../../i18n/useTranslation';

const Colors = {
  black: '#000000',
  primaryContainer: '#c3f400',
  surfaceContainer: '#1e2020',
  surfaceContainerHigh: '#282a2b',
  surfaceVariant: '#333535',
  onSurface: '#e2e2e2',
  onSurfaceVariant: '#c4c9ac',
  neonGlow: 'rgba(195, 244, 0, 0.6)',
};

interface RestTimerFloatProps {
  visible: boolean;
  seconds: number;
  totalSeconds: number;
  onSubtract10: () => void;
  onSkip: () => void;
  onAdd30: () => void;
}

export function RestTimerFloat({
  visible,
  seconds,
  totalSeconds,
  onSubtract10,
  onSkip,
  onAdd30,
}: RestTimerFloatProps) {
  const { t } = useTranslation();
  const translateY = useSharedValue(200);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      translateY.value = withSpring(0, { damping: 15, stiffness: 100 });
      opacity.value = withTiming(1, { duration: 300 });
    } else {
      translateY.value = withTiming(200, { duration: 300 });
      opacity.value = withTiming(0, { duration: 300 });
    }
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const secs = s % 60;
    return `${m}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = totalSeconds > 0 ? (seconds / totalSeconds) * 100 : 0;

  return (
    <Animated.View style={[styles.container, animatedStyle]} pointerEvents={visible ? 'auto' : 'none'}>
      <Text style={styles.label}>{t('restTimer.label')}</Text>
      <Text style={styles.timer}>{formatTime(seconds)}</Text>

      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progress}%` }]} />
      </View>

      <View style={styles.buttonRow}>
        <Pressable style={styles.button} onPress={onSubtract10}>
          <Minus size={16} color={Colors.onSurface} />
          <Text style={styles.buttonText}>10s</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={onSkip}>
          <Text style={styles.buttonText}>{t('restTimer.skip')}</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={onAdd30}>
          <Plus size={16} color={Colors.onSurface} />
          <Text style={styles.buttonText}>30s</Text>
        </Pressable>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 108,
    left: 20,
    right: 20,
    backgroundColor: Colors.surfaceContainer,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.surfaceVariant,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  label: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
    color: Colors.onSurfaceVariant,
    letterSpacing: 2,
    marginBottom: 4,
  },
  timer: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 48,
    color: Colors.primaryContainer,
    letterSpacing: 4,
    textShadowColor: Colors.neonGlow,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
  },
  progressTrack: {
    width: '100%',
    height: 4,
    backgroundColor: Colors.surfaceVariant,
    borderRadius: 2,
    marginTop: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primaryContainer,
    borderRadius: 2,
    shadowColor: Colors.neonGlow,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 16,
    gap: 8,
  },
  button: {
    flex: 1,
    height: 40,
    backgroundColor: Colors.surfaceContainerHigh,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.surfaceVariant,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  buttonText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
    color: Colors.onSurface,
    textTransform: 'uppercase',
  },
});
