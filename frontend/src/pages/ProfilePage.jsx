import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { getFavorites } from '../services/api'

export default function ProfilePage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth()
  const [favsCount, setFavsCount] = useState(null)

  useEffect(() => {
    if (!isAuthenticated) return
    getFavorites().then(res => setFavsCount(res.data.count)).catch(() => {})
  }, [isAuthenticated])

  if (authLoading) return <div className="loading-center"><div className="spinner" /></div>
  if (!isAuthenticated) return <Navigate to="/login" replace />

  const joinDate = user.date_joined
    ? new Date(user.date_joined).toLocaleDateString('ru-RU', { year: 'numeric', month: 'long' })
    : ''

  return (
    <>
      <div className="profile-header">
        <div className="container">
          <div className="profile-avatar-lg">{user.username.charAt(0).toUpperCase()}</div>
          <div className="profile-name">{user.username}</div>
          {user.email && <div className="profile-email">{user.email}</div>}
          <div className="profile-since">В системе с {joinDate}</div>
          <div className="stats-row">
            <div className="stat-item">
              <div className="stat-value">{favsCount ?? '—'}</div>
              <div className="stat-label">Избранных фильмов</div>
            </div>
          </div>
        </div>
      </div>
      <div className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Мои <span>разделы</span></h2>
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link to="/favorites" className="btn btn-primary">❤️ Избранное</Link>
            <Link to="/movies" className="btn btn-outline">🎬 Каталог фильмов</Link>
          </div>
        </div>
      </div>
    </>
  )
}
