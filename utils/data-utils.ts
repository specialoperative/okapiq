import type React from "react"
import type { DemographicData } from "@/services/census-api"

/**
 * Formats a number with commas for thousands
 */
export function formatNumber(num: number | undefined): string {
  if (num === undefined) return "N/A"
  return num.toLocaleString()
}

/**
 * Formats a dollar amount
 */
export function formatCurrency(amount: number | undefined): string {
  if (amount === undefined) return "N/A"
  return `$${amount.toLocaleString()}`
}

/**
 * Formats a percentage
 */
export function formatPercentage(value: number | undefined, total: number | undefined): string {
  if (value === undefined || total === undefined || total === 0) return "N/A"
  return `${((value / total) * 100).toFixed(1)}%`
}

/**
 * Exports data to CSV format
 */
export function exportToCsv(data: DemographicData[], filename: string): void {
  if (!data || data.length === 0) return

  // Get all possible keys from all objects
  const allKeys = new Set<string>()
  data.forEach((item) => {
    Object.keys(item).forEach((key) => {
      if (typeof item[key as keyof DemographicData] !== "object") {
        allKeys.add(key)
      }
    })

    // Add nested object keys
    if (item.raceDistribution) {
      Object.keys(item.raceDistribution).forEach((key) => {
        allKeys.add(`raceDistribution_${key}`)
      })
    }

    if (item.ageDistribution) {
      Object.keys(item.ageDistribution).forEach((key) => {
        allKeys.add(`ageDistribution_${key}`)
      })
    }

    if (item.incomeDistribution) {
      Object.keys(item.incomeDistribution).forEach((key) => {
        allKeys.add(`incomeDistribution_${key}`)
      })
    }

    if (item.educationLevels) {
      Object.keys(item.educationLevels).forEach((key) => {
        allKeys.add(`educationLevels_${key}`)
      })
    }
  })

  // Convert to array and sort
  const headers = Array.from(allKeys).sort()

  // Create CSV header row
  let csv = headers.join(",") + "\n"

  // Add data rows
  data.forEach((item) => {
    const row = headers.map((header) => {
      if (header.includes("_")) {
        // Handle nested objects
        const [objectName, propertyName] = header.split("_")
        const nestedObject = item[objectName as keyof DemographicData] as any
        return nestedObject ? nestedObject[propertyName] || "" : ""
      } else {
        // Handle top-level properties
        const value = item[header as keyof DemographicData]
        return typeof value === "object" ? "" : value || ""
      }
    })

    csv += row.join(",") + "\n"
  })

  // Create download link
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.setAttribute("href", url)
  link.setAttribute("download", `${filename}.csv`)
  link.style.visibility = "hidden"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

/**
 * Exports chart as PNG
 */
export function exportChartAsPng(chartRef: React.RefObject<HTMLElement>, filename: string): void {
  if (!chartRef.current) return

  import("html-to-image").then((htmlToImage) => {
    htmlToImage
      .toPng(chartRef.current!)
      .then((dataUrl) => {
        const link = document.createElement("a")
        link.download = `${filename}.png`
        link.href = dataUrl
        link.click()
      })
      .catch((error) => {
        console.error("Error exporting chart:", error)
      })
  })
}
