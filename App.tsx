import { StatusBar } from 'expo-status-bar';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const priorities = [
  {
    label: 'Today',
    title: 'Ship the first usable screen',
    detail: 'Build momentum with a focused mobile layout and clear visual hierarchy.',
  },
  {
    label: 'Next',
    title: 'Connect real data',
    detail: 'Replace placeholder content with API or local state once the product flow is ready.',
  },
  {
    label: 'Later',
    title: 'Layer in navigation',
    detail: 'Split this landing view into dedicated screens when the app structure is defined.',
  },
];

export default function App() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroCard}>
          <Text style={styles.eyebrow}>Expo Starter</Text>
          <Text style={styles.title}>A cleaner place to keep building from.</Text>
          <Text style={styles.subtitle}>
            The blank scaffold has been replaced with a stronger first screen so the
            app already feels intentional on mobile.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Current Focus</Text>
          <Text style={styles.sectionText}>
            This screen is set up as a lightweight project dashboard. It gives us a
            visual foundation without locking us into a product direction too early.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Build Queue</Text>
          {priorities.map((item) => (
            <View key={item.title} style={styles.taskCard}>
              <Text style={styles.taskLabel}>{item.label}</Text>
              <Text style={styles.taskTitle}>{item.title}</Text>
              <Text style={styles.taskDetail}>{item.detail}</Text>
            </View>
          ))}
        </View>

        <View style={styles.footerCard}>
          <Text style={styles.footerTitle}>Next easy win</Text>
          <Text style={styles.footerText}>
            Add navigation, forms, or API state here depending on what you want this
            app to become next.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const colors = {
  background: '#0F172A',
  panel: '#162033',
  panelMuted: '#1E293B',
  border: '#334155',
  accent: '#F97316',
  text: '#E2E8F0',
  mutedText: '#94A3B8',
  labelText: '#FDBA74',
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    gap: 18,
  },
  heroCard: {
    backgroundColor: colors.panel,
    borderRadius: 28,
    padding: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },
  eyebrow: {
    color: colors.labelText,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1.2,
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  title: {
    color: colors.text,
    fontSize: 34,
    fontWeight: '800',
    lineHeight: 40,
  },
  subtitle: {
    color: colors.mutedText,
    fontSize: 16,
    lineHeight: 24,
    marginTop: 14,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '700',
  },
  sectionText: {
    color: colors.mutedText,
    fontSize: 15,
    lineHeight: 23,
  },
  taskCard: {
    backgroundColor: colors.panelMuted,
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 8,
  },
  taskLabel: {
    color: colors.labelText,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  taskTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  taskDetail: {
    color: colors.mutedText,
    fontSize: 14,
    lineHeight: 21,
  },
  footerCard: {
    backgroundColor: colors.accent,
    borderRadius: 24,
    padding: 20,
    marginTop: 4,
  },
  footerTitle: {
    color: '#431407',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 8,
  },
  footerText: {
    color: '#7C2D12',
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '600',
  },
});
