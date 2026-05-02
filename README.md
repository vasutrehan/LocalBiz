# 🏪 LocalBiz — React Native App

> A smart hyperlocal platform for local business discovery and communication.
> Built with **Expo + React Native (TypeScript)**, **Zustand**, **React Query**, and **Expo Router**.

---

## 📁 Project Structure

```
LocalBiz/
├── app/                          # Expo Router file-based routing
│   ├── _layout.tsx               # Root layout (fonts, stack navigator)
│   ├── index.tsx                 # Entry redirect
│   ├── onboarding.tsx            # Onboarding flow
│   ├── login.tsx                 # Login screen
│   ├── register.tsx              # Registration screen
│   ├── filters.tsx               # Filter modal (bottom sheet)
│   ├── notifications.tsx         # Notifications screen
│   ├── business/[id].tsx         # Business detail page (dynamic route)
│   ├── write-review/[id].tsx     # Write review modal
│   └── (tabs)/
│       ├── _layout.tsx           # Custom tab bar
│       ├── index.tsx             # Home / Discovery feed
│       ├── map.tsx               # Map explorer
│       ├── recommendations.tsx   # AI For You tab
│       ├── saved.tsx             # Saved/Favourites
│       └── profile.tsx           # User profile
│
├── src/
│   ├── screens/                  # All screen components
│   │   ├── HomeScreen.tsx
│   │   ├── BusinessDetailScreen.tsx
│   │   ├── MapScreen.tsx
│   │   ├── RecommendationsScreen.tsx
│   │   ├── SavedScreen.tsx
│   │   ├── ProfileScreen.tsx
│   │   ├── LoginScreen.tsx
│   │   ├── RegisterScreen.tsx
│   │   ├── OnboardingScreen.tsx
│   │   ├── FiltersScreen.tsx
│   │   └── WriteReviewScreen.tsx
│   │
│   ├── components/               # Reusable UI components
│   │   ├── UI.tsx                # Button, Badge, StarRating, Skeleton, etc.
│   │   ├── BusinessCard.tsx      # Card (default / compact / featured)
│   │   ├── SearchBar.tsx
│   │   └── CategoryPills.tsx
│   │
│   ├── store/                    # Zustand global state
│   │   ├── authStore.ts          # User auth, login, logout, saved toggle
│   │   └── businessStore.ts      # Businesses, search, filters, location
│   │
│   └── constants/
│       ├── theme.ts              # Colors, Typography, Spacing, Shadow tokens
│       ├── types.ts              # All TypeScript interfaces
│       └── mockData.ts           # Realistic seed data (Faridabad businesses)
│
├── app.json                      # Expo config
├── babel.config.js
├── tsconfig.json
└── package.json
```

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18+
- Expo CLI: `npm install -g expo-cli`
- Expo Go app on your Android/iOS device

### 2. Install dependencies
```bash
cd LocalBiz
npm install

# Install Google Fonts packages
npx expo install @expo-google-fonts/syne @expo-google-fonts/dm-sans expo-splash-screen
```

### 3. Run the app
```bash
npx expo start
```
Scan the QR code with Expo Go on your phone.

---

## 🔑 Connecting to the Real Backend

All API calls are currently mocked. To connect to your Node.js backend:

### In `src/store/authStore.ts`
```ts
// Replace mock with:
import axios from 'axios';
const API = 'http://YOUR_BACKEND_URL/api';

login: async (email, password) => {
  const res = await axios.post(`${API}/auth/login`, { email, password });
  const { user, token } = res.data;
  set({ user, token, isAuthenticated: true });
}
```

### In `src/store/businessStore.ts`
```ts
fetchBusinesses: async () => {
  const { userLocation } = get();
  const res = await axios.get(`${API}/businesses`, {
    params: { lat: userLocation?.latitude, lng: userLocation?.longitude }
  });
  set({ businesses: res.data.data });
}
```

---

## 🗺 Adding Real Maps (react-native-maps)

In `MapScreen.tsx`, replace the placeholder with:
```tsx
import MapView, { Marker } from 'react-native-maps';

<MapView
  style={StyleSheet.absoluteFillObject}
  initialRegion={{
    latitude: userLocation?.latitude ?? 28.4089,
    longitude: userLocation?.longitude ?? 77.3178,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  }}
>
  {filteredBusinesses.map(b => (
    <Marker
      key={b.id}
      coordinate={b.location}
      title={b.name}
      onPress={() => handleMarkerPress(b, index)}
    />
  ))}
</MapView>
```

---

## 🤖 Connecting AI Recommendations

Your Python FastAPI service returns recommended businesses:
```ts
// In RecommendationsScreen.tsx
const res = await axios.get(`${ML_API}/recommend`, {
  params: { userId: user.id, lat: userLocation.latitude, lng: userLocation.longitude }
});
```

---

## 📱 Screens Summary

| Screen | Description |
|--------|-------------|
| Onboarding | 4-slide animated intro |
| Login | Email/password + Google OAuth |
| Register | Full user registration |
| Home | Feed with featured + nearby businesses |
| Map | Interactive map with pins + bottom cards |
| For You | AI recommendations with tabs |
| Saved | User's saved businesses |
| Profile | User info, settings, logout |
| Business Detail | Full profile, gallery, reviews, WhatsApp CTA |
| Write Review | Star rating + text review |
| Filters | Sort, distance, rating, price, open now |
| Notifications | Read/unread push notifications |

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| Primary | `#FF5C35` (Coral Orange) |
| Accent | `#1A1A2E` (Midnight Navy) |
| Display Font | Syne Bold |
| Body Font | DM Sans |
| Border Radius | 8 / 12 / 16 / 20 / 28 / full |

---

## 👨‍💻 Author

**Vasu Trehan** | B.Tech CSE | Dr. ADGIPS (2022–26)  
Major Project under Ms. Apurva Jain
