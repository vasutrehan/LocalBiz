export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: 'customer' | 'owner' | 'admin';
  savedBusinessIds: string[];
  createdAt: string;
}

export interface Business {
  id: string;
  ownerId: string;
  name: string;
  description: string;
  category: string;
  subcategory?: string;
  address: string;
  city: string;
  pincode: string;
  location: {
    latitude: number;
    longitude: number;
  };
  phone: string;
  whatsapp: string;
  email?: string;
  website?: string;
  images: string[];
  coverImage: string;
  logo?: string;
  openingHours: OpeningHours;
  tags: string[];
  rating: number;
  totalReviews: number;
  distance?: number;       // km, computed client-side
  isVerified: boolean;
  isOpen?: boolean;        // computed from openingHours
  priceRange: 1 | 2 | 3 | 4;  // ₹ to ₹₹₹₹
  features: string[];
  createdAt: string;
  updatedAt: string;
}

export interface OpeningHours {
  monday:    DayHours;
  tuesday:   DayHours;
  wednesday: DayHours;
  thursday:  DayHours;
  friday:    DayHours;
  saturday:  DayHours;
  sunday:    DayHours;
}

export interface DayHours {
  open: boolean;
  from: string;  // "09:00"
  to: string;    // "21:00"
}

export interface Review {
  id: string;
  businessId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  text: string;
  images?: string[];
  ownerReply?: string;
  helpful: number;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  body: string;
  type: 'promo' | 'review' | 'system' | 'new_business';
  read: boolean;
  data?: Record<string, string>;
  createdAt: string;
}

export interface SearchFilters {
  category?: string;
  maxDistance?: number;   // km
  minRating?: number;
  priceRange?: number[];
  isOpen?: boolean;
  sortBy?: 'distance' | 'rating' | 'newest' | 'popular';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface ApiError {
  message: string;
  code: string;
  statusCode: number;
}

export interface RecommendedBusiness extends Business {
  score: number;
  reason: string; // "Because you liked X" | "Popular near you"
}
