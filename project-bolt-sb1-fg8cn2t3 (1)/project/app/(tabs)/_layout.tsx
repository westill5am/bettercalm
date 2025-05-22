import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { Chrome as Home, Moon, Quote, Wind, Activity, Settings } from 'lucide-react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import Colors from '@/constants/Colors';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const tabBarStyle = Platform.OS === 'web' 
    ? { height: 60, paddingBottom: 10 } 
    : { height: 80, paddingBottom: 20 };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tint,
        tabBarInactiveTintColor: Colors[colorScheme].tabIconDefault,
        tabBarStyle: {
          ...tabBarStyle,
          backgroundColor: Colors[colorScheme].darkAccent,
          borderTopColor: Colors[colorScheme].border,
          borderTopWidth: 1,
        },
        tabBarLabelStyle: {
          fontFamily: 'Inter-Medium',
          fontSize: 12,
        },
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="sleep"
        options={{
          title: 'Sleep',
          tabBarIcon: ({ color, size }) => <Moon size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="track"
        options={{
          title: 'Track',
          tabBarIcon: ({ color, size }) => <Activity size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="breathe"
        options={{
          title: 'Breathe',
          tabBarIcon: ({ color, size }) => <Wind size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => <Settings size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}