// Unsplash Tool — 검색어로 이미지 9장 검색
// 키가 없으면 picsum.photos 기반 Mock 이미지를 반환한다.

import { getApiKeys } from './config.js'

const ENDPOINT = 'https://api.unsplash.com/search/photos'

// 여러 검색어로 이미지를 모아 최대 9장 반환
export async function searchImages(keywords, perPageTotal = 9) {
  const queries = (keywords && keywords.length ? keywords : ['travel']).slice(0, 5)
  const { unsplash } = getApiKeys()

  if (!unsplash) {
    return mockImages(queries, perPageTotal)
  }

  const perQuery = Math.max(2, Math.ceil(perPageTotal / queries.length))
  const results = []
  const seen = new Set()

  for (const q of queries) {
    try {
      const url = `${ENDPOINT}?query=${encodeURIComponent(q)}&per_page=${perQuery}&orientation=landscape&content_filter=high`
      const res = await fetch(url, {
        headers: { Authorization: `Client-ID ${unsplash}` },
      })
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
      // 한 검색어 실패는 무시하고 다음으로
    }
  }

  if (results.length === 0) return mockImages(queries, perPageTotal)
  return results.slice(0, perPageTotal)
}

// ---- Mock ------------------------------------------------------------------

function mockImages(queries, total) {
  const out = []
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
