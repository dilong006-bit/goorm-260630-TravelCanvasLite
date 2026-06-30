// shadcn 스타일의 가벼운 UI 프리미티브 (Button / Badge / Card / Spinner)
import { cn } from '../lib/cn.js'

export function Button({ as: Comp = 'button', variant = 'primary', size = 'md', className, ...props }) {
  const variants = {
    primary:
      'bg-brand-600 text-white hover:bg-brand-700 shadow-sm shadow-brand-600/20 disabled:opacity-50',
    secondary: 'bg-white text-slate-800 border border-slate-200 hover:bg-slate-50 disabled:opacity-50',
    ghost: 'text-slate-600 hover:bg-slate-100 disabled:opacity-50',
    danger: 'bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200',
  }
  const sizes = {
    sm: 'h-8 px-3 text-sm gap-1.5',
    md: 'h-10 px-4 text-sm gap-2',
    lg: 'h-12 px-6 text-base gap-2',
  }
  return (
    <Comp
      className={cn(
        'inline-flex items-center justify-center rounded-xl font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  )
}

export function Badge({ children, className }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700',
        className,
      )}
    >
      {children}
    </span>
  )
}

export function Card({ className, ...props }) {
  return (
    <div
      className={cn('rounded-2xl border border-slate-200/70 bg-white/90 shadow-sm backdrop-blur', className)}
      {...props}
    />
  )
}

export function Spinner({ className }) {
  return (
    <svg className={cn('animate-spin', className)} width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
      <path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}
