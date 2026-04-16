import { API_BASE, API_KEY } from '../constants'

function buildUrl(params) {
  const url = new URL(API_BASE)
  url.searchParams.set('apikey', API_KEY)

  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      url.searchParams.set(key, value)
    }
  })

  return url
}

export async function searchMovies({ query, type = '', year = '' }) {
  const response = await fetch(buildUrl({ s: query || 'interstellar', type, y: year }))
  const data = await response.json()

  if (data.Response === 'False') {
    return []
  }

  return Array.from(new Map((data.Search || []).map((movie) => [movie.imdbID, movie])).values())
}

export async function fetchMovieById(id) {
  const response = await fetch(buildUrl({ i: id, plot: 'full' }))
  const data = await response.json()

  if (data.Response === 'False') {
    throw new Error(data.Error || 'Movie not found')
  }

  return data
}
