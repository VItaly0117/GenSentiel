import { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import {
  Dumbbell,
  TrendingUp,
  Flame,
  HeartPulse,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Cpu,
} from 'lucide-react-native';
import {
  saveUserGoal,
  setOnboardingCompleted,
  getUserEquipment,
} from '../../src/db/repositories/equipment';
import { generateProgram, saveGeneratedProgram } from '../../src/utils/programGenerator';
import type { TrainingGoal } from '../../src/types';
import { useTranslation } from '../../src/i18n/useTranslation';
import { haptics } from '../../src/utils/haptics';

const Colors = {
  black: '#000000',
  surfaceContainerLow: '#1a1c1c',
  surfaceContainer: '#1e2020',
  surfaceVariant: '#333535',
  onSurface: '#e2e2e2',
  onSurfaceVariant: '#c4c9ac',
  primaryContainer: '#c3f400',
  primaryFixedDim: '#abd600',
  secondaryContainer: '#7701d0',
  secondaryFixedDim: '#dcb8ff',
  outlineVariant: '#444933',
  neonGlow: 'rgba(171, 214, 0, 0.4)',
};

interface GoalOption {
  key: TrainingGoal;
  labelKey: string;
  descKey: string;
  icon: React.ReactNode;
}

const GOAL_OPTIONS: GoalOption[] = [
  {
    key: 'strength',
    labelKey: 'strengthLabel',
    descKey: 'strengthDesc',
    icon: <Dumbbell size={32} color="#ffffff" />,
  },
  {
    key: 'hypertrophy',
    labelKey: 'hypertrophyLabel',
    descKey: 'hypertrophyDesc',
    icon: <TrendingUp size={32} color="#ffffff" />,
  },
  {
    key: 'fat_loss',
    labelKey: 'fatLossLabel',
    descKey: 'fatLossDesc',
    icon: <Flame size={32} color="#ffffff" />,
  },
  {
    key: 'general_fitness',
    labelKey: 'generalLabel',
    descKey: 'generalDesc',
    icon: <HeartPulse size={32} color="#ffffff" />,
  },
];

export default function GoalsScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const [selected, setSelected] = useState<TrainingGoal>('general_fitness');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleContinue = async () => {
    setIsGenerating(true);
    try {
      saveUserGoal(selected);
      setOnboardingCompleted();

      // Auto-compose a first training protocol from equipment + goal
      const equipment = getUserEquipment();
      const generatedDays = await generateProgram({
        equipment,
        splitType: 'full_body',
        difficulty: 3,
        daysPerWeek: 3,
        goal: selected,
      });
      await saveGeneratedProgram(generatedDays);

      haptics.notification(Haptics.NotificationFeedbackType.Success);
      router.replace('/(tabs)');
    } catch (error) {
      console.error('[Goals] Save/generate error:', error);
      Alert.alert(t('common.error'), 'Failed to generate your training protocol.');
      setIsGenerating(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color={Colors.onSurface} />
        </Pressable>

        <View style={styles.progressDots}>
          <View style={styles.dotInactive} />
          <View style={styles.dotActive} />
        </View>

        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.labelText}>{t('onboarding.goals.label')}</Text>
          <Text style={styles.headlineText}>{t('onboarding.goals.headline')}</Text>
          <Text style={styles.descText}>
            This tunes rep ranges, rest timers, and exercise volume for every
            protocol GenSentiel generates for you.
          </Text>
        </View>

        {/* Goal List */}
        <View style={styles.list}>
          {GOAL_OPTIONS.map((item) => {
            const isSelected = selected === item.key;
            return (
              <Pressable
                key={item.key}
                style={[styles.card, isSelected && styles.cardSelected]}
                onPress={() => {
                  haptics.impact(Haptics.ImpactFeedbackStyle.Light);
                  setSelected(item.key);
                }}
              >
                <View
                  style={[styles.iconContainer, !isSelected && { opacity: 0.5 }]}
                >
                  {item.icon}
                </View>

                <View style={styles.cardTextContainer}>
                  <Text
                    style={[styles.cardLabel, !isSelected && styles.cardLabelMuted]}
                  >
                    {t(`onboarding.goals.${item.labelKey}`)}
                  </Text>
                  <Text style={styles.cardDesc}>{t(`onboarding.goals.${item.descKey}`)}</Text>
                </View>

                {isSelected && (
                  <CheckCircle2
                    size={22}
                    color={Colors.primaryFixedDim}
                    fill={Colors.primaryFixedDim}
                  />
                )}
              </Pressable>
            );
          })}
        </View>

        {/* Decorative */}
        <View style={styles.scanCard}>
          <View style={styles.scanContent}>
            <Cpu size={24} color={Colors.secondaryFixedDim} />
            <View style={styles.scanText}>
              <Text style={styles.scanTitle}>{t('onboarding.goals.scanTitle')}</Text>
              <Text style={styles.scanSubtitle}>
                {t('onboarding.goals.scanSubtitle')}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Fixed Bottom Action */}
      <View style={styles.bottomBar}>
        <Pressable
          style={({ pressed }) => [
            styles.ctaButton,
            pressed && { transform: [{ scale: 0.98 }], opacity: 0.9 },
            isGenerating && { opacity: 0.6 },
          ]}
          onPress={handleContinue}
          disabled={isGenerating}
        >
          <Text style={styles.ctaText}>
            {isGenerating ? t('onboarding.goals.ctaLoading') : t('onboarding.goals.cta')}
          </Text>
          {!isGenerating && <ArrowRight size={20} color="#000000" />}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    height: 56,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressDots: {
    flexDirection: 'row',
    gap: 4,
  },
  dotInactive: {
    width: 32,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.surfaceVariant,
  },
  dotActive: {
    width: 32,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.primaryFixedDim,
    shadowColor: Colors.primaryFixedDim,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 120,
    gap: 24,
  },
  titleSection: {
    gap: 8,
  },
  labelText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 1.5,
    color: Colors.primaryFixedDim,
    textTransform: 'uppercase',
  },
  headlineText: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 28,
    lineHeight: 36,
    letterSpacing: 2,
    color: '#ffffff',
  },
  descText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    lineHeight: 24,
    color: Colors.onSurfaceVariant,
    marginTop: 4,
  },
  list: {
    gap: 12,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: Colors.surfaceContainerLow,
    borderWidth: 2,
    borderColor: Colors.surfaceVariant,
    borderRadius: 12,
    padding: 16,
  },
  cardSelected: {
    borderColor: Colors.primaryFixedDim,
    shadowColor: Colors.neonGlow,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 8,
  },
  iconContainer: {
    width: 48,
    alignItems: 'center',
  },
  cardTextContainer: {
    flex: 1,
  },
  cardLabel: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    letterSpacing: 0.5,
    color: '#ffffff',
    textTransform: 'uppercase',
  },
  cardLabelMuted: {
    color: Colors.onSurfaceVariant,
  },
  cardDesc: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: Colors.onSurfaceVariant,
    marginTop: 2,
  },
  scanCard: {
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(119, 1, 208, 0.3)',
    backgroundColor: 'rgba(26, 28, 28, 0.5)',
    borderRadius: 8,
  },
  scanContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  scanText: {
    flex: 1,
  },
  scanTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
    letterSpacing: 1.5,
    color: Colors.secondaryFixedDim,
    textTransform: 'uppercase',
  },
  scanSubtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: Colors.onSurfaceVariant,
    marginTop: 2,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingBottom: 32,
    paddingTop: 16,
  },
  ctaButton: {
    width: '100%',
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.primaryFixedDim,
    borderRadius: 8,
    shadowColor: Colors.neonGlow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 6,
  },
  ctaText: {
    fontFamily: 'SpaceGrotesk_600SemiBold',
    fontSize: 18,
    color: '#000000',
    letterSpacing: 1,
  },
});
