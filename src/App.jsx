import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar'
import AboutPage from './pages/AboutPage'
import FavoritesPage from './pages/FavoritesPage'
import HomePage from './pages/HomePage'
import MovieDetailsPage from './pages/MovieDetailsPage'
import { readFavoriteIds, writeFavoriteIds } from './utils/favorites'

function App() {
  const [favoriteIds, setFavoriteIds] = useState(() => readFavoriteIds())

  const handleAddFavorite = (id) => {
    setFavoriteIds((prev) => {
      if (prev.includes(id)) return prev
      const updated = [...prev, id]
      writeFavoriteIds(updated)
      return updated
    })
  }

  const handleRemoveFavorite = (id) => {
    setFavoriteIds((prev) => {
      const updated = prev.filter((favId) => favId !== id)
      writeFavoriteIds(updated)
      return updated
    })
  }

  return (
    <div className="app">
      <Navbar favoriteCount={favoriteIds.length} />
      <Routes>
        <Route path="/" element={<HomePage onAddFavorite={handleAddFavorite} />} />
        <Route path="/movie/:id" element={<MovieDetailsPage onAddFavorite={handleAddFavorite} />} />
        <Route
          path="/favorites"
          element={
            <FavoritesPage
              favoriteIds={favoriteIds}
              onAddFavorite={handleAddFavorite}
              onRemoveFavorite={handleRemoveFavorite}
            />
          }
        />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </div>
  )
}

export default App
