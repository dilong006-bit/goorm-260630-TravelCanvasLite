import { cn } from '../lib/cn.js'
import { CheckIcon } from './Icons.jsx'
import { Spinner } from './ui.jsx'
import { useI18n } from '../i18n/I18nContext.jsx'

// AI Agent의 ReAct 단계 진행 상황 시각화
const ORDER = [
  { id: 'plan', key: 'steps.plan' },
  { id: 'analyze', key: 'steps.analyze' },
  { id: 'keywords', key: 'steps.keywords' },
  { id: 'search', key: 'steps.search' },
]

export default function AgentSteps({ steps }) {
  const { t } = useI18n()
  // steps: { [id]: { status, label, detail } }
  return (
    <ol className="space-y-2.5">
      {ORDER.map((s, i) => {
        const st = steps[s.id] || { status: 'pending' }
        const status = st.status
        return (
          <li key={s.id} className="flex items-start gap-3">
            <div className="flex flex-col items-center">
              <span
                className={cn(
                  'flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-bold transition',
                  status === 'done' && 'border-brand-500 bg-brand-500 text-white',
                  status === 'running' && 'border-brand-400 bg-brand-50 text-brand-600',
                  status === 'error' && 'border-rose-400 bg-rose-50 text-rose-600',
                  status === 'pending' && 'border-slate-200 bg-white text-slate-400',
                )}
              >
                {status === 'done' ? (
                  <CheckIcon width={15} height={15} />
                ) : status === 'running' ? (
                  <Spinner className="text-brand-600" />
                ) : status === 'error' ? (
                  '!'
                ) : (
                  i + 1
                )}
              </span>
              {i < ORDER.length - 1 && (
                <span
                  className={cn(
                    'my-0.5 h-6 w-px',
                    status === 'done' ? 'bg-brand-300' : 'bg-slate-200',
                  )}
                />
              )}
            </div>
            <div className="min-w-0 pt-0.5">
              <p
                className={cn(
                  'text-sm font-semibold',
                  status === 'pending' ? 'text-slate-400' : 'text-slate-800',
                )}
              >
                {st.label || t(s.key)}
              </p>
              {st.detail && (
                <p
                  className={cn(
                    'mt-0.5 break-words text-xs',
                    status === 'error' ? 'text-rose-600' : 'text-slate-500',
                  )}
                >
                  {st.detail}
                </p>
              )}
            </div>
          </li>
        )
      })}
    </ol>
  )
}
