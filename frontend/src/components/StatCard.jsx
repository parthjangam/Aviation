import { Card, CardContent, Typography, Box } from '@mui/material'

function StatCard({ title, value, subtitle, icon }) {
  return (
    <Card
      elevation={0}
      sx={{
        height: '100%',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 3,
        boxShadow: '0 10px 30px rgba(15, 23, 42, 0.04)',
      }}
    >
      <CardContent>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 2,
          }}
        >
          <Typography variant="body2" color="text.secondary" fontWeight={600}>
            {title}
          </Typography>

          {icon}
        </Box>

        <Typography variant="h4" fontWeight="bold">
          {value}
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ marginTop: 1 }}>
          {subtitle}
        </Typography>
      </CardContent>
    </Card>
  )
}

export default StatCard