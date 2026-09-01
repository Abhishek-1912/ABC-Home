import { createContext, useContext, useEffect, useState } from 'react'
import { loginUser, registerUser } from '../api/auth'
import { setToken, clearToken, getToken } from '../api/client'

const AuthContext = createContext()

function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('abc-home-user')
    return savedUser ? JSON.parse(savedUser) : null
  })

  useEffect(() => {
    if (user) {
      localStorage.setItem('abc-home-user', JSON.stringify(user))
    } else {
      localStorage.removeItem('abc-home-user')
    }
  }, [user])

  async function login(email, password) {
    try {
      const data = await loginUser({ email, password })

      setToken(data.token)

      const loggedInUser = {
        id: data.userId,
        name: data.fullName,
        email: data.email,
        role: data.role,
      }

      setUser(loggedInUser)

      return { success: true, user: loggedInUser }
    } catch (err) {
      return { success: false, message: err.message }
    }
  }

  async function register(name, email, password) {
    try {
      const data = await registerUser({ name, email, password })

      setToken(data.token)

      const loggedInUser = {
        id: data.userId,
        name: data.fullName,
        email: data.email,
        role: data.role,
      }

      setUser(loggedInUser)

      return { success: true, user: loggedInUser }
    } catch (err) {
      return { success: false, message: err.message }
    }
  }

  function logout() {
    setUser(null)
    clearToken()
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isAuthenticated: Boolean(user) && Boolean(getToken()),
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}

export default AuthProvider