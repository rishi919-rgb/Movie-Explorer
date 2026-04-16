import { Link } from 'react-router-dom'
import { FALLBACK_POSTER } from '../constants'

function MovieCard({
  movie,
  entry,
  onToggleFavorite,
  onToggleWatchlist,
  onToggleWatched,
  compact = false,
}) {
  const poster = movie.Poster && movie.Poster !== 'N/A' ? movie.Poster : FALLBACK_POSTER

  return (
    <article className={`movie-card ${compact ? 'compact-card' : ''}`}>
      <div className="poster-wrap">
        <img src={poster} alt={movie.Title} />
        <div className="poster-overlay">
          <span>{movie.Type || 'Feature'}</span>
          <span>{movie.Year}</span>
        </div>
      </div>

      <div className="movie-card-body">
        <div>
          <h3>{movie.Title}</h3>
          <p className="movie-card-meta">
            {[movie.Year, movie.Runtime, movie.Genre].filter(Boolean).join(' • ')}
          </p>
        </div>

        <div className="movie-card-tags">
          {entry?.favorite ? <span>Favorite</span> : null}
          {entry?.watchlist ? <span>Watchlist</span> : null}
          {entry?.watched ? <span>Watched</span> : null}
          {Number(entry?.rating) > 0 ? <span>{entry.rating}/5 Rated</span> : null}
        </div>

        <div className="card-actions">
          <Link to={`/movie/${movie.imdbID}`} className="btn primary-btn link-btn">
            Open Details
          </Link>
          <button
            className={`btn ghost-btn ${entry?.favorite ? 'active' : ''}`}
            onClick={() => onToggleFavorite(movie.imdbID)}
          >
            {entry?.favorite ? 'In Favorites' : 'Favorite'}
          </button>
          <button
            className={`btn ghost-btn ${entry?.watchlist ? 'active' : ''}`}
            onClick={() => onToggleWatchlist(movie.imdbID)}
          >
            {entry?.watchlist ? 'Queued' : 'Watchlist'}
          </button>
          {onToggleWatched ? (
            <button
              className={`btn subtle-btn ${entry?.watched ? 'active' : ''}`}
              onClick={() => onToggleWatched(movie.imdbID)}
            >
              {entry?.watched ? 'Watched' : 'Mark Watched'}
            </button>
          ) : null}
        </div>
      </div>
    </article>
  )
}

export default MovieCard
