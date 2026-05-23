import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';
import { 
  View, Text, Image, ScrollView, TouchableOpacity,
  StyleSheet,  Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Typography, Spacing, Radius, Shadow } from 'src/constants/theme';
import { useAuthStore } from 'src/store/authStore';
import { Divider } from 'src/components/UI';

const MENU_ITEMS = [
  { icon: '🏪', label: 'My Business Listing', screen: '/my-business' },
  { icon: '✎', label: 'Edit Profile', screen: '/edit-profile' },
  { icon: '🔔', label: 'Notifications', screen: '/notifications' },
  { icon: '🔒', label: 'Privacy & Security', screen: '/privacy' },
  { icon: '❓', label: 'Help & Support', screen: '/help' },
  { icon: '⭐', label: 'Rate the App', screen: '/rate' },
  { icon: '📋', label: 'Terms & Privacy Policy', screen: '/terms' },
];

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [notificationsOn, setNotificationsOn] = React.useState(true);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* ── Header ── */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
          <TouchableOpacity onPress={() => router.push('/edit-profile' as any)} style={styles.editBtn}>
            <Text style={styles.editBtnText}>Edit</Text>
          </TouchableOpacity>
        </View>

        {/* ── User card ── */}
        <View style={styles.userCard}>
          <View style={styles.avatarWrapper}>
            {user?.avatar
              ? <Image source={{ uri: user.avatar }} style={styles.avatar} />
              : <View style={[styles.avatar, { backgroundColor: Colors.primaryMuted, alignItems: 'center', justifyContent: 'center' }]}>
                  <Text style={{ fontSize: 32 }}>{user?.name.charAt(0)}</Text>
                </View>
            }
            <TouchableOpacity style={styles.avatarEdit}>
              <Text style={{ fontSize: 14 }}>✎</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>{user?.name}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
          {user?.phone && <Text style={styles.userPhone}>{user.phone}</Text>}

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNum}>{user?.savedBusinessIds.length ?? 0}</Text>
              <Text style={styles.statLabel}>Saved</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNum}>12</Text>
              <Text style={styles.statLabel}>Reviews</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNum}>3</Text>
              <Text style={styles.statLabel}>Months</Text>
            </View>
          </View>
        </View>

        {/* ── Menu ── */}
        <View style={styles.menuCard}>
          {MENU_ITEMS.map((item, i) => (
            <React.Fragment key={item.label}>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => router.push(item.screen as any)}
                activeOpacity={0.75}
              >
                <View style={styles.menuIcon}>
                  <Text style={{ fontSize: 18 }}>{item.icon}</Text>
                </View>
                <Text style={styles.menuLabel}>{item.label}</Text>
                <Text style={styles.menuChevron}>›</Text>
              </TouchableOpacity>
              {i < MENU_ITEMS.length - 1 && <Divider style={{ marginLeft: 56 }} />}
            </React.Fragment>
          ))}
        </View>

        {/* ── Notification toggle ── */}
        <View style={styles.toggleCard}>
          <View style={styles.menuIcon}><Text style={{ fontSize: 18 }}>🔔</Text></View>
          <Text style={styles.menuLabel}>Push Notifications</Text>
          <Switch
            value={notificationsOn}
            onValueChange={setNotificationsOn}
            trackColor={{ false: Colors.border, true: Colors.primary }}
            thumbColor={Colors.surface}
          />
        </View>

        {/* ── Logout ── */}
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={() => { logout(); router.replace('/login' as any); }}
          activeOpacity={0.8}
        >
          <Text style={styles.logoutText}>Sign out</Text>
        </TouchableOpacity>

        <Text style={styles.version}>LocalBiz v1.0.0 · Made with ♥ in India</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.surfaceAlt },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: Spacing.base, backgroundColor: Colors.surface },
  headerTitle: { fontSize: Typography.sizes['2xl'], fontFamily: Typography.display, color: Colors.text },
  editBtn: { backgroundColor: Colors.primaryMuted, paddingHorizontal: 14, paddingVertical: 7, borderRadius: Radius.full },
  editBtnText: { color: Colors.primary, fontFamily: Typography.bodySemiBold, fontSize: 13 },

  userCard: { backgroundColor: Colors.surface, margin: Spacing.base, borderRadius: Radius.xl, padding: Spacing.xl, alignItems: 'center', ...Shadow.sm },
  avatarWrapper: { position: 'relative', marginBottom: 14 },
  avatar: { width: 88, height: 88, borderRadius: 44, borderWidth: 3, borderColor: Colors.primaryLight },
  avatarEdit: { position: 'absolute', bottom: 0, right: 0, width: 28, height: 28, borderRadius: 14, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center' },
  userName: { fontSize: Typography.sizes.xl, fontFamily: Typography.display, color: Colors.text, marginBottom: 4 },
  userEmail: { fontSize: 14, color: Colors.textSecondary, fontFamily: Typography.bodyRegular, marginBottom: 2 },
  userPhone: { fontSize: 13, color: Colors.textTertiary },

  statsRow: { flexDirection: 'row', width: '100%', marginTop: Spacing.lg, paddingTop: Spacing.md, borderTopWidth: 1, borderTopColor: Colors.border },
  statItem: { flex: 1, alignItems: 'center' },
  statNum: { fontSize: Typography.sizes.xl, fontFamily: Typography.display, color: Colors.text },
  statLabel: { fontSize: 11, color: Colors.textTertiary, marginTop: 2 },
  statDivider: { width: 1, backgroundColor: Colors.border },

  menuCard: { backgroundColor: Colors.surface, marginHorizontal: Spacing.base, borderRadius: Radius.xl, overflow: 'hidden', ...Shadow.sm, marginBottom: Spacing.md },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.base, paddingVertical: 15 },
  menuIcon: { width: 36, height: 36, borderRadius: Radius.md, backgroundColor: Colors.surfaceAlt, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  menuLabel: { flex: 1, fontSize: Typography.sizes.base, color: Colors.text, fontFamily: Typography.bodyRegular },
  menuChevron: { fontSize: 20, color: Colors.textTertiary },

  toggleCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface, marginHorizontal: Spacing.base, borderRadius: Radius.xl, padding: Spacing.base, ...Shadow.sm, marginBottom: Spacing.md },

  logoutBtn: { marginHorizontal: Spacing.base, paddingVertical: 14, borderRadius: Radius.full, backgroundColor: Colors.errorLight, alignItems: 'center', marginBottom: Spacing.md },
  logoutText: { color: Colors.error, fontFamily: Typography.bodySemiBold, fontSize: Typography.sizes.base },

  version: { textAlign: 'center', fontSize: 12, color: Colors.textTertiary, fontFamily: Typography.bodyRegular, paddingBottom: Spacing.base },
});
