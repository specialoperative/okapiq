import { NextResponse, type NextRequest } from "next/server"
import { searchGooglePlaces } from "@/services/google-service"
import { searchYelpBusinesses } from "@/services/yelp-service"
import { searchBusinesses } from "@/services/dataaxle-service"
import { getCensusData } from "@/services/census-service"
import { mergeBusinessSignals } from "@/services/enrichment-service"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const prompt = (body?.prompt as string) || ""
    const limit = (body?.limit as number) ?? 5

    if (!prompt) return NextResponse.json({ error: "prompt is required" }, { status: 400 })

    const { industry, location } = extractIntent(prompt)
    const search = `${industry || "small business"}${location ? " near " + location : ""}`

    const googlePlaces = await searchGooglePlaces({ query: search, limit })
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

    const profiles = googlePlaces.map((g, idx) => {
      const yelp = (yelpLists[idx] && yelpLists[idx][0]) || undefined
      const dataaxle = (dataaxleLists[idx] && dataaxleLists[idx][0]) || undefined
      return mergeBusinessSignals({ google: g, yelp, dataaxle, census, industryHint: industry })
    })

    return NextResponse.json({ intent: { industry, location }, results: profiles })
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Unknown error" }, { status: 500 })
  }
}

function extractIntent(prompt: string): { industry?: string; location?: string } {
  const lower = prompt.toLowerCase()
  // Very simple heuristics; replace with LLM when API key available
  const industryMatch = lower.match(/(hvac|plumb|roof|landscap|clean|electric|auto|garage|laundry|medical|dental|spa|salon)/)
  const industryMap: Record<string, string> = {
    hvac: "HVAC",
    plumb: "Plumbing",
    roof: "Roofing",
    landscap: "Landscaping",
    clean: "Cleaning",
    electric: "Electrical",
    auto: "Auto",
    garage: "Garage",
    laundry: "Laundromat",
    medical: "Medical",
    dental: "Dental",
    spa: "Spa",
    salon: "Salon",
  }
  const industry = industryMatch ? industryMap[industryMatch[1]] || industryMatch[1] : undefined

  const locMatch = prompt.match(/in ([A-Za-z\s]+,?\s*[A-Z]{2})|near ([A-Za-z\s]+,?\s*[A-Z]{2})/i)
  const location = locMatch ? (locMatch[1] || locMatch[2])?.trim() : undefined

  return { industry, location }
}