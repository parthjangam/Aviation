import { Box, Typography } from '@mui/material'

function PageHeader({ title, description, action }) {
  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h4" fontWeight={800}>
        {title}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
        {description}
      </Typography>
      {action}
    </Box>
  )
}

export default PageHeader
