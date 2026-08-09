import { Box, Skeleton, Stack } from '@mui/material'

function LoadingCard({ lines = 3 }) {
  return (
    <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3, p: 3 }}>
      <Skeleton variant="text" width="60%" height={28} />
      <Skeleton variant="text" width="90%" height={20} sx={{ mt: 1 }} />
      <Stack spacing={1} sx={{ mt: 2 }}>
        {Array.from({ length: lines }).map((_, index) => (
          <Skeleton key={index} variant="rectangular" height={24} />
        ))}
      </Stack>
    </Box>
  )
}

export default LoadingCard
