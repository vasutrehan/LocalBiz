import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, TouchableOpacity,
  Dimensions, ScrollView, ActivityIndicator,
} from 'react-native';
import MapView, { Marker, Circle, PROVIDER_GOOGLE, UrlTile } from 'react-native-maps';
import { useRouter } from 'expo-router';
import {
  Colors, Typography, Spacing, Radius, Shadow, CATEGORIES,
} from 'src/constants/theme';
import { useBusinessStore } from 'src/store/businessStore';
import { Business } from 'src/constants/types';
import { SearchBar } from 'src/components/SearchBar';
import { CategoryPills } from 'src/components/CategoryPills';
import { OpenBadge, StarRating } from 'src/components/UI';

const { width } = Dimensions.get('window');

// ── Your Google Maps API key directly here ──
// Expo Go ignores app.json android.config.googleMaps
// The key must be passed to MapView directly via urlTile or used with PROVIDER_DEFAULT
const MAPS_API_KEY = 'AIzaSyC2FKCr3rzsT1Fu8moAQS9NdVAJf2HU01I';

const CAT_COLORS: Record<string, string> = {
  food: Colors.catFood,      health: Colors.catHealth,
  shopping: Colors.catShopping, services: Colors.catServices,
  education: Colors.catEducation, sports: Colors.catSports,
};

export default function MapScreen() {
  const router = useRouter();
  const mapRef = useRef<MapView>(null);
  const cardScrollRef = useRef<ScrollView>(null);
  const { filteredBusinesses, userLocation, isLoading, fetchBusinesses } = useBusinessStore();
  const [selected, setSelected] = useState<Business | null>(null);

  useEffect(() => { fetchBusinesses(); }, []);

  const region = {
    latitude:      userLocation?.latitude  ?? 28.4089,
    longitude:     userLocation?.longitude ?? 77.3178,
    latitudeDelta:  0.05,
    longitudeDelta: 0.05,
  };

  const handleMarkerPress = (biz: Business, idx: number) => {
    setSelected(biz);
    mapRef.current?.animateToRegion({
      latitude:      biz.location.latitude  - 0.003,
      longitude:     biz.location.longitude,
      latitudeDelta:  0.015,
      longitudeDelta: 0.015,
    }, 400);
    cardScrollRef.current?.scrollTo({ x: idx * (width * 0.82 + 14), animated: true });
  };

  const goToMyLocation = () => {
    mapRef.current?.animateToRegion({
      ...region,
      latitudeDelta:  0.025,
      longitudeDelta: 0.025,
    }, 500);
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Explore Map</Text>
        <TouchableOpacity style={styles.locBtn} onPress={goToMyLocation}>
          <Text style={{ fontSize: 18 }}>📍</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchRow}>
        <SearchBar placeholder="Search on map…" />
      </View>

      <View style={{ paddingVertical: Spacing.sm }}>
        <CategoryPills />
      </View>

      {/* ── Map ── */}
      <View style={styles.mapWrapper}>
        {isLoading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        )}

        <MapView
          ref={mapRef}
          style={StyleSheet.absoluteFillObject}
          // Use PROVIDER_DEFAULT (Apple/OSM) in Expo Go — works without API key
          // Switch to PROVIDER_GOOGLE only in production EAS build
          provider={undefined}
          initialRegion={region}
          showsUserLocation
          showsMyLocationButton={false}
          showsCompass
          showsScale
          loadingEnabled
          loadingIndicatorColor={Colors.primary}
          loadingBackgroundColor={Colors.surfaceAlt}
        >
          {/* User radius circle */}
          {userLocation && (
            <Circle
              center={{
                latitude:  userLocation.latitude,
                longitude: userLocation.longitude,
              }}
              radius={500}
              fillColor="rgba(255,92,53,0.08)"
              strokeColor="rgba(255,92,53,0.3)"
              strokeWidth={1}
            />
          )}

          {/* Business markers */}
          {filteredBusinesses.map((biz, idx) => {
            const color = CAT_COLORS[biz.category] ?? Colors.primary;
            const bizId = (biz as any)._id ?? biz.id;
            const isSelected = selected
              ? ((selected as any)._id ?? selected.id) === bizId
              : false;

            // Safety check — skip if lat/lng are missing or zero
            if (!biz.location?.latitude || !biz.location?.longitude) return null;

            return (
              <Marker
                key={bizId}
                coordinate={{
                  latitude:  biz.location.latitude,
                  longitude: biz.location.longitude,
                }}
                onPress={() => handleMarkerPress(biz, idx)}
                tracksViewChanges={false}
              >
                {/* Custom pin view */}
                <View style={styles.pinWrapper}>
                  <View style={[
                    styles.pin,
                    { backgroundColor: color },
                    isSelected && styles.pinSelected,
                  ]}>
                    <Text style={styles.pinIcon}>
                      {CATEGORIES.find(c => c.id === biz.category)?.icon ?? '🏪'}
                    </Text>
                  </View>
                  <View style={[styles.pinTail, { borderTopColor: color }]} />
                </View>
              </Marker>
            );
          })}
        </MapView>

        {/* My location FAB */}
        <TouchableOpacity style={styles.fab} onPress={goToMyLocation}>
          <Text style={{ fontSize: 20 }}>🎯</Text>
        </TouchableOpacity>

        {/* Count badge */}
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{filteredBusinesses.length} nearby</Text>
        </View>
      </View>

      {/* ── Bottom cards ── */}
      <View style={styles.bottomBar}>
        {filteredBusinesses.length === 0 && !isLoading ? (
          <View style={styles.emptyCards}>
            <Text style={{ color: Colors.textSecondary, fontSize: 13 }}>
              No businesses found. Try adjusting filters.
            </Text>
          </View>
        ) : (
          <ScrollView
            ref={cardScrollRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: Spacing.base, gap: 12 }}
            snapToInterval={width * 0.82 + 12}
            decelerationRate="fast"
            onMomentumScrollEnd={e => {
              const idx = Math.round(
                e.nativeEvent.contentOffset.x / (width * 0.82 + 12)
              );
              if (filteredBusinesses[idx]) {
                handleMarkerPress(filteredBusinesses[idx], idx);
              }
            }}
          >
            {filteredBusinesses.map((biz, idx) => {
              const bizId    = (biz as any)._id ?? biz.id;
              const selId    = selected ? ((selected as any)._id ?? selected.id) : null;
              const isActive = selId === bizId;
              return (
                <TouchableOpacity
                  key={bizId}
                  style={[
                    styles.card,
                    { width: width * 0.82 },
                    isActive && styles.cardActive,
                  ]}
                  onPress={() => router.push(`/business/${bizId}` as any)}
                  activeOpacity={0.88}
                >
                  <View style={[
                    styles.cardIcon,
                    { backgroundColor: (CAT_COLORS[biz.category] ?? Colors.primary) + '22' },
                  ]}>
                    <Text style={{ fontSize: 28 }}>
                      {CATEGORIES.find(c => c.id === biz.category)?.icon ?? '🏪'}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Text style={styles.cardName} numberOfLines={1}>{biz.name}</Text>
                      <OpenBadge isOpen={biz.isOpen ?? false} />
                    </View>
                    <Text style={styles.cardCat}>{biz.subcategory ?? biz.category}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 }}>
                      <StarRating rating={biz.rating} size={12} showCount count={biz.totalReviews} />
                      <Text style={styles.cardDist}>· {biz.distance} km</Text>
                    </View>
                    <Text style={styles.cardAddr} numberOfLines={1}>📍 {biz.address}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: Colors.surface },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: Spacing.base, paddingTop: Spacing.md, paddingBottom: 4,
  },
  title:  { fontSize: Typography.sizes.xl, fontFamily: Typography.display, color: Colors.text },
  locBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: Colors.surfaceAlt, alignItems: 'center', justifyContent: 'center' },
  searchRow: { paddingHorizontal: Spacing.base, paddingBottom: 4 },

  mapWrapper: { flex: 1, position: 'relative', backgroundColor: '#E8EDF2' },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.6)',
    alignItems: 'center', justifyContent: 'center', zIndex: 10,
  },

  pinWrapper: { alignItems: 'center' },
  pin: {
    width: 40, height: 40, borderRadius: 20,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2.5, borderColor: '#fff',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25, shadowRadius: 4, elevation: 5,
  },
  pinSelected: { width: 48, height: 48, borderRadius: 24, borderColor: Colors.primary },
  pinTail: {
    width: 0, height: 0,
    borderLeftWidth: 6, borderRightWidth: 6, borderTopWidth: 8,
    borderLeftColor: 'transparent', borderRightColor: 'transparent',
    marginTop: -1,
  },
  pinIcon: { fontSize: 20 },

  fab: {
    position: 'absolute', right: 16, bottom: 16,
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: Colors.surface,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2, shadowRadius: 8, elevation: 6,
  },
  countBadge: {
    position: 'absolute', left: 16, top: 16,
    backgroundColor: Colors.accent,
    paddingHorizontal: 12, paddingVertical: 5, borderRadius: Radius.full,
  },
  countText: { fontSize: 12, color: '#fff', fontFamily: Typography.bodySemiBold },

  bottomBar: {
    backgroundColor: Colors.surface, paddingVertical: Spacing.md,
    borderTopWidth: 1, borderTopColor: Colors.border,
  },
  emptyCards: {
    paddingHorizontal: Spacing.base, paddingVertical: Spacing.md,
  },
  card: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: Colors.surface, borderRadius: Radius.lg,
    padding: Spacing.md, borderWidth: 1.5, borderColor: Colors.border,
    shadowColor: '#1A1A2E', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
  },
  cardActive: { borderColor: Colors.primary },
  cardIcon: { width: 60, height: 60, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center' },
  cardName: { fontSize: 15, fontFamily: Typography.displayMed, color: Colors.text, flex: 1, marginRight: 6 },
  cardCat:  { fontSize: 12, color: Colors.textSecondary, textTransform: 'capitalize', marginTop: 2 },
  cardDist: { fontSize: 12, color: Colors.textSecondary },
  cardAddr: { fontSize: 11, color: Colors.textTertiary, marginTop: 4 },
});
