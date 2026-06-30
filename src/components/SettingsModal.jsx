import { useEffect, useState } from 'react'
import { getApiKeys, saveApiKeys, clearApiKeys } from '../services/config.js'
import { useI18n } from '../i18n/I18nContext.jsx'
import { Button } from './ui.jsx'

// API 키 입력 모달 — 키는 브라우저 localStorage 에만 저장됨
export default function SettingsModal({ open, onClose }) {
  const { t } = useI18n()
  const [provider, setProvider] = useState('auto')
  const [anthropic, setAnthropic] = useState('')
  const [openai, setOpenai] = useState('')
  const [unsplash, setUnsplash] = useState('')

  useEffect(() => {
    if (open) {
      const k = getApiKeys()
      setProvider(k.provider || 'auto')
      setAnthropic(k.anthropic)
      setOpenai(k.openai)
      setUnsplash(k.unsplash)
    }
  }, [open])

  if (!open) return null

  const save = () => {
    saveApiKeys({ provider, anthropic, openai, unsplash })
    onClose()
  }
  const reset = () => {
    clearApiKeys()
    setProvider('auto')
    setAnthropic('')
    setOpenai('')
    setUnsplash('')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-xl animate-fade-up">
        <h2 className="text-lg font-bold text-slate-900">{t('settings.title')}</h2>
        <p className="mt-1 text-sm text-slate-500">{t('settings.desc')}</p>

        <div className="mt-5 space-y-4">
          <div>
            <label className="text-sm font-semibold text-slate-700">{t('settings.engine')}</label>
            <div className="mt-1.5 grid grid-cols-3 gap-1.5 rounded-xl bg-slate-100 p-1">
              {[
                ['auto', t('settings.auto')],
                ['anthropic', 'Claude'],
                ['openai', 'GPT'],
              ].map(([val, label]) => (
                <button
                  key={val}
                  onClick={() => setProvider(val)}
                  className={
                    'rounded-lg py-1.5 text-sm font-semibold transition ' +
                    (provider === val ? 'bg-white text-brand-700 shadow-sm' : 'text-slate-500')
                  }
                >
                  {label}
                </button>
              ))}
            </div>
            <p className="mt-1 text-xs text-slate-400">{t('settings.engineHint')}</p>
          </div>

          <Field
            label={t('settings.anthropic')}
            hint={t('settings.anthropicHint')}
            value={anthropic}
            onChange={setAnthropic}
            placeholder="sk-ant-..."
          />
          <Field
            label={t('settings.openai')}
            hint={t('settings.openaiHint')}
            value={openai}
            onChange={setOpenai}
            placeholder="sk-..."
          />
          <Field
            label={t('settings.unsplash')}
            hint={t('settings.unsplashHint')}
            value={unsplash}
            onChange={setUnsplash}
            placeholder="Client-ID"
          />
        </div>

        <div className="mt-6 flex items-center justify-between">
          <button onClick={reset} className="text-sm font-medium text-slate-400 hover:text-rose-500">
            {t('settings.reset')}
          </button>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={onClose}>
              {t('settings.cancel')}
            </Button>
            <Button onClick={save}>{t('settings.save')}</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

function Field({ label, hint, value, onChange, placeholder }) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <label className="text-sm font-semibold text-slate-700">{label}</label>
        <span className="text-xs text-slate-400">{hint}</span>
      </div>
      <input
        type="password"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
      />
    </div>
  )
}
