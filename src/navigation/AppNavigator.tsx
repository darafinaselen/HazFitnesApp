import React from 'react';
import { View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import colors from '../constants/color';
import CircularProgressBar from '../components/CircularProgressBar';
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
    goal: string | null;
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
    goal: string | null;
    training: string | null;
  };
  Register: {
    gender: 'male' | 'female';
    age: number;
    height: number;
    weight: number;
    bmi: number;
    bmiLevel: BmiLevel;
    hypertension: boolean | null;
    diabetes: boolean | null;
    goal: string | null;
    training: string | null;
  };
  Login: undefined;
  Home: undefined;
  Program: {
    programId: string;
    programTitle: string;
  };
  WorkoutPrograms: undefined;
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
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
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
    </Stack.Navigator>
  );
};

export default AppNavigator;
