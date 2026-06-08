import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, { useSharedValue, useAnimatedProps, withTiming } from 'react-native-reanimated';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const Colors = {
  black: '#000000',
  primaryContainer: '#c3f400',
  secondary: '#dcb8ff',
  tertiary: '#00daf3',
  surfaceVariant: '#333535',
  onSurfaceVariant: '#c4c9ac',
};

interface MacroRingProps {
  calories: number;
  caloriesGoal: number;
  protein: number;
  proteinGoal: number;
  carbs: number;
  carbsGoal: number;
  fat: number;
  fatGoal: number;
}

export function MacroRing({
  calories, caloriesGoal,
  protein, proteinGoal,
  carbs, carbsGoal,
  fat, fatGoal
}: MacroRingProps) {
  const size = 256;
  const center = size / 2;
  const strokeWidth = 12;

  // Radiuses for concentric circles
  const rCal = 110;
  const rPro = 85;
  const rCarb = 60;
  // Let's add fat if we want, or keep it simple with 3 rings as per design
  // The design gs_11 has 3 rings: Calories (cyan), Protein (lime), Carbs (violet)

  const circCal = 2 * Math.PI * rCal;
  const circPro = 2 * Math.PI * rPro;
  const circCarb = 2 * Math.PI * rCarb;

  const calProgress = useSharedValue(0);
  const proProgress = useSharedValue(0);
  const carbProgress = useSharedValue(0);

  useEffect(() => {
    calProgress.value = withTiming(Math.min(calories / (caloriesGoal || 1), 1), { duration: 1500 });
    proProgress.value = withTiming(Math.min(protein / (proteinGoal || 1), 1), { duration: 1500 });
    carbProgress.value = withTiming(Math.min(carbs / (carbsGoal || 1), 1), { duration: 1500 });
  }, [calories, protein, carbs]);

  const calProps = useAnimatedProps(() => ({
    strokeDashoffset: circCal - (circCal * calProgress.value)
  }));
  const proProps = useAnimatedProps(() => ({
    strokeDashoffset: circPro - (circPro * proProgress.value)
  }));
  const carbProps = useAnimatedProps(() => ({
    strokeDashoffset: circCarb - (circCarb * carbProgress.value)
  }));

  return (
    <View style={styles.container}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: [{ rotate: '-90deg' }] }}>
        {/* Background Tracks */}
        <Circle cx={center} cy={center} r={rCal} stroke={Colors.surfaceVariant} strokeWidth={strokeWidth} fill="none" />
        <Circle cx={center} cy={center} r={rPro} stroke={Colors.surfaceVariant} strokeWidth={strokeWidth} fill="none" />
        <Circle cx={center} cy={center} r={rCarb} stroke={Colors.surfaceVariant} strokeWidth={strokeWidth} fill="none" />

        {/* Foreground Animated Rings */}
        <AnimatedCircle 
          cx={center} cy={center} r={rCal} 
          stroke={Colors.tertiary} strokeWidth={strokeWidth} fill="none" 
          strokeLinecap="round" strokeDasharray={circCal} animatedProps={calProps} 
        />
        <AnimatedCircle 
          cx={center} cy={center} r={rPro} 
          stroke={Colors.primaryContainer} strokeWidth={strokeWidth} fill="none" 
          strokeLinecap="round" strokeDasharray={circPro} animatedProps={proProps} 
        />
        <AnimatedCircle 
          cx={center} cy={center} r={rCarb} 
          stroke={Colors.secondary} strokeWidth={strokeWidth} fill="none" 
          strokeLinecap="round" strokeDasharray={circCarb} animatedProps={carbProps} 
        />
      </Svg>

      <View style={styles.centerText}>
        <Text style={styles.calValue}>{Math.round(calories).toLocaleString()}</Text>
        <Text style={styles.calTarget}>/ {caloriesGoal} KCAL</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: 256,
    height: 256,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerText: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  calValue: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 32,
    color: '#ffffff',
  },
  calTarget: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
    color: Colors.onSurfaceVariant,
    marginTop: 4,
  },
});
