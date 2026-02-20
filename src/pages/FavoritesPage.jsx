import { useEffect, useState } from 'react'
import MovieCard from '../components/MovieCard'
import { API_BASE, API_KEY } from '../constants'

function FavoritesPage({ favoriteIds, onAddFavorite, onRemoveFavorite }) {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let mounted = true

    async function fetchFavorites() {
      if (!favoriteIds.length) {
        setMovies([])
        return
      }

      setLoading(true)
      const results = await Promise.all(
        favoriteIds.map(async (id) => {
          const url = new URL(API_BASE)
          url.searchParams.set('apikey', API_KEY)
          url.searchParams.set('i', id)

          try {
            const response = await fetch(url)
            const data = await response.json()
            return data.Response === 'False' ? null : data
          } catch {
            return null
          }
        }),
      )

      if (mounted) {
        setMovies(results.filter(Boolean))
        setLoading(false)
      }
    }

    fetchFavorites()
    return () => {
      mounted = false
    }
  }, [favoriteIds])

  if (!favoriteIds.length) {
    return <p className="page">No favorite movies added.</p>
  }

  return (
    <div className="page">
      <h2>Favorite Movies</h2>
      {loading ? <p>Loading...</p> : null}
      <div className="movie-grid">
        {movies.map((movie) => (
          <MovieCard
            key={movie.imdbID}
            movie={movie}
            onAddFavorite={onAddFavorite}
            removeButton={
              <button className="btn danger-btn" onClick={() => onRemoveFavorite(movie.imdbID)}>
                Remove
              </button>
            }
          />
        ))}
      </div>
    </div>
  )
}

export default FavoritesPage
