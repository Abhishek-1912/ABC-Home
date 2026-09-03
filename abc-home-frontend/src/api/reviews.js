import apiClient from './client'

export async function fetchReviews(productId) {
  const { data } = await apiClient.get(`/products/${productId}/reviews`)
  return data
}

export async function submitReview(productId, { rating, title, comment }) {
  const { data } = await apiClient.post(`/products/${productId}/reviews`, { rating, title, comment })
  return data
}

export async function deleteReview(reviewId) {
  await apiClient.delete(`/reviews/${reviewId}`)
}