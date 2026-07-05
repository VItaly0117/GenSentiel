import { useCallback, useState } from 'react';
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
import { useRouter, useFocusEffect } from 'expo-router';
import { getDb } from '../../src/db/database';
import { getDayNutrition } from '../../src/db/repositories/nutrition';
import { getBodyMetricsHistory } from '../../src/db/repositories/nutrition';

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

function CalorieRing({ calories = 0, goal = 2500 }: { calories?: number; goal?: number }) {
  const size = 160;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(calories / goal, 1);
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} style={{ transform: [{ rotate: '-90deg' }] }}>
        <SvgCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={C.surfaceVariant}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
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
      <View style={styles.ringCenter}>
        <Text style={styles.ringValue}>{calories}</Text>
        <Text style={styles.ringUnit}>KCAL</Text>
      </View>
    </View>
  );
}

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

function calcStreak(db: ReturnType<typeof getDb>): number {
  const rows = db.getAllSync<{ day: string }>(`
    SELECT DISTINCT date(started_at) as day
    FROM workouts
    WHERE finished_at IS NOT NULL
    ORDER BY day DESC
    LIMIT 60
  `);
  if (rows.length === 0) return 0;

  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < rows.length; i++) {
    const d = new Date(rows[i].day);
    const expected = new Date(today);
    expected.setDate(today.getDate() - i);
    if (d.toDateString() === expected.toDateString()) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

function calcWeekSessions(db: ReturnType<typeof getDb>): number {
  const monday = new Date();
  monday.setHours(0, 0, 0, 0);
  monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
  const y = monday.getFullYear();
  const m = String(monday.getMonth() + 1).padStart(2, '0');
  const d = String(monday.getDate()).padStart(2, '0');
  const mondayStr = `${y}-${m}-${d}`;

  const row = db.getFirstSync<{ cnt: number }>(`
    SELECT COUNT(*) as cnt
    FROM workouts
    WHERE finished_at IS NOT NULL AND date(started_at) >= ?
  `, [mondayStr]);
  return row?.cnt ?? 0;
}

export default function DashboardScreen() {
  const router = useRouter();
  const [calories, setCalories] = useState(0);
  const [weight, setWeight] = useState<string>('--');
  const [bodyFat, setBodyFat] = useState<string>('--');
  const [streak, setStreak] = useState(0);
  const [weekSessions, setWeekSessions] = useState(0);
  const [lastWorkout, setLastWorkout] = useState<any>(null);
  const [lastWorkoutStats, setLastWorkoutStats] = useState<{ exercises: number; duration: number; volume: number } | null>(null);

  const loadData = useCallback(() => {
    const db = getDb();
    const today = new Date().toISOString().split('T')[0];

    // Calories today
    const logs = getDayNutrition(today);
    const totalCals = logs.reduce((sum, l) => sum + l.calories, 0);
    setCalories(totalCals);

    // Latest body metrics
    const metrics = getBodyMetricsHistory(1);
    const latest = metrics[0];
    setWeight(latest?.weight_kg != null ? latest.weight_kg.toFixed(1) : '--');
    setBodyFat(latest?.body_fat_pct != null ? latest.body_fat_pct.toFixed(1) : '--');

    // Streak
    setStreak(calcStreak(db));

    // This week
    setWeekSessions(calcWeekSessions(db));

    // Last workout
    const lw = db.getFirstSync<any>(`
      SELECT id, name, started_at, duration_s
      FROM workouts
      WHERE finished_at IS NOT NULL
      ORDER BY started_at DESC
      LIMIT 1
    `);
    setLastWorkout(lw ?? null);

    if (lw) {
      const stats = db.getFirstSync<any>(`
        SELECT
          COUNT(DISTINCT exercise_id) as exercises,
          SUM(weight_kg * reps) as volume
        FROM workout_sets
        WHERE workout_id = ? AND completed = 1
      `, [lw.id]);
      setLastWorkoutStats({
        exercises: stats?.exercises ?? 0,
        duration: lw.duration_s ?? 0,
        volume: stats?.volume ?? 0,
      });
    } else {
      setLastWorkoutStats(null);
    }
  }, []);

  useFocusEffect(loadData);

  const formatLastWorkoutDate = (isoStr: string) => {
    const d = new Date(isoStr);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - d.getTime()) / 86400000);
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays}d ago`;
  };

  const formatDuration = (s: number) => `${Math.floor(s / 60)} min`;

  const formatVolume = (v: number) => {
    if (v >= 1000) return `${(v / 1000).toFixed(1)}k kg`;
    return `${Math.round(v)} kg`;
  };

  return (
    <View style={styles.container}>
      {/* App Bar */}
      <View style={styles.appBar}>
        <Pressable style={styles.iconBtn}>
          <Menu size={24} color={C.onSurface} />
        </Pressable>
        <Text style={styles.appTitle}>GenSentiel</Text>
        <Pressable style={styles.iconBtn} onPress={loadData}>
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
          <CalorieRing calories={calories} goal={2500} />
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
          <StatCard label="WEIGHT" value={weight} unit={weight !== '--' ? 'kg' : undefined} />
          <StatCard
            label="BODY FAT"
            value={bodyFat}
            unit={bodyFat !== '--' ? '%' : undefined}
            accentColor={C.tertiaryFixedDim}
          />
          <StatCard
            label="STREAK"
            value={String(streak)}
            unit="days"
            accentColor={C.primaryFixedDim}
          />
          <StatCard label="THIS WEEK" value={String(weekSessions)} unit="sessions" />
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
                Check your history for progression suggestions
              </Text>
            </View>
            <Pressable style={styles.alertViewBtn} onPress={() => router.push('/(tabs)/history')}>
              <Text style={styles.alertViewText}>View</Text>
            </Pressable>
          </View>
        </View>

        {/* Last Workout */}
        {lastWorkout ? (
          <View style={styles.lastWorkoutCard}>
            <View style={styles.lastWorkoutHeader}>
              <Text style={styles.sectionTitle}>LAST MISSION</Text>
              <View style={styles.yesterdayBadge}>
                <Text style={styles.yesterdayText}>{formatLastWorkoutDate(lastWorkout.started_at)}</Text>
              </View>
            </View>
            <Text style={styles.workoutName}>{lastWorkout.name}</Text>
            <View style={styles.workoutStats}>
              {lastWorkoutStats && lastWorkoutStats.exercises > 0 && (
                <>
                  <View style={styles.workoutStatItem}>
                    <Dumbbell size={14} color={C.onSurfaceVariant} />
                    <Text style={styles.workoutStatText}>{lastWorkoutStats.exercises} Exercises</Text>
                  </View>
                  <View style={styles.dotSep} />
                </>
              )}
              <View style={styles.workoutStatItem}>
                <Clock size={14} color={C.onSurfaceVariant} />
                <Text style={styles.workoutStatText}>{formatDuration(lastWorkoutStats?.duration ?? 0)}</Text>
              </View>
              {lastWorkoutStats && lastWorkoutStats.volume > 0 && (
                <>
                  <View style={styles.dotSep} />
                  <View style={styles.workoutStatItem}>
                    <Zap size={14} color={C.onSurfaceVariant} />
                    <Text style={styles.workoutStatText}>{formatVolume(lastWorkoutStats.volume)}</Text>
                  </View>
                </>
              )}
            </View>
            <Pressable style={styles.viewWorkoutRow} onPress={() => router.push('/(tabs)/history')}>
              <Text style={styles.viewWorkoutText}>View Details</Text>
              <ChevronRight size={16} color={C.primaryFixedDim} />
            </Pressable>
          </View>
        ) : (
          <View style={styles.lastWorkoutCard}>
            <Text style={styles.sectionTitle}>LAST MISSION</Text>
            <Text style={[styles.workoutStatText, { marginTop: 8 }]}>No workouts logged yet. Start your first session!</Text>
          </View>
        )}
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
