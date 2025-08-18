"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import type { CensusData, MarketAnalysis } from "@/services/census-service"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Tag, DollarSign, Users, Building, Map } from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface CensusDemographicsProps {
  censusData: CensusData
  marketAnalysis: MarketAnalysis
}

export function CensusDemographics({ censusData, marketAnalysis }: CensusDemographicsProps) {
  const [activeTab, setActiveTab] = useState("demographics")

  const formatDollars = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value)
  }

  // Format age data for charts
  const ageData = [
    { name: "Under 18", value: censusData.ageMetrics.find((m) => m.name === "Youth Percentage")?.value || 20 },
    {
      name: "18-54",
      value:
        100 -
        ((censusData.ageMetrics.find((m) => m.name === "Youth Percentage")?.value || 20) +
          (censusData.ageMetrics.find((m) => m.name === "Percentage Over 55")?.value || 30)),
    },
    { name: "Over 55", value: censusData.ageMetrics.find((m) => m.name === "Percentage Over 55")?.value || 30 },
  ]

  // Color scheme
  const COLORS = ["#22c55e", "#10b981", "#059669"] // Green colors

  // Seller potential score label
  const getSellerPotentialLabel = (score: number) => {
    if (score >= 75) return "Very High"
    if (score >= 60) return "High"
    if (score >= 45) return "Moderate"
    if (score >= 30) return "Low"
    return "Very Low"
  }

  // Fragmentation label
  const getFragmentationLabel = (score: number) => {
    if (score >= 80) return "Highly Fragmented"
    if (score >= 65) return "Fragmented"
    if (score >= 50) return "Moderately Fragmented"
    if (score >= 35) return "Somewhat Consolidated"
    return "Highly Consolidated"
  }

  return (
    <Card className="shadow-lg border-0">
      <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
        <CardTitle className="flex items-center gap-2 text-green-800">
          <Map className="h-5 w-5 text-green-600" />
          {censusData.location} Census Demographics
        </CardTitle>
        <CardDescription>Census data analysis for SMB intelligence</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger
              value="demographics"
              className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
            >
              Demographics
            </TabsTrigger>
            <TabsTrigger value="business" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
              Business Climate
            </TabsTrigger>
            <TabsTrigger value="analysis" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
              Market Analysis
            </TabsTrigger>
          </TabsList>

          <TabsContent value="demographics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-4 text-green-800">Age Distribution</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={ageData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}%`}
                      >
                        {ageData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value}%`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Median Age</span>
                    <span className="font-semibold">
                      {censusData.ageMetrics.find((m) => m.name === "Median Age")?.value || 0} years
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Population Over 55</span>
                    <span className="font-semibold">
                      {censusData.ageMetrics.find((m) => m.name === "Percentage Over 55")?.value || 0}%
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4 text-green-800">Income & Population</h3>
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Median Household Income</span>
                      <span className="font-semibold">
                        {formatDollars(
                          censusData.incomeMetrics.find((m) => m.name === "Median Household Income")?.value || 0,
                        )}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-green-500" />
                      <Progress
                        value={
                          (censusData.incomeMetrics.find((m) => m.name === "Median Household Income")?.value || 50000) /
                          1500
                        }
                        className="h-2 bg-green-100"
                      />
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Total Population</span>
                      <span className="font-semibold">
                        {new Intl.NumberFormat().format(
                          censusData.populationMetrics.find((m) => m.name === "Total Population")?.value || 0,
                        )}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-green-500" />
                      <Progress
                        value={
                          (censusData.populationMetrics.find((m) => m.name === "Total Population")?.value || 0) / 10000
                        }
                        className="h-2 bg-green-100"
                      />
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Population Density</span>
                      <span className="font-semibold">
                        {new Intl.NumberFormat().format(
                          censusData.populationMetrics.find((m) => m.name === "Population Density")?.value || 0,
                        )}{" "}
                        per sq mi
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Map className="h-4 w-4 text-green-500" />
                      <Progress
                        value={
                          (censusData.populationMetrics.find((m) => m.name === "Population Density")?.value || 0) / 100
                        }
                        className="h-2 bg-green-100"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 bg-green-50 p-4 rounded-md border border-green-100">
              <h3 className="text-md font-semibold mb-2 text-green-800">Demographic Insights</h3>
              <ul className="space-y-2">
                {marketAnalysis.insights
                  .filter(
                    (insight) =>
                      insight.includes("age") || insight.includes("income") || insight.includes("demographic"),
                  )
                  .map((insight, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <svg
                        className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span>{insight}</span>
                    </li>
                  ))}
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="business" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-50 rounded-lg p-5">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-green-100 p-2 rounded-full">
                    <Building className="h-5 w-5 text-green-600" />
                  </div>
                  <h3 className="font-semibold">Business Density</h3>
                </div>
                <p className="text-3xl font-bold text-green-700">
                  {censusData.businessMetrics.find((m) => m.name === "Business Density")?.value || 0}
                </p>
                <p className="text-sm text-gray-500">businesses per 1,000 residents</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-5">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-green-100 p-2 rounded-full">
                    <Users className="h-5 w-5 text-green-600" />
                  </div>
                  <h3 className="font-semibold">Self-Employment</h3>
                </div>
                <p className="text-3xl font-bold text-green-700">
                  {censusData.businessMetrics.find((m) => m.name === "Self-Employment Rate")?.value || 0}%
                </p>
                <p className="text-sm text-gray-500">of workforce is self-employed</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-5">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-green-100 p-2 rounded-full">
                    <Tag className="h-5 w-5 text-green-600" />
                  </div>
                  <h3 className="font-semibold">Small Businesses</h3>
                </div>
                <p className="text-3xl font-bold text-green-700">
                  {censusData.businessMetrics.find((m) => m.name === "Small Business Percentage")?.value || 0}%
                </p>
                <p className="text-sm text-gray-500">have fewer than 20 employees</p>
              </div>
            </div>

            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-4 text-green-800">Business Climate Metrics</h3>
              <div className="h-72">
                <ChartContainer
                  config={{
                    businessDensity: {
                      label: "Business Density",
                      color: "hsl(var(--chart-1))",
                    },
                    selfEmployment: {
                      label: "Self-Employment",
                      color: "hsl(var(--chart-2))",
                    },
                    smallBusiness: {
                      label: "Small Business %",
                      color: "hsl(var(--chart-3))",
                    },
                  }}
                  className="h-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        {
                          name: censusData.location,
                          businessDensity:
                            censusData.businessMetrics.find((m) => m.name === "Business Density")?.value || 0,
                          selfEmployment:
                            censusData.businessMetrics.find((m) => m.name === "Self-Employment Rate")?.value || 0,
                          smallBusiness:
                            censusData.businessMetrics.find((m) => m.name === "Small Business Percentage")?.value || 0,
                        },
                        {
                          name: "National Average",
                          businessDensity: 15,
                          selfEmployment: 10,
                          smallBusiness: 80,
                        },
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <ChartTooltip trigger={<></>} content={<ChartTooltipContent />} />
                      <Legend />
                      <Bar dataKey="businessDensity" name="Business Density" fill="var(--color-businessDensity)" />
                      <Bar dataKey="selfEmployment" name="Self-Employment Rate" fill="var(--color-selfEmployment)" />
                      <Bar dataKey="smallBusiness" name="Small Business %" fill="var(--color-smallBusiness)" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </div>

            <div className="mt-4 bg-green-50 p-4 rounded-md border border-green-100">
              <h3 className="text-md font-semibold mb-2 text-green-800">Business Climate Insights</h3>
              <ul className="space-y-2">
                {marketAnalysis.insights
                  .filter(
                    (insight) =>
                      insight.includes("market") || insight.includes("business") || insight.includes("fragmented"),
                  )
                  .map((insight, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <svg
                        className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span>{insight}</span>
                    </li>
                  ))}
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="analysis" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div className="bg-green-50 p-5 rounded-lg border border-green-100">
                  <h3 className="font-semibold text-green-800 mb-3">Seller Potential</h3>
                  <div className="flex items-center gap-4">
                    <div className="bg-white h-20 w-20 rounded-full flex items-center justify-center shadow-sm">
                      <div className="text-2xl font-bold text-green-600">
                        {marketAnalysis.sellerPotentialScore.toFixed(0)}%
                      </div>
                    </div>
                    <div>
                      <div className="text-lg font-medium text-green-700">
                        {getSellerPotentialLabel(marketAnalysis.sellerPotentialScore)}
                      </div>
                      <p className="text-sm text-gray-600">
                        {marketAnalysis.sellerPotentialScore > 60
                          ? "High proportion of business owners nearing retirement age."
                          : "Lower percentage of business owners in typical exit age range."}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 p-5 rounded-lg border border-green-100">
                  <h3 className="font-semibold text-green-800 mb-3">Pricing Potential</h3>
                  <div className="flex items-center gap-4">
                    <div className="bg-white h-20 w-20 rounded-full flex items-center justify-center shadow-sm">
                      <div className="text-2xl font-bold text-green-600">
                        {marketAnalysis.pricingPotentialScore.toFixed(0)}%
                      </div>
                    </div>
                    <div>
                      <div className="text-lg font-medium text-green-700">
                        {marketAnalysis.pricingPotentialScore > 80
                          ? "Premium"
                          : marketAnalysis.pricingPotentialScore > 60
                            ? "Above Average"
                            : marketAnalysis.pricingPotentialScore > 40
                              ? "Average"
                              : "Value"}
                      </div>
                      <p className="text-sm text-gray-600">
                        {marketAnalysis.pricingPotentialScore > 70
                          ? "Higher median income suggests potential for premium pricing."
                          : "Competitive pricing recommended based on local income levels."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-green-50 p-5 rounded-lg border border-green-100">
                  <h3 className="font-semibold text-green-800 mb-3">Market Fragmentation</h3>
                  <div className="flex items-center gap-4">
                    <div className="bg-white h-20 w-20 rounded-full flex items-center justify-center shadow-sm">
                      <div className="text-2xl font-bold text-green-600">
                        {marketAnalysis.fragmentationPrediction.toFixed(0)}%
                      </div>
                    </div>
                    <div>
                      <div className="text-lg font-medium text-green-700">
                        {getFragmentationLabel(marketAnalysis.fragmentationPrediction)}
                      </div>
                      <p className="text-sm text-gray-600">
                        {marketAnalysis.fragmentationPrediction > 70
                          ? "Many small competitors with acquisition potential."
                          : "Market has fewer, larger established players."}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 p-5 rounded-lg border border-green-100">
                  <h3 className="font-semibold text-green-800 mb-3">Recommended Marketing</h3>
                  <div className="flex items-center gap-4">
                    <div className="bg-white h-20 w-20 rounded-full flex items-center justify-center shadow-sm">
                      <DollarSign className="h-10 w-10 text-green-600" />
                    </div>
                    <div>
                      <div className="text-lg font-medium text-green-700">
                        {formatDollars(marketAnalysis.recommendedMarketingSpend)}
                      </div>
                      <p className="text-sm text-gray-600">
                        Recommended monthly marketing budget based on local demographics
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 bg-gradient-to-r from-green-600 to-emerald-700 p-6 rounded-lg text-white">
              <h3 className="font-semibold mb-3">Key Market Insights</h3>
              <ul className="space-y-3">
                {marketAnalysis.insights.map((insight, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <svg
                      className="h-5 w-5 text-green-100 mt-0.5 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="text-green-50">{insight}</span>
                  </li>
                ))}
              </ul>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
