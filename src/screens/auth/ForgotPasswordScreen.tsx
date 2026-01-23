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
import Svg, { Path } from 'react-native-svg';
import colors from '../../constants/color';
import { FONT_FAMILY } from '../../constants/fonts';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/AppNavigator';

type Props = StackScreenProps<RootStackParamList, 'ForgotPassword'>;

// Simple Mail Icon Component
const MailIcon = () => (
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
    <Path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <Path d="m22 6-10 7L2 6" />
  </Svg>
);

const ForgotPasswordScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('');

  const handleSend = () => {
    if (!email || !email.includes('@')) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    // MOCK PROCESS
    Alert.alert('Email Sent', `We have sent a verification code to ${email}`, [
      {
        text: 'Enter Code',
        onPress: () => navigation.navigate('VerificationCode', { email }),
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />

      <View style={styles.header}>
        <Text style={styles.title}>Forgot Password?</Text>
        <Text style={styles.subtitle}>
          Don't worry! It happens. Please enter the email associated with your
          account.
        </Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputWrapper}>
          <View style={styles.iconLeft}>
            <MailIcon />
          </View>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            placeholderTextColor="#79747E"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSend}>
          <Text style={styles.buttonText}>Send Code</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Back to Login</Text>
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
    lineHeight: 22,
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
  iconLeft: { marginRight: 10 },
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
  backButton: { alignItems: 'center', marginTop: 10 },
  backButtonText: {
    color: '#49454F',
    fontSize: 14,
    fontFamily: FONT_FAMILY.PoppinsMedium,
  },
});

export default ForgotPasswordScreen;
