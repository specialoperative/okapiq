"use client"
import { ArrowRight, TrendingUp, Target, Zap, BarChart3, Globe, Phone, Mail, Users, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black">
      {/* Funding Banner */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white py-3">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm font-medium">
            🚀 Bootstrapped and profitable. Serving 500+ search funds and brokers.
            <Link href="/case-studies" className="underline ml-2 hover:text-green-200">
              Read our success stories →
            </Link>
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="border-b border-gray-800 bg-black/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <div className="text-2xl font-bold text-white">OkapIQ</div>
              <div className="hidden md:flex space-x-6">
                <Link href="/solutions" className="text-gray-300 hover:text-white font-medium">
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

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-gray-900 to-black">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-green-900 text-green-100 hover:bg-green-900">Bloomberg for LLMs</Badge>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Turn Manual Outreach Into
              <span className="text-green-400"> AI-Powered</span> Deal Flow
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              OkapIQ gives investors, brokers, and operators real-time access to enriched SMB data, geographic analysis,
              and lead qualification powered by automated outreach tools.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button size="lg" className="bg-green-600 hover:bg-green-700 text-lg px-8 py-4 text-white">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/solutions">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 py-4 bg-transparent border-green-600 text-green-400 hover:bg-green-600 hover:text-white"
                >
                  View Solutions
                </Button>
              </Link>
            </div>
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-green-400">8x</div>
                <div className="text-gray-300">Higher Response Rates</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-400">5,000</div>
                <div className="text-gray-300">Leads Qualified Daily</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-400">90%</div>
                <div className="text-gray-300">Time Reduction</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="py-16 bg-black">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Trusted by Search Funds & Brokers Nationwide</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              From family offices to private equity firms, leading investors use OkapIQ to close deals faster
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center opacity-60">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-400">Search Funds</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-400">Private Equity</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-400">Family Offices</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-400">Business Brokers</div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-6">The Problem: Search Funds and Brokers Are Stuck</h2>
              <p className="text-xl text-gray-300">While 5.8M businesses sit unsold, traditional methods are failing</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="border-red-600 bg-red-900/20">
                <CardHeader>
                  <CardTitle className="text-red-400 flex items-center">
                    <Target className="h-6 w-6 mr-2" />
                    Inefficient Outreach
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-red-300">
                  <p className="mb-4">Traditional brokers close just 50 deals/year with {"<"}1% response rates</p>
                  <p>Search funds waste 300 hours/month on manual outreach to sell just 1 business</p>
                </CardContent>
              </Card>
              <Card className="border-orange-600 bg-orange-900/20">
                <CardHeader>
                  <CardTitle className="text-orange-400 flex items-center">
                    <BarChart3 className="h-6 w-6 mr-2" />
                    Lack of Data
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-orange-300">
                  <p className="mb-4">Buyers discount offers by 30-50% for "unverified" financials</p>
                  <p>60% of Searchers cite paywalls as deal-blocking barriers</p>
                </CardContent>
              </Card>
              <Card className="border-yellow-600 bg-yellow-900/20">
                <CardHeader>
                  <CardTitle className="text-yellow-400 flex items-center">
                    <TrendingUp className="h-6 w-6 mr-2" />
                    Unclear Valuations
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-yellow-300">
                  <p className="mb-4">37% deal failure rate from valuation mismatches</p>
                  <p>EBITDA multiples drop 33% for low-confidence deals</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Solutions Overview */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-6">Key Features for Buyers and Brokers</h2>
              <p className="text-xl text-gray-300">
                End-to-end platform from deal discovery to post-acquisition success
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <Card className="bg-gray-900 hover:shadow-lg transition-shadow border border-gray-800">
                <CardHeader>
                  <div className="w-12 h-12 bg-green-900 rounded-lg flex items-center justify-center mb-4">
                    <Zap className="h-6 w-6 text-green-400" />
                  </div>
                  <CardTitle className="text-white">AI Deal Engine</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">Scans 33M SMBs, qualifies leads 8x faster than manual cold calls</p>
                </CardContent>
              </Card>
              <Card className="bg-gray-900 hover:shadow-lg transition-shadow border border-gray-800">
                <CardHeader>
                  <div className="w-12 h-12 bg-green-900 rounded-lg flex items-center justify-center mb-4">
                    <BarChart3 className="h-6 w-6 text-green-400" />
                  </div>
                  <CardTitle className="text-white">Oppy Valuations</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">
                    Analyzes messy books, benchmarks against 15M deals for confident EBITDA scores
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-gray-900 hover:shadow-lg transition-shadow border border-gray-800">
                <CardHeader>
                  <div className="w-12 h-12 bg-green-900 rounded-lg flex items-center justify-center mb-4">
                    <Globe className="h-6 w-6 text-green-400" />
                  </div>
                  <CardTitle className="text-white">Geo Smart Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">
                    Identifies clusters of 12+ buyable SMBs per square mile with synergy scores
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-gray-900 hover:shadow-lg transition-shadow border border-gray-800">
                <CardHeader>
                  <div className="w-12 h-12 bg-green-900 rounded-lg flex items-center justify-center mb-4">
                    <Users className="h-6 w-6 text-green-400" />
                  </div>
                  <CardTitle className="text-white">Post-Acquisition</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">
                    Marketing, staffing, lead generation support for successful integration
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Case Study */}
      <section className="py-20 bg-green-900/20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <Badge className="mb-4 bg-green-600 text-white">Success Story</Badge>
                <h2 className="text-4xl font-bold text-white mb-6">From 300 Hours to 8x Response Rates</h2>
                <p className="text-xl text-gray-300 mb-8">
                  See how a leading search fund reduced manual outreach time by 90% while increasing qualified leads and
                  closing deals 4x faster than traditional brokers.
                </p>
                <Link href="/case-studies">
                  <Button className="bg-green-600 hover:bg-green-700 text-white">
                    Read Full Case Study
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <Card className="bg-gray-900 border border-gray-800">
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-green-400 mb-2">$120K</div>
                    <div className="text-gray-300">Revenue Generated</div>
                  </CardContent>
                </Card>
                <Card className="bg-gray-900 border border-gray-800">
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-green-400 mb-2">70%</div>
                    <div className="text-gray-300">Higher Response Rate</div>
                  </CardContent>
                </Card>
                <Card className="bg-gray-900 border border-gray-800">
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-green-400 mb-2">4x</div>
                    <div className="text-gray-300">Faster Deal Closing</div>
                  </CardContent>
                </Card>
                <Card className="bg-gray-900 border border-gray-800">
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-green-400 mb-2">90%</div>
                    <div className="text-gray-300">Time Reduction</div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Market Opportunity */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-white mb-6">A $300B+ Addressable Market</h2>
            <p className="text-xl text-gray-300 mb-12">
              The SMB acquisition market is projected to reach $300B by 2025, driven by increased investment from
              private equity firms and search funds
            </p>
            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-green-400 mb-2">$300B+</div>
                <div className="text-gray-300">SMB Acquisition Market</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-400 mb-2">5.8M</div>
                <div className="text-gray-300">Businesses Available</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-400 mb-2">33M</div>
                <div className="text-gray-300">SMBs in Database</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-400 mb-2">0.05%</div>
                <div className="text-gray-300">Target Market Share</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-6">What Our Customers Say</h2>
              <p className="text-xl text-gray-300">Real results from search funds and brokers using OkapIQ</p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="bg-black border border-gray-800">
                <CardContent className="p-8">
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-300 mb-6 text-lg">
                    "OkapIQ transformed our deal sourcing. We went from 300 hours of manual outreach per month to
                    qualifying 5,000 leads daily. Our response rates increased 8x."
                  </p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-green-900 rounded-full flex items-center justify-center mr-4">
                      <Users className="h-6 w-6 text-green-400" />
                    </div>
                    <div>
                      <div className="font-semibold text-white">Sarah Chen</div>
                      <div className="text-gray-300">Managing Partner, Apex Search Fund</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-black border border-gray-800">
                <CardContent className="p-8">
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-300 mb-6 text-lg">
                    "The AI Deal Engine helped us close 4x faster than traditional methods. We're now turning $1M home
                    agents into $1M business brokers overnight."
                  </p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-green-900 rounded-full flex items-center justify-center mr-4">
                      <TrendingUp className="h-6 w-6 text-green-400" />
                    </div>
                    <div>
                      <div className="font-semibold text-white">Michael Rodriguez</div>
                      <div className="text-gray-300">Senior Broker, Elite Business Sales</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">Ready to 8x Your Response Rates?</h2>
            <p className="text-xl mb-8 opacity-90">
              Join 500+ search funds and brokers who've transformed their deal flow with OkapIQ. Start your free trial
              today and see results in 24 hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100 text-lg px-8 py-4">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/solutions">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-green-600 text-lg px-8 py-4 bg-transparent"
                >
                  View All Solutions
                </Button>
              </Link>
            </div>
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-2xl font-bold mb-2">✓ No Setup Fees</div>
                <div className="opacity-80">Get started immediately</div>
              </div>
              <div>
                <div className="text-2xl font-bold mb-2">✓ 24/7 Support</div>
                <div className="opacity-80">Expert help when you need it</div>
              </div>
              <div>
                <div className="text-2xl font-bold mb-2">✓ Cancel Anytime</div>
                <div className="opacity-80">No long-term commitments</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="text-2xl font-bold mb-4">OkapIQ</div>
              <p className="text-gray-400 mb-4">
                Bloomberg for LLMs. Transforming SMB acquisitions with AI-powered deal flow.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center">
                  <Mail className="h-5 w-5 text-green-400" />
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center">
                  <Phone className="h-5 w-5 text-green-400" />
                </div>
              </div>
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
                  <Link href="/contact" className="hover:text-white">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/case-studies" className="hover:text-white">
                    Case Studies
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="hover:text-white">
                    Platform
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Contact Info</h3>
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
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>© 2024 OkapIQ. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
