import { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Animated, Easing, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Wind, Info } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

interface BreathingPattern {
  id: string;
  name: string;
  description: string;
  steps: {
    phase: 'inhale' | 'hold' | 'exhale';
    seconds: number;
  }[];
  benefits: string[];
}

export default function BreatheScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === 'dark' ? 'dark' : 'light'];
  
  const [selectedPattern, setSelectedPattern] = useState<BreathingPattern | null>(null);
  const [isExerciseActive, setIsExerciseActive] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [secondsRemaining, setSecondsRemaining] = useState(0);
  const [totalCycles, setTotalCycles] = useState(0);
  const [completedCycles, setCompletedCycles] = useState(0);
  
  const circleAnimation = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(1)).current;
  const countdownInterval = useRef<NodeJS.Timeout | null>(null);
  
  const breathingPatterns: BreathingPattern[] = [
    {
      id: '1',
      name: '4-7-8 Technique',
      description: 'A relaxation technique to help you fall asleep quickly.',
      steps: [
        { phase: 'inhale', seconds: 4 },
        { phase: 'hold', seconds: 7 },
        { phase: 'exhale', seconds: 8 }
      ],
      benefits: ['Reduces anxiety', 'Helps fall asleep', 'Manages cravings']
    },
    {
      id: '2',
      name: 'Box Breathing',
      description: 'Used by Navy SEALs to reduce stress and improve focus.',
      steps: [
        { phase: 'inhale', seconds: 4 },
        { phase: 'hold', seconds: 4 },
        { phase: 'exhale', seconds: 4 },
        { phase: 'hold', seconds: 4 }
      ],
      benefits: ['Improves concentration', 'Reduces stress', 'Increases performance']
    },
    {
      id: '3',
      name: 'Calming Breath',
      description: 'A simple technique to bring immediate calm.',
      steps: [
        { phase: 'inhale', seconds: 3 },
        { phase: 'hold', seconds: 1 },
        { phase: 'exhale', seconds: 6 }
      ],
      benefits: ['Reduces heart rate', 'Relieves tension', 'Brings mental clarity']
    },
    {
      id: '4',
      name: 'Energizing Breath',
      description: 'Quick technique to increase alertness and energy.',
      steps: [
        { phase: 'inhale', seconds: 1 },
        { phase: 'exhale', seconds: 1 },
        { phase: 'inhale', seconds: 1 },
        { phase: 'exhale', seconds: 1 }
      ],
      benefits: ['Increases energy', 'Improves alertness', 'Boosts circulation']
    }
  ];

  useEffect(() => {
    if (isExerciseActive && selectedPattern) {
      const currentStep = selectedPattern.steps[currentStepIndex];
      setSecondsRemaining(currentStep.seconds);
      
      // Animate the breathing circle based on the current phase
      animateBreathingCircle(currentStep.phase, currentStep.seconds);
      
      // Clear any existing interval
      if (countdownInterval.current) {
        clearInterval(countdownInterval.current);
      }
      
      // Start countdown timer
      countdownInterval.current = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            // Move to next step
            const nextStepIndex = (currentStepIndex + 1) % selectedPattern.steps.length;
            setCurrentStepIndex(nextStepIndex);
            
            // If we completed a full cycle
            if (nextStepIndex === 0) {
              setCompletedCycles((prev) => {
                const newCompleted = prev + 1;
                // Stop if we reached the total cycles
                if (newCompleted >= totalCycles) {
                  stopExercise();
                }
                return newCompleted;
              });
            }
            
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => {
        if (countdownInterval.current) {
          clearInterval(countdownInterval.current);
        }
      };
    }
  }, [isExerciseActive, selectedPattern, currentStepIndex]);

  const animateBreathingCircle = (phase: string, duration: number) => {
    // Fade out current text
    Animated.timing(textOpacity, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      // Fade in new text
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });
    
    // Animate circle based on phase
    if (phase === 'inhale') {
      Animated.timing(circleAnimation, {
        toValue: 1,
        duration: duration * 1000,
        easing: Easing.linear,
        useNativeDriver: false,
      }).start();
    } else if (phase === 'exhale') {
      Animated.timing(circleAnimation, {
        toValue: 0,
        duration: duration * 1000,
        easing: Easing.linear,
        useNativeDriver: false,
      }).start();
    }
    // For 'hold' phase, don't animate the circle
  };

  const startExercise = (cycles: number) => {
    setTotalCycles(cycles);
    setCompletedCycles(0);
    setCurrentStepIndex(0);
    setIsExerciseActive(true);
    circleAnimation.setValue(0); // Reset animation
  };

  const stopExercise = () => {
    setIsExerciseActive(false);
    setCurrentStepIndex(0);
    setCompletedCycles(0);
    if (countdownInterval.current) {
      clearInterval(countdownInterval.current);
    }
  };

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'inhale':
        return colors.secondary;
      case 'hold':
        return colors.primary;
      case 'exhale':
        return colors.accent;
      default:
        return colors.primary;
    }
  };

  const getCurrentPhaseText = () => {
    if (!selectedPattern) return '';
    const phase = selectedPattern.steps[currentStepIndex].phase;
    return phase.charAt(0).toUpperCase() + phase.slice(1);
  };

  const circleSize = circleAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [100, 200],
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Breathing Guide</Text>
      </View>
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {!selectedPattern ? (
          <>
            <Text style={[styles.subheading, { color: colors.text }]}>
              Select a breathing pattern
            </Text>
            
            {breathingPatterns.map((pattern) => (
              <TouchableOpacity
                key={pattern.id}
                style={[styles.patternCard, { backgroundColor: colors.card }]}
                onPress={() => setSelectedPattern(pattern)}
              >
                <View style={styles.patternHeader}>
                  <Wind size={20} color={colors.primary} />
                  <Text style={[styles.patternName, { color: colors.text }]}>
                    {pattern.name}
                  </Text>
                </View>
                
                <Text style={[styles.patternDescription, { color: colors.tabIconDefault }]}>
                  {pattern.description}
                </Text>
                
                <View style={styles.benefitsContainer}>
                  {pattern.benefits.map((benefit, index) => (
                    <View 
                      key={index}
                      style={[styles.benefitTag, { backgroundColor: colors.primary + '20' }]}
                    >
                      <Text style={[styles.benefitText, { color: colors.primary }]}>
                        {benefit}
                      </Text>
                    </View>
                  ))}
                </View>
              </TouchableOpacity>
            ))}
          </>
        ) : (
          <View style={styles.exerciseContainer}>
            {isExerciseActive ? (
              <>
                <View style={styles.progressInfo}>
                  <Text style={[styles.cycleText, { color: colors.text }]}>
                    Cycle {completedCycles + 1} of {totalCycles}
                  </Text>
                </View>
                
                <View style={styles.breathingCircleContainer}>
                  <Animated.View 
                    style={[
                      styles.breathingCircle,
                      { 
                        width: circleSize,
                        height: circleSize,
                        borderRadius: 100,
                        backgroundColor: getPhaseColor(selectedPattern.steps[currentStepIndex].phase) + '40',
                        borderColor: getPhaseColor(selectedPattern.steps[currentStepIndex].phase),
                      }
                    ]}
                  />
                  
                  <View style={styles.breathingInstructions}>
                    <Animated.Text 
                      style={[
                        styles.phaseText, 
                        { 
                          color: getPhaseColor(selectedPattern.steps[currentStepIndex].phase),
                          opacity: textOpacity
                        }
                      ]}
                    >
                      {getCurrentPhaseText()}
                    </Animated.Text>
                    <Text style={[styles.secondsText, { color: colors.text }]}>
                      {secondsRemaining}
                    </Text>
                  </View>
                </View>
                
                <TouchableOpacity
                  style={[styles.stopButton, { backgroundColor: colors.error }]}
                  onPress={stopExercise}
                >
                  <Text style={styles.buttonText}>Stop</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <View style={styles.patternInfo}>
                  <Text style={[styles.selectedPatternName, { color: colors.text }]}>
                    {selectedPattern.name}
                  </Text>
                  <Text style={[styles.selectedPatternDescription, { color: colors.tabIconDefault }]}>
                    {selectedPattern.description}
                  </Text>
                  
                  <View style={[styles.stepsContainer, { borderColor: colors.border }]}>
                    {selectedPattern.steps.map((step, index) => (
                      <View key={index} style={styles.stepItem}>
                        <View 
                          style={[
                            styles.stepPhase, 
                            { backgroundColor: getPhaseColor(step.phase) + '20' }
                          ]}
                        >
                          <Text style={[styles.stepPhaseText, { color: getPhaseColor(step.phase) }]}>
                            {step.phase}
                          </Text>
                        </View>
                        <Text style={[styles.stepSeconds, { color: colors.text }]}>
                          {step.seconds} seconds
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
                
                <View style={styles.cycleButtons}>
                  <Text style={[styles.cycleQuestion, { color: colors.text }]}>
                    How many cycles?
                  </Text>
                  <View style={styles.cycleOptions}>
                    {[3, 5, 10].map((cycles) => (
                      <TouchableOpacity
                        key={cycles}
                        style={[
                          styles.cycleButton,
                          { 
                            backgroundColor: colors.primary,
                          }
                        ]}
                        onPress={() => startExercise(cycles)}
                      >
                        <Text style={styles.cycleButtonText}>{cycles}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
                
                <TouchableOpacity
                  style={[styles.backButton, { borderColor: colors.border }]}
                  onPress={() => setSelectedPattern(null)}
                >
                  <Text style={[styles.backButtonText, { color: colors.text }]}>
                    Choose Another Pattern
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        )}
        
        {!selectedPattern && (
          <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
            <View style={styles.infoHeader}>
              <Info size={20} color={colors.primary} />
              <Text style={[styles.infoTitle, { color: colors.text }]}>
                Benefits of Breathing Exercises
              </Text>
            </View>
            
            <Text style={[styles.infoText, { color: colors.tabIconDefault }]}>
              Regular breathing exercises can reduce stress, lower blood pressure, improve sleep quality, and increase energy levels. Try incorporating a few minutes of focused breathing into your daily routine.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  subheading: {
    fontSize: 18,
    fontFamily: 'Inter-Medium',
    marginBottom: 16,
  },
  patternCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  patternHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  patternName: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    marginLeft: 8,
  },
  patternDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginBottom: 16,
    lineHeight: 20,
  },
  benefitsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  benefitTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginRight: 8,
  },
  benefitText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  exerciseContainer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  progressInfo: {
    marginBottom: 24,
  },
  cycleText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
  breathingCircleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 300,
    width: '100%',
    position: 'relative',
  },
  breathingCircle: {
    borderWidth: 2,
    position: 'absolute',
  },
  breathingInstructions: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  phaseText: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    marginBottom: 8,
  },
  secondsText: {
    fontSize: 48,
    fontFamily: 'Inter-Bold',
  },
  stopButton: {
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 24,
    marginTop: 32,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-Bold',
  },
  patternInfo: {
    alignItems: 'center',
    marginBottom: 32,
    width: '100%',
  },
  selectedPatternName: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  selectedPatternDescription: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  stepsContainer: {
    width: '100%',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    paddingVertical: 16,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  stepPhase: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  stepPhaseText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  stepSeconds: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  cycleButtons: {
    marginBottom: 24,
    alignItems: 'center',
  },
  cycleQuestion: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    marginBottom: 16,
  },
  cycleOptions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  cycleButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cycleButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Inter-Bold',
  },
  backButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
    borderWidth: 1,
  },
  backButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  infoCard: {
    borderRadius: 16,
    padding: 20,
    marginTop: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    marginLeft: 8,
  },
  infoText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    lineHeight: 22,
  },
});