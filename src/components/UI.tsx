import React from 'react';
import {
  TouchableOpacity, Text, View, ActivityIndicator,
  StyleSheet, ViewStyle, TextStyle,
} from 'react-native';
import { Colors, Typography, Spacing, Radius, Shadow } from '../constants/theme';

// ─────────────────────────────────────────────
// Button
// ─────────────────────────────────────────────
interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: ViewStyle;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  label, onPress, variant = 'primary', size = 'md',
  loading, disabled, leftIcon, rightIcon, style, fullWidth,
}) => {
  const isDisabled = disabled || loading;
  const containerStyles: any[] = [
    styles.btnBase,
    styles[`btn_${variant}` as keyof typeof styles],
    styles[`btn_${size}` as keyof typeof styles],
    isDisabled && styles.btnDisabled,
    fullWidth && { alignSelf: 'stretch' as const },
    style,
  ];

  return (
    <TouchableOpacity
      style={containerStyles}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.82}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? Colors.textInverse : Colors.primary} size="small" />
      ) : (
        <>
          {leftIcon && <View style={{ marginRight: 6 }}>{leftIcon}</View>}
          <Text style={[styles.btnLabel, styles[`btnLabel_${variant}`], styles[`btnLabelSize_${size}`]]}>
            {label}
          </Text>
          {rightIcon && <View style={{ marginLeft: 6 }}>{rightIcon}</View>}
        </>
      )}
    </TouchableOpacity>
  );
};

// ─────────────────────────────────────────────
// Badge
// ─────────────────────────────────────────────
interface BadgeProps {
  label: string;
  color?: string;
  textColor?: string;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  label, color = Colors.primaryMuted, textColor = Colors.primary, size = 'md',
}) => (
  <View style={[badgeStyles.container, { backgroundColor: color }, size === 'sm' && badgeStyles.sm]}>
    <Text style={[badgeStyles.label, { color: textColor }, size === 'sm' && badgeStyles.labelSm]}>
      {label}
    </Text>
  </View>
);

// ─────────────────────────────────────────────
// StarRating
// ─────────────────────────────────────────────
interface StarRatingProps {
  rating: number;
  size?: number;
  showCount?: boolean;
  count?: number;
}

export const StarRating: React.FC<StarRatingProps> = ({ rating, size = 14, showCount, count }) => {
  const stars = Array.from({ length: 5 }, (_, i) => {
    const filled = i < Math.floor(rating);
    const half = !filled && i < rating;
    return { filled, half };
  });

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
      {stars.map((s, i) => (
        <Text key={i} style={{ fontSize: size, color: s.filled || s.half ? '#F59E0B' : Colors.border }}>
          {s.filled ? '★' : s.half ? '⯨' : '★'}
        </Text>
      ))}
      {showCount && (
        <Text style={{ fontSize: size - 1, color: Colors.textSecondary, marginLeft: 3 }}>
          {rating.toFixed(1)} ({count?.toLocaleString()})
        </Text>
      )}
    </View>
  );
};

// ─────────────────────────────────────────────
// Tag chip
// ─────────────────────────────────────────────
export const Tag: React.FC<{ label: string; onPress?: () => void }> = ({ label, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={onPress ? 0.7 : 1}
    style={tagStyles.container}
  >
    <Text style={tagStyles.label}>#{label}</Text>
  </TouchableOpacity>
);

// ─────────────────────────────────────────────
// Skeleton loader
// ─────────────────────────────────────────────
export const Skeleton: React.FC<{ width?: number | string; height?: number; radius?: number; style?: ViewStyle }> = ({
  width = '100%', height = 16, radius = Radius.sm, style,
}) => (
  <View style={[{ width: width as number, height, borderRadius: radius, backgroundColor: Colors.shimmer1 }, style]} />
);

export const BusinessCardSkeleton: React.FC = () => (
  <View style={[skeletonStyles.card, Shadow.sm]}>
    <Skeleton height={160} radius={Radius.lg} style={{ marginBottom: 12 }} />
    <Skeleton width="60%" height={20} style={{ marginBottom: 8 }} />
    <Skeleton width="40%" height={14} style={{ marginBottom: 8 }} />
    <Skeleton width="80%" height={14} />
  </View>
);

// ─────────────────────────────────────────────
// Divider
// ─────────────────────────────────────────────
export const Divider: React.FC<{ style?: ViewStyle }> = ({ style }) => (
  <View style={[{ height: 1, backgroundColor: Colors.border }, style]} />
);

// ─────────────────────────────────────────────
// Price indicator ₹₹₹₹
// ─────────────────────────────────────────────
export const PriceIndicator: React.FC<{ level: 1 | 2 | 3 | 4 }> = ({ level }) => (
  <Text style={{ fontSize: 12, color: Colors.textSecondary, letterSpacing: 0.5 }}>
    {Array.from({ length: 4 }, (_, i) => (
      <Text key={i} style={{ color: i < level ? Colors.text : Colors.border }}>₹</Text>
    ))}
  </Text>
);

// ─────────────────────────────────────────────
// Open/Closed chip
// ─────────────────────────────────────────────
export const OpenBadge: React.FC<{ isOpen: boolean }> = ({ isOpen }) => (
  <View style={[openBadgeStyles.container, { backgroundColor: isOpen ? Colors.successLight : Colors.errorLight }]}>
    <View style={[openBadgeStyles.dot, { backgroundColor: isOpen ? Colors.success : Colors.error }]} />
    <Text style={[openBadgeStyles.label, { color: isOpen ? Colors.success : Colors.error }]}>
      {isOpen ? 'Open' : 'Closed'}
    </Text>
  </View>
);

// ─────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────
const styles = StyleSheet.create({
  btnBase: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    borderRadius: Radius.full, alignSelf: 'flex-start',
  },
  btn_primary: { backgroundColor: Colors.primary, ...Shadow.primary },
  btn_secondary: { backgroundColor: Colors.surface, borderWidth: 1.5, borderColor: Colors.primary },
  btn_ghost: { backgroundColor: 'transparent' },
  btn_danger: { backgroundColor: Colors.error },
  btn_sm: { paddingHorizontal: 14, paddingVertical: 8 },
  btn_md: { paddingHorizontal: 20, paddingVertical: 13 },
  btn_lg: { paddingHorizontal: 28, paddingVertical: 16 },
  btnDisabled: { opacity: 0.5 },
  btnLabel: { fontFamily: Typography.bodySemiBold },
  btnLabel_primary: { color: Colors.textInverse },
  btnLabel_secondary: { color: Colors.primary },
  btnLabel_ghost: { color: Colors.primary },
  btnLabel_danger: { color: Colors.textInverse },
  btnLabelSize_sm: { fontSize: Typography.sizes.sm },
  btnLabelSize_md: { fontSize: Typography.sizes.base },
  btnLabelSize_lg: { fontSize: Typography.sizes.md },
});

const badgeStyles = StyleSheet.create({
  container: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: Radius.full, alignSelf: 'flex-start' },
  sm: { paddingHorizontal: 7, paddingVertical: 2 },
  label: { fontSize: 13, fontFamily: Typography.bodySemiBold },
  labelSm: { fontSize: 11 },
});

const tagStyles = StyleSheet.create({
  container: { backgroundColor: Colors.surfaceAlt, paddingHorizontal: 10, paddingVertical: 5, borderRadius: Radius.full, borderWidth: 1, borderColor: Colors.border },
  label: { fontSize: 12, color: Colors.textSecondary, fontFamily: Typography.bodyRegular },
});

const skeletonStyles = StyleSheet.create({
  card: { backgroundColor: Colors.surfaceCard, borderRadius: Radius.lg, padding: 12, marginBottom: 16 },
});

const openBadgeStyles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 9, paddingVertical: 4, borderRadius: Radius.full },
  dot: { width: 6, height: 6, borderRadius: 3 },
  label: { fontSize: 11, fontFamily: Typography.bodySemiBold },
});
