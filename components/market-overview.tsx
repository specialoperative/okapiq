"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend } from "recharts"

const data = [
  {
    year: "2018",
    smbCount: 30.2,
    gdpContribution: 40,
    acquisitions: 10.5,
  },
  {
    year: "2019",
    smbCount: 30.7,
    gdpContribution: 41,
    acquisitions: 11.2,
  },
  {
    year: "2020",
    smbCount: 31.1,
    gdpContribution: 41.5,
    acquisitions: 10.8,
  },
  {
    year: "2021",
    smbCount: 31.7,
    gdpContribution: 42.3,
    acquisitions: 12.5,
  },
  {
    year: "2022",
    smbCount: 32.5,
    gdpContribution: 43.1,
    acquisitions: 13.2,
  },
  {
    year: "2023",
    smbCount: 33.2,
    gdpContribution: 44,
    acquisitions: 14,
  },
  {
    year: "2024",
    smbCount: 33.8,
    gdpContribution: 44.5,
    acquisitions: 14.5,
  },
]

export function MarketOverview() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="year" />
        <YAxis yAxisId="left" />
        <YAxis yAxisId="right" orientation="right" />
        <Tooltip />
        <Legend />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="smbCount"
          name="SMBs (millions)"
          stroke="#22c55e"
          activeDot={{ r: 8 }}
        />
        <Line yAxisId="left" type="monotone" dataKey="gdpContribution" name="GDP Contribution (%)" stroke="#16a34a" />
        <Line yAxisId="right" type="monotone" dataKey="acquisitions" name="Acquisitions (thousands)" stroke="#15803d" />
      </LineChart>
    </ResponsiveContainer>
  )
}

