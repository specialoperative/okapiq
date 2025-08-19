# 🏦 Okapiq - SMB Valuation Engine - Cursor Prompt

## Role
You are an expert full-stack AI engineer building a production-ready SMB valuation & opportunity analysis engine called "Okapiq" - the Bloomberg Terminal for Main Street businesses.

## Stack
- **Backend**: TypeScript + Express + Prisma + PostgreSQL
- **Frontend**: React + TypeScript + Tailwind CSS + shadcn/ui + Framer Motion
- **Queue/Batch**: BullMQ (Redis) for large batch processing
- **APIs**: Yelp, Google Places, Census/ArcGIS, SERPAPI, Data Axle, Apify, OpenAI
- **Export**: PDF/CSV generator endpoints
- **Security**: All API keys from environment variables (never hardcoded)

## Core Features Required

### 1. Advanced Valuation Engine
- **Inputs**: `BusinessInput` with 20+ fields (reviews, revenue estimates, demographics, digital presence, etc.)
- **Monte Carlo Simulation**: 1000+ iterations for probabilistic valuation
- **Ensemble Models**: Review-driven + Ads-driven + Foot-traffic models
- **Outputs**: P10/P50/P90 valuation ranges + confidence intervals
- **Diagnostics**: Detailed contribution breakdown of each factor

### 2. TAM/TSM Calculator
- **TAM**: Total Addressable Market by industry + geography
- **TSM**: Total Serviceable Market filtered by service area + buyer persona
- **Data Sources**: Census business counts + Data Axle + industry revenue averages
- **Geo Filtering**: Service radius calculations using Google Maps

### 3. Opportunity Scoring Modules
- **Fragmentation Calculator**: HHI index, market concentration analysis
- **Ad Arbitrage Calculator**: CAC, ROAS, marketing efficiency vs competitors
- **Succession Risk Calculator**: Owner age proxy via Census demographics by ZIP code
- **Digital Presence Score**: Website, SEO, social media, Google Business profile analysis
- **Combined Opportunity Score**: Weighted composite of all factors

### 4. API Endpoints
```typescript
POST /api/valuate          // Single business valuation
POST /api/valuate-batch    // Batch CSV processing
POST /api/valuate-smart    // Full API enrichment + valuation
POST /api/tam-tsm         // Market sizing only
POST /api/arbitrage       // Fragmentation + ad arbitrage
POST /api/export          // PDF/CSV report generation
GET  /api/priors          // Category-specific priors
GET  /api/health          // Health check
```

### 5. Frontend Dashboard
- **Input Forms**: Single business entry + batch CSV upload
- **Results Display**: Interactive charts, diagnostics breakdown, heatmaps
- **Export Features**: PDF reports, CSV downloads, IC memo generation
- **UI/UX**: Clean Tailwind design with shadcn components and smooth animations

## Repo Structure

```
okapiq/
├── backend/
│   ├── src/
│   │   ├── index.ts                    # Express app entry point
│   │   ├── app.ts                      # Express configuration
│   │   ├── config.ts                   # Environment variables
│   │   ├── routes/
│   │   │   ├── valuation.ts           # Valuation endpoints
│   │   │   ├── export.ts              # Export endpoints
│   │   │   └── health.ts              # Health check
│   │   ├── services/
│   │   │   ├── valuationEngine.ts     # Core Monte Carlo valuation
│   │   │   ├── tamTsmService.ts       # Market sizing calculations
│   │   │   ├── fragmentationService.ts # HHI + market concentration
│   │   │   ├── adArbitrageService.ts  # Marketing efficiency analysis
│   │   │   ├── successionService.ts   # Owner transition risk
│   │   │   ├── digitalPresenceService.ts # Digital maturity scoring
│   │   │   └── enrichment/
│   │   │       ├── yelpFetcher.ts     # Yelp Fusion API client
│   │   │       ├── googlePlacesFetcher.ts # Google Places API
│   │   │       ├── censusFetcher.ts   # US Census API
│   │   │       ├── serpFetcher.ts     # SERP API client
│   │   │       ├── arcgisFetcher.ts   # ArcGIS API
│   │   │       ├── dataAxleFetcher.ts # Data Axle API
│   │   │       ├── apifyFetcher.ts    # Apify API
│   │   │       └── openAIFetcher.ts   # OpenAI API
│   │   ├── utils/
│   │   │   ├── csvProcessor.ts        # CSV parsing and validation
│   │   │   ├── pdfExporter.ts         # PDF report generation
│   │   │   ├── csvExporter.ts         # CSV export utilities
│   │   │   ├── logger.ts              # Winston logging
│   │   │   └── cache.ts               # Redis caching layer
│   │   ├── types/
│   │   │   ├── business.ts            # Business input/output types
│   │   │   ├── valuation.ts           # Valuation result types
│   │   │   ├── diagnostics.ts         # Diagnostic breakdown types
│   │   │   └── api.ts                 # API response types
│   │   ├── prisma/
│   │   │   ├── schema.prisma          # Database schema
│   │   │   └── migrations/            # Database migrations
│   │   └── jobs/
│   │       └── batchProcessor.ts      # Background job processing
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── App.tsx                    # Main application component
│   │   ├── main.tsx                   # React entry point
│   │   ├── components/
│   │   │   ├── ui/                    # shadcn/ui components
│   │   │   ├── forms/
│   │   │   │   ├── BusinessForm.tsx   # Single business input form
│   │   │   │   └── BatchUpload.tsx    # CSV batch upload
│   │   │   ├── results/
│   │   │   │   ├── ValuationResults.tsx # Valuation display
│   │   │   │   ├── DiagnosticsChart.tsx # Factor breakdown charts
│   │   │   │   ├── TAMTSMDisplay.tsx   # Market sizing visuals
│   │   │   │   └── OpportunityScore.tsx # Opportunity metrics
│   │   │   ├── export/
│   │   │   │   └── ExportButtons.tsx   # PDF/CSV export controls
│   │   │   └── layout/
│   │   │       ├── Header.tsx          # Navigation header
│   │   │       ├── Sidebar.tsx         # Dashboard sidebar
│   │   │       └── Footer.tsx          # Footer component
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx           # Main dashboard page
│   │   │   ├── BatchResults.tsx        # Batch processing results
│   │   │   └── Reports.tsx             # Generated reports view
│   │   ├── hooks/
│   │   │   ├── useValuation.ts         # Valuation API hook
│   │   │   └── useBatchProcessing.ts   # Batch processing hook
│   │   ├── utils/
│   │   │   ├── api.ts                  # Axios API client
│   │   │   ├── formatting.ts           # Number/currency formatting
│   │   │   └── validation.ts           # Form validation
│   │   ├── styles/
│   │   │   └── globals.css             # Global styles
│   │   └── types/
│   │       └── index.ts                # Frontend type definitions
│   ├── package.json
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── shared/
│   └── types/                          # Shared TypeScript types
│
├── docs/
│   ├── API.md                          # API documentation
│   ├── DEPLOYMENT.md                   # Deployment guide
│   └── EXAMPLES.md                     # Usage examples
│
├── README.md
├── docker-compose.yml                  # Development environment
├── .env.example                        # Environment variables template
├── .gitignore
└── package.json                        # Root package.json for workspace
```

## Key Implementation Details

### 1. Business Input Type
```typescript
interface BusinessInput {
  // Basic Info
  business_id: string;
  name: string;
  category: string;
  geo: string;
  
  // Review Signals
  R_total: number;              // Total reviews
  R_12: number;                 // Reviews last 12 months
  stars: number;                // Average rating
  rating_volatility: number;    // Rating consistency
  
  // Market Signals
  population: number;
  median_income: number;
  competitors_density: number;
  keyword_volume: number;
  
  // Operational Signals
  years_in_business: number;
  employees: number;
  capacity_constraint: number;
  seasonality_index: number;
  
  // Digital Presence
  website_quality: number;
  social_presence: number;
  google_business_claimed: boolean;
  seo_score: number;
  
  // Financial Proxies
  avg_ticket_size: number;
  ads_data: AdData[];
}
```

### 2. Valuation Result Type
```typescript
interface ValuationResult {
  business_id: string;
  business_name: string;
  category: string;
  location: string;
  
  // Core Valuation
  valuation: {
    p10: number;
    p25: number;
    p50: number;
    p75: number;
    p90: number;
    mean: number;
    confidence_score: number;
  };
  
  // Revenue Analysis
  revenue_estimate: {
    p10: number;
    p50: number;
    p90: number;
    annual_customers: number;
  };
  
  // Market Analysis
  tam_tsm: {
    tam: number;
    tsm: number;
    market_share_potential: number;
    fragmentation_score: number;
  };
  
  // Opportunity Scores
  succession_risk: number;
  digital_presence_risk: number;
  ad_arbitrage_score: number;
  overall_opportunity_score: number;
  
  // Diagnostics
  diagnostics: Record<string, number>;
  key_insights: string[];
  risk_flags: string[];
  
  timestamp: string;
}
```

### 3. API Integration Stubs
Each API fetcher should follow this pattern:

```typescript
// Example: yelpFetcher.ts
export class YelpFetcher {
  private apiKey: string;
  
  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }
  
  async searchBusiness(name: string, location: string): Promise<YelpBusiness | null> {
    // TODO: Implement Yelp Fusion API call
    // GET https://api.yelp.com/v3/businesses/search
    // Headers: Authorization: Bearer ${apiKey}
    // Params: term, location, limit
    
    return {
      id: 'placeholder',
      name,
      rating: 4.0,
      review_count: 100,
      categories: [],
      location: { address1: '', city: '', state: '', zip_code: '' }
    };
  }
}
```

### 4. Database Schema (Prisma)
```prisma
// prisma/schema.prisma
model Business {
  id                String   @id @default(cuid())
  name              String
  category          String
  location          String
  
  // Cached API data
  yelpData          Json?
  censusData        Json?
  googlePlacesData  Json?
  
  // Valuation results
  valuations        ValuationResult[]
  
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
}

model ValuationResult {
  id           String   @id @default(cuid())
  businessId   String
  business     Business @relation(fields: [businessId], references: [id])
  
  valuation    Json     // Store full valuation result
  confidence   Float
  
  createdAt    DateTime @default(now())
}

model APICache {
  id         String   @id @default(cuid())
  cacheKey   String   @unique
  data       Json
  expiresAt  DateTime
  createdAt  DateTime @default(now())
}
```

## Specific Requirements

### 1. Security
- ✅ Never hardcode API keys - use process.env
- ✅ Validate all inputs with Zod schemas
- ✅ Rate limiting on all endpoints
- ✅ Error handling with proper HTTP status codes
- ✅ Logging for debugging and monitoring

### 2. Performance
- ✅ Redis caching for API responses
- ✅ Parallel API calls where possible
- ✅ Background job processing for batch operations
- ✅ Database query optimization
- ✅ Frontend lazy loading and code splitting

### 3. User Experience
- ✅ Loading states for all async operations
- ✅ Error handling with user-friendly messages
- ✅ Progress indicators for batch processing
- ✅ Responsive design for mobile/tablet
- ✅ Smooth animations and transitions

### 4. Testing
- ✅ Unit tests for all calculator functions
- ✅ Integration tests for API endpoints
- ✅ Frontend component tests
- ✅ Mock external API calls in tests

## Environment Variables Required

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/okapiq"
REDIS_URL="redis://localhost:6379"

# API Keys (all required)
YELP_API_KEY="your_yelp_api_key"
GOOGLE_MAPS_API_KEY="your_google_maps_api_key"
CENSUS_API_KEY="your_census_api_key"
SERPAPI_API_KEY="your_serpapi_key"
DATA_AXLE_API_KEY="your_data_axle_key"
APIFY_API_TOKEN="your_apify_token"
ARCGIS_API_KEY="your_arcgis_key"
OPENAI_API_KEY="your_openai_key"

# Application
NODE_ENV="development"
PORT="3001"
FRONTEND_URL="http://localhost:3000"

# Security
JWT_SECRET="your_jwt_secret"
ENCRYPTION_KEY="your_encryption_key"
```

## Deliverables Expected

1. **Complete Backend**: All services, routes, and utilities implemented
2. **Complete Frontend**: Dashboard with all components and pages
3. **Database Setup**: Prisma schema with migrations
4. **API Integration**: Real API calls (with placeholder keys)
5. **Documentation**: README with setup instructions
6. **Testing**: Basic test suite for core functions
7. **Docker Setup**: docker-compose for development environment

## Success Criteria

The finished product should allow a user to:
1. Input a business name and location
2. Get a comprehensive valuation with P10/P50/P90 ranges
3. See TAM/TSM market sizing
4. View opportunity scores (succession risk, digital presence, etc.)
5. Export results as PDF or CSV
6. Process multiple businesses via CSV upload
7. View detailed diagnostics showing how each factor contributed

Build this as production-ready code with proper error handling, logging, and security practices. Focus on clean, maintainable code with good separation of concerns.
