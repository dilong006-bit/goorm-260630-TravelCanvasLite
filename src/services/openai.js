// OpenAI(GPT) Tool — 여행 글 분석 호출 (JSON 모드)
// 실제 분석 로직/프롬프트/Mock 은 analyze.js 에서 관리하고, 여기선 raw 호출만 담당한다.

import { getApiKeys } from './config.js'

const ENDPOINT = 'https://api.openai.com/v1/chat/completions'

export async function callOpenAI({ system, user }) {
  const { openai, model } = getApiKeys()
  if (!openai) throw new Error('OpenAI 키가 없습니다.')

  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${openai}`,
    },
    body: JSON.stringify({
      model,
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
