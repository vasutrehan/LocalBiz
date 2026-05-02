import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, SafeAreaView, ScrollView,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors, Typography, Spacing, Radius, Shadow } from 'src/constants/theme';
import { useBusinessStore } from 'src/store/businessStore';
import { Button } from 'src/components/UI';

export default function WriteReviewScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getBusinessById } = useBusinessStore();
  const business = getBusinessById(id ?? '');
  const [rating, setRating] = useState(0);
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) return;
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 1000)); // Replace with API call
    setSubmitting(false);
    setSubmitted(true);
    setTimeout(() => router.back(), 1800);
  };

  if (submitted) {
    return (
      <SafeAreaView style={[styles.safe, { alignItems: 'center', justifyContent: 'center' }]}>
        <Text style={{ fontSize: 64, marginBottom: 16 }}>🎉</Text>
        <Text style={styles.successTitle}>Review submitted!</Text>
        <Text style={styles.successSub}>Thank you for helping the community</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backText}>← Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Write a Review</Text>
          <View style={{ width: 60 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scroll}>
          {business && (
            <View style={styles.bizInfo}>
              <Text style={styles.bizName}>{business.name}</Text>
              <Text style={styles.bizAddr}>{business.address}</Text>
            </View>
          )}

          {/* Star selector */}
          <View style={styles.ratingSection}>
            <Text style={styles.ratingLabel}>Your rating</Text>
            <View style={styles.starsRow}>
              {[1, 2, 3, 4, 5].map(s => (
                <TouchableOpacity key={s} onPress={() => setRating(s)} activeOpacity={0.8}>
                  <Text style={[styles.star, { color: s <= rating ? '#F59E0B' : Colors.border }]}>★</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.ratingCaption}>
              {rating === 0 ? 'Tap to rate' : ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][rating]}
            </Text>
          </View>

          {/* Review text */}
          <View style={styles.textSection}>
            <Text style={styles.textLabel}>Your experience</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Tell others about your visit — what did you like? What could be better?"
              placeholderTextColor={Colors.textTertiary}
              value={text}
              onChangeText={setText}
              multiline
              numberOfLines={6}
              maxLength={500}
              textAlignVertical="top"
            />
            <Text style={styles.charCount}>{text.length}/500</Text>
          </View>

          <Button
            label="Submit Review"
            onPress={handleSubmit}
            loading={submitting}
            disabled={rating === 0}
            fullWidth
            size="lg"
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.surfaceAlt },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: Spacing.base, backgroundColor: Colors.surface, borderBottomWidth: 1, borderBottomColor: Colors.border },
  headerTitle: { fontSize: Typography.sizes.lg, fontFamily: Typography.display, color: Colors.text },
  backText: { color: Colors.textSecondary, fontSize: Typography.sizes.base },
  scroll: { padding: Spacing.base, gap: Spacing.md },

  bizInfo: { backgroundColor: Colors.surface, borderRadius: Radius.xl, padding: Spacing.base, ...Shadow.sm },
  bizName: { fontSize: Typography.sizes.lg, fontFamily: Typography.displayMed, color: Colors.text, marginBottom: 4 },
  bizAddr: { fontSize: 13, color: Colors.textSecondary },

  ratingSection: { backgroundColor: Colors.surface, borderRadius: Radius.xl, padding: Spacing.xl, alignItems: 'center', ...Shadow.sm },
  ratingLabel: { fontSize: Typography.sizes.base, fontFamily: Typography.displayMed, color: Colors.text, marginBottom: Spacing.md },
  starsRow: { flexDirection: 'row', gap: 10, marginBottom: 10 },
  star: { fontSize: 48 },
  ratingCaption: { fontSize: Typography.sizes.base, color: Colors.textSecondary, fontFamily: Typography.bodyRegular },

  textSection: { backgroundColor: Colors.surface, borderRadius: Radius.xl, padding: Spacing.base, ...Shadow.sm },
  textLabel: { fontSize: Typography.sizes.base, fontFamily: Typography.displayMed, color: Colors.text, marginBottom: Spacing.md },
  textInput: { borderWidth: 1.5, borderColor: Colors.border, borderRadius: Radius.lg, padding: Spacing.md, minHeight: 130, fontSize: Typography.sizes.base, color: Colors.text, fontFamily: Typography.bodyRegular, backgroundColor: Colors.surfaceAlt },
  charCount: { fontSize: 11, color: Colors.textTertiary, alignSelf: 'flex-end', marginTop: 6 },

  successTitle: { fontSize: Typography.sizes['2xl'], fontFamily: Typography.display, color: Colors.text, marginBottom: 8 },
  successSub: { fontSize: Typography.sizes.base, color: Colors.textSecondary },
});
