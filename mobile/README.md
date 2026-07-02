# TravelCanvas Mobile 📱✈️

> **"Write your journey. AI paints the memory."**
> React Native + Expo 기반 AI 여행 저널 앱 (웹 버전 [TravelCanvas Lite](../README.md)의 모바일 포팅)

여행 글을 작성하면 **AI 에이전트**가 GPT/Claude · Unsplash · AsyncStorage 를 순차적으로
오케스트레이션하여 하나의 아름다운 여행 일지를 만들어 줍니다.

## ✨ 핵심 흐름 (AI Agent · ReAct + Tool Use)

```
여행 글 작성 → LLM 분석 → 검색 키워드 → Unsplash 검색
→ 대표 이미지 선택 → 여행 카드 생성 → AsyncStorage 저장 → Timeline
```

오케스트레이터: [`src/services/agent.ts`](src/services/agent.ts)
**Planner → LLM(Claude/GPT) Tool → Unsplash Tool → (사용자 선택) → Story Generator → Storage Tool**.
Write 화면의 AI Agent 패널에서 각 단계가 실시간 표시됩니다.

## 🧰 기술 스택

| 영역 | 기술 |
| --- | --- |
| Framework | React Native 0.86 + **Expo SDK 57** |
| Language | TypeScript |
| Navigation | Expo Router (파일 기반 · Bottom Tabs) |
| UI | React Native StyleSheet + 테마 시스템 · `expo-image` · `expo-linear-gradient` |
| Icons | `@expo/vector-icons` (Ionicons) |
| AI | **Claude(Anthropic)** 우선 / GPT(OpenAI) 대체 |
| Image | Unsplash API |
| Storage | AsyncStorage |
| i18n | 영어(기본) · 한국어 · 일본어 |

> **스타일링 메모:** 명세서는 NativeWind를 제안하지만, 최신 SDK 57(React 19 / RN 0.86)에서
> 실행 검증 없이 NativeWind/Metro 설정을 넣는 리스크를 피하기 위해 **StyleSheet + 테마 토큰**
> ([`src/theme/theme.ts`](src/theme/theme.ts))으로 구현했습니다. 동일한 룩앤필이며 나중에 NativeWind로 교체 가능합니다.

## 🚀 실행

```bash
cd mobile
npm install
npx expo start        # QR 코드 → Expo Go 앱으로 스캔 (iOS/Android)
# 또는
npx expo start --android   # Android 에뮬레이터
npx expo start --ios       # iOS 시뮬레이터 (macOS)
```

> 📱 가장 쉬운 방법: 휴대폰에 **Expo Go** 설치 → `npx expo start` 의 QR 코드 스캔.

## 🔑 API 키 설정 (선택)

키가 **없어도** 데모 모드(휴리스틱 분석 + Lorem Picsum 이미지)로 전체 흐름을 체험할 수 있습니다.

1. **앱 내 설정(권장):** Settings 탭 → 엔진 선택 + 키 입력 (AsyncStorage 저장)
2. **환경변수:** `.env.example` 을 `.env` 로 복사 후 값 입력 (반드시 `EXPO_PUBLIC_` 접두사)

```
EXPO_PUBLIC_ANTHROPIC_API_KEY=sk-ant-...
EXPO_PUBLIC_ANTHROPIC_MODEL=claude-haiku-4-5-20251001
EXPO_PUBLIC_UNSPLASH_ACCESS_KEY=...
EXPO_PUBLIC_LLM_PROVIDER=auto
```

> ⚠️ `EXPO_PUBLIC_*` 값은 앱 번들에 포함되어 클라이언트에 노출됩니다(학습용 MVP 기준).
> 실제 서비스에서는 백엔드 프록시를 권장합니다.

## 📁 프로젝트 구조

```
mobile/src/
├── app/                      # Expo Router (파일 기반 라우팅)
│   ├── _layout.tsx           # 루트 Stack + Provider(i18n) + 키 hydrate + Splash
│   ├── (tabs)/               # Bottom Tabs
│   │   ├── _layout.tsx       # Home · Write · Timeline · Settings
│   │   ├── index.tsx         # Home
│   │   ├── write.tsx         # 여행 글 작성 + AI Agent + 이미지 선택
│   │   ├── timeline.tsx      # 타임라인
│   │   └── settings.tsx      # API 키/엔진/언어 설정
│   └── story/[id].tsx        # 여행 카드 상세
├── components/               # StoryCard · HeroImage · ImagePicker · AgentSteps · LangToggle · ui
├── services/                 # agent · analyze · anthropic · openai · unsplash · storage · keystore · config
├── i18n/                     # translations · I18nContext
└── theme/                    # theme (색·간격·radius)
```

## ✅ 검증 상태 (에뮬레이터 없이)

이 저장소는 CLI 환경에서 빌드되어 다음으로 검증했습니다:

- `npx tsc --noEmit` — **타입 에러 0**
- `npx expo-doctor` — **20/20 통과**
- `npx expo export --platform android` — **Metro 번들 성공** (모든 import/모듈 해석 확인)

실제 화면 동작은 `npx expo start` 로 기기/시뮬레이터에서 확인하세요.

## 🔭 향후 확장 (명세서 Phase 2~4)

카메라 · 갤러리 · GPS · 지도(React Native Maps) · SNS 공유 · 로그인/Supabase 클라우드 동기화 ·
음성 입력 · AI 여행 일정 추천 · PDF/포토북 생성
