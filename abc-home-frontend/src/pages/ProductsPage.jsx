import { useEffect, useMemo, useState } from 'react'
import { Search, SlidersHorizontal } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'

import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ProductCard from '../components/ProductCard'
import { fetchProducts, fetchCategories } from '../api/products'
import { adaptProductSummary } from '../utils/adaptProduct'

function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams()

  const initialCategory = searchParams.get('category') || 'All'
  const initialFilter = searchParams.get('filter') || 'all'

  const [selectedCategory, setSelectedCategory] = useState(initialCategory)
  const [categories, setCategories] = useState(['All'])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('featured')
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  // Load categories once, for the sidebar
  useEffect(() => {
    fetchCategories()
      .then((data) => setCategories(['All', ...data.map((c) => c.slug)]))
      .catch(() => setCategories(['All']))
  }, [])

  // Refetch products whenever filters change
  useEffect(() => {
    setLoading(true)
    setError('')

    const params = {}
    if (selectedCategory !== 'All') params.category = selectedCategory
    if (search.trim()) params.search = search.trim()
    if (sort === 'price-low') {
      params.sortBy = 'sellingPrice'
      params.sortDir = 'asc'
    } else if (sort === 'price-high') {
      params.sortBy = 'sellingPrice'
      params.sortDir = 'desc'
    }
    params.size = 50 // simple approach for now; real pagination can come later

    fetchProducts(params)
      .then((page) => {
        setProducts(page.content.map(adaptProductSummary))
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [selectedCategory, search, sort])

  const filteredProducts = useMemo(() => {
    if (initialFilter === 'best-sellers') {
      return products.filter((p) => p.featured)
    }
    return products
  }, [products, initialFilter])

  function handleCategoryChange(category) {
    setSelectedCategory(category)

    if (category === 'All') {
      setSearchParams({})
    } else {
      setSearchParams({ category })
    }

    setMobileFiltersOpen(false)
  }

  function clearFilters() {
    setSearch('')
    setSelectedCategory('All')
    setSearchParams({})
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navbar />

      <section className="border-b border-gray-100 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-400">
            ABC Home
          </p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">
            Shop all products
          </h1>
          <p className="mt-4 max-w-2xl text-gray-500">
            Discover lighting, organization, decor and lifestyle products designed for modern homes.
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-md">
            <Search size={19} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search products..."
              className="w-full rounded-full border border-gray-200 bg-white py-3 pl-11 pr-5 text-sm outline-none transition focus:border-gray-400"
            />
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">Sort by</span>
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              className="rounded-full border border-gray-200 bg-white px-5 py-3 text-sm outline-none"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setMobileFiltersOpen((current) => !current)}
          className="mt-6 flex items-center gap-2 rounded-full border border-gray-200 px-5 py-3 text-sm font-medium lg:hidden"
        >
          <SlidersHorizontal size={17} />
          Categories
        </button>

        <div className="mt-10 grid gap-10 lg:grid-cols-[220px_1fr]">
          <aside className={mobileFiltersOpen ? 'block' : 'hidden lg:block'}>
            <h2 className="font-semibold">Categories</h2>
            <div className="mt-5 space-y-2">
              {categories.map((category) => (
                <button
                  type="button"
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`block w-full rounded-lg px-4 py-3 text-left text-sm capitalize transition ${
                    selectedCategory === category
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </aside>

          <section>
            {error && (
              <div className="mb-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-gray-500">
                {loading ? 'Loading...' : `${filteredProducts.length} ${filteredProducts.length === 1 ? 'product' : 'products'}`}
              </p>

              {(selectedCategory !== 'All' || search.trim()) && (
                <button type="button" onClick={clearFilters} className="text-sm font-medium underline">
                  Clear filter
                </button>
              )}
            </div>

            {!loading && filteredProducts.length === 0 ? (
              <div className="rounded-2xl bg-gray-50 py-20 text-center">
                <h2 className="text-xl font-semibold">No products found</h2>
                <p className="mt-2 text-gray-500">Try another search or category.</p>
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-6 rounded-full bg-gray-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-gray-700"
                >
                  View all products
                </button>
              </div>
            ) : (
              <div className="grid gap-x-5 gap-y-10 sm:grid-cols-2 xl:grid-cols-3">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default ProductsPage