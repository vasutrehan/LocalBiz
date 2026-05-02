import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// ─────────────────────────────────────────────────────────
//  ONLY CHANGE THIS LINE — put your Windows IP here
//  Run `ipconfig` in cmd → look for IPv4 Address
//  Example: 'http://192.168.1.5:5000/api'
// ─────────────────────────────────────────────────────────
export const API_BASE_URL = ' http://192.168.1.4:5000/api';

// Axios instance shared across all stores
export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Auto-attach JWT token to every request
api.interceptors.request.use(async (config) => {
  try {
    const token = await SecureStore.getItemAsync('localbiz_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  } catch {}
  return config;
});

// Handle 401 globally
api.interceptors.response.use(
  res => res,
  async err => {
    if (err.response?.status === 401) {
      await SecureStore.deleteItemAsync('localbiz_token');
    }
    return Promise.reject(err);
  }
);

// Helper to save/clear token
export const saveToken = (token: string) => SecureStore.setItemAsync('localbiz_token', token);
export const clearToken = () => SecureStore.deleteItemAsync('localbiz_token');
