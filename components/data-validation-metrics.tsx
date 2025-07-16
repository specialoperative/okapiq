"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from "recharts"

const data = [
  {
    category: "Financial",
    accuracy: 99.2,
    completeness: 97.5,
    timeliness: 96.8,
  },
  {
    category: "Ownership",
    accuracy: 98.7,
    completeness: 94.2,
    timeliness: 93.5,
  },
  {
    category: "Industry",
    accuracy: 99.5,
    completeness: 98.9,
    timeliness: 97.2,
  },
  {
    category: "Location",
    accuracy: 99.8,
    completeness: 99.3,
    timeliness: 98.5,
  },
  {
    category: "Employees",
    accuracy: 97.6,
    completeness: 93.8,
    timeliness: 92.4,
  },
  {
    category: "Social Media",
    accuracy: 98.3,
    completeness: 96.2,
    timeliness: 99.1,
  },
]

export function DataValidationMetrics() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" domain={[90, 100]} />
        <YAxis dataKey="category" type="category" width={100} />
        <Tooltip />
        <Legend />
        <Bar dataKey="accuracy" name="Accuracy %" fill="#22c55e" />
        <Bar dataKey="completeness" name="Completeness %" fill="#16a34a" />
        <Bar dataKey="timeliness" name="Timeliness %" fill="#15803d" />
      </BarChart>
    </ResponsiveContainer>
  )
}

