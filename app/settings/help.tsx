import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, ChevronDown, ChevronUp } from 'lucide-react-native';
import { useTranslation } from '../../src/i18n/useTranslation';
import { translations } from '../../src/i18n/translations';

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

const SECTION_COLORS = [Colors.primaryContainer, Colors.secondary, Colors.tertiary, Colors.onSurfaceVariant];

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
  const { t } = useTranslation();
  // FAQ content stays in English regardless of app language — only short UI chrome is localized.
  const sections = translations.en.help.sections;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <ChevronLeft size={24} color={Colors.onSurface} />
        </Pressable>
        <Text style={styles.topTitle}>{t('help.title')}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        {sections.map((section, sIdx) => (
          <View key={section.title}>
            <Text style={[styles.sectionTitle, { color: SECTION_COLORS[sIdx] }]}>{section.title.toUpperCase()}</Text>
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
