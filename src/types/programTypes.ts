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
  title?: string;
  subtitle?: string;
  category?: string;
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

// ==========================================
// API TYPES (Response dari Backend SanoVita)
// ==========================================

export interface SanoVitaExercise {
  id: string;
  name: string;
  duration_seconds: number;
  duration_display: string;
  image_url: string;
}

export interface SanoVitaSection {
  section_name: string;
  exercises: SanoVitaExercise[];
}

export interface SanoVitaDayDetail {
  day_id: number;
  title: string;
  total_time: string;
  total_exercises: number;
  workout_sections: SanoVitaSection[];
}

export interface SanoVitaScheduleSummary {
  day_id: number;
  label: string;
  duration_minutes: number;
  exercise_count: number;
  is_active: boolean;
}
