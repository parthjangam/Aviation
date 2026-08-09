import { Box } from '@mui/material'

function DashboardLayout({ children }) {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        backgroundColor: '#f5f7fa',
        overflowX: 'hidden',
      }}
    >
      {children}
    </Box>
  )
}

export default DashboardLayout