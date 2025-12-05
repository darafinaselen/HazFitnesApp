import { ImageSourcePropType } from 'react-native';

export interface Exercise {
  id: string;
  name: string;
  duration: number | string;
  image: ImageSourcePropType;
  video: { uri: string };
  description: string;
}

export interface ProgramDay {
  id: number;
  dayTitle: string;
  subtitle: string;
  warmUp: Exercise[];
  exercises: Exercise[];
  coolDown: Exercise[];
}
