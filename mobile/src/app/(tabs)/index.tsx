import { useCallback, useState } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import { useFocusEffect, useRouter } from 'expo-router'
import { getStories, type Story } from '@/services/storage'
import { hasAnthropic, hasOpenAI, hasUnsplash } from '@/services/config'
import { useI18n } from '@/i18n/I18nContext'
import StoryCard from '@/components/StoryCard'
import LangToggle from '@/components/LangToggle'
import { Button } from '@/components/ui'
import { colors, radius, spacing } from '@/theme/theme'

export default function HomeScreen() {
  const { t } = useI18n()
  const router = useRouter()
  const [stories, setStories] = useState<Story[]>([])

  useFocusEffect(
    useCallback(() => {
      let active = true
      getStories().then((s) => active && setStories(s))
      return () => {
        active = false
      }
    }, []),
  )

  const demoMode = (!hasAnthropic() && !hasOpenAI()) || !hasUnsplash()

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.topbar}>
          <View style={styles.brandRow}>
            <View style={styles.logo}>
              <Ionicons name="sparkles" size={16} color="#fff" />
            </View>
            <Text style={styles.brand}>
              TravelCanvas <Text style={{ color: colors.brand600 }}>Mobile</Text>
            </Text>
          </View>
          <LangToggle />
        </View>

        <LinearGradient
          colors={[colors.brand600, '#38bdf8']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <View style={styles.heroBadge}>
            <Ionicons name="sparkles-outline" size={12} color="#fff" />
            <Text style={styles.heroBadgeText}>{t('home.badge')}</Text>
          </View>
          <Text style={styles.heroTitle}>{t('home.title')}</Text>
          <Text style={styles.heroSub}>{t('home.subtitle')}</Text>
          <Button
            title={t('home.start')}
            onPress={() => router.push('/write')}
            variant="secondary"
            size="lg"
            left={<Ionicons name="add" size={18} color={colors.brand700} />}
            style={styles.heroBtn}
          />
          {demoMode ? (
            <View style={styles.demoPill}>
              <Text style={styles.demoText}>● {t('common.demoMode')}</Text>
            </View>
          ) : null}
        </LinearGradient>

        <View style={styles.sectionHead}>
          <Text style={styles.sectionTitle}>{t('home.recent')}</Text>
          {stories.length > 0 ? (
            <Text style={styles.seeAll} onPress={() => router.push('/timeline')}>
              {t('home.seeAll')} →
            </Text>
          ) : null}
        </View>

        {stories.length === 0 ? (
          <View style={styles.empty}>
            <View style={styles.emptyIcon}>
              <Ionicons name="sparkles" size={24} color={colors.brand500} />
            </View>
            <Text style={styles.emptyTitle}>{t('home.emptyTitle')}</Text>
            <Text style={styles.emptyDesc}>{t('home.emptyDesc')}</Text>
            <Button
              title={t('home.start')}
              onPress={() => router.push('/write')}
              style={{ marginTop: spacing.lg }}
              left={<Ionicons name="add" size={16} color="#fff" />}
            />
          </View>
        ) : (
          <View style={{ gap: spacing.lg }}>
            {stories.map((s) => (
              <StoryCard key={s.id} story={s} />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl, gap: spacing.lg },
  topbar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  logo: {
    width: 30,
    height: 30,
    borderRadius: radius.sm,
    backgroundColor: colors.brand500,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brand: { fontSize: 17, fontWeight: '800', color: colors.ink },
  hero: { borderRadius: radius.xl, padding: spacing.xl, gap: spacing.md },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: radius.full,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  heroBadgeText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  heroTitle: { color: '#fff', fontSize: 25, fontWeight: '800', lineHeight: 32 },
  heroSub: { color: 'rgba(255,255,255,0.9)', fontSize: 14, lineHeight: 20 },
  heroBtn: { alignSelf: 'flex-start', marginTop: spacing.sm },
  demoPill: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: radius.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  demoText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  sectionHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sectionTitle: { fontSize: 20, fontWeight: '800', color: colors.ink },
  seeAll: { fontSize: 13, fontWeight: '700', color: colors.brand600 },
  empty: {
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.slate200,
    borderRadius: radius.lg,
    padding: spacing.xxl,
    alignItems: 'center',
  },
  emptyIcon: {
    width: 56,
    height: 56,
    borderRadius: radius.lg,
    backgroundColor: colors.brand50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: { marginTop: spacing.md, fontSize: 17, fontWeight: '800', color: colors.ink },
  emptyDesc: { marginTop: 4, fontSize: 13, color: colors.slate500, textAlign: 'center' },
})
