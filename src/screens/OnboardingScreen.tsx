import React, { useRef, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  Dimensions, FlatList, Animated, StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Typography, Spacing, Radius, Shadow } from 'src/constants/theme';

const { width, height } = Dimensions.get('window');

const SLIDES = [
  {
    id: '1',
    emoji: '📍',
    title: 'Discover Local',
    subtitle: 'Find trusted businesses, shops and services right in your neighbourhood — all in one place.',
    bg: Colors.primary,
    textColor: '#fff',
  },
  {
    id: '2',
    emoji: '🤖',
    title: 'AI Recommendations',
    subtitle: 'Our smart engine learns your preferences and suggests businesses you\'ll actually love.',
    bg: Colors.accent,
    textColor: '#fff',
  },
  {
    id: '3',
    emoji: '💬',
    title: 'Chat Instantly',
    subtitle: 'Connect with business owners directly on WhatsApp — no apps to install, no waiting.',
    bg: '#25D366',
    textColor: '#fff',
  },
  {
    id: '4',
    emoji: '⭐',
    title: 'Trusted Reviews',
    subtitle: 'Real reviews from real customers. Make informed decisions every time.',
    bg: '#F59E0B',
    textColor: '#fff',
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
      setCurrentIndex(i => i + 1);
    } else {
      router.replace('/login' as any);
    }
  };

  const handleSkip = () => router.replace('/login' as any);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <Animated.FlatList
        ref={flatListRef}
        data={SLIDES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: false })}
        onMomentumScrollEnd={e => setCurrentIndex(Math.round(e.nativeEvent.contentOffset.x / width))}
        keyExtractor={s => s.id}
        scrollEventThrottle={16}
        renderItem={({ item }) => (
          <View style={[styles.slide, { backgroundColor: item.bg }]}>
            <View style={styles.slideDecoration1} />
            <View style={styles.slideDecoration2} />
            <Text style={styles.slideEmoji}>{item.emoji}</Text>
            <Text style={[styles.slideTitle, { color: item.textColor }]}>{item.title}</Text>
            <Text style={[styles.slideSubtitle, { color: item.textColor + 'CC' }]}>{item.subtitle}</Text>
          </View>
        )}
      />

      {/* ── Dots ── */}
      <View style={styles.dotsRow}>
        {SLIDES.map((_, i) => {
          const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
          const dotWidth = scrollX.interpolate({ inputRange, outputRange: [8, 24, 8], extrapolate: 'clamp' });
          const opacity = scrollX.interpolate({ inputRange, outputRange: [0.4, 1, 0.4], extrapolate: 'clamp' });
          return (
            <Animated.View key={i} style={[styles.dot, { width: dotWidth, opacity }]} />
          );
        })}
      </View>

      {/* ── Controls ── */}
      <View style={styles.controls}>
        <TouchableOpacity onPress={handleSkip} style={styles.skipBtn}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleNext} style={styles.nextBtn} activeOpacity={0.88}>
          <Text style={styles.nextText}>
            {currentIndex === SLIDES.length - 1 ? 'Get Started →' : 'Next →'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.accent },
  slide: { width, flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing.base, overflow: 'hidden' },
  slideDecoration1: { position: 'absolute', width: 300, height: 300, borderRadius: 150, backgroundColor: 'rgba(255,255,255,0.08)', top: -80, right: -80 },
  slideDecoration2: { position: 'absolute', width: 200, height: 200, borderRadius: 100, backgroundColor: 'rgba(255,255,255,0.06)', bottom: 100, left: -60 },
  slideEmoji: { fontSize: 88, marginBottom: Spacing['2xl'] },
  slideTitle: { fontSize: Typography.sizes['3xl'], fontFamily: Typography.display, textAlign: 'center', marginBottom: Spacing.lg, letterSpacing: -0.5 },
  slideSubtitle: { fontSize: Typography.sizes.lg, fontFamily: Typography.bodyRegular, textAlign: 'center', lineHeight: 28, paddingHorizontal: Spacing.base },

  dotsRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6, paddingVertical: Spacing.xl, backgroundColor: Colors.accent },
  dot: { height: 8, borderRadius: 4, backgroundColor: '#fff' },

  controls: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.xl, paddingBottom: 48, backgroundColor: Colors.accent },
  skipBtn: { paddingVertical: 12, paddingHorizontal: 16 },
  skipText: { color: 'rgba(255,255,255,0.6)', fontSize: Typography.sizes.base, fontFamily: Typography.bodyRegular },
  nextBtn: { backgroundColor: Colors.primary, paddingHorizontal: Spacing.xl, paddingVertical: 14, borderRadius: Radius.full, ...Shadow.primary },
  nextText: { color: '#fff', fontSize: Typography.sizes.base, fontFamily: Typography.bodySemiBold },
});
