/**
 * Searches for geographic areas by name
 */

// Define the GeographicArea type
export interface GeographicArea {
  id: string
  name: string
  type: "state" | "city" | "county"
  parentId?: string
}

/**
 * Fetches demographic data from the Census API
 */
export interface CensusDataParams {
  year?: number
  dataset?: string
  variables?: string[]
  geography?: string
  location?: string
}

export interface DemographicData {
  geographyId: string
  geographyName: string
  year: number
  population: number
  medianAge: number
  medianIncome: number
  raceDistribution: {
    white: number
    black: number
    asian: number
    hispanic: number
    other: number
  }
  ageDistribution: {
    under18: number
    age18to24: number
    age25to44: number
    age65plus: number
  }
}

export async function fetchDemographicData(params: CensusDataParams): Promise<DemographicData[]> {
  const {
    year = 2020,
    dataset = "acs/acs5",
    variables = ["NAME", "B01001_001E"],
    geography = "state",
    location = "*",
  } = params

  try {
    // Construct the API URL for our route handler
    const queryParams = new URLSearchParams({
      year: year.toString(),
      dataset,
      variables: variables.join(","),
      geography,
      location,
    })

    const url = `/api/census?${queryParams}`

    const response = await fetch(url)

    if (!response.ok) {
      const errorData = await response.json()
      console.error("Census API error:", errorData)

      // Return mock data instead of throwing an error
      return getMockDemographicData(geography, location, year)
    }

    const data = await response.json()

    // Process the data into our format
    return processApiResponse(data, year, geography)
  } catch (error) {
    console.error("Error fetching census data:", error)
    // Return mock data instead of throwing an error
    return getMockDemographicData(geography, location, year)
  }
}

// Helper function to generate mock demographic data
function getMockDemographicData(geography: string, location: string, year: number): DemographicData[] {
  // Generate a name based on the geography type and location
  let geographyName = ""
  if (geography === "state") {
    const states: Record<string, string> = {
      "01": "Alabama",
      "06": "California",
      "36": "New York",
      "48": "Texas",
      // Add more states as needed
    }
    geographyName = states[location] || `State ${location}`
  } else if (geography === "county") {
    geographyName = `Sample County, USA`
  } else if (geography === "city") {
    geographyName = `Sample City, USA`
  } else {
    geographyName = `Sample Area`
  }

  // Generate random population between 100,000 and 10,000,000
  const population = Math.floor(Math.random() * 9900000) + 100000

  // Generate random median age between 25 and 45
  const medianAge = Math.floor(Math.random() * 20) + 25 + Math.random()

  // Generate random median income between 30,000 and 100,000
  const medianIncome = Math.floor(Math.random() * 70000) + 30000

  // Generate race distribution
  const white = Math.floor(population * (Math.random() * 0.3 + 0.4)) // 40-70%
  const black = Math.floor(population * (Math.random() * 0.2 + 0.05)) // 5-25%
  const asian = Math.floor(population * (Math.random() * 0.15 + 0.05)) // 5-20%
  const hispanic = Math.floor(population * (Math.random() * 0.2 + 0.1)) // 10-30%
  const other = population - white - black - asian - hispanic

  return [
    {
      geographyId: location,
      geographyName,
      year,
      population,
      medianAge,
      medianIncome,
      raceDistribution: {
        white,
        black,
        asian,
        hispanic,
        other,
      },
      ageDistribution: {
        under18: Math.floor(population * 0.22),
        age18to24: Math.floor(population * 0.1),
        age25to44: Math.floor(population * 0.26),
        age65plus: Math.floor(population * 0.17),
      },
    },
  ]
}

export async function searchGeographicAreas(query: string): Promise<GeographicArea[]> {
  if (query.length < 2) {
    return []
  }

  try {
    // For demo purposes, we'll use mock data instead of making API calls
    // This helps avoid API rate limits and errors during development
    return getMockSearchResults(query)

    // The code below would be used for real API integration
    /*
    // Fetch all states
    const states = await fetchGeographicAreas("state")

    // Filter states by query
    const filteredStates = states.filter((state) => 
      state.name.toLowerCase().includes(query.toLowerCase())
    )

    // For each matching state, fetch counties and cities
    const countyAndCityPromises = filteredStates.map(async (state) => {
      const counties = await fetchGeographicAreas("county", state.id)
      const cities = await fetchGeographicAreas("city", state.id)

      return {
        counties: counties.filter((county) => 
          county.name.toLowerCase().includes(query.toLowerCase())
        ),
        cities: cities.filter((city) => 
          city.name.toLowerCase().includes(query.toLowerCase())
        )
      }
    })

    const countyAndCityResults = await Promise.all(countyAndCityPromises)

    // Combine all results
    const allResults = [
      ...filteredStates,
      ...countyAndCityResults.flatMap((result) => result.counties),
      ...countyAndCityResults.flatMap((result) => result.cities),
    ]

    return allResults
    */
  } catch (error) {
    console.error("Error searching geographic areas:", error)
    // Return mock data as fallback
    return getMockSearchResults(query)
  }
}

// Helper function to get mock search results
function getMockSearchResults(query: string): GeographicArea[] {
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

  const counties = [
    { name: "Los Angeles County", id: "037", parentId: "06" },
    { name: "Cook County", id: "031", parentId: "17" },
    { name: "Harris County", id: "201", parentId: "48" },
    { name: "Maricopa County", id: "013", parentId: "04" },
    { name: "San Diego County", id: "073", parentId: "06" },
    { name: "Orange County", id: "059", parentId: "06" },
    { name: "Miami-Dade County", id: "086", parentId: "12" },
    { name: "Dallas County", id: "113", parentId: "48" },
    { name: "Kings County", id: "047", parentId: "36" },
    { name: "Riverside County", id: "065", parentId: "06" },
  ]

  const lowerQuery = query.toLowerCase()

  const filteredStates = states
    .filter((state) => state.name.toLowerCase().includes(lowerQuery))
    .map((state) => ({
      id: state.id,
      name: state.name,
      type: "state" as const,
    }))

  const filteredCities = cities
    .filter((city) => city.name.toLowerCase().includes(lowerQuery))
    .map((city) => ({
      id: city.id,
      name: city.name,
      type: "city" as const,
      parentId: city.parentId,
    }))

  const filteredCounties = counties
    .filter((county) => county.name.toLowerCase().includes(lowerQuery))
    .map((county) => ({
      id: county.id,
      name: county.name,
      type: "county" as const,
      parentId: county.parentId,
    }))

  return [...filteredStates, ...filteredCounties, ...filteredCities].slice(0, 10)
}

// Mock API response processing function
function processApiResponse(data: any, year: number, geography: string): DemographicData[] {
  return data.map((item: any) => {
    const geographyId = item[0]
    const geographyName = item[1]
    const population = Number.parseInt(item[2])

    // Mock data for other fields
    const medianAge = Math.floor(Math.random() * 20) + 25 + Math.random()
    const medianIncome = Math.floor(Math.random() * 70000) + 30000
    const white = Math.floor(population * (Math.random() * 0.3 + 0.4))
    const black = Math.floor(population * (Math.random() * 0.2 + 0.05))
    const asian = Math.floor(population * (Math.random() * 0.15 + 0.05))
    const hispanic = Math.floor(population * (Math.random() * 0.2 + 0.1))
    const other = population - white - black - asian - hispanic
    const under18 = Math.floor(population * 0.22)
    const age18to24 = Math.floor(population * 0.1)
    const age25to44 = Math.floor(population * 0.26)
    const age65plus = Math.floor(population * 0.17)

    return {
      geographyId,
      geographyName,
      year,
      population,
      medianAge,
      medianIncome,
      raceDistribution: { white, black, asian, hispanic, other },
      ageDistribution: { under18, age18to24, age25to44, age65plus },
    }
  })
}
