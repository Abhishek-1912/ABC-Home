// Converts the backend's ProductSummaryDto shape into what
// ProductCard.jsx / CategoryCard.jsx / etc. already expect.
export function adaptProductSummary(dto) {
  return {
    id: dto.id,
    slug: dto.slug,
    name: dto.name,
    category: dto.categoryName || '',
    price: dto.sellingPrice,
    oldPrice: dto.mrp > dto.sellingPrice ? dto.mrp : null,
    image: dto.primaryImageUrl || 'https://placehold.co/600x600?text=ABC+Home',
    rating: dto.averageRating || 0,
    reviewCount: dto.reviewCount || 0,    featured: dto.featured,
    newArrival: dto.newArrival,
  }
}

export function adaptProductDetail(dto) {
  return {
    id: dto.id,
    slug: dto.slug,
    name: dto.name,
    category: dto.categoryName,
    price: dto.sellingPrice,
    oldPrice: dto.mrp > dto.sellingPrice ? dto.mrp : null,
    image: dto.images?.[0]?.imageUrl || 'https://placehold.co/600x600?text=ABC+Home',
    images: dto.images?.map((i) => i.imageUrl) || [],
    description: dto.description,
    shortDescription: dto.shortDescription,
    stockQuantity: dto.stockQuantity,
    variants: dto.variants || [],
    rating: dto.averageRating || 0,
    reviewCount: dto.reviewCount || 0,  }
}