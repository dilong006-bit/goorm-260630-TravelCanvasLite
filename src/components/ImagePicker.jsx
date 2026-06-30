import { cn } from '../lib/cn.js'
import { CheckIcon } from './Icons.jsx'
import { useI18n } from '../i18n/I18nContext.jsx'

// AI Image Picker — Unsplash 이미지 9장 그리드, 클릭 시 대표 이미지 선택
export default function ImagePicker({ images, loading, selectedId, onSelect }) {
  const { t } = useI18n()
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="skeleton aspect-[4/3] rounded-2xl" />
        ))}
      </div>
    )
  }

  if (!images?.length) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center text-slate-500">
        {t('picker.empty')}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {images.map((img) => {
        const selected = selectedId === img.id
        return (
          <button
            key={img.id}
            type="button"
            onClick={() => onSelect(img)}
            className={cn(
              'group relative aspect-[4/3] overflow-hidden rounded-2xl ring-2 transition',
              selected ? 'ring-brand-500' : 'ring-transparent hover:ring-brand-200',
            )}
          >
            <img
              src={img.thumb}
              alt={img.alt}
              loading="lazy"
              className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            />
            <span className="absolute bottom-1.5 left-1.5 rounded-md bg-black/45 px-1.5 py-0.5 text-[10px] text-white/90">
              {img.query}
            </span>
            {selected && (
              <span className="absolute inset-0 flex items-center justify-center bg-brand-600/35">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-brand-600 shadow">
                  <CheckIcon width={20} height={20} />
                </span>
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
