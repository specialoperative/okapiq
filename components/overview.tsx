"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

const data = [
  { name: "Jan", total: 1200 },
  { name: "Feb", total: 1900 },
  { name: "Mar", total: 2300 },
  { name: "Apr", total: 3200 },
  { name: "May", total: 4100 },
  { name: "Jun", total: 4800 },
  { name: "Jul", total: 5400 },
  { name: "Aug", total: 6200 },
  { name: "Sep", total: 6800 },
  { name: "Oct", total: 7300 },
  { name: "Nov", total: 7900 },
  { name: "Dec", total: 8400 },
]

export function Overview() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
        <Bar dataKey="total" fill="#4ade80" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

