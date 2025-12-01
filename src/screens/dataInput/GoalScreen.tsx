import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Image,
  ImageSourcePropType,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '../../constants/color';
import { FONT_FAMILY, FONT_SIZE } from '../../constants/fonts';
import PrimaryButton from '../../components/PrimaryButton';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/AppNavigator';

const imgGain = require('../../assets/images/female.png');
const imgLoss = require('../../assets/images/female.png');
const imgMaintain = require('../../assets/images/female.png');

type Props = StackScreenProps<RootStackParamList, 'Goal'>;

const GoalCard = ({
  label,
  image,
  isSelected,
  onPress,
}: {
  label: string;
  image: ImageSourcePropType;
  isSelected: boolean;
  onPress: () => void;
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[styles.card, isSelected && styles.cardSelected]}
    >
      {/* Bagian Gambar (Kiri) */}
      <View style={styles.imageContainer}>
        <Image source={image} style={styles.cardImage} resizeMode="cover" />
      </View>

      {/* Bagian Teks (Kanan) */}
      <View style={styles.textContainer}>
        <Text style={styles.cardText}>{label}</Text>
      </View>
    </TouchableOpacity>
  );
};

const Goalcreen: React.FC<Props> = ({ navigation, route }) => {
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const previousData = route.params;

  const handleContinue = () => {
    const currentData = {
      ...previousData,
      goal: selectedGoal,
    };

    console.log('--- DATA ONBOARDING LENGKAP ---', currentData);
    navigation.navigate('TypesTraining', currentData);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />

      <View style={styles.container}>
        <View>
          <Text style={styles.title}>WHAT’S YOUR GOAL?</Text>

          <View style={styles.cardsWrapper}>
            {/* Card 1: Weight Gain */}
            <GoalCard
              label="Weight Gain"
              image={imgGain}
              isSelected={selectedGoal === 'Weight Gain'}
              onPress={() => setSelectedGoal('Weight Gain')}
            />

            {/* Card 2: Weight Loss */}
            <GoalCard
              label="Weight Loss"
              image={imgLoss}
              isSelected={selectedGoal === 'Weight Loss'}
              onPress={() => setSelectedGoal('Weight Loss')}
            />

            {/* Card 3: Maintain Weight */}
            <GoalCard
              label="Maintain Weight"
              image={imgMaintain}
              isSelected={selectedGoal === 'Maintain Weight'}
              onPress={() => setSelectedGoal('Maintain Weight')}
            />
          </View>
        </View>

        <PrimaryButton
          label="CONTINUE"
          onPress={handleContinue}
          disabled={selectedGoal === null}
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
  cardsWrapper: {
    gap: 20,
  },

  card: {
    flexDirection: 'row',
    height: 100,
    width: '100%',
    borderRadius: 15,
    backgroundColor: '#E1F2FD',
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',

    // Shadow
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardSelected: {
    borderColor: '#0A659A',
    backgroundColor: '#D0EBFC',
  },

  // Bagian Gambar (Separuh Kiri)
  imageContainer: {
    width: '40%',
    height: '100%',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },

  // Bagian Teks (Separuh Kanan)
  textContainer: {
    flex: 1, // Sisa ruang (60%)
    justifyContent: 'center',
    paddingLeft: 20,
  },
  cardText: {
    color: '#0B2D46',
    fontFamily: FONT_FAMILY.PoppinsSemiBold,
    fontSize: 18,
    fontWeight: '600',
  },
});

export default Goalcreen;
