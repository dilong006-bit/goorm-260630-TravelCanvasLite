import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getStories } from '../services/storage.js'
import { useI18n } from '../i18n/I18nContext.jsx'
import TimelineCard from '../components/TimelineCard.jsx'
import { Button } from '../components/ui.jsx'
import { PlusIcon, ClockIcon } from '../components/Icons.jsx'

export default function Timeline() {
  const { t } = useI18n()
  const [stories, setStories] = useState([])

  useEffect(() => {
    // 최신순으로 정렬 (createdAt 내림차순, 동일 날짜는 저장 순서 유지)
    const list = [...getStories()].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
    setStories(list)
  }, [])

  return (
    <div className="animate-fade-up">
      <div className="mb-6 flex items-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
          <ClockIcon width={20} height={20} />
        </span>
        <div>
          <h1 className="font-serif text-2xl font-bold text-slate-900">{t('timeline.title')}</h1>
          <p className="text-sm text-slate-500">{t('timeline.subtitle')}</p>
        </div>
      </div>

      {stories.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white/60 p-12 text-center">
          <p className="text-slate-600">{t('timeline.empty')}</p>
          <Button as={Link} to="/write" className="mt-4">
            <PlusIcon width={16} height={16} /> {t('timeline.startRecord')}
          </Button>
        </div>
      ) : (
        <div className="relative">
          {stories.map((s, i) => (
            <TimelineCard key={s.id} story={s} last={i === stories.length - 1} />
          ))}
        </div>
      )}
    </div>
  )
}
