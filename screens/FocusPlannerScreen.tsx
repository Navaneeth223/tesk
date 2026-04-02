import * as Haptics from 'expo-haptics';
import { useMemo, useRef } from 'react';
import {
  Alert,
  Animated,
  LayoutAnimation,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  UIManager,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';

import { useAppState } from '../context/AppStateContext';
import { PlannerTabKey } from '../types/planner';

const plannerTabs: Array<{ key: PlannerTabKey; label: string }> = [
  { key: 'focus', label: 'Focus' },
  { key: 'sessions', label: 'Sessions' },
  { key: 'analytics', label: 'Analytics' },
];

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const colors = {
  background: '#0B1020',
  backgroundGlow: '#16213E',
  panel: '#121A2B',
  panelStrong: '#18233A',
  panelAlt: '#0F1727',
  border: '#24324A',
  text: '#F8FAFC',
  muted: '#94A3B8',
  accent: '#22C55E',
  accentStrong: '#14B8A6',
  accentWarm: '#F59E0B',
  accentSoft: '#38BDF8',
  dangerSoft: '#FB7185',
};

export function FocusPlannerScreen() {
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const { plannerTab, setPlannerTab, tasksByTab, sessions, clearAll, toggleTask } =
    useAppState();

  const activeTasks = tasksByTab[plannerTab];
  const completedCount = activeTasks.filter((task) => task.completed).length;
  const progress = activeTasks.length === 0 ? 0 : completedCount / activeTasks.length;

  const summary = useMemo(() => {
    const allTasks = Object.values(tasksByTab).flat();
    const totalDone = allTasks.filter((task) => task.completed).length;
    const completedSessions = sessions.filter((session) => session.completed).length;
    const averageFocus = Math.round(
      sessions.reduce((acc, session) => acc + session.focusScore, 0) /
        sessions.length,
    );

    return {
      totalDone,
      totalTasks: allTasks.length,
      completedSessions,
      averageFocus,
    };
  }, [sessions, tasksByTab]);

  const switchPlannerTab = (tab: PlannerTabKey) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0.4,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start();

    setPlannerTab(tab);
  };

  const handleToggleTask = async (taskId: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    const completed = await toggleTask(plannerTab, taskId);

    if (completed) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Toast.show({
        type: 'success',
        text1: 'Task completed',
        text2: 'Nice work. Your progress was saved automatically.',
        position: 'bottom',
      });
    }
  };

  const confirmClearAll = () => {
    Alert.alert(
      'Clear all planner data?',
      'This removes saved tasks, sessions, and settings from this device.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            await clearAll();
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            Toast.show({
              type: 'success',
              text1: 'Planner reset',
              text2: 'Local data was cleared and defaults were restored.',
              position: 'bottom',
            });
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.backgroundOrbTop} />
      <View style={styles.backgroundOrbBottom} />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroCard}>
          <View style={styles.heroTopRow}>
            <View style={styles.heroCopy}>
              <Text style={styles.eyebrow}>Focus Planner</Text>
              <Text style={styles.title}>Keep the next build session clear and moving.</Text>
            </View>
            <Pressable onPress={confirmClearAll} style={styles.clearButton}>
              <Text style={styles.clearButtonText}>Clear All</Text>
            </Pressable>
          </View>

          <Text style={styles.subtitle}>
            Tasks, sessions, preferences, and your active view now persist between
            launches with local storage.
          </Text>

          <View style={styles.metricsRow}>
            <View style={styles.metricCard}>
              <Text style={styles.metricValue}>
                {summary.totalDone}/{summary.totalTasks}
              </Text>
              <Text style={styles.metricLabel}>Tasks marked done</Text>
            </View>
            <View style={styles.metricCard}>
              <Text style={styles.metricValue}>{summary.averageFocus}</Text>
              <Text style={styles.metricLabel}>Average focus score</Text>
            </View>
            <View style={styles.metricCard}>
              <Text style={styles.metricValue}>{summary.completedSessions}</Text>
              <Text style={styles.metricLabel}>Completed sessions</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Planner View</Text>
          <View style={styles.tabsRow}>
            {plannerTabs.map((tab) => {
              const selected = tab.key === plannerTab;

              return (
                <Pressable
                  key={tab.key}
                  onPress={() => switchPlannerTab(tab.key)}
                  style={[styles.tabButton, selected && styles.tabButtonActive]}
                >
                  <Text style={[styles.tabText, selected && styles.tabTextActive]}>
                    {tab.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <Animated.View style={{ opacity: fadeAnim }}>
          <View style={styles.progressCard}>
            <View style={styles.progressHeader}>
              <View>
                <Text style={styles.progressTitle}>Current momentum</Text>
                <Text style={styles.progressSubtitle}>
                  {completedCount} of {activeTasks.length} items complete in{' '}
                  {plannerTabs.find((tab) => tab.key === plannerTab)?.label}
                </Text>
              </View>
              <Text style={styles.progressPercent}>{Math.round(progress * 100)}%</Text>
            </View>

            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${Math.max(progress * 100, 8)}%` },
                ]}
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Task Stack</Text>
            {activeTasks.map((task) => (
              <Pressable
                key={task.id}
                onPress={() => void handleToggleTask(task.id)}
                style={[styles.taskCard, task.completed && styles.taskCardCompleted]}
              >
                <View style={styles.taskTopRow}>
                  <View
                    style={[
                      styles.checkbox,
                      task.completed && styles.checkboxChecked,
                    ]}
                  >
                    <Text style={styles.checkboxMark}>{task.completed ? 'X' : ''}</Text>
                  </View>
                  <View style={styles.taskCopy}>
                    <Text
                      style={[
                        styles.taskTitle,
                        task.completed && styles.taskTitleCompleted,
                      ]}
                    >
                      {task.title}
                    </Text>
                    <Text style={styles.taskDetail}>{task.detail}</Text>
                  </View>
                </View>

                <View style={styles.taskMetaRow}>
                  <Text style={styles.taskMeta}>{task.duration}</Text>
                  <Text style={styles.energyPill}>{task.energy} energy</Text>
                </View>
              </Pressable>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Session Snapshot</Text>
            {sessions.map((session) => (
              <View key={session.id} style={styles.sessionCard}>
                <View style={styles.sessionTopRow}>
                  <Text style={styles.sessionTime}>{session.time}</Text>
                  <Text style={styles.sessionStatus}>
                    {session.completed ? 'Completed' : 'Upcoming'}
                  </Text>
                </View>
                <Text style={styles.sessionTitle}>{session.title}</Text>
                <Text style={styles.sessionEmphasis}>{session.emphasis}</Text>
              </View>
            ))}
          </View>

          <View style={styles.footerCard}>
            <Text style={styles.footerTitle}>Production-ready baseline</Text>
            <Text style={styles.footerText}>
              Persistence, navigation, crash handling, toasts, and haptics are now in
              place so this screen can support real feature work instead of being
              thrown away.
            </Text>
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 40,
    gap: 18,
  },
  backgroundOrbTop: {
    position: 'absolute',
    top: -90,
    right: -50,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: colors.backgroundGlow,
    opacity: 0.75,
  },
  backgroundOrbBottom: {
    position: 'absolute',
    bottom: 120,
    left: -90,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: '#0F766E',
    opacity: 0.18,
  },
  heroCard: {
    backgroundColor: colors.panel,
    borderRadius: 30,
    padding: 24,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 14,
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  heroCopy: {
    flex: 1,
    gap: 8,
  },
  clearButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#3F1D2E',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  clearButtonText: {
    color: '#FECDD3',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  eyebrow: {
    color: colors.accentWarm,
    textTransform: 'uppercase',
    letterSpacing: 1.4,
    fontWeight: '800',
    fontSize: 12,
  },
  title: {
    color: colors.text,
    fontSize: 31,
    lineHeight: 38,
    fontWeight: '800',
  },
  subtitle: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 23,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 6,
  },
  metricCard: {
    flex: 1,
    backgroundColor: colors.panelStrong,
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 6,
  },
  metricValue: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '800',
  },
  metricLabel: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 18,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 21,
    fontWeight: '700',
  },
  tabsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: 'center',
    backgroundColor: colors.panelAlt,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tabButtonActive: {
    backgroundColor: colors.accentStrong,
    borderColor: colors.accentStrong,
  },
  tabText: {
    color: colors.muted,
    fontSize: 14,
    fontWeight: '700',
  },
  tabTextActive: {
    color: '#062C2C',
  },
  progressCard: {
    backgroundColor: colors.panel,
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 14,
    marginBottom: 18,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  progressTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  progressSubtitle: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 4,
    maxWidth: 230,
  },
  progressPercent: {
    color: colors.accent,
    fontSize: 24,
    fontWeight: '800',
  },
  progressTrack: {
    height: 12,
    backgroundColor: colors.panelStrong,
    borderRadius: 999,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.accent,
    borderRadius: 999,
  },
  taskCard: {
    backgroundColor: colors.panel,
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 14,
  },
  taskCardCompleted: {
    opacity: 0.82,
  },
  taskTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.muted,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  checkboxMark: {
    color: '#052E16',
    fontSize: 14,
    fontWeight: '900',
  },
  taskCopy: {
    flex: 1,
    gap: 6,
  },
  taskTitle: {
    color: colors.text,
    fontSize: 18,
    lineHeight: 23,
    fontWeight: '700',
  },
  taskTitleCompleted: {
    textDecorationLine: 'line-through',
  },
  taskDetail: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 21,
  },
  taskMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  taskMeta: {
    color: colors.accentSoft,
    fontSize: 13,
    fontWeight: '700',
  },
  energyPill: {
    color: '#062C2C',
    backgroundColor: '#5EEAD4',
    fontSize: 12,
    fontWeight: '800',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    overflow: 'hidden',
  },
  sessionCard: {
    backgroundColor: colors.panelAlt,
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 6,
  },
  sessionTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  sessionTime: {
    color: colors.dangerSoft,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  sessionStatus: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: '700',
  },
  sessionTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  sessionEmphasis: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
  },
  footerCard: {
    backgroundColor: '#F59E0B',
    borderRadius: 26,
    padding: 20,
    marginTop: 2,
    gap: 8,
  },
  footerTitle: {
    color: '#451A03',
    fontSize: 18,
    fontWeight: '800',
  },
  footerText: {
    color: '#78350F',
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '600',
  },
});
