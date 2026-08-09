import { Box, Typography } from '@mui/material'

function EmptyState({ title, message }) {
  return (
    <Box
      sx={{
        border: '1px dashed',
        borderColor: 'divider',
        borderRadius: 2,
        px: 3,
        py: 4,
        textAlign: 'center',
      }}
    >
      <Typography variant="subtitle1" fontWeight={700}>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
        {message}
      </Typography>
    </Box>
  )
}

export default EmptyState
