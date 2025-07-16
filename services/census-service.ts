"use server"

import { cache } from "react"

export interface CensusMetric {
  name: string
  value: number
  description: string
}

export interface CensusData {
  location: string
  populationMetrics: CensusMetric[]
  ageMetrics: CensusMetric[]
  incomeMetrics: CensusMetric[]
  businessMetrics: CensusMetric[]
}

export interface MarketAnalysis {
  sellerPotentialScore: number
  pricingPotentialScore: number
  recommendedMarketingSpend: number
  fragmentationPrediction: number
  insights: string[]
}

// Cache the census data to avoid unnecessary API calls
export const getCensusData = cache(async (location: string): Promise<CensusData> => {
  // Use environment variable for API key
  const apiKey = process.env.CENSUS_API_KEY

  if (!apiKey) {
    console.warn("Census API key is missing. Using mock data instead.")
    return getMockCensusData(location)
  }

  try {
    // Normalize the location for better matches
    const normalizedLocation = location.toLowerCase().replace(/\s/g, "")

    // Attempt to fetch real data from Census API
    const response = await fetch(
      `https://api.census.gov/data/2020/acs/acs5?get=NAME,B01001_001E,B19013_001E&for=place:*&in=state:*&key=${apiKey}`,
    )

    if (!response.ok) {
      console.warn(`Census API returned status ${response.status}. Using mock data instead.`)
      return getMockCensusData(location)
    }

    const data = await response.json()

    // Process the real data
    // This is a simplified example - in a real implementation, you would parse the response properly
    // and extract the relevant metrics

    // For now, we'll still use mock data but log that we successfully connected to the API
    console.log("Successfully connected to Census API. Response:", data[0])

    return getMockCensusData(location)
  } catch (error) {
    console.error("Error fetching from Census API:", error)
    return getMockCensusData(location)
  }
})

// Helper function to generate mock census data
function getMockCensusData(location: string): CensusData {
  // Generate predictable but different looking data based on the location string
  const locationHash = location.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)

  // Create location-specific data
  const medianAge = 35 + (locationHash % 15) // Range: 35-50
  const percentOver55 = 20 + (locationHash % 25) // Range: 20-45%
  const medianIncome = 40000 + (locationHash % 80000) // Range: $40k-$120k
  const businessDensity = 10 + (locationHash % 30) // Businesses per 1000 people
  const selfEmploymentRate = 7 + (locationHash % 8) // Range: 7-15%
  const smallBusinessPercentage = 60 + (locationHash % 30) // Range: 60-90%

  return {
    location,
    populationMetrics: [
      {
        name: "Total Population",
        value: 100000 + (locationHash % 900000),
        description: "Total number of residents",
      },
      {
        name: "Population Density",
        value: 1000 + (locationHash % 9000),
        description: "People per square mile",
      },
      {
        name: "Population Growth",
        value: -2 + (locationHash % 10),
        description: "Annual population growth rate (%)",
      },
    ],
    ageMetrics: [
      {
        name: "Median Age",
        value: medianAge,
        description: "Median age of the population",
      },
      {
        name: "Percentage Over 55",
        value: percentOver55,
        description: "Percentage of population over age 55",
      },
      {
        name: "Youth Percentage",
        value: 15 + (locationHash % 15),
        description: "Percentage of population under age 18",
      },
    ],
    incomeMetrics: [
      {
        name: "Median Household Income",
        value: medianIncome,
        description: "Median annual household income ($)",
      },
      {
        name: "Income Growth",
        value: 1 + (locationHash % 5),
        description: "Annual income growth rate (%)",
      },
      {
        name: "Income Inequality",
        value: 0.3 + (locationHash % 20) / 100,
        description: "Gini coefficient (0-1 scale)",
      },
    ],
    businessMetrics: [
      {
        name: "Business Density",
        value: businessDensity,
        description: "Businesses per 1,000 residents",
      },
      {
        name: "Self-Employment Rate",
        value: selfEmploymentRate,
        description: "Percentage of workforce that is self-employed",
      },
      {
        name: "Small Business Percentage",
        value: smallBusinessPercentage,
        description: "Percentage of businesses with fewer than 20 employees",
      },
    ],
  }
}

export async function analyzeMarket(location: string, industry: string): Promise<MarketAnalysis> {
  const censusData = await getCensusData(location)

  // Calculate seller potential score (higher age = more likely to sell)
  // Higher percentage of over 55 population correlates with more business owners looking to retire
  const ageFactor = censusData.ageMetrics.find((m) => m.name === "Percentage Over 55")?.value || 30
  const sellerPotentialScore = Math.min(100, Math.max(0, ageFactor * 2)) // Scale to 0-100

  // Calculate pricing potential (higher income = higher pricing potential)
  const medianIncome = censusData.incomeMetrics.find((m) => m.name === "Median Household Income")?.value || 50000
  const nationalMedianIncome = 65000 // National average
  const pricingPotentialScore = Math.min(100, Math.max(0, (medianIncome / nationalMedianIncome) * 100))

  // Calculate recommended marketing spend based on income and population density
  const populationDensity = censusData.populationMetrics.find((m) => m.name === "Population Density")?.value || 1000
  const baseMarketingSpend = 5000 // Base marketing budget
  const incomeFactor = medianIncome / 50000 // Normalized to 1.0 at $50k
  const densityFactor = Math.log10(populationDensity) / 3 // Logarithmic scaling for density
  const recommendedMarketingSpend = Math.round(baseMarketingSpend * incomeFactor * densityFactor)

  // Predict industry fragmentation
  // Lower business density + higher self-employment = more fragmented
  const businessDensity = censusData.businessMetrics.find((m) => m.name === "Business Density")?.value || 15
  const selfEmployment = censusData.businessMetrics.find((m) => m.name === "Self-Employment Rate")?.value || 10
  const smallBusinessPercentage =
    censusData.businessMetrics.find((m) => m.name === "Small Business Percentage")?.value || 75

  // Formula for fragmentation: Higher small business % and self-employment rates indicate more fragmentation
  // Business density has an inverse relationship (higher density = less fragmentation)
  const fragmentationPrediction = Math.min(
    100,
    Math.max(0, smallBusinessPercentage * 0.5 + selfEmployment * 2 - businessDensity * 0.5 + 30),
  )

  // Generate insights based on the data
  const insights = []

  if (sellerPotentialScore > 70) {
    insights.push(
      `High potential for business acquisitions in ${location} due to aging population (${ageFactor.toFixed(1)}% over 55).`,
    )
  } else if (sellerPotentialScore < 40) {
    insights.push(`Limited acquisition opportunities in ${location} due to younger demographic profile.`)
  }

  if (pricingPotentialScore > 80) {
    insights.push(
      `${location}'s high median income ($${medianIncome.toLocaleString()}) suggests premium pricing potential for ${industry} services.`,
    )
  } else if (pricingPotentialScore < 50) {
    insights.push(
      `${location}'s lower median income may require competitive pricing strategies for ${industry} businesses.`,
    )
  }

  if (fragmentationPrediction > 80) {
    insights.push(
      `The ${industry} market in ${location} appears highly fragmented (${fragmentationPrediction.toFixed(0)}%), ideal for roll-up strategies.`,
    )
  } else if (fragmentationPrediction < 50) {
    insights.push(
      `The ${industry} market in ${location} appears relatively consolidated, suggesting established competition.`,
    )
  }

  if (recommendedMarketingSpend > 8000) {
    insights.push(
      `Higher marketing budget recommended ($${recommendedMarketingSpend.toLocaleString()}) due to ${location}'s competitive landscape and income levels.`,
    )
  } else {
    insights.push(
      `Moderate marketing investment recommended ($${recommendedMarketingSpend.toLocaleString()}) based on ${location}'s demographic profile.`,
    )
  }

  return {
    sellerPotentialScore,
    pricingPotentialScore,
    recommendedMarketingSpend,
    fragmentationPrediction,
    insights,
  }
}

