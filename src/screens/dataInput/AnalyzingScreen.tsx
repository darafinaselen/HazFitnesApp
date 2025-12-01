import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Animated,
  Easing,
  Dimensions,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, G } from 'react-native-svg';
import colors from '../../constants/color';
import { FONT_FAMILY, FONT_SIZE } from '../../constants/fonts';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import color from '../../constants/color';

// --- Konfigurasi Progress Bar Lingkaran ---
const CIRCLE_SIZE = 200;
const STROKE_WIDTH = 15;
const RADIUS = (CIRCLE_SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const LOADING_MESSAGES = [
  'Analysing your profile...',
  'Checking health metrics...',
  'Calculating BMI & goals...',
  'Personalising your plan...',
  'Finalising...',
];

type Props = StackScreenProps<RootStackParamList, 'Analyzing'>;

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const AnalyzingScreen: React.FC<Props> = ({ navigation, route }) => {
  const [displayProgress, setDisplayProgress] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);
  const finalUserData = route.params;
  const strokeDashoffset =
    CIRCUMFERENCE - (CIRCUMFERENCE * displayProgress) / 100;

  useEffect(() => {
    const interval = setInterval(() => {
      setDisplayProgress(prev => {
        const nextProgress = prev + 1;
        if (nextProgress % 20 === 0 && nextProgress < 100) {
          setMessageIndex(current => (current + 1) % LOADING_MESSAGES.length);
        }

        if (nextProgress >= 100) {
          clearInterval(interval);

          setTimeout(() => {
            console.log('--- ANALISIS SELESAI. DATA FINAL: ---', finalUserData);

            Alert.alert('Analisis Selesai!', 'Siap masuk ke Register.', [
              {
                text: 'OK',
                onPress: () => {
                  navigation.replace('Register', finalUserData);
                  console.log('User menekan OK');
                },
              },
            ]);
          }, 500);
          return 100;
        }
        return nextProgress;
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />

      <View style={styles.container}>
        <Text style={styles.title}>CREATE YOUR OWN EXERCISE PROGRAM</Text>
        <View style={styles.progressContainer}>
          <Svg width={CIRCLE_SIZE} height={CIRCLE_SIZE}>
            <G rotation="-90" origin={`${CIRCLE_SIZE / 2}, ${CIRCLE_SIZE / 2}`}>
              {/* Lingkaran Belakang (Abu-abu) */}
              <Circle
                cx={CIRCLE_SIZE / 2}
                cy={CIRCLE_SIZE / 2}
                r={RADIUS}
                stroke="#E1F2FD"
                strokeWidth={STROKE_WIDTH}
                fill="transparent"
              />
              {/* Lingkaran Depan (Biru - Dianimasikan) */}
              <AnimatedCircle
                cx={CIRCLE_SIZE / 2}
                cy={CIRCLE_SIZE / 2}
                r={RADIUS}
                stroke="#0A659A"
                strokeWidth={STROKE_WIDTH}
                fill="transparent"
                strokeDasharray={CIRCUMFERENCE}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
            </G>
          </Svg>

          {/* Teks Persentase di Tengah */}
          <View style={styles.percentageTextContainer}>
            <Text style={styles.percentageText}>{displayProgress}%</Text>
          </View>
        </View>

        {/* Teks Status yang Berubah */}
        <Text style={styles.statusText}>{LOADING_MESSAGES[messageIndex]}</Text>
      </View>
    </SafeAreaView>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    backgroundColor: colors.white,
  },
  title: {
    color: colors.primary,
    fontFamily: FONT_FAMILY.PoppinsBold,
    fontSize: FONT_SIZE.xl,
    fontWeight: '700',
    textTransform: 'uppercase',
    textAlign: 'left',
    marginBottom: 150,
    marginTop: -100,
    lineHeight: 50,
  },
  progressContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#0A659A',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
    backgroundColor: colors.white,
    borderRadius: CIRCLE_SIZE / 2,
    padding: 5,
  },
  percentageTextContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  percentageText: {
    fontFamily: FONT_FAMILY.PoppinsBold,
    fontSize: FONT_SIZE.xxxl,
    color: colors.blue950,
    fontWeight: '700',
  },
  statusText: {
    fontFamily: FONT_FAMILY.PoppinsMedium,
    fontSize: FONT_SIZE.md,
    color: color.text,
    textAlign: 'center',
  },
});

export default AnalyzingScreen;
