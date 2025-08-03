# 🧠 FIGMA CHAOS UI - OKAPIQ MARKET INTELLIGENCE SYSTEM

## Project Brief: Chaos-Aware SMB Intelligence Dashboard
**Purpose**: Real-time market entropy tracking, succession forecasting, and AI-powered M&A prediction interface.

---

## 🌊 PAGE 1: CHAOS MARKET TOPOLOGY
**Component**: Real-Time Market Entropy Visualization

### Layout Structure:
```
┌─────────────────────────────────────────────────────────────┐
│ OKAPIQ    |  Market Scan  |  Chaos Feed  |  Fleet  |  🔴   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─ ENTROPY HEATMAP ─────────────────┐  ┌─ CHAOS METRICS ─┐│
│  │                                   │  │ ZIP: 90210      ││
│  │     🗺️ Interactive Geo Layer     │  │ Entropy: 87/100 ││
│  │     Red=High Volatility          │  │ Owner Age: 64.2 ││
│  │     Blue=Stable Markets           │  │ Exit Velocity:  ││
│  │     Pulse=Emerging Opportunities  │  │ ↗️ +23% (90d)   ││
│  │                                   │  │                 ││
│  │  [Toggle: Owner Age] [Yelp Drop] │  │ 🔥 PHASE CHANGE ││
│  │  [Ad Spend Decay] [IRS Events]   │  │ Predicted: 14d  ││
│  └───────────────────────────────────┘  └─────────────────┘│
│                                                             │
│  ┌─ EMERGENCE TIMELINE ────────────────────────────────────┐│
│  │ Next 90 Days: 23 Predicted Listings                    ││
│  │ ████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░       ││
│  │ Week 1: 3   Week 2: 7   Week 3: 13   [View Pipeline]   ││
│  └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

### Visual Specifications:
- **Color Scheme**: Dark navy (#0a0e1a) + Neon accents (entropy=red #ff4757, stable=blue #2f86eb)
- **Typography**: Inter Black (headers) + JetBrains Mono (data)
- **Animations**: Pulsing entropy zones, real-time data streams
- **Interactive**: Zoom, pan, filter layers, click-through to business details

---

## 🎯 PAGE 2: SUCCESSION RISK SCANNER
**Component**: AI-Powered Exit Prediction Engine

### Layout Structure:
```
┌─────────────────────────────────────────────────────────────┐
│ 🎯 SUCCESSION INTELLIGENCE                                  │
├─────────────────────────────────────────────────────────────┤
│ ┌─ FILTERS ─┐  ┌─ RISK MATRIX ──────────────────────────────┐│
│ │Industry   │  │Business    │Age│Yelp│Exit│Pred.│Action    ││
│ │🔽 All     │  │           │   │Δ   │Risk│Date │          ││
│ │           │  ├───────────┼───┼────┼────┼─────┼──────────┤│
│ │Location   │  │Tony's Deli│ 67│-2.1│ 94%│45d  │[Profile] ││
│ │🔽 90210   │  │Best Cuts  │ 62│-1.8│ 89%│67d  │[Profile] ││
│ │           │  │Mom's Cafe │ 59│-0.9│ 76%│124d │[Profile] ││
│ │Risk Thresh│  │Fix-It Shop│ 71│-2.3│ 97%│23d  │[Profile] ││
│ │🔽 >80%    │  │           │   │    │    │     │          ││
│ │           │  └───────────────────────────────────────────┘│
│ │[Reset]    │                                               │
│ │[Export]   │  ┌─ CAUSALITY GRAPH ─────────────────────────┐│
│ └───────────┘  │                                           ││
│                │    Owner Age ──┐                          ││
│                │                ├─→ EXIT PROBABILITY       ││
│                │    Yelp Drop ──┤     ╔══════════════╗     ││
│                │                └──→  ║     94%      ║     ││
│                │    Filing Δ ────────→║              ║     ││
│                │                      ╚══════════════╝     ││
│                └───────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

---

## 🕷️ PAGE 3: GHOST FLEET COMMAND CENTER
**Component**: Chaos-Resilient Scraping Network Control

### Layout Structure:
```
┌─────────────────────────────────────────────────────────────┐
│ 👻 GHOST FLEET OPERATIONS                                   │
├─────────────────────────────────────────────────────────────┤
│ ┌─ AGENT STATUS ──────────────────┐ ┌─ MISSION CONTROL ────┐│
│ │Node│Task     │Success│IP Health│ │Target: BizBuySell    ││
│ ├───┼─────────┼───────┼─────────┤ │Depth: 50 pages       ││
│ │G01│BizBuy   │ 94%   │🟢 Clean │ │Proxies: 12 active    ││
│ │G02│Yelp     │ 87%   │🟡 Warm  │ │Status: ⚡ RUNNING    ││
│ │G03│LoopNet  │ 91%   │🟢 Clean │ │                      ││
│ │G04│IRS      │ 78%   │🔴 Hot   │ │[Stop Mission]        ││
│ │G05│SOS      │ 89%   │🟢 Clean │ │[New Scrape Job]     ││
│ └───┴─────────┴───────┴─────────┘ └──────────────────────┘│
│                                                             │
│ ┌─ CHAOS ENGINE METRICS ─────────────────────────────────┐  │
│ │ Fingerprint Entropy: ████████░░ 82%                   │  │
│ │ Proxy Rotation Rate: 2.3/min                          │  │
│ │ Captcha Encounters:  7 (bypassed: 6)                  │  │
│ │ Data Extraction:     1,247 records/hour               │  │
│ └───────────────────────────────────────────────────────┘  │
│                                                             │
│ ┌─ LIVE TERMINAL ─────────────────────────────────────────┐ │
│ │> Ghost-02: Navigating to yelp.com/chicago              │ │
│ │> Ghost-02: Fingerprint rotated [Canvas+TLS]            │ │
│ │> Ghost-01: Extracted 23 listings from BizBuySell p.7   │ │
│ │> Ghost-04: IRS query rate limited, switching proxy     │ │
│ │> Ghost-05: SOS filing detected: Tony's Deli LLC       │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## 🌪️ PAGE 4: CHAOS OPPORTUNITY ENGINE
**Component**: Emergent Deal Intelligence Generator

### Layout Structure:
```
┌─────────────────────────────────────────────────────────────┐
│ 🌪️ ENTROPY DEAL GENERATOR                                  │
├─────────────────────────────────────────────────────────────┤
│ ┌─ MARKET INPUTS ─────────────────────────────────────────┐  │
│ │ Location: [Chicago, IL ▼]  Industry: [Restaurants ▼]  │  │
│ │ Revenue: [$100K - $2M]     Timeline: [Next 90 days]    │  │
│ │ Risk Tolerance: ████████░░ High                        │  │
│ └─────────────────────────────────────────────────────────┘  │
│                                                             │
│ ┌─ EMERGING OPPORTUNITIES ────────────────────────────────┐  │
│ │ 🚨 PHASE TRANSITION DETECTED                            │  │
│ │                                                         │  │
│ │ ┌─ Tony's Italian Bistro ──────────────────────────────┐│  │
│ │ │ Exit Probability: 94% (23 days)                      ││  │
│ │ │ Causality: Owner 67yrs + Yelp↓2.1 + IRS filing      ││  │
│ │ │ Revenue Est: $450K/yr                                ││  │
│ │ │ Takeover Cost: $89K (ads) → 67% market capture      ││  │
│ │ │ [Generate Deal Memo] [Add to Pipeline]              ││  │
│ │ └──────────────────────────────────────────────────────┘│  │
│ │                                                         │  │
│ │ ┌─ Maria's Taco House ─────────────────────────────────┐│  │
│ │ │ Exit Probability: 87% (45 days)                      ││  │
│ │ │ Causality: Lease expiry + declining foot traffic     ││  │
│ │ │ Revenue Est: $280K/yr                                ││  │
│ │ │ [Generate Deal Memo] [Add to Pipeline]              ││  │
│ │ └──────────────────────────────────────────────────────┘│  │
│ └─────────────────────────────────────────────────────────┘  │
│                                                             │
│ ┌─ MARKET TAKEOVER STRATEGY ─────────────────────────────┐   │
│ │ Total Addressable Market: $2.3M                        │   │
│ │ Current Market Entropy: 78% (HIGH OPPORTUNITY)         │   │
│ │ Suggested Ad Spend: $45K/month → 34% market capture    │   │
│ │ Projected ROI: 312% within 18 months                   │   │
│ │                                                         │   │
│ │ [Export Strategy PDF] [Sync to CRM] [Schedule Call]    │   │
│ └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎨 DESIGN SYSTEM SPECIFICATIONS

### Color Palette:
```css
/* Chaos Theme */
--primary-dark: #0a0e1a;
--secondary-dark: #1a1f2e;
--accent-red: #ff4757;    /* High entropy */
--accent-blue: #2f86eb;   /* Stable markets */
--accent-green: #26de81;  /* Opportunities */
--accent-yellow: #ffd32a; /* Warnings */
--text-primary: #ffffff;
--text-secondary: #8b949e;
--text-mono: #f0f6fc;
```

### Typography:
```css
/* Headers */
font-family: 'Inter', sans-serif;
font-weight: 800;

/* Data/Code */
font-family: 'JetBrains Mono', monospace;
font-weight: 400;

/* UI Elements */
font-family: 'Inter', sans-serif;
font-weight: 500;
```

### Interactive Elements:
- **Hover States**: Glow effects on chaos zones
- **Loading States**: Pulsing entropy animations
- **Real-time Updates**: Smooth number counting, graph animations
- **Micro-interactions**: Ripple effects on critical alerts

### Responsive Breakpoints:
- **Desktop**: 1920x1080+ (Primary dashboard)
- **Laptop**: 1366x768 (Condensed views)
- **Tablet**: 768x1024 (Mobile-optimized cards)
- **Mobile**: 375x667 (Critical alerts only)

---

## 🚀 COMPONENT LIBRARY

### Core Components:
1. **Entropy Heatmap**: Interactive SVG with zoom/pan
2. **Risk Matrix Table**: Sortable, filterable data grid
3. **Chaos Metrics Cards**: Real-time updating statistics
4. **Ghost Fleet Status**: Live agent monitoring
5. **Terminal Output**: Streaming log viewer
6. **Opportunity Cards**: AI-generated deal briefs
7. **Market Strategy Panel**: ROI calculators and export tools

### Export Formats:
- **PDF Deal Memos**: Formatted investment briefs
- **CSV Data Exports**: Raw analytics data
- **CRM Integration**: Salesforce/HubSpot sync
- **API Webhooks**: Real-time alerts to Slack/Discord

### Development Handoff:
- All components built with Tailwind CSS + Headless UI
- API endpoints: `/api/chaos/*`, `/api/ghost/*`, `/api/market/*`
- Real-time updates via WebSocket connections
- Progressive loading for large datasets