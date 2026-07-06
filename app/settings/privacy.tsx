import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';

const Colors = {
  black: '#000000',
  primaryContainer: '#c3f400',
  surfaceVariant: '#333535',
  onSurface: '#e2e2e2',
  onSurfaceVariant: '#c4c9ac',
  cardBg: '#111111',
  cardBorder: '#2A2A2A',
};

const SECTIONS = [
  {
    title: 'Data Storage',
    body: 'All your data — workouts, body metrics, nutrition logs, and progress photos — is stored exclusively on your device. GenSentiel does not transmit any personal data to external servers.',
  },
  {
    title: 'No Account Required',
    body: 'GenSentiel operates in local-first mode. No account, email, or personal information is required to use the app.',
  },
  {
    title: 'Progress Photos',
    body: 'Progress photos are saved to your device\'s document directory and are never uploaded, shared, or accessed by anyone other than you.',
  },
  {
    title: 'Analytics & Tracking',
    body: 'GenSentiel contains no analytics SDKs, crash reporters, or third-party tracking libraries. Your activity inside the app is invisible to us.',
  },
  {
    title: 'Data Export',
    body: 'You can export your workout telemetry as a CSV file at any time via Settings → Export Telemetry. You own your data completely.',
  },
  {
    title: 'Data Deletion',
    body: 'You can permanently delete all training data at any time via Settings → Purge Local Cache. Uninstalling the app also removes all stored data.',
  },
  {
    title: 'Contact',
    body: 'This is a local-first application with no external operator. All data control belongs entirely to you.',
  },
];

export default function PrivacyScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <ChevronLeft size={24} color={Colors.onSurface} />
        </Pressable>
        <Text style={styles.topTitle}>PRIVACY POLICY</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <Text style={styles.intro}>
          GenSentiel is a privacy-first, offline fitness tracker. Here's exactly how your data is handled.
        </Text>

        {SECTIONS.map((s) => (
          <View key={s.title} style={styles.card}>
            <Text style={styles.cardTitle}>{s.title}</Text>
            <Text style={styles.cardBody}>{s.body}</Text>
          </View>
        ))}

        <Text style={styles.version}>Last updated: 2025 • Version 1.0.0</Text>
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
  content: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 60,
    gap: 12,
  },
  intro: {
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    color: Colors.onSurfaceVariant,
    lineHeight: 22,
    marginBottom: 8,
  },
  card: {
    backgroundColor: Colors.cardBg,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    borderRadius: 12,
    padding: 16,
  },
  cardTitle: {
    fontFamily: 'SpaceGrotesk_600SemiBold',
    fontSize: 16,
    color: Colors.primaryContainer,
    marginBottom: 8,
  },
  cardBody: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: Colors.onSurface,
    lineHeight: 21,
  },
  version: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 10,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    marginTop: 8,
    letterSpacing: 1,
    opacity: 0.5,
  },
});
