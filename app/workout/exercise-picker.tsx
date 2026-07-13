import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  TextInput,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, Search, Plus } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { getDb } from '../../src/db/database';
import { useWorkoutStore } from '../../src/stores/workoutStore';
import { haptics } from '../../src/utils/haptics';
import { useTranslation } from '../../src/i18n/useTranslation';

const Colors = {
  black: '#000000',
  primaryContainer: '#c3f400',
  surfaceContainerLowest: '#0c0f0f',
  surfaceContainerLow: '#1a1c1c',
  surfaceVariant: '#333535',
  onSurface: '#e2e2e2',
  onSurfaceVariant: '#c4c9ac',
};

interface ExerciseItem {
  id: string;
  name: string;
  nameRu: string;
  muscleGroup: string;
  setType: string;
  instructions: string | null;
  instructionsRu: string | null;
}

export default function ExercisePickerScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const muscleLabel = (group: string) => {
    const key = `exercisePicker.${group}`;
    const translated = t(key);
    return translated === key ? group : translated;
  };
  const { addExercise, exercises: activeExercises } = useWorkoutStore();
  const [allExercises, setAllExercises] = useState<ExerciseItem[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const db = getDb();
    const rows = db.getAllSync<any>(
      'SELECT id, name, name_ru as nameRu, muscle_group as muscleGroup, set_type as setType, instructions, instructions_ru as instructionsRu FROM exercises ORDER BY muscle_group, name',
    );
    setAllExercises(rows);
  }, []);

  const filtered = search.trim()
    ? allExercises.filter(
        (e) =>
          e.name.toLowerCase().includes(search.toLowerCase()) ||
          e.nameRu.toLowerCase().includes(search.toLowerCase()) ||
          e.muscleGroup.toLowerCase().includes(search.toLowerCase()),
      )
    : allExercises;

  const handleAdd = (ex: ExerciseItem) => {
    haptics.impact(Haptics.ImpactFeedbackStyle.Medium);
    addExercise({
      id: ex.id,
      name: ex.name,
      nameRu: ex.nameRu,
      setType: ex.setType as any,
      muscleGroup: ex.muscleGroup,
      instructions: ex.instructions,
      instructionsRu: ex.instructionsRu,
    });
    router.back();
  };

  const activeIds = new Set(activeExercises.map((e) => e.id));

  const renderItem = ({ item }: { item: ExerciseItem }) => {
    const alreadyAdded = activeIds.has(item.id);
    return (
      <Pressable
        style={[styles.row, alreadyAdded && styles.rowAdded]}
        onPress={() => !alreadyAdded && handleAdd(item)}
        disabled={alreadyAdded}
      >
        <View style={styles.rowInfo}>
          <Text style={styles.exName}>{item.nameRu || item.name}</Text>
          <Text style={styles.exMeta}>
            {muscleLabel(item.muscleGroup)} •{' '}
            {item.setType.replace(/_/g, ' ')}
          </Text>
        </View>
        {alreadyAdded ? (
          <Text style={styles.addedLabel}>{t('exercisePicker.added')}</Text>
        ) : (
          <View style={styles.addBtn}>
            <Plus size={18} color={Colors.black} />
          </View>
        )}
      </Pressable>
    );
  };

  const renderSectionHeader = (group: string) => (
    <Text style={styles.sectionHeader}>
      {muscleLabel(group)}
    </Text>
  );

  // Group items if no search
  const listData: (ExerciseItem | string)[] = [];
  if (!search.trim()) {
    const groups: Record<string, ExerciseItem[]> = {};
    for (const ex of filtered) {
      const g = ex.muscleGroup;
      if (!groups[g]) groups[g] = [];
      groups[g].push(ex);
    }
    for (const [g, items] of Object.entries(groups)) {
      listData.push(g);
      listData.push(...items);
    }
  } else {
    listData.push(...filtered);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <ChevronLeft size={24} color={Colors.onSurface} />
        </Pressable>
        <Text style={styles.topTitle}>{t('exercisePicker.title')}</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.searchBox}>
        <Search size={18} color={Colors.onSurfaceVariant} />
        <TextInput
          style={styles.searchInput}
          placeholder={t('exercisePicker.searchPlaceholder')}
          placeholderTextColor={Colors.onSurfaceVariant}
          value={search}
          onChangeText={setSearch}
          autoCorrect={false}
        />
      </View>

      <FlatList
        data={listData}
        keyExtractor={(item, i) =>
          typeof item === 'string' ? `header-${item}-${i}` : item.id
        }
        renderItem={({ item }) =>
          typeof item === 'string' ? (
            renderSectionHeader(item)
          ) : (
            renderItem({ item })
          )
        }
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.surfaceContainerLowest,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 56,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surfaceVariant,
  },
  backBtn: {
    padding: 4,
  },
  topTitle: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 16,
    color: '#ffffff',
    letterSpacing: 1,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceContainerLow,
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.surfaceVariant,
    gap: 8,
    height: 44,
  },
  searchInput: {
    flex: 1,
    color: Colors.onSurface,
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  sectionHeader: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 11,
    color: Colors.onSurfaceVariant,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginTop: 20,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: Colors.surfaceVariant,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  rowAdded: {
    opacity: 0.5,
  },
  rowInfo: {
    flex: 1,
  },
  exName: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 15,
    color: '#ffffff',
    marginBottom: 2,
  },
  exMeta: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: Colors.onSurfaceVariant,
    textTransform: 'capitalize',
  },
  addBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addedLabel: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 11,
    color: Colors.onSurfaceVariant,
    letterSpacing: 1,
  },
});
