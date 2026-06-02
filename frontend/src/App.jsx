import { useEffect, useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import { AuthProvider } from './contexts/AuthContext'
import FavoritesPage from './pages/FavoritesPage'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import MovieDetailsPage from './pages/MovieDetailsPage'
import MoviesPage from './pages/MoviesPage'
import ProfilePage from './pages/ProfilePage'
import RegisterPage from './pages/RegisterPage'

export default function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('cinevault_theme') || 'light')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('cinevault_theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme(t => t === 'light' ? 'dark' : 'light')

  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar theme={theme} toggleTheme={toggleTheme} />
        <main style={{ minHeight: 'calc(100vh - 62px - 80px)', background: 'var(--bg)' }}>
          <Routes>
            <Route path="/"           element={<HomePage />} />
            <Route path="/movies"     element={<MoviesPage />} />
            <Route path="/movies/:id" element={<MovieDetailsPage />} />
            <Route path="/login"      element={<LoginPage />} />
            <Route path="/register"   element={<RegisterPage />} />
            <Route path="/favorites"  element={<FavoritesPage />} />
            <Route path="/profile"    element={<ProfilePage />} />
          </Routes>
        </main>
        <Footer />
      </BrowserRouter>
    </AuthProvider>
  )
}
