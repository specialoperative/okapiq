import type { GooglePlace } from "@/services/google-service"
import type { YelpBusiness } from "@/services/yelp-service"
import type { BusinessRecord } from "@/services/dataaxle-service"
import type { CensusData } from "@/services/census-service"

export interface EnrichedBusinessProfile {
  businessName: string
  website?: string
  phone?: string
  address?: string
  zip?: string
  rating?: number
  totalReviews?: number
  yelpRating?: number
  yelpReviews?: number
  categories?: string[]
  industry?: string
  naics?: string[]
  revenueEstimate?: number
  employeeCount?: number
  ownerName?: string
  email?: string
  siteFreshnessSignal?: number // 0-100
  digitalHealthScore?: number // 0-100
  successionRisk?: number // 0-100
  scalabilityScore?: number // 0-100
  location: { city?: string; state?: string; zip?: string }
  sources: { google?: string; yelp?: string; dataaxleId?: string }
}

export function mergeBusinessSignals(args: {
  google?: GooglePlace
  yelp?: YelpBusiness
  dataaxle?: BusinessRecord
  census?: CensusData
  industryHint?: string
}): EnrichedBusinessProfile {
  const { google, yelp, dataaxle, census, industryHint } = args

  const businessName = google?.name || yelp?.name || dataaxle?.name || "Unknown Business"
  const address = google?.address || yelp?.address || buildDataAxleAddress(dataaxle)
  const phone = google?.phone || dataaxle?.phone || yelp?.phone
  const website = google?.website || dataaxle?.website || yelp?.website
  const zip = dataaxle?.zipCode || yelp?.zip

  const rating = google?.rating
  const totalReviews = google?.totalReviews
  const yelpRating = yelp?.rating
  const yelpReviews = yelp?.reviewCount

  const categories = yelp?.categories
  const naics = dataaxle?.naics
  const revenueEstimate = dataaxle?.revenue
  const employeeCount = dataaxle?.employeeCount
  const ownerName = dataaxle?.contactName
  const email = dataaxle?.email

  const siteFreshnessSignal = estimateSiteFreshness(website)
  const digitalHealthScore = computeDigitalHealth({ rating, totalReviews, yelpRating, yelpReviews, siteFreshnessSignal })
  const successionRisk = computeSuccessionRisk({ census, digitalHealthScore })
  const scalabilityScore = computeScalability({ revenueEstimate, employeeCount, census })

  return {
    businessName,
    website,
    phone,
    address,
    zip,
    rating,
    totalReviews,
    yelpRating,
    yelpReviews,
    categories,
    industry: industryHint,
    naics,
    revenueEstimate,
    employeeCount,
    ownerName,
    email,
    siteFreshnessSignal,
    digitalHealthScore,
    successionRisk,
    scalabilityScore,
    location: { city: dataaxle?.city, state: dataaxle?.state, zip },
    sources: { google: google?.placeId, yelp: yelp?.id, dataaxleId: dataaxle?.id },
  }
}

function buildDataAxleAddress(d?: BusinessRecord): string | undefined {
  if (!d) return undefined
  const parts = [d.address, d.city, d.state, d.zipCode].filter(Boolean)
  return parts.length ? parts.join(", ") : undefined
}

function estimateSiteFreshness(website?: string): number {
  if (!website) return 40
  // If domain present but no metadata, give neutral-ish score
  return 65
}

function computeDigitalHealth(input: {
  rating?: number
  totalReviews?: number
  yelpRating?: number
  yelpReviews?: number
  siteFreshnessSignal?: number
}): number {
  const r = normalize(input.rating, 0, 5)
  const yr = normalize(input.yelpRating, 0, 5)
  const rev = normalize(input.totalReviews, 0, 500)
  const yrev = normalize(input.yelpReviews, 0, 500)
  const site = normalize(input.siteFreshnessSignal, 0, 100)

  const score = 0.3 * r + 0.2 * yr + 0.2 * rev + 0.1 * yrev + 0.2 * site
  return Math.round(score * 100)
}

function computeSuccessionRisk(input: { census?: CensusData; digitalHealthScore?: number }): number {
  const over55 = input.census?.ageMetrics.find((m) => m.name === "Percentage Over 55")?.value ?? 30
  const dh = input.digitalHealthScore ?? 50
  // Higher age, lower digital health -> higher risk
  const risk = 0.6 * normalize(over55, 0, 60) * 100 + 0.4 * (1 - dh / 100) * 100
  return Math.min(100, Math.max(0, Math.round(risk)))
}

function computeScalability(input: {
  revenueEstimate?: number
  employeeCount?: number
  census?: CensusData
}): number {
  const rev = normalize(input.revenueEstimate, 0, 5_000_000)
  const emp = normalize(input.employeeCount, 1, 50)
  const income = input.census?.incomeMetrics.find((m) => m.name === "Median Household Income")?.value ?? 60000
  const inc = normalize(income, 30_000, 120_000)
  const score = 0.4 * inc + 0.4 * (1 - emp) + 0.2 * (1 - rev)
  return Math.round(score * 100)
}

function normalize(value: number | undefined, min: number, max: number): number {
  if (value === undefined || Number.isNaN(value)) return 0.5
  if (max === min) return 0.5
  const v = Math.max(min, Math.min(max, value))
  return (v - min) / (max - min)
}