import * as Haptics from 'expo-haptics';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import Toast from 'react-native-toast-message';

import { useAppState } from '../context/AppStateContext';
import { RootStackParamList } from '../navigation/RootNavigator';

type Navigation = NativeStackNavigationProp<RootStackParamList>;

export function SessionsScreen() {
  const navigation = useNavigation<Navigation>();
  const { sessions, toggleSessionComplete } = useAppState();

  const handleComplete = async (sessionId: string, title: string) => {
    toggleSessionComplete(sessionId);
    await Haptics.selectionAsync();
    Toast.show({
      type: 'success',
      text1: 'Session updated',
      text2: `${title} was saved successfully.`,
      position: 'bottom',
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.heroCard}>
          <Text style={styles.eyebrow}>Sessions</Text>
          <Text style={styles.title}>Detailed focus blocks with room to drill deeper.</Text>
          <Text style={styles.subtitle}>
            Open any session for analytics detail, or mark it complete when the work is done.
          </Text>
        </View>

        {sessions.map((session) => (
          <View key={session.id} style={styles.sessionCard}>
            <View style={styles.headerRow}>
              <View>
                <Text style={styles.time}>{session.time}</Text>
                <Text style={styles.sessionTitle}>{session.title}</Text>
              </View>
              <Text style={styles.score}>{session.focusScore}</Text>
            </View>

            <Text style={styles.sessionMeta}>
              {session.emphasis} · {session.durationMinutes} min
            </Text>
            <Text style={styles.note}>{session.note}</Text>

            <View style={styles.actionsRow}>
              <Pressable
                onPress={() =>
                  navigation.navigate('StatsDetail', {
                    sessionId: session.id,
                  })
                }
                style={styles.secondaryButton}
              >
                <Text style={styles.secondaryButtonText}>View Stats</Text>
              </Pressable>

              <Pressable
                onPress={() => void handleComplete(session.id, session.title)}
                style={[
                  styles.primaryButton,
                  session.completed && styles.primaryButtonDone,
                ]}
              >
                <Text style={styles.primaryButtonText}>
                  {session.completed ? 'Completed' : 'Mark Complete'}
                </Text>
              </Pressable>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0B1020',
  },
  content: {
    padding: 20,
    gap: 16,
  },
  heroCard: {
    backgroundColor: '#121A2B',
    borderRadius: 28,
    padding: 22,
    borderWidth: 1,
    borderColor: '#24324A',
    gap: 10,
  },
  eyebrow: {
    color: '#F59E0B',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  title: {
    color: '#F8FAFC',
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '800',
  },
  subtitle: {
    color: '#94A3B8',
    fontSize: 15,
    lineHeight: 22,
  },
  sessionCard: {
    backgroundColor: '#121A2B',
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: '#24324A',
    gap: 10,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  time: {
    color: '#FB7185',
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 6,
  },
  sessionTitle: {
    color: '#F8FAFC',
    fontSize: 20,
    fontWeight: '700',
  },
  score: {
    color: '#14B8A6',
    fontSize: 28,
    fontWeight: '800',
  },
  sessionMeta: {
    color: '#7DD3FC',
    fontSize: 13,
    fontWeight: '700',
  },
  note: {
    color: '#94A3B8',
    fontSize: 14,
    lineHeight: 21,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  secondaryButton: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#24324A',
    backgroundColor: '#0F1727',
    paddingVertical: 12,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '700',
  },
  primaryButton: {
    flex: 1,
    borderRadius: 16,
    backgroundColor: '#14B8A6',
    paddingVertical: 12,
    alignItems: 'center',
  },
  primaryButtonDone: {
    backgroundColor: '#22C55E',
  },
  primaryButtonText: {
    color: '#052E2B',
    fontSize: 14,
    fontWeight: '800',
  },
});
