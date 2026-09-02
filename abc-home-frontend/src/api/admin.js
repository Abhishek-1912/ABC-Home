import apiClient from './client'

// Products
export async function fetchAdminProducts() {
  const { data } = await apiClient.get('/admin/products')
  return data
}

export async function createProduct(payload) {
  const { data } = await apiClient.post('/admin/products', payload)
  return data
}

export async function updateProduct(id, payload) {
  const { data } = await apiClient.put(`/admin/products/${id}`, payload)
  return data
}

export async function deleteProduct(id) {
  await apiClient.delete(`/admin/products/${id}`)
}

export async function uploadProductImage(file) {
  const formData = new FormData()
  formData.append('file', file)
  const { data } = await apiClient.post('/admin/uploads/image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data.url
}

// Categories
export async function fetchAdminCategories() {
  const { data } = await apiClient.get('/admin/categories')
  return data
}

export async function createCategory(payload) {
  const { data } = await apiClient.post('/admin/categories', payload)
  return data
}

export async function deleteCategory(id) {
  await apiClient.delete(`/admin/categories/${id}`)
}

// Orders
export async function fetchAdminOrders() {
  const { data } = await apiClient.get('/admin/orders')
  return data
}

export async function updateOrderStatus(id, status) {
  const { data } = await apiClient.put(`/admin/orders/${id}/status`, { status })
  return data
}