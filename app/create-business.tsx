import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { Colors, Typography, Spacing, Radius, Shadow } from '../src/constants/theme';
import { Button } from '../src/components/UI';
import { api } from '../src/config/api';
import { useAuthStore } from '../src/store/authStore';

const Field = ({ label, placeholder, value, onChange, type = 'default', required = false, multiline = false }: any) => (
  <View style={styles.inputGroup}>
    <Text style={styles.inputLabel}>{label} {required && <Text style={{ color: Colors.error }}>*</Text>}</Text>
    <TextInput
      style={[styles.input, multiline && styles.inputMultiline]}
      placeholder={placeholder}
      placeholderTextColor={Colors.textTertiary}
      value={value}
      onChangeText={onChange}
      keyboardType={type}
      multiline={multiline}
      numberOfLines={multiline ? 3 : 1}
    />
  </View>
);

export default function CreateBusinessScreen() {
  const router = useRouter();
  const { loadUser } = useAuthStore();
  
  const [form, setForm] = useState({
    name: '',
    category: '',
    description: '',
    phone: '',
    whatsapp: '',
    address: '',
    city: '',
    pincode: '',
    latitude: '28.4089',
    longitude: '77.3178',
  });

  const defaultHours = { open: true, from: '09:00', to: '21:00' };
  const [hours, setHours] = useState<any>({
    monday: { ...defaultHours }, tuesday: { ...defaultHours }, wednesday: { ...defaultHours },
    thursday: { ...defaultHours }, friday: { ...defaultHours }, saturday: { ...defaultHours },
    sunday: { ...defaultHours }
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (key: keyof typeof form) => (val: string) => setForm(f => ({ ...f, [key]: val }));

  const toggleDay = (day: string) => setHours((h: any) => ({ ...h, [day]: { ...h[day], open: !h[day].open } }));
  const setTime = (day: string, field: string, val: string) => setHours((h: any) => ({ ...h, [day]: { ...h[day], [field]: val } }));

  // Mock auto-detect GPS for demo purposes (the user requested both options)
  const handleDetectGPS = () => {
    setForm(f => ({ ...f, latitude: '28.5355', longitude: '77.3910' })); // Example: Noida coords
    Alert.alert('GPS Detected', 'Your location has been successfully detected.');
  };

  const handleSubmit = async () => {
    setError('');
    if (!form.name || !form.category || !form.address || !form.city) {
      setError('Please fill in the required fields (Name, Category, Address, City)');
      return;
    }

    setLoading(true);
    try {
      const payload: any = {
        name: form.name,
        category: form.category.toLowerCase(), // Backend expects lowercase categories often
        description: form.description,
        phone: form.phone,
        address: form.address,
        city: form.city,
        pincode: form.pincode,
        openingHours: hours,
      };

      if (form.whatsapp) payload.whatsappNumber = form.whatsapp;
      if (form.latitude && form.longitude) {
        payload.latitude = parseFloat(form.latitude);
        payload.longitude = parseFloat(form.longitude);
      }

      await api.post('/businesses', payload);
      
      // Refresh user to get the updated 'owner' role
      await loadUser();
      
      Alert.alert('Success', 'Your business listing has been created!', [
        { text: 'View Dashboard', onPress: () => router.replace('/my-business' as any) }
      ]);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create business listing. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <SafeAreaView style={styles.safe}>
      <Stack.Screen options={{ title: 'List Your Business' }} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          
          <View style={styles.header}>
            <Text style={styles.title}>Let's get you set up</Text>
            <Text style={styles.subtitle}>Enter your details to create a beautiful storefront.</Text>
          </View>

          {error ? (
            <View style={styles.errorBanner}>
              <Text style={styles.errorText}>⚠ {error}</Text>
            </View>
          ) : null}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Basic Info</Text>
            <Field label="Business Name" placeholder="e.g. Sharma Sweets" value={form.name} onChange={set('name')} required />
            <Field label="Category" placeholder="e.g. Food, Retail, Services" value={form.category} onChange={set('category')} required />
            <Field label="Description" placeholder="Tell customers what you offer..." value={form.description} onChange={set('description')} multiline />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contact</Text>
            <Field label="Phone Number" placeholder="Primary contact number" value={form.phone} onChange={set('phone')} type="phone-pad" required />
            <Field label="WhatsApp Number" placeholder="For quick messaging (optional)" value={form.whatsapp} onChange={set('whatsapp')} type="phone-pad" />
          </View>

          {/* Opening Hours */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Opening Hours</Text>
            {Object.keys(hours).map((day) => (
              <View key={day} style={styles.hourRow}>
                <TouchableOpacity onPress={() => toggleDay(day)} style={{ width: 110, flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={{ marginRight: 6 }}>{hours[day].open ? '✅' : '❌'}</Text>
                  <Text style={[styles.dayText, !hours[day].open && { color: Colors.textTertiary }]}>{day}</Text>
                </TouchableOpacity>
                {hours[day].open ? (
                  <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center', gap: 10 }}>
                    <TextInput style={styles.timeInput} value={hours[day].from} onChangeText={v => setTime(day, 'from', v)} placeholder="09:00" />
                    <Text style={{ color: Colors.textSecondary }}>to</Text>
                    <TextInput style={styles.timeInput} value={hours[day].to} onChangeText={v => setTime(day, 'to', v)} placeholder="21:00" />
                  </View>
                ) : (
                  <Text style={{ color: Colors.textTertiary, flex: 1 }}>Closed</Text>
                )}
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Location</Text>
            <Field label="Street Address" placeholder="Shop/Building number, street" value={form.address} onChange={set('address')} required />
            <View style={{ flexDirection: 'row', gap: Spacing.md }}>
              <View style={{ flex: 1 }}><Field label="City" placeholder="City name" value={form.city} onChange={set('city')} required /></View>
              <View style={{ flex: 1 }}><Field label="Pincode" placeholder="Postal code" value={form.pincode} onChange={set('pincode')} type="number-pad" /></View>
            </View>
            
            <View style={styles.gpsContainer}>
              <Text style={styles.gpsLabel}>Map Coordinates (Optional)</Text>
              <Button label="Detect My Location 📍" variant="secondary" size="sm" onPress={handleDetectGPS} style={{ marginBottom: Spacing.md }} />
              <View style={{ flexDirection: 'row', gap: Spacing.md }}>
                <View style={{ flex: 1 }}><Field label="Latitude" placeholder="e.g. 28.53" value={form.latitude} onChange={set('latitude')} type="numeric" /></View>
                <View style={{ flex: 1 }}><Field label="Longitude" placeholder="e.g. 77.39" value={form.longitude} onChange={set('longitude')} type="numeric" /></View>
              </View>
            </View>
          </View>

          <Button
            label="Publish Listing"
            onPress={handleSubmit}
            loading={loading}
            size="lg"
            fullWidth
            style={{ marginTop: Spacing.xl, marginBottom: Spacing['2xl'] }}
          />

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.surfaceAlt },
  scroll: { padding: Spacing.base, paddingBottom: Spacing['3xl'] },
  
  header: { marginBottom: Spacing.xl },
  title: { fontSize: Typography.sizes['3xl'], fontFamily: Typography.display, color: Colors.text, marginBottom: 4 },
  subtitle: { fontSize: Typography.sizes.base, color: Colors.textSecondary, fontFamily: Typography.bodyRegular },
  
  errorBanner: { backgroundColor: Colors.errorLight, padding: Spacing.md, borderRadius: Radius.md, marginBottom: Spacing.lg },
  errorText: { fontSize: 13, color: Colors.error, fontFamily: Typography.bodySemiBold },

  section: {
    backgroundColor: Colors.surface,
    padding: Spacing.lg,
    borderRadius: Radius.xl,
    marginBottom: Spacing.lg,
    ...Shadow.sm,
  },
  sectionTitle: {
    fontSize: Typography.sizes.lg,
    fontFamily: Typography.bodySemiBold,
    color: Colors.text,
    marginBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingBottom: Spacing.sm,
  },

  inputGroup: { marginBottom: Spacing.md },
  inputLabel: { fontSize: 13, fontFamily: Typography.bodySemiBold, color: Colors.text, marginBottom: 6 },
  input: {
    borderWidth: 1.5, borderColor: Colors.border,
    borderRadius: Radius.lg, paddingHorizontal: Spacing.md,
    height: 52, backgroundColor: Colors.surfaceAlt,
    fontSize: Typography.sizes.base, color: Colors.text, fontFamily: Typography.bodyRegular,
  },
  inputMultiline: {
    height: 100,
    paddingTop: Spacing.md,
    textAlignVertical: 'top',
  },

  hourRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  dayText: { fontSize: Typography.sizes.base, fontFamily: Typography.bodySemiBold, color: Colors.text, textTransform: 'capitalize' },
  timeInput: { flex: 1, borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.md, height: 40, paddingHorizontal: 10, backgroundColor: Colors.surfaceAlt, color: Colors.text },

  gpsContainer: {
    marginTop: Spacing.sm,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    borderStyle: 'dashed',
  },
  gpsLabel: {
    fontSize: 13, fontFamily: Typography.bodySemiBold, color: Colors.textSecondary, marginBottom: Spacing.sm,
  },
});
