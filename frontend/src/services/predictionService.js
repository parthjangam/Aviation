import api from './api'

export async function getPredictions() {
  const response = await api.get('/predictions/')
  return response.data
}
