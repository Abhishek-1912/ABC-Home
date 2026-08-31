
import { useEffect } from 'react'
import {
  LogOut,
  Package,
  User,
} from 'lucide-react'

import { Link, useNavigate } from 'react-router-dom'

import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useAuth } from '../context/AuthContext'

function AccountPage() {
  const navigate = useNavigate()

  const { user, logout } = useAuth()

  useEffect(() => {
    if (!user) {
      navigate('/login')
    }
  }, [user, navigate])

  if (!user) {
    return null
  }

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">

      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">

        {/* Header */}

        <div className="max-w-3xl">

          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-400">
            My account
          </p>

          <h1 className="mt-3 text-4xl font-semibold tracking-tight">
            Welcome, {user.name}
          </h1>

          <p className="mt-3 text-gray-500">
            Manage your ABC Home account.
          </p>

        </div>

        {/* Account options */}

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

          {/* Profile */}

          <div className="rounded-2xl border border-gray-100 p-6">

            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-100">
              <User size={20} />
            </div>

            <h2 className="mt-5 font-semibold">
              Profile
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              {user.email}
            </p>

          </div>

          {/* My Orders */}

          <Link
            to="/orders"
            className="block rounded-2xl border border-gray-100 p-6 text-left transition hover:bg-gray-50"
          >

            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-100">
              <Package size={20} />
            </div>

            <h2 className="mt-5 font-semibold">
              My Orders
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              View your orders and order details.
            </p>

          </Link>

          {/* Logout */}

          <button
            type="button"
            onClick={handleLogout}
            className="rounded-2xl border border-gray-100 p-6 text-left transition hover:bg-gray-50"
          >

            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-100">
              <LogOut size={20} />
            </div>

            <h2 className="mt-5 font-semibold">
              Logout
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Sign out of your account.
            </p>

          </button>

        </div>

      </main>

      <Footer />

    </div>
  )
}

export default AccountPage
