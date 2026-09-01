import apiClient from './client'

export async function fetchProducts(params = {}) {
  const { data } = await apiClient.get('/products', { params })
  return data // Spring Page object: { content, totalElements, totalPages, ... }
}

export async function fetchProductBySlug(slug) {
  const { data } = await apiClient.get(`/products/${slug}`)
  return data
}

export async function fetchCategories() {
  const { data } = await apiClient.get('/categories')
  return data
}