import { create } from 'zustand';
import { User } from '../constants/types';
import { api, saveToken, clearToken } from 'src/config/api';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, phone: string, role?: string) => Promise<void>;
  logout: () => Promise<void>;
  loadUser: () => Promise<void>;
  updateUser: (updates: Partial<User>) => void;
  toggleSaved: (businessId: string) => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.post('/auth/login', { email, password });
      const { user, token } = res.data;
      await saveToken(token);
      set({ user, token, isAuthenticated: true, isLoading: false });
    } catch (err: any) {
      const msg = err.response?.data?.error || 'Login failed. Check your credentials.';
      set({ isLoading: false, error: msg });
      throw new Error(msg);
    }
  },

  register: async (name, email, password, phone, role) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.post('/auth/register', role ? { name, email, password, phone, role } : { name, email, password, phone });
      const { user, token } = res.data;
      await saveToken(token);
      set({ user, token, isAuthenticated: true, isLoading: false });
    } catch (err: any) {
      const msg = err.response?.data?.error || 'Registration failed.';
      set({ isLoading: false, error: msg });
      throw new Error(msg);
    }
  },

  loadUser: async () => {
    set({ isLoading: true });
    try {
      const res = await api.get('/auth/me');
      set({ user: res.data.data, isAuthenticated: true, isLoading: false });
    } catch {
      set({ user: null, token: null, isAuthenticated: false, isLoading: false });
      await clearToken();
    }
  },

  logout: async () => {
    await clearToken();
    set({ user: null, token: null, isAuthenticated: false });
  },

  updateUser: (updates) => {
    const { user } = get();
    if (user) set({ user: { ...user, ...updates } });
  },

  toggleSaved: async (businessId) => {
    const { user } = get();
    if (!user) return;
    const savedIds = user.savedBusinessIds || [];
    const alreadySaved = savedIds.includes(businessId);
    const newSaved = alreadySaved
      ? savedIds.filter(id => id !== businessId)
      : [...savedIds, businessId];
    set({ user: { ...user, savedBusinessIds: newSaved } });
    try {
      await api.put(`/auth/saved/${businessId}`);
    } catch {
      set({ user: { ...user, savedBusinessIds: user.savedBusinessIds } });
    }
  },

  clearError: () => set({ error: null }),
}));
