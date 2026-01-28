/**
 * API Type Definitions
 * Synchronized with fitnessapp-be-express backend schemas
 */

// ============================================
// COMMON TYPES
// ============================================

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    size: number;
    total: number;
    totalPages: number;
  };
}

// ============================================
// AUTH TYPES (from auth.schemas.ts)
// ============================================

export interface LoginRequest {
  emailOrUsername: string;
  password: string;
  deviceId?: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
}

export interface UserResponse {
  userUuid: string;
  user_id?: string; // Alias for mobile compatibility
  id?: number;
  username: string;
  email: string;
  role: 'USER' | 'ADMIN';
  googleId: string | null;
  avatar: string | null;
  createdAt: string;
}

export interface AuthResponse {
  user: UserResponse;
  tokens: TokenResponse;
}

// ============================================
// USER & DASHBOARD TYPES (from user.schemas.ts)
// ============================================

export type Gender = 'MALE' | 'FEMALE' | 'OTHER';

export interface UserPhysicalProfile {
  name: string;
  phone: string;
  gender: Gender;
  birth: string;
  age: string;
  height: string; // in cm
  weight: string; // in kg
}

export interface UpdateUserRequest {
  username?: string;
  email?: string;
  avatar?: string;
  name?: string;
  phone?: string;
  gender?: Gender;
  birth?: string;
  age?: string | number;
  height?: string | number;
  weight?: string | number;
}

export interface DailyStats {
  totalMinutes: number;
  caloriesBurned: number;
  workoutsCompleted: number;
  steps: {
    current: number;
    target: number;
    percentage: number;
  };
  streak: number;
}

export interface WeeklyChartData {
  day: string;
  value: number;
  isToday: boolean;
}

export interface WeeklyProgress {
  chartData: WeeklyChartData[];
  consistency: string;
}

export interface ActivePlan {
  id: number;
  title: string;
  progress: string;
  nextSessionDuration: number;
}

export interface DashboardResponse {
  user: {
    firstName: string;
    avatar: string | null;
  };
  dailyStats: DailyStats;
  weeklyProgress: WeeklyProgress;
  activePlan: ActivePlan | null;
}

export interface UserProfileMeResponse {
  name: string;
  email: string;
  gender: string | null;
  age: number | null;
  height: string | null;
  weight: string | null;
  goal: string | null;
  healthCondition: string | null;
}

// ============================================
// RECOMMENDATION TYPES (from recommendation.schemas.ts)
// ============================================

export type FitnessGoal = 'Weight Gain' | 'Weight Loss';
export type FitnessType = 'Cardio Fitness' | 'Muscular Fitness';
export type YesNo = 'Yes' | 'No';

export interface GenerateRecommendationRequest {
  sex: 'Male' | 'Female';
  age: number;
  height: number; // in meters
  weight: number; // in kg
  hypertension: YesNo;
  diabetes: YesNo;
  fitness_goal: FitnessGoal;
  fitness_type: FitnessType;
  deviceId?: string;
}

export interface RecommendationResponse {
  user_id: string | null;
  recommendation_token: string | null;
  is_guest: boolean;
  bmi: number;
  fitness_level: string;
  recommended_exercise: string;
  recommended_equipment: string;
}

// ============================================
// WORKOUT & PROGRAM TYPES (from workout.schemas.ts)
// ============================================

export type DifficultyLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
export type UserWorkoutStatus = 'IN_PROGRESS' | 'COMPLETED' | 'QUIT' | 'PAUSED';
export type ExerciseSessionStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'SKIPPED';
export type QuitReasonType = 'TIRED' | 'TIME_CONSTRAINT' | 'INJURY' | 'OTHER';

// Backend Program model (direct from DB)
export interface WorkoutProgram {
  id: number;
  name: string;
  level: DifficultyLevel;
  description: string | null;
  createdAt?: string;
}

// SanoVita UI format (transformed by backend)
export interface SanoVitaProgramListItem {
  id: string; // Format: "prog_{numericId}" e.g., "prog_1"
  title: string;
  description: string;
  is_selected: boolean;
  icon_url: string;
}

export interface StartWorkoutRequest {
  programId: number;
  workoutSessionId: number;
  // userUuid is injected by backend from auth token
}

export interface StartWorkoutResponse {
  sessionId: string;
  programId: number;
  workoutSessionId: number;
  status: UserWorkoutStatus;
  startedAt: string;
}

export interface CompleteWorkoutRequest {
  totalDurationSeconds: number;
  caloriesBurned?: number;
}

export interface QuitWorkoutRequest {
  reason: QuitReasonType;
  totalDurationCompleted: number;
  exercisesCompleted: number;
  notes?: string;
}

export interface RecordProgressRequest {
  exerciseId: number;
  exerciseIndex: number;
  durationPlannedSeconds: number;
  durationCompletedSeconds?: number;
  status: ExerciseSessionStatus;
  sessionExerciseId?: number;
}

// ============================================
// PROGRAM SCHEDULE TYPES (SanoVita format)
// ============================================

export interface SanoVitaScheduleSummary {
  day_id: number;
  label: string;
  duration_minutes: number;
  exercise_count: number;
  is_active: boolean;
}

export interface SanoVitaExerciseItem {
  id: string;
  name: string;
  duration_seconds: number;
  duration_display: string;
  image_url: string;
}

export interface SanoVitaWorkoutSection {
  section_name: string;
  exercises: SanoVitaExerciseItem[];
}

export interface SanoVitaDayDetail {
  day_id: number;
  title: string;
  total_time: string;
  total_exercises: number;
  workout_sections: SanoVitaWorkoutSection[];
}

export interface SanoVitaProgramScheduleData {
  program_name: string;
  schedule_summary: SanoVitaScheduleSummary[];
  current_day_detail: SanoVitaDayDetail;
}

export interface SanoVitaProgramScheduleResponse {
  status: 'success';
  data: SanoVitaProgramScheduleData;
}

// ============================================
// STATISTICS TYPES
// ============================================

export interface WorkoutStats {
  totalWorkouts: number;
  completedWorkouts: number;
  totalDurationMinutes: number;
  totalCaloriesBurned: number;
  totalDistanceKm: number;
  averagePace: string | null;
  currentStreak: number;
  longestStreak: number;
}
