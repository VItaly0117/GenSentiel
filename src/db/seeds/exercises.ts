import { getDb } from '../database';

interface ExerciseSeed {
  name: string;
  name_ru: string;
  muscle_group: string;
  equipment: string[];
  difficulty: number;
  set_type: string;
  instructions: string | null;
}

interface ProgressionLink {
  from: string;
  to: string;
}

const EXERCISES: ExerciseSeed[] = [
  // ── CHEST ──────────────────────────────────────────────
  {
    name: 'Push-ups',
    name_ru: 'Отжимания',
    muscle_group: 'chest',
    equipment: ['bodyweight'],
    difficulty: 2,
    set_type: 'reps_only',
    instructions: 'Keep body straight. Lower chest to the floor and push back up.',
  },
  {
    name: 'Knee Push-ups',
    name_ru: 'Отжимания с колен',
    muscle_group: 'chest',
    equipment: ['bodyweight'],
    difficulty: 1,
    set_type: 'reps_only',
    instructions: 'Modified push-up on knees. Great for beginners.',
  },
  {
    name: 'Diamond Push-ups',
    name_ru: 'Алмазные отжимания',
    muscle_group: 'chest',
    equipment: ['bodyweight'],
    difficulty: 3,
    set_type: 'reps_only',
    instructions: 'Hands close together forming a diamond shape under chest.',
  },
  {
    name: 'Pike Push-ups',
    name_ru: 'Отжимания уголком',
    muscle_group: 'chest',
    equipment: ['bodyweight'],
    difficulty: 3,
    set_type: 'reps_only',
    instructions: 'Hips high in inverted V position. Press head toward the floor.',
  },
  {
    name: 'Decline Push-ups',
    name_ru: 'Отжимания с возвышения',
    muscle_group: 'chest',
    equipment: ['bodyweight', 'bench'],
    difficulty: 3,
    set_type: 'reps_only',
    instructions: 'Feet elevated on bench. Increases upper chest activation.',
  },
  {
    name: 'Dumbbell Floor Press',
    name_ru: 'Жим гантелей лёжа на полу',
    muscle_group: 'chest',
    equipment: ['dumbbells', 'mat'],
    difficulty: 2,
    set_type: 'weight_reps',
    instructions: 'Lie on floor with dumbbells. Press up and lower until elbows touch floor.',
  },
  {
    name: 'Dumbbell Flyes',
    name_ru: 'Разведение гантелей лёжа',
    muscle_group: 'chest',
    equipment: ['dumbbells', 'mat'],
    difficulty: 2,
    set_type: 'weight_reps',
    instructions: 'Lie on floor, arms wide. Bring dumbbells together in an arc above chest.',
  },
  {
    name: 'Band Chest Press',
    name_ru: 'Жим с резинкой',
    muscle_group: 'chest',
    equipment: ['bands'],
    difficulty: 2,
    set_type: 'band_reps',
    instructions: 'Anchor band behind you. Press forward at chest height.',
  },
  {
    name: 'Wide Push-ups',
    name_ru: 'Широкие отжимания',
    muscle_group: 'chest',
    equipment: ['bodyweight'],
    difficulty: 2,
    set_type: 'reps_only',
    instructions: 'Hands placed wider than shoulder width. Emphasizes outer chest.',
  },
  {
    name: 'Handstand Push-ups',
    name_ru: 'Отжимания в стойке на руках',
    muscle_group: 'chest', // or shoulders
    equipment: ['bodyweight'],
    difficulty: 5,
    set_type: 'reps_only',
    instructions: 'Kick up against a wall. Lower head to floor and press back up.',
  },
  {
    name: 'Archer Push-ups',
    name_ru: 'Отжимания лучника',
    muscle_group: 'chest',
    equipment: ['bodyweight'],
    difficulty: 4,
    set_type: 'reps_only',
    instructions: 'Wide stance, lower to one side keeping the other arm straight.',
  },

  // ── BACK ───────────────────────────────────────────────
  {
    name: 'Pull-ups',
    name_ru: 'Подтягивания',
    muscle_group: 'back',
    equipment: ['pullup_bar'],
    difficulty: 4,
    set_type: 'reps_only',
    instructions: 'Overhand grip. Pull chin above bar and lower with control.',
  },
  {
    name: 'Chin-ups',
    name_ru: 'Подтягивания обратным хватом',
    muscle_group: 'back',
    equipment: ['pullup_bar'],
    difficulty: 3,
    set_type: 'reps_only',
    instructions: 'Underhand grip. Pull chin above bar. More bicep engagement.',
  },
  {
    name: 'Band Rows',
    name_ru: 'Тяга с резинкой',
    muscle_group: 'back',
    equipment: ['bands'],
    difficulty: 2,
    set_type: 'band_reps',
    instructions: 'Anchor band at mid height. Pull handles toward ribcage, squeeze shoulder blades.',
  },
  {
    name: 'Dumbbell Rows',
    name_ru: 'Тяга гантели в наклоне',
    muscle_group: 'back',
    equipment: ['dumbbells'],
    difficulty: 2,
    set_type: 'weight_reps',
    instructions: 'Hinge at hips. Pull dumbbell to ribcage, elbow close to body.',
  },
  {
    name: 'Superman',
    name_ru: 'Супермен',
    muscle_group: 'back',
    equipment: ['mat'],
    difficulty: 1,
    set_type: 'timed',
    instructions: 'Lie face down. Lift arms, chest and legs off floor simultaneously.',
  },
  {
    name: 'Band Pull-Aparts',
    name_ru: 'Разведение резинки',
    muscle_group: 'back',
    equipment: ['bands'],
    difficulty: 1,
    set_type: 'band_reps',
    instructions: 'Hold band at shoulder width. Pull apart squeezing shoulder blades together.',
  },
  {
    name: 'Inverted Rows',
    name_ru: 'Австралийские подтягивания',
    muscle_group: 'back',
    equipment: ['bodyweight'],
    difficulty: 3,
    set_type: 'reps_only',
    instructions: 'Hang under a low bar or table. Pull chest to bar keeping body straight.',
  },
  {
    name: 'Reverse Snow Angels',
    name_ru: 'Обратные снежные ангелы',
    muscle_group: 'back',
    equipment: ['mat'],
    difficulty: 2,
    set_type: 'reps_only',
    instructions: 'Lie face down. Sweep arms from hips overhead while keeping them off floor.',
  },
  {
    name: 'Muscle-ups',
    name_ru: 'Выход силой',
    muscle_group: 'back',
    equipment: ['pullup_bar'],
    difficulty: 5,
    set_type: 'reps_only',
    instructions: 'Explosive pull-up followed by a dip over the bar.',
  },
  {
    name: 'Front Lever Tucks',
    name_ru: 'Группировка в передний вис',
    muscle_group: 'back',
    equipment: ['pullup_bar'],
    difficulty: 4,
    set_type: 'timed',
    instructions: 'Hang from bar, tuck knees to chest, lean back keeping back parallel to floor.',
  },

  // ── LEGS ───────────────────────────────────────────────
  {
    name: 'Bodyweight Squats',
    name_ru: 'Приседания',
    muscle_group: 'legs',
    equipment: ['bodyweight'],
    difficulty: 1,
    set_type: 'reps_only',
    instructions: 'Feet shoulder-width apart. Squat until thighs are parallel to floor.',
  },
  {
    name: 'Jump Squats',
    name_ru: 'Приседания с прыжком',
    muscle_group: 'legs',
    equipment: ['bodyweight'],
    difficulty: 3,
    set_type: 'reps_only',
    instructions: 'Squat down then explode upward into a jump. Land softly.',
  },
  {
    name: 'Lunges',
    name_ru: 'Выпады',
    muscle_group: 'legs',
    equipment: ['bodyweight'],
    difficulty: 2,
    set_type: 'reps_only',
    instructions: 'Step forward and lower back knee toward floor. Alternate legs.',
  },
  {
    name: 'Bulgarian Split Squats',
    name_ru: 'Болгарские сплит-приседания',
    muscle_group: 'legs',
    equipment: ['bodyweight', 'bench'],
    difficulty: 3,
    set_type: 'reps_only',
    instructions: 'Rear foot elevated on bench. Squat on front leg.',
  },
  {
    name: 'Goblet Squats',
    name_ru: 'Кубковые приседания',
    muscle_group: 'legs',
    equipment: ['dumbbells'],
    difficulty: 2,
    set_type: 'weight_reps',
    instructions: 'Hold dumbbell at chest. Squat deep keeping torso upright.',
  },
  {
    name: 'Kettlebell Swings',
    name_ru: 'Махи гирей',
    muscle_group: 'legs',
    equipment: ['kettlebell'],
    difficulty: 3,
    set_type: 'weight_reps',
    instructions: 'Hinge at hips. Swing kettlebell to shoulder height using hip drive.',
  },
  {
    name: 'Glute Bridges',
    name_ru: 'Ягодичный мостик',
    muscle_group: 'legs',
    equipment: ['mat'],
    difficulty: 1,
    set_type: 'reps_only',
    instructions: 'Lie on back, feet flat on floor. Lift hips squeezing glutes at top.',
  },
  {
    name: 'Single-Leg Deadlift',
    name_ru: 'Становая тяга на одной ноге',
    muscle_group: 'legs',
    equipment: ['dumbbells'],
    difficulty: 3,
    set_type: 'weight_reps',
    instructions: 'Stand on one leg. Hinge forward lowering dumbbell toward floor.',
  },
  {
    name: 'Wall Sit',
    name_ru: 'Стульчик у стены',
    muscle_group: 'legs',
    equipment: ['bodyweight'],
    difficulty: 2,
    set_type: 'timed',
    instructions: 'Back against wall, thighs parallel to floor. Hold position.',
  },
  {
    name: 'Calf Raises',
    name_ru: 'Подъём на носки',
    muscle_group: 'legs',
    equipment: ['bodyweight'],
    difficulty: 1,
    set_type: 'reps_only',
    instructions: 'Rise onto toes, pause at top, lower slowly.',
  },
  {
    name: 'Step-ups',
    name_ru: 'Зашагивания на платформу',
    muscle_group: 'legs',
    equipment: ['bench'],
    difficulty: 2,
    set_type: 'reps_only',
    instructions: 'Step onto bench with one foot, drive up. Alternate legs.',
  },
  {
    name: 'Sumo Squats',
    name_ru: 'Приседания сумо',
    muscle_group: 'legs',
    equipment: ['bodyweight'],
    difficulty: 2,
    set_type: 'reps_only',
    instructions: 'Wide stance, toes turned out. Squat deep targeting inner thighs.',
  },
  {
    name: 'Pistol Squats',
    name_ru: 'Приседания "Пистолетик"',
    muscle_group: 'legs',
    equipment: ['bodyweight'],
    difficulty: 5,
    set_type: 'reps_only',
    instructions: 'Squat down on one leg while keeping the other leg straight in front.',
  },
  {
    name: 'Shrimp Squats',
    name_ru: 'Приседания "Креветка"',
    muscle_group: 'legs',
    equipment: ['bodyweight'],
    difficulty: 4,
    set_type: 'reps_only',
    instructions: 'Hold one foot behind you. Lower knee of that leg to the ground and press up.',
  },

  // ── SHOULDERS ──────────────────────────────────────────
  {
    name: 'Band Lateral Raises',
    name_ru: 'Подъём рук в стороны с резинкой',
    muscle_group: 'shoulders',
    equipment: ['bands'],
    difficulty: 2,
    set_type: 'band_reps',
    instructions: 'Stand on band. Raise arms to sides until shoulder height.',
  },
  {
    name: 'Dumbbell Shoulder Press',
    name_ru: 'Жим гантелей стоя',
    muscle_group: 'shoulders',
    equipment: ['dumbbells'],
    difficulty: 2,
    set_type: 'weight_reps',
    instructions: 'Press dumbbells overhead from shoulder height. Full extension at top.',
  },
  {
    name: 'Dumbbell Lateral Raises',
    name_ru: 'Подъём гантелей в стороны',
    muscle_group: 'shoulders',
    equipment: ['dumbbells'],
    difficulty: 2,
    set_type: 'weight_reps',
    instructions: 'Slight bend in elbows. Raise dumbbells to sides up to shoulder height.',
  },
  {
    name: 'Band Front Raises',
    name_ru: 'Подъём рук перед собой с резинкой',
    muscle_group: 'shoulders',
    equipment: ['bands'],
    difficulty: 2,
    set_type: 'band_reps',
    instructions: 'Stand on band. Raise arms straight in front to shoulder height.',
  },
  {
    name: 'Arnold Press',
    name_ru: 'Жим Арнольда',
    muscle_group: 'shoulders',
    equipment: ['dumbbells'],
    difficulty: 3,
    set_type: 'weight_reps',
    instructions: 'Start with palms facing you. Rotate and press overhead.',
  },
  {
    name: 'Band Face Pulls',
    name_ru: 'Тяга резинки к лицу',
    muscle_group: 'shoulders',
    equipment: ['bands'],
    difficulty: 2,
    set_type: 'band_reps',
    instructions: 'Anchor band at head height. Pull toward face, elbows high.',
  },
  {
    name: 'Band Overhead Press',
    name_ru: 'Жим резинки над головой',
    muscle_group: 'shoulders',
    equipment: ['bands'],
    difficulty: 2,
    set_type: 'band_reps',
    instructions: 'Stand on band. Press handles overhead to full extension.',
  },

  // ── ARMS ───────────────────────────────────────────────
  {
    name: 'Band Bicep Curls',
    name_ru: 'Сгибания рук с резинкой',
    muscle_group: 'arms',
    equipment: ['bands'],
    difficulty: 1,
    set_type: 'band_reps',
    instructions: 'Stand on band. Curl handles toward shoulders keeping elbows pinned.',
  },
  {
    name: 'Dumbbell Curls',
    name_ru: 'Сгибания рук с гантелями',
    muscle_group: 'arms',
    equipment: ['dumbbells'],
    difficulty: 1,
    set_type: 'weight_reps',
    instructions: 'Curl dumbbells toward shoulders with controlled motion.',
  },
  {
    name: 'Hammer Curls',
    name_ru: 'Молотковые сгибания',
    muscle_group: 'arms',
    equipment: ['dumbbells'],
    difficulty: 2,
    set_type: 'weight_reps',
    instructions: 'Neutral grip (palms facing each other). Curl dumbbells up.',
  },
  {
    name: 'Concentration Curls',
    name_ru: 'Концентрированные сгибания',
    muscle_group: 'arms',
    equipment: ['dumbbells', 'bench'],
    difficulty: 2,
    set_type: 'weight_reps',
    instructions: 'Seated, elbow braced against inner thigh. Curl dumbbell with focus.',
  },
  {
    name: 'Dips on Chair',
    name_ru: 'Отжимания от скамьи',
    muscle_group: 'arms',
    equipment: ['bench'],
    difficulty: 2,
    set_type: 'reps_only',
    instructions: 'Hands on bench behind you. Lower body by bending elbows to 90°.',
  },
  {
    name: 'Diamond Push-ups for Triceps',
    name_ru: 'Алмазные отжимания на трицепс',
    muscle_group: 'arms',
    equipment: ['bodyweight'],
    difficulty: 3,
    set_type: 'reps_only',
    instructions: 'Hands in diamond shape. Focus on tricep contraction.',
  },
  {
    name: 'Band Tricep Extensions',
    name_ru: 'Разгибания рук с резинкой',
    muscle_group: 'arms',
    equipment: ['bands'],
    difficulty: 2,
    set_type: 'band_reps',
    instructions: 'Anchor band overhead. Extend arms downward keeping elbows fixed.',
  },
  {
    name: 'Dumbbell Tricep Extensions',
    name_ru: 'Разгибания рук с гантелей',
    muscle_group: 'arms',
    equipment: ['dumbbells'],
    difficulty: 2,
    set_type: 'weight_reps',
    instructions: 'Hold dumbbell overhead with both hands. Lower behind head, extend up.',
  },
  {
    name: 'Kickbacks',
    name_ru: 'Кикбэки с гантелей',
    muscle_group: 'arms',
    equipment: ['dumbbells'],
    difficulty: 2,
    set_type: 'weight_reps',
    instructions: 'Hinge forward. Extend dumbbell backward squeezing tricep at top.',
  },
  {
    name: 'Band Hammer Curls',
    name_ru: 'Молотковые сгибания с резинкой',
    muscle_group: 'arms',
    equipment: ['bands'],
    difficulty: 1,
    set_type: 'band_reps',
    instructions: 'Stand on band with neutral grip. Curl up keeping palms facing each other.',
  },

  // ── CORE ───────────────────────────────────────────────
  {
    name: 'Plank',
    name_ru: 'Планка',
    muscle_group: 'core',
    equipment: ['mat'],
    difficulty: 1,
    set_type: 'timed',
    instructions: 'Forearms and toes on floor. Keep body in a straight line. Hold.',
  },
  {
    name: 'Side Plank',
    name_ru: 'Боковая планка',
    muscle_group: 'core',
    equipment: ['mat'],
    difficulty: 2,
    set_type: 'timed',
    instructions: 'On one forearm and side of foot. Keep hips elevated.',
  },
  {
    name: 'Crunches',
    name_ru: 'Скручивания',
    muscle_group: 'core',
    equipment: ['mat'],
    difficulty: 1,
    set_type: 'reps_only',
    instructions: 'Lie on back, knees bent. Curl shoulders off floor toward knees.',
  },
  {
    name: 'Bicycle Crunches',
    name_ru: 'Велосипедные скручивания',
    muscle_group: 'core',
    equipment: ['mat'],
    difficulty: 2,
    set_type: 'reps_only',
    instructions: 'Alternating elbow to opposite knee while cycling legs in the air.',
  },
  {
    name: 'Russian Twist',
    name_ru: 'Русские скручивания',
    muscle_group: 'core',
    equipment: ['mat'],
    difficulty: 2,
    set_type: 'reps_only',
    instructions: 'Seated, lean back slightly. Rotate torso side to side.',
  },
  {
    name: 'Leg Raises',
    name_ru: 'Подъём ног',
    muscle_group: 'core',
    equipment: ['mat'],
    difficulty: 2,
    set_type: 'reps_only',
    instructions: 'Lie flat. Raise straight legs to 90° and lower with control.',
  },
  {
    name: 'Mountain Climbers',
    name_ru: 'Скалолаз',
    muscle_group: 'core',
    equipment: ['mat'],
    difficulty: 2,
    set_type: 'reps_only',
    instructions: 'High plank position. Drive knees toward chest alternately at pace.',
  },
  {
    name: 'Dead Bug',
    name_ru: 'Мёртвый жук',
    muscle_group: 'core',
    equipment: ['mat'],
    difficulty: 1,
    set_type: 'reps_only',
    instructions: 'On back, arms up, knees at 90°. Extend opposite arm and leg alternately.',
  },
  {
    name: 'Flutter Kicks',
    name_ru: 'Махи ногами',
    muscle_group: 'core',
    equipment: ['mat'],
    difficulty: 2,
    set_type: 'timed',
    instructions: 'Lie flat, legs slightly off floor. Alternate small up-down kicks.',
  },
  {
    name: 'V-ups',
    name_ru: 'Складка',
    muscle_group: 'core',
    equipment: ['mat'],
    difficulty: 3,
    set_type: 'reps_only',
    instructions: 'Simultaneously raise legs and torso to touch toes, forming a V shape.',
  },
  {
    name: 'Hollow Hold',
    name_ru: 'Лодочка на спине',
    muscle_group: 'core',
    equipment: ['mat'],
    difficulty: 2,
    set_type: 'timed',
    instructions: 'Lie on back. Lift shoulders and legs off floor. Hold with arms extended.',
  },
  {
    name: 'L-Sit',
    name_ru: 'Уголок (L-Sit)',
    muscle_group: 'core',
    equipment: ['bodyweight'],
    difficulty: 4,
    set_type: 'timed',
    instructions: 'Support body on hands, keep legs straight out in front forming an L shape.',
  },
  {
    name: 'Dragon Flags',
    name_ru: 'Флаг дракона',
    muscle_group: 'core',
    equipment: ['bench'], // Requires something to hold onto
    difficulty: 5,
    set_type: 'reps_only',
    instructions: 'Lie on bench, hold edge behind head. Raise entire body straight up and lower slowly.',
  },
];

// Progression chains defined by exercise name:
// from → to means "from" is a progression OF "to" (i.e., "to" progresses from "from")
// In our schema, progression_of points to the EASIER exercise.
// So: Diamond Push-ups.progression_of = Push-ups (Diamond is a progression OF Push-ups)
const PROGRESSIONS: ProgressionLink[] = [
  { from: 'Push-ups', to: 'Knee Push-ups' },
  { from: 'Diamond Push-ups', to: 'Push-ups' },
  { from: 'Decline Push-ups', to: 'Diamond Push-ups' },
  { from: 'Jump Squats', to: 'Bodyweight Squats' },
  { from: 'Single-Leg Deadlift', to: 'Glute Bridges' },
  { from: 'Side Plank', to: 'Plank' },
  { from: 'Bicycle Crunches', to: 'Crunches' },
  { from: 'V-ups', to: 'Bicycle Crunches' },
  { from: 'Archer Push-ups', to: 'Wide Push-ups' },
  { from: 'Pistol Squats', to: 'Bulgarian Split Squats' },
];

export function seedExercises(): void {
  const db = getDb();

  // Check if exercises already seeded
  const count = db.getFirstSync<{ cnt: number }>(
    'SELECT COUNT(*) as cnt FROM exercises;'
  );

  if (count && count.cnt > 0) {
    return;
  }

  db.execSync('BEGIN TRANSACTION;');

  try {
    // Insert all exercises
    const insertStmt = db.prepareSync(
      `INSERT INTO exercises (id, name, name_ru, muscle_group, equipment, difficulty, set_type, instructions, is_custom)
       VALUES (hex(randomblob(16)), ?, ?, ?, ?, ?, ?, ?, 0)`
    );

    for (const ex of EXERCISES) {
      insertStmt.executeSync(
        ex.name,
        ex.name_ru,
        ex.muscle_group,
        JSON.stringify(ex.equipment),
        ex.difficulty,
        ex.set_type,
        ex.instructions
      );
    }

    insertStmt.finalizeSync();

    // Apply progression chains
    const updateStmt = db.prepareSync(
      `UPDATE exercises
       SET progression_of = (SELECT id FROM exercises WHERE name = ?)
       WHERE name = ?`
    );

    for (const link of PROGRESSIONS) {
      updateStmt.executeSync(link.to, link.from);
    }

    updateStmt.finalizeSync();

    db.execSync('COMMIT;');
  } catch (error) {
    db.execSync('ROLLBACK;');
    throw new Error(`Failed to seed exercises: ${error}`);
  }
}
