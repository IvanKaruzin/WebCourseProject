import { createContext, useContext, useEffect, useState } from 'react'
import { getMe, login as apiLogin, logout as apiLogout, register as apiRegister } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('cinevault_token')
    if (!token) { setLoading(false); return }
    getMe()
      .then(res => setUser(res.data))
      .catch(() => localStorage.removeItem('cinevault_token'))
      .finally(() => setLoading(false))
  }, [])

  const login = async (credentials) => {
    const res = await apiLogin(credentials)
    localStorage.setItem('cinevault_token', res.data.token)
    setUser(res.data.user)
    return res.data
  }

  const register = async (data) => {
    const res = await apiRegister(data)
    localStorage.setItem('cinevault_token', res.data.token)
    setUser(res.data.user)
    return res.data
  }

  const logout = async () => {
    try { await apiLogout() } catch (_) {}
    localStorage.removeItem('cinevault_token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
