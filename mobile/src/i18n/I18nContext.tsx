import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { dict, DEFAULT_LANG, SAMPLES, LANGS, type LangCode } from './translations'

const LANG_STORAGE = 'tcl.lang'

export type TFunc = (key: string, vars?: Record<string, string | number>) => string

interface I18nValue {
  lang: LangCode
  setLang: (l: LangCode) => void
  t: TFunc
  sample: { title: string; content: string }
  langs: typeof LANGS
}

const I18nContext = createContext<I18nValue | null>(null)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<LangCode>(DEFAULT_LANG)

  // 저장된 언어 hydrate
  useEffect(() => {
    AsyncStorage.getItem(LANG_STORAGE)
      .then((saved) => {
        if (saved && (dict as Record<string, unknown>)[saved]) setLangState(saved as LangCode)
      })
      .catch(() => {})
  }, [])

  const setLang = (l: LangCode) => {
    setLangState(l)
    AsyncStorage.setItem(LANG_STORAGE, l).catch(() => {})
  }

  const value = useMemo<I18nValue>(() => {
    const table = dict[lang] || dict[DEFAULT_LANG]
    const t: TFunc = (key, vars) => {
      let str = table[key] ?? dict[DEFAULT_LANG][key] ?? key
      if (vars) {
        for (const k of Object.keys(vars)) {
          str = str.split(`{${k}}`).join(String(vars[k]))
        }
      }
      return str
    }
    return { lang, setLang, t, sample: SAMPLES[lang] || SAMPLES[DEFAULT_LANG], langs: LANGS }
  }, [lang])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used within I18nProvider')
  return ctx
}
