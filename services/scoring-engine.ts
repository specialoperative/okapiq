import type { CrawledBusiness } from "@/services/crawler-service"
import type { ReviewsSummary } from "@/services/reviews-agent"
import type { WebsiteAnalysis } from "@/services/website-crawler"

export interface DealScores {
  adSpendEstimate: number
  successionScore: number // 0-100
  digitalHealth: number // 0-100
  dealReadiness: "Low" | "Medium" | "High"
}

export function computeScores(
  business: CrawledBusiness,
  reviews?: ReviewsSummary | null,
  website?: WebsiteAnalysis | null,
): DealScores {
  // Ad spend estimate heuristic: higher revenue and modern site implies more spend; otherwise low
  const revenueK = (business.estimatedRevenue || 200_000) / 1000
  const modernSite = website ? website.visualCheck.toLowerCase().includes("modern") : false
  const adSpendEstimate = Math.round((modernSite ? 0.8 : 0.2) * revenueK)

  // Succession: older site year, low digital activity, higher owner age proxy via founded year
  const year = new Date().getFullYear()
  const foundedYear = business.founded || year - 10
  const siteYear = website?.lastUpdatedYear || foundedYear
  const ageProxy = Math.min(40, Math.max(0, year - foundedYear)) // 0-40
  const staleness = Math.min(10, Math.max(0, year - siteYear)) // 0-10
  const lowDigital = reviews ? Math.min(10, Math.floor(reviews.lastReviewDaysAgo / 60)) : 5 // 0-10
  const successionScore = Math.round(ageProxy * 1.5 + staleness * 3 + lowDigital * 3)

  // Digital health: recent reviews, ssl, modern site, photos/theme proxy
  const recentReviewsScore = reviews ? Math.max(0, 100 - reviews.lastReviewDaysAgo) : 40
  const sslScore = website?.sslValid ? 20 : 0
  const themeScore = website && modernSite ? 30 : 10
  const sentimentScore = reviews ? Math.round(reviews.avgSentiment * 30) : 10
  const digitalHealth = Math.min(100, recentReviewsScore * 0.3 + sslScore + themeScore + sentimentScore)

  const dealReadiness = successionScore > 80 && digitalHealth < 60 ? "High" : successionScore > 60 ? "Medium" : "Low"

  return {
    adSpendEstimate,
    successionScore: Math.min(100, successionScore),
    digitalHealth: Math.min(100, Math.round(digitalHealth)),
    dealReadiness,
  }
}