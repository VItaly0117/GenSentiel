import { getDb } from '../database';

export interface Exercise {
  id: string;
  name: string;
  name_ru: string;
  muscle_group: string;
  equipment: string;
  difficulty: number;
  set_type: string;
  instructions: string | null;
  progression_of: string | null;
  is_custom: number;
  created_at: string;
  updated_at: string;
}

export function getAllExercises(): Exercise[] {
  const db = getDb();
  return db.getAllSync<Exercise>('SELECT * FROM exercises ORDER BY muscle_group, difficulty, name;');
}

export function getByMuscleGroup(group: string): Exercise[] {
  const db = getDb();
  return db.getAllSync<Exercise>(
    'SELECT * FROM exercises WHERE muscle_group = ? ORDER BY difficulty, name;',
    group
  );
}

export function getFilteredByEquipment(userEquipment: string[]): Exercise[] {
  const db = getDb();

  if (userEquipment.length === 0) {
    return [];
  }

  // We need to filter exercises whose equipment JSON array is a subset
  // of the user's available equipment. We fetch all exercises and filter
  // in JS since SQLite JSON support is limited in expo-sqlite.
  const allExercises = db.getAllSync<Exercise>(
    'SELECT * FROM exercises ORDER BY muscle_group, difficulty, name;'
  );

  const equipmentSet = new Set(userEquipment);

  return allExercises.filter((exercise) => {
    try {
      const required: string[] = JSON.parse(exercise.equipment);
      return required.every((item) => equipmentSet.has(item));
    } catch {
      return false;
    }
  });
}

export function searchExercises(query: string): Exercise[] {
  const db = getDb();
  const pattern = `%${query}%`;
  return db.getAllSync<Exercise>(
    `SELECT * FROM exercises
     WHERE name LIKE ? OR name_ru LIKE ?
     ORDER BY muscle_group, difficulty, name;`,
    pattern,
    pattern
  );
}

export function getExerciseById(id: string): Exercise | null {
  const db = getDb();
  return db.getFirstSync<Exercise>(
    'SELECT * FROM exercises WHERE id = ?;',
    id
  );
}

export function getProgressionChain(exerciseId: string): Exercise[] {
  const db = getDb();
  const chain: Exercise[] = [];

  // Walk backward to find the root (easiest)
  let currentId: string | null = exerciseId;
  const visited = new Set<string>();

  while (currentId && !visited.has(currentId)) {
    visited.add(currentId);
    const exercise = db.getFirstSync<Exercise>(
      'SELECT * FROM exercises WHERE id = ?;',
      currentId
    );
    if (!exercise) break;
    chain.unshift(exercise);
    currentId = exercise.progression_of;
  }

  // Walk forward to find harder progressions
  let nextExercise = db.getFirstSync<Exercise>(
    'SELECT * FROM exercises WHERE progression_of = ?;',
    exerciseId
  );

  while (nextExercise && !visited.has(nextExercise.id)) {
    visited.add(nextExercise.id);
    chain.push(nextExercise);
    nextExercise = db.getFirstSync<Exercise>(
      'SELECT * FROM exercises WHERE progression_of = ?;',
      nextExercise.id
    );
  }

  return chain;
}
