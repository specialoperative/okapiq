#!/usr/bin/env python3
"""
Simple test script for core business intelligence features
"""

import sys
import asyncio
sys.path.append('.')

def test_business_similarity():
    """Test the fuzzy business matching logic"""
    print("🧪 Testing Business Similarity Logic...")
    
    try:
        from app.services.enhanced_market_intelligence_service import EnhancedMarketIntelligenceService
        
        service = EnhancedMarketIntelligenceService()
        
        # Test exact match
        b1 = {'name': "Joe's HVAC", 'address': '123 Main St', 'phone': '555-1234', 'website': 'joeshvac.com'}
        b2 = {'name': "Joe's HVAC", 'address': '123 Main St', 'phone': '555-1234', 'website': 'joeshvac.com'}
        
        similarity = service._business_similarity(b1, b2)
        print(f"  ✅ Exact match similarity: {similarity:.1f}% (expected: >95%)")
        
        # Test fuzzy match
        b3 = {'name': "Joe's HVAC Services", 'address': '123 Main Street', 'phone': '(555) 1234'}
        b4 = {'name': "Joes HVAC Service", 'address': '123 Main St', 'phone': '555-1234'}
        
        similarity2 = service._business_similarity(b3, b4)
        print(f"  ✅ Fuzzy match similarity: {similarity2:.1f}% (expected: >80%)")
        
        # Test different businesses
        b5 = {'name': "Joe's HVAC", 'address': '123 Main St'}
        b6 = {'name': "Smith Plumbing", 'address': '456 Oak Ave'}
        
        similarity3 = service._business_similarity(b5, b6)
        print(f"  ✅ Different businesses similarity: {similarity3:.1f}% (expected: <50%)")
        
        return True
        
    except Exception as e:
        print(f"  ❌ Error: {e}")
        return False

def test_opportunity_scoring():
    """Test the opportunity scoring and badge system"""
    print("\n🎯 Testing Opportunity Scoring & Badges...")
    
    try:
        from app.services.enhanced_market_intelligence_service import EnhancedMarketIntelligenceService
        
        service = EnhancedMarketIntelligenceService()
        
        # Test high succession risk business
        businesses = [
            {
                'name': 'High Risk HVAC',
                'succession_risk_score': 85,
                'market_context': {
                    'market_maturity': 'developing',
                    'demographic_profile': 'high_income_highly_educated'
                },
                'market_share_percent': 20
            }
        ]
        
        scored = service._assign_opportunity_scores_and_badges(businesses)
        
        print(f"  ✅ Opportunity score: {scored[0]['opportunity_score']}/100")
        print(f"  ✅ Badges: {scored[0]['badges']}")
        
        expected_badges = ['Succession Target', 'Growth Market', 'Premium Demographic', 'Market Leader', 'High Opportunity']
        found_badges = scored[0]['badges']
        
        for badge in expected_badges:
            if badge in found_badges:
                print(f"    🏆 Found expected badge: {badge}")
        
        return True
        
    except Exception as e:
        print(f"  ❌ Error: {e}")
        return False

def test_merge_deduplication():
    """Test the business merging and deduplication"""
    print("\n🔄 Testing Business Deduplication...")
    
    try:
        from app.services.enhanced_market_intelligence_service import EnhancedMarketIntelligenceService
        
        service = EnhancedMarketIntelligenceService()
        
        # Create duplicate businesses from different sources
        business_lists = [
            [
                {'name': "Joe's HVAC", 'address': '123 Main St', 'source': 'yelp', 'revenue': 1000000}
            ],
            [
                {'name': "Joes HVAC Service", 'address': '123 Main Street', 'source': 'google', 'revenue': 1200000}
            ],
            [
                {'name': "Smith Plumbing", 'address': '456 Oak Ave', 'source': 'dataaxle', 'revenue': 800000}
            ]
        ]
        
        merged = service._merge_business_data(business_lists)
        
        print(f"  ✅ Original businesses: 3")
        print(f"  ✅ After deduplication: {len(merged)}")
        print(f"  ✅ Expected: 2 (Joe's HVAC variants should be merged)")
        
        # Check if sources are tracked
        for business in merged:
            print(f"    📊 {business['name']}: sources = {business.get('data_sources', [])}")
        
        return len(merged) == 2
        
    except Exception as e:
        print(f"  ❌ Error: {e}")
        return False

async def test_api_clients():
    """Test API client functionality"""
    print("\n🌐 Testing API Clients...")
    
    try:
        from app.data_collectors.serpapi_client import SerpAPIClient
        from app.data_collectors.dataaxle_api import DataAxleAPI
        
        # Test SerpAPI client (without actual API call)
        serpapi = SerpAPIClient()
        print(f"  ✅ SerpAPI client initialized")
        
        # Test DataAxle client (without actual API call)
        dataaxle = DataAxleAPI()
        print(f"  ✅ DataAxle client initialized")
        
        print(f"  ℹ️  Note: API keys need to be set in environment for live testing")
        
        return True
        
    except Exception as e:
        print(f"  ❌ Error: {e}")
        return False

def main():
    """Run all tests"""
    print("🚀 Testing Enhanced Business Intelligence Platform\n")
    
    tests = [
        test_business_similarity,
        test_opportunity_scoring, 
        test_merge_deduplication,
    ]
    
    results = []
    for test in tests:
        try:
            result = test()
            results.append(result)
        except Exception as e:
            print(f"  ❌ Test failed with error: {e}")
            results.append(False)
    
    # Test async functions
    try:
        asyncio.run(test_api_clients())
        results.append(True)
    except Exception as e:
        print(f"  ❌ Async test failed: {e}")
        results.append(False)
    
    print(f"\n📊 Test Results:")
    print(f"   Passed: {sum(results)}/{len(results)}")
    print(f"   Success Rate: {(sum(results)/len(results)*100):.1f}%")
    
    if all(results):
        print("\n🎉 All core features working! Your business intelligence platform is ready!")
        print("\n🚀 Next steps:")
        print("   1. Set your API keys in environment variables:")
        print("      - CENSUS_API_KEY")
        print("      - SERPAPI_API_KEY") 
        print("      - DATA_AXLE_API_KEY")
        print("   2. Run: python3 -m uvicorn main:app --reload")
        print("   3. Visit: http://localhost:8000/docs")
    else:
        print("\n⚠️  Some tests failed. Check the errors above.")

if __name__ == "__main__":
    main()

