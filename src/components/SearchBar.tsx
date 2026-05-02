import React, { useRef, useState } from 'react';
import {
  View, TextInput, TouchableOpacity, Text,
  StyleSheet, Animated,
} from 'react-native';
import { Colors, Typography, Spacing, Radius, Shadow } from '../constants/theme';
import { useBusinessStore } from '../store/businessStore';

interface SearchBarProps {
  onFilterPress?: () => void;
  filterCount?: number;
  placeholder?: string;
  autoFocus?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onFilterPress, filterCount = 0, placeholder = 'Search businesses, services…',
  autoFocus, onFocus, onBlur,
}) => {
  const { searchQuery, searchBusinesses } = useBusinessStore();
  const [focused, setFocused] = useState(false);
  const animVal = useRef(new Animated.Value(0)).current;

  const handleFocus = () => {
    setFocused(true);
    Animated.timing(animVal, { toValue: 1, duration: 200, useNativeDriver: false }).start();
    onFocus?.();
  };

  const handleBlur = () => {
    setFocused(false);
    Animated.timing(animVal, { toValue: 0, duration: 200, useNativeDriver: false }).start();
    onBlur?.();
  };

  const borderColor = animVal.interpolate({
    inputRange: [0, 1],
    outputRange: [Colors.border, Colors.primary],
  });

  return (
    <Animated.View style={[styles.container, { borderColor }, Shadow.sm]}>
      <Text style={styles.icon}>🔍</Text>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={Colors.textTertiary}
        value={searchQuery}
        onChangeText={searchBusinesses}
        onFocus={handleFocus}
        onBlur={handleBlur}
        autoFocus={autoFocus}
        returnKeyType="search"
        clearButtonMode="while-editing"
      />
      {searchQuery.length > 0 && (
        <TouchableOpacity onPress={() => searchBusinesses('')} style={styles.clearBtn}>
          <Text style={styles.clearText}>✕</Text>
        </TouchableOpacity>
      )}
      {onFilterPress && (
        <TouchableOpacity style={styles.filterBtn} onPress={onFilterPress} activeOpacity={0.8}>
          <Text style={styles.filterIcon}>⚙</Text>
          {filterCount > 0 && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>{filterCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.surfaceCard,
    borderRadius: Radius.xl, borderWidth: 1.5,
    paddingHorizontal: Spacing.base,
    height: 52,
  },
  icon: { fontSize: 18, marginRight: 10 },
  input: {
    flex: 1, fontSize: Typography.sizes.base,
    color: Colors.text, fontFamily: Typography.bodyRegular,
    height: '100%',
  },
  clearBtn: { paddingHorizontal: 6 },
  clearText: { fontSize: 13, color: Colors.textTertiary },
  filterBtn: {
    marginLeft: 10, width: 38, height: 38,
    backgroundColor: Colors.primaryMuted,
    borderRadius: Radius.md,
    alignItems: 'center', justifyContent: 'center',
  },
  filterIcon: { fontSize: 16 },
  filterBadge: {
    position: 'absolute', top: -4, right: -4,
    width: 18, height: 18, borderRadius: 9,
    backgroundColor: Colors.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  filterBadgeText: { fontSize: 10, color: '#fff', fontFamily: Typography.bodySemiBold },
});
