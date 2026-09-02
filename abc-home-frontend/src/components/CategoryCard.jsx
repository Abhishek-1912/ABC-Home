import { Link } from 'react-router-dom'


function CategoryCard({
  name,
  description,
  image,
  slug,
}) {
  return (
    <Link
      to={`/products?category=${slug || name.toLowerCase()}`}
      className="group relative overflow-hidden rounded-2xl bg-gray-100"
    >
      <div className="aspect-[4/5] overflow-hidden">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
      </div>

      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-6 pt-20 text-white">

        <h3 className="text-xl font-semibold">
          {name}
        </h3>

        <p className="mt-1 text-sm text-white/80">
          {description}
        </p>

      </div>
    </Link>
  )
}

export default CategoryCard