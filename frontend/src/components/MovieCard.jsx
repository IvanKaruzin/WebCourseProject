import { useNavigate } from 'react-router-dom'

export default function MovieCard({ movie }) {
  const navigate = useNavigate()

  return (
    <div className="movie-card" onClick={() => navigate(`/movies/${movie.id}`)} role="button" tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && navigate(`/movies/${movie.id}`)}>
      {movie.poster_url
        ? <img src={movie.poster_url} alt={movie.title} className="movie-card-poster" loading="lazy" />
        : <div className="movie-card-poster-placeholder">🎬</div>
      }
      <div className="movie-card-body">
        <div className="movie-card-rating">
          <span className="star">★</span>
          {movie.imdb_rating != null ? movie.imdb_rating.toFixed(1) : '—'}
        </div>
        <div className="movie-card-title">{movie.title}</div>
        <div className="movie-card-meta">
          {movie.year}{movie.genres?.[0] ? ` · ${movie.genres[0].name}` : ''}
        </div>
      </div>
    </div>
  )
}
