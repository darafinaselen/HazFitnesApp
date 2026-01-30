import React, { useMemo, useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
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
import { BmiLevel } from '../utils/bmiHelper';
import { DailyData } from '../components/DailyTargetChart';
import { statisticsService } from '../services/api';
import { ReportResponse, BmiStatus, WeightRecord } from '../types/api';
import PremiumGate from '../components/PremiumGate';

// --- DEFAULT DATA (Fallback when API fails) ---
const DEFAULT_DATA = {
  user: {
    minutes: 0,
    calories: 0,
    workoutCount: 0,
    height: 170,
  },
  steps: {
    current: 0,
    target: 5000,
  },
  streak: {
    days: 0,
  },
  weight: {
    current: 0,
    change: 0,
    average: 0,
  },
  height: {
    current: 170,
  },
  bmi: {
    value: 0,
    status: 'Normal' as BmiStatus,
  },
};

const ReportScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  // --- STATE ---
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reportData, setReportData] = useState<ReportResponse | null>(null);

  // --- FETCH DATA FROM API ---
  const fetchReportData = useCallback(async (showRefresh = false) => {
    try {
      if (showRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setError(null);

      const response = await statisticsService.getReport();

      if (response.success && response.data) {
        setReportData(response.data);
      } else {
        setError('Failed to load report data');
      }
    } catch (err: any) {
      console.error('[ReportScreen] Error fetching report:', err);
      setError(err.response?.data?.message || 'Failed to load report data');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // --- INITIAL LOAD ---
  useEffect(() => {
    fetchReportData();
  }, [fetchReportData]);

  // --- HANDLE REFRESH ---
  const onRefresh = useCallback(() => {
    fetchReportData(true);
  }, [fetchReportData]);

  // --- COMPUTED DATA ---
  const displayData = useMemo(() => {
    if (!reportData) {
      return {
        summary: DEFAULT_DATA.user,
        steps: DEFAULT_DATA.steps,
        streak: DEFAULT_DATA.streak.days,
        weight: {
          current: DEFAULT_DATA.weight.current.toFixed(2),
          average: DEFAULT_DATA.weight.average.toFixed(2),
          diff: DEFAULT_DATA.weight.change.toFixed(1),
        },
        height: DEFAULT_DATA.height.current.toString(),
        bmi: {
          value: DEFAULT_DATA.bmi.value.toFixed(1),
          level: DEFAULT_DATA.bmi.status as BmiLevel,
        },
      };
    }

    return {
      summary: {
        minutes: reportData.summary.minutes,
        calories: reportData.summary.calories,
        workoutCount: reportData.summary.workoutCount,
      },
      steps: {
        current: reportData.steps.current,
        target: reportData.steps.target,
      },
      streak: reportData.streak.current,
      weight: {
        current: reportData.weight.current.toFixed(2),
        average: reportData.weight.average.toFixed(2),
        diff: reportData.weight.change.toFixed(1),
      },
      height: reportData.height.current.toString(),
      bmi: {
        value: reportData.bmi.value.toFixed(1),
        level: reportData.bmi.status as BmiLevel,
      },
    };
  }, [reportData]);

  // --- LOADING STATE ---
  if (isLoading) {
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
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={color.primary} />
            <Text style={styles.loadingText}>Loading report...</Text>
          </View>
        </SafeAreaView>
        <CustomBottomBar />
      </View>
    );
  }

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

        {/* Premium Gate - Locks the report content for non-premium users */}
        <PremiumGate
          app="EXERCISE"
          onUpgradePress={() => navigation.navigate('Premium' as any)}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={onRefresh}
                colors={[color.primary]}
                tintColor={color.primary}
              />
            }
          >
            {/* ERROR BANNER */}
            {error && (
              <View style={styles.errorBanner}>
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity onPress={() => fetchReportData()}>
                  <Text style={styles.retryText}>Tap to retry</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* STATS ROW 1 */}
            <View style={styles.statsRow}>
              <SmallStatCard
                Icon={ClockIcon}
                value={`${displayData.summary.minutes}`}
                label="MINUTES"
              />
              <SmallStatCard
                Icon={FireIconCal}
                value={`${(displayData.summary.calories / 1000).toFixed(
                  1,
                )}K KCAL`}
                label="CAL BURN"
              />
              <SmallStatCard
                Icon={RunIcon}
                value={`${displayData.summary.workoutCount}`}
                label="WORKOUT"
              />
            </View>

            {/* STATS ROW 2 */}
            <View style={styles.statsRow}>
              <MediumStatCard
                Icon={FootIcon}
                label="STEPS"
                subLabel={`${displayData.steps.current}/${displayData.steps.target} M`}
                type="steps"
                currentSteps={displayData.steps.current}
                targetSteps={displayData.steps.target}
                onPress={() => navigation.navigate('StepsTracker')}
              />
              <MediumStatCard
                Icon={FireIconStreak}
                label="STREAK"
                subLabel={`${displayData.streak} DAYS`}
                type="streak"
                streakDays={displayData.streak}
              />
            </View>

            <DailyTargetChartCard />
            <WeightChartCard
              current={displayData.weight.current}
              last30Days={displayData.weight.diff}
              average={displayData.weight.average}
              weightHistory={reportData?.weightHistory || []}
            />
            <HeightChartCard
              value={displayData.height}
              onEdit={() =>
                navigation.navigate('HeightInput', {
                  currentHeight: displayData.height,
                })
              }
            />

            <BMIChartCard
              value={displayData.bmi.value}
              level={displayData.bmi.level}
            />

            <View style={{ height: 100 }} />
          </ScrollView>
        </PremiumGate>
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
  // Loading State
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
  },
  loadingText: {
    marginTop: 12,
    fontFamily: FONT_FAMILY.MontserratMedium,
    fontSize: 14,
    color: color.blue900,
  },
  // Error State
  errorBanner: {
    backgroundColor: '#FFEBEE',
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
    alignItems: 'center',
  },
  errorText: {
    fontFamily: FONT_FAMILY.MontserratMedium,
    fontSize: 14,
    color: '#D32F2F',
    textAlign: 'center',
  },
  retryText: {
    marginTop: 8,
    fontFamily: FONT_FAMILY.MontserratBold,
    fontSize: 14,
    color: color.primary,
    textDecorationLine: 'underline',
  },
});

export default ReportScreen;
