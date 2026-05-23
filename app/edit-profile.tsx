import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, StyleSheet, KeyboardAvoidingView,
  Platform, Alert, ScrollView, TouchableOpacity, Image, ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Colors, Typography, Spacing, Radius, Shadow } from '../src/constants/theme';
import { Button } from '../src/components/UI';
import { api } from '../src/config/api';
import { useAuthStore } from '../src/store/authStore';

export default function EditProfileScreen() {
  const router = useRouter();
  const { user, updateUser, loadUser } = useAuthStore();

  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [avatar, setAvatar] = useState<string | null>(user?.avatar || null);
  const [loading, setLoading] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setForm({ name: user.name, phone: user.phone || '' });
      setAvatar(user.avatar || null);
    }
  }, [user]);

  const set = (key: keyof typeof form) => (val: string) => setForm(f => ({ ...f, [key]: val }));

  const pickAvatar = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please allow photo access to upload a profile picture.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaType.IMAGE,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      uploadAvatar(result.assets[0]);
    }
  };

  const uploadAvatar = async (asset: any) => {
    setUploadingAvatar(true);
    try {
      const formData = new FormData();
      formData.append('avatar', {
        uri: asset.uri,
        name: `avatar-${Date.now()}.jpg`,
        type: 'image/jpeg',
      } as any);
      const res = await api.put('/auth/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const newUrl = res.data.data.avatar;
      setAvatar(newUrl);
      updateUser({ avatar: newUrl });
    } catch (err: any) {
      Alert.alert('Upload failed', err.response?.data?.error || 'Could not upload avatar');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSave = async () => {
    setError('');
    if (!form.name) { setError('Name is required'); return; }
    setLoading(true);
    try {
      await api.put('/auth/updateprofile', form);
      updateUser({ name: form.name, phone: form.phone });
      await loadUser();
      Alert.alert('Success', 'Profile updated!', [{ text: 'OK', onPress: () => router.back() }]);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <Stack.Screen options={{ title: 'Edit Profile' }} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

          {/* Avatar Section */}
          <View style={styles.avatarSection}>
            <TouchableOpacity onPress={pickAvatar} style={styles.avatarContainer}>
              {uploadingAvatar ? (
                <View style={[styles.avatarPlaceholder, { backgroundColor: Colors.primaryMuted }]}>
                  <ActivityIndicator color={Colors.primary} />
                </View>
              ) : avatar ? (
                <Image source={{ uri: avatar }} style={styles.avatarImg} />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Text style={styles.avatarInitial}>{user?.name?.charAt(0)?.toUpperCase() || '?'}</Text>
                </View>
              )}
              <View style={styles.avatarEditBadge}>
                <Text style={{ fontSize: 14 }}>📷</Text>
              </View>
            </TouchableOpacity>
            <Text style={styles.avatarHint}>Tap to change profile picture</Text>
          </View>

          {error ? (
            <View style={styles.errorBanner}><Text style={styles.errorText}>⚠ {error}</Text></View>
          ) : null}

          <View style={styles.section}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Full Name</Text>
              <TextInput style={styles.input} placeholder="e.g. Rahul Sharma"
                placeholderTextColor={Colors.textTertiary} value={form.name} onChangeText={set('name')} />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Phone Number</Text>
              <TextInput style={styles.input} placeholder="Your mobile number"
                placeholderTextColor={Colors.textTertiary} value={form.phone}
                onChangeText={set('phone')} keyboardType="phone-pad" />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email (Cannot be changed)</Text>
              <TextInput style={[styles.input, { color: Colors.textTertiary }]}
                value={user?.email || ''} editable={false} />
            </View>
          </View>

          <Button label="Save Changes" onPress={handleSave} loading={loading}
            size="lg" fullWidth style={{ marginTop: Spacing.xl }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.surfaceAlt },
  scroll: { padding: Spacing.base, paddingBottom: Spacing['3xl'] },
  avatarSection: { alignItems: 'center', marginBottom: Spacing.xl },
  avatarContainer: { position: 'relative', marginBottom: 8 },
  avatarImg: { width: 100, height: 100, borderRadius: 50, borderWidth: 3, borderColor: Colors.primary },
  avatarPlaceholder: {
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: Colors.primaryMuted, alignItems: 'center', justifyContent: 'center',
    borderWidth: 3, borderColor: Colors.primary,
  },
  avatarInitial: { fontSize: 36, fontFamily: Typography.display, color: Colors.primary },
  avatarEditBadge: {
    position: 'absolute', bottom: 0, right: 0,
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: Colors.surface, alignItems: 'center', justifyContent: 'center',
    ...Shadow.sm, borderWidth: 1, borderColor: Colors.border,
  },
  avatarHint: { fontSize: 13, color: Colors.textSecondary },
  errorBanner: { backgroundColor: Colors.errorLight, padding: Spacing.md, borderRadius: Radius.md, marginBottom: Spacing.lg },
  errorText: { fontSize: 13, color: Colors.error, fontFamily: Typography.bodySemiBold },
  section: { backgroundColor: Colors.surface, padding: Spacing.lg, borderRadius: Radius.xl, ...Shadow.sm },
  inputGroup: { marginBottom: Spacing.md },
  inputLabel: { fontSize: 13, fontFamily: Typography.bodySemiBold, color: Colors.text, marginBottom: 6 },
  input: {
    borderWidth: 1.5, borderColor: Colors.border, borderRadius: Radius.lg, paddingHorizontal: Spacing.md,
    height: 52, backgroundColor: Colors.surfaceAlt, fontSize: Typography.sizes.base,
    color: Colors.text, fontFamily: Typography.bodyRegular,
  },
});
