import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Lightbulb } from 'lucide-react-native';
import { SetRow } from './SetRow';

const Colors = {
  black: '#000000',
  primaryContainer: '#c3f400',
  secondary: '#dcb8ff',
  secondaryContainer: '#7701d0',
  surfaceContainerHigh: '#282a2b',
  surfaceVariant: '#333535',
  onSurface: '#e2e2e2',
  onSurfaceVariant: '#c4c9ac',
  glassVioletBg: 'rgba(119, 1, 208, 0.08)',
  glassVioletBorder: 'rgba(220, 184, 255, 0.15)',
};

interface ExerciseCardProps {
  exerciseName: string;
  muscleGroup: string;
  setType: 'weight_reps' | 'reps_only' | 'timed' | 'band_reps';
  sets: Array<{
    setNumber: number;
    weightKg?: number;
    reps?: number;
    timeS?: number;
    bandLevel?: 'light' | 'medium' | 'heavy' | 'extra_heavy';
    completed: boolean;
  }>;
  previousBest?: string;
  instructions?: string;
  onUpdateSet: (setNumber: number, data: any) => void;
  onCompleteSet: (setNumber: number) => void;
  onAddSet: () => void;
}

export function ExerciseCard({
  exerciseName,
  muscleGroup,
  setType,
  sets,
  previousBest,
  instructions,
  onUpdateSet,
  onCompleteSet,
  onAddSet,
}: ExerciseCardProps) {
  // Find the first uncompleted set to mark as active
  const activeSetNumber = sets.find((s) => !s.completed)?.setNumber;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{exerciseName}</Text>
          <Text style={styles.subtitle}>{muscleGroup} Focus</Text>
        </View>
        
        {previousBest && (
          <View style={styles.prevBadge}>
            <Text style={styles.prevBadgeLabel}>PREV BEST</Text>
            <Text style={styles.prevBadgeValue}>{previousBest}</Text>
          </View>
        )}
      </View>

      {instructions && (
        <View style={styles.instructionsBox}>
          <Lightbulb size={16} color={Colors.secondary} />
          <Text style={styles.instructionsText}>{instructions}</Text>
        </View>
      )}

      <View style={styles.tableHeader}>
        <Text style={[styles.th, { flex: 2 }]}>SET</Text>
        <Text style={[styles.th, { flex: 3 }]}>LOAD</Text>
        <Text style={[styles.th, { flex: 3 }]}>REPS</Text>
        <Text style={[styles.th, { flex: 2 }]}>DONE</Text>
      </View>

      <View style={styles.setsContainer}>
        {sets.map((set) => (
          <SetRow
            key={set.setNumber}
            setNumber={set.setNumber}
            setType={setType}
            weightKg={set.weightKg}
            reps={set.reps}
            timeS={set.timeS}
            bandLevel={set.bandLevel}
            completed={set.completed}
            isActive={set.setNumber === activeSetNumber}
            onWeightChange={(val) => onUpdateSet(set.setNumber, { weightKg: val })}
            onRepsChange={(val) => onUpdateSet(set.setNumber, { reps: val })}
            onTimeChange={(val) => onUpdateSet(set.setNumber, { timeS: val })}
            onBandChange={(val) => onUpdateSet(set.setNumber, { bandLevel: val })}
            onComplete={() => onCompleteSet(set.setNumber)}
          />
        ))}
      </View>

      <Pressable style={styles.addButton} onPress={onAddSet}>
        <Text style={styles.addButtonText}>+ ADD SET</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.glassVioletBg,
    borderColor: Colors.glassVioletBorder,
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 24,
    color: '#ffffff',
  },
  subtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: Colors.onSurfaceVariant,
    marginTop: 2,
  },
  prevBadge: {
    backgroundColor: Colors.surfaceContainerHigh,
    borderColor: Colors.surfaceVariant,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignItems: 'flex-end',
  },
  prevBadgeLabel: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 10,
    color: Colors.onSurfaceVariant,
  },
  prevBadgeValue: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 16,
    color: Colors.secondary,
    marginTop: 2,
  },
  instructionsBox: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderColor: 'rgba(119, 1, 208, 0.3)',
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
    alignItems: 'flex-start',
    gap: 8,
  },
  instructionsText: {
    flex: 1,
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: Colors.onSurfaceVariant,
    lineHeight: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    paddingHorizontal: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surfaceVariant,
    marginBottom: 8,
  },
  th: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    letterSpacing: 1,
  },
  setsContainer: {
    marginBottom: 12,
  },
  addButton: {
    borderWidth: 1,
    borderColor: Colors.surfaceVariant,
    borderStyle: 'dashed',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
    color: Colors.onSurfaceVariant,
    letterSpacing: 1,
  },
});
