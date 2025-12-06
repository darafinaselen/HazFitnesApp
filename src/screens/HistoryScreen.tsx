import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar } from 'react-native-calendars';
import { useNavigation } from '@react-navigation/native';
import color from '../constants/color';
import { FONT_FAMILY } from '../constants/fonts';
import Svg, { Path } from 'react-native-svg';
import { formatDateToWords } from '../utils/dateHelper';
import { formatDuration } from '../utils/timeHelper';
import { getWeekRange } from '../utils/weekHelper';

const BackArrowIcon = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path
      d="M7.825 13L13.425 18.6L12 20L4 12L12 4L13.425 5.4L7.825 11H20V13H7.825Z"
      fill={color.text}
    />
  </Svg>
);

const PLACEHOLDER_IMG = require('../assets/images/splash.png');

// DATA DUMMY
const WORKOUT_HISTORY = [
  {
    id: '1',
    exerciseName: 'JUMPING JACKS',
    programLabel: 'BEGINNER DAY 1',
    duration: 30,
    calories: 15,
    dateString: '2025-12-08',
    image: PLACEHOLDER_IMG,
  },
  {
    id: '2',
    exerciseName: 'INCLINE PUSHUPS',
    programLabel: 'BEGINNER DAY 1',
    duration: 45,
    calories: 20,
    dateString: '2025-12-08',
    image: PLACEHOLDER_IMG,
  },
  {
    id: '3',
    exerciseName: 'KNEE PUSHUPS',
    programLabel: 'BEGINNER DAY 1',
    duration: 60,
    calories: 25,
    dateString: '2025-12-08',
    image: PLACEHOLDER_IMG,
  },
  {
    id: '4',
    exerciseName: 'COBRA STRETCH',
    programLabel: 'BEGINNER DAY 2',
    duration: 60,
    calories: 10,
    dateString: '2025-12-05',
    image: PLACEHOLDER_IMG,
  },
];

const HistoryScreen = () => {
  const navigation = useNavigation();
  const [selectedDate, setSelectedDate] = useState('');

  const currentWeek = useMemo(() => getWeekRange(selectedDate), [selectedDate]);
  const weeklyHistory = useMemo(() => {
    return WORKOUT_HISTORY.filter(item => {
      const itemDate = new Date(item.dateString);
      return itemDate >= currentWeek.start && itemDate <= currentWeek.end;
    });
  }, [currentWeek]);

  const weeklyStats = useMemo(() => {
    const totalCals = weeklyHistory.reduce(
      (acc, curr) => acc + curr.calories,
      0,
    );
    const totalSeconds = weeklyHistory.reduce(
      (acc, curr) => acc + curr.duration,
      0,
    );

    return {
      totalCals: totalCals,
      totalDurationFormatted: formatDuration(totalSeconds),
      count: weeklyHistory.length,
    };
  }, [weeklyHistory]);

  const filteredHistory = useMemo(() => {
    if (!selectedDate) return WORKOUT_HISTORY;
    return WORKOUT_HISTORY.filter(item => item.dateString === selectedDate);
  }, [selectedDate]);

  const markedDates = useMemo(() => {
    let marks: any = {};
    WORKOUT_HISTORY.forEach(item => {
      marks[item.dateString] = {
        selected: true,
        selectedColor: color.blue900,
      };
    });
    if (selectedDate) {
      marks[selectedDate] = {
        ...marks[selectedDate],
        selected: true,
        selectedColor: color.blue600,
        disableTouchEvent: true,
      };
    }
    return marks;
  }, [selectedDate]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Back Button */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButtonArea}
        >
          <BackArrowIcon />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>HISTORY</Text>
        </View>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Kalender Component */}
        <View style={styles.calendarWrapper}>
          <Calendar
            onDayPress={day => {
              setSelectedDate(day.dateString);
            }}
            markedDates={markedDates}
            theme={{
              backgroundColor: '#ffffff',
              calendarBackground: '#ffffff',
              textSectionTitleColor: '#b6c1cd',
              selectedDayBackgroundColor: '#00adf5',
              selectedDayTextColor: '#ffffff',
              todayTextColor: '#00adf5',
              dayTextColor: '#2d4150',
              textDisabledColor: '#d9e1e8',
              arrowColor: 'black',
              monthTextColor: 'black',
              textMonthFontFamily: FONT_FAMILY.MontserratBold,
              textDayFontFamily: FONT_FAMILY.MontserratMedium,
              textDayHeaderFontFamily: FONT_FAMILY.MontserratMedium,
            }}
          />
        </View>

        {/* WEEKLY REPORT CARD */}
        <View style={styles.weeklyCard}>
          {/* Header Ringkasan: Menampilkan Total Exercise, Waktu, & Kalori */}
          <View style={styles.weeklyHeader}>
            <View>
              <Text style={styles.weekRangeTitle}>{currentWeek.label}</Text>
              <Text style={styles.weekSubTitle}>
                {weeklyStats.count} Exercises
              </Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.statValueSmall}>
                {weeklyStats.totalDurationFormatted}
              </Text>
              <Text style={styles.statValueSmall}>
                {weeklyStats.totalCals} Kcal
              </Text>
            </View>
          </View>

          {/* List Kartu Latihan */}
          <View style={styles.cardList}>
            {weeklyHistory.length > 0 ? (
              weeklyHistory.map(item => (
                <View key={item.id} style={styles.historyItem}>
                  <Image
                    source={item.image}
                    style={styles.historyImagePlaceholder}
                  />

                  <View style={styles.historyInfo}>
                    {/* Judul Utama: Nama Gerakan */}
                    <Text style={styles.exerciseName}>{item.exerciseName}</Text>
                    {/* Sub Judul: Nama Program & Day */}
                    <Text style={styles.programLabel}>{item.programLabel}</Text>

                    {/* Stats Per Gerakan */}
                    <Text style={styles.cardStats}>
                      {formatDuration(item.duration)} | {item.calories} Kcal
                    </Text>
                  </View>

                  <Text style={styles.historyDateRight}>
                    {formatDateToWords(item.dateString)
                      .split(' ')
                      .slice(0, 2)
                      .join(' ')}
                  </Text>
                </View>
              ))
            ) : (
              <Text style={styles.noDataText}>No workout this week.</Text>
            )}
          </View>
        </View>

        <View style={{ height: 50 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#EFEFEF' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#EFEFEF',
  },
  backButtonArea: { zIndex: 10, padding: 5 },
  titleContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontFamily: FONT_FAMILY.MontserratBold,
    color: color.text,
    textTransform: 'uppercase',
  },
  placeholder: {
    width: 24,
  },
  content: { padding: 20 },
  calendarWrapper: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 10,
    marginBottom: 20,
    elevation: 3,
  },
  historyList: { marginTop: 10 },
  historyDateTitle: {
    fontSize: 16,
    fontFamily: FONT_FAMILY.MontserratBold,
    color: color.blue900,
    marginBottom: 10,
  },
  weeklyCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    marginBottom: 20,
  },
  weeklyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    paddingBottom: 15,
  },
  weekRangeTitle: {
    fontSize: 16,
    fontFamily: FONT_FAMILY.MontserratBold,
    color: color.blue900,
    marginBottom: 4,
  },
  weekSubTitle: {
    fontSize: 12,
    fontFamily: FONT_FAMILY.MontserratMedium,
    color: '#A2A6AB',
  },
  statValueSmall: {
    fontSize: 12,
    fontFamily: FONT_FAMILY.MontserratMedium,
    color: '#A2A6AB',
    textAlign: 'right',
    marginBottom: 2,
  },
  cardList: { gap: 10 },
  historyItem: {
    backgroundColor: color.blue900,
    borderRadius: 12,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  historyImagePlaceholder: {
    width: 50,
    height: 50,
    backgroundColor: '#DDD',
    borderRadius: 8,
    marginRight: 15,
  },
  historyInfo: { flex: 1 },
  exerciseName: {
    color: '#FFFFFF',
    fontFamily: FONT_FAMILY.MontserratBold,
    fontSize: 13,
    marginBottom: 2,
    textTransform: 'uppercase',
  },
  programLabel: {
    color: '#DDFE06',
    fontFamily: FONT_FAMILY.MontserratMedium,
    fontSize: 10,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  cardStats: { color: '#A2A6AB', fontSize: 11 },
  historyDateRight: { color: '#A2A6AB', fontSize: 12 },
  noDataText: {
    color: '#A2A6AB',
    fontFamily: FONT_FAMILY.MontserratMedium,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default HistoryScreen;
