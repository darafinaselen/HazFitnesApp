import * as SecureStore from 'expo-secure-store';

// Penyimpanan
const KEY_ACCESS_TOKEN = 'user_token';
const KEY_REFRESH_TOKEN = 'user_refresh_token';
const KEY_USER_UUID = 'user_uuid';

export const SessionManager = {
  saveSession: async (
    accessToken: string,
    refreshToken: string,
    userUuid: string,
  ) => {
    await SecureStore.setItemAsync(KEY_ACCESS_TOKEN, accessToken);
    await SecureStore.setItemAsync(KEY_REFRESH_TOKEN, refreshToken);
    await SecureStore.setItemAsync(KEY_USER_UUID, userUuid);
  },

  getAccessToken: async () => {
    return await SecureStore.getItemAsync(KEY_ACCESS_TOKEN);
  },

  getRefreshToken: async () => {
    return await SecureStore.getItemAsync(KEY_REFRESH_TOKEN);
  },

  getUserUuid: async () => {
    return await SecureStore.getItemAsync(KEY_USER_UUID);
  },

  clearSession: async () => {
    await SecureStore.deleteItemAsync(KEY_ACCESS_TOKEN);
    await SecureStore.deleteItemAsync(KEY_REFRESH_TOKEN);
    await SecureStore.deleteItemAsync(KEY_USER_UUID);
  },

  isLoggedIn: async () => {
    const token = await SecureStore.getItemAsync(KEY_ACCESS_TOKEN);
    return !!token;
  },
};
