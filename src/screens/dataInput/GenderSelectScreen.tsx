import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '../../constants/color';
import { FONT_FAMILY, FONT_SIZE } from '../../constants/fonts';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import ChooseCard from '../../components/dataInput/ChooseCard';
import FemaleImage from '../../assets/images/female.png';
import MaleImage from '../../assets/images/male.png';

type Props = StackScreenProps<RootStackParamList, 'GenderSelect'>;

const GenderSelectScreen: React.FC<Props> = ({ navigation }) => {
  const [selectedGender, setSelectedGender] = useState<
    'male' | 'female' | null
  >(null);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const handleGenderSelect = (gender: 'male' | 'female') => {
    setSelectedGender(gender);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      navigation.navigate('Age', { gender: gender });
    }, 1000);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
      <View style={styles.container}>
        <Text style={styles.title}>SELECT YOUR GENDER</Text>
        <View style={styles.cardContainer}>
          <ChooseCard
            label="Female"
            imageSource={FemaleImage}
            isSelected={selectedGender === 'female'}
            onPress={() => handleGenderSelect('female')}
          />
          <ChooseCard
            label="Male"
            imageSource={MaleImage}
            isSelected={selectedGender === 'male'}
            onPress={() => handleGenderSelect('male')}
          />
        </View>
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
    padding: 20,
    backgroundColor: colors.white,
  },
  progressContainer: {
    width: '100%',
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  title: {
    color: colors.primary,
    fontFamily: FONT_FAMILY.PoppinsBold,
    fontSize: 32,
    fontWeight: '700',
    textTransform: 'uppercase',
    textAlign: 'center',
    marginBottom: 40,
  },
  cardContainer: {
    alignItems: 'center',
    gap: 30,
  },
});

export default GenderSelectScreen;
