import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, SafeAreaView } from 'react-native';
import { Plus, Coffee, Utensils, UtensilsCrossed, Apple } from 'lucide-react-native';
import { MacroRing } from '../../src/components/nutrition/MacroRing';
import { getDayNutrition, addNutritionLog, NutritionLog } from '../../src/db/repositories/nutrition';

const Colors = {
  black: '#000000',
  primaryContainer: '#c3f400',
  secondary: '#dcb8ff',
  tertiary: '#00daf3',
  surfaceContainerLow: '#1a1c1c',
  surfaceContainer: '#1e2020',
  surfaceVariant: '#333535',
  onSurface: '#e2e2e2',
  onSurfaceVariant: '#c4c9ac',
  cardBorder: 'rgba(195, 244, 0, 0.3)',
};

export default function NutritionScreen() {
  const [logs, setLogs] = useState<NutritionLog[]>([]);
  
  // Goals (Normally from user_settings)
  const GOALS = {
    calories: 2500,
    protein: 160,
    carbs: 250,
    fat: 70
  };

  const loadData = () => {
    const today = new Date().toISOString().split('T')[0];
    const data = getDayNutrition(today);
    setLogs(data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddDummyFood = () => {
    const today = new Date().toISOString().split('T')[0];
    const meals = ['breakfast', 'lunch', 'dinner', 'snack'];
    const randomMeal = meals[Math.floor(Math.random() * meals.length)];
    
    addNutritionLog(
      today, 
      randomMeal, 
      'Chicken Breast & Rice', 
      350, // kcal
      45, // protein
      5, // fat
      30 // carbs
    );
    loadData();
  };

  // Aggregations
  const totals = logs.reduce((acc, log) => {
    acc.calories += log.calories;
    acc.protein += log.protein_g;
    acc.carbs += log.carbs_g;
    acc.fat += log.fat_g;
    return acc;
  }, { calories: 0, protein: 0, carbs: 0, fat: 0 });

  const renderMealSection = (mealType: string, icon: any, title: string, color: string) => {
    const mealLogs = logs.filter(l => l.meal_type === mealType);
    const mealCals = mealLogs.reduce((sum, l) => sum + l.calories, 0);

    return (
      <View style={styles.mealCard}>
        <View style={styles.mealHeader}>
          <View style={styles.mealTitleRow}>
            {icon}
            <Text style={[styles.mealTitle, { color }]}>{title}</Text>
          </View>
          <Text style={styles.mealTotal}>{mealCals} KCAL</Text>
        </View>
        
        {mealLogs.length > 0 && (
          <View style={styles.mealItems}>
            {mealLogs.map(log => (
              <View key={log.id} style={styles.foodRow}>
                <View>
                  <Text style={styles.foodName}>{log.food_name}</Text>
                  <Text style={styles.foodMacros}>
                    {log.carbs_g}g C • {log.protein_g}g P • {log.fat_g}g F
                  </Text>
                </View>
                <Text style={styles.foodCals}>{log.calories} kcal</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>DAILY FUEL</Text>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        
        {/* Macro Ring Section */}
        <View style={styles.heroCard}>
          <MacroRing
            calories={totals.calories} caloriesGoal={GOALS.calories}
            protein={totals.protein} proteinGoal={GOALS.protein}
            carbs={totals.carbs} carbsGoal={GOALS.carbs}
            fat={totals.fat} fatGoal={GOALS.fat}
          />
          
          {/* Legend */}
          <View style={styles.legendRow}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: Colors.tertiary, shadowColor: Colors.tertiary }]} />
              <Text style={styles.legendLabel}>CALORIES</Text>
              <Text style={styles.legendValue}>{Math.round((totals.calories/GOALS.calories)*100)}%</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: Colors.primaryContainer, shadowColor: Colors.primaryContainer }]} />
              <Text style={styles.legendLabel}>PROTEIN</Text>
              <Text style={styles.legendValue}>{Math.round(totals.protein)}g</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: Colors.secondary, shadowColor: Colors.secondary }]} />
              <Text style={styles.legendLabel}>CARBS</Text>
              <Text style={styles.legendValue}>{Math.round(totals.carbs)}g</Text>
            </View>
          </View>
        </View>

        {/* Meal Sections */}
        <View style={styles.mealsContainer}>
          {renderMealSection('breakfast', <Coffee size={20} color={Colors.primaryContainer} />, 'Breakfast', Colors.primaryContainer)}
          {renderMealSection('lunch', <Utensils size={20} color={Colors.secondary} />, 'Lunch', Colors.secondary)}
          {renderMealSection('dinner', <UtensilsCrossed size={20} color={Colors.tertiary} />, 'Dinner', Colors.tertiary)}
          {renderMealSection('snack', <Apple size={20} color={Colors.onSurfaceVariant} />, 'Snacks', Colors.onSurface)}
        </View>
      </ScrollView>

      {/* FAB */}
      <Pressable style={styles.fab} onPress={handleAddDummyFood}>
        <Plus size={24} color={Colors.black} />
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.black,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surfaceVariant,
  },
  title: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 24,
    color: '#ffffff',
    letterSpacing: 2,
    textAlign: 'center',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 100,
  },
  heroCard: {
    backgroundColor: 'rgba(26, 28, 28, 0.8)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.surfaceVariant,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 24,
    paddingHorizontal: 16,
  },
  legendItem: {
    alignItems: 'center',
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginBottom: 4,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 4,
  },
  legendLabel: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 10,
    color: Colors.onSurfaceVariant,
    letterSpacing: 1,
    marginBottom: 4,
  },
  legendValue: {
    fontFamily: 'SpaceGrotesk_600SemiBold',
    fontSize: 18,
    color: '#ffffff',
  },
  mealsContainer: {
    gap: 16,
  },
  mealCard: {
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.surfaceVariant,
    overflow: 'hidden',
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: Colors.surfaceContainer,
  },
  mealTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  mealTitle: {
    fontFamily: 'SpaceGrotesk_600SemiBold',
    fontSize: 18,
  },
  mealTotal: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
    color: Colors.onSurfaceVariant,
    letterSpacing: 1,
  },
  mealItems: {
    padding: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.surfaceVariant,
  },
  foodRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  foodName: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    color: '#ffffff',
    marginBottom: 2,
  },
  foodMacros: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 10,
    color: Colors.onSurfaceVariant,
  },
  foodCals: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: Colors.tertiary,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primaryContainer,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 8,
  },
});
