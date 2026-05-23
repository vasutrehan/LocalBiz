import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { Colors, Typography, Spacing, Radius, Shadow } from '../src/constants/theme';

export default function TermsScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <Stack.Screen options={{ title: 'Terms & Privacy' }} />
      <ScrollView contentContainerStyle={styles.scroll}>
        
        <View style={styles.card}>
          <Text style={styles.title}>Terms of Service</Text>
          <Text style={styles.date}>Last updated: May 5, 2026</Text>
          <Text style={styles.paragraph}>
            Welcome to LocalBiz. By using our application, you agree to these terms. Please read them carefully.
            We provide a platform to connect local businesses with customers. We do not guarantee the accuracy of business listings, as they are provided by the business owners themselves.
          </Text>
          <Text style={styles.paragraph}>
            Users must not post abusive, fake, or harmful reviews. Business owners must provide accurate information regarding their services and location.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.title}>Privacy Policy</Text>
          <Text style={styles.paragraph}>
            Your privacy is important to us. LocalBiz collects minimal data necessary to provide our services.
          </Text>
          <Text style={styles.subtitle}>1. Information we collect</Text>
          <Text style={styles.paragraph}>
            We collect your name, email address, phone number (optional), and your GPS location (only when permitted by you) to show nearby businesses.
          </Text>
          <Text style={styles.subtitle}>2. How we use your data</Text>
          <Text style={styles.paragraph}>
            We use your data solely for the purpose of operating the application, such as authenticating your account and providing location-based recommendations. We do NOT sell your data to third parties.
          </Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.surfaceAlt },
  scroll: { padding: Spacing.base, paddingBottom: Spacing['3xl'] },
  
  card: { backgroundColor: Colors.surface, padding: Spacing.xl, borderRadius: Radius.xl, marginBottom: Spacing.lg, ...Shadow.sm },
  title: { fontSize: Typography.sizes.xl, fontFamily: Typography.displayMed, color: Colors.text, marginBottom: 8 },
  date: { fontSize: 12, color: Colors.textTertiary, marginBottom: Spacing.md },
  subtitle: { fontSize: Typography.sizes.base, fontFamily: Typography.bodySemiBold, color: Colors.text, marginTop: Spacing.md, marginBottom: 4 },
  paragraph: { fontSize: 14, color: Colors.textSecondary, lineHeight: 22, fontFamily: Typography.bodyRegular, marginBottom: Spacing.sm },
});
