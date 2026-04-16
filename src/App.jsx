import { useEffect, useMemo, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar'
import AboutPage from './pages/AboutPage'
import FavoritesPage from './pages/FavoritesPage'
import HomePage from './pages/HomePage'
import MovieDetailsPage from './pages/MovieDetailsPage'
import {
  createEmptyLibraryEntry,
  readLibrary,
  readRecentSearches,
  writeLibrary,
  writeRecentSearches,
} from './utils/library'

function App() {
  const [library, setLibrary] = useState(() => readLibrary())
  const [recentSearches, setRecentSearches] = useState(() => readRecentSearches())

  useEffect(() => {
    writeLibrary(library)
  }, [library])

  useEffect(() => {
    writeRecentSearches(recentSearches)
  }, [recentSearches])

  const upsertLibraryEntry = (id, updater) => {
    setLibrary((current) => {
      const previous = current[id] || createEmptyLibraryEntry()
      const nextEntry =
        typeof updater === 'function' ? updater(previous) : { ...previous, ...updater }

      return {
        ...current,
        [id]: {
          ...previous,
          ...nextEntry,
          updatedAt: new Date().toISOString(),
        },
      }
    })
  }

  const toggleLibraryFlag = (id, flag) => {
    upsertLibraryEntry(id, (entry) => ({
      ...entry,
      [flag]: !entry[flag],
    }))
  }

  const updateMoviePreferences = (id, patch) => {
    upsertLibraryEntry(id, patch)
  }

  const registerSearch = (term) => {
    const normalized = term.trim()
    if (!normalized) return

    setRecentSearches((current) => {
      const next = [normalized, ...current.filter((item) => item.toLowerCase() !== normalized.toLowerCase())]
      return next.slice(0, 8)
    })
  }

  const librarySummary = useMemo(() => {
    const entries = Object.values(library)

    return {
      totalTracked: entries.length,
      favorites: entries.filter((entry) => entry.favorite).length,
      watchlist: entries.filter((entry) => entry.watchlist).length,
      watched: entries.filter((entry) => entry.watched).length,
      rated: entries.filter((entry) => Number(entry.rating) > 0).length,
      noted: entries.filter((entry) => entry.note.trim()).length,
    }
  }, [library])

  return (
    <div className="app-shell">
      <Navbar summary={librarySummary} />
      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              library={library}
              librarySummary={librarySummary}
              onRegisterSearch={registerSearch}
              onToggleFavorite={(id) => toggleLibraryFlag(id, 'favorite')}
              onToggleWatchlist={(id) => toggleLibraryFlag(id, 'watchlist')}
              recentSearches={recentSearches}
            />
          }
        />
        <Route
          path="/movie/:id"
          element={
            <MovieDetailsPage
              library={library}
              onToggleFavorite={(id) => toggleLibraryFlag(id, 'favorite')}
              onToggleWatchlist={(id) => toggleLibraryFlag(id, 'watchlist')}
              onToggleWatched={(id) => toggleLibraryFlag(id, 'watched')}
              onUpdateMoviePreferences={updateMoviePreferences}
            />
          }
        />
        <Route
          path="/favorites"
          element={
            <FavoritesPage
              library={library}
              summary={librarySummary}
              onToggleFavorite={(id) => toggleLibraryFlag(id, 'favorite')}
              onToggleWatchlist={(id) => toggleLibraryFlag(id, 'watchlist')}
              onToggleWatched={(id) => toggleLibraryFlag(id, 'watched')}
            />
          }
        />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </div>
  )
}

export default App
