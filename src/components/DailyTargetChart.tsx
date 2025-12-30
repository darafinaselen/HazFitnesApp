import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FONT_FAMILY } from '../constants/fonts';

export interface DailyData {
  day: string;
  value: number;
  target: number;
}

interface Props {
  data: DailyData[];
  unit?: string;
  title?: string;
}

const DailyTargetChart: React.FC<Props> = ({
  data,
  unit = 'Kcal',
  title = 'DAILY TARGET',
}) => {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const achievedDays = data.filter(d => d.value >= d.target).length;

  const getBarColor = (percentage: number) => {
    if (percentage >= 100) return '#DDFE06'; // Hijau Neon (Target Tercapai)
    if (percentage >= 50) return '#FFD700'; // Kuning Emas (Setengah jalan)
    return '#FF8C00'; // Oranye (Masih awal)
  };

  return (
    <View style={styles.chartCard}>
      {/* HEADER */}
      <View style={styles.chartHeader}>
        <View>
          <Text style={styles.chartTitle}>{title}</Text>
          {selectedDay !== null ? (
            <Text style={styles.selectedInfo}>
              {data[selectedDay].day}: {data[selectedDay].value} /{' '}
              {data[selectedDay].target} {unit}
            </Text>
          ) : (
            <Text style={styles.chartSubtitle}>Weekly Progress</Text>
          )}
        </View>

        <View>
          <Text style={styles.chartSubtitleRight}>CONSISTENCY</Text>
          <Text style={styles.chartSubtitleValue}>
            {achievedDays}/{data.length} DAYS
          </Text>
        </View>
      </View>

      {/* CHART AREA */}
      <View style={styles.barChartContainer}>
        {data.map((item, index) => {
          let heightPercent = (item.value / item.target) * 100;
          let visualHeight = heightPercent;
          if (visualHeight > 100) visualHeight = 100;
          if (visualHeight < 10) visualHeight = 10;

          const barColor = getBarColor(heightPercent);

          return (
            <TouchableOpacity
              key={index}
              style={styles.barWrapper}
              activeOpacity={0.7}
              onPress={() => setSelectedDay(index)}
            >
              {/* TRACK (Wadah Target) */}
              <View style={styles.barTrack}>
                {/* FILL (Pencapaian User) */}
                <View
                  style={[
                    styles.bar,
                    {
                      height: `${visualHeight}%`,
                      backgroundColor: barColor,
                    },
                    selectedDay === index && styles.barSelected,
                  ]}
                />
              </View>
              <Text
                style={[
                  styles.barLabel,
                  selectedDay === index && {
                    color: '#FFF',
                    fontWeight: 'bold',
                  },
                ]}
              >
                {item.day}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  chartCard: {
    backgroundColor: '#10486A',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  chartTitle: {
    color: '#FFFFFF',
    fontFamily: FONT_FAMILY.MontserratBold,
    fontSize: 18,
    textTransform: 'uppercase',
  },
  selectedInfo: {
    color: '#DDFE06',
    fontFamily: FONT_FAMILY.MontserratMedium,
    fontSize: 12,
    marginTop: 2,
  },
  chartSubtitle: {
    color: '#8CAAB9',
    fontFamily: FONT_FAMILY.MontserratMedium,
    fontSize: 10,
    marginTop: 2,
  },
  chartSubtitleRight: {
    color: '#8CAAB9',
    fontFamily: FONT_FAMILY.MontserratMedium,
    fontSize: 10,
    textAlign: 'right',
  },
  chartSubtitleValue: {
    color: '#FFFFFF',
    fontFamily: FONT_FAMILY.MontserratBold,
    fontSize: 14,
    textAlign: 'right',
  },
  barChartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 120,
  },
  barWrapper: {
    alignItems: 'center',
    gap: 8,
    flex: 1,
    height: '100%',
    justifyContent: 'flex-end',
  },
  // Style Track (Background Bar)
  barTrack: {
    height: '100%',
    width: 18,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 10,
    overflow: 'hidden',
  },
  bar: {
    width: '100%',
    borderRadius: 10,
  },
  barSelected: {
    borderWidth: 1,
    borderColor: '#FFF',
  },
  barLabel: {
    color: '#8CAAB9',
    fontSize: 10,
    fontFamily: FONT_FAMILY.MontserratMedium,
  },
});

export default DailyTargetChart;
