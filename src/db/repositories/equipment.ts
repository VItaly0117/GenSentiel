import { getDb } from '../database';
import type { TrainingGoal } from '../../types';

export type EquipmentKey =
  | 'bodyweight'
  | 'mat'
  | 'bands'
  | 'dumbbells'
  | 'kettlebell'
  | 'pullup_bar'
  | 'bench';

interface UserEquipmentRow {
  id: string;
  equipment: string;
  created_at: string;
  updated_at: string;
}

interface SettingRow {
  key: string;
  value: string;
  updated_at: string;
}

export function getUserEquipment(): EquipmentKey[] {
  const db = getDb();
  const rows = db.getAllSync<UserEquipmentRow>(
    'SELECT * FROM user_equipment ORDER BY equipment;'
  );
  return rows.map((row) => row.equipment as EquipmentKey);
}

export function saveUserEquipment(equipment: EquipmentKey[]): void {
  const db = getDb();

  db.execSync('BEGIN TRANSACTION;');

  try {
    db.execSync('DELETE FROM user_equipment;');

    if (equipment.length > 0) {
      const stmt = db.prepareSync(
        `INSERT INTO user_equipment (id, equipment) VALUES (hex(randomblob(16)), ?)`
      );

      for (const item of equipment) {
        stmt.executeSync(item);
      }

      stmt.finalizeSync();
    }

    db.execSync('COMMIT;');
  } catch (error) {
    db.execSync('ROLLBACK;');
    throw new Error(`Failed to save user equipment: ${error}`);
  }
}

export function hasCompletedOnboarding(): boolean {
  const db = getDb();
  const row = db.getFirstSync<SettingRow>(
    "SELECT * FROM user_settings WHERE key = 'onboarding_completed';"
  );
  return row?.value === '1';
}

export function setOnboardingCompleted(): void {
  const db = getDb();
  db.runSync(
    "UPDATE user_settings SET value = '1', updated_at = datetime('now') WHERE key = 'onboarding_completed';"
  );
}

export function getSetting(key: string): string | null {
  const db = getDb();
  const row = db.getFirstSync<SettingRow>(
    'SELECT * FROM user_settings WHERE key = ?;',
    key
  );
  return row?.value ?? null;
}

export function setSetting(key: string, value: string): void {
  const db = getDb();
  db.runSync(
    `INSERT INTO user_settings (key, value, updated_at) VALUES (?, ?, datetime('now'))
     ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at;`,
    key,
    value
  );
}

export function getUserGoal(): TrainingGoal {
  const value = getSetting('training_goal');
  return (value as TrainingGoal) ?? 'general_fitness';
}

export function saveUserGoal(goal: TrainingGoal): void {
  setSetting('training_goal', goal);
}
