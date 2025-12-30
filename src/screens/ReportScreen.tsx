import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { FONT_FAMILY } from '../constants/fonts';
import color from '../constants/color';
import CustomBottomBar from '../components/CustomBottomBar';
import {
  BackIcon,
  ClockIcon,
  RunIcon,
  FootIcon,
  FireIconCal,
  FireIconStreak,
} from '../components/ReportIcons';
import { SmallStatCard, MediumStatCard } from '../components/StatCards';
import { DailyTargetChartCard } from '../components/ChartCard';
import {
  WeightChartCard,
  HeightChartCard,
  BMIChartCard,
} from '../components/ReportCharts';
import { calculateBMI, BmiLevel } from '../utils/bmiHelper';
import { DailyData } from '../components/DailyTargetChart';

// --- DUMMY DATA (Simulation Database) ---
const USER_DATA = {
  user: {
    name: 'MEECHEL BERNANDO',
    minutes: 45, // Total menit workout hari ini
    calories: 3115, // Total kalori hari ini
    workoutCount: 20, // Total workout yang sudah selesai
    height: 170,
  },
  steps: {
    current: 2500, // Langkah hari ini
    target: 5000, // Target langkah harian
  },
  streak: {
    days: 4, // Streak aktif saat ini (4 hari)
  },
  weightHistory: [
    { date: '2025-11-01', value: 50.5 },
    { date: '2025-11-15', value: 49.8 },
    { date: '2025-12-07', value: 50.0 },
  ],
  // Data Chart: Value (Total Kalori Harian) vs Target (dari AI)
  weeklyHistory: [
    { day: 'SUN', value: 1200, target: 2000 }, // value dalam Kcal
    { day: 'MON', value: 2100, target: 2000 },
    { day: 'TUE', value: 2500, target: 2200 }, // Target naik
    { day: 'WED', value: 1000, target: 2200 }, // Masih dikit
    { day: 'THU', value: 1800, target: 2200 },
    { day: 'FRI', value: 2300, target: 2200 },
    { day: 'SAT', value: 500, target: 2200 },
  ] as DailyData[],
};

const ReportScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  // --- LOGIC CALCULATOR (Frontend Logic) ---
  const reportData = useMemo(() => {
    // 1. Get Latest Data
    const currentWeight =
      USER_DATA.weightHistory[USER_DATA.weightHistory.length - 1].value;
    const currentHeight = USER_DATA.user.height;

    // 2. Calculate BMI
    const bmiResult = calculateBMI(currentWeight, currentHeight);
    const safeBmiValue = bmiResult ? bmiResult.bmiValue.toFixed(1) : '0.0';
    const safeBmiLevel: BmiLevel = bmiResult ? bmiResult.level : 'Normal';

    // 3. Calculate Average Weight
    const totalWeight = USER_DATA.weightHistory.reduce(
      (sum, item) => sum + item.value,
      0,
    );
    const avgWeight = (totalWeight / USER_DATA.weightHistory.length).toFixed(2);

    // 4. Calculate 30-Day Difference
    const firstWeight = USER_DATA.weightHistory[0].value;
    const diff = (currentWeight - firstWeight).toFixed(1);

    return {
      weight: {
        current: currentWeight.toFixed(2),
        average: avgWeight,
        diff: diff,
        history: USER_DATA.weightHistory,
      },
      height: currentHeight.toString(),
      bmi: {
        value: safeBmiValue,
        level: safeBmiLevel,
      },
    };
  }, []);

  return (
    <View style={styles.mainContainer}>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor={color.blue900} />

        <View style={styles.headerTitleContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <BackIcon />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>YOUR REPORT</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* STATS ROW 1 */}
          <View style={styles.statsRow}>
            <SmallStatCard
              Icon={ClockIcon}
              value={`${USER_DATA.user.minutes}`}
              label="MINUTES"
            />
            <SmallStatCard
              Icon={FireIconCal}
              value={`${(USER_DATA.user.calories / 1000).toFixed(1)}K KCAL`}
              label="CAL BURN"
            />
            <SmallStatCard
              Icon={RunIcon}
              value={`${USER_DATA.user.workoutCount}`}
              label="WORKOUT"
            />
          </View>

          {/* STATS ROW 2 */}
          <View style={styles.statsRow}>
            <MediumStatCard
              Icon={FootIcon}
              label="STEPS"
              subLabel={`${USER_DATA.steps.current}/${USER_DATA.steps.target} M`}
              type="steps"
              currentSteps={USER_DATA.steps.current}
              targetSteps={USER_DATA.steps.target}
              onPress={() => navigation.navigate('StepsTracker')}
            />
            <MediumStatCard
              Icon={FireIconStreak}
              label="STREAK"
              subLabel={`${USER_DATA.streak.days} DAYS`}
              type="streak"
              streakDays={USER_DATA.streak.days}
            />
          </View>

          <DailyTargetChartCard />
          <WeightChartCard
            current={reportData.weight.current}
            last30Days={reportData.weight.diff}
            average={reportData.weight.average}
          />
          <HeightChartCard
            value={reportData.height}
            onEdit={() =>
              navigation.navigate('HeightInput', {
                currentHeight: reportData.height,
              })
            }
          />

          <BMIChartCard
            value={reportData.bmi.value}
            level={reportData.bmi.level}
          />

          <View style={{ height: 100 }} />
        </ScrollView>
      </SafeAreaView>
      <CustomBottomBar />
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  headerTitleContainer: {
    marginTop: 20,
    paddingVertical: 15,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    color: color.blue900,
    fontFamily: FONT_FAMILY.MontserratBold,
    fontSize: 20,
    textTransform: 'uppercase',
  },
  scrollContent: {
    padding: 20,
    backgroundColor: '#F5F7FA',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
    paddingTop: 40,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    gap: 8,
  },
});

export default ReportScreen;
