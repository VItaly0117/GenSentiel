import { StyleSheet, Text, View, ScrollView, Pressable } from 'react-native';
import Svg, { Circle as SvgCircle } from 'react-native-svg';
import {
  Menu,
  RefreshCw,
  TrendingUp,
  Play,
  Dumbbell,
  Clock,
  Zap,
  ChevronRight,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';

const C = {
  black: '#000000',
  surface: '#121414',
  surfaceContainerLow: '#1a1c1c',
  surfaceContainer: '#1e2020',
  surfaceContainerHigh: '#282a2b',
  surfaceVariant: '#333535',
  onSurface: '#e2e2e2',
  onSurfaceVariant: '#c4c9ac',
  primaryContainer: '#c3f400',
  primaryFixedDim: '#abd600',
  onPrimary: '#283500',
  secondaryContainer: '#7701d0',
  secondaryFixedDim: '#dcb8ff',
  tertiaryFixedDim: '#00daf3',
  outlineVariant: '#444933',
  neonGlow: 'rgba(171, 214, 0, 0.4)',
  glassViolet: 'rgba(138, 43, 226, 0.08)',
  glassBorder: 'rgba(138, 43, 226, 0.3)',
};

// CalorieRing component
function CalorieRing({ calories = 842, goal = 1200 }: { calories?: number; goal?: number }) {
  const size = 160;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(calories / goal, 1);
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} style={{ transform: [{ rotate: '-90deg' }] }}>
        {/* Track */}
        <SvgCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={C.surfaceVariant}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress */}
        <SvgCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={C.primaryContainer}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </Svg>
      {/* Center label */}
      <View style={styles.ringCenter}>
        <Text style={styles.ringValue}>{calories}</Text>
        <Text style={styles.ringUnit}>KCAL</Text>
      </View>
    </View>
  );
}

// StatCard inline
function StatCard({
  label,
  value,
  unit,
  accentColor,
}: {
  label: string;
  value: string;
  unit?: string;
  accentColor?: string;
}) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text
        style={[styles.statValue, accentColor ? { color: accentColor } : undefined]}
        adjustsFontSizeToFit
        numberOfLines={1}
      >
        {value}
      </Text>
      {unit && <Text style={styles.statUnit}>{unit}</Text>}
    </View>
  );
}

export default function DashboardScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* App Bar */}
      <View style={styles.appBar}>
        <Pressable style={styles.iconBtn}>
          <Menu size={24} color={C.onSurface} />
        </Pressable>
        <Text style={styles.appTitle}>GenSentiel</Text>
        <Pressable style={styles.iconBtn}>
          <RefreshCw size={20} color={C.onSurfaceVariant} />
        </Pressable>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Card — Daily Output */}
        <View style={styles.heroCard}>
          <Text style={styles.heroLabel}>DAILY OUTPUT</Text>
          <CalorieRing calories={842} goal={1200} />
          <Pressable
            style={({ pressed }) => [
              styles.heroButton,
              pressed && { transform: [{ scale: 0.97 }], opacity: 0.9 },
            ]}
            onPress={() => router.push('/workout')}
          >
            <Play size={18} color="#000000" fill="#000000" />
            <Text style={styles.heroButtonText}>Start Today's Session</Text>
          </Pressable>
        </View>

        {/* Stats Bento Grid */}
        <View style={styles.statsGrid}>
          <StatCard label="WEIGHT" value="82.4" unit="kg" />
          <StatCard
            label="BODY FAT"
            value="14.2"
            unit="%"
            accentColor={C.tertiaryFixedDim}
          />
          <StatCard
            label="STREAK"
            value="12"
            unit="days"
            accentColor={C.primaryFixedDim}
          />
          <StatCard label="THIS WEEK" value="4/5" unit="sessions" />
        </View>

        {/* Progression Alert */}
        <View style={styles.alertCard}>
          <View style={styles.alertRow}>
            <View style={styles.alertIconBg}>
              <TrendingUp size={20} color={C.primaryFixedDim} />
            </View>
            <View style={styles.alertTextContainer}>
              <Text style={styles.alertTitle}>PROGRESSION ALERT</Text>
              <Text style={styles.alertSubtitle}>
                Push-up volume increased 5% this week
              </Text>
            </View>
            <Pressable style={styles.alertViewBtn} onPress={() => router.push('/(tabs)/history')}>
              <Text style={styles.alertViewText}>View</Text>
            </Pressable>
          </View>
        </View>

        {/* Last Workout */}
        <View style={styles.lastWorkoutCard}>
          <View style={styles.lastWorkoutHeader}>
            <Text style={styles.sectionTitle}>LAST MISSION</Text>
            <View style={styles.yesterdayBadge}>
              <Text style={styles.yesterdayText}>Yesterday</Text>
            </View>
          </View>
          <Text style={styles.workoutName}>
            Full Body Protocol Alpha
          </Text>
          <View style={styles.workoutStats}>
            <View style={styles.workoutStatItem}>
              <Dumbbell size={14} color={C.onSurfaceVariant} />
              <Text style={styles.workoutStatText}>6 Exercises</Text>
            </View>
            <View style={styles.dotSep} />
            <View style={styles.workoutStatItem}>
              <Clock size={14} color={C.onSurfaceVariant} />
              <Text style={styles.workoutStatText}>45 min</Text>
            </View>
            <View style={styles.dotSep} />
            <View style={styles.workoutStatItem}>
              <Zap size={14} color={C.onSurfaceVariant} />
              <Text style={styles.workoutStatText}>12,000 kg</Text>
            </View>
          </View>
          <Pressable style={styles.viewWorkoutRow} onPress={() => router.push('/history')}>
            <Text style={styles.viewWorkoutText}>View Details</Text>
            <ChevronRight size={16} color={C.primaryFixedDim} />
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.black,
  },
  appBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    height: 56,
  },
  iconBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  appTitle: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 20,
    color: C.primaryContainer,
    letterSpacing: 2,
  },
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
    gap: 16,
  },

  // Hero
  heroCard: {
    backgroundColor: C.glassViolet,
    borderWidth: 1,
    borderColor: C.glassBorder,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    gap: 20,
  },
  heroLabel: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
    letterSpacing: 1.5,
    color: C.secondaryFixedDim,
    textTransform: 'uppercase',
  },
  ringCenter: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringValue: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 42,
    color: '#ffffff',
    letterSpacing: 2,
  },
  ringUnit: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 11,
    color: C.onSurfaceVariant,
    letterSpacing: 1.5,
    marginTop: -2,
  },
  heroButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: C.primaryContainer,
    height: 48,
    borderRadius: 12,
    paddingHorizontal: 32,
    shadowColor: C.primaryContainer,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  heroButtonText: {
    fontFamily: 'SpaceGrotesk_600SemiBold',
    fontSize: 16,
    color: '#000000',
    letterSpacing: 0.5,
  },

  // Stats
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    width: '47%',
    backgroundColor: C.surfaceContainerLow,
    borderWidth: 1,
    borderColor: C.surfaceVariant,
    borderRadius: 16,
    padding: 16,
    gap: 4,
  },
  statLabel: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 11,
    letterSpacing: 1.5,
    color: C.onSurfaceVariant,
    textTransform: 'uppercase',
  },
  statValue: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 28,
    color: '#ffffff',
    letterSpacing: 1,
  },
  statUnit: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: C.onSurfaceVariant,
  },

  // Alert
  alertCard: {
    backgroundColor: C.surfaceContainerLow,
    borderWidth: 1,
    borderColor: C.outlineVariant,
    borderRadius: 12,
    padding: 16,
  },
  alertRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  alertIconBg: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: 'rgba(171, 214, 0, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertTextContainer: {
    flex: 1,
  },
  alertTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 11,
    letterSpacing: 1.5,
    color: C.primaryFixedDim,
    textTransform: 'uppercase',
  },
  alertSubtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: C.onSurfaceVariant,
    marginTop: 2,
  },
  alertViewBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: C.outlineVariant,
    borderRadius: 8,
  },
  alertViewText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
    color: C.primaryFixedDim,
    letterSpacing: 0.5,
  },

  // Last Workout
  lastWorkoutCard: {
    backgroundColor: C.surfaceContainerLow,
    borderWidth: 1,
    borderColor: C.surfaceVariant,
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  lastWorkoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 11,
    letterSpacing: 1.5,
    color: C.onSurfaceVariant,
    textTransform: 'uppercase',
  },
  yesterdayBadge: {
    backgroundColor: 'rgba(171, 214, 0, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  yesterdayText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 11,
    color: C.primaryFixedDim,
    letterSpacing: 0.5,
  },
  workoutName: {
    fontFamily: 'SpaceGrotesk_600SemiBold',
    fontSize: 20,
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  workoutStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  workoutStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  workoutStatText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: C.onSurfaceVariant,
  },
  dotSep: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: C.outlineVariant,
  },
  viewWorkoutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
    paddingTop: 4,
  },
  viewWorkoutText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 13,
    color: C.primaryFixedDim,
    letterSpacing: 0.5,
  },
});
