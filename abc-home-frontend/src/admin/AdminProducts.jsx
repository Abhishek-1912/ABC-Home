import { useEffect, useState } from 'react'
import { Plus, Trash2, X } from 'lucide-react'
import {
  fetchAdminProducts,
  fetchAdminCategories,
  createProduct,
  deleteProduct,
  uploadProductImage,
} from '../api/admin'

const emptyForm = {
  sku: '',
  name: '',
  slug: '',
  shortDescription: '',
  categoryId: '',
  brand: '',
  mrp: '',
  sellingPrice: '',
  stockQuantity: '',
  featured: false,
  newArrival: false,
}

function AdminProducts() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [imageFile, setImageFile] = useState(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function loadData() {
    setLoading(true)
    Promise.all([fetchAdminProducts(), fetchAdminCategories()])
      .then(([p, c]) => {
        setProducts(p)
        setCategories(c)
      })
      .finally(() => setLoading(false))
  }

  useEffect(loadData, [])

  function handleChange(event) {
    const { name, value, type, checked } = event.target
    setForm((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }))
  }

  function autoSlug(name) {
    return name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setSaving(true)

    try {
      let imageUrls = []
      if (imageFile) {
        const url = await uploadProductImage(imageFile)
        imageUrls = [url]
      }

      await createProduct({
        ...form,
        categoryId: Number(form.categoryId),
        mrp: Number(form.mrp),
        sellingPrice: Number(form.sellingPrice),
        stockQuantity: Number(form.stockQuantity),
        imageUrls,
        variants: [],
      })

      setForm(emptyForm)
      setImageFile(null)
      setShowForm(false)
      loadData()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    if (!confirm('Deactivate this product? It will be hidden from the store but order history is kept.')) return
    await deleteProduct(id)
    loadData()
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Products</h1>
          <p className="mt-2 text-gray-500">{products.length} products</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 rounded-full bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-700"
        >
          <Plus size={16} />
          Add Product
        </button>
      </div>

      {loading ? (
        <p className="mt-8 text-gray-500">Loading...</p>
      ) : (
        <div className="mt-8 overflow-hidden rounded-2xl border border-gray-200 bg-white">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-200 bg-gray-50 text-left text-xs uppercase tracking-wider text-gray-500">
              <tr>
                <th className="px-6 py-3">Product</th>
                <th className="px-6 py-3">SKU</th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3">Price</th>
                <th className="px-6 py-3">Stock</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((p) => (
                <tr key={p.id}>
                  <td className="px-6 py-4 font-medium">{p.name}</td>
                  <td className="px-6 py-4 text-gray-500">{p.sku}</td>
                  <td className="px-6 py-4 text-gray-500">{p.categoryName}</td>
                  <td className="px-6 py-4">₹{p.sellingPrice.toLocaleString('en-IN')}</td>
                  <td className="px-6 py-4">{p.stockQuantity}</td>
                  <td className="px-6 py-4">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                      p.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => handleDelete(p.id)} className="text-gray-400 hover:text-red-600">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-gray-400">
                    No products yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Add Product</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-900">
                <X size={20} />
              </button>
            </div>

            {error && <div className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="text-sm font-medium">Name</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => {
                    handleChange(e)
                    setForm((c) => ({ ...c, slug: autoSlug(e.target.value) }))
                  }}
                  name="name"
                  className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">SKU</label>
                  <input required name="sku" value={form.sku} onChange={handleChange} className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm" />
                </div>
                <div>
                  <label className="text-sm font-medium">Slug</label>
                  <input required name="slug" value={form.slug} onChange={handleChange} className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm" />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Category</label>
                <select required name="categoryId" value={form.categoryId} onChange={handleChange} className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm">
                  <option value="">Select category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium">Short description</label>
                <input name="shortDescription" value={form.shortDescription} onChange={handleChange} className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm" />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium">MRP</label>
                  <input required type="number" name="mrp" value={form.mrp} onChange={handleChange} className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm" />
                </div>
                <div>
                  <label className="text-sm font-medium">Price</label>
                  <input required type="number" name="sellingPrice" value={form.sellingPrice} onChange={handleChange} className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm" />
                </div>
                <div>
                  <label className="text-sm font-medium">Stock</label>
                  <input required type="number" name="stockQuantity" value={form.stockQuantity} onChange={handleChange} className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm" />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Product image</label>
                <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} className="mt-1 w-full text-sm" />
              </div>

              <div className="flex gap-6">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} />
                  Featured
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" name="newArrival" checked={form.newArrival} onChange={handleChange} />
                  New Arrival
                </label>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full rounded-full bg-gray-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-gray-700 disabled:opacity-60"
              >
                {saving ? 'Saving...' : 'Create Product'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminProducts