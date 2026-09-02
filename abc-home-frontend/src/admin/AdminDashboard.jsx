import { useEffect, useState } from 'react'
import { Package, ShoppingCart, IndianRupee, Users } from 'lucide-react'
import { fetchAdminProducts, fetchAdminOrders } from '../api/admin'

function AdminDashboard() {
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([fetchAdminProducts(), fetchAdminOrders()])
      .then(([productsData, ordersData]) => {
        setProducts(productsData)
        setOrders(ordersData)
      })
      .finally(() => setLoading(false))
  }, [])

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0)
  const pendingOrders = orders.filter((o) => o.status === 'PLACED').length
  const uniqueCustomers = new Set(orders.map((o) => o.customerEmail)).size

  const stats = [
    { label: 'Total Products', value: products.length, icon: Package },
    { label: 'Total Orders', value: orders.length, icon: ShoppingCart },
    { label: 'Revenue', value: `₹${totalRevenue.toLocaleString('en-IN')}`, icon: IndianRupee },
    { label: 'Customers', value: uniqueCustomers, icon: Users },
  ]

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
      <p className="mt-2 text-gray-500">Overview of your store.</p>

      {loading ? (
        <p className="mt-8 text-gray-500">Loading...</p>
      ) : (
        <>
          <div className="mt-8 grid grid-cols-2 gap-5 lg:grid-cols-4">
            {stats.map(({ label, value, icon: Icon }) => (
              <div key={label} className="rounded-2xl border border-gray-200 bg-white p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                  <Icon size={18} />
                </div>
                <p className="mt-4 text-2xl font-semibold">{value}</p>
                <p className="mt-1 text-sm text-gray-500">{label}</p>
              </div>
            ))}
          </div>

          {pendingOrders > 0 && (
            <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-800">
              {pendingOrders} order{pendingOrders === 1 ? '' : 's'} awaiting confirmation.
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default AdminDashboard