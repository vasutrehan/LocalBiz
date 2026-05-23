import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, Image, ScrollView, TouchableOpacity,
  StyleSheet, Dimensions, Linking, StatusBar,
  SafeAreaView, FlatList, Platform, ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors, Typography, Spacing, Radius, Shadow } from 'src/constants/theme';
import { useAuthStore } from 'src/store/authStore';
import { StarRating, OpenBadge, Divider, Tag } from 'src/components/UI';
import { Review, Business } from 'src/constants/types';
import { api } from '../config/api';
import { useFocusEffect } from 'expo-router';
import { checkIsOpen } from 'src/utils/time';
const { width } = Dimensions.get('window');
const IMG_HEIGHT = 280;

export default function BusinessDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user, toggleSaved } = useAuthStore();
  const [business, setBusiness] = useState<Business | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showFullDesc, setShowFullDesc] = useState(false);

  const isSaved = user?.savedBusinessIds.includes(id ?? '') ?? false;

  useFocusEffect(
    useCallback(() => {
      if (id) load();
    }, [id])
  );

  const load = async () => {
    setIsLoading(true);
    try {
      const [bizRes, reviewRes] = await Promise.all([
        api.get(`/businesses/${id}`),
        api.get(`/businesses/${id}/reviews`),
      ]);
      const b = bizRes.data.data;
      // normalise id field
      setBusiness({ ...b, id: b._id ?? b.id });
      setReviews(reviewRes.data.data);
    } catch (e) {
      console.error('Business load error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleWhatsApp = () => {
    if (!business) return;
    const msg = encodeURIComponent(`Hi! I found ${business.name} on LocalBiz. I'd like to know more about your services.`);
    Linking.openURL(`https://wa.me/${business.whatsapp}?text=${msg}`);
    api.post(`/businesses/${id}/whatsapp-click`).catch(() => {});
  };

  const handleCall = () => business && Linking.openURL(`tel:${business.phone}`);
  const handleDirections = () => {
    if (!business) return;
    const url = Platform.OS === 'ios'
      ? `maps://app?daddr=${business.location.latitude},${business.location.longitude}`
      : `geo:${business.location.latitude},${business.location.longitude}?q=${encodeURIComponent(business.name)}`;
    Linking.openURL(url);
  };

  if (isLoading) return (
    <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.surface }}>
      <ActivityIndicator size="large" color={Colors.primary} />
      <Text style={{ marginTop: 12, color: Colors.textSecondary, fontFamily: Typography.bodyRegular }}>Loading business...</Text>
    </SafeAreaView>
  );

  if (!business) return (
    <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 48, marginBottom: 16 }}>😕</Text>
      <Text style={{ fontSize: 18, fontFamily: Typography.display, color: Colors.text }}>Business not found</Text>
      <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 20 }}>
        <Text style={{ color: Colors.primary, fontFamily: Typography.bodySemiBold }}>← Go back</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );

  const priceLabel = ['', '₹ Budget', '₹₹ Moderate', '₹₹₹ Premium', '₹₹₹₹ Luxury'][business.priceRange] ?? '';

  return (
    <View style={{ flex: 1, backgroundColor: Colors.surfaceAlt }}>
      <StatusBar barStyle="light-content" />
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Gallery */}
        <View style={{ height: IMG_HEIGHT }}>
          <FlatList
            data={business.images?.length ? business.images : [business.coverImage]}
            horizontal pagingEnabled showsHorizontalScrollIndicator={false}
            keyExtractor={(_, i) => i.toString()}
            onScroll={e => setActiveImageIndex(Math.round(e.nativeEvent.contentOffset.x / width))}
            renderItem={({ item }) => (
              <Image source={{ uri: item || 'https://via.placeholder.com/400x300?text=No+Image' }} style={{ width, height: IMG_HEIGHT, resizeMode: 'cover' }} />
            )}
          />
          <View style={styles.imageDots}>
            {(business.images?.length ? business.images : [business.coverImage]).map((_, i) => (
              <View key={i} style={[styles.dot, i === activeImageIndex && styles.dotActive]} />
            ))}
          </View>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Text style={{ fontSize: 18, color: '#fff' }}>←</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.heroSaveBtn} onPress={() => toggleSaved(business.id)}>
            <Text style={{ fontSize: 20, color: isSaved ? Colors.primary : '#fff' }}>{isSaved ? '♥' : '♡'}</Text>
          </TouchableOpacity>
        </View>

        {/* Info card */}
        <View style={styles.infoCard}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', gap: 6, marginBottom: 8 }}>
                {business.isVerified && (
                  <View style={styles.verifiedBadge}><Text style={styles.verifiedText}>✓ Verified</Text></View>
                )}
                <OpenBadge isOpen={business.isOpen ?? checkIsOpen(business.openingHours)} />
              </View>
              <Text style={styles.bizName}>{business.name}</Text>
              <Text style={styles.bizCategory}>{business.subcategory ?? business.category}</Text>
            </View>
          </View>

          <View style={styles.statsRow}>
            {[
              { val: business.rating?.toFixed(1), label: 'Rating' },
              { val: business.totalReviews, label: 'Reviews' },
              { val: `${business.distance ?? '?'} km`, label: 'Distance' },
              { val: priceLabel.split(' ')[0], label: 'Price' },
            ].map((s, i, arr) => (
              <React.Fragment key={s.label}>
                <View style={styles.stat}>
                  <Text style={styles.statVal}>{s.val}</Text>
                  <Text style={styles.statLabel}>{s.label}</Text>
                </View>
                {i < arr.length - 1 && <View style={styles.statDivider} />}
              </React.Fragment>
            ))}
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <StarRating rating={business.rating ?? 0} size={18} />
            <Text style={{ fontSize: 13, color: Colors.textSecondary }}>{business.totalReviews?.toLocaleString()} reviews</Text>
          </View>
        </View>

        {/* Action buttons */}
        <View style={styles.actionsSection}>
          {[
            { icon: '💬', label: 'WhatsApp', color: '#25D366', fn: handleWhatsApp },
            { icon: '📞', label: 'Call', color: Colors.primary, fn: handleCall },
            { icon: '🗺', label: 'Directions', color: Colors.accent, fn: handleDirections },
            { icon: isSaved ? '♥' : '♡', label: isSaved ? 'Saved' : 'Save', color: Colors.surfaceAlt, fn: () => toggleSaved(business.id), border: true },
          ].map(a => (
            <TouchableOpacity key={a.label} style={[styles.actionBtn, { backgroundColor: a.color, borderWidth: a.border ? 1 : 0, borderColor: Colors.border }]} onPress={a.fn} activeOpacity={0.82}>
              <Text style={styles.actionIcon}>{a.icon}</Text>
              <Text style={[styles.actionLabel, a.border && { color: Colors.text }]}>{a.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* About */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text numberOfLines={showFullDesc ? undefined : 3} style={styles.description}>{business.description}</Text>
          {(business.description?.length ?? 0) > 120 && (
            <TouchableOpacity onPress={() => setShowFullDesc(!showFullDesc)}>
              <Text style={styles.readMore}>{showFullDesc ? 'Show less ↑' : 'Read more ↓'}</Text>
            </TouchableOpacity>
          )}
        </View>
        <Divider style={{ marginHorizontal: Spacing.base }} />

        {/* Features */}
        {business.features?.length > 0 && (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Features</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
                {business.features.map(f => (
                  <View key={f} style={styles.featureItem}>
                    <Text style={{ fontSize: 12, color: Colors.success }}>✓</Text>
                    <Text style={styles.featureText}>{f}</Text>
                  </View>
                ))}
              </View>
            </View>
            <Divider style={{ marginHorizontal: Spacing.base }} />
          </>
        )}

        {/* Tags */}
        {business.tags?.length > 0 && (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Tags</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {business.tags.map(t => <Tag key={t} label={t} />)}
              </View>
            </View>
            <Divider style={{ marginHorizontal: Spacing.base }} />
          </>
        )}

        {/* Hours */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Opening Hours</Text>
          {business.openingHours && Object.entries(business.openingHours).map(([day, hours]: any) => (
            <View key={day} style={styles.hoursRow}>
              <Text style={styles.hoursDay}>{day.charAt(0).toUpperCase() + day.slice(1)}</Text>
              {hours?.open
                ? <Text style={styles.hoursTime}>{hours.from} – {hours.to}</Text>
                : <Text style={[styles.hoursTime, { color: Colors.error }]}>Closed</Text>}
            </View>
          ))}
        </View>
        <Divider style={{ marginHorizontal: Spacing.base }} />

        {/* Address */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location</Text>
          <TouchableOpacity style={styles.addressCard} onPress={handleDirections}>
            <Text style={styles.addressText}>📍 {business.address}</Text>
            <Text style={styles.addressCity}>{business.city} – {business.pincode}</Text>
            <Text style={{ fontSize: 12, color: Colors.primary, marginTop: 6, fontFamily: Typography.bodySemiBold }}>Open in Maps →</Text>
          </TouchableOpacity>
        </View>
        <Divider style={{ marginHorizontal: Spacing.base }} />

        {/* Reviews */}
        <View style={[styles.section, { paddingBottom: 120 }]}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <Text style={styles.sectionTitle}>Reviews ({reviews.length})</Text>
            <TouchableOpacity style={styles.writeReviewBtn} onPress={() => router.push(`/write-review/${id}` as any)}>
              <Text style={styles.writeReviewText}>✎ Write review</Text>
            </TouchableOpacity>
          </View>
          {reviews.length === 0
            ? <Text style={{ color: Colors.textSecondary, textAlign: 'center', paddingVertical: 20 }}>No reviews yet. Be the first!</Text>
            : reviews.map(r => <ReviewCard key={(r as any)._id ?? r.id} review={r} />)
          }
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <View style={styles.bottomCTA}>
        <TouchableOpacity style={styles.whatsappCTA} onPress={handleWhatsApp} activeOpacity={0.88}>
          <Text style={styles.whatsappCTAText}>💬  Chat on WhatsApp</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const ReviewCard = ({ review }: { review: any }) => (
  <View style={styles.reviewCard}>
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 }}>
      <Image source={{ uri: review.user?.avatar || `https://i.pravatar.cc/40?u=${review.user?._id || Math.random()}` }} style={{ width: 40, height: 40, borderRadius: 20 }} />
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 14, fontFamily: Typography.bodySemiBold, color: Colors.text, marginBottom: 3 }}>{review.user?.name ?? 'Anonymous'}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <StarRating rating={review.rating} size={12} />
          <Text style={{ fontSize: 11, color: Colors.textTertiary }}>{new Date(review.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</Text>
        </View>
      </View>
    </View>
    <Text style={{ fontSize: 14, color: Colors.textSecondary, lineHeight: 22, marginBottom: 10 }}>{review.text}</Text>
    {review.ownerReply && (
      <View style={{ backgroundColor: Colors.surfaceAlt, padding: 10, borderRadius: Radius.md, borderLeftWidth: 3, borderLeftColor: Colors.primary, marginBottom: 10 }}>
        <Text style={{ fontSize: 11, fontFamily: Typography.bodySemiBold, color: Colors.primary, marginBottom: 3 }}>Owner replied:</Text>
        <Text style={{ fontSize: 13, color: Colors.textSecondary }}>{review.ownerReply}</Text>
      </View>
    )}
    <Text style={{ fontSize: 12, color: Colors.textTertiary }}>👍 Helpful ({review.helpful ?? 0})</Text>
  </View>
);

const styles = StyleSheet.create({
  imageDots: { position: 'absolute', bottom: 16, left: 0, right: 0, flexDirection: 'row', justifyContent: 'center', gap: 6 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.5)' },
  dotActive: { backgroundColor: '#fff', width: 18 },
  backBtn: { position: 'absolute', top: 48, left: 16, width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(0,0,0,0.4)', alignItems: 'center', justifyContent: 'center' },
  heroSaveBtn: { position: 'absolute', top: 48, right: 16, width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(0,0,0,0.4)', alignItems: 'center', justifyContent: 'center' },
  infoCard: { backgroundColor: Colors.surface, marginHorizontal: Spacing.base, marginTop: -24, borderRadius: Radius.xl, padding: Spacing.base, ...Shadow.md },
  verifiedBadge: { backgroundColor: Colors.successLight, paddingHorizontal: 8, paddingVertical: 3, borderRadius: Radius.full },
  verifiedText: { fontSize: 11, color: Colors.success, fontFamily: Typography.bodySemiBold },
  bizName: { fontSize: Typography.sizes['2xl'], fontFamily: Typography.display, color: Colors.text, lineHeight: 34 },
  bizCategory: { fontSize: Typography.sizes.base, color: Colors.textSecondary, textTransform: 'capitalize', marginTop: 2 },
  statsRow: { flexDirection: 'row', backgroundColor: Colors.surfaceAlt, borderRadius: Radius.lg, padding: Spacing.md, marginBottom: 12 },
  stat: { flex: 1, alignItems: 'center' },
  statVal: { fontSize: Typography.sizes.lg, fontFamily: Typography.display, color: Colors.text },
  statLabel: { fontSize: 10, color: Colors.textTertiary, marginTop: 2 },
  statDivider: { width: 1, backgroundColor: Colors.border },
  actionsSection: { flexDirection: 'row', paddingHorizontal: Spacing.base, paddingVertical: Spacing.lg, gap: 10 },
  actionBtn: { flex: 1, alignItems: 'center', paddingVertical: 12, borderRadius: Radius.lg, gap: 4 },
  actionIcon: { fontSize: 22 },
  actionLabel: { fontSize: 11, color: '#fff', fontFamily: Typography.bodySemiBold },
  section: { paddingHorizontal: Spacing.base, paddingVertical: Spacing.base },
  sectionTitle: { fontSize: Typography.sizes.lg, fontFamily: Typography.displayMed, color: Colors.text, marginBottom: 12 },
  description: { fontSize: Typography.sizes.base, color: Colors.textSecondary, lineHeight: 24 },
  readMore: { fontSize: 13, color: Colors.primary, fontFamily: Typography.bodySemiBold, marginTop: 6 },
  featureItem: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: Colors.surfaceAlt, paddingHorizontal: 12, paddingVertical: 7, borderRadius: Radius.full },
  featureText: { fontSize: 13, color: Colors.text },
  hoursRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 7, borderBottomWidth: 1, borderBottomColor: Colors.border },
  hoursDay: { fontSize: 14, color: Colors.text, fontFamily: Typography.bodySemiBold, textTransform: 'capitalize' },
  hoursTime: { fontSize: 14, color: Colors.textSecondary },
  addressCard: { backgroundColor: Colors.surfaceAlt, padding: Spacing.base, borderRadius: Radius.lg },
  addressText: { fontSize: Typography.sizes.base, color: Colors.text, lineHeight: 22 },
  addressCity: { fontSize: 13, color: Colors.textSecondary, marginTop: 4 },
  writeReviewBtn: { backgroundColor: Colors.primaryMuted, paddingHorizontal: 14, paddingVertical: 7, borderRadius: Radius.full },
  writeReviewText: { fontSize: 13, color: Colors.primary, fontFamily: Typography.bodySemiBold },
  reviewCard: { backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: Spacing.base, marginBottom: 12, ...Shadow.sm },
  bottomCTA: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: Colors.surface, paddingHorizontal: Spacing.base, paddingVertical: 12, paddingBottom: 28, borderTopWidth: 1, borderTopColor: Colors.border },
  whatsappCTA: { backgroundColor: '#25D366', paddingVertical: 15, borderRadius: Radius.full, alignItems: 'center', ...Shadow.primary },
  whatsappCTAText: { fontSize: Typography.sizes.base, color: '#fff', fontFamily: Typography.bodySemiBold },
});
