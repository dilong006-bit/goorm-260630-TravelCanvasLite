// Claude(Anthropic) 호출 — JSON 프리필로 안정적 파싱
import { getApiKeys } from './config'

const ENDPOINT = 'https://api.anthropic.com/v1/messages'

export async function callClaude({ system, user }: { system: string; user: string }): Promise<string> {
  const { anthropic, anthropicModel } = getApiKeys()
  if (!anthropic) throw new Error('Anthropic 키가 없습니다.')

  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': anthropic,
      'anthropic-version': '2023-06-01',
      // Expo Web 에서 실행될 때를 대비 (네이티브에서는 무해)
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: anthropicModel,
      max_tokens: 1024,
      temperature: 0.7,
      system,
      messages: [
        { role: 'user', content: user },
        { role: 'assistant', content: '{' },
      ],
    }),
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Claude 분석 실패 (${res.status}): ${text.slice(0, 200)}`)
  }

  const data = await res.json()
  const out = data.content?.[0]?.text || ''
  return '{' + out
}
