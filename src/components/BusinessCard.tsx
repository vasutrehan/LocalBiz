import React, { useCallback } from 'react';
import {
  View, Text, Image, TouchableOpacity,
  StyleSheet, Dimensions, Linking,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Business } from '../constants/types';
import { Colors, Typography, Spacing, Radius, Shadow } from '../constants/theme';
import { StarRating, Badge, OpenBadge, PriceIndicator } from './UI';
import { useAuthStore } from '../store/authStore';

const { width } = Dimensions.get('window');

interface BusinessCardProps {
  business: Business;
  variant?: 'default' | 'compact' | 'horizontal' | 'featured';
  showSave?: boolean;
}

export const BusinessCard: React.FC<BusinessCardProps> = ({
  business, variant = 'default', showSave = true,
}) => {
  const router = useRouter();
  const { user, toggleSaved } = useAuthStore();
  const isSaved = (user?.savedBusinessIds || []).includes(business.id);

  const handlePress = () => router.push(`/business/${business.id}` as any);
  const handleSave = useCallback((e: any) => {
    e.stopPropagation?.();
    toggleSaved(business.id);
  }, [business.id, toggleSaved]);

  const handleWhatsApp = useCallback((e: any) => {
    e.stopPropagation?.();
    const url = `https://wa.me/${business.whatsapp}?text=Hi! I found your business on LocalBiz. I'd like to know more.`;
    Linking.openURL(url);
  }, [business.whatsapp]);

  if (variant === 'compact') {
    return (
      <TouchableOpacity style={styles.compact} onPress={handlePress} activeOpacity={0.88}>
        <Image source={{ uri: business.coverImage || 'https://via.placeholder.com/150?text=No+Image' }} style={styles.compactImage} />
        <View style={styles.compactBody}>
          <Text style={styles.compactName} numberOfLines={1}>{business.name}</Text>
          <StarRating rating={business.rating} size={11} />
          <Text style={styles.compactDist}>{business.distance} km away</Text>
        </View>
      </TouchableOpacity>
    );
  }

  if (variant === 'featured') {
    return (
      <TouchableOpacity style={styles.featured} onPress={handlePress} activeOpacity={0.9}>
        <Image source={{ uri: business.coverImage || 'https://via.placeholder.com/400x300?text=No+Image' }} style={styles.featuredImage} />
        <View style={styles.featuredOverlay} />
        {showSave && (
          <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
            <Text style={{ fontSize: 20 }}>{isSaved ? '♥' : '♡'}</Text>
          </TouchableOpacity>
        )}
        <View style={styles.featuredBody}>
          {business.isVerified && (
            <View style={styles.verifiedBadge}>
              <Text style={styles.verifiedText}>✓ Verified</Text>
            </View>
          )}
          <Text style={styles.featuredName} numberOfLines={1}>{business.name}</Text>
          <View style={styles.featuredMeta}>
            <StarRating rating={business.rating} size={12} showCount count={business.totalReviews} />
            <Text style={styles.featuredDist}> · {business.distance} km</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  // Default card
  return (
    <TouchableOpacity style={[styles.card, Shadow.md]} onPress={handlePress} activeOpacity={0.88}>
      <View>
        <Image source={{ uri: business.coverImage || 'https://via.placeholder.com/400x300?text=No+Image' }} style={styles.cardImage} />
        {showSave && (
          <TouchableOpacity style={styles.saveBtn} onPress={handleSave} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Text style={{ fontSize: 22, color: isSaved ? Colors.primary : Colors.textInverse }}>
              {isSaved ? '♥' : '♡'}
            </Text>
          </TouchableOpacity>
        )}
        {business.isVerified && (
          <View style={styles.verifiedChip}>
            <Text style={styles.verifiedText}>✓ Verified</Text>
          </View>
        )}
        <View style={styles.distanceChip}>
          <Text style={styles.distanceChipText}>{business.distance} km</Text>
        </View>
      </View>

      <View style={styles.cardBody}>
        <View style={styles.cardRow}>
          <Text style={styles.cardName} numberOfLines={1}>{business.name}</Text>
          <OpenBadge isOpen={business.isOpen ?? false} />
        </View>

        <View style={styles.cardMeta}>
          <StarRating rating={business.rating} size={13} showCount count={business.totalReviews} />
          <Text style={styles.dot}>·</Text>
          <PriceIndicator level={business.priceRange} />
        </View>

        <Text style={styles.cardDesc} numberOfLines={2}>{business.description}</Text>

        <View style={styles.cardAddress}>
          <Text style={styles.cardAddressText} numberOfLines={1}>📍 {business.address}</Text>
        </View>

        <View style={styles.cardActions}>
          <TouchableOpacity style={styles.whatsappBtn} onPress={handleWhatsApp} activeOpacity={0.82}>
            <Text style={styles.whatsappBtnText}>💬 WhatsApp</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.detailBtn} onPress={handlePress} activeOpacity={0.82}>
            <Text style={styles.detailBtnText}>View →</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // ── Default card ──
  card: {
    backgroundColor: Colors.surfaceCard,
    borderRadius: Radius.xl,
    marginBottom: Spacing.base,
    overflow: 'hidden',
  },
  cardImage: { width: '100%', height: 180 },
  saveBtn: {
    position: 'absolute', top: 12, right: 12,
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center', justifyContent: 'center',
  },
  verifiedChip: {
    position: 'absolute', top: 12, left: 12,
    backgroundColor: 'rgba(34,197,94,0.85)',
    paddingHorizontal: 8, paddingVertical: 3, borderRadius: Radius.full,
  },
  verifiedText: { fontSize: 10, color: '#fff', fontFamily: Typography.bodySemiBold },
  distanceChip: {
    position: 'absolute', bottom: 12, right: 12,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 8, paddingVertical: 3, borderRadius: Radius.full,
  },
  distanceChipText: { fontSize: 11, color: '#fff', fontFamily: Typography.bodySemiBold },
  cardBody: { padding: Spacing.base },
  cardRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  cardName: { fontSize: Typography.sizes.md, fontFamily: Typography.displayMed, color: Colors.text, flex: 1, marginRight: 8 },
  cardMeta: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  dot: { color: Colors.textTertiary, fontSize: 14 },
  cardDesc: { fontSize: Typography.sizes.sm, color: Colors.textSecondary, lineHeight: 20, marginBottom: 10, fontFamily: Typography.bodyRegular },
  cardAddress: { marginBottom: 12 },
  cardAddressText: { fontSize: 12, color: Colors.textTertiary, fontFamily: Typography.bodyRegular },
  cardActions: { flexDirection: 'row', gap: 10 },
  whatsappBtn: {
    flex: 1, backgroundColor: '#25D366', paddingVertical: 10,
    borderRadius: Radius.full, alignItems: 'center',
  },
  whatsappBtnText: { color: '#fff', fontSize: 13, fontFamily: Typography.bodySemiBold },
  detailBtn: {
    flex: 1, backgroundColor: Colors.primaryMuted, paddingVertical: 10,
    borderRadius: Radius.full, alignItems: 'center',
  },
  detailBtnText: { color: Colors.primary, fontSize: 13, fontFamily: Typography.bodySemiBold },

  // ── Compact card (horizontal scroll) ──
  compact: {
    width: 140, backgroundColor: Colors.surfaceCard,
    borderRadius: Radius.lg, overflow: 'hidden',
    marginRight: 12, ...Shadow.sm,
  },
  compactImage: { width: '100%', height: 90 },
  compactBody: { padding: 8 },
  compactName: { fontSize: 13, fontFamily: Typography.bodySemiBold, color: Colors.text, marginBottom: 3 },
  compactDist: { fontSize: 11, color: Colors.textTertiary, marginTop: 2 },

  // ── Featured card (hero) ──
  featured: {
    width: width * 0.78, height: 220, borderRadius: Radius.xl,
    overflow: 'hidden', marginRight: 16, ...Shadow.lg,
  },
  featuredImage: { width: '100%', height: '100%', position: 'absolute' },
  featuredOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(26,26,46,0.55)',
  },
  featuredBody: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16 },
  featuredName: { fontSize: Typography.sizes.lg, fontFamily: Typography.display, color: '#fff', marginBottom: 4 },
  featuredMeta: { flexDirection: 'row', alignItems: 'center' },
  featuredDist: { fontSize: 12, color: 'rgba(255,255,255,0.75)' },
  verifiedBadge: { alignSelf: 'flex-start', backgroundColor: 'rgba(34,197,94,0.85)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: Radius.full, marginBottom: 6 },
});
