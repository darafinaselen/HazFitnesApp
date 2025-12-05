import React from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { RootStackParamList } from '../../navigation/AppNavigator';
import { Exercise } from '../../types/programTypes';
import { FONT_FAMILY } from '../../constants/fonts';
import colors from '../../constants/color';
import ExerciseItem from './ExerciseItem';

interface ProgramSectionProps {
  title: string;
  data: Exercise[];
  workoutCategory: string;
  onUpdateDuration: (id: string, newDuration: number) => void;
  isActive: boolean;
  onToggle: (val: boolean) => void;
}

const CustomSwitch = ({
  value,
  onValueChange,
}: {
  value: boolean;
  onValueChange: (val: boolean) => void;
}) => (
  <Switch
    trackColor={{ false: '#767577', true: '#10486A' }}
    thumbColor={value ? '#FFFFFF' : '#f4f3f4'}
    ios_backgroundColor="#3e3e3e"
    onValueChange={onValueChange}
    value={value}
    style={{ transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }] }}
  />
);

const ProgramSection: React.FC<ProgramSectionProps> = ({
  title,
  data,
  workoutCategory,
  onUpdateDuration,
  isActive,
  onToggle,
}) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const getCategoryName = () => {
    if (title === 'WARM UP') return 'Warm Up';
    if (title === 'COOL DOWN') return 'Cool Down';
    return workoutCategory;
  };

  if (!data || data.length === 0) return null;

  return (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <CustomSwitch value={isActive} onValueChange={onToggle} />
      </View>

      {isActive && (
        <View style={styles.exerciseList}>
          {data.map((item, index) => (
            <ExerciseItem
              key={index}
              name={item.name}
              duration={item.duration}
              image={item.image}
              onPress={() =>
                navigation.navigate('ExerciseDetail', {
                  exerciseId: item.id.toString(),
                  name: item.name,
                  duration:
                    typeof item.duration === 'string'
                      ? parseInt(item.duration)
                      : item.duration,
                  category: getCategoryName(),
                  image: item.image,
                  description: item.description || 'Deskripsi belum tersedia.',
                  onSave: onUpdateDuration,
                })
              }
            />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: { marginBottom: 20, zIndex: 1 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    color: colors.text,
    fontFamily: FONT_FAMILY.MontserratExtraBold,
    fontSize: 15,
    textTransform: 'uppercase',
  },
  exerciseList: { gap: 10 },
});

export default ProgramSection;
