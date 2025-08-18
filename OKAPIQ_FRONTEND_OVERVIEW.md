# Okapiq Frontend - Comprehensive Overview for Cursor

## 🚀 Project Overview
**Okapiq** is a sophisticated AI-powered SMB intelligence platform positioned as "Bloomberg for Small Businesses". The frontend is built with React + TypeScript + Framer Motion, featuring a custom design system inspired by premium SaaS platforms like Stripe, Linear, and Apollo.

## 🎯 Core Value Proposition
- **Market Intelligence**: Real-time SMB deal sourcing with succession risk analysis
- **Multi-API Integration**: Combines Yelp, Google Maps, Census, DataAxle, OpenAI, and Mastercard APIs
- **Client-Specific Dashboards**: Custom solutions for PE funds and investment firms
- **CRM Integration**: Direct export to HubSpot, Salesforce, Pipedrive

## 🏗️ Technical Architecture

### **Frontend Stack**
- **React 18** with TypeScript for type safety
- **Tailwind CSS v4** with custom design system
- **Framer Motion** for sophisticated animations
- **Lucide React** for consistent iconography
- **Chart.js** for data visualizations

### **Design System**
- **Okapi Color Palette**: Rich browns (#8B4513, #A0522D, #D2691E) with electric green accents (#00FF88)
- **Glass Morphism**: Backdrop blur effects and translucent elements
- **Jaguar Print Backgrounds**: Animated fur patterns with flag-like movement
- **Typography**: Inter font family with unified hierarchy

### **Animation System**
- **Pally/Origami-Inspired**: Smooth cubic-bezier transitions (0.16, 1, 0.3, 1)
- **Performance Optimized**: GPU-accelerated transforms with will-change properties
- **Reduced Motion Support**: Accessibility-compliant animation system

## 📊 Core Products & Features

### **1. Oppy (Opportunity Finder) - $79/month**
- **Market Discovery**: TAM/SAM analysis with demographic overlays
- **Trend Detection**: Business formation rates and market growth signals
- **Geographic Intelligence**: ZIP-code level opportunity mapping

### **2. Fragment Finder - $897/month**
- **HHI Analysis**: Market fragmentation scoring (Herfindahl-Hirschman Index)
- **Roll-up Targeting**: Consolidation opportunity identification
- **Synergy Calculation**: Cross-platform integration scoring

### **3. Acquisition Assistant - $5,900/month**
- **Deal Pipeline**: Kanban-style deal management with stage tracking
- **AI-Generated CIMs**: Automated document creation with professional templates
- **IRR Projections**: Real-time financial modeling with scenario analysis
- **Mini LBO Engine**: Purchase price optimization and debt structure analysis

## 🎯 Client-Specific Dashboards

### **Avila Peak Partners Dashboard**
- **Target Market**: Florida accounting firms, law practices, distribution companies
- **Deal Size**: $1.5M-$7M revenue, $300K+ EBITDA
- **Features**: 
  - Census API integration for demographic scoring
  - Interactive Florida heat map
  - Succession risk analysis for aging business owners
  - CRM prospect tracking with contact management

### **YBridge Capital Dashboard**
- **Target Market**: Midwest to East Coast industrial services
- **Deal Size**: $2M-$12M revenue, $500K-$2M EBITDA
- **Features**:
  - Heavy haul and equipment rental focus
  - 3PL and facility services targeting
  - Featured deal: Heavy Haul Trailer Manufacturer ($32M revenue, $4.7M EBITDA)
  - Industrial sector filtering and market scoring

## 🔧 Advanced Features

### **Market Intelligence Scanner**
- **Multi-API Search**: Simultaneous queries across 6+ APIs
- **Buybox Scoring**: 0-100 match scoring against custom criteria
- **Real-time TAM**: Dynamic market sizing calculations
- **Heatmap Visualization**: Geographic opportunity density mapping

### **Comprehensive Search System**
- **Industry Coverage**: 12+ industries with specific NAICS codes
- **Universal TAM Analysis**: Any business type in any location
- **AI-Powered Insights**: OpenAI-generated market analysis
- **Export Functionality**: CSV, PDF, CRM integration

### **Financial Analysis Tools**
- **LBO Modeling**: Complete leveraged buyout analysis
- **IRR Calculations**: Internal rate of return projections
- **Scenario Planning**: Base/upside/downside case modeling
- **Deal Scoring**: Multi-factor acquisition attractiveness scoring

## 🗺️ Navigation Structure

### **Main Routes**
```typescript
'landing' | 'dashboard' | 'solutions' | 'case-studies' | 'market-analysis' | 'market-scanner' | 'crm' | 'chaos-intelligence'
```

### **Page Hierarchy**
- **Landing Page**: Hero, product showcase, pricing, testimonials
- **Dashboard**: Overview, Oppy, Fragment Finder, Acquisition Assistant tabs
- **Market Scanner**: Bloomberg-style intelligence interface
- **CRM**: Deal pipeline management with Kanban boards
- **Client Dashboards**: Avila Peak Partners, YBridge Capital

## 🎨 UI Components Library

### **Core Components**
- **PallyButton**: Smooth hover effects with shimmer animations
- **OrigamiCard**: Glass morphism cards with subtle shadows
- **GlassElement**: Backdrop blur containers
- **SmoothReveal**: Scroll-triggered reveal animations
- **InteractiveIcon**: Hover-responsive icon animations

### **Specialized Components**
- **OkapiqLogo**: Jaguar print-filled okapi silhouette
- **JaguarBackground**: Animated fur patterns with flag-like movement
- **MarketHeatmap**: Interactive geographic visualization
- **DealPipelineKanban**: Drag-and-drop deal management
- **FinancialModelingEngine**: LBO and IRR calculation tools

## 📊 Data Integration

### **API Integrations**
- **Yelp Fusion API**: Business listings, reviews, ratings
- **Google Maps API**: Places data, coordinates, demographics
- **US Census API**: Income, population, business formation data
- **DataAxle API**: Business financials and owner information
- **OpenAI API**: AI analysis and document generation
- **Mastercard API**: Payment volume and spending patterns

### **Data Processing**
- **Real-time Scoring**: Multi-factor business evaluation
- **Market Fragmentation**: HHI calculations and consolidation analysis
- **Succession Risk**: Owner age and activity decay analysis
- **Revenue Estimation**: Cross-platform revenue proxy calculations

## 🔒 Authentication & Subscriptions

### **User Management**
- **Supabase Integration**: User authentication and session management
- **Subscription Tiers**: Explorer ($79), Professional ($897), Elite ($5,900)
- **Usage Tracking**: API call limits and feature access control
- **CRM Export Limits**: Tier-based export restrictions

### **Security Features**
- **JWT Authentication**: Secure API access
- **Row-level Security**: User-specific data isolation
- **Rate Limiting**: Subscription-based API throttling

## 🎯 Key User Flows

### **Primary User Journey**
1. **Landing Page**: User discovers Okapiq's value proposition
2. **Market Scanner**: Define buybox criteria and scan markets
3. **Results Analysis**: Review scored businesses and market intelligence
4. **Deal Pipeline**: Export to CRM or add to internal pipeline
5. **Financial Analysis**: Run LBO models and IRR projections

### **Client-Specific Flows**
- **Avila Flow**: Florida market → Accounting firms → Succession analysis → CRM export
- **YBridge Flow**: Industrial services → Heavy haul targets → Financial modeling → Deal tracking

## 🎨 Design Principles

### **Visual Hierarchy**
- **Typography**: Inter font with 6 weight variations
- **Spacing**: 8px grid system with generous whitespace
- **Colors**: Okapi browns with strategic green accents
- **Shadows**: Subtle elevation with glass morphism

### **Animation Philosophy**
- **Purposeful Motion**: Every animation serves a functional purpose
- **Performance First**: GPU-accelerated with reduced motion support
- **Smooth Transitions**: Cubic-bezier easing for natural feel
- **Jaguar Aesthetics**: Background patterns that move like fabric in wind

## 🔥 Advanced Features

### **Chaos Intelligence Dashboard**
- **Market Entropy Tracking**: Real-time volatility analysis
- **Succession Forecasting**: Predictive owner exit modeling
- **Ghost Scraper Fleet**: Proxy-based data collection interface
- **Deal Builder**: AI-powered opportunity construction

### **Financial Modeling Suite**
- **Mini LBO Engine**: Complete leveraged buyout analysis
- **IRR Calculator**: Multi-scenario return projections
- **Market Valuation**: Industry-specific multiple analysis
- **Risk Assessment**: Comprehensive due diligence scoring

## 📱 Responsive Design

### **Breakpoint Strategy**
- **Mobile**: Stack navigation, simplified tables, touch-optimized controls
- **Tablet**: Hybrid layout with collapsible sidebars
- **Desktop**: Full dashboard experience with multi-panel layouts
- **Ultra-wide**: Enhanced data density with expanded visualizations

## 🚀 Performance Optimizations

### **Loading Strategy**
- **Code Splitting**: Route-based lazy loading
- **Image Optimization**: WebP formats with fallbacks
- **Animation Performance**: Transform-only animations with will-change
- **Memory Management**: Cleanup of event listeners and observers

### **SEO & Accessibility**
- **Semantic HTML**: Proper heading hierarchy and landmarks
- **ARIA Labels**: Screen reader compatibility
- **Keyboard Navigation**: Full keyboard accessibility
- **Color Contrast**: WCAG AA compliance

## 🔗 Integration Capabilities

### **CRM Systems**
- **HubSpot**: Direct lead export with custom properties
- **Salesforce**: Bulk data import with field mapping
- **Pipedrive**: Deal pipeline synchronization

### **External APIs**
- **Ready for Production**: All API integrations built with error handling
- **Rate Limiting**: Subscription-tier based throttling
- **Data Enrichment**: Multi-source data combination and scoring

## 📈 Business Intelligence Features

### **Market Analysis**
- **TAM/SAM/SOM**: Dynamic market sizing calculations
- **Fragmentation Scoring**: HHI-based consolidation analysis
- **Demographic Overlays**: Census data integration for market context
- **Competitive Intelligence**: Market share and positioning analysis

### **Deal Sourcing**
- **Succession Signals**: Owner age and activity pattern analysis
- **Digital Footprint**: Review decay and website staleness scoring
- **Financial Health**: Revenue estimation and credit risk assessment
- **Geographic Targeting**: ZIP-code level opportunity mapping

## 🎯 Success Metrics & KPIs

### **Platform Metrics**
- **676 Businesses Loaded**: Pre-populated database for demonstrations
- **6 APIs Integrated**: Live data source connections
- **12 Industries Supported**: Comprehensive sector coverage
- **$12.1B TAM Analyzed**: Total addressable market calculations

### **Client Success Examples**
- **Avila Peak Partners**: 256 high-scoring accounting firm targets identified
- **YBridge Capital**: Heavy Haul Trailer Manufacturer ($32M revenue deal) featured
- **Market Coverage**: Massachusetts, Florida, Midwest to East Coast regions

## 🔧 Development Notes

### **Component Architecture**
- **Modular Design**: Reusable components with consistent props
- **Type Safety**: Comprehensive TypeScript interfaces
- **Error Handling**: Graceful degradation with user feedback
- **State Management**: React hooks with proper cleanup

### **Styling Approach**
- **Utility-First**: Tailwind CSS with custom extensions
- **CSS Variables**: Dynamic theming with color variables
- **Animation Classes**: Reusable animation utilities
- **Responsive Utilities**: Mobile-first responsive design

## 🎨 Figma Implementation Notes

### **Design System Fidelity**
- **Exact Color Matching**: Okapi browns with precise hex values
- **Typography Scale**: Inter font with proper weight and size hierarchy
- **Component Variants**: Multiple states for buttons, cards, and inputs
- **Animation Specifications**: Timing functions and easing curves defined

### **Interactive Elements**
- **Hover States**: Consistent interaction patterns across all elements
- **Loading States**: Professional loading animations and skeleton screens
- **Error States**: Clear error messaging with recovery actions
- **Success States**: Confirmation animations and progress indicators

## 🔥 Unique Differentiators

### **Visual Identity**
- **Jaguar Print Aesthetics**: Unique animated backgrounds with authentic patterns
- **Okapi Branding**: Custom logo with jaguar print fill
- **Bloomberg Terminal Feel**: Professional, data-dense interface design
- **Premium Animations**: Sophisticated motion design throughout

### **Functional Sophistication**
- **Multi-Client Architecture**: Separate dashboards for different investment firms
- **Real Financial Modeling**: LBO analysis, IRR calculations, deal scoring
- **Live Market Intelligence**: Real-time data aggregation and analysis
- **Professional Export**: CRM-ready data with comprehensive formatting

---

## 🎯 Implementation Summary

This frontend represents a production-ready, institutional-grade SMB intelligence platform that combines sophisticated financial analysis with modern SaaS UX. The design successfully balances professional Bloomberg-style functionality with approachable, modern interface patterns.

The jaguar print aesthetic creates a unique visual identity while the comprehensive feature set provides real value for private equity, search funds, and M&A professionals. Every component is built for scalability and real-world usage with proper error handling, loading states, and responsive design.

The platform is ready for Figma-to-code implementation with all design tokens, component variants, and interaction states clearly defined in the codebase.
