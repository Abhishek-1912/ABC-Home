
import { useEffect, useRef, useState } from 'react'

import {
  Heart,
  Search,
  ShoppingBag,
  User,
  Package,
  LogOut,
} from 'lucide-react'

import {
  Link,
  useNavigate,
} from 'react-router-dom'

import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { useAuth } from '../context/AuthContext'

function Navbar() {
  const { totalItems } = useCart()
  const { wishlistCount } = useWishlist()
  const { user, logout } = useAuth()

  const navigate = useNavigate()

  const [profileOpen, setProfileOpen] =
    useState(false)

  const [searchOpen, setSearchOpen] =
    useState(false)

  const [searchText, setSearchText] =
    useState('')

  const profileRef = useRef(null)

  const searchRef = useRef(null)


  /* Close profile dropdown */

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


  /* Close search */

  useEffect(() => {

    function handleClickOutside(event) {

      if (
        searchRef.current &&
        !searchRef.current.contains(event.target)
      ) {
        setSearchOpen(false)
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


  function handleSearch(event) {

    event.preventDefault()

    const query =
      searchText.trim()

    if (!query) {
      navigate('/products')
      setSearchOpen(false)
      return
    }

    navigate(
      `/products?search=${encodeURIComponent(query)}`
    )

    setSearchOpen(false)

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


          {/* Global Search */}

          <div
            ref={searchRef}
            className="relative"
          >

            <button
              type="button"
              onClick={() =>
                setSearchOpen(
                  (current) => !current
                )
              }
              aria-label="Search products"
            >

              <Search
                size={20}
                strokeWidth={1.8}
              />

            </button>


            {searchOpen && (

              <form
                onSubmit={handleSearch}
                className="absolute right-0 top-10 z-50 flex w-72 items-center gap-2 rounded-2xl border border-gray-100 bg-white p-2 shadow-lg"
              >

                <Search
                  size={17}
                  className="ml-2 text-gray-400"
                />

                <input
                  autoFocus
                  type="search"
                  value={searchText}
                  onChange={(event) =>
                    setSearchText(
                      event.target.value
                    )
                  }
                  placeholder="Search products..."
                  className="min-w-0 flex-1 px-2 py-2 text-sm outline-none"
                />

                <button
                  type="submit"
                  className="rounded-xl bg-gray-900 px-3 py-2 text-xs font-medium text-white hover:bg-gray-700"
                >
                  Search
                </button>

              </form>

            )}

          </div>


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
              className="flex items-center justify-center"
              aria-label="Account"
            >

              <User
                size={20}
                strokeWidth={1.8}
              />

            </button>


            {profileOpen && (

              <div className="absolute right-0 top-10 z-50 w-64 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg">


                {/* User */}

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


                <div className="p-2">

                  {user ? (

                    <>

                      <Link
                        to="/account"
                        onClick={() =>
                          setProfileOpen(false)
                        }
                        className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm hover:bg-gray-50"
                      >

                        <User size={17} />

                        My Account

                      </Link>


                      <Link
                        to="/my-orders"
                        onClick={() =>
                          setProfileOpen(false)
                        }
                        className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm hover:bg-gray-50"
                      >

                        <Package size={17} />

                        My Orders

                      </Link>


                      <Link
                        to="/wishlist"
                        onClick={() =>
                          setProfileOpen(false)
                        }
                        className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm hover:bg-gray-50"
                      >

                        <Heart size={17} />

                        Wishlist

                        {wishlistCount > 0 && (

                          <span className="ml-auto text-xs text-gray-500">
                            {wishlistCount}
                          </span>

                        )}

                      </Link>


                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm hover:bg-gray-50"
                      >

                        <LogOut size={17} />

                        Logout

                      </button>

                    </>

                  ) : (

                    <>

                      <Link
                        to="/login"
                        onClick={() =>
                          setProfileOpen(false)
                        }
                        className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm hover:bg-gray-50"
                      >

                        <User size={17} />

                        Login

                      </Link>


                      <Link
                        to="/register"
                        onClick={() =>
                          setProfileOpen(false)
                        }
                        className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm hover:bg-gray-50"
                      >

                        Create Account

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
