import { ImageSourcePropType } from 'react-native';

/**
 * Local Exercise representation used by UI components
 * Can be created from backend SanoVitaExerciseItem
 */
export interface Exercise {
  id: string;
  name: string;
  duration: number | string; // seconds or formatted string
  image: ImageSourcePropType | { uri: string };
  video: { uri: string };
  description: string;
}

/**
 * Local ProgramDay representation used by UI components
 * Can be created from backend SanoVitaDayDetail
 */
export interface ProgramDay {
  id: number;
  dayTitle: string;
  subtitle: string;
  warmUp: Exercise[];
  exercises: Exercise[];
  coolDown: Exercise[];
}
