import { type NextRequest, NextResponse } from "next/server"
import {
  searchBusinesses,
  searchPeople,
  getBusinessDetails,
  getPersonDetails,
  checkDataAxleTokens,
} from "@/services/dataaxle-service"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const action = searchParams.get("action")

    // Check API tokens
    if (action === "check-tokens") {
      const tokenStatus = await checkDataAxleTokens()
      return NextResponse.json(tokenStatus)
    }

    // Get business details
    if (action === "business-details") {
      const businessId = searchParams.get("id")
      if (!businessId) {
        return NextResponse.json({ error: "Business ID is required" }, { status: 400 })
      }

      const business = await getBusinessDetails(businessId)
      if (!business) {
        return NextResponse.json({ error: "Business not found" }, { status: 404 })
      }

      return NextResponse.json(business)
    }

    // Get person details
    if (action === "person-details") {
      const personId = searchParams.get("id")
      if (!personId) {
        return NextResponse.json({ error: "Person ID is required" }, { status: 400 })
      }

      const person = await getPersonDetails(personId)
      if (!person) {
        return NextResponse.json({ error: "Person not found" }, { status: 404 })
      }

      return NextResponse.json(person)
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("Error in DataAxle API route:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, params } = body

    // Search businesses
    if (action === "search-businesses") {
      const businesses = await searchBusinesses(params)
      return NextResponse.json({ businesses })
    }

    // Search people
    if (action === "search-people") {
      const people = await searchPeople(params)
      return NextResponse.json({ people })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("Error in DataAxle API route:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 })
  }
}
