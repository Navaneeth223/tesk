import { Alert, Pressable, SafeAreaView, StyleSheet, Switch, Text, View } from 'react-native';
import Toast from 'react-native-toast-message';

import { useAppState } from '../context/AppStateContext';

export function SettingsScreen() {
  const { settings, updateSettings, clearAll } = useAppState();

  const confirmClearData = () => {
    Alert.alert(
      'Clear local planner data?',
      'This will restore the default tasks, sessions, and preferences.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear Data',
          style: 'destructive',
          onPress: async () => {
            await clearAll();
            Toast.show({
              type: 'success',
              text1: 'Data cleared',
              text2: 'The planner was reset to its default state.',
              position: 'bottom',
            });
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>
        <View style={styles.heroCard}>
          <Text style={styles.eyebrow}>Settings</Text>
          <Text style={styles.title}>Control the planner experience.</Text>
          <Text style={styles.subtitle}>
            Preferences are saved locally with the rest of the planner state.
          </Text>
        </View>

        <View style={styles.settingCard}>
          <View style={styles.settingRow}>
            <View style={styles.settingCopy}>
              <Text style={styles.settingTitle}>Dark mode</Text>
              <Text style={styles.settingText}>
                Keep the high-contrast dark theme enabled for the app shell.
              </Text>
            </View>
            <Switch
              value={settings.darkMode}
              onValueChange={(value) => updateSettings({ darkMode: value })}
              trackColor={{ false: '#334155', true: '#14B8A6' }}
              thumbColor={settings.darkMode ? '#F8FAFC' : '#CBD5E1'}
            />
          </View>
        </View>

        <View style={styles.settingCard}>
          <View style={styles.settingRow}>
            <View style={styles.settingCopy}>
              <Text style={styles.settingTitle}>Notification settings</Text>
              <Text style={styles.settingText}>
                Save your preference now so reminders can be wired in later without a migration.
              </Text>
            </View>
            <Switch
              value={settings.notificationsEnabled}
              onValueChange={(value) => updateSettings({ notificationsEnabled: value })}
              trackColor={{ false: '#334155', true: '#22C55E' }}
              thumbColor={settings.notificationsEnabled ? '#F8FAFC' : '#CBD5E1'}
            />
          </View>
        </View>

        <Pressable onPress={confirmClearData} style={styles.clearButton}>
          <Text style={styles.clearButtonText}>Clear Saved Data</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0B1020',
  },
  content: {
    flex: 1,
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
  settingCard: {
    backgroundColor: '#121A2B',
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: '#24324A',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
    alignItems: 'center',
  },
  settingCopy: {
    flex: 1,
    gap: 6,
  },
  settingTitle: {
    color: '#F8FAFC',
    fontSize: 17,
    fontWeight: '700',
  },
  settingText: {
    color: '#94A3B8',
    fontSize: 14,
    lineHeight: 21,
  },
  clearButton: {
    marginTop: 6,
    backgroundColor: '#3F1D2E',
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: 'center',
  },
  clearButtonText: {
    color: '#FECDD3',
    fontSize: 14,
    fontWeight: '800',
  },
});
