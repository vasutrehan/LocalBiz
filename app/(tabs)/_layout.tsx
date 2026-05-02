import { Tabs } from 'expo-router';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, Typography, Shadow } from '../../src/constants/theme';

function TabBar({ state, descriptors, navigation }: any) {
  const tabs = [
    { name: 'index', icon: '🏠', label: 'Home' },
    { name: 'map', icon: '🗺', label: 'Map' },
    { name: 'recommendations', icon: '✦', label: 'For You' },
    { name: 'saved', icon: '♡', label: 'Saved' },
    { name: 'profile', icon: '👤', label: 'Profile' },
  ];

  return (
    <View style={styles.tabBar}>
      {state.routes.map((route: any, index: number) => {
        const tab = tabs[index];
        const isFocused = state.index === index;
        return (
          <TouchableOpacity
            key={route.key}
            style={styles.tab}
            onPress={() => {
              if (!isFocused) navigation.navigate(route.name);
            }}
            activeOpacity={0.8}
          >
            {isFocused && <View style={styles.activeIndicator} />}
            <Text style={[styles.tabIcon, isFocused && styles.tabIconActive]}>
              {tab?.icon}
            </Text>
            <Text style={[styles.tabLabel, isFocused && styles.tabLabelActive]}>
              {tab?.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs tabBar={(props) => <TabBar {...props} />} screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" />
      <Tabs.Screen name="map" />
      <Tabs.Screen name="recommendations" />
      <Tabs.Screen name="saved" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingBottom: 24,
    paddingTop: 10,
    paddingHorizontal: 8,
    ...Shadow.lg,
  },
  tab: { flex: 1, alignItems: 'center', position: 'relative', paddingTop: 4 },
  activeIndicator: {
    position: 'absolute', top: -10, width: 32, height: 3,
    borderRadius: 2, backgroundColor: Colors.primary,
  },
  tabIcon: { fontSize: 22, marginBottom: 2, opacity: 0.5 },
  tabIconActive: { opacity: 1 },
  tabLabel: { fontSize: 10, color: Colors.textTertiary, fontFamily: Typography.bodyRegular },
  tabLabelActive: { color: Colors.primary, fontFamily: Typography.bodySemiBold },
});
