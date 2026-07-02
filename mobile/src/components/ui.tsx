import { ActivityIndicator, Pressable, StyleSheet, Text, View, type ViewStyle } from 'react-native'
import type { ReactNode } from 'react'
import { colors, radius, spacing, shadow } from '../theme/theme'

export function Card({ children, style }: { children: ReactNode; style?: ViewStyle }) {
  return <View style={[styles.card, style]}>{children}</View>
}

export function Badge({ children }: { children: ReactNode }) {
  return (
    <View style={styles.badge}>
      <Text style={styles.badgeText}>{children}</Text>
    </View>
  )
}

type BtnVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
type BtnSize = 'sm' | 'md' | 'lg'

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled,
  left,
  style,
}: {
  title: string
  onPress?: () => void
  variant?: BtnVariant
  size?: BtnSize
  disabled?: boolean
  left?: ReactNode
  style?: ViewStyle
}) {
  const v = variantStyles[variant]
  const s = sizeStyles[size]
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.btn,
        v.container,
        { height: s.height, paddingHorizontal: s.px },
        disabled && styles.btnDisabled,
        pressed && !disabled && styles.btnPressed,
        style,
      ]}
    >
      {left}
      <Text style={[styles.btnText, v.text, { fontSize: s.font }]}>{title}</Text>
    </Pressable>
  )
}

export function Spinner({ color = colors.brand600, size = 'small' }: { color?: string; size?: 'small' | 'large' }) {
  return <ActivityIndicator color={color} size={size} />
}

const variantStyles: Record<BtnVariant, { container: ViewStyle; text: { color: string } }> = {
  primary: { container: { backgroundColor: colors.brand600 }, text: { color: '#fff' } },
  secondary: {
    container: { backgroundColor: '#fff', borderWidth: 1, borderColor: colors.slate200 },
    text: { color: colors.ink },
  },
  ghost: { container: { backgroundColor: 'transparent' }, text: { color: colors.slate600 } },
  danger: {
    container: { backgroundColor: colors.rose50, borderWidth: 1, borderColor: '#fecdd3' },
    text: { color: colors.rose600 },
  },
}

const sizeStyles: Record<BtnSize, { height: number; px: number; font: number }> = {
  sm: { height: 36, px: 14, font: 14 },
  md: { height: 46, px: 18, font: 15 },
  lg: { height: 54, px: 22, font: 16 },
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.card,
  },
  badge: {
    backgroundColor: colors.brand50,
    borderRadius: radius.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  badgeText: { color: colors.brand700, fontSize: 12, fontWeight: '700' },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    borderRadius: radius.md,
  },
  btnText: { fontWeight: '700' },
  btnDisabled: { opacity: 0.45 },
  btnPressed: { opacity: 0.85 },
})
