// LocalStorage Tool — 여행 일지 저장/불러오기
// 데이터 구조는 명세서(7. LocalStorage 구조)를 따른다.

const STORAGE_KEY = 'tcl.stories'

function safeParse(raw) {
  try {
    const v = JSON.parse(raw)
    return Array.isArray(v) ? v : []
  } catch {
    return []
  }
}

export function getStories() {
  return safeParse(localStorage.getItem(STORAGE_KEY) || '[]')
}

export function getStory(id) {
  return getStories().find((s) => s.id === id) || null
}

function uuid() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
  return 'id-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8)
}

function todayISO() {
  return new Date().toISOString().slice(0, 10) // YYYY-MM-DD
}

export function saveStory(story) {
  const stories = getStories()
  const record = {
    id: story.id || uuid(),
    title: story.title || '제목 없는 여행',
    content: story.content || '',
    city: story.city || '',
    country: story.country || '',
    place: story.place || '',
    summary: story.summary || '',
    oneLiner: story.oneLiner || '',
    hashtags: story.hashtags || [],
    keywords: story.keywords || [],
    heroImage: story.heroImage || '',
    heroCredit: story.heroCredit || null,
    createdAt: story.createdAt || todayISO(),
  }

  const idx = stories.findIndex((s) => s.id === record.id)
  if (idx >= 0) stories[idx] = record
  else stories.unshift(record) // 최신이 위로

  localStorage.setItem(STORAGE_KEY, JSON.stringify(stories))
  return record
}

export function deleteStory(id) {
  const next = getStories().filter((s) => s.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  return next
}

export function clearAll() {
  localStorage.removeItem(STORAGE_KEY)
}
