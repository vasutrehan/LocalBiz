import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Typography, Spacing, Radius, Shadow } from '../src/constants/theme';

const MOCK_NOTIFS = [
  { id: '1', type: 'promo', title: '🎉 New business near you!', body: 'Iron Paradise Gym just joined LocalBiz. 0.5 km from you.', read: false, time: '2m ago' },
  { id: '2', type: 'review', title: '⭐ Your review was helpful', body: '15 people found your review of Sharma Dhabha helpful.', read: false, time: '1h ago' },
  { id: '3', type: 'system', title: '✅ Listing verified', body: 'Bright Minds Academy has been verified by our team.', read: true, time: '2h ago' },
  { id: '4', type: 'promo', title: '🍜 Weekend special', body: 'Sharma Dhabha is offering 20% off this weekend.', read: true, time: '1d ago' },
  { id: '5', type: 'system', title: '🔔 Welcome to LocalBiz!', body: 'Discover trusted local businesses right in your neighbourhood.', read: true, time: '3d ago' },
];

export default function NotificationsScreen() {
  const router = useRouter();
  const [notifs, setNotifs] = useState(MOCK_NOTIFS);

  const markAllRead = () => setNotifs(n => n.map(x => ({ ...x, read: true })));
  const unreadCount = notifs.filter(n => !n.read).length;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Notifications</Text>
        {unreadCount > 0
          ? <TouchableOpacity onPress={markAllRead}><Text style={styles.markAll}>Mark all read</Text></TouchableOpacity>
          : <View style={{ width: 80 }} />
        }
      </View>

      <FlatList
        data={notifs}
        keyExtractor={n => n.id}
        contentContainerStyle={{ padding: Spacing.base, gap: Spacing.sm }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.card, !item.read && styles.cardUnread]}
            onPress={() => setNotifs(n => n.map(x => x.id === item.id ? { ...x, read: true } : x))}
            activeOpacity={0.8}
          >
            {!item.read && <View style={styles.unreadDot} />}
            <Text style={styles.notifTitle}>{item.title}</Text>
            <Text style={styles.notifBody}>{item.body}</Text>
            <Text style={styles.notifTime}>{item.time}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={{ fontSize: 48, marginBottom: 12 }}>🔔</Text>
            <Text style={styles.emptyText}>No notifications yet</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.surfaceAlt },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: Spacing.base, backgroundColor: Colors.surface, borderBottomWidth: 1, borderBottomColor: Colors.border },
  back: { fontSize: 24, color: Colors.text, width: 32 },
  title: { fontSize: Typography.sizes.xl, fontFamily: Typography.display, color: Colors.text },
  markAll: { fontSize: 12, color: Colors.primary, fontFamily: Typography.bodySemiBold, width: 80, textAlign: 'right' },
  card: { backgroundColor: Colors.surface, borderRadius: Radius.xl, padding: Spacing.base, ...Shadow.sm, position: 'relative' },
  cardUnread: { borderLeftWidth: 3, borderLeftColor: Colors.primary },
  unreadDot: { position: 'absolute', top: 16, right: 16, width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.primary },
  notifTitle: { fontSize: Typography.sizes.base, fontFamily: Typography.bodySemiBold, color: Colors.text, marginBottom: 4 },
  notifBody: { fontSize: 13, color: Colors.textSecondary, lineHeight: 20, marginBottom: 6 },
  notifTime: { fontSize: 11, color: Colors.textTertiary },
  empty: { alignItems: 'center', paddingTop: 80 },
  emptyText: { fontSize: Typography.sizes.lg, color: Colors.textSecondary, fontFamily: Typography.displayMed },
});
