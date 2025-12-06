import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FONT_FAMILY } from '../constants/fonts';
import color from '../constants/color';
import CustomBottomBar from '../components/CustomBottomBar';
import {
  ClockIcon,
  RunIcon,
  FootIcon,
  FireIconCal,
  FireIconStreak,
} from '../components/ReportIcons';
import { SmallStatCard, MediumStatCard } from '../components/StatCards';
import { DailyTargetChartCard } from '../components/ChartCard';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';

const { width } = Dimensions.get('window');

// --- Component untuk Card Profil (Weight, Height, BMI) ---

const ProfileCard: React.FC<{
  title: string;
  value: string;
  children?: React.ReactNode;
}> = ({ title, value, children }) => (
  <View style={styles.profileCard}>
    <View style={styles.profileCardHeader}>
      <Text style={styles.profileCardTitle}>{title}</Text>
      <TouchableOpacity>
        <Text style={styles.profileCardEdit}>Edit &gt;</Text>
      </TouchableOpacity>
    </View>
    {children}
  </View>
);

const WeightChart: React.FC = () => (
  <View style={styles.weightContent}>
    <Text style={styles.weightValue}>50.00</Text>
    <View style={styles.weightStats}>
      <Text style={styles.weightLabel}>Current Weight</Text>
      <Text style={styles.weightLabel}>
        <Text style={styles.weightValueZero}>0.0</Text> Last 30 Days
      </Text>
      <Text style={styles.weightLabel}>
        <Text style={styles.weightValue}>50.00</Text> Average
      </Text>
    </View>
    {/* Placeholder Chart */}
    <View style={styles.chartPlaceholder}>
      <Text style={styles.chartPlaceholderText}>Weight Chart Placeholder</Text>
    </View>
  </View>
);

const BMIBar: React.FC = () => (
  <View style={styles.bmiContent}>
    <View style={styles.bmiBarContainer}>
      <View
        style={[
          styles.bmiSegment,
          { backgroundColor: '#3CB371', width: '25%' },
        ]}
      />
      <View
        style={[
          styles.bmiSegment,
          { backgroundColor: '#DDFE06', width: '25%' },
        ]}
      />
      <View
        style={[
          styles.bmiSegment,
          { backgroundColor: '#FF8C00', width: '25%' },
        ]}
      />
      <View
        style={[
          styles.bmiSegment,
          { backgroundColor: '#DC143C', width: '25%' },
        ]}
      />
    </View>

    <View style={styles.bmiLabels}>
      <Text style={styles.bmiLabelText}>Underweight</Text>
      <Text style={styles.bmiLabelText}>Normal</Text>
      <Text style={styles.bmiLabelText}>Overweight</Text>
      <Text style={styles.bmiLabelText}>Obese</Text>
    </View>

    <Text style={styles.bmiText}>
      Your BMI is <Text style={styles.bmiValue}>16.7</Text> which is Considered{' '}
      <Text style={styles.bmiValue}>Underweight</Text>
    </Text>
  </View>
);

// --- Report Screen Utama ---
const ReportScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  return (
    <View style={styles.mainContainer}>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor={color.blue900} />

        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>YOUR REPORT</Text>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* STATS ROW 1 (Small Cards) */}
          <View style={styles.statsRow}>
            <SmallStatCard Icon={ClockIcon} value="0" label="MINUTES" />
            <SmallStatCard
              Icon={FireIconCal}
              value="3.115 KCAL"
              label="CAL BURN"
            />
            <SmallStatCard Icon={RunIcon} value="20" label="WORKOUT" />
          </View>

          {/* STATS ROW 2 (Medium Cards) */}
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

          {/* THIS WEEK / DAILY TARGET CHART */}
          <DailyTargetChartCard />

          {/* WEIGHT (KG) */}
          <ProfileCard title="WEIGHT (KG)" value="50.00">
            <WeightChart />
          </ProfileCard>

          {/* HEIGHT (CM) */}
          <ProfileCard title="HEIGHT (CM)" value="170 CM">
            <View style={styles.heightContent}>
              <Text style={styles.heightLabel}>Current Height</Text>
              <Text style={styles.heightValue}>170 CM</Text>
            </View>
          </ProfileCard>

          {/* BMI */}
          <ProfileCard title="BMI" value="16.7">
            <BMIBar />
          </ProfileCard>

          {/* Spacer untuk Bottom Bar agar tidak tertutup */}
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
    alignItems: 'center',
  },
  headerTitle: {
    color: color.text,
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
  }, // --- Profile Cards (Weight, Height, BMI) ---
  profileCard: {
    backgroundColor: color.blue900,
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
    overflow: 'hidden',
  },
  profileCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  profileCardTitle: {
    color: '#FFFFFF',
    fontFamily: FONT_FAMILY.MontserratBold,
    fontSize: 18,
    textTransform: 'uppercase',
  },
  profileCardEdit: {
    color: '#A2A6AB',
    fontFamily: FONT_FAMILY.MontserratMedium,
    fontSize: 12,
  }, // --- Weight Content ---
  weightContent: { paddingBottom: 10 },
  weightValue: {
    color: '#FFFFFF',
    fontFamily: FONT_FAMILY.MontserratBold,
    fontSize: 28,
    marginBottom: 5,
  },
  weightStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 15,
  },
  weightLabel: {
    color: '#A2A6AB',
    fontFamily: FONT_FAMILY.MontserratMedium,
    fontSize: 12,
  },
  weightValueZero: { color: '#FF8C00' },
  chartPlaceholder: {
    height: 100,
    backgroundColor: '#0B3650',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartPlaceholderText: { color: '#8CAAB9', fontSize: 12 },

  heightContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heightLabel: {
    color: '#A2A6AB',
    fontFamily: FONT_FAMILY.MontserratMedium,
    fontSize: 14,
  },
  heightValue: {
    color: '#FFFFFF',
    fontFamily: FONT_FAMILY.MontserratBold,
    fontSize: 20,
  }, // --- BMI Content ---

  bmiContent: { paddingTop: 10 },
  bmiBarContainer: {
    flexDirection: 'row',
    height: 20,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 5,
  },
  bmiSegment: { height: '100%' },
  bmiLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingHorizontal: 5,
  },
  bmiLabelText: {
    color: '#A2A6AB',
    fontFamily: FONT_FAMILY.MontserratMedium,
    fontSize: 9,
    width: '25%',
    textAlign: 'center',
  },
  bmiText: {
    color: '#A2A6AB',
    fontFamily: FONT_FAMILY.MontserratMedium,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 5,
  },
  bmiValue: {
    color: '#DDFE06',
    fontFamily: FONT_FAMILY.MontserratBold,
    fontSize: 12,
  },
});

export default ReportScreen;
