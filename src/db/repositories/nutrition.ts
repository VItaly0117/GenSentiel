import { getDb } from '../database';

export interface NutritionLog {
  id: string;
  date: string;
  meal_type: string;
  food_name: string;
  amount_g?: number;
  calories: number;
  protein_g: number;
  fat_g: number;
  carbs_g: number;
}

export interface BodyMetric {
  id: string;
  date: string;
  weight_kg: number | null;
  body_fat_pct: number | null;
  chest_cm: number | null;
  waist_cm: number | null;
  arms_cm: number | null;
  legs_cm: number | null;
  note: string | null;
}

export function getDayNutrition(date: string): NutritionLog[] {
  const db = getDb();
  return db.getAllSync<NutritionLog>('SELECT * FROM nutrition_logs WHERE date = ? ORDER BY created_at DESC', [date]);
}

export function addNutritionLog(
  date: string,
  meal_type: string,
  food_name: string,
  calories: number,
  protein_g: number,
  fat_g: number,
  carbs_g: number,
  amount_g?: number
) {
  const db = getDb();
  db.runSync(
    `INSERT INTO nutrition_logs (date, meal_type, food_name, calories, protein_g, fat_g, carbs_g, amount_g)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [date, meal_type, food_name, calories, protein_g, fat_g, carbs_g, amount_g || null]
  );
}

export function deleteNutritionLog(id: string) {
  const db = getDb();
  db.runSync('DELETE FROM nutrition_logs WHERE id = ?', [id]);
}

export function getBodyMetrics(date: string): BodyMetric | null {
  const db = getDb();
  return db.getFirstSync<BodyMetric>('SELECT * FROM body_metrics WHERE date = ?', [date]);
}

export function getBodyMetricsHistory(limit: number = 30): BodyMetric[] {
  const db = getDb();
  return db.getAllSync<BodyMetric>('SELECT * FROM body_metrics ORDER BY date DESC LIMIT ?', [limit]);
}

export function saveBodyMetrics(
  date: string,
  metrics: {
    weight_kg?: number;
    body_fat_pct?: number;
    chest_cm?: number;
    waist_cm?: number;
    arms_cm?: number;
    legs_cm?: number;
    note?: string;
  }
) {
  const db = getDb();
  const existing = getBodyMetrics(date);

  if (existing) {
    db.runSync(
      `UPDATE body_metrics SET 
        weight_kg = COALESCE(?, weight_kg),
        body_fat_pct = COALESCE(?, body_fat_pct),
        chest_cm = COALESCE(?, chest_cm),
        waist_cm = COALESCE(?, waist_cm),
        arms_cm = COALESCE(?, arms_cm),
        legs_cm = COALESCE(?, legs_cm),
        note = COALESCE(?, note),
        updated_at = datetime('now')
       WHERE date = ?`,
      [
        metrics.weight_kg ?? null,
        metrics.body_fat_pct ?? null,
        metrics.chest_cm ?? null,
        metrics.waist_cm ?? null,
        metrics.arms_cm ?? null,
        metrics.legs_cm ?? null,
        metrics.note ?? null,
        date
      ]
    );
  } else {
    db.runSync(
      `INSERT INTO body_metrics (date, weight_kg, body_fat_pct, chest_cm, waist_cm, arms_cm, legs_cm, note)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        date,
        metrics.weight_kg ?? null,
        metrics.body_fat_pct ?? null,
        metrics.chest_cm ?? null,
        metrics.waist_cm ?? null,
        metrics.arms_cm ?? null,
        metrics.legs_cm ?? null,
        metrics.note ?? null
      ]
    );
  }
}
