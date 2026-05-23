import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, SafeAreaView, ScrollView,
  KeyboardAvoidingView, Platform, StatusBar, Switch
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors, Typography, Spacing, Radius, Shadow } from 'src/constants/theme';
import { useAuthStore } from 'src/store/authStore';
import { Button } from 'src/components/UI';

const Field = ({ label, icon, placeholder, value, onChange, type = 'default', secure = false }:
  { label: string; icon: string; placeholder: string; value: string; onChange: (v: string) => void; type?: any; secure?: boolean }) => (
  <View style={styles.inputGroup}>
    <Text style={styles.inputLabel}>{label}</Text>
    <View style={styles.inputWrapper}>
      <Text style={styles.inputIcon}>{icon}</Text>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={Colors.textTertiary}
        value={value}
        onChangeText={onChange}
        keyboardType={type}
        secureTextEntry={secure}
        autoCapitalize={type === 'email-address' ? 'none' : 'words'}
      />
    </View>
  </View>
);

export default function RegisterScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  React.useEffect(() => { if (params.role === 'owner') setIsOwner(true); }, [params.role]);
  const { register, isLoading } = useAuthStore();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [isOwner, setIsOwner] = useState(false);

  const set = (key: keyof typeof form) => (val: string) => setForm(f => ({ ...f, [key]: val }));

  const handleRegister = async () => {
    setError('');
    if (!form.name || !form.email || !form.password || !form.phone) {
      setError('All fields are required'); return;
    }
    if (form.password !== form.confirm) {
      setError('Passwords do not match'); return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters'); return;
    }
    try {
      await register(form.name, form.email, form.password, form.phone, isOwner ? 'owner' : 'customer');
      router.replace(isOwner ? '/create-business' as any : '/(tabs)/' as any);
    } catch {
      setError('Registration failed. Please try again.');
    }
  };



  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>

          <Text style={styles.title}>Create account</Text>
          <Text style={styles.subtitle}>Join LocalBiz and discover your neighbourhood</Text>

          {error ? (
            <View style={styles.errorBanner}>
              <Text style={styles.errorText}>⚠ {error}</Text>
            </View>
          ) : null}

          <View style={styles.formCard}>
            <Field label="Full Name" icon="👤" placeholder="Vasu Trehan" value={form.name} onChange={set('name')} />
            <Field label="Email" icon="✉" placeholder="you@example.com" value={form.email} onChange={set('email')} type="email-address" />
            <Field label="Phone Number" icon="📞" placeholder="+91 98765 43210" value={form.phone} onChange={set('phone')} type="phone-pad" />
            <Field label="Password" icon="🔒" placeholder="Min. 6 characters" value={form.password} onChange={set('password')} secure />
            <Field label="Confirm Password" icon="🔒" placeholder="Re-enter password" value={form.confirm} onChange={set('confirm')} secure />

            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: Spacing.sm, marginBottom: Spacing.sm }}>
              <Text style={{ fontSize: 14, fontFamily: Typography.bodySemiBold, color: Colors.text }}>Register as a Business Owner</Text>
              <Switch value={isOwner} onValueChange={setIsOwner} trackColor={{ true: Colors.primary, false: Colors.border }} />
            </View>
            <Text style={styles.terms}>
              By registering, you agree to our{' '}
              <Text style={{ color: Colors.primary }}>Terms of Service</Text>
              {' '}and{' '}
              <Text style={{ color: Colors.primary }}>Privacy Policy</Text>.
            </Text>

            <Button label="Create Account" onPress={handleRegister} loading={isLoading} fullWidth size="lg" style={{ marginTop: Spacing.md }} />
          </View>

          <View style={styles.loginRow}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.replace('/login' as any)}>
              <Text style={styles.loginLink}>Sign in →</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.surfaceAlt },
  scroll: { flexGrow: 1, padding: Spacing.base, paddingBottom: Spacing['3xl'] },
  backBtn: { marginBottom: Spacing.xl, alignSelf: 'flex-start' },
  backText: { color: Colors.primary, fontSize: Typography.sizes.base, fontFamily: Typography.bodySemiBold },
  title: { fontSize: Typography.sizes['3xl'], fontFamily: Typography.display, color: Colors.text, marginBottom: 6 },
  subtitle: { fontSize: Typography.sizes.base, color: Colors.textSecondary, marginBottom: Spacing.xl },
  errorBanner: { backgroundColor: Colors.errorLight, padding: Spacing.md, borderRadius: Radius.md, marginBottom: Spacing.md },
  errorText: { fontSize: 13, color: Colors.error, fontFamily: Typography.bodySemiBold },
  formCard: { backgroundColor: Colors.surface, borderRadius: Radius['2xl'], padding: Spacing.xl, ...Shadow.md },
  inputGroup: { marginBottom: Spacing.md },
  inputLabel: { fontSize: 13, fontFamily: Typography.bodySemiBold, color: Colors.text, marginBottom: 6 },
  inputWrapper: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1.5, borderColor: Colors.border,
    borderRadius: Radius.lg, paddingHorizontal: Spacing.md,
    height: 52, backgroundColor: Colors.surfaceAlt,
  },
  inputIcon: { fontSize: 16, marginRight: 10 },
  input: { flex: 1, fontSize: Typography.sizes.base, color: Colors.text, fontFamily: Typography.bodyRegular },
  terms: { fontSize: 12, color: Colors.textSecondary, lineHeight: 18, marginTop: Spacing.sm },
  loginRow: { flexDirection: 'row', justifyContent: 'center', marginTop: Spacing.xl },
  loginText: { fontSize: Typography.sizes.base, color: Colors.textSecondary },
  loginLink: { fontSize: Typography.sizes.base, color: Colors.primary, fontFamily: Typography.bodySemiBold },
});
