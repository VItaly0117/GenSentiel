import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, Pressable, ScrollView, SafeAreaView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { CloudOff, Cloud, Bell, Moon, Database, Shield, Download, ChevronLeft, HelpCircle, Camera } from 'lucide-react-native';

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
  const [haptics, setHaptics] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  
  const handleCloudSync = () => {
    Alert.alert(
      "Cloud Sync",
      "PowerSync & Supabase integration requires active backend credentials. Currently running in Local-First Mode.",
      [{ text: "Understood", style: "default" }]
    );
  };

  const handlePurge = () => {
    Alert.alert(
      "Purge Local Cache",
      "Are you sure you want to delete all local workout and telemetry data? This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Purge", style: "destructive" }
      ]
    );
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
        <Text style={styles.topTitle}>SETTINGS</Text>
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
            <Text style={styles.profileName}>Anonymous Sentinel</Text>
            <Text style={styles.profileStatus}>Local Node Active</Text>
          </View>
          <Pressable style={styles.syncBtn} onPress={handleCloudSync}>
            <Text style={styles.syncBtnText}>SYNC DATA</Text>
          </Pressable>
        </View>

        {/* Offline Banner */}
        <View style={styles.offlineBanner}>
          <CloudOff size={16} color={Colors.onSurfaceVariant} />
          <Text style={styles.offlineText}>System Offline - Local Storage Only</Text>
        </View>

        {/* Preferences */}
        {renderSectionHeader('SYSTEM PREFERENCES')}
        <View style={styles.group}>
          {renderRow(
            <Bell size={20} color={Colors.primaryContainer} />, 
            'Tactical Alerts (Haptics)',
            <Switch 
              value={haptics} 
              onValueChange={setHaptics} 
              trackColor={{ false: Colors.surfaceVariant, true: Colors.primaryContainer }}
              thumbColor={haptics ? Colors.black : Colors.onSurfaceVariant}
            />
          )}
          {renderRow(
            <Moon size={20} color={Colors.primaryContainer} />, 
            'Dark Protocol',
            <Switch 
              value={darkMode} 
              onValueChange={setDarkMode}
              trackColor={{ false: Colors.surfaceVariant, true: Colors.primaryContainer }}
              thumbColor={darkMode ? Colors.black : Colors.onSurfaceVariant}
            />
          )}
        </View>

        {/* Cloud & Data */}
        {renderSectionHeader('DATA NODE')}
        <View style={styles.group}>
          {renderRow(
            <Camera size={20} color={Colors.onSurface} />, 
            'Progress Photos',
            <View style={{ transform: [{ rotate: '180deg' }] }}><ChevronLeft size={20} color={Colors.onSurfaceVariant} /></View>,
            () => router.push('/settings/photos')
          )}
          {renderRow(
            <Cloud size={20} color={Colors.violet} />, 
            'Cloud Sync (PowerSync)',
            null,
            handleCloudSync
          )}
          {renderRow(
            <Download size={20} color={Colors.primaryContainer} />, 
            'Export Telemetry',
            null,
            () => Alert.alert('Export', 'Telemetry export started...')
          )}
          {renderRow(
            <Database size={20} color={Colors.error} />, 
            'Purge Local Cache',
            null,
            handlePurge
          )}
        </View>

        {/* Info */}
        {renderSectionHeader('SYSTEM INFO')}
        <View style={styles.group}>
          {renderRow(
            <Shield size={20} color={Colors.primaryContainer} />, 
            'Privacy Policy'
          )}
          {renderRow(
            <HelpCircle size={20} color={Colors.primaryContainer} />, 
            'Help & Documentation'
          )}
        </View>

        <Text style={styles.version}>GenSentiel v1.0.0 • Local Build</Text>

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
