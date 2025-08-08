import { NextResponse, type NextRequest } from "next/server"
import { searchGooglePlaces } from "@/services/google-service"
import { searchYelpBusinesses } from "@/services/yelp-service"
import { searchBusinesses } from "@/services/dataaxle-service"
import { getCensusData } from "@/services/census-service"
import { mergeBusinessSignals } from "@/services/enrichment-service"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const search = (body?.search as string) || ""
    const location = (body?.location as string) || ""
    const industry = (body?.industry as string) || undefined
    const limit = (body?.limit as number) ?? 5

    if (!search) {
      return NextResponse.json({ error: "search is required" }, { status: 400 })
    }

    // 1) Google search for seed businesses
    const googlePlaces = await searchGooglePlaces({ query: `${search}${location ? " in " + location : ""}`, limit })

    // 2) Parallel enrich: Yelp by name+location, DataAxle by name+city/state, Census by location
    const firstCity = location || googlePlaces[0]?.address || ""

    const [census, yelpLists, dataaxleLists] = await Promise.all([
      getCensusData(firstCity || "Phoenix, AZ"),
      Promise.all(
        googlePlaces.map((g) =>
          searchYelpBusinesses({ term: g.name, location: g.address || firstCity || "", limit: 1 }),
        ),
      ),
      Promise.all(
        googlePlaces.map((g) =>
          searchBusinesses({ businessName: g.name, city: undefined, state: undefined, limit: 1 }),
        ),
      ),
    ])

    // 3) Merge per business
    const profiles = googlePlaces.map((g, idx) => {
      const yelp = (yelpLists[idx] && yelpLists[idx][0]) || undefined
      const dataaxle = (dataaxleLists[idx] && dataaxleLists[idx][0]) || undefined
      return mergeBusinessSignals({ google: g, yelp, dataaxle, census, industryHint: industry })
    })

    return NextResponse.json({ results: profiles })
  } catch (err) {
    console.error("agent-google-scape error", err)
    return NextResponse.json({ error: err instanceof Error ? err.message : "Unknown error" }, { status: 500 })
  }
}