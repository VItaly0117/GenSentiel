import { useEffect } from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { useTranslation } from '../../src/i18n/useTranslation';

const Colors = {
  black: '#000000',
  primaryContainer: '#c3f400',
  primaryFixedDim: '#abd600',
  onSurface: '#e2e2e2',
  onSurfaceVariant: '#c4c9ac',
  surfaceContainerLow: '#1a1c1c',
  surfaceVariant: '#333535',
  neonGlow: 'rgba(171, 214, 0, 0.4)',
};

export default function WelcomeScreen() {
  const router = useRouter();
  const { t } = useTranslation();

  const titleOpacity = useSharedValue(0);
  const titleTranslateY = useSharedValue(20);
  const subtitleOpacity = useSharedValue(0);
  const descOpacity = useSharedValue(0);
  const btnOpacity = useSharedValue(0);
  const btnTranslateY = useSharedValue(30);

  useEffect(() => {
    titleOpacity.value = withDelay(200, withTiming(1, { duration: 800, easing: Easing.out(Easing.cubic) }));
    titleTranslateY.value = withDelay(200, withTiming(0, { duration: 800, easing: Easing.out(Easing.cubic) }));
    subtitleOpacity.value = withDelay(600, withTiming(1, { duration: 600 }));
    descOpacity.value = withDelay(900, withTiming(1, { duration: 600 }));
    btnOpacity.value = withDelay(1200, withTiming(1, { duration: 600 }));
    btnTranslateY.value = withDelay(1200, withTiming(0, { duration: 600, easing: Easing.out(Easing.cubic) }));
  }, []);

  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleTranslateY.value }],
  }));

  const subtitleStyle = useAnimatedStyle(() => ({
    opacity: subtitleOpacity.value,
  }));

  const descStyle = useAnimatedStyle(() => ({
    opacity: descOpacity.value,
  }));

  const btnStyle = useAnimatedStyle(() => ({
    opacity: btnOpacity.value,
    transform: [{ translateY: btnTranslateY.value }],
  }));

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Logo accent line */}
        <View style={styles.accentLine} />

        <Animated.Text style={[styles.title, titleStyle]}>
          GenSentiel
        </Animated.Text>

        <Animated.Text style={[styles.subtitle, subtitleStyle]}>
          {t('onboarding.welcome.subtitle')}
        </Animated.Text>

        <Animated.Text style={[styles.description, descStyle]}>
          Local-first fitness intelligence. No subscriptions, no cloud dependency.
          Your training data stays on your device.{'\n\n'}
          Configure your available equipment and receive personalized protocols
          optimized for home training environments.
        </Animated.Text>
      </View>

      <Animated.View style={[styles.buttonContainer, btnStyle]}>
        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
          ]}
          onPress={() => router.push('/(onboarding)/equipment')}
        >
          <Text style={styles.buttonText}>{t('onboarding.welcome.cta')}</Text>
        </Pressable>

        <Text style={styles.versionText}>{t('onboarding.welcome.version')}</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 100,
    paddingBottom: 40,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  accentLine: {
    width: 60,
    height: 3,
    backgroundColor: Colors.primaryContainer,
    borderRadius: 2,
    marginBottom: 24,
    shadowColor: Colors.primaryContainer,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 8,
  },
  title: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 42,
    color: Colors.primaryContainer,
    letterSpacing: 3,
    textAlign: 'center',
    textShadowColor: Colors.neonGlow,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 16,
  },
  subtitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
    color: Colors.onSurfaceVariant,
    letterSpacing: 2,
    textAlign: 'center',
    marginTop: 12,
    textTransform: 'uppercase',
  },
  description: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    lineHeight: 24,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    marginTop: 32,
    paddingHorizontal: 16,
  },
  buttonContainer: {
    alignItems: 'center',
    gap: 16,
  },
  button: {
    width: '100%',
    height: 56,
    backgroundColor: Colors.primaryContainer,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primaryContainer,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  buttonPressed: {
    transform: [{ scale: 0.97 }],
    opacity: 0.9,
  },
  buttonText: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 18,
    color: '#000000',
    letterSpacing: 2,
  },
  versionText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    color: Colors.surfaceVariant,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
});
