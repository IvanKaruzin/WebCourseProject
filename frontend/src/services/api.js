import axios from 'axios'

const api = axios.create({ baseURL: '/api' })

api.interceptors.request.use(config => {
  const token = localStorage.getItem('cinevault_token')
  if (token) config.headers.Authorization = `Token ${token}`
  return config
})

// ── Auth ──────────────────────────────────────────────
export const register = data => api.post('/auth/register/', data)
export const login    = data => api.post('/auth/login/', data)
export const logout   = ()   => api.post('/auth/logout/')
export const getMe    = ()   => api.get('/auth/me/')

// ── Movies ────────────────────────────────────────────
export const getMovies = params => api.get('/movies/', { params })
export const getMovie  = id     => api.get(`/movies/${id}/`)
export const searchMovies = title => api.get('/movies/search/', { params: { title } })

// ── Genres ────────────────────────────────────────────
export const getGenres = () => api.get('/genres/')

// ── Reviews ───────────────────────────────────────────
export const getMovieReviews = (movieId, params) =>
  api.get(`/movies/${movieId}/reviews/`, { params })
export const createReview = data   => api.post('/reviews/', data)
export const deleteReview = id     => api.delete(`/reviews/${id}/`)

// ── Favorites ─────────────────────────────────────────
export const getFavorites   = ()     => api.get('/favorites/')
export const addFavorite    = movieId => api.post('/favorites/', { movie: movieId })
export const removeFavorite = id     => api.delete(`/favorites/${id}/`)

export default api
