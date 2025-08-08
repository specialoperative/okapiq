import { NextResponse, type NextRequest } from "next/server"
import { searchBusinesses } from "@/services/dataaxle-service"
import { getCensusData } from "@/services/census-service"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const naics = (body?.naics as string | string[] | undefined) || undefined
    const zip = (body?.zip as string | undefined) || undefined
    const limit = (body?.limit as number | undefined) ?? 20

    const businesses = await searchBusinesses({ naics, zipCode: zip, limit })
    const census = await getCensusData(zip || "Phoenix, AZ")

    const results = businesses.map((b) => {
      const income = census.incomeMetrics.find((m) => m.name === "Median Household Income")?.value ?? 60000
      const competitorCount = body?.competitorCount ?? Math.floor(10 + Math.random() * 30)
      const revenue = b.revenue ?? Math.floor(300_000 + Math.random() * 1_500_000)
      const industryAvg = Math.floor(1_000_000)

      const revenueDelta = revenue - industryAvg
      const scalabilityScore = Math.round(((revenue / Math.max(1, competitorCount)) + income / 1000) / 2)
      const digitalHealth = Math.round(30 + Math.random() * 60)
      const successionRisk = Math.round(30 + Math.random() * 60)

      return {
        business_id: b.id,
        business_name: b.name,
        owner: b.contactName,
        zip: b.zipCode,
        revenue,
        naics: (b.naics && b.naics[0]) || undefined,
        industry_avg_revenue: industryAvg,
        zip_avg_income: income,
        competitor_count: competitorCount,
        scalability_score: Math.max(0, Math.min(100, scalabilityScore)),
        succession_risk: successionRisk / 100,
        digital_health: digitalHealth,
        acquisition_rating: gradeFromScores(scalabilityScore, digitalHealth, successionRisk),
      }
    })

    return NextResponse.json({ results })
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Unknown error" }, { status: 500 })
  }
}

function gradeFromScores(scale: number, digital: number, succ: number): string {
  const avg = 0.4 * scale + 0.3 * digital + 0.3 * succ
  if (avg >= 85) return "A"
  if (avg >= 75) return "A-"
  if (avg >= 67) return "B+"
  if (avg >= 60) return "B"
  if (avg >= 50) return "B-"
  return "C"
}