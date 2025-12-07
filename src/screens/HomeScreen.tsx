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

const userProfileImg = require('../assets/images/splash.png');
const squatBannerImg = require('../assets/images/splash.png');

// --- DUMMY DATA ---
const WEEKLY_DATA = [
  { day: 'SUN', height: 40, active: false },
  { day: 'MON', height: 70, active: false },
  { day: 'TUE', height: 100, active: true },
  { day: 'WED', height: 50, active: false },
  { day: 'THU', height: 60, active: false },
  { day: 'FRI', height: 80, active: false },
  { day: 'SAT', height: 30, active: false },
];

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
              <Text style={styles.userName}>MEECHEL BERNANDO</Text>
            </View>
          </View>

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
            {/* CARD STEPS DENGAN NAVIGASI */}
            <MediumStatCard
              Icon={FootIcon}
              label="STEPS"
              subLabel="0/463 M"
              type="steps"
              progress={0.4}
              onPress={() => navigation.navigate('StepsTracker')}
            />

            {/* CARD STREAK */}
            <MediumStatCard
              Icon={FireIconStreak}
              label="STREAK"
              subLabel="0 DAYS"
              type="streak"
            />
          </View>

          {/* DAILY TARGET CHART */}
          <View style={styles.chartCard}>
            <View style={styles.chartHeader}>
              <Text style={styles.chartTitle}>DAILY TARGET</Text>
              <View>
                <Text style={styles.chartSubtitle}>WEEKLY CONSISTENCY</Text>
                <Text style={styles.chartSubtitleValue}>4/7 DAYS ACHIEVE</Text>
              </View>
            </View>
            <View style={styles.barChartContainer}>
              {WEEKLY_DATA.map((item, index) => (
                <View key={index} style={styles.barWrapper}>
                  <View
                    style={[
                      styles.bar,
                      { height: item.height },
                      item.active && styles.barActive,
                    ]}
                  />
                  <Text style={styles.barLabel}>{item.day}</Text>
                </View>
              ))}
            </View>
          </View>

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
