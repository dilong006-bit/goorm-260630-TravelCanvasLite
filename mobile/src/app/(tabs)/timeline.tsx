import { useCallback, useState } from 'react'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Image } from 'expo-image'
import { Ionicons } from '@expo/vector-icons'
import { useFocusEffect, useRouter } from 'expo-router'
import { getStories, type Story } from '@/services/storage'
import { useI18n } from '@/i18n/I18nContext'
import { colors, radius, spacing, shadow } from '@/theme/theme'

export default function TimelineScreen() {
  const { t } = useI18n()
  const router = useRouter()
  const [stories, setStories] = useState<Story[]>([])

  useFocusEffect(
    useCallback(() => {
      let active = true
      getStories().then((list) => {
        if (active) setStories([...list].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)))
      })
      return () => {
        active = false
      }
    }, []),
  )

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.head}>
          <View style={styles.headIcon}>
            <Ionicons name="time-outline" size={20} color={colors.brand600} />
          </View>
          <View>
            <Text style={styles.title}>{t('timeline.title')}</Text>
            <Text style={styles.sub}>{t('timeline.subtitle')}</Text>
          </View>
        </View>

        {stories.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>{t('timeline.empty')}</Text>
          </View>
        ) : (
          <View>
            {stories.map((s, i) => {
              const place = [s.city, s.country].filter(Boolean).join(', ')
              const last = i === stories.length - 1
              return (
                <View key={s.id} style={styles.itemRow}>
                  <View style={styles.rail}>
                    <View style={styles.dot}>
                      <View style={styles.dotInner} />
                    </View>
                    {!last ? <View style={styles.railLine} /> : null}
                  </View>
                  <Pressable
                    onPress={() => router.push(`/story/${s.id}`)}
                    style={({ pressed }) => [styles.card, pressed && { opacity: 0.9 }]}
                  >
                    <View style={styles.thumbWrap}>
                      {s.heroImage ? (
                        <Image source={s.heroImage} style={styles.thumb} contentFit="cover" transition={150} />
                      ) : null}
                    </View>
                    <View style={styles.cardBody}>
                      <View style={styles.metaRow}>
                        <Text style={styles.date}>{s.createdAt}</Text>
                        {place ? (
                          <View style={styles.metaPlace}>
                            <Ionicons name="location-outline" size={11} color={colors.brand600} />
                            <Text style={styles.placeText}>{place}</Text>
                          </View>
                        ) : null}
                      </View>
                      <Text style={styles.cardTitle} numberOfLines={1}>
                        {s.title}
                      </Text>
                      <Text style={styles.cardSub} numberOfLines={1}>
                        {s.oneLiner || s.summary}
                      </Text>
                    </View>
                  </Pressable>
                </View>
              )
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
  head: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.lg },
  headIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.brand50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { fontSize: 21, fontWeight: '800', color: colors.ink },
  sub: { fontSize: 13, color: colors.slate500 },
  empty: {
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.slate200,
    borderRadius: radius.lg,
    padding: spacing.xxl,
    alignItems: 'center',
  },
  emptyText: { color: colors.slate600 },
  itemRow: { flexDirection: 'row', gap: spacing.md },
  rail: { alignItems: 'center', width: 20 },
  dot: {
    width: 18,
    height: 18,
    borderRadius: radius.full,
    borderWidth: 2,
    borderColor: colors.brand500,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  dotInner: { width: 7, height: 7, borderRadius: radius.full, backgroundColor: colors.brand500 },
  railLine: { flex: 1, width: 2, backgroundColor: colors.brand200, marginTop: 2 },
  card: {
    flex: 1,
    flexDirection: 'row',
    gap: spacing.md,
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.sm,
    marginBottom: spacing.lg,
    ...shadow.card,
  },
  thumbWrap: { width: 96, height: 72, borderRadius: radius.md, overflow: 'hidden', backgroundColor: colors.slate200 },
  thumb: { width: '100%', height: '100%' },
  cardBody: { flex: 1, justifyContent: 'center' },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  date: { fontSize: 11, color: colors.slate400 },
  metaPlace: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  placeText: { fontSize: 11, color: colors.brand600 },
  cardTitle: { marginTop: 2, fontSize: 16, fontWeight: '800', color: colors.ink },
  cardSub: { marginTop: 2, fontSize: 13, color: colors.slate500 },
})
