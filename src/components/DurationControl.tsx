import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
// Pastikan path fonts ini sesuai dengan project kamu
import { FONT_FAMILY } from '../constants/fonts';

interface DurationControlProps {
  duration: string; // Menerima text "00:40" untuk ditampilkan
  onIncrease: () => void; // Fungsi saat tombol + ditekan
  onDecrease: () => void; // Fungsi saat tombol - ditekan
}

const DurationControl: React.FC<DurationControlProps> = ({
  duration,
  onIncrease,
  onDecrease,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Duration</Text>

      <View style={styles.controls}>
        {/* Tombol Minus */}
        <TouchableOpacity
          style={styles.button}
          onPress={onDecrease}
          activeOpacity={0.7}
        >
          <Text style={styles.buttonText}>-</Text>
        </TouchableOpacity>

        {/* Display Waktu */}
        <Text style={styles.timeText}>{duration}</Text>

        {/* Tombol Plus */}
        <TouchableOpacity
          style={styles.button}
          onPress={onIncrease}
          activeOpacity={0.7}
        >
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 20,
    backgroundColor: '#FFF', // Opsional, biar bersih
    padding: 15,
    borderRadius: 12,
    // Shadow tipis biar cantik
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  label: {
    fontSize: 16,
    fontFamily: FONT_FAMILY.MontserratBold || 'System',
    color: '#10486A',
    fontWeight: '700',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  button: {
    width: 36,
    height: 36,
    backgroundColor: '#10486A', // Warna biru tua tema kamu
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
    lineHeight: 22,
  },
  timeText: {
    fontSize: 18,
    fontFamily: FONT_FAMILY.RobotoMedium || 'System',
    color: '#10486A',
    minWidth: 60,
    textAlign: 'center',
    fontWeight: '600',
  },
});

export default DurationControl;
