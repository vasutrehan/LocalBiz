import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { Colors, Typography, Spacing, Radius, Shadow } from '../src/constants/theme';

export default function HelpScreen() {
  const router = useRouter();

  const faqs = [
    { q: 'How do I edit my business listing?', a: 'Go to the Profile tab, tap "My Business Listing", and then click the "Edit Profile" button to update your details.' },
    { q: 'Is it free to list my business?', a: 'Yes! LocalBiz is completely free for business owners to list and manage their storefront.' },
    { q: 'Why is my business not showing on the map?', a: 'Make sure you have provided valid coordinates in the "Location" section of your business settings, or click the "Detect My Location" button.' },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <Stack.Screen options={{ title: 'Help & Support' }} />
      <ScrollView contentContainerStyle={styles.scroll}>
        
        <View style={styles.headerCard}>
          <Text style={{ fontSize: 40, marginBottom: 12 }}>💬</Text>
          <Text style={styles.headerTitle}>How can we help?</Text>
          <Text style={styles.headerSub}>We're here to make your experience smooth and successful.</Text>
        </View>

        <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
        <View style={styles.faqContainer}>
          {faqs.map((faq, index) => (
            <View key={index} style={styles.faqCard}>
              <Text style={styles.faqQ}>Q: {faq.q}</Text>
              <Text style={styles.faqA}>{faq.a}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Contact Us</Text>
        <View style={styles.contactContainer}>
          <TouchableOpacity style={styles.contactBtn} onPress={() => Linking.openURL('mailto:support@localbiz.app')}>
            <Text style={styles.contactIcon}>✉️</Text>
            <View>
              <Text style={styles.contactTitle}>Email Support</Text>
              <Text style={styles.contactSub}>support@localbiz.app</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.contactBtn} onPress={() => Linking.openURL('tel:+919876543210')}>
            <Text style={styles.contactIcon}>📞</Text>
            <View>
              <Text style={styles.contactTitle}>Call Us</Text>
              <Text style={styles.contactSub}>Mon-Fri, 9AM-6PM</Text>
            </View>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.surfaceAlt },
  scroll: { padding: Spacing.base, paddingBottom: Spacing['3xl'] },
  
  headerCard: { backgroundColor: Colors.surface, borderRadius: Radius.xl, padding: Spacing.xl, alignItems: 'center', ...Shadow.sm, marginBottom: Spacing.xl },
  headerTitle: { fontSize: Typography.sizes.xl, fontFamily: Typography.display, color: Colors.text, marginBottom: 4 },
  headerSub: { fontSize: Typography.sizes.sm, color: Colors.textSecondary, textAlign: 'center', fontFamily: Typography.bodyRegular },
  
  sectionTitle: { fontSize: Typography.sizes.lg, fontFamily: Typography.displayMed, color: Colors.text, marginBottom: Spacing.md, marginLeft: 4 },
  
  faqContainer: { marginBottom: Spacing.xl },
  faqCard: { backgroundColor: Colors.surface, padding: Spacing.base, borderRadius: Radius.lg, marginBottom: Spacing.sm, ...Shadow.sm },
  faqQ: { fontSize: Typography.sizes.base, fontFamily: Typography.bodySemiBold, color: Colors.text, marginBottom: 6 },
  faqA: { fontSize: 13, color: Colors.textSecondary, lineHeight: 20 },

  contactContainer: { gap: Spacing.sm },
  contactBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface, padding: Spacing.base, borderRadius: Radius.lg, ...Shadow.sm },
  contactIcon: { fontSize: 24, marginRight: Spacing.md },
  contactTitle: { fontSize: Typography.sizes.base, fontFamily: Typography.bodySemiBold, color: Colors.text },
  contactSub: { fontSize: 13, color: Colors.textSecondary },
});
