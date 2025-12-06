import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Svg, { Path } from 'react-native-svg';
import color from '../constants/color';
import { FONT_FAMILY } from '../constants/fonts';
import { getDaysInMonth } from '../utils/monthHelper';

const BackIcon = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path
      d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"
      fill={color.blue900}
    />
  </Svg>
);
const LeftArrow = () => (
  <Svg width="15" height="30" viewBox="0 0 15 30" fill="none">
    <Path
      d="M11.935 8.22481L10.6088 6.89981L3.38502 14.1211C3.26857 14.2368 3.17616 14.3744 3.1131 14.5259C3.05004 14.6775 3.01758 14.84 3.01758 15.0042C3.01758 15.1683 3.05004 15.3309 3.1131 15.4824C3.17616 15.634 3.26857 15.7716 3.38502 15.8873L10.6088 23.1123L11.9338 21.7873L5.15377 15.0061L11.935 8.22481Z"
      fill="#0B2D46"
    />
  </Svg>
);

const RightArrow = () => (
  <Svg width="9" height="17" viewBox="0 0 9 17" fill="none">
    <Path
      d="M4.19617e-05 1.3249L1.32629 -9.53674e-05L8.55004 7.22115C8.66649 7.33686 8.7589 7.47446 8.82196 7.62602C8.88502 7.77758 8.91748 7.94012 8.91748 8.10428C8.91748 8.26844 8.88502 8.43097 8.82196 8.58254C8.7589 8.7341 8.66649 8.87169 8.55004 8.9874L1.32629 16.2124L0.00129128 14.8874L6.78129 8.10615L4.19617e-05 1.3249Z"
      fill="#0B2D46"
    />
  </Svg>
);

const WeightHistoryScreen = () => {
  const navigation = useNavigation();

  // State
  const [weight, setWeight] = useState('0');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewDate, setViewDate] = useState(new Date());

  const daysInMonth = useMemo(
    () => getDaysInMonth(viewDate.getMonth(), viewDate.getFullYear()),
    [viewDate],
  );

  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (flatListRef.current && daysInMonth.length > 0) {
      const index = daysInMonth.findIndex(
        d => d.dayNumber === selectedDate.getDate(),
      );
      if (index !== -1) {
        // Simple timeout to ensure layout is ready
        setTimeout(() => {
          flatListRef.current?.scrollToIndex({
            index,
            animated: true,
            viewPosition: 0.5,
          });
        }, 500);
      }
    }
  }, [daysInMonth, selectedDate]);

  // Handlers
  const changeMonth = (direction: number) => {
    const newDate = new Date(viewDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setViewDate(newDate);
  };

  const headerDateString = viewDate
    .toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    .toUpperCase();

  const isSameDay = (d1: Date, d2: Date) => {
    return (
      d1.getDate() === d2.getDate() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getFullYear() === d2.getFullYear()
    );
  };

  const isToday = (d: Date) => {
    const today = new Date();
    return isSameDay(d, today);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <BackIcon />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>WEIGHT</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Month Navigation */}
      <View style={styles.dateNav}>
        <TouchableOpacity
          onPress={() => changeMonth(-1)}
          style={styles.arrowArea}
        >
          <LeftArrow />
        </TouchableOpacity>
        <Text style={styles.dateTitle}>{headerDateString}</Text>
        <TouchableOpacity
          onPress={() => changeMonth(1)}
          style={styles.arrowArea}
        >
          <RightArrow />
        </TouchableOpacity>
      </View>

      {/* Horizontal Date Strip */}
      <View style={styles.calendarStrip}>
        <FlatList
          ref={flatListRef}
          data={daysInMonth}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={item => item.dateObj.toString()}
          contentContainerStyle={{ paddingHorizontal: 15 }}
          onScrollToIndexFailed={() => {}}
          renderItem={({ item }) => {
            const isSelected = isSameDay(item.dateObj, selectedDate);
            const isDayToday = isToday(item.dateObj);

            return (
              <TouchableOpacity
                style={[
                  styles.dayBox,
                  isSelected && styles.activeDayBox,
                  !isSelected && isDayToday && styles.todayBorder,
                ]}
                onPress={() => {
                  setSelectedDate(item.dateObj);
                  if (item.dateObj.getMonth() !== viewDate.getMonth()) {
                    setViewDate(item.dateObj);
                  }
                }}
              >
                <Text
                  style={[styles.dayText, isSelected && styles.activeDayText]}
                >
                  {isDayToday ? 'Today' : item.dayName}
                </Text>
                <Text
                  style={[styles.dateText, isSelected && styles.activeDayText]}
                >
                  {item.dayNumber}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {/* Weight Input */}
      <View style={styles.weightDisplay}>
        {weight === '' && <Text style={styles.weightPlaceholder}>0</Text>}
        <TextInput
          style={styles.weightInput}
          value={weight}
          onChangeText={text => {
            if (text === '' || /^\d*\.?\d*$/.test(text)) {
              setWeight(text);
            }
          }}
          keyboardType="numeric"
          maxLength={5} // e.g. 100.5
          placeholderTextColor={color.blue900}
        />
        <View style={styles.unitBadge}>
          <Text style={styles.unitText}>KG</Text>
        </View>
      </View>

      {/* Bottom Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.discardButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.discardText}>DISCARD</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.submitButton}
          onPress={() => {
            console.log(
              `Saved: ${weight} KG for ${selectedDate.toDateString()}`,
            );
            navigation.goBack();
          }}
        >
          <Text style={styles.submitText}>SUBMIT</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: FONT_FAMILY.MontserratBold,
    color: color.blue900,
    textTransform: 'uppercase',
  },

  // Date Nav
  dateNav: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  dateTitle: {
    fontSize: 16,
    fontFamily: FONT_FAMILY.MontserratBold,
    color: '#000',
    marginHorizontal: 20,
    width: 100,
    textAlign: 'center',
  },
  arrowArea: { padding: 10 },
  navArrow: { fontSize: 24, color: color.blue900, fontWeight: 'bold' },

  // Calendar Strip
  calendarStrip: {
    height: 80, // Fixed height for strip
    marginBottom: 30,
  },
  dayBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 12,
    width: 60,
    height: 75,
    marginRight: 10, // Spacing between items
    backgroundColor: '#FFF',
  },
  activeDayBox: {
    backgroundColor: '#87CEEB', // Sky blue
    borderColor: '#87CEEB',
  },
  todayBorder: {
    borderColor: color.blue900, // Show outline for Today if not selected
    borderWidth: 1.5,
  },
  dayText: {
    fontSize: 11,
    color: '#A2A6AB',
    marginBottom: 4,
    fontFamily: FONT_FAMILY.MontserratMedium,
  },
  dateText: {
    fontSize: 18,
    color: '#A2A6AB',
    fontFamily: FONT_FAMILY.MontserratBold,
  },
  activeDayText: { color: '#FFF' },

  // Weight Input
  weightDisplay: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    position: 'relative',
  },
  weightPlaceholder: {
    position: 'absolute',
    fontSize: 100,
    fontFamily: FONT_FAMILY.MontserratBold,
    color: color.blue900,
    textAlign: 'center',
    paddingBottom: 20,
    zIndex: -1,
  },
  weightInput: {
    fontSize: 100,
    fontFamily: FONT_FAMILY.MontserratBold,
    color: color.blue900,
    textAlign: 'center',
    minWidth: 150,
    padding: 0, // Remove default padding
  },
  unitBadge: {
    backgroundColor: '#87CEEB',
    paddingHorizontal: 30,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: -10,
  },
  unitText: { fontFamily: FONT_FAMILY.MontserratBold, color: '#10486A' },

  // Buttons
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 30,
    marginBottom: 20,
  },
  discardButton: {
    flex: 1,
    backgroundColor: '#87CEEB',
    padding: 15,
    borderRadius: 30,
    marginRight: 10,
    alignItems: 'center',
  },
  submitButton: {
    flex: 1,
    backgroundColor: '#0095D9',
    padding: 15,
    borderRadius: 30,
    marginLeft: 10,
    alignItems: 'center',
  },
  discardText: { color: '#FFF', fontFamily: FONT_FAMILY.MontserratBold },
  submitText: { color: '#FFF', fontFamily: FONT_FAMILY.MontserratBold },
});

export default WeightHistoryScreen;
