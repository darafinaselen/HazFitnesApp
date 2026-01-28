import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';

import { RootStackParamList } from '../navigation/AppNavigator';
import CustomBottomBar from '../components/CustomBottomBar';
import PrimaryButton from '../components/PrimaryButton';
import colors from '../constants/color';
import { FONT_FAMILY } from '../constants/fonts';

// Components
import ProgramSection from '../components/program/ProgramSection';
import DayDropdown from '../components/program/DayDropdown';

// Data & Types
import { ProgramDay, Exercise } from '../types/programTypes';
import { programService, workoutService } from '../services/api';
import {
  SanoVitaProgramScheduleData,
  SanoVitaExerciseItem,
  SanoVitaWorkoutSection,
} from '../types/api';

// Enable LayoutAnimation for Android
if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const ProgramScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'Program'>>();

  const programId = route.params?.programId || 1; // Default to 1 if not provided
  const programTitle = route.params?.programTitle || 'BEGINNER';

  // State
  const [programData, setProgramData] = useState<ProgramDay[]>([]);
  const [scheduleData, setScheduleData] =
    useState<SanoVitaProgramScheduleData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  // Section States
  const [isWarmUpActive, setWarmUpActive] = useState(true);
  const [isWorkoutActive, setWorkoutActive] = useState(true);
  const [isCoolDownActive, setCoolDownActive] = useState(true);

  const [workoutProgress, setWorkoutProgress] = useState(0);

  useEffect(() => {
    fetchProgramSchedule(selectedDayIndex + 1);
  }, [programId]);

  /**
   * Transform SanoVita exercise item to local Exercise format
   */
  const transformExercise = (item: SanoVitaExerciseItem): Exercise => ({
    id: item.id,
    name: item.name,
    duration: item.duration_seconds,
    image: item.image_url
      ? { uri: item.image_url }
      : require('../assets/images/splash.png'),
    video: { uri: '' }, // Backend doesn't provide video URL in schedule
    description: '',
  });

  /**
   * Transform SanoVita schedule response to ProgramDay[] format
   */
  const transformScheduleToProgram = (
    data: SanoVitaProgramScheduleData,
  ): ProgramDay[] => {
    // Create a ProgramDay for each day in schedule_summary
    return data.schedule_summary.map((daySummary, index) => {
      const isCurrentDay = daySummary.day_id === data.current_day_detail.day_id;

      // For current day, use the detailed workout sections
      let warmUp: Exercise[] = [];
      let exercises: Exercise[] = [];
      let coolDown: Exercise[] = [];

      if (isCurrentDay && data.current_day_detail.workout_sections) {
        data.current_day_detail.workout_sections.forEach(
          (section: SanoVitaWorkoutSection) => {
            const transformedExercises =
              section.exercises.map(transformExercise);

            const sectionName = section.section_name.toUpperCase();
            if (sectionName.includes('WARM')) {
              warmUp = transformedExercises;
            } else if (sectionName.includes('COOL')) {
              coolDown = transformedExercises;
            } else {
              exercises = [...exercises, ...transformedExercises];
            }
          },
        );
      }

      return {
        id: daySummary.day_id,
        dayTitle: daySummary.label,
        subtitle: `${daySummary.exercise_count} exercises • ${daySummary.duration_minutes} min`,
        warmUp,
        exercises,
        coolDown,
      };
    });
  };

  const fetchProgramSchedule = async (day: number = 1) => {
    setLoading(true);
    try {
      const response = await programService.getProgramSchedule(programId, day);

      if (response && response.data) {
        setScheduleData(response.data);
        const transformedData = transformScheduleToProgram(response.data);
        setProgramData(transformedData);
      } else {
        console.warn('ProgramSchedule: Unexpected data format', response);
      }
    } catch (error) {
      console.error('Failed to fetch schedule', error);
      Alert.alert('Error', 'Failed to load program schedule');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetch specific day detail when user selects a different day
   */
  const handleSelectDay = async (index: number) => {
    setSelectedDayIndex(index);
    setDropdownOpen(false);
    // Fetch the selected day's details
    await fetchProgramSchedule(index + 1);
  };

  // Handle loading state before accessing currentProgram
  if (loading) {
    return (
      <View
        style={[
          styles.mainContainer,
          { justifyContent: 'center', alignItems: 'center' },
        ]}
      >
        <ActivityIndicator size="large" color="#1697D4" />
      </View>
    );
  }

  // Handle case where data is empty
  if (!programData || programData.length === 0) {
    return (
      <View
        style={[
          styles.mainContainer,
          { justifyContent: 'center', alignItems: 'center' },
        ]}
      >
        <Text>No schedule found for this program.</Text>
      </View>
    );
  }

  const currentProgram = programData[selectedDayIndex];

  // Helper: Determine Workout Type Name
  const getWorkoutType = () => {
    if (currentProgram.dayTitle.includes('UPPER')) return 'Upper Body';
    if (currentProgram.dayTitle.includes('LOWER')) return 'Lower Body';
    return 'Full Body';
  };
  const workoutType = getWorkoutType();

  const handleUpdateDuration = (id: string, newDuration: number) => {
    setProgramData(prevData =>
      prevData.map(day => ({
        ...day,
        warmUp: day.warmUp.map(item =>
          item.id === id ? { ...item, duration: newDuration } : item,
        ),
        exercises: day.exercises.map(item =>
          item.id === id ? { ...item, duration: newDuration } : item,
        ),
        coolDown: day.coolDown.map(item =>
          item.id === id ? { ...item, duration: newDuration } : item,
        ),
      })),
    );
  };

  const handleStartWorkout = async () => {
    let playlist: any[] = [];

    if (isWarmUpActive)
      playlist = [
        ...playlist,
        ...currentProgram.warmUp.map(item => ({
          ...item,
          category: 'WARM UP',
        })),
      ];
    if (isWorkoutActive)
      playlist = [
        ...playlist,
        ...currentProgram.exercises.map(item => ({
          ...item,
          category: workoutType || 'EXERCISE',
        })),
      ];
    if (isCoolDownActive)
      playlist = [
        ...playlist,
        ...currentProgram.coolDown.map(item => ({
          ...item,
          category: 'COOL DOWN',
        })),
      ];

    if (playlist.length === 0) {
      Alert.alert('Please select at least one section!');
      return;
    }

    try {
      // Start session in backend
      // Use the day_id from current program which corresponds to workoutSessionId
      const workoutSessionId = currentProgram.id;

      // programId is already numeric from route params
      const session = await workoutService.startSession(
        programId,
        workoutSessionId,
      );

      // Use the session ID returned for tracking later
      const sessionId = session.data?.sessionId || (session as any).sessionId;

      let startIndex = 0;
      if (workoutProgress > 0 && workoutProgress < 100) {
        startIndex = Math.floor((workoutProgress / 100) * playlist.length);
        if (startIndex >= playlist.length) startIndex = playlist.length - 1;
      }

      navigation.navigate('WorkoutPlayer', {
        playlist,
        onProgressUpdate: setWorkoutProgress,
        initialIndex: startIndex,
        sessionId: sessionId, // Pass session ID to player
      } as any);
    } catch (err) {
      console.error('Failed to start workout session', err);
      Alert.alert(
        'Error',
        'Could not start workout session. Please try again.',
      );
    }
  };

  return (
    <View style={styles.mainContainer}>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#F5F7FA" />
        <ScrollView
          contentContainerStyle={[styles.scrollContent, { paddingBottom: 200 }]}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled={true}
        >
          {/* Header */}
          <View style={styles.headerRow}>
            <Text style={styles.pageTitle}>{programTitle} PROGRAM</Text>
            <TouchableOpacity
              style={styles.changeButton}
              onPress={() => navigation.navigate('WorkoutPrograms')}
            >
              <Text style={styles.changeButtonText}>CHANGE</Text>
            </TouchableOpacity>
          </View>

          {/* Dropdown */}
          <DayDropdown
            currentProgram={currentProgram}
            programData={programData}
            isOpen={isDropdownOpen}
            selectedDayIndex={selectedDayIndex}
            onToggle={() => setDropdownOpen(!isDropdownOpen)}
            onSelectDay={handleSelectDay}
          />

          {/* Sections */}
          <ProgramSection
            title="WARM UP"
            data={currentProgram.warmUp}
            workoutCategory={workoutType}
            onUpdateDuration={handleUpdateDuration}
            isActive={isWarmUpActive}
            onToggle={setWarmUpActive}
          />

          {/* NOTE: Pada code asli Anda, semua section menggunakan state 'isWarmUpActive'. 
              Saya perbaiki agar Workout menggunakan 'isWorkoutActive' dan CoolDown menggunakan 'isCoolDownActive'. */}
          <ProgramSection
            title="WORKOUT"
            data={currentProgram.exercises}
            workoutCategory={workoutType}
            onUpdateDuration={handleUpdateDuration}
            isActive={isWorkoutActive}
            onToggle={setWorkoutActive}
          />
          <ProgramSection
            title="COOL DOWN"
            data={currentProgram.coolDown}
            workoutCategory={workoutType}
            onUpdateDuration={handleUpdateDuration}
            isActive={isCoolDownActive}
            onToggle={setCoolDownActive}
          />
        </ScrollView>
      </SafeAreaView>

      {/* Floating Button */}
      <View style={styles.floatingButtonContainer}>
        {workoutProgress > 0 && workoutProgress < 100 ? (
          <TouchableOpacity
            style={styles.resumeButton}
            onPress={handleStartWorkout}
          >
            <Text style={styles.resumeTitle}>LANJUTKAN</Text>
            <Text style={styles.resumeSubtitle}>{workoutProgress}%</Text>
          </TouchableOpacity>
        ) : (
          <PrimaryButton label="START" onPress={handleStartWorkout} />
        )}
      </View>

      <CustomBottomBar />
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#F5F7FA' },
  safeArea: { flex: 1 },
  scrollContent: { padding: 20, overflow: 'visible' },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  pageTitle: {
    color: colors.text,
    fontFamily: FONT_FAMILY.MontserratBold,
    fontSize: 18,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  changeButton: {
    backgroundColor: '#1697D4',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  changeButtonText: {
    color: '#FFF',
    fontSize: 10,
    fontFamily: FONT_FAMILY.RobotoMedium,
    fontWeight: '700',
  },
  floatingButtonContainer: {
    position: 'absolute',
    bottom: 80,
    left: 20,
    right: 20,
    zIndex: 10,
  },
  resumeButton: {
    backgroundColor: '#1697D4',
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  resumeTitle: {
    color: '#FFF',
    fontFamily: FONT_FAMILY.MontserratBold,
    fontSize: 18,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  resumeSubtitle: {
    color: '#FFF',
    fontFamily: FONT_FAMILY.RobotoMedium,
    fontSize: 14,
    fontWeight: '500',
  },
});

export default ProgramScreen;
