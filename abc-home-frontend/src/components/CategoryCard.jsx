import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

function CategoryCard({
  name,
  description,
  image,
  slug,
  productCount,
}) {
  const categorySlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-')

  return (
    <Link
      to={`/products?category=${categorySlug}`}
      className="group relative overflow-hidden rounded-2xl bg-gray-100 shadow-sm transition hover:shadow-md"
    >
      <div className="aspect-[4/5] overflow-hidden">
        <img
          src={image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600'}
          alt={name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
      </div>

      {/* Optional Product Count Badge */}
      {productCount !== undefined && (
        <span className="absolute right-4 top-4 z-10 rounded-full bg-white/90 backdrop-blur-sm px-3 py-1 text-xs font-semibold text-gray-900 shadow-sm">
          {productCount} items
        </span>
      )}

      {/* Gradient Text Container */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 pt-24 text-white">
        <h3 className="text-xl font-semibold tracking-tight">
          {name}
        </h3>

        {description && (
          <p className="mt-1 text-sm text-white/80 line-clamp-1">
            {description}
          </p>
        )}

        {/* Hover Action Link */}
        <div className="mt-3 flex items-center space-x-1 text-xs font-medium text-white/90 opacity-0 transform translate-y-2 transition duration-300 group-hover:opacity-100 group-hover:translate-y-0">
          <span>Shop Collection</span>
          <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  )
}

export default CategoryCard