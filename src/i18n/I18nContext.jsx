import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { dict, DEFAULT_LANG, SAMPLES, LANGS } from './translations.js'

const LANG_STORAGE = 'tcl.lang'

const I18nContext = createContext(null)

function readInitialLang() {
  try {
    const saved = localStorage.getItem(LANG_STORAGE)
    if (saved && dict[saved]) return saved
  } catch {
    /* ignore */
  }
  return DEFAULT_LANG // 기본 언어: 영어
}

export function I18nProvider({ children }) {
  const [lang, setLangState] = useState(readInitialLang)

  useEffect(() => {
    try {
      localStorage.setItem(LANG_STORAGE, lang)
    } catch {
      /* ignore */
    }
    if (typeof document !== 'undefined') document.documentElement.lang = lang
  }, [lang])

  const value = useMemo(() => {
    const table = dict[lang] || dict[DEFAULT_LANG]
    const t = (key, vars) => {
      let str = table[key] ?? dict[DEFAULT_LANG][key] ?? key
      if (vars) {
        for (const k of Object.keys(vars)) {
          str = str.replaceAll(`{${k}}`, String(vars[k]))
        }
      }
      return str
    }
    return {
      lang,
      setLang: setLangState,
      t,
      sample: SAMPLES[lang] || SAMPLES[DEFAULT_LANG],
      langs: LANGS,
    }
  }, [lang])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used within I18nProvider')
  return ctx
}
