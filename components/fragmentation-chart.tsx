"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from "recharts"

const data = [
  {
    industry: "Dental Practices",
    fragmentationRate: 87,
    acquisitionActivity: 65,
  },
  {
    industry: "HVAC Services",
    fragmentationRate: 91,
    acquisitionActivity: 72,
  },
  {
    industry: "Veterinary Clinics",
    fragmentationRate: 83,
    acquisitionActivity: 68,
  },
  {
    industry: "Local Logistics",
    fragmentationRate: 91,
    acquisitionActivity: 58,
  },
  {
    industry: "Auto Repair",
    fragmentationRate: 89,
    acquisitionActivity: 52,
  },
  {
    industry: "Restaurants",
    fragmentationRate: 95,
    acquisitionActivity: 43,
  },
  {
    industry: "IT Services",
    fragmentationRate: 78,
    acquisitionActivity: 61,
  },
]

export function FragmentationChart() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="industry" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="fragmentationRate" name="Fragmentation Rate (%)" fill="#22c55e" />
        <Bar dataKey="acquisitionActivity" name="Acquisition Activity (%)" fill="#15803d" />
      </BarChart>
    </ResponsiveContainer>
  )
}
