import apiClient from './client'

export async function placeOrder({ addressId, paymentMethod, couponCode }) {
  const { data } = await apiClient.post('/orders', { addressId, paymentMethod, couponCode })
  return data
}

export async function fetchMyOrders() {
  const { data } = await apiClient.get('/orders')
  return data
}

export async function fetchOrderById(id) {
  const { data } = await apiClient.get(`/orders/${id}`)
  return data
}

export async function cancelOrder(id) {
  const { data } = await apiClient.post(`/orders/${id}/cancel`)
  return data
}

export async function returnOrder(id) {
  const { data } = await apiClient.post(`/orders/${id}/return`)
  return data
}