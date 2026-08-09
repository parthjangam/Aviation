import api from './api'

const airlineLookup = {
  1: 'American Airlines',
  2: 'United Airlines',
  3: 'Delta Air Lines',
  4: 'JetBlue Airways',
  5: 'Southwest Airlines',
  6: 'Alaska Airlines',
}

const airportLookup = {
  1: 'ATL - Hartsfield-Jackson Atlanta',
  2: 'ORD - Chicago O’Hare',
  3: 'DFW - Dallas/Fort Worth',
  4: 'DEN - Denver',
  5: 'LAX - Los Angeles',
  6: 'JFK - New York',
  7: 'MIA - Miami',
  8: 'SEA - Seattle',
}

// Merge authoritative mappings from the backend when available.
export async function loadRemoteMetadata() {
  try {
    const res = await api.get('/metadata/')
    const { airlines = {}, origins = {}, dests = {} } = res.data || {}

    // Backend keys may be strings; coerce to numbers when merging
    Object.keys(airlines).forEach((k) => {
      const nk = Number(k)
      if (!Number.isNaN(nk)) airlineLookup[nk] = airlines[k]
    })

    Object.keys(origins).forEach((k) => {
      const nk = Number(k)
      if (!Number.isNaN(nk)) airportLookup[nk] = origins[k]
    })

    Object.keys(dests).forEach((k) => {
      const nk = Number(k)
      if (!Number.isNaN(nk)) airportLookup[nk] = dests[k]
    })
  } catch (err) {
    // Fail silently; fallbacks remain in place
    // eslint-disable-next-line no-console
    console.warn('Could not load remote metadata:', err)
  }
}

export function formatAirline(value) {
  return airlineLookup[value] || `Airline ${value}`
}

export function formatAirport(value) {
  return airportLookup[value] || `Airport ${value}`
}

export function formatRoute(origin, destination) {
  const originLabel = formatAirport(origin)
  const destinationLabel = formatAirport(destination)
  return `${originLabel} → ${destinationLabel}`
}

export function formatMonth(monthNumber) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const monthName = months[Number(monthNumber) - 1]
  return monthName || `Month ${monthNumber}`
}
