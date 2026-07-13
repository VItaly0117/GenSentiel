import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, Line } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { MovementPattern } from '../../utils/movementPattern';
import { useTranslation } from '../../i18n/useTranslation';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedLine = Animated.createAnimatedComponent(Line);

const Colors = {
  tertiary: '#00daf3',
  onSurfaceVariant: '#c4c9ac',
};

interface Joint {
  x: number;
  y: number;
}

interface Pose {
  head: Joint;
  shoulder: Joint;
  elbow: Joint;
  hand: Joint;
  hip: Joint;
  knee: Joint;
  foot: Joint;
}

// Neutral standing rig — reused as the "rest" keyframe for most patterns.
const STANDING: Pose = {
  head: { x: 50, y: 16 },
  shoulder: { x: 50, y: 30 },
  elbow: { x: 58, y: 42 },
  hand: { x: 62, y: 54 },
  hip: { x: 50, y: 54 },
  knee: { x: 50, y: 74 },
  foot: { x: 50, y: 92 },
};

/**
 * Two-keyframe joint poses per movement pattern. These are abstract HUD
 * schematics (not a literal reproduction of any single exercise) — the goal
 * is to convey the core joint mechanic (knees bend, hips hinge, arm pushes
 * away vs. pulls in, etc.) since we have no photo/video reference for the
 * full exercise catalog.
 */
const POSES: Record<MovementPattern, [Pose, Pose]> = {
  squat: [
    STANDING,
    {
      head: { x: 50, y: 34 }, shoulder: { x: 50, y: 46 }, elbow: { x: 64, y: 48 },
      hand: { x: 68, y: 38 }, hip: { x: 50, y: 66 }, knee: { x: 36, y: 76 }, foot: { x: 50, y: 92 },
    },
  ],
  lunge: [
    STANDING,
    {
      head: { x: 46, y: 28 }, shoulder: { x: 44, y: 40 }, elbow: { x: 54, y: 46 },
      hand: { x: 58, y: 52 }, hip: { x: 42, y: 52 }, knee: { x: 30, y: 72 }, foot: { x: 24, y: 90 },
    },
  ],
  hinge: [
    STANDING,
    {
      head: { x: 68, y: 34 }, shoulder: { x: 62, y: 32 }, elbow: { x: 66, y: 44 },
      hand: { x: 68, y: 58 }, hip: { x: 46, y: 50 }, knee: { x: 48, y: 72 }, foot: { x: 50, y: 92 },
    },
  ],
  push: [
    {
      head: { x: 50, y: 16 }, shoulder: { x: 50, y: 30 }, elbow: { x: 60, y: 40 },
      hand: { x: 56, y: 30 }, hip: { x: 50, y: 54 }, knee: { x: 50, y: 74 }, foot: { x: 50, y: 92 },
    },
    {
      head: { x: 50, y: 16 }, shoulder: { x: 50, y: 30 }, elbow: { x: 66, y: 36 },
      hand: { x: 78, y: 32 }, hip: { x: 50, y: 54 }, knee: { x: 50, y: 74 }, foot: { x: 50, y: 92 },
    },
  ],
  pull: [
    {
      head: { x: 50, y: 16 }, shoulder: { x: 50, y: 30 }, elbow: { x: 66, y: 36 },
      hand: { x: 78, y: 32 }, hip: { x: 50, y: 54 }, knee: { x: 50, y: 74 }, foot: { x: 50, y: 92 },
    },
    {
      head: { x: 52, y: 17 }, shoulder: { x: 48, y: 32 }, elbow: { x: 60, y: 40 },
      hand: { x: 52, y: 32 }, hip: { x: 48, y: 54 }, knee: { x: 50, y: 74 }, foot: { x: 50, y: 92 },
    },
  ],
  shoulder: [
    {
      head: { x: 50, y: 16 }, shoulder: { x: 50, y: 30 }, elbow: { x: 56, y: 44 },
      hand: { x: 58, y: 56 }, hip: { x: 50, y: 54 }, knee: { x: 50, y: 74 }, foot: { x: 50, y: 92 },
    },
    {
      head: { x: 50, y: 16 }, shoulder: { x: 50, y: 30 }, elbow: { x: 62, y: 20 },
      hand: { x: 66, y: 8 }, hip: { x: 50, y: 54 }, knee: { x: 50, y: 74 }, foot: { x: 50, y: 92 },
    },
  ],
  curl: [
    {
      head: { x: 50, y: 16 }, shoulder: { x: 50, y: 30 }, elbow: { x: 58, y: 42 },
      hand: { x: 62, y: 54 }, hip: { x: 50, y: 54 }, knee: { x: 50, y: 74 }, foot: { x: 50, y: 92 },
    },
    {
      head: { x: 50, y: 16 }, shoulder: { x: 50, y: 30 }, elbow: { x: 58, y: 42 },
      hand: { x: 62, y: 26 }, hip: { x: 50, y: 54 }, knee: { x: 50, y: 74 }, foot: { x: 50, y: 92 },
    },
  ],
  core: [
    STANDING,
    {
      head: { x: 58, y: 30 }, shoulder: { x: 56, y: 38 }, elbow: { x: 60, y: 46 },
      hand: { x: 62, y: 52 }, hip: { x: 50, y: 56 }, knee: { x: 40, y: 58 }, foot: { x: 34, y: 66 },
    },
  ],
  calf_raise: [
    STANDING,
    {
      head: { x: 50, y: 13 }, shoulder: { x: 50, y: 27 }, elbow: { x: 58, y: 39 },
      hand: { x: 62, y: 51 }, hip: { x: 50, y: 51 }, knee: { x: 50, y: 71 }, foot: { x: 50, y: 86 },
    },
  ],
};

function lerp(a: number, b: number, t: number) {
  'worklet';
  return a + (b - a) * t;
}

interface MovementAnimationProps {
  pattern: MovementPattern;
  size?: number;
  showLabel?: boolean;
}

export function MovementAnimation({ pattern, size = 72, showLabel = true }: MovementAnimationProps) {
  const { t } = useTranslation();
  const progress = useSharedValue(0);
  const [poseA, poseB] = POSES[pattern];

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, { duration: 900, easing: Easing.inOut(Easing.quad) }),
      -1,
      true,
    );
  }, [pattern]);

  const headProps = useAnimatedProps(() => ({
    cx: lerp(poseA.head.x, poseB.head.x, progress.value),
    cy: lerp(poseA.head.y, poseB.head.y, progress.value),
  }));

  const torsoProps = useAnimatedProps(() => ({
    x1: lerp(poseA.shoulder.x, poseB.shoulder.x, progress.value),
    y1: lerp(poseA.shoulder.y, poseB.shoulder.y, progress.value),
    x2: lerp(poseA.hip.x, poseB.hip.x, progress.value),
    y2: lerp(poseA.hip.y, poseB.hip.y, progress.value),
  }));

  const upperArmProps = useAnimatedProps(() => ({
    x1: lerp(poseA.shoulder.x, poseB.shoulder.x, progress.value),
    y1: lerp(poseA.shoulder.y, poseB.shoulder.y, progress.value),
    x2: lerp(poseA.elbow.x, poseB.elbow.x, progress.value),
    y2: lerp(poseA.elbow.y, poseB.elbow.y, progress.value),
  }));

  const forearmProps = useAnimatedProps(() => ({
    x1: lerp(poseA.elbow.x, poseB.elbow.x, progress.value),
    y1: lerp(poseA.elbow.y, poseB.elbow.y, progress.value),
    x2: lerp(poseA.hand.x, poseB.hand.x, progress.value),
    y2: lerp(poseA.hand.y, poseB.hand.y, progress.value),
  }));

  const thighProps = useAnimatedProps(() => ({
    x1: lerp(poseA.hip.x, poseB.hip.x, progress.value),
    y1: lerp(poseA.hip.y, poseB.hip.y, progress.value),
    x2: lerp(poseA.knee.x, poseB.knee.x, progress.value),
    y2: lerp(poseA.knee.y, poseB.knee.y, progress.value),
  }));

  const shinProps = useAnimatedProps(() => ({
    x1: lerp(poseA.knee.x, poseB.knee.x, progress.value),
    y1: lerp(poseA.knee.y, poseB.knee.y, progress.value),
    x2: lerp(poseA.foot.x, poseB.foot.x, progress.value),
    y2: lerp(poseA.foot.y, poseB.foot.y, progress.value),
  }));

  return (
    <View style={styles.wrapper}>
      <View style={[styles.glowBox, { width: size, height: size }]}>
        <Svg width={size} height={size} viewBox="0 0 100 100">
          <AnimatedLine animatedProps={shinProps} stroke={Colors.tertiary} strokeWidth={4} strokeLinecap="round" />
          <AnimatedLine animatedProps={thighProps} stroke={Colors.tertiary} strokeWidth={4} strokeLinecap="round" />
          <AnimatedLine animatedProps={torsoProps} stroke={Colors.tertiary} strokeWidth={4} strokeLinecap="round" />
          <AnimatedLine animatedProps={upperArmProps} stroke={Colors.tertiary} strokeWidth={4} strokeLinecap="round" />
          <AnimatedLine animatedProps={forearmProps} stroke={Colors.tertiary} strokeWidth={4} strokeLinecap="round" />
          <AnimatedCircle animatedProps={headProps} r={7} fill="#000000" stroke={Colors.tertiary} strokeWidth={3} />
        </Svg>
      </View>
      {showLabel && <Text style={styles.label}>{t(`movementPattern.${pattern}`)}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    gap: 4,
  },
  glowBox: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 218, 243, 0.06)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0, 218, 243, 0.25)',
    shadowColor: 'rgba(0, 218, 243, 0.6)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 6,
  },
  label: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 9,
    letterSpacing: 1,
    color: Colors.onSurfaceVariant,
  },
});
