import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';

// Import komponen & helper yang sudah kita siapkan
import { FONT_FAMILY } from '../constants/fonts';
import DurationControl from '../components/DurationControl';
import { formatDuration } from '../utils/timeHelper';

const ExerciseDetailScreen: React.FC = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'ExerciseDetail'>>();
  const navigation = useNavigation();

  // 1. Ambil data yang dikirim dari ProgramScreen
  // duration di sini tipe datanya NUMBER (detik)
  const { name, duration, category, image } = route.params;

  // 2. State untuk menyimpan perubahan waktu sementara
  // Default value diambil dari database/params (duration)
  const [currentSeconds, setCurrentSeconds] = useState<number>(duration);

  // LOGIC MATEMATIKA:
  const handleIncrease = () => {
    setCurrentSeconds(prev => prev + 10); // Tambah 10 detik
  };

  const handleDecrease = () => {
    setCurrentSeconds(prev => (prev > 10 ? prev - 10 : prev)); // Kurang 10 detik, minimal 10s
  };

  const handleReset = () => {
    setCurrentSeconds(duration); // Balikin ke angka awal
  };

  const handleSave = () => {
    // Nanti di sini kita simpan ke database atau state global
    console.log(
      `Latihan ${name} disimpan dengan durasi: ${currentSeconds} detik`,
    );

    // Simulasi sukses & kembali
    navigation.goBack();
  };

  return (
    <View style={styles.mainContainer}>
      <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* HEADER TITLE */}
          <View style={styles.titleContainer}>
            <Text style={styles.exerciseTitle}>{name}</Text>
            <Text style={styles.categoryText}>Category: {category}</Text>
          </View>

          {/* MEDIA PLACEHOLDER (GAMBAR/VIDEO) */}
          <View style={styles.mediaContainer}>
            {/* Jika image ada, tampilkan. Jika tidak, kotak abu-abu */}
            {image ? (
              <Image
                source={image}
                style={styles.imageStyle}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.mediaPlaceholder} />
            )}
          </View>

          {/* DURATION CONTROL COMPONENT */}
          {/* Kita convert detik (number) ke string "MM:SS" biar component bisa baca */}
          <DurationControl
            duration={formatDuration(currentSeconds)}
            onIncrease={handleIncrease}
            onDecrease={handleDecrease}
          />

          {/* DESCRIPTION */}
          <Text style={styles.descTitle}>Description</Text>
          <Text style={styles.loremText}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
            {'\n\n'}
            Duis aute irure dolor in reprehenderit in voluptate velit esse
            cillum dolore eu fugiat nulla pariatur.
          </Text>
        </ScrollView>

        {/* BOTTOM BUTTONS (Reset & Save) */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.btnReset} onPress={handleReset}>
            <Text style={styles.btnResetText}>RESET</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.btnSave} onPress={handleSave}>
            <Text style={styles.btnSaveText}>SAVE</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#F5F7FA', // Background abu muda
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100, // Space untuk footer button
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  exerciseTitle: {
    fontSize: 24,
    fontFamily: FONT_FAMILY.MontserratBold || 'System',
    color: '#10486A',
    fontWeight: '800',
    textTransform: 'uppercase',
    textAlign: 'center',
    marginBottom: 5,
  },
  categoryText: {
    fontSize: 14,
    color: '#8CAAB9',
    fontFamily: FONT_FAMILY.RobotoMedium || 'System',
    fontWeight: '500',
  },
  mediaContainer: {
    height: 220,
    backgroundColor: '#E6E6E6',
    borderRadius: 15,
    marginBottom: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  imageStyle: {
    width: '100%',
    height: '100%',
  },
  mediaPlaceholder: {
    flex: 1,
    backgroundColor: '#D9D9D9',
  },
  descTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#10486A',
    marginBottom: 5,
    fontFamily: FONT_FAMILY.MontserratBold || 'System',
  },
  loremText: {
    color: '#555',
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'justify',
    fontFamily: FONT_FAMILY.PoppinsMedium || 'System',
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
  },
  btnReset: {
    flex: 1,
    backgroundColor: '#87C1DE', // Biru muda
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  btnResetText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontFamily: FONT_FAMILY.MontserratBold || 'System',
    letterSpacing: 1,
  },
  btnSave: {
    flex: 1,
    backgroundColor: '#1697D4', // Biru tua (Primary)
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  btnSaveText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontFamily: FONT_FAMILY.MontserratBold || 'System',
    letterSpacing: 1,
  },
});

export default ExerciseDetailScreen;
