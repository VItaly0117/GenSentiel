import { PowerSyncDatabase, AbstractPowerSyncDatabase, PowerSyncBackendConnector } from '@powersync/react-native';
import { supabase } from './supabase';
import { schema } from './powersyncSchema';

export const db = new PowerSyncDatabase({
  database: { dbFilename: 'gensentiel-powersync.db' },
  schema: schema,
});

export class SupabaseConnector implements PowerSyncBackendConnector {
  async fetchCredentials() {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error || !session) {
      throw new Error(`Could not fetch Supabase credentials: ${error?.message}`);
    }

    // PowerSync requires a JWT token to sync
    return {
      endpoint: process.env.EXPO_PUBLIC_POWERSYNC_URL || 'YOUR_POWERSYNC_URL',
      token: session.access_token,
    };
  }

  async uploadData(database: AbstractPowerSyncDatabase) {
    const transaction = await database.getNextCrudTransaction();

    if (!transaction) {
      return;
    }

    try {
      for (const op of transaction.crud) {
        const table = op.table;
        // In a real production app, we map tables and handle specific columns.
        // This generic upload assumes Postgres tables match the SQLite schema.
        if (op.op === 'PUT' && op.opData) {
          await supabase.from(table).upsert({ ...op.opData, id: op.id });
        } else if (op.op === 'PATCH' && op.opData) {
          await supabase.from(table).update(op.opData as any).eq('id', op.id);
        } else if (op.op === 'DELETE') {
          await supabase.from(table).delete().eq('id', op.id);
        }
      }

      await transaction.complete();
    } catch (ex) {
      console.error('Upload error', ex);
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
}

export const setupPowerSync = async () => {
  const connector = new SupabaseConnector();
  await db.init();
  await db.connect(connector);
};
