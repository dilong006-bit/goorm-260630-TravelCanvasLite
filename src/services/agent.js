// AI Agent Orchestrator — Planner → GPT Tool → Unsplash Tool → (사용자 선택) → Story Generator → Storage
// 명세서 11번 "AI 에이전트 관점의 설계 포인트"(ReAct + Tool Calling)를 구현한다.
// onStep(step) 콜백으로 각 단계의 진행 상태를 UI에 실시간 전달한다.

import { analyzeStory } from './analyze.js'
import { searchImages } from './unsplash.js'
import { saveStory } from './storage.js'

export const STEP = {
  PLAN: 'plan',
  ANALYZE: 'analyze',
  KEYWORDS: 'keywords',
  SEARCH: 'search',
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const identity = (s) => s

// 분석 + 이미지 검색까지 수행. (이미지 선택은 사용자 단계)
// t: i18n 번역 함수, lang: 분석 출력 언어
export async function runAnalysisAgent({ title, content, lang = 'en' }, onStep = () => {}, t = identity) {
  const emit = (id, patch) => onStep({ id, ...patch })

  // 1) Planner — 무엇을 해야 하는가?
  emit(STEP.PLAN, { status: 'running', label: t('agent.plan'), detail: t('agent.planning') })
  await sleep(350)
  emit(STEP.PLAN, { status: 'done', detail: t('agent.planDone') })

  // 2) LLM Tool — 여행 글 분석 (Claude / GPT)
  emit(STEP.ANALYZE, { status: 'running', label: t('agent.analyze'), detail: t('agent.analyzing') })
  let analysis
  try {
    analysis = await analyzeStory({ title, content, lang })
  } catch (e) {
    emit(STEP.ANALYZE, { status: 'error', detail: e.message })
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
    data: { city: analysis.city, country: analysis.country },
  })

  // 3) 검색어 생성 (분석 결과에 포함)
  emit(STEP.KEYWORDS, { status: 'running', label: t('agent.keywords'), detail: t('agent.keywordsRunning') })
  await sleep(250)
  emit(STEP.KEYWORDS, {
    status: 'done',
    detail: analysis.keywords.join(' · ') || t('agent.keywords'),
    data: { keywords: analysis.keywords },
  })

  // 4) Unsplash Tool — 이미지 검색
  emit(STEP.SEARCH, { status: 'running', label: t('agent.search'), detail: t('agent.searching') })
  let images = []
  try {
    images = await searchImages(analysis.keywords, 9)
  } catch (e) {
    emit(STEP.SEARCH, { status: 'error', detail: e.message })
    throw e
  }
  const isMockImg = images.some((i) => i._mock)
  emit(STEP.SEARCH, {
    status: 'done',
    detail: t('agent.collected', { n: images.length }) + (isMockImg ? t('agent.collectedDemo') : ''),
    data: { count: images.length },
  })

  return { analysis, images }
}

// Story Generator + Storage Tool — 사용자가 고른 대표 이미지로 최종 카드 생성 후 저장
export function composeAndSaveStory({ draft, analysis, heroImage }) {
  const record = {
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
  }
  return saveStory(record)
}
