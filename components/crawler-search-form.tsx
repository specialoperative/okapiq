"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Loader2, Search, Filter, MapPin, DollarSign, Users } from "lucide-react"
import type { CrawledBusiness } from "@/services/crawler-service"

interface CrawlerSearchFormProps {
  onResultsFound: (results: CrawledBusiness[]) => void
}

export function CrawlerSearchForm({ onResultsFound }: CrawlerSearchFormProps) {
  const [industry, setIndustry] = useState("")
  const [location, setLocation] = useState("")
  const [minRevenue, setMinRevenue] = useState("")
  const [maxRevenue, setMaxRevenue] = useState("")
  const [minEmployees, setMinEmployees] = useState("")
  const [maxEmployees, setMaxEmployees] = useState("")
  const [includeContactInfo, setIncludeContactInfo] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/crawler", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          industry,
          location,
          revenue:
            minRevenue || maxRevenue
              ? [
                  minRevenue ? Number.parseInt(minRevenue, 10) : 0,
                  maxRevenue ? Number.parseInt(maxRevenue, 10) : Number.MAX_SAFE_INTEGER,
                ]
              : undefined,
          employees:
            minEmployees || maxEmployees
              ? [
                  minEmployees ? Number.parseInt(minEmployees, 10) : 0,
                  maxEmployees ? Number.parseInt(maxEmployees, 10) : Number.MAX_SAFE_INTEGER,
                ]
              : undefined,
          includeContactInfo,
        }),
      })

      const result = await response.json()

      if (result.success) {
        onResultsFound(result.data)
      } else {
        setError(result.error || "Failed to find SMBs. Please try again.")
      }
    } catch (error) {
      setError("Something went wrong. Please try again later.")
      console.error("Error searching for SMBs:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const industryOptions = [
    { value: "landscaping", label: "Landscaping" },
    { value: "hvac", label: "HVAC" },
    { value: "cleaning", label: "Cleaning Services" },
    { value: "auto detailing", label: "Auto Detailing" },
    { value: "ecommerce", label: "E-commerce" },
    { value: "plumbing", label: "Plumbing" },
    { value: "construction", label: "Construction" },
    { value: "restaurants", label: "Restaurants" },
    { value: "retail", label: "Retail" },
  ]

  return (
    <Card className="w-full bg-white shadow-lg border-0">
      <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-t-lg">
        <CardTitle className="text-xl flex items-center gap-2">
          <Search className="h-5 w-5" />
          Find SMBs that match your criteria
        </CardTitle>
        <CardDescription className="text-green-100">
          Discover businesses for marketing, sales, research, or acquisition
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="industry" className="text-sm font-medium flex items-center gap-2">
                <Filter className="h-4 w-4 text-green-500" />
                Industry
              </label>
              <Select value={industry} onValueChange={setIndustry}>
                <SelectTrigger id="industry" className="h-11">
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  {industryOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label htmlFor="location" className="text-sm font-medium flex items-center gap-2">
                <MapPin className="h-4 w-4 text-green-500" />
                Location
              </label>
              <Input
                id="location"
                placeholder="City, State or ZIP"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="h-11"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="revenue" className="text-sm font-medium flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-green-500" />
                Annual Revenue
              </label>
              <div className="flex items-center space-x-2">
                <Input
                  id="minRevenue"
                  placeholder="Min ($)"
                  value={minRevenue}
                  onChange={(e) => setMinRevenue(e.target.value)}
                  className="h-11"
                />
                <span>to</span>
                <Input
                  id="maxRevenue"
                  placeholder="Max ($)"
                  value={maxRevenue}
                  onChange={(e) => setMaxRevenue(e.target.value)}
                  className="h-11"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="employees" className="text-sm font-medium flex items-center gap-2">
                <Users className="h-4 w-4 text-green-500" />
                Employee Count
              </label>
              <div className="flex items-center space-x-2">
                <Input
                  id="minEmployees"
                  placeholder="Min"
                  value={minEmployees}
                  onChange={(e) => setMinEmployees(e.target.value)}
                  className="h-11"
                />
                <span>to</span>
                <Input
                  id="maxEmployees"
                  placeholder="Max"
                  value={maxEmployees}
                  onChange={(e) => setMaxEmployees(e.target.value)}
                  className="h-11"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Additional Options</label>
            <div className="flex items-center space-x-2 bg-green-50 p-3 rounded-md">
              <Checkbox
                id="includeContactInfo"
                checked={includeContactInfo}
                onCheckedChange={(checked) => setIncludeContactInfo(checked === true)}
              />
              <label htmlFor="includeContactInfo" className="text-sm">
                Include contact information (owner emails, phone numbers)
              </label>
            </div>
          </div>

          {error && <div className="text-sm text-red-500 bg-red-50 p-3 rounded-md">{error}</div>}

          <Button
            type="submit"
            className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Finding SMBs...
              </>
            ) : (
              "Find SMBs"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
