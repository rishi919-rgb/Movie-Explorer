import { FAVORITES_KEY } from '../constants'

export function readFavoriteIds() {
  const value = localStorage.getItem(FAVORITES_KEY)
  if (!value) return []

  try {
    const parsed = JSON.parse(value)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function writeFavoriteIds(ids) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(ids))
}
