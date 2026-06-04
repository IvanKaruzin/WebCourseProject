import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

function parseError(err) {
  const data = err.response?.data
  if (!data) return 'Произошла ошибка. Попробуйте ещё раз.'
  if (data.detail) return data.detail
  return Object.values(data).flat().join(' ')
}

export default function RegisterPage() {
  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const set = field => e => setForm(f => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await register(form)
      navigate('/profile')
    } catch (err) {
      setError(parseError(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1><span style={{ color: 'var(--accent)' }}>★</span> PosterFall</h1>
        <p className="auth-subtitle">Создайте аккаунт, чтобы сохранять избранное и оставлять отзывы</p>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Логин</label>
            <input className="form-input" type="text" value={form.username}
              onChange={set('username')} placeholder="Придумайте логин" required />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="form-input" type="email" value={form.email}
              onChange={set('email')} placeholder="Ваш email (необязательно)" />
          </div>
          <div className="form-group">
            <label className="form-label">Пароль</label>
            <input className="form-input" type="password" value={form.password}
              onChange={set('password')} placeholder="Минимум 8 символов" required minLength={8} />
          </div>
          <button type="submit" className="btn btn-primary btn-lg form-submit" disabled={loading}>
            {loading ? 'Регистрация...' : 'Зарегистрироваться'}
          </button>
        </form>
        <p className="auth-switch">
          Уже есть аккаунт? <Link to="/login">Войти</Link>
        </p>
      </div>
    </div>
  )
}
