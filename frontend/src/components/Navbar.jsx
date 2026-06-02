import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Navbar({ theme, toggleTheme }) {
  const { user, isAuthenticated, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const ref = useRef(null)

  useEffect(() => {
    const close = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])

  const handleLogout = async () => {
    await logout()
    setOpen(false)
    navigate('/')
  }

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-brand">★<span>CineVault</span></Link>
        <div className="navbar-nav">
          <NavLink to="/movies" className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>
            Фильмы
          </NavLink>
        </div>
        <div className="navbar-actions">
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label="Переключить тему"
            title={theme === 'dark' ? 'Светлая тема' : 'Тёмная тема'}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          {isAuthenticated ? (
            <div className="user-menu" ref={ref}>
              <button className="user-btn" onClick={() => setOpen(o => !o)}>
                {user.username} ▾
              </button>
              {open && (
                <div className="dropdown">
                  <Link to="/profile" className="dropdown-item" onClick={() => setOpen(false)}>
                    👤 Профиль
                  </Link>
                  <Link to="/favorites" className="dropdown-item" onClick={() => setOpen(false)}>
                    ❤️ Избранное
                  </Link>
                  <div className="dropdown-divider" />
                  <button className="dropdown-item danger" onClick={handleLogout}>
                    🚪 Выйти
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost btn-sm" style={{ color: '#cccccc' }}>Войти</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Регистрация</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
