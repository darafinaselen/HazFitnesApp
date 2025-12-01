import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '../../constants/color';
import { FONT_FAMILY, FONT_SIZE } from '../../constants/fonts';
import PrimaryButton from '../../components/PrimaryButton';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/AppNavigator';

type Props = StackScreenProps<RootStackParamList, 'Age'>;

const AgeScreen: React.FC<Props> = ({ navigation, route }) => {
  const [age, setAge] = useState('');
  const { gender } = route.params;

  const handleContinue = () => {
    navigation.navigate('Height', {
      gender: gender,
      age: parseInt(age, 10) || 0,
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.content}>
          <Text style={styles.title}>HOW OLD ARE YOU?</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={age}
              onChangeText={setAge}
              placeholder="0"
              placeholderTextColor={colors.blue950}
              keyboardType="number-pad"
              maxLength={3}
              cursorColor={colors.primary}
            />
            <Text style={styles.unit}>YEARS</Text>
          </View>
        </View>

        <PrimaryButton
          label="CONTINUE"
          onPress={handleContinue}
          disabled={!age}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  content: {
    marginTop: -30,
    alignItems: 'center',
  },
  title: {
    color: colors.primary,
    fontFamily: FONT_FAMILY.PoppinsBold,
    fontSize: FONT_SIZE.xl,
    fontWeight: '700',
    textTransform: 'uppercase',
    textAlign: 'center',
    marginBottom: 60,
  },
  inputContainer: {
    marginTop: 30,
    alignItems: 'center',
  },
  input: {
    fontFamily: FONT_FAMILY.PoppinsMedium,
    fontSize: 100,
    color: colors.blue950,
    textAlign: 'center',
    paddingVertical: 10,
    // lineHeight: 100,
  },
  unit: {
    fontFamily: FONT_FAMILY.PoppinsSemiBold,
    fontSize: FONT_SIZE.md,
    color: colors.black,
    backgroundColor: colors.bg_input,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    overflow: 'hidden',
    marginTop: -10,
  },
});

export default AgeScreen;
