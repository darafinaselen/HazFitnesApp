import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { FONT_FAMILY } from '../constants/fonts';
import CustomBottomBar from '../components/CustomBottomBar';
import color from '../constants/color';
import {
  ClockIcon,
  FireIconCal,
  RunIcon,
  FootIcon,
  FireIconStreak,
} from '../components/ReportIcons';
import { SmallStatCard, MediumStatCard } from '../components/StatCards';
import DailyTargetChart, { DailyData } from '../components/DailyTargetChart';

const userProfileImg = require('../assets/images/splash.png');
const squatBannerImg = require('../assets/images/splash.png');

// --- DUMMY DATA ---
const USER_DATA = {
  user: {
    name: 'MEECHEL BERNANDO',
    minutes: 45, // Total menit workout hari ini
    calories: 3115, // Total kalori hari ini
    workoutCount: 20, // Total workout yang sudah selesai
  },
  steps: {
    current: 2500, // Langkah hari ini
    target: 5000, // Target langkah harian
  },
  streak: {
    days: 4, // Streak aktif saat ini (4 hari)
  },
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

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  return (
    <View style={styles.mainContainer}>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#F5F7FA" />

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* HEADER */}
          <View style={styles.header}>
            <Image source={userProfileImg} style={styles.profileImage} />
            <View style={styles.headerTextContainer}>
              <Text style={styles.welcomeText}>WELLCOME BACK,</Text>
              <Text style={styles.userName}>{USER_DATA.user.name}</Text>
            </View>
          </View>

          {/* STATS ROW 1 */}
          <View style={styles.statsRow}>
            <SmallStatCard
              Icon={ClockIcon}
              value={`${USER_DATA.user.minutes}`}
              label="MINUTES"
            />
            <SmallStatCard
              Icon={FireIconCal}
              value={`${USER_DATA.user.calories} KCAL`}
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

            {/* CARD STREAK */}
            <MediumStatCard
              Icon={FireIconStreak}
              label="STREAK"
              subLabel={`${USER_DATA.streak.days} DAYS`}
              type="streak"
              streakDays={USER_DATA.streak.days}
            />
          </View>

          {/* DAILY TARGET CHART */}
          <DailyTargetChart
            data={USER_DATA.weeklyHistory}
            unit="Kcal"
            title="DAILY CALORIES"
          />

          {/* PERSONALIZED PLAN */}
          <View style={styles.planSection}>
            <View style={styles.planHeader}>
              <Text style={styles.planTitle}>PERSONALIZED PLAN</Text>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('Program', {
                    programId: 'beginner',
                    programTitle: 'BEGINNER',
                  })
                }
              >
                <Text style={styles.viewAll}>VIEW ALL</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.planCard}>
              <Image
                source={squatBannerImg}
                style={styles.planBgImage}
                resizeMode="cover"
              />
              <View style={styles.planOverlay}>
                <Text style={styles.planName}>BODYWEIGTH{'\n'}SQUAT</Text>
                <Text style={styles.planDuration}>5-8 MIN</Text>
              </View>
            </View>
          </View>

          {/* Spacer untuk Bottom Bar */}
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
    backgroundColor: '#F5F7FA',
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  // --- Header ---
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#FFF',
    marginRight: 15,
  },
  headerTextContainer: { flex: 1 },
  welcomeText: {
    color: '#A2A6AB',
    fontFamily: FONT_FAMILY.MontserratMedium,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  userName: {
    color: '#1697D4',
    fontFamily: FONT_FAMILY.MontserratBold,
    fontSize: 18,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    gap: 8,
  },
  // --- Chart ---
  chartCard: {
    backgroundColor: '#10486A',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  chartTitle: {
    color: '#FFFFFF',
    fontFamily: FONT_FAMILY.MontserratBold,
    fontSize: 18,
    textTransform: 'uppercase',
  },
  chartSubtitle: {
    color: '#8CAAB9',
    fontFamily: FONT_FAMILY.MontserratMedium,
    fontSize: 10,
    textAlign: 'right',
  },
  chartSubtitleValue: {
    color: '#FFFFFF',
    fontFamily: FONT_FAMILY.MontserratBold,
    fontSize: 14,
    textAlign: 'right',
  },
  barChartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 120,
  },
  barWrapper: { alignItems: 'center', gap: 8 },
  bar: { width: 25, backgroundColor: '#8CAAB9', borderRadius: 6 },
  barActive: { backgroundColor: '#DDFE06' },
  barLabel: { color: '#8CAAB9', fontSize: 10 },
  // --- Plan ---
  planSection: { marginBottom: 20 },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  planTitle: {
    color: '#10486A',
    fontFamily: FONT_FAMILY.PoppinsBold,
    fontSize: 16,
    textTransform: 'uppercase',
  },
  viewAll: { color: '#A2A6AB', fontSize: 12 },
  planCard: {
    height: 150,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#DDD',
    justifyContent: 'center',
  },
  planBgImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  planOverlay: { padding: 20 },
  planName: {
    color: '#10486A',
    fontFamily: FONT_FAMILY.PoppinsBold,
    fontSize: 24,
    width: '60%',
    textTransform: 'uppercase',
  },
  planDuration: {
    color: '#10486A',
    fontFamily: FONT_FAMILY.PoppinsBold,
    fontSize: 14,
    marginTop: 10,
  },
});

export default HomeScreen;
