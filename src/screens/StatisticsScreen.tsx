import React, { useState, useMemo } from 'react';
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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; // Wajib install ini
import { useNavigation } from '@react-navigation/native';
import { FONT_FAMILY } from '../constants/fonts';
import color from '../constants/color';
import WeightLineChart from '../components/grafik/WeightLineChart';
import { weightHistoryData } from '../utils/dummyData';
import { BackIcon, ChevronRight } from '../components/profil/ProfileIcons';

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

const StatisticsScreen = () => {
  const navigation = useNavigation();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [showYearPicker, setShowYearPicker] = useState(false);

  // --- LOGIC FILTER ---
  const filteredData = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const filtered = weightHistoryData.filter(item => {
      const itemDate = new Date(item.date);
      return itemDate.getFullYear() === year && itemDate.getMonth() === month;
    });

    filtered.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );

    return filtered.map(item => {
      const day = new Date(item.date).getDate();
      return {
        value: item.weight,
        label: day.toString().padStart(2, '0'),
      };
    });
  }, [currentDate]);

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

  const maxWeight =
    filteredData.length > 0 ? Math.max(...filteredData.map(d => d.value)) : 0;
  const minWeight =
    filteredData.length > 0 ? Math.min(...filteredData.map(d => d.value)) : 0;
  const avgWeight =
    filteredData.length > 0
      ? (
          filteredData.reduce((a, b) => a + b.value, 0) / filteredData.length
        ).toFixed(1)
      : 0;

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

        <ScrollView contentContainerStyle={styles.scrollContent}>
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
            <WeightLineChart
              data={filteredData}
              isMini={false}
              width={Dimensions.get('window').width - 80}
            />
          </View>

          {/* --- SUMMARY SECTION --- */}
          <Text style={styles.sectionTitle}>Monthly Summary</Text>
          <View style={styles.summaryContainer}>
            <View style={styles.summaryBox}>
              <Text style={styles.summaryLabel}>Average</Text>
              <Text style={styles.summaryValue}>{avgWeight} kg</Text>
            </View>
            <View style={styles.summaryBox}>
              <Text style={styles.summaryLabel}>Highest</Text>
              <Text style={styles.summaryValue}>{maxWeight} kg</Text>
            </View>
            <View style={styles.summaryBox}>
              <Text style={styles.summaryLabel}>Lowest</Text>
              <Text style={styles.summaryValue}>{minWeight} kg</Text>
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
