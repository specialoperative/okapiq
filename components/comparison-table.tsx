"use client"

import { useCensus } from "@/contexts/census-context"
import type { DemographicData } from "@/services/census-api"
import { formatNumber, formatCurrency, formatPercentage } from "@/utils/data-utils"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface ComparisonTableProps {
  primaryData: DemographicData
  comparisonData: DemographicData[]
}

export default function ComparisonTable({ primaryData, comparisonData }: ComparisonTableProps) {
  const { removeComparisonGeography } = useCensus()

  const metrics = [
    {
      name: "Population",
      getValue: (data: DemographicData) => formatNumber(data.population),
      getComparisonValue: (data: DemographicData, primary: DemographicData) => {
        if (!data.population || !primary.population) return "N/A"
        const percentage = (data.population / primary.population) * 100
        return `${percentage.toFixed(1)}%`
      },
    },
    {
      name: "Median Age",
      getValue: (data: DemographicData) => data.medianAge?.toFixed(1) || "N/A",
      getComparisonValue: (data: DemographicData, primary: DemographicData) => {
        if (!data.medianAge || !primary.medianAge) return "N/A"
        const difference = data.medianAge - primary.medianAge
        return difference > 0 ? `+${difference.toFixed(1)}` : `${difference.toFixed(1)}`
      },
    },
    {
      name: "Median Income",
      getValue: (data: DemographicData) => formatCurrency(data.medianIncome),
      getComparisonValue: (data: DemographicData, primary: DemographicData) => {
        if (!data.medianIncome || !primary.medianIncome) return "N/A"
        const percentage = (data.medianIncome / primary.medianIncome) * 100 - 100
        return percentage > 0 ? `+${percentage.toFixed(1)}%` : `${percentage.toFixed(1)}%`
      },
    },
    {
      name: "White Population",
      getValue: (data: DemographicData) => formatPercentage(data.raceDistribution?.white, data.population),
      getComparisonValue: (data: DemographicData, primary: DemographicData) => {
        if (
          !data.raceDistribution?.white ||
          !data.population ||
          !primary.raceDistribution?.white ||
          !primary.population
        )
          return "N/A"

        const dataPercentage = (data.raceDistribution.white / data.population) * 100
        const primaryPercentage = (primary.raceDistribution.white / primary.population) * 100
        const difference = dataPercentage - primaryPercentage

        return difference > 0 ? `+${difference.toFixed(1)}%` : `${difference.toFixed(1)}%`
      },
    },
    {
      name: "Black Population",
      getValue: (data: DemographicData) => formatPercentage(data.raceDistribution?.black, data.population),
      getComparisonValue: (data: DemographicData, primary: DemographicData) => {
        if (
          !data.raceDistribution?.black ||
          !data.population ||
          !primary.raceDistribution?.black ||
          !primary.population
        )
          return "N/A"

        const dataPercentage = (data.raceDistribution.black / data.population) * 100
        const primaryPercentage = (primary.raceDistribution.black / primary.population) * 100
        const difference = dataPercentage - primaryPercentage

        return difference > 0 ? `+${difference.toFixed(1)}%` : `${difference.toFixed(1)}%`
      },
    },
    {
      name: "Hispanic Population",
      getValue: (data: DemographicData) => formatPercentage(data.raceDistribution?.hispanic, data.population),
      getComparisonValue: (data: DemographicData, primary: DemographicData) => {
        if (
          !data.raceDistribution?.hispanic ||
          !data.population ||
          !primary.raceDistribution?.hispanic ||
          !primary.population
        )
          return "N/A"

        const dataPercentage = (data.raceDistribution.hispanic / data.population) * 100
        const primaryPercentage = (primary.raceDistribution.hispanic / primary.population) * 100
        const difference = dataPercentage - primaryPercentage

        return difference > 0 ? `+${difference.toFixed(1)}%` : `${difference.toFixed(1)}%`
      },
    },
    {
      name: "Asian Population",
      getValue: (data: DemographicData) => formatPercentage(data.raceDistribution?.asian, data.population),
      getComparisonValue: (data: DemographicData, primary: DemographicData) => {
        if (
          !data.raceDistribution?.asian ||
          !data.population ||
          !primary.raceDistribution?.asian ||
          !primary.population
        )
          return "N/A"

        const dataPercentage = (data.raceDistribution.asian / data.population) * 100
        const primaryPercentage = (primary.raceDistribution.asian / primary.population) * 100
        const difference = dataPercentage - primaryPercentage

        return difference > 0 ? `+${difference.toFixed(1)}%` : `${difference.toFixed(1)}%`
      },
    },
  ]

  if (comparisonData.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          Add areas to compare with {primaryData.geographyName} using the search bar
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-muted/50">
            <th className="text-left p-2 border">Metric</th>
            <th className="text-left p-2 border">{primaryData.geographyName}</th>
            {comparisonData.map((data) => (
              <th key={data.geographyId} className="text-left p-2 border">
                <div className="flex items-center justify-between">
                  <span>{data.geographyName}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => removeComparisonGeography(data.geographyId)}
                  >
                    <X size={14} />
                  </Button>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {metrics.map((metric) => (
            <tr key={metric.name} className="hover:bg-muted/20">
              <td className="p-2 border font-medium">{metric.name}</td>
              <td className="p-2 border">{metric.getValue(primaryData)}</td>
              {comparisonData.map((data) => (
                <td key={data.geographyId} className="p-2 border">
                  <div className="flex flex-col">
                    <span>{metric.getValue(data)}</span>
                    <span className="text-xs text-muted-foreground">
                      {metric.getComparisonValue(data, primaryData)}
                    </span>
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
