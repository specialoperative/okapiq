"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts"

// Sample data based on our integration
const SAMPLE_DATA = [
  { industry: "Services", count: 3386, percentage: 34.8 },
  { industry: "Manufacturing", count: 2978, percentage: 30.6 },
  { industry: "Wholesale", count: 2403, percentage: 24.7 },
  { industry: "Construction", count: 631, percentage: 6.5 },
  { industry: "Agriculture", count: 321, percentage: 3.3 },
  { industry: "Other", count: 26, percentage: 0.1 },
]

export function IndustryDistributionChart() {
  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState(SAMPLE_DATA)

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Industry Distribution</CardTitle>
        <CardDescription>Business count by industry with email coverage insights</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="flex h-[350px] items-center justify-center">
            <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        ) : (
          <ChartContainer
            config={{
              count: {
                label: "Business Count",
                color: "hsl(var(--chart-1))",
              },
              percentage: {
                label: "Percentage",
                color: "hsl(var(--chart-2))",
              },
            }}
            className="h-[350px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 70 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="industry" angle={-45} textAnchor="end" height={70} />
                <YAxis yAxisId="left" orientation="left" stroke="var(--color-count)" />
                <YAxis yAxisId="right" orientation="right" stroke="var(--color-percentage)" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Bar yAxisId="left" dataKey="count" fill="var(--color-count)" name="Business Count" />
                <Bar yAxisId="right" dataKey="percentage" fill="var(--color-percentage)" name="Percentage (%)" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
