// Anthropic(Claude) Tool — 여행 글 분석 호출
// 브라우저 직접 호출을 허용하는 헤더(anthropic-dangerous-direct-browser-access)를 사용한다.
// JSON 신뢰도를 높이기 위해 assistant 프리필('{')로 JSON 출력을 강제한다.

import { getApiKeys } from './config.js'

const ENDPOINT = 'https://api.anthropic.com/v1/messages'

export async function callClaude({ system, user }) {
  const { anthropic, anthropicModel } = getApiKeys()
  if (!anthropic) throw new Error('Anthropic 키가 없습니다.')

  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': anthropic,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: anthropicModel,
      max_tokens: 1024,
      temperature: 0.7,
      system,
      messages: [
        { role: 'user', content: user },
        { role: 'assistant', content: '{' }, // JSON 프리필
      ],
    }),
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Claude 분석 실패 (${res.status}): ${text.slice(0, 200)}`)
  }

  const data = await res.json()
  const out = data.content?.[0]?.text || ''
  // 프리필한 '{' 를 다시 붙여 완전한 JSON 으로 복원
  return '{' + out
}
