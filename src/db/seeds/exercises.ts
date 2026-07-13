import { getDb } from '../database';

interface ExerciseSeed {
  name: string;
  name_ru: string;
  muscle_group: string;
  equipment: string[];
  difficulty: number;
  set_type: string;
  instructions: string | null;
  instructions_ru: string | null;
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
    instructions_ru: 'Держите тело прямым. Опустите грудь к полу и оттолкнитесь обратно вверх.',
  },
  {
    name: 'Knee Push-ups',
    name_ru: 'Отжимания с колен',
    muscle_group: 'chest',
    equipment: ['bodyweight'],
    difficulty: 1,
    set_type: 'reps_only',
    instructions: 'Modified push-up on knees. Great for beginners.',
    instructions_ru: 'Облегчённый вариант отжиманий с колен. Отлично подходит для начинающих.',
  },
  {
    name: 'Diamond Push-ups',
    name_ru: 'Алмазные отжимания',
    muscle_group: 'chest',
    equipment: ['bodyweight'],
    difficulty: 3,
    set_type: 'reps_only',
    instructions: 'Hands close together forming a diamond shape under chest.',
    instructions_ru: 'Ладони близко друг к другу под грудью, образуя форму ромба.',
  },
  {
    name: 'Pike Push-ups',
    name_ru: 'Отжимания уголком',
    muscle_group: 'chest',
    equipment: ['bodyweight'],
    difficulty: 3,
    set_type: 'reps_only',
    instructions: 'Hips high in inverted V position. Press head toward the floor.',
    instructions_ru: 'Таз высоко, тело в форме перевёрнутой буквы V. Опускайте голову к полу.',
  },
  {
    name: 'Decline Push-ups',
    name_ru: 'Отжимания с возвышения',
    muscle_group: 'chest',
    equipment: ['bodyweight', 'bench'],
    difficulty: 3,
    set_type: 'reps_only',
    instructions: 'Feet elevated on bench. Increases upper chest activation.',
    instructions_ru: 'Ноги приподняты на скамье. Усиливает нагрузку на верх груди.',
  },
  {
    name: 'Dumbbell Floor Press',
    name_ru: 'Жим гантелей лёжа на полу',
    muscle_group: 'chest',
    equipment: ['dumbbells', 'mat'],
    difficulty: 2,
    set_type: 'weight_reps',
    instructions: 'Lie on floor with dumbbells. Press up and lower until elbows touch floor.',
    instructions_ru: 'Лягте на пол с гантелями. Жмите вверх и опускайте, пока локти не коснутся пола.',
  },
  {
    name: 'Dumbbell Flyes',
    name_ru: 'Разведение гантелей лёжа',
    muscle_group: 'chest',
    equipment: ['dumbbells', 'mat'],
    difficulty: 2,
    set_type: 'weight_reps',
    instructions: 'Lie on floor, arms wide. Bring dumbbells together in an arc above chest.',
    instructions_ru: 'Лягте на пол, руки широко разведены. Сводите гантели дугой над грудью.',
  },
  {
    name: 'Band Chest Press',
    name_ru: 'Жим с резинкой',
    muscle_group: 'chest',
    equipment: ['bands'],
    difficulty: 2,
    set_type: 'band_reps',
    instructions: 'Anchor band behind you. Press forward at chest height.',
    instructions_ru: 'Закрепите резинку за спиной. Жмите вперёд на уровне груди.',
  },
  {
    name: 'Wide Push-ups',
    name_ru: 'Широкие отжимания',
    muscle_group: 'chest',
    equipment: ['bodyweight'],
    difficulty: 2,
    set_type: 'reps_only',
    instructions: 'Hands placed wider than shoulder width. Emphasizes outer chest.',
    instructions_ru: 'Руки шире ширины плеч. Акцент на внешнюю часть груди.',
  },
  {
    name: 'Handstand Push-ups',
    name_ru: 'Отжимания в стойке на руках',
    muscle_group: 'chest', // or shoulders
    equipment: ['bodyweight'],
    difficulty: 5,
    set_type: 'reps_only',
    instructions: 'Kick up against a wall. Lower head to floor and press back up.',
    instructions_ru: 'Встаньте в стойку у стены. Опустите голову к полу и отожмитесь обратно.',
  },
  {
    name: 'Archer Push-ups',
    name_ru: 'Отжимания лучника',
    muscle_group: 'chest',
    equipment: ['bodyweight'],
    difficulty: 4,
    set_type: 'reps_only',
    instructions: 'Wide stance, lower to one side keeping the other arm straight.',
    instructions_ru: 'Широкая постановка рук, опускайтесь к одной стороне, вторая рука прямая.',
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
    instructions_ru: 'Прямой хват. Подтянитесь подбородком выше перекладины и опуститесь подконтрольно.',
  },
  {
    name: 'Chin-ups',
    name_ru: 'Подтягивания обратным хватом',
    muscle_group: 'back',
    equipment: ['pullup_bar'],
    difficulty: 3,
    set_type: 'reps_only',
    instructions: 'Underhand grip. Pull chin above bar. More bicep engagement.',
    instructions_ru: 'Обратный хват. Подтянитесь подбородком выше перекладины. Больше нагрузки на бицепс.',
  },
  {
    name: 'Band Rows',
    name_ru: 'Тяга с резинкой',
    muscle_group: 'back',
    equipment: ['bands'],
    difficulty: 2,
    set_type: 'band_reps',
    instructions: 'Anchor band at mid height. Pull handles toward ribcage, squeeze shoulder blades.',
    instructions_ru: 'Закрепите резинку на уровне груди. Тяните рукоятки к рёбрам, сводя лопатки.',
  },
  {
    name: 'Dumbbell Rows',
    name_ru: 'Тяга гантели в наклоне',
    muscle_group: 'back',
    equipment: ['dumbbells'],
    difficulty: 2,
    set_type: 'weight_reps',
    instructions: 'Hinge at hips. Pull dumbbell to ribcage, elbow close to body.',
    instructions_ru: 'Наклонитесь в тазобедренных суставах. Тяните гантель к рёбрам, локоть близко к корпусу.',
  },
  {
    name: 'Superman',
    name_ru: 'Супермен',
    muscle_group: 'back',
    equipment: ['mat'],
    difficulty: 1,
    set_type: 'timed',
    instructions: 'Lie face down. Lift arms, chest and legs off floor simultaneously.',
    instructions_ru: 'Лягте лицом вниз. Одновременно приподнимите руки, грудь и ноги над полом.',
  },
  {
    name: 'Band Pull-Aparts',
    name_ru: 'Разведение резинки',
    muscle_group: 'back',
    equipment: ['bands'],
    difficulty: 1,
    set_type: 'band_reps',
    instructions: 'Hold band at shoulder width. Pull apart squeezing shoulder blades together.',
    instructions_ru: 'Держите резинку на ширине плеч. Растягивайте её, сводя лопатки вместе.',
  },
  {
    name: 'Inverted Rows',
    name_ru: 'Австралийские подтягивания',
    muscle_group: 'back',
    equipment: ['bodyweight'],
    difficulty: 3,
    set_type: 'reps_only',
    instructions: 'Hang under a low bar or table. Pull chest to bar keeping body straight.',
    instructions_ru: 'Повисните под низкой перекладиной или столом. Подтяните грудь к перекладине, держа тело прямым.',
  },
  {
    name: 'Reverse Snow Angels',
    name_ru: 'Обратные снежные ангелы',
    muscle_group: 'back',
    equipment: ['mat'],
    difficulty: 2,
    set_type: 'reps_only',
    instructions: 'Lie face down. Sweep arms from hips overhead while keeping them off floor.',
    instructions_ru: 'Лягте лицом вниз. Проведите руками от бёдер над головой, не касаясь пола.',
  },
  {
    name: 'Muscle-ups',
    name_ru: 'Выход силой',
    muscle_group: 'back',
    equipment: ['pullup_bar'],
    difficulty: 5,
    set_type: 'reps_only',
    instructions: 'Explosive pull-up followed by a dip over the bar.',
    instructions_ru: 'Взрывное подтягивание с последующим отжиманием над перекладиной.',
  },
  {
    name: 'Front Lever Tucks',
    name_ru: 'Группировка в передний вис',
    muscle_group: 'back',
    equipment: ['pullup_bar'],
    difficulty: 4,
    set_type: 'timed',
    instructions: 'Hang from bar, tuck knees to chest, lean back keeping back parallel to floor.',
    instructions_ru: 'Повисните на перекладине, подтяните колени к груди, отклонитесь так, чтобы спина была параллельна полу.',
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
    instructions_ru: 'Ноги на ширине плеч. Приседайте, пока бёдра не станут параллельны полу.',
  },
  {
    name: 'Jump Squats',
    name_ru: 'Приседания с прыжком',
    muscle_group: 'legs',
    equipment: ['bodyweight'],
    difficulty: 3,
    set_type: 'reps_only',
    instructions: 'Squat down then explode upward into a jump. Land softly.',
    instructions_ru: 'Присядьте, затем взрывным движением выпрыгните вверх. Приземляйтесь мягко.',
  },
  {
    name: 'Lunges',
    name_ru: 'Выпады',
    muscle_group: 'legs',
    equipment: ['bodyweight'],
    difficulty: 2,
    set_type: 'reps_only',
    instructions: 'Step forward and lower back knee toward floor. Alternate legs.',
    instructions_ru: 'Шагните вперёд и опустите заднее колено к полу. Чередуйте ноги.',
  },
  {
    name: 'Bulgarian Split Squats',
    name_ru: 'Болгарские сплит-приседания',
    muscle_group: 'legs',
    equipment: ['bodyweight', 'bench'],
    difficulty: 3,
    set_type: 'reps_only',
    instructions: 'Rear foot elevated on bench. Squat on front leg.',
    instructions_ru: 'Задняя нога приподнята на скамье. Приседайте на передней ноге.',
  },
  {
    name: 'Goblet Squats',
    name_ru: 'Кубковые приседания',
    muscle_group: 'legs',
    equipment: ['dumbbells'],
    difficulty: 2,
    set_type: 'weight_reps',
    instructions: 'Hold dumbbell at chest. Squat deep keeping torso upright.',
    instructions_ru: 'Держите гантель у груди. Приседайте глубоко, сохраняя корпус вертикальным.',
  },
  {
    name: 'Kettlebell Swings',
    name_ru: 'Махи гирей',
    muscle_group: 'legs',
    equipment: ['kettlebell'],
    difficulty: 3,
    set_type: 'weight_reps',
    instructions: 'Hinge at hips. Swing kettlebell to shoulder height using hip drive.',
    instructions_ru: 'Наклонитесь в тазобедренных суставах. Забрасывайте гирю до уровня плеч за счёт разгибания бёдер.',
  },
  {
    name: 'Glute Bridges',
    name_ru: 'Ягодичный мостик',
    muscle_group: 'legs',
    equipment: ['mat'],
    difficulty: 1,
    set_type: 'reps_only',
    instructions: 'Lie on back, feet flat on floor. Lift hips squeezing glutes at top.',
    instructions_ru: 'Лягте на спину, стопы на полу. Поднимайте таз, сжимая ягодицы в верхней точке.',
  },
  {
    name: 'Single-Leg Deadlift',
    name_ru: 'Становая тяга на одной ноге',
    muscle_group: 'legs',
    equipment: ['dumbbells'],
    difficulty: 3,
    set_type: 'weight_reps',
    instructions: 'Stand on one leg. Hinge forward lowering dumbbell toward floor.',
    instructions_ru: 'Встаньте на одну ногу. Наклоняйтесь вперёд, опуская гантель к полу.',
  },
  {
    name: 'Wall Sit',
    name_ru: 'Стульчик у стены',
    muscle_group: 'legs',
    equipment: ['bodyweight'],
    difficulty: 2,
    set_type: 'timed',
    instructions: 'Back against wall, thighs parallel to floor. Hold position.',
    instructions_ru: 'Спина у стены, бёдра параллельны полу. Удерживайте позицию.',
  },
  {
    name: 'Calf Raises',
    name_ru: 'Подъём на носки',
    muscle_group: 'legs',
    equipment: ['bodyweight'],
    difficulty: 1,
    set_type: 'reps_only',
    instructions: 'Rise onto toes, pause at top, lower slowly.',
    instructions_ru: 'Поднимитесь на носки, задержитесь наверху, медленно опуститесь.',
  },
  {
    name: 'Step-ups',
    name_ru: 'Зашагивания на платформу',
    muscle_group: 'legs',
    equipment: ['bench'],
    difficulty: 2,
    set_type: 'reps_only',
    instructions: 'Step onto bench with one foot, drive up. Alternate legs.',
    instructions_ru: 'Наступите на скамью одной ногой и выпрямитесь. Чередуйте ноги.',
  },
  {
    name: 'Sumo Squats',
    name_ru: 'Приседания сумо',
    muscle_group: 'legs',
    equipment: ['bodyweight'],
    difficulty: 2,
    set_type: 'reps_only',
    instructions: 'Wide stance, toes turned out. Squat deep targeting inner thighs.',
    instructions_ru: 'Широкая постановка ног, носки развёрнуты наружу. Приседайте глубоко, нагружая внутреннюю часть бедра.',
  },
  {
    name: 'Pistol Squats',
    name_ru: 'Приседания "Пистолетик"',
    muscle_group: 'legs',
    equipment: ['bodyweight'],
    difficulty: 5,
    set_type: 'reps_only',
    instructions: 'Squat down on one leg while keeping the other leg straight in front.',
    instructions_ru: 'Приседайте на одной ноге, вторую держите прямой перед собой.',
  },
  {
    name: 'Shrimp Squats',
    name_ru: 'Приседания "Креветка"',
    muscle_group: 'legs',
    equipment: ['bodyweight'],
    difficulty: 4,
    set_type: 'reps_only',
    instructions: 'Hold one foot behind you. Lower knee of that leg to the ground and press up.',
    instructions_ru: 'Удерживайте одну стопу за собой. Опустите колено этой ноги к земле и выпрямитесь.',
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
    instructions_ru: 'Встаньте на резинку. Поднимайте руки в стороны до уровня плеч.',
  },
  {
    name: 'Dumbbell Shoulder Press',
    name_ru: 'Жим гантелей стоя',
    muscle_group: 'shoulders',
    equipment: ['dumbbells'],
    difficulty: 2,
    set_type: 'weight_reps',
    instructions: 'Press dumbbells overhead from shoulder height. Full extension at top.',
    instructions_ru: 'Жмите гантели над головой от уровня плеч. Полное выпрямление рук наверху.',
  },
  {
    name: 'Dumbbell Lateral Raises',
    name_ru: 'Подъём гантелей в стороны',
    muscle_group: 'shoulders',
    equipment: ['dumbbells'],
    difficulty: 2,
    set_type: 'weight_reps',
    instructions: 'Slight bend in elbows. Raise dumbbells to sides up to shoulder height.',
    instructions_ru: 'Лёгкий изгиб в локтях. Поднимайте гантели в стороны до уровня плеч.',
  },
  {
    name: 'Band Front Raises',
    name_ru: 'Подъём рук перед собой с резинкой',
    muscle_group: 'shoulders',
    equipment: ['bands'],
    difficulty: 2,
    set_type: 'band_reps',
    instructions: 'Stand on band. Raise arms straight in front to shoulder height.',
    instructions_ru: 'Встаньте на резинку. Поднимайте прямые руки перед собой до уровня плеч.',
  },
  {
    name: 'Arnold Press',
    name_ru: 'Жим Арнольда',
    muscle_group: 'shoulders',
    equipment: ['dumbbells'],
    difficulty: 3,
    set_type: 'weight_reps',
    instructions: 'Start with palms facing you. Rotate and press overhead.',
    instructions_ru: 'Начните с ладонями к себе. Разверните руки и выжмите над головой.',
  },
  {
    name: 'Band Face Pulls',
    name_ru: 'Тяга резинки к лицу',
    muscle_group: 'shoulders',
    equipment: ['bands'],
    difficulty: 2,
    set_type: 'band_reps',
    instructions: 'Anchor band at head height. Pull toward face, elbows high.',
    instructions_ru: 'Закрепите резинку на уровне головы. Тяните к лицу, локти держите высоко.',
  },
  {
    name: 'Band Overhead Press',
    name_ru: 'Жим резинки над головой',
    muscle_group: 'shoulders',
    equipment: ['bands'],
    difficulty: 2,
    set_type: 'band_reps',
    instructions: 'Stand on band. Press handles overhead to full extension.',
    instructions_ru: 'Встаньте на резинку. Выжимайте рукоятки над головой до полного выпрямления рук.',
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
    instructions_ru: 'Встаньте на резинку. Сгибайте руки к плечам, локти зафиксированы у корпуса.',
  },
  {
    name: 'Dumbbell Curls',
    name_ru: 'Сгибания рук с гантелями',
    muscle_group: 'arms',
    equipment: ['dumbbells'],
    difficulty: 1,
    set_type: 'weight_reps',
    instructions: 'Curl dumbbells toward shoulders with controlled motion.',
    instructions_ru: 'Сгибайте руки с гантелями к плечам подконтрольным движением.',
  },
  {
    name: 'Hammer Curls',
    name_ru: 'Молотковые сгибания',
    muscle_group: 'arms',
    equipment: ['dumbbells'],
    difficulty: 2,
    set_type: 'weight_reps',
    instructions: 'Neutral grip (palms facing each other). Curl dumbbells up.',
    instructions_ru: 'Нейтральный хват (ладони друг к другу). Сгибайте гантели вверх.',
  },
  {
    name: 'Concentration Curls',
    name_ru: 'Концентрированные сгибания',
    muscle_group: 'arms',
    equipment: ['dumbbells', 'bench'],
    difficulty: 2,
    set_type: 'weight_reps',
    instructions: 'Seated, elbow braced against inner thigh. Curl dumbbell with focus.',
    instructions_ru: 'Сидя, локоть упирается во внутреннюю часть бедра. Сгибайте гантель концентрированно.',
  },
  {
    name: 'Dips on Chair',
    name_ru: 'Отжимания от скамьи',
    muscle_group: 'arms',
    equipment: ['bench'],
    difficulty: 2,
    set_type: 'reps_only',
    instructions: 'Hands on bench behind you. Lower body by bending elbows to 90°.',
    instructions_ru: 'Руки на скамье за спиной. Опускайте тело, сгибая локти до 90°.',
  },
  {
    name: 'Diamond Push-ups for Triceps',
    name_ru: 'Алмазные отжимания на трицепс',
    muscle_group: 'arms',
    equipment: ['bodyweight'],
    difficulty: 3,
    set_type: 'reps_only',
    instructions: 'Hands in diamond shape. Focus on tricep contraction.',
    instructions_ru: 'Ладони в форме ромба. Фокус на сокращении трицепса.',
  },
  {
    name: 'Band Tricep Extensions',
    name_ru: 'Разгибания рук с резинкой',
    muscle_group: 'arms',
    equipment: ['bands'],
    difficulty: 2,
    set_type: 'band_reps',
    instructions: 'Anchor band overhead. Extend arms downward keeping elbows fixed.',
    instructions_ru: 'Закрепите резинку над головой. Разгибайте руки вниз, локти зафиксированы.',
  },
  {
    name: 'Dumbbell Tricep Extensions',
    name_ru: 'Разгибания рук с гантелей',
    muscle_group: 'arms',
    equipment: ['dumbbells'],
    difficulty: 2,
    set_type: 'weight_reps',
    instructions: 'Hold dumbbell overhead with both hands. Lower behind head, extend up.',
    instructions_ru: 'Держите гантель над головой двумя руками. Опускайте за голову, разгибайте вверх.',
  },
  {
    name: 'Kickbacks',
    name_ru: 'Кикбэки с гантелей',
    muscle_group: 'arms',
    equipment: ['dumbbells'],
    difficulty: 2,
    set_type: 'weight_reps',
    instructions: 'Hinge forward. Extend dumbbell backward squeezing tricep at top.',
    instructions_ru: 'Наклонитесь вперёд. Разгибайте гантель назад, сжимая трицепс в верхней точке.',
  },
  {
    name: 'Band Hammer Curls',
    name_ru: 'Молотковые сгибания с резинкой',
    muscle_group: 'arms',
    equipment: ['bands'],
    difficulty: 1,
    set_type: 'band_reps',
    instructions: 'Stand on band with neutral grip. Curl up keeping palms facing each other.',
    instructions_ru: 'Встаньте на резинку нейтральным хватом. Сгибайте вверх, ладони смотрят друг на друга.',
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
    instructions_ru: 'Предплечья и носки на полу. Держите тело в одну прямую линию. Удерживайте позицию.',
  },
  {
    name: 'Side Plank',
    name_ru: 'Боковая планка',
    muscle_group: 'core',
    equipment: ['mat'],
    difficulty: 2,
    set_type: 'timed',
    instructions: 'On one forearm and side of foot. Keep hips elevated.',
    instructions_ru: 'На одном предплечье и ребре стопы. Держите таз приподнятым.',
  },
  {
    name: 'Crunches',
    name_ru: 'Скручивания',
    muscle_group: 'core',
    equipment: ['mat'],
    difficulty: 1,
    set_type: 'reps_only',
    instructions: 'Lie on back, knees bent. Curl shoulders off floor toward knees.',
    instructions_ru: 'Лягте на спину, колени согнуты. Приподнимайте плечи от пола к коленям.',
  },
  {
    name: 'Bicycle Crunches',
    name_ru: 'Велосипедные скручивания',
    muscle_group: 'core',
    equipment: ['mat'],
    difficulty: 2,
    set_type: 'reps_only',
    instructions: 'Alternating elbow to opposite knee while cycling legs in the air.',
    instructions_ru: 'Поочерёдно тянитесь локтем к противоположному колену, "крутя педали" в воздухе.',
  },
  {
    name: 'Russian Twist',
    name_ru: 'Русские скручивания',
    muscle_group: 'core',
    equipment: ['mat'],
    difficulty: 2,
    set_type: 'reps_only',
    instructions: 'Seated, lean back slightly. Rotate torso side to side.',
    instructions_ru: 'Сидя, слегка отклонитесь назад. Поворачивайте корпус из стороны в сторону.',
  },
  {
    name: 'Leg Raises',
    name_ru: 'Подъём ног',
    muscle_group: 'core',
    equipment: ['mat'],
    difficulty: 2,
    set_type: 'reps_only',
    instructions: 'Lie flat. Raise straight legs to 90° and lower with control.',
    instructions_ru: 'Лягте на спину. Поднимайте прямые ноги до 90° и опускайте подконтрольно.',
  },
  {
    name: 'Mountain Climbers',
    name_ru: 'Скалолаз',
    muscle_group: 'core',
    equipment: ['mat'],
    difficulty: 2,
    set_type: 'reps_only',
    instructions: 'High plank position. Drive knees toward chest alternately at pace.',
    instructions_ru: 'Позиция высокой планки. Поочерёдно и быстро подтягивайте колени к груди.',
  },
  {
    name: 'Dead Bug',
    name_ru: 'Мёртвый жук',
    muscle_group: 'core',
    equipment: ['mat'],
    difficulty: 1,
    set_type: 'reps_only',
    instructions: 'On back, arms up, knees at 90°. Extend opposite arm and leg alternately.',
    instructions_ru: 'На спине, руки вверх, колени под 90°. Поочерёдно выпрямляйте противоположные руку и ногу.',
  },
  {
    name: 'Flutter Kicks',
    name_ru: 'Махи ногами',
    muscle_group: 'core',
    equipment: ['mat'],
    difficulty: 2,
    set_type: 'timed',
    instructions: 'Lie flat, legs slightly off floor. Alternate small up-down kicks.',
    instructions_ru: 'Лягте на спину, ноги слегка приподняты. Чередуйте небольшие махи ногами вверх-вниз.',
  },
  {
    name: 'V-ups',
    name_ru: 'Складка',
    muscle_group: 'core',
    equipment: ['mat'],
    difficulty: 3,
    set_type: 'reps_only',
    instructions: 'Simultaneously raise legs and torso to touch toes, forming a V shape.',
    instructions_ru: 'Одновременно поднимайте ноги и корпус, касаясь носков, образуя форму буквы V.',
  },
  {
    name: 'Hollow Hold',
    name_ru: 'Лодочка на спине',
    muscle_group: 'core',
    equipment: ['mat'],
    difficulty: 2,
    set_type: 'timed',
    instructions: 'Lie on back. Lift shoulders and legs off floor. Hold with arms extended.',
    instructions_ru: 'Лягте на спину. Приподнимите плечи и ноги над полом. Удерживайте с прямыми руками.',
  },
  {
    name: 'L-Sit',
    name_ru: 'Уголок (L-Sit)',
    muscle_group: 'core',
    equipment: ['bodyweight'],
    difficulty: 4,
    set_type: 'timed',
    instructions: 'Support body on hands, keep legs straight out in front forming an L shape.',
    instructions_ru: 'Удерживайте тело на руках, прямые ноги вытянуты вперёд, образуя форму буквы L.',
  },
  {
    name: 'Dragon Flags',
    name_ru: 'Флаг дракона',
    muscle_group: 'core',
    equipment: ['bench'], // Requires something to hold onto
    difficulty: 5,
    set_type: 'reps_only',
    instructions: 'Lie on bench, hold edge behind head. Raise entire body straight up and lower slowly.',
    instructions_ru: 'Лягте на скамью, держитесь за край за головой. Поднимите всё тело прямо вверх и медленно опустите.',
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
      `INSERT INTO exercises (id, name, name_ru, muscle_group, equipment, difficulty, set_type, instructions, instructions_ru, is_custom)
       VALUES (hex(randomblob(16)), ?, ?, ?, ?, ?, ?, ?, ?, 0)`
    );

    for (const ex of EXERCISES) {
      insertStmt.executeSync(
        ex.name,
        ex.name_ru,
        ex.muscle_group,
        JSON.stringify(ex.equipment),
        ex.difficulty,
        ex.set_type,
        ex.instructions,
        ex.instructions_ru
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
