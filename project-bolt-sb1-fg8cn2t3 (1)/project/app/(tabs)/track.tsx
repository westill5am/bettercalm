import { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Activity, Scale, Apple, Dumbbell } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TrackScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const [weight, setWeight] = useState('70.5');
  const [calories, setCalories] = useState('1,850');
  
  const nutritionData = {
    protein: { current: 82, target: 120 },
    carbs: { current: 215, target: 250 },
    fat: { current: 55, target: 65 }
  };

  const workouts = [
    { name: 'Morning Run', duration: '30 min', calories: 320 },
    { name: 'Weight Training', duration: '45 min', calories: 280 },
    { name: 'Evening Walk', duration: '20 min', calories: 110 },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Text style={[styles.title, { color: colors.text }]}>Daily Tracking</Text>

        <View style={[styles.statsGrid, { backgroundColor: colors.card }]}>
          <View style={styles.statItem}>
            <Scale size={24} color={colors.primary} />
            <Text style={[styles.statLabel, { color: colors.tabIconDefault }]}>Weight</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.statInput, { color: colors.text }]}
                value={weight}
                onChangeText={setWeight}
                keyboardType="numeric"
              />
              <Text style={[styles.unit, { color: colors.tabIconDefault }]}>kg</Text>
            </View>
          </View>

          <View style={styles.statItem}>
            <Apple size={24} color={colors.primary} />
            <Text style={[styles.statLabel, { color: colors.tabIconDefault }]}>Calories</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.statInput, { color: colors.text }]}
                value={calories}
                onChangeText={setCalories}
                keyboardType="numeric"
              />
              <Text style={[styles.unit, { color: colors.tabIconDefault }]}>kcal</Text>
            </View>
          </View>
        </View>

        <View style={[styles.nutritionCard, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Nutrition Tracking</Text>
          
          {Object.entries(nutritionData).map(([nutrient, data], index) => (
            <View key={index} style={styles.nutrientItem}>
              <View style={styles.nutrientHeader}>
                <Text style={[styles.nutrientName, { color: colors.text }]}>
                  {nutrient.charAt(0).toUpperCase() + nutrient.slice(1)}
                </Text>
                <Text style={[styles.nutrientValue, { color: colors.primary }]}>
                  {data.current}/{data.target}g
                </Text>
              </View>
              <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
                <View 
                  style={[
                    styles.progressFill,
                    { 
                      backgroundColor: colors.primary,
                      width: `${(data.current / data.target) * 100}%`
                    }
                  ]}
                />
              </View>
            </View>
          ))}
        </View>

        <View style={[styles.workoutsCard, { backgroundColor: colors.card }]}>
          <View style={styles.cardHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Today's Workouts</Text>
            <TouchableOpacity>
              <Dumbbell size={24} color={colors.primary} />
            </TouchableOpacity>
          </View>

          {workouts.map((workout, index) => (
            <View 
              key={index} 
              style={[
                styles.workoutItem,
                index < workouts.length - 1 && { borderBottomColor: colors.border, borderBottomWidth: 1 }
              ]}
            >
              <View>
                <Text style={[styles.workoutName, { color: colors.text }]}>{workout.name}</Text>
                <Text style={[styles.workoutDuration, { color: colors.tabIconDefault }]}>
                  {workout.duration}
                </Text>
              </View>
              <Text style={[styles.workoutCalories, { color: colors.primary }]}>
                {workout.calories} kcal
              </Text>
            </View>
          ))}
        </View>

        <TouchableOpacity 
          style={[styles.addButton, { backgroundColor: colors.primary }]}
          onPress={() => {/* Add new tracking entry */}}
        >
          <Text style={styles.buttonText}>Add New Entry</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    marginBottom: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    gap: 20,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginTop: 8,
    marginBottom: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statInput: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    textAlign: 'center',
    minWidth: 80,
  },
  unit: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginLeft: 4,
  },
  nutritionCard: {
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Medium',
    marginBottom: 16,
  },
  nutrientItem: {
    marginBottom: 16,
  },
  nutrientHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  nutrientName: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  nutrientValue: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  workoutsCard: {
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  workoutItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  workoutName: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    marginBottom: 4,
  },
  workoutDuration: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  workoutCalories: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
  },
  addButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 40,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-Bold',
  },
});