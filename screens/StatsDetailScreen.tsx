import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

import { useAppState } from '../context/AppStateContext';
import { RootStackParamList } from '../navigation/RootNavigator';

type Navigation = NativeStackNavigationProp<RootStackParamList, 'StatsDetail'>;
type Route = RouteProp<RootStackParamList, 'StatsDetail'>;

type Props = {
  navigation: Navigation;
  route: Route;
};

export function StatsDetailScreen({ navigation, route }: Props) {
  const { sessions } = useAppState();
  const session = sessions.find((item) => item.id === route.params.sessionId);

  if (!session) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>Session not found</Text>
          <Text style={styles.emptyText}>
            The selected session is no longer available in local storage.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const completionText = session.completed ? 'Completed' : 'In progress';
  const qualityBand =
    session.focusScore >= 85 ? 'Excellent' : session.focusScore >= 70 ? 'Strong' : 'Building';

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.headerCard}>
          <Text style={styles.eyebrow}>Stats Detail</Text>
          <Text style={styles.title}>{session.title}</Text>
          <Text style={styles.subtitle}>{session.note}</Text>
        </View>

        <View style={styles.metricGrid}>
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>{session.focusScore}</Text>
            <Text style={styles.metricLabel}>Focus score</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>{session.durationMinutes}</Text>
            <Text style={styles.metricLabel}>Minutes</Text>
          </View>
        </View>

        <View style={styles.detailCard}>
          <Text style={styles.detailLabel}>Status</Text>
          <Text style={styles.detailValue}>{completionText}</Text>
        </View>

        <View style={styles.detailCard}>
          <Text style={styles.detailLabel}>Emphasis</Text>
          <Text style={styles.detailValue}>{session.emphasis}</Text>
        </View>

        <View style={styles.detailCard}>
          <Text style={styles.detailLabel}>Quality band</Text>
          <Text style={styles.detailValue}>{qualityBand}</Text>
        </View>

        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>Back to Sessions</Text>
        </Pressable>
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
  headerCard: {
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
  metricGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#18233A',
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: '#24324A',
    gap: 6,
  },
  metricValue: {
    color: '#14B8A6',
    fontSize: 30,
    fontWeight: '800',
  },
  metricLabel: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '700',
  },
  detailCard: {
    backgroundColor: '#121A2B',
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: '#24324A',
    gap: 8,
  },
  detailLabel: {
    color: '#7DD3FC',
    fontSize: 13,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  detailValue: {
    color: '#F8FAFC',
    fontSize: 18,
    fontWeight: '700',
  },
  backButton: {
    marginTop: 6,
    backgroundColor: '#14B8A6',
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#052E2B',
    fontSize: 14,
    fontWeight: '800',
  },
  emptyCard: {
    margin: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#24324A',
    backgroundColor: '#121A2B',
    padding: 20,
    gap: 10,
  },
  emptyTitle: {
    color: '#F8FAFC',
    fontSize: 24,
    fontWeight: '800',
  },
  emptyText: {
    color: '#94A3B8',
    fontSize: 15,
    lineHeight: 22,
  },
});
