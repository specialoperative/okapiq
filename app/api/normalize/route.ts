import { NextResponse, type NextRequest } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const records = (body?.records as any[]) || []
    const normalized = records.map(normalize)
    return NextResponse.json({ results: normalized })
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Unknown error" }, { status: 500 })
  }
}

function normalize(r: any) {
  return {
    businessName: r.businessName || r.name || r.company || "Unknown",
    website: r.website || r.url,
    phone: r.phone || r.tel,
    address: r.address || [r.street, r.city, r.state, r.zip].filter(Boolean).join(", ") || undefined,
    rating: r.rating ?? undefined,
    totalReviews: r.totalReviews ?? r.review_count ?? undefined,
    yelpRating: r.yelpRating ?? undefined,
    yelpReviews: r.yelpReviews ?? undefined,
    categories: r.categories ?? r.naicsTitles ?? [],
    revenueEstimate: r.revenueEstimate ?? r.revenue ?? undefined,
    employeeCount: r.employeeCount ?? r.employees ?? undefined,
    ownerName: r.ownerName ?? r.contact ?? undefined,
    email: r.email ?? r.ownerEmail ?? undefined,
    zip: r.zip || r.postalCode,
  }
}