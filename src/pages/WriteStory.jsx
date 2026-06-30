import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { runAnalysisAgent, composeAndSaveStory } from '../services/agent.js'
import { useI18n } from '../i18n/I18nContext.jsx'
import { Button, Card, Badge } from '../components/ui.jsx'
import AgentSteps from '../components/AgentSteps.jsx'
import ImagePicker from '../components/ImagePicker.jsx'
import { SparkIcon, ArrowLeftIcon, CheckIcon } from '../components/Icons.jsx'

const MIN = 100
const REC_MIN = 300
const REC_MAX = 500

export default function WriteStory() {
  const navigate = useNavigate()
  const { t, lang, sample } = useI18n()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [phase, setPhase] = useState('write') // write | running | pick
  const [steps, setSteps] = useState({})
  const [analysis, setAnalysis] = useState(null)
  const [images, setImages] = useState([])
  const [selected, setSelected] = useState(null)
  const [error, setError] = useState('')
  const draftRef = useRef(null)

  const len = content.trim().length
  const counterColor =
    len === 0
      ? 'text-slate-400'
      : len < REC_MIN
        ? 'text-amber-600'
        : len <= REC_MAX
          ? 'text-emerald-600'
          : 'text-amber-600'

  const canRun = len >= MIN && phase !== 'running'

  const fillSample = () => {
    setTitle(sample.title)
    setContent(sample.content)
  }

  const runAgent = async () => {
    setError('')
    setPhase('running')
    setSteps({})
    setImages([])
    setSelected(null)

    const draft = {
      id: crypto.randomUUID?.() || 'id-' + Date.now().toString(36),
      title: title.trim() || sample.title,
      content: content.trim(),
      createdAt: new Date().toISOString().slice(0, 10),
    }
    draftRef.current = draft

    try {
      const { analysis: a, images: imgs } = await runAnalysisAgent(
        { title: draft.title, content: draft.content, lang },
        (step) => setSteps((prev) => ({ ...prev, [step.id]: { ...prev[step.id], ...step } })),
        t,
      )
      setAnalysis(a)
      setImages(imgs)
      setPhase('pick')
    } catch (e) {
      setError(e.message || t('write.errorGeneric'))
      setPhase('write')
    }
  }

  const createCard = () => {
    if (!selected || !analysis) return
    const saved = composeAndSaveStory({ draft: draftRef.current, analysis, heroImage: selected })
    navigate(`/story/${saved.id}`)
  }

  const running = phase === 'running'
  const picking = phase === 'pick'

  // **bold** 강조를 가벼운 마크업으로 처리
  const renderHint = (text) =>
    text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
      part.startsWith('**') && part.endsWith('**') ? (
        <b key={i} className="text-slate-700">
          {part.slice(2, -2)}
        </b>
      ) : (
        <span key={i}>{part}</span>
      ),
    )

  return (
    <div className="animate-fade-up">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-slate-800"
      >
        <ArrowLeftIcon width={16} height={16} /> {t('write.back')}
      </button>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* 좌: 작성 영역 */}
        <div>
          <h1 className="font-serif text-2xl font-bold text-slate-900">{t('write.title')}</h1>
          <p className="mt-1 text-sm text-slate-500">{t('write.subtitle')}</p>

          <Card className="mt-5 p-5">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={running}
              placeholder={t('write.titlePlaceholder')}
              className="w-full border-0 border-b border-slate-200 pb-2 font-serif text-xl font-bold outline-none placeholder:text-slate-300 focus:border-brand-400 disabled:opacity-60"
            />
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={running}
              rows={11}
              placeholder={t('write.bodyPlaceholder')}
              className="mt-4 w-full resize-none border-0 text-[15px] leading-relaxed outline-none placeholder:text-slate-300 disabled:opacity-60"
            />
            <div className="mt-2 flex items-center justify-between border-t border-slate-100 pt-3">
              <button
                onClick={fillSample}
                disabled={running}
                className="text-xs font-medium text-brand-600 hover:underline disabled:opacity-50"
              >
                {t('write.fillSample')}
              </button>
              <span className={`text-sm font-semibold tabular-nums ${counterColor}`}>
                {len}
                {t('write.charUnit')}
                <span className="ml-1 font-normal text-slate-400">
                  / {t('write.recommend')} {REC_MIN}~{REC_MAX}
                </span>
              </span>
            </div>
          </Card>

          {error && (
            <p className="mt-3 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-600">{error}</p>
          )}

          {!picking && (
            <Button onClick={runAgent} disabled={!canRun} size="lg" className="mt-5 w-full sm:w-auto">
              <SparkIcon width={18} height={18} />
              {running ? t('write.working') : t('write.findImages')}
            </Button>
          )}
          {len > 0 && len < MIN && (
            <p className="mt-2 text-xs text-amber-600">{t('write.minChars', { n: MIN })}</p>
          )}
        </div>

        {/* 우: AI Agent 진행 패널 */}
        <aside>
          <Card className="sticky top-20 p-5">
            <div className="mb-4 flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                <SparkIcon width={16} height={16} />
              </span>
              <h3 className="font-bold text-slate-800">{t('write.agent')}</h3>
            </div>
            {phase === 'write' && !running ? (
              <p className="text-sm text-slate-500">{renderHint(t('write.agentHint'))}</p>
            ) : (
              <AgentSteps steps={steps} />
            )}

            {analysis && (
              <div className="mt-5 border-t border-slate-100 pt-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  {t('write.analysisResult')}
                </p>
                <p className="mt-1.5 text-sm font-semibold text-slate-800">
                  📍 {[analysis.city, analysis.country].filter(Boolean).join(', ')}
                </p>
                <p className="mt-1 text-sm text-slate-500">{analysis.oneLiner}</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {analysis.hashtags.map((tag) => (
                    <Badge key={tag}>#{tag}</Badge>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </aside>
      </div>

      {/* 이미지 선택 영역 */}
      {(picking || running) && (
        <section className="mt-10 animate-fade-up">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="font-serif text-2xl font-bold text-slate-900">{t('write.pickTitle')}</h2>
              <p className="mt-1 text-sm text-slate-500">{t('write.pickSubtitle')}</p>
            </div>
            <Button onClick={createCard} disabled={!selected} size="lg">
              <CheckIcon width={18} height={18} /> {t('write.createCard')}
            </Button>
          </div>

          <ImagePicker
            images={images}
            loading={running && images.length === 0}
            selectedId={selected?.id}
            onSelect={setSelected}
          />
        </section>
      )}
    </div>
  )
}
