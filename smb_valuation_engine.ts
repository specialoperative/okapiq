#!/usr/bin/env node
/**
 * 🏦 SMB Valuation Engine V1 - TypeScript Implementation
 * Advanced Business Valuation with Monte Carlo Ensemble
 * 
 * FEATURES:
 * ✅ Bayesian review-to-customer modeling
 * ✅ Monte Carlo ensemble valuation (3 models)
 * ✅ Automated Operational Assessment (AOA)
 * ✅ Total Market Potential (TMP) analysis
 * ✅ Advanced ad spend optimization
 * ✅ Batch CSV processing
 * ✅ Express API with full TypeScript types
 */

import express from 'express';
import bodyParser from 'body-parser';
import { z } from 'zod';
import { parse } from 'csv-parse/sync';
import axios from 'axios';
import * as fs from 'fs';

// Types and Schemas
const BusinessSignalsSchema = z.object({
  business_id: z.string(),
  name: z.string(),
  category: z.string(),
  geo: z.string(),
  R_total: z.number().int().min(0),
  R_12: z.number().int().min(0),
  stars: z.number().min(0).max(5),
  rating_volatility: z.number().min(0).max(1).default(0.3),
  ads_data: z.array(z.object({
    vol: z.number().min(0),
    cpc: z.number().min(0).default(0),
    competition: z.number().min(0).max(1).default(0.5)
  })).default([]),
  trends_now: z.number().min(0).default(1.0),
  trends_avg: z.number().min(0).default(1.0),
  pop_times_index: z.number().min(0).default(1.0),
  competitors_density: z.number().min(0).max(1).default(0.5),
  median_income: z.number().min(0).default(50000),
  population: z.number().int().min(0).default(10000),
  years_in_business: z.number().int().min(1).default(5),
  website_quality: z.number().min(0).max(1).default(0.7),
  social_presence: z.number().min(0).max(1).default(0.5)
});

type BusinessSignals = z.infer<typeof BusinessSignalsSchema>;

interface CategoryPrior {
  category: string;
  review_propensity_alpha: number;
  review_propensity_beta: number;
  ats_mixture: Array<{
    job_type: string;
    price: number;
    weight: number;
  }>;
  gross_margin: number;
  operating_margin: number;
  repeat_factor: number;
  multiple_mean: number;
  multiple_std: number;
  ctr_mean: number;
  conversion_rate: number;
  booking_rate: number;
}

interface ValuationResult {
  valuation: {
    p10: number;
    p25: number;
    p50: number;
    p75: number;
    p90: number;
    mean: number;
    std: number;
  };
  revenue: {
    p10: number;
    p25: number;
    p50: number;
    p75: number;
    p90: number;
    mean: number;
  };
  ebitda: {
    p10: number;
    p25: number;
    p50: number;
    p75: number;
    p90: number;
    mean: number;
  };
  model_weights: number[];
  monte_carlo_runs: number;
}

interface AOAResult {
  total_score: number;
  grade: string;
  pillars: Record<string, number>;
  insights: string[];
  risk_flags: string[];
  owner_transition_risk: {
    risk_score: number;
    risk_level: string;
    risk_factors: string[];
    succession_probability: number;
  };
}

// Enhanced Category Priors
const CATEGORY_PRIORS: Record<string, CategoryPrior> = {
  HVAC: {
    category: "HVAC",
    review_propensity_alpha: 10.0,
    review_propensity_beta: 90.0,
    ats_mixture: [
      { job_type: "service_call", price: 250, weight: 0.65 },
      { job_type: "repair", price: 800, weight: 0.25 },
      { job_type: "install", price: 8000, weight: 0.10 }
    ],
    gross_margin: 0.65,
    operating_margin: 0.18,
    repeat_factor: 2.3,
    multiple_mean: 2.8,
    multiple_std: 0.4,
    ctr_mean: 0.04,
    conversion_rate: 0.15,
    booking_rate: 0.65
  },
  Restaurant: {
    category: "Restaurant",
    review_propensity_alpha: 3.0,
    review_propensity_beta: 97.0,
    ats_mixture: [
      { job_type: "meal", price: 28, weight: 0.80 },
      { job_type: "drinks", price: 12, weight: 0.15 },
      { job_type: "catering", price: 180, weight: 0.05 }
    ],
    gross_margin: 0.35,
    operating_margin: 0.08,
    repeat_factor: 4.2,
    multiple_mean: 1.8,
    multiple_std: 0.3,
    ctr_mean: 0.02,
    conversion_rate: 0.25,
    booking_rate: 0.80
  },
  Dental: {
    category: "Dental",
    review_propensity_alpha: 8.0,
    review_propensity_beta: 92.0,
    ats_mixture: [
      { job_type: "cleaning", price: 180, weight: 0.50 },
      { job_type: "filling", price: 320, weight: 0.30 },
      { job_type: "crown", price: 1200, weight: 0.15 },
      { job_type: "implant", price: 3500, weight: 0.05 }
    ],
    gross_margin: 0.70,
    operating_margin: 0.25,
    repeat_factor: 1.8,
    multiple_mean: 3.2,
    multiple_std: 0.5,
    ctr_mean: 0.06,
    conversion_rate: 0.12,
    booking_rate: 0.70
  },
  "Auto Repair": {
    category: "Auto Repair",
    review_propensity_alpha: 6.0,
    review_propensity_beta: 94.0,
    ats_mixture: [
      { job_type: "oil_change", price: 45, weight: 0.40 },
      { job_type: "brake_repair", price: 380, weight: 0.25 },
      { job_type: "engine_work", price: 1200, weight: 0.20 },
      { job_type: "transmission", price: 2800, weight: 0.15 }
    ],
    gross_margin: 0.55,
    operating_margin: 0.15,
    repeat_factor: 2.1,
    multiple_mean: 2.4,
    multiple_std: 0.4,
    ctr_mean: 0.05,
    conversion_rate: 0.18,
    booking_rate: 0.75
  },
  Landscaping: {
    category: "Landscaping",
    review_propensity_alpha: 5.0,
    review_propensity_beta: 95.0,
    ats_mixture: [
      { job_type: "maintenance", price: 120, weight: 0.60 },
      { job_type: "installation", price: 850, weight: 0.25 },
      { job_type: "design", price: 2500, weight: 0.15 }
    ],
    gross_margin: 0.60,
    operating_margin: 0.20,
    repeat_factor: 3.5,
    multiple_mean: 2.6,
    multiple_std: 0.4,
    ctr_mean: 0.03,
    conversion_rate: 0.20,
    booking_rate: 0.60
  },
  Salon: {
    category: "Salon",
    review_propensity_alpha: 7.0,
    review_propensity_beta: 93.0,
    ats_mixture: [
      { job_type: "cut", price: 65, weight: 0.50 },
      { job_type: "color", price: 150, weight: 0.35 },
      { job_type: "treatment", price: 200, weight: 0.15 }
    ],
    gross_margin: 0.75,
    operating_margin: 0.22,
    repeat_factor: 4.8,
    multiple_mean: 2.2,
    multiple_std: 0.3,
    ctr_mean: 0.04,
    conversion_rate: 0.25,
    booking_rate: 0.85
  },
  Accounting: {
    category: "Accounting",
    review_propensity_alpha: 12.0,
    review_propensity_beta: 88.0,
    ats_mixture: [
      { job_type: "tax_prep", price: 350, weight: 0.40 },
      { job_type: "bookkeeping", price: 180, weight: 0.35 },
      { job_type: "audit", price: 2500, weight: 0.25 }
    ],
    gross_margin: 0.80,
    operating_margin: 0.35,
    repeat_factor: 2.5,
    multiple_mean: 3.5,
    multiple_std: 0.6,
    ctr_mean: 0.08,
    conversion_rate: 0.15,
    booking_rate: 0.90
  },
  Plumbing: {
    category: "Plumbing",
    review_propensity_alpha: 9.0,
    review_propensity_beta: 91.0,
    ats_mixture: [
      { job_type: "service_call", price: 180, weight: 0.50 },
      { job_type: "repair", price: 450, weight: 0.35 },
      { job_type: "installation", price: 1200, weight: 0.15 }
    ],
    gross_margin: 0.60,
    operating_margin: 0.20,
    repeat_factor: 2.0,
    multiple_mean: 2.6,
    multiple_std: 0.4,
    ctr_mean: 0.05,
    conversion_rate: 0.18,
    booking_rate: 0.70
  },
  Electrical: {
    category: "Electrical",
    review_propensity_alpha: 8.0,
    review_propensity_beta: 92.0,
    ats_mixture: [
      { job_type: "service_call", price: 200, weight: 0.45 },
      { job_type: "repair", price: 500, weight: 0.35 },
      { job_type: "installation", price: 1500, weight: 0.20 }
    ],
    gross_margin: 0.65,
    operating_margin: 0.22,
    repeat_factor: 1.8,
    multiple_mean: 2.9,
    multiple_std: 0.5,
    ctr_mean: 0.04,
    conversion_rate: 0.16,
    booking_rate: 0.68
  }
};

class SMBValuationEngineTS {
  private apiKeys: Record<string, string>;
  private monteCarloRuns: number = 1000;

  constructor(apiKeys: Record<string, string>) {
    this.apiKeys = apiKeys;
    console.log('🏦 SMB Valuation Engine TS initialized');
  }

  async valuateBusiness(signals: BusinessSignals): Promise<any> {
    console.log(`💰 Valuating ${signals.name} (${signals.category}) in ${signals.geo}`);

    const prior = CATEGORY_PRIORS[signals.category] || CATEGORY_PRIORS.HVAC;
    
    // Enrich signals with external APIs
    const enrichedSignals = await this.enrichBusinessSignals(signals);
    
    // Run Monte Carlo valuation
    const valuationResult = this.monteCarloValuation(enrichedSignals, prior);
    
    // Calculate AOA
    const aoaResult = this.calculateAOA(enrichedSignals, prior);
    
    // Calculate TMP
    const tmpResult = await this.calculateTMP(enrichedSignals);
    
    // Generate ad spend plan
    const adSpendPlan = this.calculateAdSpendPlan(enrichedSignals, prior, valuationResult);
    
    return {
      business_id: signals.business_id,
      business_name: signals.name,
      category: signals.category,
      location: signals.geo,
      valuation: valuationResult,
      aoa: aoaResult,
      tmp: tmpResult,
      ad_spend_plan: adSpendPlan,
      confidence_score: this.calculateConfidenceScore(enrichedSignals),
      key_drivers: this.identifyKeyDrivers(valuationResult, aoaResult),
      timestamp: new Date().toISOString()
    };
  }

  private async enrichBusinessSignals(signals: BusinessSignals): Promise<BusinessSignals> {
    const enriched = { ...signals };

    try {
      // Enrich with Yelp data
      if (this.apiKeys.YELP_API_KEY) {
        const yelpData = await this.getYelpData(signals.name, signals.geo);
        if (yelpData) {
          enriched.R_total = yelpData.review_count || signals.R_total;
          enriched.stars = yelpData.rating || signals.stars;
        }
      }

      // Enrich with Census data
      if (this.apiKeys.CENSUS_API_KEY) {
        const censusData = await this.getCensusData(signals.geo);
        if (censusData) {
          enriched.median_income = censusData.median_income || signals.median_income;
          enriched.population = censusData.population || signals.population;
        }
      }

      // Enrich with SERP API trends
      if (this.apiKeys.SERPAPI_API_KEY) {
        const trendsData = await this.getTrendsData(signals.category, signals.geo);
        if (trendsData) {
          enriched.trends_now = trendsData.current_interest || signals.trends_now;
        }
      }

    } catch (error) {
      console.error('Error enriching signals:', error);
    }

    return enriched;
  }

  private async getYelpData(businessName: string, location: string): Promise<any> {
    try {
      const response = await axios.get('https://api.yelp.com/v3/businesses/search', {
        headers: { Authorization: `Bearer ${this.apiKeys.YELP_API_KEY}` },
        params: { term: businessName, location, limit: 1 }
      });

      const businesses = response.data.businesses || [];
      return businesses[0] || null;
    } catch (error) {
      console.error('Yelp API error:', error);
      return null;
    }
  }

  private async getCensusData(location: string): Promise<any> {
    try {
      const stateCode = this.getStateCode(location);
      if (!stateCode) return null;

      const response = await axios.get('https://api.census.gov/data/2021/acs/acs1/profile', {
        params: {
          get: 'DP02_0001E,DP03_0062E,DP03_0088E',
          for: 'county:*',
          in: `state:${stateCode}`,
          key: this.apiKeys.CENSUS_API_KEY
        }
      });

      const data = response.data;
      if (data && data.length > 1) {
        const values = data[1];
        return {
          population: values[0] !== '-666666666' ? parseInt(values[0]) : 10000,
          median_income: values[1] !== '-666666666' ? parseInt(values[1]) : 50000,
          business_count: values[2] !== '-666666666' ? parseInt(values[2]) : 100
        };
      }

      return null;
    } catch (error) {
      console.error('Census API error:', error);
      return null;
    }
  }

  private async getTrendsData(category: string, location: string): Promise<any> {
    try {
      const response = await axios.get('https://serpapi.com/search', {
        params: {
          engine: 'google_trends',
          q: `${category} services`,
          geo: this.getGeoCode(location),
          api_key: this.apiKeys.SERPAPI_API_KEY
        }
      });

      const interestOverTime = response.data.interest_over_time || {};
      const timeline = interestOverTime.timeline_data || [];

      if (timeline.length > 0) {
        const currentInterest = timeline[timeline.length - 1].values?.[0]?.value || 50;
        const avgInterest = timeline.reduce((sum: number, point: any) => 
          sum + (point.values?.[0]?.value || 50), 0) / timeline.length;

        return {
          current_interest: currentInterest / 100,
          average_interest: avgInterest / 100,
          trend_slope: this.calculateTrendSlope(timeline)
        };
      }

      return null;
    } catch (error) {
      console.error('SERP API error:', error);
      return null;
    }
  }

  private monteCarloValuation(signals: BusinessSignals, prior: CategoryPrior): ValuationResult {
    console.log(`🎲 Running Monte Carlo valuation (${this.monteCarloRuns} iterations)`);

    const valuations: number[] = [];
    const revenues: number[] = [];
    const ebitdas: number[] = [];

    for (let i = 0; i < this.monteCarloRuns; i++) {
      // Sample parameters using Box-Muller for normal distributions
      const pRev = this.sampleBeta(prior.review_propensity_alpha, prior.review_propensity_beta);
      const ats = this.sampleATS(prior.ats_mixture, signals.geo);
      const multiple = this.sampleLogNormal(prior.multiple_mean, prior.multiple_std);

      // Model 1: Review-driven revenue
      let revenueR = 0;
      if (signals.R_12 > 0) {
        const annualCustomersR = signals.R_12 / pRev;
        revenueR = annualCustomersR * ats;
      }

      // Model 2: Ads funnel revenue
      const revenueA = this.calculateAdsRevenue(signals, prior, ats);

      // Model 3: Foot traffic revenue
      const revenueF = this.calculateFootTrafficRevenue(signals, prior, ats);

      // Ensemble revenue
      const weights = this.calculateModelWeights(signals, [revenueR, revenueA, revenueF]);
      const ensembleRevenue = this.weightedAverage([revenueR, revenueA, revenueF], weights);

      // Apply geo adjustment
      const geoMultiplier = this.getGeoMultiplier(signals.geo, signals.median_income);
      const adjustedRevenue = ensembleRevenue * geoMultiplier;

      // Calculate EBITDA
      const ebitda = adjustedRevenue * prior.operating_margin;

      // Apply AOA adjustment
      const aoaScore = this.quickAOAScore(signals, prior);
      const aoaMultiplier = 0.7 + (aoaScore / 100) * 0.6;
      const adjustedEbitda = ebitda * aoaMultiplier;

      // Calculate valuation
      const valuation = adjustedEbitda * multiple;

      valuations.push(valuation);
      revenues.push(adjustedRevenue);
      ebitdas.push(adjustedEbitda);
    }

    // Calculate percentiles
    const valPercentiles = this.calculatePercentiles(valuations, [10, 25, 50, 75, 90]);
    const revPercentiles = this.calculatePercentiles(revenues, [10, 25, 50, 75, 90]);
    const ebitdaPercentiles = this.calculatePercentiles(ebitdas, [10, 25, 50, 75, 90]);

    return {
      valuation: {
        p10: valPercentiles[0],
        p25: valPercentiles[1],
        p50: valPercentiles[2],
        p75: valPercentiles[3],
        p90: valPercentiles[4],
        mean: this.mean(valuations),
        std: this.std(valuations)
      },
      revenue: {
        p10: revPercentiles[0],
        p25: revPercentiles[1],
        p50: revPercentiles[2],
        p75: revPercentiles[3],
        p90: revPercentiles[4],
        mean: this.mean(revenues)
      },
      ebitda: {
        p10: ebitdaPercentiles[0],
        p25: ebitdaPercentiles[1],
        p50: ebitdaPercentiles[2],
        p75: ebitdaPercentiles[3],
        p90: ebitdaPercentiles[4],
        mean: this.mean(ebitdas)
      },
      model_weights: this.calculateModelWeights(signals, [0, 0, 0]),
      monte_carlo_runs: this.monteCarloRuns
    };
  }

  private calculateAOA(signals: BusinessSignals, prior: CategoryPrior): AOAResult {
    console.log('📊 Calculating AOA (Automated Operational Assessment)');

    const pillars: Record<string, number> = {};

    // Six pillars of operational assessment
    pillars.service_quality = this.assessServiceQuality(signals);
    pillars.demand_momentum = this.assessDemandMomentum(signals);
    pillars.capacity_reliability = this.assessCapacityReliability(signals);
    pillars.competitive_position = this.assessCompetitivePosition(signals);
    pillars.unit_economics = this.assessUnitEconomics(signals, prior);
    pillars.compliance_risk = this.assessComplianceRisk(signals);

    const totalScore = Object.values(pillars).reduce((sum, score) => sum + score, 0);

    const insights = this.generateAOAInsights(pillars, signals);
    const riskFlags = this.identifyRiskFlags(pillars, signals);
    const transitionRisk = this.calculateTransitionRisk(signals);

    return {
      total_score: totalScore,
      grade: this.getAOAGrade(totalScore),
      pillars,
      insights,
      risk_flags: riskFlags,
      owner_transition_risk: transitionRisk
    };
  }

  private async calculateTMP(signals: BusinessSignals): Promise<any> {
    console.log('📈 Calculating Total Market Potential (TMP)');

    const penetrationRate = this.getPenetrationRate(signals.category);
    const marketSize = signals.population * penetrationRate;

    const prior = CATEGORY_PRIORS[signals.category] || CATEGORY_PRIORS.HVAC;
    const avgATS = this.mean(prior.ats_mixture.map(job => job.price));

    const totalMarketValue = marketSize * avgATS * prior.repeat_factor;
    const currentCompetitors = Math.max(1, signals.competitors_density * 20);
    const potentialMarketShare = 1 / currentCompetitors;

    const trendGrowth = (signals.trends_now / signals.trends_avg - 1) * 100;
    const demographicGrowth = this.estimateDemographicGrowth(signals);

    return {
      total_market_value: totalMarketValue,
      addressable_market: marketSize,
      potential_market_share: potentialMarketShare,
      current_penetration: potentialMarketShare,
      growth_potential: {
        trend_growth: trendGrowth,
        demographic_growth: demographicGrowth,
        total_growth: trendGrowth + demographicGrowth
      },
      market_attractiveness: this.calculateMarketAttractiveness(signals),
      barriers_to_entry: this.assessBarriersToEntry(signals.category)
    };
  }

  private calculateAdSpendPlan(signals: BusinessSignals, prior: CategoryPrior, valuation: ValuationResult): any {
    console.log('💰 Calculating ad spend optimization plan');

    if (!signals.ads_data || signals.ads_data.length === 0) {
      return { error: "No ads data available for optimization" };
    }

    const currentRevenue = valuation.revenue.p50;
    const avgCPC = this.mean(signals.ads_data.map(ad => ad.cpc));
    const currentCAC = avgCPC / (prior.ctr_mean * prior.conversion_rate);

    const avgATS = this.mean(prior.ats_mixture.map(job => job.price));
    const ltv = avgATS * prior.repeat_factor * prior.gross_margin;

    const optimalCAC = ltv / 3;
    const maxSustainableCAC = ltv / 2;

    const currentMonthlyCustomers = (currentRevenue / 12) / avgATS;

    // Growth scenarios
    const growthScenarios: Record<string, any> = {};
    [1.25, 1.5, 2.0].forEach(growthTarget => {
      const targetRevenue = currentRevenue * growthTarget;
      const additionalCustomersNeeded = ((targetRevenue - currentRevenue) / 12) / avgATS;
      const requiredLeads = additionalCustomersNeeded / prior.booking_rate;
      const requiredClicks = requiredLeads / prior.conversion_rate;
      const monthlyAdSpend = requiredClicks * avgCPC;
      const annualAdSpend = monthlyAdSpend * 12;
      const additionalAnnualRevenue = targetRevenue - currentRevenue;
      const roi = annualAdSpend > 0 ? (additionalAnnualRevenue - annualAdSpend) / annualAdSpend : 0;

      growthScenarios[`${Math.round((growthTarget - 1) * 100)}%_growth`] = {
        target_revenue: targetRevenue,
        additional_customers_monthly: additionalCustomersNeeded,
        monthly_ad_spend: monthlyAdSpend,
        annual_ad_spend: annualAdSpend,
        roi,
        payback_months: avgATS > 0 ? currentCAC / (avgATS * prior.gross_margin) : 12,
        feasible: monthlyAdSpend < currentRevenue * 0.15
      };
    });

    return {
      current_metrics: {
        estimated_monthly_customers: currentMonthlyCustomers,
        current_cac: currentCAC,
        ltv,
        ltv_cac_ratio: currentCAC > 0 ? ltv / currentCAC : 0
      },
      optimization: {
        optimal_cac: optimalCAC,
        max_sustainable_cac: maxSustainableCAC,
        cac_health: currentCAC < optimalCAC ? "healthy" : 
                   currentCAC < maxSustainableCAC ? "concerning" : "unsustainable"
      },
      growth_scenarios: growthScenarios,
      recommendations: this.generateAdSpendRecommendations(currentCAC, optimalCAC, ltv)
    };
  }

  // Utility methods for statistical calculations
  private sampleBeta(alpha: number, beta: number): number {
    // Simplified beta sampling using rejection sampling
    let x: number;
    do {
      x = Math.random();
    } while (Math.random() > Math.pow(x, alpha - 1) * Math.pow(1 - x, beta - 1));
    return x;
  }

  private sampleLogNormal(mean: number, std: number): number {
    const normal = this.sampleNormal(Math.log(mean), std);
    return Math.exp(normal);
  }

  private sampleNormal(mean: number = 0, std: number = 1): number {
    // Box-Muller transformation
    const u1 = Math.random();
    const u2 = Math.random();
    const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    return z0 * std + mean;
  }

  private sampleATS(atsMixture: CategoryPrior['ats_mixture'], geo: string): number {
    // Sample job type based on weights
    const random = Math.random();
    let cumulativeWeight = 0;
    
    for (const job of atsMixture) {
      cumulativeWeight += job.weight;
      if (random <= cumulativeWeight) {
        const basePrice = job.price;
        const geoMultiplier = this.getGeoMultiplier(geo, 50000);
        const noiseFactor = this.sampleLogNormal(1, 0.2);
        return basePrice * geoMultiplier * noiseFactor;
      }
    }
    
    return atsMixture[0].price;
  }

  private calculateAdsRevenue(signals: BusinessSignals, prior: CategoryPrior, ats: number): number {
    if (!signals.ads_data || signals.ads_data.length === 0) return 0;

    let totalLeads = 0;
    for (const adData of signals.ads_data) {
      const volume = adData.vol || 0;
      const ctr = prior.ctr_mean * (1 - (adData.competition || 0.5) * 0.3);
      const conversion = prior.conversion_rate;
      
      const leads = volume * ctr * conversion;
      totalLeads += leads;
    }

    const bookings = totalLeads * prior.booking_rate;
    const annualBookings = bookings * 12;
    return annualBookings * ats;
  }

  private calculateFootTrafficRevenue(signals: BusinessSignals, prior: CategoryPrior, ats: number): number {
    const baseVisitsPerMonth = signals.pop_times_index * 1000;
    const transactionRate = prior.booking_rate * 0.3;
    const monthlyTransactions = baseVisitsPerMonth * transactionRate;
    return monthlyTransactions * 12 * ats;
  }

  private calculateModelWeights(signals: BusinessSignals, revenues: number[]): number[] {
    let weights = [0.33, 0.33, 0.34]; // Default equal weights

    if (signals.R_12 > 20) {
      weights = [0.5, 0.3, 0.2]; // Higher weight for review model
    }

    if (signals.ads_data && signals.ads_data.length > 2) {
      weights = [0.35, 0.4, 0.25]; // Higher weight for ads model
    }

    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    return weights.map(w => w / totalWeight);
  }

  private weightedAverage(values: number[], weights: number[]): number {
    return values.reduce((sum, value, index) => sum + value * weights[index], 0);
  }

  // AOA Assessment methods
  private assessServiceQuality(signals: BusinessSignals): number {
    let score = 0;

    // Star rating component (0-15 points)
    if (signals.stars >= 4.5) score += 15;
    else if (signals.stars >= 4.0) score += 12;
    else if (signals.stars >= 3.5) score += 8;
    else if (signals.stars >= 3.0) score += 4;

    // Review volume component (0-5 points)
    if (signals.R_total >= 100) score += 5;
    else if (signals.R_total >= 50) score += 3;
    else if (signals.R_total >= 20) score += 1;

    // Review consistency (0-5 points)
    if (signals.rating_volatility < 0.2) score += 5;
    else if (signals.rating_volatility < 0.4) score += 3;
    else if (signals.rating_volatility < 0.6) score += 1;

    return Math.min(score, 25);
  }

  private assessDemandMomentum(signals: BusinessSignals): number {
    let score = 0;

    // Review velocity (0-8 points)
    const reviewVelocity = signals.R_12 / Math.max(1, signals.R_total / signals.years_in_business);
    if (reviewVelocity > 1.2) score += 8;
    else if (reviewVelocity > 1.0) score += 6;
    else if (reviewVelocity > 0.8) score += 4;
    else if (reviewVelocity > 0.5) score += 2;

    // Market trends (0-7 points)
    const trendRatio = signals.trends_now / signals.trends_avg;
    if (trendRatio > 1.2) score += 7;
    else if (trendRatio > 1.1) score += 5;
    else if (trendRatio > 1.0) score += 3;
    else if (trendRatio > 0.9) score += 1;

    return Math.min(score, 15);
  }

  private assessCapacityReliability(signals: BusinessSignals): number {
    let score = 0;

    // Business age stability (0-8 points)
    if (signals.years_in_business >= 10) score += 8;
    else if (signals.years_in_business >= 5) score += 6;
    else if (signals.years_in_business >= 3) score += 4;
    else if (signals.years_in_business >= 1) score += 2;

    // Operational consistency (0-7 points)
    if (signals.R_12 > 0 && signals.R_total > 0) {
      const consistency = Math.min(1.0, signals.R_12 / (signals.R_total / signals.years_in_business));
      score += consistency * 7;
    }

    return Math.min(score, 15);
  }

  private assessCompetitivePosition(signals: BusinessSignals): number {
    let score = 0;

    // Market share proxy (0-8 points)
    const competitionScore = (1 - signals.competitors_density) * 8;
    score += competitionScore;

    // Digital presence (0-7 points)
    const digitalScore = (signals.website_quality * 0.6 + signals.social_presence * 0.4) * 7;
    score += digitalScore;

    return Math.min(score, 15);
  }

  private assessUnitEconomics(signals: BusinessSignals, prior: CategoryPrior): number {
    let score = 0;

    // Revenue efficiency (0-12 points)
    if (signals.ads_data && signals.ads_data.length > 0) {
      const avgCPC = this.mean(signals.ads_data.map(ad => ad.cpc));
      const estimatedCAC = avgCPC / (prior.ctr_mean * prior.conversion_rate);
      const ats = this.mean(prior.ats_mixture.map(job => job.price));
      
      const cacRatio = ats > 0 ? estimatedCAC / ats : 1;
      if (cacRatio < 0.1) score += 12;
      else if (cacRatio < 0.2) score += 9;
      else if (cacRatio < 0.3) score += 6;
      else if (cacRatio < 0.5) score += 3;
    } else {
      score += 6; // Default if no ads data
    }

    // Margin health (0-8 points)
    const marginHealth = prior.operating_margin * (1 + (signals.stars - 3.5) * 0.2);
    if (marginHealth > 0.25) score += 8;
    else if (marginHealth > 0.20) score += 6;
    else if (marginHealth > 0.15) score += 4;
    else if (marginHealth > 0.10) score += 2;

    return Math.min(score, 20);
  }

  private assessComplianceRisk(signals: BusinessSignals): number {
    let score = 10; // Start with full points

    if (signals.years_in_business < 2) score -= 3;
    if (signals.trends_now / signals.trends_avg < 0.8) score -= 2;
    if (signals.competitors_density > 0.8) score -= 2;

    return Math.max(score, 0);
  }

  private calculateTransitionRisk(signals: BusinessSignals): any {
    let riskScore = 0;
    const riskFactors: string[] = [];

    // Age-based risk
    if (signals.years_in_business > 20) {
      riskScore += 30;
      riskFactors.push("Business over 20 years old - potential succession issues");
    } else if (signals.years_in_business > 15) {
      riskScore += 20;
      riskFactors.push("Mature business - monitor for owner fatigue");
    }

    // Performance decline indicators
    const expectedReviews = signals.R_total / signals.years_in_business;
    if (signals.R_12 < expectedReviews * 0.7) {
      riskScore += 25;
      riskFactors.push("Review velocity declining - possible owner disengagement");
    }

    // Market pressure
    if (signals.competitors_density > 0.7) {
      riskScore += 15;
      riskFactors.push("High competition - may pressure owner to exit");
    }

    // Economic stress
    const trendDecline = 1 - (signals.trends_now / signals.trends_avg);
    if (trendDecline > 0.2) {
      riskScore += 20;
      riskFactors.push("Market demand declining - economic pressure");
    }

    return {
      risk_score: Math.min(riskScore, 100),
      risk_level: riskScore > 60 ? "high" : riskScore > 30 ? "medium" : "low",
      risk_factors: riskFactors,
      succession_probability: riskScore / 100
    };
  }

  // Utility methods
  private quickAOAScore(signals: BusinessSignals, prior: CategoryPrior): number {
    let score = 0;
    score += (signals.stars / 5) * 40; // Service quality
    score += Math.min(30, (signals.trends_now / signals.trends_avg) * 30); // Demand momentum
    score += (1 - signals.competitors_density) * 30; // Competitive position
    return Math.min(score, 100);
  }

  private calculatePercentiles(values: number[], percentiles: number[]): number[] {
    const sorted = [...values].sort((a, b) => a - b);
    return percentiles.map(p => {
      const index = (p / 100) * (sorted.length - 1);
      const lower = Math.floor(index);
      const upper = Math.ceil(index);
      const weight = index - lower;
      return sorted[lower] * (1 - weight) + sorted[upper] * weight;
    });
  }

  private mean(values: number[]): number {
    return values.reduce((sum, val) => sum + val, 0) / values.length;
  }

  private std(values: number[]): number {
    const avg = this.mean(values);
    const squaredDiffs = values.map(val => Math.pow(val - avg, 2));
    return Math.sqrt(this.mean(squaredDiffs));
  }

  private getStateCode(location: string): string | null {
    const stateMapping: Record<string, string> = {
      "AL": "01", "AK": "02", "AZ": "04", "AR": "05", "CA": "06", "CO": "08",
      "CT": "09", "DE": "10", "FL": "12", "GA": "13", "HI": "15", "ID": "16",
      "IL": "17", "IN": "18", "IA": "19", "KS": "20", "KY": "21", "LA": "22",
      "ME": "23", "MD": "24", "MA": "25", "MI": "26", "MN": "27", "MS": "28",
      "MO": "29", "MT": "30", "NE": "31", "NV": "32", "NH": "33", "NJ": "34",
      "NM": "35", "NY": "36", "NC": "37", "ND": "38", "OH": "39", "OK": "40",
      "OR": "41", "PA": "42", "RI": "44", "SC": "45", "SD": "46", "TN": "47",
      "TX": "48", "UT": "49", "VT": "50", "VA": "51", "WA": "53", "WV": "54",
      "WI": "55", "WY": "56"
    };

    const parts = location.split(',');
    if (parts.length >= 2) {
      const state = parts[parts.length - 1].trim().toUpperCase();
      return stateMapping[state] || null;
    }
    return null;
  }

  private getGeoCode(location: string): string {
    if (location.toUpperCase().includes('TX')) return 'US-TX';
    if (location.toUpperCase().includes('CA')) return 'US-CA';
    if (location.toUpperCase().includes('FL')) return 'US-FL';
    return 'US';
  }

  private getGeoMultiplier(geo: string, medianIncome: number): number {
    const nationalMedian = 62843;
    const incomeRatio = medianIncome / nationalMedian;
    const multiplier = 0.8 + 0.4 * Math.log(incomeRatio + 0.5);
    return Math.max(0.6, Math.min(1.4, multiplier));
  }

  private getPenetrationRate(category: string): number {
    const penetrationRates: Record<string, number> = {
      "HVAC": 0.15,
      "Restaurant": 0.8,
      "Dental": 0.6,
      "Auto Repair": 0.4,
      "Landscaping": 0.25,
      "Salon": 0.7,
      "Accounting": 0.3,
      "Plumbing": 0.1,
      "Electrical": 0.08
    };
    return penetrationRates[category] || 0.1;
  }

  private calculateTrendSlope(timeline: any[]): number {
    if (timeline.length < 2) return 0.0;
    
    const values = timeline.map(point => point.values?.[0]?.value || 50);
    const n = values.length;
    const sumX = (n * (n - 1)) / 2;
    const sumY = values.reduce((sum, val) => sum + val, 0);
    const sumXY = values.reduce((sum, val, idx) => sum + val * idx, 0);
    const sumX2 = (n * (n - 1) * (2 * n - 1)) / 6;
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    return slope / 100;
  }

  private estimateDemographicGrowth(signals: BusinessSignals): number {
    const baseGrowth = 0.02;
    const incomeFactor = Math.min(2.0, signals.median_income / 50000);
    const densityFactor = 2.0 - signals.business_density;
    return baseGrowth * incomeFactor * densityFactor;
  }

  private calculateMarketAttractiveness(signals: BusinessSignals): number {
    let score = 0;

    // Population size (0-25 points)
    if (signals.population > 100000) score += 25;
    else if (signals.population > 50000) score += 20;
    else if (signals.population > 25000) score += 15;
    else if (signals.population > 10000) score += 10;
    else score += 5;

    // Income level (0-25 points)
    const incomeScore = Math.min(25, (signals.median_income / 100000) * 25);
    score += incomeScore;

    // Competition level (0-25 points)
    const competitionScore = (1 - signals.competitors_density) * 25;
    score += competitionScore;

    // Growth trends (0-25 points)
    const trendScore = Math.min(25, (signals.trends_now / signals.trends_avg) * 25);
    score += trendScore;

    return Math.min(score, 100);
  }

  private assessBarriersToEntry(category: string): any {
    const barriers: Record<string, any> = {
      "HVAC": { licensing: "high", capital: "medium", expertise: "high", score: 75 },
      "Restaurant": { licensing: "medium", capital: "high", expertise: "medium", score: 60 },
      "Dental": { licensing: "very_high", capital: "very_high", expertise: "very_high", score: 95 },
      "Auto Repair": { licensing: "medium", capital: "medium", expertise: "high", score: 70 },
      "Landscaping": { licensing: "low", capital: "low", expertise: "medium", score: 35 },
      "Salon": { licensing: "medium", capital: "medium", expertise: "medium", score: 55 },
      "Accounting": { licensing: "high", capital: "low", expertise: "very_high", score: 80 }
    };

    return barriers[category] || { licensing: "medium", capital: "medium", expertise: "medium", score: 50 };
  }

  private generateAOAInsights(pillars: Record<string, number>, signals: BusinessSignals): string[] {
    const insights: string[] = [];

    if (pillars.service_quality > 20) {
      insights.push("✅ Excellent service quality - strong customer satisfaction");
    } else if (pillars.service_quality < 10) {
      insights.push("⚠️ Service quality concerns - review management needed");
    }

    if (pillars.demand_momentum > 12) {
      insights.push("📈 Strong demand momentum - good growth trajectory");
    } else if (pillars.demand_momentum < 8) {
      insights.push("📉 Declining demand - market challenges ahead");
    }

    if (pillars.competitive_position > 12) {
      insights.push("🎯 Strong competitive position - market leader potential");
    } else if (pillars.competitive_position < 8) {
      insights.push("⚔️ Weak competitive position - differentiation needed");
    }

    if (pillars.unit_economics > 15) {
      insights.push("💰 Healthy unit economics - profitable growth model");
    } else if (pillars.unit_economics < 10) {
      insights.push("💸 Unit economics concerns - pricing optimization needed");
    }

    return insights;
  }

  private identifyRiskFlags(pillars: Record<string, number>, signals: BusinessSignals): string[] {
    const flags: string[] = [];

    if (signals.stars < 3.5) {
      flags.push("🔴 Low customer satisfaction - reputation risk");
    }

    if (signals.R_12 < signals.R_total / (signals.years_in_business * 2)) {
      flags.push("🔴 Declining review velocity - possible owner disengagement");
    }

    if (signals.competitors_density > 0.8) {
      flags.push("🟡 High competition density - margin pressure risk");
    }

    if (signals.trends_now / signals.trends_avg < 0.8) {
      flags.push("🟡 Market demand declining - industry headwinds");
    }

    if (pillars.compliance_risk < 7) {
      flags.push("🔴 Compliance or lease risk detected");
    }

    return flags;
  }

  private identifyKeyDrivers(valuation: ValuationResult, aoa: AOAResult): string[] {
    const drivers: string[] = [];

    const revP50 = valuation.revenue.p50;
    if (revP50 > 1000000) {
      drivers.push("💰 Strong revenue base drives valuation");
    }

    const aoaScore = aoa.total_score;
    if (aoaScore > 80) {
      drivers.push("🏆 Excellent operational health increases multiple");
    } else if (aoaScore < 60) {
      drivers.push("⚠️ Operational challenges limit valuation");
    }

    return drivers;
  }

  private calculateConfidenceScore(signals: BusinessSignals): number {
    let confidence = 0;

    // Data quality factors
    if (signals.R_total > 50) confidence += 25;
    else if (signals.R_total > 20) confidence += 15;
    else if (signals.R_total > 10) confidence += 10;
    else confidence += 5;

    if (signals.R_12 > 10) confidence += 20;
    else if (signals.R_12 > 5) confidence += 15;
    else if (signals.R_12 > 0) confidence += 10;

    if (signals.ads_data && signals.ads_data.length > 0) confidence += 20;

    if (signals.years_in_business > 3) confidence += 15;
    else if (signals.years_in_business > 1) confidence += 10;
    else confidence += 5;

    if (signals.median_income > 0) confidence += 10;
    if (signals.population > 0) confidence += 10;

    return Math.min(confidence, 100);
  }

  private getAOAGrade(score: number): string {
    if (score >= 90) return "A+";
    if (score >= 85) return "A";
    if (score >= 80) return "A-";
    if (score >= 75) return "B+";
    if (score >= 70) return "B";
    if (score >= 65) return "B-";
    if (score >= 60) return "C+";
    if (score >= 55) return "C";
    if (score >= 50) return "C-";
    return "D";
  }

  private generateAdSpendRecommendations(currentCAC: number, optimalCAC: number, ltv: number): string[] {
    const recommendations: string[] = [];

    if (currentCAC > ltv / 2) {
      recommendations.push("🚨 CRITICAL: Current CAC exceeds sustainable levels");
      recommendations.push("📉 Reduce ad spend or improve conversion rates immediately");
    } else if (currentCAC > optimalCAC) {
      recommendations.push("⚠️ CAC above optimal level - room for efficiency improvement");
      recommendations.push("🎯 Focus on improving landing page conversion rates");
    } else {
      recommendations.push("✅ CAC is healthy - consider scaling ad spend");
      recommendations.push("📈 Opportunity to increase market share with current efficiency");
    }

    if (ltv > currentCAC * 5) {
      recommendations.push("💰 Strong unit economics - aggressive growth opportunity");
    }

    return recommendations;
  }

  // CSV Processing
  async batchValuateCSV(csvContent: string, defaultCategory: string = "HVAC"): Promise<any> {
    console.log('📊 Starting batch valuation from CSV');

    try {
      const records = parse(csvContent, { 
        columns: true, 
        skip_empty_lines: true,
        cast: true 
      });

      const businesses: BusinessSignals[] = records.map((row: any, index: number) => {
        // Parse ads data
        const adsData = [];
        for (let i = 1; i <= 6; i++) {
          const vol = row[`ads_vol_${i}`];
          if (vol !== undefined && vol !== null && vol !== '') {
            adsData.push({
              vol: parseFloat(vol) || 0,
              cpc: parseFloat(row[`ads_cpc_${i}`]) || 0,
              competition: parseFloat(row[`ads_comp_${i}`]) || 0.5
            });
          }
        }

        return {
          business_id: row.business_id || `batch_${index}`,
          name: row.name || "Unknown Business",
          category: row.category || defaultCategory,
          geo: row.geo || "Unknown Location",
          R_total: parseInt(row.R_total) || 0,
          R_12: parseInt(row.R_12) || 0,
          stars: parseFloat(row.stars) || 3.5,
          rating_volatility: parseFloat(row.rating_volatility) || 0.3,
          ads_data: adsData,
          trends_now: parseFloat(row.trends_now) || 1.0,
          trends_avg: parseFloat(row.trends_avg) || 1.0,
          pop_times_index: parseFloat(row.pop_times_index) || 1.0,
          competitors_density: parseFloat(row.competitors_density) || 0.5,
          median_income: parseFloat(row.median_income) || 50000,
          population: parseInt(row.population) || 10000,
          years_in_business: parseInt(row.years_in_business) || 5,
          website_quality: parseFloat(row.website_quality) || 0.7,
          social_presence: parseFloat(row.social_presence) || 0.5
        };
      });

      console.log(`📋 Parsed ${businesses.length} businesses from CSV`);

      // Process in parallel batches
      const batchSize = 10;
      const results = [];

      for (let i = 0; i < businesses.length; i += batchSize) {
        const batch = businesses.slice(i, i + batchSize);
        const batchPromises = batch.map(business => this.valuateBusiness(business));
        const batchResults = await Promise.allSettled(batchPromises);

        for (const result of batchResults) {
          if (result.status === 'fulfilled') {
            results.push(result.value);
          } else {
            console.error('Batch processing error:', result.reason);
          }
        }
      }

      const summary = this.generateBatchSummary(results);

      return {
        success: true,
        total_processed: results.length,
        results,
        summary,
        processing_time: new Date().toISOString()
      };

    } catch (error) {
      console.error('Batch processing error:', error);
      return { success: false, error: String(error) };
    }
  }

  private generateBatchSummary(results: any[]): any {
    if (results.length === 0) return {};

    const valuations = results.map(r => r.valuation?.valuation?.p50 || 0);
    const aoaScores = results.map(r => r.aoa?.total_score || 0);

    const topValuations = results
      .sort((a, b) => (b.valuation?.valuation?.p50 || 0) - (a.valuation?.valuation?.p50 || 0))
      .slice(0, 10);

    const highRisk = results.filter(r => (r.aoa?.owner_transition_risk?.risk_score || 0) > 60);

    return {
      valuation_stats: {
        mean: this.mean(valuations),
        median: this.calculatePercentiles(valuations, [50])[0],
        total_market_value: valuations.reduce((sum, val) => sum + val, 0)
      },
      aoa_stats: {
        mean_score: this.mean(aoaScores),
        grade_distribution: this.calculateGradeDistribution(aoaScores)
      },
      top_opportunities: topValuations.slice(0, 5).map(r => ({
        name: r.business_name,
        valuation_p50: r.valuation?.valuation?.p50,
        aoa_score: r.aoa?.total_score,
        transition_risk: r.aoa?.owner_transition_risk?.risk_score
      })),
      high_transition_risk: highRisk.length,
      acquisition_targets: results.filter(r => (r.aoa?.total_score || 0) > 70).length
    };
  }

  private calculateGradeDistribution(scores: number[]): Record<string, number> {
    const distribution = { A: 0, B: 0, C: 0, D: 0 };

    for (const score of scores) {
      if (score >= 80) distribution.A++;
      else if (score >= 65) distribution.B++;
      else if (score >= 50) distribution.C++;
      else distribution.D++;
    }

    return distribution;
  }
}

// Express API Setup
const app = express();
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.text({ limit: "10mb" }));

// Initialize valuation engine
const apiKeys = {
  YELP_API_KEY: process.env.YELP_API_KEY || '',
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
  CENSUS_API_KEY: process.env.CENSUS_API_KEY || '',
  SERPAPI_API_KEY: process.env.SERPAPI_API_KEY || ''
};

const valuationEngine = new SMBValuationEngineTS(apiKeys);

// API Routes
app.post('/api/valuate', async (req, res) => {
  try {
    const parsed = BusinessSignalsSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ 
        error: "Invalid input data", 
        details: parsed.error.flatten() 
      });
    }

    const result = await valuationEngine.valuateBusiness(parsed.data);
    res.json(result);
  } catch (error) {
    console.error('Valuation error:', error);
    res.status(500).json({ error: String(error) });
  }
});

app.post('/api/valuate/batch', async (req, res) => {
  try {
    const { csv, defaultCategory } = req.body;
    
    if (typeof csv !== 'string') {
      return res.status(400).json({ error: "CSV content required as string" });
    }

    const result = await valuationEngine.batchValuateCSV(csv, defaultCategory || "HVAC");
    res.json(result);
  } catch (error) {
    console.error('Batch valuation error:', error);
    res.status(500).json({ error: String(error) });
  }
});

app.get('/api/priors', (req, res) => {
  res.json(CATEGORY_PRIORS);
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    api_keys_configured: Object.entries(apiKeys).reduce((count, [key, value]) => 
      count + (value && value !== '' ? 1 : 0), 0),
    categories_supported: Object.keys(CATEGORY_PRIORS).length
  });
});

// ZIP Opportunity Report endpoint
app.post('/api/zip-opportunities', async (req, res) => {
  try {
    const { zip_codes } = req.body;
    
    if (!Array.isArray(zip_codes)) {
      return res.status(400).json({ error: "zip_codes array required" });
    }

    // Generate sample opportunity report
    const opportunities = zip_codes.map((zipCode: string, index: number) => {
      const cities = ["Dallas, TX", "Miami, FL", "Chicago, IL", "Los Angeles, CA", "Houston, TX"];
      const signals = [
        "58% biz owners >55 yrs • 22% rent increase last year",
        "Port expansion underway • 17% biz license non-renewals", 
        "New Google campus coming • 41% bizs >15 yrs old",
        "Night foot traffic ↑32% • 14% bizs have 'retiring' in reviews",
        "Oilfield layoffs → cheap equipment • 9% biz vacancy rate"
      ];
      const targets = [
        "HVAC services, laundromats, indie gyms",
        "Seafood distributors, boat storage, HVAC",
        "Coffee shops, IT services, delis", 
        "Liquor stores, 24hr diners",
        "Trucking cos., equipment repair"
      ];
      const discounts = ["27%", "33%", "19%", "38%", "45%"];

      return {
        zip_code: zipCode,
        city: cities[index % cities.length],
        key_signals: signals[index % signals.length].split(' • '),
        top_business_targets: targets[index % targets.length].split(', '),
        avg_discount_potential: discounts[index % discounts.length],
        opportunity_score: Math.random() * 40 + 60 // 60-100 range
      };
    }).sort((a, b) => b.opportunity_score - a.opportunity_score);

    res.json({
      top_zip_codes: opportunities.slice(0, 10),
      total_zips_analyzed: opportunities.length,
      analysis_timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('ZIP opportunities error:', error);
    res.status(500).json({ error: String(error) });
  }
});

// Example CSV template endpoint
app.get('/api/csv-template', (req, res) => {
  const template = `business_id,name,category,geo,R_total,R_12,stars,years_in_business,ads_vol_1,ads_cpc_1,ads_comp_1
hvac_001,Joe's HVAC,HVAC,"Dallas, TX",120,25,4.3,8,8000,12.0,0.7
restaurant_002,Maria's Cafe,Restaurant,"Miami, FL",89,18,4.1,5,2500,3.5,0.8
dental_003,Smile Dental,Dental,"Chicago, IL",156,31,4.7,12,1200,8.2,0.6`;

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="valuation_template.csv"');
  res.send(template);
});

// Start server
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3001;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 SMB Valuation Engine API running on port ${PORT}`);
    console.log(`📊 API endpoints:`);
    console.log(`   POST /api/valuate - Single business valuation`);
    console.log(`   POST /api/valuate/batch - Batch CSV valuation`);
    console.log(`   POST /api/zip-opportunities - ZIP opportunity report`);
    console.log(`   GET  /api/priors - Category priors`);
    console.log(`   GET  /api/health - Health check`);
    console.log(`   GET  /api/csv-template - Download CSV template`);
    console.log(`🔗 Test at: http://localhost:${PORT}/api/health`);
  });
}

export { SMBValuationEngineTS, CATEGORY_PRIORS, BusinessSignalsSchema };
export type { BusinessSignals, CategoryPrior, ValuationResult, AOAResult };
