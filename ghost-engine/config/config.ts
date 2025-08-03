import { config } from 'dotenv';
config();

export interface ProxyConfig {
  provider: 'brightdata' | 'soax' | 'local' | 'tor';
  endpoints: string[];
  credentials?: {
    username: string;
    password: string;
  };
  rotationInterval: number; // minutes
  country?: string[];
  mobile?: boolean;
}

export interface ScraperConfig {
  name: string;
  url: string;
  syncInterval: 'daily' | 'weekly' | 'monthly';
  selectors: {
    container: string;
    title: string;
    price: string;
    location: string;
    industry?: string;
    description?: string;
    link: string;
  };
  pagination?: {
    selector: string;
    maxPages: number;
  };
  loginRequired?: boolean;
  captchaBypass?: boolean;
  customLogic?: string;
}

export interface GhostEngineConfig {
  proxies: ProxyConfig[];
  scrapers: ScraperConfig[];
  browser: {
    headless: boolean;
    maxConcurrent: number;
    timeout: number;
    retries: number;
    userAgentRotation: boolean;
    viewportSizes: Array<{ width: number; height: number }>;
  };
  database: {
    type: 'mongodb' | 'sqlite';
    connectionString: string;
  };
  enrichment: {
    enableLinkedIn: boolean;
    enableApollo: boolean;
    enableCrunchbase: boolean;
    apiKeys: {
      apollo?: string;
      crunchbase?: string;
    };
  };
  scheduling: {
    enableAutoSync: boolean;
    timezone: string;
    maxRetries: number;
  };
  logging: {
    level: 'debug' | 'info' | 'warn' | 'error';
    file: string;
  };
}

export const defaultConfig: GhostEngineConfig = {
  proxies: [
    {
      provider: 'local',
      endpoints: ['http://localhost:8080'],
      rotationInterval: 30,
    }
  ],
  scrapers: [
    {
      name: 'bizbuysell',
      url: 'https://www.bizbuysell.com',
      syncInterval: 'weekly',
      selectors: {
        container: '.listing-card, .business-listing',
        title: '.title, .business-title, h3 a',
        price: '.price, .asking-price',
        location: '.location, .business-location',
        industry: '.industry, .category',
        description: '.description, .business-description',
        link: 'a'
      },
      pagination: {
        selector: '.pagination a[rel="next"], .next-page',
        maxPages: 50
      },
      captchaBypass: true
    },
    {
      name: 'loopnet',
      url: 'https://www.loopnet.com',
      syncInterval: 'weekly',
      selectors: {
        container: '.property-card, .listing-item',
        title: '.property-title, .listing-title',
        price: '.price, .asking-price',
        location: '.address, .location',
        industry: '.property-type, .asset-type',
        link: 'a'
      },
      pagination: {
        selector: '.pagination-next, .next',
        maxPages: 30
      }
    },
    {
      name: 'flippa',
      url: 'https://flippa.com',
      syncInterval: 'daily',
      selectors: {
        container: '.listing-card, .auction-card',
        title: '.listing-title, .auction-title',
        price: '.current-bid, .buy-now-price',
        location: '.location',
        industry: '.category, .industry-tag',
        link: 'a'
      }
    }
  ],
  browser: {
    headless: true,
    maxConcurrent: 5,
    timeout: 30000,
    retries: 3,
    userAgentRotation: true,
    viewportSizes: [
      { width: 1920, height: 1080 },
      { width: 1366, height: 768 },
      { width: 375, height: 667 }, // Mobile
      { width: 414, height: 896 }  // Mobile
    ]
  },
  database: {
    type: 'sqlite',
    connectionString: process.env.DATABASE_URL || './ghost-engine.db'
  },
  enrichment: {
    enableLinkedIn: false,
    enableApollo: false,
    enableCrunchbase: false,
    apiKeys: {
      apollo: process.env.APOLLO_API_KEY,
      crunchbase: process.env.CRUNCHBASE_API_KEY
    }
  },
  scheduling: {
    enableAutoSync: true,
    timezone: 'UTC',
    maxRetries: 3
  },
  logging: {
    level: 'info',
    file: './logs/ghost-engine.log'
  }
};

export const getConfig = (): GhostEngineConfig => {
  // Override with environment variables or custom config
  return {
    ...defaultConfig,
    // Add any environment-specific overrides here
  };
};