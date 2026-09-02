import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ShoppingBag, Heart, ArrowLeft } from 'lucide-react'

import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ProductCard from '../components/ProductCard'
import { fetchProductBySlug, fetchProducts } from '../api/products'
import { adaptProductDetail, adaptProductSummary } from '../utils/adaptProduct'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'

function ProductDetailsPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const { isInWishlist, toggleWishlist } = useWishlist()

  const [product, setProduct] = useState(null)
  const [selectedVariant, setSelectedVariant] = useState(null)
  const [similarProducts, setSimilarProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')


    useEffect(() => {
    setLoading(true)
    setError('')
    setSimilarProducts([])

    fetchProductBySlug(slug)
      .then((dto) => {
        const adapted = adaptProductDetail(dto)
        setProduct(adapted)
        if (adapted.variants.length > 0) {
          setSelectedVariant(adapted.variants[0])
        }

        // Fetch similar products from the same category, excluding this one
        const categorySlug = dto.categorySlug
        if (categorySlug) {
          fetchProducts({ category: categorySlug, size: 5 })
            .then((page) => {
              const similar = page.content
                .filter((p) => p.slug !== slug)
                .slice(0, 4)
                .map(adaptProductSummary)
              setSimilarProducts(similar)
            })
            .catch(() => {}) // non-critical — fail silently, section just won't show
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-white text-gray-900">
        <Navbar />
        <main className="mx-auto max-w-7xl px-4 py-24 text-center sm:px-6 lg:px-8">
          <p className="text-gray-500">Loading...</p>
        </main>
        <Footer />
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-white text-gray-900">
        <Navbar />
        <main className="mx-auto max-w-7xl px-4 py-24 text-center sm:px-6 lg:px-8">
          <h1 className="text-2xl font-semibold">Product not found</h1>
          <p className="mt-3 text-gray-500">{error}</p>
          <Link to="/products" className="mt-8 inline-flex rounded-full bg-gray-900 px-7 py-3.5 text-sm font-medium text-white transition hover:bg-gray-700">
            Back to shop
          </Link>
        </main>
        <Footer />
      </div>
    )
  }

  const liked = isInWishlist(product.id)
  const displayPrice = product.price + (selectedVariant?.additionalPrice || 0)

  async function handleAddToCart() {
    await addToCart(
      {
        ...product,
        variantId: selectedVariant?.id,
        price: displayPrice,
      },
      1
    )
  }

  async function handleBuyNow() {
    await addToCart(
      {
        ...product,
        variantId: selectedVariant?.id,
        price: displayPrice,
      },
      1
    )
    navigate('/cart')
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <Link to="/products" className="inline-flex items-center gap-2 text-sm text-gray-500 transition hover:text-gray-900">
          <ArrowLeft size={16} />
          Back to shop
        </Link>

        <div className="mt-8 grid gap-12 lg:grid-cols-2">
          <div className="overflow-hidden rounded-2xl bg-gray-100">
            <img src={product.image} alt={product.name} className="aspect-square w-full object-cover" />
          </div>

          <div>
            <p className="text-xs uppercase tracking-wider text-gray-400">{product.category}</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">{product.name}</h1>

            <div className="mt-4 flex items-center gap-3">
              <span className="text-2xl font-semibold">₹{displayPrice.toLocaleString('en-IN')}</span>
              {product.oldPrice && (
                <span className="text-lg text-gray-400 line-through">₹{product.oldPrice.toLocaleString('en-IN')}</span>
              )}
            </div>

            {product.shortDescription && (
              <p className="mt-4 text-gray-600">{product.shortDescription}</p>
            )}

            {product.variants.length > 0 && (
              <div className="mt-6">
                <p className="text-sm font-medium">{product.variants[0].variantName}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {product.variants.map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setSelectedVariant(v)}
                      className={`rounded-full border px-4 py-2 text-sm transition ${
                        selectedVariant?.id === v.id
                          ? 'border-gray-900 bg-gray-900 text-white'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {v.variantValue}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <p className="mt-6 text-sm text-gray-500">
              {product.stockQuantity > 0 ? `${product.stockQuantity} in stock` : 'Out of stock'}
            </p>

                        <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={product.stockQuantity === 0}
                className="flex flex-1 items-center justify-center gap-2 rounded-full border border-gray-900 px-6 py-4 text-sm font-medium text-gray-900 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <ShoppingBag size={17} />
                Add to Cart
              </button>

              <button
                type="button"
                onClick={handleBuyNow}
                disabled={product.stockQuantity === 0}
                className="flex flex-1 items-center justify-center gap-2 rounded-full bg-gray-900 px-6 py-4 text-sm font-medium text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Buy Now
              </button>

              <button
                type="button"
                onClick={() => toggleWishlist(product)}
                className="flex h-14 w-14 items-center justify-center rounded-full border border-gray-200 transition hover:bg-gray-50"
                aria-label="Toggle wishlist"
              >
                <Heart size={20} className={liked ? 'fill-gray-900 text-gray-900' : ''} />
              </button>
            </div>

            <Link
              to="/cart"
              className="mt-3 block text-center text-sm text-gray-500 underline underline-offset-4 transition hover:text-gray-900"
            >
              View Cart
            </Link>

                        {product.description && (
              <div className="mt-10 border-t border-gray-100 pt-8">
                <h2 className="font-semibold">Description</h2>
                <p className="mt-3 leading-7 text-gray-600">{product.description}</p>
              </div>
            )}
          </div>
        </div>

        {similarProducts.length > 0 && (
          <section className="mt-20 border-t border-gray-100 pt-14">
            <h2 className="text-2xl font-semibold tracking-tight">You may also like</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {similarProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  )
}

export default ProductDetailsPage