import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path, Circle } from 'react-native-svg';
import colors from '../../constants/color';
import { FONT_FAMILY } from '../../constants/fonts';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/AppNavigator';

type Props = StackScreenProps<RootStackParamList, 'ResetPassword'>;

const LockIcon = () => (
  <Svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#79747E"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <Path d="M19 11H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2z" />
    <Path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </Svg>
);

const EyeIcon = ({ isHidden }: { isHidden: boolean }) => (
  <Svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#79747E"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {isHidden ? (
      <>
        <Path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
        <Path d="m1 1 22 22" />
      </>
    ) : (
      <>
        <Path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <Circle cx="12" cy="12" r="3" />
      </>
    )}
  </Svg>
);

const ResetPasswordScreen: React.FC<Props> = ({ navigation }) => {
  // Form Values
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Visibility Toggles
  const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);

  // Error States
  const [newPasswordError, setNewPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  // --- REAL-TIME VALIDATION FUNCTIONS ---

  const handleNewPasswordChange = (text: string) => {
    setNewPassword(text);

    if (text.length > 0 && text.length < 8) {
      setNewPasswordError('Password must be at least 8 characters.');
    } else {
      setNewPasswordError('');
    }

    if (confirmPassword.length > 0) {
      if (text !== confirmPassword) {
        setConfirmPasswordError('Passwords do not match.');
      } else {
        setConfirmPasswordError('');
      }
    }
  };

  const handleConfirmPasswordChange = (text: string) => {
    setConfirmPassword(text);

    // 1. Cek Kesamaan Real-time
    if (text.length > 0 && text !== newPassword) {
      setConfirmPasswordError('Passwords do not match.');
    } else {
      setConfirmPasswordError('');
    }
  };

  // --- FINAL SUBMIT CHECK ---
  const handleReset = () => {
    if (newPassword.length < 8 || newPassword !== confirmPassword) {
      if (newPassword.length < 8)
        setNewPasswordError('Password must be at least 8 characters.');
      if (newPassword !== confirmPassword)
        setConfirmPasswordError('Passwords do not match.');
      return;
    }

    // MOCK SUCCESS
    Alert.alert('Success', 'Your password has been reset successfully!', [
      {
        text: 'Login Now',
        onPress: () => navigation.popToTop(),
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />

      <View style={styles.header}>
        <Text style={styles.title}>Reset Password</Text>
        <Text style={styles.subtitle}>Enter your new password below.</Text>
      </View>

      <View style={styles.form}>
        {/* --- New Password Input --- */}
        <View>
          <View
            style={[
              styles.inputWrapper,
              newPasswordError ? styles.inputError : null,
            ]}
          >
            <View style={styles.iconLeft}>
              <LockIcon />
            </View>
            <TextInput
              style={styles.input}
              placeholder="New Password"
              placeholderTextColor="#79747E"
              secureTextEntry={!isNewPasswordVisible}
              value={newPassword}
              onChangeText={handleNewPasswordChange}
            />
            <TouchableOpacity
              style={styles.iconRight}
              onPress={() => setIsNewPasswordVisible(!isNewPasswordVisible)}
            >
              <EyeIcon isHidden={!isNewPasswordVisible} />
            </TouchableOpacity>
          </View>
          {newPasswordError ? (
            <Text style={styles.errorText}>{newPasswordError}</Text>
          ) : null}
        </View>

        {/* --- Confirm Password Input --- */}
        <View>
          <View
            style={[
              styles.inputWrapper,
              confirmPasswordError ? styles.inputError : null,
            ]}
          >
            <View style={styles.iconLeft}>
              <LockIcon />
            </View>
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              placeholderTextColor="#79747E"
              secureTextEntry={!isConfirmPasswordVisible}
              value={confirmPassword}
              onChangeText={handleConfirmPasswordChange}
            />
            <TouchableOpacity
              style={styles.iconRight}
              onPress={() =>
                setIsConfirmPasswordVisible(!isConfirmPasswordVisible)
              }
            >
              <EyeIcon isHidden={!isConfirmPasswordVisible} />
            </TouchableOpacity>
          </View>
          {confirmPasswordError ? (
            <Text style={styles.errorText}>{confirmPasswordError}</Text>
          ) : null}
        </View>

        <TouchableOpacity
          style={[
            styles.button,
            newPasswordError ||
            confirmPasswordError ||
            !newPassword ||
            !confirmPassword
              ? { opacity: 0.7 }
              : null,
          ]}
          onPress={handleReset}
        >
          <Text style={styles.buttonText}>Reset Password</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 24,
    justifyContent: 'center',
  },
  header: { marginBottom: 30 },
  title: {
    fontSize: 28,
    fontFamily: FONT_FAMILY.PoppinsBold,
    color: colors.black,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: FONT_FAMILY.PoppinsMedium,
    color: '#79747E',
  },
  form: { gap: 20 },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    backgroundColor: 'rgba(21, 153, 211, 0.20)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CAC4D0',
    paddingHorizontal: 10,
  },
  inputError: {
    borderColor: '#FF0000',
    backgroundColor: '#FFF0F0',
  },
  errorText: {
    color: '#FF0000',
    fontSize: 12,
    fontFamily: FONT_FAMILY.PoppinsRegular,
    marginTop: 4,
    marginLeft: 4,
  },
  iconLeft: { marginRight: 10 },
  iconRight: { marginLeft: 'auto', padding: 5 },
  input: {
    flex: 1,
    height: '100%',
    fontFamily: FONT_FAMILY.PoppinsMedium,
    color: '#1D1B20',
  },
  button: {
    height: 50,
    backgroundColor: '#009CDE',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: FONT_FAMILY.PoppinsSemiBold,
  },
});

export default ResetPasswordScreen;
