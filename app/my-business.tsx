import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { Colors, Typography, Spacing, Radius, Shadow } from '../src/constants/theme';
import { Button, Skeleton, StarRating, OpenBadge } from '../src/components/UI';
import { useAuthStore } from '../src/store/authStore';
import { api } from '../src/config/api';
import { checkIsOpen } from '../src/utils/time';

export default function MyBusinessScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchBusinesses = async () => {
    if (!user) return;
    try {
      const res = await api.get(`/businesses?owner=${(user as any)._id || user.id}`);
      setBusinesses(res.data.data);
    } catch (err) {
      console.error('Error fetching user businesses:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchBusinesses();
  }, [user]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchBusinesses();
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <Stack.Screen options={{ title: 'My Business' }} />
        <View style={{ padding: Spacing.lg }}>
          <Skeleton height={200} radius={Radius.xl} style={{ marginBottom: Spacing.md }} />
          <Skeleton height={150} radius={Radius.xl} style={{ marginBottom: Spacing.md }} />
          <Skeleton height={100} radius={Radius.xl} />
        </View>
      </SafeAreaView>
    );
  }

  // If no business found, show splash view
  if (businesses.length === 0) {
    return (
      <SafeAreaView style={styles.safe}>
        <Stack.Screen options={{ title: 'Grow with LocalBiz' }} />
        <View style={styles.emptyContainer}>
          <View style={styles.iconCircle}>
            <Text style={{ fontSize: 50 }}>🚀</Text>
          </View>
          <Text style={styles.emptyTitle}>Grow Your Local Business</Text>
          <Text style={styles.emptyDesc}>
            Join thousands of local businesses reaching new customers every day. Setup is fast, free, and brings the community to your doorstep.
          </Text>
          <Button
            label="Create Business Listing"
            onPress={() => router.push('/create-business' as any)}
            size="lg"
            fullWidth
            style={{ marginTop: Spacing.xl }}
          />
        </View>
      </SafeAreaView>
    );
  }

  const business = businesses[0]; // Dashboard for the primary business

  const calculateProfileCompletion = () => {
    let score = 0;
    if (business.name && business.category) score += 30;
    if (business.description) score += 20;
    if (business.address && business.city) score += 20;
    if (business.phone) score += 10;
    if (business.whatsapp) score += 10;
    if (business.images && business.images.length > 0) score += 10;
    return score;
  };

  const completionScore = calculateProfileCompletion();

  return (
    <SafeAreaView style={styles.safe}>
      <Stack.Screen options={{ title: 'Dashboard' }} />
      <ScrollView 
        contentContainerStyle={styles.scroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Premium Header Card */}
        <View style={styles.headerCard}>
          <View style={styles.headerTop}>
            <View style={{ flex: 1 }}>
              <Text style={styles.bizName}>{business.name}</Text>
              <Text style={styles.bizCategory}>{business.category}</Text>
            </View>
            <OpenBadge isOpen={checkIsOpen(business.openingHours)} />
          </View>
          <View style={styles.headerBottom}>
            <Text style={styles.locationText}>📍 {business.city}, {business.address.split(',')[0]}</Text>
          </View>
        </View>

        {/* Quick Stats Grid */}
        <Text style={styles.sectionHeader}>Performance Overview</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <View style={[styles.iconWrapper, { backgroundColor: '#E0F2FE' }]}>
              <Text style={{ fontSize: 18 }}>👁️</Text>
            </View>
            <Text style={styles.statValue}>{business.viewCount || 0}</Text>
            <Text style={styles.statLabel}>Total Views</Text>
          </View>
          
          <View style={styles.statBox}>
            <View style={[styles.iconWrapper, { backgroundColor: '#DCFCE7' }]}>
              <Text style={{ fontSize: 18 }}>💬</Text>
            </View>
            <Text style={styles.statValue}>{business.whatsappClickCount || 0}</Text>
            <Text style={styles.statLabel}>WhatsApp Leads</Text>
          </View>
          
          <View style={styles.statBox}>
            <View style={[styles.iconWrapper, { backgroundColor: '#FEF9C3' }]}>
              <Text style={{ fontSize: 18 }}>⭐</Text>
            </View>
            <Text style={styles.statValue}>{business.rating?.toFixed(1) || '0.0'}</Text>
            <Text style={styles.statLabel}>Avg Rating</Text>
          </View>

          <View style={styles.statBox}>
            <View style={[styles.iconWrapper, { backgroundColor: '#F3E8FF' }]}>
              <Text style={{ fontSize: 18 }}>📝</Text>
            </View>
            <Text style={styles.statValue}>{business.totalReviews || 0}</Text>
            <Text style={styles.statLabel}>Reviews</Text>
          </View>
        </View>

        {/* Growth Insights */}
        <Text style={styles.sectionHeader}>Growth Insights</Text>
        <View style={styles.insightCard}>
          <View style={styles.insightRow}>
            <Text style={styles.insightLabel}>Profile Strength</Text>
            <Text style={styles.insightValue}>{completionScore}%</Text>
          </View>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${completionScore}%`, backgroundColor: completionScore === 100 ? Colors.success : Colors.primary }]} />
          </View>
          {completionScore < 100 && (
            <Text style={styles.insightHint}>Complete your profile to rank higher in local searches.</Text>
          )}

          <View style={styles.divider} />

          <View style={styles.insightRow}>
            <Text style={styles.insightLabel}>Profile Views</Text>
            <Text style={[styles.insightValue, { color: Colors.success }]}>+12% this week</Text>
          </View>
          <Text style={styles.insightHint}>Your visibility is improving! Keep up the good work.</Text>
        </View>

        {/* Action Hub */}
        <Text style={styles.sectionHeader}>Action Hub</Text>
        <View style={styles.actionGrid}>
          <TouchableOpacity 
            style={styles.actionBtn}
            onPress={() => router.push(`/edit-business?id=${business.id}` as any)}
          >
            <Text style={styles.actionIcon}>✏️</Text>
            <Text style={styles.actionText}>Edit Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtn} onPress={() => {}}>
            <Text style={styles.actionIcon}>📸</Text>
            <Text style={styles.actionText}>Add Photos</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtn} onPress={() => {}}>
            <Text style={styles.actionIcon}>📣</Text>
            <Text style={styles.actionText}>Promote</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.surfaceAlt },
  scroll: { padding: Spacing.base, paddingBottom: Spacing['3xl'] },
  
  // Empty State
  emptyContainer: {
    flex: 1, justifyContent: 'center', alignItems: 'center', padding: Spacing.xl,
  },
  iconCircle: {
    width: 120, height: 120, borderRadius: 60, backgroundColor: Colors.primaryMuted,
    justifyContent: 'center', alignItems: 'center', marginBottom: Spacing.xl,
  },
  emptyTitle: {
    fontSize: Typography.sizes['2xl'], fontFamily: Typography.display, color: Colors.text,
    textAlign: 'center', marginBottom: Spacing.md,
  },
  emptyDesc: {
    fontSize: Typography.sizes.base, fontFamily: Typography.bodyRegular, color: Colors.textSecondary,
    textAlign: 'center', lineHeight: 24,
  },

  // Premium Header
  headerCard: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    ...Shadow.lg,
    marginBottom: Spacing.xl,
  },
  headerTop: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  bizName: {
    fontSize: Typography.sizes['2xl'], fontFamily: Typography.display, color: Colors.textInverse,
    marginBottom: 4,
  },
  bizCategory: {
    fontSize: Typography.sizes.sm, fontFamily: Typography.bodySemiBold, color: Colors.primaryMuted,
    textTransform: 'uppercase', letterSpacing: 1,
  },
  headerBottom: {
    borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.2)', paddingTop: Spacing.md,
  },
  locationText: {
    fontSize: Typography.sizes.sm, fontFamily: Typography.bodyRegular, color: Colors.textInverse, opacity: 0.9,
  },

  sectionHeader: {
    fontSize: Typography.sizes.lg, fontFamily: Typography.display, color: Colors.text,
    marginBottom: Spacing.md, marginLeft: 4,
  },

  // Stats Grid
  statsGrid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.md, marginBottom: Spacing.xl,
  },
  statBox: {
    backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: Spacing.md,
    ...Shadow.sm, flexBasis: '47%', flexGrow: 1, alignItems: 'center',
  },
  iconWrapper: {
    width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  statValue: {
    fontSize: Typography.sizes.xl, fontFamily: Typography.display, color: Colors.text,
  },
  statLabel: {
    fontSize: Typography.sizes.xs, fontFamily: Typography.bodySemiBold, color: Colors.textSecondary,
    marginTop: 2, textTransform: 'uppercase',
  },

  // Growth Insights
  insightCard: {
    backgroundColor: Colors.surface, borderRadius: Radius.xl, padding: Spacing.lg,
    ...Shadow.sm, marginBottom: Spacing.xl,
  },
  insightRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.sm,
  },
  insightLabel: {
    fontSize: Typography.sizes.base, fontFamily: Typography.bodySemiBold, color: Colors.text,
  },
  insightValue: {
    fontSize: Typography.sizes.base, fontFamily: Typography.display, color: Colors.primary,
  },
  progressBarBg: {
    height: 8, backgroundColor: Colors.border, borderRadius: 4, overflow: 'hidden', marginBottom: Spacing.sm,
  },
  progressBarFill: {
    height: '100%', borderRadius: 4,
  },
  insightHint: {
    fontSize: Typography.sizes.sm, fontFamily: Typography.bodyRegular, color: Colors.textSecondary,
  },
  divider: {
    height: 1, backgroundColor: Colors.border, marginVertical: Spacing.md,
  },

  // Action Hub
  actionGrid: {
    flexDirection: 'row', justifyContent: 'space-between', gap: Spacing.sm, marginBottom: Spacing['2xl'],
  },
  actionBtn: {
    flex: 1, backgroundColor: Colors.surface, borderRadius: Radius.lg, paddingVertical: Spacing.lg,
    alignItems: 'center', ...Shadow.sm, borderWidth: 1, borderColor: Colors.border,
  },
  actionIcon: {
    fontSize: 24, marginBottom: Spacing.sm,
  },
  actionText: {
    fontSize: Typography.sizes.sm, fontFamily: Typography.bodySemiBold, color: Colors.text,
  },
});
