import { useEffect, useRef, useState } from 'react'

import {
  ChevronDown,
  Heart,
  Menu,
  Package,
  Search,
  ShoppingBag,
  User,
  X,
  LogOut,
  HelpCircle,
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
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [shopOpen, setShopOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const profileRef = useRef(null)
  const searchRef = useRef(null)
  const shopRef = useRef(null)

  /* Close dropdowns when clicking outside */

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setProfileOpen(false)
      }

      if (
        searchRef.current &&
        !searchRef.current.contains(event.target)
      ) {
        setSearchOpen(false)
      }

      if (
        shopRef.current &&
        !shopRef.current.contains(event.target)
      ) {
        setShopOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  /* Close mobile menu when screen becomes desktop */

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 768) {
        setMobileOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  function closeMenus() {
    setProfileOpen(false)
    setSearchOpen(false)
    setShopOpen(false)
    setMobileOpen(false)
  }

  function handleLogout() {
    logout()

    setProfileOpen(false)
    setMobileOpen(false)

    navigate('/')
  }

  function handleSearch(event) {
    event.preventDefault()

    const query = searchText.trim()

    if (!query) {
      navigate('/products')
      setSearchOpen(false)
      setMobileOpen(false)
      return
    }

    navigate(`/products?search=${encodeURIComponent(query)}`)

    setSearchOpen(false)
    setMobileOpen(false)
  }

  function handleCategoryClick(category) {
    navigate(`/products?category=${encodeURIComponent(category)}`)

    closeMenus()
  }

  const categories = {
    Furniture: [
      'Sofas',
      'Chairs',
      'Tables',
      'Storage',
      'Desks',
    ],

    Decor: [
      'Wall Decor',
      'Table Decor',
      'Mirrors',
      'Plants',
    ],

    Lighting: [
      'Ceiling Lights',
      'Table Lamps',
      'Floor Lamps',
      'Decorative Lights',
    ],

    Organization: [
      'Storage Baskets',
      'Organizers',
      'Racks',
      'Shelves',
    ],

    'Kitchen & Dining': [
      'Cookware',
      'Dinnerware',
      'Storage',
      'Kitchen Accessories',
    ],
  }

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white">

      {/* Top Benefits Bar */}

      <div className="hidden bg-gray-900 px-4 py-2 text-center text-xs text-white sm:block">
        Free Shipping on qualifying orders • Shop smarter with ABC Home
      </div>


      {/* Main Navbar */}

      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Mobile Menu Button */}

        <button
          type="button"
          onClick={() => setMobileOpen((current) => !current)}
          className="mr-3 flex items-center justify-center md:hidden"
          aria-label="Open menu"
        >
          {mobileOpen ? (
            <X size={23} strokeWidth={1.8} />
          ) : (
            <Menu size={23} strokeWidth={1.8} />
          )}
        </button>


        {/* Logo */}

        <Link
          to="/"
          onClick={closeMenus}
          className="mr-auto text-2xl font-bold tracking-tight md:mr-0"
        >
          ABC<span className="font-light">Home</span>
        </Link>


        {/* Desktop Navigation */}

        <nav className="hidden items-center gap-8 md:flex">

          <Link
            to="/"
            onClick={closeMenus}
            className="text-sm font-medium transition hover:text-gray-500"
          >
            Home
          </Link>


          {/* Shop Mega Menu */}

          <div
            ref={shopRef}
            className="relative"
          >

            <button
              type="button"
              onClick={() => {
                setShopOpen((current) => !current)
                setProfileOpen(false)
                setSearchOpen(false)
              }}
              className="flex items-center gap-1.5 text-sm font-medium transition hover:text-gray-500"
            >
              Shop
              <ChevronDown
                size={15}
                className={`transition-transform ${
                  shopOpen ? 'rotate-180' : ''
                }`}
              />
            </button>


            {shopOpen && (
              <div className="absolute left-1/2 top-10 z-50 w-[760px] -translate-x-1/3 rounded-2xl border border-gray-100 bg-white p-7 shadow-xl">

                <div className="grid grid-cols-5 gap-7">

                  {Object.entries(categories).map(
                    ([category, items]) => (
                      <div key={category}>

                        <button
                          type="button"
                          onClick={() =>
                            handleCategoryClick(category)
                          }
                          className="text-left text-sm font-semibold transition hover:text-gray-500"
                        >
                          {category}
                        </button>

                        <div className="mt-4 space-y-3">

                          {items.map((item) => (
                            <button
                              key={item}
                              type="button"
                              onClick={() =>
                                handleCategoryClick(item)
                              }
                              className="block text-left text-sm text-gray-500 transition hover:text-gray-900"
                            >
                              {item}
                            </button>
                          ))}

                        </div>

                      </div>
                    )
                  )}

                </div>


                {/* Mega Menu Bottom Links */}

                <div className="mt-7 flex items-center justify-between border-t border-gray-100 pt-5">

                  <div className="flex gap-6">

                    <Link
                      to="/products?filter=best-sellers"
                      onClick={closeMenus}
                      className="text-sm font-medium hover:text-gray-500"
                    >
                      Best Sellers
                    </Link>

                    <Link
                      to="/products?filter=new-arrivals"
                      onClick={closeMenus}
                      className="text-sm font-medium hover:text-gray-500"
                    >
                      New Arrivals
                    </Link>

                  </div>


                  <Link
                    to="/products"
                    onClick={closeMenus}
                    className="rounded-full bg-gray-900 px-5 py-2.5 text-xs font-medium text-white transition hover:bg-gray-700"
                  >
                    View All Products
                  </Link>

                </div>

              </div>
            )}

          </div>


          <Link
            to="/products?filter=best-sellers"
            onClick={closeMenus}
            className="text-sm font-medium transition hover:text-gray-500"
          >
            Best Sellers
          </Link>


          <Link
            to="/about"
            onClick={closeMenus}
            className="text-sm font-medium transition hover:text-gray-500"
          >
            About
          </Link>

        </nav>


        {/* Right Actions */}

        <div className="ml-5 flex items-center gap-4">


          {/* Search */}

          <div
            ref={searchRef}
            className="relative"
          >

            <button
              type="button"
              onClick={() => {
                setSearchOpen((current) => !current)
                setProfileOpen(false)
                setShopOpen(false)
              }}
              className="flex items-center justify-center"
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
                className="absolute right-0 top-10 z-50 flex w-[300px] items-center gap-2 rounded-2xl border border-gray-100 bg-white p-2 shadow-xl"
              >

                <Search
                  size={17}
                  className="ml-2 shrink-0 text-gray-400"
                />

                <input
                  autoFocus
                  type="search"
                  value={searchText}
                  onChange={(event) =>
                    setSearchText(event.target.value)
                  }
                  placeholder="Search products, categories..."
                  className="min-w-0 flex-1 px-2 py-2 text-sm outline-none"
                />

                <button
                  type="submit"
                  className="rounded-xl bg-gray-900 px-3 py-2 text-xs font-medium text-white transition hover:bg-gray-700"
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
              onClick={() => {
                setProfileOpen((current) => !current)
                setSearchOpen(false)
                setShopOpen(false)
              }}
              className="flex items-center justify-center"
              aria-label="Account"
            >
              <User
                size={20}
                strokeWidth={1.8}
              />
            </button>


            {profileOpen && (
              <div className="absolute right-0 top-10 z-50 w-64 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl">

                {/* Account Header */}

                {user ? (
                  <div className="border-b border-gray-100 px-5 py-4">

                    <p className="text-sm font-semibold">
                      Hi, {user.name}
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

                      {/* My Account */}

                      <Link
                        to="/account"
                        onClick={closeMenus}
                        className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition hover:bg-gray-50"
                      >
                        <User size={17} />
                        My Account
                      </Link>


                      {/* My Orders */}

                      <Link
                        to="/my-orders"
                        onClick={closeMenus}
                        className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition hover:bg-gray-50"
                      >
                        <Package size={17} />
                        My Orders
                      </Link>


                      {/* Wishlist */}

                      <Link
                        to="/wishlist"
                        onClick={closeMenus}
                        className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition hover:bg-gray-50"
                      >
                        <Heart size={17} />

                        Wishlist

                        {wishlistCount > 0 && (
                          <span className="ml-auto text-xs text-gray-500">
                            {wishlistCount}
                          </span>
                        )}
                      </Link>


                      {/* Help */}

                      <Link
                        to="/account"
                        onClick={closeMenus}
                        className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition hover:bg-gray-50"
                      >
                        <HelpCircle size={17} />
                        Help & Support
                      </Link>


                      {/* Logout */}

                      <div className="my-1 border-t border-gray-100" />

                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm transition hover:bg-gray-50"
                      >
                        <LogOut size={17} />
                        Logout
                      </button>

                    </>
                  ) : (
                    <>

                      {/* Login */}

                      <Link
                        to="/login"
                        onClick={closeMenus}
                        className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition hover:bg-gray-50"
                      >
                        <User size={17} />
                        Sign In
                      </Link>


                      {/* Create Account */}

                      <Link
                        to="/register"
                        onClick={closeMenus}
                        className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition hover:bg-gray-50"
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
            onClick={closeMenus}
            className="relative hidden sm:block"
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
            onClick={closeMenus}
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


      {/* Mobile Navigation */}

      {mobileOpen && (
        <div className="border-t border-gray-100 bg-white md:hidden">

          <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6">

            {/* Mobile Search */}

            <form
              onSubmit={handleSearch}
              className="mb-5 flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2"
            >

              <Search
                size={18}
                className="shrink-0 text-gray-400"
              />

              <input
                type="search"
                value={searchText}
                onChange={(event) =>
                  setSearchText(event.target.value)
                }
                placeholder="Search products..."
                className="min-w-0 flex-1 text-sm outline-none"
              />

              <button
                type="submit"
                className="rounded-lg bg-gray-900 px-3 py-2 text-xs font-medium text-white"
              >
                Search
              </button>

            </form>


            {/* Main Mobile Links */}

            <div className="space-y-1">

              <Link
                to="/"
                onClick={closeMenus}
                className="block rounded-xl px-3 py-3 text-sm font-medium hover:bg-gray-50"
              >
                Home
              </Link>


              <Link
                to="/products"
                onClick={closeMenus}
                className="block rounded-xl px-3 py-3 text-sm font-medium hover:bg-gray-50"
              >
                Shop All
              </Link>


              <Link
                to="/products?filter=best-sellers"
                onClick={closeMenus}
                className="block rounded-xl px-3 py-3 text-sm font-medium hover:bg-gray-50"
              >
                Best Sellers
              </Link>


              <Link
                to="/products?filter=new-arrivals"
                onClick={closeMenus}
                className="block rounded-xl px-3 py-3 text-sm font-medium hover:bg-gray-50"
              >
                New Arrivals
              </Link>


              <Link
                to="/about"
                onClick={closeMenus}
                className="block rounded-xl px-3 py-3 text-sm font-medium hover:bg-gray-50"
              >
                About
              </Link>

            </div>


            {/* Mobile Categories */}

            <div className="mt-5 border-t border-gray-100 pt-5">

              <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">
                Shop by Category
              </p>

              <div className="grid grid-cols-2 gap-1">

                {Object.keys(categories).map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() =>
                      handleCategoryClick(category)
                    }
                    className="rounded-xl px-3 py-3 text-left text-sm text-gray-600 transition hover:bg-gray-50 hover:text-gray-900"
                  >
                    {category}
                  </button>
                ))}

              </div>

            </div>


            {/* Mobile Account Links */}

            <div className="mt-5 border-t border-gray-100 pt-5">

              {user ? (
                <>
                  <Link
                    to="/account"
                    onClick={closeMenus}
                    className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm hover:bg-gray-50"
                  >
                    <User size={17} />
                    My Account
                  </Link>

                  <Link
                    to="/my-orders"
                    onClick={closeMenus}
                    className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm hover:bg-gray-50"
                  >
                    <Package size={17} />
                    My Orders
                  </Link>

                  <Link
                    to="/wishlist"
                    onClick={closeMenus}
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
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm hover:bg-gray-50"
                  >
                    <LogOut size={17} />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={closeMenus}
                    className="block rounded-xl px-3 py-3 text-sm font-medium hover:bg-gray-50"
                  >
                    Sign In
                  </Link>

                  <Link
                    to="/register"
                    onClick={closeMenus}
                    className="block rounded-xl px-3 py-3 text-sm font-medium hover:bg-gray-50"
                  >
                    Create Account
                  </Link>
                </>
              )}

            </div>

          </div>

        </div>
      )}

    </header>
  )
}

export default Navbar