import { useCallback } from 'react';
import { getDb } from '@db/database';
import { useWorkoutStore } from '@stores/workoutStore';

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Generate a random hex id for set rows (matches DB convention). */
function hexId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID().replace(/-/g, '');
  }
  const bytes = new Uint8Array(16);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = Math.floor(Math.random() * 256);
  }
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useSaveWorkout() {
  const resetWorkout = useWorkoutStore((s) => s.resetWorkout);

  const saveWorkout = useCallback(async () => {
    const { workoutId, templateId, name, startedAt, sets } =
      useWorkoutStore.getState();

    if (!workoutId || !startedAt) {
      throw new Error('No active workout to save');
    }

    const finishedAt = new Date().toISOString();
    const durationS = Math.round(
      (new Date(finishedAt).getTime() - new Date(startedAt).getTime()) / 1000,
    );

    const completedSets = sets.filter((s) => s.completed);

    const db = getDb();

    try {
      await db.execAsync('BEGIN TRANSACTION');

      await db.runAsync(
        `INSERT INTO workouts (id, template_id, name, started_at, finished_at, duration_s)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [workoutId, templateId ?? null, name, startedAt, finishedAt, durationS],
      );

      for (const s of completedSets) {
        await db.runAsync(
          `INSERT INTO workout_sets (id, workout_id, exercise_id, set_number, weight_kg, reps, time_s, band_level, is_warmup, completed, completed_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?)`,
          [
            hexId(),
            workoutId,
            s.exerciseId,
            s.setNumber,
            s.weightKg ?? null,
            s.reps ?? null,
            s.timeS ?? null,
            s.bandLevel ?? null,
            s.isWarmup ? 1 : 0,
            new Date().toISOString(),
          ],
        );
      }

      await db.execAsync('COMMIT');

      resetWorkout();
      return workoutId;
    } catch (error) {
      await db.execAsync('ROLLBACK');
      throw error;
    }
  }, [resetWorkout]);

  return { saveWorkout };
}
