import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Package,
  ShoppingBag,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'

import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { fetchMyOrders, cancelOrder, returnOrder } from '../api/orders'



function MyOrdersPage() {
  const [expandedOrder, setExpandedOrder] = useState(null)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchMyOrders()
      .then(setOrders)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  function toggleOrder(orderId) {
    setExpandedOrder((current) => (current === orderId ? null : orderId))
  }

    async function handleCancel(orderId) {
    if (!confirm('Cancel this order?')) return
    try {
      const updated = await cancelOrder(orderId)
      setOrders((current) => current.map((o) => (o.id === orderId ? { ...o, status: updated.status } : o)))
    } catch (err) {
      alert(err.message)
    }
  }

  async function handleReturn(orderId) {
    if (!confirm('Request a return for this order?')) return
    try {
      const updated = await returnOrder(orderId)
      setOrders((current) => current.map((o) => (o.id === orderId ? { ...o, status: updated.status } : o)))
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-10">
          <Link to="/account" className="inline-flex items-center gap-2 text-sm text-gray-500 transition hover:text-gray-900">
            <ArrowLeft size={16} />
            Back to account
          </Link>

          <p className="mt-8 text-sm font-semibold uppercase tracking-[0.2em] text-gray-400">Account</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight">My Orders</h1>
          <p className="mt-2 text-gray-500">View your recent orders and order history.</p>
        </div>

        {loading && <p className="text-gray-500">Loading your orders...</p>}

        {error && (
          <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
        )}

        {!loading && !error && orders.length === 0 ? (
          <div className="mx-auto max-w-xl py-16 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
              <Package size={34} strokeWidth={1.5} className="text-gray-500" />
            </div>
            <h2 className="mt-6 text-2xl font-semibold">No orders yet</h2>
            <p className="mt-3 text-gray-500">
              You haven't placed any orders yet. Start shopping to see your orders here.
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
          <div className="max-w-4xl space-y-6">
            {orders.map((order) => {
              const isExpanded = expandedOrder === order.id

              return (
                <div key={order.id} className="overflow-hidden rounded-2xl border border-gray-100">
                  <button
                    type="button"
                    onClick={() => toggleOrder(order.id)}
                    className="w-full p-6 text-left transition hover:bg-gray-50"
                  >
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-wider text-gray-400">Order number</p>
                        <p className="mt-1 font-semibold">{order.orderNumber}</p>
                        {order.createdAt && (
                          <p className="mt-2 text-sm text-gray-500">
                            {new Date(order.createdAt).toLocaleDateString('en-IN', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center justify-between gap-6 sm:justify-end">
                        <div className="text-left sm:text-right">
                          <p className="text-xs uppercase tracking-wider text-gray-400">Status</p>
                          <span className="mt-1 inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs font-medium">
                            {order.status}
                          </span>
                        </div>

                        <div className="text-left sm:text-right">
                          <p className="text-xs uppercase tracking-wider text-gray-400">Total</p>
                          <p className="mt-1 font-semibold">₹{order.total.toLocaleString('en-IN')}</p>
                        </div>

                        <div className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200">
                          {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </div>
                      </div>
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="border-t border-gray-100">
                      <div className="divide-y divide-gray-100">
                        {order.items.map((item, itemIndex) => (
                          <div key={itemIndex} className="flex gap-4 p-6">
                            <div className="min-w-0 flex-1">
                              <h3 className="font-medium">{item.productName}</h3>
                              {item.variantLabel && (
                                <p className="mt-1 text-sm text-gray-500">{item.variantLabel}</p>
                              )}
                              <p className="mt-2 text-sm text-gray-500">Quantity: {item.quantity}</p>
                              <p className="mt-1 text-sm text-gray-500">
                                Price: ₹{item.unitPrice.toLocaleString('en-IN')}
                              </p>
                            </div>
                            <p className="font-semibold">₹{item.lineTotal.toLocaleString('en-IN')}</p>
                          </div>
                        ))}
                      </div>

                                            <div className="border-t border-gray-100 bg-gray-50 p-6">
                        <div className="space-y-3">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Subtotal</span>
                            <span>₹{order.subtotal.toLocaleString('en-IN')}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Shipping</span>
                            <span>{order.shippingFee === 0 ? 'FREE' : `₹${order.shippingFee}`}</span>
                          </div>
                          <div className="flex justify-between border-t border-gray-200 pt-4">
                            <span className="font-semibold">Total</span>
                            <span className="text-xl font-semibold">₹{order.total.toLocaleString('en-IN')}</span>
                          </div>
                        </div>

                        {['PLACED', 'CONFIRMED'].includes(order.status) && (
                          <button
                            onClick={() => handleCancel(order.id)}
                            className="mt-5 w-full rounded-full border border-red-200 px-6 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50"
                          >
                            Cancel Order
                          </button>
                        )}

                        {order.status === 'DELIVERED' && (
                          <button
                            onClick={() => handleReturn(order.id)}
                            className="mt-5 w-full rounded-full border border-gray-300 px-6 py-3 text-sm font-medium transition hover:bg-gray-100"
                          >
                            Request Return
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}

            <div className="pt-2">
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