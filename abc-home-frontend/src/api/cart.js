import apiClient from './client'

export async function fetchCart() {
  const { data } = await apiClient.get('/cart')
  return data
}

export async function addCartItem({ productId, variantId, quantity }) {
  const { data } = await apiClient.post('/cart/items', { productId, variantId, quantity })
  return data
}

export async function updateCartItemQuantity(cartItemId, quantity) {
  const { data } = await apiClient.put(`/cart/items/${cartItemId}`, null, { params: { quantity } })
  return data
}

export async function removeCartItem(cartItemId) {
  const { data } = await apiClient.delete(`/cart/items/${cartItemId}`)
  return data
}

export async function clearCartApi() {
  const { data } = await apiClient.delete('/cart')
  return data
}