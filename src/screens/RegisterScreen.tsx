import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  StatusBar,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path, Circle, G } from 'react-native-svg';
import colors from '../constants/color';
import { FONT_FAMILY } from '../constants/fonts';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';

const logoImage = require('../assets/images/splash.png');

type Props = StackScreenProps<RootStackParamList, 'Register'>;

const UserIcon = () => (
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
    <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <Circle cx="12" cy="7" r="4" />
  </Svg>
);

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

const GoogleIcon = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path
      d="M23.52 12.29c0-.85-.08-1.68-.21-2.48H12v4.7h6.45c-.28 1.48-1.11 2.73-2.38 3.58v2.98h3.85c2.25-2.08 3.55-5.14 3.55-8.78z"
      fill="#4285F4"
    />
    <Path
      d="M12 24c3.24 0 5.96-1.08 7.95-2.91l-3.85-2.98c-1.08.72-2.45 1.15-4.1 1.15-3.13 0-5.78-2.11-6.73-4.96H1.36v3.12C3.33 21.3 7.41 24 12 24z"
      fill="#34A853"
    />
    <Path
      d="M5.27 14.29c-.25-.74-.39-1.54-.39-2.36s.14-1.62.39-2.36V6.45H1.36C.49 8.17 0 10.03 0 12s.49 3.83 1.36 5.55l3.91-3.26z"
      fill="#FBBC05"
    />
    <Path
      d="M12 4.75c1.76 0 3.34.61 4.59 1.8l3.43-3.43C17.96 1.25 15.24 0 12 0 7.41 0 3.33 2.7 1.36 6.45l3.91 3.26c.95-2.85 3.6-4.96 6.73-4.96z"
      fill="#EA4335"
    />
  </Svg>
);

const RegisterScreen: React.FC<Props> = ({ navigation, route }) => {
  const userData = route.params;

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setPasswordVisible] = useState(false);

  const handleRegister = () => {
    if (!username || !email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    console.log('--- REGISTERING USER ---');
    console.log('User Input:', { username, email, password });
    console.log('Body Data (BMI etc):', userData);

    Alert.alert('Success', 'Account Created Successfully!', [
      {
        text: 'OK',
        onPress: () => {
          navigation.navigate('Login');
        },
      },
    ]);
  };

  const handleGoogleRegister = () => {
    Alert.alert('Google Sign-In', 'This feature is coming soon!');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* LOGO */}
        <View style={styles.logoContainer}>
          <Image source={logoImage} style={styles.logo} resizeMode="contain" />
        </View>

        {/* INPUT FIELDS */}
        <View style={styles.formContainer}>
          {/* Username Input */}
          <View style={styles.inputWrapper}>
            <View style={styles.iconLeft}>
              <UserIcon />
            </View>
            <TextInput
              style={styles.input}
              placeholder="Username"
              placeholderTextColor="#79747E"
              value={username}
              onChangeText={setUsername}
            />
          </View>

          {/* Email Input */}
          <View style={styles.inputWrapper}>
            <View style={styles.iconLeft}>
              <MailIcon />
            </View>
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#79747E"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          {/* Password Input */}
          <View style={styles.inputWrapper}>
            <View style={styles.iconLeft}>
              <LockIcon />
            </View>
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#79747E"
              secureTextEntry={!isPasswordVisible}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity
              style={styles.iconRight}
              onPress={() => setPasswordVisible(!isPasswordVisible)}
            >
              <EyeIcon isHidden={!isPasswordVisible} />
            </TouchableOpacity>
          </View>
        </View>

        {/* BUTTONS */}
        <View style={styles.buttonContainer}>
          {/* Register Button */}
          <TouchableOpacity
            style={styles.registerButton}
            activeOpacity={0.8}
            onPress={handleRegister}
          >
            <Text style={styles.registerButtonText}>Register</Text>
          </TouchableOpacity>

          {/* Divider OR */}
          <View style={styles.dividerContainer}>
            <View style={styles.line} />
            <Text style={styles.orText}>or</Text>
            <View style={styles.line} />
          </View>

          {/* Google Button */}
          <TouchableOpacity
            style={styles.googleButton}
            activeOpacity={0.8}
            onPress={handleGoogleRegister}
          >
            <View style={{ marginRight: 10 }}>
              <GoogleIcon />
            </View>
            <Text style={styles.googleButtonText}>Continue With Google</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    paddingVertical: 40,
  },

  // --- LOGO ---
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 127,
    height: 112,
    // borderRadius: 127 / 2,
  },

  // --- FORM INPUT ---
  formContainer: {
    width: 330,
    gap: 20,
    marginBottom: 30,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 330,
    height: 50,
    backgroundColor: 'rgba(21, 153, 211, 0.20)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CAC4D0',
    paddingHorizontal: 10,
  },
  iconLeft: {
    marginRight: 10,
  },
  iconRight: {
    marginLeft: 'auto',
    padding: 5,
  },
  input: {
    flex: 1,
    height: '100%',
    color: '#1D1B20',
    fontFamily: FONT_FAMILY.PoppinsMedium,
    fontSize: 14,
  },

  // --- BUTTONS ---
  buttonContainer: {
    width: 330,
    gap: 15,
  },
  registerButton: {
    width: 330,
    height: 50,
    backgroundColor: '#009CDE',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: FONT_FAMILY.PoppinsSemiBold,
    fontWeight: '600',
  },

  // --- DIVIDER ---
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#009CDE',
  },
  orText: {
    marginHorizontal: 10,
    color: '#49454F',
    fontSize: 14,
    fontFamily: FONT_FAMILY.PoppinsMedium,
  },

  // --- GOOGLE BUTTON ---
  googleButton: {
    flexDirection: 'row',
    width: 330,
    height: 50,
    backgroundColor: 'rgba(21, 153, 211, 0.50)',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  googleButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: FONT_FAMILY.PoppinsSemiBold,
    fontWeight: '600',
  },
});

export default RegisterScreen;
