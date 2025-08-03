/**
 * TypeScript definitions for Fragment Finder Agent
 */

export interface BusinessData {
  id: string;
  name: string;
  address: string;
  phone?: string;
  website?: string;
  industry: string;
  zip: string;
  
  // Financial data
  estimatedRevenue?: number;
  employees?: number;
  
  // Market presence
  reviewCount?: number;
  averageRating?: number;
  reviews?: Review[];
  
  // Business characteristics
  businessAge?: number;
  ownerAge?: number;
  
  // Data quality
  dataSource: 'yelp' | 'google' | 'bbb' | 'combined';
  dataQuality: number; // 0-1 score
  lastUpdated: string;
}

export interface Review {
  id: string;
  rating: number;
  text: string;
  date: string;
  source: string;
  sentiment?: 'positive' | 'negative' | 'neutral';
  chaosIndicators?: {
    inconsistentPricing?: boolean;
    serviceVolatility?: boolean;
    ownershipChanges?: boolean;
    qualityFluctuations?: boolean;
  };
}

export interface MarketMetrics {
  totalBusinesses: number;
  averageRevenue: number;
  medianRevenue: number;
  averageEmployees: number;
  averageBusinessAge: number;
  top5MarketShare: number; // Percentage
  revenueGiniCoefficient: number; // Inequality measure
}

export interface EntropyMetrics {
  marketEntropy: number; // 0-1, higher = more chaotic
  pricingVolatility: number;
  qualityVariance: number;
  geographicDispersion: number;
  temporalInstability: number;
  competitiveIntensity: number;
}

export interface ChaosIndicators {
  chaoticActorCount: number;
  chaoticActorRatio: number;
  averageChaosScore: number;
  volatilityIndicators: {
    businessName: string;
    chaosScore: number;
  }[];
}

export interface ConsolidationTarget {
  id: string;
  name: string;
  address: string;
  phone?: string;
  website?: string;
  
  // Business metrics
  ownerAge?: number;
  estimatedRevenue?: number;
  employees?: number;
  reviewCount?: number;
  averageRating?: number;
  businessAge?: number;
  
  // Consolidation scores
  exitRisk: number; // 0-1, higher = more likely to sell
  strategicValue: number; // 0-1, higher = more valuable
  acquisitionComplexity: number; // 0-1, higher = more complex
  consolidationScore: number; // Weighted composite score
  
  // Financial projections
  estimatedAcquisitionCost?: number;
  potentialSynergies?: number;
}

export interface FinancialProjections {
  totalAcquisitionCost: number;
  totalSynergies: number;
  totalRevenue: number;
  estimatedPaybackPeriod: number; // Years
  projectedROI: number; // Percentage
  marketShareGain: number; // Percentage
  riskAdjustedReturn: number; // ROI adjusted for risk
}

export interface FragmentationAnalysis {
  // Request metadata
  zip: string;
  industry: string;
  timestamp: string;
  
  // Core metrics
  marketMetrics: MarketMetrics;
  hhi: number; // Herfindahl-Hirschman Index
  momPopDensity: number; // Ratio of small businesses
  
  // Consolidation scores
  baseConsolidationScore: number;
  adjustedConsolidationScore: number;
  
  // Chaos analysis
  entropyMetrics?: EntropyMetrics;
  chaosIndicators?: ChaosIndicators;
  
  // Targets and projections
  topTargets: ConsolidationTarget[];
  financialProjections: FinancialProjections;
  
  // Quality and recommendations
  totalBusinessesAnalyzed: number;
  dataQuality: number; // 0-1 score
  recommendations: string[];
}

export interface AnalysisOptions {
  includeEntropy?: boolean;
  maxBusinesses?: number;
  includeNLPAnalysis?: boolean;
  industrySpecificFactors?: boolean;
  geographicRadius?: number; // Miles from ZIP center
}

export interface ScrapingResult {
  businesses: BusinessData[];
  totalFound: number;
  dataQuality: number;
  source: string;
  timestamp: string;
  errors?: string[];
}

export interface IndustryConfig {
  name: string;
  keywords: string[];
  revenueMultiples: {
    low: number;
    average: number;
    high: number;
  };
  volatilityFactor: number; // Adjustment for industry-specific chaos
  seasonalityFactor: number;
  consolidationDifficulty: number; // 0-1, regulatory/operational complexity
}

// Utility types for market analysis
export type MarketConcentration = 'highly_competitive' | 'competitive' | 'moderate' | 'concentrated' | 'monopolistic';
export type ConsolidationOpportunity = 'excellent' | 'good' | 'moderate' | 'limited' | 'poor';
export type RiskLevel = 'low' | 'moderate' | 'high' | 'very_high';

export interface MarketAssessment {
  concentration: MarketConcentration;
  opportunity: ConsolidationOpportunity;
  riskLevel: RiskLevel;
  confidence: number; // 0-1, based on data quality
}

// API response types
export interface FragmentFinderResponse {
  success: boolean;
  data?: FragmentationAnalysis;
  error?: string;
  metadata: {
    processingTime: number;
    dataSourcesUsed: string[];
    cacheUsed: boolean;
  };
}

export interface BatchAnalysisRequest {
  markets: {
    zip: string;
    industry: string;
  }[];
  options?: AnalysisOptions;
}

export interface BatchAnalysisResponse {
  success: boolean;
  results: {
    zip: string;
    industry: string;
    analysis?: FragmentationAnalysis;
    error?: string;
  }[];
  summary: {
    totalMarkets: number;
    successfulAnalyses: number;
    averageProcessingTime: number;
    topOpportunities: {
      zip: string;
      industry: string;
      consolidationScore: number;
    }[];
  };
}