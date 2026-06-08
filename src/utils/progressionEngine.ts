import { getDb } from '../db/database';

export interface ProgressionSuggestion {
  type: 'increase_reps' | 'add_weight' | 'upgrade_exercise' | 'add_band';
  message: string;
  messageRu: string;
  nextExerciseId?: string;
  suggestedWeight?: number;
  suggestedReps?: number;
}

export function analyzeProgression(exerciseId: string, setType: string): ProgressionSuggestion | null {
  const db = getDb();

  // Query last 6 completed sets for this exercise
  const recentSets = db.getAllSync<any>(`
    SELECT ws.weight_kg, ws.reps, ws.time_s, ws.band_level
    FROM workout_sets ws
    JOIN workouts w ON w.id = ws.workout_id
    WHERE ws.exercise_id = ? AND ws.completed = 1
    ORDER BY w.started_at DESC, ws.set_number DESC
    LIMIT 6
  `, [exerciseId]);

  if (recentSets.length < 3) return null;

  if (setType === 'reps_only') {
    const progressionEx = db.getFirstSync<any>(`
      SELECT id, name, name_ru FROM exercises WHERE progression_of = ?
    `, [exerciseId]);

    if (progressionEx) {
      return {
        type: 'upgrade_exercise',
        message: `Ready to level up? Try ${progressionEx.name}`,
        messageRu: `Готовы к прогрессу? Попробуйте ${progressionEx.name_ru}`,
        nextExerciseId: progressionEx.id,
      };
    }

    const sumReps = recentSets.reduce((sum, s) => sum + (s.reps || 0), 0);
    const avgReps = Math.round(sumReps / recentSets.length);
    return {
      type: 'increase_reps',
      message: `Great job! Try to hit ${avgReps + 2} reps next time.`,
      messageRu: `Отлично! Попробуйте сделать ${avgReps + 2} повторений в следующий раз.`,
      suggestedReps: avgReps + 2,
    };
  }

  if (setType === 'weight_reps') {
    const sumWeight = recentSets.reduce((sum, s) => sum + (s.weight_kg || 0), 0);
    const avgWeight = sumWeight / recentSets.length;
    const nextWeight = parseFloat((avgWeight + 2.5).toFixed(1));
    return {
      type: 'add_weight',
      message: `Looking strong. Try ${nextWeight}kg next session.`,
      messageRu: `Выглядите уверенно. Попробуйте ${nextWeight}кг на следующей тренировке.`,
      suggestedWeight: nextWeight,
    };
  }

  if (setType === 'band_reps') {
    const bands = ['light', 'medium', 'heavy', 'extra_heavy'];
    const currentBand = recentSets[0].band_level || 'light';
    const nextIdx = bands.indexOf(currentBand) + 1;
    if (nextIdx < bands.length) {
      return {
        type: 'add_band',
        message: `Time to progress. Use the ${bands[nextIdx].toUpperCase()} band next time.`,
        messageRu: `Время прогрессировать. Используйте резинку ${bands[nextIdx].toUpperCase()} в следующий раз.`,
      };
    }
  }

  if (setType === 'timed') {
    const sumTime = recentSets.reduce((sum, s) => sum + (s.time_s || 0), 0);
    const avgTime = Math.round(sumTime / recentSets.length);
    return {
      type: 'increase_reps',
      message: `Hold it longer! Try ${avgTime + 5}s next time.`,
      messageRu: `Держите дольше! Попробуйте ${avgTime + 5}с в следующий раз.`,
    };
  }

  return null;
}

export function getExerciseStats(exerciseId: string) {
  const db = getDb();
  return db.getFirstSync<any>(`
    SELECT 
      COUNT(*) as totalSets,
      MAX(weight_kg) as bestWeight,
      MAX(reps) as bestReps,
      MAX(time_s) as bestTime,
      MAX(completed_at) as lastPerformed
    FROM workout_sets
    WHERE exercise_id = ? AND completed = 1
  `, [exerciseId]) || { totalSets: 0, bestWeight: null, bestReps: null, bestTime: null, lastPerformed: null };
}

export function getWorkoutStats(workoutId: string) {
  const db = getDb();
  
  const basicStats = db.getFirstSync<any>(`
    SELECT 
      COUNT(id) as totalSets,
      COUNT(DISTINCT exercise_id) as totalExercises,
      SUM(weight_kg * reps) as totalVolume
    FROM workout_sets
    WHERE workout_id = ? AND completed = 1
  `, [workoutId]) || { totalSets: 0, totalExercises: 0, totalVolume: 0 };

  const workout = db.getFirstSync<any>('SELECT duration_s FROM workouts WHERE id = ?', [workoutId]) || { duration_s: 0 };

  // For PRs, a simple implementation:
  // In a real app we would compare against historical maxes before this workout
  const prsCount = 0; // Placeholder

  return {
    totalSets: basicStats.totalSets,
    totalVolume: basicStats.totalVolume || 0,
    totalExercises: basicStats.totalExercises,
    duration: workout.duration_s || 0,
    prs: prsCount
  };
}
