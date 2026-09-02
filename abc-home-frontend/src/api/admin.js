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

export async function bulkUploadProducts(file) {
  const formData = new FormData()
  formData.append('file', file)
  const { data } = await apiClient.post('/admin/products/bulk-upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
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

// Inside src/api/admin.js

// ... your existing imports and api setup ...

export async function updateCategory(id, categoryData) {
  const response = await fetch(`/api/admin/categories/${id}`, {
    method: 'PUT', // or 'PATCH' depending on your backend route
    headers: {
      'Content-Type': 'application/json',
      // 'Authorization': `Bearer ${token}` // Include your auth headers if needed
    },
    body: JSON.stringify(categoryData),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || 'Failed to update category')
  }

  return response.json()
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

export async function fetchAdminOrderDetails(id) {
  const { data } = await apiClient.get(`/admin/orders/${id}`)
  return data
}

// Users
export async function fetchAdminUsers() {
  const { data } = await apiClient.get('/admin/users')
  return data
}

export async function fetchUserProfile(userId) {
  const { data } = await apiClient.get(`/admin/users/${userId}`)
  return data
}

export async function updateUserRole(userId, newRole) {
  const { data } = await apiClient.patch(`/admin/users/${userId}/role`, { role: newRole })
  return data
}