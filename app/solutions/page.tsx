"use client"
import { ArrowLeft, Zap, BarChart3, Globe, Users, CheckCircle, ArrowRight, Mail, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"

export default function SolutionsPage() {
  return (
    <div className="min-h-screen bg-black">
      {/* Navigation */}
      <nav className="border-b border-gray-800 bg-black/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link href="/" className="text-2xl font-bold text-white">
                OkapIQ
              </Link>
              <div className="hidden md:flex space-x-6">
                <Link href="/solutions" className="text-white font-medium border-b-2 border-green-600">
                  Solutions
                </Link>
                <Link href="/case-studies" className="text-gray-300 hover:text-white font-medium">
                  Case Studies
                </Link>
                <Link href="/dashboard" className="text-gray-300 hover:text-white font-medium">
                  Platform
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/contact">
                <Button
                  variant="outline"
                  className="hidden md:inline-flex bg-transparent border-green-600 text-green-400 hover:bg-green-600 hover:text-white"
                >
                  Contact Now
                </Button>
              </Link>
              <Link href="/contact">
                <Button className="bg-green-600 hover:bg-green-700 text-white">Book a Demo</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="pt-16 pb-12 px-4 sm:px-6 lg:px-8 bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <Link href="/" className="inline-flex items-center text-green-400 hover:text-green-300 mb-8">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">OkapIQ Solutions</h1>
          <p className="text-xl text-gray-300 max-w-3xl">
            Comprehensive AI-powered tools that transform how you discover, qualify, and close SMB acquisitions.
          </p>
        </div>
      </section>

      {/* Solutions Tabs */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black">
        <div className="max-w-7xl mx-auto">
          <Tabs defaultValue="ai-deal-engine" className="w-full">
            <TabsList className="grid w-full grid-cols-1 md:grid-cols-4 h-auto p-1 bg-gray-900 border border-gray-800">
              <TabsTrigger
                value="ai-deal-engine"
                className="flex flex-col items-center p-4 data-[state=active]:bg-gray-800 text-gray-300 data-[state=active]:text-white"
              >
                <Zap className="h-6 w-6 mb-2 text-green-400" />
                <span className="font-medium">AI Deal Engine</span>
              </TabsTrigger>
              <TabsTrigger
                value="oppy-valuations"
                className="flex flex-col items-center p-4 data-[state=active]:bg-gray-800 text-gray-300 data-[state=active]:text-white"
              >
                <BarChart3 className="h-6 w-6 mb-2 text-green-400" />
                <span className="font-medium">Oppy Valuations</span>
              </TabsTrigger>
              <TabsTrigger
                value="geo-smart"
                className="flex flex-col items-center p-4 data-[state=active]:bg-gray-800 text-gray-300 data-[state=active]:text-white"
              >
                <Globe className="h-6 w-6 mb-2 text-green-400" />
                <span className="font-medium">Geo Smart Analysis</span>
              </TabsTrigger>
              <TabsTrigger
                value="post-acquisition"
                className="flex flex-col items-center p-4 data-[state=active]:bg-gray-800 text-gray-300 data-[state=active]:text-white"
              >
                <Users className="h-6 w-6 mb-2 text-green-400" />
                <span className="font-medium">Post-Acquisition</span>
              </TabsTrigger>
            </TabsList>

            {/* AI Deal Engine */}
            <TabsContent value="ai-deal-engine" className="space-y-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <div className="flex items-center mb-6">
                    <Zap className="h-8 w-8 text-green-400 mr-3" />
                    <h2 className="text-3xl font-bold text-white">AI Deal Engine</h2>
                  </div>
                  <p className="text-lg text-gray-300 mb-8">
                    Our AI scans 33 million SMBs, qualifies leads 8x faster than manual cold calls, and reduces wasted
                    broker time by 90%. Automated outreach with voice-modulated calls and personalized emails.
                  </p>
                  <div className="space-y-4 mb-8">
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-white">Smart Lead Discovery</h4>
                        <p className="text-gray-300">
                          Search Snake technology scans 33M SMBs to find niche targets matching your criteria
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-white">AI-Powered Outreach</h4>
                        <p className="text-gray-300">
                          Voice-modulated cold calls and personalized emails validate owners ready to sell
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-white">Automated Qualification</h4>
                        <p className="text-gray-300">
                          5,000 leads qualified per day with 8x higher response rates than manual methods
                        </p>
                      </div>
                    </div>
                  </div>
                  <Link href="/oppy">
                    <Button className="bg-green-600 hover:bg-green-700 text-white">
                      Launch Oppy
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <Card className="border-2 border-green-600 bg-green-900/20">
                    <CardHeader>
                      <CardTitle className="text-2xl font-bold text-green-400">33M</CardTitle>
                      <CardDescription className="text-green-300">SMBs Scanned</CardDescription>
                    </CardHeader>
                  </Card>
                  <Card className="border-2 border-green-600 bg-green-900/20">
                    <CardHeader>
                      <CardTitle className="text-2xl font-bold text-green-400">8x</CardTitle>
                      <CardDescription className="text-green-300">Faster Qualification</CardDescription>
                    </CardHeader>
                  </Card>
                  <Card className="border-2 border-green-600 bg-green-900/20">
                    <CardHeader>
                      <CardTitle className="text-2xl font-bold text-green-400">5,000</CardTitle>
                      <CardDescription className="text-green-300">Leads/Day</CardDescription>
                    </CardHeader>
                  </Card>
                  <Card className="border-2 border-green-600 bg-green-900/20">
                    <CardHeader>
                      <CardTitle className="text-2xl font-bold text-green-400">90%</CardTitle>
                      <CardDescription className="text-green-300">Time Saved</CardDescription>
                    </CardHeader>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Oppy Valuations */}
            <TabsContent value="oppy-valuations" className="space-y-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="order-2 lg:order-1">
                  <div className="grid grid-cols-2 gap-6">
                    <Card className="border-2 border-green-600 bg-green-900/20">
                      <CardHeader>
                        <CardTitle className="text-2xl font-bold text-green-400">15M</CardTitle>
                        <CardDescription className="text-green-300">Private Deals Benchmarked</CardDescription>
                      </CardHeader>
                    </Card>
                    <Card className="border-2 border-green-600 bg-green-900/20">
                      <CardHeader>
                        <CardTitle className="text-2xl font-bold text-green-400">37%</CardTitle>
                        <CardDescription className="text-green-300">Fewer Valuation Mismatches</CardDescription>
                      </CardHeader>
                    </Card>
                    <Card className="border-2 border-green-600 bg-green-900/20">
                      <CardHeader>
                        <CardTitle className="text-2xl font-bold text-green-400">7.3x</CardTitle>
                        <CardDescription className="text-green-300">Confident EBITDA Multiple</CardDescription>
                      </CardHeader>
                    </Card>
                    <Card className="border-2 border-green-600 bg-green-900/20">
                      <CardHeader>
                        <CardTitle className="text-2xl font-bold text-green-400">80%</CardTitle>
                        <CardDescription className="text-green-300">Messy Books Analyzed</CardDescription>
                      </CardHeader>
                    </Card>
                  </div>
                </div>
                <div className="order-1 lg:order-2">
                  <div className="flex items-center mb-6">
                    <BarChart3 className="h-8 w-8 text-green-400 mr-3" />
                    <h2 className="text-3xl font-bold text-white">Oppy Valuations</h2>
                  </div>
                  <p className="text-lg text-gray-300 mb-8">
                    Our algorithms analyze financial data from messy books, benchmark against 15 million private deals,
                    and provide confident EBITDA scores for accurate valuations. Eliminate the 37% deal failure rate
                    from valuation mismatches.
                  </p>
                  <div className="space-y-4 mb-8">
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-white">Messy Books Analysis</h4>
                        <p className="text-gray-300">
                          AI processes unclear accounting and financial records to extract true business value
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-white">Private Deal Benchmarking</h4>
                        <p className="text-gray-300">
                          Compare against 15M private transactions for accurate market-based valuations
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-white">Confident EBITDA Scores</h4>
                        <p className="text-gray-300">
                          Maintain 7.3x multiples vs 4.9x for low-confidence deals, preventing overpayment
                        </p>
                      </div>
                    </div>
                  </div>
                  <Link href="/oppy">
                    <Button className="bg-green-600 hover:bg-green-700 text-white">
                      Open Oppy Valuations
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </TabsContent>

            {/* Geo Smart Analysis */}
            <TabsContent value="geo-smart" className="space-y-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <div className="flex items-center mb-6">
                    <Globe className="h-8 w-8 text-green-400 mr-3" />
                    <h2 className="text-3xl font-bold text-white">Geo Smart Analysis</h2>
                  </div>
                  <p className="text-lg text-gray-300 mb-8">
                    OkapIQ's mapping identifies exact clusters of 12+ buyable SMBs per square mile, complete with
                    synergy scores for optimal acquisition targeting. Perfect for roll-up strategies and geographic
                    expansion.
                  </p>
                  <div className="space-y-4 mb-8">
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-white">Cluster Identification</h4>
                        <p className="text-gray-300">
                          Find geographic concentrations of 12+ buyable SMBs per square mile
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-white">Synergy Scoring</h4>
                        <p className="text-gray-300">
                          AI-calculated synergy scores for optimal roll-up and consolidation opportunities
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-white">Market Intelligence</h4>
                        <p className="text-gray-300">
                          Demographic and economic data overlay for informed geographic expansion
                        </p>
                      </div>
                    </div>
                  </div>
                  <Link href="/fragment-finder">
                    <Button className="bg-green-600 hover:bg-green-700 text-white">
                      Open Fragment Finder
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <Card className="border-2 border-green-600 bg-green-900/20">
                    <CardHeader>
                      <CardTitle className="text-2xl font-bold text-green-400">12+</CardTitle>
                      <CardDescription className="text-green-300">SMBs per Square Mile</CardDescription>
                    </CardHeader>
                  </Card>
                  <Card className="border-2 border-green-600 bg-green-900/20">
                    <CardHeader>
                      <CardTitle className="text-2xl font-bold text-green-400">100%</CardTitle>
                      <CardDescription className="text-green-300">Geographic Coverage</CardDescription>
                    </CardHeader>
                  </Card>
                  <Card className="border-2 border-green-600 bg-green-900/20">
                    <CardHeader>
                      <CardTitle className="text-2xl font-bold text-green-400">AI</CardTitle>
                      <CardDescription className="text-green-300">Synergy Scoring</CardDescription>
                    </CardHeader>
                  </Card>
                  <Card className="border-2 border-green-600 bg-green-900/20">
                    <CardHeader>
                      <CardTitle className="text-2xl font-bold text-green-400">Real-time</CardTitle>
                      <CardDescription className="text-green-300">Market Data</CardDescription>
                    </CardHeader>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Post-Acquisition Services */}
            <TabsContent value="post-acquisition" className="space-y-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="order-2 lg:order-1">
                  <div className="grid grid-cols-2 gap-6">
                    <Card className="border-2 border-green-600 bg-green-900/20">
                      <CardHeader>
                        <CardTitle className="text-2xl font-bold text-green-400">3x</CardTitle>
                        <CardDescription className="text-green-300">Revenue Increase</CardDescription>
                      </CardHeader>
                    </Card>
                    <Card className="border-2 border-green-600 bg-green-900/20">
                      <CardHeader>
                        <CardTitle className="text-2xl font-bold text-green-400">56%</CardTitle>
                        <CardDescription className="text-green-300">Cost Reduction</CardDescription>
                      </CardHeader>
                    </Card>
                    <Card className="border-2 border-green-600 bg-green-900/20">
                      <CardHeader>
                        <CardTitle className="text-2xl font-bold text-green-400">238%</CardTitle>
                        <CardDescription className="text-green-300">SEO Improvement</CardDescription>
                      </CardHeader>
                    </Card>
                    <Card className="border-2 border-green-600 bg-green-900/20">
                      <CardHeader>
                        <CardTitle className="text-2xl font-bold text-green-400">4x</CardTitle>
                        <CardDescription className="text-green-300">Lead Generation</CardDescription>
                      </CardHeader>
                    </Card>
                  </div>
                </div>
                <div className="order-1 lg:order-2">
                  <div className="flex items-center mb-6">
                    <Users className="h-8 w-8 text-green-400 mr-3" />
                    <h2 className="text-3xl font-bold text-white">Post-Acquisition Services</h2>
                  </div>
                  <p className="text-lg text-gray-300 mb-8">
                    Comprehensive marketing, staffing, lead generation, and accounting support to ensure successful
                    integration after deals close. Our automation boosts revenue by 3x and reduces costs by 56%.
                  </p>
                  <div className="space-y-4 mb-8">
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-white">Automated Marketing</h4>
                        <p className="text-gray-300">
                          SEO optimization, lead generation, and digital marketing automation
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-white">Staffing Solutions</h4>
                        <p className="text-gray-300">
                          AI-powered recruitment and workforce optimization for acquired businesses
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-white">Financial Reporting</h4>
                        <p className="text-gray-300">
                          Real-time ROI tracking and automated financial reporting systems
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-white">Integration Support</h4>
                        <p className="text-gray-300">Seamless operational integration with existing business systems</p>
                      </div>
                    </div>
                    <Link href="/acquisition-assistant">
                      <Button className="bg-green-600 hover:bg-green-700 text-white">
                        Open Acquisition Assistant
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Competitive Advantage */}
      <section className="py-20 bg-gray-900 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Why Choose OkapIQ?</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Our unified platform outperforms competitors with end-to-end automation and real-time insights.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full bg-black rounded-lg shadow-lg border border-gray-800">
              <thead className="bg-gray-900">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">Feature</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-green-400">OkapIQ</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-400">Competitors</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                <tr>
                  <td className="px-6 py-4 text-sm text-white">AI-Driven Insights</td>
                  <td className="px-6 py-4 text-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                    <span className="text-xs text-green-400 block mt-1">Proprietary algorithms</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-red-500">❌</span>
                    <span className="text-xs text-red-400 block mt-1">Manual tools</span>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm text-white">End-to-End Platform</td>
                  <td className="px-6 py-4 text-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                    <span className="text-xs text-green-400 block mt-1">Pre to post-acquisition</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-red-500">❌</span>
                    <span className="text-xs text-red-400 block mt-1">Transaction-only</span>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm text-white">API Integrations</td>
                  <td className="px-6 py-4 text-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                    <span className="text-xs text-green-400 block mt-1">100+ integrations</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-red-500">❌</span>
                    <span className="text-xs text-red-400 block mt-1">Limited or none</span>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm text-white">Real-Time ROI Tracking</td>
                  <td className="px-6 py-4 text-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                    <span className="text-xs text-green-400 block mt-1">Live analytics</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-red-500">❌</span>
                    <span className="text-xs text-red-400 block mt-1">Basic reporting</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Deal Flow?</h2>
            <p className="text-xl mb-8 opacity-90">
              See how OkapIQ's solutions can 8x your response rates and reduce deal time by 90%.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
                  Book a Demo
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/case-studies">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 py-3 border-white text-white hover:bg-white hover:text-green-600 bg-transparent"
                >
                  View Case Studies
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="text-2xl font-bold mb-4">OkapIQ</div>
              <p className="text-gray-400 mb-4">Bloomberg for LLMs</p>
              <p className="text-gray-400 text-sm">Real-time SMB data and AI-powered deal flow for modern investors.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Solutions</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/solutions" className="hover:text-white">
                    AI Deal Engine
                  </Link>
                </li>
                <li>
                  <Link href="/solutions" className="hover:text-white">
                    Oppy Valuations
                  </Link>
                </li>
                <li>
                  <Link href="/solutions" className="hover:text-white">
                    Geo Smart Analysis
                  </Link>
                </li>
                <li>
                  <Link href="/solutions" className="hover:text-white">
                    Post-Acquisition
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/case-studies" className="hover:text-white">
                    Case Studies
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="hover:text-white">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <div className="space-y-2 text-gray-400">
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-green-400" />
                  osirislamon@gmail.com
                </div>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-green-400" />
                  +1 (661) 566-4627
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 OkapIQ. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
