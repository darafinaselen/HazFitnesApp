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
import colors from '../../constants/color';
import { FONT_FAMILY } from '../../constants/fonts';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/AppNavigator';

type Props = StackScreenProps<RootStackParamList, 'VerificationCode'>;

const VerificationCodeScreen: React.FC<Props> = ({ navigation, route }) => {
  const { email } = route.params;
  const [code, setCode] = useState('');

  const handleVerify = () => {
    // MOCK VALIDATION: Code must be 1234
    if (code === '1234') {
      navigation.navigate('ResetPassword');
    } else {
      Alert.alert(
        'Invalid Code',
        'The code you entered is incorrect. Try 1234.',
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />

      <View style={styles.header}>
        <Text style={styles.title}>Verification</Text>
        <Text style={styles.subtitle}>
          Enter the verification code we just sent to{'\n'}
          <Text
            style={{ fontFamily: FONT_FAMILY.PoppinsBold, color: '#009CDE' }}
          >
            {email}
          </Text>
        </Text>
      </View>

      <View style={styles.form}>
        {/* Simple OTP Input Representation */}
        <TextInput
          style={styles.otpInput}
          placeholder="1234"
          placeholderTextColor="#DDD"
          keyboardType="numeric"
          maxLength={4}
          value={code}
          onChangeText={setCode}
          textAlign="center"
        />

        <Text style={styles.helperText}>Try entering '1234'</Text>

        <TouchableOpacity style={styles.button} onPress={handleVerify}>
          <Text style={styles.buttonText}>Verify</Text>
        </TouchableOpacity>

        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>Didn't receive code? </Text>
          <TouchableOpacity
            onPress={() => Alert.alert('Sent!', 'New code sent (Mock).')}
          >
            <Text style={styles.resendLink}>Resend</Text>
          </TouchableOpacity>
        </View>
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
  header: { marginBottom: 30, alignItems: 'center' },
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
    textAlign: 'center',
    lineHeight: 22,
  },
  form: { gap: 20 },
  otpInput: {
    height: 60,
    fontSize: 32,
    fontFamily: FONT_FAMILY.PoppinsBold,
    letterSpacing: 10,
    borderBottomWidth: 2,
    borderColor: '#009CDE',
    color: '#1D1B20',
    marginBottom: 10,
  },
  helperText: {
    textAlign: 'center',
    color: '#AAA',
    fontSize: 12,
    marginTop: -15,
  },
  button: {
    height: 50,
    backgroundColor: '#009CDE',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: FONT_FAMILY.PoppinsSemiBold,
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  resendText: { color: '#49454F', fontFamily: FONT_FAMILY.PoppinsMedium },
  resendLink: { color: '#009CDE', fontFamily: FONT_FAMILY.PoppinsBold },
});

export default VerificationCodeScreen;
