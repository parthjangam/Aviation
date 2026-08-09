import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

import { formatAirline } from '../services/metadataService'

function AirlineDelayChart({ data }) {

  const chartData = data.map((item) => ({
    airline: formatAirline(item.airline),
    average_delay: item.average_delay,
  }))

  return (
    <ResponsiveContainer
      width="100%"
      height={400}
    >
      <BarChart
        data={chartData}
        margin={{
          top: 10,
          right: 20,
          left: 10,
          bottom: 10,
        }}
      >

        <CartesianGrid strokeDasharray="3 3" />

        <XAxis
          dataKey="airline"
          interval={0}
          angle={-35}
          textAnchor="end"
          height={80}
        />

        <YAxis />

        <Tooltip formatter={(value) => [`${Number(value).toFixed(2)} min`, 'Average delay']} />

        <Bar
          dataKey="average_delay"
          radius={[6, 6, 0, 0]}
        />

      </BarChart>
    </ResponsiveContainer>
  )
}

export default AirlineDelayChart