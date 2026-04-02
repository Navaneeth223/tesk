import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';

import { defaultAppState } from '../data/plannerDefaults';
import {
  PersistedAppState,
  PlannerTabKey,
  SettingsState,
} from '../types/planner';

const STORAGE_KEY = 'focus-planner-state-v1';

type AppStateContextValue = PersistedAppState & {
  isReady: boolean;
  storageError: string | null;
  setPlannerTab: (tab: PlannerTabKey) => void;
  toggleTask: (tab: PlannerTabKey, taskId: string) => Promise<boolean>;
  toggleSessionComplete: (sessionId: string) => void;
  updateSettings: (settings: Partial<SettingsState>) => void;
  clearAll: () => Promise<void>;
};

const AppStateContext = createContext<AppStateContextValue | undefined>(undefined);

function mergeState(
  input: Partial<PersistedAppState> | null | undefined,
): PersistedAppState {
  return {
    plannerTab: input?.plannerTab ?? defaultAppState.plannerTab,
    tasksByTab: {
      focus: input?.tasksByTab?.focus ?? defaultAppState.tasksByTab.focus,
      sessions: input?.tasksByTab?.sessions ?? defaultAppState.tasksByTab.sessions,
      analytics:
        input?.tasksByTab?.analytics ?? defaultAppState.tasksByTab.analytics,
    },
    sessions: input?.sessions ?? defaultAppState.sessions,
    settings: {
      darkMode: input?.settings?.darkMode ?? defaultAppState.settings.darkMode,
      notificationsEnabled:
        input?.settings?.notificationsEnabled ??
        defaultAppState.settings.notificationsEnabled,
    },
  };
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [plannerTab, setPlannerTab] = useState<PlannerTabKey>(defaultAppState.plannerTab);
  const [tasksByTab, setTasksByTab] = useState(defaultAppState.tasksByTab);
  const [sessions, setSessions] = useState(defaultAppState.sessions);
  const [settings, setSettings] = useState(defaultAppState.settings);
  const [isReady, setIsReady] = useState(false);
  const [storageError, setStorageError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadState() {
      try {
        const rawValue = await AsyncStorage.getItem(STORAGE_KEY);
        if (!active) {
          return;
        }

        if (!rawValue) {
          setIsReady(true);
          return;
        }

        const parsed = JSON.parse(rawValue) as Partial<PersistedAppState>;
        const nextState = mergeState(parsed);

        setPlannerTab(nextState.plannerTab);
        setTasksByTab(nextState.tasksByTab);
        setSessions(nextState.sessions);
        setSettings(nextState.settings);
      } catch {
        if (active) {
          setStorageError('We could not restore your saved planner data.');
        }
      } finally {
        if (active) {
          setIsReady(true);
        }
      }
    }

    loadState();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    async function saveState() {
      try {
        const nextState: PersistedAppState = {
          plannerTab,
          tasksByTab,
          sessions,
          settings,
        };

        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
      } catch {
        setStorageError('We could not save the latest planner changes.');
      }
    }

    saveState();
  }, [isReady, plannerTab, tasksByTab, sessions, settings]);

  const toggleTask = async (tab: PlannerTabKey, taskId: string) => {
    let completed = false;

    setTasksByTab((current) => ({
      ...current,
      [tab]: current[tab].map((task) => {
        if (task.id !== taskId) {
          return task;
        }

        completed = !task.completed;

        return {
          ...task,
          completed,
        };
      }),
    }));

    return completed;
  };

  const toggleSessionComplete = (sessionId: string) => {
    setSessions((current) =>
      current.map((session) =>
        session.id === sessionId
          ? {
              ...session,
              completed: !session.completed,
            }
          : session,
      ),
    );
  };

  const updateSettings = (nextSettings: Partial<SettingsState>) => {
    setSettings((current) => ({
      ...current,
      ...nextSettings,
    }));
  };

  const clearAll = async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch {
      setStorageError('Saved data could not be cleared from local storage.');
    } finally {
      setPlannerTab(defaultAppState.plannerTab);
      setTasksByTab(defaultAppState.tasksByTab);
      setSessions(defaultAppState.sessions);
      setSettings(defaultAppState.settings);
    }
  };

  const value = useMemo<AppStateContextValue>(
    () => ({
      plannerTab,
      tasksByTab,
      sessions,
      settings,
      isReady,
      storageError,
      setPlannerTab,
      toggleTask,
      toggleSessionComplete,
      updateSettings,
      clearAll,
    }),
    [plannerTab, tasksByTab, sessions, settings, isReady, storageError],
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const context = useContext(AppStateContext);

  if (!context) {
    throw new Error('useAppState must be used within AppStateProvider');
  }

  return context;
}
