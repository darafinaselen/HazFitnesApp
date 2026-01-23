import * as SecureStore from 'expo-secure-store';

// Penyimpanan
const KEY_ACCESS_TOKEN = 'user_token';
const KEY_REFRESH_TOKEN = 'user_refresh_token';

export const SessionManager = {
  saveSession: async (accessToken: string, refreshToken?: string) => {
    await SecureStore.setItemAsync(KEY_ACCESS_TOKEN, accessToken);
    if (refreshToken) {
      await SecureStore.setItemAsync(KEY_REFRESH_TOKEN, refreshToken);
    }
  },

  getAccessToken: async () => {
    return await SecureStore.getItemAsync(KEY_ACCESS_TOKEN);
  },

  getRefreshToken: async () => {
    return await SecureStore.getItemAsync(KEY_REFRESH_TOKEN);
  },

  clearSession: async () => {
    await SecureStore.deleteItemAsync(KEY_ACCESS_TOKEN);
    await SecureStore.deleteItemAsync(KEY_REFRESH_TOKEN);
  },

  isLoggedIn: async () => {
    const token = await SecureStore.getItemAsync(KEY_ACCESS_TOKEN);
    return !!token;
  },
};
