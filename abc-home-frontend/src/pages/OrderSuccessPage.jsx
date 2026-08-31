
import {
  ArrowRight,
  CheckCircle2,
  ShoppingBag,
} from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

function OrderSuccessPage() {
const location = useLocation()

const savedOrder = JSON.parse(
  localStorage.getItem('abc-home-last-order') || 'null'
)

const orderNumber =
  location.state?.orderId ||
  savedOrder?.orderId ||
  'ABC-ORDER'

  return (
    <div className="min-h-screen bg-white text-gray-900">

      <Navbar />

      <main className="mx-auto flex max-w-7xl items-center justify-center px-4 py-24 sm:px-6 lg:px-8">

        <div className="w-full max-w-xl text-center">

          {/* Success icon */}

          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">

            <CheckCircle2
              size={42}
              strokeWidth={1.5}
              className="text-gray-900"
            />

          </div>

          {/* Heading */}

          <p className="mt-8 text-sm font-semibold uppercase tracking-[0.2em] text-gray-400">
            Order confirmed
          </p>

          <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
            Thank you for your order!
          </h1>

          <p className="mx-auto mt-5 max-w-lg leading-7 text-gray-500">
            Your order has been successfully placed.
            We'll keep you updated about your delivery.
          </p>

          {/* Order number */}

          <div className="mx-auto mt-8 max-w-sm rounded-2xl bg-gray-50 p-6">

            <p className="text-xs uppercase tracking-wider text-gray-400">
              Order number
            </p>

            <p className="mt-2 text-lg font-semibold">
              {orderNumber}
            </p>

          </div>

          {/* Actions */}

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">

            <Link
              to="/products"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-gray-900 px-7 py-3.5 text-sm font-medium text-white transition hover:bg-gray-700"
            >
              <ShoppingBag size={17} />
              Continue shopping
            </Link>

            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-gray-300 px-7 py-3.5 text-sm font-medium transition hover:bg-gray-50"
            >
              Back to home
              <ArrowRight size={17} />
            </Link>

          </div>

          {/* Information */}

          <div className="mt-12 border-t border-gray-100 pt-8">

            <p className="text-sm text-gray-500">
              A confirmation email will be sent to you
              once real order processing is connected.
            </p>

          </div>

        </div>

      </main>

      <Footer />

    </div>
  )
}

export default OrderSuccessPage
