"use client"

import type { DemographicData } from "@/services/census-api"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"

interface IncomeChartProps {
  data: DemographicData
}

export default function IncomeChart({ data }: IncomeChartProps) {
  // Mock income distribution data since we don't have real data
  const mockIncomeDistribution = {
    under25k: Math.round(data.population! * 0.18),
    from25kto50k: Math.round(data.population! * 0.22),
    from50kto75k: Math.round(data.population! * 0.19),
    from75kto100k: Math.round(data.population! * 0.15),
    over100k: Math.round(data.population! * 0.26),
  }

  const chartData = [
    { name: "Under $25K", value: mockIncomeDistribution.under25k },
    { name: "$25K-$50K", value: mockIncomeDistribution.from25kto50k },
    { name: "$50K-$75K", value: mockIncomeDistribution.from50kto75k },
    { name: "$75K-$100K", value: mockIncomeDistribution.from75kto100k },
    { name: "Over $100K", value: mockIncomeDistribution.over100k },
  ]

  return (
    <ChartContainer
      config={{
        value: {
          label: "Households",
          color: "hsl(var(--chart-2))",
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

