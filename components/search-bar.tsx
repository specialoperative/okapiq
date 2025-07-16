"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useCensus } from "@/contexts/census-context"
import { searchGeographicAreas, type GeographicArea } from "@/services/census-api"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, X } from "lucide-react"
import { useDebounce } from "@/hooks/use-debounce"

export default function SearchBar() {
  const { setSelectedGeography } = useCensus()
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<GeographicArea[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const debouncedQuery = useDebounce(query, 300)

  // Auto-search when query changes (debounced)
  useEffect(() => {
    if (debouncedQuery.length >= 1) {
      handleSearch()
    } else {
      setResults([])
    }
  }, [debouncedQuery])

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleSearch = async () => {
    if (!query.trim()) {
      setResults([])
      return
    }

    try {
      setIsSearching(true)
      // Use our mock data for autofill suggestions
      if (query.length < 3) {
        // For short queries, just show some mock suggestions
        setResults(getMockSuggestions(query))
      } else {
        // For longer queries, attempt to use the real API
        try {
          const searchResults = await searchGeographicAreas(query)
          setResults(searchResults)
        } catch (error) {
          console.error("Error searching geographic areas:", error)
          // Fallback to mock data if the API fails
          setResults(getMockSuggestions(query))
        }
      }
      setShowSuggestions(true)
    } catch (error) {
      console.error("Error searching geographic areas:", error)
    } finally {
      setIsSearching(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  const handleClear = () => {
    setQuery("")
    setResults([])
    setShowSuggestions(false)
  }

  const handleSelectResult = (geography: GeographicArea) => {
    setSelectedGeography(geography)
    setQuery(geography.name)
    setShowSuggestions(false)
  }

  const handleInputFocus = () => {
    if (query.trim()) {
      setShowSuggestions(true)
    }
  }

  return (
    <div className="space-y-4" ref={searchRef}>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Input
            type="text"
            placeholder="Search for a state, county, or city..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={handleInputFocus}
            className="pr-8"
          />
          {query && (
            <button
              onClick={handleClear}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X size={16} />
            </button>
          )}
        </div>
        <Button onClick={handleSearch} disabled={isSearching}>
          {isSearching ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          ) : (
            <Search size={16} />
          )}
          <span className="ml-2 hidden sm:inline">Search</span>
        </Button>
      </div>

      {showSuggestions && results.length > 0 && (
        <div className="border rounded-md overflow-hidden absolute z-10 bg-background w-full max-w-[calc(100%-88px)]">
          <div className="bg-muted px-4 py-2 text-sm font-medium">Search Results ({results.length})</div>
          <ul className="divide-y max-h-[300px] overflow-y-auto">
            {results.map((result) => (
              <li key={`${result.type}-${result.id}`} className="px-4 py-2 hover:bg-muted/50">
                <button onClick={() => handleSelectResult(result)} className="w-full text-left">
                  <div className="font-medium">{result.name}</div>
                  <div className="text-sm text-muted-foreground capitalize">{result.type}</div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

// Mock data for autofill suggestions
function getMockSuggestions(query: string): GeographicArea[] {
  const states = [
    { name: "Alabama", id: "01" },
    { name: "Alaska", id: "02" },
    { name: "Arizona", id: "04" },
    { name: "Arkansas", id: "05" },
    { name: "California", id: "06" },
    { name: "Colorado", id: "08" },
    { name: "Connecticut", id: "09" },
    { name: "Delaware", id: "10" },
    { name: "Florida", id: "12" },
    { name: "Georgia", id: "13" },
    { name: "Hawaii", id: "15" },
    { name: "Idaho", id: "16" },
    { name: "Illinois", id: "17" },
    { name: "Indiana", id: "18" },
    { name: "Iowa", id: "19" },
    { name: "Kansas", id: "20" },
    { name: "Kentucky", id: "21" },
    { name: "Louisiana", id: "22" },
    { name: "Maine", id: "23" },
    { name: "Maryland", id: "24" },
    { name: "Massachusetts", id: "25" },
    { name: "Michigan", id: "26" },
    { name: "Minnesota", id: "27" },
    { name: "Mississippi", id: "28" },
    { name: "Missouri", id: "29" },
    { name: "Montana", id: "30" },
    { name: "Nebraska", id: "31" },
    { name: "Nevada", id: "32" },
    { name: "New Hampshire", id: "33" },
    { name: "New Jersey", id: "34" },
    { name: "New Mexico", id: "35" },
    { name: "New York", id: "36" },
    { name: "North Carolina", id: "37" },
    { name: "North Dakota", id: "38" },
    { name: "Ohio", id: "39" },
    { name: "Oklahoma", id: "40" },
    { name: "Oregon", id: "41" },
    { name: "Pennsylvania", id: "42" },
    { name: "Rhode Island", id: "44" },
    { name: "South Carolina", id: "45" },
    { name: "South Dakota", id: "46" },
    { name: "Tennessee", id: "47" },
    { name: "Texas", id: "48" },
    { name: "Utah", id: "49" },
    { name: "Vermont", id: "50" },
    { name: "Virginia", id: "51" },
    { name: "Washington", id: "53" },
    { name: "West Virginia", id: "54" },
    { name: "Wisconsin", id: "55" },
    { name: "Wyoming", id: "56" },
  ]

  const cities = [
    { name: "New York City", id: "51000", parentId: "36" },
    { name: "Los Angeles", id: "44000", parentId: "06" },
    { name: "Chicago", id: "14000", parentId: "17" },
    { name: "Houston", id: "35000", parentId: "48" },
    { name: "Phoenix", id: "55000", parentId: "04" },
    { name: "Philadelphia", id: "60000", parentId: "42" },
    { name: "San Antonio", id: "65000", parentId: "48" },
    { name: "San Diego", id: "66000", parentId: "06" },
    { name: "Dallas", id: "19000", parentId: "48" },
    { name: "San Jose", id: "68000", parentId: "06" },
    { name: "Austin", id: "05000", parentId: "48" },
    { name: "Jacksonville", id: "35000", parentId: "12" },
    { name: "Fort Worth", id: "27000", parentId: "48" },
    { name: "Columbus", id: "18000", parentId: "39" },
    { name: "Indianapolis", id: "36000", parentId: "18" },
    { name: "Charlotte", id: "12000", parentId: "37" },
    { name: "San Francisco", id: "67000", parentId: "06" },
    { name: "Seattle", id: "63000", parentId: "53" },
    { name: "Denver", id: "20000", parentId: "08" },
    { name: "Washington", id: "50000", parentId: "11" },
    { name: "Boston", id: "07000", parentId: "25" },
    { name: "El Paso", id: "24000", parentId: "48" },
    { name: "Nashville", id: "52000", parentId: "47" },
    { name: "Detroit", id: "22000", parentId: "26" },
    { name: "Memphis", id: "48000", parentId: "47" },
  ]

  const lowerQuery = query.toLowerCase()

  const filteredStates = states
    .filter((state) => state.name.toLowerCase().startsWith(lowerQuery))
    .map((state) => ({
      id: state.id,
      name: state.name,
      type: "state" as const,
    }))

  const filteredCities = cities
    .filter((city) => city.name.toLowerCase().startsWith(lowerQuery))
    .map((city) => ({
      id: city.id,
      name: city.name,
      type: "city" as const,
      parentId: city.parentId,
    }))

  return [...filteredStates, ...filteredCities].slice(0, 10)
}
