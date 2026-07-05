import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, SafeAreaView } from 'react-native';
import { Activity, Scaling, Ruler, Expand, Plus, Settings } from 'lucide-react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import { getBodyMetricsHistory, saveBodyMetrics, BodyMetric } from '../../src/db/repositories/nutrition';

const Colors = {
  black: '#000000',
  primaryContainer: '#c3f400',
  secondary: '#dcb8ff',
  tertiary: '#00daf3',
  surfaceContainerLow: '#1a1c1c',
  surfaceVariant: '#333535',
  onSurface: '#e2e2e2',
  onSurfaceVariant: '#c4c9ac',
  cardBg: '#111111',
  cardBorder: '#2A2A2A',
  error: '#ffb4ab',
};

export default function ProfileScreen() {
  const router = useRouter();
  const [history, setHistory] = useState<BodyMetric[]>([]);
  const [current, setCurrent] = useState<BodyMetric | null>(null);

  const loadData = () => {
    const data = getBodyMetricsHistory(30);
    setHistory(data.reverse()); // Chronological for chart
    setCurrent(data.length > 0 ? data[data.length - 1] : null);
  };

  useFocusEffect(useCallback(() => { loadData(); }, []));

  const handleLogDummy = () => {
    const today = new Date().toISOString().split('T')[0];
    const prevWeight = current?.weight_kg || 80.5;
    const w = prevWeight + (Math.random() - 0.5); // Random fluctuation
    saveBodyMetrics(today, {
      weight_kg: parseFloat(w.toFixed(1)),
      body_fat_pct: 14.2,
      waist_cm: 82.5,
      chest_cm: 104.0,
    });
    loadData();
  };

  const renderChart = () => {
    if (history.length < 2) return <View style={styles.chartArea} />;

    // Simple normalization
    const minW = Math.min(...history.map(h => h.weight_kg || 0));
    const maxW = Math.max(...history.map(h => h.weight_kg || 0));
    const range = (maxW - minW) || 1;

    const width = 300;
    const height = 120;
    
    const points = history.map((h, i) => {
      const x = (i / (history.length - 1)) * width;
      const y = height - (((h.weight_kg || minW) - minW) / range) * height;
      return `${x},${y}`;
    });

    const pathData = `M${points[0]} ` + points.map(p => `L${p}`).join(' ');
    const fillData = `${pathData} L${width},${height} L0,${height} Z`;

    return (
      <View style={styles.chartArea}>
        <Svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
          <Defs>
            <LinearGradient id="limeGlow" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor={Colors.primaryContainer} stopOpacity="0.4" />
              <Stop offset="100%" stopColor={Colors.primaryContainer} stopOpacity="0" />
            </LinearGradient>
          </Defs>
          <Path d={fillData} fill="url(#limeGlow)" />
          <Path d={pathData} fill="none" stroke={Colors.primaryContainer} strokeWidth="2" strokeLinejoin="round" />
        </Svg>
        {/* Grid lines */}
        <View style={styles.gridLines}>
          <View style={styles.gridLine} />
          <View style={styles.gridLine} />
          <View style={styles.gridLine} />
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        
        {/* Header */}
        <View style={styles.headerRow}>
          <Text style={styles.title}>BODY METRICS</Text>
          <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
            <Pressable style={styles.logButton} onPress={handleLogDummy}>
              <Plus size={16} color={Colors.black} />
              <Text style={styles.logButtonText}>LOG TODAY</Text>
            </Pressable>
            <Pressable onPress={() => router.push('/settings')}>
              <Settings size={24} color={Colors.onSurfaceVariant} />
            </Pressable>
          </View>
        </View>

        {/* Chart Card */}
        <View style={styles.glassCard}>
          <View style={styles.glassHeader}>
            <View>
              <Text style={styles.glassLabel}>CURRENT WEIGHT</Text>
              <Text style={styles.glassValue}>
                {current?.weight_kg || '--'} <Text style={styles.glassUnit}>KG</Text>
              </Text>
            </View>
            <View style={styles.trendBadge}>
              <View style={styles.trendDot} />
              <Text style={styles.trendText}>30 DAY TREND</Text>
            </View>
          </View>
          
          {renderChart()}
          
          <View style={styles.chartLabels}>
            <Text style={styles.chartLabelText}>30 Days Ago</Text>
            <Text style={styles.chartLabelText}>Today</Text>
          </View>
        </View>

        {/* Composition Matrix */}
        <Text style={styles.sectionTitle}>Composition Matrix</Text>
        
        <View style={styles.bentoGrid}>
          {/* Body Fat */}
          <View style={styles.bentoBox}>
            <Activity size={20} color={Colors.secondary} style={styles.bentoIcon} />
            <Text style={styles.bentoLabel}>BODY FAT</Text>
            <Text style={styles.bentoValue}>{current?.body_fat_pct ? `${current.body_fat_pct}%` : '--'}</Text>
          </View>

          {/* Waist */}
          <View style={styles.bentoBox}>
            <Ruler size={20} color={Colors.secondary} style={styles.bentoIcon} />
            <Text style={styles.bentoLabel}>WAIST</Text>
            <Text style={styles.bentoValue}>{current?.waist_cm ? `${current.waist_cm} cm` : '--'}</Text>
          </View>

          {/* Chest */}
          <View style={styles.bentoBox}>
            <Expand size={20} color={Colors.secondary} style={styles.bentoIcon} />
            <Text style={styles.bentoLabel}>CHEST</Text>
            <Text style={styles.bentoValue}>{current?.chest_cm ? `${current.chest_cm} cm` : '--'}</Text>
          </View>
          
          {/* Arms */}
          <View style={styles.bentoBox}>
            <Scaling size={20} color={Colors.secondary} style={styles.bentoIcon} />
            <Text style={styles.bentoLabel}>ARMS</Text>
            <Text style={styles.bentoValue}>{current?.arms_cm ? `${current.arms_cm} cm` : '--'}</Text>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.black,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 24,
    color: '#ffffff',
    letterSpacing: 1,
  },
  logButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryContainer,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    gap: 4,
  },
  logButtonText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 10,
    color: Colors.black,
    letterSpacing: 1,
  },
  glassCard: {
    backgroundColor: 'rgba(138, 43, 226, 0.08)',
    borderColor: 'rgba(138, 43, 226, 0.2)',
    borderWidth: 1,
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
  },
  glassHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  glassLabel: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 10,
    color: Colors.onSurfaceVariant,
    letterSpacing: 1,
    marginBottom: 4,
  },
  glassValue: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 40,
    color: Colors.primaryContainer,
    textShadowColor: 'rgba(195, 244, 0, 0.4)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  glassUnit: {
    fontSize: 20,
    color: Colors.onSurfaceVariant,
    fontFamily: 'SpaceGrotesk_600SemiBold',
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBg,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 6,
  },
  trendDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primaryContainer,
  },
  trendText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 10,
    color: Colors.onSurface,
  },
  chartArea: {
    height: 120,
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderColor: Colors.cardBorder,
    position: 'relative',
  },
  gridLines: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
    zIndex: -1,
    opacity: 0.2,
  },
  gridLine: {
    width: '100%',
    height: 1,
    backgroundColor: Colors.onSurfaceVariant,
  },
  chartLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  chartLabelText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 10,
    color: Colors.onSurfaceVariant,
  },
  sectionTitle: {
    fontFamily: 'SpaceGrotesk_600SemiBold',
    fontSize: 20,
    color: '#ffffff',
    marginBottom: 16,
  },
  bentoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  bentoBox: {
    width: '47%',
    backgroundColor: Colors.cardBg,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    borderRadius: 12,
    padding: 16,
  },
  bentoIcon: {
    marginBottom: 12,
  },
  bentoLabel: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 10,
    color: Colors.onSurfaceVariant,
    letterSpacing: 1,
    marginBottom: 4,
  },
  bentoValue: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 24,
    color: '#ffffff',
  },
});
