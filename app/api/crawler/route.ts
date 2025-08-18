import { type NextRequest, NextResponse } from "next/server"
import { CrawlerService, type CrawlerOptions } from "@/services/crawler-service"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const options: CrawlerOptions = {
      industry: body.industry,
      location: body.location,
      revenue: body.revenue,
      employees: body.employees,
      includeContactInfo: body.includeContactInfo || false,
    }

    const crawlerService = new CrawlerService()
    const results = await crawlerService.findSMBsByUserCriteria(options)

    return NextResponse.json({
      success: true,
      data: results,
    })
  } catch (error) {
    console.error("Error in crawler API:", error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
