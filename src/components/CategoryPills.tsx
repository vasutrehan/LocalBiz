import React, { useRef } from 'react';
import {
  ScrollView, TouchableOpacity, Text,
  View, StyleSheet, Animated,
} from 'react-native';
import { CATEGORIES } from '../constants/theme';
import { Colors, Typography, Spacing, Radius } from '../constants/theme';
import { useBusinessStore } from '../store/businessStore';

export const CategoryPills: React.FC = () => {
  const { filters, applyFilters } = useBusinessStore();
  const activeCategory = filters.category ?? 'all';

  const selectCategory = (id: string) => {
    applyFilters({ ...filters, category: id });
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {CATEGORIES.map(cat => {
        const isActive = activeCategory === cat.id;
        return (
          <TouchableOpacity
            key={cat.id}
            style={[styles.pill, isActive && { backgroundColor: Colors.primary, borderColor: Colors.primary }]}
            onPress={() => selectCategory(cat.id)}
            activeOpacity={0.8}
          >
            <Text style={styles.pillIcon}>{cat.icon}</Text>
            <Text style={[styles.pillLabel, isActive && styles.pillLabelActive]}>
              {cat.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContent: { paddingHorizontal: Spacing.base, gap: 8 },
  pill: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: Radius.full, borderWidth: 1.5,
    borderColor: Colors.border, backgroundColor: Colors.surface,
    gap: 5,
  },
  pillIcon: { fontSize: 14 },
  pillLabel: { fontSize: 13, fontFamily: Typography.bodySemiBold, color: Colors.textSecondary },
  pillLabelActive: { color: Colors.textInverse },
});
