import { DarkTheme, NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useAppState } from '../context/AppStateContext';
import { FocusPlannerScreen } from '../screens/FocusPlannerScreen';
import { SessionsScreen } from '../screens/SessionsScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { StatsDetailScreen } from '../screens/StatsDetailScreen';

export type RootStackParamList = {
  Tabs: undefined;
  StatsDetail: { sessionId: string };
};

type BottomTabParamList = {
  Focus: undefined;
  Sessions: undefined;
  Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<BottomTabParamList>();

function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#14B8A6',
        tabBarInactiveTintColor: '#94A3B8',
        tabBarStyle: {
          backgroundColor: '#121A2B',
          borderTopColor: '#24324A',
          height: 68,
          paddingBottom: 10,
          paddingTop: 10,
        },
      }}
    >
      <Tab.Screen name="Focus" component={FocusPlannerScreen} />
      <Tab.Screen name="Sessions" component={SessionsScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

export function RootNavigator() {
  const { settings } = useAppState();

  return (
    <NavigationContainer
      theme={{
        ...DarkTheme,
        dark: settings.darkMode,
        colors: {
          ...DarkTheme.colors,
          background: '#0B1020',
          card: '#121A2B',
          border: '#24324A',
          primary: '#14B8A6',
          text: '#F8FAFC',
          notification: '#F59E0B',
        },
      }}
    >
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#121A2B',
          },
          headerTintColor: '#F8FAFC',
          headerShadowVisible: false,
          contentStyle: {
            backgroundColor: '#0B1020',
          },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen
          name="Tabs"
          component={BottomTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="StatsDetail"
          component={StatsDetailScreen}
          options={{ title: 'Session Analytics' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
