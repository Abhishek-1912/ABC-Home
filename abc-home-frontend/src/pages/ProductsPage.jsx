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

  const urlCategory = searchParams.get('category') || 'All'
  const urlSearch = searchParams.get('search') || ''
  const urlFilter = searchParams.get('filter') || 'all'

  const [selectedCategory, setSelectedCategory] = useState(urlCategory)
  const [categories, setCategories] = useState(['All'])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [search, setSearch] = useState(urlSearch)
  const [sort, setSort] = useState('featured')
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  /*
   * Keep local state synchronized with URL.
   *
   * This is important because Navbar can change:
   * /products?category=Lighting
   * /products?search=lamp
   * /products?filter=best-sellers
   */
  useEffect(() => {
    setSelectedCategory(urlCategory)
    setSearch(urlSearch)
  }, [urlCategory, urlSearch])

  /*
   * Load categories once
   */
  useEffect(() => {
    fetchCategories()
      .then((data) => {
        setCategories([
          'All',
          ...data.map((category) => category.slug),
        ])
      })
      .catch(() => {
        setCategories(['All'])
      })
  }, [])

  /*
   * Refetch products whenever category,
   * search or sorting changes.
   */
  useEffect(() => {
    setLoading(true)
    setError('')

    const params = {}

    if (selectedCategory !== 'All') {
      params.category = selectedCategory
    }

    if (search.trim()) {
      params.search = search.trim()
    }

    if (sort === 'price-low') {
      params.sortBy = 'sellingPrice'
      params.sortDir = 'asc'
    } else if (sort === 'price-high') {
      params.sortBy = 'sellingPrice'
      params.sortDir = 'desc'
    }

    params.size = 50

    fetchProducts(params)
      .then((page) => {
        setProducts(
          page.content.map(adaptProductSummary)
        )
      })
      .catch((err) => {
        setError(err.message)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [selectedCategory, search, sort])

  /*
   * Best seller filter
   */
  const filteredProducts = useMemo(() => {
    if (urlFilter === 'best-sellers') {
      return products.filter((product) => product.featured)
    }

    return products
  }, [products, urlFilter])

  /*
   * New arrivals filter
   *
   * If your backend/product model doesn't currently
   * provide a new-arrival field, we leave the products
   * unchanged rather than guessing.
   */
  const displayedProducts = useMemo(() => {
    return filteredProducts
  }, [filteredProducts])

  /*
   * Category change
   */
  function handleCategoryChange(category) {
    setSelectedCategory(category)

    const nextParams = {}

    if (category !== 'All') {
      nextParams.category = category
    }

    if (search.trim()) {
      nextParams.search = search.trim()
    }

    setSearchParams(nextParams)
    setMobileFiltersOpen(false)
  }

  /*
   * Search change
   */
  function handleSearchChange(event) {
    const value = event.target.value

    setSearch(value)

    const nextParams = {}

    if (selectedCategory !== 'All') {
      nextParams.category = selectedCategory
    }

    if (value.trim()) {
      nextParams.search = value.trim()
    }

    setSearchParams(nextParams)
  }

  /*
   * Clear all filters
   */
  function clearFilters() {
    setSearch('')
    setSelectedCategory('All')
    setSearchParams({})
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">

      <Navbar />


      {/* Hero */}

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


      {/* Products */}

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">


        {/* Search + Sort */}

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

          {/* Search */}

          <div className="relative w-full lg:max-w-md">

            <Search
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={search}
              onChange={handleSearchChange}
              placeholder="Search products..."
              className="w-full rounded-full border border-gray-200 bg-white py-3 pl-11 pr-5 text-sm outline-none transition focus:border-gray-400"
            />

          </div>


          {/* Sort */}

          <div className="flex items-center gap-3">

            <span className="text-sm text-gray-500">
              Sort by
            </span>

            <select
              value={sort}
              onChange={(event) =>
                setSort(event.target.value)
              }
              className="rounded-full border border-gray-200 bg-white px-5 py-3 text-sm outline-none"
            >

              <option value="featured">
                Featured
              </option>

              <option value="price-low">
                Price: Low to High
              </option>

              <option value="price-high">
                Price: High to Low
              </option>

              <option value="rating">
                Top Rated
              </option>

            </select>

          </div>

        </div>


        {/* Mobile Filters */}

        <button
          type="button"
          onClick={() =>
            setMobileFiltersOpen(
              (current) => !current
            )
          }
          className="mt-6 flex items-center gap-2 rounded-full border border-gray-200 px-5 py-3 text-sm font-medium lg:hidden"
        >

          <SlidersHorizontal size={17} />

          Categories

        </button>


        <div className="mt-10 grid gap-10 lg:grid-cols-[220px_1fr]">


          {/* Categories */}

          <aside
            className={
              mobileFiltersOpen
                ? 'block'
                : 'hidden lg:block'
            }
          >

            <h2 className="font-semibold">
              Categories
            </h2>

            <div className="mt-5 space-y-2">

              {categories.map((category) => (

                <button
                  type="button"
                  key={category}
                  onClick={() =>
                    handleCategoryChange(category)
                  }
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


          {/* Product Section */}

          <section>

            {/* Error */}

            {error && (
              <div className="mb-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}


            {/* Result Count */}

            <div className="mb-6 flex items-center justify-between">

              <p className="text-sm text-gray-500">

                {loading
                  ? 'Loading...'
                  : `${displayedProducts.length} ${
                      displayedProducts.length === 1
                        ? 'product'
                        : 'products'
                    }`}

              </p>


              {(selectedCategory !== 'All' ||
                search.trim() ||
                urlFilter !== 'all') && (

                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-sm font-medium underline"
                >
                  Clear filter
                </button>

              )}

            </div>


            {/* Empty State */}

            {!loading &&
            displayedProducts.length === 0 ? (

              <div className="rounded-2xl bg-gray-50 py-20 text-center">

                <h2 className="text-xl font-semibold">
                  No products found
                </h2>

                <p className="mt-2 text-gray-500">
                  Try another search or category.
                </p>

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

                {displayedProducts.map((product) => (

                  <ProductCard
                    key={product.id}
                    product={product}
                  />

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