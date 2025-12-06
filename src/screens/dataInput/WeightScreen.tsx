// src/screens/dataInput/WeightScreen.tsx
import React, { useState, useMemo } from 'react';
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

import { calculateBMI, BmiResult } from '../../utils/bmiHelper';
import BMIScale from '../../components/dataInput/BMIScale';

type Props = StackScreenProps<RootStackParamList, 'Weight'>;

const WeightScreen: React.FC<Props> = ({ navigation, route }) => {
  const [weight, setWeight] = useState('');
  const { gender, age, height } = route.params;

  const bmiResult: BmiResult | null = useMemo(() => {
    const weightNum = parseFloat(weight);
    if (!weightNum) {return null;}
    return calculateBMI(weightNum, height);
  }, [weight, height]);

  const handleContinue = () => {
    if (!bmiResult) {return;}

    navigation.navigate('HealthConditions', {
      gender,
      age,
      height,
      weight: parseInt(weight, 10) || 0,
      bmi: bmiResult.bmiValue,
      bmiLevel: bmiResult.level,
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.content}>
          <Text style={styles.title}>WHAT'S YOUR WEIGHT?</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={weight}
              onChangeText={setWeight}
              placeholder="0"
              placeholderTextColor={colors.blue950}
              keyboardType="number-pad"
              maxLength={3}
              underlineColorAndroid="transparent"
              cursorColor={colors.primary}
            />
            <Text style={styles.unit}>KG</Text>
          </View>

          {/* Tampilkan BMI HANYA jika sudah dihitung */}
          {bmiResult && (
            <View style={styles.bmiContainer}>
              <Text style={styles.bmiTitle}>Body Mass Index (BMI)</Text>
              {/* Ini adalah komponen bar 4-level Anda */}
              <BMIScale level={bmiResult.level} />
              <Text style={styles.bmiInfo}>
                Your BMI is {bmiResult.bmiValue} which is considered{' '}
                <Text style={styles.bmiLevelText}>{bmiResult.level}</Text>.
              </Text>
            </View>
          )}
        </View>

        <PrimaryButton
          label="CONTINUE"
          onPress={handleContinue}
          disabled={!bmiResult}
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
    alignItems: 'center',
    paddingTop: 40,
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
    alignItems: 'center',
  },
  input: {
    fontFamily: FONT_FAMILY.PoppinsMedium,
    fontSize: 100,
    color: colors.blue950,
    textAlign: 'center',
  },
  unit: {
    fontFamily: FONT_FAMILY.PoppinsSemiBold,
    fontSize: FONT_SIZE.md,
    color: colors.black,
    backgroundColor: colors.bg_input || '#E1F2FD',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    overflow: 'hidden',
    marginTop: -15,
  },
  // --- STYLE BARU UNTUK KOTAK BMI ---
  bmiContainer: {
    marginTop: 40,
    width: '100%',
  },
  bmiTitle: {
    fontFamily: FONT_FAMILY.PoppinsSemiBold,
    fontSize: FONT_SIZE.md,
    color: colors.blue950,
    marginBottom: 10,
    textAlign: 'center',
  },
  bmiInfo: {
    fontFamily: FONT_FAMILY.PoppinsRegular,
    fontSize: FONT_SIZE.sm,
    color: colors.grey,
    textAlign: 'center',
    marginTop: 10,
  },
  bmiLevelText: {
    fontFamily: FONT_FAMILY.PoppinsSemiBold,
    color: colors.primary,
  },
});

export default WeightScreen;
