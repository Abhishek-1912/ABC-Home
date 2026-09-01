import apiClient from './client'

export async function placeOrder({ addressId, paymentMethod }) {
  const { data } = await apiClient.post('/orders', { addressId, paymentMethod })
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