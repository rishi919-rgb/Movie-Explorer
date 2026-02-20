import { useEffect, useState } from 'react'
import MovieCard from '../components/MovieCard'
import { API_BASE, API_KEY } from '../constants'

function HomePage({ onAddFavorite }) {
  const [searchTerm, setSearchTerm] = useState('batman')
  const [query, setQuery] = useState('batman')
  const [typeFilter, setTypeFilter] = useState('')
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    async function fetchMovies() {
      setLoading(true)
      setError('')

      const url = new URL(API_BASE)
      url.searchParams.set('apikey', API_KEY)
      url.searchParams.set('s', query || 'batman')
      if (typeFilter) {
        url.searchParams.set('type', typeFilter)
      }

      try {
        const response = await fetch(url, { signal: controller.signal })
        const data = await response.json()

        if (data.Response === 'False') {
          setMovies([])
          setError(data.Error || 'No movies found.')
        } else {
          const uniqueMovies = Array.from(
            new Map((data.Search || []).map((movie) => [movie.imdbID, movie])).values(),
          )
          setMovies(uniqueMovies)
        }
      } catch {
        setError('Failed to fetch movies.')
      } finally {
        setLoading(false)
      }
    }

    fetchMovies()
    return () => controller.abort()
  }, [query, typeFilter])

  return (
    <div className="page">
      <h1>Movie Explorer</h1>
      <div className="search-row">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search movie name"
        />
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
          <option value="">All Types</option>
          <option value="movie">Movie</option>
          <option value="series">Series</option>
        </select>
        <button className="btn" onClick={() => setQuery(searchTerm.trim() || 'batman')}>
          Search
        </button>
      </div>

      {loading ? <p>Loading...</p> : null}
      {error ? <p>{error}</p> : null}

      <div className="movie-grid">
        {movies.map((movie) => (
          <MovieCard key={movie.imdbID} movie={movie} onAddFavorite={onAddFavorite} />
        ))}
      </div>
    </div>
  )
}

export default HomePage
