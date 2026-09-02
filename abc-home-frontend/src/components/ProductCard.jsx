import { useState } from 'react'
import { Heart, ShoppingBag, Check, Eye, X, Star } from 'lucide-react'
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

  const [addedToCartAnim, setAddedToCartAnim] = useState(false)
  const [showQuickView, setShowQuickView] = useState(false)
  const [modalQty, setModalQty] = useState(1)

  const { isInWishlist, toggleWishlist } = wishlistContext
  const { addToCart } = cartContext

  if (!product) {
    return null
  }

  const liked = isInWishlist(product.id)
  const productSlug = product.slug || createSlug(product.name)

  // Check inventory stock status
  const stockLevel = product.stockQuantity ?? product.stock ?? 10
  const isOutOfStock = stockLevel === 0

  // Calculate discount percentage if oldPrice exists
  const hasDiscount = product.oldPrice && product.oldPrice > product.price
  const discountPercentage = hasDiscount 
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) 
    : null

  function handleWishlist(event) {
    event.preventDefault()
    event.stopPropagation()
    toggleWishlist(product)
  }

  function handleAddToCart(event, quantity = 1) {
    event.preventDefault()
    event.stopPropagation()
    if (isOutOfStock) return

    addToCart(product, quantity)

    // Trigger temporary checkmark success feedback
    setAddedToCartAnim(true)
    setTimeout(() => {
      setAddedToCartAnim(false)
      if (showQuickView) setShowQuickView(false)
    }, 1200)
  }

  function handleOpenQuickView(event) {
    event.preventDefault()
    event.stopPropagation()
    setShowQuickView(true)
    setModalQty(1)
  }

  return (
    <>
      <article className="group relative flex flex-col">
        {/* Product image container */}
        <div className="relative overflow-hidden rounded-2xl bg-gray-100 aspect-square shadow-sm">
          <Link to={`/products/${productSlug}`} className="block h-full w-full">
            <img
              src={product.image}
              alt={product.name}
              className={`h-full w-full object-cover transition duration-700 group-hover:scale-105 ${
                isOutOfStock ? 'opacity-40 filter grayscale' : ''
              }`}
            />
          </Link>

          {/* Out of Stock Glassmorphism Overlay */}
          {isOutOfStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[2px]">
              <span className="rounded-full bg-white/90 backdrop-blur-md px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-gray-900 shadow-md">
                Out of Stock
              </span>
            </div>
          )}

          {/* Discount Badge */}
          {discountPercentage && !isOutOfStock && (
            <div className="absolute left-3 top-3 z-10 flex items-center gap-1 rounded-full bg-rose-500 px-3 py-1 text-[11px] font-bold tracking-wide text-white shadow-md">
              <span>-{discountPercentage}%</span>
            </div>
          )}

          {/* Wishlist Button */}
          <button
            type="button"
            onClick={handleWishlist}
            className="absolute right-3 top-3 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 backdrop-blur-md shadow-sm transition hover:scale-110 active:scale-95"
            aria-label={liked ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart
              size={18}
              strokeWidth={1.8}
              className={liked ? 'fill-rose-500 text-rose-500' : 'text-gray-700 hover:text-gray-900'}
            />
          </button>

          {/* Quick View Button Trigger */}
          <div className="absolute inset-x-3 bottom-3 z-10 translate-y-12 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <button
              type="button"
              onClick={handleOpenQuickView}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-white/95 backdrop-blur-md py-2.5 text-xs font-semibold text-gray-900 shadow-lg transition hover:bg-white active:scale-95"
            >
              <Eye size={14} />
              <span>Quick View</span>
            </button>
          </div>
        </div>

        {/* Product information */}
        <div className="pt-3 flex flex-col flex-grow">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
            {product.category || product.categoryName || 'General'}
          </p>

          <Link to={`/products/${productSlug}`}>
            <h3 className="mt-1 font-medium text-gray-900 line-clamp-1 hover:text-indigo-600 transition">
              {product.name}
            </h3>
          </Link>

          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-bold text-gray-900 text-base">
                ₹{product.price.toLocaleString('en-IN')}
              </span>

              {hasDiscount && (
                <span className="text-xs text-gray-400 line-through font-medium">
                  ₹{product.oldPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>

            {/* Add to cart / Success Button */}
            <button
              type="button"
              onClick={(e) => handleAddToCart(e, 1)}
              disabled={isOutOfStock}
              className={`flex h-9 w-9 items-center justify-center rounded-full transition shadow-sm ${
                isOutOfStock 
                  ? 'opacity-40 cursor-not-allowed bg-gray-100 text-gray-400' 
                  : addedToCartAnim 
                    ? 'bg-emerald-600 text-white scale-105' 
                    : 'bg-gray-900 text-white hover:bg-gray-800 hover:scale-105'
              }`}
              aria-label="Add to cart"
            >
              {addedToCartAnim ? <Check size={16} /> : <ShoppingBag size={16} />}
            </button>
          </div>
        </div>
      </article>

      {/* QUICK VIEW POPUP MODAL */}
      {showQuickView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-fadeIn">
          <div 
            className="relative w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl transition-all transform scale-100"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowQuickView(false)}
              className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Modal Image */}
              <div className="relative aspect-square bg-gray-100">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
                {discountPercentage && (
                  <span className="absolute left-4 top-4 rounded-full bg-rose-500 px-3 py-1 text-xs font-bold text-white shadow-md">
                    -{discountPercentage}% Off
                  </span>
                )}
              </div>

              {/* Modal Details Content */}
              <div className="flex flex-col justify-between p-6 md:p-8">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-widest text-indigo-600">
                    {product.category || product.categoryName || 'General'}
                  </span>
                  
                  <h2 className="mt-1 text-xl font-bold text-gray-900">
                    {product.name}
                  </h2>

                  <div className="mt-3 flex items-center gap-3">
                    <span className="text-2xl font-extrabold text-gray-900">
                      ₹{product.price.toLocaleString('en-IN')}
                    </span>
                    {hasDiscount && (
                      <span className="text-sm font-medium text-gray-400 line-through">
                        ₹{product.oldPrice.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>

                  <p className="mt-4 text-sm text-gray-600 line-clamp-3">
                    {product.description || 'Experience premium quality built with top-tier craftsmanship and style. Perfect for daily use or special occasions.'}
                  </p>
                </div>

                <div className="mt-6 space-y-4 pt-4 border-t border-gray-100">
                  {/* Quantity selector */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-500 uppercase">Quantity</span>
                    <div className="flex items-center rounded-xl border border-gray-200 bg-gray-50 p-1">
                      <button
                        onClick={() => setModalQty(Math.max(1, modalQty - 1))}
                        className="px-3 py-1 text-sm font-bold text-gray-600 hover:text-gray-900"
                      >
                        -
                      </button>
                      <span className="px-3 text-sm font-semibold text-gray-900">{modalQty}</span>
                      <button
                        onClick={() => setModalQty(modalQty + 1)}
                        className="px-3 py-1 text-sm font-bold text-gray-600 hover:text-gray-900"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={(e) => handleAddToCart(e, modalQty)}
                      disabled={isOutOfStock}
                      className={`flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white shadow-md transition ${
                        isOutOfStock 
                          ? 'bg-gray-300 cursor-not-allowed' 
                          : addedToCartAnim 
                            ? 'bg-emerald-600' 
                            : 'bg-gray-900 hover:bg-gray-800'
                      }`}
                    >
                      {addedToCartAnim ? <Check size={16} /> : <ShoppingBag size={16} />}
                      <span>{addedToCartAnim ? 'Added!' : 'Add to Cart'}</span>
                    </button>

                    <Link
                      to={`/products/${productSlug}`}
                      onClick={() => setShowQuickView(false)}
                      className="flex items-center justify-center rounded-xl border border-gray-200 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition text-center"
                    >
                      View Full Details
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ProductCard