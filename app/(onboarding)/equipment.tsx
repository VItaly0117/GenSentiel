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
  User,
  Dumbbell,
  SquareStack,
  Cable,
  Circle,
  ArrowUpFromDot,
  Armchair,
  Radar,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
} from 'lucide-react-native';
import { saveUserEquipment, setOnboardingCompleted } from '../../src/db/repositories/equipment';
import type { EquipmentKey } from '../../src/types';

const Colors = {
  black: '#000000',
  surface: '#121414',
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

interface EquipmentOption {
  key: EquipmentKey;
  label: string;
  icon: React.ReactNode;
}

const EQUIPMENT_OPTIONS: EquipmentOption[] = [
  {
    key: 'bodyweight',
    label: 'Bodyweight',
    icon: <User size={40} color="#ffffff" />,
  },
  {
    key: 'dumbbells',
    label: 'Dumbbells',
    icon: <Dumbbell size={40} color="#ffffff" />,
  },
  {
    key: 'mat',
    label: 'Yoga Mat',
    icon: <SquareStack size={40} color="#ffffff" />,
  },
  {
    key: 'bands',
    label: 'Bands',
    icon: <Cable size={40} color="#ffffff" />,
  },
  {
    key: 'pullup_bar',
    label: 'Pull-up Bar',
    icon: <ArrowUpFromDot size={40} color="#ffffff" />,
  },
  {
    key: 'bench',
    label: 'Bench',
    icon: <Armchair size={40} color="#ffffff" />,
  },
  {
    key: 'kettlebell',
    label: 'Kettlebell',
    icon: <Circle size={40} color="#ffffff" />,
  },
];

export default function EquipmentScreen() {
  const router = useRouter();
  const [selected, setSelected] = useState<Set<EquipmentKey>>(
    new Set(['bodyweight'])
  );

  const toggleEquipment = (key: EquipmentKey) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        // Don't allow deselecting bodyweight
        if (key === 'bodyweight') return prev;
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const handleContinue = () => {
    try {
      const equipment = Array.from(selected);
      saveUserEquipment(equipment);
      setOnboardingCompleted();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace('/(tabs)');
    } catch (error) {
      console.error('[Equipment] Save error:', error);
      Alert.alert('Error', 'Failed to save equipment configuration.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={Colors.onSurface} />
        </Pressable>

        <View style={styles.progressDots}>
          <View style={styles.dotInactive} />
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
          <Text style={styles.labelText}>
            CALIBRATE YOUR GENSENTIEL HUD
          </Text>
          <Text style={styles.headlineText}>Equipment Setup</Text>
          <Text style={styles.descText}>
            Select the hardware currently available in your environment to
            generate optimal training protocols.
          </Text>
        </View>

        {/* Equipment Grid */}
        <View style={styles.grid}>
          {EQUIPMENT_OPTIONS.map((item) => {
            const isSelected = selected.has(item.key);
            return (
              <Pressable
                key={item.key}
                style={[
                  styles.card,
                  isSelected && styles.cardSelected,
                ]}
                onPress={() => toggleEquipment(item.key)}
              >
                {isSelected && (
                  <View style={styles.checkIcon}>
                    <CheckCircle2
                      size={18}
                      color={Colors.primaryFixedDim}
                      fill={Colors.primaryFixedDim}
                    />
                  </View>
                )}

                <View
                  style={[
                    styles.iconContainer,
                    !isSelected && { opacity: 0.5 },
                  ]}
                >
                  {item.icon}
                </View>

                <Text
                  style={[
                    styles.cardLabel,
                    !isSelected && styles.cardLabelMuted,
                  ]}
                >
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Environmental Scan Decorative */}
        <View style={styles.scanCard}>
          <View style={styles.scanContent}>
            <Radar size={24} color={Colors.secondaryFixedDim} />
            <View style={styles.scanText}>
              <Text style={styles.scanTitle}>
                ENVIRONMENTAL SCAN ACTIVE
              </Text>
              <Text style={styles.scanSubtitle}>
                {selected.size} item{selected.size !== 1 ? 's' : ''}{' '}
                detected in current sector.
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
          ]}
          onPress={handleContinue}
        >
          <Text style={styles.ctaText}>
            REGENERATE GENSENTIEL PROGRAM
          </Text>
          <ArrowRight size={20} color="#000000" />
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  card: {
    width: '47%',
    aspectRatio: 1,
    backgroundColor: Colors.surfaceContainerLow,
    borderWidth: 2,
    borderColor: Colors.surfaceVariant,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
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
  checkIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  iconContainer: {
    marginBottom: 8,
  },
  cardLabel: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
    letterSpacing: 1.5,
    color: '#ffffff',
    textTransform: 'uppercase',
  },
  cardLabelMuted: {
    color: Colors.onSurfaceVariant,
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
