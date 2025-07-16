"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { fetchDemographicData } from "@/services/census-api"

export function CensusApiTest() {
  const [location, setLocation] = useState("06")
  const [year, setYear] = useState("2020")
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleTest = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const data = await fetchDemographicData({
        year: Number.parseInt(year, 10),
        geography: "state",
        location,
        variables: ["NAME", "B01001_001E", "B19013_001E"],
      })

      setResult(data)
    } catch (err: any) {
      console.error("Error testing Census API:", err)
      setError(err.message || "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Census API Test</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">State FIPS Code</Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., 06 for California"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="year">Year</Label>
              <Input id="year" value={year} onChange={(e) => setYear(e.target.value)} placeholder="e.g., 2020" />
            </div>
          </div>

          <Button onClick={handleTest} disabled={isLoading}>
            {isLoading ? "Testing..." : "Test Census API"}
          </Button>

          {error && (
            <div className="p-4 bg-red-50 text-red-700 rounded-md">
              <p className="font-medium">Error:</p>
              <p>{error}</p>
            </div>
          )}

          {result && (
            <div className="p-4 bg-green-50 text-green-700 rounded-md">
              <p className="font-medium">Success!</p>
              <pre className="mt-2 text-xs overflow-auto max-h-60">{JSON.stringify(result, null, 2)}</pre>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

