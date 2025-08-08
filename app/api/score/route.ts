import { NextResponse, type NextRequest } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const profiles = (body?.profiles as any[]) || []

    const withScores = profiles.map((p) => {
      const adSpendProxy = estimateAdSpend(p)
      const dealReadiness = rateDealReadiness(p, adSpendProxy)
      return { ...p, adSpendProxy, dealReadiness }
    })

    return NextResponse.json({ results: withScores })
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Unknown error" }, { status: 500 })
  }
}

function estimateAdSpend(p: any): number {
  // Naive proxy: more reviews and higher digital health => higher likely spend
  const base = (p.totalReviews ?? 0) * 2 + (p.yelpReviews ?? 0)
  const dh = p.digitalHealthScore ?? 50
  return Math.round(base * (0.5 + dh / 200))
}

function rateDealReadiness(p: any, adSpendProxy: number): "Low" | "Medium" | "High" {
  const succ = p.successionRisk ?? 50
  const digital = p.digitalHealthScore ?? 50
  const scale = p.scalabilityScore ?? 50
  const composite = 0.5 * succ + 0.25 * (100 - digital) + 0.25 * scale + (adSpendProxy > 300 ? -5 : 5)
  if (composite >= 70) return "High"
  if (composite >= 45) return "Medium"
  return "Low"
}