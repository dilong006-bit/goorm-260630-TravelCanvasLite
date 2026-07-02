// API 키 저장소 — env(EXPO_PUBLIC_*) 기본값 위에 사용자가 Settings 에서 저장한 값(AsyncStorage)을 얹는다.
// AsyncStorage 는 비동기이므로 앱 부팅 시 hydrateKeys() 로 메모리 캐시를 채우고,
// 이후 getKeys() 는 동기적으로 캐시를 반환한다.
import AsyncStorage from '@react-native-async-storage/async-storage'

export type Provider = 'auto' | 'anthropic' | 'openai'

export interface ApiKeys {
  provider: Provider
  anthropic: string
  anthropicModel: string
  openai: string
  openaiModel: string
  unsplash: string
}

const STORAGE_KEY = 'tcl.apikeys'

function fromEnv(): ApiKeys {
  const e = process.env
  const provider = (e.EXPO_PUBLIC_LLM_PROVIDER as Provider) || 'auto'
  return {
    provider: ['auto', 'anthropic', 'openai'].includes(provider) ? provider : 'auto',
    anthropic: (e.EXPO_PUBLIC_ANTHROPIC_API_KEY ?? '').trim(),
    anthropicModel: (e.EXPO_PUBLIC_ANTHROPIC_MODEL ?? 'claude-haiku-4-5-20251001').trim(),
    openai: (e.EXPO_PUBLIC_OPENAI_API_KEY ?? '').trim(),
    openaiModel: (e.EXPO_PUBLIC_OPENAI_MODEL ?? 'gpt-4o-mini').trim(),
    unsplash: (e.EXPO_PUBLIC_UNSPLASH_ACCESS_KEY ?? '').trim(),
  }
}

let cache: ApiKeys = fromEnv()

export async function hydrateKeys(): Promise<void> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY)
    if (raw) {
      const stored = JSON.parse(raw) as Partial<ApiKeys>
      cache = { ...fromEnv(), ...stored }
    }
  } catch {
    // 무시하고 env 기본값 유지
  }
}

export function getKeys(): ApiKeys {
  return cache
}

export async function saveKeys(patch: Partial<ApiKeys>): Promise<ApiKeys> {
  const trim = (v: string | undefined, fallback: string) =>
    typeof v === 'string' ? v.trim() : fallback
  cache = {
    provider: (patch.provider ?? cache.provider) || 'auto',
    anthropic: trim(patch.anthropic, cache.anthropic),
    anthropicModel: trim(patch.anthropicModel, cache.anthropicModel) || 'claude-haiku-4-5-20251001',
    openai: trim(patch.openai, cache.openai),
    openaiModel: trim(patch.openaiModel, cache.openaiModel) || 'gpt-4o-mini',
    unsplash: trim(patch.unsplash, cache.unsplash),
  }
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(cache))
  return cache
}

export async function clearKeys(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEY)
  cache = fromEnv()
}
