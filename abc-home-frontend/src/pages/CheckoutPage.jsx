
import {
  ArrowLeft,
  CreditCard,
  Lock,
  MapPin,
  ShoppingBag,
} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'

import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useCart } from '../context/CartContext'

function CheckoutPage() {
  const navigate = useNavigate()

  const {
    cartItems,
    subtotal,
    shipping,
    total,
    clearCart,
  } = useCart()

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  })

  const [paymentMethod, setPaymentMethod] = useState('cod')
  const [placingOrder, setPlacingOrder] = useState(false)

  function handleChange(event) {
    const { name, value } = event.target

    setForm((current) => ({
      ...current,
      [name]: value,
    }))
  }

  function handlePlaceOrder(event) {
    event.preventDefault()

    if (cartItems.length === 0) {
      navigate('/products')
      return
    }

    setPlacingOrder(true)

    // Create one order ID
    const orderId = `ABC-${Date.now().toString().slice(-8)}`

    // Create order object
    const orderData = {
      orderId,
      customer: {
        ...form,
      },
      paymentMethod,
      items: cartItems,
      subtotal,
      shipping,
      total,
      status: 'Confirmed',
      createdAt: new Date().toISOString(),
    }

    // Save the latest order
    localStorage.setItem(
      'abc-home-last-order',
      JSON.stringify(orderData)
    )

    // Also keep an order history
    const existingOrders = JSON.parse(
      localStorage.getItem('abc-home-orders') || '[]'
    )

    localStorage.setItem(
      'abc-home-orders',
      JSON.stringify([
        orderData,
        ...existingOrders,
      ])
    )

    // Simulate order processing
    setTimeout(() => {
      clearCart()

      navigate('/order-success', {
        state: {
          orderId,
        },
      })
    }, 1000)
  }

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
              Add some products before checking out.
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
            to="/cart"
            className="inline-flex items-center gap-2 text-sm text-gray-500 transition hover:text-gray-900"
          >
            <ArrowLeft size={16} />
            Back to cart
          </Link>

          <h1 className="mt-6 text-4xl font-semibold tracking-tight">
            Checkout
          </h1>

          <p className="mt-2 text-gray-500">
            Complete your details to place your order.
          </p>

        </div>

        <form
          onSubmit={handlePlaceOrder}
          className="grid gap-10 lg:grid-cols-[1fr_380px]"
        >

          {/* Left */}

          <div className="space-y-8">

            {/* Contact */}

            <section className="rounded-2xl border border-gray-100 p-6">

              <h2 className="text-xl font-semibold">
                Contact information
              </h2>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">

                <div>
                  <label className="text-sm font-medium">
                    First name
                  </label>

                  <input
                    required
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-gray-400"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">
                    Last name
                  </label>

                  <input
                    required
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-gray-400"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">
                    Email
                  </label>

                  <input
                    required
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-gray-400"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">
                    Phone
                  </label>

                  <input
                    required
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-gray-400"
                  />
                </div>

              </div>

            </section>

            {/* Address */}

            <section className="rounded-2xl border border-gray-100 p-6">

              <div className="flex items-center gap-3">

                <MapPin size={20} />

                <h2 className="text-xl font-semibold">
                  Delivery address
                </h2>

              </div>

              <div className="mt-6 space-y-5">

                <div>

                  <label className="text-sm font-medium">
                    Address
                  </label>

                  <textarea
                    required
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    rows="3"
                    placeholder="House number, street, area"
                    className="mt-2 w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-gray-400"
                  />

                </div>

                <div className="grid gap-5 sm:grid-cols-3">

                  <div>
                    <label className="text-sm font-medium">
                      City
                    </label>

                    <input
                      required
                      name="city"
                      value={form.city}
                      onChange={handleChange}
                      className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-gray-400"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">
                      State
                    </label>

                    <input
                      required
                      name="state"
                      value={form.state}
                      onChange={handleChange}
                      className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-gray-400"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">
                      PIN code
                    </label>

                    <input
                      required
                      inputMode="numeric"
                      maxLength="6"
                      name="pincode"
                      value={form.pincode}
                      onChange={handleChange}
                      className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-gray-400"
                    />
                  </div>

                </div>

              </div>

            </section>

            {/* Payment */}

            <section className="rounded-2xl border border-gray-100 p-6">

              <div className="flex items-center gap-3">

                <CreditCard size={20} />

                <h2 className="text-xl font-semibold">
                  Payment method
                </h2>

              </div>

              <div className="mt-6 space-y-3">

                <label className="flex cursor-pointer items-center gap-4 rounded-xl border border-gray-200 p-4 transition hover:bg-gray-50">

                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={(event) =>
                      setPaymentMethod(event.target.value)
                    }
                  />

                  <div>
                    <p className="text-sm font-medium">
                      Cash on Delivery
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      Pay when your order arrives.
                    </p>
                  </div>

                </label>

                <label className="flex cursor-pointer items-center gap-4 rounded-xl border border-gray-200 p-4 transition hover:bg-gray-50">

                  <input
                    type="radio"
                    name="payment"
                    value="online"
                    checked={paymentMethod === 'online'}
                    onChange={(event) =>
                      setPaymentMethod(event.target.value)
                    }
                  />

                  <div>
                    <p className="text-sm font-medium">
                      Online Payment
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      UPI, cards and other payment methods.
                    </p>
                  </div>

                </label>

              </div>

            </section>

          </div>

          {/* Right */}

          <aside>

            <div className="sticky top-28 rounded-2xl bg-gray-50 p-6">

              <h2 className="text-xl font-semibold">
                Order summary
              </h2>

              {/* Products */}

              <div className="mt-6 space-y-4">

                {cartItems.map((item) => (

                  <div
                    key={item.id}
                    className="flex gap-3"
                  >

                    <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl bg-white">

                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />

                    </div>

                    <div className="min-w-0 flex-1">

                      <p className="text-sm font-medium">
                        {item.name}
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        Qty: {item.quantity}
                      </p>

                    </div>

                    <p className="text-sm font-medium">
                      ₹{(
                        item.price * item.quantity
                      ).toLocaleString('en-IN')}
                    </p>

                  </div>

                ))}

              </div>

              {/* Totals */}

              <div className="mt-6 space-y-4 border-t border-gray-200 pt-6">

                <div className="flex justify-between text-sm">

                  <span className="text-gray-500">
                    Subtotal
                  </span>

                  <span>
                    ₹{subtotal.toLocaleString('en-IN')}
                  </span>

                </div>

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

              <button
                type="submit"
                disabled={placingOrder}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-gray-900 px-6 py-4 text-sm font-medium text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-60"
              >

                <Lock size={16} />

                {placingOrder
                  ? 'Placing order...'
                  : 'Place order'}

              </button>

              <p className="mt-4 text-center text-xs text-gray-400">
                Your information is securely handled.
              </p>

            </div>

          </aside>

        </form>

      </main>

      <Footer />

    </div>
  )
}

export default CheckoutPage