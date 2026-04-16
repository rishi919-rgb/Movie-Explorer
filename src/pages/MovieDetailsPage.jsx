import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import MovieCard from '../components/MovieCard'
import { FALLBACK_POSTER } from '../constants'
import { fetchMovieById, searchMovies } from '../utils/omdb'

function MovieDetailsPage({
  library,
  onToggleFavorite,
  onToggleWatchlist,
  onToggleWatched,
  onUpdateMoviePreferences,
}) {
  const { id } = useParams()
  const [movie, setMovie] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [relatedTitles, setRelatedTitles] = useState([])
  const entry = library[id]

  useEffect(() => {
    let active = true

    async function fetchMovie() {
      setLoading(true)
      setError('')

      try {
        const result = await fetchMovieById(id)
        if (!active) return
        setMovie(result)
      } catch {
        if (active) {
          setMovie(null)
          setError('Movie details could not be loaded.')
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    fetchMovie()
    return () => {
      active = false
    }
  }, [id])

  useEffect(() => {
    let active = true

    async function fetchRelated() {
      if (!movie?.Title) {
        setRelatedTitles([])
        return
      }

      const relatedQuery =
        movie.Title.split(/[\s:,-]+/).find((word) => word.length > 3) || movie.Title

      try {
        const results = await searchMovies({ query: relatedQuery })
        if (active) {
          setRelatedTitles(results.filter((item) => item.imdbID !== movie.imdbID).slice(0, 4))
        }
      } catch {
        if (active) {
          setRelatedTitles([])
        }
      }
    }

    fetchRelated()
    return () => {
      active = false
    }
  }, [movie])

  const ratings = useMemo(() => {
    if (!movie?.Ratings) return []
    return movie.Ratings
  }, [movie])

  if (loading) return <main className="page-shell"><div className="message-card">Loading cinematic intel...</div></main>
  if (error) return <main className="page-shell"><div className="message-card error-card">{error}</div></main>
  if (!movie) return null

  const poster = movie.Poster && movie.Poster !== 'N/A' ? movie.Poster : FALLBACK_POSTER

  return (
    <main className="page-shell">
      <section className="details-hero">
        <div className="details-poster-column">
          <img src={poster} alt={movie.Title} className="details-poster" />
          <div className="details-actions-stack">
            <button className={`btn primary-btn ${entry?.favorite ? 'active' : ''}`} onClick={() => onToggleFavorite(movie.imdbID)}>
              {entry?.favorite ? 'Favorited' : 'Add to Favorites'}
            </button>
            <button className={`btn ghost-btn ${entry?.watchlist ? 'active' : ''}`} onClick={() => onToggleWatchlist(movie.imdbID)}>
              {entry?.watchlist ? 'In Watchlist' : 'Save to Watchlist'}
            </button>
            <button className={`btn subtle-btn ${entry?.watched ? 'active' : ''}`} onClick={() => onToggleWatched(movie.imdbID)}>
              {entry?.watched ? 'Watched' : 'Mark as Watched'}
            </button>
          </div>
        </div>

        <div className="details-content">
          <div className="details-heading">
            <div>
              <p className="eyebrow">{movie.Type} • {movie.Year}</p>
              <h1>{movie.Title}</h1>
            </div>
            <Link to="/" className="btn ghost-btn link-btn">
              Back to Discover
            </Link>
          </div>

          <p className="details-plot">{movie.Plot}</p>

          <div className="facts-grid">
            <div className="fact-card"><span>Genre</span><strong>{movie.Genre}</strong></div>
            <div className="fact-card"><span>Runtime</span><strong>{movie.Runtime}</strong></div>
            <div className="fact-card"><span>IMDb</span><strong>{movie.imdbRating}</strong></div>
            <div className="fact-card"><span>Released</span><strong>{movie.Released}</strong></div>
            <div className="fact-card"><span>Director</span><strong>{movie.Director}</strong></div>
            <div className="fact-card"><span>Language</span><strong>{movie.Language}</strong></div>
          </div>

          <div className="details-grid">
            <article className="details-panel">
              <h2>Creative Team</h2>
              <p><strong>Writers:</strong> {movie.Writer}</p>
              <p><strong>Actors:</strong> {movie.Actors}</p>
              <p><strong>Awards:</strong> {movie.Awards}</p>
              <p><strong>Box Office:</strong> {movie.BoxOffice || 'Not available'}</p>
            </article>

            <article className="details-panel">
              <h2>Your Take</h2>
              <label className="field-label">
                Personal rating
                <select
                  value={entry?.rating || 0}
                  onChange={(event) =>
                    onUpdateMoviePreferences(movie.imdbID, { rating: Number(event.target.value) })
                  }
                >
                  <option value={0}>No rating yet</option>
                  <option value={1}>1 / 5</option>
                  <option value={2}>2 / 5</option>
                  <option value={3}>3 / 5</option>
                  <option value={4}>4 / 5</option>
                  <option value={5}>5 / 5</option>
                </select>
              </label>

              <label className="field-label">
                Personal note
                <textarea
                  rows="5"
                  placeholder="Why it worked, what to revisit, who to recommend it to..."
                  value={entry?.note || ''}
                  onChange={(event) =>
                    onUpdateMoviePreferences(movie.imdbID, { note: event.target.value })
                  }
                />
              </label>
            </article>
          </div>
        </div>
      </section>

      {ratings.length ? (
        <section className="section-block">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Scoreboard</p>
              <h2>External ratings</h2>
            </div>
          </div>
          <div className="ratings-row">
            {ratings.map((rating) => (
              <article key={rating.Source} className="rating-card">
                <span>{rating.Source}</span>
                <strong>{rating.Value}</strong>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {relatedTitles.length ? (
        <section className="section-block">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Keep the vibe going</p>
              <h2>Related picks</h2>
            </div>
          </div>
          <div className="movie-grid">
            {relatedTitles.map((relatedMovie) => (
              <MovieCard
                key={relatedMovie.imdbID}
                movie={relatedMovie}
                entry={library[relatedMovie.imdbID]}
                onToggleFavorite={onToggleFavorite}
                onToggleWatchlist={onToggleWatchlist}
              />
            ))}
          </div>
        </section>
      ) : null}
    </main>
  )
}

export default MovieDetailsPage
