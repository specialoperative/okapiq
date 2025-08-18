"use client"
import type { DemographicData } from "@/services/census-api"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"

interface PopulationChartProps {
  data: DemographicData
}

export default function PopulationChart({ data }: PopulationChartProps) {
  const chartData = [
    {
      name: data.geographyName,
      population: data.population,
    },
  ]

  return (
    <ChartContainer
      config={{
        population: {
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
          <Bar dataKey="population" fill="var(--color-population)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
