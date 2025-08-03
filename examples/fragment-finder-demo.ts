/**
 * Fragment Finder Agent Demo
 * 
 * Demonstrates how to use the Fragment Finder Agent to analyze
 * market fragmentation and identify rollup opportunities
 */

import { FragmentFinderAgent } from '../services/fragment-finder-agent';
import { FragmentationAnalysis } from '../types/fragment-finder';

async function runFragmentFinderDemo() {
  console.log('🧠 Fragment Finder Agent Demo');
  console.log('===============================\n');

  const agent = new FragmentFinderAgent();

  // Demo scenarios
  const scenarios = [
    {
      zip: '90210',
      industry: 'restaurants',
      description: 'Beverly Hills Restaurant Market'
    },
    {
      zip: '10001',
      industry: 'auto repair',
      description: 'NYC Auto Repair Market'
    },
    {
      zip: '60601',
      industry: 'hair salons',
      description: 'Chicago Hair Salon Market'
    },
    {
      zip: '33101',
      industry: 'plumbing',
      description: 'Miami Plumbing Market'
    }
  ];

  for (const scenario of scenarios) {
    console.log(`\n📍 Analyzing: ${scenario.description}`);
    console.log(`   ZIP: ${scenario.zip}, Industry: ${scenario.industry}`);
    console.log('   ' + '='.repeat(50));

    try {
      const startTime = Date.now();
      
      // Run the analysis
      const analysis = await agent.analyzeFragmentation(
        scenario.zip,
        scenario.industry,
        {
          includeEntropy: true,
          maxBusinesses: 100,
          includeNLPAnalysis: true
        }
      );

      const processingTime = Date.now() - startTime;

      // Display results
      displayAnalysisResults(analysis, processingTime);

    } catch (error) {
      console.error(`   ❌ Error analyzing ${scenario.description}:`, error.message);
    }

    console.log('\n' + '='.repeat(70));
  }

  console.log('\n✅ Demo completed successfully!');
}

function displayAnalysisResults(analysis: FragmentationAnalysis, processingTime: number) {
  console.log(`\n   ⏱️  Processing Time: ${processingTime}ms`);
  console.log(`   📊 Businesses Analyzed: ${analysis.totalBusinessesAnalyzed}`);
  console.log(`   📈 Data Quality Score: ${(analysis.dataQuality * 100).toFixed(1)}%\n`);

  // Market Metrics
  console.log('   📋 MARKET METRICS:');
  console.log(`   • Total Businesses: ${analysis.marketMetrics.totalBusinesses}`);
  console.log(`   • Average Revenue: $${analysis.marketMetrics.averageRevenue.toLocaleString()}`);
  console.log(`   • Median Revenue: $${analysis.marketMetrics.medianRevenue.toLocaleString()}`);
  console.log(`   • Average Employees: ${analysis.marketMetrics.averageEmployees.toFixed(1)}`);
  console.log(`   • Average Business Age: ${analysis.marketMetrics.averageBusinessAge.toFixed(1)} years`);
  console.log(`   • Top 5 Market Share: ${analysis.marketMetrics.top5MarketShare.toFixed(1)}%`);

  // Fragmentation Analysis
  console.log('\n   🔍 FRAGMENTATION ANALYSIS:');
  console.log(`   • HHI (Market Concentration): ${analysis.hhi}`);
  console.log(`   • Mom-and-Pop Density: ${(analysis.momPopDensity * 100).toFixed(1)}%`);
  console.log(`   • Base Consolidation Score: ${analysis.baseConsolidationScore.toFixed(1)}`);
  console.log(`   • Adjusted Consolidation Score: ${analysis.adjustedConsolidationScore.toFixed(1)}`);

  // Consolidation Assessment
  const consolidationLevel = getConsolidationLevel(analysis.adjustedConsolidationScore);
  console.log(`   • Consolidation Opportunity: ${consolidationLevel.emoji} ${consolidationLevel.level}`);

  // Entropy Metrics (if available)
  if (analysis.entropyMetrics) {
    console.log('\n   🌀 CHAOS & ENTROPY METRICS:');
    console.log(`   • Market Entropy: ${(analysis.entropyMetrics.marketEntropy * 100).toFixed(1)}%`);
    console.log(`   • Pricing Volatility: ${(analysis.entropyMetrics.pricingVolatility * 100).toFixed(1)}%`);
    console.log(`   • Quality Variance: ${(analysis.entropyMetrics.qualityVariance * 100).toFixed(1)}%`);
    console.log(`   • Geographic Dispersion: ${(analysis.entropyMetrics.geographicDispersion * 100).toFixed(1)}%`);
    console.log(`   • Temporal Instability: ${(analysis.entropyMetrics.temporalInstability * 100).toFixed(1)}%`);
    console.log(`   • Competitive Intensity: ${(analysis.entropyMetrics.competitiveIntensity * 100).toFixed(1)}%`);
  }

  // Chaos Indicators (if available)
  if (analysis.chaosIndicators) {
    console.log('\n   ⚠️  CHAOS INDICATORS:');
    console.log(`   • Chaotic Actors: ${analysis.chaosIndicators.chaoticActorCount} (${(analysis.chaosIndicators.chaoticActorRatio * 100).toFixed(1)}%)`);
    console.log(`   • Average Chaos Score: ${(analysis.chaosIndicators.averageChaosScore * 100).toFixed(1)}%`);
  }

  // Top Consolidation Targets
  console.log('\n   🎯 TOP CONSOLIDATION TARGETS:');
  const topTargets = analysis.topTargets.slice(0, 5); // Show top 5
  topTargets.forEach((target, index) => {
    console.log(`   ${index + 1}. ${target.name}`);
    console.log(`      • Consolidation Score: ${(target.consolidationScore * 100).toFixed(1)}%`);
    console.log(`      • Exit Risk: ${(target.exitRisk * 100).toFixed(1)}%`);
    console.log(`      • Strategic Value: ${(target.strategicValue * 100).toFixed(1)}%`);
    console.log(`      • Est. Revenue: $${(target.estimatedRevenue || 0).toLocaleString()}`);
    console.log(`      • Est. Acquisition Cost: $${(target.estimatedAcquisitionCost || 0).toLocaleString()}`);
    console.log(`      • Potential Synergies: $${(target.potentialSynergies || 0).toLocaleString()}`);
    if (index < topTargets.length - 1) console.log('');
  });

  // Financial Projections
  console.log('\n   💰 FINANCIAL PROJECTIONS:');
  console.log(`   • Total Acquisition Cost: $${analysis.financialProjections.totalAcquisitionCost.toLocaleString()}`);
  console.log(`   • Total Synergies: $${analysis.financialProjections.totalSynergies.toLocaleString()}`);
  console.log(`   • Total Revenue: $${analysis.financialProjections.totalRevenue.toLocaleString()}`);
  console.log(`   • Estimated Payback Period: ${analysis.financialProjections.estimatedPaybackPeriod} years`);
  console.log(`   • Projected ROI: ${analysis.financialProjections.projectedROI.toFixed(1)}%`);
  console.log(`   • Market Share Gain: ${(analysis.financialProjections.marketShareGain * 100).toFixed(1)}%`);
  console.log(`   • Risk-Adjusted Return: ${(analysis.financialProjections.riskAdjustedReturn * 100).toFixed(1)}%`);

  // Recommendations
  console.log('\n   💡 RECOMMENDATIONS:');
  analysis.recommendations.forEach(rec => {
    console.log(`   ${rec}`);
  });
}

function getConsolidationLevel(score: number): { level: string; emoji: string } {
  if (score >= 70) return { level: 'Excellent', emoji: '🟢' };
  if (score >= 50) return { level: 'Good', emoji: '🟡' };
  if (score >= 30) return { level: 'Moderate', emoji: '🟠' };
  return { level: 'Limited', emoji: '🔴' };
}

// Example of how to use the API programmatically
async function apiExample() {
  console.log('\n🌐 API Usage Example');
  console.log('====================\n');

  const apiUrl = 'http://localhost:3000/api/fragment-finder';
  
  const requestBody = {
    zip: '90210',
    industry: 'restaurants',
    options: {
      includeEntropy: true,
      maxBusinesses: 50,
      includeNLPAnalysis: true
    }
  };

  console.log('📤 Request:');
  console.log(`POST ${apiUrl}`);
  console.log(JSON.stringify(requestBody, null, 2));

  try {
    // Note: This would require fetch or axios in a real environment
    console.log('\n📥 Response would contain:');
    console.log('• success: boolean');
    console.log('• data: FragmentationAnalysis');
    console.log('• metadata: { processingTime, dataSourcesUsed, cacheUsed }');
    
  } catch (error) {
    console.error('API Error:', error);
  }
}

// Example of batch analysis
async function batchAnalysisExample() {
  console.log('\n📊 Batch Analysis Example');
  console.log('==========================\n');

  const agent = new FragmentFinderAgent();
  
  const markets = [
    { zip: '90210', industry: 'restaurants' },
    { zip: '10001', industry: 'auto repair' },
    { zip: '60601', industry: 'hair salons' }
  ];

  console.log('Analyzing multiple markets simultaneously...\n');

  try {
    const analyses = await Promise.all(
      markets.map(market => 
        agent.analyzeFragmentation(market.zip, market.industry, { maxBusinesses: 50 })
      )
    );

    // Compare consolidation scores
    console.log('📈 Consolidation Score Comparison:');
    analyses.forEach((analysis, index) => {
      const market = markets[index];
      console.log(`• ${market.industry} in ${market.zip}: ${analysis.adjustedConsolidationScore.toFixed(1)}`);
    });

    // Find best opportunity
    const bestOpportunity = analyses.reduce((best, current, index) => 
      current.adjustedConsolidationScore > best.score 
        ? { analysis: current, market: markets[index], score: current.adjustedConsolidationScore }
        : best
    , { analysis: analyses[0], market: markets[0], score: analyses[0].adjustedConsolidationScore });

    console.log(`\n🏆 Best Opportunity: ${bestOpportunity.market.industry} in ${bestOpportunity.market.zip}`);
    console.log(`   Score: ${bestOpportunity.score.toFixed(1)}`);
    console.log(`   Top Target: ${bestOpportunity.analysis.topTargets[0]?.name || 'N/A'}`);

  } catch (error) {
    console.error('Batch analysis error:', error);
  }
}

// Run the demo
if (require.main === module) {
  runFragmentFinderDemo()
    .then(() => apiExample())
    .then(() => batchAnalysisExample())
    .catch(console.error);
}

export { runFragmentFinderDemo, apiExample, batchAnalysisExample };