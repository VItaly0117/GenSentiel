export const migration002 = `
-- ============================================
-- 002_nutrition_metrics: Nutrition and Body Metrics
-- ============================================

-- Nutrition Diary
CREATE TABLE IF NOT EXISTS nutrition_logs (
  id          TEXT PRIMARY KEY DEFAULT (hex(randomblob(16))),
  date        TEXT NOT NULL, -- YYYY-MM-DD
  meal_type   TEXT NOT NULL, -- breakfast, lunch, dinner, snack
  food_name   TEXT NOT NULL,
  amount_g    REAL,
  calories    INTEGER NOT NULL,
  protein_g   REAL NOT NULL DEFAULT 0,
  fat_g       REAL NOT NULL DEFAULT 0,
  carbs_g     REAL NOT NULL DEFAULT 0,
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_nutrition_logs_date ON nutrition_logs(date);

-- Body Metrics (Weight, body fat, measurements)
CREATE TABLE IF NOT EXISTS body_metrics (
  id          TEXT PRIMARY KEY DEFAULT (hex(randomblob(16))),
  date        TEXT NOT NULL, -- YYYY-MM-DD
  weight_kg   REAL,
  body_fat_pct REAL,
  chest_cm    REAL,
  waist_cm    REAL,
  arms_cm     REAL,
  legs_cm     REAL,
  note        TEXT,
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_body_metrics_date ON body_metrics(date);
`;
