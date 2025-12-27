import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  StatusBar,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { FONT_FAMILY } from '../constants/fonts';
import color from '../constants/color';
import { BackIcon } from '../components/profil/ProfileIcons';
import ReminderRow from '../components/reminders/ReminderRow';

const DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

const RemindersScreen: React.FC = () => {
  const navigation = useNavigation();

  // --- STATE ---
  const [isNotificationOn, setIsNotificationOn] = useState(true);
  const [selectedDays, setSelectedDays] = useState<string[]>([
    'MON',
    'WED',
    'FRI',
  ]);
  const [time, setTime] = useState(new Date());
  const [showDayModal, setShowDayModal] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  // 1. Toggle Hari (Select/Deselect)
  const toggleDay = (day: string) => {
    setSelectedDays(prev => {
      if (prev.includes(day)) return prev.filter(d => d !== day);
      return [...prev, day];
    });
  };

  // 2. Format Teks Hari untuk ditampilkan di Card
  const getDaysLabel = () => {
    if (selectedDays.length === 0) return 'Never';
    if (selectedDays.length === 7) return 'Everyday';
    return selectedDays.join(', ');
  };

  // 3. Format Waktu (HH:mm)
  const formatTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  // 4. Handle Time Picker Change
  const onTimeChange = (event: any, selectedDate?: Date) => {
    setShowTimePicker(false);
    if (selectedDate) {
      setTime(selectedDate);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F7FA" />

      {/* --- HEADER --- */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.headerBtn}
        >
          <BackIcon />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>REMINDERS</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.card}>
          {/* Row 1: Notification Toggle */}
          <ReminderRow
            label="Workout Notifications"
            isSwitch
            isEnabled={isNotificationOn}
            onToggle={setIsNotificationOn}
          />
          <View style={styles.divider} />

          {/* Row 2: Days Selector */}
          <ReminderRow
            label="Days"
            value={getDaysLabel()}
            onPress={() => setShowDayModal(true)}
          />
          <View style={styles.divider} />

          {/* Row 3: Time Picker */}
          <ReminderRow
            label="Time"
            value={formatTime(time)}
            onPress={() => setShowTimePicker(true)}
          />
        </View>
      </View>

      {/* --- MODAL SELECT DAYS --- */}
      <Modal
        visible={showDayModal}
        animationType="fade"
        onRequestClose={() => setShowDayModal(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => setShowDayModal(false)}
              style={styles.headerBtn}
            >
              <BackIcon />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>DAYS</Text>
            <View style={{ width: 24 }} />
          </View>

          <View style={styles.modalContent}>
            <View style={styles.daysGrid}>
              {DAYS.map(day => {
                const isSelected = selectedDays.includes(day);
                return (
                  <TouchableOpacity
                    key={day}
                    style={[
                      styles.dayButton,
                      isSelected && styles.dayButtonSelected,
                    ]}
                    onPress={() => toggleDay(day)}
                  >
                    <Text
                      style={[
                        styles.dayText,
                        isSelected && styles.dayTextSelected,
                      ]}
                    >
                      {day}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            <TouchableOpacity
              style={styles.doneBtn}
              onPress={() => setShowDayModal(false)}
            >
              <Text style={styles.doneText}>Done</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>

      {/* --- TIME PICKER LOGIC (Android/iOS handled) --- */}
      {showTimePicker && (
        <DateTimePicker
          value={time}
          mode="time"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          is24Hour={true}
          onChange={onTimeChange}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  content: {
    padding: 20,
  },
  // Header Styles
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#F5F7FA',
  },
  headerBtn: { padding: 5 },
  headerTitle: {
    fontFamily: FONT_FAMILY.MontserratBold,
    fontSize: 18,
    color: color.blue900,
    textTransform: 'uppercase',
  },

  // Card Styles
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
  },

  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  modalContent: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 15,
  },
  dayButton: {
    width: '28%',
    aspectRatio: 1,
    backgroundColor: '#EAF6FB',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#EAF6FB',
  },
  dayButtonSelected: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: color.blue900,
  },
  dayText: {
    fontFamily: FONT_FAMILY.MontserratBold,
    fontSize: 14,
    color: '#7B8085',
    textAlign: 'center',
    textAlignVertical: 'center',
    includeFontPadding: false,
  },
  dayTextSelected: {
    fontFamily: FONT_FAMILY.MontserratBold,
    color: color.blue900,
  },
  doneBtn: {
    marginTop: 50,
    backgroundColor: color.blue900,
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
    width: '100%',
  },
  doneText: {
    color: '#FFF',
    fontFamily: FONT_FAMILY.MontserratBold,
    fontSize: 16,
  },
});

export default RemindersScreen;
