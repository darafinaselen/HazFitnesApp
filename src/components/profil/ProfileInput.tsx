import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { FONT_FAMILY } from '../../constants/fonts';
import color from '../../constants/color';

interface ProfileInputProps {
  label: string;
  value: string;
  onChangeText?: (text: string) => void;
  editable?: boolean;
  onPress?: () => void;
  keyboardType?: 'default' | 'numeric' | 'email-address';
}

const ProfileInput: React.FC<ProfileInputProps> = ({
  label,
  value,
  onChangeText,
  editable = true,
  onPress,
  keyboardType = 'default',
}) => {
  return (
    <TouchableOpacity
      style={styles.inputRow}
      activeOpacity={onPress ? 0.7 : 1}
      onPress={editable ? undefined : onPress}
    >
      <Text style={styles.inputLabel}>{label}</Text>
      {editable && onChangeText ? (
        <TextInput
          style={styles.inputField}
          value={value}
          onChangeText={onChangeText}
          placeholder={`Enter ${label}`}
          placeholderTextColor="#A2A6AB"
          textAlign="right"
          keyboardType={keyboardType}
        />
      ) : (
        <Text style={[styles.inputValue, !value && styles.placeholderText]}>
          {value || `Select ${label}`}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  inputLabel: {
    fontFamily: FONT_FAMILY.MontserratBold,
    fontSize: 14,
    color: color.blue900,
  },
  inputField: {
    flex: 1,
    fontFamily: FONT_FAMILY.MontserratMedium,
    fontSize: 14,
    color: '#7B8085',
    padding: 0,
  },
  inputValue: {
    fontFamily: FONT_FAMILY.MontserratMedium,
    fontSize: 14,
    color: '#7B8085',
  },
  placeholderText: {
    color: '#A2A6AB',
  },
});

export default ProfileInput;
