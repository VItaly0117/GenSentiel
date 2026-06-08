import React from 'react';
import { View, Text, StyleSheet, Pressable, TextInput } from 'react-native';
import { Check } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

const Colors = {
  black: '#000000',
  primaryContainer: '#c3f400',
  primaryFixedDim: '#abd600',
  onSurface: '#e2e2e2',
  onSurfaceVariant: '#c4c9ac',
  surfaceContainerLow: '#1a1c1c',
  surfaceContainerHigh: '#282a2b',
  surfaceVariant: '#333535',
  outlineVariant: '#444933',
  neonGlow: 'rgba(195, 244, 0, 0.4)',
};

interface SetRowProps {
  setNumber: number;
  setType: 'weight_reps' | 'reps_only' | 'timed' | 'band_reps';
  weightKg?: number;
  reps?: number;
  timeS?: number;
  bandLevel?: 'light' | 'medium' | 'heavy' | 'extra_heavy';
  completed: boolean;
  isActive: boolean;
  isPR?: boolean;
  onWeightChange: (value: number) => void;
  onRepsChange: (value: number) => void;
  onTimeChange: (value: number) => void;
  onBandChange: (value: 'light' | 'medium' | 'heavy' | 'extra_heavy') => void;
  onComplete: () => void;
}

export function SetRow({
  setNumber,
  setType,
  weightKg,
  reps,
  timeS,
  bandLevel,
  completed,
  isActive,
  isPR,
  onWeightChange,
  onRepsChange,
  onTimeChange,
  onBandChange,
  onComplete,
}: SetRowProps) {
  const handleComplete = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onComplete();
  };

  const cycleBand = () => {
    const levels: Array<'light' | 'medium' | 'heavy' | 'extra_heavy'> = ['light', 'medium', 'heavy', 'extra_heavy'];
    const currentIndex = levels.indexOf(bandLevel || 'light');
    const nextIndex = (currentIndex + 1) % levels.length;
    onBandChange(levels[nextIndex]);
  };

  const bandColors = {
    light: '#FBBF24', // yellow
    medium: '#EF4444', // red
    heavy: '#8B5CF6', // purple
    extra_heavy: '#111827', // dark
  };

  return (
    <View style={[styles.container, isActive && styles.containerActive, completed && styles.containerCompleted]}>
      {isActive && <View style={styles.activeIndicator} />}
      
      {/* SET */}
      <View style={styles.cellSet}>
        <Text style={[styles.textSet, isActive && styles.textSetActive]}>{setNumber}</Text>
      </View>

      {/* LOAD */}
      <View style={styles.cellLoad}>
        {setType === 'weight_reps' && (
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={weightKg ? weightKg.toString() : ''}
            onChangeText={(text) => onWeightChange(parseFloat(text) || 0)}
            placeholder="0"
            placeholderTextColor={Colors.onSurfaceVariant}
          />
        )}
        {setType === 'reps_only' && <View style={styles.staticBox}><Text style={styles.staticText}>BW</Text></View>}
        {setType === 'timed' && <View style={styles.staticBox}><Text style={styles.staticText}>—</Text></View>}
        {setType === 'band_reps' && (
          <Pressable style={[styles.bandBox, { borderColor: bandColors[bandLevel || 'light'] }]} onPress={cycleBand}>
            <Text style={[styles.bandText, { color: bandColors[bandLevel || 'light'] }]}>
              {bandLevel === 'extra_heavy' ? 'X-HVY' : bandLevel?.toUpperCase() || 'LIGHT'}
            </Text>
          </Pressable>
        )}
      </View>

      {/* REPS / TIME */}
      <View style={styles.cellReps}>
        {(setType === 'weight_reps' || setType === 'reps_only' || setType === 'band_reps') && (
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={reps ? reps.toString() : ''}
              onChangeText={(text) => onRepsChange(parseInt(text, 10) || 0)}
              placeholder="0"
              placeholderTextColor={Colors.onSurfaceVariant}
            />
            {isPR && (
              <View style={styles.prBadge}>
                <Text style={styles.prText}>PR</Text>
              </View>
            )}
          </View>
        )}
        {setType === 'timed' && (
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={timeS ? timeS.toString() : ''}
            onChangeText={(text) => onTimeChange(parseInt(text, 10) || 0)}
            placeholder="0s"
            placeholderTextColor={Colors.onSurfaceVariant}
          />
        )}
      </View>

      {/* DONE */}
      <View style={styles.cellDone}>
        <Pressable 
          style={[styles.doneButton, completed && styles.doneButtonCompleted]} 
          onPress={handleComplete}
        >
          <Check size={20} color={completed ? Colors.black : Colors.onSurfaceVariant} strokeWidth={completed ? 3 : 2} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  containerCompleted: {
    opacity: 0.7,
    backgroundColor: Colors.surfaceContainerLow,
    borderColor: Colors.surfaceVariant,
  },
  containerActive: {
    backgroundColor: Colors.surfaceContainerHigh,
    borderColor: 'rgba(195, 244, 0, 0.5)',
    shadowColor: Colors.neonGlow,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 2,
    overflow: 'hidden',
  },
  activeIndicator: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: Colors.primaryContainer,
  },
  cellSet: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellLoad: {
    flex: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellReps: {
    flex: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellDone: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textSet: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    color: Colors.onSurface,
  },
  textSetActive: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 24,
    color: Colors.primaryContainer,
  },
  input: {
    width: '100%',
    backgroundColor: Colors.surfaceVariant,
    borderRadius: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    textAlign: 'center',
    color: Colors.onSurface,
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
  },
  staticBox: {
    width: '100%',
    backgroundColor: Colors.surfaceVariant,
    borderRadius: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
  },
  staticText: {
    color: Colors.onSurface,
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
  },
  bandBox: {
    width: '100%',
    backgroundColor: Colors.surfaceVariant,
    borderRadius: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  bandText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
  },
  inputContainer: {
    width: '100%',
    alignItems: 'center',
  },
  prBadge: {
    marginTop: 4,
    backgroundColor: 'rgba(195, 244, 0, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(195, 244, 0, 0.3)',
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  prText: {
    color: Colors.primaryContainer,
    fontFamily: 'Inter_600SemiBold',
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  doneButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.surfaceVariant,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
  },
  doneButtonCompleted: {
    backgroundColor: Colors.primaryContainer,
    borderColor: Colors.primaryContainer,
    shadowColor: Colors.neonGlow,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 4,
  },
});
