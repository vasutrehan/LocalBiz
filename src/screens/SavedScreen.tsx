import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Typography, Spacing, Radius } from 'src/constants/theme';
import { useAuthStore } from 'src/store/authStore';
import { BusinessCard } from 'src/components/BusinessCard';
import { api } from '../config/api';

export default function SavedScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [saved, setSaved] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => { if (user) fetchSaved(); }, [user]);

  const fetchSaved = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/auth/me');
      const savedBizIds: string[] = res.data.data.savedBusinessIds?.map((b: any) => b._id ?? b) ?? [];
      if (savedBizIds.length === 0) { setSaved([]); return; }
      // Fetch each saved business
      const results = await Promise.allSettled(
        savedBizIds.map(id => api.get(`/businesses/${id}`))
      );
      const businesses = results
        .filter(r => r.status === 'fulfilled')
        .map((r: any) => ({ ...r.value.data.data, id: r.value.data.data._id }));
      setSaved(businesses);
    } catch (e) {
      console.error('Saved fetch error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Saved</Text>
        {!isLoading && <Text style={styles.headerCount}>{saved.length} places</Text>}
      </View>

      {isLoading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : saved.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>♡</Text>
          <Text style={styles.emptyTitle}>Nothing saved yet</Text>
          <Text style={styles.emptySub}>Tap the heart on any business to save it for later</Text>
          <TouchableOpacity style={styles.discoverBtn} onPress={() => router.push('/(tabs)/' as any)}>
            <Text style={styles.discoverBtnText}>Discover businesses →</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={saved}
          keyExtractor={b => b.id ?? b._id}
          contentContainerStyle={{ padding: Spacing.base, paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          onRefresh={fetchSaved}
          refreshing={isLoading}
          renderItem={({ item }) => <BusinessCard business={item} showSave />}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.surfaceAlt },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: Spacing.base, backgroundColor: Colors.surface, borderBottomWidth: 1, borderBottomColor: Colors.border },
  headerTitle: { fontSize: Typography.sizes['2xl'], fontFamily: Typography.display, color: Colors.text },
  headerCount: { fontSize: 13, color: Colors.textTertiary },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing.base },
  emptyIcon: { fontSize: 64, color: Colors.border, marginBottom: 16 },
  emptyTitle: { fontSize: Typography.sizes.xl, fontFamily: Typography.display, color: Colors.text, marginBottom: 8 },
  emptySub: { fontSize: Typography.sizes.base, color: Colors.textSecondary, textAlign: 'center', lineHeight: 22, marginBottom: 28 },
  discoverBtn: { backgroundColor: Colors.primary, paddingHorizontal: 24, paddingVertical: 13, borderRadius: Radius.full },
  discoverBtnText: { color: Colors.textInverse, fontFamily: Typography.bodySemiBold, fontSize: Typography.sizes.base },
});
