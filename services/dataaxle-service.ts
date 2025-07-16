"use server"

import { cache } from "react"

// DataAxle API configuration
const DATAAXLE_BASE_URL = "https://api.dataaxle.com/v1"
const PEOPLE_API_TOKEN = "e65ac1c780a" // People Trial v1
const PLACES_API_TOKEN = "a96078c5944" // Places Trial v1

interface DataAxleConfig {
  token: string
  baseUrl: string
  endpoint: string
}

// People API configuration
const peopleApiConfig: DataAxleConfig = {
  token: PEOPLE_API_TOKEN,
  baseUrl: DATAAXLE_BASE_URL,
  endpoint: "/people",
}

// Places API configuration
const placesApiConfig: DataAxleConfig = {
  token: PLACES_API_TOKEN,
  baseUrl: DATAAXLE_BASE_URL,
  endpoint: "/places",
}

export interface PeopleSearchParams {
  firstName?: string
  lastName?: string
  address?: string
  city?: string
  state?: string
  zipCode?: string
  age?: number | [number, number] // Single age or age range
  income?: [number, number] // Income range
  limit?: number
}

export interface PlacesSearchParams {
  businessName?: string
  address?: string
  city?: string
  state?: string
  zipCode?: string
  industry?: string
  sic?: string | string[]
  naics?: string | string[]
  employeeCount?: [number, number] // Employee count range
  revenue?: [number, number] // Revenue range
  limit?: number
}

export interface PersonRecord {
  id: string
  firstName: string
  lastName: string
  address: string
  city: string
  state: string
  zipCode: string
  age?: number
  gender?: string
  income?: number
  email?: string
  phone?: string
  // Additional fields as needed
}

export interface BusinessRecord {
  id: string
  name: string
  address: string
  city: string
  state: string
  zipCode: string
  phone?: string
  website?: string
  email?: string
  contactName?: string
  contactTitle?: string
  employeeCount?: number
  revenue?: number
  yearEstablished?: number
  sic?: string[]
  naics?: string[]
  latitude?: number
  longitude?: number
  // Additional fields as needed
}

/**
 * Search for people records in the DataAxle People database
 */
export const searchPeople = cache(async (params: PeopleSearchParams): Promise<PersonRecord[]> => {
  try {
    // Build the query parameters
    const queryParams = new URLSearchParams()

    if (params.firstName) queryParams.append("firstName", params.firstName)
    if (params.lastName) queryParams.append("lastName", params.lastName)
    if (params.address) queryParams.append("address", params.address)
    if (params.city) queryParams.append("city", params.city)
    if (params.state) queryParams.append("state", params.state)
    if (params.zipCode) queryParams.append("zipCode", params.zipCode)

    // Handle age parameter (single value or range)
    if (params.age) {
      if (Array.isArray(params.age)) {
        queryParams.append("ageMin", params.age[0].toString())
        queryParams.append("ageMax", params.age[1].toString())
      } else {
        queryParams.append("age", params.age.toString())
      }
    }

    // Handle income range
    if (params.income) {
      queryParams.append("incomeMin", params.income[0].toString())
      queryParams.append("incomeMax", params.income[1].toString())
    }

    // Set limit
    queryParams.append("limit", (params.limit || 50).toString())

    // Make the API request
    const response = await makeDataAxleRequest(peopleApiConfig, `/search?${queryParams.toString()}`)

    return response.records || []
  } catch (error) {
    console.error("Error searching people records:", error)
    return []
  }
})

/**
 * Search for business records in the DataAxle Places database
 */
export const searchBusinesses = cache(async (params: PlacesSearchParams): Promise<BusinessRecord[]> => {
  try {
    // Build the query parameters
    const queryParams = new URLSearchParams()

    if (params.businessName) queryParams.append("name", params.businessName)
    if (params.address) queryParams.append("address", params.address)
    if (params.city) queryParams.append("city", params.city)
    if (params.state) queryParams.append("state", params.state)
    if (params.zipCode) queryParams.append("zipCode", params.zipCode)
    if (params.industry) queryParams.append("industry", params.industry)

    // Handle SIC codes
    if (params.sic) {
      if (Array.isArray(params.sic)) {
        params.sic.forEach((code) => queryParams.append("sic", code))
      } else {
        queryParams.append("sic", params.sic)
      }
    }

    // Handle NAICS codes
    if (params.naics) {
      if (Array.isArray(params.naics)) {
        params.naics.forEach((code) => queryParams.append("naics", code))
      } else {
        queryParams.append("naics", params.naics)
      }
    }

    // Handle employee count range
    if (params.employeeCount) {
      queryParams.append("employeeCountMin", params.employeeCount[0].toString())
      queryParams.append("employeeCountMax", params.employeeCount[1].toString())
    }

    // Handle revenue range
    if (params.revenue) {
      queryParams.append("revenueMin", params.revenue[0].toString())
      queryParams.append("revenueMax", params.revenue[1].toString())
    }

    // Set limit
    queryParams.append("limit", (params.limit || 50).toString())

    // Make the API request
    const response = await makeDataAxleRequest(placesApiConfig, `/search?${queryParams.toString()}`)

    return response.records || []
  } catch (error) {
    console.error("Error searching business records:", error)
    return []
  }
})

/**
 * Get detailed information about a specific business
 */
export const getBusinessDetails = cache(async (businessId: string): Promise<BusinessRecord | null> => {
  try {
    const response = await makeDataAxleRequest(placesApiConfig, `/records/${businessId}`)

    return response.record || null
  } catch (error) {
    console.error(`Error fetching business details for ID ${businessId}:`, error)
    return null
  }
})

/**
 * Get detailed information about a specific person
 */
export const getPersonDetails = cache(async (personId: string): Promise<PersonRecord | null> => {
  try {
    const response = await makeDataAxleRequest(peopleApiConfig, `/records/${personId}`)

    return response.record || null
  } catch (error) {
    console.error(`Error fetching person details for ID ${personId}:`, error)
    return null
  }
})

/**
 * Helper function to make requests to the DataAxle API
 */
async function makeDataAxleRequest(config: DataAxleConfig, path: string) {
  const url = `${config.baseUrl}${config.endpoint}${path}`

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${config.token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`DataAxle API error (${response.status}): ${errorText}`)
  }

  return await response.json()
}

/**
 * Check if the DataAxle API tokens are valid
 */
export async function checkDataAxleTokens(): Promise<{
  peopleApiValid: boolean
  placesApiValid: boolean
}> {
  try {
    // Check People API
    let peopleApiValid = false
    try {
      const peopleResponse = await makeDataAxleRequest(peopleApiConfig, "/status")
      peopleApiValid = peopleResponse.status === "ok"
    } catch (error) {
      console.error("Error checking People API token:", error)
    }

    // Check Places API
    let placesApiValid = false
    try {
      const placesResponse = await makeDataAxleRequest(placesApiConfig, "/status")
      placesApiValid = placesResponse.status === "ok"
    } catch (error) {
      console.error("Error checking Places API token:", error)
    }

    return {
      peopleApiValid,
      placesApiValid,
    }
  } catch (error) {
    console.error("Error checking DataAxle API tokens:", error)
    return {
      peopleApiValid: false,
      placesApiValid: false,
    }
  }
}

