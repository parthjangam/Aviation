import { Card, CardContent, Typography, Divider } from '@mui/material'

function ChartCard({ title, children }) {
  return (
    <Card
      elevation={0}
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 3,
        height: '100%',
        boxShadow: '0 10px 30px rgba(15, 23, 42, 0.04)',
      }}
    >
      <CardContent>
        <Typography variant="h6" fontWeight="bold" sx={{ marginBottom: 1 }}>
          {title}
        </Typography>

        <Divider sx={{ marginBottom: 2 }} />

        {children}
      </CardContent>
    </Card>
  )
}

export default ChartCard