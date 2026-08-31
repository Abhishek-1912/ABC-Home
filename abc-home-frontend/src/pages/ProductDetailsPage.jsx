
import { useState } from 'react'
import { ArrowLeft, Heart, Minus, Plus, ShoppingBag } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'

const products = [
  {
    id: 1,
    name: 'Ambient RGB Light',
    category: 'Lighting',
    price: 1299,
    oldPrice: 1999,
    rating: 4.6,
    reviews: 128,
    image:
      'https://images.unsplash.com/photo-1550537687-c91072c4792d?auto=format&fit=crop&w=1200&q=85',
    description:
      'Create the perfect atmosphere with this modern ambient RGB light. Designed for bedrooms, desks, entertainment spaces and modern interiors.',
    features: [
      'RGB color changing modes',
      'Multiple brightness levels',
      'Modern compact design',
      'Perfect for bedroom and desk',
      'Easy installation',
    ],
  },
  {
    id: 2,
    name: 'Minimal Table Lamp',
    category: 'Lighting',
    price: 1499,
    oldPrice: 2299,
    rating: 4.8,
    reviews: 96,
    image:
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1200&q=85',
    description:
      'A minimal table lamp designed to add warm, elegant lighting to your bedroom, living room or workspace.',
    features: [
      'Warm ambient lighting',
      'Minimal modern design',
      'Compact footprint',
      'Perfect for bedside tables',
      'Easy to use',
    ],
  },
  {
    id: 3,
    name: 'Motion Sensor Night Light',
    category: 'Lighting',
    price: 699,
    oldPrice: 999,
    rating: 4.5,
    reviews: 74,
    image:
      'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=1200&q=85',
    description:
      'A compact motion sensor night light that automatically illuminates your space when movement is detected.',
    features: [
      'Motion sensor',
      'Energy efficient',
      'Compact design',
      'Ideal for bedrooms and hallways',
      'Easy installation',
    ],
  },
  {
    id: 4,
    name: 'Modern Desk Organizer',
    category: 'Organization',
    price: 799,
    oldPrice: 1199,
    rating: 4.7,
    reviews: 112,
    image:
      'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1200&q=85',
    description:
      'Keep your workspace clean and organized with a modern desk organizer designed for everyday essentials.',
    features: [
      'Multiple storage sections',
      'Minimal design',
      'Desk-friendly size',
      'Easy to clean',
      'Suitable for home and office',
    ],
  },
  {
    id: 5,
    name: 'Multi Purpose Storage Rack',
    category: 'Organization',
    price: 1299,
    oldPrice: 1799,
    rating: 4.4,
    reviews: 61,
    image:
      'https://images.unsplash.com/photo-1558997519-83ea9252edf8?auto=format&fit=crop&w=1200&q=85',
    description:
      'A versatile storage rack designed to help organize everyday household items while keeping your space clean.',
    features: [
      'Multi-level storage',
      'Space-saving design',
      'Suitable for multiple rooms',
      'Easy to maintain',
      'Modern appearance',
    ],
  },
  {
    id: 6,
    name: 'Minimal Storage Box',
    category: 'Organization',
    price: 599,
    oldPrice: 899,
    rating: 4.5,
    reviews: 52,
    image:
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=85',
    description:
      'Simple and practical storage boxes for keeping your home organized without compromising on style.',
    features: [
      'Space-saving',
      'Lightweight',
      'Stackable design',
      'Easy to clean',
      'Multipurpose storage',
    ],
  },
  {
    id: 7,
    name: 'Decorative Table Piece',
    category: 'Decor',
    price: 999,
    oldPrice: 1499,
    rating: 4.8,
    reviews: 83,
    image:
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=85',
    description:
      'A contemporary decorative piece that adds character and elegance to coffee tables, shelves and side tables.',
    features: [
      'Modern decorative design',
      'Suitable for living rooms',
      'Premium appearance',
      'Easy to maintain',
      'Perfect for gifting',
    ],
  },
  {
    id: 8,
    name: 'Modern Wall Decor',
    category: 'Decor',
    price: 1199,
    oldPrice: 1799,
    rating: 4.6,
    reviews: 67,
    image:
      'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=1200&q=85',
    description:
      'Modern wall decor designed to transform empty walls into stylish focal points.',
    features: [
      'Modern aesthetic',
      'Lightweight',
      'Easy to install',
      'Suitable for living rooms',
      'Minimal maintenance',
    ],
  },
  {
    id: 9,
    name: 'Decorative LED Light',
    category: 'Decor',
    price: 899,
    oldPrice: 1399,
    rating: 4.5,
    reviews: 59,
    image:
      'https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=1200&q=85',
    description:
      'Decorative LED lighting designed to create a warm and comfortable atmosphere in your home.',
    features: [
      'LED lighting',
      'Decorative design',
      'Energy efficient',
      'Warm ambience',
      'Easy setup',
    ],
  },
  {
    id: 10,
    name: 'Premium Desk Mat',
    category: 'Lifestyle',
    price: 899,
    oldPrice: 1299,
    rating: 4.7,
    reviews: 91,
    image:
      'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&w=1200&q=85',
    description:
      'A premium desk mat designed to make your workspace more comfortable, clean and organized.',
    features: [
      'Smooth surface',
      'Desk protection',
      'Modern appearance',
      'Easy to clean',
      'Suitable for work and gaming',
    ],
  },
  {
    id: 11,
    name: 'Bedside Organizer',
    category: 'Lifestyle',
    price: 749,
    oldPrice: 1099,
    rating: 4.5,
    reviews: 46,
    image:
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=85',
    description:
      'Keep your bedside essentials organized with a compact organizer designed for modern bedrooms.',
    features: [
      'Compact design',
      'Multiple compartments',
      'Space saving',
      'Modern appearance',
      'Easy to clean',
    ],
  },
  {
    id: 12,
    name: 'Minimal Desk Accessories',
    category: 'Lifestyle',
    price: 999,
    oldPrice: 1499,
    rating: 4.6,
    reviews: 72,
    image:
      'https://images.unsplash.com/photo-1593642532973-d31b6557fa68?auto=format&fit=crop&w=1200&q=85',
    description:
      'Minimal desk accessories designed to make your workspace more functional and visually clean.',
    features: [
      'Minimal design',
      'Workspace organization',
      'Modern appearance',
      'Multipurpose use',
      'Ideal for home office',
    ],
  },
]

function createSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function ProductDetailsPage() {
  const { slug } = useParams()

  const product = products.find(
    (item) => createSlug(item.name) === slug
  )

  const [quantity, setQuantity] = useState(1)

  const [addedToCart, setAddedToCart] = useState(false)

//   const [wishlist, setWishlist] = useState(false)

  const { addToCart } = useCart()
  const {
  isInWishlist,
  toggleWishlist,
} = useWishlist()

  if (!product) {
    return (
      <div className="min-h-screen bg-white">

        <Navbar />

        <main className="mx-auto max-w-7xl px-4 py-24 text-center sm:px-6 lg:px-8">

          <h1 className="text-3xl font-semibold">
            Product not found
          </h1>

          <p className="mt-3 text-gray-500">
            The product you are looking for does not exist.
          </p>

          <Link
            to="/products"
            className="mt-8 inline-flex rounded-full bg-gray-900 px-6 py-3 text-sm font-medium text-white"
          >
            Back to products
          </Link>

        </main>

        <Footer />

      </div>
    )
  }

  function increaseQuantity() {
    setQuantity((current) => current + 1)
  }

  function decreaseQuantity() {
    setQuantity((current) =>
      current > 1 ? current - 1 : 1
    )
  }

function handleAddToCart() {
  addToCart(product, quantity)

  setAddedToCart(true)

  setTimeout(() => {
    setAddedToCart(false)
  }, 2000)
}

  return (
    <div className="min-h-screen bg-white text-gray-900">

      <Navbar />

      {/* Breadcrumb */}
      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">

        <Link
          to="/products"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900"
        >
          <ArrowLeft size={16} />
          Back to products
        </Link>

      </div>

      {/* Product */}
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

        <div className="grid gap-12 lg:grid-cols-2">

        
{/* Image */}
<div className="relative">

  <div className="relative overflow-hidden rounded-3xl bg-gray-100">

    <img
      src={product.image}
      alt={product.name}
      className="aspect-square w-full object-cover"
    />

    {/* Wishlist */}
    <button
      type="button"
      onClick={() => toggleWishlist(product)}
      className="absolute right-5 top-5 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm transition hover:scale-105"
      aria-label={
        isInWishlist(product.id)
          ? 'Remove from wishlist'
          : 'Add to wishlist'
      }
    >
      <Heart
        size={21}
        strokeWidth={1.8}
        className={
          isInWishlist(product.id)
            ? 'fill-gray-900 text-gray-900'
            : 'text-gray-900'
        }
      />
    </button>

  </div>

</div>

          {/* Information */}
          <div className="flex flex-col justify-center">

            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-400">
              {product.category}
            </p>

            <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="mt-5 flex items-center gap-3">

              <span className="text-sm">
                ★ {product.rating}
              </span>

              <span className="text-sm text-gray-400">
                {product.reviews} reviews
              </span>

            </div>

            {/* Price */}
            <div className="mt-6 flex items-center gap-3">

              <span className="text-3xl font-semibold">
                ₹{product.price.toLocaleString('en-IN')}
              </span>

              <span className="text-lg text-gray-400 line-through">
                ₹{product.oldPrice.toLocaleString('en-IN')}
              </span>

              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium">
                {Math.round(
                  ((product.oldPrice -
                    product.price) /
                    product.oldPrice) *
                    100
                )}
                % OFF
              </span>

            </div>

            {/* Description */}
            <p className="mt-6 leading-7 text-gray-600">
              {product.description}
            </p>

            {/* Features */}
            <div className="mt-8">

              <h2 className="font-semibold">
                Product details
              </h2>

              <ul className="mt-4 space-y-3">

                {product.features.map(
                  (feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-3 text-sm text-gray-600"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-gray-900" />
                      {feature}
                    </li>
                  )
                )}

              </ul>

            </div>

            {/* Quantity */}
            <div className="mt-8">

              <p className="mb-3 text-sm font-medium">
                Quantity
              </p>

              <div className="flex w-fit items-center rounded-full border border-gray-200">

                <button
                  onClick={decreaseQuantity}
                  className="flex h-11 w-11 items-center justify-center"
                  aria-label="Decrease quantity"
                >
                  <Minus size={16} />
                </button>

                <span className="w-10 text-center text-sm">
                  {quantity}
                </span>

                <button
                  onClick={increaseQuantity}
                  className="flex h-11 w-11 items-center justify-center"
                  aria-label="Increase quantity"
                >
                  <Plus size={16} />
                </button>

              </div>

            </div>

            {/* Cart */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">

              <button
                onClick={handleAddToCart}
                className="flex flex-1 items-center justify-center gap-2 rounded-full bg-gray-900 px-7 py-4 text-sm font-medium text-white transition hover:bg-gray-700"
              >
                <ShoppingBag size={18} />

                {addedToCart
                  ? 'Added to cart ✓'
                  : 'Add to cart'}
              </button>

              <Link
                to="/cart"
                className="flex items-center justify-center rounded-full border border-gray-300 px-7 py-4 text-sm font-medium transition hover:bg-gray-50"
              >
                View cart
              </Link>

            </div>

            {/* Shipping */}
            <div className="mt-8 grid gap-4 border-t border-gray-100 pt-8 sm:grid-cols-3">

              <div>
                <p className="text-sm font-medium">
                  Free Shipping
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  On orders above ₹999
                </p>
              </div>

              <div>
                <p className="text-sm font-medium">
                  Easy Returns
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  7-day return policy
                </p>
              </div>

              <div>
                <p className="text-sm font-medium">
                  Secure Payment
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  Safe & secure checkout
                </p>
              </div>

            </div>

          </div>

        </div>

      </main>

      <Footer />

    </div>
  )
}

export default ProductDetailsPage
