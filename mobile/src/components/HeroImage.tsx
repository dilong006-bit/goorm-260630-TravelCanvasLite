import { StyleSheet, Text, View, type ViewStyle } from 'react-native'
import { Image } from 'expo-image'
import { LinearGradient } from 'expo-linear-gradient'
import { colors, radius } from '../theme/theme'
import type { HeroCredit } from '../services/storage'

export default function HeroImage({
  src,
  title,
  subtitle,
  credit,
  style,
}: {
  src: string
  title?: string
  subtitle?: string
  credit?: HeroCredit | null
  style?: ViewStyle
}) {
  return (
    <View style={[styles.wrap, style]}>
      {src ? (
        <Image source={src} style={StyleSheet.absoluteFill} contentFit="cover" transition={250} />
      ) : (
        <View style={[StyleSheet.absoluteFill, styles.noImage]}>
          <Text style={styles.noImageText}>No image</Text>
        </View>
      )}
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.15)', 'rgba(0,0,0,0.72)']}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.textWrap}>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        {title ? (
          <Text style={styles.title} numberOfLines={3}>
            {title}
          </Text>
        ) : null}
      </View>
      {credit?.name ? (
        <View style={styles.credit}>
          <Text style={styles.creditText}>📷 {credit.name}</Text>
        </View>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: { borderRadius: radius.xl, overflow: 'hidden', backgroundColor: colors.slate200 },
  noImage: { alignItems: 'center', justifyContent: 'center' },
  noImageText: { color: colors.slate400 },
  textWrap: { position: 'absolute', left: 0, right: 0, bottom: 0, padding: 20 },
  subtitle: { color: 'rgba(255,255,255,0.85)', fontSize: 13, fontWeight: '600', marginBottom: 4 },
  title: { color: '#fff', fontSize: 26, fontWeight: '800', lineHeight: 32 },
  credit: {
    position: 'absolute',
    right: 10,
    top: 10,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: radius.full,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  creditText: { color: 'rgba(255,255,255,0.9)', fontSize: 11 },
})
