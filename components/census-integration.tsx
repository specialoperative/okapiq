"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getCensusData, analyzeMarket, type CensusData, type MarketAnalysis } from "@/services/census-service"
import type { CrawledBusiness } from "@/services/crawler-service"
import { CensusDemographics } from "@/components/census-demographics"
import { Loader2, Map, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface CensusIntegrationProps {
  selectedBusiness?: CrawledBusiness
}

export function CensusIntegration({ selectedBusiness }: CensusIntegrationProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [censusData, setCensusData] = useState<CensusData | null>(null)
  const [marketAnalysis, setMarketAnalysis] = useState<MarketAnalysis | null>(null)

  // Function to extract location from address
  const extractLocation = (address?: string): string => {
    if (!address) return ""

    const parts = address.split(",")
    if (parts.length >= 2) {
      // Get the city part (second to last element)
      return parts[parts.length - 2].trim()
    }
    return ""
  }

  // Load census data when selected business changes
  useEffect(() => {
    const fetchCensusData = async () => {
      if (!selectedBusiness) {
        setCensusData(null)
        setMarketAnalysis(null)
        return
      }

      const location = extractLocation(selectedBusiness.address)
      if (!location) {
        setError("Could not determine location from business address")
        return
      }

      setLoading(true)
      setError(null)

      try {
        console.log(`Fetching census data for location: ${location}`)
        const data = await getCensusData(location)
        setCensusData(data)

        console.log(`Analyzing market for industry: ${selectedBusiness.industry || ""}`)
        const analysis = await analyzeMarket(location, selectedBusiness.industry || "")
        setMarketAnalysis(analysis)
      } catch (err) {
        console.error("Error fetching census data:", err)
        setError("Failed to load census data. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchCensusData()
  }, [selectedBusiness])

  if (!selectedBusiness) {
    return (
      <Card className="shadow-md border-0">
        <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
          <CardTitle className="text-green-800">Census Analytics</CardTitle>
          <CardDescription>Select a business to view census data and market analysis</CardDescription>
        </CardHeader>
        <CardContent className="p-6 text-center">
          <Map className="h-16 w-16 text-gray-300 mx-auto my-6" />
          <p className="text-gray-500">
            Select a business from the results table to view demographic and market analysis
          </p>
        </CardContent>
      </Card>
    )
  }

  if (loading) {
    return (
      <Card className="shadow-md border-0">
        <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
          <CardTitle className="text-green-800">Loading Census Data</CardTitle>
          <CardDescription>Analyzing {extractLocation(selectedBusiness.address)}</CardDescription>
        </CardHeader>
        <CardContent className="p-8 flex flex-col items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-green-600 mb-4" />
          <p className="text-gray-600">Fetching demographic and market data...</p>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="shadow-md border-0">
        <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
          <CardTitle className="text-green-800">Census Analytics</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <div className="mt-4 text-center">
            <Button onClick={() => window.location.reload()} variant="outline" className="mt-2">
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!censusData || !marketAnalysis) {
    return (
      <Card className="shadow-md border-0">
        <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
          <CardTitle className="text-green-800">Census Analytics</CardTitle>
        </CardHeader>
        <CardContent className="p-6 text-center">
          <p className="text-gray-500">No data available for this location</p>
        </CardContent>
      </Card>
    )
  }

  return <CensusDemographics censusData={censusData} marketAnalysis={marketAnalysis} />
}

