import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'


function HourlyDelayChart({ data }) {

  const chartData = data.map((item) => ({

    hour: `${String(item.hour).padStart(2, '0')}:00`,

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

        <CartesianGrid
          strokeDasharray="3 3"
        />

        <XAxis
          dataKey="hour"
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


export default HourlyDelayChart