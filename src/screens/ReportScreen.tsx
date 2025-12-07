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

// --- DUMMY DATA (Simulation Database) ---
const USER_DATA = {
  height: 170,
  weightHistory: [
    { date: '2025-11-01', value: 50.5 },
    { date: '2025-11-15', value: 49.8 },
    { date: '2025-12-07', value: 50.0 },
  ],
};

const ReportScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  // --- LOGIC CALCULATOR (Frontend Logic) ---
  const reportData = useMemo(() => {
    // 1. Get Latest Data
    const currentWeight =
      USER_DATA.weightHistory[USER_DATA.weightHistory.length - 1].value;
    const currentHeight = USER_DATA.height;

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
            <SmallStatCard Icon={ClockIcon} value="0" label="MINUTES" />
            <SmallStatCard
              Icon={FireIconCal}
              value="3.115 KCAL"
              label="CAL BURN"
            />
            <SmallStatCard Icon={RunIcon} value="20" label="WORKOUT" />
          </View>

          {/* STATS ROW 2 */}
          <View style={styles.statsRow}>
            <MediumStatCard
              Icon={FootIcon}
              label="STEPS"
              subLabel="0/463 M"
              type="steps"
              progress={0.4}
              onPress={() => navigation.navigate('StepsTracker')}
            />
            <MediumStatCard
              Icon={FireIconStreak}
              label="STREAK"
              subLabel="0 DAYS"
              type="streak"
            />
          </View>

          {/* DAILY TARGET CHART */}
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
