import { mockBusinessData } from "@/data/mock-business-data"
import type { BusinessRecord } from "@/services/dataaxle-service"
import { analyzeWebsite } from "@/services/website-crawler"
import { summarizeReviews } from "@/services/reviews-agent"
import { computeScores } from "@/services/scoring-engine"

export interface CrawlerOptions {
  industry?: string
  location?: string
  revenue?: [number, number] // Min, max revenue range
  employees?: [number, number] // Min, max employee count
  includeContactInfo?: boolean
}

export interface CrawledBusiness {
  name: string
  address: string
  phone?: string
  website?: string
  industry: string
  estimatedRevenue?: number
  employeeCount?: number
  ownerName?: string
  ownerEmail?: string
  founded?: number
  socialProfiles?: Record<string, string>
  arbitrageScore?: number // How undervalued the business might be
  fragmentationIndex?: number // Industry fragmentation score
  // New enrichment fields
  lastSiteUpdate?: string
  services?: string[]
  visualCheck?: string
  avgSentiment?: number
  reviewThemes?: string[]
  adSpendEst?: string
  digitalActivity?: string
  successionScore?: number
  dealReadiness?: "Low" | "Medium" | "High"
}

export class CrawlerService {
  constructor() {
    // No API keys needed
  }

  async findSMBsByUserCriteria(options: CrawlerOptions): Promise<CrawledBusiness[]> {
    try {
      console.log(`Starting SMB crawl with criteria:`, options)

      // Try to use DataAxle API first
      try {
        const businesses = await this.getDataAxleBusinesses(options)
        if (businesses.length > 0) {
          console.log(`Found ${businesses.length} businesses from DataAxle API`)
          const enriched = await this.enrichBusinesses(businesses)
          return enriched
        }
      } catch (error) {
        console.warn("Error using DataAxle API, falling back to mock data:", error)
      }

      // Fall back to mock data if DataAxle API fails or returns no results
      let businesses = await this.getMockBusinessData(options)
      console.log(`Found ${businesses.length} businesses from mock data`)

      // Calculate arbitrage scores based on industry benchmarks
      businesses = this.calculateArbitrageScores(businesses)

      const enriched = await this.enrichBusinesses(businesses)
      return enriched
    } catch (error) {
      console.error("Error in SMB crawler:", error)
      throw new Error(`Failed to crawl SMB data: ${error}`)
    }
  }

  private async getDataAxleBusinesses(options: CrawlerOptions): Promise<CrawledBusiness[]> {
    // Map crawler options to DataAxle search parameters
    const searchParams: any = {
      limit: 50, // Use the maximum allowed for trial
    }

    if (options.industry) {
      searchParams.industry = options.industry
    }

    if (options.location) {
      // Try to parse location into city and state
      const locationParts = options.location.split(",").map((part) => part.trim())
      if (locationParts.length >= 2) {
        searchParams.city = locationParts[0]
        searchParams.state = locationParts[1]
      } else {
        // If we can't parse it, just use it as a city
        searchParams.city = options.location
      }
    }

    if (options.revenue) {
      searchParams.revenue = options.revenue
    }

    if (options.employees) {
      searchParams.employeeCount = options.employees
    }

    // Call the DataAxle API
    const response = await fetch("/api/dataaxle", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "search-businesses",
        params: searchParams,
      }),
    })

    if (!response.ok) {
      throw new Error(`DataAxle API error: ${response.statusText}`)
    }

    const data = await response.json()
    const businesses = data.businesses || []

    // Map DataAxle business records to CrawledBusiness format
    return businesses.map((business: BusinessRecord) => {
      return {
        name: business.name,
        address: `${business.address}, ${business.city}, ${business.state} ${business.zipCode}`,
        phone: business.phone,
        website: business.website,
        industry: options.industry || "Unknown",
        estimatedRevenue: business.revenue,
        employeeCount: business.employeeCount,
        ownerName: business.contactName,
        ownerEmail: business.email,
        founded: business.yearEstablished,
        socialProfiles: {},
        // These will be calculated later
        arbitrageScore: undefined,
        fragmentationIndex: undefined,
      }
    })
  }

  private async getMockBusinessData(options: CrawlerOptions): Promise<CrawledBusiness[]> {
    // Filter mock data based on options
    let filteredData = [...mockBusinessData]

    if (options.industry) {
      filteredData = filteredData.filter(
        (business) => business.industry.toLowerCase() === options.industry?.toLowerCase(),
      )
    }

    if (options.location) {
      filteredData = filteredData.filter((business) =>
        business.address.toLowerCase().includes(options.location?.toLowerCase() || ""),
      )
    }

    if (options.revenue) {
      const [min, max] = options.revenue
      filteredData = filteredData.filter((business) => {
        const revenue = business.estimatedRevenue || 0
        return revenue >= min && revenue <= max
      })
    }

    if (options.employees) {
      const [min, max] = options.employees
      filteredData = filteredData.filter((business) => {
        const employees = business.employeeCount || 0
        return employees >= min && employees <= max
      })
    }

    // Add fragmentation index to each business based on industry
    const fragmentationByIndustry: Record<string, number> = {
      landscaping: 89,
      hvac: 78,
      cleaning: 92,
      "auto detailing": 85,
      ecommerce: 75,
      plumbing: 82,
      construction: 80,
      restaurants: 87,
      retail: 79,
    }

    return filteredData.map((business) => ({
      ...business,
      fragmentationIndex:
        fragmentationByIndustry[business.industry.toLowerCase()] || Math.floor(Math.random() * 30) + 70, // 70-99 if industry not found
    }))
  }

  private calculateArbitrageScores(businesses: CrawledBusiness[]): CrawledBusiness[] {
    // Group businesses by industry for comparison
    const businessesByIndustry = businesses.reduce(
      (acc, business) => {
        if (!acc[business.industry]) {
          acc[business.industry] = []
        }
        acc[business.industry].push(business)
        return acc
      },
      {} as Record<string, CrawledBusiness[]>,
    )

    // Calculate arbitrage scores within each industry
    const scoredBusinesses: CrawledBusiness[] = []

    for (const industry in businessesByIndustry) {
      const industryBusinesses = businessesByIndustry[industry]

      // Only proceed if we have revenue data
      const businessesWithRevenue = industryBusinesses.filter((b) => b.estimatedRevenue)

      if (businessesWithRevenue.length > 0) {
        // Calculate average revenue for this industry
        const avgRevenue =
          businessesWithRevenue.reduce((sum, b) => sum + (b.estimatedRevenue || 0), 0) / businessesWithRevenue.length

        // Calculate arbitrage score based on revenue (simplified example)
        businessesWithRevenue.forEach((business) => {
          if (business.estimatedRevenue && avgRevenue) {
            // Lower score = more undervalued (better deal)
            business.arbitrageScore = business.estimatedRevenue / avgRevenue
          }
        })
      }

      scoredBusinesses.push(...industryBusinesses)
    }

    return scoredBusinesses
  }

  private async enrichBusinesses(businesses: CrawledBusiness[]): Promise<CrawledBusiness[]> {
    const enriched = await Promise.all(
      businesses.map(async (b) => {
        const website = await analyzeWebsite(b.website, b.phone)
        const reviews = await summarizeReviews(b.name)
        const scores = computeScores(b, reviews, website)

        return {
          ...b,
          lastSiteUpdate: website ? String(website.lastUpdatedYear) : undefined,
          services: website?.services,
          visualCheck: website?.visualCheck,
          avgSentiment: reviews.avgSentiment,
          reviewThemes: reviews.themes,
          adSpendEst: `$${scores.adSpendEstimate}/mo`,
          digitalActivity: scores.digitalHealth > 70 ? "High" : scores.digitalHealth > 40 ? "Medium" : "Low",
          successionScore: scores.successionScore,
          dealReadiness: scores.dealReadiness,
        }
      }),
    )

    return enriched
  }
}
