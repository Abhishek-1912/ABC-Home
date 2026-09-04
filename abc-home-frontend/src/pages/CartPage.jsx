import {
  ArrowLeft,
  CreditCard,
  Lock,
  MapPin,
  Plus,
  ShoppingBag,
} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useCart } from '../context/CartContext'
import { createAddress, fetchAddresses } from '../api/addresses'
import { placeOrder } from '../api/orders'
import { validateCoupon } from '../api/coupons'

function CheckoutPage() {
  const navigate = useNavigate()

  const { cartItems, subtotal, shipping, total: cartTotal, refreshCart } = useCart()

  const [savedAddresses, setSavedAddresses] = useState([])
  const [loadingAddresses, setLoadingAddresses] = useState(true)
  const [selectedAddressId, setSelectedAddressId] = useState(null)
  const [addingNewAddress, setAddingNewAddress] = useState(false)

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
  const [error, setError] = useState('')

  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState(null)
  const [couponError, setCouponError] = useState('')
  const [applyingCoupon, setApplyingCoupon] = useState(false)

  const actualDiscount = appliedCoupon?.discountAmount || 0
  const total = cartTotal - actualDiscount

  useEffect(() => {
    fetchAddresses()
      .then((addresses) => {
        setSavedAddresses(addresses)
        if (addresses.length > 0) {
          const defaultAddr = addresses.find((a) => a.defaultAddress) || addresses[0]
          setSelectedAddressId(defaultAddr.id)
        } else {
          setAddingNewAddress(true) // no saved addresses — go straight to the form
        }
      })
      .catch(() => setAddingNewAddress(true))
      .finally(() => setLoadingAddresses(false))
  }, [])

  function handleChange(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  async function handleApplyCoupon() {
    if (!couponCode.trim()) return
    setCouponError('')
    setApplyingCoupon(true)
    try {
      const result = await validateCoupon(couponCode.trim(), subtotal)
      setAppliedCoupon(result)
    } catch (err) {
      setAppliedCoupon(null)
      setCouponError(err.message)
    } finally {
      setApplyingCoupon(false)
    }
  }

  function handleRemoveCoupon() {
    setAppliedCoupon(null)
    setCouponCode('')
    setCouponError('')
  }

  async function handlePlaceOrder(event) {
    event.preventDefault()

    if (cartItems.length === 0) {
      navigate('/products')
      return
    }

    setError('')
    setPlacingOrder(true)

    try {
      let addressId = selectedAddressId

      // Only create a new address if the user chose to add one
      if (addingNewAddress || !addressId) {
        const address = await createAddress({
          fullName: `${form.firstName} ${form.lastName}`.trim(),
          phone: form.phone,
          line1: form.address,
          city: form.city,
          state: form.state,
          postalCode: form.pincode,
          country: 'India',
          defaultAddress: savedAddresses.length === 0, // first address becomes default automatically
        })
        addressId = address.id
      }

      const order = await placeOrder({
        addressId,
        paymentMethod: paymentMethod === 'cod' ? 'COD' : 'ONLINE',
        couponCode: appliedCoupon?.code || null,
      })

      await refreshCart()

      navigate('/order-success', {
        state: { orderId: order.orderNumber, order },
      })
    } catch (err) {
      setError(err.message)
      setPlacingOrder(false)
    }
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-white text-gray-900">
        <Navbar />
        <main className="mx-auto max-w-7xl px-4 py-24 text-center sm:px-6 lg:px-8">
          <div className="mx-auto max-w-md">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
              <ShoppingBag size={32} strokeWidth={1.5} className="text-gray-500" />
            </div>
            <h1 className="mt-6 text-3xl font-semibold">Your cart is empty</h1>
            <p className="mt-3 text-gray-500">Add some products before checking out.</p>
            <Link to="/products" className="mt-8 inline-flex rounded-full bg-gray-900 px-7 py-3.5 text-sm font-medium text-white transition hover:bg-gray-700">
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
        <div className="mb-10">
          <Link to="/cart" className="inline-flex items-center gap-2 text-sm text-gray-500 transition hover:text-gray-900">
            <ArrowLeft size={16} />
            Back to cart
          </Link>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight">Checkout</h1>
          <p className="mt-2 text-gray-500">Complete your details to place your order.</p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
        )}

        <form onSubmit={handlePlaceOrder} className="grid gap-10 lg:grid-cols-[1fr_380px]">
          <div className="space-y-8">
            {/* Only show contact info fields when adding a brand new address */}
            {addingNewAddress && (
              <section className="rounded-2xl border border-gray-100 p-6">
                <h2 className="text-xl font-semibold">Contact information</h2>
                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium">First name</label>
                    <input required name="firstName" value={form.firstName} onChange={handleChange} className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-gray-400" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Last name</label>
                    <input required name="lastName" value={form.lastName} onChange={handleChange} className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-gray-400" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <input required type="email" name="email" value={form.email} onChange={handleChange} className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-gray-400" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Phone</label>
                    <input required type="tel" name="phone" value={form.phone} onChange={handleChange} className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-gray-400" />
                  </div>
                </div>
              </section>
            )}

            <section className="rounded-2xl border border-gray-100 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <MapPin size={20} />
                  <h2 className="text-xl font-semibold">Delivery address</h2>
                </div>

                {!addingNewAddress && savedAddresses.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setAddingNewAddress(true)}
                    className="flex items-center gap-1.5 text-sm font-medium text-gray-600 underline underline-offset-4 hover:text-gray-900"
                  >
                    <Plus size={14} />
                    Add new address
                  </button>
                )}
              </div>

              {loadingAddresses ? (
                <p className="mt-6 text-sm text-gray-400">Loading your addresses...</p>
              ) : !addingNewAddress ? (
                <div className="mt-6 space-y-3">
                  {savedAddresses.map((addr) => (
                    <label
                      key={addr.id}
                      className={`block cursor-pointer rounded-xl border p-4 transition ${
                        selectedAddressId === addr.id
                          ? 'border-gray-900 bg-gray-50'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="radio"
                          name="savedAddress"
                          checked={selectedAddressId === addr.id}
                          onChange={() => setSelectedAddressId(addr.id)}
                          className="mt-1"
                        />
                        <div className="text-sm">
                          <p className="font-medium">
                            {addr.fullName}
                            {addr.defaultAddress && (
                              <span className="ml-2 rounded-full bg-gray-900 px-2 py-0.5 text-xs text-white">
                                Default
                              </span>
                            )}
                          </p>
                          <p className="mt-1 text-gray-500">
                            {addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}, {addr.city}, {addr.state} - {addr.postalCode}
                          </p>
                          <p className="mt-1 text-gray-500">{addr.phone}</p>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              ) : (
                <div className="mt-6 space-y-5">
                  {savedAddresses.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setAddingNewAddress(false)}
                      className="text-sm text-gray-500 underline underline-offset-4 hover:text-gray-900"
                    >
                      ← Use a saved address instead
                    </button>
                  )}

                  <div>
                    <label className="text-sm font-medium">Address</label>
                    <textarea required name="address" value={form.address} onChange={handleChange} rows="3" placeholder="House number, street, area" className="mt-2 w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-gray-400" />
                  </div>
                  <div className="grid gap-5 sm:grid-cols-3">
                    <div>
                      <label className="text-sm font-medium">City</label>
                      <input required name="city" value={form.city} onChange={handleChange} className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-gray-400" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">State</label>
                      <input required name="state" value={form.state} onChange={handleChange} className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-gray-400" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">PIN code</label>
                      <input required inputMode="numeric" maxLength="6" name="pincode" value={form.pincode} onChange={handleChange} className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-gray-400" />
                    </div>
                  </div>
                </div>
              )}
            </section>

            <section className="rounded-2xl border border-gray-100 p-6">
              <div className="flex items-center gap-3">
                <CreditCard size={20} />
                <h2 className="text-xl font-semibold">Payment method</h2>
              </div>
              <div className="mt-6 space-y-3">
                <label className="flex cursor-pointer items-center gap-4 rounded-xl border border-gray-200 p-4 transition hover:bg-gray-50">
                  <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={(event) => setPaymentMethod(event.target.value)} />
                  <div>
                    <p className="text-sm font-medium">Cash on Delivery</p>
                    <p className="mt-1 text-xs text-gray-500">Pay when your order arrives.</p>
                  </div>
                </label>
                <label className="flex cursor-not-allowed items-center gap-4 rounded-xl border border-gray-200 p-4 opacity-50">
                  <input type="radio" name="payment" value="online" disabled />
                  <div>
                    <p className="text-sm font-medium">Online Payment</p>
                    <p className="mt-1 text-xs text-gray-500">Coming soon.</p>
                  </div>
                </label>
              </div>
            </section>
          </div>

          <aside>
            <div className="sticky top-28 rounded-2xl bg-gray-50 p-6">
              <h2 className="text-xl font-semibold">Order summary</h2>

              <div className="mt-6 space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl bg-white">
                      <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">{item.name}</p>
                      <p className="mt-1 text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-medium">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 border-t border-gray-200 pt-6">
                {appliedCoupon ? (
                  <div className="flex items-center justify-between rounded-xl bg-green-50 px-4 py-3 text-sm">
                    <span className="font-medium text-green-700">{appliedCoupon.code} applied</span>
                    <button type="button" onClick={handleRemoveCoupon} className="text-green-700 underline">
                      Remove
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="flex gap-2">
                      <input
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="Coupon code"
                        className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-gray-400"
                      />
                      <button
                        type="button"
                        onClick={handleApplyCoupon}
                        disabled={applyingCoupon}
                        className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-medium transition hover:bg-gray-50 disabled:opacity-60"
                      >
                        {applyingCoupon ? '...' : 'Apply'}
                      </button>
                    </div>
                    {couponError && <p className="mt-2 text-xs text-red-600">{couponError}</p>}
                  </div>
                )}
              </div>

              <div className="mt-6 space-y-4 border-t border-gray-200 pt-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Shipping</span>
                  <span>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
                </div>
                {actualDiscount > 0 && (
                  <div className="flex justify-between text-sm text-green-700">
                    <span>Discount</span>
                    <span>-₹{actualDiscount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between">
                    <span className="font-semibold">Total</span>
                    <span className="text-xl font-semibold">₹{total.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={placingOrder || loadingAddresses || (!addingNewAddress && !selectedAddressId)}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-gray-900 px-6 py-4 text-sm font-medium text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Lock size={16} />
                {placingOrder ? 'Placing order...' : 'Place order'}
              </button>

              <p className="mt-4 text-center text-xs text-gray-400">Your information is securely handled.</p>
            </div>
          </aside>
        </form>
      </main>

      <Footer />
    </div>
  )
}

export default CheckoutPage