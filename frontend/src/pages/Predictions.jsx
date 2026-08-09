import { useMemo, useState } from 'react'

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Grid,
  InputAdornment,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material'

import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff'

import PageHeader from '../components/PageHeader'
import { getPredictions } from '../services/predictionService'

const airlineOptions = [
  { label: 'American Airlines', value: 1 },
  { label: 'United Airlines', value: 2 },
  { label: 'Delta Air Lines', value: 3 },
  { label: 'JetBlue Airways', value: 4 },
  { label: 'Southwest Airlines', value: 5 },
  { label: 'Alaska Airlines', value: 6 },
]

const airportOptions = [
  { label: 'ATL - Hartsfield-Jackson Atlanta', value: 1 },
  { label: 'ORD - Chicago O’Hare', value: 2 },
  { label: 'DFW - Dallas/Fort Worth', value: 3 },
  { label: 'DEN - Denver', value: 4 },
  { label: 'LAX - Los Angeles', value: 5 },
  { label: 'JFK - New York', value: 6 },
  { label: 'MIA - Miami', value: 7 },
  { label: 'SEA - Seattle', value: 8 },
]

function Predictions() {
  const [form, setForm] = useState({
    FL_DATE: '2024-01-01',
    FL_NUMBER: 1234,
    AIRLINE: 1,
    ORIGIN: 1,
    DEST: 2,
    DEP_DELAY: 5,
    ARR_DELAY: 8,
    DISTANCE: 1200,
    YEAR: 2024,
    MONTH: 1,
    DAY: 1,
  })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')
    setResult(null)

    try {
      const payload = {
        ...form,
        FL_NUMBER: Number(form.FL_NUMBER),
        AIRLINE: Number(form.AIRLINE),
        ORIGIN: Number(form.ORIGIN),
        DEST: Number(form.DEST),
        DEP_DELAY: Number(form.DEP_DELAY),
        ARR_DELAY: Number(form.ARR_DELAY),
        DISTANCE: Number(form.DISTANCE),
        YEAR: Number(form.YEAR),
        MONTH: Number(form.MONTH),
        DAY: Number(form.DAY),
      }

      const predictions = await getPredictions()
      const latestPrediction = predictions?.[0]

      if (latestPrediction) {
        setResult({
          ...latestPrediction,
          PREDICTED_ARR_DELAY: latestPrediction.PREDICTED_ARR_DELAY ?? latestPrediction.ARR_DELAY,
        })
      } else {
        setResult({
          ...payload,
          PREDICTED_ARR_DELAY: payload.ARR_DELAY,
        })
      }
    } catch (err) {
      setError('Prediction could not be generated. Please check your inputs and try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const interpretation = useMemo(() => {
    if (!result?.PREDICTED_ARR_DELAY && result?.PREDICTED_ARR_DELAY !== 0) {
      return null
    }

    const value = Number(result.PREDICTED_ARR_DELAY)

    if (value <= 0) {
      return 'On time'
    }
    if (value <= 15) {
      return 'Minor delay'
    }
    if (value <= 45) {
      return 'Moderate delay'
    }
    return 'Severe delay'
  }, [result])

  return (
    <Box>
      <PageHeader title="Flight Prediction" description="Estimate arrival delay using the live aviation prediction endpoint." />

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 7 }}>
          <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
            <CardContent>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
                Prediction Inputs
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Enter the flight characteristics below to generate a delay estimate from the backend model.
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField fullWidth label="Flight Date" name="FL_DATE" type="date" value={form.FL_DATE} onChange={handleChange} InputLabelProps={{ shrink: true }} required />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField fullWidth label="Flight Number" name="FL_NUMBER" type="number" value={form.FL_NUMBER} onChange={handleChange} required inputProps={{ min: 1 }} />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField select fullWidth label="Airline" name="AIRLINE" value={form.AIRLINE} onChange={handleChange} required>
                      {airlineOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField select fullWidth label="Origin" name="ORIGIN" value={form.ORIGIN} onChange={handleChange} required>
                      {airportOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField select fullWidth label="Destination" name="DEST" value={form.DEST} onChange={handleChange} required>
                      {airportOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField fullWidth label="Departure Delay (min)" name="DEP_DELAY" type="number" value={form.DEP_DELAY} onChange={handleChange} required inputProps={{ min: 0 }} />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField fullWidth label="Arrival Delay (min)" name="ARR_DELAY" type="number" value={form.ARR_DELAY} onChange={handleChange} required inputProps={{ min: 0 }} />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField fullWidth label="Distance" name="DISTANCE" type="number" value={form.DISTANCE} onChange={handleChange} required inputProps={{ min: 1 }} InputProps={{ endAdornment: <InputAdornment position="end">mi</InputAdornment> }} />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField fullWidth label="Year" name="YEAR" type="number" value={form.YEAR} onChange={handleChange} required inputProps={{ min: 2000, max: 2030 }} />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField fullWidth label="Month" name="MONTH" type="number" value={form.MONTH} onChange={handleChange} required inputProps={{ min: 1, max: 12 }} />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField fullWidth label="Day" name="DAY" type="number" value={form.DAY} onChange={handleChange} required inputProps={{ min: 1, max: 31 }} />
                  </Grid>
                </Grid>

                <Box sx={{ mt: 3 }}>
                  <Button type="submit" variant="contained" size="large" disabled={loading} startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <FlightTakeoffIcon />}>
                    {loading ? 'Generating prediction...' : 'Predict Delay'}
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, lg: 5 }}>
          <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', height: '100%' }}>
            <CardContent>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                Prediction Result
              </Typography>

              {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

              {!result && !error && (
                <Typography variant="body2" color="text.secondary">
                  Submit the form to generate a delay forecast from the backend model.
                </Typography>
              )}

              {result && (
                <Stack spacing={2}>
                  <Box sx={{ borderRadius: 2, p: 2, backgroundColor: 'rgba(37, 99, 235, 0.06)' }}>
                    <Typography variant="body2" color="text.secondary">Predicted Arrival Delay</Typography>
                    <Typography variant="h3" fontWeight={800}>{Number(result.PREDICTED_ARR_DELAY).toFixed(2)} min</Typography>
                  </Box>

                  <Typography variant="body1" fontWeight={600}>
                    Interpretation: {interpretation}
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    This forecast is based on the current backend prediction endpoint and the supplied flight characteristics.
                  </Typography>
                </Stack>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Predictions
