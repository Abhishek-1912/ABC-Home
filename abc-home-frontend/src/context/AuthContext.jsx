
import { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext()

function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('abc-home-user')

    return savedUser
      ? JSON.parse(savedUser)
      : null
  })

  useEffect(() => {
    if (user) {
      localStorage.setItem(
        'abc-home-user',
        JSON.stringify(user)
      )
    } else {
      localStorage.removeItem('abc-home-user')
    }
  }, [user])

  function login(email, password) {
    // Temporary frontend authentication.
    // This will be replaced with Spring Boot API authentication.

    const savedUsers = JSON.parse(
      localStorage.getItem('abc-home-users') || '[]'
    )

    const existingUser = savedUsers.find(
      (item) =>
        item.email.toLowerCase() === email.toLowerCase() &&
        item.password === password
    )

    if (!existingUser) {
      return {
        success: false,
        message: 'Invalid email or password',
      }
    }

    const loggedInUser = {
      id: existingUser.id,
      name: existingUser.name,
      email: existingUser.email,
    }

    setUser(loggedInUser)

    return {
      success: true,
      user: loggedInUser,
    }
  }

  function register(name, email, password) {
    const savedUsers = JSON.parse(
      localStorage.getItem('abc-home-users') || '[]'
    )

    const existingUser = savedUsers.find(
      (item) =>
        item.email.toLowerCase() === email.toLowerCase()
    )

    if (existingUser) {
      return {
        success: false,
        message: 'An account with this email already exists',
      }
    }

    const newUser = {
      id: Date.now(),
      name,
      email,
      password,
    }

    localStorage.setItem(
      'abc-home-users',
      JSON.stringify([
        ...savedUsers,
        newUser,
      ])
    )

    const loggedInUser = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
    }

    setUser(loggedInUser)

    return {
      success: true,
      user: loggedInUser,
    }
  }

  function logout() {
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isAuthenticated: Boolean(user),
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
