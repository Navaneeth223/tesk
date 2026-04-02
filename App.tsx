import { StatusBar } from 'expo-status-bar';
import { useMemo, useState } from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

type TabKey = 'today' | 'week' | 'ideas';

type Task = {
  id: string;
  title: string;
  detail: string;
  duration: string;
  completed: boolean;
  energy: 'Light' | 'Medium' | 'Deep';
};

type Session = {
  title: string;
  time: string;
  emphasis: string;
};

const tabs: Array<{ key: TabKey; label: string }> = [
  { key: 'today', label: 'Today' },
  { key: 'week', label: 'This Week' },
  { key: 'ideas', label: 'Ideas' },
];

const initialTasks: Record<TabKey, Task[]> = {
  today: [
    {
      id: 'screen',
      title: 'Refine the main mobile flow',
      detail: 'Keep the screen expressive, readable, and easy to build on.',
      duration: '45 min',
      completed: true,
      energy: 'Medium',
    },
    {
      id: 'state',
      title: 'Add meaningful local state',
      detail: 'Turn the static layout into something interactive and testable.',
      duration: '30 min',
      completed: true,
      energy: 'Light',
    },
    {
      id: 'data',
      title: 'Prepare the app for real data hooks',
      detail: 'Leave space for API wiring without overcommitting the architecture.',
      duration: '60 min',
      completed: false,
      energy: 'Deep',
    },
  ],
  week: [
    {
      id: 'nav',
      title: 'Introduce navigation structure',
      detail: 'Split overview, tasks, and settings into dedicated routes.',
      duration: '90 min',
      completed: false,
      energy: 'Deep',
    },
    {
      id: 'theme',
      title: 'Extract a reusable design token layer',
      detail: 'Promote colors, spacing, and type into a shared theme module.',
      duration: '40 min',
      completed: false,
      energy: 'Medium',
    },
    {
      id: 'tests',
      title: 'Add basic UI verification',
      detail: 'Cover task toggles and screen rendering before the app grows.',
      duration: '50 min',
      completed: false,
      energy: 'Light',
    },
  ],
  ideas: [
    {
      id: 'sync',
      title: 'Sync focus sessions across devices',
      detail: 'A future cloud feature once authentication exists.',
      duration: 'Concept',
      completed: false,
      energy: 'Medium',
    },
    {
      id: 'voice',
      title: 'Quick capture with voice notes',
      detail: 'Useful when task ideas arrive faster than typing.',
      duration: 'Concept',
      completed: false,
      energy: 'Light',
    },
    {
      id: 'rituals',
      title: 'Morning and shutdown rituals',
      detail: 'Turn planning into a repeatable workflow, not just a list.',
      duration: 'Concept',
      completed: false,
      energy: 'Deep',
    },
  ],
};

const sessions: Session[] = [
  { title: 'Design pass', time: '09:00', emphasis: 'Visual hierarchy' },
  { title: 'Build sprint', time: '11:30', emphasis: 'State and interactions' },
  { title: 'Review block', time: '16:00', emphasis: 'Polish and cleanup' },
];

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

export default function App() {
  const [activeTab, setActiveTab] = useState<TabKey>('today');
  const [tasksByTab, setTasksByTab] = useState(initialTasks);

  const activeTasks = tasksByTab[activeTab];
  const completedCount = activeTasks.filter((task) => task.completed).length;
  const progress = activeTasks.length === 0 ? 0 : completedCount / activeTasks.length;

  const summary = useMemo(() => {
    const totalTasks = Object.values(tasksByTab).flat();
    const done = totalTasks.filter((task) => task.completed).length;

    return {
      done,
      total: totalTasks.length,
      focusHours: 4.5,
    };
  }, [tasksByTab]);

  const toggleTask = (tab: TabKey, taskId: string) => {
    setTasksByTab((current) => ({
      ...current,
      [tab]: current[tab].map((task) =>
        task.id === taskId
          ? {
              ...task,
              completed: !task.completed,
            }
          : task,
      ),
    }));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <View style={styles.backgroundOrbTop} />
      <View style={styles.backgroundOrbBottom} />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroCard}>
          <Text style={styles.eyebrow}>Focus Planner</Text>
          <Text style={styles.title}>Keep the next build session clear and moving.</Text>
          <Text style={styles.subtitle}>
            A stronger starter app: part dashboard, part session planner, and ready
            for us to wire into real product logic next.
          </Text>

          <View style={styles.metricsRow}>
            <View style={styles.metricCard}>
              <Text style={styles.metricValue}>{summary.done}/{summary.total}</Text>
              <Text style={styles.metricLabel}>Tasks marked done</Text>
            </View>
            <View style={styles.metricCard}>
              <Text style={styles.metricValue}>{summary.focusHours}h</Text>
              <Text style={styles.metricLabel}>Planned focus time</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Planner View</Text>
          <View style={styles.tabsRow}>
            {tabs.map((tab) => {
              const selected = tab.key === activeTab;

              return (
                <Pressable
                  key={tab.key}
                  onPress={() => setActiveTab(tab.key)}
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

        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <View>
              <Text style={styles.progressTitle}>Current momentum</Text>
              <Text style={styles.progressSubtitle}>
                {completedCount} of {activeTasks.length} items complete in {tabs.find((tab) => tab.key === activeTab)?.label}
              </Text>
            </View>
            <Text style={styles.progressPercent}>{Math.round(progress * 100)}%</Text>
          </View>

          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${Math.max(progress * 100, 8)}%` }]} />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Task Stack</Text>
          {activeTasks.map((task) => (
            <Pressable
              key={task.id}
              onPress={() => toggleTask(activeTab, task.id)}
              style={[
                styles.taskCard,
                task.completed && styles.taskCardCompleted,
              ]}
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
                <Text
                  style={[
                    styles.energyPill,
                    task.energy === 'Deep' && styles.energyPillDeep,
                    task.energy === 'Medium' && styles.energyPillMedium,
                    task.energy === 'Light' && styles.energyPillLight,
                  ]}
                >
                  {task.energy} energy
                </Text>
              </View>
            </Pressable>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Focus Sessions</Text>
          <View style={styles.sessionGrid}>
            {sessions.map((session) => (
              <View key={session.time} style={styles.sessionCard}>
                <Text style={styles.sessionTime}>{session.time}</Text>
                <Text style={styles.sessionTitle}>{session.title}</Text>
                <Text style={styles.sessionEmphasis}>{session.emphasis}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.footerCard}>
          <Text style={styles.footerTitle}>Where to continue next</Text>
          <Text style={styles.footerText}>
            The app now has enough structure to justify adding navigation, persistent
            storage, or API-backed tasks without throwing this screen away.
          </Text>
        </View>
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
  eyebrow: {
    color: colors.accentWarm,
    textTransform: 'uppercase',
    letterSpacing: 1.4,
    fontWeight: '800',
    fontSize: 12,
  },
  title: {
    color: colors.text,
    fontSize: 33,
    lineHeight: 39,
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
    fontSize: 12,
    fontWeight: '800',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    overflow: 'hidden',
  },
  energyPillDeep: {
    color: '#FFF7ED',
    backgroundColor: '#C2410C',
  },
  energyPillMedium: {
    color: '#082F49',
    backgroundColor: '#7DD3FC',
  },
  energyPillLight: {
    color: '#052E2B',
    backgroundColor: '#5EEAD4',
  },
  sessionGrid: {
    gap: 12,
  },
  sessionCard: {
    backgroundColor: colors.panelAlt,
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 6,
  },
  sessionTime: {
    color: colors.dangerSoft,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
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
