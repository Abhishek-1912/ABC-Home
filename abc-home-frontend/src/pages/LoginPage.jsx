
import { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'

import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useAuth } from '../context/AuthContext'

function LoginPage() {
  const navigate = useNavigate()

  const { login } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleSubmit(event) {
    event.preventDefault()

    setError('')

    if (!email || !password) {
      setError('Please enter your email and password')
      return
    }

    setLoading(true)

    setTimeout(() => {
      const result = login(email, password)

      if (!result.success) {
        setError(result.message)
        setLoading(false)
        return
      }

      navigate('/account')
    }, 500)
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">

      <Navbar />

      <main className="flex min-h-[calc(100vh-160px)] items-center justify-center px-4 py-16">

        <div className="w-full max-w-md">

          <div className="text-center">

            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-400">
              Welcome back
            </p>

            <h1 className="mt-3 text-4xl font-semibold tracking-tight">
              Login to ABC Home
            </h1>

            <p className="mt-3 text-sm text-gray-500">
              Access your account, orders and wishlist.
            </p>

          </div>

          <form
            onSubmit={handleSubmit}
            className="mt-10"
          >

            {error && (
              <div className="mb-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <div>

              <label
                htmlFor="email"
                className="text-sm font-medium"
              >
                Email address
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                placeholder="you@example.com"
                className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3.5 text-sm outline-none transition focus:border-gray-500"
              />

            </div>

            <div className="mt-5">

              <div className="flex items-center justify-between">

                <label
                  htmlFor="password"
                  className="text-sm font-medium"
                >
                  Password
                </label>

                <button
                  type="button"
                  className="text-xs text-gray-400"
                >
                  Forgot password?
                </button>

              </div>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                placeholder="Enter your password"
                className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3.5 text-sm outline-none transition focus:border-gray-500"
              />

            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-7 flex w-full items-center justify-center gap-2 rounded-full bg-gray-900 px-6 py-4 text-sm font-medium text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Signing in...' : 'Sign in'}

              {!loading && (
                <ArrowRight size={17} />
              )}
            </button>

          </form>

          <p className="mt-8 text-center text-sm text-gray-500">

            Don't have an account?{' '}

            <Link
              to="/register"
              className="font-medium text-gray-900 underline underline-offset-4"
            >
              Create account
            </Link>

          </p>

        </div>

      </main>

      <Footer />

    </div>
  )
}

export default LoginPage