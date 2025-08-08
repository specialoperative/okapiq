import { NextResponse, type NextRequest } from "next/server"
import { searchGooglePlaces } from "@/services/google-service"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const query = body?.query as string
    const limit = body?.limit as number | undefined

    if (!query || typeof query !== "string") {
      return NextResponse.json({ error: "query is required" }, { status: 400 })
    }

    const places = await searchGooglePlaces({ query, limit })
    return NextResponse.json({ places })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 },
    )
  }
}