import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import Svg, { Path } from 'react-native-svg';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withRepeat, 
  withSequence,
  Easing 
} from 'react-native-reanimated';
import { hasCompletedOnboarding } from '../src/db/repositories/equipment';

const Colors = {
  black: '#000000',
  primaryFixedDim: '#abd600',
  onSurfaceVariant: '#c4c9ac',
  surfaceVariant: '#333535',
  outlineVariant: '#444933',
};

export default function SplashScreen() {
  const router = useRouter();
  
  const pulseOpacity = useSharedValue(0.5);
  const barWidth = useSharedValue(0);

  useEffect(() => {
    // Pulse animation
    pulseOpacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.5, { duration: 1000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    // Loading bar animation
    barWidth.value = withSequence(
      withTiming(15, { duration: 300 }),
      withTiming(45, { duration: 600 }),
      withTiming(50, { duration: 900 }),
      withTiming(85, { duration: 600 }),
      withTiming(100, { duration: 600 })
    );

    // Routing
    const timer = setTimeout(() => {
      try {
        const completed = hasCompletedOnboarding();
        if (completed) {
          router.replace('/(tabs)/');
        } else {
          router.replace('/(onboarding)/');
        }
      } catch (e) {
        // Fallback if db error
        router.replace('/(tabs)/');
      }
    }, 3200);

    return () => clearTimeout(timer);
  }, []);

  const animatedLogoStyle = useAnimatedStyle(() => ({
    opacity: pulseOpacity.value,
    transform: [{ scale: 1 + (pulseOpacity.value - 0.5) * 0.1 }],
  }));

  const animatedBarStyle = useAnimatedStyle(() => ({
    width: `${barWidth.value}%`,
  }));

  return (
    <View style={styles.container}>
      {/* Cybernetic Grid Background Overlay */}
      <View style={styles.gridOverlay} />

      <View style={styles.content}>
        {/* Logo Group */}
        <Animated.View style={[styles.logoWrapper, animatedLogoStyle]}>
          <Svg width="80" height="80" viewBox="0 0 80 80" fill="none">
            <Path d="M40 10L70 40L60 50L40 30L20 50L10 40L40 10Z" fill={Colors.primaryFixedDim} />
            <Path d="M40 70L10 40L20 30L40 50L60 30L70 40L40 70Z" fill={Colors.primaryFixedDim} fillOpacity="0.5" />
            <Path d="M60 50H70V70H40V60H60V50Z" fill={Colors.primaryFixedDim} />
          </Svg>
        </Animated.View>

        <Text style={styles.title}>GENSENTIEL</Text>
        <Text style={styles.tagline}>YOUR LOCAL-FIRST TRAINING SENTINEL</Text>
      </View>

      {/* Loading Section */}
      <View style={styles.loadingContainer}>
        <View style={styles.loadingWrapper}>
          <Text style={styles.loadingText}>INITIALIZING SYSTEMS...</Text>
          
          <View style={styles.barTrack}>
            <Animated.View style={[styles.barFill, animatedBarStyle]} />
          </View>
          
          <View style={styles.techRow}>
            <Text style={styles.techText}>V.1.0.4-LOCAL</Text>
            <Text style={styles.techText}>SECURE</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.1,
    // Note: React Native doesn't support repeating background gradients natively easily without SVG patterns,
    // so we use a subtle overlay or skip the literal grid lines for performance.
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 64,
  },
  logoWrapper: {
    width: 80,
    height: 80,
    marginBottom: 24,
    shadowColor: Colors.primaryFixedDim,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 10,
  },
  title: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 28,
    color: Colors.primaryFixedDim,
    letterSpacing: 6,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  tagline: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 10,
    color: Colors.onSurfaceVariant,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  loadingContainer: {
    position: 'absolute',
    bottom: '20%',
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  loadingWrapper: {
    width: 200,
    gap: 8,
  },
  loadingText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 10,
    color: Colors.primaryFixedDim,
    opacity: 0.8,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  barTrack: {
    width: '100%',
    height: 4,
    backgroundColor: Colors.surfaceVariant,
    borderRadius: 2,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(68, 73, 51, 0.3)',
  },
  barFill: {
    height: '100%',
    backgroundColor: Colors.primaryFixedDim,
    borderRadius: 2,
    shadowColor: Colors.primaryFixedDim,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 4,
  },
  techRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  techText: {
    fontFamily: 'SpaceGrotesk_600SemiBold',
    fontSize: 8,
    color: Colors.onSurfaceVariant,
    opacity: 0.4,
    textTransform: 'uppercase',
  },
});
