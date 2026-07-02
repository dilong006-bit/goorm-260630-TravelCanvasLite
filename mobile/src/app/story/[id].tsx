import { useEffect, useState } from 'react'
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { getStory, deleteStory, type Story } from '@/services/storage'
import { useI18n } from '@/i18n/I18nContext'
import HeroImage from '@/components/HeroImage'
import { Button } from '@/components/ui'
import { colors, radius, spacing } from '@/theme/theme'

export default function StoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  const { t } = useI18n()
  const [story, setStory] = useState<Story | null | undefined>(undefined)

  useEffect(() => {
    if (id) getStory(String(id)).then(setStory)
  }, [id])

  if (story === undefined) {
    return <SafeAreaView style={styles.safe} />
  }

  if (story === null) {
    return (
      <SafeAreaView style={[styles.safe, styles.center]} edges={['top']}>
        <Text style={styles.notFound}>{t('story.notFound')}</Text>
        <Button title={t('story.toHome')} onPress={() => router.replace('/')} style={{ marginTop: spacing.lg }} />
      </SafeAreaView>
    )
  }

  const place = [story.city, story.country].filter(Boolean).join(', ')

  const onDelete = () => {
    Alert.alert(t('story.confirmTitle'), t('story.confirmDelete'), [
      { text: t('story.cancel'), style: 'cancel' },
      {
        text: t('story.delete'),
        style: 'destructive',
        onPress: async () => {
          await deleteStory(story.id)
          router.replace('/timeline')
        },
      },
    ])
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.topbar}>
          <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={8}>
            <Ionicons name="arrow-back" size={22} color={colors.slate600} />
          </Pressable>
          <Pressable onPress={onDelete} style={styles.deleteBtn} hitSlop={8}>
            <Ionicons name="trash-outline" size={16} color={colors.rose600} />
            <Text style={styles.deleteText}>{t('story.delete')}</Text>
          </Pressable>
        </View>

        <HeroImage
          src={story.heroImage}
          title={story.title}
          subtitle={place}
          credit={story.heroCredit}
          style={styles.hero}
        />

        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Ionicons name="time-outline" size={15} color={colors.slate500} />
            <Text style={styles.metaText}>{story.createdAt}</Text>
          </View>
          {place ? (
            <View style={styles.metaItem}>
              <Ionicons name="location-outline" size={15} color={colors.slate500} />
              <Text style={styles.metaText}>{place}</Text>
            </View>
          ) : null}
        </View>

        {story.oneLiner ? <Text style={styles.oneLiner}>“{story.oneLiner}”</Text> : null}

        {story.summary ? (
          <View style={styles.summaryBox}>
            <Text style={styles.summaryText}>
              <Text style={styles.summaryLabel}>{t('story.aiSummary')} · </Text>
              {story.summary}
            </Text>
          </View>
        ) : null}

        <Text style={styles.body}>{story.content}</Text>

        {story.hashtags?.length ? (
          <View style={styles.tagsSection}>
            <Text style={styles.tagsLabel}>{t('story.aiTags')}</Text>
            <View style={styles.tagWrap}>
              {story.hashtags.map((tag) => (
                <View key={tag} style={styles.tag}>
                  <Text style={styles.tagText}>#{tag}</Text>
                </View>
              ))}
            </View>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  center: { alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
  notFound: { fontSize: 16, fontWeight: '700', color: colors.slate600 },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl * 2 },
  topbar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.md },
  backBtn: { padding: 4 },
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.rose50,
    borderRadius: radius.md,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  deleteText: { color: colors.rose600, fontSize: 13, fontWeight: '700' },
  hero: { aspectRatio: 16 / 10, width: '100%' },
  metaRow: { flexDirection: 'row', gap: spacing.lg, marginTop: spacing.lg },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: 13, color: colors.slate500 },
  oneLiner: { marginTop: spacing.lg, fontSize: 19, fontWeight: '800', color: colors.brand700 },
  summaryBox: { marginTop: spacing.lg, backgroundColor: colors.brand50, borderRadius: radius.lg, padding: spacing.lg },
  summaryText: { fontSize: 14, lineHeight: 21, color: colors.slate600 },
  summaryLabel: { fontWeight: '800', color: colors.brand700 },
  body: { marginTop: spacing.xl, fontSize: 16, lineHeight: 27, color: colors.ink },
  tagsSection: { marginTop: spacing.xl, borderTopWidth: 1, borderTopColor: colors.slate100, paddingTop: spacing.lg },
  tagsLabel: { fontSize: 11, fontWeight: '700', color: colors.slate400, textTransform: 'uppercase', marginBottom: spacing.sm },
  tagWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag: { backgroundColor: colors.brand50, borderRadius: radius.full, paddingHorizontal: 12, paddingVertical: 6 },
  tagText: { color: colors.brand700, fontSize: 14, fontWeight: '700' },
})
