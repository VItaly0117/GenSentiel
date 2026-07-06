import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, ChevronDown, ChevronUp } from 'lucide-react-native';

const Colors = {
  black: '#000000',
  primaryContainer: '#c3f400',
  secondary: '#dcb8ff',
  tertiary: '#00daf3',
  surfaceVariant: '#333535',
  onSurface: '#e2e2e2',
  onSurfaceVariant: '#c4c9ac',
  cardBg: '#111111',
  cardBorder: '#2A2A2A',
};

interface FAQ {
  q: string;
  a: string;
}

const SECTIONS: { title: string; color: string; faqs: FAQ[] }[] = [
  {
    title: 'Getting Started',
    color: Colors.primaryContainer,
    faqs: [
      {
        q: 'How do I start a workout?',
        a: 'Go to the Workouts tab. Tap "NEW" to start a custom session, or tap "START" on any saved program. Your session timer begins immediately.',
      },
      {
        q: 'How do I generate a training program?',
        a: 'Open the Workouts tab and tap "Generate First Program" if no programs exist. The AI will create a program based on your equipment and goals.',
      },
      {
        q: 'How do I add exercises to a custom workout?',
        a: 'While in an active session, tap the "+" button in the top bar to open the exercise browser. Search by name or muscle group, then tap the add button.',
      },
    ],
  },
  {
    title: 'Tracking & Logging',
    color: Colors.secondary,
    faqs: [
      {
        q: 'How do I log body metrics?',
        a: 'Go to the Profile tab and tap "LOG TODAY". Enter your weight, body fat %, waist, chest, and arms measurements. The chart updates automatically.',
      },
      {
        q: 'How do I log food / nutrition?',
        a: 'Open the Nutrition tab and tap the "+" button (bottom right). Select the meal type, enter the food name, calories, and macros.',
      },
      {
        q: 'How is rest time tracked?',
        a: 'After completing a set, a 60-second rest timer appears automatically. You can subtract 10s, add 30s, or skip it entirely. Your phone will vibrate when time is up.',
      },
      {
        q: 'What are Personal Records (PRs)?',
        a: 'A PR is tracked automatically when you lift more weight or reps than your previous best for an exercise. They appear on the workout summary screen.',
      },
    ],
  },
  {
    title: 'History & Progression',
    color: Colors.tertiary,
    faqs: [
      {
        q: 'Where can I see past workouts?',
        a: 'The History tab shows all completed sessions. Tap any card to see the full summary with stats and progression intel.',
      },
      {
        q: 'What is Progression Intel?',
        a: 'After finishing a workout, GenSentiel analyzes your recent performance and suggests whether to increase weight, reps, or sets for each exercise.',
      },
      {
        q: 'How is the streak calculated?',
        a: 'Your streak counts consecutive calendar days with at least one completed workout, counting backwards from today.',
      },
    ],
  },
  {
    title: 'Data & Settings',
    color: Colors.onSurfaceVariant,
    faqs: [
      {
        q: 'How do I export my data?',
        a: 'Settings → Export Telemetry generates a CSV of all completed workouts (date, name, duration, sets, total volume). Share it to any app on your device.',
      },
      {
        q: 'How do I take progress photos?',
        a: 'Settings → Progress Photos → tap the camera FAB. Photos are stored locally and never uploaded.',
      },
      {
        q: 'Can I sync to the cloud?',
        a: 'Cloud sync via PowerSync is planned but not yet active. The app currently operates in Local-First Mode — all data stays on your device.',
      },
      {
        q: 'How do I delete all data?',
        a: 'Settings → Purge Local Cache will delete all workouts, sets, nutrition logs, and body metrics. This cannot be undone.',
      },
    ],
  },
];

function FAQItem({ faq }: { faq: FAQ }) {
  const [open, setOpen] = useState(false);
  return (
    <Pressable style={styles.faqItem} onPress={() => setOpen(!open)}>
      <View style={styles.faqHeader}>
        <Text style={styles.faqQ}>{faq.q}</Text>
        {open ? (
          <ChevronUp size={16} color={Colors.onSurfaceVariant} />
        ) : (
          <ChevronDown size={16} color={Colors.onSurfaceVariant} />
        )}
      </View>
      {open && <Text style={styles.faqA}>{faq.a}</Text>}
    </Pressable>
  );
}

export default function HelpScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <ChevronLeft size={24} color={Colors.onSurface} />
        </Pressable>
        <Text style={styles.topTitle}>HELP & DOCS</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        {SECTIONS.map((section) => (
          <View key={section.title}>
            <Text style={[styles.sectionTitle, { color: section.color }]}>{section.title.toUpperCase()}</Text>
            <View style={styles.group}>
              {section.faqs.map((faq, i) => (
                <FAQItem key={i} faq={faq} />
              ))}
            </View>
          </View>
        ))}
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
    gap: 8,
  },
  sectionTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 11,
    letterSpacing: 1.5,
    marginBottom: 8,
    marginLeft: 4,
    marginTop: 16,
  },
  group: {
    backgroundColor: Colors.cardBg,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    borderRadius: 12,
    overflow: 'hidden',
  },
  faqItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  faqQ: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: Colors.onSurface,
    flex: 1,
  },
  faqA: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: Colors.onSurfaceVariant,
    lineHeight: 21,
    marginTop: 12,
  },
});
