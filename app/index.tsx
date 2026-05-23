import { Redirect } from 'expo-router';
import { useAuthStore } from '../src/store/authStore';

export default function Index() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated ?? false);

  if (isAuthenticated) {
    return <Redirect href="/(tabs)/" />;
  }

  return <Redirect href="/onboarding" />;
}