import { useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { hasAnthropic, hasOpenAI, hasUnsplash } from '../services/config.js'
import { useI18n } from '../i18n/I18nContext.jsx'
import { Button } from './ui.jsx'
import SettingsModal from './SettingsModal.jsx'
import { GearIcon, PlusIcon, ClockIcon, HomeIcon, SparkIcon } from './Icons.jsx'
import { cn } from '../lib/cn.js'

export default function Layout({ children }) {
  const [settingsOpen, setSettingsOpen] = useState(false)
  const loc = useLocation()
  const { t, lang, setLang, langs } = useI18n()
  const demoMode = (!hasAnthropic() && !hasOpenAI()) || !hasUnsplash()

  const navItem = (to, label, Icon) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          'inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition',
          isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-500 hover:text-slate-800',
        )
      }
    >
      <Icon width={16} height={16} /> {label}
    </NavLink>
  )

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/70 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-3">
          <Link to="/" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500 text-white">
              <SparkIcon width={18} height={18} />
            </span>
            <span className="font-serif text-lg font-bold tracking-tight text-slate-900">
              TravelCanvas <span className="text-brand-600">Lite</span>
            </span>
          </Link>

          <nav className="ml-4 hidden items-center gap-1 sm:flex">
            {navItem('/', t('nav.home'), HomeIcon)}
            {navItem('/timeline', t('nav.timeline'), ClockIcon)}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            {demoMode && (
              <button
                onClick={() => setSettingsOpen(true)}
                className="hidden rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 ring-1 ring-amber-200 sm:inline"
                title="API key 없이 데모로 동작 중"
              >
                {t('nav.demoMode')}
              </button>
            )}

            {/* 언어 전환 */}
            <div className="flex items-center rounded-lg bg-slate-100 p-0.5">
              {langs.map((l) => (
                <button
                  key={l.code}
                  onClick={() => setLang(l.code)}
                  className={cn(
                    'rounded-md px-2 py-1 text-xs font-bold transition',
                    lang === l.code ? 'bg-white text-brand-700 shadow-sm' : 'text-slate-500 hover:text-slate-700',
                  )}
                  aria-pressed={lang === l.code}
                >
                  {l.label}
                </button>
              ))}
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSettingsOpen(true)}
              aria-label={t('nav.settings')}
              className="px-2"
            >
              <GearIcon width={18} height={18} />
            </Button>
            {loc.pathname !== '/write' && (
              <Button as={Link} to="/write" size="sm">
                <PlusIcon width={16} height={16} /> {t('nav.newStory')}
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>

      <footer className="mx-auto max-w-5xl px-4 pb-10 pt-4 text-center text-xs text-slate-400">
        {t('footer.tagline')}
      </footer>

      <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  )
}
