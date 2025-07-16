"use client"

import { useState, useEffect } from "react"
import { useCensus } from "@/contexts/census-context"
import type { GeographicArea } from "@/services/census-api"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronRight } from "lucide-react"

export default function GeographySelector() {
  const { selectedGeography, setSelectedGeography, availableGeographies } = useCensus()

  const [selectedState, setSelectedState] = useState<GeographicArea | null>(null)
  const [counties, setCounties] = useState<GeographicArea[]>([])
  const [cities, setCities] = useState<GeographicArea[]>([])
  const [isLoadingCounties, setIsLoadingCounties] = useState(false)
  const [isLoadingCities, setIsLoadingCities] = useState(false)

  // Generate mock counties when a state is selected
  useEffect(() => {
    if (!selectedState) {
      setCounties([])
      return
    }

    setIsLoadingCounties(true)

    // Mock county data
    setTimeout(() => {
      const mockCounties = [
        { id: "001", name: `${selectedState.name} County 1`, type: "county" as const, parentId: selectedState.id },
        { id: "003", name: `${selectedState.name} County 2`, type: "county" as const, parentId: selectedState.id },
        { id: "005", name: `${selectedState.name} County 3`, type: "county" as const, parentId: selectedState.id },
        { id: "007", name: `${selectedState.name} County 4`, type: "county" as const, parentId: selectedState.id },
        { id: "009", name: `${selectedState.name} County 5`, type: "county" as const, parentId: selectedState.id },
      ]

      setCounties(mockCounties)
      setIsLoadingCounties(false)
    }, 500)
  }, [selectedState])

  // Generate mock cities when a state is selected
  useEffect(() => {
    if (!selectedState) {
      setCities([])
      return
    }

    setIsLoadingCities(true)

    // Mock city data
    setTimeout(() => {
      const mockCities = [
        { id: "10000", name: `${selectedState.name} City 1`, type: "city" as const, parentId: selectedState.id },
        { id: "20000", name: `${selectedState.name} City 2`, type: "city" as const, parentId: selectedState.id },
        { id: "30000", name: `${selectedState.name} City 3`, type: "city" as const, parentId: selectedState.id },
        { id: "40000", name: `${selectedState.name} City 4`, type: "city" as const, parentId: selectedState.id },
        { id: "50000", name: `${selectedState.name} City 5`, type: "city" as const, parentId: selectedState.id },
      ]

      setCities(mockCities)
      setIsLoadingCities(false)
    }, 700)
  }, [selectedState])

  const handleStateChange = (stateId: string) => {
    const state = availableGeographies.find((g) => g.id === stateId) || null
    setSelectedState(state)
    setSelectedGeography(state)
  }

  const handleCountyChange = (countyId: string) => {
    const county = counties.find((c) => c.id === countyId) || null
    setSelectedGeography(county)
  }

  const handleCityChange = (cityId: string) => {
    const city = cities.find((c) => c.id === cityId) || null
    setSelectedGeography(city)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
        <Select onValueChange={handleStateChange}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Select a state" />
          </SelectTrigger>
          <SelectContent>
            {availableGeographies.map((state) => (
              <SelectItem key={state.id} value={state.id}>
                {state.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {selectedState && (
          <>
            <ChevronRight className="hidden sm:block" />

            <Select onValueChange={handleCountyChange} disabled={isLoadingCounties || counties.length === 0}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder={isLoadingCounties ? "Loading counties..." : "Select a county"} />
              </SelectTrigger>
              <SelectContent>
                {counties.map((county) => (
                  <SelectItem key={county.id} value={county.id}>
                    {county.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <ChevronRight className="hidden sm:block" />

            <Select onValueChange={handleCityChange} disabled={isLoadingCities || cities.length === 0}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder={isLoadingCities ? "Loading cities..." : "Select a city"} />
              </SelectTrigger>
              <SelectContent>
                {cities.map((city) => (
                  <SelectItem key={city.id} value={city.id}>
                    {city.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </>
        )}
      </div>

      {selectedGeography && (
        <div className="text-sm text-muted-foreground">
          Currently viewing: <span className="font-medium">{selectedGeography.name}</span>
        </div>
      )}
    </div>
  )
}

