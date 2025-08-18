"""
Okapiq Market Intelligence Engine
Core algorithms for TAM/SAM/SOM, HHI, and succession risk analysis
"""

import numpy as np
import pandas as pd
from typing import Dict, List, Tuple, Optional
from dataclasses import dataclass
import json
from datetime import datetime, timedelta
import requests

try:
    from sklearn.preprocessing import StandardScaler
    from sklearn.cluster import KMeans
    SKLEARN_AVAILABLE = True
except ImportError:
    SKLEARN_AVAILABLE = False
    StandardScaler = KMeans = None

@dataclass
class MarketMetrics:
    """Container for market intelligence metrics"""
    tam_estimate: float
    sam_estimate: float
    som_estimate: float
    business_count: int
    hhi_score: float
    fragmentation_level: str
    avg_revenue_per_business: float
    market_saturation_percent: float
    ad_spend_to_dominate: float
    succession_risk_avg: float
    roll_up_potential_score: float

@dataclass
class BusinessProfile:
    """Container for individual business data"""
    name: str
    estimated_revenue: float
    employee_count: int
    years_in_business: int
    yelp_rating: float
    yelp_review_count: int
    succession_risk_score: float
    owner_age_estimate: int
    market_share_percent: float
    lead_score: float

class MarketAnalyzer:
    """Core market intelligence engine"""
    
    def __init__(self):
        self.industry_benchmarks = {
            "hvac": {"avg_revenue": 850000, "avg_employees": 12, "growth_rate": 0.045},
            "plumbing": {"avg_revenue": 720000, "avg_employees": 10, "growth_rate": 0.038},
            "electrical": {"avg_revenue": 680000, "avg_employees": 8, "growth_rate": 0.042},
            "landscaping": {"avg_revenue": 450000, "avg_employees": 6, "growth_rate": 0.035},
            "restaurant": {"avg_revenue": 950000, "avg_employees": 15, "growth_rate": 0.028},
            "retail": {"avg_revenue": 650000, "avg_employees": 8, "growth_rate": 0.032},
            "automotive": {"avg_revenue": 1200000, "avg_employees": 14, "growth_rate": 0.025},
            "healthcare": {"avg_revenue": 1800000, "avg_employees": 20, "growth_rate": 0.055},
            "construction": {"avg_revenue": 1100000, "avg_employees": 12, "growth_rate": 0.040}
        }
        
        self.geographic_multipliers = {
            "CA": 1.4, "NY": 1.3, "TX": 0.9, "FL": 0.95, "IL": 1.1,
            "PA": 0.95, "OH": 0.85, "GA": 0.9, "NC": 0.9, "MI": 0.85
        }
    
    def calculate_tam_sam_som(self, location: str, industry: str, business_count: int, avg_revenue: Optional[float] = None) -> Dict[str, float]:
        """Calculate Total Addressable Market (TAM), Serviceable Available Market (SAM), and Serviceable Obtainable Market (SOM)"""
        
        benchmark = self.industry_benchmarks.get(industry.lower(), self.industry_benchmarks["retail"])
        
        if avg_revenue is None:
            avg_revenue = benchmark["avg_revenue"]
        
        state = self._extract_state(location)
        geo_multiplier = self.geographic_multipliers.get(state, 1.0)
        adjusted_avg_revenue = avg_revenue * geo_multiplier
        
        tam = business_count * adjusted_avg_revenue
        sam = tam * 0.25
        som = sam * 0.10
        
        return {
            "tam_estimate": tam,
            "sam_estimate": sam,
            "som_estimate": som,
            "avg_revenue_per_business": adjusted_avg_revenue,
            "business_count": business_count
        }
    
    def calculate_hhi(self, businesses: List[BusinessProfile]) -> Tuple[float, str]:
        """Calculate Herfindahl-Hirschman Index (HHI) for market concentration"""
        if not businesses:
            return 0.0, "unknown"
        
        total_revenue = sum(b.estimated_revenue for b in businesses)
        
        if total_revenue == 0:
            return 0.0, "unknown"
        
        hhi = 0.0
        for business in businesses:
            market_share = business.estimated_revenue / total_revenue
            hhi += market_share ** 2
        
        if hhi < 0.15:
            fragmentation_level = "highly_fragmented"
        elif hhi < 0.25:
            fragmentation_level = "moderately_fragmented"
        else:
            fragmentation_level = "consolidated"
        
        return hhi, fragmentation_level
    
    def calculate_succession_risk(self, owner_age: int, years_in_business: int, yelp_rating: float, yelp_review_count: int, website_activity: Optional[float] = None) -> float:
        """Calculate succession risk score (0-100)"""
        
        if owner_age >= 65:
            age_score = 100
        elif owner_age >= 60:
            age_score = 80
        elif owner_age >= 55:
            age_score = 60
        elif owner_age >= 50:
            age_score = 40
        else:
            age_score = 20
        
        if years_in_business >= 30:
            business_age_score = 80
        elif years_in_business >= 20:
            business_age_score = 60
        elif years_in_business >= 10:
            business_age_score = 40
        else:
            business_age_score = 20
        
        if yelp_review_count < 10:
            online_score = 70
        elif yelp_rating < 3.5:
            online_score = 60
        elif yelp_review_count < 50:
            online_score = 40
        else:
            online_score = 20
        
        if website_activity is None:
            website_score = 50
        elif website_activity < 0.3:
            website_score = 80
        elif website_activity < 0.6:
            website_score = 50
        else:
            website_score = 20
        
        succession_risk = (
            age_score * 0.40 +
            business_age_score * 0.20 +
            online_score * 0.25 +
            website_score * 0.15
        )
        
        return min(100, max(0, succession_risk))
    
    def calculate_lead_score(self, business: BusinessProfile, market_metrics: MarketMetrics) -> float:
        """Calculate lead quality score (0-100)"""
        
        revenue_score = min(100, (business.estimated_revenue / 1000000) * 50)
        succession_score = business.succession_risk_score
        market_position_score = min(100, business.market_share_percent * 10)
        
        if business.yelp_review_count >= 100 and business.yelp_rating >= 4.0:
            online_score = 100
        elif business.yelp_review_count >= 50 and business.yelp_rating >= 3.5:
            online_score = 75
        elif business.yelp_review_count >= 20:
            online_score = 50
        else:
            online_score = 25
        
        if market_metrics.fragmentation_level == "highly_fragmented":
            fragmentation_score = 100
        elif market_metrics.fragmentation_level == "moderately_fragmented":
            fragmentation_score = 75
        else:
            fragmentation_score = 25
        
        lead_score = (
            revenue_score * 0.30 +
            succession_score * 0.25 +
            market_position_score * 0.20 +
            online_score * 0.15 +
            fragmentation_score * 0.10
        )
        
        return min(100, max(0, lead_score))
    
    def _extract_state(self, location: str) -> str:
        """Extract state from location string"""
        if len(location) == 2:
            return location.upper()
        elif len(location) == 5 and location.isdigit():
            return "CA"  # Default for demo
        else:
            return "CA"  # Default for demo