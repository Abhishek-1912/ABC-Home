import { useEffect, useState, useMemo } from 'react'
import {
  Users,
  Search,
  Shield,
  UserCheck,
  Eye,
  X,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  Mail,
  Phone,
  Calendar,
} from 'lucide-react'
import { fetchAdminUsers, fetchUserProfile, updateUserRole } from '../api/admin'

function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRole, setSelectedRole] = useState('')
  const [error, setError] = useState('')

  // Selected User Profile Modal
  const [selectedUser, setSelectedUser] = useState(null)
  const [loadingProfile, setLoadingProfile] = useState(false)
  const [updatingRoleId, setUpdatingRoleId] = useState(null)

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

// Temporary dummy data so you can test the page UI:
// const MOCK_USERS = [
//   { id: 101, name: 'Rahul Sharma', email: 'rahul@example.com', phone: '+91 9876543210', role: 'CUSTOMER', createdAt: '2026-01-15' },
//   { id: 102, name: 'Priya Patel', email: 'priya@example.com', phone: '+91 9812345678', role: 'ADMIN', createdAt: '2025-11-20' },
// ]

function loadUsers() {
    setLoading(true)
    setError('')
    fetchAdminUsers()
      .then((data) => {
        // Ensure data is an array before setting state
        setUsers(Array.isArray(data) ? data : [])
      })
      .catch((err) => {
        setError(err.message || 'Failed to load users')
        setUsers([])
      })
      .finally(() => setLoading(false))
  }

  useEffect(loadUsers, [])

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, selectedRole])

  async function handleRoleChange(userId, currentRole) {
    const newRole = currentRole === 'ADMIN' ? 'CUSTOMER' : 'ADMIN'
    if (!confirm(`Are you sure you want to change this user's role to ${newRole}?`)) return

    setUpdatingRoleId(userId)
    try {
      await updateUserRole(userId, newRole)
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      )
    } catch (err) {
      alert('Failed to update role: ' + err.message)
    } finally {
      setUpdatingRoleId(null)
    }
  }

  async function handleViewProfile(user) {
    setLoadingProfile(true)
    setSelectedUser(user)
    try {
      const detailedProfile = await fetchUserProfile(user.id)
      setSelectedUser(detailedProfile)
    } catch (err) {
      // Fall back to basic user data if detailed profile call is pending implementation
      console.warn('Could not load detailed profile, showing basic info', err)
    } finally {
      setLoadingProfile(false)
    }
  }

  // Filter Users
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.phone?.includes(searchQuery)
      const matchesRole = selectedRole ? u.role === selectedRole : true
      return matchesSearch && matchesRole
    })
  }, [users, searchQuery, selectedRole])

  // Paginate Users
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage) || 1
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredUsers.slice(start, start + itemsPerPage)
  }, [filteredUsers, currentPage, itemsPerPage])

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Users & Roles</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage registered customers, administrators, and permissions ({users.length} total)
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mt-6 flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-gray-200 pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
        </div>

        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          className="rounded-xl border border-gray-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
        >
          <option value="">All Roles</option>
          <option value="CUSTOMER">Customers</option>
          <option value="ADMIN">Admins</option>
        </select>
      </div>

      {error && <div className="mt-4 rounded-xl bg-red-50 p-4 text-sm text-red-600">{error}</div>}

      {/* Users Table */}
      {loading ? (
        <p className="mt-8 text-gray-500">Loading user accounts...</p>
      ) : (
        <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
              <tr>
                <th className="px-6 py-3">User</th>
                <th className="px-6 py-3">Contact</th>
                <th className="px-6 py-3">Role</th>
                <th className="px-6 py-3">Joined Date</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedUsers.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 font-medium text-gray-700">
                        {u.name ? u.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{u.name || 'Unnamed User'}</p>
                        <p className="text-xs text-gray-400">ID: #{u.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-gray-900">{u.email}</p>
                    {u.phone && <p className="text-xs text-gray-400">{u.phone}</p>}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      disabled={updatingRoleId === u.id}
                      onClick={() => handleRoleChange(u.id, u.role)}
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition ${
                        u.role === 'ADMIN'
                          ? 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                          : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                      }`}
                      title="Click to toggle role"
                    >
                      {u.role === 'ADMIN' ? <Shield size={13} /> : <UserCheck size={13} />}
                      {u.role || 'CUSTOMER'}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-IN') : 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleViewProfile(u)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 transition"
                    >
                      <Eye size={14} />
                      View Profile
                    </button>
                  </td>
                </tr>
              ))}
              {paginatedUsers.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-gray-400">
                    No matching users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination Controls Footer */}
          <div className="flex items-center justify-between border-t border-gray-200 px-6 py-3 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <span>Rows per page:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value))
                  setCurrentPage(1)
                }}
                className="rounded-lg border border-gray-200 px-2 py-1 text-xs focus:outline-none"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
            </div>

            <div className="flex items-center gap-4">
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <div className="flex items-center gap-1">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  className="rounded-lg p-1.5 hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-transparent"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  className="rounded-lg p-1.5 hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-transparent"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Customer Profile Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-900 font-bold text-white text-lg">
                  {selectedUser.name ? selectedUser.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div>
                  <h2 className="text-xl font-semibold">{selectedUser.name}</h2>
                  <span className="text-xs font-mono text-gray-400">User ID: #{selectedUser.id}</span>
                </div>
              </div>
              <button onClick={() => setSelectedUser(null)} className="text-gray-400 hover:text-gray-900">
                <X size={20} />
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <div className="grid grid-cols-2 gap-4 rounded-xl bg-gray-50 p-4 text-xs">
                <div className="flex items-center gap-2">
                  <Mail size={16} className="text-gray-400" />
                  <div>
                    <p className="text-gray-400">Email</p>
                    <p className="font-medium text-gray-900">{selectedUser.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={16} className="text-gray-400" />
                  <div>
                    <p className="text-gray-400">Phone</p>
                    <p className="font-medium text-gray-900">{selectedUser.phone || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Shield size={16} className="text-gray-400" />
                  <div>
                    <p className="text-gray-400">Current Role</p>
                    <p className="font-medium text-gray-900">{selectedUser.role || 'CUSTOMER'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-gray-400" />
                  <div>
                    <p className="text-gray-400">Registered</p>
                    <p className="font-medium text-gray-900">
                      {selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleDateString('en-IN') : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Order History Summary */}
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold flex items-center gap-2">
                    <ShoppingBag size={16} className="text-emerald-600" />
                    Recent Orders
                  </h3>
                  <span className="text-xs text-gray-400">
                    {selectedUser.orders?.length || 0} Total Orders
                  </span>
                </div>

                {loadingProfile ? (
                  <p className="mt-3 text-xs text-gray-400">Loading order history...</p>
                ) : selectedUser.orders && selectedUser.orders.length > 0 ? (
                  <div className="mt-3 space-y-2">
                    {selectedUser.orders.map((order) => (
                      <div key={order.id} className="flex items-center justify-between rounded-xl border border-gray-100 p-3 text-xs">
                        <div>
                          <p className="font-medium text-gray-900">Order #{order.orderNumber || order.id}</p>
                          <p className="text-gray-400">{new Date(order.createdAt).toLocaleDateString('en-IN')}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">₹{order.totalAmount?.toLocaleString('en-IN')}</p>
                          <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700">
                            {order.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-3 text-xs text-gray-400">No orders placed yet.</p>
                )}
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedUser(null)}
                className="rounded-full bg-gray-900 px-5 py-2 text-sm font-medium text-white hover:bg-gray-700 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminUsers