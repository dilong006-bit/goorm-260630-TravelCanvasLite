import { cn } from '../lib/cn.js'

// 대표 이미지 + 그라데이션 오버레이 위 타이틀 영역
export default function HeroImage({ src, title, subtitle, credit, className, children }) {
  return (
    <div className={cn('relative overflow-hidden rounded-3xl bg-slate-200', className)}>
      {src ? (
        <img src={src} alt={title || 'hero'} className="h-full w-full object-cover" loading="lazy" />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-slate-400">이미지 없음</div>
      )}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-6 text-white">
        {subtitle && <p className="mb-1 text-sm font-medium text-white/80">{subtitle}</p>}
        {title && (
          <h1 className="font-serif text-3xl font-bold leading-tight drop-shadow sm:text-4xl">{title}</h1>
        )}
        {children}
      </div>
      {credit?.name && (
        <a
          href={credit.unsplash || credit.link || '#'}
          target="_blank"
          rel="noreferrer"
          className="absolute right-3 top-3 rounded-full bg-black/40 px-2.5 py-1 text-[11px] text-white/90 backdrop-blur hover:bg-black/60"
        >
          📷 {credit.name}
        </a>
      )}
    </div>
  )
}
