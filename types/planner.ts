export type PlannerTabKey = 'focus' | 'sessions' | 'analytics';

export type TaskEnergy = 'Light' | 'Medium' | 'Deep';

export type Task = {
  id: string;
  title: string;
  detail: string;
  duration: string;
  completed: boolean;
  energy: TaskEnergy;
};

export type Session = {
  id: string;
  title: string;
  time: string;
  emphasis: string;
  durationMinutes: number;
  focusScore: number;
  completed: boolean;
  note: string;
};

export type SettingsState = {
  darkMode: boolean;
  notificationsEnabled: boolean;
};

export type PersistedAppState = {
  plannerTab: PlannerTabKey;
  tasksByTab: Record<PlannerTabKey, Task[]>;
  sessions: Session[];
  settings: SettingsState;
};
