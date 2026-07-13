import { getDb } from '@db/database';
import type { TrainingGoal } from '../types';

// ─── Types ────────────────────────────────────────────────────────────────────

export type SplitType = 'full_body' | 'upper' | 'lower' | 'push' | 'pull';

export interface GeneratorOptions {
  equipment: string[];
  splitType: SplitType;
  difficulty: 1 | 2 | 3 | 4 | 5;
  daysPerWeek: 2 | 3 | 4 | 5;
  goal?: TrainingGoal;
}

export interface GeneratedDay {
  name: string;
  splitType: SplitType;
  exercises: GeneratedExercise[];
}

export interface GeneratedExercise {
  exerciseId: string;
  name: string;
  sets: number;
  reps: number | null;
  timeS: number | null;
  restSeconds: number;
}

// ─── Split → Muscle Group mappings ────────────────────────────────────────────

const SPLIT_MUSCLES: Record<SplitType, string[]> = {
  full_body: ['chest', 'back', 'legs', 'shoulders', 'arms', 'core'],
  upper: ['chest', 'back', 'shoulders', 'arms'],
  lower: ['legs', 'core'],
  push: ['chest', 'shoulders', 'triceps'],
  pull: ['back', 'biceps'],
};

/**
 * For push/pull splits we need to remap the DB muscle_group values.
 * The DB stores generic "arms" — we sub-classify by exercise name heuristics.
 */
const PUSH_KEYWORDS = ['press', 'push', 'dip', 'extension', 'tricep', 'fly'];
const PULL_KEYWORDS = ['row', 'pull', 'curl', 'chin', 'bicep', 'deadlift'];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function generateHexId(): string {
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

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ─── Goal → training profile ───────────────────────────────────────────────────

interface GoalProfile {
  sets: number;
  restSeconds: number;
  reps: Record<string, number>;
  exercisesPerMuscleGroup: [number, number]; // [min, max] pick range
}

const GOAL_PROFILES: Record<TrainingGoal, GoalProfile> = {
  strength: {
    sets: 5,
    restSeconds: 120,
    reps: { weight_reps: 5, reps_only: 6, band_reps: 8, timed: 20 },
    exercisesPerMuscleGroup: [1, 1],
  },
  hypertrophy: {
    sets: 4,
    restSeconds: 75,
    reps: { weight_reps: 10, reps_only: 12, band_reps: 15, timed: 30 },
    exercisesPerMuscleGroup: [1, 2],
  },
  fat_loss: {
    sets: 3,
    restSeconds: 30,
    reps: { weight_reps: 15, reps_only: 18, band_reps: 20, timed: 45 },
    exercisesPerMuscleGroup: [2, 2],
  },
  general_fitness: {
    sets: 3,
    restSeconds: 60,
    reps: { weight_reps: 10, reps_only: 12, band_reps: 15, timed: 30 },
    exercisesPerMuscleGroup: [1, 2],
  },
};

function repsForGoal(
  setType: string,
  profile: GoalProfile,
): { reps: number | null; timeS: number | null } {
  if (setType === 'timed') {
    return { reps: null, timeS: profile.reps.timed };
  }
  return { reps: profile.reps[setType] ?? profile.reps.weight_reps, timeS: null };
}

// ─── DB row shape ─────────────────────────────────────────────────────────────

interface ExerciseRow {
  id: string;
  name: string;
  name_ru: string;
  muscle_group: string;
  set_type: string;
  equipment: string; // JSON array string
  difficulty: number;
}

// ─── Equipment check ──────────────────────────────────────────────────────────

/**
 * An exercise is available if every item in its equipment list
 * appears in the user's available equipment set.
 */
function equipmentAllowed(
  exerciseEquipment: string[],
  userEquipment: Set<string>,
): boolean {
  if (exerciseEquipment.length === 0) return true; // bodyweight / no equipment
  return exerciseEquipment.every((e) => userEquipment.has(e));
}

// ─── Classify arms into push / pull ───────────────────────────────────────────

function classifyArmExercise(name: string): 'push' | 'pull' | 'arms' {
  const lower = name.toLowerCase();
  if (PUSH_KEYWORDS.some((kw) => lower.includes(kw))) return 'push';
  if (PULL_KEYWORDS.some((kw) => lower.includes(kw))) return 'pull';
  return 'arms';
}

// ─── Generator ────────────────────────────────────────────────────────────────

export async function generateProgram(
  options: GeneratorOptions,
): Promise<GeneratedDay[]> {
  const { equipment, splitType, difficulty, daysPerWeek, goal = 'general_fitness' } = options;
  const profile = GOAL_PROFILES[goal];

  const db = getDb();
  const rows = await db.getAllAsync<ExerciseRow>('SELECT * FROM exercises');

  const userEquipmentSet = new Set(equipment);

  // Filter exercises by equipment & difficulty (±1)
  const eligible = rows.filter((ex) => {
    // Equipment check
    let eqList: string[] = [];
    try {
      eqList = JSON.parse(ex.equipment) as string[];
    } catch {
      eqList = [];
    }
    if (!equipmentAllowed(eqList, userEquipmentSet)) return false;

    // Difficulty within ±1
    if (Math.abs(ex.difficulty - difficulty) > 1) return false;

    return true;
  });

  // Bucket exercises by effective muscle group
  const muscleGroups = SPLIT_MUSCLES[splitType];

  const buckets: Record<string, ExerciseRow[]> = {};
  for (const mg of muscleGroups) {
    buckets[mg] = [];
  }

  for (const ex of eligible) {
    const dbGroup = ex.muscle_group.toLowerCase();

    if (splitType === 'push') {
      // Only chest, shoulders, and triceps-side arm exercises
      if (dbGroup === 'chest' || dbGroup === 'shoulders') {
        if (buckets[dbGroup]) buckets[dbGroup].push(ex);
      } else if (dbGroup === 'arms' || dbGroup === 'triceps') {
        const cls = classifyArmExercise(ex.name);
        if (cls === 'push' || cls === 'arms') {
          if (buckets['triceps']) buckets['triceps'].push(ex);
        }
      }
    } else if (splitType === 'pull') {
      // Only back and biceps-side arm exercises
      if (dbGroup === 'back') {
        if (buckets['back']) buckets['back'].push(ex);
      } else if (dbGroup === 'arms' || dbGroup === 'biceps') {
        const cls = classifyArmExercise(ex.name);
        if (cls === 'pull' || cls === 'arms') {
          if (buckets['biceps']) buckets['biceps'].push(ex);
        }
      }
    } else {
      // full_body, upper, lower — direct mapping
      if (buckets[dbGroup]) {
        buckets[dbGroup].push(ex);
      }
    }
  }

  // Generate each day
  const rest = profile.restSeconds;
  const numSets = profile.sets;
  const days: GeneratedDay[] = [];

  const dayNames: Record<SplitType, string> = {
    full_body: 'Full Body',
    upper: 'Upper Body',
    lower: 'Lower Body',
    push: 'Push',
    pull: 'Pull',
  };

  for (let d = 0; d < daysPerWeek; d++) {
    const dayExercises: GeneratedExercise[] = [];
    const usedIds = new Set<string>();

    for (const mg of muscleGroups) {
      const pool = shuffle(buckets[mg] ?? []).filter(
        (ex) => !usedIds.has(ex.id),
      );

      // Pick exercises per muscle group, count driven by the goal profile
      const [minPick, maxPick] = profile.exercisesPerMuscleGroup;
      const pickCount =
        pool.length >= maxPick
          ? Math.floor(Math.random() * (maxPick - minPick + 1)) + minPick
          : Math.min(minPick, pool.length) || pool.length;
      const picked = pool.slice(0, Math.min(pickCount, pool.length));

      for (const ex of picked) {
        usedIds.add(ex.id);
        const { reps, timeS } = repsForGoal(ex.set_type, profile);
        dayExercises.push({
          exerciseId: ex.id,
          name: ex.name,
          sets: numSets,
          reps,
          timeS,
          restSeconds: rest,
        });
      }
    }

    // Enforce 5–8 exercises per day
    const trimmed = dayExercises.slice(0, 8);

    days.push({
      name: `${dayNames[splitType]} Day ${d + 1}`,
      splitType,
      exercises: trimmed,
    });
  }

  return days;
}

// ─── Persist generated program ────────────────────────────────────────────────

export async function saveGeneratedProgram(
  days: GeneratedDay[],
): Promise<void> {
  const db = getDb();

  try {
    await db.execAsync('BEGIN TRANSACTION');

    for (const day of days) {
      const templateId = generateHexId();

      await db.runAsync(
        `INSERT INTO workout_templates (id, name, split_type, is_generated, created_at)
         VALUES (?, ?, ?, 1, ?)`,
        [templateId, day.name, day.splitType, new Date().toISOString()],
      );

      for (let i = 0; i < day.exercises.length; i++) {
        const ex = day.exercises[i];
        await db.runAsync(
          `INSERT INTO template_exercises (id, template_id, exercise_id, order_index, default_sets, default_reps, default_time_s, rest_seconds)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            generateHexId(),
            templateId,
            ex.exerciseId,
            i + 1,
            ex.sets,
            ex.reps ?? null,
            ex.timeS ?? null,
            ex.restSeconds,
          ],
        );
      }
    }

    await db.execAsync('COMMIT');
  } catch (error) {
    await db.execAsync('ROLLBACK');
    throw error;
  }
}
