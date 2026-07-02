import { useEffect, useState } from 'react'
import { Stack } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { I18nProvider } from '@/i18n/I18nContext'
import { hydrateKeys } from '@/services/keystore'

SplashScreen.preventAutoHideAsync().catch(() => {})

export default function RootLayout() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    hydrateKeys().finally(() => {
      setReady(true)
      SplashScreen.hideAsync().catch(() => {})
    })
  }, [])

  if (!ready) return null

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <I18nProvider>
          <StatusBar style="dark" />
          <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#f6f8fb' } }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="story/[id]" />
          </Stack>
        </I18nProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}
