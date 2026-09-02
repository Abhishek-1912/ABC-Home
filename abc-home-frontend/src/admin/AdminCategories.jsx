import { useEffect, useState } from 'react'
import { Plus, Trash2, X } from 'lucide-react'
import { fetchAdminCategories, createCategory, deleteCategory } from '../api/admin'

function AdminCategories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
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

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setSaving(true)
    try {
      await createCategory({ name, slug, displayOrder: categories.length })
      setName('')
      setSlug('')
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

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Categories</h1>
          <p className="mt-2 text-gray-500">{categories.length} categories</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 rounded-full bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-700"
        >
          <Plus size={16} />
          Add Category
        </button>
      </div>

      {loading ? (
        <p className="mt-8 text-gray-500">Loading...</p>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => (
            <div key={c.id} className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-5">
              <div>
                <p className="font-medium">{c.name}</p>
                <p className="mt-1 text-sm text-gray-400">/{c.slug}</p>
              </div>
              <button onClick={() => handleDelete(c.id)} className="text-gray-400 hover:text-red-600">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          {categories.length === 0 && <p className="text-gray-400">No categories yet.</p>}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Add Category</h2>
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
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value)
                    setSlug(autoSlug(e.target.value))
                  }}
                  className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Slug</label>
                <input required value={slug} onChange={(e) => setSlug(e.target.value)} className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm" />
              </div>
              <button
                type="submit"
                disabled={saving}
                className="w-full rounded-full bg-gray-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-gray-700 disabled:opacity-60"
              >
                {saving ? 'Saving...' : 'Create Category'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminCategories