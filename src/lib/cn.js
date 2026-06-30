// 가벼운 className 결합 유틸 (clsx 대체)
export function cn(...args) {
  return args
    .flat(Infinity)
    .filter((x) => typeof x === 'string' && x.trim())
    .join(' ')
    .trim()
}
