"""
Enrichment Engine - Third layer of the architectural diagram

This module implements the data enrichment layer:
[Data Normalizer] → [Enrichment Engine] ← Census + Yelp + IRS + SOS + NLP

Features:
- Multi-source data enrichment
- Census demographic data integration
- IRS and SOS business registration data
- NLP analysis for review sentiment and owner detection
- Market intelligence augmentation
"""

from __future__ import annotations
import asyncio
import json
import re
from typing import List, Dict, Any, Optional, Tuple
from datetime import datetime, timedelta
import logging
from dataclasses import dataclass, field

# Core libraries
import aiohttp
import openai
from textblob import TextBlob
import numpy as np

# Internal imports
try:
    from ..processors.data_normalizer import NormalizedBusiness, DataSource, DataProvenance, DataQuality
except ImportError:
    # Create minimal classes if import fails
    class NormalizedBusiness:
        pass
    class DataSource:
        pass
    class DataProvenance:
        pass
    class DataQuality:
        pass
from ..core.config import settings


@dataclass
class EnrichmentResult:
    """Result of enrichment process"""
    success: bool
    enriched_data: Dict[str, Any]
    confidence_score: float
    sources_used: List[str]
    processing_time: float
    errors: List[str] = field(default_factory=list)


@dataclass
class CensusData:
    """Census demographic and economic data"""
    zip_code: str
    median_household_income: Optional[int] = None
    population: Optional[int] = None
    median_age: Optional[float] = None
    education_bachelor_plus_pct: Optional[float] = None
    unemployment_rate: Optional[float] = None
    business_count_estimate: Optional[int] = None
    per_capita_income: Optional[int] = None


@dataclass
class IRSBusinessData:
    """IRS business registration and tax data"""
    ein: Optional[str] = None
    business_name: str = ""
    filing_status: Optional[str] = None
    naics_code: Optional[str] = None
    revenue_estimate_range: Optional[str] = None
    employee_count_range: Optional[str] = None
    tax_compliance_score: Optional[float] = None


@dataclass
class SOSRegistrationData:
    """Secretary of State business registration data"""
    registration_number: Optional[str] = None
    business_name: str = ""
    registration_date: Optional[datetime] = None
    business_type: Optional[str] = None  # LLC, Corp, Partnership, etc.
    status: Optional[str] = None  # Active, Inactive, Dissolved
    registered_agent: Optional[str] = None
    principal_address: Optional[str] = None


@dataclass
class NLPAnalysis:
    """Natural language processing analysis results"""
    owner_mentions: List[str] = field(default_factory=list)
    sentiment_score: float = 0.0
    key_themes: List[str] = field(default_factory=list)
    business_insights: List[str] = field(default_factory=list)
    succession_signals: List[str] = field(default_factory=list)


class EnrichmentEngine:
    """
    Main enrichment engine that augments normalized business data
    with external intelligence sources
    """
    
    def __init__(self):
        self.logger = logging.getLogger(__name__)
        
        # Initialize API clients
        self.census_client = CensusAPIClient()
        self.irs_client = IRSDataClient()
        self.sos_client = SOSRegistryClient()
        self.nlp_processor = NLPProcessor()
        
        # Cache for expensive operations
        self.cache = {}
        self.cache_ttl = timedelta(hours=24)
        
    async def enrich_businesses(
        self, 
        businesses: List[NormalizedBusiness],
        enrichment_types: List[str] = None
    ) -> List[NormalizedBusiness]:
        """
        Main entry point for business enrichment
        
        Args:
            businesses: List of normalized businesses to enrich
            enrichment_types: Types of enrichment to perform
            
        Returns:
            List of enriched businesses
        """
        
        if enrichment_types is None:
            enrichment_types = ['census', 'irs', 'sos', 'nlp', 'market_intelligence']
        
        enriched_businesses = []
        
        # Process businesses in batches for efficiency
        batch_size = 10
        for i in range(0, len(businesses), batch_size):
            batch = businesses[i:i + batch_size]
            
            # Process batch concurrently
            tasks = [
                self._enrich_single_business(business, enrichment_types) 
                for business in batch
            ]
            
            enriched_batch = await asyncio.gather(*tasks, return_exceptions=True)
            
            # Handle results and exceptions
            for j, result in enumerate(enriched_batch):
                if isinstance(result, Exception):
                    self.logger.error(f"Enrichment failed for business {batch[j].business_id}: {result}")
                    enriched_businesses.append(batch[j])  # Add original if enrichment fails
                else:
                    enriched_businesses.append(result)
        
        return enriched_businesses
    
    async def _enrich_single_business(
        self, 
        business: NormalizedBusiness,
        enrichment_types: List[str]
    ) -> NormalizedBusiness:
        """Enrich a single business with multiple data sources"""
        
        enrichment_results = {}
        
        try:
            # Census enrichment
            if 'census' in enrichment_types:
                census_result = await self._enrich_with_census(business)
                if census_result.success:
                    enrichment_results['census'] = census_result.enriched_data
                    
            # IRS enrichment
            if 'irs' in enrichment_types:
                irs_result = await self._enrich_with_irs(business)
                if irs_result.success:
                    enrichment_results['irs'] = irs_result.enriched_data
                    
            # Secretary of State enrichment
            if 'sos' in enrichment_types:
                sos_result = await self._enrich_with_sos(business)
                if sos_result.success:
                    enrichment_results['sos'] = sos_result.enriched_data
                    
            # NLP enrichment (reviews, descriptions, etc.)
            if 'nlp' in enrichment_types:
                nlp_result = await self._enrich_with_nlp(business)
                if nlp_result.success:
                    enrichment_results['nlp'] = nlp_result.enriched_data
                    
            # Market intelligence enrichment
            if 'market_intelligence' in enrichment_types:
                market_result = await self._enrich_with_market_intelligence(business)
                if market_result.success:
                    enrichment_results['market_intelligence'] = market_result.enriched_data
            
            # Apply enrichment results to business
            enriched_business = self._apply_enrichment_results(business, enrichment_results)
            
            return enriched_business
            
        except Exception as e:
            self.logger.error(f"Error enriching business {business.business_id}: {e}")
            return business
    
    async def _enrich_with_census(self, business: NormalizedBusiness) -> EnrichmentResult:
        """Enrich business with Census demographic data"""
        
        start_time = datetime.now()
        
        try:
            zip_code = business.address.zip_code
            if not zip_code:
                return EnrichmentResult(
                    success=False,
                    enriched_data={},
                    confidence_score=0.0,
                    sources_used=[],
                    processing_time=0.0,
                    errors=["No ZIP code available for Census lookup"]
                )
            
            # Get Census data for ZIP code
            census_data = await self.census_client.get_demographic_data(zip_code)
            
            enriched_data = {
                'demographic_data': {
                    'median_household_income': census_data.median_household_income,
                    'population': census_data.population,
                    'median_age': census_data.median_age,
                    'education_bachelor_plus_pct': census_data.education_bachelor_plus_pct,
                    'unemployment_rate': census_data.unemployment_rate,
                    'business_count_estimate': census_data.business_count_estimate,
                    'per_capita_income': census_data.per_capita_income
                },
                'market_context': {
                    'income_level': self._categorize_income_level(census_data.median_household_income),
                    'market_maturity': self._assess_market_maturity(census_data),
                    'demographic_profile': self._create_demographic_profile(census_data)
                }
            }
            
            processing_time = (datetime.now() - start_time).total_seconds()
            
            return EnrichmentResult(
                success=True,
                enriched_data=enriched_data,
                confidence_score=0.9,  # Census data is highly reliable
                sources_used=['US_Census_Bureau'],
                processing_time=processing_time
            )
            
        except Exception as e:
            processing_time = (datetime.now() - start_time).total_seconds()
            return EnrichmentResult(
                success=False,
                enriched_data={},
                confidence_score=0.0,
                sources_used=[],
                processing_time=processing_time,
                errors=[str(e)]
            )
    
    async def _enrich_with_irs(self, business: NormalizedBusiness) -> EnrichmentResult:
        """Enrich business with IRS business data"""
        
        start_time = datetime.now()
        
        try:
            # Search IRS data by business name and location
            irs_data = await self.irs_client.lookup_business(
                business.name, 
                business.address.zip_code
            )
            
            if not irs_data:
                return EnrichmentResult(
                    success=False,
                    enriched_data={},
                    confidence_score=0.0,
                    sources_used=[],
                    processing_time=(datetime.now() - start_time).total_seconds(),
                    errors=["No IRS data found for business"]
                )
            
            enriched_data = {
                'tax_registration': {
                    'ein': irs_data.ein,
                    'filing_status': irs_data.filing_status,
                    'naics_code': irs_data.naics_code,
                    'revenue_estimate_range': irs_data.revenue_estimate_range,
                    'employee_count_range': irs_data.employee_count_range,
                    'tax_compliance_score': irs_data.tax_compliance_score
                },
                'business_legitimacy': {
                    'irs_registered': True,
                    'tax_compliance_level': self._assess_tax_compliance(irs_data),
                    'business_age_estimate': self._estimate_business_age_from_irs(irs_data)
                }
            }
            
            processing_time = (datetime.now() - start_time).total_seconds()
            
            return EnrichmentResult(
                success=True,
                enriched_data=enriched_data,
                confidence_score=0.85,
                sources_used=['IRS_Business_Registry'],
                processing_time=processing_time
            )
            
        except Exception as e:
            processing_time = (datetime.now() - start_time).total_seconds()
            return EnrichmentResult(
                success=False,
                enriched_data={},
                confidence_score=0.0,
                sources_used=[],
                processing_time=processing_time,
                errors=[str(e)]
            )
    
    async def _enrich_with_sos(self, business: NormalizedBusiness) -> EnrichmentResult:
        """Enrich business with Secretary of State registration data"""
        
        start_time = datetime.now()
        
        try:
            # Look up business in state registry
            state = business.address.state
            if not state:
                return EnrichmentResult(
                    success=False,
                    enriched_data={},
                    confidence_score=0.0,
                    sources_used=[],
                    processing_time=0.0,
                    errors=["No state information available for SOS lookup"]
                )
            
            sos_data = await self.sos_client.lookup_business(business.name, state)
            
            if not sos_data:
                return EnrichmentResult(
                    success=False,
                    enriched_data={},
                    confidence_score=0.0,
                    sources_used=[],
                    processing_time=(datetime.now() - start_time).total_seconds(),
                    errors=["No SOS registration data found"]
                )
            
            enriched_data = {
                'business_registration': {
                    'registration_number': sos_data.registration_number,
                    'registration_date': sos_data.registration_date.isoformat() if sos_data.registration_date else None,
                    'business_type': sos_data.business_type,
                    'status': sos_data.status,
                    'registered_agent': sos_data.registered_agent,
                    'principal_address': sos_data.principal_address
                },
                'business_structure': {
                    'entity_type': sos_data.business_type,
                    'registration_status': sos_data.status,
                    'years_registered': self._calculate_years_registered(sos_data.registration_date),
                    'compliance_status': self._assess_sos_compliance(sos_data)
                }
            }
            
            processing_time = (datetime.now() - start_time).total_seconds()
            
            return EnrichmentResult(
                success=True,
                enriched_data=enriched_data,
                confidence_score=0.8,
                sources_used=[f'{state}_Secretary_of_State'],
                processing_time=processing_time
            )
            
        except Exception as e:
            processing_time = (datetime.now() - start_time).total_seconds()
            return EnrichmentResult(
                success=False,
                enriched_data={},
                confidence_score=0.0,
                sources_used=[],
                processing_time=processing_time,
                errors=[str(e)]
            )
    
    async def _enrich_with_nlp(self, business: NormalizedBusiness) -> EnrichmentResult:
        """Enrich business with NLP analysis of reviews and descriptions"""
        
        start_time = datetime.now()
        
        try:
            # Collect text data for analysis
            text_data = []
            
            # Add business description if available
            for source in business.data_sources:
                if 'description' in source.raw_data:
                    text_data.append(source.raw_data['description'])
                if 'reviews' in source.raw_data:
                    text_data.extend(source.raw_data['reviews'])
            
            if not text_data:
                return EnrichmentResult(
                    success=False,
                    enriched_data={},
                    confidence_score=0.0,
                    sources_used=[],
                    processing_time=0.0,
                    errors=["No text data available for NLP analysis"]
                )
            
            # Perform NLP analysis
            nlp_results = await self.nlp_processor.analyze_business_text(text_data)
            
            enriched_data = {
                'nlp_analysis': {
                    'owner_mentions': nlp_results.owner_mentions,
                    'sentiment_score': nlp_results.sentiment_score,
                    'key_themes': nlp_results.key_themes,
                    'business_insights': nlp_results.business_insights,
                    'succession_signals': nlp_results.succession_signals
                },
                'text_intelligence': {
                    'overall_sentiment': self._categorize_sentiment(nlp_results.sentiment_score),
                    'owner_presence': len(nlp_results.owner_mentions) > 0,
                    'succession_indicators': len(nlp_results.succession_signals),
                    'business_health_signals': self._extract_health_signals(nlp_results)
                }
            }
            
            processing_time = (datetime.now() - start_time).total_seconds()
            
            return EnrichmentResult(
                success=True,
                enriched_data=enriched_data,
                confidence_score=0.7,  # NLP confidence varies
                sources_used=['NLP_Analysis'],
                processing_time=processing_time
            )
            
        except Exception as e:
            processing_time = (datetime.now() - start_time).total_seconds()
            return EnrichmentResult(
                success=False,
                enriched_data={},
                confidence_score=0.0,
                sources_used=[],
                processing_time=processing_time,
                errors=[str(e)]
            )
    
    async def _enrich_with_market_intelligence(self, business: NormalizedBusiness) -> EnrichmentResult:
        """Enrich business with market intelligence data"""
        
        start_time = datetime.now()
        
        try:
            # Calculate market position
            market_data = {
                'competitive_analysis': {
                    'market_position': self._assess_market_position(business),
                    'competitive_advantages': self._identify_competitive_advantages(business),
                    'market_share_estimate': business.metrics.market_share_percent or 0.0
                },
                'acquisition_metrics': {
                    'acquisition_attractiveness': self._calculate_acquisition_attractiveness(business),
                    'succession_probability': self._calculate_succession_probability(business),
                    'strategic_value': self._assess_strategic_value(business)
                },
                'financial_intelligence': {
                    'revenue_quality': self._assess_revenue_quality(business),
                    'growth_potential': self._assess_growth_potential(business),
                    'financial_stability': self._assess_financial_stability(business)
                }
            }
            
            processing_time = (datetime.now() - start_time).total_seconds()
            
            return EnrichmentResult(
                success=True,
                enriched_data={'market_intelligence': market_data},
                confidence_score=0.75,
                sources_used=['Market_Intelligence_Engine'],
                processing_time=processing_time
            )
            
        except Exception as e:
            processing_time = (datetime.now() - start_time).total_seconds()
            return EnrichmentResult(
                success=False,
                enriched_data={},
                confidence_score=0.0,
                sources_used=[],
                processing_time=processing_time,
                errors=[str(e)]
            )
    
    def _apply_enrichment_results(
        self, 
        business: NormalizedBusiness, 
        enrichment_results: Dict[str, Dict[str, Any]]
    ) -> NormalizedBusiness:
        """Apply enrichment results to the business object"""
        
        # Add enrichment data to business tags
        for source, data in enrichment_results.items():
            business.tags.add(f"enriched_with_{source}")
            
            # Update specific fields based on enrichment
            if source == 'irs' and 'tax_registration' in data:
                irs_data = data['tax_registration']
                if irs_data.get('naics_code') and not business.naics_code:
                    business.naics_code = irs_data['naics_code']
                    
            if source == 'sos' and 'business_registration' in data:
                sos_data = data['business_registration']
                years_registered = data.get('business_structure', {}).get('years_registered')
                if years_registered and not business.metrics.years_in_business:
                    business.metrics.years_in_business = years_registered
                    
            if source == 'nlp' and 'nlp_analysis' in data:
                nlp_data = data['nlp_analysis']
                if nlp_data.get('owner_mentions') and not business.owner:
                    # Create owner from NLP analysis
                    from ..processors.data_normalizer import OwnerInfo
                    business.owner = OwnerInfo(
                        name=nlp_data['owner_mentions'][0] if nlp_data['owner_mentions'] else None,
                        detection_source='nlp_analysis',
                        confidence_score=0.6
                    )
        
        # Create enrichment provenance
        enrichment_provenance = DataProvenance(
            source=DataSource.MANUAL_INPUT,  # Enrichment is manual processing
            extraction_date=datetime.now(),
            confidence_score=np.mean([0.8, 0.7, 0.75, 0.7, 0.75]),  # Average confidence
            data_quality=DataQuality.HIGH,
            raw_data=enrichment_results
        )
        
        business.data_sources.append(enrichment_provenance)
        business.last_updated = datetime.now()
        
        # Update overall quality if enrichment improved it
        if len(enrichment_results) >= 3:  # Multiple enrichments
            business.overall_quality = DataQuality.HIGH
        elif len(enrichment_results) >= 2:
            business.overall_quality = DataQuality.MEDIUM
            
        return business
    
    # Helper methods for assessments and categorizations
    
    def _categorize_income_level(self, median_income: Optional[int]) -> str:
        """Categorize income level"""
        if not median_income:
            return "unknown"
        if median_income >= 80000:
            return "high"
        elif median_income >= 50000:
            return "medium"
        else:
            return "low"
    
    def _assess_market_maturity(self, census_data: CensusData) -> str:
        """Assess market maturity based on demographics"""
        if not census_data.median_age:
            return "unknown"
        if census_data.median_age >= 40:
            return "mature"
        elif census_data.median_age >= 30:
            return "developing"
        else:
            return "young"
    
    def _create_demographic_profile(self, census_data: CensusData) -> str:
        """Create demographic profile summary"""
        profile_elements = []
        
        if census_data.median_household_income:
            income_level = self._categorize_income_level(census_data.median_household_income)
            profile_elements.append(f"{income_level}_income")
            
        if census_data.education_bachelor_plus_pct:
            if census_data.education_bachelor_plus_pct >= 40:
                profile_elements.append("highly_educated")
            elif census_data.education_bachelor_plus_pct >= 25:
                profile_elements.append("moderately_educated")
                
        if census_data.unemployment_rate:
            if census_data.unemployment_rate <= 3:
                profile_elements.append("low_unemployment")
            elif census_data.unemployment_rate >= 7:
                profile_elements.append("high_unemployment")
                
        return "_".join(profile_elements) if profile_elements else "general"
    
    def _assess_tax_compliance(self, irs_data: IRSBusinessData) -> str:
        """Assess tax compliance level"""
        if irs_data.tax_compliance_score:
            if irs_data.tax_compliance_score >= 0.8:
                return "excellent"
            elif irs_data.tax_compliance_score >= 0.6:
                return "good"
            else:
                return "needs_attention"
        return "unknown"
    
    def _estimate_business_age_from_irs(self, irs_data: IRSBusinessData) -> Optional[int]:
        """Estimate business age from IRS data"""
        # This would require more detailed IRS data analysis
        return None
    
    def _calculate_years_registered(self, registration_date: Optional[datetime]) -> Optional[int]:
        """Calculate years since business registration"""
        if not registration_date:
            return None
        return (datetime.now() - registration_date).days // 365
    
    def _assess_sos_compliance(self, sos_data: SOSRegistrationData) -> str:
        """Assess Secretary of State compliance"""
        if sos_data.status == "Active":
            return "compliant"
        elif sos_data.status == "Inactive":
            return "non_compliant"
        else:
            return "unknown"
    
    def _categorize_sentiment(self, sentiment_score: float) -> str:
        """Categorize sentiment score"""
        if sentiment_score >= 0.3:
            return "positive"
        elif sentiment_score <= -0.3:
            return "negative"
        else:
            return "neutral"
    
    def _extract_health_signals(self, nlp_results: NLPAnalysis) -> List[str]:
        """Extract business health signals from NLP analysis"""
        health_signals = []
        
        if nlp_results.sentiment_score > 0.5:
            health_signals.append("positive_reviews")
        if "growth" in ' '.join(nlp_results.key_themes).lower():
            health_signals.append("growth_indicators")
        if "family" in ' '.join(nlp_results.key_themes).lower():
            health_signals.append("family_business")
            
        return health_signals
    
    def _assess_market_position(self, business: NormalizedBusiness) -> str:
        """Assess business market position"""
        if business.metrics.rating and business.metrics.rating >= 4.5:
            return "market_leader"
        elif business.metrics.rating and business.metrics.rating >= 4.0:
            return "strong_competitor"
        else:
            return "follower"
    
    def _identify_competitive_advantages(self, business: NormalizedBusiness) -> List[str]:
        """Identify competitive advantages"""
        advantages = []
        
        if business.metrics.rating and business.metrics.rating >= 4.5:
            advantages.append("high_customer_satisfaction")
        if business.metrics.years_in_business and business.metrics.years_in_business >= 20:
            advantages.append("established_reputation")
        if business.contact.website_valid:
            advantages.append("digital_presence")
            
        return advantages
    
    def _calculate_acquisition_attractiveness(self, business: NormalizedBusiness) -> float:
        """Calculate acquisition attractiveness score"""
        score = 0.0
        
        # Rating factor
        if business.metrics.rating:
            score += business.metrics.rating * 10
            
        # Revenue factor
        if business.metrics.estimated_revenue:
            if business.metrics.estimated_revenue >= 2000000:
                score += 20
            elif business.metrics.estimated_revenue >= 1000000:
                score += 15
            else:
                score += 10
                
        # Succession risk factor
        if business.metrics.succession_risk_score:
            score += business.metrics.succession_risk_score * 0.3
            
        return min(100.0, score)
    
    def _calculate_succession_probability(self, business: NormalizedBusiness) -> float:
        """Calculate succession probability"""
        if business.metrics.succession_risk_score:
            return business.metrics.succession_risk_score / 100.0
        return 0.5  # Default middle probability
    
    def _assess_strategic_value(self, business: NormalizedBusiness) -> str:
        """Assess strategic value for acquisition"""
        value_score = 0
        
        if business.metrics.market_share_percent and business.metrics.market_share_percent >= 15:
            value_score += 3
        if business.metrics.years_in_business and business.metrics.years_in_business >= 15:
            value_score += 2
        if business.metrics.employee_count and business.metrics.employee_count >= 20:
            value_score += 2
            
        if value_score >= 5:
            return "high"
        elif value_score >= 3:
            return "medium"
        else:
            return "low"
    
    def _assess_revenue_quality(self, business: NormalizedBusiness) -> str:
        """Assess revenue quality"""
        if business.metrics.rating and business.metrics.rating >= 4.0:
            return "high_quality"
        else:
            return "standard"
    
    def _assess_growth_potential(self, business: NormalizedBusiness) -> str:
        """Assess growth potential"""
        # This would be based on market analysis, industry trends, etc.
        return "moderate"
    
    def _assess_financial_stability(self, business: NormalizedBusiness) -> str:
        """Assess financial stability"""
        if business.metrics.years_in_business and business.metrics.years_in_business >= 10:
            return "stable"
        else:
            return "developing"


class CensusAPIClient:
    """Client for US Census Bureau API"""
    
    BASE_URL = "https://api.census.gov/data/2022/acs/acs5"
    # 2022 is the latest ACS 5-Year as of 2024
    # Variables: https://api.census.gov/data/2022/acs/acs5/variables.html
    VARIABLES = {
        'median_household_income': 'B19013_001E',
        'population': 'B01003_001E',
        'median_age': 'B01002_001E',
        'education_bachelor_plus_pct': 'B15003_022E',  # Bachelor's degree
        'unemployment_rate': 'B23025_005E',  # Unemployed
        'labor_force': 'B23025_003E',        # Labor force
        'per_capita_income': 'B19301_001E',
        # Business count estimate is not directly available; can be omitted or estimated
    }

    def __init__(self):
        self.api_key = settings.CENSUS_API_KEY

    async def get_demographic_data(self, zip_code: str) -> CensusData:
        """Get real demographic data from US Census Bureau API"""
        import aiohttp
        import logging
        
        if not self.api_key:
            logging.warning(f"Census API key not found. Cannot fetch data for ZIP {zip_code}")
            return CensusData(zip_code=zip_code)
        
        # Prepare variables and URL
        var_list = ','.join(self.VARIABLES.values())
        url = f"{self.BASE_URL}?get={var_list}&for=zip%20code%20tabulation%20area:{zip_code}&key={self.api_key}"
        
        try:
            async with aiohttp.ClientSession() as session:
                async with session.get(url) as resp:
                    if resp.status != 200:
                        logging.error(f"Census API error {resp.status} for ZIP {zip_code}")
                        return CensusData(zip_code=zip_code)
                    
                    data = await resp.json()
                    
                    # Validate response structure
                    if not data or len(data) < 2:
                        logging.warning(f"No Census data returned for ZIP {zip_code}")
                        return CensusData(zip_code=zip_code)
                    
                    values = data[1]
                    
                    # Safely parse values with proper error handling
                    def safe_int(val):
                        try:
                            return int(val) if val not in (None, '', 'null', '-', -666666666) else None
                        except (ValueError, TypeError):
                            return None
                    
                    def safe_float(val):
                        try:
                            return float(val) if val not in (None, '', 'null', '-', -666666666) else None
                        except (ValueError, TypeError):
                            return None
                    
                    # Map values to fields with safe parsing
                    median_household_income = safe_int(values[0])
                    population = safe_int(values[1])
                    median_age = safe_float(values[2])
                    education_bachelor_plus_pct = safe_float(values[3])
                    unemployed = safe_float(values[4])
                    labor_force = safe_float(values[5])
                    per_capita_income = safe_int(values[6])
                    
                    # Calculate unemployment rate if possible
                    unemployment_rate = None
                    if unemployed is not None and labor_force is not None and labor_force > 0:
                        unemployment_rate = (unemployed / labor_force) * 100
                    
                    # Log successful data retrieval
                    logging.info(f"Successfully retrieved Census data for ZIP {zip_code}")
                    
                    return CensusData(
                        zip_code=zip_code,
                        median_household_income=median_household_income,
                        population=population,
                        median_age=median_age,
                        education_bachelor_plus_pct=education_bachelor_plus_pct,
                        unemployment_rate=unemployment_rate,
                        business_count_estimate=None,  # Not available from ACS
                        per_capita_income=per_capita_income
                    )
                    
        except Exception as e:
            logging.error(f"CensusAPIClient error for ZIP {zip_code}: {str(e)}")
            return CensusData(zip_code=zip_code)


class IRSDataClient:
    """Client for IRS business data"""
    
    async def lookup_business(self, business_name: str, zip_code: str) -> Optional[IRSBusinessData]:
        """Look up business in IRS records"""
        
        # Mock implementation
        return IRSBusinessData(
            ein="12-3456789",
            business_name=business_name,
            filing_status="Active",
            naics_code="238220",
            revenue_estimate_range="$1M-$5M",
            employee_count_range="10-25",
            tax_compliance_score=0.85
        )


class SOSRegistryClient:
    """Client for Secretary of State business registries"""
    
    async def lookup_business(self, business_name: str, state: str) -> Optional[SOSRegistrationData]:
        """Look up business in state registry"""
        
        # Mock implementation
        return SOSRegistrationData(
            registration_number="LLC123456789",
            business_name=business_name,
            registration_date=datetime(2015, 3, 15),
            business_type="LLC",
            status="Active",
            registered_agent="Legal Services Inc",
            principal_address="123 Main St, City, State"
        )


class NLPProcessor:
    """Natural language processing for business text analysis"""
    
    async def analyze_business_text(self, text_data: List[str]) -> NLPAnalysis:
        """Analyze business text for insights"""
        
        combined_text = ' '.join(text_data)
        
        # Simple sentiment analysis
        blob = TextBlob(combined_text)
        sentiment_score = blob.sentiment.polarity
        
        # Extract owner mentions (simple regex)
        owner_pattern = r'\b(?:owner|CEO|president|founder)\s+(\w+(?:\s+\w+)?)'
        owner_mentions = re.findall(owner_pattern, combined_text, re.IGNORECASE)
        
        # Extract key themes (most common words)
        words = re.findall(r'\b\w{4,}\b', combined_text.lower())
        word_freq = {}
        for word in words:
            word_freq[word] = word_freq.get(word, 0) + 1
        
        key_themes = sorted(word_freq.keys(), key=lambda x: word_freq[x], reverse=True)[:5]
        
        # Look for succession signals
        succession_keywords = ['retire', 'succession', 'selling', 'exit', 'family business']
        succession_signals = [kw for kw in succession_keywords if kw in combined_text.lower()]
        
        return NLPAnalysis(
            owner_mentions=owner_mentions,
            sentiment_score=sentiment_score,
            key_themes=key_themes,
            business_insights=["Standard business operations"],
            succession_signals=succession_signals
        )


# Export main classes
__all__ = [
    'EnrichmentEngine',
    'EnrichmentResult',
    'CensusData',
    'IRSBusinessData',
    'SOSRegistrationData',
    'NLPAnalysis'
]
