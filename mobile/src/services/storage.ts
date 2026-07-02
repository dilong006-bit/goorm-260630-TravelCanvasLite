// Storage Tool — AsyncStorage 기반 여행 일지 저장/불러오기 (웹 LocalStorage 와 동일 인터페이스, 비동기)
import AsyncStorage from '@react-native-async-storage/async-storage'

const STORAGE_KEY = 'tcl.stories'

export interface HeroCredit {
  name?: string
  link?: string | null
  unsplash?: string | null
}

export interface Story {
  id: string
  title: string
  content: string
  city: string
  country: string
  place: string
  summary: string
  oneLiner: string
  hashtags: string[]
  keywords: string[]
  heroImage: string
  heroCredit: HeroCredit | null
  createdAt: string
}

export function uuid(): string {
  return (
    'id-' +
    Date.now().toString(36) +
    '-' +
    Math.random().toString(36).slice(2, 8) +
    Math.random().toString(36).slice(2, 6)
  )
}

export function todayISO(): string {
  return new Date().toISOString().slice(0, 10)
}

function safeParse(raw: string | null): Story[] {
  if (!raw) return []
  try {
    const v = JSON.parse(raw)
    return Array.isArray(v) ? (v as Story[]) : []
  } catch {
    return []
  }
}

export async function getStories(): Promise<Story[]> {
  return safeParse(await AsyncStorage.getItem(STORAGE_KEY))
}

export async function getStory(id: string): Promise<Story | null> {
  const list = await getStories()
  return list.find((s) => s.id === id) ?? null
}

export async function saveStory(story: Partial<Story>): Promise<Story> {
  const stories = await getStories()
  const record: Story = {
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
    heroCredit: story.heroCredit ?? null,
    createdAt: story.createdAt || todayISO(),
  }

  const idx = stories.findIndex((s) => s.id === record.id)
  if (idx >= 0) stories[idx] = record
  else stories.unshift(record)

  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(stories))
  return record
}

export async function deleteStory(id: string): Promise<Story[]> {
  const next = (await getStories()).filter((s) => s.id !== id)
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  return next
}

export async function clearAll(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEY)
}
