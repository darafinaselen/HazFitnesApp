import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Animated,
  Dimensions,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, G } from 'react-native-svg';
import colors from '../../constants/color';
import { FONT_FAMILY, FONT_SIZE } from '../../constants/fonts';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { recommendationService } from '../../services/api';

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

  const rawData = route.params || {};
  const strokeDashoffset =
    CIRCUMFERENCE - (CIRCUMFERENCE * displayProgress) / 100;

  useEffect(() => {
    const interval = setInterval(() => {
      setDisplayProgress(prev => {
        const nextProgress = prev + 1;

        if (nextProgress % 20 === 0 && nextProgress < 90) {
          setMessageIndex(current => (current + 1) % LOADING_MESSAGES.length);
        }

        return nextProgress >= 90 ? 90 : nextProgress;
      });
    }, 50);

    const performAnalysis = async () => {
      try {
        console.log('--- START AI ANALYSIS ---');
        console.log('Raw Data Input:', rawData);

        // --- MAPPING DATA  ---
        const sex =
          rawData.gender && rawData.gender.toLowerCase() === 'female'
            ? 'Female'
            : 'Male';
        const hypertension = rawData.hypertension ? 'Yes' : 'No';
        const diabetes = rawData.diabetes ? 'Yes' : 'No';
        let heightVal = Number(rawData.height);
        //convert cm to m
        if (heightVal > 3) {
          heightVal = heightVal / 100;
        }

        const requestBody = {
          sex: sex,
          age: Number(rawData.age),
          height: heightVal,
          weight: Number(rawData.weight),
          hypertension: hypertension,
          diabetes: diabetes,
          fitness_goal: rawData.goal,
          fitness_type: rawData.training,
        };

        console.log('Sending to AI API:', requestBody);
        const response = await recommendationService.generate(requestBody);
        console.log('AI Response Success:', response);

        const recToken = response.data?.recommendation_token;

        clearInterval(interval);
        setDisplayProgress(100);

        setTimeout(() => {
          Alert.alert('Analysis Complete', 'Your personalized plan is ready!', [
            {
              text: 'Create Account',
              onPress: () => {
                navigation.replace('Register', {
                  recommendationToken: recToken,
                });
              },
            },
          ]);
        }, 500);
      } catch (error: any) {
        console.error('AI API Error:', error);
        if (error.response?.data) {
          console.log(
            'Backend Error Details:',
            JSON.stringify(error.response.data, null, 2),
          );
        }

        clearInterval(interval);
        setDisplayProgress(100);

        Alert.alert(
          'Notice',
          'AI Analysis connection failed, but you can still register.',
          [
            {
              text: 'Continue',
              onPress: () =>
                navigation.replace('Register', {
                  recommendationToken: undefined,
                }),
            },
          ],
        );
      }
    };

    performAnalysis();

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
    color: colors.text,
    textAlign: 'center',
  },
});

export default AnalyzingScreen;
