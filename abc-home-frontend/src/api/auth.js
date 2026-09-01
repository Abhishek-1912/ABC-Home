import apiClient from './client'

export async function registerUser({ name, email, password }) {
  const { data } = await apiClient.post('/auth/register', {
    fullName: name,
    email,
    password,
  })
  return data
}

export async function loginUser({ email, password }) {
  const { data } = await apiClient.post('/auth/login', { email, password })
  return data
}