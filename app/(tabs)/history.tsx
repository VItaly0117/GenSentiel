import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Star } from 'lucide-react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { getDb } from '../../src/db/database';
import { useTranslation } from '../../src/i18n/useTranslation';

const Colors = {
  black: '#000000',
  primaryContainer: '#c3f400',
  surfaceContainerLow: '#1a1c1c',
  surfaceVariant: '#333535',
  outlineVariant: '#444933',
  onSurface: '#e2e2e2',
  onSurfaceVariant: '#c4c9ac',
  cardBg: '#111111',
  cardBorder: '#2A2A2A',
  prGold: '#FFD700',
};

const FILTERS = ['allTime', 'thisMonth'] as const;

export default function HistoryScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const [filter, setFilter] = useState<typeof FILTERS[number]>('allTime');
  const [stats, setStats] = useState({ sessions: 0, volume: 0, prs: 0, exercises: 0 });
  const [workouts, setWorkouts] = useState<any[]>([]);

  useFocusEffect(useCallback(() => { loadHistory(); }, [filter]));

  const loadHistory = () => {
    const db = getDb();
    
    // Calculate date filter
    let dateFilter = '';
    const now = new Date();
    if (filter === 'thisMonth') {
      const y = now.getFullYear();
      const m = String(now.getMonth() + 1).padStart(2, '0');
      dateFilter = `AND w.started_at >= '${y}-${m}-01'`;
    }

    // Load Stats
    const statsQuery = `
      SELECT 
        COUNT(DISTINCT w.id) as sessions,
        SUM(ws.weight_kg * ws.reps) as volume,
        COUNT(DISTINCT ws.exercise_id) as exercises
      FROM workouts w
      LEFT JOIN workout_sets ws ON w.id = ws.workout_id AND ws.completed = 1
      WHERE w.finished_at IS NOT NULL ${dateFilter}
    `;
    const s = db.getFirstSync<any>(statsQuery);
    
    setStats({
      sessions: s?.sessions || 0,
      volume: s?.volume || 0,
      prs: 0, // Placeholder
      exercises: s?.exercises || 0,
    });

    // Load Workouts
    const workoutsQuery = `
      SELECT 
        w.id, w.name, w.started_at, w.duration_s,
        COUNT(ws.id) as sets,
        SUM(ws.weight_kg * ws.reps) as volume,
        t.split_type
      FROM workouts w
      LEFT JOIN workout_sets ws ON w.id = ws.workout_id AND ws.completed = 1
      LEFT JOIN workout_templates t ON w.template_id = t.id
      WHERE w.finished_at IS NOT NULL ${dateFilter}
      GROUP BY w.id
      ORDER BY w.started_at DESC
      LIMIT 50
    `;
    const w = db.getAllSync<any>(workoutsQuery);
    setWorkouts(w);
  };

  const formatDuration = (s: number) => {
    const m = Math.floor(s / 60);
    return `${m}m`;
  };

  const formatDate = (isoStr: string) => {
    const d = new Date(isoStr);
    const months = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
    return `${months[d.getMonth()]} ${d.getDate()}`;
  };

  const formatVolume = (v: number) => {
    if (!v) return '0';
    if (v >= 1000) return (v / 1000).toFixed(1) + 'k';
    return v.toString();
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{t('history.title')}</Text>
          <Text style={styles.subtitle}>{t('history.subtitle')}</Text>
        </View>

        {/* Filters */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersScroll}>
          {FILTERS.map(f => (
            <Pressable
              key={f}
              style={[styles.filterChip, filter === f && styles.filterChipActive]}
              onPress={() => setFilter(f)}
            >
              <Text style={[styles.filterChipText, filter === f && styles.filterChipTextActive]}>
                {t(`history.${f === 'allTime' ? 'allTime' : 'thisMonth'}`)}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Summary Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>{t('history.totalSessions')}</Text>
            <Text style={styles.statValue}>{stats.sessions}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>{t('history.totalVolume')}</Text>
            <Text style={styles.statValue}>{formatVolume(stats.volume)}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>{t('history.prsHit')}</Text>
            <Text style={[styles.statValue, { color: Colors.primaryContainer }]}>{stats.prs}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>{t('history.exercises')}</Text>
            <Text style={styles.statValue}>{stats.exercises}</Text>
          </View>
        </View>

        {/* Workout List */}
        <View style={styles.listContainer}>
          {workouts.length === 0 ? (
            <Text style={styles.emptyText}>{t('history.noHistory')}</Text>
          ) : (
            workouts.map((w) => (
              <Pressable
                key={w.id}
                style={styles.card}
                onPress={() => router.push(`/workout/summary?workoutId=${w.id}`)}
              >
                <View style={styles.cardHeader}>
                  <View>
                    <View style={styles.cardTags}>
                      <View style={styles.tagBox}>
                        <Text style={styles.tagText}>{w.split_type?.replace('_', ' ') || t('history.custom')}</Text>
                      </View>
                      <Text style={styles.dateText}>{formatDate(w.started_at)}</Text>
                    </View>
                    <Text style={styles.cardTitle}>{w.name}</Text>
                  </View>
                  <Text style={styles.durationText}>{formatDuration(w.duration_s || 0)}</Text>
                </View>

                <View style={styles.cardMetrics}>
                  <View style={styles.metricCol}>
                    <Text style={styles.metricLabel}>{t('history.volume')}</Text>
                    <Text style={styles.metricValue}>{w.volume || 0} kg</Text>
                  </View>
                  <View style={styles.metricCol}>
                    <Text style={styles.metricLabel}>{t('history.sets')}</Text>
                    <Text style={styles.metricValue}>{w.sets}</Text>
                  </View>
                  {w.volume > 5000 && (
                    <View style={[styles.metricCol, { alignItems: 'flex-end' }]}>
                      <View style={styles.prRow}>
                        <Star size={12} color={Colors.prGold} fill={Colors.prGold} />
                        <Text style={styles.prLabel}>{t('history.highVolume')}</Text>
                      </View>
                      <Text style={styles.metricValue}>{t('history.greatJob')}</Text>
                    </View>
                  )}
                </View>
              </Pressable>
            ))
          )}
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 28,
    color: '#ffffff',
    letterSpacing: 2,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    color: Colors.onSurfaceVariant,
  },
  filtersScroll: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.surfaceVariant,
    backgroundColor: Colors.cardBg,
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: Colors.primaryContainer,
    borderColor: Colors.primaryContainer,
  },
  filterChipText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
    color: Colors.onSurface,
    textTransform: 'uppercase',
  },
  filterChipTextActive: {
    color: Colors.black,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 32,
  },
  statBox: {
    width: '47%',
    backgroundColor: Colors.cardBg,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    borderRadius: 8,
    padding: 16,
  },
  statLabel: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 10,
    color: Colors.onSurfaceVariant,
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  statValue: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 32,
    color: Colors.onSurface,
  },
  listContainer: {
    gap: 16,
  },
  emptyText: {
    fontFamily: 'Inter_400Regular',
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    marginTop: 20,
  },
  card: {
    backgroundColor: Colors.cardBg,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    borderRadius: 12,
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  cardTags: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  tagBox: {
    backgroundColor: Colors.cardBorder,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  tagText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 10,
    color: Colors.onSurface,
    textTransform: 'uppercase',
  },
  dateText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 10,
    color: Colors.onSurfaceVariant,
    textTransform: 'uppercase',
  },
  cardTitle: {
    fontFamily: 'SpaceGrotesk_600SemiBold',
    fontSize: 18,
    color: '#ffffff',
  },
  durationText: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 24,
    color: Colors.onSurface,
  },
  cardMetrics: {
    flexDirection: 'row',
    gap: 16,
  },
  metricCol: {
    flex: 1,
  },
  metricLabel: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 10,
    color: Colors.onSurfaceVariant,
    letterSpacing: 1,
    marginBottom: 2,
  },
  metricValue: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    color: '#ffffff',
  },
  prRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  prLabel: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 10,
    color: Colors.prGold,
    letterSpacing: 1,
  },
});
