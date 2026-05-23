import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// ─────────────────────────────────────────────────────────
//  Production: Render cloud backend (works on any phone, 24/7)
//  Development: swap to your local IP e.g. 'http://192.168.1.7:5000/api'
// ─────────────────────────────────────────────────────────
export const API_BASE_URL = 'https://localbiz-backend-xvf2.onrender.com/api';

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
