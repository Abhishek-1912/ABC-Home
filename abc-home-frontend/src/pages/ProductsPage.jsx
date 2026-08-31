
import { useMemo, useState } from 'react'
import { Search, SlidersHorizontal } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'

import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ProductCard from '../components/ProductCard'

const products = [
  {
    id: 1,
    slug: 'ambient-rgb-light',
    name: 'Ambient RGB Light',
    category: 'Lighting',
    price: 1299,
    oldPrice: 1999,
    rating: 4.6,
    image:
      'https://images.unsplash.com/photo-1550537687-c91072c4792d?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 2,
    slug: 'minimal-table-lamp',
    name: 'Minimal Table Lamp',
    category: 'Lighting',
    price: 1499,
    oldPrice: 2299,
    rating: 4.8,
    image:
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 3,
    slug: 'motion-sensor-night-light',
    name: 'Motion Sensor Night Light',
    category: 'Lighting',
    price: 699,
    oldPrice: 999,
    rating: 4.5,
    image:
      'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 4,
    slug: 'modern-desk-organizer',
    name: 'Modern Desk Organizer',
    category: 'Organization',
    price: 799,
    oldPrice: 1199,
    rating: 4.7,
    image:
      'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 5,
    slug: 'multi-purpose-storage-rack',
    name: 'Multi Purpose Storage Rack',
    category: 'Organization',
    price: 1299,
    oldPrice: 1799,
    rating: 4.4,
    image:
      'https://images.unsplash.com/photo-1558997519-83ea9252edf8?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 6,
    slug: 'minimal-storage-box',
    name: 'Minimal Storage Box',
    category: 'Organization',
    price: 599,
    oldPrice: 899,
    rating: 4.5,
    image:
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 7,
    slug: 'decorative-table-piece',
    name: 'Decorative Table Piece',
    category: 'Decor',
    price: 999,
    oldPrice: 1499,
    rating: 4.8,
    image:
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 8,
    slug: 'modern-wall-decor',
    name: 'Modern Wall Decor',
    category: 'Decor',
    price: 1199,
    oldPrice: 1799,
    rating: 4.6,
    image:
      'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 9,
    slug: 'decorative-led-light',
    name: 'Decorative LED Light',
    category: 'Decor',
    price: 899,
    oldPrice: 1399,
    rating: 4.5,
    image:
      'https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 10,
    slug: 'premium-desk-mat',
    name: 'Premium Desk Mat',
    category: 'Lifestyle',
    price: 899,
    oldPrice: 1299,
    rating: 4.7,
    image:
      'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 11,
    slug: 'bedside-organizer',
    name: 'Bedside Organizer',
    category: 'Lifestyle',
    price: 749,
    oldPrice: 1099,
    rating: 4.5,
    image:
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 12,
    slug: 'minimal-desk-accessories',
    name: 'Minimal Desk Accessories',
    category: 'Lifestyle',
    price: 999,
    oldPrice: 1499,
    rating: 4.6,
    image:
      'https://images.unsplash.com/photo-1593642532973-d31b6557fa68?auto=format&fit=crop&w=800&q=80',
  },
]

const categories = [
  'All',
  'Lighting',
  'Organization',
  'Decor',
  'Lifestyle',
]

function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams()

  const initialCategory = searchParams.get('category') || 'All'
  const initialFilter = searchParams.get('filter') || 'all'

  const formattedInitialCategory =
    initialCategory.charAt(0).toUpperCase() +
    initialCategory.slice(1)

  const [selectedCategory, setSelectedCategory] =
    useState(
      categories.includes(formattedInitialCategory)
        ? formattedInitialCategory
        : 'All'
    )

  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('featured')
  const [mobileFiltersOpen, setMobileFiltersOpen] =
    useState(false)

  const filteredProducts = useMemo(() => {
    let result = [...products]

    /* Category filter */
    if (selectedCategory !== 'All') {
      result = result.filter(
        (product) =>
          product.category === selectedCategory
      )
    }

    /* Best sellers filter */
    if (initialFilter === 'best-sellers') {
      result = result.filter(
        (product) => product.rating >= 4.6
      )
    }

    /* Search */
    if (search.trim()) {
      const searchText = search
        .trim()
        .toLowerCase()

      result = result.filter(
        (product) =>
          product.name
            .toLowerCase()
            .includes(searchText) ||
          product.category
            .toLowerCase()
            .includes(searchText)
      )
    }

    /* Sorting */
    if (sort === 'price-low') {
      result.sort(
        (a, b) => a.price - b.price
      )
    }

    if (sort === 'price-high') {
      result.sort(
        (a, b) => b.price - a.price
      )
    }

    if (sort === 'rating') {
      result.sort(
        (a, b) => b.rating - a.rating
      )
    }

    return result
  }, [
    selectedCategory,
    search,
    sort,
    initialFilter,
  ])

  function handleCategoryChange(category) {
    setSelectedCategory(category)

    if (category === 'All') {
      setSearchParams({})
    } else {
      setSearchParams({
        category: category.toLowerCase(),
      })
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

      {/* Header */}
      <section className="border-b border-gray-100 bg-gray-50">

        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">

          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-400">
            ABC Home
          </p>

          <h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">
            Shop all products
          </h1>

          <p className="mt-4 max-w-2xl text-gray-500">
            Discover lighting, organization, decor and
            lifestyle products designed for modern homes.
          </p>

        </div>

      </section>

      {/* Main */}
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
              onChange={(event) =>
                setSearch(event.target.value)
              }
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

        {/* Mobile filter button */}
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

          {/* Sidebar */}
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
                  className={`block w-full rounded-lg px-4 py-3 text-left text-sm transition ${
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

          {/* Products */}
          <section>

            <div className="mb-6 flex items-center justify-between">

              <p className="text-sm text-gray-500">
                {filteredProducts.length}{' '}
                {filteredProducts.length === 1
                  ? 'product'
                  : 'products'}
              </p>

              {(selectedCategory !== 'All' ||
                search.trim() ||
                initialFilter !== 'all') && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-sm font-medium underline"
                >
                  Clear filter
                </button>
              )}

            </div>

            {filteredProducts.length === 0 ? (

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

                {filteredProducts.map(
                  (product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                    />
                  )
                )}

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