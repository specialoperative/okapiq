"use client"

import type { DemographicData } from "@/services/census-api"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"

interface AgeDistributionChartProps {
  data: DemographicData
}

export default function AgeDistributionChart({ data }: AgeDistributionChartProps) {
  // Mock age distribution data since we don't have real data
  const mockAgeDistribution = {
    under18: Math.round(data.population! * 0.22),
    age18to24: Math.round(data.population! * 0.1),
    age25to44: Math.round(data.population! * 0.26),
    age45to64: Math.round(data.population! * 0.25),
    age65plus: Math.round(data.population! * 0.17),
  }

  const chartData = [
    { name: "Under 18", value: mockAgeDistribution.under18 },
    { name: "18-24", value: mockAgeDistribution.age18to24 },
    { name: "25-44", value: mockAgeDistribution.age25to44 },
    { name: "45-64", value: mockAgeDistribution.age45to64 },
    { name: "65+", value: mockAgeDistribution.age65plus },
  ]

  return (
    <ChartContainer
      config={{
        value: {
          label: "Population",
          color: "hsl(var(--chart-1))",
        },
      }}
      className="h-[300px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="value" fill="var(--color-value)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
