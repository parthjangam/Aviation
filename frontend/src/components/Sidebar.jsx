import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'

import DashboardIcon from '@mui/icons-material/Dashboard'
import AnalyticsIcon from '@mui/icons-material/Analytics'
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff'
import MenuIcon from '@mui/icons-material/Menu'
import CloseIcon from '@mui/icons-material/Close'

const navItems = [
  { label: 'Dashboard', path: '/dashboard', icon: <DashboardIcon /> },
  { label: 'Analytics', path: '/analytics', icon: <AnalyticsIcon /> },
  { label: 'Predictions', path: '/predictions', icon: <FlightTakeoffIcon /> },
]

function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleNavigate = (path) => {
    navigate(path)
    setMobileOpen(false)
  }

  const drawerContent = (
    <Box
      sx={{
        width: { xs: 280, md: 260 },
        minHeight: '100vh',
        backgroundColor: '#111827',
        color: 'white',
        paddingTop: { xs: 2, md: 3 },
      }}
    >
      <Box sx={{ paddingX: 3, marginBottom: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="h6" fontWeight="bold">
            ✈ Aviation
          </Typography>

          <Typography variant="body2" sx={{ opacity: 0.6 }}>
            Analytics Platform
          </Typography>
        </Box>

        {isMobile && (
          <IconButton onClick={() => setMobileOpen(false)} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        )}
      </Box>

      <List>
        {navItems.map((item) => {
          const selected = location.pathname === item.path

          return (
            <ListItemButton
              key={item.path}
              selected={selected}
              onClick={() => handleNavigate(item.path)}
              sx={{
                mx: 1.5,
                borderRadius: 2,
                mb: 0.75,
                '&.Mui-selected': {
                  backgroundColor: 'rgba(96, 165, 250, 0.18)',
                },
              }}
            >
              <ListItemIcon>
                {item.icon}
              </ListItemIcon>

              <ListItemText primary={item.label} />
            </ListItemButton>
          )
        })}
      </List>
    </Box>
  )

  if (isMobile) {
    return (
      <>
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            display: { md: 'none' },
            backgroundColor: '#111827',
            color: 'white',
          }}
        >
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={() => setMobileOpen(true)}>
              <MenuIcon />
            </IconButton>

            <Typography variant="h6" fontWeight={700} sx={{ flexGrow: 1 }}>
              Aviation Analytics
            </Typography>
          </Toolbar>
        </AppBar>

        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              backgroundColor: '#111827',
            },
          }}
        >
          {drawerContent}
        </Drawer>
      </>
    )
  }

  return (
    <Box component="aside" sx={{ width: { md: 260 }, flexShrink: 0, display: { xs: 'none', md: 'block' } }}>
      {drawerContent}
    </Box>
  )
}

export default Sidebar