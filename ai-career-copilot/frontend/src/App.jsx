import React, { createContext, useContext, useState, useEffect } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Analyze from './pages/Analyze'

export const AuthContext = createContext(null)

export function useAuth() {
  return useContext(AuthContext)
}

function PrivateRoute({ children }) {
  const { token } = useAuth()
  return token ? children : <Navigate to="/login" replace />
}

export default function App() {
  const [token, setToken] = useState(() => localStorage.getItem('token'))
  const [email, setEmail] = useState(() => localStorage.getItem('email'))

  const login = (tok, em) => {
    localStorage.setItem('token', tok)
    localStorage.setItem('email', em)
    setToken(tok)
    setEmail(em)
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('email')
    setToken(null)
    setEmail(null)
  }

  return (
    <AuthContext.Provider value={{ token, email, login, logout }}>
      <Routes>
        <Route path="/login" element={token ? <Navigate to="/" replace /> : <Login />} />
        <Route path="/register" element={token ? <Navigate to="/" replace /> : <Register />} />
        <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/analyze" element={<PrivateRoute><Analyze /></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthContext.Provider>
  )
}
