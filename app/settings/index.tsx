import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, Pressable, ScrollView, SafeAreaView, Alert, Share } from 'react-native';
import { useRouter } from 'expo-router';
import { CloudOff, Cloud, Bell, Languages, Database, Shield, Download, ChevronLeft, HelpCircle, Camera } from 'lucide-react-native';
import { getDb } from '../../src/db/database';
import { getSetting, setSetting } from '../../src/db/repositories/equipment';
import { useLanguageStore } from '../../src/stores/languageStore';
import { useTranslation } from '../../src/i18n/useTranslation';

const Colors = {
  black: '#000000',
  primaryContainer: '#c3f400',
  surfaceContainerLow: '#1a1c1c',
  surfaceVariant: '#333535',
  outlineVariant: '#444933',
  onSurface: '#e2e2e2',
  onSurfaceVariant: '#c4c9ac',
  cardBg: '#111111',
  cardBorder: '#2A2A2A',
  error: '#ffb4ab',
  violet: '#dcb8ff',
};

export default function SettingsScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const language = useLanguageStore((s) => s.language);
  const setLanguage = useLanguageStore((s) => s.setLanguage);
  const [haptics, setHapticsState] = useState(() => getSetting('haptics_enabled') !== '0');

  const setHaptics = (value: boolean) => {
    setHapticsState(value);
    setSetting('haptics_enabled', value ? '1' : '0');
  };

  const handleCloudSync = () => {
    Alert.alert(
      t('settingsIndex.cloudSyncTitle'),
      t('settingsIndex.cloudSyncBody'),
      [{ text: t('settingsIndex.understood'), style: 'default' }]
    );
  };

  const handlePurge = () => {
    Alert.alert(
      t('settingsIndex.purgeTitle'),
      t('settingsIndex.purgeBody'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('settingsIndex.purge'),
          style: 'destructive',
          onPress: () => {
            try {
              const db = getDb();
              db.execSync(`
                DELETE FROM workout_sets;
                DELETE FROM workouts;
                DELETE FROM nutrition_logs;
                DELETE FROM body_metrics;
              `);
              Alert.alert(t('settingsIndex.purgeDoneTitle'), t('settingsIndex.purgeDoneBody'));
            } catch (e) {
              console.error("Purge failed", e);
              Alert.alert(t('common.error'), t('settingsIndex.purgeFailBody'));
            }
          },
        },
      ]
    );
  };

  const handleExport = async () => {
    try {
      const db = getDb();
      const workouts = db.getAllSync<any>(`
        SELECT w.name, w.started_at, w.duration_s,
          COUNT(ws.id) as sets,
          SUM(ws.weight_kg * ws.reps) as volume
        FROM workouts w
        LEFT JOIN workout_sets ws ON w.id = ws.workout_id AND ws.completed = 1
        WHERE w.finished_at IS NOT NULL
        GROUP BY w.id
        ORDER BY w.started_at DESC
      `);

      const header = 'Date,Name,Duration (min),Sets,Volume (kg)';
      const rows = workouts.map((w) => {
        const date = w.started_at?.split('T')[0] ?? '';
        const dur = Math.round((w.duration_s || 0) / 60);
        const vol = Math.round(w.volume || 0);
        return `${date},"${w.name}",${dur},${w.sets || 0},${vol}`;
      });
      const csv = [header, ...rows].join('\n');

      await Share.share({ message: csv, title: 'GenSentiel Workout Log' });
    } catch (e) {
      Alert.alert(t('settingsIndex.exportErrorTitle'), t('settingsIndex.exportErrorBody'));
    }
  };

  const renderSectionHeader = (title: string) => (
    <Text style={styles.sectionHeader}>{title}</Text>
  );

  const renderRow = (icon: any, title: string, rightContent?: any, onPress?: () => void) => (
    <Pressable style={styles.row} onPress={onPress} disabled={!onPress}>
      <View style={styles.rowLeft}>
        {icon}
        <Text style={styles.rowTitle}>{title}</Text>
      </View>
      <View style={styles.rowRight}>
        {rightContent}
      </View>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.safe}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <ChevronLeft size={24} color={Colors.onSurface} />
        </Pressable>
        <Text style={styles.topTitle}>{t('settingsIndex.title')}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarBox}>
            <View style={styles.avatarInner}>
              <Text style={styles.avatarText}>AS</Text>
            </View>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{t('settingsIndex.profileName')}</Text>
            <Text style={styles.profileStatus}>{t('settingsIndex.profileStatus')}</Text>
          </View>
          <Pressable style={styles.syncBtn} onPress={handleCloudSync}>
            <Text style={styles.syncBtnText}>{t('settingsIndex.syncData')}</Text>
          </Pressable>
        </View>

        {/* Offline Banner */}
        <View style={styles.offlineBanner}>
          <CloudOff size={16} color={Colors.onSurfaceVariant} />
          <Text style={styles.offlineText}>{t('settingsIndex.offline')}</Text>
        </View>

        {/* Preferences */}
        {renderSectionHeader(t('settingsIndex.systemPreferences'))}
        <View style={styles.group}>
          {renderRow(
            <Bell size={20} color={Colors.primaryContainer} />,
            t('settingsIndex.hapticsRow'),
            <Switch
              value={haptics}
              onValueChange={setHaptics}
              trackColor={{ false: Colors.surfaceVariant, true: Colors.primaryContainer }}
              thumbColor={haptics ? Colors.black : Colors.onSurfaceVariant}
            />
          )}
          {renderRow(
            <Languages size={20} color={Colors.primaryContainer} />,
            t('settingsIndex.language'),
            <View style={styles.langSwitch}>
              <Pressable
                style={[styles.langChip, language === 'en' && styles.langChipActive]}
                onPress={() => setLanguage('en')}
              >
                <Text style={[styles.langChipText, language === 'en' && styles.langChipTextActive]}>EN</Text>
              </Pressable>
              <Pressable
                style={[styles.langChip, language === 'ru' && styles.langChipActive]}
                onPress={() => setLanguage('ru')}
              >
                <Text style={[styles.langChipText, language === 'ru' && styles.langChipTextActive]}>RU</Text>
              </Pressable>
            </View>
          )}
        </View>

        {/* Cloud & Data */}
        {renderSectionHeader(t('settingsIndex.dataNode'))}
        <View style={styles.group}>
          {renderRow(
            <Camera size={20} color={Colors.onSurface} />,
            t('settingsIndex.progressPhotos'),
            <View style={{ transform: [{ rotate: '180deg' }] }}><ChevronLeft size={20} color={Colors.onSurfaceVariant} /></View>,
            () => router.push('/settings/photos')
          )}
          {renderRow(
            <Cloud size={20} color={Colors.violet} />,
            t('settingsIndex.cloudSync'),
            null,
            handleCloudSync
          )}
          {renderRow(
            <Download size={20} color={Colors.primaryContainer} />,
            t('settingsIndex.exportTelemetry'),
            null,
            handleExport
          )}
          {renderRow(
            <Database size={20} color={Colors.error} />,
            t('settingsIndex.purgeCache'),
            null,
            handlePurge
          )}
        </View>

        {/* Info */}
        {renderSectionHeader(t('settingsIndex.systemInfo'))}
        <View style={styles.group}>
          {renderRow(
            <Shield size={20} color={Colors.primaryContainer} />,
            t('settingsIndex.privacyPolicy'),
            <View style={{ transform: [{ rotate: '180deg' }] }}><ChevronLeft size={20} color={Colors.onSurfaceVariant} /></View>,
            () => router.push('/settings/privacy')
          )}
          {renderRow(
            <HelpCircle size={20} color={Colors.primaryContainer} />,
            t('settingsIndex.helpDocs'),
            <View style={{ transform: [{ rotate: '180deg' }] }}><ChevronLeft size={20} color={Colors.onSurfaceVariant} /></View>,
            () => router.push('/settings/help')
          )}
        </View>

        <Text style={styles.version}>{t('settingsIndex.version')}</Text>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.black,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surfaceVariant,
  },
  backBtn: {
    padding: 4,
  },
  topTitle: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 18,
    color: '#ffffff',
    letterSpacing: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 60,
  },
  profileCard: {
    backgroundColor: 'rgba(220, 184, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(220, 184, 255, 0.2)',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.cardBg,
    borderWidth: 1,
    borderColor: Colors.violet,
    padding: 2,
    marginRight: 16,
  },
  avatarInner: {
    flex: 1,
    backgroundColor: 'rgba(220, 184, 255, 0.2)',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 16,
    color: Colors.violet,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontFamily: 'SpaceGrotesk_600SemiBold',
    fontSize: 16,
    color: '#ffffff',
  },
  profileStatus: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: Colors.onSurfaceVariant,
    marginTop: 2,
  },
  syncBtn: {
    borderWidth: 1,
    borderColor: Colors.violet,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: 'rgba(220, 184, 255, 0.1)',
  },
  syncBtnText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 10,
    color: Colors.violet,
    letterSpacing: 1,
  },
  offlineBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surfaceVariant,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 8,
    marginBottom: 32,
  },
  offlineText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 10,
    color: Colors.onSurfaceVariant,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  sectionHeader: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
    color: Colors.onSurfaceVariant,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 8,
    marginLeft: 4,
  },
  group: {
    backgroundColor: Colors.cardBg,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    borderRadius: 12,
    marginBottom: 24,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  rowTitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    color: '#ffffff',
  },
  rowRight: {
    justifyContent: 'center',
  },
  langSwitch: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceVariant,
    borderRadius: 8,
    padding: 2,
    gap: 2,
  },
  langChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  langChipActive: {
    backgroundColor: Colors.primaryContainer,
  },
  langChipText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
    color: Colors.onSurfaceVariant,
  },
  langChipTextActive: {
    color: Colors.black,
  },
  version: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 10,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    marginTop: 16,
    letterSpacing: 1,
    opacity: 0.5,
  },
});
