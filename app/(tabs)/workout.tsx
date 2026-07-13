import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Search, Plus, Timer, ListTree, CheckCircle } from 'lucide-react-native';
import { getDb } from '../../src/db/database';
import { generateProgram, saveGeneratedProgram } from '../../src/utils/programGenerator';
import { getUserEquipment, getUserGoal } from '../../src/db/repositories/equipment';
import { useTranslation } from '../../src/i18n/useTranslation';

const Colors = {
  black: '#000000',
  primaryContainer: '#c3f400',
  primaryFixedDim: '#abd600',
  secondary: '#dcb8ff',
  surfaceContainerLow: '#1a1c1c',
  surfaceVariant: '#333535',
  outlineVariant: '#444933',
  onSurface: '#e2e2e2',
  onSurfaceVariant: '#c4c9ac',
};

const FILTERS = ['all', 'full_body', 'upper', 'lower'] as const;
const FILTER_LABEL_KEY: Record<string, string> = {
  all: 'filterAll',
  full_body: 'filterFullBody',
  upper: 'filterUpper',
  lower: 'filterLower',
};

export default function WorkoutListScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const [allTemplates, setAllTemplates] = useState<any[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);
  const [recentWorkouts, setRecentWorkouts] = useState<any[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const applyFilters = (all: any[], filter: string, search: string) => {
    let filtered = all;
    if (filter !== 'all') {
      filtered = filtered.filter((t) => t.split_type === filter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      filtered = filtered.filter((t) => t.name.toLowerCase().includes(q));
    }
    setTemplates(filtered);
  };

  const loadData = () => {
    const db = getDb();

    // Load templates
    const tmpls = db.getAllSync(`
      SELECT t.*, COUNT(te.id) as exerciseCount
      FROM workout_templates t
      LEFT JOIN template_exercises te ON t.id = te.template_id
      GROUP BY t.id
      ORDER BY t.is_generated DESC, t.created_at DESC
    `);
    setAllTemplates(tmpls);
    applyFilters(tmpls, activeFilter, searchQuery);

    // Load recent workouts
    const recents = db.getAllSync(`
      SELECT id, name, duration_s, started_at
      FROM workouts
      WHERE finished_at IS NOT NULL
      ORDER BY started_at DESC
      LIMIT 5
    `);
    setRecentWorkouts(recents);
  };

  useFocusEffect(useCallback(() => { loadData(); }, []));

  const handleGenerateProgram = async () => {
    setIsGenerating(true);
    try {
      const equipment = getUserEquipment();
      const goal = getUserGoal();
      const generatedDays = await generateProgram({
        equipment,
        splitType: 'full_body',
        difficulty: 3,
        daysPerWeek: 3,
        goal,
      });
      await saveGeneratedProgram(generatedDays);
      loadData();
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const startCustomWorkout = () => {
    router.push({ pathname: '/workout/active', params: { type: 'custom' } });
  };

  const startTemplate = (templateId: string) => {
    router.push({ pathname: '/workout/active', params: { templateId } });
  };

  const formatDuration = (s: number) => {
    const m = Math.floor(s / 60);
    return `${m} MIN`;
  };

  const formatDate = (isoStr: string) => {
    const d = new Date(isoStr);
    return `${d.getDate()}/${d.getMonth() + 1}`;
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{t('workoutTab.title')}</Text>
        <Pressable style={styles.newButton} onPress={startCustomWorkout}>
          <Plus size={16} color={Colors.black} />
          <Text style={styles.newButtonText}>{t('workoutTab.newBtn')}</Text>
        </Pressable>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {/* Search */}
        <View style={styles.searchContainer}>
          <Search size={20} color={Colors.onSurfaceVariant} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder={t('workoutTab.searchPlaceholder')}
            placeholderTextColor={Colors.onSurfaceVariant}
            value={searchQuery}
            onChangeText={(q) => {
              setSearchQuery(q);
              applyFilters(allTemplates, activeFilter, q);
            }}
          />
        </View>

        {/* Filters */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersScroll}>
          {FILTERS.map((f) => (
            <Pressable
              key={f}
              style={[styles.filterChip, activeFilter === f && styles.filterChipActive]}
              onPress={() => {
                setActiveFilter(f);
                applyFilters(allTemplates, f, searchQuery);
              }}
            >
              <Text style={activeFilter === f ? styles.filterChipTextActive : styles.filterChipText}>
                {t(`workoutTab.${FILTER_LABEL_KEY[f]}`)}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Templates */}
        <Text style={styles.sectionTitle}>{t('workoutTab.myPrograms')}</Text>
        {templates.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>{t('workoutTab.noPrograms')}</Text>
            <Pressable
              style={styles.generateButton}
              onPress={handleGenerateProgram}
              disabled={isGenerating}
            >
              <Text style={styles.generateButtonText}>
                {isGenerating ? t('workoutTab.generating') : t('workoutTab.generateFirst')}
              </Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.templatesGrid}>
            {templates.map((tmpl, idx) => {
              const isFeatured = idx === 0 && tmpl.is_generated;
              return (
                <View key={tmpl.id} style={[styles.templateCard, isFeatured && styles.templateCardFeatured]}>
                  {isFeatured && (
                    <View style={styles.aiBadge}>
                      <Text style={styles.aiBadgeText}>{t('workoutTab.aiGenerated')}</Text>
                    </View>
                  )}
                  <View style={styles.templateContent}>
                    <Text style={styles.templateName}>{tmpl.name}</Text>
                    <Text style={styles.templateDesc} numberOfLines={2}>
                      {tmpl.description || t('workoutTab.defaultDesc')}
                    </Text>
                    <View style={styles.templateStats}>
                      <View style={styles.statPill}>
                        <Timer size={14} color={isFeatured ? Colors.primaryContainer : Colors.secondary} />
                        <Text style={styles.statText}>45 {t('workoutTab.minutes')}</Text>
                      </View>
                      <View style={styles.statPill}>
                        <ListTree size={14} color={isFeatured ? Colors.primaryContainer : Colors.secondary} />
                        <Text style={styles.statText}>{tmpl.exerciseCount} {t('workoutTab.exercisesCount')}</Text>
                      </View>
                    </View>
                  </View>
                  <Pressable
                    style={[styles.startButton, isFeatured && styles.startButtonFeatured]}
                    onPress={() => startTemplate(tmpl.id)}
                  >
                    <Text style={[styles.startButtonText, isFeatured && styles.startButtonTextFeatured]}>{t('workoutTab.start')}</Text>
                  </Pressable>
                </View>
              );
            })}
          </View>
        )}

        {/* History */}
        <View style={styles.historyHeader}>
          <Text style={styles.sectionTitle}>{t('workoutTab.recentHistory')}</Text>
          <Pressable onPress={() => router.push('/(tabs)/history')}>
            <Text style={styles.viewAllText}>{t('workoutTab.viewAll')}</Text>
          </Pressable>
        </View>
        {recentWorkouts.length === 0 ? (
          <Text style={styles.emptyHistory}>{t('workoutTab.noRecentWorkouts')}</Text>
        ) : (
          <View style={styles.historyList}>
            {recentWorkouts.map((w) => (
              <View key={w.id} style={styles.historyCard}>
                <View style={styles.historyIconBox}>
                  <CheckCircle size={20} color={Colors.onSurface} />
                </View>
                <View style={styles.historyInfo}>
                  <Text style={styles.historyName}>{w.name}</Text>
                  <Text style={styles.historyMeta}>{formatDate(w.started_at)} • {formatDuration(w.duration_s || 0)}</Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
  },
  title: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 28,
    color: '#ffffff',
  },
  newButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryContainer,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 4,
  },
  newButtonText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
    color: Colors.black,
    letterSpacing: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  searchContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  searchIcon: {
    position: 'absolute',
    left: 16,
    top: 18,
    zIndex: 1,
  },
  searchInput: {
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#444444',
    borderRadius: 8,
    height: 56,
    paddingLeft: 48,
    paddingRight: 16,
    color: '#ffffff',
    fontFamily: 'Inter_400Regular',
  },
  filtersScroll: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    backgroundColor: Colors.surfaceVariant,
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: Colors.primaryContainer,
    borderColor: Colors.primaryContainer,
  },
  filterChipText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
    color: Colors.onSurface,
    textTransform: 'uppercase',
  },
  filterChipTextActive: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
    color: Colors.black,
    textTransform: 'uppercase',
  },
  sectionTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: Colors.onSurfaceVariant,
    letterSpacing: 1.5,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surfaceVariant,
    paddingBottom: 8,
    marginBottom: 16,
  },
  emptyCard: {
    backgroundColor: Colors.surfaceContainerLow,
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    gap: 16,
    marginBottom: 32,
  },
  emptyText: {
    fontFamily: 'Inter_400Regular',
    color: Colors.onSurfaceVariant,
  },
  generateButton: {
    backgroundColor: Colors.primaryContainer,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  generateButtonText: {
    fontFamily: 'Inter_600SemiBold',
    color: Colors.black,
  },
  templatesGrid: {
    gap: 16,
    marginBottom: 32,
  },
  templateCard: {
    backgroundColor: '#111111',
    borderWidth: 1,
    borderColor: '#2A2A2A',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'column',
    justifyContent: 'space-between',
    minHeight: 200,
  },
  templateCardFeatured: {
    borderColor: Colors.primaryContainer,
  },
  aiBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(195, 244, 0, 0.2)',
    borderColor: 'rgba(195, 244, 0, 0.5)',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  aiBadgeText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 10,
    color: Colors.primaryContainer,
  },
  templateContent: {
    flex: 1,
  },
  templateName: {
    fontFamily: 'SpaceGrotesk_600SemiBold',
    fontSize: 20,
    color: '#ffffff',
    textTransform: 'uppercase',
    marginBottom: 8,
    marginTop: 8,
  },
  templateDesc: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: Colors.onSurfaceVariant,
    marginBottom: 16,
  },
  templateStats: {
    flexDirection: 'row',
    gap: 16,
  },
  statPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 10,
    color: Colors.onSurface,
  },
  startButton: {
    width: '100%',
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: Colors.secondary,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  startButtonFeatured: {
    backgroundColor: Colors.primaryContainer,
    borderColor: Colors.primaryContainer,
  },
  startButtonText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
    color: Colors.secondary,
    letterSpacing: 1,
  },
  startButtonTextFeatured: {
    color: Colors.black,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  viewAllText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 10,
    color: Colors.onSurfaceVariant,
    letterSpacing: 1,
  },
  emptyHistory: {
    fontFamily: 'Inter_400Regular',
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    marginTop: 16,
  },
  historyList: {
    gap: 8,
  },
  historyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111111',
    borderWidth: 1,
    borderColor: '#2A2A2A',
    padding: 16,
    borderRadius: 8,
  },
  historyIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surfaceVariant,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  historyInfo: {
    flex: 1,
  },
  historyName: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: '#ffffff',
  },
  historyMeta: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 10,
    color: Colors.onSurfaceVariant,
    textTransform: 'uppercase',
    marginTop: 4,
  },
});
