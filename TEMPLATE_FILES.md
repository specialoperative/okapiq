# 🔧 Template Files for Cursor

These are key template files that Cursor should use as starting points when building the Okapiq platform.

## 1. Business Types Template (shared/types/business.ts)

```typescript
export interface BusinessInput {
  // Basic Info
  business_id: string;
  name: string;
  category: BusinessCategory;
  geo: string;
  address?: string;
  phone?: string;
  website?: string;
  
  // Review Signals (from Yelp/Google)
  R_total: number;              // Total lifetime reviews
  R_12: number;                 // Reviews in last 12 months
  stars: number;                // Average rating (1-5)
  rating_volatility: number;    // Standard deviation of ratings
  review_response_rate: number; // % of reviews owner responds to
  
  // Market Demographics (from Census/ArcGIS)
  population: number;           // Population in service area
  median_income: number;        // Median household income
  business_density: number;     // Businesses per capita
  competitors_density: number;  // Direct competitors nearby
  
  // Demand Signals (from SERP/Google Trends)
  keyword_volume: number;       // Monthly searches for category
  search_trends: number;        // Trend direction (-1 to 1)
  seasonal_index: number;       // Seasonality factor (0.5 to 1.5)
  
  // Operational Data (from Data Axle/LinkedIn)
  years_in_business: number;
  employees: number;
  capacity_constraint?: number;  // Max customers per year
  service_radius_miles: number;
  
  // Digital Presence (computed)
  website_quality: number;      // 0-1 score
  social_presence: number;      // 0-1 score
  google_business_claimed: boolean;
  seo_score: number;           // 0-100
  
  // Financial Proxies
  avg_ticket_size: number;
  ads_data: AdData[];
  estimated_revenue?: number;
  
  // Risk Factors
  lease_risk: number;          // 0-1 score
  regulatory_risk: number;     // 0-1 score
  customer_concentration: number; // 0-1 score
}

export interface AdData {
  keyword: string;
  monthly_volume: number;
  cpc: number;              // Cost per click
  competition: number;      // 0-1 competition intensity
  ctr?: number;            // Click through rate
  conversion_rate?: number; // Click to customer rate
}

export enum BusinessCategory {
  HVAC = "HVAC",
  RESTAURANT = "Restaurant",
  DENTAL = "Dental",
  AUTO_REPAIR = "Auto Repair",
  LANDSCAPING = "Landscaping",
  SALON = "Salon",
  ACCOUNTING = "Accounting",
  PLUMBING = "Plumbing",
  ELECTRICAL = "Electrical",
  GYM = "Gym",
  LAUNDROMAT = "Laundromat",
  TRUCKING = "Trucking",
  LEGAL = "Legal",
  RETAIL = "Retail"
}

export interface ValuationResult {
  business_id: string;
  business_name: string;
  category: BusinessCategory;
  location: string;
  
  // Monte Carlo Valuation Results
  valuation: {
    p10: number;                // 10th percentile
    p25: number;                // 25th percentile  
    p50: number;                // Median (50th percentile)
    p75: number;                // 75th percentile
    p90: number;                // 90th percentile
    mean: number;               // Average
    std: number;                // Standard deviation
    confidence_score: number;   // 0-100 confidence in estimate
  };
  
  // Revenue Analysis
  revenue_estimate: {
    p10: number;
    p50: number;
    p90: number;
    annual_customers: number;
    customer_acquisition_rate: number;
  };
  
  // EBITDA Analysis
  ebitda_estimate: {
    p10: number;
    p50: number;
    p90: number;
    margin: number;
  };
  
  // Market Sizing
  tam_tsm: {
    tam: number;                    // Total Addressable Market
    tsm: number;                    // Total Serviceable Market
    sam: number;                    // Serviceable Available Market
    market_share_potential: number; // 0-1 potential share
    fragmentation_hhi: number;      // Herfindahl-Hirschman Index
  };
  
  // Opportunity Scores (0-100 each)
  aoa_score: number;              // Automated Operational Assessment
  succession_risk: number;        // Owner transition risk
  digital_presence_risk: number;  // Digital modernization opportunity
  ad_arbitrage_score: number;     // Marketing efficiency opportunity
  overall_opportunity_score: number;
  
  // Sub-scores for AOA
  aoa_breakdown: {
    service_quality: number;      // 0-25 points
    demand_momentum: number;      // 0-15 points
    capacity_reliability: number; // 0-15 points
    competitive_position: number; // 0-15 points
    unit_economics: number;       // 0-20 points
    compliance_risk: number;      // 0-10 points
  };
  
  // Detailed Diagnostics
  diagnostics: {
    revenue_model_weights: number[];  // [review_model, ads_model, traffic_model]
    key_value_drivers: string[];
    risk_factors: string[];
    growth_levers: string[];
    comparable_multiples: number[];
  };
  
  // Actionable Insights
  key_insights: string[];
  risk_flags: string[];
  recommendations: string[];
  
  // Metadata
  confidence_factors: Record<string, number>;
  data_sources_used: string[];
  timestamp: string;
  processing_time_ms: number;
}

export interface BatchProcessingResult {
  job_id: string;
  total_businesses: number;
  processed: number;
  failed: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  results: ValuationResult[];
  summary: {
    avg_valuation: number;
    total_market_value: number;
    high_opportunity_count: number;
    top_opportunities: ValuationResult[];
  };
  started_at: string;
  completed_at?: string;
  error_log?: string[];
}
```

## 2. Valuation Engine Core (backend/src/services/valuationEngine.ts)

```typescript
import { BusinessInput, ValuationResult, BusinessCategory } from '../types/business';
import { CategoryPrior, CATEGORY_PRIORS } from '../config/categoryPriors';
import { Logger } from '../utils/logger';

export class ValuationEngine {
  private logger = Logger.getInstance();
  private monteCarloRuns = 1000;

  async valuateBusiness(input: BusinessInput): Promise<ValuationResult> {
    this.logger.info(`Starting valuation for ${input.name} (${input.category})`);
    
    const startTime = Date.now();
    
    try {
      // Get category priors
      const prior = CATEGORY_PRIORS[input.category] || CATEGORY_PRIORS[BusinessCategory.HVAC];
      
      // Run Monte Carlo simulation
      const monteCarloResults = this.runMonteCarloSimulation(input, prior);
      
      // Calculate market sizing
      const tamTsm = await this.calculateTamTsm(input);
      
      // Calculate opportunity scores
      const opportunityScores = this.calculateOpportunityScores(input, prior);
      
      // Generate insights and recommendations
      const insights = this.generateInsights(input, monteCarloResults, opportunityScores);
      
      const result: ValuationResult = {
        business_id: input.business_id,
        business_name: input.name,
        category: input.category,
        location: input.geo,
        valuation: monteCarloResults.valuation,
        revenue_estimate: monteCarloResults.revenue,
        ebitda_estimate: monteCarloResults.ebitda,
        tam_tsm: tamTsm,
        aoa_score: opportunityScores.aoa_score,
        succession_risk: opportunityScores.succession_risk,
        digital_presence_risk: opportunityScores.digital_presence_risk,
        ad_arbitrage_score: opportunityScores.ad_arbitrage_score,
        overall_opportunity_score: opportunityScores.overall_opportunity_score,
        aoa_breakdown: opportunityScores.aoa_breakdown,
        diagnostics: monteCarloResults.diagnostics,
        key_insights: insights.key_insights,
        risk_flags: insights.risk_flags,
        recommendations: insights.recommendations,
        confidence_factors: monteCarloResults.confidence_factors,
        data_sources_used: this.getDataSourcesUsed(input),
        timestamp: new Date().toISOString(),
        processing_time_ms: Date.now() - startTime
      };
      
      this.logger.info(`Valuation completed for ${input.name}: $${result.valuation.p50.toLocaleString()}`);
      return result;
      
    } catch (error) {
      this.logger.error(`Valuation failed for ${input.name}:`, error);
      throw error;
    }
  }

  private runMonteCarloSimulation(input: BusinessInput, prior: CategoryPrior) {
    const valuations: number[] = [];
    const revenues: number[] = [];
    const ebitdas: number[] = [];
    
    for (let i = 0; i < this.monteCarloRuns; i++) {
      // Sample parameters from distributions
      const reviewPropensity = this.sampleBeta(prior.review_propensity_alpha, prior.review_propensity_beta);
      const avgTicketSize = this.sampleTicketSize(prior.ats_mixture, input);
      const multiple = this.sampleLogNormal(prior.multiple_mean, prior.multiple_std);
      
      // Model 1: Review-driven revenue
      const reviewRevenue = this.calculateReviewRevenue(input, reviewPropensity, avgTicketSize);
      
      // Model 2: Ads-driven revenue  
      const adsRevenue = this.calculateAdsRevenue(input, prior, avgTicketSize);
      
      // Model 3: Foot traffic revenue
      const trafficRevenue = this.calculateTrafficRevenue(input, prior, avgTicketSize);
      
      // Ensemble revenue with model weights
      const modelWeights = this.calculateModelWeights(input);
      const ensembleRevenue = this.weightedAverage(
        [reviewRevenue, adsRevenue, trafficRevenue], 
        modelWeights
      );
      
      // Apply geographic and seasonal adjustments
      const adjustedRevenue = ensembleRevenue * 
        this.getGeographicMultiplier(input) * 
        input.seasonal_index;
      
      // Calculate EBITDA
      const ebitda = adjustedRevenue * prior.operating_margin * 
        this.getOperationalEfficiencyMultiplier(input);
      
      // Calculate valuation
      const valuation = ebitda * multiple * 
        this.getQualityMultiplier(input);
      
      valuations.push(valuation);
      revenues.push(adjustedRevenue);
      ebitdas.push(ebitda);
    }
    
    return {
      valuation: this.calculatePercentiles(valuations),
      revenue: this.calculatePercentiles(revenues),
      ebitda: this.calculatePercentiles(ebitdas),
      diagnostics: this.calculateDiagnostics(input, prior),
      confidence_factors: this.calculateConfidenceFactors(input)
    };
  }

  // TODO: Implement helper methods
  private sampleBeta(alpha: number, beta: number): number {
    // Implement beta distribution sampling
    throw new Error('Not implemented');
  }
  
  private sampleTicketSize(atsMixture: any[], input: BusinessInput): number {
    // Implement ticket size sampling from mixture model
    throw new Error('Not implemented');
  }
  
  private sampleLogNormal(mean: number, std: number): number {
    // Implement log-normal distribution sampling
    throw new Error('Not implemented');
  }
  
  // ... other helper methods
}
```

## 3. API Route Template (backend/src/routes/valuation.ts)

```typescript
import { Router } from 'express';
import { z } from 'zod';
import { ValuationEngine } from '../services/valuationEngine';
import { BusinessInput } from '../types/business';
import { Logger } from '../utils/logger';
import { validateRequest } from '../middleware/validation';
import { rateLimit } from '../middleware/rateLimit';

const router = Router();
const valuationEngine = new ValuationEngine();
const logger = Logger.getInstance();

// Validation schemas
const BusinessInputSchema = z.object({
  business_id: z.string(),
  name: z.string().min(1),
  category: z.string(),
  geo: z.string(),
  R_total: z.number().int().min(0),
  R_12: z.number().int().min(0),
  stars: z.number().min(0).max(5),
  // ... add all other fields
});

const BatchRequestSchema = z.object({
  businesses: z.array(BusinessInputSchema).max(100), // Limit batch size
  options: z.object({
    include_diagnostics: z.boolean().default(true),
    export_format: z.enum(['json', 'csv']).default('json')
  }).optional()
});

// Single business valuation
router.post('/valuate', 
  rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }), // 100 requests per 15 minutes
  validateRequest(BusinessInputSchema),
  async (req, res) => {
    try {
      const businessInput: BusinessInput = req.body;
      const result = await valuationEngine.valuateBusiness(businessInput);
      
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      logger.error('Valuation error:', error);
      res.status(500).json({
        success: false,
        error: 'Valuation failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
);

// Batch valuation
router.post('/valuate-batch',
  rateLimit({ windowMs: 60 * 60 * 1000, max: 10 }), // 10 batch requests per hour
  validateRequest(BatchRequestSchema),
  async (req, res) => {
    try {
      const { businesses, options } = req.body;
      
      // Process in parallel with concurrency limit
      const results = await Promise.allSettled(
        businesses.map(business => valuationEngine.valuateBusiness(business))
      );
      
      const successful = results
        .filter(result => result.status === 'fulfilled')
        .map(result => (result as PromiseFulfilledResult<any>).value);
      
      const failed = results
        .filter(result => result.status === 'rejected')
        .map(result => (result as PromiseRejectedResult).reason);
      
      res.json({
        success: true,
        data: {
          total: businesses.length,
          successful: successful.length,
          failed: failed.length,
          results: successful,
          errors: failed.map(err => err.message)
        }
      });
    } catch (error) {
      logger.error('Batch valuation error:', error);
      res.status(500).json({
        success: false,
        error: 'Batch valuation failed'
      });
    }
  }
);

// Smart valuation with API enrichment
router.post('/valuate-smart',
  rateLimit({ windowMs: 15 * 60 * 1000, max: 50 }), // 50 requests per 15 minutes
  async (req, res) => {
    try {
      const { name, location, category } = req.body;
      
      if (!name || !location) {
        return res.status(400).json({
          success: false,
          error: 'Name and location are required'
        });
      }
      
      // Enrich business data using external APIs
      const enrichedBusiness = await valuationEngine.enrichBusinessData({
        name,
        location, 
        category
      });
      
      // Run full valuation
      const result = await valuationEngine.valuateBusiness(enrichedBusiness);
      
      res.json({
        success: true,
        data: result,
        enrichment_sources: result.data_sources_used
      });
    } catch (error) {
      logger.error('Smart valuation error:', error);
      res.status(500).json({
        success: false,
        error: 'Smart valuation failed'
      });
    }
  }
);

export default router;
```

## 4. Frontend Dashboard Component (frontend/src/components/Dashboard.tsx)

```typescript
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { BusinessForm } from './forms/BusinessForm';
import { BatchUpload } from './forms/BatchUpload';
import { ValuationResults } from './results/ValuationResults';
import { useValuation } from '@/hooks/useValuation';
import { BusinessInput, ValuationResult } from '@/types';

export const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('single');
  const [results, setResults] = useState<ValuationResult | null>(null);
  const [batchResults, setBatchResults] = useState<ValuationResult[]>([]);
  
  const { 
    valuateBusiness, 
    valuateBatch, 
    isLoading, 
    error 
  } = useValuation();

  const handleSingleValuation = async (businessInput: BusinessInput) => {
    try {
      const result = await valuateBusiness(businessInput);
      setResults(result);
    } catch (err) {
      console.error('Valuation failed:', err);
    }
  };

  const handleBatchValuation = async (businesses: BusinessInput[]) => {
    try {
      const results = await valuateBatch(businesses);
      setBatchResults(results);
      setActiveTab('batch-results');
    } catch (err) {
      console.error('Batch valuation failed:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            🏦 Okapiq Valuation Engine
          </h1>
          <p className="text-slate-600 text-lg">
            Advanced SMB valuation with Monte Carlo simulation, market analysis, and opportunity scoring
          </p>
        </header>

        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertDescription className="text-red-800">
              {error}
            </AlertDescription>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="single">Single Business</TabsTrigger>
            <TabsTrigger value="batch">Batch Upload</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
            <TabsTrigger value="batch-results">Batch Results</TabsTrigger>
          </TabsList>

          <TabsContent value="single" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Business Information</CardTitle>
                  <CardDescription>
                    Enter business details for valuation analysis
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <BusinessForm 
                    onSubmit={handleSingleValuation}
                    isLoading={isLoading}
                  />
                </CardContent>
              </Card>

              {results && (
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium">Valuation Range</Label>
                        <div className="text-2xl font-bold text-green-600">
                          ${results.valuation.p10.toLocaleString()} - ${results.valuation.p90.toLocaleString()}
                        </div>
                        <div className="text-sm text-slate-500">
                          Median: ${results.valuation.p50.toLocaleString()}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium">AOA Score</Label>
                          <div className="flex items-center space-x-2">
                            <Progress value={results.aoa_score} className="flex-1" />
                            <span className="text-sm font-medium">{results.aoa_score}/100</span>
                          </div>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Opportunity Score</Label>
                          <div className="flex items-center space-x-2">
                            <Progress value={results.overall_opportunity_score} className="flex-1" />
                            <span className="text-sm font-medium">{results.overall_opportunity_score}/100</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm font-medium">Risk Flags</Label>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {results.risk_flags.map((flag, index) => (
                            <Badge key={index} variant="destructive" className="text-xs">
                              {flag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="batch" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Batch Processing</CardTitle>
                <CardDescription>
                  Upload a CSV file to process multiple businesses at once
                </CardDescription>
              </CardHeader>
              <CardContent>
                <BatchUpload 
                  onUpload={handleBatchValuation}
                  isLoading={isLoading}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="results" className="mt-6">
            {results ? (
              <ValuationResults result={results} />
            ) : (
              <Card>
                <CardContent className="flex items-center justify-center h-64">
                  <p className="text-slate-500">No results yet. Run a valuation to see results here.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="batch-results" className="mt-6">
            {batchResults.length > 0 ? (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Batch Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold">{batchResults.length}</div>
                        <div className="text-sm text-slate-500">Businesses Processed</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          ${(batchResults.reduce((sum, r) => sum + r.valuation.p50, 0) / 1000000).toFixed(1)}M
                        </div>
                        <div className="text-sm text-slate-500">Total Value</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {batchResults.filter(r => r.overall_opportunity_score > 70).length}
                        </div>
                        <div className="text-sm text-slate-500">High Opportunity</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">
                          {batchResults.filter(r => r.succession_risk > 60).length}
                        </div>
                        <div className="text-sm text-slate-500">Succession Risk</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Top Opportunities</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {batchResults
                        .sort((a, b) => b.overall_opportunity_score - a.overall_opportunity_score)
                        .slice(0, 10)
                        .map((result, index) => (
                          <div key={result.business_id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                              <h4 className="font-medium">{result.business_name}</h4>
                              <p className="text-sm text-slate-500">{result.location}</p>
                            </div>
                            <div className="text-right">
                              <div className="font-medium">${result.valuation.p50.toLocaleString()}</div>
                              <Badge variant={result.overall_opportunity_score > 80 ? "default" : "secondary"}>
                                {result.overall_opportunity_score}/100
                              </Badge>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card>
                <CardContent className="flex items-center justify-center h-64">
                  <p className="text-slate-500">No batch results yet. Upload a CSV to see batch results here.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
```

## 5. Environment Variables Template (.env.example)

```bash
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/okapiq_dev"
REDIS_URL="redis://localhost:6379"

# Server Configuration  
NODE_ENV="development"
PORT="3001"
FRONTEND_URL="http://localhost:3000"

# Security
JWT_SECRET="your-super-secure-jwt-secret-here"
ENCRYPTION_KEY="your-32-character-encryption-key-here"

# API Keys (Required - Get from respective providers)
YELP_API_KEY="your_yelp_fusion_api_key_here"
GOOGLE_MAPS_API_KEY="your_google_maps_api_key_here" 
CENSUS_API_KEY="your_us_census_api_key_here"
SERPAPI_API_KEY="your_serpapi_key_here"
DATA_AXLE_API_KEY="your_data_axle_api_key_here"
APIFY_API_TOKEN="your_apify_api_token_here"
ARCGIS_API_KEY="your_arcgis_api_key_here"
OPENAI_API_KEY="your_openai_api_key_here"

# Optional API Keys
GLENCOCO_API_KEY="your_glencoco_api_key_here"

# Rate Limiting
RATE_LIMIT_WINDOW_MS="900000"  # 15 minutes
RATE_LIMIT_MAX_REQUESTS="100"

# Batch Processing
MAX_BATCH_SIZE="100"
BATCH_TIMEOUT_MS="300000"  # 5 minutes

# Logging
LOG_LEVEL="info"
LOG_FILE_PATH="./logs/okapiq.log"

# External Services (Optional)
STRIPE_SECRET_KEY="your_stripe_secret_key_for_payments"
SENDGRID_API_KEY="your_sendgrid_key_for_emails"
```

These templates provide Cursor with concrete starting points and patterns to follow when building out the full Okapiq platform. Each template shows the expected structure, types, and implementation patterns.
