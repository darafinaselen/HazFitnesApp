import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { FONT_FAMILY } from '../constants/fonts';
import color from '../constants/color';
import BMIScale from './dataInput/BMIScale';
import { BmiLevel } from '../utils/bmiHelper';

// --- SHARED WRAPPER ---
const ProfileCard: React.FC<{
  title: string;
  onEdit?: () => void;
  children: React.ReactNode;
}> = ({ title, onEdit, children }) => (
  <View style={styles.profileCard}>
    <View style={styles.profileCardHeader}>
      <Text style={styles.profileCardTitle}>{title}</Text>
      {onEdit && (
        <TouchableOpacity onPress={onEdit}>
          <Text style={styles.profileCardEdit}>Edit &gt;</Text>
        </TouchableOpacity>
      )}
    </View>
    {children}
  </View>
);

// --- 1. WEIGHT CHART CARD ---
interface WeightProps {
  current: string;
  last30Days: string;
  average: string;
}

export const WeightChartCard: React.FC<WeightProps> = ({
  current,
  last30Days,
  average,
}) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  return (
    <ProfileCard
      title="WEIGHT (KG)"
      onEdit={() => navigation.navigate('WeightHistory')}
    >
      <View style={styles.weightContent}>
        <Text style={styles.weightValue}>{current}</Text>
        <View style={styles.weightStats}>
          <View style={styles.statCol}>
            <Text style={styles.weightValueSmall}>{current}</Text>
            <Text style={styles.weightLabel}>Current Weight</Text>
          </View>
          <View style={styles.statCol}>
            <Text style={[styles.weightValueSmall, { color: '#FF8C00' }]}>
              {last30Days}
            </Text>
            <Text style={styles.weightLabel}>Last 30 Days</Text>
          </View>
          <View style={styles.statCol}>
            <Text style={styles.weightValueSmall}>{average}</Text>
            <Text style={styles.weightLabel}>Average</Text>
          </View>
        </View>

        {/* Placeholder Chart */}
        <View style={styles.chartPlaceholder}>
          <Text style={styles.chartPlaceholderText}>
            Weight Chart Visualization
          </Text>
        </View>
      </View>
    </ProfileCard>
  );
};

// --- 2. HEIGHT CHART CARD ---
interface HeightProps {
  value: string;
  onEdit?: () => void;
}
export const HeightChartCard: React.FC<HeightProps> = ({ value, onEdit }) => {
  return (
    <ProfileCard title="HEIGHT (CM)" onEdit={onEdit}>
      <View style={styles.heightContent}>
        <Text style={styles.heightLabel}>Current Height</Text>
        <Text style={styles.heightValue}>{value} CM</Text>
      </View>
    </ProfileCard>
  );
};

// --- 3. BMI CHART CARD ---
interface BMIProps {
  value: string;
  level: BmiLevel;
}

export const BMIChartCard: React.FC<BMIProps> = ({ value, level }) => {
  const getLevelColor = (lvl: string) => {
    switch (lvl) {
      case 'Underweight':
        return '#3498db';
      case 'Normal':
        return '#2ecc71';
      case 'Overweight':
        return '#f39c12';
      case 'Obese':
        return '#e74c3c';
      default:
        return '#DDFE06';
    }
  };
  return (
    <ProfileCard title="BMI">
      <View style={styles.bmiContent}>
        <View style={styles.whiteCardWrapper}>
          <BMIScale level={level} />
        </View>
        <Text style={styles.bmiInfoText}>
          Your BMI is{' '}
          <Text style={{ fontWeight: 'bold', color: '#FFF' }}>{value}</Text>{' '}
          which is Considered{' '}
          <Text style={{ fontWeight: 'bold', color: getLevelColor(level) }}>
            {level}
          </Text>
        </Text>
      </View>
    </ProfileCard>
  );
};

const styles = StyleSheet.create({
  profileCard: {
    backgroundColor: color.blue900,
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
    overflow: 'hidden',
  },
  profileCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  profileCardTitle: {
    color: '#FFFFFF',
    fontFamily: FONT_FAMILY.MontserratBold,
    fontSize: 18,
    textTransform: 'uppercase',
  },
  profileCardEdit: {
    color: '#A2A6AB',
    fontFamily: FONT_FAMILY.MontserratMedium,
    fontSize: 12,
  },
  weightContent: { paddingBottom: 10 },
  weightStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  statCol: { alignItems: 'center' },
  weightValue: {
    color: '#FFFFFF',
    fontFamily: FONT_FAMILY.MontserratBold,
    fontSize: 24,
    marginBottom: 10,
  },
  weightValueSmall: {
    color: '#FFFFFF',
    fontFamily: FONT_FAMILY.MontserratBold,
    fontSize: 16,
    marginBottom: 2,
  },
  weightLabel: {
    color: '#A2A6AB',
    fontFamily: FONT_FAMILY.MontserratMedium,
    fontSize: 10,
  },
  chartPlaceholder: {
    height: 120,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartPlaceholderText: { color: '#8CAAB9', fontSize: 12 },
  heightContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heightLabel: {
    color: '#A2A6AB',
    fontFamily: FONT_FAMILY.MontserratMedium,
    fontSize: 14,
  },
  heightValue: {
    color: '#E0FE10',
    fontFamily: FONT_FAMILY.MontserratRegular,
    fontSize: 16,
  },
  // --- BMI Styles ---
  bmiContent: { paddingTop: 0 },
  whiteCardWrapper: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
  },
  bmiInfoText: {
    fontFamily: FONT_FAMILY.MontserratMedium,
    fontSize: 12,
    color: '#5A7585',
    textAlign: 'center',
    marginTop: 10,
  },
});
