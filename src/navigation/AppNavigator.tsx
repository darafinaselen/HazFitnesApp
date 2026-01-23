import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import colors from '../constants/color';
import CircularProgressBar from '../components/CircularProgressBar';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

import SplashScreen from '../screens/SplashScreen';
import GenderSelectScreen from '../screens/dataInput/GenderSelectScreen';
import AgeScreen from '../screens/dataInput/AgeScreen';
import HeightScreen from '../screens/dataInput/HeightScreen';
import WeightScreen from '../screens/dataInput/WeightScreen';
import HealthConditionsScreen from '../screens/dataInput/HealthConditionsScreen';
import { BmiLevel } from '../utils/bmiHelper';
import GoalScreen from '../screens/dataInput/GoalScreen';
import TypesTrainingScreen from '../screens/dataInput/TypesTrainingScreen';
import AnalyzingScreen from '../screens/dataInput/AnalyzingScreen';
import RegisterScreen from '../screens/RegisterScreen';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import ProgramScreen from '../screens/ProgramScreen';
import WorkoutProgramsScreen from '../screens/WorkoutProgramScreen';
import ExerciseDetailScreen from '../screens/ExerciseDetailScreen';
import WorkoutPlayerScreen from '../screens/WorkoutPlayerScreen';
import StepsTrackerScreen from '../screens/StepsTrackerScreen';
import ReportScreen from '../screens/ReportScreen';
import HistoryScreen from '../screens/HistoryScreen';
import WeightHistoryScreen from '../screens/WeightHistoryScreen';
import HeightInputScreen from '../screens/HeightInputScreen';
import ProfileScreen from '../screens/ProfileScreen';
import StatisticsScreen from '../screens/StatisticsScreen';
import ProfileEditScreen from '../screens/ProfileEditScreen';
import RemindersScreen from '../screens/RemindersScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import VerificationCodeScreen from '../screens/auth/VerificationCodeScreen';
import ResetPasswordScreen from '../screens/auth/ResetPasswordScreen';

export type RootStackParamList = {
  Splash: undefined;
  GenderSelect: undefined;
  Age: { gender: 'male' | 'female' };
  Height: { gender: 'male' | 'female'; age: number };
  Weight: { gender: 'male' | 'female'; age: number; height: number };
  HealthConditions: {
    gender: 'male' | 'female';
    age: number;
    height: number;
    weight: number;
    bmi: number;
    bmiLevel: BmiLevel;
  };
  Goal: {
    gender: 'male' | 'female';
    age: number;
    height: number;
    weight: number;
    bmi: number;
    bmiLevel: BmiLevel;
    hypertension: boolean | null;
    diabetes: boolean | null;
  };
  TypesTraining: {
    gender: 'male' | 'female';
    age: number;
    height: number;
    weight: number;
    bmi: number;
    bmiLevel: BmiLevel;
    hypertension: boolean | null;
    diabetes: boolean | null;
    goal: 'Weight Gain' | 'Weight Loss' | null;
  };
  Analyzing: {
    gender: 'male' | 'female';
    age: number;
    height: number;
    weight: number;
    bmi: number;
    bmiLevel: BmiLevel;
    hypertension: boolean | null;
    diabetes: boolean | null;
    goal: 'Weight Gain' | 'Weight Loss' | null;
    training: 'Cardio Fitness' | 'Muscular Fitness' | null;
  };
  Register: {
    recommendationToken?: string;
  };
  Login: undefined;
  ForgotPassword: undefined;
  VerificationCode: { email: string };
  ResetPassword: undefined;
  Home: undefined;
  Program: {
    programId: string;
    programTitle: string;
  };
  WorkoutPrograms: undefined;
  ExerciseDetail: {
    exerciseId: string;
    name: string;
    duration: number;
    category?: string;
    image?: any;
    description: string;
    onSave?: (id: string, newDuration: number) => void;
  };
  WorkoutPlayer: {
    playlist: any[];
    onProgressUpdate?: (percentage: number) => void;
    initialIndex?: number;
  };
  StepsTracker: undefined;
  Report: undefined;
  History: undefined;
  WeightHistory: undefined;
  HeightInput: { currentHeight: string };
  Profil: undefined;
  Statistics: undefined;
  ProfileEdit: undefined;
  Reminders: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const headerStyleOptions = {
  headerShown: true,
  headerBackTitleVisible: false,
  headerShadowVisible: false,
  headerStyle: { backgroundColor: colors.white },
  headerTintColor: colors.black,
};

const AppNavigator: React.FC = () => {
  const [initialRoute, setInitialRoute] = useState<
    keyof RootStackParamList | null
  >(null);

  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        await SecureStore.deleteItemAsync('user_token');
        await AsyncStorage.removeItem('has_onboarded');
        console.log('🔥 DATA RESET BERHASIL! SILAKAN LOGIN ULANG.');

        // 1. Cek apakah ada token login?
        const token = await SecureStore.getItemAsync('user_token');

        // 2. Cek apakah user pernah onboarding (isi data)?
        const hasOnboarded = await AsyncStorage.getItem('has_onboarded');

        if (token) {
          // KASUS A: Token ada = Langsung Masuk Home
          console.log('[Auth] Token found, going to Home');
          setInitialRoute('Home');
        } else {
          if (hasOnboarded === 'true') {
            // KASUS B: Token gak ada, TAPI pernah input data = User Logout -> Ke Login
            console.log('[Auth] No token but onboarded, going to Login');
            setInitialRoute('Login');
          } else {
            // KASUS C: User Baru -> Ke Input Data Pertama
            console.log('[Auth] New user, going to GenderSelect');
            setInitialRoute('GenderSelect');
          }
        }
      } catch (e) {
        // Fallback jika error, ke Login saja
        setInitialRoute('Login');
      }
    };

    checkUserStatus();
  }, []);

  if (initialRoute === null) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: colors.white,
        }}
      >
        <ActivityIndicator size="large" color="#009CDE" />
      </View>
    );
  }

  return (
    <Stack.Navigator
      initialRouteName={initialRoute}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen
        name="Splash"
        component={SplashScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="GenderSelect"
        component={GenderSelectScreen}
        options={{
          ...headerStyleOptions,
          title: '',
          headerRight: () => (
            <View style={{ marginRight: 20 }}>
              <CircularProgressBar progress={0.2} />
            </View>
          ),
        }}
      />
      <Stack.Screen
        name="Age"
        component={AgeScreen}
        options={{
          ...headerStyleOptions,
          title: '',
          headerRight: () => (
            <View style={{ marginRight: 20 }}>
              <CircularProgressBar progress={0.4} />
            </View>
          ),
        }}
      />
      <Stack.Screen
        name="Height"
        component={HeightScreen}
        options={{
          ...headerStyleOptions,
          title: '',
          headerRight: () => (
            <View style={{ marginRight: 20 }}>
              <CircularProgressBar progress={0.6} />
            </View>
          ),
        }}
      />
      <Stack.Screen
        name="Weight"
        component={WeightScreen}
        options={{
          ...headerStyleOptions,
          title: '',
          headerRight: () => (
            <View style={{ marginRight: 20 }}>
              <CircularProgressBar progress={0.7} />
            </View>
          ),
        }}
      />
      <Stack.Screen
        name="HealthConditions"
        component={HealthConditionsScreen}
        options={{
          ...headerStyleOptions,
          title: '',
          headerRight: () => (
            <View style={{ marginRight: 20 }}>
              <CircularProgressBar progress={0.8} />
            </View>
          ),
        }}
      />
      <Stack.Screen
        name="Goal"
        component={GoalScreen}
        options={{
          ...headerStyleOptions,
          title: '',
          headerRight: () => (
            <View style={{ marginRight: 20 }}>
              <CircularProgressBar progress={0.9} />
            </View>
          ),
        }}
      />
      <Stack.Screen
        name="TypesTraining"
        component={TypesTrainingScreen}
        options={{
          ...headerStyleOptions,
          title: '',
          headerRight: () => (
            <View style={{ marginRight: 20 }}>
              <CircularProgressBar progress={1.0} />
            </View>
          ),
        }}
      />
      <Stack.Screen
        name="Analyzing"
        component={AnalyzingScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="VerificationCode"
        component={VerificationCodeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ResetPassword"
        component={ResetPasswordScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Program"
        component={ProgramScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="WorkoutPrograms"
        component={WorkoutProgramsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ExerciseDetail"
        component={ExerciseDetailScreen}
        options={{
          headerShown: true,
          title: 'INSTRUCTIONS',
          headerTintColor: colors.black,
          headerShadowVisible: false,
          headerStyle: { backgroundColor: colors.white },
        }}
      />
      <Stack.Screen
        name="WorkoutPlayer"
        component={WorkoutPlayerScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="StepsTracker"
        component={StepsTrackerScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Report"
        component={ReportScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="History"
        component={HistoryScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="WeightHistory"
        component={WeightHistoryScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="HeightInput"
        component={HeightInputScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Profil"
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Statistics"
        component={StatisticsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ProfileEdit"
        component={ProfileEditScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Reminders"
        component={RemindersScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
