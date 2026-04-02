import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import Toast from 'react-native-toast-message';

import { ErrorBoundary } from './components/ErrorBoundary';
import { LoadingScreen } from './components/LoadingScreen';
import { AppStateProvider, useAppState } from './context/AppStateContext';
import { RootNavigator } from './navigation/RootNavigator';

function AppShell() {
  const { isReady, storageError } = useAppState();

  useEffect(() => {
    if (!storageError) {
      return;
    }

    Toast.show({
      type: 'error',
      text1: 'Storage issue',
      text2: storageError,
      position: 'bottom',
    });
  }, [storageError]);

  if (!isReady) {
    return <LoadingScreen />;
  }

  return <RootNavigator />;
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppStateProvider>
        <StatusBar style="light" />
        <AppShell />
        <Toast />
      </AppStateProvider>
    </ErrorBoundary>
  );
}

export function AppCrashFallback() {
  return (
    <SafeAreaView style={styles.fallback}>
      <View style={styles.fallbackCard}>
        <Text style={styles.fallbackTitle}>Something went wrong</Text>
        <Text style={styles.fallbackText}>
          The planner hit an unexpected error. Restart the app to continue safely.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  fallback: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#09111F',
    padding: 24,
  },
  fallbackCard: {
    width: '100%',
    maxWidth: 420,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#24324A',
    backgroundColor: '#121A2B',
    padding: 24,
    gap: 10,
  },
  fallbackTitle: {
    color: '#F8FAFC',
    fontSize: 24,
    fontWeight: '800',
  },
  fallbackText: {
    color: '#94A3B8',
    fontSize: 15,
    lineHeight: 23,
  },
});
