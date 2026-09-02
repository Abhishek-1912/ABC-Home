import { useEffect, useState, useMemo } from 'react'
import { 
  Plus, 
  Trash2, 
  Edit2, 
  X, 
  Search, 
  Image as ImageIcon, 
  FileSpreadsheet, 
  ArrowUpDown, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react'
import {
  fetchAdminProducts,
  fetchAdminCategories,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage,
} from '../api/admin'
import BulkUploadModal from '../components/BulkUploadModal'

const emptyForm = {
  id: null,
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

  // Image handling
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const [existingImages, setExistingImages] = useState([])

  // Filter & Search state
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')

  // Sorting state
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' })

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [error, setError] = useState('')

  // Bulk Upload Modal State
  const [showBulkModal, setShowBulkModal] = useState(false)

  function loadData() {
    setLoading(true)
    Promise.all([fetchAdminProducts(), fetchAdminCategories()])
      .then(([p, c]) => {
        setProducts(p)
        setCategories(c)
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(loadData, [])

  // Reset page to 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, selectedCategory])

  function handleImageChange(e) {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  function handleCloseModal() {
    setShowForm(false)
    setForm(emptyForm)
    setImageFile(null)
    setImagePreview('')
    setExistingImages([])
    setError('')
  }

  function handleEdit(product) {
    setForm({
      id: product.id,
      sku: product.sku || '',
      name: product.name || '',
      slug: product.slug || '',
      shortDescription: product.shortDescription || '',
      categoryId: product.categoryId || '',
      brand: product.brand || '',
      mrp: product.mrp || '',
      sellingPrice: product.sellingPrice || '',
      stockQuantity: product.stockQuantity || '',
      featured: product.featured || false,
      newArrival: product.newArrival || false,
    })
    setExistingImages(product.imageUrls || [])
    setShowForm(true)
  }

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

    if (Number(form.sellingPrice) > Number(form.mrp)) {
      setError('Selling price cannot be greater than MRP')
      return
    }

    setSaving(true)

    try {
      let imageUrls = [...existingImages]
      if (imageFile) {
        const uploadedUrl = await uploadProductImage(imageFile)
        imageUrls = [uploadedUrl, ...imageUrls]
      }

      const payload = {
        ...form,
        categoryId: Number(form.categoryId),
        mrp: Number(form.mrp),
        sellingPrice: Number(form.sellingPrice),
        stockQuantity: Number(form.stockQuantity),
        imageUrls,
        variants: [],
      }

      if (form.id) {
        await updateProduct(form.id, payload)
      } else {
        await createProduct(payload)
      }

      handleCloseModal()
      loadData()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

async function handleDelete(id) {
    if (!confirm('Deactivate this product? It will be hidden from the store.')) return
    setDeletingId(id)
    try {
      await deleteProduct(id)
      loadData()
    } catch (err) {
      alert('Failed to delete: ' + err.message)
    } finally {
      setDeletingId(null)
    }
  }

  // Sorting Handler
  function handleSort(key) {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }))
  }

  // 1. Filter Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku?.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory ? p.categoryId === Number(selectedCategory) : true
      return matchesSearch && matchesCategory
    })
  }, [products, searchQuery, selectedCategory])

  // 2. Sort Products
  const sortedProducts = useMemo(() => {
    const sorted = [...filteredProducts]
    if (!sortConfig.key) return sorted

    return sorted.sort((a, b) => {
      let valA = a[sortConfig.key] ?? ''
      let valB = b[sortConfig.key] ?? ''

      if (typeof valA === 'string') valA = valA.toLowerCase()
      if (typeof valB === 'string') valB = valB.toLowerCase()

      if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1
      if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1
      return 0
    })
  }, [filteredProducts, sortConfig])

  // 3. Paginate Products
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage) || 1
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return sortedProducts.slice(start, start + itemsPerPage)
  }, [sortedProducts, currentPage, itemsPerPage])

  return (
    <div className="p-6">
      {/* Header & Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Products</h1>
          <p className="mt-1 text-sm text-gray-500">
            Showing {filteredProducts.length} of {products.length} products
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowBulkModal(true)}
            className="flex items-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
          >
            <FileSpreadsheet size={16} className="text-emerald-600" />
            Bulk Import (.xlsx)
          </button>

          <button
            onClick={() => {
              setForm(emptyForm)
              setShowForm(true)
            }}
            className="flex items-center gap-2 rounded-full bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-700 transition"
          >
            <Plus size={16} />
            Add Product
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="mt-6 flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by name or SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-gray-200 pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="rounded-xl border border-gray-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Product Table */}
      {loading ? (
        <p className="mt-8 text-gray-500">Loading products...</p>
      ) : (
        <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
              <tr>
                <th className="px-6 py-3 cursor-pointer select-none" onClick={() => handleSort('name')}>
                  <div className="flex items-center gap-1">
                    Product
                    <ArrowUpDown size={14} className="text-gray-400" />
                  </div>
                </th>
                <th className="px-6 py-3 cursor-pointer select-none" onClick={() => handleSort('sku')}>
                  <div className="flex items-center gap-1">
                    SKU
                    <ArrowUpDown size={14} className="text-gray-400" />
                  </div>
                </th>
                <th className="px-6 py-3 cursor-pointer select-none" onClick={() => handleSort('categoryName')}>
                  <div className="flex items-center gap-1">
                    Category
                    <ArrowUpDown size={14} className="text-gray-400" />
                  </div>
                </th>
                <th className="px-6 py-3 cursor-pointer select-none" onClick={() => handleSort('sellingPrice')}>
                  <div className="flex items-center gap-1">
                    Price
                    <ArrowUpDown size={14} className="text-gray-400" />
                  </div>
                </th>
                <th className="px-6 py-3 cursor-pointer select-none" onClick={() => handleSort('stockQuantity')}>
                  <div className="flex items-center gap-1">
                    Stock
                    <ArrowUpDown size={14} className="text-gray-400" />
                  </div>
                </th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedProducts.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {p.imageUrls?.[0] ? (
                        <img src={p.imageUrls[0]} alt={p.name} className="h-10 w-10 rounded-lg object-cover" />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-gray-400">
                          <ImageIcon size={18} />
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-gray-900">{p.name}</p>
                        {p.brand && <p className="text-xs text-gray-400">{p.brand}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500 font-mono text-xs">{p.sku}</td>
                  <td className="px-6 py-4 text-gray-500">{p.categoryName}</td>
                  <td className="px-6 py-4 font-medium">₹{p.sellingPrice?.toLocaleString('en-IN')}</td>
                  <td className="px-6 py-4">{p.stockQuantity}</td>
                  <td className="px-6 py-4">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                      p.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => handleEdit(p)} className="p-1 text-gray-400 hover:text-indigo-600">
                        <Edit2 size={16} />
                      </button>
                      <button
                        disabled={deletingId === p.id}
                        onClick={() => handleDelete(p.id)}
                        className="p-1 text-gray-400 hover:text-red-600 disabled:opacity-50"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {paginatedProducts.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-gray-400">
                    No matching products found.
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
                <option value={50}>50</option>
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

      {/* Add / Edit Product Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">{form.id ? 'Edit Product' : 'Add Product'}</h2>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-900">
                <X size={20} />
              </button>
            </div>

            {error && <div className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="text-sm font-medium">Name</label>
                <input
                  required
                  name="name"
                  value={form.name}
                  onChange={(e) => {
                    handleChange(e)
                    if (!form.id) setForm((c) => ({ ...c, slug: autoSlug(e.target.value) }))
                  }}
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

              <div className="grid grid-cols-2 gap-4">
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
                  <label className="text-sm font-medium">Brand</label>
                  <input name="brand" value={form.brand} onChange={handleChange} className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm" />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Short description</label>
                <input name="shortDescription" value={form.shortDescription} onChange={handleChange} className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm" />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium">MRP (₹)</label>
                  <input required type="number" name="mrp" value={form.mrp} onChange={handleChange} className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm" />
                </div>
                <div>
                  <label className="text-sm font-medium">Selling Price (₹)</label>
                  <input required type="number" name="sellingPrice" value={form.sellingPrice} onChange={handleChange} className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm" />
                </div>
                <div>
                  <label className="text-sm font-medium">Stock</label>
                  <input required type="number" name="stockQuantity" value={form.stockQuantity} onChange={handleChange} className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm" />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Product Image</label>
                <input type="file" accept="image/*" onChange={handleImageChange} className="mt-1 w-full text-sm" />
                
                {(imagePreview || existingImages[0]) && (
                  <div className="mt-3 flex items-center gap-3">
                    <img
                      src={imagePreview || existingImages[0]}
                      alt="Preview"
                      className="h-16 w-16 rounded-xl border object-cover"
                    />
                    <span className="text-xs text-gray-500">
                      {imagePreview ? 'New image selected' : 'Current image'}
                    </span>
                  </div>
                )}
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
                className="w-full rounded-full bg-gray-900 px-6 py-3 text-sm font-medium text-white hover:bg-gray-700 disabled:opacity-60 transition"
              >
                {saving ? 'Saving...' : form.id ? 'Update Product' : 'Create Product'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Bulk Upload Modal */}
      {showBulkModal && (
        <BulkUploadModal
          onClose={() => setShowBulkModal(false)}
          onSuccess={loadData}
        />
      )}
    </div>
  )
}

export default AdminProducts