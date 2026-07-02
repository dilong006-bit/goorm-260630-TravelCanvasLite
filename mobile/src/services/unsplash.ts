// Unsplash Tool — 검색어로 이미지 검색. 키 없으면 picsum.photos Mock.
import { getApiKeys } from './config'

const ENDPOINT = 'https://api.unsplash.com/search/photos'

export interface TravelImage {
  id: string
  query: string
  thumb: string
  full: string
  alt: string
  credit: { name?: string; link?: string | null; unsplash?: string | null }
  _mock?: boolean
}

export async function searchImages(keywords: string[], perPageTotal = 9): Promise<TravelImage[]> {
  const queries = (keywords && keywords.length ? keywords : ['travel']).slice(0, 5)
  const { unsplash } = getApiKeys()

  if (!unsplash) return mockImages(queries, perPageTotal)

  const perQuery = Math.max(2, Math.ceil(perPageTotal / queries.length))
  const results: TravelImage[] = []
  const seen = new Set<string>()

  for (const q of queries) {
    try {
      const url = `${ENDPOINT}?query=${encodeURIComponent(q)}&per_page=${perQuery}&orientation=landscape&content_filter=high`
      const res = await fetch(url, { headers: { Authorization: `Client-ID ${unsplash}` } })
      if (!res.ok) continue
      const data = await res.json()
      for (const p of data.results || []) {
        if (seen.has(p.id)) continue
        seen.add(p.id)
        results.push({
          id: p.id,
          query: q,
          thumb: p.urls?.small,
          full: p.urls?.regular || p.urls?.full,
          alt: p.alt_description || q,
          credit: {
            name: p.user?.name,
            link: p.user?.links?.html,
            unsplash: p.links?.html,
          },
        })
      }
    } catch {
      // 개별 검색어 실패 무시
    }
  }

  if (results.length === 0) return mockImages(queries, perPageTotal)
  return results.slice(0, perPageTotal)
}

function mockImages(queries: string[], total: number): TravelImage[] {
  const out: TravelImage[] = []
  let i = 0
  while (out.length < total) {
    const q = queries[i % queries.length]
    const seed = `${q.replace(/\s+/g, '-')}-${i}`
    out.push({
      id: `mock-${seed}`,
      query: q,
      thumb: `https://picsum.photos/seed/${encodeURIComponent(seed)}/600/400`,
      full: `https://picsum.photos/seed/${encodeURIComponent(seed)}/1200/800`,
      alt: q,
      credit: { name: 'Lorem Picsum (데모)', link: 'https://picsum.photos', unsplash: null },
      _mock: true,
    })
    i++
  }
  return out
}
