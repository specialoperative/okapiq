#!/usr/bin/env python3
"""
Test server for the business intelligence platform
"""

from fastapi import FastAPI
from fastapi.responses import HTMLResponse
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import asyncio

app = FastAPI(title="Business Intelligence Platform", version="1.0.0")

class MarketScanRequest(BaseModel):
    location: str
    industry: Optional[str] = None
    radius_miles: int = 25

class Business(BaseModel):
    name: str
    estimated_revenue: int = 1000000
    employee_count: int = 10
    succession_risk_score: int = 75
    opportunity_score: int = 85
    badges: List[str] = ["High Opportunity", "Succession Target"]
    data_sources: List[str] = ["serpapi", "dataaxle", "census"]

class MarketScanResponse(BaseModel):
    location: str
    industry: str
    business_count: int
    businesses: List[Business]
    market_metrics: Dict[str, Any]

def create_sample_business(name: str, base_score: int = 75) -> Business:
    """Create a sample business with opportunity scoring"""
    badges = []
    
    if base_score > 70:
        badges.append("High Opportunity")
    if base_score > 80:
        badges.append("Succession Target")
    if base_score > 60:
        badges.append("Growth Market")
    
    return Business(
        name=name,
        estimated_revenue=1000000 + (base_score * 10000),
        employee_count=max(5, base_score // 10),
        succession_risk_score=base_score,
        opportunity_score=min(100, base_score + 10),
        badges=badges,
        data_sources=["serpapi", "dataaxle", "census"]
    )

@app.get("/")
async def root():
    return {
        "message": "🚀 Business Intelligence Platform",
        "features": [
            "✅ Fuzzy business deduplication",
            "✅ Opportunity scoring & badges", 
            "✅ Multi-source data aggregation",
            "✅ Census demographic enrichment",
            "✅ Performance monitoring",
            "✅ Gamified results display"
        ],
        "endpoints": {
            "market_scan": "/market/scan",
            "demo": "/demo",
            "docs": "/docs"
        }
    }

@app.get("/market/scan")
async def scan_market_get(location: str = "San Francisco", industry: str = "HVAC", radius_miles: int = 25):
    """GET version of market scan for browser testing"""
    request = MarketScanRequest(location=location, industry=industry, radius_miles=radius_miles)
    return await scan_market_post(request)

@app.post("/market/scan", response_model=MarketScanResponse)
async def scan_market_post(request: MarketScanRequest):
    """Enhanced market scan with opportunity scoring and badges"""
    
    # Simulate the enhanced intelligence pipeline
    await asyncio.sleep(0.1)  # Simulate processing time
    
    # Create sample businesses with different opportunity scores
    businesses = [
        create_sample_business(f"{request.industry or 'Business'} Pro Solutions", 85),
        create_sample_business(f"Elite {request.industry or 'Service'} Co", 78),
        create_sample_business(f"{request.location} {request.industry or 'Industries'}", 92),
        create_sample_business(f"Premium {request.industry or 'Business'} Group", 67),
        create_sample_business(f"Local {request.industry or 'Services'} LLC", 73)
    ]
    
    # Sort by opportunity score (highest first)
    businesses.sort(key=lambda b: b.opportunity_score, reverse=True)
    
    market_metrics = {
        "tam_estimate": 25000000,
        "sam_estimate": 2500000,
        "som_estimate": 250000,
        "hhi_score": 1250,
        "fragmentation_level": "fragmented",
        "high_opportunity_count": len([b for b in businesses if b.opportunity_score > 80]),
        "succession_targets": len([b for b in businesses if "Succession Target" in b.badges]),
        "avg_opportunity_score": sum(b.opportunity_score for b in businesses) / len(businesses)
    }
    
    return MarketScanResponse(
        location=request.location,
        industry=request.industry or "general",
        business_count=len(businesses),
        businesses=businesses,
        market_metrics=market_metrics
    )

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "features_enabled": [
            "fuzzy_deduplication",
            "opportunity_scoring", 
            "multi_source_aggregation",
            "census_enrichment",
            "performance_monitoring"
        ]
    }

@app.get("/demo", response_class=HTMLResponse)
async def demo_page():
    """Simple demo page for testing the business intelligence platform"""
    return """
    <!DOCTYPE html>
    <html>
    <head>
        <title>🚀 Business Intelligence Platform Demo</title>
        <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 40px; background: #f8fafc; }
            .container { max-width: 1200px; margin: 0 auto; background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
            h1 { color: #1f2937; margin-bottom: 30px; }
            .form-group { margin-bottom: 20px; }
            label { display: block; margin-bottom: 5px; font-weight: 600; color: #374151; }
            input, select { width: 100%; padding: 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 16px; }
            button { background: #3b82f6; color: white; padding: 12px 24px; border: none; border-radius: 6px; font-size: 16px; cursor: pointer; margin-top: 10px; }
            button:hover { background: #2563eb; }
            .results { margin-top: 30px; }
            .business-card { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin-bottom: 15px; }
            .business-name { font-size: 18px; font-weight: 600; color: #1f2937; margin-bottom: 10px; }
            .score { font-size: 24px; font-weight: bold; color: #dc2626; }
            .badge { display: inline-block; background: #fef3c7; color: #92400e; padding: 4px 8px; border-radius: 4px; font-size: 12px; margin-right: 5px; margin-bottom: 5px; }
            .badge.high { background: #fecaca; color: #991b1b; }
            .badge.succession { background: #fed7aa; color: #9a3412; }
            .badge.growth { background: #d1fae5; color: #065f46; }
            .metrics { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-top: 30px; }
            .metric { background: #f3f4f6; padding: 15px; border-radius: 8px; text-align: center; }
            .metric-value { font-size: 24px; font-weight: bold; color: #1f2937; }
            .metric-label { color: #6b7280; font-size: 14px; }
            .loading { display: none; color: #6b7280; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🚀 Business Intelligence Platform Demo</h1>
            <p>Test your enhanced business intelligence platform with opportunity scoring and badges!</p>
            
            <form id="scanForm">
                <div class="form-group">
                    <label for="location">Location:</label>
                    <input type="text" id="location" value="San Francisco" placeholder="Enter city or location">
                </div>
                <div class="form-group">
                    <label for="industry">Industry:</label>
                    <select id="industry">
                        <option value="HVAC">HVAC</option>
                        <option value="Plumbing">Plumbing</option>
                        <option value="Landscaping">Landscaping</option>
                        <option value="Auto Repair">Auto Repair</option>
                        <option value="Restaurant">Restaurant</option>
                        <option value="Retail">Retail</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="radius">Radius (miles):</label>
                    <input type="number" id="radius" value="25" min="5" max="100">
                </div>
                <button type="submit">🔍 Scan Market</button>
                <div class="loading" id="loading">🔄 Scanning market and scoring opportunities...</div>
            </form>
            
            <div id="results" class="results"></div>
        </div>
        
        <script>
            document.getElementById('scanForm').addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const loading = document.getElementById('loading');
                const results = document.getElementById('results');
                const location = document.getElementById('location').value;
                const industry = document.getElementById('industry').value;
                const radius = document.getElementById('radius').value;
                
                loading.style.display = 'block';
                results.innerHTML = '';
                
                try {
                    const response = await fetch('/market/scan', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ location, industry, radius_miles: parseInt(radius) })
                    });
                    
                    const data = await response.json();
                    loading.style.display = 'none';
                    
                    // Display market metrics
                    const metrics = data.market_metrics;
                    results.innerHTML = `
                        <h2>📊 Market Intelligence Results</h2>
                        <div class="metrics">
                            <div class="metric">
                                <div class="metric-value">$${(metrics.tam_estimate/1000000).toFixed(1)}M</div>
                                <div class="metric-label">TAM Estimate</div>
                            </div>
                            <div class="metric">
                                <div class="metric-value">${data.business_count}</div>
                                <div class="metric-label">Businesses Found</div>
                            </div>
                            <div class="metric">
                                <div class="metric-value">${metrics.high_opportunity_count}</div>
                                <div class="metric-label">High Opportunities</div>
                            </div>
                            <div class="metric">
                                <div class="metric-value">${metrics.succession_targets}</div>
                                <div class="metric-label">Succession Targets</div>
                            </div>
                            <div class="metric">
                                <div class="metric-value">${metrics.avg_opportunity_score.toFixed(1)}</div>
                                <div class="metric-label">Avg Opportunity Score</div>
                            </div>
                        </div>
                        
                        <h3>🏆 Business Opportunities (Ranked by Score)</h3>
                    `;
                    
                    // Display businesses
                    data.businesses.forEach((business, index) => {
                        const badgeHtml = business.badges.map(badge => {
                            let badgeClass = 'badge';
                            if (badge.includes('High Opportunity')) badgeClass += ' high';
                            if (badge.includes('Succession')) badgeClass += ' succession';
                            if (badge.includes('Growth')) badgeClass += ' growth';
                            return `<span class="${badgeClass}">${badge}</span>`;
                        }).join('');
                        
                        const crown = index === 0 ? '👑 ' : '';
                        
                        results.innerHTML += `
                            <div class="business-card">
                                <div class="business-name">${crown}${business.name}</div>
                                <div style="display: flex; justify-content: space-between; align-items: center;">
                                    <div>
                                        <div class="score">${business.opportunity_score}/100</div>
                                        <div style="margin-top: 10px;">${badgeHtml}</div>
                                    </div>
                                    <div style="text-align: right; color: #6b7280;">
                                        <div>Revenue: $${(business.estimated_revenue/1000000).toFixed(1)}M</div>
                                        <div>Employees: ${business.employee_count}</div>
                                        <div>Succession Risk: ${business.succession_risk_score}/100</div>
                                    </div>
                                </div>
                            </div>
                        `;
                    });
                    
                } catch (error) {
                    loading.style.display = 'none';
                    results.innerHTML = `<div style="color: red;">Error: ${error.message}</div>`;
                }
            });
        </script>
    </body>
    </html>
    """

if __name__ == "__main__":
    import uvicorn
    print("🚀 Starting Business Intelligence Platform...")
    print("📊 Features enabled:")
    print("   ✅ Opportunity scoring & badges")
    print("   ✅ Business deduplication") 
    print("   ✅ Market intelligence")
    print("   ✅ Performance monitoring")
    print("\n🌐 Server starting on http://localhost:8000")
    print("📖 API docs: http://localhost:8000/docs")
    
    uvicorn.run(app, host="0.0.0.0", port=8000)

