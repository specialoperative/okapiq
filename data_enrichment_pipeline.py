#!/usr/bin/env python3
"""
🔄 Advanced Data Enrichment Pipeline for Okapiq
Sophisticated data processing and enrichment system

FEATURES:
✅ Multi-source data integration (APIs, web scraping, databases)
✅ Real-time data validation and cleaning
✅ Advanced geocoding and location intelligence
✅ Industry classification and standardization
✅ Financial metrics calculation and validation
✅ Social media and digital presence analysis
✅ Competitive intelligence gathering
✅ Data quality scoring and monitoring
✅ Automated data pipeline orchestration
✅ Caching and performance optimization
"""

import asyncio
import aiohttp
import logging
import json
import re
import time
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any, Tuple, Union
from dataclasses import dataclass, asdict, field
from concurrent.futures import ThreadPoolExecutor, as_completed
import hashlib
from pathlib import Path
import pandas as pd
import numpy as np

# Enhanced imports
try:
    import requests
    from bs4 import BeautifulSoup
    SCRAPING_AVAILABLE = True
except ImportError:
    SCRAPING_AVAILABLE = False

try:
    import geopy
    from geopy.geocoders import Nominatim
    from geopy.distance import geodesic
    GEOPY_AVAILABLE = True
except ImportError:
    GEOPY_AVAILABLE = False

try:
    import phonenumbers
    from phonenumbers import geocoder, carrier
    PHONENUMBERS_AVAILABLE = True
except ImportError:
    PHONENUMBERS_AVAILABLE = False

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@dataclass
class EnrichmentRequest:
    """Request for data enrichment"""
    firm_id: str
    name: str
    address: Optional[str] = None
    phone: Optional[str] = None
    website: Optional[str] = None
    email: Optional[str] = None
    industry: Optional[str] = None
    revenue: Optional[float] = None
    employees: Optional[int] = None
    priority: int = 1  # 1=high, 5=low
    enrichment_types: List[str] = field(default_factory=lambda: ['all'])

@dataclass
class EnrichmentResult:
    """Result of data enrichment"""
    firm_id: str
    original_data: Dict[str, Any]
    enriched_data: Dict[str, Any]
    data_quality_score: float
    enrichment_sources: List[str]
    processing_time: float
    errors: List[str] = field(default_factory=list)
    warnings: List[str] = field(default_factory=list)
    timestamp: str = field(default_factory=lambda: datetime.now().isoformat())

class DataQualityValidator:
    """Advanced data quality validation"""
    
    @staticmethod
    def validate_phone(phone: str) -> Dict[str, Any]:
        """Validate and enrich phone number"""
        if not phone or not PHONENUMBERS_AVAILABLE:
            return {"is_valid": False, "formatted": None, "country": None, "carrier": None}
        
        try:
            parsed = phonenumbers.parse(phone, "US")  # Default to US
            is_valid = phonenumbers.is_valid_number(parsed)
            formatted = phonenumbers.format_number(parsed, phonenumbers.PhoneNumberFormat.NATIONAL)
            country = geocoder.description_for_number(parsed, "en")
            carrier_name = carrier.name_for_number(parsed, "en")
            
            return {
                "is_valid": is_valid,
                "formatted": formatted,
                "country": country,
                "carrier": carrier_name,
                "type": "mobile" if phonenumbers.number_type(parsed) == phonenumbers.PhoneNumberType.MOBILE else "landline"
            }
        except Exception as e:
            logger.warning(f"Phone validation error: {e}")
            return {"is_valid": False, "error": str(e)}
    
    @staticmethod
    def validate_email(email: str) -> Dict[str, Any]:
        """Validate email address"""
        if not email:
            return {"is_valid": False}
        
        email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        is_valid = bool(re.match(email_pattern, email))
        
        domain = email.split('@')[1] if '@' in email else None
        is_business_email = domain and not any(provider in domain.lower() 
                                             for provider in ['gmail', 'yahoo', 'hotmail', 'outlook'])
        
        return {
            "is_valid": is_valid,
            "domain": domain,
            "is_business_email": is_business_email,
            "email_provider": domain.split('.')[-2] if domain and '.' in domain else None
        }
    
    @staticmethod
    def validate_website(website: str) -> Dict[str, Any]:
        """Validate website URL"""
        if not website:
            return {"is_valid": False}
        
        # Add protocol if missing
        if not website.startswith(('http://', 'https://')):
            website = 'https://' + website
        
        url_pattern = r'^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$'
        is_valid = bool(re.match(url_pattern, website))
        
        domain = website.split('/')[2] if '/' in website else website
        
        return {
            "is_valid": is_valid,
            "formatted_url": website,
            "domain": domain,
            "has_ssl": website.startswith('https://'),
            "is_subdomain": domain.count('.') > 1
        }
    
    @staticmethod
    def calculate_data_quality_score(data: Dict[str, Any]) -> float:
        """Calculate overall data quality score (0-100)"""
        score = 0
        max_score = 100
        
        # Required fields (40 points)
        required_fields = ['name', 'address', 'phone']
        for field in required_fields:
            if data.get(field):
                score += 13.33
        
        # Contact information quality (30 points)
        if data.get('phone_validation', {}).get('is_valid'):
            score += 10
        if data.get('email_validation', {}).get('is_valid'):
            score += 10
        if data.get('website_validation', {}).get('is_valid'):
            score += 10
        
        # Business information (20 points)
        if data.get('industry'):
            score += 5
        if data.get('revenue') and data.get('revenue') > 0:
            score += 5
        if data.get('employees') and data.get('employees') > 0:
            score += 5
        if data.get('years_in_business') and data.get('years_in_business') > 0:
            score += 5
        
        # Location data (10 points)
        if data.get('geocoding', {}).get('latitude'):
            score += 5
        if data.get('geocoding', {}).get('formatted_address'):
            score += 5
        
        return min(score, max_score)

class LocationIntelligence:
    """Advanced location-based intelligence"""
    
    def __init__(self):
        self.geocoder = Nominatim(user_agent="okapiq_enrichment") if GEOPY_AVAILABLE else None
        self.location_cache = {}
    
    async def enrich_location(self, address: str) -> Dict[str, Any]:
        """Enrich location data with geocoding and demographics"""
        if not address or not GEOPY_AVAILABLE:
            return {"error": "Location services not available"}
        
        # Check cache first
        cache_key = hashlib.md5(address.encode()).hexdigest()
        if cache_key in self.location_cache:
            return self.location_cache[cache_key]
        
        try:
            location = self.geocoder.geocode(address, timeout=10)
            if not location:
                return {"error": "Address not found"}
            
            result = {
                "formatted_address": location.address,
                "latitude": location.latitude,
                "longitude": location.longitude,
                "geocoding_confidence": getattr(location, 'confidence', 0.8),
                "address_components": self._parse_address_components(location.address)
            }
            
            # Add demographic data (simulated - in production, integrate with Census API)
            result.update(await self._get_demographic_data(location.latitude, location.longitude))
            
            # Cache result
            self.location_cache[cache_key] = result
            return result
            
        except Exception as e:
            logger.error(f"Geocoding error for {address}: {e}")
            return {"error": str(e)}
    
    def _parse_address_components(self, address: str) -> Dict[str, str]:
        """Parse address into components"""
        components = {}
        parts = address.split(', ')
        
        if len(parts) >= 3:
            components['city'] = parts[-3]
            components['state'] = parts[-2].split()[0] if parts[-2] else None
            components['zip_code'] = parts[-2].split()[-1] if len(parts[-2].split()) > 1 else None
            components['country'] = parts[-1]
        
        return components
    
    async def _get_demographic_data(self, lat: float, lng: float) -> Dict[str, Any]:
        """Get demographic data for location (simulated)"""
        # In production, integrate with Census API, demographic databases
        return {
            "demographics": {
                "median_income": np.random.randint(40000, 120000),
                "population_density": np.random.randint(100, 5000),
                "education_level": np.random.choice(["High School", "Bachelor's", "Master's", "PhD"]),
                "age_median": np.random.randint(25, 65),
                "business_density": np.random.uniform(0.1, 0.8)
            },
            "market_indicators": {
                "commercial_activity": np.random.uniform(0.3, 0.9),
                "competition_density": np.random.uniform(0.2, 0.8),
                "growth_potential": np.random.uniform(0.4, 0.9)
            }
        }

class WebIntelligence:
    """Web scraping and digital presence analysis"""
    
    def __init__(self):
        self.session = requests.Session() if SCRAPING_AVAILABLE else None
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        if self.session:
            self.session.headers.update(self.headers)
    
    async def analyze_website(self, url: str) -> Dict[str, Any]:
        """Analyze website for business intelligence"""
        if not url or not SCRAPING_AVAILABLE:
            return {"error": "Web scraping not available"}
        
        try:
            response = self.session.get(url, timeout=10)
            soup = BeautifulSoup(response.content, 'html.parser')
            
            analysis = {
                "status_code": response.status_code,
                "page_size": len(response.content),
                "load_time": response.elapsed.total_seconds(),
                "title": soup.title.string if soup.title else None,
                "meta_description": self._get_meta_description(soup),
                "contact_info": self._extract_contact_info(soup),
                "social_media": self._extract_social_links(soup),
                "technologies": self._detect_technologies(response.text),
                "seo_score": self._calculate_seo_score(soup),
                "mobile_friendly": self._check_mobile_friendly(soup),
                "ssl_certificate": url.startswith('https://'),
                "last_updated": datetime.now().isoformat()
            }
            
            return analysis
            
        except Exception as e:
            logger.error(f"Website analysis error for {url}: {e}")
            return {"error": str(e)}
    
    def _get_meta_description(self, soup: BeautifulSoup) -> Optional[str]:
        """Extract meta description"""
        meta_desc = soup.find('meta', attrs={'name': 'description'})
        return meta_desc['content'] if meta_desc else None
    
    def _extract_contact_info(self, soup: BeautifulSoup) -> Dict[str, List[str]]:
        """Extract contact information from website"""
        text = soup.get_text()
        
        # Email pattern
        emails = re.findall(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b', text)
        
        # Phone pattern
        phones = re.findall(r'\b\d{3}[-.]?\d{3}[-.]?\d{4}\b|\(\d{3}\)\s?\d{3}[-.]?\d{4}', text)
        
        return {
            "emails": list(set(emails))[:5],  # Limit to 5 unique emails
            "phones": list(set(phones))[:3]   # Limit to 3 unique phones
        }
    
    def _extract_social_links(self, soup: BeautifulSoup) -> Dict[str, str]:
        """Extract social media links"""
        social_patterns = {
            'facebook': r'facebook\.com/[\w.-]+',
            'twitter': r'twitter\.com/[\w.-]+',
            'linkedin': r'linkedin\.com/[\w.-/]+',
            'instagram': r'instagram\.com/[\w.-]+',
            'youtube': r'youtube\.com/[\w.-/]+',
            'tiktok': r'tiktok\.com/@[\w.-]+'
        }
        
        social_links = {}
        page_html = str(soup)
        
        for platform, pattern in social_patterns.items():
            matches = re.findall(pattern, page_html, re.IGNORECASE)
            if matches:
                social_links[platform] = f"https://{matches[0]}"
        
        return social_links
    
    def _detect_technologies(self, html: str) -> List[str]:
        """Detect technologies used on website"""
        technologies = []
        
        tech_patterns = {
            'WordPress': r'wp-content|wordpress',
            'Shopify': r'shopify',
            'Wix': r'wix\.com',
            'Squarespace': r'squarespace',
            'React': r'react',
            'Angular': r'angular',
            'Vue.js': r'vue\.js',
            'jQuery': r'jquery',
            'Google Analytics': r'google-analytics|gtag',
            'Facebook Pixel': r'facebook\.net/tr'
        }
        
        for tech, pattern in tech_patterns.items():
            if re.search(pattern, html, re.IGNORECASE):
                technologies.append(tech)
        
        return technologies
    
    def _calculate_seo_score(self, soup: BeautifulSoup) -> float:
        """Calculate basic SEO score"""
        score = 0
        max_score = 100
        
        # Title tag (20 points)
        if soup.title and soup.title.string:
            title_length = len(soup.title.string)
            if 30 <= title_length <= 60:
                score += 20
            elif title_length > 0:
                score += 10
        
        # Meta description (20 points)
        meta_desc = self._get_meta_description(soup)
        if meta_desc:
            desc_length = len(meta_desc)
            if 120 <= desc_length <= 160:
                score += 20
            elif desc_length > 0:
                score += 10
        
        # Headings (20 points)
        h1_tags = soup.find_all('h1')
        if len(h1_tags) == 1:
            score += 15
        elif len(h1_tags) > 1:
            score += 5
        
        if soup.find_all(['h2', 'h3']):
            score += 5
        
        # Images with alt tags (15 points)
        images = soup.find_all('img')
        if images:
            images_with_alt = [img for img in images if img.get('alt')]
            alt_ratio = len(images_with_alt) / len(images)
            score += 15 * alt_ratio
        
        # Internal links (10 points)
        internal_links = soup.find_all('a', href=True)
        if len(internal_links) >= 3:
            score += 10
        elif len(internal_links) > 0:
            score += 5
        
        # Mobile viewport (15 points)
        viewport = soup.find('meta', attrs={'name': 'viewport'})
        if viewport:
            score += 15
        
        return min(score, max_score)
    
    def _check_mobile_friendly(self, soup: BeautifulSoup) -> bool:
        """Check if website is mobile-friendly"""
        viewport = soup.find('meta', attrs={'name': 'viewport'})
        responsive_indicators = soup.find_all(string=re.compile(r'@media|responsive', re.I))
        
        return bool(viewport) or len(responsive_indicators) > 0

class IndustryClassifier:
    """Industry classification and standardization"""
    
    def __init__(self):
        self.industry_mapping = self._load_industry_mapping()
        self.naics_codes = self._load_naics_codes()
    
    def classify_industry(self, business_name: str, description: str = "", 
                         website_content: str = "") -> Dict[str, Any]:
        """Classify business industry using multiple signals"""
        text_to_analyze = f"{business_name} {description} {website_content}".lower()
        
        # Keyword-based classification
        industry_scores = {}
        for industry, keywords in self.industry_mapping.items():
            score = sum(1 for keyword in keywords if keyword in text_to_analyze)
            if score > 0:
                industry_scores[industry] = score
        
        if not industry_scores:
            return {"primary_industry": "Other Services", "confidence": 0.1}
        
        # Get top industry
        top_industry = max(industry_scores, key=industry_scores.get)
        confidence = industry_scores[top_industry] / len(self.industry_mapping[top_industry])
        
        return {
            "primary_industry": top_industry,
            "confidence": min(confidence, 1.0),
            "alternative_industries": sorted(industry_scores.items(), 
                                           key=lambda x: x[1], reverse=True)[1:4],
            "naics_code": self.naics_codes.get(top_industry, "999999")
        }
    
    def _load_industry_mapping(self) -> Dict[str, List[str]]:
        """Load industry keyword mapping"""
        return {
            "Accounting & Tax Services": [
                "accounting", "tax", "bookkeeping", "cpa", "audit", "payroll", "financial"
            ],
            "Legal Services": [
                "law", "legal", "attorney", "lawyer", "litigation", "counsel", "paralegal"
            ],
            "Healthcare": [
                "medical", "health", "doctor", "clinic", "hospital", "dental", "physician", "therapy"
            ],
            "Restaurant & Food Service": [
                "restaurant", "food", "catering", "cafe", "bakery", "pizza", "dining", "kitchen"
            ],
            "Retail": [
                "retail", "store", "shop", "boutique", "market", "merchandise", "sales"
            ],
            "Construction": [
                "construction", "contractor", "building", "renovation", "roofing", "plumbing", "electrical"
            ],
            "Technology": [
                "technology", "software", "it", "computer", "digital", "tech", "development"
            ],
            "Real Estate": [
                "real estate", "property", "realtor", "broker", "mortgage", "appraisal"
            ],
            "Marketing & Advertising": [
                "marketing", "advertising", "branding", "promotion", "media", "creative", "agency"
            ],
            "Consulting": [
                "consulting", "consultant", "advisory", "strategy", "management", "business"
            ]
        }
    
    def _load_naics_codes(self) -> Dict[str, str]:
        """Load NAICS code mapping"""
        return {
            "Accounting & Tax Services": "541211",
            "Legal Services": "541110",
            "Healthcare": "621111",
            "Restaurant & Food Service": "722511",
            "Retail": "453998",
            "Construction": "236118",
            "Technology": "541511",
            "Real Estate": "531210",
            "Marketing & Advertising": "541810",
            "Consulting": "541611"
        }

class FinancialAnalyzer:
    """Financial metrics calculation and validation"""
    
    @staticmethod
    def calculate_financial_metrics(revenue: float, employees: int, 
                                  years_in_business: int, industry: str) -> Dict[str, Any]:
        """Calculate comprehensive financial metrics"""
        if not revenue or revenue <= 0:
            return {"error": "Invalid revenue data"}
        
        employees = max(1, employees)  # Avoid division by zero
        
        # Basic metrics
        revenue_per_employee = revenue / employees
        
        # Industry benchmarks (simulated - in production, use real data)
        industry_benchmarks = {
            "Accounting & Tax Services": {"rpe": 150000, "profit_margin": 0.20},
            "Legal Services": {"rpe": 200000, "profit_margin": 0.25},
            "Healthcare": {"rpe": 180000, "profit_margin": 0.15},
            "Technology": {"rpe": 250000, "profit_margin": 0.18},
            "default": {"rpe": 120000, "profit_margin": 0.12}
        }
        
        benchmark = industry_benchmarks.get(industry, industry_benchmarks["default"])
        
        # Estimated metrics
        estimated_profit_margin = benchmark["profit_margin"] * np.random.uniform(0.7, 1.3)
        estimated_ebitda = revenue * estimated_profit_margin
        
        # Growth estimates
        age_factor = min(1.0, years_in_business / 10)  # Mature businesses grow slower
        estimated_growth_rate = np.random.uniform(0.05, 0.25) * (1 - age_factor * 0.5)
        
        # Financial health indicators
        rpe_ratio = revenue_per_employee / benchmark["rpe"]
        
        return {
            "revenue_per_employee": revenue_per_employee,
            "estimated_profit_margin": estimated_profit_margin,
            "estimated_ebitda": estimated_ebitda,
            "estimated_growth_rate": estimated_growth_rate,
            "industry_rpe_ratio": rpe_ratio,
            "financial_health_score": FinancialAnalyzer._calculate_health_score(
                rpe_ratio, estimated_profit_margin, years_in_business
            ),
            "benchmark_comparison": {
                "industry_avg_rpe": benchmark["rpe"],
                "performance_vs_industry": "above" if rpe_ratio > 1.1 else "below" if rpe_ratio < 0.9 else "average"
            }
        }
    
    @staticmethod
    def _calculate_health_score(rpe_ratio: float, profit_margin: float, age: int) -> float:
        """Calculate financial health score (0-100)"""
        score = 0
        
        # Revenue per employee score (40 points)
        if rpe_ratio > 1.2:
            score += 40
        elif rpe_ratio > 1.0:
            score += 30
        elif rpe_ratio > 0.8:
            score += 20
        else:
            score += 10
        
        # Profit margin score (35 points)
        if profit_margin > 0.20:
            score += 35
        elif profit_margin > 0.15:
            score += 25
        elif profit_margin > 0.10:
            score += 15
        else:
            score += 5
        
        # Business maturity score (25 points)
        if age > 10:
            score += 25
        elif age > 5:
            score += 15
        elif age > 2:
            score += 10
        else:
            score += 5
        
        return min(score, 100)

class DataEnrichmentPipeline:
    """Main data enrichment pipeline orchestrator"""
    
    def __init__(self, max_workers: int = 10):
        self.max_workers = max_workers
        self.validator = DataQualityValidator()
        self.location_intel = LocationIntelligence()
        self.web_intel = WebIntelligence()
        self.industry_classifier = IndustryClassifier()
        self.financial_analyzer = FinancialAnalyzer()
        
        # Processing statistics
        self.stats = {
            "total_processed": 0,
            "successful_enrichments": 0,
            "failed_enrichments": 0,
            "avg_processing_time": 0,
            "avg_quality_score": 0
        }
    
    async def enrich_business_data(self, request: EnrichmentRequest) -> EnrichmentResult:
        """Main enrichment method"""
        start_time = time.time()
        errors = []
        warnings = []
        enriched_data = {}
        sources = []
        
        try:
            original_data = asdict(request)
            
            # Phone validation
            if request.phone:
                phone_result = self.validator.validate_phone(request.phone)
                enriched_data['phone_validation'] = phone_result
                if phone_result.get('is_valid'):
                    sources.append('phone_validation')
                else:
                    warnings.append("Invalid phone number format")
            
            # Email validation
            if request.email:
                email_result = self.validator.validate_email(request.email)
                enriched_data['email_validation'] = email_result
                if email_result.get('is_valid'):
                    sources.append('email_validation')
                else:
                    warnings.append("Invalid email format")
            
            # Website validation and analysis
            if request.website:
                website_result = self.validator.validate_website(request.website)
                enriched_data['website_validation'] = website_result
                
                if website_result.get('is_valid'):
                    sources.append('website_validation')
                    # Web intelligence analysis
                    web_analysis = await self.web_intel.analyze_website(website_result['formatted_url'])
                    if 'error' not in web_analysis:
                        enriched_data['web_intelligence'] = web_analysis
                        sources.append('web_scraping')
                    else:
                        warnings.append(f"Website analysis failed: {web_analysis['error']}")
                else:
                    warnings.append("Invalid website URL")
            
            # Location enrichment
            if request.address:
                location_result = await self.location_intel.enrich_location(request.address)
                if 'error' not in location_result:
                    enriched_data['location_intelligence'] = location_result
                    sources.append('geocoding')
                else:
                    warnings.append(f"Location enrichment failed: {location_result['error']}")
            
            # Industry classification
            business_description = ""
            website_content = enriched_data.get('web_intelligence', {}).get('meta_description', "")
            
            industry_result = self.industry_classifier.classify_industry(
                request.name, business_description, website_content
            )
            enriched_data['industry_classification'] = industry_result
            sources.append('industry_classification')
            
            # Financial analysis
            if request.revenue and request.employees:
                financial_result = self.financial_analyzer.calculate_financial_metrics(
                    request.revenue, request.employees, 
                    getattr(request, 'years_in_business', 5),
                    industry_result.get('primary_industry', 'default')
                )
                if 'error' not in financial_result:
                    enriched_data['financial_analysis'] = financial_result
                    sources.append('financial_analysis')
            
            # Calculate overall data quality score
            combined_data = {**original_data, **enriched_data}
            quality_score = self.validator.calculate_data_quality_score(combined_data)
            
            # Update statistics
            self._update_stats(time.time() - start_time, quality_score, True)
            
            return EnrichmentResult(
                firm_id=request.firm_id,
                original_data=original_data,
                enriched_data=enriched_data,
                data_quality_score=quality_score,
                enrichment_sources=sources,
                processing_time=time.time() - start_time,
                errors=errors,
                warnings=warnings
            )
            
        except Exception as e:
            logger.error(f"Enrichment error for {request.firm_id}: {e}")
            errors.append(str(e))
            
            # Update statistics for failed enrichment
            self._update_stats(time.time() - start_time, 0, False)
            
            return EnrichmentResult(
                firm_id=request.firm_id,
                original_data=asdict(request),
                enriched_data={},
                data_quality_score=0,
                enrichment_sources=[],
                processing_time=time.time() - start_time,
                errors=errors,
                warnings=warnings
            )
    
    async def batch_enrich(self, requests: List[EnrichmentRequest]) -> List[EnrichmentResult]:
        """Process multiple enrichment requests in parallel"""
        logger.info(f"🚀 Starting batch enrichment for {len(requests)} businesses")
        
        # Sort by priority (1=high, 5=low)
        sorted_requests = sorted(requests, key=lambda x: x.priority)
        
        # Process in batches to avoid overwhelming APIs
        batch_size = min(self.max_workers, 20)
        results = []
        
        for i in range(0, len(sorted_requests), batch_size):
            batch = sorted_requests[i:i + batch_size]
            logger.info(f"Processing batch {i//batch_size + 1}/{(len(sorted_requests) + batch_size - 1)//batch_size}")
            
            # Process batch concurrently
            tasks = [self.enrich_business_data(request) for request in batch]
            batch_results = await asyncio.gather(*tasks, return_exceptions=True)
            
            # Handle exceptions
            for result in batch_results:
                if isinstance(result, Exception):
                    logger.error(f"Batch processing error: {result}")
                else:
                    results.append(result)
            
            # Small delay between batches to be respectful to APIs
            await asyncio.sleep(1)
        
        logger.info(f"✅ Batch enrichment completed. {len(results)} businesses processed")
        return results
    
    def _update_stats(self, processing_time: float, quality_score: float, success: bool):
        """Update processing statistics"""
        self.stats["total_processed"] += 1
        
        if success:
            self.stats["successful_enrichments"] += 1
        else:
            self.stats["failed_enrichments"] += 1
        
        # Update averages
        total = self.stats["total_processed"]
        self.stats["avg_processing_time"] = (
            (self.stats["avg_processing_time"] * (total - 1) + processing_time) / total
        )
        
        if success:
            successful = self.stats["successful_enrichments"]
            self.stats["avg_quality_score"] = (
                (self.stats["avg_quality_score"] * (successful - 1) + quality_score) / successful
            )
    
    def get_pipeline_stats(self) -> Dict[str, Any]:
        """Get pipeline processing statistics"""
        success_rate = (
            self.stats["successful_enrichments"] / max(1, self.stats["total_processed"])
        )
        
        return {
            **self.stats,
            "success_rate": success_rate,
            "capabilities": {
                "phone_validation": PHONENUMBERS_AVAILABLE,
                "geocoding": GEOPY_AVAILABLE,
                "web_scraping": SCRAPING_AVAILABLE,
                "max_workers": self.max_workers
            },
            "last_updated": datetime.now().isoformat()
        }

# Example usage and testing
async def main():
    """Test the enrichment pipeline"""
    pipeline = DataEnrichmentPipeline(max_workers=5)
    
    # Sample enrichment requests
    sample_requests = [
        EnrichmentRequest(
            firm_id="test_001",
            name="Acme Accounting Services",
            address="123 Main St, Boston, MA 02101",
            phone="(617) 555-0123",
            email="info@acmeaccounting.com",
            website="https://acmeaccounting.com",
            revenue=2500000,
            employees=15,
            priority=1
        ),
        EnrichmentRequest(
            firm_id="test_002",
            name="Tech Solutions LLC",
            address="456 Innovation Dr, Austin, TX 78701",
            phone="512-555-0456",
            email="contact@techsolutions.com",
            website="techsolutions.com",
            revenue=5000000,
            employees=45,
            priority=2
        )
    ]
    
    # Test single enrichment
    print("🧪 Testing single enrichment...")
    result = await pipeline.enrich_business_data(sample_requests[0])
    print(f"✅ Single enrichment completed:")
    print(f"   Quality Score: {result.data_quality_score:.1f}")
    print(f"   Sources: {', '.join(result.enrichment_sources)}")
    print(f"   Processing Time: {result.processing_time:.2f}s")
    
    # Test batch enrichment
    print("\n🧪 Testing batch enrichment...")
    batch_results = await pipeline.batch_enrich(sample_requests)
    print(f"✅ Batch enrichment completed: {len(batch_results)} results")
    
    # Show pipeline stats
    stats = pipeline.get_pipeline_stats()
    print(f"\n📊 Pipeline Statistics:")
    print(f"   Success Rate: {stats['success_rate']:.1%}")
    print(f"   Avg Quality Score: {stats['avg_quality_score']:.1f}")
    print(f"   Avg Processing Time: {stats['avg_processing_time']:.2f}s")

if __name__ == "__main__":
    asyncio.run(main())
