import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import colors from '../constants/color';
import { FONT_FAMILY, FONT_SIZE } from '../constants/fonts';

type Props = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
};

const PrimaryButton: React.FC<Props> = ({ label, onPress, disabled }) => {
  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.disabledButton]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={styles.text}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 20,
    alignItems: 'center',
    width: '100%',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  disabledButton: {
    backgroundColor: colors.grey,
  },
  text: {
    color: colors.white,
    fontFamily: FONT_FAMILY.RobotoRegular,
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
  },
});

export default PrimaryButton;
