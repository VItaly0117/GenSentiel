export interface Exercise {
  id: string;
  name: string;
  name_ru: string;
  muscle_group: string;
  equipment: string; // JSON array string e.g. '["bodyweight","mat"]'
  difficulty: number;
  set_type: 'weight_reps' | 'reps_only' | 'timed' | 'band_reps';
  instructions: string | null;
  progression_of: string | null;
  is_custom: number;
  created_at?: string;
  updated_at?: string;
}

export type EquipmentKey =
  | 'bodyweight'
  | 'mat'
  | 'bands'
  | 'dumbbells'
  | 'kettlebell'
  | 'pullup_bar'
  | 'bench';

export interface WorkoutTemplate {
  id: string;
  name: string;
  description: string | null;
  split_type: string;
  is_generated: number;
  created_at: string;
  updated_at: string;
}

export interface WorkoutSession {
  id: string;
  template_id: string | null;
  name: string;
  note: string | null;
  started_at: string;
  finished_at: string | null;
  duration_s: number | null;
}

export interface WorkoutSet {
  id: string;
  workout_id: string;
  exercise_id: string;
  set_number: number;
  weight_kg: number | null;
  reps: number | null;
  time_s: number | null;
  band_level: string | null;
  is_warmup: number;
  completed: number;
  completed_at: string | null;
}
