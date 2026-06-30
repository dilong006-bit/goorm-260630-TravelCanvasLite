# TravelCanvas Lite 🎨✈️

> **"Write once. Let AI illustrate your journey."**
> AI Agent 기반 여행 저널 웹앱 MVP

여행 글(300~500자)을 작성하면 **AI 에이전트**가 여러 도구(Claude/GPT · Unsplash · LocalStorage)를
순차적으로 오케스트레이션하여 하나의 아름다운 여행 일지를 만들어 줍니다.

## ✨ 핵심 흐름 (AI Agent / ReAct + Tool Use)

```
여행 글 작성 → GPT 글 분석 → 검색 키워드 생성 → Unsplash 검색
→ 대표 이미지 선택 → 여행 카드 생성 → LocalStorage 저장 → Timeline 표시
```

`src/services/agent.js` 가 오케스트레이터입니다:
**Planner → GPT Tool → Unsplash Tool → (사용자 선택) → Story Generator → Storage Tool**.
각 단계는 화면 우측 **AI Agent 패널**에 실시간으로 표시됩니다.

## 🌐 다국어 지원 (i18n)

UI와 AI 분석 출력 모두 **영어(기본) · 한국어 · 일본어**를 지원합니다.
헤더의 `EN / 한국어 / 日本語` 토글로 즉시 전환되며, 선택 언어는 localStorage에 저장됩니다.

- 선택 언어에 맞춰 **summary · oneLiner · hashtags** 가 해당 언어로 생성됩니다
  (검색용 `keywords` 는 Unsplash 정확도를 위해 항상 영어).
- **예시 글**(리스본의 노란 트램)도 언어별 제목 + 본문으로 제공 → "예시 글 채우기" 버튼.
- 구현: [`src/i18n/`](src/i18n/) (`translations.js` 사전 + 예시 글, `I18nContext.jsx` Provider/`useI18n`).

## 🧰 기술 스택

| 영역 | 기술 |
| --- | --- |
| Frontend | React 18 + Vite 5 |
| UI | Tailwind CSS v4 + 경량 shadcn 스타일 컴포넌트 |
| AI | OpenAI GPT API (`gpt-4o-mini`, JSON 모드) |
| Image | Unsplash API |
| Storage | Browser LocalStorage |
| 라우팅 | react-router-dom |
| 배포 | Vercel |

## 🚀 실행

```bash
npm install
npm run dev      # http://localhost:5161  (포트 고정)
npm run build    # 프로덕션 빌드 (dist/)
npm run preview  # 빌드 결과 미리보기 (http://localhost:5161)
```

> 개발 서버 포트는 [`vite.config.js`](vite.config.js) 에서 **5161** 로 고정되어 있습니다.
> 실행 시 브라우저가 자동으로 열립니다(`server.open`).

## 🔑 API 키 설정 (선택)

키가 **없어도** 데모 모드(휴리스틱 분석 + Lorem Picsum 이미지)로 전체 흐름을 체험할 수 있습니다.
실제 GPT/Unsplash 결과를 보려면 둘 중 한 가지 방법으로 키를 입력하세요.

1. **앱 내 설정(권장):** 우측 상단 ⚙️ → OpenAI / Unsplash 키 입력 (브라우저 localStorage 에만 저장)
2. **환경변수:** `.env.example` 을 `.env` 로 복사 후 값 채우기

```
VITE_OPENAI_API_KEY=sk-...
VITE_OPENAI_MODEL=gpt-4o-mini
VITE_UNSPLASH_ACCESS_KEY=...
```

> ⚠️ 브라우저에서 직접 API를 호출하는 구조이므로 키가 클라이언트에 노출됩니다.
> 학습용 MVP 기준이며, 실제 서비스에서는 백엔드 프록시를 두는 것을 권장합니다.

## 📁 프로젝트 구조

```
src/
├── pages/        Home · WriteStory · Story · Timeline
├── components/   StoryCard · ImagePicker · HeroImage · TimelineCard · AgentSteps · SettingsModal · Layout · ui · Icons
├── services/     openai.js · unsplash.js · storage.js · agent.js(오케스트레이터) · config.js
└── lib/          cn.js
```

## 📦 Vercel 배포

1. GitHub에 푸시 후 Vercel 에서 Import
2. Framework: **Vite** (자동 감지) · Build: `npm run build` · Output: `dist`
3. (선택) Environment Variables 에 `VITE_*` 키 등록

## 🔭 향후 확장 (Lite → Professional)

LocalStorage → Supabase · 단일 → 멀티 사용자 · 단일 Agent → LangGraph 멀티 에이전트 ·
GPT+Unsplash → 지도/날씨/환율 API · 개인 기록 → 여행 커뮤니티/공유

---

## 📝 작업 내역 (Changelog)

### 1. MVP 초기 빌드
- **React 18 + Vite 5 + Tailwind CSS v4** 스캐폴딩 (백엔드 없는 클라이언트 전용 구조)
- **AI Agent 오케스트레이터**([`agent.js`](src/services/agent.js)) — Planner → LLM 분석 → 검색어 생성 → Unsplash 검색 → 사용자 선택 → Story 생성 → LocalStorage 저장 (ReAct + Tool Use 패턴)
- 4개 화면(Home / WriteStory / Story / Timeline) + 컴포넌트(StoryCard · ImagePicker · HeroImage · TimelineCard · AgentSteps · SettingsModal)
- 우측 패널에 **에이전트 단계별 진행 상황 실시간 시각화**
- API 키가 없어도 동작하는 **데모(Mock) 모드** (휴리스틱 분석 + Lorem Picsum)
- 개발 서버 포트 **5161** 고정([`vite.config.js`](vite.config.js))

### 2. 🐞 오류 수정: OpenAI 429 (quota exceeded)
- **증상:** 글 작성 후 분석 시 `GPT 분석 실패 (429): You exceeded your current quota` 발생
- **원인:** 코드 버그가 아니라 OpenAI API 키에 결제/크레딧이 없어 호출이 거부됨
- **해결:** 분석 엔진을 **Claude(Anthropic)로 전환**하고 **provider 추상화** 도입
  - [`config.js`](src/services/config.js) `resolveProvider()` — `auto`(Claude 우선) / `anthropic` / `openai` 선택
  - [`anthropic.js`](src/services/anthropic.js) 신규 — 브라우저 직접 호출 헤더 + JSON 프리필로 안정적 파싱
  - [`analyze.js`](src/services/analyze.js) 신규 — provider 디스패처 + 견고한 JSON 파서 + Mock 폴백
  - Settings 모달에 **엔진 선택 토글** + Claude 키 입력 필드 추가

### 3. 🐞 빌드 오류 수정: `??` / `||` 혼용
- **증상:** `ERROR: Cannot use "||" with "??" without parentheses` (esbuild)
- **해결:** [`config.js`](src/services/config.js)의 `saveApiKeys`에서 nullish 병합 연산자 우선순위를 괄호로 명확히 정리

### 4. 🌐 다국어 지원(i18n) + 예시 글
- **영어(기본) · 한국어 · 일본어** 3개 언어 지원, 헤더 토글로 즉시 전환(localStorage 저장)
- UI 전체 + AI Agent 단계 패널 번역, **AI 분석 출력(summary·oneLiner·hashtags)도 선택 언어로 생성** (검색 keywords는 정확도를 위해 영어 유지)
- 언어별 **예시 글**(리스본의 노란 트램) 제공 → "예시 글 채우기"가 제목+본문 동시 입력
- 구현: [`src/i18n/`](src/i18n/) (`translations.js`, `I18nContext.jsx`)

> ℹ️ 이 저장소에는 앱 코드만 포함되며, 작성용 참고 문서(`ref/`)는 푸시에서 제외됩니다.
