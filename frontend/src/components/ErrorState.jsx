import { Alert, Box, Typography } from '@mui/material'

function ErrorState({ title, message }) {
  return (
    <Box sx={{ py: 3 }}>
      <Alert severity="error" sx={{ borderRadius: 2 }}>
        <Typography variant="subtitle2" fontWeight={700}>
          {title}
        </Typography>
        <Typography variant="body2">{message}</Typography>
      </Alert>
    </Box>
  )
}

export default ErrorState
