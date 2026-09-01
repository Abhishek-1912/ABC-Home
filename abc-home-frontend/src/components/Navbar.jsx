
import { useEffect, useRef, useState } from 'react'
import {
  Heart,
  Search,
  ShoppingBag,
  User,
  Package,
  LogOut,
} from 'lucide-react'

import { Link, useNavigate } from 'react-router-dom'

import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { useAuth } from '../context/AuthContext'

function Navbar() {
  const { totalItems } = useCart()
  const { wishlistCount } = useWishlist()
  const { user, logout } = useAuth()

  const navigate = useNavigate()

  const [profileOpen, setProfileOpen] = useState(false)

  const profileRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setProfileOpen(false)
      }
    }

    document.addEventListener(
      'mousedown',
      handleClickOutside
    )

    return () => {
      document.removeEventListener(
        'mousedown',
        handleClickOutside
      )
    }
  }, [])

  function handleLogout() {
    logout()
    setProfileOpen(false)
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white">

      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Logo */}

        <Link
          to="/"
          className="text-2xl font-bold tracking-tight"
        >
          ABC<span className="font-light">Home</span>
        </Link>


        {/* Navigation */}

        <nav className="hidden items-center gap-8 md:flex">

          <Link
            to="/"
            className="text-sm font-medium hover:text-gray-500"
          >
            Home
          </Link>

          <Link
            to="/products"
            className="text-sm font-medium hover:text-gray-500"
          >
            Shop
          </Link>

          <Link
            to="/products?filter=best-sellers"
            className="text-sm font-medium hover:text-gray-500"
          >
            Best Sellers
          </Link>

          <Link
            to="/about"
            className="text-sm font-medium hover:text-gray-500"
          >
            About
          </Link>

        </nav>


        {/* Actions */}

        <div className="flex items-center gap-4">

          {/* Search */}

          <button
            type="button"
            aria-label="Search"
          >
            <Search
              size={20}
              strokeWidth={1.8}
            />
          </button>


          {/* Profile */}

          <div
            ref={profileRef}
            className="relative"
          >

            <button
              type="button"
              onClick={() =>
                setProfileOpen(
                  (current) => !current
                )
              }
              className="relative flex items-center justify-center"
              aria-label="Account"
            >
              <User
                size={20}
                strokeWidth={1.8}
              />
            </button>


            {/* Profile Dropdown */}

            {profileOpen && (

              <div className="absolute right-0 top-10 z-50 w-64 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg">

                {/* User information */}

                {user ? (

                  <div className="border-b border-gray-100 px-5 py-4">

                    <p className="text-sm font-semibold">
                      {user.name}
                    </p>

                    <p className="mt-1 truncate text-xs text-gray-500">
                      {user.email}
                    </p>

                  </div>

                ) : (

                  <div className="border-b border-gray-100 px-5 py-4">

                    <p className="text-sm font-semibold">
                      Welcome to ABC Home
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      Login to manage your account.
                    </p>

                  </div>

                )}


                {/* Menu */}

                <div className="p-2">

                  {user ? (

                    <>

                      <Link
                        to="/account"
                        onClick={() =>
                          setProfileOpen(false)
                        }
                        className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition hover:bg-gray-50"
                      >

                        <User size={17} />

                        <span>
                          My Account
                        </span>

                      </Link>


                      <Link
                        to="/my-orders"
                        onClick={() =>
                          setProfileOpen(false)
                        }
                        className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition hover:bg-gray-50"
                      >

                        <Package size={17} />

                        <span>
                          My Orders
                        </span>

                      </Link>


                      <Link
                        to="/wishlist"
                        onClick={() =>
                          setProfileOpen(false)
                        }
                        className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition hover:bg-gray-50"
                      >

                        <Heart size={17} />

                        <span>
                          Wishlist
                        </span>

                        {wishlistCount > 0 && (

                          <span className="ml-auto text-xs text-gray-500">
                            {wishlistCount}
                          </span>

                        )}

                      </Link>


                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-gray-700 transition hover:bg-gray-50"
                      >

                        <LogOut size={17} />

                        <span>
                          Logout
                        </span>

                      </button>

                    </>

                  ) : (

                    <>

                      <Link
                        to="/login"
                        onClick={() =>
                          setProfileOpen(false)
                        }
                        className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition hover:bg-gray-50"
                      >

                        <User size={17} />

                        <span>
                          Login
                        </span>

                      </Link>


                      <Link
                        to="/register"
                        onClick={() =>
                          setProfileOpen(false)
                        }
                        className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition hover:bg-gray-50"
                      >

                        <span className="ml-1">
                          Create Account
                        </span>

                      </Link>

                    </>

                  )}

                </div>

              </div>

            )}

          </div>


          {/* Wishlist */}

          <Link
            to="/wishlist"
            className="relative"
            aria-label="Wishlist"
          >

            <Heart
              size={20}
              strokeWidth={1.8}
            />

            {wishlistCount > 0 && (

              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-gray-900 text-[10px] text-white">
                {wishlistCount}
              </span>

            )}

          </Link>


          {/* Cart */}

          <Link
            to="/cart"
            className="relative"
            aria-label="Shopping bag"
          >

            <ShoppingBag
              size={20}
              strokeWidth={1.8}
            />

            {totalItems > 0 && (

              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-gray-900 text-[10px] text-white">
                {totalItems}
              </span>

            )}

          </Link>

        </div>

      </div>

    </header>
  )
}

export default Navbar
