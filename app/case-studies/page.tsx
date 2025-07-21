"use client"

import { ArrowLeft, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default function CaseStudiesPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-gray-900">
                OkapIQ
              </Link>
              <Badge variant="secondary" className="ml-3 bg-blue-50 text-blue-700">
                Bloomberg for LLMs
              </Badge>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/solutions" className="text-gray-600 hover:text-gray-900 font-medium">
                Solutions
              </Link>
              <Link href="/case-studies" className="text-gray-900 font-medium border-b-2 border-blue-600">
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

      {/* Header */}
      <section className="pt-16 pb-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-8">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Success Stories</h1>
          <p className="text-xl text-gray-600 max-w-3xl">
            Real results from investors and brokers using OkapIQ to transform their deal flow and close more
            acquisitions.
          </p>
        </div>
      </section>

      {/* Case Studies */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-20">
          {/* Case Study 1: Deal Closing Success */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-green-100 text-green-800">Deal Closing Success</Badge>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">$120K Revenue Generated in 4 Months</h2>
              <p className="text-lg text-gray-600 mb-6">
                A mid-market search fund was struggling with manual outreach, achieving less than 1% response rates and
                wasting hundreds of hours monthly on unqualified leads.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Challenge</h4>
                    <p className="text-gray-600">
                      Manual cold calling with {"<"}1% response rates, 300+ hours wasted monthly
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Solution</h4>
                    <p className="text-gray-600">
                      OkapIQ's AI Deal Engine scraped 100,000+ qualified contacts with automated outreach
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Result</h4>
                    <p className="text-gray-600">
                      70% boost in seller response rates, $120K revenue generated, $4K earned by OkapIQ
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <Card className="border-2 border-green-200 bg-green-50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-2xl font-bold text-green-800">100K+</CardTitle>
                  <CardDescription className="text-green-700">Contacts Scraped</CardDescription>
                </CardHeader>
              </Card>
              <Card className="border-2 border-green-200 bg-green-50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-2xl font-bold text-green-800">$120K</CardTitle>
                  <CardDescription className="text-green-700">Revenue Generated</CardDescription>
                </CardHeader>
              </Card>
              <Card className="border-2 border-green-200 bg-green-50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-2xl font-bold text-green-800">70%</CardTitle>
                  <CardDescription className="text-green-700">Response Rate Boost</CardDescription>
                </CardHeader>
              </Card>
              <Card className="border-2 border-green-200 bg-green-50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-2xl font-bold text-green-800">4 Months</CardTitle>
                  <CardDescription className="text-green-700">Time to Results</CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>

          {/* Case Study 2: Landscaping Company Growth */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="grid grid-cols-2 gap-6">
                <Card className="border-2 border-blue-200 bg-blue-50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-2xl font-bold text-blue-800">238%</CardTitle>
                    <CardDescription className="text-blue-700">SEO Increase</CardDescription>
                  </CardHeader>
                </Card>
                <Card className="border-2 border-blue-200 bg-blue-50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-2xl font-bold text-blue-800">4x</CardTitle>
                    <CardDescription className="text-blue-700">Lead Generation</CardDescription>
                  </CardHeader>
                </Card>
                <Card className="border-2 border-blue-200 bg-blue-50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-2xl font-bold text-blue-800">$400K</CardTitle>
                    <CardDescription className="text-blue-700">Company A Revenue</CardDescription>
                  </CardHeader>
                </Card>
                <Card className="border-2 border-blue-200 bg-blue-50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-2xl font-bold text-blue-800">$1.2M</CardTitle>
                    <CardDescription className="text-blue-700">Company B Revenue</CardDescription>
                  </CardHeader>
                </Card>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <Badge className="mb-4 bg-blue-100 text-blue-800">Post-Acquisition Growth</Badge>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Landscaping Companies Scale 4x with Automation</h2>
              <p className="text-lg text-gray-600 mb-6">
                Two recently acquired landscaping companies needed rapid growth to justify acquisition multiples and
                compete in fragmented local markets.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-blue-500 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Challenge</h4>
                    <p className="text-gray-600">
                      Post-acquisition growth pressure, local competition, manual marketing processes
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-blue-500 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Solution</h4>
                    <p className="text-gray-600">
                      OkapIQ's automated marketing suite with SEO optimization and lead generation tools
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-blue-500 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Result</h4>
                    <p className="text-gray-600">
                      Combined $1.6M revenue increase across both companies within 12 months
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Case Study 3: Private Equity Success */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-purple-100 text-purple-800">Private Equity Efficiency</Badge>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">4x Faster Lead Aggregation for PE Firm</h2>
              <p className="text-lg text-gray-600 mb-6">
                A $500M private equity firm was spending too much time on manual deal sourcing and qualification,
                missing opportunities in fast-moving markets.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-purple-500 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Challenge</h4>
                    <p className="text-gray-600">
                      Slow manual deal sourcing, low-quality leads, missed opportunities in competitive markets
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-purple-500 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Solution</h4>
                    <p className="text-gray-600">
                      OkapIQ's multi-source data fusion with automated qualification and outreach sequences
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-purple-500 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Result</h4>
                    <p className="text-gray-600">
                      50% improvement in lead quality, 4x faster aggregation, dramatically improved efficiency
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <Card className="border-2 border-purple-200 bg-purple-50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-2xl font-bold text-purple-800">4x</CardTitle>
                  <CardDescription className="text-purple-700">Speed Increase</CardDescription>
                </CardHeader>
              </Card>
              <Card className="border-2 border-purple-200 bg-purple-50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-2xl font-bold text-purple-800">50%</CardTitle>
                  <CardDescription className="text-purple-700">Better Lead Quality</CardDescription>
                </CardHeader>
              </Card>
              <Card className="border-2 border-purple-200 bg-purple-50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-2xl font-bold text-purple-800">$500M</CardTitle>
                  <CardDescription className="text-purple-700">Fund Size</CardDescription>
                </CardHeader>
              </Card>
              <Card className="border-2 border-purple-200 bg-purple-50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-2xl font-bold text-purple-800">90%</CardTitle>
                  <CardDescription className="text-purple-700">Time Saved</CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>

          {/* Real Estate Agent Pivot Case Study */}
          <div className="bg-gray-50 rounded-2xl p-8 lg:p-12">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-orange-100 text-orange-800">Agent Transformation</Badge>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Turning $1M Home Agents into $1M Business Brokers
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                With 87% of realtors considering exit (NAR 2024), OkapIQ offers a pivot to business sales with no new
                license needed.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="text-center">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-orange-600">4x</CardTitle>
                  <CardDescription>Faster Closing vs Traditional Brokers</CardDescription>
                </CardHeader>
              </Card>
              <Card className="text-center">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-orange-600">120 Days</CardTitle>
                  <CardDescription>Average Close Time</CardDescription>
                </CardHeader>
              </Card>
              <Card className="text-center">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-orange-600">3%</CardTitle>
                  <CardDescription>Commission Rate (vs 1.5% homes)</CardDescription>
                </CardHeader>
              </Card>
              <Card className="text-center">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-orange-600">$15K</CardTitle>
                  <CardDescription>Fee on $500K Business Sale</CardDescription>
                </CardHeader>
              </Card>
            </div>

            <div className="bg-white rounded-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Earnings Comparison</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-red-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-red-800 mb-2">Traditional Home Sale</h4>
                  <p className="text-red-700">$500K home = $7.5K fee (1.5%)</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">Business Sale with OkapIQ</h4>
                  <p className="text-green-700">$500K business = $15K fee (3%) + 10% bonus for post-close tools</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Write Your Success Story?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join the investors and brokers already transforming their deal flow with OkapIQ.
          </p>
          <Link href="/contact">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
              Book Your Demo Today
            </Button>
          </Link>
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
                  <span>hello@okapiq.com</span>
                </div>
                <div className="flex items-center">
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
