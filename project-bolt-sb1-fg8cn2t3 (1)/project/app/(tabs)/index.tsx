import { StyleSheet, Text, View, ScrollView, TouchableOpacity, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Moon, Quote, Wind } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { router } from 'expo-router';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === 'dark' ? 'dark' : 'light'];
  
  const features = [
    { 
      name: 'Sleep Sounds', 
      icon: <Moon size={32} color={colors.primary} />,
      description: 'Soothing sounds to help you fall asleep faster',
      route: '/sounds'
    },
    { 
      name: 'Daily Quotes', 
      icon: <Quote size={32} color={colors.primary} />,
      description: 'Start your day with inspiration',
      route: '/quotes'
    },
    { 
      name: 'Breathing Exercises', 
      icon: <Wind size={32} color={colors.primary} />,
      description: 'Guided breathing for relaxation and focus',
      route: '/breathe'
    },
  ];

  const handleNavigate = (route: string) => {
    router.push(route);
  };

  const getCurrentTimeOfDay = () => {
    const hours = new Date().getHours();
    if (hours < 12) return "Good morning";
    if (hours < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={[styles.greeting, { color: colors.text }]}>{getCurrentTimeOfDay()}</Text>
          <Text style={[styles.tagline, { color: colors.text }]}>
            How are you feeling today?
          </Text>
        </View>

        <View style={styles.featuresContainer}>
          {features.map((feature, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.featureCard, { backgroundColor: colors.card }]}
              onPress={() => handleNavigate(feature.route)}
            >
              <View style={styles.featureIcon}>{feature.icon}</View>
              <View style={styles.featureContent}>
                <Text style={[styles.featureName, { color: colors.text }]}>{feature.name}</Text>
                <Text style={[styles.featureDescription, { color: colors.tabIconDefault }]}>
                  {feature.description}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.quickTipsContainer}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Wellness Tip</Text>
          <View style={[styles.tipCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.tipText, { color: colors.text }]}>
              "Taking just 5 minutes to practice mindful breathing can significantly reduce stress levels and improve focus."
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
  },
  header: {
    marginBottom: 32,
  },
  greeting: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    marginBottom: 8,
  },
  tagline: {
    fontFamily: 'Inter-Regular',
    fontSize: 18,
    opacity: 0.8,
  },
  featuresContainer: {
    marginBottom: 32,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  featureIcon: {
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
  },
  featureName: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    marginBottom: 4,
  },
  featureDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
  quickTipsContainer: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    marginBottom: 16,
  },
  tipCard: {
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tipText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    lineHeight: 24,
  },
});