# Avilla Peak Partners - Custom Sourcing System
## Accounting Firms in Massachusetts & Florida

### 🎯 Target Profile
- **Industry**: Accounting, bookkeeping, tax prep, payroll services (NAICS 5412 + sub-codes)
- **Geography**: Massachusetts + Florida (priority markets)
- **Financials**: $300K+ EBITDA, $1.5M+ revenue, 2.5-4.0x EBITDA multiples
- **Deal Size**: $750K - $7M purchase price
- **Operations**: Recurring revenue, low customer concentration, owner-transitionable

### 📊 Correlative Factors & Data Sources

#### 1. Geographic & Demographic Factors
- **Zip Code Wealth Index** (0-100 scale)
  - Source: Census API - Median household income, property values
  - Formula: `(Median_HH_Income / State_Median) * (Property_Values / State_Avg) * 50`
  
- **Business Formation Rate** (per 1,000 adults)
  - Source: Census API + State Secretary of State filings
  - Indicates growing demand for accounting services
  
- **Age Distribution** 
  - Source: Census API - Age demographics
  - Older populations = higher estate planning, succession needs

#### 2. Succession & Owner Risk Factors
- **Owner Age Estimates**
  - Sources: Data Axle API + LinkedIn scraping (Apify)
  - Succession Risk Score: `(Owner_Age - 45) * Years_in_Business / 10`
  
- **Years in Business**
  - Source: Data Axle API, Yelp API establishment dates
  - Firms >20 years = higher succession probability

#### 3. Digital Maturity & Market Presence
- **Website Presence** (Binary + Quality Score)
  - Sources: Google Maps API, Yelp API
  - Website age via SERP API WHOIS lookups
  - Tech stack analysis via Apify crawling
  
- **Review Metrics**
  - Sources: Yelp API, Google Maps Places API
  - Review count, average rating, review velocity
  - Sentiment analysis via OpenAI API for succession signals

#### 4. Market Structure & Competition
- **Fragmentation Index** (HHI - Herfindahl-Hirschman Index)
  - Formula: `1 - Σ(Market_Share²)` per zip code
  - Lower HHI = more fragmented = better roll-up opportunity
  
- **Competitor Density**
  - Sources: Data Axle, Yelp, Google Maps
  - Firms per 1,000 businesses in zip code

#### 5. Economic Activity Indicators
- **Payment Volume Index** (0-100 scale)
  - Sources: Mastercard Locations API (2 keys available)
  - Merchant spending volume by NAICS code
  
- **Client Base Strength Proxy**
  - Small business density in zip (Census API)
  - Professional services concentration

### 🗺️ TAM Analysis

#### Market Sizing
- **Massachusetts**: ~11,000 accounting firms
  - Average revenue: $2.1M
  - Target pool (EBITDA $300K-$2M): ~1,320 firms
  - Addressable market value: ~$3.7B

- **Florida**: ~26,000 accounting firms  
  - Average revenue: $1.8M
  - Target pool (EBITDA $300K-$2M): ~3,120 firms
  - Addressable market value: ~$8.4B

#### Sub-Industry Breakdown
1. **CPA Firms** (35% of market)
   - Full-service accounting, auditing, tax
   - Higher multiples (3.5-4.0x EBITDA)

2. **Tax Preparation** (25% of market)
   - Seasonal revenue, lower multiples (2.5-3.0x)
   - High fragmentation opportunity

3. **Bookkeeping Services** (20% of market)
   - Recurring revenue, stable cash flow
   - Strong roll-up candidates

4. **Payroll Services** (12% of market)
   - Technology-enabled, higher growth
   - Platform expansion opportunities

5. **Forensic/Specialty** (8% of market)
   - Niche expertise, premium pricing
   - Strategic bolt-on acquisitions

### 🔧 API Integration Mapping

#### Primary Data Sources
```json
{
  "data_collection": {
    "firm_listings": ["DATA_AXLE_API", "YELP_API"],
    "financial_data": ["DATA_AXLE_API"],
    "demographics": ["CENSUS_API"],
    "reviews": ["YELP_API", "GOOGLE_MAPS_API"],
    "geographic": ["ARCGIS_API"],
    "payment_data": ["MASTERCARD_API"],
    "enrichment": ["SERP_API", "APIFY_API"],
    "ai_analysis": ["OPENAI_API"]
  },
  "api_keys": {
    "primary_keys": "Production environment",
    "backup_keys": "Failover for rate limiting"
  }
}
```

#### Data Flow Architecture
1. **Initial Pull**: Data Axle → Firm listings with NAICS 5412
2. **Geographic Enrichment**: Census API → Demographics by zip code
3. **Digital Presence**: Yelp + Google Maps → Reviews, websites, photos
4. **Owner Intelligence**: Apify → LinkedIn scraping for owner data
5. **Market Analysis**: ArcGIS → Heatmap visualization
6. **AI Insights**: OpenAI → Sentiment analysis, recommendations

### 🖥️ Frontend System Specifications

#### Dashboard Overview
```typescript
interface AvillaDashboard {
  mapView: {
    heatmapLayers: ['deal_score', 'wealth_index', 'formation_rate', 'succession_risk'];
    zipPolygons: ZipData[];
    firmPins: FirmMarker[];
  };
  tableView: {
    columns: ['firm_name', 'website_status', 'reviews', 'owner_signal', 'revenue_est', 'zip_wealth', 'deal_score'];
    sorting: 'real_time';
    filtering: 'dynamic';
  };
}
```

#### Search & Filter Controls

##### 1. Global Search Bar
- **Keyword Search**: Firm name, owner name, domain
- **Fuzzy Matching**: Handle typos, partial matches
- **Auto-complete**: Based on existing firm database

##### 2. Advanced Filters
```typescript
interface FilterControls {
  industry: {
    type: 'multi-select';
    options: ['CPA Firms', 'Tax Prep', 'Bookkeeping', 'Payroll', 'Forensic'];
  };
  revenue_range: {
    type: 'dual-slider';
    min: 500000;
    max: 10000000;
  };
  zip_wealth: {
    type: 'slider';
    scale: '0-100';
    labels: ['Low', 'Medium', 'High'];
  };
  website_presence: {
    type: 'toggle';
    options: ['Has Website', 'No Website', 'Outdated Website'];
  };
  review_metrics: {
    count_range: 'slider';
    rating_threshold: 'slider';
    sentiment_filter: ['Positive', 'Neutral', 'Negative'];
  };
  succession_risk: {
    type: 'multi-select';
    options: ['Low (<45)', 'Medium (45-60)', 'High (60+)'];
  };
  formation_rate: {
    type: 'slider';
    label: 'New businesses per 1K adults';
  };
}
```

#### 3. AI-Powered Features

##### OpenAI Search & Insights
```typescript
interface AIFeatures {
  natural_language_search: {
    input: "Find tax firms in wealthy Florida zip codes with retiring owners";
    processing: "OpenAI API converts to structured filters";
    output: "Filtered results with AI explanation";
  };
  
  fragmentation_analysis: {
    trigger: "Analyze fragmentation in Boston metro";
    data_sources: ["firm_density", "hhi_index", "top5_concentration"];
    output: "Roll-up opportunity assessment with reasoning";
  };
  
  deal_insights: {
    firm_analysis: "AI-generated summary of firm strengths/risks";
    market_context: "Competitive landscape analysis";
    outreach_suggestions: "Personalized email templates";
  };
}
```

##### Fragmentation Analysis Tools
```typescript
interface FragmentationAnalysis {
  hhi_calculation: {
    formula: "1 - Σ(market_share²)";
    interpretation: {
      "0.0-0.15": "Highly concentrated",
      "0.15-0.25": "Moderately concentrated", 
      "0.25+": "Fragmented - roll-up opportunity"
    };
  };
  
  market_share_analysis: {
    top_5_firms: "Market share of largest 5 firms";
    long_tail: "Number of firms with <1% market share";
    opportunity_score: "Weighted fragmentation opportunity";
  };
}
```

#### 4. Deal Pipeline Management

##### Firm Profile Deep-Dive
```typescript
interface FirmProfile {
  overview: {
    name: string;
    location: string;
    subindustry: string;
    years_established: number;
  };
  
  financial_signals: {
    estimated_revenue: number;
    ebitda_proxy: number;
    multiple_band: string;
    payment_volume_trend: 'increasing' | 'stable' | 'declining';
  };
  
  digital_footprint: {
    website_status: 'modern' | 'outdated' | 'none';
    tech_stack: string[];
    review_summary: {
      total_reviews: number;
      avg_rating: number;
      sentiment_score: number;
      recent_trends: string;
    };
  };
  
  owner_intelligence: {
    estimated_age: number;
    linkedin_activity: 'active' | 'inactive';
    succession_signals: string[];
    contact_info: {
      phone: string;
      email: string;
      linkedin: string;
    };
  };
  
  deal_scoring: {
    overall_score: number; // 0-100
    component_scores: {
      financial_strength: number;
      succession_opportunity: number;
      market_position: number;
      operational_risk: number;
    };
  };
}
```

### 📈 Scoring Algorithms

#### Composite Deal Score Formula
```typescript
function calculateDealScore(firm: FirmData): number {
  const weights = {
    financial: 0.35,
    succession: 0.25, 
    market: 0.20,
    digital: 0.20
  };
  
  const scores = {
    financial: (firm.revenue_stability * 0.4 + firm.margin_proxy * 0.6) * 100,
    succession: firm.succession_risk_score,
    market: (firm.zip_wealth_index * 0.6 + firm.formation_rate_score * 0.4),
    digital: (firm.website_score * 0.5 + firm.review_score * 0.5)
  };
  
  return Math.round(
    weights.financial * scores.financial +
    weights.succession * scores.succession +
    weights.market * scores.market +
    weights.digital * scores.digital
  );
}
```

#### Succession Risk Scoring
```typescript
function calculateSuccessionRisk(firm: FirmData): number {
  let risk_score = 0;
  
  // Age factor
  if (firm.owner_age > 65) risk_score += 40;
  else if (firm.owner_age > 60) risk_score += 30;
  else if (firm.owner_age > 55) risk_score += 20;
  
  // Business age factor
  if (firm.years_established > 25) risk_score += 20;
  else if (firm.years_established > 15) risk_score += 15;
  
  // Digital inactivity
  if (!firm.has_website) risk_score += 15;
  if (firm.last_review_date < '2022-01-01') risk_score += 10;
  
  // LinkedIn signals
  if (firm.owner_linkedin_mentions_retirement) risk_score += 15;
  
  return Math.min(risk_score, 100);
}
```

### 🎯 User Workflows

#### 1. Market Discovery Workflow
1. User opens Avilla dashboard
2. Map auto-loads with MA + FL accounting firms
3. Apply filters: "Revenue $1-3M, High succession risk, Wealthy zip codes"
4. Heatmap updates showing hotspots
5. AI insight panel suggests: "Palm Beach County shows 47 high-scoring targets"
6. User clicks region → drill down to firm list

#### 2. Deal Sourcing Workflow  
1. User searches: "CPA firms Boston no website"
2. Results show 23 firms
3. Sort by deal score (highest first)
4. Click top firm → full profile opens
5. AI generates outreach email with local context
6. User saves to pipeline, assigns "Source" stage

#### 3. Market Analysis Workflow
1. User clicks "Fragmentation Analysis"
2. Select metro area: "Greater Boston"
3. AI analyzes: HHI = 0.31 (fragmented), top-5 share = 12%
4. Recommendation: "Strong roll-up opportunity, target 8-12 firms"
5. Export target list with contact details

### 📊 Sample Data Structure

```json
{
  "zip_code": "02139",
  "city": "Cambridge",
  "state": "MA", 
  "metro": "Boston",
  "firms_count": 47,
  "avg_revenue_millions": 2.3,
  "wealth_index": 89,
  "formation_rate_per_1k": 14.2,
  "succession_risk_pct": 34,
  "avg_rating": 4.1,
  "has_website_pct": 78,
  "spend_volume_index": 82,
  "deal_score": 87,
  "hhi_index": 0.28,
  "top_firms": [
    {
      "name": "Cambridge Tax Associates",
      "revenue_est": 1800000,
      "owner_age_est": 58,
      "website": false,
      "reviews": 12,
      "succession_risk": 72,
      "deal_score": 84
    }
  ]
}
```

This system provides Avilla Partners with a comprehensive, data-driven approach to sourcing accounting firm acquisitions, combining multiple data sources with AI-powered insights for maximum deal flow efficiency.
