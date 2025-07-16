"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, User, MapPin, Mail, Phone } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { PersonRecord } from "@/services/dataaxle-service"

export function PeopleSearch() {
  const [searchParams, setSearchParams] = useState({
    firstName: "",
    lastName: "",
    city: "",
    state: "",
    zipCode: "",
  })

  const [isSearching, setIsSearching] = useState(false)
  const [results, setResults] = useState<PersonRecord[]>([])
  const [error, setError] = useState<string | null>(null)
  const [hasSearched, setHasSearched] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSearching(true)
    setError(null)

    try {
      const response = await fetch("/api/dataaxle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "search-people",
          params: {
            firstName: searchParams.firstName || undefined,
            lastName: searchParams.lastName || undefined,
            city: searchParams.city || undefined,
            state: searchParams.state || undefined,
            zipCode: searchParams.zipCode || undefined,
            limit: 50,
          },
        }),
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`)
      }

      const data = await response.json()
      setResults(data.people || [])
      setHasSearched(true)
    } catch (error) {
      console.error("Error searching people:", error)
      setError(error instanceof Error ? error.message : "An error occurred while searching")
    } finally {
      setIsSearching(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setSearchParams((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setSearchParams((prev) => ({ ...prev, [name]: value }))
  }

  // List of states for the dropdown
  const states = [
    { value: "AL", label: "Alabama" },
    { value: "AK", label: "Alaska" },
    { value: "AZ", label: "Arizona" },
    { value: "AR", label: "Arkansas" },
    { value: "CA", label: "California" },
    { value: "CO", label: "Colorado" },
    { value: "CT", label: "Connecticut" },
    { value: "DE", label: "Delaware" },
    { value: "FL", label: "Florida" },
    { value: "GA", label: "Georgia" },
    { value: "HI", label: "Hawaii" },
    { value: "ID", label: "Idaho" },
    { value: "IL", label: "Illinois" },
    { value: "IN", label: "Indiana" },
    { value: "IA", label: "Iowa" },
    { value: "KS", label: "Kansas" },
    { value: "KY", label: "Kentucky" },
    { value: "LA", label: "Louisiana" },
    { value: "ME", label: "Maine" },
    { value: "MD", label: "Maryland" },
    { value: "MA", label: "Massachusetts" },
    { value: "MI", label: "Michigan" },
    { value: "MN", label: "Minnesota" },
    { value: "MS", label: "Mississippi" },
    { value: "MO", label: "Missouri" },
    { value: "MT", label: "Montana" },
    { value: "NE", label: "Nebraska" },
    { value: "NV", label: "Nevada" },
    { value: "NH", label: "New Hampshire" },
    { value: "NJ", label: "New Jersey" },
    { value: "NM", label: "New Mexico" },
    { value: "NY", label: "New York" },
    { value: "NC", label: "North Carolina" },
    { value: "ND", label: "North Dakota" },
    { value: "OH", label: "Ohio" },
    { value: "OK", label: "Oklahoma" },
    { value: "OR", label: "Oregon" },
    { value: "PA", label: "Pennsylvania" },
    { value: "RI", label: "Rhode Island" },
    { value: "SC", label: "South Carolina" },
    { value: "SD", label: "South Dakota" },
    { value: "TN", label: "Tennessee" },
    { value: "TX", label: "Texas" },
    { value: "UT", label: "Utah" },
    { value: "VT", label: "Vermont" },
    { value: "VA", label: "Virginia" },
    { value: "WA", label: "Washington" },
    { value: "WV", label: "West Virginia" },
    { value: "WI", label: "Wisconsin" },
    { value: "WY", label: "Wyoming" },
  ]

  return (
    <div className="space-y-6">
      <form onSubmit={handleSearch} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              name="firstName"
              value={searchParams.firstName}
              onChange={handleInputChange}
              placeholder="Enter first name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              name="lastName"
              value={searchParams.lastName}
              onChange={handleInputChange}
              placeholder="Enter last name"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              name="city"
              value={searchParams.city}
              onChange={handleInputChange}
              placeholder="Enter city"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="state">State</Label>
            <Select value={searchParams.state} onValueChange={(value) => handleSelectChange("state", value)}>
              <SelectTrigger id="state">
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All States</SelectItem>
                {states.map((state) => (
                  <SelectItem key={state.value} value={state.value}>
                    {state.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="zipCode">ZIP Code</Label>
            <Input
              id="zipCode"
              name="zipCode"
              value={searchParams.zipCode}
              onChange={handleInputChange}
              placeholder="Enter ZIP code"
            />
          </div>
        </div>

        {error && <div className="bg-red-50 text-red-700 p-3 rounded-md">{error}</div>}

        <Button type="submit" className="w-full" disabled={isSearching}>
          {isSearching ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Searching...
            </>
          ) : (
            "Search People"
          )}
        </Button>
      </form>

      {results.length > 0 ? (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Results ({results.length})</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.map((person) => (
              <Card key={person.id}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">
                        {person.firstName} {person.lastName}
                      </h4>
                      {person.age && <p className="text-sm text-muted-foreground">Age: {person.age}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      {person.address}, {person.city}, {person.state} {person.zipCode}
                    </p>

                    {person.email && (
                      <p className="text-sm flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <a href={`mailto:${person.email}`} className="text-primary hover:underline">
                          {person.email}
                        </a>
                      </p>
                    )}

                    {person.phone && (
                      <p className="text-sm flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <a href={`tel:${person.phone}`} className="text-primary hover:underline">
                          {person.phone}
                        </a>
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : isSearching ? null : (
        <div className="text-center py-8 text-muted-foreground">
          {hasSearched
            ? "No results found. Try adjusting your search criteria."
            : "Enter search criteria and click Search to find people."}
        </div>
      )}
    </div>
  )
}

