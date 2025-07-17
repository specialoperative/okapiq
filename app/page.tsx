"use client"
import { ArrowRight, TrendingUp, Target, Zap, BarChart3, Globe, Phone, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="text-2xl font-bold text-gray-900">OkapIQ</div>
              <Badge variant="secondary" className="ml-3 bg-blue-50 text-blue-700">
                Bloomberg for LLMs
              </Badge>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/solutions" className="text-gray-600 hover:text-gray-900 font-medium">
                Solutions
              </Link>
              <Link href="/case-studies" className="text-gray-600 hover:text-gray-900 font-medium">
                Case Studies
              </Link>
              <Link href="/dashboard" className="text-gray-600 hover:text-gray-900 font-medium">
                Dashboard
              </Link>
              <Link href="/contact">
                <Button className="bg-blue-600 hover:bg-blue-700">Contact Now</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Bloomberg for <span className="text-blue-600">LLMs</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Real-time access to enriched SMB data, geographic analysis, and lead qualification powered by automated
            outreach tools for investors, brokers, and operators.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3">
                Book a Demo
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/solutions">
              <Button size="lg" variant="outline" className="text-lg px-8 py-3 bg-transparent">
                View Solutions
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Market Stats */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">5.8M</div>
              <div className="text-gray-600">Businesses Unsold</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">{"<"}1%</div>
              <div className="text-gray-600">Traditional Response Rate</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">8x</div>
              <div className="text-gray-600">Higher Response Rates</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">$300B+</div>
              <div className="text-gray-600">Market Opportunity</div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">The Problem: Search Funds and Brokers</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Traditional methods are failing in today's market</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-2 hover:border-blue-200 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center text-red-600">
                  <Target className="h-6 w-6 mr-2" />
                  Inefficient Outreach
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Traditional brokers close just 50 deals/year with {"<"}1% response rates from manual cold calls and
                  emails.
                </p>
                <div className="bg-red-50 p-3 rounded-lg">
                  <p className="text-sm text-red-700">
                    Search funds waste 300 hours/month on manual outreach to sell just 1 business.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-blue-200 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center text-red-600">
                  <BarChart3 className="h-6 w-6 mr-2" />
                  Lack of Data
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Buyers discount offers by 30-50% for "unverified" financials. 60% of Searchers cite paywalls as deal
                  blockers.
                </p>
                <div className="bg-red-50 p-3 rounded-lg">
                  <p className="text-sm text-red-700">37% deal failure rate from valuation mismatches in 2024.</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-blue-200 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center text-red-600">
                  <TrendingUp className="h-6 w-6 mr-2" />
                  Unclear Valuations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  80% of businesses don't sell due to lack of succession planning and messy accounting.
                </p>
                <div className="bg-red-50 p-3 rounded-lg">
                  <p className="text-sm text-red-700">
                    EBITDA multiples drop 33% (7.3x to 4.9x) for low-confidence deals.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Solutions Preview */}
      <section className="py-20 bg-gray-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">OkapIQ Solutions</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              AI-powered tools that transform how you find, qualify, and close deals
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-2 hover:border-blue-200 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center text-blue-600">
                  <Zap className="h-6 w-6 mr-2" />
                  AI Deal Engine
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Scans 33 million SMBs, qualifies leads 8x faster than manual cold calls, reduces wasted broker time by
                  90%.
                </p>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-blue-700">5,000 leads qualified per day</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-blue-200 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center text-blue-600">
                  <BarChart3 className="h-6 w-6 mr-2" />
                  Oppy Valuations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Analyzes financial data from messy books, benchmarks against 15 million private deals for confident
                  EBITDA scores.
                </p>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-blue-700">Accurate valuations from messy books</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-blue-200 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center text-blue-600">
                  <Globe className="h-6 w-6 mr-2" />
                  Geo Smart Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Identifies exact clusters of 12+ buyable SMBs per square mile with synergy scores for optimal
                  targeting.
                </p>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-blue-700">Geographic clustering intelligence</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Pilot Success Stories</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Real results from our early adopters</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-2 border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="text-green-800">Deal Closing Success</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Contacts Scraped:</span>
                    <span className="font-bold">100,000+</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Revenue Generated:</span>
                    <span className="font-bold text-green-600">$120K</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Response Rate Boost:</span>
                    <span className="font-bold text-green-600">70%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="text-green-800">Landscaping Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">SEO Increase:</span>
                    <span className="font-bold text-green-600">238%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Lead Generation:</span>
                    <span className="font-bold text-green-600">4x</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Revenue Impact:</span>
                    <span className="font-bold text-green-600">$1.6M</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="text-green-800">Private Equity Win</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Speed Increase:</span>
                    <span className="font-bold text-green-600">4x</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Lead Quality:</span>
                    <span className="font-bold text-green-600">50% Better</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Efficiency Gain:</span>
                    <span className="font-bold text-green-600">Dramatic</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 bg-gray-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How OkapIQ Works: Use Cases</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-blue-600">Search Funds</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Data Discovery</h4>
                    <p className="text-gray-600 text-sm">Search Snake scans 33M SMBs to find niche targets</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Qualification & Outreach</h4>
                    <p className="text-gray-600 text-sm">
                      AI-driven email & voice-modulated cold calls validate owners ready to sell
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-blue-600">Private Equity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Data Discovery</h4>
                    <p className="text-gray-600 text-sm">Identify "hidden gems" via multi-source data fusion</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Qualification & Outreach</h4>
                    <p className="text-gray-600 text-sm">Automated outreach sequences ensure rapid follow-up</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-blue-600">Family Offices</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Data Discovery</h4>
                    <p className="text-gray-600 text-sm">
                      Demographic & financial filters highlight value-aligned SMBs
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Qualification & Outreach</h4>
                    <p className="text-gray-600 text-sm">Personalized AI calls surface succession-ready owners</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Deal Flow?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join the investors and brokers already using OkapIQ to close more deals faster.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
                Book a Demo
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/solutions">
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-3 border-white text-white hover:bg-white hover:text-blue-600 bg-transparent"
              >
                View Solutions
              </Button>
            </Link>
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
                  <Mail className="h-4 w-4 mr-2" />
                  <span>hello@okapiq.com</span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  <span>+1 (555) 123-4567</span>
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
