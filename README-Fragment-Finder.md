# 🧠 Fragment Finder Agent (Rollup Opportunity Engine)

A sophisticated AI-powered system that analyzes market fragmentation, calculates HHI (Herfindahl-Hirschman Index), and identifies consolidation opportunities in local markets.

## 🎯 Overview

The Fragment Finder Agent helps investors and entrepreneurs identify promising rollup opportunities by:

- **Market Analysis**: Computes market concentration using HHI and other fragmentation metrics
- **Business Intelligence**: Scrapes and analyzes data from Yelp, Google My Business, and BBB
- **Chaos Detection**: Uses NLP and entropy measures to identify unpredictable market structures
- **Target Identification**: Ranks acquisition targets by exit risk, strategic value, and complexity
- **Financial Modeling**: Projects acquisition costs, synergies, and ROI for consolidation plays

## 🚀 Features

### Core Analytics Engine

- **HHI Calculation**: Measures market concentration (0-10000 scale)
- **Mom-and-Pop Density**: Identifies markets with high small business density
- **Entropy Metrics**: Detects market chaos and volatility patterns
- **Geographic Dispersion**: Analyzes spatial distribution of businesses
- **Temporal Instability**: Measures business age distribution volatility

### Chaos-Aware Design

- **NLP Review Analysis**: Identifies inconsistent pricing, service volatility, ownership changes
- **Sentiment Mismatch Detection**: Flags reviews where rating doesn't match sentiment
- **Seasonal Pattern Recognition**: Detects cyclical business patterns
- **Chaotic Actor Identification**: Finds businesses with unpredictable behavior

### Target Scoring System

- **Exit Risk Assessment**: Predicts likelihood of business sale based on owner age, performance
- **Strategic Value Calculation**: Measures acquisition attractiveness
- **Complexity Scoring**: Estimates acquisition difficulty and integration challenges
- **Financial Projections**: Calculates acquisition costs, synergies, and payback periods

## 📊 API Usage

### Basic Analysis

```typescript
import { FragmentFinderAgent } from './services/fragment-finder-agent';

const agent = new FragmentFinderAgent();

const analysis = await agent.analyzeFragmentation('90210', 'restaurants', {
  includeEntropy: true,
  maxBusinesses: 200,
  includeNLPAnalysis: true
});

console.log(`Consolidation Score: ${analysis.adjustedConsolidationScore}`);
console.log(`Top Target: ${analysis.topTargets[0].name}`);
```

### REST API Endpoint

```bash
POST /api/fragment-finder
Content-Type: application/json

{
  "zip": "90210",
  "industry": "restaurants",
  "options": {
    "includeEntropy": true,
    "maxBusinesses": 200,
    "includeNLPAnalysis": true
  }
}
```

### Response Format

```json
{
  "success": true,
  "data": {
    "zip": "90210",
    "industry": "restaurants",
    "hhi": 250,
    "adjustedConsolidationScore": 78.5,
    "topTargets": [...],
    "financialProjections": {
      "totalAcquisitionCost": 5200000,
      "projectedROI": 23.4,
      "estimatedPaybackPeriod": 3.2
    },
    "recommendations": [...]
  },
  "metadata": {
    "processingTime": 1847,
    "dataSourcesUsed": ["yelp", "google", "bbb"],
    "cacheUsed": false
  }
}
```

## 📈 Interpretation Guide

### Consolidation Scores

- **70+ (Excellent)**: Highly fragmented market with strong acquisition targets
- **50-69 (Good)**: Moderate fragmentation with viable consolidation opportunities  
- **30-49 (Moderate)**: Some consolidation potential but higher risk
- **<30 (Limited)**: Market may be too concentrated or volatile for rollups

### HHI Index Ranges

- **0-1500**: Highly competitive/fragmented market
- **1500-2500**: Moderately concentrated market
- **2500+**: Highly concentrated market

### Target Exit Risk Factors

- **Owner Age 65+**: High probability exit candidate (+40% risk score)
- **Business Age 20+**: Established but potentially ready for transition (+20%)
- **Low Performance**: Poor ratings/reviews indicate distress (+20%)
- **Small Size**: <5 employees increases exit likelihood (+10%)

## 🛠️ Installation & Setup

### Prerequisites

- Node.js 18+ with TypeScript support
- Next.js 15+ for the web interface
- Access to business directory APIs (optional for production data)

### Installation

```bash
# Clone and install dependencies
pnpm install

# Run the demo
npx ts-node examples/fragment-finder-demo.ts

# Start the web interface
pnpm dev
```

### Configuration

The system uses simulated data by default. For production deployment:

1. **Configure API Keys**: Add Yelp Fusion API, Google Places API keys
2. **Set Rate Limits**: Adjust scraping delays in scraper services  
3. **Database Setup**: Add persistence layer for caching and historical data
4. **Industry Configs**: Customize revenue multiples and volatility factors

## 📁 Architecture

```
services/
├── fragment-finder-agent.ts      # Main analysis engine
├── scrapers/
│   ├── yelp-scraper.ts           # Yelp business data extraction
│   ├── google-business-scraper.ts # Google My Business data
│   └── bbb-scraper.ts            # Better Business Bureau data
├── nlp/
│   └── review-analyzer.ts        # NLP chaos detection
└── analytics/
    └── market-entropy.ts         # Entropy and chaos calculations

types/
└── fragment-finder.ts            # TypeScript definitions

app/api/
└── fragment-finder/route.ts      # Next.js API endpoint

components/
└── fragment-finder-ui.tsx        # React UI component

examples/
└── fragment-finder-demo.ts       # Usage examples
```

## 🎛️ Configuration Options

### Analysis Options

```typescript
interface AnalysisOptions {
  includeEntropy?: boolean;        // Enable chaos/entropy analysis
  maxBusinesses?: number;          // Limit businesses analyzed (default: 500)
  includeNLPAnalysis?: boolean;    // Enable review NLP processing
  industrySpecificFactors?: boolean; // Apply industry adjustments
  geographicRadius?: number;       // Miles from ZIP center
}
```

### Industry Configurations

```typescript
const industryConfig = {
  restaurants: {
    revenueMultiples: { low: 0.8, average: 1.2, high: 2.0 },
    volatilityFactor: 1.3,  // High volatility industry
    seasonalityFactor: 0.8,
    consolidationDifficulty: 0.6
  },
  plumbing: {
    revenueMultiples: { low: 1.5, average: 2.5, high: 4.0 },
    volatilityFactor: 0.8,  // Stable industry
    seasonalityFactor: 0.3,
    consolidationDifficulty: 0.4  // Easier to consolidate
  }
};
```

## 📊 Example Output

### Beverly Hills Restaurant Market Analysis

```
📍 Analyzing: Beverly Hills Restaurant Market
   ZIP: 90210, Industry: restaurants

   ⏱️  Processing Time: 1,247ms
   📊 Businesses Analyzed: 47
   📈 Data Quality Score: 85.3%

   📋 MARKET METRICS:
   • Total Businesses: 47
   • Average Revenue: $1,247,832
   • Median Revenue: $890,000
   • Average Employees: 12.4
   • Top 5 Market Share: 32.1%

   🔍 FRAGMENTATION ANALYSIS:
   • HHI (Market Concentration): 245
   • Mom-and-Pop Density: 68.1%
   • Consolidation Score: 🟢 78.5 (Excellent)

   🎯 TOP CONSOLIDATION TARGETS:
   1. Luigi's Italian Kitchen
      • Exit Risk: 85.2% | Strategic Value: 72.1%
      • Est. Acquisition Cost: $1,890,000
      • Potential Synergies: $247,000

   💰 FINANCIAL PROJECTIONS:
   • Total Acquisition Cost: $12,350,000
   • Projected ROI: 24.7%
   • Payback Period: 3.1 years

   💡 RECOMMENDATIONS:
   🟢 Excellent consolidation opportunity - highly fragmented market
   🎯 High-probability exit candidates identified - prioritize outreach
```

## 🔬 Advanced Features

### Entropy Analysis

The system calculates multiple entropy metrics:

- **Market Entropy**: Shannon entropy of revenue distribution
- **Pricing Volatility**: Coefficient of variation in estimated revenues
- **Quality Variance**: Rating distribution variance
- **Geographic Dispersion**: Spatial clustering analysis
- **Temporal Instability**: Business age distribution chaos

### NLP Chaos Detection

Reviews are analyzed for chaos indicators:

- **Pricing Inconsistency**: "overcharged", "price changed", "hidden fees"
- **Service Volatility**: "inconsistent", "hit or miss", "depends on who"
- **Ownership Changes**: "new owner", "management change", "sold business"
- **Quality Fluctuations**: "not what it used to be", "gone downhill"

### Risk Adjustments

Consolidation scores are adjusted for:

- **Industry Volatility**: Restaurants (-5%), Professional services (+5%)
- **High Chaos Actors**: >30% chaotic businesses (-10% score)
- **Market Entropy**: >80% entropy reduces score by 15%
- **Political/Seasonal Risk**: Location and industry-specific factors

## 🚀 Deployment

### Production Considerations

1. **Rate Limiting**: Implement proper delays between API calls
2. **Data Privacy**: Ensure compliance with scraping ToS and data regulations
3. **Caching**: Add Redis/database layer for expensive calculations
4. **Monitoring**: Track API quotas, processing times, and error rates
5. **Scaling**: Consider queue-based processing for large batch analyses

### Environment Variables

```bash
YELP_API_KEY=your_yelp_fusion_api_key
GOOGLE_PLACES_API_KEY=your_google_places_api_key
BBB_API_KEY=your_bbb_api_key
REDIS_URL=redis://localhost:6379
DATABASE_URL=postgresql://...
```

## 🤝 Contributing

1. **Data Sources**: Add new business directory scrapers
2. **Industries**: Expand industry-specific analysis factors
3. **NLP Models**: Improve chaos detection algorithms
4. **UI/UX**: Enhance the React interface with new visualizations
5. **Analytics**: Add new market metrics and scoring algorithms

## 📄 License

MIT License - See LICENSE file for details.

---

**⚠️ Disclaimer**: This tool is for educational and research purposes. Always verify business data independently and comply with applicable terms of service when scraping public directories. Investment decisions should be made with proper due diligence.