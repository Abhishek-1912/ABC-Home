import { useEffect, useState } from 'react'
import { Plus, Trash2, Edit2, X } from 'lucide-react'
import { fetchAdminCategories, createCategory, updateCategory, deleteCategory } from '../api/admin'

function AdminCategories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  
  // Form states
  const [editingId, setEditingId] = useState(null)
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [parentId, setParentId] = useState('')
  
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  function loadData() {
    setLoading(true)
    fetchAdminCategories().then(setCategories).finally(() => setLoading(false))
  }

  useEffect(loadData, [])

  function autoSlug(value) {
    return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  }

  function handleOpenCreate() {
    setEditingId(null)
    setName('')
    setSlug('')
    setParentId('')
    setError('')
    setShowForm(true)
  }

  function handleOpenEdit(cat) {
    setEditingId(cat.id)
    setName(cat.name || '')
    setSlug(cat.slug || '')
    setParentId(cat.parentId || '')
    setError('')
    setShowForm(true)
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setSaving(true)
    try {
      const payload = { 
        name, 
        slug, 
        parentId: parentId ? Number(parentId) : null,
        displayOrder: editingId ? undefined : categories.length 
      }

      if (editingId) {
        await updateCategory(editingId, payload)
      } else {
        await createCategory(payload)
      }

      setShowForm(false)
      loadData()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this category? This fails if any product still uses it.')) return
    try {
      await deleteCategory(id)
      loadData()
    } catch (err) {
      alert(err.message)
    }
  }

  // Find parent category name for display
  const getParentName = (pId) => {
    const parent = categories.find(c => c.id === pId)
    return parent ? parent.name : null
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Categories</h1>
          <p className="mt-2 text-gray-500">{categories.length} total categories</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 rounded-full bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-700 shadow-sm"
        >
          <Plus size={16} />
          Add Category
        </button>
      </div>

      {loading ? (
        <p className="mt-8 text-gray-500">Loading categories...</p>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => {
            const parentName = getParentName(c.parentId)
            return (
              <div key={c.id} className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <div>
                  <div className="flex items-center space-x-2">
                    <p className="font-semibold text-gray-900">{c.name}</p>
                    {parentName && (
                      <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-[10px] font-medium text-indigo-600">
                        Sub of {parentName}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-gray-400">/{c.slug}</p>
                  <p className="mt-2 text-xs font-medium text-gray-500">
                    {c.productCount ?? c.productsCount ?? 0} products attached
                  </p>
                </div>
                
                <div className="flex items-center space-x-1">
                  <button onClick={() => handleOpenEdit(c)} className="p-2 text-gray-400 hover:text-indigo-600 transition">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => handleDelete(c.id)} className="p-2 text-gray-400 hover:text-red-600 transition">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            )
          })}
          {categories.length === 0 && <p className="text-gray-400">No categories yet.</p>}
        </div>
      )}

      {/* Modal Form for Create / Edit */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <h2 className="text-xl font-semibold">{editingId ? 'Edit Category' : 'Add Category'}</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-900">
                <X size={20} />
              </button>
            </div>

            {error && <div className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Name</label>
                <input
                  required
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value)
                    if (!editingId) setSlug(autoSlug(e.target.value))
                  }}
                  className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Slug</label>
                <input 
                  required 
                  value={slug} 
                  onChange={(e) => setSlug(e.target.value)} 
                  className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900" 
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Parent Category (Optional)</label>
                <select
                  value={parentId}
                  onChange={(e) => setParentId(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-900 cursor-pointer"
                >
                  <option value="">None (Top-Level Category)</option>
                  {categories
                    .filter((c) => c.id !== editingId) // Prevent self-parenting
                    .map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full rounded-full bg-gray-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-gray-700 disabled:opacity-60 shadow-md"
              >
                {saving ? 'Saving...' : editingId ? 'Update Category' : 'Create Category'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminCategories