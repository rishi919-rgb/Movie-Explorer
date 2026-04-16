import { LIBRARY_KEY, RECENT_SEARCHES_KEY } from '../constants'

export function createEmptyLibraryEntry() {
  return {
    favorite: false,
    watchlist: false,
    watched: false,
    rating: 0,
    note: '',
    updatedAt: null,
  }
}

function readJson(key, fallback) {
  const value = localStorage.getItem(key)
  if (!value) return fallback

  try {
    return JSON.parse(value)
  } catch {
    return fallback
  }
}

export function readLibrary() {
  const parsed = readJson(LIBRARY_KEY, {})
  return parsed && typeof parsed === 'object' ? parsed : {}
}

export function writeLibrary(value) {
  localStorage.setItem(LIBRARY_KEY, JSON.stringify(value))
}

export function readRecentSearches() {
  const parsed = readJson(RECENT_SEARCHES_KEY, [])
  return Array.isArray(parsed) ? parsed : []
}

export function writeRecentSearches(value) {
  localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(value))
}
