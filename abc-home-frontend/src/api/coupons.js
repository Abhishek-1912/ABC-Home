import apiClient from './client'

export async function validateCoupon(code, subtotal) {
  const { data } = await apiClient.get('/coupons/validate', { params: { code, subtotal } })
  return data
}