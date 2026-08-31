
import { Heart, ShoppingBag } from 'lucide-react'
import { Link } from 'react-router-dom'

import { useWishlist } from '../context/WishlistContext'
import { useCart } from '../context/CartContext'

function createSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function ProductCard({ product }) {
  const wishlistContext = useWishlist()
  const cartContext = useCart()

  const {
    isInWishlist,
    toggleWishlist,
  } = wishlistContext

  const {
    addToCart,
  } = cartContext

  if (!product) {
    return null
  }

  const liked = isInWishlist(product.id)

  const productSlug =
    product.slug || createSlug(product.name)

  function handleWishlist(event) {
    event.preventDefault()
    event.stopPropagation()

    toggleWishlist(product)
  }

  function handleAddToCart(event) {
    event.preventDefault()
    event.stopPropagation()

    addToCart(product, 1)
  }

  return (
    <article className="group">

      {/* Product image */}

      <div className="relative overflow-hidden rounded-2xl bg-gray-100">

        <Link to={`/products/${productSlug}`}>

          <div className="aspect-square overflow-hidden">

            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />

          </div>

        </Link>

        {/* Wishlist */}

        <button
          type="button"
          onClick={handleWishlist}
          className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm transition hover:scale-105"
          aria-label={
            liked
              ? 'Remove from wishlist'
              : 'Add to wishlist'
          }
        >
          <Heart
            size={19}
            strokeWidth={1.8}
            className={
              liked
                ? 'fill-gray-900 text-gray-900'
                : 'text-gray-900'
            }
          />
        </button>

      </div>

      {/* Product information */}

      <div className="pt-4">

        <p className="text-xs uppercase tracking-wider text-gray-400">
          {product.category}
        </p>

        <Link to={`/products/${productSlug}`}>

          <h3 className="mt-1 font-medium hover:underline">
            {product.name}
          </h3>

        </Link>

        <div className="mt-2 flex items-center justify-between">

          <div className="flex items-center gap-2">

            <span className="font-semibold">
              ₹{product.price.toLocaleString('en-IN')}
            </span>

            {product.oldPrice && (
              <span className="text-sm text-gray-400 line-through">
                ₹{product.oldPrice.toLocaleString('en-IN')}
              </span>
            )}

          </div>

          {/* Add to cart */}

          <button
            type="button"
            onClick={handleAddToCart}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 transition hover:bg-gray-900 hover:text-white"
            aria-label="Add to cart"
          >
            <ShoppingBag size={15} />

          </button>

        </div>

      </div>

    </article>
  )
}

export default ProductCard
