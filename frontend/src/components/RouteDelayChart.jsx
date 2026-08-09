import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

import { formatRoute } from '../services/metadataService'

function RouteDelayChart({ data }) {

  const chartData = data.map((item) => ({

    route: formatRoute(item.origin, item.destination),

    average_delay: item.average_delay,

  }))


  return (

    <ResponsiveContainer
      width="100%"
      height={450}
    >

      <BarChart
        data={chartData}

        layout="vertical"

        margin={{
          top: 10,
          right: 30,
          left: 30,
          bottom: 10,
        }}
      >

        <CartesianGrid
          strokeDasharray="3 3"
        />

        <XAxis
          type="number"
        />

        <YAxis
          type="category"
          dataKey="route"
          width={120}
        />

        <Tooltip formatter={(value) => [`${Number(value).toFixed(2)} min`, 'Average delay']} />

        <Bar
          dataKey="average_delay"
          radius={[0, 6, 6, 0]}
        />

      </BarChart>

    </ResponsiveContainer>

  )
}


export default RouteDelayChart