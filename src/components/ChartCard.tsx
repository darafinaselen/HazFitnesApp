import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FONT_FAMILY } from '../constants/fonts';
import { getCurrentWeekDays } from '../utils/dateHelper';
import color from '../constants/color';

const WEEKLY_DATA = [
  { day: 'MON', height: 70, active: false },
  { day: 'TUE', height: 100, active: true },
  { day: 'WED', height: 50, active: false },
  { day: 'THU', height: 60, active: false },
  { day: 'FRI', height: 80, active: false },
  { day: 'SAT', height: 30, active: false },
  { day: 'SUN', height: 40, active: false },
];

interface ChartCardProps {
  title: string;
  subtitle: string;
  subtitleValue: string;
  data: { day: string; height: number; active: boolean }[];
}

export const DailyTargetChartCard: React.FC = () => {
  const navigation = useNavigation<any>();
  const weekData = getCurrentWeekDays();

  return (
    <View style={styles.chartCard}>
      <View style={styles.chartHeader}>
        <Text style={styles.chartTitle}>THIS WEEK</Text>
        <TouchableOpacity onPress={() => navigation.navigate('History')}>
          <Text style={styles.historyLink}>History &gt;</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.dateRow}>
        {weekData.map((item, index) => (
          <View key={index} style={styles.dayWrapper}>
            <Text style={styles.dayText}>{item.dayName}</Text>
            <View
              style={[styles.dateBox, item.isToday && styles.dateBoxActive]}
            >
              <Text
                style={[styles.dateText, item.isToday && styles.dateTextActive]}
              >
                {item.date}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  chartCard: {
    backgroundColor: color.blue900,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 15,
  },
  chartTitle: {
    color: '#FFFFFF',
    fontFamily: FONT_FAMILY.MontserratBold,
    fontSize: 16,
    textTransform: 'uppercase',
  },
  historyLink: {
    color: '#A2A6AB',
    fontFamily: FONT_FAMILY.MontserratMedium,
    fontSize: 12,
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayWrapper: {
    alignItems: 'center',
  },
  dayText: {
    color: '#A2A6AB',
    fontFamily: FONT_FAMILY.MontserratMedium,
    fontSize: 12,
    marginBottom: 5,
  },
  dateBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#A2A6AB',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  dateBoxActive: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FFFFFF',
  },
  dateText: {
    color: '#A2A6AB',
    fontFamily: FONT_FAMILY.MontserratMedium,
    fontSize: 14,
  },
  dateTextActive: {
    color: '#10486A',
    fontFamily: FONT_FAMILY.MontserratBold,
  },
});
