import { create } from 'zustand';
import { Business, SearchFilters } from '../constants/types';
import { api } from '../config/api';

interface LocationCoords { latitude: number; longitude: number; }

interface BusinessState {
  businesses: Business[];
  filteredBusinesses: Business[];
  selectedBusiness: Business | null;
  searchQuery: string;
  filters: SearchFilters;
  userLocation: LocationCoords;
  isLoading: boolean;
  error: string | null;
  fetchBusinesses: () => Promise<void>;
  searchBusinesses: (query: string) => void;
  applyFilters: (filters: SearchFilters) => void;
  resetFilters: () => void;
  selectBusiness: (b: Business | null) => void;
  setUserLocation: (loc: LocationCoords) => void;
  getBusinessById: (id: string) => Business | undefined;
}

const DEFAULT_FILTERS: SearchFilters = {
  category: 'all', maxDistance: 10, minRating: 0,
  priceRange: [1, 2, 3, 4], isOpen: false, sortBy: 'distance',
};

// ── KEY FIX ──
// MongoDB stores location as GeoJSON: { type: 'Point', coordinates: [lng, lat] }
// react-native-maps needs: { latitude: number, longitude: number }
// This function normalises every business coming from the API
const normaliseBusiness = (b: any): Business => {
  let latitude  = b.location?.latitude;
  let longitude = b.location?.longitude;

  // If coordinates array exists, extract lat/lng from it
  if (!latitude && b.location?.coordinates?.length === 2) {
    longitude = b.location.coordinates[0]; // GeoJSON is [lng, lat]
    latitude  = b.location.coordinates[1];
  }

  return {
    ...b,
    id: b._id ?? b.id,
    location: { latitude, longitude },
  };
};

export const useBusinessStore = create<BusinessState>((set, get) => ({
  businesses: [],
  filteredBusinesses: [],
  selectedBusiness: null,
  searchQuery: '',
  filters: DEFAULT_FILTERS,
  userLocation: { latitude: 28.4089, longitude: 77.3178 },
  isLoading: false,
  error: null,

  fetchBusinesses: async () => {
    set({ isLoading: true, error: null });
    const { userLocation, filters } = get();
    try {
      const res = await api.get('/businesses/nearby', {
        params: {
          lat:       userLocation.latitude,
          lng:       userLocation.longitude,
          distance:  filters.maxDistance ?? 10,
          category:  filters.category !== 'all' ? filters.category : undefined,
          minRating: filters.minRating || undefined,
          sort:      filters.sortBy ?? 'distance',
          isOpen:    filters.isOpen || undefined,
        },
      });
      // Normalise every business so location is always { latitude, longitude }
      const businesses: Business[] = res.data.data.map(normaliseBusiness);
      set({ businesses, filteredBusinesses: businesses, isLoading: false });
    } catch (err: any) {
      const msg = err.response?.data?.error || err.message || 'Failed to load businesses';
      set({ isLoading: false, error: msg });
    }
  },

  searchBusinesses: async (query: string) => {
    set({ searchQuery: query });
    if (!query.trim()) {
      set({ filteredBusinesses: get().businesses });
      return;
    }
    try {
      const res = await api.get('/businesses/search', {
        params: { q: query, lat: get().userLocation.latitude, lng: get().userLocation.longitude },
      });
      set({ filteredBusinesses: res.data.data.map(normaliseBusiness) });
    } catch {
      const q = query.toLowerCase();
      const filtered = get().businesses.filter(b =>
        b.name.toLowerCase().includes(q) ||
        (b.tags as any)?.some((t: string) => t.toLowerCase().includes(q)) ||
        b.category.toLowerCase().includes(q)
      );
      set({ filteredBusinesses: filtered });
    }
  },

  applyFilters: (filters) => {
    set({ filters });
    get().fetchBusinesses();
  },

  resetFilters: () => {
    set({ filters: DEFAULT_FILTERS, searchQuery: '' });
    get().fetchBusinesses();
  },

  selectBusiness: (business) => set({ selectedBusiness: business }),

  setUserLocation: (location) => {
    set({ userLocation: location });
    get().fetchBusinesses();
  },

  getBusinessById: (id) =>
    get().businesses.find(b => b.id === id || (b as any)._id === id),
}));
