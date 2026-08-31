
import {
  Heart,
  Search,
  ShoppingBag,
  User,
} from 'lucide-react'

import { Link } from 'react-router-dom'

import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { useAuth } from '../context/AuthContext'

function Navbar() {
  const { totalItems } = useCart()
  const { wishlistCount } = useWishlist()
  const { user } = useAuth()

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

          {/* Account */}

          <Link
            to={user ? '/account' : '/login'}
            aria-label="Account"
            className="relative"
          >
            <User
              size={20}
              strokeWidth={1.8}
            />
          </Link>

          {/* Wishlist */}

          <Link
            to="/wishlist"
            aria-label="Wishlist"
            className="relative"
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