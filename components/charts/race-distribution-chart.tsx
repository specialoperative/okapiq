"use client"

import type { DemographicData } from "@/services/census-api"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts"

interface RaceDistributionChartProps {
  data: DemographicData
}

export default function RaceDistributionChart({ data }: RaceDistributionChartProps) {
  if (!data.raceDistribution) {
    return (
      <div className="flex items-center justify-center h-[300px] bg-muted/20">
        <p className="text-muted-foreground">Race distribution data not available</p>
      </div>
    )
  }

  const chartData = [
    { name: "White", value: data.raceDistribution.white },
    { name: "Black", value: data.raceDistribution.black },
    { name: "Hispanic", value: data.raceDistribution.hispanic },
    { name: "Asian", value: data.raceDistribution.asian },
    { name: "Other", value: data.raceDistribution.other },
  ]

  return (
    <ChartContainer
      config={{
        White: {
          label: "White",
          color: "hsl(var(--chart-1))",
        },
        Black: {
          label: "Black",
          color: "hsl(var(--chart-2))",
        },
        Hispanic: {
          label: "Hispanic",
          color: "hsl(var(--chart-3))",
        },
        Asian: {
          label: "Asian",
          color: "hsl(var(--chart-4))",
        },
        Other: {
          label: "Other",
          color: "hsl(var(--chart-5))",
        },
      }}
      className="h-[300px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={chartData} cx="50%" cy="50%" labelLine={false} outerRadius={80} fill="#8884d8" dataKey="value">
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={`var(--color-${entry.name})`} />
            ))}
          </Pie>
          <ChartTooltip content={<ChartTooltipContent />} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}

