import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { SessionManager } from './session';

const API_URL = 'https://fitness.rizaldiabyannata.dev';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor Token
api.interceptors.request.use(
  async config => {
    const token = await SessionManager.getAccessToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log(`[API] 🟢 ${config.method?.toUpperCase()} ${config.url}`);
    } else {
      if (
        !config.url?.includes('auth') &&
        !config.url?.includes('recommendations')
      ) {
        console.log(`[API REQUEST] 🔴 No Token found for: ${config.url}`);
      }
    }
    return config;
  },
  error => Promise.reject(error),
);

export const authService = {
  login: async (identifier: string, password: string) => {
    const response = await api.post('/api/v1/auth/login', {
      emailOrUsername: identifier,
      password: password,
    });
    return response.data;
  },

  register: async (
    username: string,
    email: string,
    pass: string,
    recToken?: string,
  ) => {
    const response = await api.post(
      '/api/v1/auth/register',
      {
        username: username,
        email: email,
        password: pass,
      },
      {
        params: recToken ? { recommendationToken: recToken } : {},
      },
    );
    return response.data;
  },
};

export const recommendationService = {
  generate: async (physicalData: any) => {
    const response = await api.post(
      '/api/v1/recommendations/generate',
      physicalData,
    );
    return response.data;
  },
};

export const userService = {
  getDashboard: async () => {
    try {
      const response = await api.get('/api/v1/users/dashboard');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching dashboard:', error);
      if (error.response) {
        console.log('Server Status:', error.response.status);
        console.log(
          'Server Data:',
          JSON.stringify(error.response.data, null, 2),
        );
      }
      throw error;
    }
  },
};

export const programService = {
  getAllPrograms: async () => {
    const response = await api.get('/api/v1/programs');
    return response.data;
  },

  getProgramSchedule: async (programId: number | string, day: number = 1) => {
    // Usually backend expects numeric ID, but frontend might pass 'beginner' string initially.
    // Assuming backend handles mapped strings or we purely use IDs.
    // Based on frontend code, it passes 'beginner', 'intermediet'.
    // Backend likely handles this or we need to align.
    // Let's assume the endpoint handles it or returns correct ID in list first.
    const response = await api.get(`/api/v1/programs/${programId}/schedule`, {
      params: { day: day },
    });
    return response.data;
  },
};

export const workoutService = {
  startSession: async (programId: number, dayNumber: number) => {
    const response = await api.post('/api/v1/workouts/start', {
      programId,
      dayNumber,
    });
    return response.data;
  },

  completeSession: async (
    sessionId: string,
    duration: number,
    calories: number,
  ) => {
    const response = await api.post(`/api/v1/workouts/${sessionId}/complete`, {
      totalDuration: duration,
      caloriesBurned: calories,
    });
    return response.data;
  },

  quitSession: async (sessionId: string, duration: number) => {
    const response = await api.post(`/api/v1/workouts/${sessionId}/quit`, {
      duration,
      reason: 'USER_QUIT',
    });
    return response.data;
  },
};

export default api;
