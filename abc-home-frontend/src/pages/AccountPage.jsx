import { useEffect, useState } from 'react'
import {
  LayoutDashboard,
  LogOut,
  Package,
  User,
  Heart,
  MapPin,
  ShieldCheck,
  Edit3,
  Check,
  X,
  Plus,
  Trash2,
} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'

import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useAuth } from '../context/AuthContext'
import { useWishlist } from '../context/WishlistContext'
import {
  fetchAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
} from '../api/addresses'

function AccountPage() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { wishlistCount } = useWishlist()

  // Profile state
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')

  // Address state (connected to backend API)
  const [addresses, setAddresses] = useState([])
  const [loadingAddresses, setLoadingAddresses] = useState(true)

  const [showAddressModal, setShowAddressModal] = useState(false)
  const [editingAddressId, setEditingAddressId] = useState(null)
  
  // Form fields aligned strictly with your backend AddressRequest DTO
  const [addressFormData, setAddressFormData] = useState({
    fullName: '',
    phone: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
    defaultAddress: false,
  })

  const [notification, setNotification] = useState('')

  // Fetch user data & addresses on mount
  useEffect(() => {
    if (!user) {
      navigate('/login')
    } else {
      setName(user.name || '')
      setEmail(user.email || '')
      setPhone(user.phone || '')

      loadUserAddresses()
    }
  }, [user, navigate])

  async function loadUserAddresses() {
    try {
      setLoadingAddresses(true)
      const data = await fetchAddresses()
      setAddresses(data || [])
    } catch (error) {
      console.error('Failed to fetch addresses', error)
      showToast('Could not load saved addresses.')
    } finally {
      setLoadingAddresses(false)
    }
  }

  if (!user) return null

  function showToast(msg) {
    setNotification(msg)
    setTimeout(() => setNotification(''), 3000)
  }

  function handleLogout() {
    logout()
    navigate('/')
  }

  // Profile Save
  function handleSaveProfile(e) {
    e.preventDefault()
    setIsEditingProfile(false)
    showToast('Profile details updated successfully!')
  }

  // Address Modal Helpers
  function openAddAddressModal() {
    setEditingAddressId(null)
    setAddressFormData({
      fullName: user.name || '',
      phone: phone || '',
      line1: '',
      line2: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'India',
      defaultAddress: addresses.length === 0,
    })
    setShowAddressModal(true)
  }

  function openEditAddressModal(addr) {
    setEditingAddressId(addr.id)
    setAddressFormData({
      fullName: addr.fullName || '',
      phone: addr.phone || '',
      line1: addr.line1 || '',
      line2: addr.line2 || '',
      city: addr.city || '',
      state: addr.state || '',
      postalCode: addr.postalCode || '',
      country: addr.country || 'India',
      defaultAddress: addr.defaultAddress || false,
    })
    setShowAddressModal(true)
  }

  async function handleDeleteAddress(id) {
    try {
      await deleteAddress(id)
      setAddresses((prev) => prev.filter((a) => a.id !== id))
      showToast('Address removed successfully.')
    } catch (error) {
      console.error('Failed to delete address', error)
      showToast('Error deleting address.')
    }
  }

  async function handleSetDefaultAddress(id) {
    try {
      const target = addresses.find((a) => a.id === id)
      if (!target) return

      const payload = {
        ...target,
        defaultAddress: true,
      }

      await updateAddress(id, payload)
      await loadUserAddresses() // Refresh list to reflect sort order
      showToast('Default address updated!')
    } catch (error) {
      console.error('Failed to update default address', error)
      showToast('Error updating default address.')
    }
  }

  async function handleSaveAddress(e) {
    e.preventDefault()

    try {
      if (editingAddressId) {
        await updateAddress(editingAddressId, addressFormData)
        showToast('Address updated successfully!')
      } else {
        await createAddress(addressFormData)
        showToast('New shipping address added!')
      }

      setShowAddressModal(false)
      loadUserAddresses()
    } catch (error) {
      console.error('Failed to save address', error)
      showToast('Error saving address. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col justify-between">
      <Navbar />

      <main className="mx-auto max-w-7xl w-full px-4 py-12 sm:px-6 lg:px-8 flex-grow">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-gray-100 pb-8">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              <ShieldCheck size={14} />
              Verified Account
            </span>
            <h1 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
              Welcome back, {user.name}
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Manage your profile, shipping addresses, wishlist, and past orders.
            </p>
          </div>

          <div className="mt-6 md:mt-0">
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 transition"
            >
              <LogOut size={16} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Toast Feedback Alert */}
        {notification && (
          <div className="mt-6 flex items-center gap-2 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800 border border-emerald-100 animate-fadeIn">
            <Check size={18} className="text-emerald-600" />
            <span>{notification}</span>
          </div>
        )}

        {/* Grid Navigation Cards */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          
          {/* Editable Profile Details Card */}
          <div className="rounded-3xl border border-gray-100 bg-gray-50/50 p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm text-gray-900">
                  <User size={22} />
                </div>
                {!isEditingProfile ? (
                  <button
                    onClick={() => setIsEditingProfile(true)}
                    className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-3 py-1.5 rounded-xl transition"
                  >
                    <Edit3 size={14} />
                    <span>Edit Profile</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setIsEditingProfile(false)}
                    className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-gray-900 bg-gray-200 px-3 py-1.5 rounded-xl transition"
                  >
                    <X size={14} />
                    <span>Cancel</span>
                  </button>
                )}
              </div>

              <h2 className="mt-5 text-lg font-bold text-gray-900">Profile Information</h2>

              {!isEditingProfile ? (
                <div className="mt-3 space-y-2 text-sm text-gray-600">
                  <p><strong className="text-gray-900">Name:</strong> {name}</p>
                  <p className="truncate"><strong className="text-gray-900">Email:</strong> {email}</p>
                  <p><strong className="text-gray-900">Phone:</strong> {phone || 'Not provided'}</p>
                </div>
              ) : (
                <form onSubmit={handleSaveProfile} className="mt-4 space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-gray-500">Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-600"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-gray-500">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-600"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-gray-500">Phone</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-600"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full mt-2 flex items-center justify-center gap-2 rounded-xl bg-gray-900 py-2.5 text-xs font-semibold text-white hover:bg-gray-800 transition"
                  >
                    <Check size={14} />
                    <span>Save Changes</span>
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Orders Link */}
          <Link
            to="/my-orders"
            className="group rounded-3xl border border-gray-100 bg-white p-6 shadow-sm transition hover:border-gray-300 hover:shadow-md flex flex-col justify-between"
          >
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100 text-gray-900 group-hover:bg-gray-900 group-hover:text-white transition">
                <Package size={22} />
              </div>
              <h2 className="mt-5 text-lg font-bold text-gray-900">My Orders</h2>
              <p className="mt-2 text-sm text-gray-500">
                View order history, track live shipments, and review past purchases.
              </p>
            </div>
            <div className="mt-6 text-xs font-semibold text-indigo-600 group-hover:underline">
              View all orders &rarr;
            </div>
          </Link>

          {/* Wishlist Link */}
          <Link
            to="/wishlist"
            className="group rounded-3xl border border-gray-100 bg-white p-6 shadow-sm transition hover:border-gray-300 hover:shadow-md flex flex-col justify-between"
          >
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-500 group-hover:bg-rose-500 group-hover:text-white transition">
                <Heart size={22} />
              </div>
              <h2 className="mt-5 text-lg font-bold text-gray-900">My Wishlist</h2>
              <p className="mt-2 text-sm text-gray-500">
                {wishlistCount > 0
                  ? `You have ${wishlistCount} item(s) saved in your wishlist.`
                  : 'Your wishlist is currently empty.'}
              </p>
            </div>
            <div className="mt-6 text-xs font-semibold text-indigo-600 group-hover:underline">
              Open wishlist &rarr;
            </div>
          </Link>

          {/* Admin Dashboard */}
          {user.role === 'ADMIN' && (
            <Link
              to="/admin"
              className="group rounded-3xl border border-indigo-100 bg-indigo-50/30 p-6 shadow-sm transition hover:bg-indigo-50/70 hover:shadow-md flex flex-col justify-between"
            >
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white">
                  <LayoutDashboard size={22} />
                </div>
                <h2 className="mt-5 text-lg font-bold text-gray-900">Admin Dashboard</h2>
                <p className="mt-2 text-sm text-gray-600">
                  Manage inventory products, review incoming orders, and modify site categories.
                </p>
              </div>
              <div className="mt-6 text-xs font-semibold text-indigo-700 group-hover:underline">
                Open panel &rarr;
              </div>
            </Link>
          )}

        </div>

        {/* FULL SHIPPING ADDRESS SECTION */}
        <div className="mt-12 rounded-3xl border border-gray-100 bg-white p-6 sm:p-8 shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 pb-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100 text-gray-900">
                <MapPin size={22} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Shipping Addresses</h2>
                <p className="text-xs text-gray-500">Manage your saved addresses for fast checkout</p>
              </div>
            </div>

            <button
              onClick={openAddAddressModal}
              className="flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2.5 text-xs font-semibold text-white hover:bg-gray-800 transition shadow-sm"
            >
              <Plus size={16} />
              <span>Add Address</span>
            </button>
          </div>

          {/* Address List */}
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {loadingAddresses ? (
              <div className="col-span-full py-8 text-center text-sm text-gray-400">
                Loading addresses...
              </div>
            ) : addresses.length === 0 ? (
              <div className="col-span-full py-8 text-center text-sm text-gray-500">
                No addresses saved yet. Click "Add Address" to create your first delivery location.
              </div>
            ) : (
              addresses.map((addr) => (
                <div
                  key={addr.id}
                  className={`relative flex flex-col justify-between rounded-2xl border p-5 transition ${
                    addr.defaultAddress
                      ? 'border-indigo-600 bg-indigo-50/20 shadow-sm'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="rounded-full bg-gray-100 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-gray-700">
                        {addr.country || 'India'}
                      </span>
                      {addr.defaultAddress && (
                        <span className="rounded-full bg-indigo-600 px-2.5 py-0.5 text-[10px] font-bold text-white">
                          Default
                        </span>
                      )}
                    </div>

                    <p className="mt-3 font-semibold text-gray-900">{addr.fullName}</p>
                    <p className="mt-1 text-xs text-gray-600 leading-relaxed">
                      {addr.line1} {addr.line2 ? `, ${addr.line2}` : ''}, {addr.city}, {addr.state} - {addr.postalCode}
                    </p>
                    <p className="mt-2 text-xs font-medium text-gray-500">Phone: {addr.phone}</p>
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-3">
                    {!addr.defaultAddress && (
                      <button
                        onClick={() => handleSetDefaultAddress(addr.id)}
                        className="text-xs font-semibold text-indigo-600 hover:underline"
                      >
                        Set as Default
                      </button>
                    )}
                    <div className="ml-auto flex items-center gap-3">
                      <button
                        onClick={() => openEditAddressModal(addr)}
                        className="text-gray-500 hover:text-gray-900 transition"
                        aria-label="Edit address"
                      >
                        <Edit3 size={15} />
                      </button>
                      <button
                        onClick={() => handleDeleteAddress(addr.id)}
                        className="text-rose-500 hover:text-rose-700 transition"
                        aria-label="Delete address"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      {/* ADD / EDIT ADDRESS MODAL */}
      {showAddressModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <h3 className="text-lg font-bold text-gray-900">
                {editingAddressId ? 'Edit Address' : 'Add New Address'}
              </h3>
              <button
                onClick={() => setShowAddressModal(false)}
                className="rounded-full bg-gray-100 p-2 text-gray-600 hover:bg-gray-200 transition"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveAddress} className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-gray-500">Full Name</label>
                  <input
                    type="text"
                    required
                    value={addressFormData.fullName}
                    onChange={(e) => setAddressFormData({ ...addressFormData, fullName: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-600"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase text-gray-500">Phone Number</label>
                  <input
                    type="text"
                    required
                    value={addressFormData.phone}
                    onChange={(e) => setAddressFormData({ ...addressFormData, phone: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-gray-500">Address Line 1</label>
                <input
                  type="text"
                  required
                  placeholder="House No, Apartment, Street name"
                  value={addressFormData.line1}
                  onChange={(e) => setAddressFormData({ ...addressFormData, line1: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-gray-500">Address Line 2 (Optional)</label>
                <input
                  type="text"
                  placeholder="Landmark, Suite, Unit"
                  value={addressFormData.line2}
                  onChange={(e) => setAddressFormData({ ...addressFormData, line2: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-600"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-gray-500">City</label>
                  <input
                    type="text"
                    required
                    value={addressFormData.city}
                    onChange={(e) => setAddressFormData({ ...addressFormData, city: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-600"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase text-gray-500">State</label>
                  <input
                    type="text"
                    required
                    value={addressFormData.state}
                    onChange={(e) => setAddressFormData({ ...addressFormData, state: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-600"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase text-gray-500">Postal Code</label>
                  <input
                    type="text"
                    required
                    value={addressFormData.postalCode}
                    onChange={(e) => setAddressFormData({ ...addressFormData, postalCode: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-gray-500">Country</label>
                <input
                  type="text"
                  required
                  value={addressFormData.country}
                  onChange={(e) => setAddressFormData({ ...addressFormData, country: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-600"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="defaultAddress"
                  checked={addressFormData.defaultAddress}
                  onChange={(e) => setAddressFormData({ ...addressFormData, defaultAddress: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="defaultAddress" className="text-xs text-gray-700 font-medium">
                  Set as default shipping address
                </label>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddressModal(false)}
                  className="w-1/2 rounded-xl border border-gray-200 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 rounded-xl bg-gray-900 py-2.5 text-xs font-semibold text-white hover:bg-gray-800 transition shadow-md"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}

export default AccountPage