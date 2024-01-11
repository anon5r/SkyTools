export function isDev(): boolean {
  return process.env.NODE_ENV === 'development'
}
export const isEqualArray = (a: Array<any>, b: Array<any>): boolean => {
  if (a.length !== b.length) return false
  for (let i = 0; i < a.length; i++) {
    if (!b.includes(a[i])) return false
  }
  return true
}
