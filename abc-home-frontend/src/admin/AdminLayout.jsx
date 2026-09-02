import { Link, Outlet, useLocation } from 'react-router-dom'
import { LayoutDashboard, Package, FolderTree, ShoppingCart } from 'lucide-react'

const links = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/categories', label: 'Categories', icon: FolderTree },
  { to: '/admin/orders', label: 'Orders', icon: ShoppingCart },
]

function AdminLayout() {
  const location = useLocation()

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900">
      <aside className="w-60 shrink-0 border-r border-gray-200 bg-white p-5">
        <Link to="/" className="text-lg font-bold tracking-tight">
          ABC<span className="font-light">Home</span>
          <span className="ml-2 text-xs font-normal text-gray-400">Admin</span>
        </Link>

        <nav className="mt-8 flex flex-col gap-1">
          {links.map(({ to, label, icon: Icon }) => {
            const active = location.pathname === to
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  active ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon size={17} />
                {label}
              </Link>
            )
          })}
        </nav>
      </aside>

      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  )
}

export default AdminLayout