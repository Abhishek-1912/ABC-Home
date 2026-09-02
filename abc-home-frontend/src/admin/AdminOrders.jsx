import { useEffect, useState } from 'react'
import { fetchAdminOrders, updateOrderStatus } from '../api/admin'

const STATUSES = ['PLACED', 'CONFIRMED', 'PACKED', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED', 'RETURNED', 'REFUNDED']

const STATUS_COLORS = {
  PLACED: 'bg-blue-100 text-blue-700',
  CONFIRMED: 'bg-indigo-100 text-indigo-700',
  PACKED: 'bg-purple-100 text-purple-700',
  SHIPPED: 'bg-amber-100 text-amber-700',
  OUT_FOR_DELIVERY: 'bg-orange-100 text-orange-700',
  DELIVERED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-700',
  RETURNED: 'bg-gray-100 text-gray-700',
  REFUNDED: 'bg-gray-100 text-gray-700',
}

function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState(null)

  function loadData() {
    setLoading(true)
    fetchAdminOrders().then(setOrders).finally(() => setLoading(false))
  }

  useEffect(loadData, [])

  async function handleStatusChange(orderId, newStatus) {
    setUpdatingId(orderId)
    try {
      await updateOrderStatus(orderId, newStatus)
      setOrders((current) =>
        current.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      )
    } catch (err) {
      alert(err.message)
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight">Orders</h1>
      <p className="mt-2 text-gray-500">{orders.length} orders</p>

      {loading ? (
        <p className="mt-8 text-gray-500">Loading...</p>
      ) : (
        <div className="mt-8 overflow-hidden rounded-2xl border border-gray-200 bg-white">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-200 bg-gray-50 text-left text-xs uppercase tracking-wider text-gray-500">
              <tr>
                <th className="px-6 py-3">Order</th>
                <th className="px-6 py-3">Customer</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Total</th>
                <th className="px-6 py-3">Payment</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((o) => (
                <tr key={o.id}>
                  <td className="px-6 py-4 font-medium">{o.orderNumber}</td>
                  <td className="px-6 py-4">
                    <p>{o.customerName}</p>
                    <p className="text-xs text-gray-400">{o.customerEmail}</p>
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {new Date(o.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-4">₹{o.total.toLocaleString('en-IN')}</td>
                  <td className="px-6 py-4 text-gray-500">{o.paymentMethod}</td>
                  <td className="px-6 py-4">
                    <select
                      value={o.status}
                      disabled={updatingId === o.id}
                      onChange={(e) => handleStatusChange(o.id, e.target.value)}
                      className={`rounded-full border-0 px-3 py-1.5 text-xs font-medium ${STATUS_COLORS[o.status] || 'bg-gray-100'}`}
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-gray-400">No orders yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default AdminOrders