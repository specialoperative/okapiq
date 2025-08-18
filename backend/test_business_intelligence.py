#!/usr/bin/env python3
"""
Automated tests for the business intelligence pipeline
Tests deduplication, enrichment, scoring, and API integrations
"""

import pytest
import asyncio
from unittest.mock import Mock, patch, AsyncMock
from typing import List, Dict

# Import modules to test
from app.services.enhanced_market_intelligence_service import EnhancedMarketIntelligenceService
from app.processors.data_normalizer import DataNormalizer, NormalizedBusiness
from app.enrichment.enrichment_engine import EnrichmentEngine, CensusData
from app.data_collectors.serpapi_client import SerpAPIClient
from app.data_collectors.dataaxle_api import DataAxleAPI


class TestBusinessDeduplication:
    """Test business deduplication and fuzzy matching logic"""
    
    def setup_method(self):
        self.service = EnhancedMarketIntelligenceService()
    
    def test_business_similarity_exact_match(self):
        """Test exact business name and address match"""
        b1 = {"name": "Joe's HVAC", "address": "123 Main St", "phone": "555-1234", "website": "joeshvac.com"}
        b2 = {"name": "Joe's HVAC", "address": "123 Main St", "phone": "555-1234", "website": "joeshvac.com"}
        similarity = self.service._business_similarity(b1, b2)
        assert similarity > 95  # Should be very high similarity
    
    def test_business_similarity_fuzzy_match(self):
        """Test fuzzy matching for similar business names"""
        b1 = {"name": "Joe's HVAC Services", "address": "123 Main Street", "phone": "555-1234"}
        b2 = {"name": "Joes HVAC Service", "address": "123 Main St", "phone": "(555) 1234"}
        similarity = self.service._business_similarity(b1, b2)
        assert similarity > 80  # Should detect as similar
    
    def test_business_similarity_different_businesses(self):
        """Test that different businesses have low similarity"""
        b1 = {"name": "Joe's HVAC", "address": "123 Main St", "phone": "555-1234"}
        b2 = {"name": "Smith Plumbing", "address": "456 Oak Ave", "phone": "555-5678"}
        similarity = self.service._business_similarity(b1, b2)
        assert similarity < 50  # Should be low similarity
    
    def test_merge_business_data_deduplication(self):
        """Test that duplicate businesses are merged correctly"""
        business_lists = [
            [{"name": "Joe's HVAC", "address": "123 Main St", "source": "yelp"}],
            [{"name": "Joes HVAC", "address": "123 Main Street", "source": "google"}]
        ]
        merged = self.service._merge_business_data(business_lists)
        assert len(merged) == 1  # Should merge duplicates
        assert "yelp" in merged[0]["data_sources"]
        assert "google" in merged[0]["data_sources"]


class TestOpportunityScoring:
    """Test opportunity scoring and badge assignment"""
    
    def setup_method(self):
        self.service = EnhancedMarketIntelligenceService()
    
    def test_high_succession_risk_scoring(self):
        """Test that high succession risk businesses get correct scores and badges"""
        businesses = [
            {"name": "Test Business", "succession_risk_score": 85}
        ]
        scored = self.service._assign_opportunity_scores_and_badges(businesses)
        assert scored[0]["opportunity_score"] >= 30
        assert "Succession Target" in scored[0]["badges"]
    
    def test_growth_market_scoring(self):
        """Test that growth markets get correct scores and badges"""
        businesses = [
            {"name": "Test Business", "market_context": {"market_maturity": "developing"}}
        ]
        scored = self.service._assign_opportunity_scores_and_badges(businesses)
        assert "Growth Market" in scored[0]["badges"]
    
    def test_premium_demographic_scoring(self):
        """Test that premium demographics get correct scores and badges"""
        businesses = [
            {"name": "Test Business", "market_context": {"demographic_profile": "high_income_highly_educated"}}
        ]
        scored = self.service._assign_opportunity_scores_and_badges(businesses)
        assert "Premium Demographic" in scored[0]["badges"]
    
    def test_high_opportunity_badge(self):
        """Test that high-scoring businesses get the High Opportunity badge"""
        businesses = [
            {
                "name": "Test Business", 
                "succession_risk_score": 85,
                "market_context": {"market_maturity": "developing", "demographic_profile": "high_income"},
                "market_share_percent": 20
            }
        ]
        scored = self.service._assign_opportunity_scores_and_badges(businesses)
        assert scored[0]["opportunity_score"] > 60
        assert "High Opportunity" in scored[0]["badges"]


class TestAPIIntegrations:
    """Test API integrations and error handling"""
    
    @pytest.mark.asyncio
    async def test_serpapi_client_caching(self):
        """Test that SerpAPI client caches results correctly"""
        client = SerpAPIClient()
        
        # Mock the API call
        with patch('aiohttp.ClientSession.get') as mock_get:
            mock_response = AsyncMock()
            mock_response.status = 200
            mock_response.json = AsyncMock(return_value={"local_results": [{"name": "Test Business"}]})
            mock_get.return_value.__aenter__.return_value = mock_response
            
            # First call
            result1 = await client.search_businesses("San Francisco", "HVAC")
            # Second call (should use cache)
            result2 = await client.search_businesses("San Francisco", "HVAC")
            
            assert result1 == result2
            # Should only make one actual API call due to caching
            assert mock_get.call_count == 1
    
    @pytest.mark.asyncio
    async def test_dataaxle_api_error_handling(self):
        """Test that Data Axle API handles errors gracefully"""
        client = DataAxleAPI()
        
        # Mock a failed API call
        with patch('aiohttp.ClientSession.get') as mock_get:
            mock_response = AsyncMock()
            mock_response.status = 500
            mock_get.return_value.__aenter__.return_value = mock_response
            
            result = await client.search_businesses("San Francisco", "HVAC")
            assert result == []  # Should return empty list on error


class TestEnrichmentEngine:
    """Test data enrichment and Census API integration"""
    
    @pytest.mark.asyncio
    async def test_census_enrichment(self):
        """Test that Census data enrichment works correctly"""
        engine = EnrichmentEngine()
        
        # Mock Census API response
        with patch.object(engine.census_client, 'get_demographic_data') as mock_census:
            mock_census.return_value = CensusData(
                zip_code="94102",
                median_household_income=75000,
                population=30000,
                median_age=35.5,
                education_bachelor_plus_pct=45.0,
                unemployment_rate=3.5,
                per_capita_income=40000
            )
            
            # Create a mock business
            from app.processors.data_normalizer import AddressInfo, ContactInfo, BusinessMetrics
            mock_business = Mock(spec=NormalizedBusiness)
            mock_business.address = AddressInfo(zip_code="94102", street="123 Main St", city="SF", state="CA")
            
            result = await engine._enrich_with_census(mock_business)
            
            assert result.success == True
            assert result.enriched_data["demographic_data"]["median_household_income"] == 75000
            assert result.enriched_data["market_context"]["income_level"] in ["low", "medium", "high"]


class TestMarketMetrics:
    """Test market metrics calculation"""
    
    def setup_method(self):
        self.service = EnhancedMarketIntelligenceService()
    
    def test_market_metrics_calculation(self):
        """Test that market metrics are calculated correctly"""
        businesses = [
            {"estimated_revenue": 1000000, "employee_count": 10, "market_share_percent": 15},
            {"estimated_revenue": 2000000, "employee_count": 20, "market_share_percent": 25},
            {"estimated_revenue": 1500000, "employee_count": 15, "market_share_percent": 10}
        ]
        berkeley_data = {"industry_analysis": {"market_size": 50000000}}
        
        metrics = self.service._calculate_market_metrics(businesses, berkeley_data)
        
        assert metrics["avg_revenue_per_business"] == 1500000
        assert metrics["avg_employees_per_business"] == 15
        assert metrics["hhi_score"] == 15**2 + 25**2 + 10**2  # HHI calculation
        assert metrics["tam_estimate"] == 50000000
        assert metrics["sam_estimate"] == 5000000  # 10% of TAM
        assert metrics["som_estimate"] == 250000   # 5% of SAM


class TestEndToEndPipeline:
    """Test the complete business intelligence pipeline"""
    
    @pytest.mark.asyncio
    async def test_comprehensive_market_data_pipeline(self):
        """Test the complete pipeline from data collection to scoring"""
        service = EnhancedMarketIntelligenceService()
        
        # Mock all data collectors to return test data
        with patch.multiple(
            service,
            _get_yelp_data=AsyncMock(return_value=[{"name": "Test HVAC", "source": "yelp"}]),
            _get_google_maps_data=AsyncMock(return_value=[{"name": "Test HVAC Co", "source": "google"}]),
            _get_bizbuysell_data=AsyncMock(return_value=[]),
            _get_glencoco_data=AsyncMock(return_value=[]),
            _get_berkeley_data=AsyncMock(return_value={"industry_analysis": {"market_size": 10000000}}),
            _get_advanced_bizbuysell_data=AsyncMock(return_value=[]),
            _get_serpapi_data=AsyncMock(return_value=[]),
            _get_dataaxle_data=AsyncMock(return_value=[])
        ):
            # Mock signal detection
            with patch.object(service.advanced_scraper, 'get_comprehensive_signals', new_callable=AsyncMock) as mock_signals:
                mock_signals.return_value = {"total_signal_score": 75}
                
                result = await service.get_comprehensive_market_data("San Francisco", "HVAC")
                
                assert result["location"] == "San Francisco"
                assert result["industry"] == "hvac"
                assert len(result["businesses"]) == 1  # Should be deduplicated
                assert "opportunity_score" in result["businesses"][0]
                assert "badges" in result["businesses"][0]
                assert "market_metrics" in result


if __name__ == "__main__":
    # Run tests
    pytest.main([__file__, "-v"])

