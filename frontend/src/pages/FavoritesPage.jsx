import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import MovieCard from '../components/MovieCard'
import { useAuth } from '../contexts/AuthContext'
import { getFavorites, removeFavorite } from '../services/api'

export default function FavoritesPage() {
  const { isAuthenticated, loading: authLoading } = useAuth()
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) return
    getFavorites()
      .then(res => setFavorites(res.data.results))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [isAuthenticated])

  const handleRemove = async favId => {
    await removeFavorite(favId)
    setFavorites(prev => prev.filter(f => f.id !== favId))
  }

  if (authLoading) return <div className="loading-center"><div className="spinner" /></div>
  if (!isAuthenticated) return <Navigate to="/login" replace />

  return (
    <div className="section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">❤️ Моё <span>избранное</span></h2>
        </div>
        {loading ? (
          <div className="loading-center"><div className="spinner" /></div>
        ) : favorites.length === 0 ? (
          <div className="empty-state">
            <div className="icon">🎬</div>
            <h3>Список пуст</h3>
            <p>Добавляйте фильмы в избранное, чтобы они появились здесь</p>
            <Link to="/movies" className="btn btn-primary" style={{ marginTop: 12 }}>Перейти к каталогу</Link>
          </div>
        ) : (
          <div className="movies-grid">
            {favorites.map(fav => (
              <div key={fav.id}>
                <MovieCard movie={fav.movie_detail} />
                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => handleRemove(fav.id)}
                  style={{ width: '100%', marginTop: 6, color: '#e53e3e', borderColor: '#e53e3e' }}
                >
                  ✕ Удалить
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
