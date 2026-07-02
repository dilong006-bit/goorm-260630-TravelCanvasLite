// 앱 전역 디자인 토큰 (웹 TravelCanvas Lite 팔레트와 일관)
import { Platform } from 'react-native'

export const colors = {
  brand50: '#eff6ff',
  brand100: '#dbeafe',
  brand200: '#bfdbfe',
  brand300: '#93c5fd',
  brand400: '#60a5fa',
  brand500: '#0ea5e9',
  brand600: '#0284c7',
  brand700: '#0369a1',

  ink: '#0f172a',
  slate400: '#94a3b8',
  slate500: '#64748b',
  slate600: '#475569',
  slate200: '#e2e8f0',
  slate100: '#f1f5f9',
  slate50: '#f8fafc',

  white: '#ffffff',
  amber50: '#fffbeb',
  amber600: '#d97706',
  amber700: '#b45309',
  emerald600: '#059669',
  rose50: '#fff1f2',
  rose500: '#f43f5e',
  rose600: '#e11d48',

  bg: '#f6f8fb',
  card: '#ffffff',
  border: '#e6ebf1',
} as const

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
} as const

export const fonts = Platform.select({
  ios: { serif: 'Georgia', sans: 'System' },
  android: { serif: 'serif', sans: 'sans-serif' },
  default: { serif: 'serif', sans: 'System' },
}) as { serif: string; sans: string }

export const shadow = {
  card: {
    shadowColor: '#0f172a',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
} as const
