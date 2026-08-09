import { useEffect, useState } from 'react'

import { Box, Grid } from '@mui/material'

import MonthlyDelayChart from '../components/MonthlyDelayChart'
import AirlineDelayChart from '../components/AirlineDelayChart'
import HourlyDelayChart from '../components/HourlyDelayChart'
import RouteDelayChart from '../components/RouteDelayChart'
import ChartCard from '../components/ChartCard'
import EmptyState from '../components/EmptyState'
import ErrorState from '../components/ErrorState'
import LoadingCard from '../components/LoadingCard'
import PageHeader from '../components/PageHeader'
import { getAirlineDelay, getHourlyDelay, getMonthlyDelay, getTopRoutes } from '../services/analyticsService'

function Analytics() {
  const [monthlyData, setMonthlyData] = useState([])
  const [airlineData, setAirlineData] = useState([])
  const [hourlyData, setHourlyData] = useState([])
  const [routeData, setRouteData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadAnalytics() {
      setLoading(true)
      setError('')

      try {
        const [monthlyResponse, airlineResponse, hourlyResponse, routeResponse] = await Promise.all([
          getMonthlyDelay(),
          getAirlineDelay(),
          getHourlyDelay(),
          getTopRoutes(),
        ])

        setMonthlyData(monthlyResponse)
        setAirlineData(airlineResponse)
        setHourlyData(hourlyResponse)
        setRouteData(routeResponse)
      } catch (err) {
        setError('Analytics data could not be loaded.')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadAnalytics()
  }, [])

  if (loading) {
    return (
      <Box>
        <PageHeader title="Analytics" description="Deeper flight delay performance analysis across time, airlines, hours and routes." />
        <Grid container spacing={3}>
          {[1, 2, 3, 4].map((item) => (
            <Grid key={item} size={{ xs: 12, lg: 6 }}>
              <LoadingCard lines={4} />
            </Grid>
          ))}
        </Grid>
      </Box>
    )
  }

  if (error) {
    return (
      <Box>
        <PageHeader title="Analytics" description="Deeper flight delay performance analysis across time, airlines, hours and routes." />
        <ErrorState title="Analytics unavailable" message={error} />
      </Box>
    )
  }

  return (
    <Box>
      <PageHeader title="Analytics" description="Deeper flight delay performance analysis across time, airlines, hours and routes." />

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 6 }}>
          <ChartCard title="Monthly Delay">
            {monthlyData.length ? <MonthlyDelayChart data={monthlyData} /> : <EmptyState title="No monthly data available." message="No monthly delay values were returned by the backend." />}
          </ChartCard>
        </Grid>

        <Grid size={{ xs: 12, lg: 6 }}>
          <ChartCard title="Airline Performance">
            {airlineData.length ? <AirlineDelayChart data={airlineData} /> : <EmptyState title="No airline data available." message="No airline performance data was returned." />}
          </ChartCard>
        </Grid>

        <Grid size={{ xs: 12, lg: 6 }}>
          <ChartCard title="Hourly Performance">
            {hourlyData.length ? <HourlyDelayChart data={hourlyData} /> : <EmptyState title="No hourly data available." message="No hourly delay measurements were returned." />}
          </ChartCard>
        </Grid>

        <Grid size={{ xs: 12, lg: 6 }}>
          <ChartCard title="Top Delayed Routes">
            {routeData.length ? <RouteDelayChart data={routeData} /> : <EmptyState title="No route data available." message="No route-level delay values were returned." />}
          </ChartCard>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Analytics
