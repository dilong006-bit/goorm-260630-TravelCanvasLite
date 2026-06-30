// 중앙 설정/키 관리.
// 우선순위: localStorage(Settings 패널 입력) > Vite 환경변수(.env)
// 텍스트 분석은 Claude(Anthropic) 또는 GPT(OpenAI)를 사용할 수 있고,
// 둘 다 키가 없으면 데모(Mock) 모드로 동작한다.

const KEYS_STORAGE = 'tcl.apikeys'

const DEFAULT_OPENAI_MODEL = 'gpt-4o-mini'
const DEFAULT_ANTHROPIC_MODEL = 'claude-haiku-4-5-20251001'

export function getApiKeys() {
  let stored = {}
  try {
    stored = JSON.parse(localStorage.getItem(KEYS_STORAGE) || '{}')
  } catch {
    stored = {}
  }
  return {
    // 텍스트 분석 provider: 'auto' | 'anthropic' | 'openai'
    provider: (stored.provider || import.meta.env.VITE_LLM_PROVIDER || 'auto').trim(),

    anthropic: (stored.anthropic || import.meta.env.VITE_ANTHROPIC_API_KEY || '').trim(),
    anthropicModel: (
      stored.anthropicModel ||
      import.meta.env.VITE_ANTHROPIC_MODEL ||
      DEFAULT_ANTHROPIC_MODEL
    ).trim(),

    openai: (stored.openai || import.meta.env.VITE_OPENAI_API_KEY || '').trim(),
    model: (stored.model || import.meta.env.VITE_OPENAI_MODEL || DEFAULT_OPENAI_MODEL).trim(),

    unsplash: (stored.unsplash || import.meta.env.VITE_UNSPLASH_ACCESS_KEY || '').trim(),
  }
}

export function saveApiKeys(patch) {
  const current = getApiKeys()
  const next = {
    provider: (patch.provider ?? current.provider ?? 'auto').trim() || 'auto',
    anthropic: (patch.anthropic ?? current.anthropic ?? '').trim(),
    anthropicModel: (patch.anthropicModel ?? current.anthropicModel ?? DEFAULT_ANTHROPIC_MODEL).trim(),
    openai: (patch.openai ?? current.openai ?? '').trim(),
    model: (patch.model ?? current.model ?? DEFAULT_OPENAI_MODEL).trim(),
    unsplash: (patch.unsplash ?? current.unsplash ?? '').trim(),
  }
  localStorage.setItem(KEYS_STORAGE, JSON.stringify(next))
  return next
}

export function clearApiKeys() {
  localStorage.removeItem(KEYS_STORAGE)
}

export function hasAnthropic() {
  return Boolean(getApiKeys().anthropic)
}

export function hasOpenAI() {
  return Boolean(getApiKeys().openai)
}

export function hasUnsplash() {
  return Boolean(getApiKeys().unsplash)
}

// 실제로 사용할 텍스트 분석 provider 결정. 키가 없으면 'none'.
export function resolveProvider() {
  const k = getApiKeys()
  const pref = k.provider || 'auto'
  if (pref === 'anthropic') return k.anthropic ? 'anthropic' : k.openai ? 'openai' : 'none'
  if (pref === 'openai') return k.openai ? 'openai' : k.anthropic ? 'anthropic' : 'none'
  // auto: Claude 우선
  if (k.anthropic) return 'anthropic'
  if (k.openai) return 'openai'
  return 'none'
}
