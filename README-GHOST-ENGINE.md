# 🧱 Ghost Engine System - Business Listings Scraper Network

A comprehensive, decentralized scraping system that bypasses rate limits, fakes real human usage, and aggregates business listings from 100+ fragmented sources with normalized API-style output.

## 🔥 Features

### Core Capabilities
- **🤖 AI-Guided Scraping**: GPT-guided link & DOM parsing with intelligent pattern recognition
- **🕴️ Human Behavior Mimicry**: Realistic scrolling, clicking, and browsing patterns
- **🔄 Rotating Proxies**: Residential + mobile IPs with automatic rotation
- **🛡️ Anti-Detection**: Advanced fingerprint spoofing and captcha bypass
- **📊 Data Normalization**: Unified schema across all sources
- **🚀 Auto-Enrichment**: LinkedIn, Apollo.io, and Crunchbase integration
- **⏰ Smart Scheduling**: Different sync intervals per platform
- **🌐 REST API**: Full API access to scraped and enriched data

### Supported Platforms
- **BizBuySell**: Business-for-sale listings with financial data
- **LoopNet**: Commercial real estate and asset listings  
- **Flippa**: Digital asset marketplace
- **Facebook Business Pages** (planned)
- **Nextdoor Business** (planned)
- **100+ Broker Sites** (extensible)

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Ghost Engine  │    │  Proxy Manager  │    │ Enrichment Agent│
│                 │    │                 │    │                 │
│ • Puppeteer     │◄──►│ • Rotation      │    │ • Apollo.io     │
│ • Stealth Mode  │    │ • Mobile IPs    │    │ • Crunchbase    │
│ • AI Guidance   │    │ • Tor Support   │    │ • LinkedIn      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ Data Normalizer │    │ Sync Scheduler  │    │ Database Manager│
│                 │    │                 │    │                 │
│ • Unified Schema│    │ • Cron Jobs     │    │ • SQLite/Mongo  │
│ • Deduplication │    │ • Retry Logic   │    │ • Optimization  │
│ • Confidence    │    │ • Health Checks │    │ • Analytics     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 ▼
                    ┌─────────────────┐
                    │   REST API      │
                    │                 │
                    │ • Filtering     │
                    │ • Pagination    │
                    │ • Statistics    │
                    │ • Real-time     │
                    └─────────────────┘
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm/pnpm
- Chrome/Chromium (for Puppeteer)
- Optional: Proxy service (BrightData, SOAX, etc.)

### Installation

```bash
# Clone and install dependencies
git clone <your-repo>
cd ghost-engine-scraper
npm install

# Copy environment configuration
cp .env.example .env

# Edit configuration (optional)
nano .env
```

### Basic Usage

```bash
# Start the Ghost Engine system
npm run scraper:dev

# Or with specific commands
npm run scraper:dev start           # Start full system + API
npm run scraper:dev test bizbuysell  # Test BizBuySell scraper
npm run scraper:dev sync all         # Run all scrapers once
npm run scraper:dev health           # System health check
```

### API Access

Once running, access the system via:
- **Health Check**: http://localhost:3001/health
- **API Docs**: http://localhost:3001/api/scrapers
- **Listings**: http://localhost:3001/api/listings

## 📖 API Documentation

### Core Endpoints

#### Get Listings
```http
GET /api/listings?source=bizbuysell&industry=technology&limit=50
```

**Query Parameters:**
- `source`: Filter by scraper source (bizbuysell, loopnet, flippa)
- `industry`: Filter by industry category
- `location`: Filter by location (partial match)
- `minPrice` / `maxPrice`: Price range filtering
- `dateFrom` / `dateTo`: Date range filtering
- `limit` / `offset`: Pagination

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-here",
      "source": "bizbuysell",
      "name": "Tech Startup SaaS Business",
      "industry": "Technology",
      "location": "San Francisco, CA",
      "price": 500000,
      "revenue": 250000,
      "description": "Profitable SaaS platform...",
      "contactLink": "https://bizbuysell.com/listing/...",
      "tags": ["saas", "technology", "profitable"],
      "enrichment": {
        "owner": {
          "email": "founder@company.com",
          "linkedinProfile": "https://linkedin.com/in/founder",
          "title": "CEO & Founder"
        },
        "companyInfo": {
          "employees": 15,
          "founded": 2019,
          "funding": "$1,200,000"
        }
      }
    }
  ],
  "count": 1
}
```

#### Trigger Sync
```http
POST /api/sync/run/bizbuysell
```

#### Get Statistics
```http
GET /api/stats
```

#### Test Scraper
```http
POST /api/test/bizbuysell
Content-Type: application/json

{
  "location": "New York",
  "industry": "restaurants",
  "priceMin": 100000
}
```

## ⚙️ Configuration

### Environment Variables (.env)
```bash
# Database
DATABASE_URL=sqlite:./ghost-engine.db

# Enrichment APIs (Optional)
APOLLO_API_KEY=your_apollo_key
CRUNCHBASE_API_KEY=your_crunchbase_key

# Proxy Settings (Optional)
PROXY_PROVIDER=brightdata
PROXY_ENDPOINTS=http://proxy1.com:8000,http://proxy2.com:8000
PROXY_USERNAME=your_username
PROXY_PASSWORD=your_password

# System Settings
PORT=3001
LOG_LEVEL=info
HEADLESS=true
MAX_CONCURRENT=5
```

### Advanced Configuration

Edit `ghost-engine/config/config.ts` for advanced settings:

```typescript
export const customConfig: GhostEngineConfig = {
  browser: {
    headless: true,
    maxConcurrent: 3,
    timeout: 45000,
    retries: 5
  },
  proxies: [
    {
      provider: 'brightdata',
      endpoints: ['http://proxy.brightdata.com:22225'],
      credentials: {
        username: 'your-username',
        password: 'your-password'
      },
      rotationInterval: 15,
      country: ['US', 'CA'],
      mobile: true
    }
  ],
  scrapers: [
    {
      name: 'bizbuysell',
      syncInterval: 'weekly',
      pagination: { maxPages: 25 },
      captchaBypass: true
    }
  ]
};
```

## 🔧 Advanced Usage

### Custom Scrapers

Create custom scrapers by extending the base scraper:

```typescript
// ghost-engine/scrapers/custom-scraper.ts
import { Page } from 'puppeteer';
import { ScraperLogger } from '../utils/logger';

export class CustomScraper {
  async scrape(page: Page, searchParams?: any): Promise<any[]> {
    await page.goto('https://example.com');
    
    // Your scraping logic here
    const listings = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('.listing'))
        .map(el => ({
          title: el.querySelector('.title')?.textContent,
          price: el.querySelector('.price')?.textContent,
          location: el.querySelector('.location')?.textContent
        }));
    });
    
    return listings;
  }
}
```

### Proxy Integration

#### BrightData Setup
```typescript
const brightDataConfig = {
  provider: 'brightdata',
  endpoints: ['http://brd-customer-USERNAME-zone-datacenter_proxy1:PASSWORD@zproxy.lum-superproxy.io:22225'],
  rotationInterval: 10,
  country: ['US'],
  mobile: true
};
```

#### SOAX Setup
```typescript
const soaxConfig = {
  provider: 'soax',
  endpoints: ['http://USERNAME:PASSWORD@residential.soax.com:9999'],
  rotationInterval: 20
};
```

### Enrichment Setup

#### Apollo.io Integration
```bash
# Get API key from apollo.io
APOLLO_API_KEY=your_apollo_api_key
```

#### Crunchbase Integration  
```bash
# Get API key from crunchbase.com
CRUNCHBASE_API_KEY=your_crunchbase_api_key
```

## 📊 Monitoring & Analytics

### Health Monitoring
```bash
# System health check
curl http://localhost:3001/health

# Sync status
curl http://localhost:3001/api/sync/status

# Performance stats
curl http://localhost:3001/api/sync/stats
```

### Database Analytics
```bash
# Listing statistics
curl http://localhost:3001/api/stats

# Sync results
curl http://localhost:3001/api/sync/results
```

### Logs
```bash
# View logs
tail -f logs/ghost-engine.log

# Error logs only
tail -f logs/error.log
```

## 🛡️ Anti-Detection Features

### Browser Fingerprinting
- Random viewport sizes (desktop/mobile)
- Rotating user agents
- Canvas fingerprint spoofing
- WebGL parameter randomization
- Timezone and language spoofing

### Behavioral Patterns
- Human-like scrolling patterns
- Random delays between actions
- Mouse movement simulation
- Reading pause simulation
- Natural navigation flows

### Rate Limit Evasion
- Proxy rotation (residential IPs)
- Request spacing and jitter
- Session management
- Captcha detection and retry
- Automatic backoff on blocks

## 🚨 Compliance & Ethics

### Best Practices
- Respect robots.txt when possible
- Implement reasonable delays
- Don't overwhelm target servers
- Use data responsibly
- Comply with local laws

### Rate Limiting
```typescript
// Built-in rate limiting
const rateLimits = {
  bizbuysell: { requestsPerMinute: 10 },
  loopnet: { requestsPerMinute: 8 },
  flippa: { requestsPerMinute: 15 }
};
```

## 🔍 Troubleshooting

### Common Issues

#### Scraper Fails to Find Listings
```bash
# Test individual scraper
npm run scraper:dev test bizbuysell

# Check logs
tail -f logs/ghost-engine.log | grep ERROR
```

#### Database Connection Issues
```bash
# Check database health
npm run scraper:dev health

# Reset database
rm ghost-engine.db
npm run scraper:dev start
```

#### Proxy Issues
```bash
# Test without proxy
PROXY_PROVIDER=local npm run scraper:dev test bizbuysell

# Check proxy connectivity
curl --proxy http://your-proxy:port http://httpbin.org/ip
```

### Performance Optimization

#### Browser Performance
```typescript
// Reduce resource loading
const optimizedConfig = {
  browser: {
    args: [
      '--disable-images',
      '--disable-javascript',
      '--disable-plugins'
    ]
  }
};
```

#### Database Performance
```sql
-- Optimize SQLite
PRAGMA journal_mode = WAL;
PRAGMA synchronous = NORMAL;
PRAGMA cache_size = 1000000;
```

## 📈 Scaling

### Horizontal Scaling
- Run multiple Ghost Engine instances
- Use external database (MongoDB)
- Load balance API requests
- Distribute scrapers across instances

### Vertical Scaling
- Increase `maxConcurrent` browsers
- Add more proxy endpoints
- Optimize selectors and waits
- Use SSD for database

## 🤝 Contributing

### Adding New Scrapers
1. Create scraper in `ghost-engine/scrapers/`
2. Add configuration to `config.ts`
3. Test thoroughly
4. Submit pull request

### Reporting Issues
- Include logs and error messages
- Specify target website and parameters
- Provide system information

## 📄 License

This project is for educational and research purposes. Ensure compliance with target websites' terms of service and local laws.

## 🆘 Support

- **Documentation**: See `/docs` folder
- **Issues**: GitHub Issues
- **Discussions**: GitHub Discussions

---

**⚠️ Disclaimer**: This tool is provided for educational purposes. Users are responsible for complying with website terms of service and applicable laws. Use responsibly and ethically.