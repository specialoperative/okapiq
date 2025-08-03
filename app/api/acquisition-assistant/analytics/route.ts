import { NextRequest, NextResponse } from 'next/server';
import { acquisitionAssistant } from '@/services/acquisition-assistant';
import { Deal, DealStage } from '@/services/acquisition-assistant';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    switch (type) {
      case 'pipeline':
        const deals = acquisitionAssistant.getAllDeals();
        const pipelineAnalytics = generatePipelineAnalytics(deals);
        return NextResponse.json(pipelineAnalytics);

      case 'decay':
        const decayAnalytics = generateDecayAnalytics(deals);
        return NextResponse.json(decayAnalytics);

      case 'performance':
        const performanceMetrics = generatePerformanceMetrics(deals);
        return NextResponse.json(performanceMetrics);

      case 'forecasting':
        const forecastData = generateForecastData(deals);
        return NextResponse.json(forecastData);

      default:
        return NextResponse.json({ error: 'Invalid analytics type' }, { status: 400 });
    }
  } catch (error) {
    console.error('Analytics API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function generatePipelineAnalytics(deals: Deal[]) {
  const stageDistribution: Record<DealStage, number> = {
    'Lead': 0,
    'Initial Contact': 0,
    'NDA Signed': 0,
    'LOI Submitted': 0,
    'LOI Accepted': 0,
    'Due Diligence': 0,
    'Final Negotiations': 0,
    'Closing': 0,
    'Closed': 0,
    'Dead': 0
  };

  let totalValue = 0;
  let avgIRR = 0;
  let avgTimeToClose = 0;

  deals.forEach(deal => {
    stageDistribution[deal.stage]++;
    totalValue += deal.financials.currentValuation;
    avgIRR += deal.scoring.irr;
    avgTimeToClose += deal.scoring.timeToClose;
  });

  const dealCount = deals.length;
  avgIRR = dealCount > 0 ? avgIRR / dealCount : 0;
  avgTimeToClose = dealCount > 0 ? avgTimeToClose / dealCount : 0;

  // Calculate conversion rates
  const conversionRates = calculateConversionRates(deals);

  // Calculate velocity metrics
  const velocityMetrics = calculateVelocityMetrics(deals);

  return {
    summary: {
      totalDeals: dealCount,
      totalValue: totalValue,
      avgIRR: Math.round(avgIRR * 100) / 100,
      avgTimeToClose: Math.round(avgTimeToClose),
      closedDeals: stageDistribution['Closed'],
      activeDeals: dealCount - stageDistribution['Closed'] - stageDistribution['Dead']
    },
    stageDistribution,
    conversionRates,
    velocityMetrics,
    trends: generateTrendData(deals)
  };
}

function generateDecayAnalytics(deals: Deal[]) {
  const decayScores = deals.map(deal => ({
    dealId: deal.id,
    companyName: deal.targetCompany.name,
    stage: deal.stage,
    decayScore: acquisitionAssistant.trackDealDecay(deal),
    daysSinceContact: Math.floor((Date.now() - deal.lastContact.getTime()) / (1000 * 60 * 60 * 24)),
    avgResponseRate: deal.contacts.reduce((sum, c) => sum + c.responseRate, 0) / deal.contacts.length || 0,
    avgSentiment: deal.contacts.reduce((sum, c) => sum + c.sentimentScore, 0) / deal.contacts.length || 0
  }));

  // Sort by decay score (highest risk first)
  decayScores.sort((a, b) => b.decayScore - a.decayScore);

  const riskCategories = {
    high: decayScores.filter(d => d.decayScore > 70).length,
    medium: decayScores.filter(d => d.decayScore > 40 && d.decayScore <= 70).length,
    low: decayScores.filter(d => d.decayScore <= 40).length
  };

  return {
    overview: {
      totalDeals: decayScores.length,
      avgDecayScore: decayScores.reduce((sum, d) => sum + d.decayScore, 0) / decayScores.length || 0,
      riskCategories
    },
    detailedScores: decayScores,
    recommendations: generateDecayRecommendations(decayScores)
  };
}

function generatePerformanceMetrics(deals: Deal[]) {
  const closedDeals = deals.filter(d => d.stage === 'Closed');
  const activeDeals = deals.filter(d => d.stage !== 'Closed' && d.stage !== 'Dead');

  const metrics = {
    closingRate: deals.length > 0 ? (closedDeals.length / deals.length) * 100 : 0,
    avgDealSize: closedDeals.length > 0 ? 
      closedDeals.reduce((sum, d) => sum + d.financials.currentValuation, 0) / closedDeals.length : 0,
    avgIRR: closedDeals.length > 0 ?
      closedDeals.reduce((sum, d) => sum + d.scoring.irr, 0) / closedDeals.length : 0,
    totalSynergies: closedDeals.reduce((sum, d) => sum + d.financials.synergies.totalValue, 0),
    avgTimeToClose: closedDeals.length > 0 ?
      closedDeals.reduce((sum, d) => sum + d.scoring.timeToClose, 0) / closedDeals.length : 0
  };

  // Industry performance comparison
  const industryMetrics = generateIndustryComparison(deals);

  // Top performers
  const topDeals = [...closedDeals]
    .sort((a, b) => b.scoring.irr - a.scoring.irr)
    .slice(0, 5)
    .map(deal => ({
      companyName: deal.targetCompany.name,
      industry: deal.targetCompany.industry,
      irr: deal.scoring.irr,
      dealValue: deal.financials.currentValuation,
      timeToClose: deal.scoring.timeToClose
    }));

  return {
    metrics,
    industryMetrics,
    topDeals,
    quarterlyTrends: generateQuarterlyTrends(deals)
  };
}

function generateForecastData(deals: Deal[]) {
  const activeDeals = deals.filter(d => d.stage !== 'Closed' && d.stage !== 'Dead');
  
  // Predict closure probability based on stage and metrics
  const forecasts = activeDeals.map(deal => {
    const stageMultiplier = getStageMultiplier(deal.stage);
    const decayScore = acquisitionAssistant.trackDealDecay(deal);
    const baseProbability = stageMultiplier * (1 - decayScore / 100) * 0.8;
    
    return {
      dealId: deal.id,
      companyName: deal.targetCompany.name,
      currentStage: deal.stage,
      estimatedCloseDate: new Date(Date.now() + deal.scoring.timeToClose * 24 * 60 * 60 * 1000),
      closureProbability: Math.max(0.1, Math.min(0.95, baseProbability)),
      expectedValue: deal.financials.currentValuation * baseProbability,
      riskFactors: deal.scoring.riskFactors
    };
  });

  // Aggregate forecast
  const totalExpectedValue = forecasts.reduce((sum, f) => sum + f.expectedValue, 0);
  const avgClosureProbability = forecasts.reduce((sum, f) => sum + f.closureProbability, 0) / forecasts.length || 0;

  return {
    summary: {
      activeDeals: forecasts.length,
      totalExpectedValue,
      avgClosureProbability: Math.round(avgClosureProbability * 100),
      expectedClosures30Days: forecasts.filter(f => 
        f.estimatedCloseDate <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      ).length
    },
    forecasts: forecasts.sort((a, b) => b.closureProbability - a.closureProbability),
    monthlyProjections: generateMonthlyProjections(forecasts)
  };
}

// Helper functions
function calculateConversionRates(deals: Deal[]) {
  const stages = ['Lead', 'Initial Contact', 'NDA Signed', 'LOI Submitted', 'LOI Accepted', 'Due Diligence', 'Final Negotiations', 'Closing', 'Closed'];
  const conversions: Record<string, number> = {};

  for (let i = 0; i < stages.length - 1; i++) {
    const currentStage = stages[i];
    const nextStage = stages[i + 1];
    
    const currentCount = deals.filter(d => d.stage === currentStage).length;
    const nextCount = deals.filter(d => stages.indexOf(d.stage) > i).length;
    
    conversions[`${currentStage} to ${nextStage}`] = currentCount > 0 ? (nextCount / currentCount) * 100 : 0;
  }

  return conversions;
}

function calculateVelocityMetrics(deals: Deal[]) {
  const closedDeals = deals.filter(d => d.stage === 'Closed');
  
  if (closedDeals.length === 0) {
    return { avgDaysToClose: 0, fastestDeal: 0, slowestDeal: 0 };
  }

  const daysToClosure = closedDeals.map(deal => 
    Math.floor((Date.now() - deal.createdAt.getTime()) / (1000 * 60 * 60 * 24))
  );

  return {
    avgDaysToClose: daysToClosure.reduce((sum, days) => sum + days, 0) / daysToClosure.length,
    fastestDeal: Math.min(...daysToClosure),
    slowestDeal: Math.max(...daysToClosure)
  };
}

function generateTrendData(deals: Deal[]) {
  // Group deals by month for trend analysis
  const monthlyData: Record<string, { created: number; closed: number; value: number }> = {};
  
  deals.forEach(deal => {
    const month = deal.createdAt.toISOString().slice(0, 7); // YYYY-MM format
    if (!monthlyData[month]) {
      monthlyData[month] = { created: 0, closed: 0, value: 0 };
    }
    monthlyData[month].created++;
    
    if (deal.stage === 'Closed') {
      monthlyData[month].closed++;
      monthlyData[month].value += deal.financials.currentValuation;
    }
  });

  return Object.entries(monthlyData)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, data]) => ({ month, ...data }));
}

function generateIndustryComparison(deals: Deal[]) {
  const industries: Record<string, { count: number; avgIRR: number; avgMultiple: number }> = {};
  
  deals.forEach(deal => {
    const industry = deal.targetCompany.industry;
    if (!industries[industry]) {
      industries[industry] = { count: 0, avgIRR: 0, avgMultiple: 0 };
    }
    industries[industry].count++;
    industries[industry].avgIRR += deal.scoring.irr;
    industries[industry].avgMultiple += deal.financials.targetMultiple;
  });

  // Calculate averages
  Object.values(industries).forEach(industry => {
    industry.avgIRR = industry.avgIRR / industry.count;
    industry.avgMultiple = industry.avgMultiple / industry.count;
  });

  return industries;
}

function generateQuarterlyTrends(deals: Deal[]) {
  const quarterly: Record<string, { deals: number; value: number; avgIRR: number }> = {};
  
  deals.forEach(deal => {
    const quarter = `${deal.createdAt.getFullYear()}-Q${Math.floor(deal.createdAt.getMonth() / 3) + 1}`;
    if (!quarterly[quarter]) {
      quarterly[quarter] = { deals: 0, value: 0, avgIRR: 0 };
    }
    quarterly[quarter].deals++;
    quarterly[quarter].value += deal.financials.currentValuation;
    quarterly[quarter].avgIRR += deal.scoring.irr;
  });

  Object.values(quarterly).forEach(q => {
    q.avgIRR = q.avgIRR / q.deals;
  });

  return quarterly;
}

function generateDecayRecommendations(decayScores: any[]) {
  const recommendations = [];
  
  decayScores.forEach(deal => {
    if (deal.decayScore > 70) {
      recommendations.push({
        dealId: deal.dealId,
        priority: 'HIGH',
        action: 'Immediate follow-up required',
        reason: `High decay score (${deal.decayScore})`
      });
    } else if (deal.daysSinceContact > 14) {
      recommendations.push({
        dealId: deal.dealId,
        priority: 'MEDIUM',
        action: 'Schedule follow-up call',
        reason: `No contact for ${deal.daysSinceContact} days`
      });
    } else if (deal.avgResponseRate < 0.3) {
      recommendations.push({
        dealId: deal.dealId,
        priority: 'MEDIUM',
        action: 'Review outreach strategy',
        reason: `Low response rate (${Math.round(deal.avgResponseRate * 100)}%)`
      });
    }
  });

  return recommendations;
}

function getStageMultiplier(stage: DealStage): number {
  const multipliers: Record<DealStage, number> = {
    'Lead': 0.1,
    'Initial Contact': 0.2,
    'NDA Signed': 0.4,
    'LOI Submitted': 0.6,
    'LOI Accepted': 0.8,
    'Due Diligence': 0.85,
    'Final Negotiations': 0.9,
    'Closing': 0.95,
    'Closed': 1.0,
    'Dead': 0.0
  };
  return multipliers[stage] || 0.1;
}

function generateMonthlyProjections(forecasts: any[]) {
  const projections = [];
  const now = new Date();
  
  for (let i = 0; i < 12; i++) {
    const month = new Date(now.getFullYear(), now.getMonth() + i, 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + i + 1, 0);
    
    const monthForecasts = forecasts.filter(f => 
      f.estimatedCloseDate >= month && f.estimatedCloseDate <= monthEnd
    );
    
    projections.push({
      month: month.toISOString().slice(0, 7),
      expectedClosures: monthForecasts.length,
      expectedValue: monthForecasts.reduce((sum, f) => sum + f.expectedValue, 0),
      avgProbability: monthForecasts.reduce((sum, f) => sum + f.closureProbability, 0) / monthForecasts.length || 0
    });
  }
  
  return projections;
}