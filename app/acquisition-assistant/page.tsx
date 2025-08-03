'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  Users,
  Target,
  Mail,
  Phone,
  Calendar,
  FileText,
  Activity,
  Zap
} from 'lucide-react';
import { Deal, DealStage, OutreachAction } from '@/services/acquisition-assistant';

interface PipelineAnalytics {
  summary: {
    totalDeals: number;
    totalValue: number;
    avgIRR: number;
    avgTimeToClose: number;
    closedDeals: number;
    activeDeals: number;
  };
  stageDistribution: Record<DealStage, number>;
  conversionRates: Record<string, number>;
  velocityMetrics: {
    avgDaysToClose: number;
    fastestDeal: number;
    slowestDeal: number;
  };
  trends: Array<{ month: string; created: number; closed: number; value: number }>;
}

interface DecayAnalytics {
  overview: {
    totalDeals: number;
    avgDecayScore: number;
    riskCategories: { high: number; medium: number; low: number };
  };
  detailedScores: Array<{
    dealId: string;
    companyName: string;
    stage: DealStage;
    decayScore: number;
    daysSinceContact: number;
    avgResponseRate: number;
    avgSentiment: number;
  }>;
  recommendations: Array<{
    dealId: string;
    priority: string;
    action: string;
    reason: string;
  }>;
}

const STAGE_COLORS = {
  'Lead': '#ef4444',
  'Initial Contact': '#f97316',
  'NDA Signed': '#eab308',
  'LOI Submitted': '#84cc16',
  'LOI Accepted': '#22c55e',
  'Due Diligence': '#06b6d4',
  'Final Negotiations': '#3b82f6',
  'Closing': '#8b5cf6',
  'Closed': '#10b981',
  'Dead': '#6b7280'
};

export default function AcquisitionAssistantPage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [pipelineAnalytics, setPipelineAnalytics] = useState<PipelineAnalytics | null>(null);
  const [decayAnalytics, setDecayAnalytics] = useState<DecayAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [followUps, setFollowUps] = useState<OutreachAction[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch deals
      const dealsResponse = await fetch('/api/acquisition-assistant?action=getAllDeals');
      const dealsData = await dealsResponse.json();
      
      // Create some sample deals if none exist
      if (dealsData.deals.length === 0) {
        await createSampleDeals();
        const updatedDealsResponse = await fetch('/api/acquisition-assistant?action=getAllDeals');
        const updatedDealsData = await updatedDealsResponse.json();
        setDeals(updatedDealsData.deals);
      } else {
        setDeals(dealsData.deals);
      }

      // Fetch analytics
      const [pipelineRes, decayRes] = await Promise.all([
        fetch('/api/acquisition-assistant/analytics?type=pipeline'),
        fetch('/api/acquisition-assistant/analytics?type=decay')
      ]);

      const [pipelineData, decayData] = await Promise.all([
        pipelineRes.json(),
        decayRes.json()
      ]);

      setPipelineAnalytics(pipelineData);
      setDecayAnalytics(decayData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const createSampleDeals = async () => {
    const sampleDeals = Array.from({ length: 15 }, () => ({}));
    
    for (const dealData of sampleDeals) {
      await fetch('/api/acquisition-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'createDeal', dealData })
      });
    }
  };

  const handleDealSelect = async (deal: Deal) => {
    setSelectedDeal(deal);
    
    // Generate follow-ups for selected deal
    try {
      const response = await fetch('/api/acquisition-assistant/outreach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dealId: deal.id, action: 'generateSequences' })
      });
      const data = await response.json();
      setFollowUps(data.followUps || []);
    } catch (error) {
      console.error('Error generating follow-ups:', error);
    }
  };

  const getStageColor = (stage: DealStage) => STAGE_COLORS[stage] || '#6b7280';

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(value);
  };

  const getRiskBadgeColor = (score: number) => {
    if (score > 70) return 'bg-red-900 text-red-100';
    if (score > 40) return 'bg-yellow-900 text-yellow-100';
    return 'bg-green-900 text-green-100';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading Acquisition Assistant...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">🧠 Acquisition Assistant</h1>
            <p className="text-gray-400">Pipeline Orchestrator & Deal Flow Manager</p>
          </div>
          <div className="flex gap-4">
            <Button 
              onClick={() => window.location.reload()} 
              className="bg-green-600 hover:bg-green-700"
            >
              <Activity className="w-4 h-4 mr-2" />
              Refresh Data
            </Button>
          </div>
        </div>

        {/* Key Metrics Dashboard */}
        {pipelineAnalytics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">Total Pipeline Value</CardTitle>
                <DollarSign className="h-4 w-4 text-green-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {formatCurrency(pipelineAnalytics.summary.totalValue)}
                </div>
                <p className="text-xs text-gray-400">
                  {pipelineAnalytics.summary.totalDeals} active deals
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">Average IRR</CardTitle>
                <TrendingUp className="h-4 w-4 text-blue-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {pipelineAnalytics.summary.avgIRR.toFixed(1)}%
                </div>
                <p className="text-xs text-gray-400">
                  Projected returns
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">Avg Time to Close</CardTitle>
                <Clock className="h-4 w-4 text-purple-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {pipelineAnalytics.summary.avgTimeToClose} days
                </div>
                <p className="text-xs text-gray-400">
                  Deal velocity
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">Closed Deals</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {pipelineAnalytics.summary.closedDeals}
                </div>
                <p className="text-xs text-gray-400">
                  {pipelineAnalytics.summary.activeDeals} in pipeline
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Tabs */}
        <Tabs defaultValue="pipeline" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-gray-800">
            <TabsTrigger value="pipeline">Pipeline Overview</TabsTrigger>
            <TabsTrigger value="deals">Deal Management</TabsTrigger>
            <TabsTrigger value="outreach">Outreach Center</TabsTrigger>
            <TabsTrigger value="analytics">Chaos Analytics</TabsTrigger>
            <TabsTrigger value="forecasting">Forecasting</TabsTrigger>
          </TabsList>

          {/* Pipeline Overview */}
          <TabsContent value="pipeline" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Stage Distribution */}
              {pipelineAnalytics && (
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">Deal Stage Distribution</CardTitle>
                    <CardDescription>Current deals by stage</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={Object.entries(pipelineAnalytics.stageDistribution)
                            .filter(([_, count]) => count > 0)
                            .map(([stage, count]) => ({
                              name: stage,
                              value: count,
                              fill: getStageColor(stage as DealStage)
                            }))}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              )}

              {/* Pipeline Trends */}
              {pipelineAnalytics?.trends && (
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">Pipeline Trends</CardTitle>
                    <CardDescription>Deal creation and closure over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={pipelineAnalytics.trends}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="month" stroke="#9ca3af" />
                        <YAxis stroke="#9ca3af" />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
                          labelStyle={{ color: '#f3f4f6' }}
                        />
                        <Line type="monotone" dataKey="created" stroke="#3b82f6" strokeWidth={2} />
                        <Line type="monotone" dataKey="closed" stroke="#10b981" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Deal Management */}
          <TabsContent value="deals" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Deals List */}
              <div className="lg:col-span-2">
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">Active Deals</CardTitle>
                    <CardDescription>Click on a deal to view details and manage outreach</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {deals.map((deal) => (
                        <div
                          key={deal.id}
                          className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                            selectedDeal?.id === deal.id
                              ? 'bg-blue-900/30 border-blue-600'
                              : 'bg-gray-700 border-gray-600 hover:bg-gray-600'
                          }`}
                          onClick={() => handleDealSelect(deal)}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-white font-semibold">{deal.targetCompany.name}</h3>
                            <Badge 
                              className={`${getRiskBadgeColor(deal.scoring.dealDecayScore)}`}
                            >
                              {deal.stage}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm text-gray-300">
                            <div>
                              <span className="text-gray-400">Industry:</span> {deal.targetCompany.industry}
                            </div>
                            <div>
                              <span className="text-gray-400">Value:</span> {formatCurrency(deal.financials.currentValuation)}
                            </div>
                            <div>
                              <span className="text-gray-400">IRR:</span> {deal.scoring.irr.toFixed(1)}%
                            </div>
                            <div>
                              <span className="text-gray-400">Last Contact:</span> {Math.floor((Date.now() - deal.lastContact.getTime()) / (1000 * 60 * 60 * 24))} days ago
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Deal Details */}
              <div>
                {selectedDeal ? (
                  <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white">{selectedDeal.targetCompany.name}</CardTitle>
                      <CardDescription>{selectedDeal.targetCompany.industry} • {selectedDeal.targetCompany.location}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="text-white font-semibold mb-2">Financial Metrics</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Revenue:</span>
                            <span className="text-white">{formatCurrency(selectedDeal.targetCompany.revenue)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">EBITDA:</span>
                            <span className="text-white">{formatCurrency(selectedDeal.targetCompany.ebitda)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Valuation:</span>
                            <span className="text-white">{formatCurrency(selectedDeal.financials.currentValuation)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">IRR:</span>
                            <span className="text-white">{selectedDeal.scoring.irr.toFixed(1)}%</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-white font-semibold mb-2">Synergies</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Revenue Upside:</span>
                            <span className="text-white">{formatCurrency(selectedDeal.financials.synergies.revenueUpside)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Cost Savings:</span>
                            <span className="text-white">{formatCurrency(selectedDeal.financials.synergies.costSavings)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Total Value:</span>
                            <span className="text-white font-semibold">{formatCurrency(selectedDeal.financials.synergies.totalValue)}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-white font-semibold mb-2">Timeline</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${selectedDeal.timeline.nda?.signed ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                            <span className="text-gray-400">NDA Signed</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${selectedDeal.timeline.loi?.submitted ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                            <span className="text-gray-400">LOI Submitted</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${selectedDeal.timeline.dueDiligence?.started ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                            <span className="text-gray-400">Due Diligence</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="bg-gray-800 border-gray-700">
                    <CardContent className="flex items-center justify-center h-64">
                      <p className="text-gray-400">Select a deal to view details</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Outreach Center */}
          <TabsContent value="outreach" className="space-y-6">
            {selectedDeal ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recommended Actions */}
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">Recommended Follow-ups</CardTitle>
                    <CardDescription>AI-generated outreach suggestions for {selectedDeal.targetCompany.name}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {followUps.map((action, index) => (
                        <div key={index} className="p-4 bg-gray-700 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              {action.type === 'email' && <Mail className="w-4 h-4 text-blue-400" />}
                              {action.type === 'call' && <Phone className="w-4 h-4 text-green-400" />}
                              {action.type === 'meeting' && <Calendar className="w-4 h-4 text-purple-400" />}
                              <span className="text-white font-medium capitalize">{action.type}</span>
                            </div>
                            <Badge className={
                              action.priority === 'high' ? 'bg-red-900 text-red-100' :
                              action.priority === 'medium' ? 'bg-yellow-900 text-yellow-100' :
                              'bg-green-900 text-green-100'
                            }>
                              {action.priority}
                            </Badge>
                          </div>
                          <p className="text-gray-300 text-sm mb-2">{action.content}</p>
                          <p className="text-gray-400 text-xs">
                            Scheduled: {new Date(action.scheduledFor).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Contact Information */}
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">Contact Management</CardTitle>
                    <CardDescription>Key contacts and their engagement metrics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {selectedDeal.contacts.length > 0 ? (
                        selectedDeal.contacts.map((contact, index) => (
                          <div key={index} className="p-4 bg-gray-700 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="text-white font-medium">{contact.name}</h4>
                              <Badge className="bg-blue-900 text-blue-100">{contact.role}</Badge>
                            </div>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-400">Email:</span>
                                <span className="text-white">{contact.email}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">Response Rate:</span>
                                <span className="text-white">{(contact.responseRate * 100).toFixed(0)}%</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">Sentiment:</span>
                                <span className="text-white">{(contact.sentimentScore * 100).toFixed(0)}%</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">Last Contact:</span>
                                <span className="text-white">{contact.lastContact.toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-400 text-center py-8">No contacts added yet</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="flex items-center justify-center h-64">
                  <p className="text-gray-400">Select a deal from the Deal Management tab to view outreach options</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Chaos Analytics */}
          <TabsContent value="analytics" className="space-y-6">
            {decayAnalytics && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Risk Overview */}
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">Deal Decay Risk</CardTitle>
                    <CardDescription>Chaos-aware risk assessment</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-white mb-2">
                          {decayAnalytics.overview.avgDecayScore.toFixed(0)}
                        </div>
                        <p className="text-gray-400">Average Decay Score</p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-red-400">High Risk</span>
                          <Badge className="bg-red-900 text-red-100">
                            {decayAnalytics.overview.riskCategories.high}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-yellow-400">Medium Risk</span>
                          <Badge className="bg-yellow-900 text-yellow-100">
                            {decayAnalytics.overview.riskCategories.medium}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-green-400">Low Risk</span>
                          <Badge className="bg-green-900 text-green-100">
                            {decayAnalytics.overview.riskCategories.low}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* High Risk Deals */}
                <div className="lg:col-span-2">
                  <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white">High Risk Deals</CardTitle>
                      <CardDescription>Deals requiring immediate attention</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4 max-h-96 overflow-y-auto">
                        {decayAnalytics.detailedScores
                          .filter(deal => deal.decayScore > 50)
                          .map((deal) => (
                            <Alert key={deal.dealId} className="border-red-600 bg-red-900/20">
                              <AlertTriangle className="h-4 w-4 text-red-400" />
                              <AlertDescription className="text-white">
                                <div className="flex justify-between items-start mb-2">
                                  <div>
                                    <span className="font-semibold">{deal.companyName}</span>
                                    <Badge className="ml-2 bg-gray-700 text-gray-200">{deal.stage}</Badge>
                                  </div>
                                  <Badge className={getRiskBadgeColor(deal.decayScore)}>
                                    Risk: {deal.decayScore.toFixed(0)}
                                  </Badge>
                                </div>
                                <div className="grid grid-cols-2 gap-4 text-sm text-gray-300">
                                  <div>Days since contact: {deal.daysSinceContact}</div>
                                  <div>Response rate: {(deal.avgResponseRate * 100).toFixed(0)}%</div>
                                </div>
                              </AlertDescription>
                            </Alert>
                          ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* Recommendations */}
            {decayAnalytics?.recommendations && (
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">AI Recommendations</CardTitle>
                  <CardDescription>Automated suggestions based on deal behavior analysis</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {decayAnalytics.recommendations.map((rec, index) => (
                      <div key={index} className="p-4 bg-gray-700 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <Badge className={
                            rec.priority === 'HIGH' ? 'bg-red-900 text-red-100' :
                            rec.priority === 'MEDIUM' ? 'bg-yellow-900 text-yellow-100' :
                            'bg-green-900 text-green-100'
                          }>
                            {rec.priority}
                          </Badge>
                          <Zap className="w-4 h-4 text-yellow-400" />
                        </div>
                        <h4 className="text-white font-medium mb-1">{rec.action}</h4>
                        <p className="text-gray-400 text-sm">{rec.reason}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Forecasting */}
          <TabsContent value="forecasting" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Pipeline Forecast</CardTitle>
                  <CardDescription>Predictive analytics for deal closure</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <div className="text-2xl font-bold text-white mb-2">Coming Soon</div>
                    <p className="text-gray-400">Advanced forecasting models are being calibrated</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Market Intelligence</CardTitle>
                  <CardDescription>Industry trends and competitive analysis</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <div className="text-2xl font-bold text-white mb-2">Coming Soon</div>
                    <p className="text-gray-400">Real-time market data integration in progress</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}