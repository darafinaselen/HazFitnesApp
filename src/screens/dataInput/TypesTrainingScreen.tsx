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

// Import Gambar (Sesuaikan nama file kamu)
// Jika belum ada gambar, bisa dikomentari dulu dan ganti require dummy
const imgGain = require('../../assets/images/female.png');
const imgLoss = require('../../assets/images/female.png');
const imgMaintain = require('../../assets/images/female.png');

type Props = StackScreenProps<RootStackParamList, 'TypesTraining'>;

const TrainingCard = ({
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

const TypesTrainingScreen: React.FC<Props> = ({ navigation, route }) => {
  const [selectedTraining, setSelectedTraining] = useState<string | null>(null);
  const previousData = route.params;

  const handleContinue = () => {
    const finalData = {
      ...previousData,
      training: selectedTraining,
    };

    console.log('--- DATA LENGKAP SAMPAI TRAINING ---', finalData);
    navigation.navigate('Analyzing', finalData);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />

      <View style={styles.container}>
        <View>
          <Text style={styles.title}>
            WHAT’S YOUR MAIN TYPES OF FITNESS TRAINING?
          </Text>

          <View style={styles.cardsWrapper}>
            {/* Card 1: Muscular Fitness */}
            <TrainingCard
              label="Muscular Fitness"
              image={imgGain}
              isSelected={selectedTraining === 'Muscular Fitness'}
              onPress={() => setSelectedTraining('Muscular Fitness')}
            />

            {/* Card 2: Cardio */}
            <TrainingCard
              label="Cardio"
              image={imgLoss}
              isSelected={selectedTraining === 'Cardio'}
              onPress={() => setSelectedTraining('Cardio')}
            />

            {/* Card 3: Flexibility */}
            <TrainingCard
              label="Flexibility"
              image={imgMaintain}
              isSelected={selectedTraining === 'Flexibility'}
              onPress={() => setSelectedTraining('Flexibility')}
            />
          </View>
        </View>

        <PrimaryButton
          label="CONTINUE"
          onPress={handleContinue}
          disabled={selectedTraining === null}
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
export default TypesTrainingScreen;
