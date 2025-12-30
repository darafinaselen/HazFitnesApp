import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { FONT_FAMILY } from '../../constants/fonts';
import color from '../../constants/color';

interface ReminderRowProps {
  label: string;
  value?: string;
  isSwitch?: boolean;
  isEnabled?: boolean;
  onToggle?: (val: boolean) => void;
  onPress?: () => void;
}

const ReminderRow: React.FC<ReminderRowProps> = ({
  label,
  value,
  isSwitch,
  isEnabled,
  onToggle,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={isSwitch ? 1 : 0.7}
      disabled={isSwitch}
    >
      <Text style={styles.label}>{label}</Text>

      {isSwitch ? (
        <Switch
          trackColor={{ false: '#767577', true: color.blue900 }}
          thumbColor={'#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={onToggle}
          value={isEnabled}
        />
      ) : (
        <Text style={styles.value}>{value}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  label: {
    fontFamily: FONT_FAMILY.MontserratBold,
    fontSize: 14,
    color: '#0B2D46',
  },
  value: {
    fontFamily: FONT_FAMILY.MontserratMedium,
    fontSize: 14,
    color: '#7B8085',
  },
});

export default ReminderRow;
