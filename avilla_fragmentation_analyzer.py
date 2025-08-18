"""
Avilla Partners - Market Fragmentation Analysis Tools
Calculates HHI, market concentration, and roll-up opportunities
"""

import pandas as pd
import numpy as np
from typing import Dict, List, Tuple, Optional
from dataclasses import dataclass
import json
import math

@dataclass
class MarketMetrics:
    """Market fragmentation metrics for a geographic area"""
    metro: str
    state: str
    total_firms: int
    hhi_index: float
    top5_share_pct: float
    top10_share_pct: float
    long_tail_firms: int  # Firms with <1% market share
    avg_firm_revenue: float
    market_size_millions: float
    fragmentation_score: float  # 0-100, higher = more fragmented
    roll_up_opportunity: str  # "High", "Medium", "Low"
    recommended_strategy: str

@dataclass
class FirmMarketShare:
    """Individual firm's market position"""
    name: str
    revenue_millions: float
    market_share_pct: float
    rank: int
    is_pe_backed: bool = False
    is_franchise: bool = False

class FragmentationAnalyzer:
    """Analyzes market fragmentation and identifies roll-up opportunities"""
    
    def __init__(self):
        self.hhi_thresholds = {
            "highly_concentrated": 0.25,  # HHI > 2500
            "moderately_concentrated": 0.15,  # HHI 1500-2500
            "fragmented": 0.0  # HHI < 1500
        }
    
    def calculate_hhi(self, market_shares: List[float]) -> float:
        """Calculate Herfindahl-Hirschman Index"""
        # Convert percentages to decimals and square them
        hhi = sum([(share/100)**2 for share in market_shares])
        return hhi
    
    def analyze_metro_market(self, metro_data: Dict) -> MarketMetrics:
        """Analyze fragmentation for a specific metro market"""
        
        # Extract firm data
        firms = metro_data.get("firms", [])
        total_firms = len(firms)
        
        if total_firms == 0:
            return self._empty_market_metrics(metro_data.get("metro", "Unknown"))
        
        # Calculate market shares
        total_revenue = sum([firm.get("revenue", 0) for firm in firms])
        market_shares = []
        firm_shares = []
        
        for i, firm in enumerate(sorted(firms, key=lambda x: x.get("revenue", 0), reverse=True)):
            revenue = firm.get("revenue", 0)
            market_share = (revenue / total_revenue * 100) if total_revenue > 0 else 0
            market_shares.append(market_share)
            
            firm_shares.append(FirmMarketShare(
                name=firm.get("name", f"Firm {i+1}"),
                revenue_millions=revenue / 1_000_000,
                market_share_pct=market_share,
                rank=i+1,
                is_pe_backed=firm.get("is_pe_backed", False),
                is_franchise=firm.get("is_franchise", False)
            ))
        
        # Calculate metrics
        hhi = self.calculate_hhi(market_shares)
        top5_share = sum(market_shares[:5])
        top10_share = sum(market_shares[:10])
        long_tail = len([share for share in market_shares if share < 1.0])
        avg_revenue = total_revenue / total_firms if total_firms > 0 else 0
        
        # Fragmentation scoring (0-100, higher = more fragmented)
        fragmentation_score = self._calculate_fragmentation_score(
            hhi, top5_share, long_tail, total_firms
        )
        
        # Roll-up opportunity assessment
        roll_up_opportunity, strategy = self._assess_rollup_opportunity(
            hhi, top5_share, fragmentation_score, total_firms, avg_revenue
        )
        
        return MarketMetrics(
            metro=metro_data.get("metro", "Unknown"),
            state=metro_data.get("state", "Unknown"),
            total_firms=total_firms,
            hhi_index=hhi,
            top5_share_pct=top5_share,
            top10_share_pct=top10_share,
            long_tail_firms=long_tail,
            avg_firm_revenue=avg_revenue,
            market_size_millions=total_revenue / 1_000_000,
            fragmentation_score=fragmentation_score,
            roll_up_opportunity=roll_up_opportunity,
            recommended_strategy=strategy
        )
    
    def _calculate_fragmentation_score(self, hhi: float, top5_share: float, 
                                     long_tail: int, total_firms: int) -> float:
        """Calculate composite fragmentation score (0-100)"""
        score = 0
        
        # HHI component (40% weight) - lower HHI = higher fragmentation
        if hhi < 0.10:
            score += 40
        elif hhi < 0.15:
            score += 30
        elif hhi < 0.25:
            score += 20
        else:
            score += 10
        
        # Top 5 concentration (30% weight) - lower concentration = higher fragmentation
        if top5_share < 20:
            score += 30
        elif top5_share < 35:
            score += 25
        elif top5_share < 50:
            score += 15
        else:
            score += 5
        
        # Long tail presence (20% weight)
        long_tail_pct = (long_tail / total_firms * 100) if total_firms > 0 else 0
        if long_tail_pct > 80:
            score += 20
        elif long_tail_pct > 60:
            score += 15
        elif long_tail_pct > 40:
            score += 10
        else:
            score += 5
        
        # Market size factor (10% weight) - more firms = more fragmented
        if total_firms > 100:
            score += 10
        elif total_firms > 50:
            score += 8
        elif total_firms > 25:
            score += 6
        else:
            score += 3
        
        return min(score, 100)
    
    def _assess_rollup_opportunity(self, hhi: float, top5_share: float, 
                                 fragmentation_score: float, total_firms: int,
                                 avg_revenue: float) -> Tuple[str, str]:
        """Assess roll-up opportunity and recommend strategy"""
        
        # High opportunity conditions
        if (fragmentation_score > 70 and total_firms > 50 and 
            avg_revenue > 1_000_000 and top5_share < 25):
            return "High", "Aggressive roll-up strategy. Target 8-12 firms for platform + add-ons."
        
        # Medium-high opportunity
        elif (fragmentation_score > 60 and total_firms > 30 and
              avg_revenue > 750_000 and top5_share < 35):
            return "Medium-High", "Selective roll-up. Build around 2-3 anchor acquisitions."
        
        # Medium opportunity
        elif (fragmentation_score > 45 and total_firms > 20 and
              avg_revenue > 500_000):
            return "Medium", "Platform + bolt-on strategy. Focus on market leaders."
        
        # Low-medium opportunity
        elif fragmentation_score > 30:
            return "Low-Medium", "Selective acquisitions. Target niche specialists or distressed assets."
        
        # Low opportunity
        else:
            return "Low", "Market too concentrated. Consider adjacent markets or wait for disruption."
    
    def _empty_market_metrics(self, metro: str) -> MarketMetrics:
        """Return empty metrics for markets with no data"""
        return MarketMetrics(
            metro=metro,
            state="Unknown",
            total_firms=0,
            hhi_index=0.0,
            top5_share_pct=0.0,
            top10_share_pct=0.0,
            long_tail_firms=0,
            avg_firm_revenue=0.0,
            market_size_millions=0.0,
            fragmentation_score=0.0,
            roll_up_opportunity="No Data",
            recommended_strategy="Insufficient market data for analysis"
        )
    
    def compare_markets(self, markets: List[MarketMetrics]) -> pd.DataFrame:
        """Compare fragmentation metrics across multiple markets"""
        data = []
        
        for market in markets:
            data.append({
                "Metro": market.metro,
                "State": market.state,
                "Total Firms": market.total_firms,
                "HHI Index": round(market.hhi_index, 3),
                "Top 5 Share %": round(market.top5_share_pct, 1),
                "Fragmentation Score": round(market.fragmentation_score, 1),
                "Market Size ($M)": round(market.market_size_millions, 1),
                "Avg Firm Revenue ($M)": round(market.avg_firm_revenue / 1_000_000, 2),
                "Roll-up Opportunity": market.roll_up_opportunity,
                "Strategy": market.recommended_strategy
            })
        
        df = pd.DataFrame(data)
        return df.sort_values("Fragmentation Score", ascending=False)
    
    def generate_market_report(self, market: MarketMetrics) -> str:
        """Generate detailed market analysis report"""
        
        report = f"""
# Market Fragmentation Analysis: {market.metro}, {market.state}

## Executive Summary
- **Total Market Size**: ${market.market_size_millions:.1f}M across {market.total_firms} firms
- **Fragmentation Score**: {market.fragmentation_score:.1f}/100
- **Roll-up Opportunity**: {market.roll_up_opportunity}
- **HHI Index**: {market.hhi_index:.3f}

## Market Structure
- **Top 5 Concentration**: {market.top5_share_pct:.1f}% market share
- **Top 10 Concentration**: {market.top10_share_pct:.1f}% market share  
- **Long Tail Firms**: {market.long_tail_firms} firms with <1% market share
- **Average Firm Revenue**: ${market.avg_firm_revenue/1_000_000:.2f}M

## Fragmentation Assessment
"""
        
        # Add interpretation based on HHI
        if market.hhi_index < 0.15:
            report += "- **Highly Fragmented**: Low concentration creates strong roll-up opportunities\n"
        elif market.hhi_index < 0.25:
            report += "- **Moderately Fragmented**: Some concentration but room for consolidation\n"
        else:
            report += "- **Concentrated**: Market dominated by larger players\n"
        
        # Add opportunity assessment
        report += f"""
## Investment Strategy
{market.recommended_strategy}

## Key Metrics Interpretation
- **HHI < 0.15**: Highly fragmented (excellent for roll-ups)
- **Top 5 Share < 25%**: Low concentration (good consolidation opportunity)  
- **Fragmentation Score > 70**: Prime roll-up target
- **Long Tail > 50 firms**: Ample acquisition targets available

## Risk Factors
"""
        
        if market.avg_firm_revenue < 1_000_000:
            report += "- Small average firm size may limit quality targets\n"
        if market.total_firms < 30:
            report += "- Limited number of acquisition targets\n"
        if market.top5_share_pct > 50:
            report += "- High concentration may indicate competitive barriers\n"
        
        return report

class ZipCodeAnalyzer:
    """Analyzes fragmentation at the zip code level"""
    
    def __init__(self):
        self.fragmentation_analyzer = FragmentationAnalyzer()
    
    def analyze_zip_clusters(self, zip_data: pd.DataFrame) -> Dict[str, List[Dict]]:
        """Identify high-opportunity zip code clusters"""
        
        # Define criteria for high-opportunity zips
        high_opportunity = zip_data[
            (zip_data['deal_score'] >= 75) &
            (zip_data['wealth_index'] >= 70) &
            (zip_data['firms_count'] >= 15) &
            (zip_data['succession_risk_pct'] >= 35)
        ]
        
        # Group by metro area
        clusters = {}
        for metro in high_opportunity['metro'].unique():
            metro_zips = high_opportunity[high_opportunity['metro'] == metro]
            
            clusters[metro] = []
            for _, row in metro_zips.iterrows():
                clusters[metro].append({
                    'zip': row['zip'],
                    'city': row['city'], 
                    'firms_count': row['firms_count'],
                    'deal_score': row['deal_score'],
                    'wealth_index': row['wealth_index'],
                    'succession_risk_pct': row['succession_risk_pct'],
                    'formation_rate_per_1k': row['formation_rate_per_1k']
                })
            
            # Sort by deal score
            clusters[metro] = sorted(clusters[metro], 
                                   key=lambda x: x['deal_score'], reverse=True)
        
        return clusters
    
    def calculate_zip_fragmentation(self, zip_code: str, firms_in_zip: List[Dict]) -> Dict:
        """Calculate fragmentation metrics for a specific zip code"""
        
        if not firms_in_zip:
            return {
                'zip_code': zip_code,
                'fragmentation_score': 0,
                'firm_count': 0,
                'hhi_index': 0,
                'opportunity': 'No Data'
            }
        
        # Calculate market shares within zip
        total_revenue = sum([firm.get('revenue', 0) for firm in firms_in_zip])
        market_shares = []
        
        for firm in firms_in_zip:
            revenue = firm.get('revenue', 0)
            share = (revenue / total_revenue * 100) if total_revenue > 0 else 0
            market_shares.append(share)
        
        hhi = self.fragmentation_analyzer.calculate_hhi(market_shares)
        
        # Zip-level fragmentation scoring
        firm_count = len(firms_in_zip)
        fragmentation_score = 0
        
        if firm_count > 20:
            fragmentation_score += 30
        elif firm_count > 10:
            fragmentation_score += 20
        elif firm_count > 5:
            fragmentation_score += 10
        
        if hhi < 0.20:
            fragmentation_score += 40
        elif hhi < 0.35:
            fragmentation_score += 25
        else:
            fragmentation_score += 10
        
        # Revenue distribution factor
        avg_revenue = total_revenue / firm_count if firm_count > 0 else 0
        if 500_000 <= avg_revenue <= 3_000_000:
            fragmentation_score += 20
        elif avg_revenue > 3_000_000:
            fragmentation_score += 15
        else:
            fragmentation_score += 10
        
        # Opportunity assessment
        if fragmentation_score >= 70:
            opportunity = "High - Multiple acquisition targets"
        elif fragmentation_score >= 50:
            opportunity = "Medium - Selective acquisitions"
        elif fragmentation_score >= 30:
            opportunity = "Low - Limited targets"
        else:
            opportunity = "Minimal - Avoid or wait"
        
        return {
            'zip_code': zip_code,
            'fragmentation_score': min(fragmentation_score, 100),
            'firm_count': firm_count,
            'hhi_index': hhi,
            'avg_firm_revenue': avg_revenue,
            'total_market_size': total_revenue,
            'opportunity': opportunity
        }

# Example usage and testing
def demo_fragmentation_analysis():
    """Demonstrate fragmentation analysis with sample data"""
    
    # Sample market data
    boston_market = {
        "metro": "Boston",
        "state": "MA",
        "firms": [
            {"name": "Big Accounting Corp", "revenue": 15_000_000, "is_pe_backed": True},
            {"name": "Regional CPA Firm", "revenue": 8_000_000},
            {"name": "Local Tax Services", "revenue": 3_000_000},
            {"name": "Small Business Accounting", "revenue": 2_500_000},
            {"name": "Family CPA Practice", "revenue": 1_800_000},
            # Add many small firms
            *[{"name": f"Small Firm {i}", "revenue": np.random.randint(500_000, 2_000_000)} 
              for i in range(1, 45)]
        ]
    }
    
    analyzer = FragmentationAnalyzer()
    boston_metrics = analyzer.analyze_metro_market(boston_market)
    
    print("Boston Market Analysis:")
    print(f"- Fragmentation Score: {boston_metrics.fragmentation_score:.1f}/100")
    print(f"- HHI Index: {boston_metrics.hhi_index:.3f}")
    print(f"- Roll-up Opportunity: {boston_metrics.roll_up_opportunity}")
    print(f"- Strategy: {boston_metrics.recommended_strategy}")
    
    # Generate full report
    report = analyzer.generate_market_report(boston_metrics)
    print("\n" + "="*50)
    print(report)

if __name__ == "__main__":
    demo_fragmentation_analysis()
