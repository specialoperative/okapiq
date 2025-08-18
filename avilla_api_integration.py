"""
Avilla Partners - API Integration Layer
Connects all data sources for accounting firm sourcing system
"""

import asyncio
import aiohttp
import pandas as pd
from typing import Dict, List, Optional, Tuple
from dataclasses import dataclass
from datetime import datetime, timedelta
import json
import logging

# Configuration from your existing config.py
import os

API_KEYS = {
    "YELP_API_KEY": [os.getenv("YELP_API_KEY", "your_yelp_api_key_here"), "backup_key_here"],
    "GOOGLE_MAPS_API_KEY": [os.getenv("GOOGLE_MAPS_API_KEY", "your_google_maps_api_key_here"), "backup_key_here"],
    "CENSUS_API_KEY": [os.getenv("CENSUS_API_KEY", "your_census_api_key_here"), "backup_key_here"],
    "DATA_AXLE_API_KEY": [os.getenv("DATA_AXLE_API_KEY", "your_data_axle_api_key_here"), "backup_key_here"],
    "SERPAPI_API_KEY": [os.getenv("SERPAPI_API_KEY", "your_serpapi_api_key_here"), "backup_key_here"],
    "APIFY_API_TOKEN": [os.getenv("APIFY_API_TOKEN", "your_apify_api_token_here"), "backup_key_here"],
    "ARCGIS_API_KEY": [os.getenv("ARCGIS_API_KEY", "your_arcgis_api_key_here"), "backup_key_here"],
    "OPENAI_API_KEY": [os.getenv("OPENAI_API_KEY", "your_openai_api_key_here"), "backup_key_here"],
    "MASTERCARD_API_KEY": ["primary_mastercard_key", "backup_mastercard_key"]  # Your Mastercard Location APIs
}

@dataclass
class FirmData:
    """Core firm data structure"""
    name: str
    address: str
    city: str
    state: str
    zip_code: str
    phone: Optional[str] = None
    email: Optional[str] = None
    website: Optional[str] = None
    naics_code: str = "541213"  # Accounting services
    revenue_estimate: Optional[float] = None
    employee_count: Optional[int] = None
    years_established: Optional[int] = None
    owner_name: Optional[str] = None
    owner_age_estimate: Optional[int] = None
    
    # Review metrics
    yelp_rating: Optional[float] = None
    yelp_review_count: Optional[int] = None
    google_rating: Optional[float] = None
    google_review_count: Optional[int] = None
    
    # Calculated scores
    deal_score: Optional[int] = None
    succession_risk_score: Optional[int] = None
    wealth_index: Optional[int] = None
    formation_rate: Optional[float] = None

class APIKeyManager:
    """Manages API key rotation and health checking"""
    
    def __init__(self):
        self.key_health = {}
        self.last_health_check = {}
    
    def get_active_key(self, service: str) -> str:
        """Get active API key for service with automatic failover"""
        keys = API_KEYS.get(service, [])
        if not keys:
            raise ValueError(f"No API keys configured for {service}")
        
        # Check if primary key is healthy
        if self._is_key_healthy(service, keys[0]):
            return keys[0]
        elif len(keys) > 1 and self._is_key_healthy(service, keys[1]):
            logging.warning(f"Failing over to backup key for {service}")
            return keys[1]
        else:
            # Return primary key anyway and let error handling deal with it
            return keys[0]
    
    def _is_key_healthy(self, service: str, key: str) -> bool:
        """Check if API key is healthy (not rate limited or invalid)"""
        key_id = f"{service}:{key[:8]}"
        
        # If we haven't checked recently, assume healthy
        if key_id not in self.last_health_check:
            return True
            
        last_check = self.last_health_check[key_id]
        if datetime.now() - last_check < timedelta(minutes=5):
            return self.key_health.get(key_id, True)
        
        return True  # Assume healthy if check is stale

class DataAxleConnector:
    """Data Axle API connector for firm listings and financials"""
    
    def __init__(self, key_manager: APIKeyManager):
        self.key_manager = key_manager
        self.base_url = "https://api.dataaxle.com/v1"
    
    async def search_accounting_firms(self, state: str, revenue_min: int = 500000, revenue_max: int = 10000000) -> List[Dict]:
        """Search for accounting firms in specified state"""
        api_key = self.key_manager.get_active_key("DATA_AXLE_API_KEY")
        
        params = {
            "naics": "541213,541211,541219",  # Accounting, bookkeeping, other
            "state": state,
            "revenue_min": revenue_min,
            "revenue_max": revenue_max,
            "limit": 1000
        }
        
        headers = {"Authorization": f"Bearer {api_key}"}
        
        async with aiohttp.ClientSession() as session:
            async with session.get(f"{self.base_url}/businesses/search", 
                                 params=params, headers=headers) as response:
                if response.status == 200:
                    data = await response.json()
                    return data.get("businesses", [])
                else:
                    logging.error(f"Data Axle API error: {response.status}")
                    return []

class YelpConnector:
    """Yelp API connector for reviews and digital presence"""
    
    def __init__(self, key_manager: APIKeyManager):
        self.key_manager = key_manager
        self.base_url = "https://api.yelp.com/v3"
    
    async def search_businesses(self, term: str, location: str, categories: str = "accountants") -> List[Dict]:
        """Search Yelp for accounting businesses"""
        api_key = self.key_manager.get_active_key("YELP_API_KEY")
        
        params = {
            "term": term,
            "location": location,
            "categories": categories,
            "limit": 50,
            "radius": 40000  # 40km radius
        }
        
        headers = {"Authorization": f"Bearer {api_key}"}
        
        async with aiohttp.ClientSession() as session:
            async with session.get(f"{self.base_url}/businesses/search",
                                 params=params, headers=headers) as response:
                if response.status == 200:
                    data = await response.json()
                    return data.get("businesses", [])
                else:
                    logging.error(f"Yelp API error: {response.status}")
                    return []
    
    async def get_business_details(self, business_id: str) -> Dict:
        """Get detailed business information from Yelp"""
        api_key = self.key_manager.get_active_key("YELP_API_KEY")
        headers = {"Authorization": f"Bearer {api_key}"}
        
        async with aiohttp.ClientSession() as session:
            async with session.get(f"{self.base_url}/businesses/{business_id}",
                                 headers=headers) as response:
                if response.status == 200:
                    return await response.json()
                else:
                    return {}

class GoogleMapsConnector:
    """Google Maps API connector for places and location data"""
    
    def __init__(self, key_manager: APIKeyManager):
        self.key_manager = key_manager
        self.base_url = "https://maps.googleapis.com/maps/api"
    
    async def places_search(self, query: str, location: str, radius: int = 50000) -> List[Dict]:
        """Search Google Places for accounting firms"""
        api_key = self.key_manager.get_active_key("GOOGLE_MAPS_API_KEY")
        
        params = {
            "query": f"{query} accounting",
            "location": location,
            "radius": radius,
            "type": "accounting",
            "key": api_key
        }
        
        async with aiohttp.ClientSession() as session:
            async with session.get(f"{self.base_url}/place/textsearch/json",
                                 params=params) as response:
                if response.status == 200:
                    data = await response.json()
                    return data.get("results", [])
                else:
                    logging.error(f"Google Places API error: {response.status}")
                    return []

class CensusConnector:
    """US Census API connector for demographic and economic data"""
    
    def __init__(self, key_manager: APIKeyManager):
        self.key_manager = key_manager
        self.base_url = "https://api.census.gov/data"
    
    async def get_zip_demographics(self, zip_codes: List[str]) -> Dict[str, Dict]:
        """Get demographic data for zip codes"""
        api_key = self.key_manager.get_active_key("CENSUS_API_KEY")
        
        # ACS 5-Year estimates for income and demographics
        params = {
            "get": "B19013_001E,B25077_001E,B01003_001E,B08303_001E",  # Income, home value, population, commute
            "for": f"zip code tabulation area:{','.join(zip_codes)}",
            "key": api_key
        }
        
        async with aiohttp.ClientSession() as session:
            async with session.get(f"{self.base_url}/2021/acs/acs5",
                                 params=params) as response:
                if response.status == 200:
                    data = await response.json()
                    return self._process_census_data(data)
                else:
                    logging.error(f"Census API error: {response.status}")
                    return {}
    
    def _process_census_data(self, raw_data: List[List]) -> Dict[str, Dict]:
        """Process raw census data into structured format"""
        if not raw_data or len(raw_data) < 2:
            return {}
        
        headers = raw_data[0]
        results = {}
        
        for row in raw_data[1:]:
            zip_code = row[-1]
            results[zip_code] = {
                "median_income": int(row[0]) if row[0] and row[0] != '-666666666' else None,
                "median_home_value": int(row[1]) if row[1] and row[1] != '-666666666' else None,
                "population": int(row[2]) if row[2] else None,
                "avg_commute": float(row[3]) if row[3] and row[3] != '-666666666' else None
            }
        
        return results

class MastercardConnector:
    """Mastercard Location APIs for payment volume data"""
    
    def __init__(self, key_manager: APIKeyManager):
        self.key_manager = key_manager
        self.base_url = "https://api.mastercard.com/location-intelligence"
    
    async def get_merchant_volume(self, zip_code: str, naics_code: str = "541213") -> Dict:
        """Get merchant payment volume for accounting services in zip code"""
        api_key = self.key_manager.get_active_key("MASTERCARD_API_KEY")
        
        # Note: This is a simplified example - actual Mastercard API may differ
        params = {
            "zip": zip_code,
            "naics": naics_code,
            "metrics": "transaction_volume,merchant_count"
        }
        
        headers = {"Authorization": f"Bearer {api_key}"}
        
        async with aiohttp.ClientSession() as session:
            async with session.get(f"{self.base_url}/merchants/analytics",
                                 params=params, headers=headers) as response:
                if response.status == 200:
                    return await response.json()
                else:
                    logging.error(f"Mastercard API error: {response.status}")
                    return {}

class OpenAIConnector:
    """OpenAI API for AI-powered insights and analysis"""
    
    def __init__(self, key_manager: APIKeyManager):
        self.key_manager = key_manager
        self.base_url = "https://api.openai.com/v1"
    
    async def analyze_firm_reviews(self, reviews: List[str]) -> Dict:
        """Analyze firm reviews for succession signals and sentiment"""
        api_key = self.key_manager.get_active_key("OPENAI_API_KEY")
        
        prompt = f"""
        Analyze these accounting firm reviews for succession signals and overall sentiment:
        
        Reviews: {' '.join(reviews[:5])}  # Limit to first 5 reviews
        
        Provide analysis in JSON format:
        {{
            "succession_signals": ["list of signals indicating owner retirement/succession"],
            "overall_sentiment": "positive/neutral/negative",
            "key_strengths": ["list of firm strengths"],
            "potential_concerns": ["list of concerns"],
            "succession_probability": "low/medium/high"
        }}
        """
        
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "model": "gpt-4",
            "messages": [{"role": "user", "content": prompt}],
            "max_tokens": 500,
            "temperature": 0.3
        }
        
        async with aiohttp.ClientSession() as session:
            async with session.post(f"{self.base_url}/chat/completions",
                                  json=payload, headers=headers) as response:
                if response.status == 200:
                    data = await response.json()
                    content = data["choices"][0]["message"]["content"]
                    try:
                        return json.loads(content)
                    except json.JSONDecodeError:
                        return {"error": "Failed to parse AI response"}
                else:
                    logging.error(f"OpenAI API error: {response.status}")
                    return {}
    
    async def generate_market_insights(self, market_data: Dict) -> str:
        """Generate AI insights about market fragmentation and opportunities"""
        api_key = self.key_manager.get_active_key("OPENAI_API_KEY")
        
        prompt = f"""
        Based on this accounting firm market data, provide strategic insights for private equity acquisition:
        
        Market Data: {json.dumps(market_data, indent=2)}
        
        Provide insights on:
        1. Market fragmentation and roll-up opportunities
        2. Best zip codes/areas to target
        3. Succession timing predictions
        4. Recommended acquisition strategy
        
        Keep response concise and actionable.
        """
        
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "model": "gpt-4",
            "messages": [{"role": "user", "content": prompt}],
            "max_tokens": 800,
            "temperature": 0.5
        }
        
        async with aiohttp.ClientSession() as session:
            async with session.post(f"{self.base_url}/chat/completions",
                                  json=payload, headers=headers) as response:
                if response.status == 200:
                    data = await response.json()
                    return data["choices"][0]["message"]["content"]
                else:
                    logging.error(f"OpenAI API error: {response.status}")
                    return "Unable to generate insights at this time."

class AvillaSourcer:
    """Main orchestrator for Avilla Partners sourcing system"""
    
    def __init__(self):
        self.key_manager = APIKeyManager()
        self.data_axle = DataAxleConnector(self.key_manager)
        self.yelp = YelpConnector(self.key_manager)
        self.google_maps = GoogleMapsConnector(self.key_manager)
        self.census = CensusConnector(self.key_manager)
        self.mastercard = MastercardConnector(self.key_manager)
        self.openai = OpenAIConnector(self.key_manager)
    
    async def source_firms(self, state: str, filters: Dict = None) -> List[FirmData]:
        """Main sourcing function that combines all data sources"""
        filters = filters or {}
        
        # Step 1: Get base firm listings from Data Axle
        firms_raw = await self.data_axle.search_accounting_firms(
            state=state,
            revenue_min=filters.get("revenue_min", 500000),
            revenue_max=filters.get("revenue_max", 10000000)
        )
        
        # Step 2: Enrich with Yelp and Google data
        enriched_firms = []
        for firm_raw in firms_raw[:100]:  # Limit for demo
            firm_data = await self._enrich_firm_data(firm_raw)
            if firm_data:
                enriched_firms.append(firm_data)
        
        # Step 3: Add demographic and market data
        zip_codes = list(set([f.zip_code for f in enriched_firms if f.zip_code]))
        demographics = await self.census.get_zip_demographics(zip_codes)
        
        # Step 4: Calculate scores
        for firm in enriched_firms:
            firm.deal_score = self._calculate_deal_score(firm, demographics)
            firm.succession_risk_score = self._calculate_succession_risk(firm)
        
        return enriched_firms
    
    async def _enrich_firm_data(self, firm_raw: Dict) -> Optional[FirmData]:
        """Enrich firm data with review and digital presence info"""
        try:
            firm = FirmData(
                name=firm_raw.get("name", ""),
                address=firm_raw.get("address", ""),
                city=firm_raw.get("city", ""),
                state=firm_raw.get("state", ""),
                zip_code=firm_raw.get("zip", ""),
                phone=firm_raw.get("phone"),
                email=firm_raw.get("email"),
                website=firm_raw.get("website"),
                revenue_estimate=firm_raw.get("revenue_estimate"),
                employee_count=firm_raw.get("employee_count"),
                years_established=firm_raw.get("years_established")
            )
            
            # Get Yelp data
            yelp_results = await self.yelp.search_businesses(
                term=firm.name,
                location=f"{firm.city}, {firm.state}"
            )
            
            if yelp_results:
                yelp_firm = yelp_results[0]  # Take best match
                firm.yelp_rating = yelp_firm.get("rating")
                firm.yelp_review_count = yelp_firm.get("review_count")
            
            # Get Google Places data
            google_results = await self.google_maps.places_search(
                query=firm.name,
                location=f"{firm.city}, {firm.state}"
            )
            
            if google_results:
                google_firm = google_results[0]  # Take best match
                firm.google_rating = google_firm.get("rating")
                firm.google_review_count = google_firm.get("user_ratings_total")
            
            return firm
            
        except Exception as e:
            logging.error(f"Error enriching firm data: {e}")
            return None
    
    def _calculate_deal_score(self, firm: FirmData, demographics: Dict) -> int:
        """Calculate composite deal score (0-100)"""
        score = 0
        
        # Revenue strength (30%)
        if firm.revenue_estimate:
            if 1000000 <= firm.revenue_estimate <= 5000000:
                score += 30
            elif firm.revenue_estimate > 5000000:
                score += 25
            else:
                score += 15
        
        # Digital presence (20%)
        if firm.website:
            score += 10
        if firm.yelp_review_count and firm.yelp_review_count > 10:
            score += 5
        if firm.yelp_rating and firm.yelp_rating >= 4.0:
            score += 5
        
        # Market factors (25%)
        zip_demo = demographics.get(firm.zip_code, {})
        if zip_demo.get("median_income"):
            if zip_demo["median_income"] > 80000:
                score += 15
            elif zip_demo["median_income"] > 60000:
                score += 10
            else:
                score += 5
        
        # Succession potential (25%)
        if firm.years_established and firm.years_established > 15:
            score += 15
        if not firm.website:  # Old-school operations
            score += 5
        if firm.yelp_review_count and firm.yelp_review_count < 20:  # Low digital presence
            score += 5
        
        return min(score, 100)
    
    def _calculate_succession_risk(self, firm: FirmData) -> int:
        """Calculate succession risk score (0-100, higher = more likely succession)"""
        risk = 0
        
        # Business age factor
        if firm.years_established:
            if firm.years_established > 25:
                risk += 30
            elif firm.years_established > 15:
                risk += 20
            elif firm.years_established > 10:
                risk += 10
        
        # Digital inactivity signals
        if not firm.website:
            risk += 20
        
        if firm.yelp_review_count:
            if firm.yelp_review_count < 10:
                risk += 15
            elif firm.yelp_review_count < 25:
                risk += 10
        
        # Size factors (smaller firms more likely to sell)
        if firm.employee_count:
            if firm.employee_count < 10:
                risk += 15
            elif firm.employee_count < 25:
                risk += 10
        
        return min(risk, 100)

# Example usage
async def main():
    """Example usage of the Avilla sourcing system"""
    sourcer = AvillaSourcer()
    
    # Source accounting firms in Massachusetts
    ma_firms = await sourcer.source_firms("MA", {
        "revenue_min": 1000000,
        "revenue_max": 5000000
    })
    
    # Filter for high-scoring succession candidates
    succession_targets = [
        firm for firm in ma_firms 
        if firm.deal_score and firm.deal_score > 75 
        and firm.succession_risk_score and firm.succession_risk_score > 60
    ]
    
    print(f"Found {len(succession_targets)} high-priority succession targets")
    
    for firm in succession_targets[:5]:
        print(f"- {firm.name} in {firm.city}: Deal Score {firm.deal_score}, Succession Risk {firm.succession_risk_score}")

if __name__ == "__main__":
    asyncio.run(main())
