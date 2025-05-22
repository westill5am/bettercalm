import { useState } from 'react';
import { StyleSheet, Text, View, Switch, TouchableOpacity, ScrollView, useColorScheme as useRNColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Moon, Sun, Mail, Heart, ExternalLink, CircleAlert, Volume2 } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function SettingsScreen() {
  const colorScheme = useColorScheme();
  const systemColorScheme = useRNColorScheme();
  const colors = Colors[colorScheme === 'dark' ? 'dark' : 'light'];
  
  const [useSystemTheme, setUseSystemTheme] = useState(true);
  const [darkMode, setDarkMode] = useState(colorScheme === 'dark');
  const [soundInBackground, setSoundInBackground] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [sleepReminders, setSleepReminders] = useState(true);
  const [breathingReminders, setBreathingReminders] = useState(false);
  const [quoteReminders, setQuoteReminders] = useState(true);
  
  const handleDarkModeToggle = () => {
    setDarkMode(!darkMode);
    // In a real app, you would update the app's theme here
  };

  const handleSystemThemeToggle = () => {
    setUseSystemTheme(!useSystemTheme);
    if (!useSystemTheme) {
      // If switching to system theme, update dark mode to match system
      setDarkMode(systemColorScheme === 'dark');
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Settings</Text>
      </View>
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.section, { borderBottomColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Appearance</Text>
          
          <View style={styles.settingRow}>
            <View style={styles.settingLabelContainer}>
              <Moon size={20} color={colors.text} />
              <Text style={[styles.settingLabel, { color: colors.text }]}>
                Use System Theme
              </Text>
            </View>
            <Switch
              value={useSystemTheme}
              onValueChange={handleSystemThemeToggle}
              trackColor={{ false: '#767577', true: colors.primary }}
              thumbColor="#f4f3f4"
            />
          </View>
          
          {!useSystemTheme && (
            <View style={styles.settingRow}>
              <View style={styles.settingLabelContainer}>
                {darkMode ? (
                  <Moon size={20} color={colors.text} />
                ) : (
                  <Sun size={20} color={colors.text} />
                )}
                <Text style={[styles.settingLabel, { color: colors.text }]}>
                  Dark Mode
                </Text>
              </View>
              <Switch
                value={darkMode}
                onValueChange={handleDarkModeToggle}
                trackColor={{ false: '#767577', true: colors.primary }}
                thumbColor="#f4f3f4"
              />
            </View>
          )}
        </View>
        
        <View style={[styles.section, { borderBottomColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Notifications</Text>
          
          <View style={styles.settingRow}>
            <View style={styles.settingLabelContainer}>
              <CircleAlert size={20} color={colors.text} />
              <Text style={[styles.settingLabel, { color: colors.text }]}>
                Enable Notifications
              </Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#767577', true: colors.primary }}
              thumbColor="#f4f3f4"
            />
          </View>
          
          {notificationsEnabled && (
            <View style={styles.indentedSettings}>
              <View style={styles.settingRow}>
                <Text style={[styles.settingLabel, { color: colors.text }]}>
                  Sleep Reminders
                </Text>
                <Switch
                  value={sleepReminders}
                  onValueChange={setSleepReminders}
                  trackColor={{ false: '#767577', true: colors.primary }}
                  thumbColor="#f4f3f4"
                />
              </View>
              
              <View style={styles.settingRow}>
                <Text style={[styles.settingLabel, { color: colors.text }]}>
                  Breathing Exercise Reminders
                </Text>
                <Switch
                  value={breathingReminders}
                  onValueChange={setBreathingReminders}
                  trackColor={{ false: '#767577', true: colors.primary }}
                  thumbColor="#f4f3f4"
                />
              </View>

              <View style={styles.settingRow}>
                <Text style={[styles.settingLabel, { color: colors.text }]}>
                  Daily Quote Reminders
                </Text>
                <Switch
                  value={quoteReminders}
                  onValueChange={setQuoteReminders}
                  trackColor={{ false: '#767577', true: colors.primary }}
                  thumbColor="#f4f3f4"
                />
              </View>
            </View>
          )}
        </View>
        
        <View style={[styles.section, { borderBottomColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Playback</Text>
          
          <View style={styles.settingRow}>
            <View style={styles.settingLabelContainer}>
              <Volume2 size={20} color={colors.text} />
              <Text style={[styles.settingLabel, { color: colors.text }]}>
                Play Sounds in Background
              </Text>
            </View>
            <Switch
              value={soundInBackground}
              onValueChange={setSoundInBackground}
              trackColor={{ false: '#767577', true: colors.primary }}
              thumbColor="#f4f3f4"
            />
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>About</Text>
          
          <TouchableOpacity style={styles.settingRow}>
            <View style={styles.settingLabelContainer}>
              <Mail size={20} color={colors.text} />
              <Text style={[styles.settingLabel, { color: colors.text }]}>
                Contact Support
              </Text>
            </View>
            <ExternalLink size={18} color={colors.text} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingRow}>
            <View style={styles.settingLabelContainer}>
              <Heart size={20} color={colors.text} />
              <Text style={[styles.settingLabel, { color: colors.text }]}>
                Rate the App
              </Text>
            </View>
            <ExternalLink size={18} color={colors.text} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingRow}>
            <View style={styles.settingLabelContainer}>
              <CircleAlert size={20} color={colors.text} />
              <Text style={[styles.settingLabel, { color: colors.text }]}>
                Privacy Policy
              </Text>
            </View>
            <ExternalLink size={18} color={colors.text} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.versionInfo}>
          <Text style={[styles.versionText, { color: colors.tabIconDefault }]}>
            Version 1.0.0
          </Text>
        </View>
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
    paddingHorizontal: 24,
  },
  section: {
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    marginBottom: 16,
    marginTop: 8,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    marginLeft: 12,
  },
  indentedSettings: {
    marginLeft: 32,
  },
  versionInfo: {
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 40,
  },
  versionText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
});