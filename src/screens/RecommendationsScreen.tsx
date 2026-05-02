import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, FlatList, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Typography, Spacing, Radius, Shadow } from 'src/constants/theme';
import { BusinessCard } from 'src/components/BusinessCard';
import { api } from '../config/api';
import { useBusinessStore } from 'src/store/businessStore';

const TABS = ['For You', 'Trending', 'New', 'Top Rated'];

export default function RecommendationsScreen() {
  const router = useRouter();
  const { userLocation } = useBusinessStore();
  const [activeTab, setActiveTab] = useState(0);
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFallback, setIsFallback] = useState(false);

  useEffect(() => { fetchTab(activeTab); }, [activeTab]);

  const fetchTab = async (tab: number) => {
    setIsLoading(true);
    setData([]);
    try {
      let res;
      const lat = userLocation?.latitude ?? 28.4089;
      const lng = userLocation?.longitude ?? 77.3178;
      if (tab === 0) {
        res = await api.get('/recommendations', { params: { lat, lng } });
        setIsFallback(res.data.fallback ?? false);
        setData(res.data.data.map((b: any) => ({ ...b, id: b._id ?? b.id })));
      } else {
        const sort = ['rating', 'popular', 'newest', 'rating'][tab];
        res = await api.get('/businesses/nearby', { params: { lat, lng, distance: 10, sort } });
        setIsFallback(false);
        setData(res.data.data.map((b: any) => ({ ...b, id: b._id ?? b.id })));
      }
    } catch (e) {
      console.error('Recommendations error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Recommendations</Text>
          <Text style={styles.headerSub}>Personalised just for you</Text>
        </View>
        <View style={styles.aiBadge}><Text style={styles.aiBadgeText}>✦ AI</Text></View>
      </View>

      {activeTab === 0 && (
        <View style={styles.infoBanner}>
          <Text style={{ fontSize: 28 }}>🤖</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.infoTitle}>{isFallback ? 'Popular near you' : 'Powered by ML'}</Text>
            <Text style={styles.infoText}>{isFallback ? 'Rate more businesses to get personalised picks' : 'Based on your location, history, and ratings'}</Text>
          </View>
        </View>
      )}

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabs}>
        {TABS.map((t, i) => (
          <TouchableOpacity key={t} style={[styles.tab, activeTab === i && styles.tabActive]} onPress={() => setActiveTab(i)} activeOpacity={0.8}>
            <Text style={[styles.tabLabel, activeTab === i && styles.tabLabelActive]}>{t}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {isLoading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={{ marginTop: 12, color: Colors.textSecondary }}>Finding best matches...</Text>
        </View>
      ) : (
        <FlatList
          data={data}
          keyExtractor={b => b.id ?? b._id}
          contentContainerStyle={{ padding: Spacing.base, paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={{ alignItems: 'center', paddingTop: 60 }}>
              <Text style={{ fontSize: 48, marginBottom: 12 }}>🔍</Text>
              <Text style={{ fontSize: Typography.sizes.lg, color: Colors.textSecondary, fontFamily: Typography.displayMed }}>No results found</Text>
            </View>
          }
          renderItem={({ item, index }) => (
            <View>
              {activeTab === 0 && item.reason && (
                <View style={styles.reasonRow}>
                  <View style={styles.reasonDot} />
                  <Text style={styles.reasonText}>{item.reason}</Text>
                </View>
              )}
              <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 8 }}>
                <View style={styles.rankBadge}><Text style={styles.rankNum}>#{index + 1}</Text></View>
                <View style={{ flex: 1 }}><BusinessCard business={item} showSave /></View>
              </View>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.surfaceAlt },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: Spacing.base, backgroundColor: Colors.surface },
  headerTitle: { fontSize: Typography.sizes['2xl'], fontFamily: Typography.display, color: Colors.text },
  headerSub: { fontSize: 13, color: Colors.textSecondary, marginTop: 2 },
  aiBadge: { backgroundColor: Colors.accent, paddingHorizontal: 12, paddingVertical: 6, borderRadius: Radius.full },
  aiBadgeText: { color: Colors.textInverse, fontFamily: Typography.bodySemiBold, fontSize: 13 },
  infoBanner: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: Colors.primaryMuted, marginHorizontal: Spacing.base, marginVertical: Spacing.md, padding: Spacing.md, borderRadius: Radius.lg, borderWidth: 1, borderColor: Colors.primary + '30' },
  infoTitle: { fontSize: 14, fontFamily: Typography.bodySemiBold, color: Colors.primary, marginBottom: 2 },
  infoText: { fontSize: 12, color: Colors.textSecondary },
  tabs: { paddingHorizontal: Spacing.base, gap: 8, paddingBottom: Spacing.sm, backgroundColor: Colors.surface, paddingTop: Spacing.sm },
  tab: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: Radius.full, borderWidth: 1.5, borderColor: Colors.border, backgroundColor: Colors.surfaceAlt },
  tabActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  tabLabel: { fontSize: 13, fontFamily: Typography.bodySemiBold, color: Colors.textSecondary },
  tabLabelActive: { color: Colors.textInverse },
  reasonRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6, paddingLeft: 44 },
  reasonDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.primary },
  reasonText: { fontSize: 12, color: Colors.primary, fontFamily: Typography.bodySemiBold },
  rankBadge: { width: 32, height: 32, borderRadius: 16, backgroundColor: Colors.accent, alignItems: 'center', justifyContent: 'center', marginTop: 16 },
  rankNum: { fontSize: 12, color: Colors.textInverse, fontFamily: Typography.bodySemiBold },
});
