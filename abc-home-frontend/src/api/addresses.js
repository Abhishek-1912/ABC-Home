
import apiClient from './client'

export async function createAddress(payload) {
  const { data } = await apiClient.post('/addresses', payload)
  return data
}

export async function fetchAddresses() {
  const { data } = await apiClient.get('/addresses')
  return data
}

export async function updateAddress(id, payload) {
  const { data } = await apiClient.put(`/addresses/${id}`, payload)
  return data
}
