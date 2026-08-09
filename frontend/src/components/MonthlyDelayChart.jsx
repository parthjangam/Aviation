import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

import { formatMonth } from '../services/metadataService'

const monthNames = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

function MonthlyDelayChart({ data }) {

  const chartData = data.map((item) => ({
    month: formatMonth(item.month),
    average_delay: item.average_delay,
  }))

  return (
    <ResponsiveContainer
      width="100%"
      height={350}
    >
      <LineChart data={chartData}>

        <CartesianGrid strokeDasharray="3 3" />

        <XAxis dataKey="month" />

        <YAxis />

        <Tooltip formatter={(value) => [`${Number(value).toFixed(2)} min`, 'Average delay']} />

        <Line
          type="monotone"
          dataKey="average_delay"
          strokeWidth={3}
          dot={{ r: 4 }}
        />

      </LineChart>
    </ResponsiveContainer>
  )
}

export default MonthlyDelayChart