"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts"

const data = [
  {
    name: "Financial Data",
    accuracy: 99.2,
    completeness: 97.5,
    consistency: 98.3,
  },
  {
    name: "Owner Info",
    accuracy: 98.7,
    completeness: 94.2,
    consistency: 96.8,
  },
  {
    name: "Industry Data",
    accuracy: 99.5,
    completeness: 98.9,
    consistency: 99.1,
  },
  {
    name: "Location Data",
    accuracy: 99.8,
    completeness: 99.3,
    consistency: 99.5,
  },
  {
    name: "Employee Data",
    accuracy: 97.6,
    completeness: 93.8,
    consistency: 95.2,
  },
]

export function DataQualityMetrics() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis dataKey="name" />
        <YAxis domain={[90, 100]} />
        <Tooltip />
        <Legend />
        <Bar dataKey="accuracy" name="Accuracy %" fill="#22c55e" />
        <Bar dataKey="completeness" name="Completeness %" fill="#16a34a" />
        <Bar dataKey="consistency" name="Consistency %" fill="#15803d" />
      </BarChart>
    </ResponsiveContainer>
  )
}
