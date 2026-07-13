export type MovementPattern =
  | 'squat'
  | 'lunge'
  | 'hinge'
  | 'push'
  | 'pull'
  | 'shoulder'
  | 'curl'
  | 'core'
  | 'calf_raise';

export const PATTERN_LABELS: Record<MovementPattern, string> = {
  squat: 'SQUAT',
  lunge: 'LUNGE',
  hinge: 'HIP HINGE',
  push: 'PUSH',
  pull: 'PULL',
  shoulder: 'OVERHEAD',
  curl: 'ISOLATION',
  core: 'CORE',
  calf_raise: 'CALF RAISE',
};

/**
 * Classifies an exercise into a coarse movement pattern purely from its
 * (English) name and muscle group. Used to pick which abstract joint-motion
 * schematic to animate — not a literal per-exercise demo, since we have no
 * photo/video reference for ~65+ exercises.
 */
export function classifyMovementPattern(
  name: string,
  muscleGroup: string,
): MovementPattern {
  const n = name.toLowerCase();
  const mg = muscleGroup.toLowerCase();

  if (
    /plank|crunch|russian twist|dead bug|flutter kick|mountain climber|v-up|leg raise|hollow hold|l-sit|dragon flag|front lever/.test(
      n,
    )
  ) {
    return 'core';
  }

  if (/calf raise/.test(n)) return 'calf_raise';

  if (/split squat|bulgarian|lunge|step-up|step up/.test(n)) return 'lunge';

  if (/squat|wall sit|pistol|shrimp/.test(n)) return 'squat';

  if (/deadlift|glute bridge|kettlebell swing|superman/.test(n)) return 'hinge';

  if (/handstand/.test(n)) return 'shoulder';

  if (/press/.test(n)) {
    return mg === 'chest' ? 'push' : 'shoulder';
  }

  if (/push-up|pushup|floor press|flye|fly|dip/.test(n)) return 'push';

  if (/row|pull-up|pullup|chin-up|chinup|muscle-up|muscleup|face pull|pull-apart|snow angel/.test(n)) {
    return 'pull';
  }

  if (/raise/.test(n)) return 'shoulder';

  if (/curl|extension|kickback|arnold/.test(n)) return 'curl';

  switch (mg) {
    case 'chest':
      return 'push';
    case 'back':
      return 'pull';
    case 'shoulders':
      return 'shoulder';
    case 'arms':
      return 'curl';
    case 'legs':
      return 'squat';
    default:
      return 'core';
  }
}
