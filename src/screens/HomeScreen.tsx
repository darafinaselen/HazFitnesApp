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
import Svg, { Path, Circle } from 'react-native-svg';
import { FONT_FAMILY } from '../constants/fonts';
import CustomBottomBar from '../components/CustomBottomBar';
import color from '../constants/color';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';

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

const ClockIcon = () => (
  <Svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#DDFE06"
    strokeWidth="2"
  >
    <Circle cx="12" cy="12" r="10" />
    <Path d="M12 6v6l4 2" />
  </Svg>
);
const FireIcon = () => (
  <Svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#DDFE06"
    strokeWidth="2"
  >
    <Path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.1.2-2.2.5-3z" />
  </Svg>
);
const RunIcon = () => (
  <Svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#DDFE06"
    strokeWidth="2"
  >
    <Path d="M22 2l-3.3 8.9L14.6 9l-1.3-4.5c-.7-2.3-3.7-2.7-4.7-.5L5 14l3.5 7 4.5-3 1 4" />
    <Circle cx="13" cy="4" r="2" />
  </Svg>
);
const FootIcon = () => (
  <Svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#DDFE06"
    strokeWidth="2"
  >
    <Path d="M4 16v-2.38C4 11.5 2.97 10.5 3 8c.03-2.72 1.49-6 4.5-6C9.37 2 11 3.8 11 8c0 1.25-.5 2-1.25 2H4.12" />
    <Path d="M20 20v-2.38c0-2.12 1.03-3.12 1-5.62-.03-2.72-1.49-6-4.5-6C14.63 6 13 7.8 13 12c0 1.25.5 2 1.25 2h5.63" />
  </Svg>
);

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
            <View style={styles.smallCard}>
              <ClockIcon />
              <Text style={styles.cardValue}>0</Text>
              <Text style={styles.cardLabel}>MINUTES</Text>
            </View>
            <View style={styles.smallCard}>
              <FireIcon />
              <Text style={styles.cardValue}>3.115 KCAL</Text>
              <Text style={styles.cardLabel}>CAL BURN</Text>
            </View>
            <View style={styles.smallCard}>
              <RunIcon />
              <Text style={styles.cardValue}>20</Text>
              <Text style={styles.cardLabel}>WORKOUT</Text>
            </View>
          </View>

          {/* STATS ROW 2 */}
          <View style={styles.statsRow}>
            <View style={styles.mediumCard}>
              <FootIcon />
              <Text style={styles.cardLabelMedium}>STEPS</Text>
              <Text style={styles.cardSubLabel}>0/463 M</Text>
              <View style={styles.progressBarContainer}>
                <View style={[styles.progressBarFill, { width: '40%' }]} />
              </View>
            </View>
            <View style={styles.mediumCard}>
              <FireIcon />
              <Text style={styles.cardLabelMedium}>STREAK</Text>
              <Text style={styles.cardSubLabel}>0 DAYS</Text>
              <View style={styles.streakDotsContainer}>
                {[...Array(7)].map((_, i) => (
                  <View
                    key={i}
                    style={[
                      styles.streakDot,
                      i === 0 ? styles.streakDotActive : null,
                    ]}
                  />
                ))}
              </View>
            </View>
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
              <TouchableOpacity onPress={() => navigation.navigate('Program')}>
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
  smallCard: {
    flex: 1,
    backgroundColor: color.blue900,
    borderRadius: 16,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
  mediumCard: {
    flex: 1,
    backgroundColor: color.blue900,
    borderRadius: 16,
    paddingVertical: 15,
    paddingHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    minHeight: 110,
  },
  cardValue: {
    color: '#FFFFFF',
    fontFamily: FONT_FAMILY.MontserratBold,
    fontSize: 14,
    textAlign: 'center',
  },
  cardLabel: {
    color: '#A2A6AB',
    fontFamily: FONT_FAMILY.MontserratMedium,
    fontSize: 12,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  cardLabelMedium: {
    color: '#FFFFFF',
    fontFamily: FONT_FAMILY.MontserratBold,
    fontSize: 18,
    textTransform: 'uppercase',
    marginTop: 5,
  },
  cardSubLabel: {
    color: '#A2A6AB',
    fontFamily: FONT_FAMILY.MontserratMedium,
    fontSize: 12,
    marginBottom: 5,
    textTransform: 'uppercase',
  },
  // --- Progress & Streak ---
  progressBarContainer: {
    width: '80%',
    height: 6,
    backgroundColor: '#0B3650',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: { height: '100%', backgroundColor: '#A2A6AB' },
  streakDotsContainer: { flexDirection: 'row', gap: 4 },
  streakDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#5A7585',
  },
  streakDotActive: { backgroundColor: '#FFFFFF' },
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
