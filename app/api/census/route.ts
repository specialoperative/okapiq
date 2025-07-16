import { type NextRequest, NextResponse } from "next/server"

// Base URL for Census API
const CENSUS_API_BASE_URL = "https://api.census.gov/data"

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const searchParams = request.nextUrl.searchParams
    const checkApiKey = searchParams.get("checkApiKey") === "true"

    // If this is an API key check request
    if (checkApiKey) {
      const apiKey = process.env.CENSUS_API_KEY

      if (!apiKey) {
        return NextResponse.json({
          success: false,
          error: "Census API key is not configured",
        })
      }

      // Test the API key with a simple request
      try {
        const testUrl = `${CENSUS_API_BASE_URL}/2020/acs/acs5?get=NAME&for=state:*&key=${apiKey}`
        const response = await fetch(testUrl)

        if (response.ok) {
          return NextResponse.json({ success: true })
        } else {
          return NextResponse.json({
            success: false,
            error: `Census API returned status ${response.status}`,
          })
        }
      } catch (error) {
        return NextResponse.json({
          success: false,
          error: "Failed to connect to Census API",
        })
      }
    }

    // Regular API request handling
    const year = searchParams.get("year") || "2020"
    const dataset = searchParams.get("dataset") || "acs/acs5"
    const variables = searchParams.get("variables") || "NAME"
    const geography = searchParams.get("geography") || "state"
    const location = searchParams.get("location") || "*"
    const parentGeography = searchParams.get("parentGeography")
    const parentId = searchParams.get("parentId")

    // Check for API key
    const apiKey = process.env.CENSUS_API_KEY
    if (!apiKey) {
      console.warn("Census API key is missing. Using mock data.")
      return NextResponse.json(getMockCensusResponse(geography, location), { status: 200 })
    }

    // Construct the API URL
    let url = `${CENSUS_API_BASE_URL}/${year}/${dataset}?get=${variables}`

    if (parentGeography && parentId) {
      url += `&for=${geography}:${location}&in=${parentGeography}:${parentId}`
    } else {
      url += `&for=${geography}:${location}`
    }

    // Add API key
    url += `&key=${apiKey}`

    console.log("Fetching Census API:", url)

    // Make the request to the Census API
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Census API error response:", errorText)
      console.warn("Using mock data due to Census API error")
      return NextResponse.json(getMockCensusResponse(geography, location), { status: 200 })
    }

    const data = await response.json()

    // Return the data
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in Census API route:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 })
  }
}

// Helper function to generate mock Census API response
function getMockCensusResponse(geography: string, location: string) {
  // Create a mock response that matches the structure of the Census API
  const headers = ["NAME", "B01001_001E", "B19013_001E", geography]
  const rows = []

  if (geography === "state" && location === "*") {
    // Generate mock data for all states
    const states = [
      ["Alabama", "4903185", "50536", "01"],
      ["Alaska", "731545", "75463", "02"],
      ["Arizona", "7278717", "58945", "04"],
      ["California", "39512223", "75235", "06"],
      ["Colorado", "5758736", "72331", "08"],
      ["Florida", "21477737", "55660", "12"],
      ["Georgia", "10617423", "58700", "13"],
      ["Texas", "28995881", "61874", "48"],
      ["New York", "19453561", "68486", "36"],
      ["Washington", "7614893", "73775", "53"],
    ]
    rows.push(...states)
  } else if (geography === "county") {
    // Generate mock data for counties
    rows.push(
      ["Sample County 1", "250000", "65000", "001"],
      ["Sample County 2", "175000", "58000", "003"],
      ["Sample County 3", "320000", "72000", "005"],
    )
  } else {
    // Default mock data
    rows.push(["Sample Location", "100000", "60000", location])
  }

  return [headers, ...rows]
}

