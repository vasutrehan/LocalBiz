import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import { 
  View, Text, TouchableOpacity, StyleSheet,
   ScrollView, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Typography, Spacing, Radius, Shadow, SORT_OPTIONS } from 'src/constants/theme';
import { useBusinessStore } from 'src/store/businessStore';
import { Button } from 'src/components/UI';
import { SearchFilters } from 'src/constants/types';

export default function FiltersScreen() {
  const router = useRouter();
  const { filters, applyFilters, resetFilters, filteredBusinesses } = useBusinessStore();
  const [local, setLocal] = useState<SearchFilters>({ ...filters });

  const toggle = (key: keyof SearchFilters, val: any) => setLocal(f => ({ ...f, [key]: val }));

  const handleApply = () => {
    applyFilters(local);
    router.back();
  };

  const handleReset = () => {
    resetFilters();
    router.back();
  };

  const PillGroup = ({ label, options, value, onChange }: {
    label: string;
    options: { id: string | number; label: string }[];
    value: string | number | undefined;
    onChange: (v: any) => void;
  }) => (
    <View style={styles.group}>
      <Text style={styles.groupLabel}>{label}</Text>
      <View style={styles.pillRow}>
        {options.map(o => (
          <TouchableOpacity
            key={String(o.id)}
            style={[styles.pill, value === o.id && styles.pillActive]}
            onPress={() => onChange(o.id)}
            activeOpacity={0.8}
          >
            <Text style={[styles.pillText, value === o.id && styles.pillTextActive]}>{o.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Filters</Text>
        <TouchableOpacity onPress={handleReset}>
          <Text style={styles.resetText}>Reset</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Sort By */}
        <PillGroup
          label="Sort by"
          options={SORT_OPTIONS}
          value={local.sortBy}
          onChange={v => toggle('sortBy', v)}
        />

        {/* Distance */}
        <View style={styles.group}>
          <Text style={styles.groupLabel}>Maximum Distance</Text>
          <View style={styles.pillRow}>
            {[1, 2, 5, 10, 20].map(d => (
              <TouchableOpacity
                key={d}
                style={[styles.pill, local.maxDistance === d && styles.pillActive]}
                onPress={() => toggle('maxDistance', d)}
              >
                <Text style={[styles.pillText, local.maxDistance === d && styles.pillTextActive]}>{d} km</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Min Rating */}
        <View style={styles.group}>
          <Text style={styles.groupLabel}>Minimum Rating</Text>
          <View style={styles.pillRow}>
            {[0, 3, 3.5, 4, 4.5].map(r => (
              <TouchableOpacity
                key={r}
                style={[styles.pill, local.minRating === r && styles.pillActive]}
                onPress={() => toggle('minRating', r)}
              >
                <Text style={[styles.pillText, local.minRating === r && styles.pillTextActive]}>
                  {r === 0 ? 'Any' : `★ ${r}+`}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Price Range */}
        <View style={styles.group}>
          <Text style={styles.groupLabel}>Price Range</Text>
          <View style={styles.pillRow}>
            {[
              { id: 1, label: '₹' },
              { id: 2, label: '₹₹' },
              { id: 3, label: '₹₹₹' },
              { id: 4, label: '₹₹₹₹' },
            ].map(p => {
              const selected = local.priceRange?.includes(p.id);
              return (
                <TouchableOpacity
                  key={p.id}
                  style={[styles.pill, selected && styles.pillActive]}
                  onPress={() => {
                    const curr = local.priceRange ?? [1, 2, 3, 4];
                    toggle('priceRange', selected ? curr.filter(x => x !== p.id) : [...curr, p.id]);
                  }}
                >
                  <Text style={[styles.pillText, selected && styles.pillTextActive]}>{p.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Open Now */}
        <View style={styles.toggleRow}>
          <View>
            <Text style={styles.groupLabel}>Open Now Only</Text>
            <Text style={styles.toggleSub}>Show only currently open businesses</Text>
          </View>
          <Switch
            value={local.isOpen}
            onValueChange={v => toggle('isOpen', v)}
            trackColor={{ false: Colors.border, true: Colors.primary }}
            thumbColor={Colors.surface}
          />
        </View>
      </ScrollView>

      {/* ── Apply button ── */}
      <View style={styles.footer}>
        <Button
          label={`Show ${filteredBusinesses.length} results`}
          onPress={handleApply}
          fullWidth
          size="lg"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.surfaceAlt },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: Spacing.base, backgroundColor: Colors.surface, borderBottomWidth: 1, borderBottomColor: Colors.border },
  headerTitle: { fontSize: Typography.sizes.lg, fontFamily: Typography.display, color: Colors.text },
  cancelText: { fontSize: Typography.sizes.base, color: Colors.textSecondary },
  resetText: { fontSize: Typography.sizes.base, color: Colors.error, fontFamily: Typography.bodySemiBold },

  scroll: { padding: Spacing.base, paddingBottom: 100 },
  group: { backgroundColor: Colors.surface, borderRadius: Radius.xl, padding: Spacing.base, marginBottom: Spacing.md, ...Shadow.sm },
  groupLabel: { fontSize: Typography.sizes.base, fontFamily: Typography.displayMed, color: Colors.text, marginBottom: Spacing.md },
  pillRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  pill: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: Radius.full, borderWidth: 1.5, borderColor: Colors.border, backgroundColor: Colors.surfaceAlt },
  pillActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  pillText: { fontSize: 13, fontFamily: Typography.bodySemiBold, color: Colors.textSecondary },
  pillTextActive: { color: Colors.textInverse },

  toggleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: Colors.surface, borderRadius: Radius.xl, padding: Spacing.base, ...Shadow.sm, marginBottom: Spacing.md },
  toggleSub: { fontSize: 12, color: Colors.textTertiary, marginTop: 2 },

  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: Colors.surface, padding: Spacing.base, paddingBottom: 32, borderTopWidth: 1, borderTopColor: Colors.border },
});
