import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native'
import { Image } from 'expo-image'
import { Ionicons } from '@expo/vector-icons'
import { colors, radius, spacing } from '../theme/theme'
import { useI18n } from '../i18n/I18nContext'
import type { TravelImage } from '../services/unsplash'

export default function ImagePicker({
  images,
  loading,
  selectedId,
  onSelect,
}: {
  images: TravelImage[]
  loading: boolean
  selectedId?: string
  onSelect: (img: TravelImage) => void
}) {
  const { t } = useI18n()
  const { width } = useWindowDimensions()
  const cols = 3
  const gap = spacing.sm
  const horizontalPadding = spacing.lg * 2
  const size = Math.floor((Math.min(width, 720) - horizontalPadding - gap * (cols - 1)) / cols)

  if (loading) {
    return (
      <View style={styles.grid}>
        {Array.from({ length: 9 }).map((_, i) => (
          <View key={i} style={[styles.cell, { width: size, height: size }, styles.skeleton]} />
        ))}
      </View>
    )
  }

  if (!images?.length) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>{t('picker.empty')}</Text>
      </View>
    )
  }

  return (
    <View style={styles.grid}>
      {images.map((img) => {
        const selected = selectedId === img.id
        return (
          <Pressable
            key={img.id}
            onPress={() => onSelect(img)}
            style={[styles.cell, { width: size, height: size }, selected && styles.cellSelected]}
          >
            <Image source={img.thumb} style={styles.img} contentFit="cover" transition={150} />
            <View style={styles.queryTag}>
              <Text style={styles.queryText} numberOfLines={1}>
                {img.query}
              </Text>
            </View>
            {selected ? (
              <View style={styles.checkOverlay}>
                <View style={styles.checkCircle}>
                  <Ionicons name="checkmark" size={20} color={colors.brand600} />
                </View>
              </View>
            ) : null}
          </Pressable>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  cell: {
    borderRadius: radius.md,
    overflow: 'hidden',
    backgroundColor: colors.slate200,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  cellSelected: { borderColor: colors.brand500 },
  img: { width: '100%', height: '100%' },
  skeleton: { backgroundColor: colors.slate200 },
  queryTag: {
    position: 'absolute',
    left: 5,
    bottom: 5,
    backgroundColor: 'rgba(0,0,0,0.45)',
    borderRadius: 5,
    paddingHorizontal: 5,
    paddingVertical: 2,
    maxWidth: '90%',
  },
  queryText: { color: 'rgba(255,255,255,0.9)', fontSize: 9 },
  checkOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(2,132,199,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkCircle: {
    width: 34,
    height: 34,
    borderRadius: radius.full,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  empty: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.slate200,
    borderRadius: radius.lg,
    padding: spacing.xl,
    alignItems: 'center',
  },
  emptyText: { color: colors.slate500, textAlign: 'center' },
})
