import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageSourcePropType,
} from 'react-native';
import { FONT_FAMILY } from '../../constants/fonts';
import { formatDuration } from '../../utils/timeHelper';

interface ExerciseItemProps {
  name: string;
  duration: number | string;
  image: ImageSourcePropType;
  onPress: () => void;
}

const ExerciseItem: React.FC<ExerciseItemProps> = ({
  name,
  duration,
  image,
  onPress,
}) => (
  <TouchableOpacity
    style={styles.exerciseCard}
    onPress={onPress}
    activeOpacity={0.8}
  >
    <Image source={image} style={styles.exerciseImage} />
    <View style={styles.exerciseInfo}>
      <Text style={styles.exerciseName}>{name}</Text>
      <Text style={styles.exerciseDuration}>
        {formatDuration(
          typeof duration === 'string' ? parseInt(duration) : duration,
        )}
      </Text>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  exerciseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0A659A',
    borderRadius: 12,
    overflow: 'hidden',
    padding: 10,
    marginBottom: 10,
  },
  exerciseImage: {
    width: 50,
    height: 50,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  exerciseInfo: {
    flex: 1,
    paddingHorizontal: 15,
    justifyContent: 'center',
  },
  exerciseName: {
    color: '#FFF',
    fontFamily: FONT_FAMILY.PoppinsSemiBold,
    fontSize: 14,
    textTransform: 'uppercase',
  },
  exerciseDuration: {
    color: '#8CAAB9',
    fontSize: 10,
    marginTop: 2,
  },
});

export default ExerciseItem;
