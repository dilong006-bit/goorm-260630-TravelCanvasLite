// 여행 글 분석 디스패처 — Claude / GPT 중 사용 가능한 provider 로 호출, 없으면 Mock.
import { resolveProvider } from './config'
import { callClaude } from './anthropic'
import { callOpenAI } from './openai'

export interface Analysis {
  country: string
  city: string
  place: string
  keywords: string[]
  hashtags: string[]
  summary: string
  oneLiner: string
  _provider?: 'anthropic' | 'openai' | 'mock'
  _mock?: boolean
}

const LANG_NAME: Record<string, string> = {
  en: 'English',
  ko: 'Korean (한국어)',
  ja: 'Japanese (日本語)',
}

function buildSystemPrompt(lang: string): string {
  const outLang = LANG_NAME[lang] || LANG_NAME.en
  return `You are an AI agent that analyzes travel journals.
Read the user's travel note and extract/generate the fields below.
- Write "summary", "oneLiner", "hashtags" in ${outLang}.
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

export async function analyzeStory({
  title,
  content,
  lang = 'en',
}: {
  title: string
  content: string
  lang?: string
}): Promise<Analysis> {
  const provider = resolveProvider()
  if (provider === 'none') {
    return { ...mockAnalyze({ title, content }), _mock: true, _provider: 'mock' }
  }

  const system = buildSystemPrompt(lang)
  const user = `Title: ${title || '(no title)'}\n\nBody:\n${content}`

  const raw =
    provider === 'anthropic' ? await callClaude({ system, user }) : await callOpenAI({ system, user })

  return { ...normalize(parseJSON(raw)), _provider: provider }
}

function parseJSON(raw: string): any {
  const text = String(raw || '').trim()
  try {
    return JSON.parse(text)
  } catch {
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

function normalize(p: any): Analysis {
  const arr = (v: any): string[] =>
    Array.isArray(v) ? v.filter(Boolean).map((x) => String(x).trim()) : []
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
  { kr: ['교토', 'kyoto', '기온'], city: 'Kyoto', country: 'Japan' },
  { kr: ['오사카', 'osaka'], city: 'Osaka', country: 'Japan' },
  { kr: ['도쿄', 'tokyo'], city: 'Tokyo', country: 'Japan' },
  { kr: ['부산', 'busan'], city: 'Busan', country: 'South Korea' },
  { kr: ['제주', 'jeju'], city: 'Jeju', country: 'South Korea' },
  { kr: ['리스본', 'lisbon', '트램', 'tram'], city: 'Lisbon', country: 'Portugal' },
  { kr: ['파리', 'paris'], city: 'Paris', country: 'France' },
  { kr: ['로마', 'rome'], city: 'Rome', country: 'Italy' },
]

function mockAnalyze({ title, content }: { title: string; content: string }): Analysis {
  const text = `${title || ''} ${content || ''}`.toLowerCase()
  const hit =
    CITY_HINTS.find((c) => c.kr.some((k) => text.includes(k.toLowerCase()))) || {
      city: 'Lisbon',
      country: 'Portugal',
    }

  const keywords = [
    `${hit.city} street`,
    `${hit.city} travel`,
    `${hit.city} old town`,
    `${hit.city} landmark`,
    `${hit.city} cafe`,
  ]
  const hashtags = [hit.city, hit.country.replace(/\s/g, ''), 'Travel', 'Journey', 'Trip']

  const trimmed = (content || '').replace(/\s+/g, ' ').trim()
  const summary = trimmed.length > 100 ? trimmed.slice(0, 98) + '…' : trimmed || `${hit.city} trip.`
  const oneLiner = `${hit.city}, a day to remember`.slice(0, 30)

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
