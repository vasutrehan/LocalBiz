import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts, Syne_600SemiBold, Syne_700Bold } from '@expo-google-fonts/syne';
import { DMSans_400Regular, DMSans_500Medium, DMSans_700Bold } from '@expo-google-fonts/dm-sans';
import * as SplashScreen from 'expo-splash-screen';
import * as Location from 'expo-location';
import { useAuthStore } from '../src/store/authStore';
import { useBusinessStore } from '../src/store/businessStore';


  


export default function RootLayout() {
  const [fontsLoaded , fontError] = useFonts({ Syne_600SemiBold, Syne_700Bold, DMSans_400Regular, DMSans_500Medium, DMSans_700Bold });
  const { loadUser } = useAuthStore();
  const { setUserLocation } = useBusinessStore();

  useEffect(() => {
  SplashScreen.preventAutoHideAsync();
}, []);

  useEffect(() => {
    const init = async () => {
      // 1. Try to restore logged-in user from saved token
      await loadUser();

      // 2. Get real GPS location
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
          setUserLocation({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
        }
      } catch (e) {
        console.log('Location error:', e);
        // Falls back to Faridabad default in store
      }
    };
    init();
  }, []);

 useEffect(() => {
  if (fontsLoaded || fontError) {
    SplashScreen.hideAsync();
  }
}, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="business/[id]" options={{ presentation: 'card', animation: 'slide_from_right' }} />
        <Stack.Screen name="write-review/[id]" options={{ presentation: 'modal' }} />
        <Stack.Screen name="filters" options={{ presentation: 'modal' }} />
        <Stack.Screen name="notifications" options={{ presentation: 'card' }} />
      </Stack>
    </>
  );
}
