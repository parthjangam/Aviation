import { Box } from '@mui/material'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import DashboardLayout from './layouts/DashboardLayout'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import Analytics from './pages/Analytics'
import Predictions from './pages/Predictions'
import { useEffect } from 'react'
import { loadRemoteMetadata } from './services/metadataService'

function App() {
  useEffect(() => {
    loadRemoteMetadata()
  }, [])
  return (
    <BrowserRouter>
      <DashboardLayout>
        <Sidebar />

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            padding: { xs: 2, sm: 3, md: 4 },
            backgroundColor: '#f5f7fa',
            minHeight: '100vh',
            overflowX: 'hidden',
          }}
        >
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/predictions" element={<Predictions />} />
          </Routes>
        </Box>
      </DashboardLayout>
    </BrowserRouter>
  )
}

export default App