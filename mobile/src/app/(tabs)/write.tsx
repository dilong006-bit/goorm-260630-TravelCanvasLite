import { useRef, useState } from 'react'
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { runAnalysisAgent, composeAndSaveStory, type Draft, type StepUpdate } from '@/services/agent'
import type { Analysis } from '@/services/analyze'
import type { TravelImage } from '@/services/unsplash'
import { uuid, todayISO } from '@/services/storage'
import { useI18n } from '@/i18n/I18nContext'
import AgentSteps from '@/components/AgentSteps'
import ImagePicker from '@/components/ImagePicker'
import { Button, Card, Badge } from '@/components/ui'
import { colors, radius, spacing } from '@/theme/theme'

const MIN = 100
const REC_MIN = 300
const REC_MAX = 500

type Phase = 'write' | 'running' | 'pick'

export default function WriteScreen() {
  const { t, lang, sample } = useI18n()
  const router = useRouter()

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [phase, setPhase] = useState<Phase>('write')
  const [steps, setSteps] = useState<Record<string, StepUpdate>>({})
  const [analysis, setAnalysis] = useState<Analysis | null>(null)
  const [images, setImages] = useState<TravelImage[]>([])
  const [selected, setSelected] = useState<TravelImage | null>(null)
  const [error, setError] = useState('')
  const draftRef = useRef<Draft | null>(null)

  const len = content.trim().length
  const counterColor =
    len === 0
      ? colors.slate400
      : len < REC_MIN
        ? colors.amber600
        : len <= REC_MAX
          ? colors.emerald600
          : colors.amber600

  const running = phase === 'running'
  const picking = phase === 'pick'
  const canRun = len >= MIN && !running

  const fillSample = () => {
    setTitle(sample.title)
    setContent(sample.content)
  }

  const runAgent = async () => {
    setError('')
    setPhase('running')
    setSteps({})
    setImages([])
    setSelected(null)

    const draft: Draft = {
      id: uuid(),
      title: title.trim() || sample.title,
      content: content.trim(),
      createdAt: todayISO(),
    }
    draftRef.current = draft

    try {
      const { analysis: a, images: imgs } = await runAnalysisAgent(
        { title: draft.title, content: draft.content, lang },
        (step) => setSteps((prev) => ({ ...prev, [step.id]: { ...prev[step.id], ...step } })),
        t,
      )
      setAnalysis(a)
      setImages(imgs)
      setPhase('pick')
    } catch (e: any) {
      setError(e?.message || 'AI error')
      setPhase('write')
    }
  }

  const createCard = async () => {
    if (!selected || !analysis || !draftRef.current) return
    const saved = await composeAndSaveStory({ draft: draftRef.current, analysis, heroImage: selected })
    // 다음 작성을 위해 초기화
    setTitle('')
    setContent('')
    setPhase('write')
    setSteps({})
    setImages([])
    setSelected(null)
    setAnalysis(null)
    router.push(`/story/${saved.id}`)
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.h1}>{t('write.title')}</Text>
          <Text style={styles.sub}>{t('write.subtitle')}</Text>

          <Card style={styles.editor}>
            <TextInput
              value={title}
              onChangeText={setTitle}
              editable={!running}
              placeholder={t('write.titlePlaceholder')}
              placeholderTextColor={colors.slate400}
              style={styles.titleInput}
            />
            <View style={styles.divider} />
            <TextInput
              value={content}
              onChangeText={setContent}
              editable={!running}
              placeholder={t('write.bodyPlaceholder')}
              placeholderTextColor={colors.slate400}
              multiline
              style={styles.bodyInput}
            />
            <View style={styles.editorFooter}>
              <Text style={styles.sampleBtn} onPress={running ? undefined : fillSample}>
                {t('write.fillSample')}
              </Text>
              <Text style={[styles.counter, { color: counterColor }]}>
                {len}
                {t('write.charUnit')}{' '}
                <Text style={styles.counterHint}>
                  / {t('write.recommend')} {REC_MIN}~{REC_MAX}
                </Text>
              </Text>
            </View>
          </Card>

          {error ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          {!picking ? (
            <Button
              title={running ? t('write.working') : t('write.findImages')}
              onPress={runAgent}
              disabled={!canRun}
              size="lg"
              left={<Ionicons name="sparkles" size={18} color="#fff" />}
              style={{ marginTop: spacing.md }}
            />
          ) : null}
          {len > 0 && len < MIN ? (
            <Text style={styles.minHint}>{t('write.minChars', { n: MIN })}</Text>
          ) : null}

          {/* AI Agent 진행 패널 */}
          {phase !== 'write' || running ? (
            <Card style={styles.agentCard}>
              <View style={styles.agentHead}>
                <View style={styles.agentIcon}>
                  <Ionicons name="sparkles" size={15} color={colors.brand600} />
                </View>
                <Text style={styles.agentTitle}>{t('write.agent')}</Text>
              </View>
              <AgentSteps steps={steps} />

              {analysis ? (
                <View style={styles.analysisBox}>
                  <Text style={styles.analysisLabel}>{t('write.analysisResult')}</Text>
                  <Text style={styles.analysisPlace}>
                    📍 {[analysis.city, analysis.country].filter(Boolean).join(', ')}
                  </Text>
                  {analysis.oneLiner ? (
                    <Text style={styles.analysisLine}>{analysis.oneLiner}</Text>
                  ) : null}
                  <View style={styles.tagWrap}>
                    {analysis.hashtags.map((tag) => (
                      <Badge key={tag}>#{tag}</Badge>
                    ))}
                  </View>
                </View>
              ) : null}
            </Card>
          ) : null}

          {/* 이미지 선택 */}
          {picking || running ? (
            <View style={{ marginTop: spacing.lg, gap: spacing.md }}>
              <Text style={styles.h2}>{t('write.pickTitle')}</Text>
              <Text style={styles.sub}>{t('write.pickSubtitle')}</Text>
              <ImagePicker
                images={images}
                loading={running && images.length === 0}
                selectedId={selected?.id}
                onSelect={setSelected}
              />
              <Button
                title={t('write.createCard')}
                onPress={createCard}
                disabled={!selected}
                size="lg"
                left={<Ionicons name="checkmark" size={18} color="#fff" />}
              />
            </View>
          ) : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl * 2, gap: spacing.xs },
  h1: { fontSize: 22, fontWeight: '800', color: colors.ink },
  h2: { fontSize: 20, fontWeight: '800', color: colors.ink },
  sub: { marginTop: 4, fontSize: 13, color: colors.slate500 },
  editor: { padding: spacing.lg, marginTop: spacing.lg },
  titleInput: { fontSize: 19, fontWeight: '800', color: colors.ink, paddingVertical: 4 },
  divider: { height: 1, backgroundColor: colors.slate100, marginVertical: spacing.sm },
  bodyInput: {
    minHeight: 160,
    fontSize: 15,
    lineHeight: 22,
    color: colors.ink,
    textAlignVertical: 'top',
  },
  editorFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: colors.slate100,
    marginTop: spacing.sm,
    paddingTop: spacing.md,
  },
  sampleBtn: { fontSize: 12, fontWeight: '700', color: colors.brand600 },
  counter: { fontSize: 13, fontWeight: '700' },
  counterHint: { fontWeight: '400', color: colors.slate400 },
  errorBox: { marginTop: spacing.md, backgroundColor: colors.rose50, borderRadius: radius.md, padding: spacing.md },
  errorText: { color: colors.rose600, fontSize: 13 },
  minHint: { marginTop: 6, fontSize: 12, color: colors.amber600 },
  agentCard: { padding: spacing.lg, marginTop: spacing.lg },
  agentHead: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: spacing.md },
  agentIcon: {
    width: 28,
    height: 28,
    borderRadius: radius.sm,
    backgroundColor: colors.brand50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  agentTitle: { fontSize: 15, fontWeight: '800', color: colors.ink },
  analysisBox: { marginTop: spacing.lg, borderTopWidth: 1, borderTopColor: colors.slate100, paddingTop: spacing.md },
  analysisLabel: { fontSize: 11, fontWeight: '700', color: colors.slate400, textTransform: 'uppercase' },
  analysisPlace: { marginTop: 6, fontSize: 14, fontWeight: '700', color: colors.ink },
  analysisLine: { marginTop: 2, fontSize: 13, color: colors.slate500 },
  tagWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 8 },
})
