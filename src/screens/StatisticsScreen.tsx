import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Modal,
  FlatList,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { FONT_FAMILY } from '../constants/fonts';
import color from '../constants/color';
import WeightLineChart from '../components/grafik/WeightLineChart';
import { BackIcon, ChevronRight } from '../components/profil/ProfileIcons';
import { statisticsService } from '../services/api';
import { WeightRecord } from '../types/api';

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const YEARS = Array.from(new Array(11), (val, index) => 2022 + index);

interface ChartDataPoint {
  value: number;
  label: string;
}

const StatisticsScreen = () => {
  const navigation = useNavigation();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [showYearPicker, setShowYearPicker] = useState(false);

  // --- API STATE ---
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [weightRecords, setWeightRecords] = useState<WeightRecord[]>([]);
  const [summary, setSummary] = useState({
    average: 0,
    highest: 0,
    lowest: 0,
    count: 0,
  });

  // --- FETCH WEIGHT HISTORY ---
  const fetchWeightHistory = useCallback(
    async (showRefresh = false) => {
      try {
        if (showRefresh) {
          setIsRefreshing(true);
        } else {
          setIsLoading(true);
        }
        setError(null);

        const month = currentDate.getMonth() + 1; // API expects 1-12
        const year = currentDate.getFullYear();

        const response = await statisticsService.getWeightHistory({
          month,
          year,
        });

        if (response.success) {
          // Handle both response formats
          const data = response.data as any;
          if (Array.isArray(data)) {
            setWeightRecords(data);
            // Calculate summary from records
            if (data.length > 0) {
              const weights = data.map((r: WeightRecord) => r.weight);
              setSummary({
                average: parseFloat(
                  (
                    weights.reduce((a: number, b: number) => a + b, 0) /
                    weights.length
                  ).toFixed(1),
                ),
                highest: Math.max(...weights),
                lowest: Math.min(...weights),
                count: data.length,
              });
            } else {
              setSummary({ average: 0, highest: 0, lowest: 0, count: 0 });
            }
          } else if (data.records) {
            setWeightRecords(data.records);
            setSummary(
              data.summary || { average: 0, highest: 0, lowest: 0, count: 0 },
            );
          }
        }
      } catch (err: any) {
        console.error('[StatisticsScreen] Error fetching weight history:', err);
        setError(err.response?.data?.message || 'Failed to load weight data');
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [currentDate],
  );

  // --- FETCH ON MOUNT & DATE CHANGE ---
  useEffect(() => {
    fetchWeightHistory();
  }, [fetchWeightHistory]);

  // --- HANDLE REFRESH ---
  const onRefresh = useCallback(() => {
    fetchWeightHistory(true);
  }, [fetchWeightHistory]);

  // --- TRANSFORM DATA FOR CHART ---
  const chartData = useMemo<ChartDataPoint[]>(() => {
    if (weightRecords.length === 0) return [];

    // Sort by date
    const sorted = [...weightRecords].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );

    return sorted.map(record => {
      const day = new Date(record.date).getDate();
      return {
        value: record.weight,
        label: day.toString().padStart(2, '0'),
      };
    });
  }, [weightRecords]);

  // --- HANDLER GANTI BULAN ---
  const handleSelectMonth = (monthIndex: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(monthIndex);
    setCurrentDate(newDate);
    setShowMonthPicker(false);
  };

  const handleSelectYear = (year: number) => {
    const newDate = new Date(currentDate);
    newDate.setFullYear(year);
    setCurrentDate(newDate);
    setShowYearPicker(false);
  };

  const renderPickerModal = (
    visible: boolean,
    data: any[],
    onSelect: (item: any, index: number) => void,
    onClose: () => void,
    title: string,
  ) => (
    <Modal visible={visible} transparent animationType="fade">
      <TouchableOpacity
        style={styles.modalOverlay}
        onPress={onClose}
        activeOpacity={1}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{title}</Text>
          <FlatList
            data={data}
            keyExtractor={item => item.toString()}
            showsVerticalScrollIndicator={false}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                style={styles.modalItem}
                onPress={() => onSelect(item, index)}
              >
                <Text style={styles.modalItemText}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </TouchableOpacity>
    </Modal>
  );

  // --- LOADING STATE ---
  if (isLoading) {
    return (
      <View style={styles.mainContainer}>
        <SafeAreaView style={styles.safeArea}>
          <StatusBar barStyle="dark-content" backgroundColor="#F5F7FA" />
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.iconBtn}
            >
              <BackIcon />
            </TouchableOpacity>
            <Text style={styles.title}>STATISTICS</Text>
            <View style={{ width: 24 }} />
          </View>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={color.primary} />
            <Text style={styles.loadingText}>Loading statistics...</Text>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#F5F7FA" />

        {/* --- HEADER --- */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.iconBtn}
          >
            <BackIcon />
          </TouchableOpacity>
          <Text style={styles.title}>STATISTICS</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
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
              <TouchableOpacity onPress={() => fetchWeightHistory()}>
                <Text style={styles.retryText}>Tap to retry</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.filterRow}>
            {/* MONTH PICKER BUTTON */}
            <TouchableOpacity
              style={styles.dropdownButton}
              onPress={() => setShowMonthPicker(true)}
            >
              <Text style={styles.dropdownText}>
                {MONTHS[currentDate.getMonth()]}
              </Text>
              <View style={{ transform: [{ rotate: '90deg' }] }}>
                <ChevronRight size={14} color={color.blue900} />
              </View>
            </TouchableOpacity>

            {/* YEAR PICKER BUTTON */}
            <TouchableOpacity
              style={styles.dropdownButton}
              onPress={() => setShowYearPicker(true)}
            >
              <Text style={styles.dropdownText}>
                {currentDate.getFullYear()}
              </Text>
              <View style={{ transform: [{ rotate: '90deg' }] }}>
                <ChevronRight size={14} color={color.blue900} />
              </View>
            </TouchableOpacity>
          </View>

          {/* --- CHART SECTION --- */}
          <View style={styles.chartCard}>
            <Text style={styles.cardTitle}>Weight Progress</Text>
            {chartData.length > 0 ? (
              <WeightLineChart
                data={chartData}
                isMini={false}
                width={Dimensions.get('window').width - 80}
              />
            ) : (
              <View style={styles.emptyChartContainer}>
                <Text style={styles.emptyChartText}>
                  No weight data for this month
                </Text>
                <Text style={styles.emptyChartSubtext}>
                  Record your weight to see progress
                </Text>
              </View>
            )}
          </View>

          {/* --- SUMMARY SECTION --- */}
          <Text style={styles.sectionTitle}>Monthly Summary</Text>
          <View style={styles.summaryContainer}>
            <View style={styles.summaryBox}>
              <Text style={styles.summaryLabel}>Average</Text>
              <Text style={styles.summaryValue}>{summary.average} kg</Text>
            </View>
            <View style={styles.summaryBox}>
              <Text style={styles.summaryLabel}>Highest</Text>
              <Text style={styles.summaryValue}>{summary.highest} kg</Text>
            </View>
            <View style={styles.summaryBox}>
              <Text style={styles.summaryLabel}>Lowest</Text>
              <Text style={styles.summaryValue}>{summary.lowest} kg</Text>
            </View>
          </View>
        </ScrollView>
        {/* --- MODALS --- */}
        {renderPickerModal(
          showMonthPicker,
          MONTHS,
          (_, index) => handleSelectMonth(index),
          () => setShowMonthPicker(false),
          'Select Month',
        )}

        {renderPickerModal(
          showYearPicker,
          YEARS,
          item => handleSelectYear(item),
          () => setShowYearPicker(false),
          'Select Year',
        )}
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  safeArea: {
    flex: 1,
  },
  // Loading
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontFamily: FONT_FAMILY.MontserratMedium,
    fontSize: 14,
    color: color.blue900,
  },
  // Error
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
  // Empty Chart
  emptyChartContainer: {
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyChartText: {
    fontFamily: FONT_FAMILY.MontserratMedium,
    fontSize: 14,
    color: '#7B8085',
  },
  emptyChartSubtext: {
    fontFamily: FONT_FAMILY.MontserratRegular,
    fontSize: 12,
    color: '#A0A0A0',
    marginTop: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  iconBtn: {
    padding: 5,
  },
  title: {
    fontSize: 18,
    fontFamily: FONT_FAMILY.MontserratBold,
    color: color.blue900,
    textTransform: 'uppercase',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  // --- STYLE BARU: DROPDOWN ROW ---
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 15,
  },
  dropdownButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  dropdownText: {
    fontSize: 14,
    fontFamily: FONT_FAMILY.MontserratBold,
    color: color.blue900,
  },

  // --- MODAL STYLES ---
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    width: '80%',
    maxHeight: '50%',
    borderRadius: 16,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 16,
    fontFamily: FONT_FAMILY.MontserratBold,
    color: color.blue900,
    marginBottom: 15,
    textAlign: 'center',
  },
  modalItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalItemText: {
    fontSize: 14,
    fontFamily: FONT_FAMILY.MontserratMedium,
    color: '#333',
    textAlign: 'center',
  },

  chartCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 25,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    alignItems: 'center',
    overflow: 'hidden',
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: FONT_FAMILY.MontserratBold,
    color: color.blue900,
    marginBottom: 10,
    alignSelf: 'flex-start',
  },

  sectionTitle: {
    fontSize: 16,
    fontFamily: FONT_FAMILY.MontserratBold,
    color: color.blue900,
    marginBottom: 15,
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryBox: {
    backgroundColor: 'white',
    width: '31%',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  summaryLabel: {
    fontSize: 11,
    color: '#7B8085',
    marginBottom: 5,
    fontFamily: FONT_FAMILY.MontserratMedium,
  },
  summaryValue: {
    fontSize: 15,
    color: color.blue900,
    fontFamily: FONT_FAMILY.MontserratBold,
  },
});
export default StatisticsScreen;
