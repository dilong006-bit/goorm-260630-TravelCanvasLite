// 여행 글 분석 디스패처 — Claude / GPT 중 사용 가능한 provider 로 호출, 없으면 Mock.
// 명세서(5. AI Agent 역할) Task 1~4(분석·검색어·태그·요약)를 한 번의 구조화 호출로 처리한다.

import { resolveProvider } from './config.js'
import { callClaude } from './anthropic.js'
import { callOpenAI } from './openai.js'

const LANG_NAME = { en: 'English', ko: 'Korean (한국어)', ja: 'Japanese (日本語)' }

function buildSystemPrompt(lang) {
  const outLang = LANG_NAME[lang] || LANG_NAME.en
  return `You are an AI agent that analyzes travel journals.
Read the user's travel note and extract/generate the fields below.
- Write "summary" and "oneLiner" and "hashtags" in ${outLang}.
- Write "country", "city", "place" and "keywords" in ENGLISH so they work well as Unsplash search terms.
- "keywords": 4-6 concrete, visual English search terms ready for Unsplash image search.
- "hashtags": 5 tags, single words/phrases without the '#' character, in ${outLang}.
- "summary": about 100 characters travel summary in ${outLang}.
- "oneLiner": an emotional one-line intro (max ~30 characters) in ${outLang}.
- If the place is hard to identify, infer it reasonably.

Respond with ONLY a single JSON object (no explanation, no code fences):
{
  "country": "English country name",
  "city": "English city name",
  "place": "English landmark/area",
  "keywords": ["english search term", "..."],
  "hashtags": ["tag1", "tag2", "..."],
  "summary": "~100 char summary in ${outLang}",
  "oneLiner": "short emotional line in ${outLang}"
}`
}

export async function analyzeStory({ title, content, lang = 'en' }) {
  const provider = resolveProvider()
  if (provider === 'none') {
    return { ...mockAnalyze({ title, content }), _mock: true, _provider: 'mock' }
  }

  const system = buildSystemPrompt(lang)
  const user = `Title: ${title || '(no title)'}\n\nBody:\n${content}`

  const raw =
    provider === 'anthropic'
      ? await callClaude({ system, user })
      : await callOpenAI({ system, user })

  const parsed = parseJSON(raw)
  return { ...normalize(parsed), _provider: provider }
}

// ---- 유틸 ------------------------------------------------------------------

function parseJSON(raw) {
  const text = String(raw || '').trim()
  try {
    return JSON.parse(text)
  } catch {
    // 코드펜스/잡텍스트 제거 후 첫 { ~ 마지막 } 추출 재시도
    const start = text.indexOf('{')
    const end = text.lastIndexOf('}')
    if (start >= 0 && end > start) {
      try {
        return JSON.parse(text.slice(start, end + 1))
      } catch {
        /* fallthrough */
      }
    }
    throw new Error('AI 응답을 JSON으로 파싱하지 못했습니다.')
  }
}

function normalize(p) {
  const arr = (v) => (Array.isArray(v) ? v.filter(Boolean).map((x) => String(x).trim()) : [])
  return {
    country: String(p.country || '').trim(),
    city: String(p.city || '').trim(),
    place: String(p.place || '').trim(),
    keywords: arr(p.keywords).slice(0, 6),
    hashtags: arr(p.hashtags)
      .map((t) => t.replace(/^#/, ''))
      .slice(0, 6),
    summary: String(p.summary || '').trim(),
    oneLiner: String(p.oneLiner || '').trim(),
  }
}

// ---- Mock (키 없이 데모) ---------------------------------------------------

const CITY_HINTS = [
  { kr: ['교토', '키요미즈', '기온', '아라시야마'], city: 'Kyoto', country: 'Japan' },
  { kr: ['오사카', '도톤보리', '난바'], city: 'Osaka', country: 'Japan' },
  { kr: ['도쿄', '시부야', '신주쿠', '아사쿠사'], city: 'Tokyo', country: 'Japan' },
  { kr: ['부산', '해운대', '광안리'], city: 'Busan', country: 'South Korea' },
  { kr: ['제주', '한라산', '성산'], city: 'Jeju', country: 'South Korea' },
  { kr: ['리스본', '트램', '에그타르트', '알파마'], city: 'Lisbon', country: 'Portugal' },
  { kr: ['파리', '에펠', '루브르'], city: 'Paris', country: 'France' },
  { kr: ['로마', '콜로세움', '바티칸'], city: 'Rome', country: 'Italy' },
  { kr: ['방콕', '카오산'], city: 'Bangkok', country: 'Thailand' },
  { kr: ['뉴욕', '맨해튼', '브루클린'], city: 'New York', country: 'USA' },
]

const MOOD_HINTS = [
  { kr: ['비', '우산', '젖'], tag: 'Rain', kw: 'rainy street' },
  { kr: ['절', '사원', '신사'], tag: 'Temple', kw: 'old temple' },
  { kr: ['바다', '해변', '파도', '강'], tag: 'Sea', kw: 'ocean coast' },
  { kr: ['골목', '거리', '트램'], tag: 'Alley', kw: 'narrow old alley' },
  { kr: ['음식', '맛집', '카페', '커피', '말차', '타르트'], tag: 'Food', kw: 'local cafe food' },
  { kr: ['야경', '밤', '네온', '노을'], tag: 'Sunset', kw: 'sunset city view' },
  { kr: ['단풍', '벚꽃', '꽃'], tag: 'Nature', kw: 'autumn leaves' },
]

function mockAnalyze({ title, content }) {
  const text = `${title || ''} ${content || ''}`
  const hit =
    CITY_HINTS.find((c) => c.kr.some((k) => text.includes(k))) || {
      city: 'Kyoto',
      country: 'Japan',
    }

  const moods = MOOD_HINTS.filter((m) => m.kr.some((k) => text.includes(k)))
  const moodTags = moods.map((m) => m.tag)
  const moodKw = moods.map((m) => m.kw)

  const keywords = [`${hit.city} street`, `${hit.city} travel`, ...moodKw, `${hit.city} landmark`]
    .filter((v, i, a) => a.indexOf(v) === i)
    .slice(0, 5)

  const hashtags = [hit.city, hit.country.replace(/\s/g, ''), 'Travel', ...moodTags, 'Journey']
    .filter((v, i, a) => a.indexOf(v) === i)
    .slice(0, 5)

  const trimmed = (content || '').replace(/\s+/g, ' ').trim()
  const summary =
    trimmed.length > 100 ? trimmed.slice(0, 98) + '…' : trimmed || `${hit.city}에서의 짧은 여행 기록.`
  const oneLiner = `${hit.city}, 마음에 남은 하루`.slice(0, 30)

  return {
    country: hit.country,
    city: hit.city,
    place: `${hit.city} old town`,
    keywords,
    hashtags,
    summary,
    oneLiner,
  }
}
