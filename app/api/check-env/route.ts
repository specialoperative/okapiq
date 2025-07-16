import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    hasCensusApiKey: !!process.env.CENSUS_API_KEY,
  })
}

