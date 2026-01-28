import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { SessionManager } from './session';
import {
  ApiResponse,
  PaginatedResponse,
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  DashboardResponse,
  UpdateUserRequest,
  UserProfileMeResponse,
  GenerateRecommendationRequest,
  RecommendationResponse,
  SanoVitaProgramListItem,
  SanoVitaProgramScheduleData,
  StartWorkoutRequest,
  StartWorkoutResponse,
  CompleteWorkoutRequest,
  QuitWorkoutRequest,
  WorkoutProgram,
  DifficultyLevel,
} from '../types/api';

// ============================================
// API CLIENT CONFIGURATION
// ============================================

const API_URL = 'https://fitness.rizaldiabyannata.dev';

const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// ============================================
// REQUEST INTERCEPTOR - JWT Token Injection
// ============================================

api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await SessionManager.getAccessToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log(`[API] 🟢 ${config.method?.toUpperCase()} ${config.url}`);
    } else {
      // Only log warning for protected routes
      const publicPaths = ['auth', 'recommendations/generate'];
      const isPublic = publicPaths.some(path => config.url?.includes(path));
      if (!isPublic) {
        console.log(`[API] 🔴 No Token for: ${config.url}`);
      }
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// ============================================
// RESPONSE INTERCEPTOR - Error Handling
// ============================================

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string | string[]; error?: string }>) => {
    if (error.response) {
      console.error(`[API ERROR] ${error.response.status}:`, error.response.data);
      
      // Handle token expiration
      if (error.response.status === 401) {
        // Could trigger logout or refresh token here
        console.log('[API] Token expired or invalid');
      }
    } else if (error.request) {
      console.error('[API ERROR] No response received:', error.message);
    }
    return Promise.reject(error);
  }
);

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Extract numeric ID from SanoVita format string ID
 * "prog_1" -> 1, "prog_beginner" -> looks up in mapping
 */
function extractNumericProgramId(id: string | number): number {
  if (typeof id === 'number') return id;
  
  // Handle "prog_X" format
  if (id.startsWith('prog_')) {
    const numericPart = id.replace('prog_', '');
    const parsed = parseInt(numericPart, 10);
    if (!isNaN(parsed)) return parsed;
    
    // Fallback mapping for string levels
    const levelMapping: Record<string, number> = {
      'beginner': 1,
      'intermediate': 2,
      'advanced': 3,
    };
    return levelMapping[numericPart.toLowerCase()] || 1;
  }
  
  // Direct numeric string
  const parsed = parseInt(id, 10);
  return isNaN(parsed) ? 1 : parsed;
}

// ============================================
// AUTH SERVICE
// ============================================

export const authService = {
  /**
   * Login with email/username and password
   */
  login: async (identifier: string, password: string): Promise<ApiResponse<AuthResponse>> => {
    const payload: LoginRequest = {
      emailOrUsername: identifier,
      password: password,
    };
    const response = await api.post<ApiResponse<AuthResponse>>('/api/v1/auth/login', payload);
    return response.data;
  },

  /**
   * Register new user account
   * @param recommendationToken - Optional token from guest recommendation to link data
   */
  register: async (
    username: string,
    email: string,
    password: string,
    recommendationToken?: string
  ): Promise<ApiResponse<AuthResponse>> => {
    const payload: RegisterRequest = {
      username,
      email,
      password,
    };
    const response = await api.post<ApiResponse<AuthResponse>>(
      '/api/v1/auth/register',
      payload,
      {
        params: recommendationToken ? { recommendationToken } : {},
      }
    );
    return response.data;
  },

  /**
   * Refresh access token using refresh token
   */
  refreshToken: async (refreshToken: string): Promise<ApiResponse<{ accessToken: string; refreshToken: string }>> => {
    const response = await api.post('/api/v1/auth/refresh', { refreshToken });
    return response.data;
  },

  /**
   * Logout and invalidate tokens
   */
  logout: async (): Promise<void> => {
    try {
      await api.post('/api/v1/auth/logout');
    } finally {
      await SessionManager.clearSession();
    }
  },
};

// ============================================
// RECOMMENDATION SERVICE
// ============================================

export const recommendationService = {
  /**
   * Generate ML-based workout recommendation
   * For guests, returns a recommendation_token to link with registration
   */
  generate: async (
    physicalData: GenerateRecommendationRequest
  ): Promise<ApiResponse<RecommendationResponse>> => {
    const response = await api.post<ApiResponse<RecommendationResponse>>(
      '/api/v1/recommendations/generate',
      physicalData
    );
    return response.data;
  },

  /**
   * Get cached recommendation for authenticated user
   */
  getCached: async (): Promise<ApiResponse<RecommendationResponse>> => {
    const response = await api.get<ApiResponse<RecommendationResponse>>(
      '/api/v1/recommendations/cached'
    );
    return response.data;
  },
};

// ============================================
// USER SERVICE
// ============================================

export const userService = {
  /**
   * Get user dashboard data
   * Returns: dailyStats, weeklyProgress, activePlan
   */
  getDashboard: async (): Promise<ApiResponse<DashboardResponse>> => {
    const response = await api.get<ApiResponse<DashboardResponse>>('/api/v1/users/dashboard');
    return response.data;
  },

  /**
   * Get current user profile (Me)
   */
  getMe: async (): Promise<ApiResponse<UserProfileMeResponse>> => {
    const response = await api.get<ApiResponse<UserProfileMeResponse>>('/api/v1/users/me');
    return response.data;
  },

  /**
   * Update user profile
   * Can update: username, email, avatar, physical profile data
   */
  updateProfile: async (data: UpdateUserRequest): Promise<ApiResponse<UserProfileMeResponse>> => {
    const response = await api.patch<ApiResponse<UserProfileMeResponse>>('/api/v1/users/me', data);
    return response.data;
  },
};

// ============================================
// PROGRAM SERVICE
// ============================================

export const programService = {
  /**
   * Get all workout programs
   * Returns SanoVita format with string IDs (prog_1, prog_2, etc.)
   */
  getAllPrograms: async (params?: {
    level?: DifficultyLevel;
    category?: 'ALL' | 'MY_PROGRAM';
    page?: number;
    size?: number;
  }): Promise<PaginatedResponse<SanoVitaProgramListItem>> => {
    const response = await api.get<PaginatedResponse<SanoVitaProgramListItem>>(
      '/api/v1/programs',
      { params }
    );
    return response.data;
  },

  /**
   * Get program by ID
   */
  getProgramById: async (programId: number | string): Promise<ApiResponse<WorkoutProgram>> => {
    const numericId = extractNumericProgramId(programId);
    const response = await api.get<ApiResponse<WorkoutProgram>>(`/api/v1/programs/${numericId}`);
    return response.data;
  },

  /**
   * Get program schedule with day details
   * @param programId - Can be numeric ID or "prog_X" format
   * @param day - Day number (1-indexed)
   */
  getProgramSchedule: async (
    programId: number | string,
    day: number = 1
  ): Promise<ApiResponse<SanoVitaProgramScheduleData>> => {
    const numericId = extractNumericProgramId(programId);
    const response = await api.get<ApiResponse<SanoVitaProgramScheduleData>>(
      `/api/v1/programs/${numericId}/schedule`,
      { params: { day } }
    );
    return response.data;
  },
};

// ============================================
// WORKOUT SERVICE
// ============================================

export const workoutService = {
  /**
   * Start a new workout session
   * @param programId - Can be numeric ID or "prog_X" format (will be converted)
   * @param workoutSessionId - The day/session ID within the program
   */
  startSession: async (
    programId: number | string,
    workoutSessionId: number
  ): Promise<ApiResponse<StartWorkoutResponse>> => {
    const numericProgramId = extractNumericProgramId(programId);
    
    const payload: Omit<StartWorkoutRequest, 'userUuid'> = {
      programId: numericProgramId,
      workoutSessionId,
    };
    
    const response = await api.post<ApiResponse<StartWorkoutResponse>>(
      '/api/v1/workouts/start',
      payload
    );
    return response.data;
  },

  /**
   * Complete a workout session
   */
  completeSession: async (
    sessionId: string,
    duration: number,
    calories?: number
  ): Promise<ApiResponse<{ message: string }>> => {
    const payload: CompleteWorkoutRequest = {
      totalDurationSeconds: duration,
      caloriesBurned: calories,
    };
    const response = await api.post<ApiResponse<{ message: string }>>(
      `/api/v1/workouts/${sessionId}/complete`,
      payload
    );
    return response.data;
  },

  /**
   * Quit a workout session early
   */
  quitSession: async (
    sessionId: string,
    duration: number,
    exercisesCompleted: number = 0,
    notes?: string
  ): Promise<ApiResponse<{ message: string }>> => {
    const payload: QuitWorkoutRequest = {
      totalDurationCompleted: duration,
      reason: 'OTHER',
      exercisesCompleted,
      notes: notes || 'User quit via mobile app',
    };
    const response = await api.post<ApiResponse<{ message: string }>>(
      `/api/v1/workouts/${sessionId}/quit`,
      payload
    );
    return response.data;
  },

  /**
   * Record exercise progress within a session
   */
  recordProgress: async (
    sessionId: string,
    exerciseId: number,
    exerciseIndex: number,
    status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'SKIPPED',
    durationPlannedSeconds: number,
    durationCompletedSeconds?: number
  ): Promise<ApiResponse<{ message: string }>> => {
    const response = await api.post<ApiResponse<{ message: string }>>(
      `/api/v1/workouts/${sessionId}/progress`,
      {
        exerciseId,
        exerciseIndex,
        status,
        durationPlannedSeconds,
        durationCompletedSeconds,
      }
    );
    return response.data;
  },

  /**
   * Get workout history for current user
   */
  getHistory: async (page: number = 1, size: number = 10): Promise<PaginatedResponse<any>> => {
    const response = await api.get<PaginatedResponse<any>>('/api/v1/workouts/history', {
      params: { page, size },
    });
    return response.data;
  },
};

// ============================================
// STATISTICS SERVICE
// ============================================

export const statisticsService = {
  /**
   * Get user workout statistics
   */
  getStats: async (): Promise<ApiResponse<any>> => {
    const response = await api.get<ApiResponse<any>>('/api/v1/statistics');
    return response.data;
  },

  /**
   * Get weekly statistics
   */
  getWeeklyStats: async (): Promise<ApiResponse<any>> => {
    const response = await api.get<ApiResponse<any>>('/api/v1/statistics/weekly');
    return response.data;
  },
};

export default api;
