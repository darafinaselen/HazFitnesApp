import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../../constants/color';
import { FONT_FAMILY } from '../../constants/fonts';
import { BmiLevel } from '../../utils/bmiHelper';

type Props = {
  level: BmiLevel;
};

const levelColors: Record<BmiLevel, string> = {
  Underweight: '#3498db', // Biru
  Normal: '#2ecc71', // Hijau
  Overweight: '#f39c12', // Oranye
  Obese: '#e74c3c', // Merah
};

const BMIScale: React.FC<Props> = ({ level }) => {
  return (
    <View style={styles.container}>
      <View style={styles.barContainer}>
        {Object.keys(levelColors).map(key => {
          const currentLevel = key as BmiLevel;
          const isActive = currentLevel === level;
          return (
            <View
              key={key}
              style={[
                styles.barSection,
                { backgroundColor: levelColors[currentLevel] },
                !isActive && styles.inactiveSection,
              ]}
            />
          );
        })}
      </View>
      <View style={styles.labelContainer}>
        <Text style={styles.label}>Underweight</Text>
        <Text style={styles.label}>Normal</Text>
        <Text style={styles.label}>Overweight</Text>
        <Text style={styles.label}>Obese</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 10,
    backgroundColor: colors.blue50,
    borderRadius: 10,
  },
  barContainer: {
    flexDirection: 'row',
    height: 10,
    borderRadius: 5,
    overflow: 'hidden',
  },
  barSection: {
    flex: 1,
  },
  inactiveSection: {
    opacity: 0.3,
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  label: {
    fontFamily: FONT_FAMILY.PoppinsRegular,
    fontSize: 10,
    color: colors.blue950,
    flex: 1,
    textAlign: 'center',
  },
});

export default BMIScale;
