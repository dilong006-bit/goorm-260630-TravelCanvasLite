// provider 결정 및 키 존재 여부 헬퍼
import { getKeys } from './keystore'

export function getApiKeys() {
  return getKeys()
}

export function hasAnthropic(): boolean {
  return Boolean(getKeys().anthropic)
}

export function hasOpenAI(): boolean {
  return Boolean(getKeys().openai)
}

export function hasUnsplash(): boolean {
  return Boolean(getKeys().unsplash)
}

// 실제 사용할 텍스트 분석 provider. 키가 없으면 'none'. (auto 는 anthropic/openai 로 해소)
export function resolveProvider(): 'anthropic' | 'openai' | 'none' {
  const k = getKeys()
  const pref = k.provider || 'auto'
  if (pref === 'anthropic') return k.anthropic ? 'anthropic' : k.openai ? 'openai' : 'none'
  if (pref === 'openai') return k.openai ? 'openai' : k.anthropic ? 'anthropic' : 'none'
  if (k.anthropic) return 'anthropic' // auto: Claude 우선
  if (k.openai) return 'openai'
  return 'none'
}
