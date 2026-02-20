import { Link } from 'react-router-dom'

function MovieCard({ movie, onAddFavorite, showDetailsButton = true, removeButton }) {
  return (
    <div className="movie-card">
      <img
        src={movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/200x300?text=No+Image'}
        alt={movie.Title}
      />
      <h3>{movie.Title}</h3>
      <p>{movie.Year}</p>
      <div className="card-actions">
        {showDetailsButton ? (
          <Link to={`/movie/${movie.imdbID}`} className="btn link-btn">
            View Details
          </Link>
        ) : null}
        <button className="btn" onClick={() => onAddFavorite(movie.imdbID)}>
          Add to Favorites
        </button>
        {removeButton}
      </div>
    </div>
  )
}

export default MovieCard
