import { create } from 'zustand';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ActiveSet {
  exerciseId: string;
  setNumber: number;
  weightKg?: number;
  reps?: number;
  timeS?: number;
  bandLevel?: 'light' | 'medium' | 'heavy' | 'extra_heavy';
  isWarmup: boolean;
  completed: boolean;
}

interface ExerciseInfo {
  id: string;
  name: string;
  nameRu: string;
  setType: 'weight_reps' | 'reps_only' | 'timed' | 'band_reps';
  muscleGroup: string;
}

interface WorkoutState {
  workoutId: string | null;
  templateId: string | null;
  name: string;
  startedAt: string | null;
  exercises: ExerciseInfo[];
  sets: ActiveSet[];
  isActive: boolean;

  startWorkout: (
    templateId: string | null,
    name: string,
    exercises: ExerciseInfo[],
  ) => void;
  completeSet: (exerciseId: string, setNumber: number) => void;
  updateSet: (
    exerciseId: string,
    setNumber: number,
    data: Partial<ActiveSet>,
  ) => void;
  addSet: (exerciseId: string) => void;
  removeSet: (exerciseId: string, setNumber: number) => void;
  addExercise: (exercise: ExerciseInfo) => void;
  finishWorkout: () => void;
  resetWorkout: () => void;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Generate a UUID-v4-style id, with fallback for environments without crypto. */
function generateId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  // Fallback: random hex string (32 chars)
  const bytes = new Uint8Array(16);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = Math.floor(Math.random() * 256);
  }
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/** Build default sets for a list of exercises (3 sets each). */
function buildDefaultSets(exercises: ExerciseInfo[]): ActiveSet[] {
  const sets: ActiveSet[] = [];
  for (const ex of exercises) {
    for (let n = 1; n <= 3; n++) {
      const base: ActiveSet = {
        exerciseId: ex.id,
        setNumber: n,
        isWarmup: false,
        completed: false,
      };

      switch (ex.setType) {
        case 'weight_reps':
          base.weightKg = 0;
          base.reps = 10;
          break;
        case 'reps_only':
          base.reps = 12;
          break;
        case 'timed':
          base.timeS = 30;
          break;
        case 'band_reps':
          base.bandLevel = 'medium';
          base.reps = 15;
          break;
      }

      sets.push(base);
    }
  }
  return sets;
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useWorkoutStore = create<WorkoutState>()((set) => ({
  workoutId: null,
  templateId: null,
  name: '',
  startedAt: null,
  exercises: [],
  sets: [],
  isActive: false,

  startWorkout: (templateId, name, exercises) => {
    set({
      workoutId: generateId(),
      templateId,
      name,
      startedAt: new Date().toISOString(),
      exercises,
      sets: buildDefaultSets(exercises),
      isActive: true,
    });
  },

  completeSet: (exerciseId, setNumber) => {
    set((state) => ({
      sets: state.sets.map((s) =>
        s.exerciseId === exerciseId && s.setNumber === setNumber
          ? { ...s, completed: true }
          : s,
      ),
    }));
  },

  updateSet: (exerciseId, setNumber, data) => {
    set((state) => ({
      sets: state.sets.map((s) =>
        s.exerciseId === exerciseId && s.setNumber === setNumber
          ? { ...s, ...data }
          : s,
      ),
    }));
  },

  addSet: (exerciseId) => {
    set((state) => {
      const exerciseSets = state.sets.filter(
        (s) => s.exerciseId === exerciseId,
      );

      const lastSet =
        exerciseSets.length > 0
          ? exerciseSets[exerciseSets.length - 1]
          : undefined;

      const newSetNumber =
        exerciseSets.length > 0
          ? Math.max(...exerciseSets.map((s) => s.setNumber)) + 1
          : 1;

      const newSet: ActiveSet = {
        exerciseId,
        setNumber: newSetNumber,
        weightKg: lastSet?.weightKg,
        reps: lastSet?.reps,
        timeS: lastSet?.timeS,
        bandLevel: lastSet?.bandLevel,
        isWarmup: false,
        completed: false,
      };

      return { sets: [...state.sets, newSet] };
    });
  },

  removeSet: (exerciseId, setNumber) => {
    set((state) => {
      const filtered = state.sets.filter(
        (s) => !(s.exerciseId === exerciseId && s.setNumber === setNumber),
      );

      // Re-number remaining sets for this exercise so they stay sequential
      let counter = 0;
      const renumbered = filtered.map((s) => {
        if (s.exerciseId === exerciseId) {
          counter++;
          return { ...s, setNumber: counter };
        }
        return s;
      });

      return { sets: renumbered };
    });
  },

  addExercise: (exercise) => {
    set((state) => {
      if (state.exercises.some((e) => e.id === exercise.id)) return state;
      const newSets = buildDefaultSets([exercise]);
      return {
        exercises: [...state.exercises, exercise],
        sets: [...state.sets, ...newSets],
      };
    });
  },

  finishWorkout: () => {
    set({ isActive: false });
  },

  resetWorkout: () => {
    set({
      workoutId: null,
      templateId: null,
      name: '',
      startedAt: null,
      exercises: [],
      sets: [],
      isActive: false,
    });
  },
}));
