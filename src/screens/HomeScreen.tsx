import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect, useRef, useCallback, useState } from 'react';
import { 
  View, Text, ScrollView, StyleSheet, 
  TouchableOpacity, RefreshControl, Animated, StatusBar,
  ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';
import { Colors, Typography, Spacing, Radius, Shadow } from 'src/constants/theme';
import { useBusinessStore } from 'src/store/businessStore';
import { useAuthStore } from 'src/store/authStore';
import { BusinessCard } from 'src/components/BusinessCard';
import { SearchBar } from 'src/components/SearchBar';
import { CategoryPills } from 'src/components/CategoryPills';
import { BusinessCardSkeleton } from 'src/components/UI';
import { api } from '../config/api';

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { filteredBusinesses, fetchBusinesses, isLoading, error, setUserLocation } = useBusinessStore();
  const [refreshing, setRefreshing] = useState(false);
  const [featured, setFeatured] = useState<any[]>([]);
  const scrollY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    initLocation();
  }, []);

  const initLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        setUserLocation({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
      } else {
        fetchBusinesses();
      }
    } catch {
      fetchBusinesses();
    }
    fetchFeatured();
  };

  const fetchFeatured = async () => {
    try {
      const res = await api.get('/businesses/nearby', {
        params: { lat: 28.4089, lng: 77.3178, distance: 5, sort: 'rating' },
      });
      setFeatured(res.data.data.slice(0, 5));
    } catch {}
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchBusinesses();
    await fetchFeatured();
    setRefreshing(false);
  }, []);

  const headerOpacity = scrollY.interpolate({ inputRange: [0, 80], outputRange: [0, 1], extrapolate: 'clamp' });

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.surface} />

      <Animated.View style={[styles.stickyHeader, { opacity: headerOpacity }]}>
        <Text style={styles.stickyTitle}>LocalBiz</Text>
      </Animated.View>

      <Animated.ScrollView
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: false })}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
      >
        {/* Hero */}
        <View style={styles.hero}>
          <View style={styles.heroTop}>
            <View>
              <Text style={styles.greeting}>{greeting()},</Text>
              <Text style={styles.heroName}>{user?.name?.split(' ')[0] ?? 'Explorer'} 👋</Text>
            </View>
            <TouchableOpacity onPress={() => router.push('/notifications' as any)} style={styles.notifBtn}>
              <Text style={{ fontSize: 22 }}>🔔</Text>
              <View style={styles.notifDot} />
            </TouchableOpacity>
          </View>
          <Text style={styles.heroSub}>Discover trusted local businesses near you</Text>
          <TouchableOpacity style={styles.locationRow} onPress={() => router.push('/(tabs)/map' as any)}>
            <Text style={styles.locationText}>📍 Faridabad, Haryana  ›</Text>
          </TouchableOpacity>
        </View>

        {/* Search */}
        <View style={styles.searchSection}>
          <SearchBar onFilterPress={() => router.push('/filters' as any)} />
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <CategoryPills />
        </View>

        {/* Featured */}
        {featured.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>✦ Top Rated</Text>
              <TouchableOpacity onPress={() => router.push('/(tabs)/recommendations' as any)}>
                <Text style={styles.seeAll}>See all</Text>
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: Spacing.base, gap: 12 }}>
              {featured.map(b => (
                <BusinessCard key={(b as any)._id ?? b.id} business={{ ...b, id: (b as any)._id ?? b.id }} variant="featured" />
              ))}
            </ScrollView>
          </View>
        )}

        {/* Nearby */}
        <View style={[styles.section, { paddingBottom: 100 }]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>📍 Nearby</Text>
            {!isLoading && <Text style={styles.resultCount}>{filteredBusinesses.length} found</Text>}
          </View>

          <View style={{ paddingHorizontal: Spacing.base }}>
            {isLoading ? (
              <><BusinessCardSkeleton /><BusinessCardSkeleton /><BusinessCardSkeleton /></>
            ) : error ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorIcon}>⚠️</Text>
                <Text style={styles.errorTitle}>Could not load businesses</Text>
                <Text style={styles.errorMsg}>{error}</Text>
                <TouchableOpacity style={styles.retryBtn} onPress={fetchBusinesses}>
                  <Text style={styles.retryText}>Retry</Text>
                </TouchableOpacity>
              </View>
            ) : filteredBusinesses.length === 0 ? (
              <View style={styles.empty}>
                <Text style={styles.emptyIcon}>🔍</Text>
                <Text style={styles.emptyTitle}>No businesses found</Text>
                <Text style={styles.emptySubtitle}>Try adjusting filters or increasing search distance</Text>
              </View>
            ) : (
              filteredBusinesses.map(b => (
                <BusinessCard key={(b as any)._id ?? b.id} business={{ ...b, id: (b as any)._id ?? b.id }} />
              ))
            )}
          </View>
        </View>
      </Animated.ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.surfaceAlt },
  stickyHeader: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 100, backgroundColor: Colors.surface, paddingVertical: 12, paddingHorizontal: Spacing.base, borderBottomWidth: 1, borderBottomColor: Colors.border, alignItems: 'center' },
  stickyTitle: { fontSize: Typography.sizes.md, fontFamily: Typography.display, color: Colors.primary },
  hero: { paddingHorizontal: Spacing.base, paddingTop: Spacing.lg, paddingBottom: Spacing.base, backgroundColor: Colors.surface },
  heroTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  greeting: { fontSize: Typography.sizes.base, color: Colors.textSecondary, fontFamily: Typography.bodyRegular },
  heroName: { fontSize: Typography.sizes['2xl'], fontFamily: Typography.display, color: Colors.text, marginTop: 2 },
  heroSub: { fontSize: Typography.sizes.sm, color: Colors.textSecondary, fontFamily: Typography.bodyRegular, marginBottom: 8 },
  locationRow: { flexDirection: 'row', alignItems: 'center' },
  locationText: { fontSize: 13, color: Colors.primary, fontFamily: Typography.bodySemiBold },
  notifBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.surfaceAlt, alignItems: 'center', justifyContent: 'center' },
  notifDot: { position: 'absolute', top: 8, right: 8, width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.primary, borderWidth: 1.5, borderColor: Colors.surface },
  searchSection: { paddingHorizontal: Spacing.base, paddingVertical: Spacing.md, backgroundColor: Colors.surface },
  section: { paddingTop: Spacing.lg },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.base, marginBottom: Spacing.md },
  sectionTitle: { fontSize: Typography.sizes.lg, fontFamily: Typography.display, color: Colors.text },
  seeAll: { fontSize: 13, color: Colors.primary, fontFamily: Typography.bodySemiBold },
  resultCount: { fontSize: 12, color: Colors.textTertiary },
  errorBox: { alignItems: 'center', paddingVertical: 40, backgroundColor: Colors.errorLight, borderRadius: Radius.xl, padding: Spacing.xl },
  errorIcon: { fontSize: 40, marginBottom: 12 },
  errorTitle: { fontSize: Typography.sizes.lg, fontFamily: Typography.displayMed, color: Colors.error, marginBottom: 6 },
  errorMsg: { fontSize: 13, color: Colors.textSecondary, textAlign: 'center', marginBottom: 16 },
  retryBtn: { backgroundColor: Colors.primary, paddingHorizontal: 24, paddingVertical: 10, borderRadius: Radius.full },
  retryText: { color: '#fff', fontFamily: Typography.bodySemiBold },
  empty: { alignItems: 'center', paddingVertical: 60 },
  emptyIcon: { fontSize: 48, marginBottom: 16 },
  emptyTitle: { fontSize: Typography.sizes.lg, fontFamily: Typography.displayMed, color: Colors.text, marginBottom: 8 },
  emptySubtitle: { fontSize: Typography.sizes.sm, color: Colors.textSecondary, textAlign: 'center' },
});
