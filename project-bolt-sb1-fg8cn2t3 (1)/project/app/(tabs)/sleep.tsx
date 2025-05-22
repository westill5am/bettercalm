import { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, MoveVertical as MoreVertical, Moon, Clock, Volume2, Mic, Footprints, Dog, Wind, TriangleAlert as AlertTriangle } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function SleepScreen() {
  const [selectedDate] = useState(new Date());
  const [isPremium] = useState(false);
  
  const sleepEvents = [
    { type: 'Snoring', duration: '37m 52s', count: 30, icon: Volume2 },
    { type: 'Coughing', duration: '1h 8m 28s', count: 32, icon: AlertTriangle },
    { type: 'Talking', duration: '1h 25m 20s', count: 88, icon: Mic },
    { type: 'Footsteps', duration: '32s', count: 3, icon: Footprints },
    { type: 'Animals', duration: '5m 21s', count: 5, icon: Dog },
    { type: 'Flatulence', duration: '2m 35s', count: 9, icon: Wind },
    { type: 'Noise', duration: '5m 32s', count: 32, icon: Volume2 },
  ];

  const sleepQuality = {
    score: 38,
    timeAsleep: '5h 7m',
    timeInBed: '7h 37m',
    awakenings: 3,
  };

  const formatTimeRange = (date: Date) => {
    const start = new Date(date);
    start.setHours(0, 24, 0);
    const end = new Date(date);
    end.setHours(8, 1, 0);
    return `${start.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric' })}–${end.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric' })}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity>
            <ChevronLeft size={24} color="#fff" />
          </TouchableOpacity>
          <View style={styles.headerTitle}>
            <Text style={styles.date}>25 Oct</Text>
            <Text style={styles.timeRange}>{formatTimeRange(selectedDate)}</Text>
          </View>
        </View>
        <TouchableOpacity>
          <MoreVertical size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.tabs}>
        <Text style={styles.activeTab}>Sleep</Text>
        <Text style={styles.tab}>Heart</Text>
        <View style={styles.tabWithBadge}>
          <Text style={styles.tab}>Audio</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>199</Text>
          </View>
        </View>
      </View>

      <View style={styles.sleepGraph}>
        {/* Sleep graph visualization would go here */}
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <View style={styles.statRow}>
            <Text style={styles.statValue}>{sleepQuality.score}%</Text>
            <Text style={styles.statDiff}>-31%</Text>
          </View>
          <Text style={styles.statLabel}>Quality</Text>
        </View>

        <View style={styles.statCard}>
          <View style={styles.moodIcon}>
            <Text style={styles.moodText}>😐</Text>
          </View>
          <Text style={styles.statLabel}>Mood</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statValue}>0</Text>
          <Text style={styles.statLabel}>Notes</Text>
        </View>
      </View>

      <View style={styles.timeCard}>
        <View style={styles.timeCardHeader}>
          <Text style={styles.timeCardTitle}>Time asleep</Text>
          <Text style={styles.timeCardValue}>{sleepQuality.timeAsleep}</Text>
          <Text style={styles.timeCardSubtitle}>{sleepQuality.awakenings} Awakenings</Text>
          <View style={styles.warningBadge}>
            <Text style={styles.warningText}>Low</Text>
          </View>
        </View>
        <View style={styles.timeIndicator} />
      </View>

      <View style={styles.timeMetrics}>
        <View style={styles.timeMetric}>
          <Text style={styles.metricValue}>45m</Text>
          <Text style={styles.metricLabel}>Time to sleep</Text>
        </View>
        <View style={styles.timeMetric}>
          <Text style={styles.metricValue}>{sleepQuality.timeInBed}</Text>
          <Text style={styles.metricLabel}>Time in bed</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A0B2E',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    marginLeft: 12,
  },
  date: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#fff',
  },
  timeRange: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#9B9B9B',
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  tab: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#9B9B9B',
    marginRight: 24,
  },
  activeTab: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#fff',
    marginRight: 24,
    borderBottomWidth: 2,
    borderBottomColor: '#A394F5',
    paddingBottom: 8,
  },
  tabWithBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    backgroundColor: '#A394F5',
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 4,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  sleepGraph: {
    height: 200,
    marginBottom: 20,
    // Graph implementation would go here
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#2D1B4E',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 4,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  statValue: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#FF69B4',
  },
  statDiff: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#FF5252',
    marginLeft: 4,
  },
  statLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#9B9B9B',
    marginTop: 4,
  },
  moodIcon: {
    height: 32,
    justifyContent: 'center',
  },
  moodText: {
    fontSize: 24,
  },
  timeCard: {
    backgroundColor: '#2D1B4E',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  timeCardHeader: {
    marginBottom: 16,
  },
  timeCardTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#fff',
    marginBottom: 4,
  },
  timeCardValue: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#fff',
    marginBottom: 4,
  },
  timeCardSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#9B9B9B',
    marginBottom: 8,
  },
  warningBadge: {
    backgroundColor: '#FF5252',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  warningText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  timeIndicator: {
    height: 8,
    backgroundColor: '#A394F5',
    borderRadius: 4,
    width: '60%',
  },
  timeMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  timeMetric: {
    backgroundColor: '#2D1B4E',
    borderRadius: 16,
    padding: 16,
    flex: 1,
    marginHorizontal: 4,
  },
  metricValue: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#fff',
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#9B9B9B',
  },
});