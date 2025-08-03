'use client';

/**
 * Fragment Finder UI Component
 * 
 * React component for interacting with the Fragment Finder Agent
 */

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FragmentationAnalysis, ConsolidationTarget } from '@/types/fragment-finder';

export function FragmentFinderUI() {
  const [zip, setZip] = useState('');
  const [industry, setIndustry] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<FragmentationAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  const industries = [
    'restaurants',
    'auto repair',
    'hair salons',
    'plumbing',
    'dental practices',
    'veterinary clinics',
    'dry cleaning',
    'fitness centers',
    'home improvement',
    'landscaping'
  ];

  const handleAnalyze = async () => {
    if (!zip || !industry) {
      setError('Please enter both ZIP code and industry');
      return;
    }

    setLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const response = await fetch('/api/fragment-finder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          zip,
          industry,
          options: {
            includeEntropy: true,
            maxBusinesses: 200,
            includeNLPAnalysis: true
          }
        }),
      });

      const result = await response.json();

      if (result.success) {
        setAnalysis(result.data);
      } else {
        setError(result.error || 'Analysis failed');
      }
    } catch (err) {
      setError('Failed to connect to the analysis service');
    } finally {
      setLoading(false);
    }
  };

  const getConsolidationColor = (score: number) => {
    if (score >= 70) return 'bg-green-500';
    if (score >= 50) return 'bg-yellow-500';
    if (score >= 30) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getConsolidationLevel = (score: number) => {
    if (score >= 70) return 'Excellent';
    if (score >= 50) return 'Good';
    if (score >= 30) return 'Moderate';
    return 'Limited';
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">🧠 Fragment Finder Agent</CardTitle>
          <CardDescription>
            Analyze market fragmentation and identify rollup opportunities in local markets
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <Label htmlFor="zip">ZIP Code</Label>
              <Input
                id="zip"
                placeholder="e.g., 90210"
                value={zip}
                onChange={(e) => setZip(e.target.value)}
                maxLength={5}
              />
            </div>
            <div>
              <Label htmlFor="industry">Industry</Label>
              <Select value={industry} onValueChange={setIndustry}>
                <SelectTrigger>
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  {industries.map((ind) => (
                    <SelectItem key={ind} value={ind}>
                      {ind.charAt(0).toUpperCase() + ind.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button 
                onClick={handleAnalyze} 
                disabled={loading || !zip || !industry}
                className="w-full"
              >
                {loading ? 'Analyzing...' : 'Analyze Market'}
              </Button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
              <p className="text-red-800">{error}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {analysis && (
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="targets">Top Targets</TabsTrigger>
            <TabsTrigger value="financials">Financials</TabsTrigger>
            <TabsTrigger value="chaos">Chaos Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Market Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Total Businesses:</span>
                      <span className="font-medium">{analysis.marketMetrics.totalBusinesses}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Avg Revenue:</span>
                      <span className="font-medium">${analysis.marketMetrics.averageRevenue.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Avg Employees:</span>
                      <span className="font-medium">{analysis.marketMetrics.averageEmployees.toFixed(1)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Data Quality:</span>
                      <span className="font-medium">{(analysis.dataQuality * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Consolidation Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-center">
                      <div className="text-3xl font-bold mb-1">
                        {analysis.adjustedConsolidationScore.toFixed(1)}
                      </div>
                      <Badge className={`${getConsolidationColor(analysis.adjustedConsolidationScore)} text-white`}>
                        {getConsolidationLevel(analysis.adjustedConsolidationScore)}
                      </Badge>
                    </div>
                    <Progress 
                      value={analysis.adjustedConsolidationScore} 
                      className="w-full"
                    />
                    <div className="text-xs text-gray-600">
                      Base Score: {analysis.baseConsolidationScore.toFixed(1)}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Fragmentation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>HHI Index:</span>
                      <span className="font-medium">{analysis.hhi}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Mom & Pop Density:</span>
                      <span className="font-medium">{(analysis.momPopDensity * 100).toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Top 5 Share:</span>
                      <span className="font-medium">{analysis.marketMetrics.top5MarketShare.toFixed(1)}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>💡 Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysis.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-blue-500 mt-1">•</span>
                      <span className="text-sm">{rec}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="targets" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>🎯 Top Consolidation Targets</CardTitle>
                <CardDescription>
                  Businesses ranked by consolidation potential and exit probability
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analysis.topTargets.slice(0, 10).map((target, index) => (
                    <TargetCard key={target.id} target={target} rank={index + 1} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="financials" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>💰 Investment Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Total Acquisition Cost:</span>
                      <span className="font-bold">${analysis.financialProjections.totalAcquisitionCost.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Revenue:</span>
                      <span className="font-bold">${analysis.financialProjections.totalRevenue.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Synergies:</span>
                      <span className="font-bold">${analysis.financialProjections.totalSynergies.toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>📈 Returns & Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Projected ROI:</span>
                      <span className="font-bold text-green-600">{analysis.financialProjections.projectedROI.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Payback Period:</span>
                      <span className="font-bold">{analysis.financialProjections.estimatedPaybackPeriod} years</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Market Share Gain:</span>
                      <span className="font-bold">{(analysis.financialProjections.marketShareGain * 100).toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Risk-Adjusted Return:</span>
                      <span className="font-bold">{(analysis.financialProjections.riskAdjustedReturn * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="chaos" className="space-y-4">
            {analysis.entropyMetrics && (
              <Card>
                <CardHeader>
                  <CardTitle>🌀 Market Entropy & Chaos Metrics</CardTitle>
                  <CardDescription>
                    Measures of market unpredictability and volatility
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <EntropyMetric 
                      label="Market Entropy" 
                      value={analysis.entropyMetrics.marketEntropy}
                      description="Overall market unpredictability"
                    />
                    <EntropyMetric 
                      label="Pricing Volatility" 
                      value={analysis.entropyMetrics.pricingVolatility}
                      description="Price variation across businesses"
                    />
                    <EntropyMetric 
                      label="Quality Variance" 
                      value={analysis.entropyMetrics.qualityVariance}
                      description="Inconsistency in service quality"
                    />
                    <EntropyMetric 
                      label="Geographic Dispersion" 
                      value={analysis.entropyMetrics.geographicDispersion}
                      description="Spatial distribution of businesses"
                    />
                    <EntropyMetric 
                      label="Temporal Instability" 
                      value={analysis.entropyMetrics.temporalInstability}
                      description="Business age distribution volatility"
                    />
                    <EntropyMetric 
                      label="Competitive Intensity" 
                      value={analysis.entropyMetrics.competitiveIntensity}
                      description="Level of market competition"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {analysis.chaosIndicators && (
              <Card>
                <CardHeader>
                  <CardTitle>⚠️ Chaos Indicators</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">
                        {analysis.chaosIndicators.chaoticActorCount}
                      </div>
                      <div className="text-sm text-gray-600">Chaotic Actors</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">
                        {(analysis.chaosIndicators.chaoticActorRatio * 100).toFixed(1)}%
                      </div>
                      <div className="text-sm text-gray-600">Chaos Ratio</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-600">
                        {(analysis.chaosIndicators.averageChaosScore * 100).toFixed(1)}%
                      </div>
                      <div className="text-sm text-gray-600">Avg Chaos Score</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}

function TargetCard({ target, rank }: { target: ConsolidationTarget; rank: number }) {
  return (
    <Card className="border-l-4 border-l-blue-500">
      <CardContent className="pt-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <div className="font-semibold text-lg">
              #{rank} {target.name}
            </div>
            <div className="text-sm text-gray-600">{target.address}</div>
          </div>
          <Badge variant="outline">
            Score: {(target.consolidationScore * 100).toFixed(1)}%
          </Badge>
        </div>
        
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <div className="font-medium">Exit Risk</div>
            <Progress value={target.exitRisk * 100} className="mt-1" />
            <div className="text-xs text-gray-600 mt-1">
              {(target.exitRisk * 100).toFixed(1)}%
            </div>
          </div>
          <div>
            <div className="font-medium">Strategic Value</div>
            <Progress value={target.strategicValue * 100} className="mt-1" />
            <div className="text-xs text-gray-600 mt-1">
              {(target.strategicValue * 100).toFixed(1)}%
            </div>
          </div>
          <div>
            <div className="font-medium">Complexity</div>
            <Progress value={target.acquisitionComplexity * 100} className="mt-1" />
            <div className="text-xs text-gray-600 mt-1">
              {(target.acquisitionComplexity * 100).toFixed(1)}%
            </div>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t grid grid-cols-3 gap-4 text-sm">
          <div>
            <div className="text-gray-600">Est. Revenue</div>
            <div className="font-medium">${(target.estimatedRevenue || 0).toLocaleString()}</div>
          </div>
          <div>
            <div className="text-gray-600">Acquisition Cost</div>
            <div className="font-medium">${(target.estimatedAcquisitionCost || 0).toLocaleString()}</div>
          </div>
          <div>
            <div className="text-gray-600">Synergies</div>
            <div className="font-medium text-green-600">${(target.potentialSynergies || 0).toLocaleString()}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function EntropyMetric({ label, value, description }: { 
  label: string; 
  value: number; 
  description: string; 
}) {
  const percentage = value * 100;
  const getColor = (val: number) => {
    if (val < 30) return 'text-green-600';
    if (val < 50) return 'text-yellow-600';
    if (val < 70) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="font-medium">{label}</span>
        <span className={`font-bold ${getColor(percentage)}`}>
          {percentage.toFixed(1)}%
        </span>
      </div>
      <Progress value={percentage} className="h-2" />
      <div className="text-xs text-gray-600">{description}</div>
    </div>
  );
}