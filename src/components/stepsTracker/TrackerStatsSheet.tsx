import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { FONT_FAMILY } from '../../constants/fonts';

const PauseIcon = () => (
  <Svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="white"
    stroke="white"
    strokeWidth="2"
  >
    <Path d="M10 9v6m4-6v6" strokeLinecap="round" />
  </Svg>
);

const PlayIcon = () => (
  <Svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="white"
    stroke="white"
    strokeWidth="2"
  >
    <Path d="M5 3l14 9-14 9V3z" />
  </Svg>
);

const StatItem = ({ value, label }: { value: string; label: string }) => (
  <View style={styles.statItem}>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

interface Props {
  isRunning: boolean;
  timerString: string; // "00 : 00 : 00"
  distance: number;
  calories: number;
  pace: string;
  onToggleTracking: () => void;
}

const TrackerStatsSheet: React.FC<Props> = ({
  isRunning,
  timerString,
  distance,
  calories,
  pace,
  onToggleTracking,
}) => {
  return (
    <View style={styles.bottomSheet}>
      {/* Timer Pill */}
      <View style={styles.timerPill}>
        <Text style={styles.timerText}>{timerString}</Text>
        <View style={styles.divider} />
        <TouchableOpacity onPress={onToggleTracking}>
          {isRunning ? <PauseIcon /> : <PlayIcon />}
        </TouchableOpacity>
      </View>

      <Text style={styles.timerLabel}>
        {isRunning ? 'Tracking...' : 'Paused'}
      </Text>

      {/* Stats Row */}
      <View style={styles.statsRow}>
        <StatItem value={`${distance.toFixed(2)} KM`} label="Distance" />
        <StatItem value={`${calories}`} label="Calories" />
        <StatItem value={pace} label="Avg. Pace" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 70,
    paddingBottom: 40,
    paddingHorizontal: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 20,
  },
  timerPill: {
    backgroundColor: '#10486A',
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 25,
    position: 'absolute',
    alignSelf: 'center',
    top: 10,
    shadowColor: '#10486A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  timerText: {
    color: '#FFF',
    fontFamily: FONT_FAMILY.MontserratBold,
    fontSize: 20,
    marginRight: 15,
    fontVariant: ['tabular-nums'],
  },
  divider: {
    width: 1,
    height: 20,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginRight: 15,
  },
  timerLabel: {
    color: '#A2A6AB',
    fontSize: 12,
    marginBottom: 20,
    fontFamily: FONT_FAMILY.MontserratMedium,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    color: '#10486A',
    fontSize: 18,
    fontFamily: FONT_FAMILY.MontserratBold,
    marginBottom: 4,
  },
  statLabel: {
    color: '#A2A6AB',
    fontSize: 12,
    fontFamily: FONT_FAMILY.MontserratMedium,
  },
});

export default TrackerStatsSheet;
