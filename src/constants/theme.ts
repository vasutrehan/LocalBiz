export const Colors = {
  primary: '#FF5C35',       // Vivid coral-orange — brand energy
  primaryDark: '#E04420',
  primaryLight: '#FF8264',
  primaryMuted: '#FFF0EC',

  accent: '#1A1A2E',        // Deep midnight navy
  accentSoft: '#252545',

  surface: '#FFFFFF',
  surfaceAlt: '#F7F6F3',    // Warm off-white
  surfaceCard: '#FFFFFF',

  text: '#1A1A2E',
  textSecondary: '#6B6B8A',
  textTertiary: '#A0A0B8',
  textInverse: '#FFFFFF',

  border: '#EBEBF0',
  borderStrong: '#D0D0DC',

  success: '#22C55E',
  successLight: '#DCFCE7',
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
  error: '#EF4444',
  errorLight: '#FEE2E2',

  mapOverlay: 'rgba(26,26,46,0.85)',
  shimmer1: '#F0EFEC',
  shimmer2: '#E8E7E3',

  // Category colors
  catFood: '#FF5C35',
  catHealth: '#22C55E',
  catShopping: '#8B5CF6',
  catServices: '#3B82F6',
  catEducation: '#F59E0B',
  catSports: '#EC4899',
};

export const Typography = {
  // Display – Syne (geometric, confident)
  display: 'Syne_700Bold',
  displayMed: 'Syne_600SemiBold',

  // Body – DM Sans (humanist, readable)
  bodyBold: 'DMSans_700Bold',
  bodySemiBold: 'DMSans_500Medium',
  bodyRegular: 'DMSans_400Regular',

  sizes: {
    xs: 11,
    sm: 13,
    base: 15,
    md: 17,
    lg: 20,
    xl: 24,
    '2xl': 30,
    '3xl': 36,
    '4xl': 44,
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 48,
  '4xl': 64,
};

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 28,
  full: 9999,
};

export const Shadow = {
  sm: {
    shadowColor: '#1A1A2E',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#1A1A2E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 12,
    elevation: 5,
  },
  lg: {
    shadowColor: '#1A1A2E',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.14,
    shadowRadius: 24,
    elevation: 10,
  },
  primary: {
    shadowColor: '#FF5C35',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.30,
    shadowRadius: 16,
    elevation: 8,
  },
};

export const CATEGORIES = [
  { id: 'all', label: 'All', icon: '✦', color: Colors.primary },
  { id: 'food', label: 'Food', icon: '🍜', color: Colors.catFood },
  { id: 'health', label: 'Health', icon: '💊', color: Colors.catHealth },
  { id: 'shopping', label: 'Shopping', icon: '🛍', color: Colors.catShopping },
  { id: 'services', label: 'Services', icon: '🔧', color: Colors.catServices },
  { id: 'education', label: 'Education', icon: '📚', color: Colors.catEducation },
  { id: 'sports', label: 'Sports', icon: '⚽', color: Colors.catSports },
];

export const SORT_OPTIONS = [
  { id: 'distance', label: 'Nearest first' },
  { id: 'rating', label: 'Highest rated' },
  { id: 'newest', label: 'Newest' },
  { id: 'popular', label: 'Most popular' },
];
