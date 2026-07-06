import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, Alert, SafeAreaView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { X, SkipForward, Plus } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

import { getDb } from '../../src/db/database';
import { useWorkoutStore } from '../../src/stores/workoutStore';
import { useTimerStore } from '../../src/stores/timerStore';
import { useSaveWorkout } from '../../src/hooks/useSaveWorkout';

import { ExerciseCard } from '../../src/components/workout/ExerciseCard';
import { RestTimerFloat } from '../../src/components/workout/RestTimerFloat';

const Colors = {
  black: '#000000',
  primaryContainer: '#c3f400',
  surfaceContainerLowest: '#0c0f0f',
  surfaceVariant: '#333535',
  onSurface: '#e2e2e2',
  onSurfaceVariant: '#c4c9ac',
};

export default function ActiveWorkoutScreen() {
  const router = useRouter();
  const { templateId, type } = useLocalSearchParams();
  const {
    startWorkout,
    finishWorkout,
    resetWorkout,
    exercises,
    sets,
    name,
    startedAt,
    completeSet,
    updateSet,
    addSet
  } = useWorkoutStore();
  const { saveWorkout } = useSaveWorkout();
  const { seconds, totalSeconds, isRunning, startTimer, stopTimer, tick } = useTimerStore();

  const listRef = useRef<FlatList>(null);
  const [clock, setClock] = useState('0:00');
  const [initDone, setInitDone] = useState(false);

  // Initialize workout
  useEffect(() => {
    if (initDone) return;
    
    const db = getDb();
    let loadedExercises: any[] = [];
    let workoutName = 'Custom Session';

    if (templateId) {
      const tmpl = db.getFirstSync<any>('SELECT name FROM workout_templates WHERE id = ?', [templateId as string]);
      if (tmpl) workoutName = tmpl.name;

      loadedExercises = db.getAllSync<any>(`
        SELECT e.id, e.name, e.name_ru as nameRu, e.set_type as setType, e.muscle_group as muscleGroup
        FROM template_exercises te
        JOIN exercises e ON e.id = te.exercise_id
        WHERE te.template_id = ?
        ORDER BY te.order_index ASC
      `, [templateId as string]);
    }

    startWorkout(templateId ? String(templateId) : null, workoutName, loadedExercises);
    setInitDone(true);
  }, [templateId, type]);

  // Workout Clock
  useEffect(() => {
    if (!startedAt) return;
    
    const interval = setInterval(() => {
      const diff = Math.floor((new Date().getTime() - new Date(startedAt).getTime()) / 1000);
      const m = Math.floor(diff / 60);
      const s = diff % 60;
      setClock(`${m}:${s.toString().padStart(2, '0')}`);
    }, 1000);
    
    return () => clearInterval(interval);
  }, [startedAt]);

  // Rest Timer ticking + completion haptic
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      const { seconds: current } = useTimerStore.getState();
      tick();
      if (current === 1) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning]);

  const handleEnd = () => {
    Alert.alert('End Mission?', 'Are you sure you want to end this workout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'End', style: 'destructive', onPress: () => {
          stopTimer();
          resetWorkout();
          router.replace('/(tabs)/workout');
        }
      }
    ]);
  };

  const handleCompleteMission = () => {
    Alert.alert('Complete Mission', 'Save workout and return to HQ?', [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Complete', 
        onPress: async () => {
          stopTimer();
          finishWorkout();
          try {
            const wid = await saveWorkout();
            router.replace(`/workout/summary?workoutId=${wid}`);
          } catch (e) {
            console.error('Failed to save workout', e);
            router.replace('/(tabs)/workout');
          }
        } 
      }
    ]);
  };

  const onCompleteSet = (exerciseId: string, setNumber: number) => {
    completeSet(exerciseId, setNumber);
    startTimer(60); // Default 60s rest
  };

  const onUpdateSet = (exerciseId: string, setNumber: number, data: any) => {
    updateSet(exerciseId, setNumber, data);
  };

  const onAddSet = (exerciseId: string) => {
    addSet(exerciseId);
  };

  const handleSkipToNext = () => {
    if (isRunning) stopTimer();

    // Find last exercise where every set is done, then jump to first incomplete after it
    const lastFullyDoneIdx = exercises.reduce((last, ex, idx) => {
      const exSets = sets.filter((s) => s.exerciseId === ex.id);
      return exSets.length > 0 && exSets.every((s) => s.completed) ? idx : last;
    }, -1);

    const nextIdx = exercises.findIndex(
      (ex, idx) =>
        idx > lastFullyDoneIdx && sets.some((s) => s.exerciseId === ex.id && !s.completed),
    );

    if (nextIdx >= 0) {
      listRef.current?.scrollToIndex({ index: nextIdx, animated: true });
    }
  };

  // Calculate global progress
  const totalCompletedSets = sets.filter(s => s.completed).length;
  const progressPercent = sets.length > 0 ? (totalCompletedSets / sets.length) * 100 : 0;

  return (
    <SafeAreaView style={styles.container}>
      {/* HUD Top Bar */}
      <View style={styles.topBar}>
        <View style={styles.topBarInner}>
          <Pressable style={styles.topBtn} onPress={handleEnd}>
            <X size={20} color={Colors.onSurface} />
            <Text style={styles.endText}>END</Text>
          </Pressable>
          <View style={styles.centerTitles}>
            <Text style={styles.topSubtitle}>{clock}</Text>
            <Text style={styles.topTitle}>{name}</Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <Pressable style={styles.topBtn} onPress={() => router.push('/workout/exercise-picker')}>
              <Plus size={20} color={Colors.onSurface} />
            </Pressable>
            <Pressable style={styles.topBtn} onPress={handleSkipToNext}>
              <SkipForward size={20} color={Colors.onSurface} />
            </Pressable>
          </View>
        </View>
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
        </View>
      </View>

      <FlatList
        ref={listRef}
        data={exercises}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        onScrollToIndexFailed={(info) => {
            const offset = info.averageItemLength * info.index;
            listRef.current?.scrollToOffset({ offset, animated: true });
          }}
        renderItem={({ item, index }) => {
          const exerciseSets = sets.filter((s) => s.exerciseId === item.id);
          return (
            <ExerciseCard
              exerciseName={item.nameRu || item.name}
              muscleGroup={item.muscleGroup.toUpperCase()}
              setType={item.setType as any}
              sets={exerciseSets}
              onUpdateSet={(num, data) => onUpdateSet(item.id, num, data)}
              onCompleteSet={(num) => onCompleteSet(item.id, num)}
              onAddSet={() => onAddSet(item.id)}
            />
          );
        }}
        ListEmptyComponent={
          <Pressable
            style={styles.emptyState}
            onPress={() => router.push('/workout/exercise-picker')}
          >
            <Plus size={28} color={Colors.primaryContainer} />
            <Text style={styles.emptyStateText}>TAP TO ADD EXERCISES</Text>
          </Pressable>
        }
        ListFooterComponent={
          <Pressable style={styles.completeBtn} onPress={handleCompleteMission}>
            <Text style={styles.completeBtnText}>COMPLETE MISSION</Text>
          </Pressable>
        }
      />

      <RestTimerFloat
        visible={isRunning}
        seconds={seconds}
        totalSeconds={totalSeconds}
        onSubtract10={() => startTimer(Math.max(1, seconds - 10))}
        onSkip={stopTimer}
        onAdd30={() => startTimer(seconds + 30)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surfaceContainerLowest,
  },
  topBar: {
    backgroundColor: 'rgba(12, 15, 15, 0.9)',
    borderBottomWidth: 1,
    borderBottomColor: Colors.surfaceVariant,
  },
  topBarInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    height: 56,
  },
  topBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  endText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
    color: Colors.onSurfaceVariant,
    letterSpacing: 1,
  },
  centerTitles: {
    alignItems: 'center',
  },
  topSubtitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
    color: Colors.onSurfaceVariant,
    letterSpacing: 1,
  },
  topTitle: {
    fontFamily: 'SpaceGrotesk_600SemiBold',
    fontSize: 18,
    color: Colors.primaryContainer,
  },
  progressBarBg: {
    height: 4,
    backgroundColor: Colors.surfaceVariant,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.primaryContainer,
    shadowColor: 'rgba(195, 244, 0, 0.5)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 8,
  },
  listContent: {
    padding: 20,
    paddingBottom: 180,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: 16,
    borderWidth: 1,
    borderColor: 'rgba(195, 244, 0, 0.3)',
    borderStyle: 'dashed',
    borderRadius: 16,
    marginBottom: 16,
  },
  emptyStateText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: Colors.primaryContainer,
    letterSpacing: 2,
  },
  completeBtn: {
    backgroundColor: Colors.primaryContainer,
    height: 56,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  completeBtnText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: Colors.black,
    letterSpacing: 1.5,
  },
});
