import apiClient from './client'

export async function fetchWishlist() {
  const { data } = await apiClient.get('/wishlist')
  return data
}

export async function addToWishlistApi(productId) {
  await apiClient.post('/wishlist', { productId })
}

export async function removeFromWishlistApi(productId) {
  await apiClient.delete(`/wishlist/${productId}`)
}