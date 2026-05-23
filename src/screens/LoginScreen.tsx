import React, { useState, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, SafeAreaView, ScrollView,
  KeyboardAvoidingView, Platform, Animated, StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Typography, Spacing, Radius, Shadow } from 'src/constants/theme';
import { useAuthStore } from 'src/store/authStore';
import { Button } from 'src/components/UI';

export default function LoginScreen() {
  const router = useRouter();
  const { login, isLoading } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');

  const shakeAnim = useRef(new Animated.Value(0)).current;

  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 6, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start();
  };

  const handleLogin = async () => {
    setError('');
    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields');
      shake();
      return;
    }
    try {
      await login(email.trim(), password);
      router.replace('/(tabs)/' as any);
    } catch {
      setError('Invalid email or password');
      shake();
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

          {/* ── Brand header ── */}
          <View style={styles.brandSection}>
            <View style={styles.logoMark}>
              <Text style={styles.logoChar}>L</Text>
            </View>
            <Text style={styles.brandName}>LocalBiz</Text>
            <Text style={styles.brandTagline}>Your neighbourhood, digitised</Text>
          </View>

          {/* ── Decorative blobs ── */}
          <View style={styles.blob1} />
          <View style={styles.blob2} />

          {/* ── Form card ── */}
          <Animated.View style={[styles.formCard, { transform: [{ translateX: shakeAnim }] }]}>
            <Text style={styles.formTitle}>Welcome back</Text>
            <Text style={styles.formSub}>Sign in to discover local businesses</Text>

            {error ? (
              <View style={styles.errorBanner}>
                <Text style={styles.errorText}>⚠ {error}</Text>
              </View>
            ) : null}

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email</Text>
              <View style={styles.inputWrapper}>
                <Text style={styles.inputIcon}>✉</Text>
                <TextInput
                  style={styles.input}
                  placeholder="you@example.com"
                  placeholderTextColor={Colors.textTertiary}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Password</Text>
              <View style={styles.inputWrapper}>
                <Text style={styles.inputIcon}>🔒</Text>
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="Enter password"
                  placeholderTextColor={Colors.textTertiary}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPass}
                  autoComplete="password"
                />
                <TouchableOpacity onPress={() => setShowPass(!showPass)} style={styles.eyeBtn}>
                  <Text style={{ fontSize: 18 }}>{showPass ? '🙈' : '👁'}</Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity style={styles.forgotLink} onPress={() => router.push('/forgot-password' as any)}>
              <Text style={styles.forgotText}>Forgot password?</Text>
            </TouchableOpacity>

            <Button
              label="Sign In"
              onPress={handleLogin}
              loading={isLoading}
              fullWidth
              size="lg"
              style={{ marginTop: Spacing.base }}
            />

            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or continue with</Text>
              <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity style={styles.googleBtn} onPress={() => {}}>
              <Text style={styles.googleBtnText}>G  Sign in with Google</Text>
            </TouchableOpacity>
          </Animated.View>

          {/* ── Sign up link ── */}
          <View style={styles.signupRow}>
            <Text style={styles.signupText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/register' as any)}>
              <Text style={styles.signupLink}>Create one →</Text>
            </TouchableOpacity>
          </View>

          {/* ── Business owner CTA ── */}
          <TouchableOpacity style={styles.ownerCTA} onPress={() => router.push({ pathname: '/register', params: { role: 'owner' } })}>
            <Text style={styles.ownerCTAText}>🏪  List your business for free</Text>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.surface },
  scroll: { flexGrow: 1, padding: Spacing.base, paddingBottom: Spacing['3xl'] },

  brandSection: { alignItems: 'center', paddingTop: Spacing['2xl'], paddingBottom: Spacing['2xl'] },
  logoMark: {
    width: 72, height: 72, borderRadius: 22,
    backgroundColor: Colors.primary,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 14, ...Shadow.primary,
  },
  logoChar: { fontSize: 38, color: Colors.textInverse, fontFamily: Typography.display },
  brandName: { fontSize: Typography.sizes['3xl'], fontFamily: Typography.display, color: Colors.text, letterSpacing: -0.5 },
  brandTagline: { fontSize: Typography.sizes.base, color: Colors.textSecondary, fontFamily: Typography.bodyRegular, marginTop: 4 },

  blob1: { position: 'absolute', width: 200, height: 200, borderRadius: 100, backgroundColor: Colors.primaryMuted, top: -50, right: -60, zIndex: -1 },
  blob2: { position: 'absolute', width: 140, height: 140, borderRadius: 70, backgroundColor: '#EEF2FF', bottom: 200, left: -40, zIndex: -1 },

  formCard: { backgroundColor: Colors.surface, borderRadius: Radius['2xl'], padding: Spacing.xl, ...Shadow.lg, borderWidth: 1, borderColor: Colors.border },
  formTitle: { fontSize: Typography.sizes['2xl'], fontFamily: Typography.display, color: Colors.text, marginBottom: 4 },
  formSub: { fontSize: Typography.sizes.base, color: Colors.textSecondary, fontFamily: Typography.bodyRegular, marginBottom: Spacing.lg },

  errorBanner: { backgroundColor: Colors.errorLight, padding: Spacing.md, borderRadius: Radius.md, marginBottom: Spacing.md },
  errorText: { fontSize: 13, color: Colors.error, fontFamily: Typography.bodySemiBold },

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
  eyeBtn: { padding: 4 },

  forgotLink: { alignSelf: 'flex-end', marginBottom: 4 },
  forgotText: { fontSize: 13, color: Colors.primary, fontFamily: Typography.bodySemiBold },

  dividerRow: { flexDirection: 'row', alignItems: 'center', marginVertical: Spacing.lg, gap: 10 },
  dividerLine: { flex: 1, height: 1, backgroundColor: Colors.border },
  dividerText: { fontSize: 12, color: Colors.textTertiary },

  googleBtn: { borderWidth: 1.5, borderColor: Colors.border, borderRadius: Radius.full, paddingVertical: 13, alignItems: 'center', backgroundColor: Colors.surface },
  googleBtnText: { fontSize: Typography.sizes.base, fontFamily: Typography.bodySemiBold, color: Colors.text },

  signupRow: { flexDirection: 'row', justifyContent: 'center', marginTop: Spacing.xl },
  signupText: { fontSize: Typography.sizes.base, color: Colors.textSecondary },
  signupLink: { fontSize: Typography.sizes.base, color: Colors.primary, fontFamily: Typography.bodySemiBold },

  ownerCTA: { marginTop: Spacing.md, backgroundColor: Colors.accent, paddingVertical: 14, borderRadius: Radius.full, alignItems: 'center' },
  ownerCTAText: { color: Colors.textInverse, fontSize: Typography.sizes.base, fontFamily: Typography.bodySemiBold },
});
