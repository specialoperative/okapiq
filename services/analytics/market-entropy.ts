/**
 * Market Entropy Calculator
 * 
 * Calculates market entropy and chaos metrics to measure
 * the unpredictability and volatility of local markets
 */

import { BusinessData, EntropyMetrics } from '../../types/fragment-finder';

export class MarketEntropyCalculator {
  constructor() {}

  /**
   * Calculates comprehensive market entropy metrics
   */
  async calculateMarketEntropy(
    businesses: BusinessData[],
    industry: string
  ): Promise<EntropyMetrics> {
    if (businesses.length === 0) {
      return this.getZeroEntropyMetrics();
    }

    const marketEntropy = this.calculateOverallMarketEntropy(businesses);
    const pricingVolatility = this.calculatePricingVolatility(businesses);
    const qualityVariance = this.calculateQualityVariance(businesses);
    const geographicDispersion = this.calculateGeographicDispersion(businesses);
    const temporalInstability = this.calculateTemporalInstability(businesses);
    const competitiveIntensity = this.calculateCompetitiveIntensity(businesses, industry);

    return {
      marketEntropy,
      pricingVolatility,
      qualityVariance,
      geographicDispersion,
      temporalInstability,
      competitiveIntensity
    };
  }

  /**
   * Calculates overall market entropy using Shannon entropy formula
   */
  private calculateOverallMarketEntropy(businesses: BusinessData[]): number {
    // Calculate market share distribution
    const totalRevenue = businesses.reduce((sum, b) => sum + (b.estimatedRevenue || 0), 0);
    
    if (totalRevenue === 0) {
      // If no revenue data, assume equal distribution
      return Math.log2(businesses.length) / Math.log2(businesses.length || 1);
    }

    // Calculate Shannon entropy based on revenue distribution
    let entropy = 0;
    businesses.forEach(business => {
      const marketShare = (business.estimatedRevenue || 0) / totalRevenue;
      if (marketShare > 0) {
        entropy -= marketShare * Math.log2(marketShare);
      }
    });

    // Normalize to 0-1 scale
    const maxEntropy = Math.log2(businesses.length);
    return maxEntropy > 0 ? entropy / maxEntropy : 0;
  }

  /**
   * Calculates pricing volatility across businesses
   */
  private calculatePricingVolatility(businesses: BusinessData[]): number {
    const revenues = businesses
      .map(b => b.estimatedRevenue || 0)
      .filter(r => r > 0);

    if (revenues.length < 2) return 0;

    // Calculate coefficient of variation for revenues
    const mean = revenues.reduce((a, b) => a + b, 0) / revenues.length;
    const variance = revenues.reduce((sum, rev) => sum + Math.pow(rev - mean, 2), 0) / revenues.length;
    const standardDeviation = Math.sqrt(variance);
    
    const coefficientOfVariation = mean > 0 ? standardDeviation / mean : 0;
    
    // Normalize to 0-1 scale (CV of 1.0 = high volatility)
    return Math.min(coefficientOfVariation, 1);
  }

  /**
   * Calculates quality variance using rating data
   */
  private calculateQualityVariance(businesses: BusinessData[]): number {
    const ratings = businesses
      .map(b => b.averageRating || 0)
      .filter(r => r > 0);

    if (ratings.length < 2) return 0;

    const mean = ratings.reduce((a, b) => a + b, 0) / ratings.length;
    const variance = ratings.reduce((sum, rating) => sum + Math.pow(rating - mean, 2), 0) / ratings.length;
    
    // Normalize variance for 5-point rating scale
    const maxVariance = 2.5; // Theoretical max variance for ratings
    return Math.min(variance / maxVariance, 1);
  }

  /**
   * Calculates geographic dispersion of businesses
   */
  private calculateGeographicDispersion(businesses: BusinessData[]): number {
    // Simplified geographic dispersion calculation
    // In production, would use actual lat/long coordinates
    
    // Count unique street names as proxy for geographic spread
    const streetNames = new Set();
    businesses.forEach(business => {
      const address = business.address.split(',')[0]; // Get street part
      const streetName = address.split(' ').slice(1).join(' '); // Remove number
      streetNames.add(streetName.toLowerCase());
    });

    // Higher dispersion = more unique streets relative to business count
    const dispersionRatio = streetNames.size / businesses.length;
    
    // Normalize to 0-1 scale
    return Math.min(dispersionRatio * 2, 1); // Scale factor of 2
  }

  /**
   * Calculates temporal instability based on business ages
   */
  private calculateTemporalInstability(businesses: BusinessData[]): number {
    const ages = businesses
      .map(b => b.businessAge || 0)
      .filter(a => a > 0);

    if (ages.length < 2) return 0;

    // Calculate instability based on age distribution
    const mean = ages.reduce((a, b) => a + b, 0) / ages.length;
    const variance = ages.reduce((sum, age) => sum + Math.pow(age - mean, 2), 0) / ages.length;
    const standardDeviation = Math.sqrt(variance);

    // Higher instability if many new businesses (low average age) with high variance
    const ageInstability = mean > 0 ? standardDeviation / mean : 0;
    const newBusinessRatio = ages.filter(age => age < 3).length / ages.length;

    // Combined instability score
    const instability = (ageInstability * 0.6) + (newBusinessRatio * 0.4);
    
    return Math.min(instability, 1);
  }

  /**
   * Calculates competitive intensity
   */
  private calculateCompetitiveIntensity(businesses: BusinessData[], industry: string): number {
    if (businesses.length === 0) return 0;

    // Business density factor
    const densityScore = Math.min(businesses.length / 50, 1); // Normalize around 50 businesses

    // Size distribution factor (many small businesses = high competition)
    const smallBusinessRatio = businesses.filter(b => (b.employees || 0) < 10).length / businesses.length;

    // Rating competition factor (many high-rated businesses = intense competition)
    const highRatedRatio = businesses.filter(b => (b.averageRating || 0) >= 4.0).length / businesses.length;

    // Review activity factor (high review counts indicate active competition)
    const avgReviewCount = businesses.reduce((sum, b) => sum + (b.reviewCount || 0), 0) / businesses.length;
    const reviewActivityScore = Math.min(avgReviewCount / 100, 1); // Normalize around 100 reviews

    // Industry-specific adjustments
    const industryMultiplier = this.getIndustryCompetitionMultiplier(industry);

    // Weighted combination
    const intensity = (
      densityScore * 0.3 +
      smallBusinessRatio * 0.25 +
      highRatedRatio * 0.2 +
      reviewActivityScore * 0.25
    ) * industryMultiplier;

    return Math.min(intensity, 1);
  }

  /**
   * Gets industry-specific competition multipliers
   */
  private getIndustryCompetitionMultiplier(industry: string): number {
    const multipliers: { [key: string]: number } = {
      'restaurants': 1.3, // Highly competitive
      'hair salons': 1.2, // Very competitive
      'auto repair': 0.9, // Moderately competitive
      'plumbing': 0.8, // Less competitive (skilled trade)
      'healthcare': 0.7, // Regulated, less competitive
      'legal': 0.6, // Professional services, less competitive
      'default': 1.0
    };

    return multipliers[industry.toLowerCase()] || multipliers.default;
  }

  /**
   * Calculates market chaos score (simplified entropy measure)
   */
  calculateMarketChaosScore(businesses: BusinessData[]): number {
    if (businesses.length === 0) return 0;

    let chaosScore = 0;

    // Rating volatility contribution
    const ratings = businesses.map(b => b.averageRating || 0).filter(r => r > 0);
    if (ratings.length > 1) {
      const ratingStdDev = this.calculateStandardDeviation(ratings);
      chaosScore += (ratingStdDev / 2.5) * 0.3; // Normalize by max possible std dev
    }

    // Revenue distribution chaos
    const revenues = businesses.map(b => b.estimatedRevenue || 0).filter(r => r > 0);
    if (revenues.length > 1) {
      const revenueCV = this.calculateCoefficientOfVariation(revenues);
      chaosScore += Math.min(revenueCV, 1) * 0.3;
    }

    // Business age chaos (high variance in ages indicates market instability)
    const ages = businesses.map(b => b.businessAge || 0).filter(a => a > 0);
    if (ages.length > 1) {
      const ageCV = this.calculateCoefficientOfVariation(ages);
      chaosScore += Math.min(ageCV, 1) * 0.2;
    }

    // Size distribution chaos
    const employees = businesses.map(b => b.employees || 0).filter(e => e > 0);
    if (employees.length > 1) {
      const sizeCV = this.calculateCoefficientOfVariation(employees);
      chaosScore += Math.min(sizeCV, 1) * 0.2;
    }

    return Math.min(chaosScore, 1);
  }

  /**
   * Helper method to calculate standard deviation
   */
  private calculateStandardDeviation(values: number[]): number {
    if (values.length < 2) return 0;
    
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    
    return Math.sqrt(variance);
  }

  /**
   * Helper method to calculate coefficient of variation
   */
  private calculateCoefficientOfVariation(values: number[]): number {
    if (values.length < 2) return 0;
    
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    if (mean === 0) return 0;
    
    const stdDev = this.calculateStandardDeviation(values);
    return stdDev / mean;
  }

  /**
   * Returns zero entropy metrics for empty datasets
   */
  private getZeroEntropyMetrics(): EntropyMetrics {
    return {
      marketEntropy: 0,
      pricingVolatility: 0,
      qualityVariance: 0,
      geographicDispersion: 0,
      temporalInstability: 0,
      competitiveIntensity: 0
    };
  }

  /**
   * Provides interpretation of entropy scores
   */
  interpretEntropyScore(score: number): {
    level: 'low' | 'moderate' | 'high' | 'very_high';
    description: string;
  } {
    if (score < 0.3) {
      return {
        level: 'low',
        description: 'Stable, predictable market with low volatility'
      };
    } else if (score < 0.5) {
      return {
        level: 'moderate',
        description: 'Some market volatility but generally stable'
      };
    } else if (score < 0.7) {
      return {
        level: 'high',
        description: 'Volatile market with significant unpredictability'
      };
    } else {
      return {
        level: 'very_high',
        description: 'Highly chaotic market with extreme volatility'
      };
    }
  }
}