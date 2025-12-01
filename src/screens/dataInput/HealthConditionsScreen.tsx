import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '../../constants/color';
import { FONT_FAMILY, FONT_SIZE } from '../../constants/fonts';
import PrimaryButton from '../../components/PrimaryButton';
import ChooseCard from '../../components/dataInput/ChooseCard';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/AppNavigator';

type Props = StackScreenProps<RootStackParamList, 'HealthConditions'>;

const OptionButton = ({
  label,
  isSelected,
  onPress,
}: {
  label: string;
  isSelected: boolean;
  onPress: () => void;
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={[styles.optionButton, isSelected && styles.optionButtonSelected]}
    >
      <Text style={styles.optionText}>{label}</Text>
    </TouchableOpacity>
  );
};

const HealthConditionsScreen: React.FC<Props> = ({ navigation, route }) => {
  const [hypertension, setHypertension] = useState<boolean | null>(null);
  const [diabetes, setDiabetes] = useState<boolean | null>(null);
  const { gender, age, height, weight, bmi, bmiLevel } = route.params;

  const handleContinue = () => {
    const currentData = {
      gender,
      age,
      height,
      weight,
      bmi,
      bmiLevel,
      hypertension: hypertension,
      diabetes: diabetes,
    };
    console.log('--- DATA ONBOARDING LENGKAP ---', currentData);
    navigation.navigate('Goal', currentData);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
      <View style={styles.container}>
        <View>
          <Text style={styles.title}>Do you have any of these conditions?</Text>

          {/* Bagian Hipertensi */}
          <Text style={styles.questionTitle}>Hypertension</Text>
          <View style={styles.rowContainer}>
            <OptionButton
              label="YES"
              isSelected={hypertension === true}
              onPress={() => setHypertension(true)}
            />
            <OptionButton
              label="NO"
              isSelected={hypertension === false}
              onPress={() => setHypertension(false)}
            />
          </View>

          {/* Bagian Diabetes */}
          <Text style={styles.questionTitle}>Diabetes</Text>
          <View style={styles.rowContainer}>
            <OptionButton
              label="YES"
              isSelected={diabetes === true}
              onPress={() => setDiabetes(true)}
            />
            <OptionButton
              label="NO"
              isSelected={diabetes === false}
              onPress={() => setDiabetes(false)}
            />
          </View>
        </View>

        <PrimaryButton
          label="CONTINUE"
          onPress={handleContinue}
          // Tombol mati jika salah satu belum dipilih
          disabled={hypertension === null || diabetes === null}
        />
      </View>
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
    padding: 24,
    backgroundColor: colors.white,
    justifyContent: 'space-between',
    paddingBottom: 40,
  },
  title: {
    color: colors.primary,
    fontFamily: FONT_FAMILY.PoppinsBold,
    fontSize: FONT_SIZE.xl,
    fontWeight: '700',
    textTransform: 'uppercase',
    textAlign: 'left',
    marginBottom: 30,
    marginTop: 10,
    lineHeight: 32,
  },
  questionTitle: {
    fontFamily: FONT_FAMILY.PoppinsSemiBold,
    fontSize: FONT_SIZE.lg,
    color: colors.blue950,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 15,
    lineHeight: 40,
    letterSpacing: 0.1,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 30,
  },
  optionButton: {
    width: 123,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: '#E1F2FD',
    elevation: 3,
    // Shadow iOS (Konversi dari box-shadow CSSmu)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,

    // Border default transparan biar ukurannya gak goyang pas dipilih
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionButtonSelected: {
    borderColor: '#0A659A',
    backgroundColor: '#D0EBFC',
  },
  optionText: {
    color: '#000',
    fontFamily: FONT_FAMILY.PoppinsMedium,
    fontSize: 14,
    textTransform: 'uppercase',
    fontWeight: '500',
  },
});

export default HealthConditionsScreen;
