import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import MovieCard from '../components/MovieCard'
import { getGenres, getMovies } from '../services/api'

export default function HomePage() {
  const [movies, setMovies] = useState([])
  const [genres, setGenres] = useState([])
  const [search, setSearch] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    getMovies({ ordering: '-imdb_rating', page: 1 })
      .then(res => setMovies(res.data.results.slice(0, 12)))
      .catch(() => {})
    getGenres()
      .then(res => setGenres(res.data))
      .catch(() => {})
  }, [])

  const handleSearch = e => {
    e.preventDefault()
    if (search.trim()) navigate(`/movies?search=${encodeURIComponent(search.trim())}`)
  }

  return (
    <>
      <section className="hero">
        <div className="container">
          <h1 className="hero-title">Откройте мир <span>кино</span></h1>
          <p className="hero-subtitle">
            1000 лучших фильмов IMDb — рейтинги, отзывы, актёры и режиссёры в одном месте.
          </p>
          <form className="hero-search" onSubmit={handleSearch}>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Найти фильм по названию..."
              aria-label="Поиск фильмов"
            />
            <button type="submit">Найти</button>
          </form>
          <Link to="/movies" className="btn btn-outline" style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.3)' }}>
            Смотреть весь каталог →
          </Link>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Лучшие <span>фильмы</span></h2>
            <Link to="/movies?ordering=-imdb_rating" className="btn btn-ghost">Все фильмы →</Link>
          </div>
          {movies.length > 0 ? (
            <div className="movies-grid">
              {movies.map(movie => <MovieCard key={movie.id} movie={movie} />)}
            </div>
          ) : (
            <div className="loading-center"><div className="spinner" /></div>
          )}
        </div>
      </section>

      {genres.length > 0 && (
        <section className="section" style={{ background: 'var(--bg-secondary)', padding: '40px 0' }}>
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Жанры</h2>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {genres.map(g => (
                <Link key={g.id} to={`/movies?genre=${encodeURIComponent(g.name)}`} className="genre-chip">
                  {g.name}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
