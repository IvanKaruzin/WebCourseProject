import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

function parseError(err) {
  const data = err.response?.data
  if (!data) return 'Произошла ошибка. Попробуйте ещё раз.'
  if (data.detail) return data.detail
  return Object.values(data).flat().join(' ')
}

export default function LoginPage() {
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const set = field => e => setForm(f => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(form)
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
        <p className="auth-subtitle">Войдите в свой аккаунт</p>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Логин</label>
            <input className="form-input" type="text" value={form.username}
              onChange={set('username')} placeholder="Введите логин" required />
          </div>
          <div className="form-group">
            <label className="form-label">Пароль</label>
            <input className="form-input" type="password" value={form.password}
              onChange={set('password')} placeholder="Введите пароль" required />
          </div>
          <button type="submit" className="btn btn-primary btn-lg form-submit" disabled={loading}>
            {loading ? 'Вход...' : 'Войти'}
          </button>
        </form>
        <p className="auth-switch">
          Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
        </p>
      </div>
    </div>
  )
}
