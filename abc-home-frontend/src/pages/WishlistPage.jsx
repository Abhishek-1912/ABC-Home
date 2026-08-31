
import {
  ArrowRight,
  Heart,
  ShoppingBag,
  Trash2,
} from 'lucide-react'

import { Link } from 'react-router-dom'

import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

import {
  useWishlist,
} from '../context/WishlistContext'

import {
  useCart,
} from '../context/CartContext'

function WishlistPage() {
  const {
    wishlistItems,
    removeFromWishlist,
  } = useWishlist()

  const {
    addToCart,
  } = useCart()

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-white text-gray-900">

        <Navbar />

        <main className="mx-auto max-w-7xl px-4 py-24 text-center sm:px-6 lg:px-8">

          <div className="mx-auto max-w-md">

            <Heart
              size={48}
              strokeWidth={1.4}
              className="mx-auto text-gray-300"
            />

            <h1 className="mt-6 text-3xl font-semibold">
              Your wishlist is empty
            </h1>

            <p className="mt-3 text-gray-500">
              Save products you love and find them here
              later.
            </p>

            <Link
              to="/products"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-gray-900 px-7 py-3.5 text-sm font-medium text-white transition hover:bg-gray-700"
            >
              Explore Products
              <ArrowRight size={17} />
            </Link>

          </div>

        </main>

        <Footer />

      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">

      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">

        <div className="mb-10">

          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-400">
            Saved for later
          </p>

          <h1 className="mt-3 text-4xl font-semibold tracking-tight">
            My Wishlist
          </h1>

          <p className="mt-2 text-gray-500">
            {wishlistItems.length}{' '}
            {wishlistItems.length === 1
              ? 'product'
              : 'products'}{' '}
            saved
          </p>

        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

          {wishlistItems.map((product) => (

            <div
              key={product.id}
              className="group"
            >

              <div className="relative overflow-hidden rounded-2xl bg-gray-100">

                <Link
                  to={`/products/${product.slug}`}
                >
                  <div className="aspect-square overflow-hidden">

                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />

                  </div>
                </Link>

                <button
                  onClick={() =>
                    removeFromWishlist(product.id)
                  }
                  className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm"
                  aria-label="Remove from wishlist"
                >
                  <Trash2 size={17} />
                </button>

              </div>

              <div className="pt-4">

                <p className="text-xs uppercase tracking-wider text-gray-400">
                  {product.category}
                </p>

                <Link
                  to={`/products/${product.slug}`}
                >
                  <h2 className="mt-1 font-medium hover:underline">
                    {product.name}
                  </h2>
                </Link>

                <div className="mt-2 flex items-center justify-between">

                  <span className="font-semibold">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>

                  <button
                    onClick={() => addToCart(product)}
                    className="flex items-center gap-2 rounded-full border border-gray-200 px-4 py-2 text-xs font-medium transition hover:bg-gray-900 hover:text-white"
                  >
                    <ShoppingBag size={14} />
                    Add
                  </button>

                </div>

              </div>

            </div>

          ))}

        </div>

      </main>

      <Footer />

    </div>
  )
}

export default WishlistPage
