import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import MovieCard from '../components/MovieCard'
import SearchBar from '../components/SearchBar'
import { getGenres, getMovies } from '../services/api'

const SORT_OPTIONS = [
  { value: '-imdb_rating', label: 'Рейтинг ↓' },
  { value: 'imdb_rating',  label: 'Рейтинг ↑' },
  { value: '-year',        label: 'Год ↓' },
  { value: 'year',         label: 'Год ↑' },
  { value: 'title',        label: 'Название А→Я' },
  { value: '-title',       label: 'Название Я→А' },
]

export default function MoviesPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const genre    = searchParams.get('genre')    || ''
  const search   = searchParams.get('search')   || ''
  const ordering = searchParams.get('ordering') || '-imdb_rating'
  const page     = parseInt(searchParams.get('page') || '1')

  const [movies,  setMovies]  = useState([])
  const [genres,  setGenres]  = useState([])
  const [total,   setTotal]   = useState(0)
  const [loading, setLoading] = useState(true)

  const totalPages = Math.ceil(total / 24)

  const setParam = (key, value) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev)
      if (value) next.set(key, value); else next.delete(key)
      if (key !== 'page') next.delete('page')
      return next
    })
  }

  useEffect(() => {
    getGenres().then(res => setGenres(res.data)).catch(() => {})
  }, [])

  useEffect(() => {
    setLoading(true)
    const params = { ordering, page }
    if (genre)  params.genre = genre
    if (search) params.title = search
    getMovies(params)
      .then(res => { setMovies(res.data.results); setTotal(res.data.count) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [genre, search, ordering, page])

  return (
    <>
      <div className="filters-bar">
        <div className="container filters-inner">
          <SearchBar
            onSearch={v => setParam('search', v)}
            initialValue={search}
            placeholder="Поиск по названию..."
          />
          <select className="sort-select" value={ordering} onChange={e => setParam('ordering', e.target.value)}>
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
        <div className="container" style={{ paddingTop: 10 }}>
          <div className="genres-scroll">
            <button className={`genre-chip${!genre ? ' active' : ''}`} onClick={() => setParam('genre', '')}>
              Все жанры
            </button>
            {genres.map(g => (
              <button
                key={g.id}
                className={`genre-chip${genre === g.name ? ' active' : ''}`}
                onClick={() => setParam('genre', g.name)}
              >
                {g.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container section">
        {loading ? (
          <div className="loading-center"><div className="spinner" /></div>
        ) : movies.length === 0 ? (
          <div className="empty-state">
            <div className="icon">🔍</div>
            <h3>Ничего не найдено</h3>
            <p>Попробуйте другой запрос или уберите фильтры</p>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: 16, color: 'var(--text-muted)', fontSize: 14 }}>
              Найдено фильмов: <strong style={{ color: 'var(--text)' }}>{total}</strong>
            </div>
            <div className="movies-grid">
              {movies.map(m => <MovieCard key={m.id} movie={m} />)}
            </div>
            {totalPages > 1 && (
              <div className="pagination">
                <button className="btn btn-outline btn-sm" disabled={page <= 1}
                  onClick={() => setParam('page', String(page - 1))}>← Назад</button>
                <span className="pagination-info">Страница {page} из {totalPages}</span>
                <button className="btn btn-outline btn-sm" disabled={page >= totalPages}
                  onClick={() => setParam('page', String(page + 1))}>Вперёд →</button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  )
}
