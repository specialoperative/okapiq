"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import type { CrawledBusiness } from "@/services/crawler-service"
import { CrawlerResults } from "@/components/crawler-results"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, BarChart3, TrendingUp, Users, Mail, Database } from "lucide-react"
import { DemoRequestForm } from "@/components/demo-request-form"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function DemoPage() {
  const [results, setResults] = useState<CrawledBusiness[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("landscaping")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const loadDemoData = (industry: string) => {
    setIsLoading(true)
    setActiveTab(industry)

    // Simulate API call delay
    setTimeout(() => {
      // Generate mock data based on industry
      const mockData = generateMockDataForIndustry(industry)
      setResults(mockData)
      setIsLoading(false)
    }, 1500)
  }

  const generateMockDataForIndustry = (industry: string): CrawledBusiness[] => {
    // Industry-specific configurations
    const industryConfig: Record<string, any> = {
      landscaping: {
        names: ["GreenThumb Landscaping", "Lawn Masters", "Perfect Yards", "Nature's Touch", "EverGreen Gardens"],
        cities: ["Tampa", "Miami", "Orlando", "Jacksonville", "Gainesville"],
        revenueRange: [300000, 700000],
        employeeRange: [5, 15],
        fragmentationIndex: 89,
      },
      hvac: {
        names: ["Cool Breeze HVAC", "Climate Control", "Air Experts", "Comfort Zone", "Temperature Pro"],
        cities: ["Phoenix", "Mesa", "Scottsdale", "Tempe", "Chandler"],
        revenueRange: [800000, 1600000],
        employeeRange: [8, 20],
        fragmentationIndex: 78,
      },
      cleaning: {
        names: ["SparkleClean Services", "Maid Perfect", "CleanSweep", "Pristine Cleaning", "DustBusters"],
        cities: ["Dallas", "Fort Worth", "Arlington", "Plano", "Irving"],
        revenueRange: [200000, 500000],
        employeeRange: [10, 25],
        fragmentationIndex: 92,
      },
    }

    const config = industryConfig[industry] || industryConfig["landscaping"]

    // Generate 10 businesses
    return Array.from({ length: 10 }, (_, i) => {
      const name = i < config.names.length ? config.names[i] : `${config.names[i % config.names.length]} ${i + 1}`

      const city = config.cities[i % config.cities.length]
      const revenue =
        Math.floor(Math.random() * (config.revenueRange[1] - config.revenueRange[0])) + config.revenueRange[0]
      const employees =
        Math.floor(Math.random() * (config.employeeRange[1] - config.employeeRange[0])) + config.employeeRange[0]

      // Calculate arbitrage score - lower is better (undervalued)
      // Add some randomness but ensure the first few are good deals
      let arbitrageScore = i < 3 ? 0.5 + Math.random() * 0.3 : 0.7 + Math.random() * 0.8

      // Some super expensive ones
      if (i >= 8) {
        arbitrageScore = 1.3 + Math.random() * 0.7
      }

      return {
        name,
        address: `${100 + i} Main St, ${city}, FL`,
        phone: `(555) ${100 + i}-${1000 + i}`,
        website: `https://www.${name.toLowerCase().replace(/\s+/g, "")}.com`,
        industry,
        estimatedRevenue: revenue,
        employeeCount: employees,
        ownerName: `John Smith ${i + 1}`,
        ownerEmail: `john${i + 1}@${name.toLowerCase().replace(/\s+/g, "")}.com`,
        founded: 2000 + Math.floor(Math.random() * 20),
        socialProfiles: {
          linkedin: `https://linkedin.com/company/${name.toLowerCase().replace(/\s+/g, "-")}`,
        },
        arbitrageScore,
        fragmentationIndex: config.fragmentationIndex + (Math.random() * 6 - 3), // Small variation
      }
    })
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-emerald-700">
          OkapIQ Demo
        </h1>
        <p className="text-xl text-gray-600 mt-4">Experience how OkapIQ delivers comprehensive SMB intelligence</p>
      </div>

      <Card className="border-0 shadow-lg overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-700 text-white">
          <div className="flex items-center gap-3">
            <BarChart3 className="h-6 w-6" />
            <div>
              <CardTitle className="text-xl">Select an Industry to Explore</CardTitle>
              <CardDescription className="text-green-100">
                Try our demo to see how OkapIQ provides valuable SMB data for your needs
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger
                value="landscaping"
                onClick={() => loadDemoData("landscaping")}
                className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
              >
                Landscaping
              </TabsTrigger>
              <TabsTrigger
                value="hvac"
                onClick={() => loadDemoData("hvac")}
                className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
              >
                HVAC
              </TabsTrigger>
              <TabsTrigger
                value="cleaning"
                onClick={() => loadDemoData("cleaning")}
                className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
              >
                Cleaning Services
              </TabsTrigger>
            </TabsList>

            <div>
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <Loader2 className="h-12 w-12 animate-spin text-green-600 mb-4" />
                  <p className="text-lg font-medium text-green-800">Analyzing market data...</p>
                  <p className="text-gray-500 mt-2">Scanning businesses in the {activeTab} industry</p>
                </div>
              ) : (
                <TabsContent value={activeTab}>
                  {results.length > 0 && <CrawlerResults results={results} />}
                </TabsContent>
              )}
            </div>
          </Tabs>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg bg-gradient-to-r from-green-50 to-emerald-50">
        <CardContent className="flex flex-col items-center justify-center p-12 space-y-6">
          <div className="bg-white p-4 rounded-full shadow-md">
            <Database className="h-12 w-12 text-green-600" />
          </div>
          <div className="text-center max-w-2xl">
            <h2 className="text-2xl font-bold text-green-800">Ready to access comprehensive SMB data?</h2>
            <p className="text-gray-600 mt-4">
              OkapIQ helps professionals across industries find, analyze, and target SMBs with precision. Our database
              of 10M+ businesses provides the intelligence you need for your specific use case.
            </p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 h-auto text-lg">
                Start Your Free Trial
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Schedule Your Free Demo</DialogTitle>
                <DialogDescription>
                  Get access to our database of 10,000+ qualified leads and comprehensive financial data from Reference
                  USA.
                </DialogDescription>
              </DialogHeader>
              <DemoRequestForm />
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Mail className="h-5 w-5 text-green-500" />
              For Marketers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Build targeted campaigns with detailed company information and verified contact details.
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5 text-green-500" />
              For Business Development
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Identify potential clients and partners with our comprehensive business database.
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              For Investors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Discover investment opportunities with detailed market analysis and company metrics.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
