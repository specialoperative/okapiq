import asyncio
import logging
from typing import List, Dict, Any, Optional
from ..data_collectors.yelp_scraper import YelpScraper
from ..data_collectors.google_maps_api import GoogleMapsAPI
from ..data_collectors.bizbuysell_scraper import BizBuySellScraper
from ..data_collectors.glencoco_integration import GlencocoIntegration
from ..data_collectors.berkeley_databases import BerkeleyDatabaseCollector
from ..data_collectors.advanced_scraper import AdvancedScraper
from ..data_collectors.serpapi_client import SerpAPIClient
from ..data_collectors.dataaxle_api import DataAxleAPI
try:
    from rapidfuzz import fuzz, process
except ImportError:
    # Fallback to difflib if rapidfuzz not available
    import difflib
    class MockFuzz:
        @staticmethod
        def ratio(a, b):
            return difflib.SequenceMatcher(None, a, b).ratio() * 100
    fuzz = MockFuzz()

import difflib

class EnhancedMarketIntelligenceService:
    """
    Enhanced market intelligence service with advanced scraping, enrichment, deduplication, and opportunity scoring.
    Aggregates business data from multiple sources, deduplicates using fuzzy logic, enriches with external signals,
    and computes opportunity scores and badges for each business.
    """
    def __init__(self) -> None:
        """Initialize all data collectors and enrichment tools."""
        self.yelp_scraper = YelpScraper()
        self.google_maps = GoogleMapsAPI()
        self.bizbuysell_scraper = BizBuySellScraper()
        self.glencoco = GlencocoIntegration()
        self.berkeley = BerkeleyDatabaseCollector()
        self.advanced_scraper = AdvancedScraper()
        self.serpapi = SerpAPIClient()
        self.dataaxle = DataAxleAPI()

    async def get_comprehensive_market_data(
        self, location: str, industry: str = None, radius_miles: int = 25
    ) -> Dict[str, Any]:
        """
        Aggregate, deduplicate, enrich, and score businesses for a given location and industry.
        Returns a dictionary with businesses, market metrics, and data source stats.
        """
        try:
            if industry:
                industry = industry.lower().strip()
            # Collect data from all sources concurrently (web-only, no mock)
            tasks = [
                self._get_yelp_data(location, industry),
                self._get_google_maps_data(location, industry),
                self._get_bizbuysell_data(location, industry),
                self._get_glencoco_data(location, industry),
                self._get_berkeley_data(location, industry),
                self._get_advanced_bizbuysell_data(location, industry),
                self._get_serpapi_data(location, industry),
                self._get_dataaxle_data(location, industry)
            ]
            results = await asyncio.gather(*tasks, return_exceptions=True)
            yelp_data = results[0] if not isinstance(results[0], Exception) else []
            google_maps_data = results[1] if not isinstance(results[1], Exception) else []
            bizbuysell_data = results[2] if not isinstance(results[2], Exception) else []
            glencoco_data = results[3] if not isinstance(results[3], Exception) else []
            berkeley_data = results[4] if not isinstance(results[4], Exception) else {}
            advanced_bizbuysell_data = results[5] if not isinstance(results[5], Exception) else []
            serpapi_data = results[6] if not isinstance(results[6], Exception) else []
            dataaxle_data = results[7] if not isinstance(results[7], Exception) else []
            # Merge and deduplicate businesses using fuzzy logic
            all_businesses = self._merge_business_data([
                yelp_data, google_maps_data, bizbuysell_data, glencoco_data,
                advanced_bizbuysell_data, serpapi_data, dataaxle_data
            ])
            # Add signal detection and enrichment
            businesses_with_signals = await self._add_signal_detection(all_businesses, location, industry)
            # Assign opportunity scores and badges
            businesses_with_scores = self._assign_opportunity_scores_and_badges(businesses_with_signals)
            # Calculate market metrics (TAM, etc.)
            market_metrics = self._calculate_market_metrics(businesses_with_scores, berkeley_data)
            # Prepare comprehensive response
            comprehensive_data = {
                'location': location,
                'industry': industry or 'general',
                'business_count': len(businesses_with_scores),
                'businesses': businesses_with_scores,
                'market_metrics': market_metrics,
                'berkeley_research': berkeley_data,
                'data_sources': {
                    'yelp': len(yelp_data),
                    'google_maps': len(google_maps_data),
                    'bizbuysell': len(bizbuysell_data),
                    'glencoco': len(glencoco_data),
                    'advanced_bizbuysell': len(advanced_bizbuysell_data),
                    'serpapi': len(serpapi_data),
                    'dataaxle': len(dataaxle_data),
                    'berkeley': 1 if berkeley_data else 0
                },
                'timestamp': asyncio.get_event_loop().time()
            }
            return comprehensive_data
        except Exception as e:
            logging.error(f"Error in comprehensive market data collection: {e}")
            return {
                'location': location,
                'industry': industry or 'general',
                'business_count': 0,
                'businesses': [],
                'market_metrics': {},
                'berkeley_research': {},
                'data_sources': {},
                'timestamp': asyncio.get_event_loop().time()
            }

    async def _get_yelp_data(self, location: str, industry: str) -> List[Dict]:
        """Get data from Yelp scraper"""
        try:
            return self.yelp_scraper.scrape_businesses(location, industry)
        except Exception as e:
            print(f"Error scraping Yelp: {e}")
            return []

    async def _get_google_maps_data(self, location: str, industry: str) -> List[Dict]:
        """Get data from Google Maps API using geopy"""
        try:
            return self.google_maps.search_places(location, industry, radius_miles=25)
        except Exception as e:
            print(f"Error getting Google Maps data: {e}")
            return []

    async def _get_bizbuysell_data(self, location: str, industry: str) -> List[Dict]:
        """Get data from BizBuySell scraper"""
        try:
            return await self.bizbuysell_scraper.scrape_businesses_for_sale(location, industry)
        except Exception as e:
            print(f"Error scraping BizBuySell: {e}")
            return []

    async def _get_glencoco_data(self, location: str, industry: str) -> List[Dict]:
        """Get data from Glencoco integration"""
        try:
            return await self.glencoco.get_business_intelligence(location, industry)
        except Exception as e:
            print(f"Error getting Glencoco data: {e}")
            return []

    async def _get_berkeley_data(self, location: str, industry: str) -> Dict:
        """Get data from UC Berkeley databases"""
        try:
            return self.berkeley.get_market_intelligence(location, industry)
        except Exception as e:
            print(f"Error getting Berkeley data: {e}")
            return {}

    async def _get_advanced_bizbuysell_data(self, location: str, industry: str) -> List[Dict]:
        """Get data from advanced BizBuySell scraper with ghost browser"""
        try:
            async with self.advanced_scraper:
                return await self.advanced_scraper.scrape_bizbuysell_advanced(location, industry)
        except Exception as e:
            print(f"Error in advanced BizBuySell scraping: {e}")
            return []

    async def _get_serpapi_data(self, location: str, industry: str) -> List[Dict]:
        try:
            return await self.serpapi.search_businesses(location, industry)
        except Exception as e:
            print(f"Error getting SerpAPI data: {e}")
            return []
    async def _get_dataaxle_data(self, location: str, industry: str) -> List[Dict]:
        try:
            return await self.dataaxle.search_businesses(location, industry)
        except Exception as e:
            print(f"Error getting Data Axle data: {e}")
            return []

    def _business_similarity(self, b1: Dict, b2: Dict) -> float:
        """
        Compute similarity between two businesses using name, address, phone, and website.
        Uses Levenshtein distance (rapidfuzz) or difflib as fallback.
        Returns a score from 0 to 100.
        """
        name1 = b1.get('name', b1.get('business_name', '')).lower().strip()
        name2 = b2.get('name', b2.get('business_name', '')).lower().strip()
        address1 = b1.get('address', '').lower().strip()
        address2 = b2.get('address', '').lower().strip()
        phone1 = b1.get('phone', '').replace('-', '').replace(' ', '')
        phone2 = b2.get('phone', '').replace('-', '').replace(' ', '')
        website1 = b1.get('website', '').lower().strip()
        website2 = b2.get('website', '').lower().strip()
        try:
            name_score = fuzz.ratio(name1, name2)
            address_score = fuzz.ratio(address1, address2)
            phone_score = 100 if phone1 and phone1 == phone2 else 0
            website_score = fuzz.ratio(website1, website2)
        except Exception:
            name_score = difflib.SequenceMatcher(None, name1, name2).ratio() * 100
            address_score = difflib.SequenceMatcher(None, address1, address2).ratio() * 100
            phone_score = 100 if phone1 and phone1 == phone2 else 0
            website_score = difflib.SequenceMatcher(None, website1, website2).ratio() * 100
        # Weighted average for overall similarity
        return 0.5 * name_score + 0.2 * address_score + 0.2 * website_score + 0.1 * phone_score

    def _merge_business_data(self, business_lists: List[List[Dict]]) -> List[Dict]:
        """
        Merge and deduplicate business data from multiple sources using fuzzy matching and multi-field logic.
        Track all contributing sources for each deduplicated business.
        """
        merged_businesses = []
        for business_list in business_lists:
            for business in business_list:
                found_duplicate = False
                for existing in merged_businesses:
                    sim = self._business_similarity(business, existing)
                    if sim > 85:  # Threshold for considering as duplicate
                        # Merge sources
                        existing['data_sources'] = list(set(existing.get('data_sources', []) + business.get('data_sources', [])))
                        if 'source' in business:
                            existing['data_sources'].append(business['source'])
                        found_duplicate = True
                        break
                if not found_duplicate:
                    business['data_sources'] = business.get('data_sources', [])
                    if 'source' in business:
                        business['data_sources'].append(business['source'])
                    merged_businesses.append(business)
        return merged_businesses

    async def _add_signal_detection(self, businesses: List[Dict], location: str, industry: str) -> List[Dict]:
        """
        Add selling signal detection and coordinates to each business using advanced scraper.
        Returns the enriched list of businesses.
        """
        businesses_with_signals = []
        for business in businesses:
            try:
                # Get comprehensive signals for the business
                signals = await self.advanced_scraper.get_comprehensive_signals(
                    business.get('name', ''),
                    location,
                    industry or 'general'
                )
                business['selling_signals'] = signals
                # Add coordinates if not present
                if 'coordinates' not in business and 'address' in business:
                    business['coordinates'] = self._get_coordinates_from_address(business['address'])
                businesses_with_signals.append(business)
            except Exception as e:
                print(f"Error adding signal detection for {business.get('name', '')}: {e}")
                # Add default signals
                business['selling_signals'] = {
                    'web_signals': {},
                    'linkedin_signals': {},
                    'reddit_signals': {},
                    'total_signal_score': 0,
                    'recommendation': 'No signals detected'
                }
                businesses_with_signals.append(business)
        return businesses_with_signals

    def _assign_opportunity_scores_and_badges(self, businesses: List[Dict]) -> List[Dict]:
        """
        Assign an opportunity score and badges to each business based on signals, demographics, and market context.
        Returns the updated list of businesses.
        """
        for business in businesses:
            score = 0
            badges = []
            # Succession risk
            succession = business.get('succession_risk_score') or business.get('selling_signals', {}).get('total_signal_score', 0)
            if succession and succession > 70:
                score += 30
                badges.append('Succession Target')
            # Growth potential
            growth = business.get('growth_potential') or business.get('market_context', {}).get('market_maturity')
            if growth == 'developing' or (isinstance(growth, float) and growth > 0.2):
                score += 20
                badges.append('Growth Market')
            # Underserved market
            if business.get('market_context', {}).get('demographic_profile', '').find('underserved') != -1:
                score += 20
                badges.append('Underserved Market')
            # Demographic match (e.g., high income, highly educated)
            demo = business.get('market_context', {}).get('demographic_profile', '')
            if 'high_income' in demo or 'highly_educated' in demo:
                score += 15
                badges.append('Premium Demographic')
            # Market leader
            if business.get('market_share_percent', 0) > 15:
                score += 15
                badges.append('Market Leader')
            # Cap and normalize
            score = min(100, score)
            if score > 60:
                badges.append('High Opportunity')
            business['opportunity_score'] = score
            business['badges'] = list(set(badges))
        return businesses

    def _get_coordinates_from_address(self, address: str) -> Optional[List[float]]:
        """
        Get coordinates from address (simulated for now).
        In production, use a geocoding service.
        """
        import random
        return [
            37.7749 + random.uniform(-0.1, 0.1),  # San Francisco area
            -122.4194 + random.uniform(-0.1, 0.1)
        ]

    def _calculate_market_metrics(self, businesses: List[Dict], berkeley_data: Dict) -> Dict[str, Any]:
        """
        Calculate comprehensive market metrics (TAM, SAM, SOM, HHI, fragmentation, etc.)
        for the given businesses and Berkeley research data.
        Returns a dictionary of metrics.
        """
        try:
            if not businesses:
                return {}
            # Basic metrics
            total_revenue = sum(b.get('estimated_revenue', 0) for b in businesses)
            total_employees = sum(b.get('employee_count', 0) for b in businesses)
            avg_revenue = total_revenue / len(businesses) if businesses else 0
            avg_employees = total_employees / len(businesses) if businesses else 0
            # Lead scoring
            lead_scores = [b.get('lead_score', 0) for b in businesses]
            avg_lead_score = sum(lead_scores) / len(lead_scores) if lead_scores else 0
            # Signal analysis
            signal_scores = [b.get('selling_signals', {}).get('total_signal_score', 0) for b in businesses]
            businesses_with_signals = len([s for s in signal_scores if s > 0])
            avg_signal_score = sum(signal_scores) / len(signal_scores) if signal_scores else 0
            # Market concentration (HHI)
            market_shares = [b.get('market_share_percent', 0) for b in businesses]
            hhi_score = sum(share ** 2 for share in market_shares)
            # Fragmentation level
            if hhi_score > 2500:
                fragmentation_level = 'highly_concentrated'
            elif hhi_score > 1500:
                fragmentation_level = 'moderately_concentrated'
            else:
                fragmentation_level = 'fragmented'
            # TAM/SAM/SOM estimates from Berkeley data
            tam_estimate = berkeley_data.get('industry_analysis', {}).get('market_size', 0)
            sam_estimate = tam_estimate * 0.1  # Assume 10% of TAM is addressable
            som_estimate = sam_estimate * 0.05  # Assume 5% of SAM is obtainable
            return {
                'tam_estimate': tam_estimate,
                'sam_estimate': sam_estimate,
                'som_estimate': som_estimate,
                'hhi_score': hhi_score,
                'fragmentation_level': fragmentation_level,
                'avg_revenue_per_business': avg_revenue,
                'avg_employees_per_business': avg_employees,
                'avg_lead_score': avg_lead_score,
                'avg_signal_score': avg_signal_score,
                'businesses_with_signals': businesses_with_signals,
                'market_saturation_percent': (len(businesses) / 1000) * 100,  # Simulated
                'ad_spend_to_dominate': avg_revenue * 0.1,  # Simulated
                'total_revenue': total_revenue,
                'total_employees': total_employees
            }
        except Exception as e:
            print(f"Error calculating market metrics: {e}")
            return {}

    async def get_signal_analysis(self, business_name: str, location: str, industry: str) -> Dict[str, Any]:
        """Get detailed signal analysis for a specific business"""
        try:
            async with self.advanced_scraper:
                signals = await self.advanced_scraper.get_comprehensive_signals(business_name, location, industry)
                return signals
        except Exception as e:
            print(f"Error in signal analysis: {e}")
            return {
                'web_signals': {},
                'linkedin_signals': {},
                'reddit_signals': {},
                'total_signal_score': 0,
                'recommendation': 'Error in signal analysis'
            }

    async def get_advanced_business_data(self, location: str, industry: str = None) -> List[Dict]:
        """Get advanced business data with enhanced scraping"""
        try:
            async with self.advanced_scraper:
                # Get advanced BizBuySell data
                bizbuysell_data = await self.advanced_scraper.scrape_bizbuysell_advanced(location, industry)

                # Add signal detection to each business
                businesses_with_signals = []
                for business in bizbuysell_data:
                    signals = await self.advanced_scraper.get_comprehensive_signals(
                        business.get('name', ''),
                        location,
                        industry or 'general'
                    )
                    business['selling_signals'] = signals
                    businesses_with_signals.append(business)

                return businesses_with_signals

        except Exception as e:
            print(f"Error getting advanced business data: {e}")
            return [] 