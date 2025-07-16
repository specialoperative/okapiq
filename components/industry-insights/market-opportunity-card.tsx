import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts"

const data = [
  { name: "Covered", value: 624574 },
  { name: "Opportunity", value: 17673399 },
]

const COLORS = ["hsl(var(--primary))", "hsl(var(--muted))"]

export function MarketOpportunityCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold">Market Opportunity</CardTitle>
        <CardDescription>Email coverage vs. total addressable market</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            value: {
              label: "Businesses",
              color: "hsl(var(--chart-1))",
            },
          }}
          className="h-[250px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
        <div className="mt-4 text-center">
          <p className="text-sm text-muted-foreground">
            Only 3.4% of businesses have email addresses - representing a massive untapped opportunity
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

