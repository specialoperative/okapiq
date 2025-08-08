export interface YelpBusiness {
  id: string
  name: string
  rating?: number
  reviewCount?: number
  photosCount?: number
  isClaimed?: boolean
  address?: string
  zip?: string
  phone?: string
  website?: string
  categories?: string[]
  yelpJoinedYear?: number
}

export interface YelpSearchParams {
  term: string // e.g., "HVAC"
  location: string // e.g., "Phoenix, AZ"
  limit?: number
}

const YELP_API_BASE = "https://api.yelp.com/v3"

export async function searchYelpBusinesses(params: YelpSearchParams): Promise<YelpBusiness[]> {
  const apiKey = process.env.YELP_API_KEY
  const limit = Math.min(params.limit ?? 5, 20)

  if (!apiKey) {
    console.warn("YELP_API_KEY not set; returning mock Yelp results.")
    return getMockYelp(params.term, params.location, limit)
  }

  const url = `${YELP_API_BASE}/businesses/search?term=${encodeURIComponent(params.term)}&location=${encodeURIComponent(
    params.location,
  )}&limit=${limit}`

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${apiKey}` },
    cache: "no-store",
  })

  if (!res.ok) {
    console.warn(`Yelp search failed: ${res.status} ${res.statusText}`)
    return getMockYelp(params.term, params.location, limit)
  }

  const data = await res.json()
  const businesses = (data.businesses ?? []) as any[]
  return businesses.map((b) => normalizeYelp(b))
}

export async function getYelpBusinessDetails(id: string): Promise<YelpBusiness | null> {
  const apiKey = process.env.YELP_API_KEY
  if (!apiKey) return null

  const res = await fetch(`${YELP_API_BASE}/businesses/${id}`, {
    headers: { Authorization: `Bearer ${apiKey}` },
    cache: "no-store",
  })
  if (!res.ok) return null
  const b = await res.json()
  return normalizeYelp(b)
}

function normalizeYelp(b: any): YelpBusiness {
  const addressParts = [b.location?.address1, b.location?.city, b.location?.state, b.location?.zip_code]
    .filter(Boolean)
    .join(", ")

  return {
    id: b.id,
    name: b.name,
    rating: b.rating,
    reviewCount: b.review_count,
    photosCount: Array.isArray(b.photos) ? b.photos.length : undefined,
    isClaimed: b.is_claimed,
    address: addressParts || undefined,
    zip: b.location?.zip_code,
    phone: b.display_phone || b.phone,
    website: b.url,
    categories: (b.categories ?? []).map((c: any) => c.title),
    // Yelp Fusion does not expose "joined year"; derive rough founding from oldest review via a separate call if needed.
  }
}

function getMockYelp(term: string, location: string, limit: number): YelpBusiness[] {
  const base = [
    { name: "Elite HVAC Solutions", rating: 4.2, reviewCount: 67 },
    { name: "AirLogic HVAC", rating: 4.0, reviewCount: 45 },
    { name: "Phoenix Cooling Pros", rating: 3.8, reviewCount: 21 },
    { name: "Desert Air & Heat", rating: 4.4, reviewCount: 112 },
    { name: "Comfort Zone Heating", rating: 4.6, reviewCount: 204 },
  ]

  return base.slice(0, limit).map((b, i) => ({
    id: `mock_yelp_${i}`,
    name: b.name,
    rating: b.rating,
    reviewCount: b.reviewCount,
    photosCount: Math.floor(Math.random() * 20),
    isClaimed: Math.random() > 0.3,
    address: `${location}`,
    zip: "85001",
    phone: "(555) 123-4567",
    website: undefined,
    categories: [term],
  }))
}