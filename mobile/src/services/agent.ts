// AI Agent Orchestrator — Planner → LLM 분석 → 검색어 → Unsplash → (선택) → Story Generator → Storage
import { analyzeStory, type Analysis } from './analyze'
import { searchImages, type TravelImage } from './unsplash'
import { saveStory, type Story } from './storage'

export const STEP = {
  PLAN: 'plan',
  ANALYZE: 'analyze',
  KEYWORDS: 'keywords',
  SEARCH: 'search',
} as const

export type StepId = (typeof STEP)[keyof typeof STEP]
export type StepStatus = 'pending' | 'running' | 'done' | 'error'

export interface StepUpdate {
  id: StepId
  status?: StepStatus
  label?: string
  detail?: string
  data?: Record<string, unknown>
}

export type TFunc = (key: string, vars?: Record<string, string | number>) => string

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))
const identity: TFunc = (s) => s

export interface Draft {
  id: string
  title: string
  content: string
  createdAt: string
}

export async function runAnalysisAgent(
  { title, content, lang = 'en' }: { title: string; content: string; lang?: string },
  onStep: (s: StepUpdate) => void = () => {},
  t: TFunc = identity,
): Promise<{ analysis: Analysis; images: TravelImage[] }> {
  const emit = (id: StepId, patch: Omit<StepUpdate, 'id'>) => onStep({ id, ...patch })

  // 1) Planner
  emit(STEP.PLAN, { status: 'running', label: t('agent.plan'), detail: t('agent.planning') })
  await sleep(300)
  emit(STEP.PLAN, { status: 'done', detail: t('agent.planDone') })

  // 2) LLM 분석
  emit(STEP.ANALYZE, { status: 'running', label: t('agent.analyze'), detail: t('agent.analyzing') })
  let analysis: Analysis
  try {
    analysis = await analyzeStory({ title, content, lang })
  } catch (e: any) {
    emit(STEP.ANALYZE, { status: 'error', detail: e?.message || 'error' })
    throw e
  }
  const engineLabel =
    analysis._provider === 'anthropic'
      ? t('agent.engineClaude')
      : analysis._provider === 'openai'
        ? t('agent.engineGpt')
        : t('agent.engineDemo')
  const place = [analysis.city, analysis.country].filter(Boolean).join(', ')
  emit(STEP.ANALYZE, {
    status: 'done',
    label: engineLabel,
    detail: place
      ? t('agent.analyzedAs', { place }) + (analysis._mock ? t('agent.demoSuffix') : '')
      : t('agent.analyzeDone'),
  })

  // 3) 검색어 생성
  emit(STEP.KEYWORDS, {
    status: 'running',
    label: t('agent.keywords'),
    detail: t('agent.keywordsRunning'),
  })
  await sleep(200)
  emit(STEP.KEYWORDS, {
    status: 'done',
    detail: analysis.keywords.join(' · ') || t('agent.keywords'),
  })

  // 4) Unsplash 검색
  emit(STEP.SEARCH, { status: 'running', label: t('agent.search'), detail: t('agent.searching') })
  let images: TravelImage[] = []
  try {
    images = await searchImages(analysis.keywords, 9)
  } catch (e: any) {
    emit(STEP.SEARCH, { status: 'error', detail: e?.message || 'error' })
    throw e
  }
  const isMockImg = images.some((i) => i._mock)
  emit(STEP.SEARCH, {
    status: 'done',
    detail: t('agent.collected', { n: images.length }) + (isMockImg ? t('agent.collectedDemo') : ''),
  })

  return { analysis, images }
}

export async function composeAndSaveStory({
  draft,
  analysis,
  heroImage,
}: {
  draft: Draft
  analysis: Analysis
  heroImage: TravelImage
}): Promise<Story> {
  return saveStory({
    id: draft.id,
    title: draft.title,
    content: draft.content,
    city: analysis.city,
    country: analysis.country,
    place: analysis.place,
    summary: analysis.summary,
    oneLiner: analysis.oneLiner,
    hashtags: analysis.hashtags,
    keywords: analysis.keywords,
    heroImage: heroImage?.full || heroImage?.thumb || '',
    heroCredit: heroImage?.credit || null,
    createdAt: draft.createdAt,
  })
}
