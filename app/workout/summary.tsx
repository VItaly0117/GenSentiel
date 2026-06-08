import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { CheckCircle, Clock, Dumbbell, ListOrdered, Trophy, Lightbulb } from 'lucide-react-native';
import { getDb } from '../../src/db/database';
import { getWorkoutStats, analyzeProgression, ProgressionSuggestion } from '../../src/utils/progressionEngine';

const Colors = {
  black: '#000000',
  primaryContainer: '#c3f400',
  surfaceContainerLow: '#1a1c1c',
  surfaceVariant: '#333535',
  outlineVariant: '#444933',
  onSurface: '#e2e2e2',
  onSurfaceVariant: '#c4c9ac',
  neonGlow: 'rgba(195, 244, 0, 0.4)',
};

export default function WorkoutSummaryScreen() {
  const { workoutId } = useLocalSearchParams();
  const router = useRouter();
  
  const [workout, setWorkout] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [suggestions, setSuggestions] = useState<Array<{ name: string, suggestion: ProgressionSuggestion }>>([]);

  useEffect(() => {
    if (!workoutId) return;
    const db = getDb();
    
    const w = db.getFirstSync<any>('SELECT name FROM workouts WHERE id = ?', [workoutId]);
    setWorkout(w);

    const s = getWorkoutStats(String(workoutId));
    setStats(s);

    // Get exercises from this workout
    const exList = db.getAllSync<any>(`
      SELECT DISTINCT e.id, e.name, e.set_type
      FROM workout_sets ws
      JOIN exercises e ON e.id = ws.exercise_id
      WHERE ws.workout_id = ? AND ws.completed = 1
    `, [workoutId]);

    const suggs = [];
    for (const ex of exList) {
      const p = analyzeProgression(ex.id, ex.set_type);
      if (p) {
        suggs.push({ name: ex.name, suggestion: p });
      }
    }
    setSuggestions(suggs);
  }, [workoutId]);

  const formatDuration = (s: number) => {
    const m = Math.floor(s / 60);
    const secs = s % 60;
    return `${m}:${secs.toString().padStart(2, '0')}`;
  };

  if (!workout || !stats) return <View style={styles.container} />;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header Celebration */}
      <View style={styles.header}>
        <View style={styles.checkCircle}>
          <CheckCircle size={48} color={Colors.black} />
        </View>
        <Text style={styles.title}>MISSION COMPLETE</Text>
        <Text style={styles.subtitle}>{workout.name}</Text>
      </View>

      {/* Stats Bento */}
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <View style={styles.statIconRow}>
            <Clock size={16} color={Colors.onSurfaceVariant} />
            <Text style={styles.statLabel}>DURATION</Text>
          </View>
          <Text style={styles.statValue}>{formatDuration(stats.duration)}</Text>
        </View>

        <View style={styles.statCard}>
          <View style={styles.statIconRow}>
            <Dumbbell size={16} color={Colors.onSurfaceVariant} />
            <Text style={styles.statLabel}>VOLUME</Text>
          </View>
          <Text style={styles.statValue}>{stats.totalVolume.toLocaleString()} <Text style={styles.statUnit}>KG</Text></Text>
        </View>

        <View style={styles.statCard}>
          <View style={styles.statIconRow}>
            <ListOrdered size={16} color={Colors.onSurfaceVariant} />
            <Text style={styles.statLabel}>SETS</Text>
          </View>
          <Text style={styles.statValue}>{stats.totalSets}</Text>
        </View>

        <View style={[styles.statCard, styles.statCardAccent]}>
          <View style={styles.statIconRow}>
            <Trophy size={16} color={Colors.primaryContainer} />
            <Text style={[styles.statLabel, { color: Colors.primaryContainer }]}>RECORDS</Text>
          </View>
          <Text style={[styles.statValue, { color: Colors.primaryContainer }]}>{stats.prs}</Text>
        </View>
      </View>

      {/* Progressions */}
      <Text style={styles.sectionTitle}>PROGRESSION INTEL</Text>
      
      {suggestions.length === 0 ? (
        <View style={styles.emptySuggestions}>
          <Text style={styles.emptyText}>Keep pushing. Progressions unlock with more data.</Text>
        </View>
      ) : (
        <View style={styles.suggestionsList}>
          {suggestions.map((s, idx) => (
            <View key={idx} style={styles.suggestionCard}>
              <View style={styles.suggIconBox}>
                <Lightbulb size={20} color={Colors.primaryContainer} />
              </View>
              <View style={styles.suggContent}>
                <Text style={styles.suggTitle}>{s.name}</Text>
                <Text style={styles.suggDesc}>{s.suggestion.message}</Text>
              </View>
            </View>
          ))}
        </View>
      )}

      <Pressable style={styles.returnBtn} onPress={() => router.replace('/(tabs)/workout')}>
        <Text style={styles.returnBtnText}>RETURN TO HQ</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
  },
  content: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  checkCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: Colors.neonGlow,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 10,
  },
  title: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 28,
    color: '#ffffff',
    letterSpacing: 2,
  },
  subtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    color: Colors.onSurfaceVariant,
    marginTop: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 40,
  },
  statCard: {
    width: '47%',
    backgroundColor: Colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: Colors.surfaceVariant,
    borderRadius: 12,
    padding: 16,
  },
  statCardAccent: {
    borderColor: 'rgba(195, 244, 0, 0.3)',
    backgroundColor: 'rgba(195, 244, 0, 0.05)',
  },
  statIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  statLabel: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 10,
    color: Colors.onSurfaceVariant,
    letterSpacing: 1.5,
  },
  statValue: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 28,
    color: Colors.onSurface,
  },
  statUnit: {
    fontSize: 14,
    color: Colors.onSurfaceVariant,
  },
  sectionTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: Colors.onSurfaceVariant,
    letterSpacing: 1.5,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surfaceVariant,
    paddingBottom: 8,
    marginBottom: 16,
  },
  emptySuggestions: {
    backgroundColor: Colors.surfaceContainerLow,
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 32,
  },
  emptyText: {
    fontFamily: 'Inter_400Regular',
    color: Colors.onSurfaceVariant,
  },
  suggestionsList: {
    gap: 12,
    marginBottom: 40,
  },
  suggestionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(195, 244, 0, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(195, 244, 0, 0.3)',
    padding: 16,
    borderRadius: 12,
  },
  suggIconBox: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: 'rgba(195, 244, 0, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  suggContent: {
    flex: 1,
  },
  suggTitle: {
    fontFamily: 'SpaceGrotesk_600SemiBold',
    fontSize: 16,
    color: '#ffffff',
    marginBottom: 4,
  },
  suggDesc: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: Colors.onSurfaceVariant,
  },
  returnBtn: {
    backgroundColor: Colors.primaryContainer,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  returnBtnText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: Colors.black,
    letterSpacing: 1.5,
  },
});
