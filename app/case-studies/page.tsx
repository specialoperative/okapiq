"use client"

import { ArrowLeft, CheckCircle, ArrowRight, Users, TrendingUp, Mail, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Star } from "lucide-react"

export default function CaseStudiesPage() {
  return (
    <div className="min-h-screen bg-black">
      {/* Navigation */}
      <nav className="border-b border-gray-800 bg-black/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link href="/" className="text-2xl font-bold text-white">
                OkapIQ
              </Link>
              <div className="hidden md:flex space-x-6">
                <Link href="/solutions" className="text-gray-300 hover:text-white font-medium">
                  Solutions
                </Link>
                <Link href="/case-studies" className="text-white font-medium border-b-2 border-green-600">
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
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Success Stories</h1>
          <p className="text-xl text-gray-300 max-w-3xl">
            Real results from investors and brokers using OkapIQ to transform their deal flow and close more
            acquisitions.
          </p>
        </div>
      </section>

      {/* Case Studies */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black">
        <div className="max-w-7xl mx-auto space-y-20">
          {/* Case Study 1: Deal Closing Success */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-green-900 text-green-100">Deal Closing Success</Badge>
              <h2 className="text-3xl font-bold text-white mb-6">$120K Revenue Generated in 4 Months</h2>
              <p className="text-lg text-gray-300 mb-6">
                A mid-market search fund was struggling with manual outreach, achieving less than 1% response rates and
                wasting hundreds of hours monthly on unqualified leads.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-white">Challenge</h4>
                    <p className="text-gray-300">
                      Manual cold calling with {"<"}1% response rates, 300+ hours wasted monthly
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-white">Solution</h4>
                    <p className="text-gray-300">
                      OkapIQ's AI Deal Engine scraped 100,000+ qualified contacts with automated outreach
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-white">Result</h4>
                    <p className="text-gray-300">
                      70% boost in seller response rates, $120K revenue generated, $4K earned by OkapIQ
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <Card className="border-2 border-green-600 bg-green-900/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-2xl font-bold text-green-400">100K+</CardTitle>
                  <CardDescription className="text-green-300">Contacts Scraped</CardDescription>
                </CardHeader>
              </Card>
              <Card className="border-2 border-green-600 bg-green-900/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-2xl font-bold text-green-400">$120K</CardTitle>
                  <CardDescription className="text-green-300">Revenue Generated</CardDescription>
                </CardHeader>
              </Card>
              <Card className="border-2 border-green-600 bg-green-900/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-2xl font-bold text-green-400">70%</CardTitle>
                  <CardDescription className="text-green-300">Response Rate Boost</CardDescription>
                </CardHeader>
              </Card>
              <Card className="border-2 border-green-600 bg-green-900/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-2xl font-bold text-green-400">4 Months</CardTitle>
                  <CardDescription className="text-green-300">Time to Results</CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>

          {/* Case Study 2: Landscaping Company Growth */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="grid grid-cols-2 gap-6">
                <Card className="border-2 border-green-600 bg-green-900/20">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-2xl font-bold text-green-400">238%</CardTitle>
                    <CardDescription className="text-green-300">SEO Increase</CardDescription>
                  </CardHeader>
                </Card>
                <Card className="border-2 border-green-600 bg-green-900/20">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-2xl font-bold text-green-400">4x</CardTitle>
                    <CardDescription className="text-green-300">Lead Generation</CardDescription>
                  </CardHeader>
                </Card>
                <Card className="border-2 border-green-600 bg-green-900/20">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-2xl font-bold text-green-400">$400K</CardTitle>
                    <CardDescription className="text-green-300">Company A Revenue</CardDescription>
                  </CardHeader>
                </Card>
                <Card className="border-2 border-green-600 bg-green-900/20">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-2xl font-bold text-green-400">$1.2M</CardTitle>
                    <CardDescription className="text-green-300">Company B Revenue</CardDescription>
                  </CardHeader>
                </Card>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <Badge className="mb-4 bg-green-900 text-green-100">Post-Acquisition Growth</Badge>
              <h2 className="text-3xl font-bold text-white mb-6">Landscaping Companies Scale 4x with Automation</h2>
              <p className="text-lg text-gray-300 mb-6">
                Two recently acquired landscaping companies needed rapid growth to justify acquisition multiples and
                compete in fragmented local markets.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-white">Challenge</h4>
                    <p className="text-gray-300">
                      Post-acquisition growth pressure, local competition, manual marketing processes
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-white">Solution</h4>
                    <p className="text-gray-300">
                      OkapIQ's automated marketing suite with SEO optimization and lead generation tools
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-white">Result</h4>
                    <p className="text-gray-300">
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
              <Badge className="mb-4 bg-green-900 text-green-100">Private Equity Efficiency</Badge>
              <h2 className="text-3xl font-bold text-white mb-6">4x Faster Lead Aggregation for PE Firm</h2>
              <p className="text-lg text-gray-300 mb-6">
                A $500M private equity firm was spending too much time on manual deal sourcing and qualification,
                missing opportunities in fast-moving markets.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-white">Challenge</h4>
                    <p className="text-gray-300">
                      Slow manual deal sourcing, low-quality leads, missed opportunities in competitive markets
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-white">Solution</h4>
                    <p className="text-gray-300">
                      OkapIQ's multi-source data fusion with automated qualification and outreach sequences
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-white">Result</h4>
                    <p className="text-gray-300">
                      50% improvement in lead quality, 4x faster aggregation, dramatically improved efficiency
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <Card className="border-2 border-green-600 bg-green-900/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-2xl font-bold text-green-400">4x</CardTitle>
                  <CardDescription className="text-green-300">Speed Increase</CardDescription>
                </CardHeader>
              </Card>
              <Card className="border-2 border-green-600 bg-green-900/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-2xl font-bold text-green-400">50%</CardTitle>
                  <CardDescription className="text-green-300">Better Lead Quality</CardDescription>
                </CardHeader>
              </Card>
              <Card className="border-2 border-green-600 bg-green-900/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-2xl font-bold text-green-400">$500M</CardTitle>
                  <CardDescription className="text-green-300">Fund Size</CardDescription>
                </CardHeader>
              </Card>
              <Card className="border-2 border-green-600 bg-green-900/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-2xl font-bold text-green-400">90%</CardTitle>
                  <CardDescription className="text-green-300">Time Saved</CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>

          {/* Real Estate Agent Pivot Case Study */}
          <div className="bg-gray-900 rounded-2xl p-8 lg:p-12 border border-gray-800">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-green-900 text-green-100">Agent Transformation</Badge>
              <h2 className="text-3xl font-bold text-white mb-6">Turning $1M Home Agents into $1M Business Brokers</h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                With 87% of realtors considering exit (NAR 2024), OkapIQ offers a pivot to business sales with no new
                license needed.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="text-center bg-black border border-gray-800">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-green-400">4x</CardTitle>
                  <CardDescription className="text-gray-300">Faster Closing vs Traditional Brokers</CardDescription>
                </CardHeader>
              </Card>
              <Card className="text-center bg-black border border-gray-800">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-green-400">120 Days</CardTitle>
                  <CardDescription className="text-gray-300">Average Close Time</CardDescription>
                </CardHeader>
              </Card>
              <Card className="text-center bg-black border border-gray-800">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-green-400">3%</CardTitle>
                  <CardDescription className="text-gray-300">Commission Rate (vs 1.5% homes)</CardDescription>
                </CardHeader>
              </Card>
              <Card className="text-center bg-black border border-gray-800">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-green-400">$15K</CardTitle>
                  <CardDescription className="text-gray-300">Fee on $500K Business Sale</CardDescription>
                </CardHeader>
              </Card>
            </div>

            <div className="bg-black rounded-lg p-6 border border-gray-800">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Earnings Comparison</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-red-900/20 p-4 rounded-lg border border-red-600">
                  <h4 className="font-semibold text-red-400 mb-2">Traditional Home Sale</h4>
                  <p className="text-red-300">$500K home = $7.5K fee (1.5%)</p>
                </div>
                <div className="bg-green-900/20 p-4 rounded-lg border-2 border-green-600">
                  <h4 className="font-semibold text-green-400 mb-2">Business Sale with OkapIQ</h4>
                  <p className="text-green-300">$500K business = $15K fee (3%) + 10% bonus for post-close tools</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-6">What Our Clients Say</h2>
              <p className="text-xl text-gray-300">
                Hear directly from the professionals transforming their businesses with OkapIQ
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="bg-gray-900 border border-gray-800">
                <div className="p-8">
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-300 mb-6 text-lg">
                    "The AI Deal Engine completely transformed our approach. We went from spending 300 hours a month on
                    manual outreach to qualifying thousands of leads daily. The ROI has been incredible."
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
                </div>
              </Card>
              <Card className="bg-gray-900 border border-gray-800">
                <div className="p-8">
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-300 mb-6 text-lg">
                    "OkapIQ helped us transition from real estate to business brokerage seamlessly. The commission rates
                    are double what we made in residential, and deals close 4x faster."
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
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-6 text-center">Ready to Write Your Success Story?</h2>
          <p className="text-xl mb-8 opacity-90 text-center">
            Join the growing list of search funds, brokers, and private equity firms transforming their deal flow with
            OkapIQ.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100 text-lg px-8 py-4">
                Start Your Success Story
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/solutions">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-green-600 text-lg px-8 py-4 bg-transparent"
              >
                Explore Solutions
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
