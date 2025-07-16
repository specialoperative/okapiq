"use client"

import { Pie, PieChart, ResponsiveContainer, Cell, Tooltip, Legend } from "recharts"

const data = [
  { name: "Search Funds", value: 22 },
  { name: "Private Equity", value: 28 },
  { name: "Family Offices", value: 15 },
  { name: "Brokers", value: 18 },
  { name: "Marketing Firms", value: 10 },
  { name: "SMB Operators", value: 7 },
]

const COLORS = ["#22c55e", "#16a34a", "#15803d", "#166534", "#14532d", "#052e16"]

export function ClientSegmentation() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => `${value}%`} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}
