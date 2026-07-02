// OpenAI(GPT) 호출 — JSON 모드
import { getApiKeys } from './config'

const ENDPOINT = 'https://api.openai.com/v1/chat/completions'

export async function callOpenAI({ system, user }: { system: string; user: string }): Promise<string> {
  const { openai, openaiModel } = getApiKeys()
  if (!openai) throw new Error('OpenAI 키가 없습니다.')

  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${openai}`,
    },
    body: JSON.stringify({
      model: openaiModel,
      temperature: 0.7,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
    }),
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`GPT 분석 실패 (${res.status}): ${text.slice(0, 200)}`)
  }

  const data = await res.json()
  return data.choices?.[0]?.message?.content || '{}'
}
