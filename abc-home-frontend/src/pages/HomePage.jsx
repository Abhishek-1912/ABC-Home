
import { ArrowRight, Heart } from 'lucide-react'
import { Link } from 'react-router-dom'

import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import CategoryCard from '../components/CategoryCard'
import ProductCard from '../components/ProductCard'

const categories = [
  {
    name: 'Lighting',
    description: 'Create the perfect atmosphere',
    image:
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80',
  },
  {
    name: 'Organization',
    description: 'Simple solutions for everyday life',
    image:
      'https://images.unsplash.com/photo-1558997519-83ea9252edf8?auto=format&fit=crop&w=900&q=80',
  },
  {
    name: 'Decor',
    description: 'Make your space feel like home',
    image:
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=900&q=80',
  },
  {
    name: 'Lifestyle',
    description: 'Designed for modern living',
    image:
      'https://images.unsplash.com/photo-1593642532973-d31b6557fa68?auto=format&fit=crop&w=900&q=80',
  },
]

const products = [
  {
    id: 1,
    name: 'Ambient RGB Light',
    category: 'Lighting',
    price: 1299,
    oldPrice: 1999,
    image:
      'https://images.unsplash.com/photo-1550537687-c91072c4792d?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 2,
    name: 'Minimal Table Lamp',
    category: 'Lighting',
    price: 1499,
    oldPrice: 2299,
    image:
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 3,
    name: 'Modern Desk Organizer',
    category: 'Organization',
    price: 799,
    oldPrice: 1199,
    image:
      'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 4,
    name: 'Decorative Table Piece',
    category: 'Decor',
    price: 999,
    oldPrice: 1499,
    image:
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80',
  },
]

function HomePage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">

      {/* Announcement Bar */}
      <div className="bg-gray-900 px-4 py-2 text-center text-sm text-white">
        Free shipping on orders above ₹999
      </div>

      {/* Reusable Navbar */}
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gray-100">
        <div className="mx-auto grid min-h-[620px] max-w-7xl items-center px-4 sm:px-6 lg:grid-cols-2 lg:px-8">

          <div className="relative z-10 py-16 lg:py-24">

            <p className="mb-5 text-sm font-semibold uppercase tracking-[0.25em] text-gray-500">
              Modern living, beautifully made
            </p>

            <h1 className="max-w-xl text-5xl font-semibold leading-tight tracking-tight sm:text-6xl">
              Make your home
              <span className="block font-light">
                feel like you.
              </span>
            </h1>

            <p className="mt-6 max-w-lg text-lg leading-8 text-gray-600">
              Discover thoughtful lighting, organization, decor and lifestyle
              essentials designed for modern Indian homes.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">

              {/* Shop Collection */}
              <Link
                to="/products"
                className="flex items-center gap-2 rounded-full bg-gray-900 px-7 py-3.5 text-sm font-medium text-white transition hover:bg-gray-700"
              >
                Shop Collection
                <ArrowRight size={17} />
              </Link>

              {/* Explore Categories */}
              <a
                href="#categories"
                className="rounded-full border border-gray-300 bg-white px-7 py-3.5 text-sm font-medium transition hover:bg-gray-50"
              >
                Explore Categories
              </a>

            </div>
          </div>

          <div className="relative hidden h-full min-h-[620px] lg:block">
            <img
              src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=85"
              alt="Modern home interior"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>

        </div>
      </section>

      {/* Categories */}
      <section
        id="categories"
        className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8"
      >

        <div className="mb-10 flex items-end justify-between">

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-400">
              Explore
            </p>

            <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              Shop by category
            </h2>
          </div>

          <Link
            to="/products"
            className="hidden items-center gap-2 text-sm font-medium sm:flex"
          >
            View all
            <ArrowRight size={16} />
          </Link>

        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

          {categories.map((category) => (
            <CategoryCard
              key={category.name}
              name={category.name}
              description={category.description}
              image={category.image}
            />
          ))}

        </div>
      </section>

      {/* Featured Products */}
      <section
        id="featured"
        className="bg-gray-50"
      >

        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">

          <div className="mb-10 flex items-end justify-between">

            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-400">
                Curated for you
              </p>

              <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
                Best sellers
              </h2>
            </div>

            <Link
              to="/products?filter=best-sellers"
              className="hidden items-center gap-2 text-sm font-medium sm:flex"
            >
              Shop all
              <ArrowRight size={16} />
            </Link>

          </div>


<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

  {products.map((product) => (
    <ProductCard
      key={product.id}
      product={product}
    />
  ))}

</div>

        </div>

      </section>

      {/* Brand Section */}
      <section
        id="about"
        className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8"
      >

        <div className="grid items-center gap-12 lg:grid-cols-2">

          <div>

            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-400">
              The ABC Home philosophy
            </p>

            <h2 className="mt-4 text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
              Beautiful things should also make everyday life better.
            </h2>

            <p className="mt-6 max-w-xl leading-8 text-gray-600">
              We believe great homes are built through small details. From
              ambient lighting to smart organization and thoughtful decor,
              ABC Home brings together products that make everyday spaces
              more comfortable, functional and beautiful.
            </p>

            <button className="mt-8 flex items-center gap-2 rounded-full border border-gray-300 px-6 py-3 text-sm font-medium transition hover:bg-gray-50">
              Discover ABC Home
              <ArrowRight size={16} />
            </button>

          </div>

          <div className="overflow-hidden rounded-3xl">

            <img
              src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=85"
              alt="ABC Home interior"
              className="aspect-[4/3] w-full object-cover"
            />

          </div>

        </div>

      </section>

      {/* Newsletter */}
      <section className="bg-gray-900 text-white">

        <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6">

          <h2 className="text-3xl font-semibold sm:text-4xl">
            Make your space better.
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-gray-400">
            Sign up for new arrivals, exclusive offers and inspiration for
            your home.
          </p>

          <div className="mx-auto mt-8 flex max-w-md overflow-hidden rounded-full bg-white p-1">

            <input
              type="email"
              placeholder="Your email address"
              className="min-w-0 flex-1 bg-transparent px-5 text-sm text-gray-900 outline-none"
            />

            <button className="rounded-full bg-gray-900 px-6 py-3 text-sm font-medium text-white">
              Subscribe
            </button>

          </div>

        </div>

      </section>

      {/* Footer */}
      <Footer />

    </div>
  )
}

export default HomePage
