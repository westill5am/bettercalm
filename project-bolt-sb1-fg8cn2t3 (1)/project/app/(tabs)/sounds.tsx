import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  Platform,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Play, Pause, Search, Volume2 } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Audio } from 'expo-av';
import soundData from '@/assets/data/sounds.json';

interface SoundTrack {
  id: string;
  title: string;
  description: string;
  image: string;
  mp3Url: string;
  category: string;
}

export default function Sounds() {
  const colors = Colors[useColorScheme()];
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTrack, setActiveTrack] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const tracks: SoundTrack[] = soundData.sounds;

  useEffect(() => {
    if (Platform.OS !== 'web') {
      Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        shouldDuckAndroid: true,
      });
    }
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
      if (Platform.OS === 'web') {
        const oldAudio = document.getElementById('web-audio-player') as HTMLAudioElement | null;
        if (oldAudio) {
          oldAudio.pause();
          oldAudio.remove();
        }
      }
    };
  }, []);

  const stop = async () => {
    setError(null);
    if (sound) {
      try {
        await sound.stopAsync();
        await sound.unloadAsync();
      } catch {}
      setSound(null);
    }

    if (Platform.OS === 'web') {
      const oldAudio = document.getElementById('web-audio-player') as HTMLAudioElement | null;
      if (oldAudio) {
        oldAudio.pause();
        oldAudio.remove();
      }
    }

    setIsPlaying(false);
    setActiveTrack(null);
  };

  const play = async (track: SoundTrack) => {
    setError(null);

    if (Platform.OS === 'web') {
      await stop();

      const audio = document.createElement('audio');
      audio.id = 'web-audio-player';
      audio.src = track.mp3Url;
      audio.loop = true;
      
      // Add error handling for web audio
      audio.onerror = () => {
        setError('Unable to play sound. Please try again.');
        setIsPlaying(false);
        setActiveTrack(null);
      };

      // Add loading handler
      audio.oncanplaythrough = () => {
        setIsPlaying(true);
        setActiveTrack(track.id);
        audio.play().catch(() => {
          setError('Playback failed. Please try again.');
          setIsPlaying(false);
          setActiveTrack(null);
        });
      };

      document.body.appendChild(audio);
      return;
    }

    try {
      if (sound) {
        await stop();
      }

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: track.mp3Url },
        { shouldPlay: true, isLooping: true },
        (status) => {
          if (status.error) {
            setError('An error occurred during playback.');
            setIsPlaying(false);
            setActiveTrack(null);
          }
        }
      );

      setSound(newSound);
      setIsPlaying(true);
      setActiveTrack(track.id);
    } catch (e) {
      console.error('Audio error:', e);
      setError('Unable to play sound. Please try again.');
      setIsPlaying(false);
      setActiveTrack(null);
    }
  };

  const toggle = async () => {
    if (!sound && Platform.OS === 'web') {
      const audio = document.getElementById('web-audio-player') as HTMLAudioElement | null;
      if (audio) {
        if (isPlaying) {
          audio.pause();
          setIsPlaying(false);
        } else {
          try {
            await audio.play();
            setIsPlaying(true);
          } catch (e) {
            setError('Playback failed. Please try again.');
          }
        }
      }
      return;
    }

    if (!sound) return;

    try {
      if (isPlaying) {
        await sound.pauseAsync();
        setIsPlaying(false);
      } else {
        await sound.playAsync();
        setIsPlaying(true);
      }
    } catch {
      setError('Playback toggle failed. Please try again.');
    }
  };

  const filteredTracks = tracks.filter(track =>
    track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    track.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Sleep Sounds</Text>
        <View style={styles.searchContainer}>
          <Search size={20} color="#9B9B9B" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search sounds..."
            placeholderTextColor="#9B9B9B"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {filteredTracks.map((track) => (
          <View key={track.id} style={styles.trackContainer}>
            <Image source={{ uri: track.image }} style={styles.image} />
            <View style={styles.trackInfo}>
              <Text style={styles.trackTitle}>{track.title}</Text>
              <Text style={styles.trackDescription}>{track.description}</Text>
              <View style={styles.controls}>
                <TouchableOpacity
                  onPress={() => activeTrack === track.id ? toggle() : play(track)}
                  style={styles.playButton}
                >
                  {activeTrack === track.id && isPlaying ? (
                    <Pause color="#FFF" size={24} />
                  ) : (
                    <Play color="#FFF" size={24} />
                  )}
                </TouchableOpacity>
                {activeTrack === track.id && (
                  <TouchableOpacity onPress={stop} style={styles.stopButton}>
                    <Volume2 color="#FFF" size={24} />
                  </TouchableOpacity>
                )}
              </View>
            </View>
            {activeTrack === track.id && (
              <View style={styles.activeIndicator} />
            )}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A0B2E',
  },
  header: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#FFF',
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2D1B4E',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  scrollContainer: {
    padding: 20,
  },
  trackContainer: {
    backgroundColor: '#2D1B4E',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  trackInfo: {
    padding: 16,
  },
  trackTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#FFF',
    marginBottom: 8,
  },
  trackDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#9B9B9B',
    marginBottom: 16,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  playButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#A394F5',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#A394F5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  stopButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FF5252',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF5252',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  activeIndicator: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: '#A394F5',
    shadowColor: '#A394F5',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 4,
  },
  errorContainer: {
    backgroundColor: '#FF5252',
    margin: 20,
    padding: 12,
    borderRadius: 12,
  },
  errorText: {
    color: '#FFF',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
  },
});