import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getStories } from '../services/storage.js'
import { useI18n } from '../i18n/I18nContext.jsx'
import StoryCard from '../components/StoryCard.jsx'
import { Button } from '../components/ui.jsx'
import { PlusIcon, SparkIcon, ClockIcon } from '../components/Icons.jsx'

export default function Home() {
  const { t } = useI18n()
  const [stories, setStories] = useState([])

  useEffect(() => {
    setStories(getStories())
  }, [])

  return (
    <div className="animate-fade-up">
      {/* Hero / CTA */}
      <section className="overflow-hidden rounded-3xl border border-slate-200/70 bg-gradient-to-br from-brand-600 to-sky-400 p-8 text-white shadow-sm sm:p-12">
        <p className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur">
          <SparkIcon width={14} height={14} /> {t('home.badge')}
        </p>
        <h1 className="mt-4 max-w-xl font-serif text-3xl font-bold leading-tight sm:text-4xl">
          {t('home.title')}
        </h1>
        <p className="mt-3 max-w-lg text-white/85">{t('home.subtitle')}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button as={Link} to="/write" size="lg" variant="secondary" className="text-brand-700">
            <PlusIcon width={18} height={18} /> {t('home.start')}
          </Button>
          <Button
            as={Link}
            to="/timeline"
            size="lg"
            variant="ghost"
            className="text-white hover:bg-white/15"
          >
            <ClockIcon width={18} height={18} /> {t('home.viewTimeline')}
          </Button>
        </div>
      </section>

      {/* 최근 여행 */}
      <section className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-serif text-2xl font-bold text-slate-900">{t('home.recent')}</h2>
          {stories.length > 0 && (
            <Link to="/timeline" className="text-sm font-semibold text-brand-600 hover:underline">
              {t('home.allTimeline')}
            </Link>
          )}
        </div>

        {stories.length === 0 ? (
          <EmptyState t={t} />
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {stories.map((s) => (
              <StoryCard key={s.id} story={s} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

function EmptyState({ t }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white/60 p-12 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-500">
        <SparkIcon width={26} height={26} />
      </div>
      <h3 className="mt-4 text-lg font-bold text-slate-800">{t('home.emptyTitle')}</h3>
      <p className="mt-1 text-sm text-slate-500">{t('home.emptyDesc')}</p>
      <Button as={Link} to="/write" className="mt-5">
        <PlusIcon width={16} height={16} /> {t('home.firstRecord')}
      </Button>
    </div>
  )
}
