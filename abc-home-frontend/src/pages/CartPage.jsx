
import {
  ArrowLeft,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'

import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useCart } from '../context/CartContext'

function createSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function CartPage() {
  const navigate = useNavigate()

  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    clearCart,
    totalItems,
    subtotal,
    shipping,
    total,
  } = useCart()

  /* Empty cart */
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-white text-gray-900">

        <Navbar />

        <main className="mx-auto max-w-7xl px-4 py-24 text-center sm:px-6 lg:px-8">

          <div className="mx-auto max-w-md">

            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
              <ShoppingBag
                size={32}
                strokeWidth={1.5}
                className="text-gray-500"
              />
            </div>

            <h1 className="mt-6 text-3xl font-semibold">
              Your cart is empty
            </h1>

            <p className="mt-3 text-gray-500">
              Looks like you haven't added anything
              to your cart yet.
            </p>

            <Link
              to="/products"
              className="mt-8 inline-flex rounded-full bg-gray-900 px-7 py-3.5 text-sm font-medium text-white transition hover:bg-gray-700"
            >
              Continue Shopping
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

        {/* Header */}
        <div className="mb-10">

          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-sm text-gray-500 transition hover:text-gray-900"
          >
            <ArrowLeft size={16} />
            Continue shopping
          </Link>

          <div className="mt-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">

            <div>

              <h1 className="text-4xl font-semibold tracking-tight">
                Your cart
              </h1>

              <p className="mt-2 text-gray-500">
                {totalItems}{' '}
                {totalItems === 1
                  ? 'item'
                  : 'items'}{' '}
                in your cart
              </p>

            </div>

            <button
              onClick={clearCart}
              className="w-fit text-sm text-gray-400 underline transition hover:text-red-600"
            >
              Clear cart
            </button>

          </div>

        </div>

        <div className="grid gap-10 lg:grid-cols-[1fr_380px]">

          {/* Cart items */}
          <section>

            <div className="divide-y divide-gray-100 border-y border-gray-100">

              {cartItems.map((item) => {

                const productSlug =
                  item.slug || createSlug(item.name)

                return (
                  <div
                    key={item.id}
                    className="flex gap-5 py-6"
                  >

                    {/* Image */}
                    <Link
                      to={`/products/${productSlug}`}
                      className="h-28 w-28 flex-shrink-0 overflow-hidden rounded-xl bg-gray-100 sm:h-36 sm:w-36"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover transition duration-300 hover:scale-105"
                      />
                    </Link>

                    {/* Details */}
                    <div className="flex min-w-0 flex-1 flex-col justify-between">

                      <div>

                        <p className="text-xs uppercase tracking-wider text-gray-400">
                          {item.category}
                        </p>

                        <Link
                          to={`/products/${productSlug}`}
                        >
                          <h2 className="mt-1 font-medium transition hover:underline">
                            {item.name}
                          </h2>
                        </Link>

                        <p className="mt-2 font-semibold">
                          ₹{item.price.toLocaleString('en-IN')}
                        </p>

                      </div>

                      <div className="mt-4 flex items-center justify-between">

                        {/* Quantity */}
                        <div className="flex items-center rounded-full border border-gray-200">

                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(
                                item.id,
                                item.quantity - 1
                              )
                            }
                            className="flex h-9 w-9 items-center justify-center transition hover:bg-gray-100"
                            aria-label="Decrease quantity"
                          >
                            <Minus size={14} />
                          </button>

                          <span className="w-8 text-center text-sm">
                            {item.quantity}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(
                                item.id,
                                item.quantity + 1
                              )
                            }
                            className="flex h-9 w-9 items-center justify-center transition hover:bg-gray-100"
                            aria-label="Increase quantity"
                          >
                            <Plus size={14} />
                          </button>

                        </div>

                        {/* Remove */}
                        <button
                          type="button"
                          onClick={() =>
                            removeFromCart(item.id)
                          }
                          className="flex items-center gap-2 text-sm text-gray-400 transition hover:text-red-600"
                        >
                          <Trash2 size={16} />

                          <span className="hidden sm:inline">
                            Remove
                          </span>
                        </button>

                      </div>

                    </div>

                  </div>
                )
              })}

            </div>

          </section>

          {/* Summary */}
          <aside>

            <div className="sticky top-28 rounded-2xl bg-gray-50 p-6">

              <h2 className="text-xl font-semibold">
                Order summary
              </h2>

              <div className="mt-6 space-y-4">

                {/* Subtotal */}
                <div className="flex justify-between text-sm">

                  <span className="text-gray-500">
                    Subtotal
                  </span>

                  <span>
                    ₹{subtotal.toLocaleString('en-IN')}
                  </span>

                </div>

                {/* Shipping */}
                <div className="flex justify-between text-sm">

                  <span className="text-gray-500">
                    Shipping
                  </span>

                  <span>
                    {shipping === 0
                      ? 'FREE'
                      : `₹${shipping}`}
                  </span>

                </div>

                {/* Free shipping message */}
                {subtotal > 0 && subtotal < 999 && (
                  <div className="rounded-xl bg-white p-3 text-xs text-gray-500">
                    Add ₹
                    {(999 - subtotal).toLocaleString('en-IN')}
                    {' '}more to get free shipping.
                  </div>
                )}

                {/* Total */}
                <div className="border-t border-gray-200 pt-4">

                  <div className="flex justify-between">

                    <span className="font-semibold">
                      Total
                    </span>

                    <span className="text-xl font-semibold">
                      ₹{total.toLocaleString('en-IN')}
                    </span>

                  </div>

                </div>

              </div>

              {/* Checkout */}
              <button
                type="button"
                onClick={() => navigate('/checkout')}
                className="mt-6 w-full rounded-full bg-gray-900 px-6 py-4 text-sm font-medium text-white transition hover:bg-gray-700"
              >
                Proceed to checkout
              </button>

              <p className="mt-4 text-center text-xs text-gray-400">
                Secure checkout • Easy returns
              </p>

            </div>

          </aside>

        </div>

      </main>

      <Footer />

    </div>
  )
}

export default CartPage
