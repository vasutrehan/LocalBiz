# 🏪 LocalBiz — Hyperlocal Business Discovery App

<p align="center">
  <img src="https://img.shields.io/badge/React_Native-0.83-61DAFB?style=for-the-badge&logo=react" />
  <img src="https://img.shields.io/badge/Expo-55-000020?style=for-the-badge&logo=expo" />
  <img src="https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript" />
  <img src="https://img.shields.io/badge/Zustand-4.x-orange?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Platform-Android-3DDC84?style=for-the-badge&logo=android" />
</p>

<p align="center">
  <b>Find local businesses near you — powered by GPS, AI recommendations, and real-time data.</b>
</p>

---

## 📲 Download & Try

[![Download APK](https://img.shields.io/badge/⬇️_Download_APK-LocalBiz_v1.0-FF5C35?style=for-the-badge)](https://github.com/vasutrehan/localbiz/releases/latest)

> Install the `.apk` on any Android phone — no Play Store needed.

---

## 🔗 Related Repos

| Service | Repo | Live URL |
|---------|------|----------|
| 🖥️ Node.js Backend | [localbiz-backend](https://github.com/vasutrehan/localbiz-backend) | `https://localbiz-backend-xvf2.onrender.com/api` |
| 🤖 Python ML Service | [localbiz-ml](https://github.com/vasutrehan/localbiz-ml) | `https://localbiz-ml.onrender.com` |

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 📍 GPS Discovery | Find businesses within a custom radius using live location |
| 🗺️ Interactive Map | Google Maps with category-colored pins and card sync |
| 🤖 AI For You | ML-powered personalised recommendations (Cosine Similarity) |
| ⭐ Reviews | Write, rate, and read reviews with owner replies |
| 🔖 Save/Bookmark | Save favourites with instant optimistic UI updates |
| 🔔 Notifications | Real-time alerts via Socket.io |
| 📞 WhatsApp CTA | One-tap to WhatsApp the business |
| 🔐 Secure Auth | JWT + expo-secure-store encrypted token storage |
| 👤 Role System | Customer / Owner / Admin roles |

---

## 📱 App Screens

| Screen | Description |
|--------|-------------|
| Onboarding | 4-slide animated intro on first launch |
| Login / Register | Email + password auth |
| Home | Featured + nearby businesses feed |
| Map | Interactive map with pins, filters, and bottom cards |
| For You | AI recommendations with tabs (Trending, New, Top Rated) |
| Business Detail | Full profile, gallery, reviews, WhatsApp button |
| Write Review | Star rating + text review submission |
| Filters | Sort by distance, rating, price, open now, category |
| Saved | Bookmarked businesses |
| Notifications | Read/unread live notifications |
| Profile | User info, avatar, settings, logout |

---

## 🗂 Project Structure

```
LocalBiz/
├── app/                    ← Expo Router (file-based navigation)
│   ├── _layout.tsx         ← Root layout, fonts
│   ├── onboarding.tsx
│   ├── login.tsx
│   ├── register.tsx
│   └── (tabs)/             ← Bottom tab screens
│       ├── index.tsx       ← Home
│       ├── map.tsx
│       ├── recommendations.tsx
│       ├── saved.tsx
│       └── profile.tsx
│
├── src/
│   ├── screens/            ← Screen components
│   ├── components/         ← Reusable UI (BusinessCard, SearchBar, etc.)
│   ├── store/              ← Zustand global state
│   │   ├── authStore.ts    ← Auth, login, logout, save toggle
│   │   └── businessStore.ts ← Businesses, filters, location
│   ├── config/
│   │   └── api.ts          ← Axios client (API base URL lives here)
│   └── constants/
│       ├── theme.ts        ← Colors, typography, spacing tokens
│       └── types.ts        ← TypeScript interfaces
│
├── eas.json                ← Expo EAS Build config
├── app.json                ← Expo app config
└── package.json
```

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

## 🚀 Run Locally

### Prerequisites
- Node.js 18+
- **Expo Go** app on your Android device

```bash
# 1. Clone and install
git clone https://github.com/vasutrehan/localbiz
cd localbiz
npm install

# 2. Start the Expo dev server
npx expo start
```

Scan the QR code with **Expo Go** on your phone.

> The app connects to the live backend at `https://localbiz-backend-xvf2.onrender.com/api` — no local server needed.

---

## 📦 Build APK (via Expo EAS)

```bash
npm install -g eas-cli
eas login
eas build --platform android --profile preview
```

The APK will be built in the cloud and available to download from the Expo dashboard.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React Native 0.83 + Expo 55 |
| Language | TypeScript |
| Navigation | Expo Router (file-based) |
| State | Zustand |
| HTTP | Axios |
| Maps | react-native-maps (Google Maps) |
| Location | expo-location |
| Auth Storage | expo-secure-store |
| Fonts | @expo-google-fonts/syne, dm-sans |

---

## 👨‍💻 Author

**Vasu Trehan** | B.Tech CSE | Dr. ADGIPS (2022–26)  
Major Project under Ms. Apurva Jain

[![GitHub](https://img.shields.io/badge/GitHub-vasutrehan-black?style=flat&logo=github)](https://github.com/vasutrehan)
