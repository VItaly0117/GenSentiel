import { getDb } from '../database';
import { migration001 } from './001_initial';
import { migration002 } from './002_nutrition_metrics';

interface Migration {
  version: number;
  name: string;
  sql: string;
}

const migrations: Migration[] = [
  { version: 1, name: '001_initial', sql: migration001 },
  { version: 2, name: '002_nutrition_metrics', sql: migration002 },
];

export function runMigrations(): void {
  const db = getDb();

  const result = db.getFirstSync<{ user_version: number }>(
    'PRAGMA user_version;'
  );
  const currentVersion = result?.user_version ?? 0;

  const pending = migrations.filter((m) => m.version > currentVersion);

  if (pending.length === 0) {
    return;
  }

  for (const migration of pending) {
    db.execSync('BEGIN TRANSACTION;');
    try {
      db.execSync(migration.sql);
      db.execSync(`PRAGMA user_version = ${migration.version};`);
      db.execSync('COMMIT;');
    } catch (error) {
      db.execSync('ROLLBACK;');
      throw new Error(
        `Migration ${migration.name} (v${migration.version}) failed: ${error}`
      );
    }
  }
}
