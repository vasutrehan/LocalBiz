import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, StyleSheet, ScrollView,
  KeyboardAvoidingView, Platform, Alert, ActivityIndicator,
  TouchableOpacity, Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Colors, Typography, Spacing, Radius, Shadow } from '../src/constants/theme';
import { Button } from '../src/components/UI';
import { api, API_BASE_URL } from '../src/config/api';

const BASE = API_BASE_URL.replace('/api', '');

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

export default function EditBusinessScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const [form, setForm] = useState({
    name: '', category: '', description: '', phone: '',
    whatsapp: '', address: '', city: '', pincode: '',
    latitude: '', longitude: '',
  });

  const defaultHours = { open: true, from: '09:00', to: '21:00' };
  const [hours, setHours] = useState<any>({
    monday: { ...defaultHours }, tuesday: { ...defaultHours }, wednesday: { ...defaultHours },
    thursday: { ...defaultHours }, friday: { ...defaultHours }, saturday: { ...defaultHours },
    sunday: { ...defaultHours },
  });

  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [logo, setLogo] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    const fetch = async () => {
      try {
        const res = await api.get(`/businesses/${id}`);
        const d = res.data.data;
        setForm({
          name: d.name || '', category: d.category || '', description: d.description || '',
          phone: d.phone || '', whatsapp: d.whatsapp || '', address: d.address || '',
          city: d.city || '', pincode: d.pincode || '',
          latitude: d.location?.coordinates?.[1]?.toString() || '',
          longitude: d.location?.coordinates?.[0]?.toString() || '',
        });
        if (d.openingHours) setHours(d.openingHours);
        if (d.coverImage) setCoverImage(d.coverImage);
        if (d.logo) setLogo(d.logo);
      } catch {
        setError('Failed to load business details.');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  const set = (key: keyof typeof form) => (val: string) => setForm(f => ({ ...f, [key]: val }));
  const toggleDay = (day: string) => setHours((h: any) => ({ ...h, [day]: { ...h[day], open: !h[day].open } }));
  const setTime = (day: string, field: string, val: string) => setHours((h: any) => ({ ...h, [day]: { ...h[day], [field]: val } }));

  const pickAndUploadPhoto = async (type: 'cover' | 'logo') => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please allow photo access.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaType.IMAGE,
      allowsEditing: true,
      aspect: type === 'logo' ? [1, 1] : [16, 9],
      quality: 0.8,
    });
    if (result.canceled || !result.assets[0]) return;
    const asset = result.assets[0];

    if (type === 'cover') setUploadingCover(true);
    else setUploadingLogo(true);

    try {
      const formData = new FormData();
      formData.append('photo', { uri: asset.uri, name: `photo-${Date.now()}.jpg`, type: 'image/jpeg' } as any);
      const res = await api.put(`/businesses/${id}/photo?type=${type === 'logo' ? 'logo' : 'cover'}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (type === 'cover') setCoverImage(res.data.data.coverImage);
      else setLogo(res.data.data.logo);
    } catch (err: any) {
      Alert.alert('Upload failed', err.response?.data?.error || 'Could not upload image');
    } finally {
      if (type === 'cover') setUploadingCover(false);
      else setUploadingLogo(false);
    }
  };

  const handleSave = async () => {
    setError('');
    if (!form.name || !form.category || !form.address || !form.city) {
      setError('Please fill in required fields (Name, Category, Address, City)');
      return;
    }
    setSaving(true);
    try {
      const payload: any = {
        name: form.name, category: form.category.toLowerCase(),
        description: form.description, phone: form.phone,
        address: form.address, city: form.city, pincode: form.pincode,
        openingHours: hours,
      };
      if (form.whatsapp) payload.whatsapp = form.whatsapp;
      if (form.latitude && form.longitude) {
        payload.latitude = parseFloat(form.latitude);
        payload.longitude = parseFloat(form.longitude);
      }
      await api.put(`/businesses/${id}`, payload);
      Alert.alert('Success', 'Business info updated!', [{ text: 'OK', onPress: () => router.back() }]);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <Stack.Screen options={{ title: 'Edit Business' }} />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <Stack.Screen options={{ title: 'Edit Business' }} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

          {/* Photo Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Photos</Text>
            
            {/* Cover Image */}
            <Text style={styles.photoLabel}>Cover Photo (Banner)</Text>
            <TouchableOpacity style={styles.coverContainer} onPress={() => pickAndUploadPhoto('cover')}>
              {uploadingCover ? (
                <View style={styles.coverPlaceholder}><ActivityIndicator color={Colors.primary} /></View>
              ) : coverImage ? (
                <>
                  <Image source={{ uri: coverImage }} style={styles.coverImg} />
                  <View style={styles.coverEditOverlay}><Text style={{ color: '#fff', fontSize: 13 }}>📷 Change Cover</Text></View>
                </>
              ) : (
                <View style={styles.coverPlaceholder}>
                  <Text style={{ fontSize: 32, marginBottom: 8 }}>🖼️</Text>
                  <Text style={styles.coverPlaceholderText}>Tap to upload cover photo</Text>
                </View>
              )}
            </TouchableOpacity>

            {/* Logo */}
            <Text style={[styles.photoLabel, { marginTop: Spacing.lg }]}>Business Logo / Profile Picture</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.md }}>
              <TouchableOpacity style={styles.logoContainer} onPress={() => pickAndUploadPhoto('logo')}>
                {uploadingLogo ? (
                  <ActivityIndicator color={Colors.primary} />
                ) : logo ? (
                  <Image source={{ uri: logo }} style={styles.logoImg} />
                ) : (
                  <Text style={{ fontSize: 30 }}>🏪</Text>
                )}
              </TouchableOpacity>
              <View>
                <Text style={styles.logoHint}>Square image recommended</Text>
                <TouchableOpacity onPress={() => pickAndUploadPhoto('logo')}>
                  <Text style={{ color: Colors.primary, fontFamily: Typography.bodySemiBold, fontSize: 14 }}>
                    {logo ? '📷 Change Logo' : '📷 Upload Logo'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {error ? (
            <View style={styles.errorBanner}><Text style={styles.errorText}>⚠ {error}</Text></View>
          ) : null}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Basic Info</Text>
            <Field label="Business Name" placeholder="e.g. Sharma Sweets" value={form.name} onChange={set('name')} required />
            <Field label="Category" placeholder="e.g. food, retail, services" value={form.category} onChange={set('category')} required />
            <Field label="Description" placeholder="Tell customers what you offer..." value={form.description} onChange={set('description')} multiline />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contact</Text>
            <Field label="Phone Number" placeholder="Primary contact number" value={form.phone} onChange={set('phone')} type="phone-pad" required />
            <Field label="WhatsApp Number" placeholder="Optional" value={form.whatsapp} onChange={set('whatsapp')} type="phone-pad" />
          </View>

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
            <Field label="Street Address" placeholder="Shop/Building, street" value={form.address} onChange={set('address')} required />
            <View style={{ flexDirection: 'row', gap: Spacing.md }}>
              <View style={{ flex: 1 }}><Field label="City" placeholder="City name" value={form.city} onChange={set('city')} required /></View>
              <View style={{ flex: 1 }}><Field label="Pincode" placeholder="Postal code" value={form.pincode} onChange={set('pincode')} type="number-pad" /></View>
            </View>
            <View style={styles.gpsContainer}>
              <Text style={styles.gpsLabel}>Map Coordinates (Optional)</Text>
              <View style={{ flexDirection: 'row', gap: Spacing.md }}>
                <View style={{ flex: 1 }}><Field label="Latitude" placeholder="e.g. 28.53" value={form.latitude} onChange={set('latitude')} type="numeric" /></View>
                <View style={{ flex: 1 }}><Field label="Longitude" placeholder="e.g. 77.39" value={form.longitude} onChange={set('longitude')} type="numeric" /></View>
              </View>
            </View>
          </View>

          <Button
            label="Save Changes"
            onPress={handleSave}
            loading={saving}
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
  section: { backgroundColor: Colors.surface, padding: Spacing.lg, borderRadius: Radius.xl, marginBottom: Spacing.lg, ...Shadow.sm },
  sectionTitle: { fontSize: Typography.sizes.lg, fontFamily: Typography.bodySemiBold, color: Colors.text, marginBottom: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.border, paddingBottom: Spacing.sm },
  errorBanner: { backgroundColor: Colors.errorLight, padding: Spacing.md, borderRadius: Radius.md, marginBottom: Spacing.lg },
  errorText: { fontSize: 13, color: Colors.error, fontFamily: Typography.bodySemiBold },

  photoLabel: { fontSize: 13, fontFamily: Typography.bodySemiBold, color: Colors.text, marginBottom: 8 },
  coverContainer: { borderRadius: Radius.lg, overflow: 'hidden', height: 180, backgroundColor: Colors.surfaceAlt, borderWidth: 1.5, borderColor: Colors.border, borderStyle: 'dashed' },
  coverImg: { width: '100%', height: '100%', resizeMode: 'cover' },
  coverEditOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.5)', padding: 10, alignItems: 'center' },
  coverPlaceholder: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  coverPlaceholderText: { fontSize: 13, color: Colors.textSecondary },
  logoContainer: { width: 72, height: 72, borderRadius: 36, backgroundColor: Colors.primaryMuted, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: Colors.primary },
  logoImg: { width: 72, height: 72, borderRadius: 36 },
  logoHint: { fontSize: 12, color: Colors.textTertiary, marginBottom: 4 },

  inputGroup: { marginBottom: Spacing.md },
  inputLabel: { fontSize: 13, fontFamily: Typography.bodySemiBold, color: Colors.text, marginBottom: 6 },
  input: { borderWidth: 1.5, borderColor: Colors.border, borderRadius: Radius.lg, paddingHorizontal: Spacing.md, height: 52, backgroundColor: Colors.surfaceAlt, fontSize: Typography.sizes.base, color: Colors.text, fontFamily: Typography.bodyRegular },
  inputMultiline: { height: 100, paddingTop: Spacing.md, textAlignVertical: 'top' },

  hourRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  dayText: { fontSize: Typography.sizes.base, fontFamily: Typography.bodySemiBold, color: Colors.text, textTransform: 'capitalize' },
  timeInput: { flex: 1, borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.md, height: 40, paddingHorizontal: 10, backgroundColor: Colors.surfaceAlt, color: Colors.text },

  gpsContainer: { marginTop: Spacing.sm, paddingTop: Spacing.md, borderTopWidth: 1, borderTopColor: Colors.border, borderStyle: 'dashed' },
  gpsLabel: { fontSize: 13, fontFamily: Typography.bodySemiBold, color: Colors.textSecondary, marginBottom: Spacing.sm },
});
