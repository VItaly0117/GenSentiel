export const migration001 = `
-- ============================================
-- 001_initial: Core schema for GenSentiel
-- ============================================

-- User's available equipment
CREATE TABLE IF NOT EXISTS user_equipment (
  id         TEXT PRIMARY KEY DEFAULT (hex(randomblob(16))),
  equipment  TEXT NOT NULL UNIQUE,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Exercise catalog
CREATE TABLE IF NOT EXISTS exercises (
  id              TEXT PRIMARY KEY DEFAULT (hex(randomblob(16))),
  name            TEXT NOT NULL,
  name_ru         TEXT NOT NULL,
  muscle_group    TEXT NOT NULL,
  equipment       TEXT NOT NULL DEFAULT '[]',
  difficulty      INTEGER NOT NULL CHECK (difficulty BETWEEN 1 AND 5),
  set_type        TEXT NOT NULL DEFAULT 'weight_reps',
  instructions    TEXT,
  progression_of  TEXT REFERENCES exercises(id) ON DELETE SET NULL,
  is_custom       INTEGER NOT NULL DEFAULT 0,
  created_at      TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at      TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Workout templates (routines)
CREATE TABLE IF NOT EXISTS workout_templates (
  id           TEXT PRIMARY KEY DEFAULT (hex(randomblob(16))),
  name         TEXT NOT NULL,
  description  TEXT,
  split_type   TEXT NOT NULL DEFAULT 'full_body',
  is_generated INTEGER NOT NULL DEFAULT 0,
  created_at   TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at   TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Exercises within a template
CREATE TABLE IF NOT EXISTS template_exercises (
  id             TEXT PRIMARY KEY DEFAULT (hex(randomblob(16))),
  template_id    TEXT NOT NULL REFERENCES workout_templates(id) ON DELETE CASCADE,
  exercise_id    TEXT NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
  order_index    INTEGER NOT NULL,
  default_sets   INTEGER NOT NULL DEFAULT 3,
  default_reps   INTEGER,
  default_time_s INTEGER,
  rest_seconds   INTEGER NOT NULL DEFAULT 60,
  created_at     TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Workout sessions
CREATE TABLE IF NOT EXISTS workouts (
  id          TEXT PRIMARY KEY DEFAULT (hex(randomblob(16))),
  template_id TEXT REFERENCES workout_templates(id) ON DELETE SET NULL,
  name        TEXT NOT NULL,
  note        TEXT,
  started_at  TEXT,
  finished_at TEXT,
  duration_s  INTEGER,
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Individual sets within a workout
CREATE TABLE IF NOT EXISTS workout_sets (
  id           TEXT PRIMARY KEY DEFAULT (hex(randomblob(16))),
  workout_id   TEXT NOT NULL REFERENCES workouts(id) ON DELETE CASCADE,
  exercise_id  TEXT NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
  set_number   INTEGER NOT NULL,
  weight_kg    REAL,
  reps         INTEGER,
  time_s       INTEGER,
  band_level   TEXT,
  is_warmup    INTEGER NOT NULL DEFAULT 0,
  completed    INTEGER NOT NULL DEFAULT 0,
  completed_at TEXT,
  note         TEXT,
  created_at   TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at   TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Key-value settings store
CREATE TABLE IF NOT EXISTS user_settings (
  key        TEXT PRIMARY KEY,
  value      TEXT NOT NULL,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Default settings
INSERT OR IGNORE INTO user_settings (key, value) VALUES ('rest_timer_enabled', '1');
INSERT OR IGNORE INTO user_settings (key, value) VALUES ('rest_timer_default_s', '60');
INSERT OR IGNORE INTO user_settings (key, value) VALUES ('haptics_enabled', '1');
INSERT OR IGNORE INTO user_settings (key, value) VALUES ('units', 'kg');
INSERT OR IGNORE INTO user_settings (key, value) VALUES ('onboarding_completed', '0');

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_workout_sets_workout_id ON workout_sets(workout_id);
CREATE INDEX IF NOT EXISTS idx_workout_sets_exercise_id ON workout_sets(exercise_id);
CREATE INDEX IF NOT EXISTS idx_workouts_started_at ON workouts(started_at DESC);
CREATE INDEX IF NOT EXISTS idx_exercises_muscle_group ON exercises(muscle_group);
CREATE INDEX IF NOT EXISTS idx_template_exercises_template_id ON template_exercises(template_id);
`;
