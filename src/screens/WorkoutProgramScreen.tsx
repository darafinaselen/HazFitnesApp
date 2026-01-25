import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import CustomBottomBar from '../components/CustomBottomBar';
import ProgramSelectionCard from '../components/ProgramSelectionCard';
import { FONT_FAMILY, FONT_SIZE } from '../constants/fonts';
import Svg, { Path } from 'react-native-svg';
import { programService } from '../services/api';

// --- Placeholder Image ---
const programThumb = require('../assets/images/splash.png');

interface ProgramData {
  id: string | number;
  title: string;
  name?: string; // Backend might use name
  description: string;
  image?: any;
  isLocked?: boolean;
}

const BackArrowIcon = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path
      d="M7.825 13L13.425 18.6L12 20L4 12L12 4L13.425 5.4L7.825 11H20V13H7.825Z"
      fill="#0B2D46"
    />
  </Svg>
);

const WorkoutProgramsScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [selectedId, setSelectedId] = useState<string | number>('beginner');
  const [programs, setPrograms] = useState<ProgramData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      const response = await programService.getAllPrograms();
      // Assuming response.data is the array or response itself is the array
      // Check structure from other responses. getUserDashboard was response.data.
      // Adjust if needed.
      if (response && response.data) {
        // Map backend fields if necessary
        const formatted = response.data.map((p: any) => ({
          id: p.id,
          title: p.name || p.title,
          description: p.description,
          image: programThumb, // Fallback for now if backend doesn't send image
          isLocked: false,
        }));
        setPrograms(formatted);
      }
    } catch (error) {
      console.error('Failed to fetch programs', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectProgram = (program: ProgramData) => {
    setSelectedId(program.id);

    navigation.navigate('Program', {
      programId: program.id,
      programTitle: program.title,
    });
  };

  return (
    <View style={styles.mainContainer}>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#F5F7FA" />

        <View style={styles.header}>
          <Text style={styles.pageTitle}>WORKOUT PROGRAMS</Text>
        </View>

        {loading ? (
          <View
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
          >
            <ActivityIndicator size="large" color="#1697D4" />
          </View>
        ) : (
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {programs.map(program => (
              <ProgramSelectionCard
                key={program.id}
                title={program.title}
                description={program.description}
                image={program.image}
                isSelected={selectedId === program.id}
                onPress={() => handleSelectProgram(program)}
              />
            ))}

            <View style={{ height: 100 }} />
          </ScrollView>
        )}
      </SafeAreaView>

      <CustomBottomBar />
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  pageTitle: {
    color: '#0B2D46',
    fontFamily: FONT_FAMILY.MontserratBold,
    fontSize: 18,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    gap: 20,
  },
});

export default WorkoutProgramsScreen;
