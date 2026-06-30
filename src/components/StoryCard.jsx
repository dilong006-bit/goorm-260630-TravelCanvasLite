import { Link } from 'react-router-dom'
import { Badge } from './ui.jsx'
import { PinIcon } from './Icons.jsx'

// 홈 "최근 여행" 그리드에 쓰이는 카드
export default function StoryCard({ story }) {
  const place = [story.city, story.country].filter(Boolean).join(', ')
  return (
    <Link
      to={`/story/${story.id}`}
      className="group block overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-200">
        {story.heroImage ? (
          <img
            src={story.heroImage}
            alt={story.title}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-slate-400">No image</div>
        )}
        {place && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-black/50 px-2.5 py-1 text-xs font-medium text-white backdrop-blur">
            <PinIcon width={13} height={13} /> {place}
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-serif text-lg font-bold leading-snug text-slate-900 line-clamp-1">
          {story.title}
        </h3>
        <p className="mt-1 text-sm text-slate-500 line-clamp-2">
          {story.oneLiner || story.summary || story.content}
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {(story.hashtags || []).slice(0, 3).map((t) => (
            <Badge key={t}>#{t}</Badge>
          ))}
          <span className="ml-auto self-center text-xs text-slate-400">{story.createdAt}</span>
        </div>
      </div>
    </Link>
  )
}
