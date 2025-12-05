import React, { useEffect, useState } from 'react';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Image,
  Switch,
  LayoutAnimation,
  Platform,
  UIManager,
  ImageSourcePropType,
  Modal,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import CustomBottomBar from '../components/CustomBottomBar';
import colors from '../constants/color';
import { FONT_FAMILY, FONT_SIZE } from '../constants/fonts';
import PrimaryButton from '../components/PrimaryButton';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { formatDuration } from '../utils/timeHelper';

// --- Placeholder Images ---
const workoutThumb = require('../assets/images/splash.png');

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const getProgramDataByLevel = (levelId: string) => {
  const prefix =
    levelId === 'advanced' ? 'ADV' : levelId === 'intermediet' ? 'INT' : '';
  const durationMultiplier = levelId === 'advanced' ? 2 : 1;
  return [
    {
      id: 1,
      dayTitle: `HARI 1: ${prefix} UPPER BODY`,
      subtitle: `${18 * durationMultiplier} Minutes • 6 Exercises`,
      warmUp: [
        {
          id: '1w1',
          name: 'JUMPING JACKS',
          duration: '30',
          image: workoutThumb,
        },
        {
          id: '1w2',
          name: 'ARM CIRCLES',
          duration: '30',
          image: workoutThumb,
        },
      ],
      exercises: [
        { id: '1e1', name: 'PUSH UPS', duration: '00:45', image: workoutThumb },
        {
          id: '1e2',
          name: 'CHEST PRESS',
          duration: '45',
          image: workoutThumb,
        },
      ],
      coolDown: [
        {
          id: '1c1',
          name: 'ARM STRETCH',
          duration: '30',
          image: workoutThumb,
        },
      ],
    },
    {
      id: 2,
      dayTitle: `HARI 2: ${prefix} LOWER BODY`,
      subtitle: `${20 * durationMultiplier} Minutes • 8 Exercises`,
      warmUp: [
        {
          id: '2w1',
          name: 'HIGH KNEES',
          duration: '40',
          image: workoutThumb,
        },
      ],
      exercises: [
        { id: '2e1', name: 'SQUATS', duration: '45', image: workoutThumb },
        { id: '2e2', name: 'LUNGES', duration: '40', image: workoutThumb },
      ],
      coolDown: [
        {
          id: '2c1',
          name: 'QUAD STRETCH',
          duration: '40',
          image: workoutThumb,
        },
      ],
    },
    {
      id: 3,
      dayTitle: `HARI 3: ${prefix} FULL BODY`,
      subtitle: `${20 * durationMultiplier} 25 Minutes • 10 Exercises`,
      warmUp: [
        {
          id: '3w1',
          name: 'JUMP ROPE',
          duration: '60',
          image: workoutThumb,
        },
      ],
      exercises: [
        { id: '3e1', name: 'BURPEES', duration: '40', image: workoutThumb },
        {
          id: '3e2',
          name: 'MOUNTAIN CLIMBERS',
          duration: '30',
          image: workoutThumb,
        },
        { id: '3e3', name: 'PLANK', duration: '60', image: workoutThumb },
      ],
      coolDown: [
        {
          id: '3c1',
          name: 'CHILD POSE',
          duration: '60',
          image: workoutThumb,
        },
      ],
    },
  ];
};

const ChevronDownIcon = ({ isOpen }: { isOpen: boolean }) => (
  <Svg
    width="30"
    height="30"
    viewBox="0 0 30 30"
    fill="none"
    style={{ transform: [{ rotate: isOpen ? '180deg' : '0deg' }] }}
  >
    <Path d="M15 18.75L8.75 12.5H21.25L15 18.75Z" fill="white" />
  </Svg>
);

const CustomSwitch = ({
  value,
  onValueChange,
}: {
  value: boolean;
  onValueChange: (val: boolean) => void;
}) => {
  return (
    <Switch
      trackColor={{ false: '#767577', true: '#10486A' }}
      thumbColor={value ? '#FFFFFF' : '#f4f3f4'}
      ios_backgroundColor="#3e3e3e"
      onValueChange={onValueChange}
      value={value}
      style={{ transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }] }}
    />
  );
};

const ExerciseItem = ({
  name,
  duration,
  image,
  onPress,
}: {
  name: string;
  duration: number;
  image: ImageSourcePropType;
  onPress: () => void;
}) => (
  <TouchableOpacity
    style={styles.exerciseCard}
    onPress={onPress}
    activeOpacity={0.8}
  >
    <Image source={image} style={styles.exerciseImage} />
    <View style={styles.exerciseInfo}>
      <Text style={styles.exerciseName}>{name}</Text>
      <Text style={styles.exerciseDuration}>{formatDuration(duration)}</Text>
    </View>
  </TouchableOpacity>
);

const ProgramSection = ({
  title,
  data,
  workoutCategory,
}: {
  title: string;
  data: any[];
  workoutCategory: string;
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const getCategoryName = () => {
    if (title === 'WARM UP') {
      return 'Warm Up';
    } else if (title === 'COOL DOWN') {
      return 'Cool Down';
    } else {
      return workoutCategory;
    }
  };

  if (!data || data.length === 0) return null;

  return (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <CustomSwitch value={isOpen} onValueChange={setIsOpen} />
      </View>

      {isOpen && (
        <View style={styles.exerciseList}>
          {data.map((item, index) => (
            <ExerciseItem
              key={index}
              name={item.name}
              duration={item.duration}
              image={item.image}
              onPress={() =>
                navigation.navigate('ExerciseDetail', {
                  exerciseId: item.id.toString(),
                  name: item.name,
                  duration: item.duration,
                  category: getCategoryName(),
                  image: item.image,
                })
              }
            />
          ))}
        </View>
      )}
    </View>
  );
};

const ProgramScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'Program'>>();
  const programId = route.params?.programId || 'beginner';
  const programTitle = route.params?.programTitle || 'BEGINNER';

  const [programData, setProgramData] = useState(
    getProgramDataByLevel(programId),
  );
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    setProgramData(getProgramDataByLevel(programId));
    setSelectedDayIndex(0);
  }, [programId]);

  const currentProgram = programData[selectedDayIndex];
  const workoutType = currentProgram.dayTitle.includes('UPPER')
    ? 'Upper Body'
    : currentProgram.dayTitle.includes('LOWER')
    ? 'Lower Body'
    : 'Full Body';

  const toggleDropdown = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setDropdownOpen(!isDropdownOpen);
  };

  const handleSelectDay = (index: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setSelectedDayIndex(index);
    setDropdownOpen(false);
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
          {/* HEADER: TITLE & CHANGE BUTTON */}
          <View style={styles.headerRow}>
            <Text style={styles.pageTitle}>{programTitle} PROGRAM</Text>
            <TouchableOpacity
              style={styles.changeButton}
              onPress={() => navigation.navigate('WorkoutPrograms')}
            >
              <Text style={styles.changeButtonText}>CHANGE</Text>
            </TouchableOpacity>
          </View>

          {/* --- DROPDOWN AREA (Expandable) --- */}
          <View style={styles.dropdownWrapper}>
            <TouchableOpacity
              style={[
                styles.dropdownHeader,
                isDropdownOpen && styles.dropdownHeaderOpen, // Ubah radius bawah kalau dibuka
              ]}
              activeOpacity={0.9}
              onPress={toggleDropdown}
            >
              <View style={{ alignItems: 'center' }}>
                <Text style={styles.dropdownTitle}>
                  {currentProgram.dayTitle}
                </Text>
                <Text style={styles.dropdownSubtitle}>
                  {currentProgram.subtitle}
                </Text>
              </View>
              <ChevronDownIcon isOpen={isDropdownOpen} />
            </TouchableOpacity>

            {isDropdownOpen && (
              <View style={styles.dropdownListContainer}>
                <ScrollView
                  nestedScrollEnabled={true}
                  style={{ maxHeight: 200 }}
                >
                  {programData.map((item, index) => (
                    <TouchableOpacity
                      key={item.id}
                      style={[
                        styles.dropdownItem,
                        index === selectedDayIndex && styles.dropdownItemActive,
                      ]}
                      onPress={() => handleSelectDay(index)}
                    >
                      <Text
                        style={[
                          styles.dropdownItemText,
                          index === selectedDayIndex &&
                            styles.dropdownItemTextActive,
                        ]}
                      >
                        {item.dayTitle}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>

          {/* SECTIONS */}
          <ProgramSection
            title="WARM UP"
            data={currentProgram.warmUp}
            workoutCategory={workoutType}
          />
          <ProgramSection
            title="WORKOUT"
            data={currentProgram.exercises}
            workoutCategory={workoutType}
          />
          <ProgramSection
            title="COOL DOWN"
            data={currentProgram.coolDown}
            workoutCategory={workoutType}
          />

          {/* Spacer Bawah */}
          {/* <View style={{ height: 180 }} /> */}
        </ScrollView>
      </SafeAreaView>

      <View style={styles.floatingButtonContainer}>
        <PrimaryButton
          label="START"
          onPress={() => console.log('Start Workout')}
        />
      </View>

      {/* Bottom Navigation */}
      <CustomBottomBar />
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    overflow: 'visible',
  },

  // --- Header ---
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

  // --- Dropdown ---
  dropdownWrapper: {
    marginBottom: 30,
    // backgroundColor: 'transparent',
    zIndex: 100,
    position: 'relative',
  },
  dropdownHeader: {
    backgroundColor: '#10486A',
    borderRadius: 15,
    paddingVertical: 15,
    paddingHorizontal: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 30,
    zIndex: 101,
  },
  dropdownHeaderOpen: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  //   dropdownContainer: {
  //     backgroundColor: '#10486A',
  //     borderRadius: 15,
  //     paddingVertical: 15,
  //     paddingHorizontal: 30,
  //     flexDirection: 'row',
  //     justifyContent: 'center',
  //     alignItems: 'center',
  //     gap: 30,
  //     marginBottom: 30,
  //   },
  dropdownTitle: {
    color: '#FFF',
    fontFamily: FONT_FAMILY.MontserratBold,
    fontSize: 18,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  dropdownSubtitle: {
    color: '#8CAAB9',
    fontFamily: FONT_FAMILY.RobotoMedium,
    fontSize: 12,
    textAlign: 'center',
  },
  dropdownListContainer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#F0F8FF',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    paddingVertical: 5,
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: '#10486A',
    zIndex: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  dropdownItemActive: {
    backgroundColor: '#D0EBFC',
  },
  dropdownItemText: {
    fontFamily: FONT_FAMILY.PoppinsMedium,
    fontSize: 14,
    color: '#10486A',
    textAlign: 'center',
  },
  dropdownItemTextActive: {
    fontFamily: FONT_FAMILY.PoppinsBold,
  },

  // --- Section ---
  sectionContainer: {
    marginBottom: 20,
    zIndex: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    color: colors.text,
    fontFamily: FONT_FAMILY.MontserratExtraBold,
    fontSize: 15,
    textTransform: 'uppercase',
  },

  // --- Exercise List ---
  exerciseList: {
    gap: 10,
  },
  exerciseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0A659A',
    borderRadius: 12,
    overflow: 'hidden',
    // height: 60,
    padding: 10,
  },
  exerciseImage: {
    width: 50,
    height: 50,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  exerciseInfo: {
    flex: 1,
    paddingHorizontal: 15,
    justifyContent: 'center',
  },
  exerciseName: {
    color: '#FFF',
    fontFamily: FONT_FAMILY.PoppinsSemiBold,
    fontSize: 14,
    textTransform: 'uppercase',
  },
  exerciseDuration: {
    color: '#8CAAB9',
    fontSize: 10,
    marginTop: 2,
  },
  floatingButtonContainer: {
    position: 'absolute',
    bottom: 80,
    left: 20,
    right: 20,
    zIndex: 10,
    backgroundColor: 'transparent',
  },
});

export default ProgramScreen;
