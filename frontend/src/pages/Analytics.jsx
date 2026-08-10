import { useEffect, useMemo, useState } from 'react'

import {
  Alert,
  Box,
  Card,
  CardContent,
  Grid,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material'

import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import InsightsIcon from '@mui/icons-material/Insights'

import MonthlyDelayChart from '../components/MonthlyDelayChart'
import AirlineDelayChart from '../components/AirlineDelayChart'
import HourlyDelayChart from '../components/HourlyDelayChart'
import ChartCard from '../components/ChartCard'
import StatCard from '../components/StatCard'
import RouteDelayChart from '../components/RouteDelayChart'
import ErrorState from '../components/ErrorState'
import EmptyState from '../components/EmptyState'
import LoadingCard from '../components/LoadingCard'
import PageHeader from '../components/PageHeader'
import { getDashboard } from '../services/dashboardService'
import {
  getAirlineDelay,
  getHourlyDelay,
  getTopRoutes,
} from '../services/analyticsService'
import { formatAirline, formatMonth } from '../services/metadataService'

const REFRESH_INTERVAL = 5000

function Dashboard() {
  const [dashboard, setDashboard] = useState(null)
  const [airlineData, setAirlineData] = useState([])
  const [hourlyData, setHourlyData] = useState([])
  const [routeData, setRouteData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadDashboard() {
      const [dashboardResult, airlineResult, hourlyResult, routeResult] =
        await Promise.allSettled([
          getDashboard(),
          getAirlineDelay(),
          getHourlyDelay(),
          getTopRoutes(),
        ])

      if (!isMounted) {
        return
      }

      let hasError = false

      if (dashboardResult.status === 'fulfilled') {
        setDashboard(dashboardResult.value)
      } else {
        hasError = true
      }

      if (airlineResult.status === 'fulfilled') {
        setAirlineData(airlineResult.value)
      } else {
        hasError = true
      }

      if (hourlyResult.status === 'fulfilled') {
        setHourlyData(hourlyResult.value)
      } else {
        hasError = true
      }

      if (routeResult.status === 'fulfilled') {
        setRouteData(routeResult.value)
      } else {
        hasError = true
      }

      if (hasError) {
        setError('Some dashboard data could not be updated. Retrying...')
      } else {
        setError('')
      }

      setLoading(false)
    }

    // Initial load
    loadDashboard()

    // Automatically refresh while the dashboard is open
    const intervalId = setInterval(loadDashboard, REFRESH_INTERVAL)

    // Cleanup when leaving the dashboard
    return () => {
      isMounted = false
      clearInterval(intervalId)
    }
  }, [])

  const insight = useMemo(() => {
    if (!dashboard?.monthly?.length && !airlineData.length) {
      return null
    }

    const worstMonth = [...(dashboard?.monthly || [])].sort(
      (a, b) => b.average_delay - a.average_delay,
    )[0]

    const worstAirline = [...airlineData].sort(
      (a, b) => b.average_delay - a.average_delay,
    )[0]

    if (!worstMonth && !worstAirline) {
      return null
    }

    return {
      month: worstMonth ? formatMonth(worstMonth.month) : null,
      airline: worstAirline ? formatAirline(worstAirline.airline) : null,
    }
  }, [dashboard, airlineData])

  if (loading) {
    return (
      <Box>
        <PageHeader
          title="Aviation Dashboard"
          description="Monitor flight delays, predictions and aviation analytics."
        />

        <Grid container spacing={3} sx={{ mt: 1 }}>
          {[1, 2, 3].map((item) => (
            <Grid key={item} size={{ xs: 12, sm: 6, md: 4 }}>
              <LoadingCard />
            </Grid>
          ))}
        </Grid>

        <Box sx={{ mt: 4 }}>
          <LoadingCard lines={4} />
        </Box>
      </Box>
    )
  }

  if (error && !dashboard) {
    return (
      <Box>
        <PageHeader
          title="Aviation Dashboard"
          description="Monitor flight delays, predictions and aviation analytics."
        />
        <ErrorState title="Dashboard unavailable" message={error} />
      </Box>
    )
  }

  const summary = dashboard?.summary

  return (
    <Box>
      <PageHeader
        title="Aviation Dashboard"
        description="Monitor flight delays, predictions and aviation analytics."
      />

      {error && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {summary ? (
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <StatCard
              title="Total Flights"
              value={summary.total_flights}
              subtitle="Flights in dataset"
              icon={<FlightTakeoffIcon color="primary" />}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <StatCard
              title="Average Delay"
              value={`${summary.average_delay.toFixed(2)} min`}
              subtitle="Average actual delay"
              icon={<AccessTimeIcon color="warning" />}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <StatCard
              title="Average Prediction"
              value={`${summary.average_prediction.toFixed(2)} min`}
              subtitle="ML predicted delay"
              icon={<TrendingUpIcon color="success" />}
            />
          </Grid>
        </Grid>
      ) : (
        <EmptyState
          title="No dashboard summary available."
          message="The backend did not return a summary payload for this view."
        />
      )}

      {insight && (
        <Card
          elevation={0}
          sx={{
            mt: 3,
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <CardContent
            sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
          >
            <InsightsIcon color="primary" />

            <Typography variant="body2" color="text.secondary">
              {insight.month
                ? `${insight.month} recorded the highest observed monthly average delay.`
                : ''}{' '}
              {insight.airline
                ? `${insight.airline} has the highest average delay in the current dataset.`
                : ''}
            </Typography>
          </CardContent>
        </Card>
      )}

      <Box sx={{ mt: 4 }}>
        <ChartCard title="Monthly Average Delay">
          {dashboard?.monthly?.length ? (
            <MonthlyDelayChart data={dashboard.monthly} />
          ) : (
            <EmptyState
              title="No monthly data available."
              message="The analytics service did not return any monthly delay values."
            />
          )}
        </ChartCard>
      </Box>

      <Box sx={{ mt: 4 }}>
        <ChartCard title="Airline Average Delay">
          {airlineData.length ? (
            <AirlineDelayChart data={airlineData} />
          ) : (
            <EmptyState
              title="No airline data available."
              message="There are currently no airline delay measurements to display."
            />
          )}
        </ChartCard>
      </Box>

      <Box sx={{ mt: 4 }}>
        <ChartCard title="Hourly Average Delay">
          {hourlyData.length ? (
            <HourlyDelayChart data={hourlyData} />
          ) : (
            <EmptyState
              title="No hourly data available."
              message="The hourly delay feed is empty right now."
            />
          )}
        </ChartCard>
      </Box>

      <Box sx={{ mt: 4 }}>
        <ChartCard title="Top Delayed Routes">
          {routeData.length ? (
            <RouteDelayChart data={routeData} />
          ) : (
            <EmptyState
              title="No route data available."
              message="No delayed routes were returned by the backend."
            />
          )}
        </ChartCard>
      </Box>
    </Box>
  )
}

export default Dashboard
