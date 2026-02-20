import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { API_BASE, API_KEY } from '../constants'

function MovieDetailsPage({ onAddFavorite }) {
  const { id } = useParams()
  const [movie, setMovie] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    async function fetchMovie() {
      setLoading(true)
      setError('')

      const url = new URL(API_BASE)
      url.searchParams.set('apikey', API_KEY)
      url.searchParams.set('i', id)

      try {
        const response = await fetch(url, { signal: controller.signal })
        const data = await response.json()

        if (data.Response === 'False') {
          setMovie(null)
          setError(data.Error || 'Movie not found.')
        } else {
          setMovie(data)
        }
      } catch {
        setError('Failed to fetch movie details.')
      } finally {
        setLoading(false)
      }
    }

    fetchMovie()
    return () => controller.abort()
  }, [id])

  if (loading) return <p className="page">Loading...</p>
  if (error) return <p className="page">{error}</p>
  if (!movie) return null

  return (
    <div className="page details-page">
      <img
        src={movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/250x360?text=No+Image'}
        alt={movie.Title}
      />
      <div>
        <h2>{movie.Title}</h2>
        <p>
          <strong>Year:</strong> {movie.Year}
        </p>
        <p>
          <strong>Genre:</strong> {movie.Genre}
        </p>
        <p>
          <strong>Plot:</strong> {movie.Plot}
        </p>
        <p>
          <strong>Rating:</strong> {movie.imdbRating}
        </p>
        <button className="btn" onClick={() => onAddFavorite(movie.imdbID)}>
          Add to Favorites
        </button>
      </div>
    </div>
  )
}

export default MovieDetailsPage
