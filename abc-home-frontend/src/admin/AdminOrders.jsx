import { useEffect, useState } from 'react'
import { fetchAdminOrders, updateOrderStatus, fetchAdminOrderDetails } from '../api/admin'

const STATUSES = [
  'PLACED',
  'CONFIRMED',
  'PACKED',
  'SHIPPED',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
  'CANCELLED',
  'RETURNED',
  'REFUNDED',
]

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

  // Operational & Expand states
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('ALL')
  const [expandedOrderId, setExpandedOrderId] = useState(null)
  
  // State for printable order details
  const [printOrderData, setPrintOrderData] = useState(null)
  const [isPrinting, setIsPrinting] = useState(false)

  // Cache order details (items & shipping address) by order ID
  const [orderDetails, setOrderDetails] = useState({})
  const [loadingDetails, setLoadingDetails] = useState({})

  function loadData() {
    setLoading(true)
    fetchAdminOrders()
      .then(setOrders)
      .finally(() => setLoading(false))
  }

  useEffect(loadData, [])

  async function handleStatusChange(orderId, newStatus) {
    if (!window.confirm(`Are you sure you want to change order status to ${newStatus}?`)) return

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

  async function toggleExpand(orderId) {
    if (expandedOrderId === orderId) {
      setExpandedOrderId(null)
      return
    }

    setExpandedOrderId(orderId)

    if (!orderDetails[orderId]) {
      setLoadingDetails((prev) => ({ ...prev, [orderId]: true }))
      try {
        const details = await fetchAdminOrderDetails(orderId)
        setOrderDetails((prev) => ({ ...prev, [orderId]: details }))
      } catch (err) {
        alert('Failed to load item details: ' + err.message)
      } finally {
        setLoadingDetails((prev) => ({ ...prev, [orderId]: false }))
      }
    }
  }

  async function handlePrintSlip(order) {
    setIsPrinting(true)
    let details = orderDetails[order.id]

    // Fetch full details if not already loaded
    if (!details) {
      try {
        details = await fetchAdminOrderDetails(order.id)
        setOrderDetails((prev) => ({ ...prev, [order.id]: details }))
      } catch (err) {
        alert('Failed to fetch order details for printing: ' + err.message)
        setIsPrinting(false)
        return
      }
    }

    setPrintOrderData({ ...order, ...details })
    
    // Give state time to render the hidden print slip before triggering print dialog
    setTimeout(() => {
      window.print()
      setIsPrinting(false)
    }, 200)
  }

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.orderNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerEmail?.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus =
      selectedStatusFilter === 'ALL' || o.status === selectedStatusFilter

    return matchesSearch && matchesStatus
  })

  return (
    <div className="p-6">
      {/* NORMAL ADMIN DISPLAY */}
      <div className="no-print">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Orders</h1>
            <p className="mt-1 text-sm text-gray-500">
              Showing {filteredOrders.length} of {orders.length} orders
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <input
              type="text"
              placeholder="Search Order #, Name, Email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="ALL">All Statuses</option>
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s.replace(/_/g, ' ')}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <p className="mt-8 text-gray-500">Loading orders...</p>
        ) : (
          <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                <tr>
                  <th className="px-6 py-3">Order</th>
                  <th className="px-6 py-3">Customer</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Total</th>
                  <th className="px-6 py-3">Payment</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredOrders.map((o) => {
                  const isExpanded = expandedOrderId === o.id
                  const details = orderDetails[o.id]

                  return (
                    <tr key={o.id} className="contents">
                      <tr className="hover:bg-gray-50/50">
                        <td className="px-6 py-4 font-medium text-indigo-600">
                          <button
                            onClick={() => toggleExpand(o.id)}
                            className="flex items-center gap-2 font-semibold hover:underline"
                          >
                            <span>{isExpanded ? '▼' : '▶'}</span>
                            {o.orderNumber}
                          </button>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-medium text-gray-900">{o.customerName}</p>
                          <p className="text-xs text-gray-400">{o.customerEmail}</p>
                        </td>
                        <td className="px-6 py-4 text-gray-500">
                          {new Date(o.createdAt).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </td>
                        <td className="px-6 py-4 font-medium text-gray-900">
                          ₹{o.total?.toLocaleString('en-IN')}
                        </td>
                        <td className="px-6 py-4 text-gray-500">{o.paymentMethod}</td>
                        <td className="px-6 py-4">
                          <select
                            value={o.status}
                            disabled={updatingId === o.id}
                            onChange={(e) => handleStatusChange(o.id, e.target.value)}
                            className={`rounded-full border-0 px-3 py-1.5 text-xs font-semibold ${
                              STATUS_COLORS[o.status] || 'bg-gray-100'
                            }`}
                          >
                            {STATUSES.map((s) => (
                              <option key={s} value={s}>
                                {s.replace(/_/g, ' ')}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            disabled={isPrinting}
                            onClick={() => handlePrintSlip(o)}
                            className="rounded border border-gray-300 px-2.5 py-1 text-xs font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                          >
                            Print Slip
                          </button>
                        </td>
                      </tr>

                      {/* EXPANDABLE ITEM MANIFEST ROW */}
                      {isExpanded && (
                        <tr className="bg-slate-50">
                          <td colSpan={7} className="px-8 py-4">
                            <div className="rounded-xl border border-gray-200 bg-white p-4">
                              <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-500">
                                Order Manifest & Quantities to Pack
                              </h4>

                              {loadingDetails[o.id] ? (
                                <p className="py-3 text-xs text-gray-400">Loading item manifest...</p>
                              ) : details?.items?.length > 0 ? (
                                <div className="divide-y divide-gray-100">
                                  {details.items.map((item, idx) => (
                                    <div
                                      key={idx}
                                      className="flex items-center justify-between py-2 text-sm"
                                    >
                                      <div>
                                        <p className="font-medium text-gray-800">
                                          {item.productName}
                                        </p>
                                        {item.variantLabel && (
                                          <p className="text-xs text-gray-400">
                                            Variant: {item.variantLabel}
                                          </p>
                                        )}
                                      </div>
                                      <div className="text-right">
                                        <span className="inline-block rounded-md bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-700">
                                          Qty to Pack: {item.quantity}
                                        </span>
                                        <p className="mt-0.5 text-xs text-gray-500">
                                          ₹{item.lineTotal?.toLocaleString('en-IN')}
                                        </p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-xs text-gray-400">
                                  No items found in this order.
                                </p>
                              )}

                              {details?.shippingAddress && (
                                <div className="mt-4 border-t border-gray-100 pt-3 text-xs text-gray-600">
                                  <span className="font-bold text-gray-700">Shipping Address: </span>
                                  {details.shippingAddress.addressLine1}, {details.shippingAddress.city},{' '}
                                  {details.shippingAddress.state} - {details.shippingAddress.postalCode} | Phone: {details.shippingAddress.phoneNumber}
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </tr>
                  )
                })}

                {filteredOrders.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-10 text-center text-gray-400">
                      No matching orders found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* DEDICATED PRINT SLIP (Visible only when printing) */}
      {printOrderData && (
        <div className="print-only p-8 text-black bg-white">
          <div className="flex justify-between border-b pb-4">
            <div>
              <h1 className="text-2xl font-bold uppercase tracking-wide">ABC Home</h1>
              <p className="text-xs text-gray-500">Packing Slip & Order Details</p>
            </div>
            <div className="text-right">
              <h2 className="text-lg font-bold">Order #{printOrderData.orderNumber}</h2>
              <p className="text-xs text-gray-500">
                Date: {new Date(printOrderData.createdAt).toLocaleDateString('en-IN')}
              </p>
            </div>
          </div>

          {/* Customer & Shipping Details */}
          <div className="mt-6 grid grid-cols-2 gap-6 border-b pb-6 text-sm">
            <div>
              <h3 className="font-bold uppercase text-xs text-gray-500 mb-1">Customer Details</h3>
              <p className="font-semibold">{printOrderData.customerName}</p>
              <p className="text-gray-600">{printOrderData.customerEmail}</p>
            </div>

            <div>
              <h3 className="font-bold uppercase text-xs text-gray-500 mb-1">Delivery Address</h3>
              {printOrderData.shippingAddress ? (
                <div className="text-gray-700">
                  <p className="font-semibold">{printOrderData.shippingAddress.fullName || printOrderData.customerName}</p>
                  <p>{printOrderData.shippingAddress.addressLine1}</p>
                  {printOrderData.shippingAddress.addressLine2 && <p>{printOrderData.shippingAddress.addressLine2}</p>}
                  <p>
                    {printOrderData.shippingAddress.city}, {printOrderData.shippingAddress.state} - {printOrderData.shippingAddress.postalCode}
                  </p>
                  <p className="mt-1 font-medium">Phone: {printOrderData.shippingAddress.phoneNumber}</p>
                </div>
              ) : (
                <p className="text-gray-400 italic">No shipping address recorded</p>
              )}
            </div>
          </div>

          {/* Payment Info */}
          <div className="mt-4 flex justify-between text-xs border-b pb-4 text-gray-600">
            <p><strong>Payment Method:</strong> {printOrderData.paymentMethod}</p>
            <p><strong>Status:</strong> {printOrderData.status}</p>
          </div>

          {/* Items Table */}
          <div className="mt-6">
            <h3 className="font-bold uppercase text-xs text-gray-500 mb-3">Items to Pack</h3>
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b bg-gray-100">
                  <th className="py-2 px-3">Item Description</th>
                  <th className="py-2 px-3 text-center">Qty</th>
                  <th className="py-2 px-3 text-right">Price</th>
                  <th className="py-2 px-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {printOrderData.items?.map((item, idx) => (
                  <tr key={idx}>
                    <td className="py-2 px-3">
                      <p className="font-medium text-gray-900">{item.productName}</p>
                      {item.variantLabel && <p className="text-gray-500">{item.variantLabel}</p>}
                    </td>
                    <td className="py-2 px-3 text-center font-bold">{item.quantity}</td>
                    <td className="py-2 px-3 text-right">₹{item.unitPrice?.toLocaleString('en-IN')}</td>
                    <td className="py-2 px-3 text-right">₹{item.lineTotal?.toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Order Total */}
          <div className="mt-6 border-t pt-4 flex justify-between items-center text-sm font-bold">
            <span>Total Order Amount</span>
            <span>₹{printOrderData.total?.toLocaleString('en-IN')}</span>
          </div>

          <div className="mt-12 text-center text-xs text-gray-400 border-t pt-4">
            Thank you for shopping with ABC Home!
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminOrders