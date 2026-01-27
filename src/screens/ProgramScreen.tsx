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
import ProgramSection from '../components/program/ProgramSection';
import DayDropdown from '../components/program/DayDropdown';

// Hooks & Services
import { workoutService } from '../services/api';
import { useProgramData } from '../hooks/useProgramData';

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

  const programId = route.params?.programId || 'prog_beginner';
  const programTitle = route.params?.programTitle || 'BEGINNER';

  // State
  // Initial state as empty array, wait for fetch
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isWarmUpActive, setWarmUpActive] = useState(true);
  const [isWorkoutActive, setWorkoutActive] = useState(true);
  const [isCoolDownActive, setCoolDownActive] = useState(true);
  const [workoutProgress, setWorkoutProgress] = useState(0);

  const {
    loading,
    scheduleSummary,
    currentDayDetail,
    warmUpData,
    mainWorkoutData,
    coolDownData,
    workoutType,
  } = useProgramData(programId, selectedDayIndex + 1);

  const handleUpdateDuration = (id: string, newDuration: number) => {
    console.log(`Update duration request: ID ${id} -> ${newDuration}`);
  };

  const handleStartWorkout = async () => {
    let playlist: any[] = [];
    if (isWarmUpActive)
      playlist = [
        ...playlist,
        ...warmUpData.map(i => ({ ...i, category: 'WARM UP' })),
      ];
    if (isWorkoutActive)
      playlist = [
        ...playlist,
        ...mainWorkoutData.map(i => ({ ...i, category: workoutType })),
      ];
    if (isCoolDownActive)
      playlist = [
        ...playlist,
        ...coolDownData.map(i => ({ ...i, category: 'COOL DOWN' })),
      ];

    if (playlist.length === 0) {
      Alert.alert('Info', 'Pilih minimal satu sesi latihan!');
      return;
    }

    try {
      // FIX ID Mapping (String -> Number) untuk backend
      let numericProgramId = 1; // Default beginner
      if (String(programId) === 'prog_beginner') numericProgramId = 1;
      else if (String(programId) === 'prog_intermediate') numericProgramId = 2;
      else if (String(programId) === 'prog_advanced') numericProgramId = 3;
      else if (String(programId) === 'prog_custom') numericProgramId = 4;

      console.log(
        `Starting Session: ID=${numericProgramId}, Day=${selectedDayIndex + 1}`,
      );

      const session = await workoutService.startSession(
        numericProgramId,
        selectedDayIndex + 1,
      );
      const rawSessionId = session.data?.sessionId || session.sessionId;

      if (!rawSessionId) throw new Error('No Session ID returned');

      navigation.navigate('WorkoutPlayer', {
        playlist,
        onProgressUpdate: setWorkoutProgress,
        initialIndex: 0,
        sessionId: String(rawSessionId),
      });
    } catch (err: any) {
      console.error('Start workout failed', err);
      const msg =
        err.response?.status === 404
          ? 'Program/Hari tidak ditemukan (404)'
          : 'Gagal memulai sesi.';
      Alert.alert('Error', msg);
    }
  };

  // Render Loading
  if (loading && !currentDayDetail) {
    return (
      <View style={[styles.centered, styles.mainContainer]}>
        <ActivityIndicator size="large" color="#1697D4" />
      </View>
    );
  }

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
            currentProgram={
              {
                dayTitle:
                  currentDayDetail?.title || `Day ${selectedDayIndex + 1}`,
                subtitle: currentDayDetail?.total_time || '0 min',
              } as any
            }
            programData={scheduleSummary.map(
              s =>
                ({
                  dayTitle: s.label,
                  totalTime: `${s.duration_minutes} min`,
                } as any),
            )}
            isOpen={isDropdownOpen}
            selectedDayIndex={selectedDayIndex}
            onToggle={() => setDropdownOpen(!isDropdownOpen)}
            onSelectDay={index => {
              setSelectedDayIndex(index);
              setDropdownOpen(false);
            }}
          />

          {/* Sections */}
          {warmUpData.length > 0 && (
            <ProgramSection
              title="WARM UP"
              data={warmUpData}
              workoutCategory={workoutType}
              onUpdateDuration={handleUpdateDuration}
              isActive={isWarmUpActive}
              onToggle={setWarmUpActive}
            />
          )}

          {mainWorkoutData.length > 0 && (
            <ProgramSection
              title="WORKOUT"
              data={mainWorkoutData}
              workoutCategory={workoutType}
              onUpdateDuration={handleUpdateDuration}
              isActive={isWorkoutActive}
              onToggle={setWorkoutActive}
            />
          )}

          {coolDownData.length > 0 && (
            <ProgramSection
              title="COOL DOWN"
              data={coolDownData}
              workoutCategory={workoutType}
              onUpdateDuration={handleUpdateDuration}
              isActive={isCoolDownActive}
              onToggle={setCoolDownActive}
            />
          )}
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
  centered: { justifyContent: 'center', alignItems: 'center' },
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
