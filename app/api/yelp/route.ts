import { NextResponse, type NextRequest } from "next/server"
import { searchYelpBusinesses } from "@/services/yelp-service"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const term = body?.term as string
    const location = body?.location as string
    const limit = body?.limit as number | undefined

    if (!term || !location) {
      return NextResponse.json({ error: "term and location are required" }, { status: 400 })
    }

    const businesses = await searchYelpBusinesses({ term, location, limit })
    return NextResponse.json({ businesses })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 },
    )
  }
}