import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { ChevronLeft, ChevronRight, Minus, Plus, Check } from 'lucide-react-native';
import { MovementAnimation } from './MovementAnimation';
import type { MovementPattern } from '../../utils/movementPattern';
import { useTranslation } from '../../i18n/useTranslation';

const Colors = {
  black: '#000000',
  primaryContainer: '#c3f400',
  secondary: '#dcb8ff',
  tertiary: '#00daf3',
  surfaceContainerLow: '#1a1c1c',
  surfaceContainerHigh: '#282a2b',
  surfaceVariant: '#333535',
  onSurface: '#e2e2e2',
  onSurfaceVariant: '#c4c9ac',
  neonGlow: 'rgba(195, 244, 0, 0.5)',
};

interface FocusSet {
  setNumber: number;
  weightKg?: number;
  reps?: number;
  timeS?: number;
  bandLevel?: 'light' | 'medium' | 'heavy' | 'extra_heavy';
  completed: boolean;
}

interface FocusViewProps {
  exerciseName: string;
  muscleGroup: string;
  movementPattern: MovementPattern;
  setType: 'weight_reps' | 'reps_only' | 'timed' | 'band_reps';
  sets: FocusSet[];
  exerciseIndex: number;
  totalExercises: number;
  isResting: boolean;
  restSeconds: number;
  restTotalSeconds: number;
  onSkipRest: () => void;
  onUpdateSet: (setNumber: number, data: any) => void;
  onCompleteSet: (setNumber: number) => void;
  onPrevExercise: () => void;
  onNextExercise: () => void;
  canPrev: boolean;
  canNext: boolean;
}

const BAND_LEVELS: Array<'light' | 'medium' | 'heavy' | 'extra_heavy'> = ['light', 'medium', 'heavy', 'extra_heavy'];

export function FocusView({
  exerciseName,
  muscleGroup,
  movementPattern,
  setType,
  sets,
  exerciseIndex,
  totalExercises,
  isResting,
  restSeconds,
  restTotalSeconds,
  onSkipRest,
  onUpdateSet,
  onCompleteSet,
  onPrevExercise,
  onNextExercise,
  canPrev,
  canNext,
}: FocusViewProps) {
  const { t } = useTranslation();
  const activeSet = sets.find((s) => !s.completed);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const secs = s % 60;
    return `${m}:${secs.toString().padStart(2, '0')}`;
  };

  const cycleBand = () => {
    if (!activeSet) return;
    const idx = BAND_LEVELS.indexOf(activeSet.bandLevel || 'light');
    onUpdateSet(activeSet.setNumber, { bandLevel: BAND_LEVELS[(idx + 1) % BAND_LEVELS.length] });
  };

  const restProgress = restTotalSeconds > 0 ? (restSeconds / restTotalSeconds) * 100 : 0;

  return (
    <View style={styles.container}>
      <Text style={styles.upNext}>
        {t('workoutActive.upNext')} · {exerciseIndex + 1}/{totalExercises}
      </Text>

      <MovementAnimation pattern={movementPattern} size={180} showLabel={false} />

      <Text style={styles.exerciseName}>{exerciseName}</Text>
      <Text style={styles.muscleGroup}>{t('exerciseCard.focusLabel', { group: muscleGroup })}</Text>

      {isResting ? (
        <View style={styles.restBlock}>
          <Text style={styles.restLabel}>{t('workoutActive.restLabel')}</Text>
          <Text style={styles.restTimer}>{formatTime(restSeconds)}</Text>
          <View style={styles.restTrack}>
            <View style={[styles.restFill, { width: `${restProgress}%` }]} />
          </View>
          <Pressable style={styles.skipRestBtn} onPress={onSkipRest}>
            <Text style={styles.skipRestText}>{t('restTimer.skip')}</Text>
          </Pressable>
        </View>
      ) : activeSet ? (
        <View style={styles.setBlock}>
          <Text style={styles.setOf}>
            {t('workoutActive.setOf', { current: activeSet.setNumber, total: sets.length })}
          </Text>

          <View style={styles.steppersRow}>
            {setType === 'weight_reps' && (
              <Stepper
                value={activeSet.weightKg ?? 0}
                unit="KG"
                step={2.5}
                onChange={(v) => onUpdateSet(activeSet.setNumber, { weightKg: v })}
              />
            )}
            {setType === 'reps_only' && (
              <View style={styles.bwBadge}>
                <Text style={styles.bwText}>{t('setRow.bodyweight')}</Text>
              </View>
            )}
            {setType === 'band_reps' && (
              <Pressable style={styles.bandBadge} onPress={cycleBand}>
                <Text style={styles.bandText}>
                  {t(`setRow.${activeSet.bandLevel === 'extra_heavy' ? 'extraHeavy' : activeSet.bandLevel || 'light'}`)}
                </Text>
              </Pressable>
            )}

            {setType === 'timed' ? (
              <Stepper
                value={activeSet.timeS ?? 0}
                unit="S"
                step={5}
                onChange={(v) => onUpdateSet(activeSet.setNumber, { timeS: v })}
              />
            ) : (
              <Stepper
                value={activeSet.reps ?? 0}
                unit={t('exerciseCard.reps')}
                step={1}
                onChange={(v) => onUpdateSet(activeSet.setNumber, { reps: v })}
              />
            )}
          </View>

          <Pressable style={styles.completeBtn} onPress={() => onCompleteSet(activeSet.setNumber)}>
            <Check size={22} color={Colors.black} strokeWidth={3} />
            <Text style={styles.completeBtnText}>{t('common.done')}</Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.setBlock}>
          <Text style={styles.doneAllText}>{t('common.done')}</Text>
        </View>
      )}

      <View style={styles.navRow}>
        <Pressable style={[styles.navBtn, !canPrev && styles.navBtnDisabled]} onPress={onPrevExercise} disabled={!canPrev}>
          <ChevronLeft size={22} color={canPrev ? Colors.onSurface : Colors.surfaceVariant} />
        </Pressable>
        <Pressable style={[styles.navBtn, !canNext && styles.navBtnDisabled]} onPress={onNextExercise} disabled={!canNext}>
          <ChevronRight size={22} color={canNext ? Colors.onSurface : Colors.surfaceVariant} />
        </Pressable>
      </View>
    </View>
  );
}

function Stepper({
  value,
  unit,
  step,
  onChange,
}: {
  value: number;
  unit: string;
  step: number;
  onChange: (v: number) => void;
}) {
  return (
    <View style={styles.stepper}>
      <Pressable style={styles.stepperBtn} onPress={() => onChange(Math.max(0, value - step))}>
        <Minus size={16} color={Colors.onSurface} />
      </Pressable>
      <View style={styles.stepperValueBox}>
        <Text style={styles.stepperValue}>{value}</Text>
        <Text style={styles.stepperUnit}>{unit}</Text>
      </View>
      <Pressable style={styles.stepperBtn} onPress={() => onChange(value + step)}>
        <Plus size={16} color={Colors.onSurface} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 32,
  },
  upNext: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
    letterSpacing: 1.5,
    color: Colors.onSurfaceVariant,
    textTransform: 'uppercase',
  },
  exerciseName: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 28,
    color: '#ffffff',
    textAlign: 'center',
    marginTop: 16,
  },
  muscleGroup: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: Colors.onSurfaceVariant,
    marginTop: 4,
  },
  restBlock: {
    alignItems: 'center',
    gap: 12,
    width: '100%',
  },
  restLabel: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
    letterSpacing: 2,
    color: Colors.secondary,
  },
  restTimer: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 64,
    color: Colors.primaryContainer,
    letterSpacing: 4,
    textShadowColor: Colors.neonGlow,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 16,
  },
  restTrack: {
    width: '80%',
    height: 4,
    backgroundColor: Colors.surfaceVariant,
    borderRadius: 2,
    overflow: 'hidden',
  },
  restFill: {
    height: '100%',
    backgroundColor: Colors.primaryContainer,
    borderRadius: 2,
  },
  skipRestBtn: {
    marginTop: 8,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.surfaceVariant,
  },
  skipRestText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
    color: Colors.onSurface,
    letterSpacing: 1,
  },
  setBlock: {
    alignItems: 'center',
    gap: 20,
    width: '100%',
  },
  setOf: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 13,
    letterSpacing: 1.5,
    color: Colors.tertiary,
  },
  steppersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  stepper: {
    alignItems: 'center',
    gap: 8,
  },
  stepperBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surfaceContainerHigh,
    borderWidth: 1,
    borderColor: Colors.surfaceVariant,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperValueBox: {
    alignItems: 'center',
    minWidth: 72,
  },
  stepperValue: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 32,
    color: '#ffffff',
  },
  stepperUnit: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 10,
    color: Colors.onSurfaceVariant,
    letterSpacing: 1,
  },
  bwBadge: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: Colors.surfaceContainerHigh,
    borderWidth: 1,
    borderColor: Colors.surfaceVariant,
  },
  bwText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: Colors.onSurface,
  },
  bandBadge: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: Colors.surfaceContainerHigh,
    borderWidth: 1,
    borderColor: Colors.surfaceVariant,
  },
  bandText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: Colors.onSurface,
  },
  completeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.primaryContainer,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 8,
    shadowColor: Colors.neonGlow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 6,
  },
  completeBtnText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 15,
    color: Colors.black,
    letterSpacing: 1,
  },
  doneAllText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: Colors.primaryContainer,
    letterSpacing: 1,
  },
  navRow: {
    flexDirection: 'row',
    gap: 24,
  },
  navBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: Colors.surfaceVariant,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navBtnDisabled: {
    opacity: 0.4,
  },
});
