import { useEffect, useMemo, useState } from 'react'
import MovieCard from '../components/MovieCard'
import { fetchMovieById } from '../utils/omdb'

function FavoritesPage({ library, summary, onToggleFavorite, onToggleWatchlist, onToggleWatched }) {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(false)
  const [activeFilter, setActiveFilter] = useState('all')
  const [searchValue, setSearchValue] = useState('')

  useEffect(() => {
    let active = true
    const ids = Object.keys(library)

    async function fetchLibraryMovies() {
      if (!ids.length) {
        setMovies([])
        return
      }

      setLoading(true)

      try {
        const results = await Promise.all(ids.map((id) => fetchMovieById(id).catch(() => null)))
        if (active) {
          setMovies(results.filter(Boolean))
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    fetchLibraryMovies()
    return () => {
      active = false
    }
  }, [library])

  const visibleMovies = useMemo(() => {
    return movies.filter((movie) => {
      const entry = library[movie.imdbID]
      const matchesSearch = movie.Title.toLowerCase().includes(searchValue.toLowerCase())

      if (!matchesSearch) return false
      if (activeFilter === 'favorites') return entry?.favorite
      if (activeFilter === 'watchlist') return entry?.watchlist
      if (activeFilter === 'watched') return entry?.watched
      if (activeFilter === 'rated') return Number(entry?.rating) > 0
      if (activeFilter === 'notes') return Boolean(entry?.note?.trim())
      return entry
    })
  }, [activeFilter, library, movies, searchValue])

  const filters = [
    ['all', 'Everything'],
    ['favorites', 'Favorites'],
    ['watchlist', 'Watchlist'],
    ['watched', 'Watched'],
    ['rated', 'Rated'],
    ['notes', 'With Notes'],
  ]

  return (
    <main className="page-shell">
      <section className="library-hero">
        <div>
          <p className="eyebrow">Personal vault</p>
          <h1>Your movie memory system</h1>
          <p className="hero-text">
            This is no longer just a favorites page. It is your full movie control room with
            status tracking, ratings, notes, and browsing filters.
          </p>
        </div>

        <div className="hero-stats-grid compact-stats">
          <article className="stat-card warm"><span>Favorites</span><strong>{summary.favorites}</strong></article>
          <article className="stat-card sunset"><span>Watchlist</span><strong>{summary.watchlist}</strong></article>
          <article className="stat-card forest"><span>Watched</span><strong>{summary.watched}</strong></article>
          <article className="stat-card cool"><span>Rated</span><strong>{summary.rated}</strong></article>
        </div>
      </section>

      <section className="toolbar-panel">
        <input
          type="text"
          value={searchValue}
          onChange={(event) => setSearchValue(event.target.value)}
          placeholder="Search inside your vault"
        />
        <div className="chip-row">
          {filters.map(([value, label]) => (
            <button
              key={value}
              className={`chip-button ${activeFilter === value ? 'active' : ''}`}
              onClick={() => setActiveFilter(value)}
            >
              {label}
            </button>
          ))}
        </div>
      </section>

      {loading ? <div className="message-card">Loading your saved library...</div> : null}

      {!loading && !visibleMovies.length ? (
        <div className="message-card">
          No titles match this filter yet. Start from Discover and build out your vault.
        </div>
      ) : null}

      <div className="movie-grid">
        {visibleMovies.map((movie) => (
          <MovieCard
            key={movie.imdbID}
            movie={movie}
            entry={library[movie.imdbID]}
            onToggleFavorite={onToggleFavorite}
            onToggleWatchlist={onToggleWatchlist}
            onToggleWatched={onToggleWatched}
          />
        ))}
      </div>
    </main>
  )
}

export default FavoritesPage
