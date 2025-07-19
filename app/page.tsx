"use client"
import { ArrowRight, TrendingUp, Target, Zap, BarChart3, Globe, Phone, Mail, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useEffect, useState, useRef } from "react"

export default function HomePage() {
  const [mounted, setMounted] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
    
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"
          style={{
            transform: `translate(${scrollY * 0.1}px, ${scrollY * 0.05}px)`
          }}
        ></div>
        <div 
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-emerald-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse delay-1000"
          style={{
            transform: `translate(${-scrollY * 0.08}px, ${-scrollY * 0.03}px)`
          }}
        ></div>
        <div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-400/10 to-blue-400/10 rounded-full blur-3xl animate-pulse delay-500"
          style={{
            transform: `translate(-50%, -50%) rotate(${scrollY * 0.02}deg)`
          }}
        ></div>
      </div>

      {/* Floating Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-blue-400/30 rounded-full animate-float"
            style={{
              left: `${20 + i * 15}%`,
              top: `${10 + i * 20}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + i * 0.5}s`
            }}
          ></div>
        ))}
        {[...Array(4)].map((_, i) => (
          <div
            key={`purple-${i}`}
            className="absolute w-1 h-1 bg-purple-400/40 rounded-full animate-float"
            style={{
              right: `${15 + i * 20}%`,
              top: `${30 + i * 15}%`,
              animationDelay: `${i * 0.7}s`,
              animationDuration: `${4 + i * 0.3}s`
            }}
          ></div>
        ))}
      </div>

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 relative" ref={heroRef}>
        <div className="max-w-7xl mx-auto text-center">
          <div className={`transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="flex items-center justify-center mb-6">
              <Sparkles className="h-8 w-8 text-blue-500 mr-3 animate-pulse" />
              <h1 
                className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-purple-800 bg-clip-text text-transparent"
                style={{
                  transform: `translateY(${scrollY * 0.1}px)`,
                  opacity: Math.max(0.8, 1 - scrollY * 0.001)
                }}
              >
                Bloomberg for <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">LLMs</span>
              </h1>
              <Sparkles className="h-8 w-8 text-purple-500 ml-3 animate-pulse delay-300" />
            </div>
            <p 
              className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed"
              style={{
                transform: `translateY(${scrollY * 0.05}px)`,
                opacity: Math.max(0.9, 1 - scrollY * 0.0005)
              }}
            >
              Real-time access to enriched SMB data, geographic analysis, and lead qualification powered by automated
              outreach tools for investors, brokers, and operators.
            </p>
            <div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              style={{
                transform: `translateY(${scrollY * 0.02}px)`
              }}
            >
              <Link href="/contact">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-3 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group">
                  Book a Demo
                  <ArrowRight className="ml-2 h-5 w-5 animate-pulse group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </Link>
              <Link href="/solutions">
                <Button size="lg" variant="outline" className="text-lg px-8 py-3 bg-white/50 backdrop-blur-sm border-slate-300 hover:bg-white hover:border-slate-400 transition-all duration-300 transform hover:scale-105 group">
                  View Solutions
                  <div className="ml-2 w-2 h-2 bg-slate-400 rounded-full group-hover:bg-blue-600 transition-colors duration-300"></div>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Market Stats */}
      <section className="py-16 bg-gradient-to-r from-slate-50 to-blue-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { number: "5.8M", label: "Businesses Unsold" },
              { number: "<1%", label: "Traditional Response Rate" },
              { number: "8x", label: "Higher Response Rates" },
              { number: "$300B+", label: "Market Opportunity" }
            ].map((stat, index) => (
              <div 
                key={index} 
                className={`text-center transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} 
                style={{ 
                  transitionDelay: `${index * 100}ms`,
                  transform: `translateY(${Math.max(0, scrollY - (index * 100)) * 0.1}px)`
                }}
              >
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2 hover:scale-110 transition-transform duration-300">
                  {stat.number}
                </div>
                <div className="text-slate-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-4">
              The Problem: Search Funds and Brokers
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">Traditional methods are failing in today's market</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Target,
                title: "Inefficient Outreach",
                description: "Traditional brokers close just 50 deals/year with <1% response rates from manual cold calls and emails.",
                highlight: "Search funds waste 300 hours/month on manual outreach to sell just 1 business."
              },
              {
                icon: BarChart3,
                title: "Lack of Data",
                description: "Buyers discount offers by 30-50% for \"unverified\" financials. 60% of Searchers cite paywalls as deal blockers.",
                highlight: "37% deal failure rate from valuation mismatches in 2024."
              },
              {
                icon: TrendingUp,
                title: "Unclear Valuations",
                description: "80% of businesses don't sell due to lack of succession planning and messy accounting.",
                highlight: "EBITDA multiples drop 33% (7.3x to 4.9x) for low-confidence deals."
              }
            ].map((problem, index) => (
              <Card 
                key={index} 
                className={`border-2 border-slate-200 hover:border-blue-300 transition-all duration-300 transform hover:scale-105 hover:shadow-xl bg-white/70 backdrop-blur-sm ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} 
                style={{ 
                  transitionDelay: `${index * 200}ms`,
                  transform: `translateY(${Math.max(0, scrollY - (index * 200)) * 0.05}px) scale(${mounted ? 1 : 0.95})`
                }}
              >
                <CardHeader>
                  <CardTitle className="flex items-center text-red-600">
                    <problem.icon className="h-6 w-6 mr-2 animate-bounce" />
                    {problem.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 mb-4 leading-relaxed">
                    {problem.description}
                  </p>
                  <div className="bg-gradient-to-r from-red-50 to-orange-50 p-3 rounded-lg border border-red-100">
                    <p className="text-sm text-red-700 font-medium">
                      {problem.highlight}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Solutions Preview */}
      <section className="py-20 bg-gradient-to-r from-slate-50 to-blue-50/50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-4">
              OkapIQ Solutions
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              AI-powered tools that transform how you find, qualify, and close deals
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: "AI Deal Engine",
                description: "Scans 33 million SMBs, qualifies leads 8x faster than manual cold calls, reduces wasted broker time by 90%.",
                highlight: "5,000 leads qualified per day"
              },
              {
                icon: BarChart3,
                title: "Oppy Valuations",
                description: "Analyzes financial data from messy books, benchmarks against 15 million private deals for confident EBITDA scores.",
                highlight: "Accurate valuations from messy books"
              },
              {
                icon: Globe,
                title: "Geo Smart Analysis",
                description: "Identifies exact clusters of 12+ buyable SMBs per square mile with synergy scores for optimal targeting.",
                highlight: "Geographic clustering intelligence"
              }
            ].map((solution, index) => (
              <Card 
                key={index} 
                className={`border-2 border-slate-200 hover:border-blue-300 transition-all duration-300 transform hover:scale-105 hover:shadow-xl bg-white/70 backdrop-blur-sm ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} 
                style={{ 
                  transitionDelay: `${index * 200}ms`,
                  transform: `translateY(${Math.max(0, scrollY - (index * 200)) * 0.05}px) scale(${mounted ? 1 : 0.95})`
                }}
              >
                <CardHeader>
                  <CardTitle className="flex items-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    <solution.icon className="h-6 w-6 mr-2 text-blue-600 animate-pulse" />
                    {solution.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 mb-4 leading-relaxed">
                    {solution.description}
                  </p>
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-3 rounded-lg border border-blue-100">
                    <p className="text-sm text-blue-700 font-medium">
                      {solution.highlight}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-4">
              Pilot Success Stories
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">Real results from our early adopters</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Deal Closing Success",
                stats: [
                  { label: "Contacts Scraped:", value: "100,000+", color: "text-slate-900" },
                  { label: "Revenue Generated:", value: "$120K", color: "text-emerald-600" },
                  { label: "Response Rate Boost:", value: "70%", color: "text-emerald-600" }
                ]
              },
              {
                title: "Landscaping Growth",
                stats: [
                  { label: "SEO Increase:", value: "238%", color: "text-emerald-600" },
                  { label: "Lead Generation:", value: "4x", color: "text-emerald-600" },
                  { label: "Revenue Impact:", value: "$1.6M", color: "text-emerald-600" }
                ]
              },
              {
                title: "Private Equity Win",
                stats: [
                  { label: "Speed Increase:", value: "4x", color: "text-emerald-600" },
                  { label: "Lead Quality:", value: "50% Better", color: "text-emerald-600" },
                  { label: "Efficiency Gain:", value: "Dramatic", color: "text-emerald-600" }
                ]
              }
            ].map((story, index) => (
              <Card 
                key={index} 
                className={`border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-green-50 hover:shadow-xl transition-all duration-300 transform hover:scale-105 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} 
                style={{ 
                  transitionDelay: `${index * 200}ms`,
                  transform: `translateY(${Math.max(0, scrollY - (index * 200)) * 0.05}px) scale(${mounted ? 1 : 0.95})`
                }}
              >
                <CardHeader>
                  <CardTitle className="text-emerald-800">{story.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {story.stats.map((stat, statIndex) => (
                      <div key={statIndex} className="flex justify-between">
                        <span className="text-slate-600">{stat.label}</span>
                        <span className={`font-bold ${stat.color}`}>{stat.value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 bg-gradient-to-r from-slate-50 to-blue-50/50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-4">
              How OkapIQ Works: Use Cases
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Search Funds",
                cases: [
                  {
                    subtitle: "Data Discovery",
                    description: "Search Snake scans 33M SMBs to find niche targets"
                  },
                  {
                    subtitle: "Qualification & Outreach",
                    description: "AI-driven email & voice-modulated cold calls validate owners ready to sell"
                  }
                ]
              },
              {
                title: "Private Equity",
                cases: [
                  {
                    subtitle: "Data Discovery",
                    description: "Identify \"hidden gems\" via multi-source data fusion"
                  },
                  {
                    subtitle: "Qualification & Outreach",
                    description: "Automated outreach sequences ensure rapid follow-up"
                  }
                ]
              },
              {
                title: "Family Offices",
                cases: [
                  {
                    subtitle: "Data Discovery",
                    description: "Demographic & financial filters highlight value-aligned SMBs"
                  },
                  {
                    subtitle: "Qualification & Outreach",
                    description: "Personalized AI calls surface succession-ready owners"
                  }
                ]
              }
            ].map((useCase, index) => (
              <Card 
                key={index} 
                className={`bg-white/70 backdrop-blur-sm hover:shadow-xl transition-all duration-300 transform hover:scale-105 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} 
                style={{ 
                  transitionDelay: `${index * 200}ms`,
                  transform: `translateY(${Math.max(0, scrollY - (index * 200)) * 0.05}px) scale(${mounted ? 1 : 0.95})`
                }}
              >
                <CardHeader>
                  <CardTitle className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {useCase.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {useCase.cases.map((item, itemIndex) => (
                      <div key={itemIndex}>
                        <h4 className="font-semibold text-slate-900 mb-2">{item.subtitle}</h4>
                        <p className="text-slate-600 text-sm leading-relaxed">{item.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 text-white px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 via-purple-600/90 to-blue-700/90"></div>
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Deal Flow?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join the investors and brokers already using OkapIQ to close more deals faster.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-3 bg-white text-blue-600 hover:bg-slate-100 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl group">
                Book a Demo
                <ArrowRight className="ml-2 h-5 w-5 animate-pulse group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </Link>
            <Link href="/solutions">
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-3 border-white text-white hover:bg-white hover:text-blue-600 bg-transparent transition-all duration-300 transform hover:scale-105 group"
              >
                View Solutions
                <div className="ml-2 w-2 h-2 bg-white rounded-full group-hover:bg-blue-600 transition-colors duration-300"></div>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="text-2xl font-bold mb-4 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                OkapIQ
              </div>
              <p className="text-slate-400 mb-4">Bloomberg for LLMs</p>
              <p className="text-slate-400 text-sm">Real-time SMB data and AI-powered deal flow for modern investors.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-white">Solutions</h3>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <Link href="/solutions" className="hover:text-white transition-colors duration-200">
                    AI Deal Engine
                  </Link>
                </li>
                <li>
                  <Link href="/solutions" className="hover:text-white transition-colors duration-200">
                    Oppy Valuations
                  </Link>
                </li>
                <li>
                  <Link href="/solutions" className="hover:text-white transition-colors duration-200">
                    Geo Smart Analysis
                  </Link>
                </li>
                <li>
                  <Link href="/solutions" className="hover:text-white transition-colors duration-200">
                    Post-Acquisition
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-white">Company</h3>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <Link href="/case-studies" className="hover:text-white transition-colors duration-200">
                    Case Studies
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="hover:text-white transition-colors duration-200">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white transition-colors duration-200">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-white">Contact</h3>
              <div className="space-y-2 text-slate-400">
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
          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-400">
            <p>&copy; 2024 OkapIQ. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
