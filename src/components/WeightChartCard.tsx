import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { FONT_FAMILY } from '../constants/fonts';
import color from '../constants/color';

// --- INTERFACE DATA ---
interface WeightDataPoint {
  day: string; // "07", "08"
  value: number; // 50.1, 49.8
}

interface WeightChartProps {
  currentWeight: string; // "50.00"
  last30DaysChange: string; // "0.0" atau "-1.5"
  averageWeight: string; // "50.00"
  chartData?: WeightDataPoint[]; // Data untuk grafik
}

const WeightChartCard: React.FC<WeightChartProps> = ({
  currentWeight = '0.00',
  last30DaysChange = '0.0',
  averageWeight = '0.00',
  chartData = [],
}) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>WEIGHT (KG)</Text>
        <TouchableOpacity onPress={() => navigation.navigate('WeightHistory')}>
          <Text style={styles.editLink}>Edit &gt;</Text>
        </TouchableOpacity>
      </View>

      {/* Top Stats (Dinamis dari Props) */}
      <View style={styles.statsContainer}>
        {/* Current */}
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{currentWeight}</Text>
          <Text style={styles.statLabel}>Current Weight</Text>
        </View>

        {/* Last 30 Days */}
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            <Text style={{ color: '#FF8C00' }}>{last30DaysChange}</Text>
          </Text>
          <Text style={styles.statLabel}>Last 30 Days</Text>
        </View>

        {/* Average */}
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{averageWeight}</Text>
          <Text style={styles.statLabel}>Average</Text>
        </View>
      </View>

      {/* Chart Container */}
      <View style={styles.chartContainer}>
        <View style={styles.yAxis}>
          <Text style={styles.axisText}>50,3</Text>
          <Text style={styles.axisText}>50,1</Text>
          <Text style={styles.axisText}>49,9</Text>
          <Text style={styles.axisText}>49,7</Text>
          <Text style={styles.axisText}>49,5</Text>
        </View>

        {/* Chart Area */}
        <View style={styles.chartArea}>
          <View style={styles.dashedLine} />
          <View style={styles.pointWrapper}>
            <View style={styles.pointLabel}>
              <Text style={styles.pointText}>{currentWeight}</Text>
            </View>
            <View style={styles.pointDot} />
          </View>
        </View>

        {/* X-Axis Labels (Tanggal) */}
        <View style={styles.xAxis}>
          {['07', '08', '09', '10', '11', '12', '13'].map((d, i) => (
            <Text key={i} style={styles.axisText}>
              {d}
            </Text>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: color.blue900,
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  title: {
    color: '#FFFFFF',
    fontFamily: FONT_FAMILY.MontserratBold,
    fontSize: 18,
    textTransform: 'uppercase',
  },
  editLink: {
    color: '#A2A6AB',
    fontFamily: FONT_FAMILY.MontserratMedium,
    fontSize: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statItem: { alignItems: 'center' },
  statValue: {
    color: '#FFFFFF',
    fontFamily: FONT_FAMILY.MontserratBold,
    fontSize: 20,
    marginBottom: 4,
  },
  statLabel: {
    color: '#A2A6AB',
    fontFamily: FONT_FAMILY.MontserratMedium,
    fontSize: 10,
  },
  chartContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 15,
    height: 200,
    justifyContent: 'space-between',
  },
  yAxis: {
    position: 'absolute',
    left: 10,
    top: 15,
    bottom: 30,
    justifyContent: 'space-between',
    zIndex: 1,
  },
  axisText: {
    color: '#A2A6AB',
    fontSize: 10,
    fontFamily: FONT_FAMILY.MontserratMedium,
  },
  chartArea: {
    flex: 1,
    marginLeft: 30,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dashedLine: {
    width: '100%',
    height: 1,
    borderWidth: 1,
    borderColor: '#7B9EFA',
    borderStyle: 'dashed',
    position: 'absolute',
  },
  pointWrapper: { alignItems: 'center' },
  pointLabel: {
    backgroundColor: '#5A6372',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginBottom: 4,
  },
  pointText: { color: '#FFF', fontSize: 10 },
  pointDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#7B9EFA',
    backgroundColor: '#FFF',
  },
  xAxis: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 30,
  },
});

export default WeightChartCard;
