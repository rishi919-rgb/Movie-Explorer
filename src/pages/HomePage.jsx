import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import MovieCard from '../components/MovieCard'
import { CURATED_COLLECTIONS } from '../constants'
import { searchMovies } from '../utils/omdb'

function HomePage({
  library,
  librarySummary,
  onRegisterSearch,
  onToggleFavorite,
  onToggleWatchlist,
  recentSearches,
}) {
  const [searchTerm, setSearchTerm] = useState('interstellar')
  const [query, setQuery] = useState('interstellar')
  const [typeFilter, setTypeFilter] = useState('')
  const [yearFilter, setYearFilter] = useState('')
  const [sortBy, setSortBy] = useState('relevance')
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [collections, setCollections] = useState({})

  useEffect(() => {
    let active = true

    async function fetchResults() {
      setLoading(true)
      setError('')

      try {
        const results = await searchMovies({
          query,
          type: typeFilter,
          year: yearFilter,
        })

        if (!active) return
        setMovies(results)
        if (!results.length) {
          setError('No titles matched that search. Try another keyword, type, or year.')
        }
      } catch {
        if (active) {
          setMovies([])
          setError('Movie search failed. Check the connection and try again.')
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    fetchResults()
    return () => {
      active = false
    }
  }, [query, typeFilter, yearFilter])

  useEffect(() => {
    let active = true

    async function fetchCollections() {
      try {
        const results = await Promise.all(
          CURATED_COLLECTIONS.map(async (collection) => {
            const items = await searchMovies({ query: collection.query })
            return [collection.key, items.slice(0, 5)]
          }),
        )

        if (active) {
          setCollections(Object.fromEntries(results))
        }
      } catch {
        if (active) {
          setCollections({})
        }
      }
    }

    fetchCollections()
    return () => {
      active = false
    }
  }, [])

  const sortedMovies = useMemo(() => {
    const next = [...movies]

    if (sortBy === 'year-desc') {
      next.sort((a, b) => Number(b.Year) - Number(a.Year))
    } else if (sortBy === 'year-asc') {
      next.sort((a, b) => Number(a.Year) - Number(b.Year))
    } else if (sortBy === 'title') {
      next.sort((a, b) => a.Title.localeCompare(b.Title))
    }

    return next
  }, [movies, sortBy])

  const spotlightMovie = sortedMovies[0]

  const submitSearch = (term = searchTerm) => {
    const nextQuery = term.trim() || 'interstellar'
    setQuery(nextQuery)
    setSearchTerm(nextQuery)
    onRegisterSearch(nextQuery)
  }

  return (
    <main className="page-shell">
      <section className="hero-panel">
        <div className="hero-copy">
          <p className="eyebrow">Your upgraded movie command center</p>
          <h1>Discover, track, rate, and build a personal cinema vault.</h1>
          <p className="hero-text">
            Search the OMDb universe, save favorites, create a watchlist, mark watched titles,
            and keep personal notes so your library feels alive instead of static.
          </p>

          <div className="hero-search">
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') submitSearch()
              }}
              placeholder="Search for a movie, series, or franchise"
            />
            <button className="btn primary-btn" onClick={() => submitSearch()}>
              Launch Search
            </button>
          </div>

          <div className="filter-row">
            <select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)}>
              <option value="">All Formats</option>
              <option value="movie">Movies</option>
              <option value="series">Series</option>
              <option value="episode">Episodes</option>
            </select>
            <input
              type="number"
              min="1900"
              max="2099"
              placeholder="Year"
              value={yearFilter}
              onChange={(event) => setYearFilter(event.target.value.slice(0, 4))}
            />
            <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
              <option value="relevance">Sort by Relevance</option>
              <option value="year-desc">Newest First</option>
              <option value="year-asc">Oldest First</option>
              <option value="title">Title A-Z</option>
            </select>
          </div>

          <div className="chip-row">
            {['batman', 'dune', 'avatar', 'mission impossible', 'ghibli'].map((term) => (
              <button key={term} className="chip-button" onClick={() => submitSearch(term)}>
                {term}
              </button>
            ))}
          </div>

          {recentSearches.length ? (
            <div className="history-block">
              <p>Recent searches</p>
              <div className="chip-row">
                {recentSearches.map((term) => (
                  <button key={term} className="chip-button muted" onClick={() => submitSearch(term)}>
                    {term}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        <div className="hero-stats-grid">
          <article className="stat-card warm">
            <span>Tracked titles</span>
            <strong>{librarySummary.totalTracked}</strong>
          </article>
          <article className="stat-card cool">
            <span>Favorites</span>
            <strong>{librarySummary.favorites}</strong>
          </article>
          <article className="stat-card sunset">
            <span>Watchlist</span>
            <strong>{librarySummary.watchlist}</strong>
          </article>
          <article className="stat-card forest">
            <span>Watched</span>
            <strong>{librarySummary.watched}</strong>
          </article>
          <Link to="/favorites" className="vault-card">
            <span>Open your vault</span>
            <strong>Ratings, notes, filters, status tracking</strong>
          </Link>
        </div>
      </section>

      {spotlightMovie ? (
        <section className="spotlight-panel">
          <div>
            <p className="eyebrow">Spotlight result</p>
            <h2>{spotlightMovie.Title}</h2>
            <p>
              Your current search surfaced this first. Jump in fast, or refine with filters to
              tune the stack.
            </p>
          </div>
          <div className="spotlight-actions">
            <Link to={`/movie/${spotlightMovie.imdbID}`} className="btn primary-btn link-btn">
              Explore Title
            </Link>
            <button className="btn ghost-btn" onClick={() => onToggleFavorite(spotlightMovie.imdbID)}>
              {library[spotlightMovie.imdbID]?.favorite ? 'Favorited' : 'Add Favorite'}
            </button>
            <button className="btn subtle-btn" onClick={() => onToggleWatchlist(spotlightMovie.imdbID)}>
              {library[spotlightMovie.imdbID]?.watchlist ? 'In Watchlist' : 'Add Watchlist'}
            </button>
          </div>
        </section>
      ) : null}

      <section className="section-block">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Search results</p>
            <h2>Now browsing: {query}</h2>
          </div>
          {loading ? (
            <p className="status-copy">Loading titles...</p>
          ) : (
            <p className="status-copy">{sortedMovies.length} results</p>
          )}
        </div>

        {error ? <div className="message-card error-card">{error}</div> : null}

        <div className="movie-grid">
          {sortedMovies.map((movie) => (
            <MovieCard
              key={movie.imdbID}
              movie={movie}
              entry={library[movie.imdbID]}
              onToggleFavorite={onToggleFavorite}
              onToggleWatchlist={onToggleWatchlist}
            />
          ))}
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Curated discovery</p>
            <h2>Fast lanes when you do not want to think</h2>
          </div>
        </div>

        <div className="collection-grid">
          {CURATED_COLLECTIONS.map((collection) => (
            <article key={collection.key} className={`collection-card accent-${collection.accent}`}>
              <div className="collection-head">
                <div>
                  <h3>{collection.title}</h3>
                  <p>{collection.description}</p>
                </div>
                <button className="btn ghost-btn" onClick={() => submitSearch(collection.query)}>
                  Open Collection
                </button>
              </div>

              <div className="collection-strip">
                {(collections[collection.key] || []).map((movie) => (
                  <MovieCard
                    key={movie.imdbID}
                    movie={movie}
                    entry={library[movie.imdbID]}
                    onToggleFavorite={onToggleFavorite}
                    onToggleWatchlist={onToggleWatchlist}
                    compact
                  />
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}

export default HomePage
