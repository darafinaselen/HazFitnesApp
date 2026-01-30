import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { FONT_FAMILY } from '../constants/fonts';
import color from '../constants/color';
import BMIScale from './dataInput/BMIScale';
import { BmiLevel } from '../utils/bmiHelper';
import WeightLineChart from '../components/grafik/WeightLineChart';
import { CloseIcon } from './ReportIcons';
import { WeightRecord } from '../types/api';

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
  /** Weight history data from API */
  weightHistory: WeightRecord[];
}

export const WeightChartCard: React.FC<WeightProps> = ({
  current,
  last30Days,
  average,
  weightHistory,
}) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [modalVisible, setModalVisible] = React.useState(false);

  const currentMonthData = useMemo(() => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    // 1. Filter hanya bulan & tahun ini
    const filtered = weightHistory
      .filter(item => {
        const d = new Date(item.date);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // 2. Map ke format chart
    return filtered.map(item => ({
      value: item.weight,
      label: new Date(item.date).getDate().toString().padStart(2, '0'),
    }));
  }, [weightHistory]);

  // Mini Chart: Ambil 7 data terakhir dari bulan ini
  const miniChartData = useMemo(() => {
    return currentMonthData.slice(-7);
  }, [currentMonthData]);

  // Full Chart (Modal): Ambil SEMUA data bulan ini
  const fullChartData = currentMonthData;

  const screenWidth = Dimensions.get('window').width;
  const modalChartWidth = screenWidth - 80;

  return (
    <>
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

          {/* Chart */}
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => setModalVisible(true)}
            style={styles.chartWrapper}
          >
            {/* Tampilkan Chart MINI  */}
            <WeightLineChart data={miniChartData} isMini={true} />

            <Text style={styles.tapText}>Tap chart to expand details</Text>
          </TouchableOpacity>
        </View>
      </ProfileCard>

      {/* --- POP-UP MODAL (FULL SCREEN CHART) --- */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Header Modal */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Weight History</Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeBtn}
              >
                <CloseIcon />
              </TouchableOpacity>
            </View>

            {/* Chart FULL*/}
            <View style={{ height: 320, width: '100%' }}>
              <WeightLineChart
                data={fullChartData}
                isMini={false}
                width={modalChartWidth}
              />
            </View>

            <Text style={styles.modalHint}>
              Swipe left/right to view more history
            </Text>
          </View>
        </View>
      </Modal>
    </>
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
  // chartWrapper: {
  //   marginTop: 10,
  //   backgroundColor: 'transparent',
  // },
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
  chartWrapper: {
    marginTop: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 10,
    // Shadow tipis
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  tapText: {
    textAlign: 'center',
    color: '#ccc',
    fontSize: 10,
    marginTop: 5,
    fontStyle: 'italic',
  },

  // MODAL STYLES
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: FONT_FAMILY.MontserratBold,
    color: color.blue900,
  },
  closeBtn: {
    backgroundColor: '#FF6B6B',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalHint: {
    marginTop: 10,
    textAlign: 'center',
    color: '#999',
    fontSize: 12,
  },
});
