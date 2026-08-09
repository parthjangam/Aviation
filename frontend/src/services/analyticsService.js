import api from './api'

export async function getMonthlyDelay() {
  const response = await api.get('/analytics/monthly')
  return response.data
}

export async function getAirlineDelay() {
  const response = await api.get('/analytics/airlines')
  return response.data
}

export async function getHourlyDelay() {
  const response = await api.get('/analytics/hourly')
  return response.data
}

export async function getTopRoutes() {
  const response = await api.get('/analytics/routes')
  return response.data
}