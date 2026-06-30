import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getStory, deleteStory } from '../services/storage.js'
import { useI18n } from '../i18n/I18nContext.jsx'
import HeroImage from '../components/HeroImage.jsx'
import { Button, Badge } from '../components/ui.jsx'
import { ArrowLeftIcon, TrashIcon, PinIcon, ClockIcon } from '../components/Icons.jsx'

export default function Story() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { t } = useI18n()
  const [story, setStory] = useState(undefined) // undefined=로딩, null=없음

  useEffect(() => {
    setStory(getStory(id))
  }, [id])

  if (story === undefined) return null

  if (story === null) {
    return (
      <div className="py-20 text-center">
        <p className="text-lg font-semibold text-slate-700">{t('story.notFound')}</p>
        <Button as={Link} to="/" className="mt-4">
          {t('story.toHome')}
        </Button>
      </div>
    )
  }

  const place = [story.city, story.country].filter(Boolean).join(', ')

  const onDelete = () => {
    if (confirm(t('story.confirmDelete'))) {
      deleteStory(story.id)
      navigate('/timeline')
    }
  }

  return (
    <article className="animate-fade-up">
      <div className="mb-4 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-slate-800"
        >
          <ArrowLeftIcon width={16} height={16} /> {t('story.back')}
        </button>
        <Button variant="danger" size="sm" onClick={onDelete}>
          <TrashIcon width={15} height={15} /> {t('story.delete')}
        </Button>
      </div>

      <HeroImage
        src={story.heroImage}
        title={story.title}
        subtitle={place}
        credit={story.heroCredit}
        className="aspect-[16/9] w-full"
      />

      <div className="mx-auto mt-7 max-w-2xl">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
          <span className="inline-flex items-center gap-1">
            <ClockIcon width={15} height={15} /> {story.createdAt}
          </span>
          {place && (
            <span className="inline-flex items-center gap-1">
              <PinIcon width={15} height={15} /> {place}
            </span>
          )}
        </div>

        {story.oneLiner && (
          <p className="mt-4 font-serif text-xl font-bold text-brand-700">“{story.oneLiner}”</p>
        )}

        {story.summary && (
          <p className="mt-4 rounded-2xl bg-brand-50/60 p-4 text-[15px] leading-relaxed text-slate-700">
            <span className="mr-1 font-semibold text-brand-700">{t('story.aiSummary')}</span>
            {story.summary}
          </p>
        )}

        <div className="prose mt-6 whitespace-pre-wrap font-serif text-[17px] leading-8 text-slate-800">
          {story.content}
        </div>

        {story.hashtags?.length > 0 && (
          <div className="mt-8 border-t border-slate-100 pt-5">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
              {t('story.aiTags')}
            </p>
            <div className="flex flex-wrap gap-2">
              {story.hashtags.map((t) => (
                <Badge key={t} className="text-sm">
                  #{t}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  )
}
