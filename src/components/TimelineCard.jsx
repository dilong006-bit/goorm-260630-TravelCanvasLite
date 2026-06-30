import { Link } from 'react-router-dom'
import { Badge } from './ui.jsx'
import { PinIcon } from './Icons.jsx'

// Timeline 화면의 세로 타임라인 노드
export default function TimelineCard({ story, last }) {
  const place = [story.city, story.country].filter(Boolean).join(', ')
  return (
    <div className="relative pl-10">
      {/* 라인 */}
      {!last && <span className="absolute left-[14px] top-7 h-full w-px bg-brand-200" />}
      {/* 노드 */}
      <span className="absolute left-2 top-3 flex h-5 w-5 items-center justify-center rounded-full border-2 border-brand-500 bg-white">
        <span className="h-2 w-2 rounded-full bg-brand-500" />
      </span>

      <Link
        to={`/story/${story.id}`}
        className="group mb-5 flex gap-4 overflow-hidden rounded-2xl border border-slate-200/70 bg-white p-3 shadow-sm transition hover:shadow-md"
      >
        <div className="h-20 w-28 shrink-0 overflow-hidden rounded-xl bg-slate-200">
          {story.heroImage ? (
            <img
              src={story.heroImage}
              alt={story.title}
              loading="lazy"
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          ) : null}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>{story.createdAt}</span>
            {place && (
              <span className="inline-flex items-center gap-1 text-brand-600">
                <PinIcon width={12} height={12} /> {place}
              </span>
            )}
          </div>
          <h3 className="mt-0.5 font-serif text-lg font-bold leading-snug text-slate-900 line-clamp-1">
            {story.title}
          </h3>
          <p className="mt-0.5 text-sm text-slate-500 line-clamp-1">
            {story.oneLiner || story.summary}
          </p>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {(story.hashtags || []).slice(0, 3).map((t) => (
              <Badge key={t}>#{t}</Badge>
            ))}
          </div>
        </div>
      </Link>
    </div>
  )
}
