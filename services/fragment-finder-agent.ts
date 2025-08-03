/**
 * Fragment Finder Agent (Rollup Opportunity Engine)
 * 
 * Analyzes market fragmentation, calculates HHI (Herfindahl-Hirschman Index),
 * and identifies consolidation opportunities in local markets.
 */

import { BusinessData, FragmentationAnalysis, ConsolidationTarget, MarketMetrics } from '../types/fragment-finder';
import { YelpScraper } from './scrapers/yelp-scraper';
import { GoogleBusinessScraper } from './scrapers/google-business-scraper';
import { BBBScraper } from './scrapers/bbb-scraper';
import { ReviewNLPAnalyzer } from './nlp/review-analyzer';
import { MarketEntropyCalculator } from './analytics/market-entropy';

export class FragmentFinderAgent {
  private yelpScraper: YelpScraper;
  private googleScraper: GoogleBusinessScraper;
  private bbbScraper: BBBScraper;
  private nlpAnalyzer: ReviewNLPAnalyzer;
  private entropyCalculator: MarketEntropyCalculator;

  constructor() {
    this.yelpScraper = new YelpScraper();
    this.googleScraper = new GoogleBusinessScraper();
    this.bbbScraper = new BBBScraper();
    this.nlpAnalyzer = new ReviewNLPAnalyzer();
    this.entropyCalculator = new MarketEntropyCalculator();
  }

  /**
   * Main analysis function - analyzes fragmentation for a given market
   */
  async analyzeFragmentation(
    zip: string, 
    industry: string,
    options?: {
      includeEntropy?: boolean;
      maxBusinesses?: number;
      includeNLPAnalysis?: boolean;
    }
  ): Promise<FragmentationAnalysis> {
    const { includeEntropy = true, maxBusinesses = 500, includeNLPAnalysis = true } = options || {};

    try {
      // Step 1: Scrape business data from multiple sources
      const smbList = await this.scrapeYelpAndGMB(zip, industry, maxBusinesses);
      
      if (smbList.length === 0) {
        throw new Error(`No businesses found for industry "${industry}" in ZIP ${zip}`);
      }

      // Step 2: Calculate core fragmentation metrics
      const hhi = this.calculateHHI(smbList);
      const momPopDensity = this.calculateMomPopDensity(smbList);
      const marketMetrics = this.calculateMarketMetrics(smbList);

      // Step 3: Calculate entropy and chaos metrics (if enabled)
      let entropyMetrics = null;
      if (includeEntropy) {
        entropyMetrics = await this.entropyCalculator.calculateMarketEntropy(smbList, industry);
      }

      // Step 4: Analyze reviews for chaos indicators (if enabled)
      let chaosIndicators = null;
      if (includeNLPAnalysis) {
        chaosIndicators = await this.analyzeChaosIndicators(smbList);
      }

      // Step 5: Calculate consolidation score with chaos adjustments
      const baseConsolidationScore = (1 - hhi) * 100 + momPopDensity * 50;
      const adjustedConsolidationScore = this.adjustForChaos(
        baseConsolidationScore, 
        entropyMetrics, 
        chaosIndicators,
        industry
      );

      // Step 6: Identify top consolidation targets
      const topTargets = this.identifyTopTargets(smbList, 15);

      // Step 7: Calculate cost and synergy projections
      const financialProjections = this.calculateFinancialProjections(topTargets, marketMetrics);

      return {
        zip,
        industry,
        timestamp: new Date().toISOString(),
        marketMetrics,
        hhi,
        momPopDensity,
        baseConsolidationScore,
        adjustedConsolidationScore,
        entropyMetrics,
        chaosIndicators,
        topTargets,
        financialProjections,
        totalBusinessesAnalyzed: smbList.length,
        dataQuality: this.assessDataQuality(smbList),
        recommendations: this.generateRecommendations(adjustedConsolidationScore, topTargets, entropyMetrics)
      };

    } catch (error) {
      console.error('Error in analyzeFragmentation:', error);
      throw new Error(`Failed to analyze fragmentation: ${error.message}`);
    }
  }

  /**
   * Scrapes business data from Yelp and Google My Business
   */
  private async scrapeYelpAndGMB(
    zip: string, 
    industry: string, 
    maxBusinesses: number
  ): Promise<BusinessData[]> {
    const businessMap = new Map<string, BusinessData>();

    try {
      // Scrape from multiple sources in parallel
      const [yelpData, googleData, bbbData] = await Promise.allSettled([
        this.yelpScraper.scrapeBusinesses(zip, industry, Math.floor(maxBusinesses * 0.4)),
        this.googleScraper.scrapeBusinesses(zip, industry, Math.floor(maxBusinesses * 0.4)),
        this.bbbScraper.scrapeBusinesses(zip, industry, Math.floor(maxBusinesses * 0.2))
      ]);

      // Merge and deduplicate results
      const allResults = [
        ...(yelpData.status === 'fulfilled' ? yelpData.value : []),
        ...(googleData.status === 'fulfilled' ? googleData.value : []),
        ...(bbbData.status === 'fulfilled' ? bbbData.value : [])
      ];

      // Deduplicate by business name and address
      allResults.forEach(business => {
        const key = `${business.name.toLowerCase()}-${business.address.toLowerCase()}`;
        if (!businessMap.has(key) || businessMap.get(key)!.dataQuality < business.dataQuality) {
          businessMap.set(key, business);
        }
      });

      return Array.from(businessMap.values());

    } catch (error) {
      console.error('Error scraping business data:', error);
      return [];
    }
  }

  /**
   * Calculates the Herfindahl-Hirschman Index (HHI)
   * HHI = Σ(market_share_i)^2
   * Values: 0-1500 (competitive), 1500-2500 (moderate), 2500+ (concentrated)
   */
  private calculateHHI(businesses: BusinessData[]): number {
    if (businesses.length === 0) return 0;

    const totalRevenue = businesses.reduce((sum, b) => sum + (b.estimatedRevenue || 0), 0);
    
    if (totalRevenue === 0) {
      // If no revenue data, assume equal market shares
      const equalShare = 100 / businesses.length;
      return businesses.length * Math.pow(equalShare, 2);
    }

    const hhi = businesses.reduce((sum, business) => {
      const marketShare = ((business.estimatedRevenue || 0) / totalRevenue) * 100;
      return sum + Math.pow(marketShare, 2);
    }, 0);

    return Math.round(hhi);
  }

  /**
   * Calculates mom-and-pop density (small business ratio)
   */
  private calculateMomPopDensity(businesses: BusinessData[]): number {
    if (businesses.length === 0) return 0;

    const momPopBusinesses = businesses.filter(b => 
      (b.employees || 0) < 10 && 
      (b.reviewCount || 0) < 50 &&
      (b.businessAge || 0) < 20
    );

    return momPopBusinesses.length / businesses.length;
  }

  /**
   * Calculates comprehensive market metrics
   */
  private calculateMarketMetrics(businesses: BusinessData[]): MarketMetrics {
    const revenues = businesses.map(b => b.estimatedRevenue || 0).filter(r => r > 0);
    const employees = businesses.map(b => b.employees || 0).filter(e => e > 0);
    const ages = businesses.map(b => b.businessAge || 0).filter(a => a > 0);

    return {
      totalBusinesses: businesses.length,
      averageRevenue: revenues.length > 0 ? revenues.reduce((a, b) => a + b, 0) / revenues.length : 0,
      medianRevenue: this.calculateMedian(revenues),
      averageEmployees: employees.length > 0 ? employees.reduce((a, b) => a + b, 0) / employees.length : 0,
      averageBusinessAge: ages.length > 0 ? ages.reduce((a, b) => a + b, 0) / ages.length : 0,
      top5MarketShare: this.calculateTop5MarketShare(businesses),
      revenueGiniCoefficient: this.calculateGiniCoefficient(revenues)
    };
  }

  /**
   * Analyzes chaos indicators using NLP on reviews
   */
  private async analyzeChaosIndicators(businesses: BusinessData[]): Promise<any> {
    const businessesWithReviews = businesses.filter(b => b.reviews && b.reviews.length > 0);
    
    if (businessesWithReviews.length === 0) {
      return {
        chaoticActorCount: 0,
        averageChaosScore: 0,
        volatilityIndicators: []
      };
    }

    const chaosAnalyses = await Promise.all(
      businessesWithReviews.map(async business => {
        const chaosScore = await this.nlpAnalyzer.analyzeChaosIndicators(business.reviews || []);
        return {
          businessId: business.id,
          name: business.name,
          chaosScore,
          isVolatile: chaosScore > 0.7
        };
      })
    );

    const chaoticActors = chaosAnalyses.filter(a => a.isVolatile);
    const averageChaosScore = chaosAnalyses.reduce((sum, a) => sum + a.chaosScore, 0) / chaosAnalyses.length;

    return {
      chaoticActorCount: chaoticActors.length,
      chaoticActorRatio: chaoticActors.length / businessesWithReviews.length,
      averageChaosScore,
      volatilityIndicators: chaoticActors.map(a => ({
        businessName: a.name,
        chaosScore: a.chaosScore
      }))
    };
  }

  /**
   * Adjusts consolidation score based on chaos and entropy metrics
   */
  private adjustForChaos(
    baseScore: number,
    entropyMetrics: any,
    chaosIndicators: any,
    industry: string
  ): number {
    let adjustedScore = baseScore;

    // Reduce score for high entropy (unpredictable markets)
    if (entropyMetrics?.marketEntropy > 0.8) {
      adjustedScore *= 0.85;
    }

    // Reduce score for high chaos actor density
    if (chaosIndicators?.chaoticActorRatio > 0.3) {
      adjustedScore *= 0.9;
    }

    // Industry-specific adjustments
    const volatileIndustries = ['restaurants', 'bars', 'nightlife', 'seasonal', 'tourism'];
    if (volatileIndustries.some(vi => industry.toLowerCase().includes(vi))) {
      adjustedScore *= 0.95;
    }

    return Math.round(adjustedScore * 100) / 100;
  }

  /**
   * Identifies top consolidation targets based on exit risk and strategic value
   */
  private identifyTopTargets(businesses: BusinessData[], count: number): ConsolidationTarget[] {
    return businesses
      .map(business => {
        const exitRisk = this.calculateExitRisk(business);
        const strategicValue = this.calculateStrategicValue(business);
        const acquisitionComplexity = this.calculateAcquisitionComplexity(business);

        return {
          id: business.id,
          name: business.name,
          address: business.address,
          phone: business.phone,
          website: business.website,
          ownerAge: business.ownerAge,
          estimatedRevenue: business.estimatedRevenue,
          employees: business.employees,
          reviewCount: business.reviewCount,
          averageRating: business.averageRating,
          businessAge: business.businessAge,
          exitRisk,
          strategicValue,
          acquisitionComplexity,
          consolidationScore: (exitRisk * 0.4) + (strategicValue * 0.4) + ((1 - acquisitionComplexity) * 0.2),
          estimatedAcquisitionCost: this.estimateAcquisitionCost(business),
          potentialSynergies: this.estimateSynergies(business)
        };
      })
      .sort((a, b) => b.consolidationScore - a.consolidationScore)
      .slice(0, count);
  }

  /**
   * Calculates exit risk score (0-1, higher = more likely to sell)
   */
  private calculateExitRisk(business: BusinessData): number {
    let score = 0;

    // Age factors
    if (business.ownerAge && business.ownerAge > 65) score += 0.4;
    else if (business.ownerAge && business.ownerAge > 55) score += 0.2;

    // Business age factors
    if (business.businessAge && business.businessAge > 20) score += 0.2;

    // Performance factors
    if (business.averageRating && business.averageRating < 3.5) score += 0.2;
    if (business.reviewCount && business.reviewCount < 20) score += 0.1;

    // Size factors (smaller businesses more likely to sell)
    if (business.employees && business.employees < 5) score += 0.1;

    return Math.min(score, 1);
  }

  /**
   * Calculates strategic value for consolidation
   */
  private calculateStrategicValue(business: BusinessData): number {
    let score = 0;

    // Revenue contribution
    if (business.estimatedRevenue) {
      if (business.estimatedRevenue > 1000000) score += 0.3;
      else if (business.estimatedRevenue > 500000) score += 0.2;
      else score += 0.1;
    }

    // Market presence
    if (business.reviewCount && business.reviewCount > 100) score += 0.2;
    if (business.averageRating && business.averageRating > 4.0) score += 0.2;

    // Operational factors
    if (business.employees && business.employees > 5) score += 0.1;
    if (business.businessAge && business.businessAge > 5 && business.businessAge < 15) score += 0.2;

    return Math.min(score, 1);
  }

  /**
   * Calculates acquisition complexity (0-1, higher = more complex)
   */
  private calculateAcquisitionComplexity(business: BusinessData): number {
    let complexity = 0.2; // Base complexity

    // Size increases complexity
    if (business.employees && business.employees > 20) complexity += 0.3;
    else if (business.employees && business.employees > 10) complexity += 0.2;

    // High revenue increases complexity
    if (business.estimatedRevenue && business.estimatedRevenue > 2000000) complexity += 0.2;

    // Well-established businesses may be more complex
    if (business.businessAge && business.businessAge > 25) complexity += 0.1;

    // High performance businesses may demand premium
    if (business.averageRating && business.averageRating > 4.5) complexity += 0.1;

    return Math.min(complexity, 1);
  }

  /**
   * Estimates acquisition cost based on revenue multiples and business characteristics
   */
  private estimateAcquisitionCost(business: BusinessData): number {
    if (!business.estimatedRevenue || business.estimatedRevenue === 0) {
      return 50000; // Default minimum for small businesses
    }

    // Industry multiples (revenue-based)
    let revenueMultiple = 1.2; // Conservative default

    // Adjust based on business characteristics
    if (business.averageRating && business.averageRating > 4.0) revenueMultiple += 0.3;
    if (business.businessAge && business.businessAge > 10) revenueMultiple += 0.2;
    if (business.employees && business.employees > 10) revenueMultiple += 0.2;

    return Math.round(business.estimatedRevenue * revenueMultiple);
  }

  /**
   * Estimates potential synergies from acquisition
   */
  private estimateSynergies(business: BusinessData): number {
    if (!business.estimatedRevenue) return 0;

    // Conservative synergy estimates
    const costSynergies = business.estimatedRevenue * 0.05; // 5% cost reduction
    const revenueSynergies = business.estimatedRevenue * 0.08; // 8% revenue increase
    
    return Math.round(costSynergies + revenueSynergies);
  }

  /**
   * Calculates financial projections for consolidation
   */
  private calculateFinancialProjections(targets: ConsolidationTarget[], metrics: MarketMetrics): any {
    const totalAcquisitionCost = targets.reduce((sum, t) => sum + (t.estimatedAcquisitionCost || 0), 0);
    const totalSynergies = targets.reduce((sum, t) => sum + (t.potentialSynergies || 0), 0);
    const totalRevenue = targets.reduce((sum, t) => sum + (t.estimatedRevenue || 0), 0);

    const paybackPeriod = totalSynergies > 0 ? totalAcquisitionCost / totalSynergies : 0;
    const roi = totalSynergies > 0 ? (totalSynergies - totalAcquisitionCost) / totalAcquisitionCost : 0;

    return {
      totalAcquisitionCost,
      totalSynergies,
      totalRevenue,
      estimatedPaybackPeriod: Math.round(paybackPeriod * 10) / 10,
      projectedROI: Math.round(roi * 1000) / 10, // Percentage
      marketShareGain: totalRevenue / (metrics.averageRevenue * metrics.totalBusinesses),
      riskAdjustedReturn: roi * 0.8 // Conservative adjustment
    };
  }

  /**
   * Helper methods
   */
  private calculateMedian(numbers: number[]): number {
    if (numbers.length === 0) return 0;
    const sorted = [...numbers].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
  }

  private calculateTop5MarketShare(businesses: BusinessData[]): number {
    const sorted = businesses
      .sort((a, b) => (b.estimatedRevenue || 0) - (a.estimatedRevenue || 0))
      .slice(0, 5);
    
    const top5Revenue = sorted.reduce((sum, b) => sum + (b.estimatedRevenue || 0), 0);
    const totalRevenue = businesses.reduce((sum, b) => sum + (b.estimatedRevenue || 0), 0);
    
    return totalRevenue > 0 ? (top5Revenue / totalRevenue) * 100 : 0;
  }

  private calculateGiniCoefficient(values: number[]): number {
    if (values.length === 0) return 0;
    
    const sorted = [...values].sort((a, b) => a - b);
    const n = sorted.length;
    let sum = 0;
    
    for (let i = 0; i < n; i++) {
      sum += (2 * (i + 1) - n - 1) * sorted[i];
    }
    
    const mean = sorted.reduce((a, b) => a + b, 0) / n;
    return sum / (n * n * mean);
  }

  private assessDataQuality(businesses: BusinessData[]): number {
    if (businesses.length === 0) return 0;

    const qualityScores = businesses.map(b => {
      let score = 0;
      if (b.estimatedRevenue && b.estimatedRevenue > 0) score += 0.3;
      if (b.employees && b.employees > 0) score += 0.2;
      if (b.reviewCount && b.reviewCount > 0) score += 0.2;
      if (b.businessAge && b.businessAge > 0) score += 0.15;
      if (b.phone) score += 0.1;
      if (b.website) score += 0.05;
      return score;
    });

    return qualityScores.reduce((sum, score) => sum + score, 0) / businesses.length;
  }

  private generateRecommendations(
    consolidationScore: number,
    targets: ConsolidationTarget[],
    entropyMetrics: any
  ): string[] {
    const recommendations: string[] = [];

    if (consolidationScore > 70) {
      recommendations.push("🟢 Excellent consolidation opportunity - highly fragmented market with strong targets");
    } else if (consolidationScore > 50) {
      recommendations.push("🟡 Good consolidation opportunity - moderate fragmentation with viable targets");
    } else {
      recommendations.push("🔴 Limited consolidation opportunity - market may be too concentrated or risky");
    }

    if (targets.length > 10) {
      recommendations.push(`📊 Strong target pipeline with ${targets.length} potential acquisitions identified`);
    }

    if (entropyMetrics?.marketEntropy > 0.8) {
      recommendations.push("⚠️ High market volatility detected - proceed with caution and enhanced due diligence");
    }

    if (targets.some(t => t.exitRisk > 0.7)) {
      recommendations.push("🎯 High-probability exit candidates identified - prioritize outreach to these targets");
    }

    return recommendations;
  }
}