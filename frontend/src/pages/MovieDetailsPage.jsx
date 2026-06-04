import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import ReviewCard from '../components/ReviewCard'
import { useAuth } from '../contexts/AuthContext'
import { addFavorite, createReview, getFavorites, getMovie, getMovieReviews, removeFavorite } from '../services/api'

export default function MovieDetailsPage() {
  const { id } = useParams()
  const { isAuthenticated } = useAuth()

  const [movie,            setMovie]            = useState(null)
  const [loading,          setLoading]          = useState(true)
  const [reviews,          setReviews]          = useState([])
  const [reviewsLoading,   setReviewsLoading]   = useState(true)
  const [favoriteId,       setFavoriteId]       = useState(null)
  const [favLoading,       setFavLoading]       = useState(false)
  const [rating,           setRating]           = useState(0)
  const [hoverRating,      setHoverRating]      = useState(0)
  const [reviewText,       setReviewText]       = useState('')
  const [reviewError,      setReviewError]      = useState('')
  const [reviewSubmitting, setReviewSubmitting] = useState(false)

  useEffect(() => {
    setLoading(true)
    getMovie(id)
      .then(res => setMovie(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))

    setReviewsLoading(true)
    getMovieReviews(id)
      .then(res => setReviews(res.data.results))
      .catch(() => {})
      .finally(() => setReviewsLoading(false))
  }, [id])

  useEffect(() => {
    if (!isAuthenticated) return
    getFavorites()
      .then(res => {
        const fav = res.data.results.find(f => f.movie_detail?.id === parseInt(id))
        if (fav) setFavoriteId(fav.id)
      })
      .catch(() => {})
  }, [isAuthenticated, id])

  const toggleFavorite = async () => {
    setFavLoading(true)
    try {
      if (favoriteId) {
        await removeFavorite(favoriteId)
        setFavoriteId(null)
      } else {
        const res = await addFavorite(parseInt(id))
        setFavoriteId(res.data.id)
      }
    } catch (_) {}
    finally { setFavLoading(false) }
  }

  const handleReviewSubmit = async e => {
    e.preventDefault()
    if (!rating) { setReviewError('Поставьте оценку'); return }
    setReviewError('')
    setReviewSubmitting(true)
    try {
      const res = await createReview({ movie: parseInt(id), rating, text: reviewText })
      setReviews(prev => [res.data, ...prev])
      setRating(0)
      setReviewText('')
    } catch (err) {
      setReviewError(Object.values(err.response?.data || {}).flat().join(' ') || 'Ошибка при отправке')
    } finally {
      setReviewSubmitting(false)
    }
  }

  const fmt = mins => {
    if (!mins) return null
    const h = Math.floor(mins / 60), m = mins % 60
    return h ? `${h}ч ${m}мин` : `${m}мин`
  }

  if (loading) return <div className="loading-center" style={{ minHeight: '60vh' }}><div className="spinner" /></div>
  if (!movie) return (
    <div className="empty-state" style={{ padding: '80px 24px' }}>
      <div className="icon">😕</div>
      <h3>Фильм не найден</h3>
      <Link to="/movies" className="btn btn-primary" style={{ marginTop: 12 }}>В каталог</Link>
    </div>
  )

  return (
    <>
      <div className="movie-detail-hero">
        <div className="container movie-detail-layout">
          {movie.poster_url
            ? <img src={movie.poster_url} alt={movie.title} className="movie-detail-poster" />
            : <div className="movie-detail-poster-placeholder">🎬</div>
          }
          <div className="movie-detail-info">
            <Link to="/movies" style={{ color: '#888', fontSize: 14, display: 'inline-flex', alignItems: 'center', gap: 4, marginBottom: 16 }}>
              ← Каталог
            </Link>
            <h1 className="movie-detail-title">{movie.title}</h1>
            <div className="movie-detail-meta">
              {movie.year && <span>{movie.year}</span>}
              {movie.certificate && <><span className="sep">·</span><span className="cert-badge">{movie.certificate}</span></>}
              {movie.runtime && <><span className="sep">·</span><span>{fmt(movie.runtime)}</span></>}
            </div>
            <div className="ratings-row">
              {movie.imdb_rating != null && (
                <div className="rating-box">
                  <div className="rating-box-label">IMDb</div>
                  <div className="rating-box-value">★ {movie.imdb_rating.toFixed(1)}</div>
                  {movie.votes && <div style={{ fontSize: 12, color: '#888' }}>{movie.votes.toLocaleString('ru-RU')} голосов</div>}
                </div>
              )}
              {movie.meta_score != null && (
                <div className="rating-box">
                  <div className="rating-box-label">Metacritic</div>
                  <div className="rating-box-value muted">{movie.meta_score}</div>
                </div>
              )}
            </div>
            {movie.overview && <p className="movie-detail-overview">{movie.overview}</p>}
            {movie.directors?.length > 0 && (
              <div className="people-row">
                <div className="people-row-label">Режиссёр{movie.directors.length > 1 ? 'ы' : ''}</div>
                <div className="people-names">{movie.directors.map(d => d.name).join(', ')}</div>
              </div>
            )}
            {movie.actors?.length > 0 && (
              <div className="people-row">
                <div className="people-row-label">В главных ролях</div>
                <div className="people-names">{movie.actors.map(a => a.name).join(', ')}</div>
              </div>
            )}
            {movie.genres?.length > 0 && (
              <div className="genre-chips-row">
                {movie.genres.map(g => (
                  <Link key={g.id} to={`/movies?genre=${encodeURIComponent(g.name)}`}
                    className="genre-chip">
                    {g.name}
                  </Link>
                ))}
              </div>
            )}
            {isAuthenticated && (
              <button
                className={`fav-btn${favoriteId ? ' active' : ''}`}
                onClick={toggleFavorite}
                disabled={favLoading}
              >
                {favoriteId ? '❤️ В избранном' : '🤍 В избранное'}
              </button>
            )}
            {!isAuthenticated && (
              <p style={{ color: '#888', fontSize: 14, marginTop: 12 }}>
                <Link to="/login" style={{ color: 'var(--accent)' }}>Войдите</Link>, чтобы добавить в избранное
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="container section">
        <div className="section-header">
          <h2 className="section-title">Отзывы <span>({reviews.length})</span></h2>
        </div>

        {isAuthenticated && (
          <form className="review-form" onSubmit={handleReviewSubmit}>
            <h3>Оставить отзыв</h3>
            <div className="rating-select-row">
              <span style={{ fontSize: 14, fontWeight: 600 }}>Оценка:</span>
              <div className="rating-stars-select">
                {Array.from({ length: 10 }, (_, i) => i + 1).map(n => (
                  <button
                    key={n} type="button"
                    className={`rating-star-btn${n <= (hoverRating || rating) ? ' active' : ''}`}
                    onClick={() => setRating(n)}
                    onMouseEnter={() => setHoverRating(n)}
                    onMouseLeave={() => setHoverRating(0)}
                    aria-label={`${n} звёзд`}
                  >★</button>
                ))}
              </div>
              {(hoverRating || rating) > 0 && (
                <span style={{ fontSize: 14, color: 'var(--text-muted)' }}>{hoverRating || rating}/10</span>
              )}
            </div>
            <textarea
              className="review-textarea"
              value={reviewText}
              onChange={e => setReviewText(e.target.value)}
              placeholder="Напишите ваш отзыв (необязательно)..."
            />
            {reviewError && <div className="form-error">{reviewError}</div>}
            <button type="submit" className="btn btn-primary" style={{ marginTop: 12 }} disabled={reviewSubmitting}>
              {reviewSubmitting ? 'Отправляю...' : 'Отправить отзыв'}
            </button>
          </form>
        )}

        {!isAuthenticated && (
          <div style={{ marginBottom: 24, padding: '14px 18px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius)', fontSize: 14, color: 'var(--text-secondary)' }}>
            <Link to="/login" style={{ color: 'var(--accent)', fontWeight: 700 }}>Войдите</Link>, чтобы оставить отзыв
          </div>
        )}

        {reviewsLoading ? (
          <div className="loading-center"><div className="spinner" /></div>
        ) : reviews.length === 0 ? (
          <div className="empty-state" style={{ padding: '32px 0' }}>
            <div className="icon">💬</div>
            <h3>Пока нет отзывов</h3>
            <p>Будьте первым!</p>
          </div>
        ) : (
          <div className="reviews-grid">
            {reviews.map(r => <ReviewCard key={r.id} review={r} />)}
          </div>
        )}
      </div>
    </>
  )
}
