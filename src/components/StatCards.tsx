import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FONT_FAMILY } from '../constants/fonts';
import color from '../constants/color';

interface SmallStatCardProps {
  Icon: React.FC;
  value: string;
  label: string;
}

export const SmallStatCard: React.FC<SmallStatCardProps> = ({
  Icon,
  value,
  label,
}) => (
  <View style={styles.smallCard}>
    <Icon />
    <Text style={styles.cardValue}>{value}</Text>
    <Text style={styles.cardLabel}>{label}</Text>
  </View>
);

interface MediumStatCardProps {
  Icon: React.FC;
  label: string;
  subLabel: string;
  type: 'steps' | 'streak';
  progress?: number; // 0.0 to 1.0 (for steps)
  onPress?: () => void;
}

export const MediumStatCard: React.FC<MediumStatCardProps> = ({
  Icon,
  label,
  subLabel,
  type,
  progress = 0,
  onPress,
}) => {
  const content = (
    <>
      <Icon />
      <Text style={styles.cardLabelMedium}>{label}</Text>
      <Text style={styles.cardSubLabel}>{subLabel}</Text>
      {type === 'steps' && (
        <View style={styles.progressBarContainer}>
          <View
            style={[styles.progressBarFill, { width: `${progress * 100}%` }]}
          />
        </View>
      )}
      {type === 'streak' && (
        <View style={styles.streakDotsContainer}>
          {[...Array(7)].map((_, i) => (
            <View
              key={i}
              style={[styles.streakDot, i < 3 ? styles.streakDotActive : null]}
            />
          ))}
        </View>
      )}
    </>
  );

  return onPress ? (
    <TouchableOpacity
      style={styles.mediumCard}
      activeOpacity={0.8}
      onPress={onPress}
    >
      {content}
    </TouchableOpacity>
  ) : (
    <View style={styles.mediumCard}>{content}</View>
  );
};

const styles = StyleSheet.create({
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
});
