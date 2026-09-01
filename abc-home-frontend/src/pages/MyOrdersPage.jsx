
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Package,
  ShoppingBag,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useState } from 'react'

import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

function MyOrdersPage() {
  const [orders] = useState(() => {
    const savedOrders = JSON.parse(
      localStorage.getItem('abc-home-orders') || '[]'
    )

    // Backward compatibility:
    // If old data exists only as abc-home-last-order,
    // show it as an order as well.
    if (savedOrders.length > 0) {
      return savedOrders
    }

    const lastOrder = JSON.parse(
      localStorage.getItem('abc-home-last-order') || 'null'
    )

    return lastOrder ? [lastOrder] : []
  })

  const [openOrder, setOpenOrder] = useState(null)

  function toggleOrder(orderId) {
    setOpenOrder((current) =>
      current === orderId ? null : orderId
    )
  }

  function formatDate(date) {
    if (!date) {
      return 'Date unavailable'
    }

    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">

      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">

        {/* Header */}

        <div className="mb-10">

          <Link
            to="/account"
            className="inline-flex items-center gap-2 text-sm text-gray-500 transition hover:text-gray-900"
          >
            <ArrowLeft size={16} />
            Back to account
          </Link>

          <p className="mt-8 text-sm font-semibold uppercase tracking-[0.2em] text-gray-400">
            Account
          </p>

          <h1 className="mt-3 text-4xl font-semibold tracking-tight">
            My Orders
          </h1>

          <p className="mt-2 text-gray-500">
            View your recent orders and order history.
          </p>

        </div>

        {/* No orders */}

        {orders.length === 0 ? (

          <div className="mx-auto max-w-xl py-16 text-center">

            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
              <Package
                size={34}
                strokeWidth={1.5}
                className="text-gray-500"
              />
            </div>

            <h2 className="mt-6 text-2xl font-semibold">
              No orders yet
            </h2>

            <p className="mt-3 text-gray-500">
              You haven't placed any orders yet.
              Start shopping to see your orders here.
            </p>

            <Link
              to="/products"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-gray-900 px-7 py-3.5 text-sm font-medium text-white transition hover:bg-gray-700"
            >
              <ShoppingBag size={17} />
              Start Shopping
            </Link>

          </div>

        ) : (

          <div className="max-w-4xl space-y-5">

            {/* Order list */}

            {orders.map((order, index) => {

              const isOpen = openOrder === order.orderId

              return (
                <div
                  key={`${order.orderId}-${index}`}
                  className="overflow-hidden rounded-2xl border border-gray-100"
                >

                  {/* Order summary */}

                  <button
                    type="button"
                    onClick={() => toggleOrder(order.orderId)}
                    className="flex w-full flex-col gap-5 p-6 text-left transition hover:bg-gray-50 sm:flex-row sm:items-center sm:justify-between"
                  >

                    <div className="flex items-center gap-4">

                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gray-100">
                        <Package
                          size={21}
                          strokeWidth={1.6}
                        />
                      </div>

                      <div>

                        <p className="text-xs uppercase tracking-wider text-gray-400">
                          Order number
                        </p>

                        <p className="mt-1 font-semibold">
                          {order.orderId}
                        </p>

                        <p className="mt-1 text-sm text-gray-500">
                          {formatDate(order.createdAt)}
                        </p>

                      </div>

                    </div>

                    <div className="flex items-center justify-between gap-8 sm:justify-end">

                      <div className="text-left sm:text-right">

                        <p className="text-xs uppercase tracking-wider text-gray-400">
                          Status
                        </p>

                        <span className="mt-1 inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs font-medium">
                          {order.status || 'Confirmed'}
                        </span>

                      </div>

                      <div className="text-right">

                        <p className="text-xs uppercase tracking-wider text-gray-400">
                          Total
                        </p>

                        <p className="mt-1 font-semibold">
                          ₹{Number(order.total || 0).toLocaleString('en-IN')}
                        </p>

                      </div>

                      <div className="hidden sm:block">

                        {isOpen ? (
                          <ChevronUp size={20} />
                        ) : (
                          <ChevronDown size={20} />
                        )}

                      </div>

                    </div>

                  </button>

                  {/* Order details */}

                  {isOpen && (

                    <div className="border-t border-gray-100">

                      {/* Products */}

                      <div className="divide-y divide-gray-100">

                        {order.items?.map((item, itemIndex) => (

                          <div
                            key={`${item.id}-${itemIndex}`}
                            className="flex gap-4 p-6"
                          >

                            <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-gray-100">

                              <img
                                src={item.image}
                                alt={item.name}
                                className="h-full w-full object-cover"
                              />

                            </div>

                            <div className="min-w-0 flex-1">

                              <p className="text-xs uppercase tracking-wider text-gray-400">
                                {item.category}
                              </p>

                              <h3 className="mt-1 font-medium">
                                {item.name}
                              </h3>

                              <p className="mt-2 text-sm text-gray-500">
                                Quantity: {item.quantity}
                              </p>

                              <p className="mt-1 text-sm text-gray-500">
                                ₹{Number(item.price || 0).toLocaleString('en-IN')} each
                              </p>

                            </div>

                            <p className="font-semibold">
                              ₹{(
                                Number(item.price || 0) *
                                Number(item.quantity || 0)
                              ).toLocaleString('en-IN')}
                            </p>

                          </div>

                        ))}

                      </div>

                      {/* Customer details */}

                      {order.customer && (

                        <div className="border-t border-gray-100 p-6">

                          <h3 className="font-semibold">
                            Delivery details
                          </h3>

                          <div className="mt-4 grid gap-4 text-sm sm:grid-cols-2">

                            <div>
                              <p className="text-gray-400">
                                Name
                              </p>

                              <p className="mt-1">
                                {order.customer.firstName}{' '}
                                {order.customer.lastName}
                              </p>
                            </div>

                            <div>
                              <p className="text-gray-400">
                                Email
                              </p>

                              <p className="mt-1">
                                {order.customer.email}
                              </p>
                            </div>

                            <div>
                              <p className="text-gray-400">
                                Phone
                              </p>

                              <p className="mt-1">
                                {order.customer.phone}
                              </p>
                            </div>

                            <div>
                              <p className="text-gray-400">
                                Payment
                              </p>

                              <p className="mt-1">
                                {order.paymentMethod === 'cod'
                                  ? 'Cash on Delivery'
                                  : 'Online Payment'}
                              </p>
                            </div>

                            <div className="sm:col-span-2">

                              <p className="text-gray-400">
                                Address
                              </p>

                              <p className="mt-1">
                                {order.customer.address},{' '}
                                {order.customer.city},{' '}
                                {order.customer.state} -{' '}
                                {order.customer.pincode}
                              </p>

                            </div>

                          </div>

                        </div>

                      )}

                      {/* Totals */}

                      <div className="border-t border-gray-100 bg-gray-50 p-6">

                        <div className="ml-auto max-w-sm space-y-3">

                          <div className="flex justify-between text-sm">

                            <span className="text-gray-500">
                              Subtotal
                            </span>

                            <span>
                              ₹{Number(order.subtotal || 0).toLocaleString('en-IN')}
                            </span>

                          </div>

                          <div className="flex justify-between text-sm">

                            <span className="text-gray-500">
                              Shipping
                            </span>

                            <span>
                              {Number(order.shipping || 0) === 0
                                ? 'FREE'
                                : `₹${Number(order.shipping).toLocaleString('en-IN')}`}
                            </span>

                          </div>

                          <div className="flex justify-between border-t border-gray-200 pt-4">

                            <span className="font-semibold">
                              Total
                            </span>

                            <span className="text-xl font-semibold">
                              ₹{Number(order.total || 0).toLocaleString('en-IN')}
                            </span>

                          </div>

                        </div>

                      </div>

                    </div>

                  )}

                </div>
              )
            })}

            {/* Continue shopping */}

            <div className="pt-4">

              <Link
                to="/products"
                className="inline-flex items-center gap-2 rounded-full border border-gray-300 px-6 py-3 text-sm font-medium transition hover:bg-gray-50"
              >
                <ShoppingBag size={17} />
                Continue Shopping
              </Link>

            </div>

          </div>

        )}

      </main>

      <Footer />

    </div>
  )
}

export default MyOrdersPage
