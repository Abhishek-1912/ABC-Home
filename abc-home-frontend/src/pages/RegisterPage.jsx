
import { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'

import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useAuth } from '../context/AuthContext'

function RegisterPage() {
  const navigate = useNavigate()

  const { register } = useAuth()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] =
    useState('')

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleSubmit(event) {
    event.preventDefault()

    setError('')

    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields')
      return
    }

    if (password.length < 6) {
      setError(
        'Password must contain at least 6 characters'
      )
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)

    setTimeout(() => {
      const result = register(
        name,
        email,
        password
      )

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
              Join ABC Home
            </p>

            <h1 className="mt-3 text-4xl font-semibold tracking-tight">
              Create your account
            </h1>

            <p className="mt-3 text-sm text-gray-500">
              Create an account to manage orders and
              save your favorite products.
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
                htmlFor="name"
                className="text-sm font-medium"
              >
                Full name
              </label>

              <input
                id="name"
                type="text"
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                placeholder="Your name"
                className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3.5 text-sm outline-none transition focus:border-gray-500"
              />

            </div>

            <div className="mt-5">

              <label
                htmlFor="register-email"
                className="text-sm font-medium"
              >
                Email address
              </label>

              <input
                id="register-email"
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

              <label
                htmlFor="register-password"
                className="text-sm font-medium"
              >
                Password
              </label>

              <input
                id="register-password"
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                placeholder="Minimum 6 characters"
                className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3.5 text-sm outline-none transition focus:border-gray-500"
              />

            </div>

            <div className="mt-5">

              <label
                htmlFor="confirm-password"
                className="text-sm font-medium"
              >
                Confirm password
              </label>

              <input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(event) =>
                  setConfirmPassword(
                    event.target.value
                  )
                }
                placeholder="Confirm your password"
                className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3.5 text-sm outline-none transition focus:border-gray-500"
              />

            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-7 flex w-full items-center justify-center gap-2 rounded-full bg-gray-900 px-6 py-4 text-sm font-medium text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? 'Creating account...'
                : 'Create account'}

              {!loading && (
                <ArrowRight size={17} />
              )}
            </button>

          </form>

          <p className="mt-8 text-center text-sm text-gray-500">

            Already have an account?{' '}

            <Link
              to="/login"
              className="font-medium text-gray-900 underline underline-offset-4"
            >
              Sign in
            </Link>

          </p>

        </div>

      </main>

      <Footer />

    </div>
  )
}

export default RegisterPage
