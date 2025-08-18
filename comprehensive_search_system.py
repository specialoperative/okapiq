"""
Comprehensive Business Search System
Combines all APIs with heatmaps, scoring, and CRM integration
"""

import asyncio
import aiohttp
import pandas as pd
import numpy as np
from typing import Dict, List, Optional, Tuple
import json
import requests
from datetime import datetime
import logging
from dataclasses import dataclass

@dataclass
class BusinessResult:
    """Standardized business result with scoring"""
    business_id: str
    name: str
    address: str
    city: str
    state: str
    zip_code: str
    phone: Optional[str]
    email: Optional[str]
    website: Optional[str]
    industry_code: str
    industry_name: str
    revenue_estimate: Optional[float]
    employee_count: Optional[int]
    years_established: Optional[int]
    
    # API-sourced data
    yelp_rating: Optional[float]
    yelp_review_count: Optional[int]
    google_rating: Optional[float]
    google_review_count: Optional[int]
    census_demographics: Dict
    dataaxle_financials: Dict
    mastercard_spend: Optional[float]
    
    # Calculated scores
    buybox_score: int  # 0-100 match to buybox criteria
    market_opportunity_score: int  # 0-100 market attractiveness
    acquisition_readiness_score: int  # 0-100 readiness for acquisition
    overall_score: int  # 0-100 composite score
    
    # CRM fields
    lead_status: str = "new"
    assigned_to: Optional[str] = None
    notes: Optional[str] = None
    last_contact: Optional[datetime] = None

class ComprehensiveSearchEngine:
    """Main search engine combining all APIs"""
    
    def __init__(self):
        # API configurations with your keys
        self.api_keys = {
            "yelp": "9R5wVAAW0ir_P1GrhxFsfVtv1aNolQHn3E15jQZqR43948PH99XndFP9x-aB82PSS3lBStlxhhtqykJ6qEImxUEVf2XzwSCAuh6A27e32Qmc3Js3tmJ-2kPRX6ahaHYx",
            "google_maps": "AIzaSyDxwCGvlHvNdEssqgr-Sje-gHYDU0RiFGE",
            "census": "274084692b280203c821ec6bf4436266a28d2a4c",
            "data_axle": "c54bb620b9afa2f0b48a26b3",
            "serp": "ea4be3b298056ee31226234ee2a280409e20f2de623bbdb4a48d36a7bb4cfb0a",
            "openai": "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",
            "mastercard": "mastercard_api_key_here"  # Placeholder for Mastercard API
        }
        
        # Industry codes mapping
        self.industry_codes = {
            "accounting": {"naics": "541213", "sic": "8721", "yelp": "accountants"},
            "pool_cleaning": {"naics": "561790", "sic": "7349", "yelp": "pool_cleaners"},
            "hvac": {"naics": "238220", "sic": "1711", "yelp": "hvac"},
            "dental": {"naics": "621210", "sic": "8021", "yelp": "dentists"},
            "landscaping": {"naics": "561730", "sic": "0782", "yelp": "landscaping"},
            "plumbing": {"naics": "238220", "sic": "1711", "yelp": "plumbing"},
            "restaurants": {"naics": "722513", "sic": "5812", "yelp": "restaurants"},
            "legal": {"naics": "541110", "sic": "8111", "yelp": "lawyers"},
            "consulting": {"naics": "541611", "sic": "8742", "yelp": "businessconsulting"},
            "cleaning": {"naics": "561720", "sic": "7349", "yelp": "cleaning"},
            "security": {"naics": "561612", "sic": "7381", "yelp": "security"},
            "construction": {"naics": "236118", "sic": "1521", "yelp": "contractors"}
        }
    
    async def comprehensive_search(self, industry: str, location: str, buybox_criteria: Dict) -> Dict:
        """
        Perform comprehensive search using all APIs
        """
        try:
            # Get industry codes
            codes = self.industry_codes.get(industry.lower(), {})
            if not codes:
                raise ValueError(f"Industry '{industry}' not supported")
            
            # Parallel API calls
            tasks = [
                self._search_yelp(codes["yelp"], location),
                self._search_google_places(codes["yelp"], location),
                self._search_data_axle(codes["naics"], location),
                self._get_census_data(location),
                self._get_mastercard_data(codes["naics"], location)
            ]
            
            results = await asyncio.gather(*tasks, return_exceptions=True)
            yelp_data, google_data, dataaxle_data, census_data, mastercard_data = results
            
            # Combine and enrich data
            combined_businesses = self._combine_api_results(
                yelp_data, google_data, dataaxle_data, census_data, mastercard_data
            )
            
            # Score businesses against buybox
            scored_businesses = self._score_businesses(combined_businesses, buybox_criteria)
            
            # Generate heatmap data
            heatmap_data = self._generate_heatmap_data(scored_businesses, location)
            
            # Calculate TAM and market metrics
            market_analysis = self._calculate_market_metrics(scored_businesses, industry, location)
            
            return {
                "businesses": scored_businesses,
                "heatmap_data": heatmap_data,
                "market_analysis": market_analysis,
                "search_metadata": {
                    "industry": industry,
                    "location": location,
                    "industry_codes": codes,
                    "total_businesses": len(scored_businesses),
                    "api_sources_used": ["yelp", "google", "data_axle", "census", "mastercard"],
                    "search_timestamp": datetime.now().isoformat()
                }
            }
            
        except Exception as e:
            logging.error(f"Comprehensive search error: {e}")
            raise
    
    async def _search_yelp(self, category: str, location: str) -> List[Dict]:
        """Search Yelp API"""
        try:
            headers = {"Authorization": f"Bearer {self.api_keys['yelp']}"}
            params = {
                "categories": category,
                "location": location,
                "limit": 50,
                "radius": 40000
            }
            
            async with aiohttp.ClientSession() as session:
                async with session.get(
                    "https://api.yelp.com/v3/businesses/search",
                    headers=headers,
                    params=params
                ) as response:
                    if response.status == 200:
                        data = await response.json()
                        return data.get("businesses", [])
                    else:
                        logging.error(f"Yelp API error: {response.status}")
                        return []
        except Exception as e:
            logging.error(f"Yelp search error: {e}")
            return []
    
    async def _search_google_places(self, query: str, location: str) -> List[Dict]:
        """Search Google Places API"""
        try:
            params = {
                "query": f"{query} {location}",
                "key": self.api_keys["google_maps"],
                "type": "establishment"
            }
            
            async with aiohttp.ClientSession() as session:
                async with session.get(
                    "https://maps.googleapis.com/maps/api/place/textsearch/json",
                    params=params
                ) as response:
                    if response.status == 200:
                        data = await response.json()
                        return data.get("results", [])
                    else:
                        logging.error(f"Google Places API error: {response.status}")
                        return []
        except Exception as e:
            logging.error(f"Google Places search error: {e}")
            return []
    
    async def _search_data_axle(self, naics: str, location: str) -> List[Dict]:
        """Search Data Axle API"""
        try:
            headers = {"Authorization": f"Bearer {self.api_keys['data_axle']}"}
            params = {
                "naics": naics,
                "location": location,
                "limit": 100
            }
            
            # Note: This is a placeholder - actual Data Axle API endpoint may differ
            async with aiohttp.ClientSession() as session:
                async with session.get(
                    "https://api.dataaxle.com/v1/businesses/search",
                    headers=headers,
                    params=params
                ) as response:
                    if response.status == 200:
                        data = await response.json()
                        return data.get("businesses", [])
                    else:
                        logging.error(f"Data Axle API error: {response.status}")
                        return []
        except Exception as e:
            logging.error(f"Data Axle search error: {e}")
            return []
    
    async def _get_census_data(self, location: str) -> Dict:
        """Get Census demographic data"""
        try:
            # Extract state/city for Census API
            state_code = self._get_state_code(location)
            
            params = {
                "get": "B19013_001E,B25077_001E,B01003_001E",  # Income, home value, population
                "for": f"county:*",
                "in": f"state:{state_code}",
                "key": self.api_keys["census"]
            }
            
            async with aiohttp.ClientSession() as session:
                async with session.get(
                    "https://api.census.gov/data/2021/acs/acs5",
                    params=params
                ) as response:
                    if response.status == 200:
                        data = await response.json()
                        return self._process_census_data(data)
                    else:
                        logging.error(f"Census API error: {response.status}")
                        return {}
        except Exception as e:
            logging.error(f"Census data error: {e}")
            return {}
    
    async def _get_mastercard_data(self, naics: str, location: str) -> Dict:
        """Get Mastercard spending data"""
        try:
            # Placeholder for Mastercard API integration
            # This would require actual Mastercard API credentials and endpoints
            return {
                "spending_volume": np.random.randint(50000, 500000),
                "transaction_count": np.random.randint(100, 1000),
                "avg_transaction": np.random.randint(50, 500)
            }
        except Exception as e:
            logging.error(f"Mastercard data error: {e}")
            return {}
    
    def _combine_api_results(self, yelp_data, google_data, dataaxle_data, census_data, mastercard_data) -> List[BusinessResult]:
        """Combine results from all APIs into standardized format"""
        businesses = []
        business_id_counter = 1
        
        # Process Yelp data
        for business in yelp_data:
            try:
                result = BusinessResult(
                    business_id=f"yelp_{business_id_counter}",
                    name=business.get("name", ""),
                    address=business.get("location", {}).get("address1", ""),
                    city=business.get("location", {}).get("city", ""),
                    state=business.get("location", {}).get("state", ""),
                    zip_code=business.get("location", {}).get("zip_code", ""),
                    phone=business.get("phone", ""),
                    email=None,
                    website=business.get("url", ""),
                    industry_code="",
                    industry_name=", ".join(business.get("categories", [])),
                    revenue_estimate=self._estimate_revenue_from_yelp(business),
                    employee_count=None,
                    years_established=None,
                    yelp_rating=business.get("rating"),
                    yelp_review_count=business.get("review_count"),
                    google_rating=None,
                    google_review_count=None,
                    census_demographics=census_data,
                    dataaxle_financials={},
                    mastercard_spend=mastercard_data.get("spending_volume"),
                    buybox_score=0,
                    market_opportunity_score=0,
                    acquisition_readiness_score=0,
                    overall_score=0
                )
                businesses.append(result)
                business_id_counter += 1
            except Exception as e:
                logging.error(f"Error processing Yelp business: {e}")
                continue
        
        # Enhance with Google Places data
        self._enhance_with_google_data(businesses, google_data)
        
        # Enhance with Data Axle data
        self._enhance_with_dataaxle_data(businesses, dataaxle_data)
        
        return businesses
    
    def _score_businesses(self, businesses: List[BusinessResult], buybox_criteria: Dict) -> List[BusinessResult]:
        """Score businesses against buybox criteria"""
        for business in businesses:
            # Calculate buybox score (0-100)
            business.buybox_score = self._calculate_buybox_score(business, buybox_criteria)
            
            # Calculate market opportunity score
            business.market_opportunity_score = self._calculate_market_opportunity_score(business)
            
            # Calculate acquisition readiness score
            business.acquisition_readiness_score = self._calculate_acquisition_readiness_score(business)
            
            # Calculate overall composite score
            business.overall_score = int(
                (business.buybox_score * 0.4) +
                (business.market_opportunity_score * 0.3) +
                (business.acquisition_readiness_score * 0.3)
            )
        
        # Sort by overall score
        businesses.sort(key=lambda x: x.overall_score, reverse=True)
        
        return businesses
    
    def _calculate_buybox_score(self, business: BusinessResult, criteria: Dict) -> int:
        """Calculate how well business matches buybox criteria"""
        score = 0
        max_score = 100
        
        # Revenue criteria (30 points)
        if business.revenue_estimate and criteria.get("min_revenue") and criteria.get("max_revenue"):
            min_rev = criteria["min_revenue"]
            max_rev = criteria["max_revenue"]
            if min_rev <= business.revenue_estimate <= max_rev:
                score += 30
            elif business.revenue_estimate >= min_rev * 0.8:
                score += 20
        
        # Location criteria (20 points)
        target_state = criteria.get("target_state")
        if target_state and business.state.upper() == target_state.upper():
            score += 20
        elif not target_state:
            score += 15
        
        # Rating criteria (20 points)
        if business.yelp_rating:
            if business.yelp_rating >= 4.0:
                score += 20
            elif business.yelp_rating >= 3.5:
                score += 15
            elif business.yelp_rating >= 3.0:
                score += 10
        
        # Review count criteria (15 points)
        if business.yelp_review_count:
            if business.yelp_review_count >= 50:
                score += 15
            elif business.yelp_review_count >= 20:
                score += 12
            elif business.yelp_review_count >= 10:
                score += 8
        
        # Digital presence (15 points)
        if business.website:
            score += 10
        if business.yelp_review_count and business.yelp_review_count > 0:
            score += 5
        
        return min(score, max_score)
    
    def _calculate_market_opportunity_score(self, business: BusinessResult) -> int:
        """Calculate market opportunity score based on location and demographics"""
        score = 0
        
        # Census demographics
        demographics = business.census_demographics
        if demographics:
            median_income = demographics.get("median_income", 0)
            population = demographics.get("population", 0)
            
            # Income factor (40 points)
            if median_income > 80000:
                score += 40
            elif median_income > 60000:
                score += 30
            elif median_income > 40000:
                score += 20
            else:
                score += 10
            
            # Population density factor (30 points)
            if population > 100000:
                score += 30
            elif population > 50000:
                score += 25
            elif population > 20000:
                score += 20
            else:
                score += 10
        
        # Mastercard spending data (30 points)
        if business.mastercard_spend:
            if business.mastercard_spend > 300000:
                score += 30
            elif business.mastercard_spend > 150000:
                score += 25
            elif business.mastercard_spend > 75000:
                score += 20
            else:
                score += 10
        
        return min(score, 100)
    
    def _calculate_acquisition_readiness_score(self, business: BusinessResult) -> int:
        """Calculate acquisition readiness based on business maturity and signals"""
        score = 0
        
        # Years established (30 points)
        if business.years_established:
            if business.years_established >= 10:
                score += 30
            elif business.years_established >= 5:
                score += 20
            else:
                score += 10
        else:
            score += 15  # Neutral if unknown
        
        # Review consistency (25 points)
        if business.yelp_review_count and business.yelp_rating:
            if business.yelp_review_count >= 20 and business.yelp_rating >= 3.5:
                score += 25
            elif business.yelp_review_count >= 10 and business.yelp_rating >= 3.0:
                score += 20
            else:
                score += 10
        
        # Digital presence maturity (25 points)
        if business.website and business.yelp_review_count and business.yelp_review_count > 10:
            score += 25
        elif business.website:
            score += 15
        elif business.yelp_review_count and business.yelp_review_count > 5:
            score += 10
        
        # Revenue stability proxy (20 points)
        if business.revenue_estimate:
            if business.revenue_estimate >= 1000000:
                score += 20
            elif business.revenue_estimate >= 500000:
                score += 15
            else:
                score += 10
        
        return min(score, 100)
    
    def _generate_heatmap_data(self, businesses: List[BusinessResult], location: str) -> Dict:
        """Generate heatmap data for visualization"""
        # Group businesses by zip code
        zip_data = {}
        
        for business in businesses:
            zip_code = business.zip_code
            if not zip_code:
                continue
            
            if zip_code not in zip_data:
                zip_data[zip_code] = {
                    "zip": zip_code,
                    "city": business.city,
                    "state": business.state,
                    "businesses": [],
                    "total_score": 0,
                    "avg_score": 0,
                    "business_count": 0,
                    "total_revenue": 0,
                    "avg_revenue": 0
                }
            
            zip_data[zip_code]["businesses"].append({
                "name": business.name,
                "score": business.overall_score,
                "revenue": business.revenue_estimate or 0
            })
        
        # Calculate aggregated metrics
        heatmap_points = []
        for zip_code, data in zip_data.items():
            business_count = len(data["businesses"])
            total_score = sum(b["score"] for b in data["businesses"])
            total_revenue = sum(b["revenue"] for b in data["businesses"])
            
            heatmap_points.append({
                "zip": zip_code,
                "city": data["city"],
                "state": data["state"],
                "business_count": business_count,
                "avg_score": total_score / business_count if business_count > 0 else 0,
                "total_revenue": total_revenue,
                "avg_revenue": total_revenue / business_count if business_count > 0 else 0,
                "opportunity_density": (total_score / business_count) * np.log(business_count + 1),
                "coordinates": self._get_zip_coordinates(zip_code)
            })
        
        # Sort by opportunity density
        heatmap_points.sort(key=lambda x: x["opportunity_density"], reverse=True)
        
        return {
            "points": heatmap_points,
            "summary": {
                "total_zips": len(heatmap_points),
                "total_businesses": sum(p["business_count"] for p in heatmap_points),
                "avg_score_all": np.mean([p["avg_score"] for p in heatmap_points]),
                "top_zip": heatmap_points[0] if heatmap_points else None
            }
        }
    
    def _calculate_market_metrics(self, businesses: List[BusinessResult], industry: str, location: str) -> Dict:
        """Calculate comprehensive market metrics"""
        total_businesses = len(businesses)
        total_revenue = sum(b.revenue_estimate or 0 for b in businesses)
        avg_revenue = total_revenue / total_businesses if total_businesses > 0 else 0
        
        # Score distribution
        high_score = len([b for b in businesses if b.overall_score >= 80])
        medium_score = len([b for b in businesses if 60 <= b.overall_score < 80])
        low_score = len([b for b in businesses if b.overall_score < 60])
        
        # Market fragmentation (simplified HHI)
        market_shares = [(b.revenue_estimate or avg_revenue) / total_revenue for b in businesses if total_revenue > 0]
        hhi = sum(share ** 2 for share in market_shares) if market_shares else 0
        
        return {
            "tam_estimate": total_revenue,
            "business_count": total_businesses,
            "avg_revenue": avg_revenue,
            "score_distribution": {
                "high_score_count": high_score,
                "medium_score_count": medium_score,
                "low_score_count": low_score
            },
            "market_fragmentation": {
                "hhi_index": hhi,
                "fragmentation_level": "High" if hhi < 0.15 else "Medium" if hhi < 0.25 else "Low",
                "consolidation_opportunity": hhi < 0.2
            },
            "top_opportunities": businesses[:10],  # Top 10 scored businesses
            "geographic_distribution": self._analyze_geographic_distribution(businesses)
        }
    
    def _analyze_geographic_distribution(self, businesses: List[BusinessResult]) -> Dict:
        """Analyze geographic distribution of opportunities"""
        state_counts = {}
        city_counts = {}
        
        for business in businesses:
            # State distribution
            if business.state not in state_counts:
                state_counts[business.state] = {"count": 0, "total_score": 0}
            state_counts[business.state]["count"] += 1
            state_counts[business.state]["total_score"] += business.overall_score
            
            # City distribution
            city_key = f"{business.city}, {business.state}"
            if city_key not in city_counts:
                city_counts[city_key] = {"count": 0, "total_score": 0}
            city_counts[city_key]["count"] += 1
            city_counts[city_key]["total_score"] += business.overall_score
        
        # Calculate averages
        for state_data in state_counts.values():
            state_data["avg_score"] = state_data["total_score"] / state_data["count"]
        
        for city_data in city_counts.values():
            city_data["avg_score"] = city_data["total_score"] / city_data["count"]
        
        return {
            "by_state": state_counts,
            "by_city": dict(sorted(city_counts.items(), key=lambda x: x[1]["avg_score"], reverse=True)[:10])
        }
    
    def export_to_crm(self, businesses: List[BusinessResult], crm_type: str = "hubspot") -> Dict:
        """Export scored businesses to CRM system"""
        crm_records = []
        
        for business in businesses:
            # Convert to CRM format
            crm_record = {
                "company_name": business.name,
                "phone": business.phone,
                "email": business.email,
                "website": business.website,
                "address": business.address,
                "city": business.city,
                "state": business.state,
                "zip": business.zip_code,
                "industry": business.industry_name,
                "revenue_estimate": business.revenue_estimate,
                "employee_count": business.employee_count,
                "yelp_rating": business.yelp_rating,
                "yelp_reviews": business.yelp_review_count,
                "buybox_score": business.buybox_score,
                "market_score": business.market_opportunity_score,
                "acquisition_score": business.acquisition_readiness_score,
                "overall_score": business.overall_score,
                "lead_source": "Comprehensive Search System",
                "lead_status": business.lead_status,
                "created_date": datetime.now().isoformat(),
                "notes": f"Generated by comprehensive search. Overall score: {business.overall_score}/100"
            }
            crm_records.append(crm_record)
        
        return {
            "crm_type": crm_type,
            "total_records": len(crm_records),
            "records": crm_records,
            "export_timestamp": datetime.now().isoformat()
        }
    
    # Helper methods
    def _estimate_revenue_from_yelp(self, business: Dict) -> Optional[float]:
        """Estimate revenue from Yelp data"""
        # Simple heuristic based on review count and price level
        review_count = business.get("review_count", 0)
        price_level = len(business.get("price", "$"))
        
        base_revenue = 200000  # Base revenue estimate
        review_multiplier = min(review_count / 10, 5)  # Cap at 5x
        price_multiplier = price_level
        
        return base_revenue * review_multiplier * price_multiplier
    
    def _enhance_with_google_data(self, businesses: List[BusinessResult], google_data: List[Dict]):
        """Enhance businesses with Google Places data"""
        # Simple name matching - in production, use more sophisticated matching
        google_lookup = {business.get("name", "").lower(): business for business in google_data}
        
        for business in businesses:
            google_match = google_lookup.get(business.name.lower())
            if google_match:
                business.google_rating = google_match.get("rating")
                business.google_review_count = google_match.get("user_ratings_total")
    
    def _enhance_with_dataaxle_data(self, businesses: List[BusinessResult], dataaxle_data: List[Dict]):
        """Enhance businesses with Data Axle financial data"""
        # Simple name matching
        dataaxle_lookup = {business.get("name", "").lower(): business for business in dataaxle_data}
        
        for business in businesses:
            dataaxle_match = dataaxle_lookup.get(business.name.lower())
            if dataaxle_match:
                business.revenue_estimate = dataaxle_match.get("revenue")
                business.employee_count = dataaxle_match.get("employees")
                business.years_established = dataaxle_match.get("years_in_business")
                business.dataaxle_financials = dataaxle_match
    
    def _get_state_code(self, location: str) -> str:
        """Convert state name to FIPS code for Census API"""
        state_codes = {
            "alabama": "01", "alaska": "02", "arizona": "04", "arkansas": "05",
            "california": "06", "colorado": "08", "connecticut": "09", "delaware": "10",
            "florida": "12", "georgia": "13", "hawaii": "15", "idaho": "16",
            "illinois": "17", "indiana": "18", "iowa": "19", "kansas": "20",
            "kentucky": "21", "louisiana": "22", "maine": "23", "maryland": "24",
            "massachusetts": "25", "michigan": "26", "minnesota": "27", "mississippi": "28",
            "missouri": "29", "montana": "30", "nebraska": "31", "nevada": "32",
            "new hampshire": "33", "new jersey": "34", "new mexico": "35", "new york": "36",
            "north carolina": "37", "north dakota": "38", "ohio": "39", "oklahoma": "40",
            "oregon": "41", "pennsylvania": "42", "rhode island": "44", "south carolina": "45",
            "south dakota": "46", "tennessee": "47", "texas": "48", "utah": "49",
            "vermont": "50", "virginia": "51", "washington": "53", "west virginia": "54",
            "wisconsin": "55", "wyoming": "56"
        }
        
        location_lower = location.lower()
        for state_name, code in state_codes.items():
            if state_name in location_lower:
                return code
        
        return "06"  # Default to California
    
    def _process_census_data(self, raw_data: List[List]) -> Dict:
        """Process Census API response"""
        if not raw_data or len(raw_data) < 2:
            return {}
        
        # Average the data across counties
        income_values = []
        home_values = []
        population_values = []
        
        for row in raw_data[1:]:  # Skip header
            if row[0] and row[0] != '-666666666':
                income_values.append(int(row[0]))
            if row[1] and row[1] != '-666666666':
                home_values.append(int(row[1]))
            if row[2] and row[2] != '-666666666':
                population_values.append(int(row[2]))
        
        return {
            "median_income": np.mean(income_values) if income_values else 0,
            "median_home_value": np.mean(home_values) if home_values else 0,
            "population": sum(population_values) if population_values else 0
        }
    
    def _get_zip_coordinates(self, zip_code: str) -> Tuple[float, float]:
        """Get approximate coordinates for zip code"""
        # Simplified coordinate mapping - in production, use proper geocoding
        zip_coords = {
            "33134": (25.7617, -80.1918),  # Miami
            "02139": (42.3736, -71.1097),  # Cambridge
            "90210": (34.0901, -118.4065),  # Beverly Hills
            "10001": (40.7505, -73.9934),  # NYC
            "75201": (32.7767, -96.7970),  # Dallas
        }
        
        return zip_coords.get(zip_code, (39.8283, -98.5795))  # Default to center of US

# Usage example
async def main():
    """Example usage of comprehensive search system"""
    search_engine = ComprehensiveSearchEngine()
    
    # Define buybox criteria
    buybox = {
        "min_revenue": 500000,
        "max_revenue": 5000000,
        "target_state": "FL",
        "min_rating": 3.5,
        "industry_focus": "service_based"
    }
    
    # Perform comprehensive search
    results = await search_engine.comprehensive_search(
        industry="pool_cleaning",
        location="Miami, FL",
        buybox_criteria=buybox
    )
    
    print(f"Found {len(results['businesses'])} businesses")
    print(f"Top business: {results['businesses'][0].name if results['businesses'] else 'None'}")
    
    # Export to CRM
    crm_export = search_engine.export_to_crm(results['businesses'][:20])  # Top 20
    print(f"Exported {crm_export['total_records']} records to CRM")

if __name__ == "__main__":
    asyncio.run(main())
