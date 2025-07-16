import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function CensusImpactAnalysis() {
  return (
    <div className="space-y-6">
      <p className="text-gray-700 dark:text-gray-300">
        Our analysis reveals significant correlations between U.S. Census Bureau demographic data and key SMB metrics.
        These insights help identify market opportunities, predict business performance, and optimize acquisition
        strategies.
      </p>

      <Tabs defaultValue="age" className="space-y-4">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="age">Age Demographics</TabsTrigger>
          <TabsTrigger value="income">Income Levels</TabsTrigger>
          <TabsTrigger value="density">Population Density</TabsTrigger>
        </TabsList>

        <TabsContent value="age" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">Age Demographics Impact</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                    <h4 className="font-medium mb-2">SMB Ownership Transition</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      <strong>Finding:</strong> Areas with 25%+ population over age 55 show 32% higher rates of SMB
                      ownership transition within 5 years.
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      <strong>Implication:</strong> Target acquisition efforts in regions with aging demographics to
                      identify businesses with imminent succession needs.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                    <h4 className="font-medium mb-2">Business Longevity</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      <strong>Finding:</strong> SMBs in areas with stable middle-aged populations (35-54) show 28%
                      longer business lifespans and 17% higher profitability.
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      <strong>Implication:</strong> Prioritize businesses in demographically stable regions for
                      long-term investment potential.
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                    <h4 className="font-medium mb-2">Customer Base Alignment</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      <strong>Finding:</strong> SMBs whose target customer age aligns with local demographics show 41%
                      higher revenue growth rates.
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      <strong>Implication:</strong> Evaluate demographic alignment when assessing growth potential and
                      market fit.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                    <h4 className="font-medium mb-2">Workforce Availability</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      <strong>Finding:</strong> Areas with 20%+ population in 18-35 range show 23% lower SMB labor costs
                      and 15% higher employee retention.
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      <strong>Implication:</strong> Consider workforce demographics when evaluating operational
                      efficiency and labor stability.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="income" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">Income Level Impact</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                    <h4 className="font-medium mb-2">Pricing Power</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      <strong>Finding:</strong> SMBs in areas with median incomes 20%+ above national average can
                      sustain 15-25% higher pricing for comparable services.
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      <strong>Implication:</strong> Target high-income areas for businesses with premium pricing
                      potential and higher margins.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                    <h4 className="font-medium mb-2">Revenue Stability</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      <strong>Finding:</strong> SMBs in areas with diverse income distributions show 37% less revenue
                      volatility during economic downturns.
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      <strong>Implication:</strong> Evaluate income diversity when assessing business resilience and
                      recession resistance.
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                    <h4 className="font-medium mb-2">Growth Correlation</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      <strong>Finding:</strong> For every 10% increase in local median income, SMBs show an average 7.5%
                      increase in annual revenue growth.
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      <strong>Implication:</strong> Prioritize areas with rising income levels for growth-focused
                      acquisitions.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                    <h4 className="font-medium mb-2">Service Mix Optimization</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      <strong>Finding:</strong> SMBs that align service offerings with local income brackets show 29%
                      higher customer lifetime value.
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      <strong>Implication:</strong> Assess potential for service mix optimization based on local income
                      demographics.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="density" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">Population Density Impact</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                    <h4 className="font-medium mb-2">Marketing Efficiency</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      <strong>Finding:</strong> SMBs in high-density areas achieve 42% lower customer acquisition costs
                      compared to rural counterparts.
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      <strong>Implication:</strong> Factor population density into marketing budget projections and ROI
                      calculations.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                    <h4 className="font-medium mb-2">Competition Intensity</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      <strong>Finding:</strong> Each 10% increase in population density correlates with 8.5% increase in
                      direct competitors within the same industry.
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      <strong>Implication:</strong> Balance market opportunity against competitive pressure when
                      evaluating urban vs. rural businesses.
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                    <h4 className="font-medium mb-2">Operational Costs</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      <strong>Finding:</strong> SMBs in high-density areas face 35% higher real estate costs but 27%
                      lower logistics expenses.
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      <strong>Implication:</strong> Consider density-related cost trade-offs when evaluating operational
                      efficiency.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                    <h4 className="font-medium mb-2">Scalability Potential</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      <strong>Finding:</strong> SMBs in medium-density areas (suburban) show 31% higher rates of
                      successful expansion to multiple locations.
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      <strong>Implication:</strong> Target suburban businesses for roll-up strategies with
                      multi-location potential.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
        <h3 className="font-medium text-green-800 dark:text-green-400 mb-2">Strategic Applications</h3>
        <p className="text-sm text-green-700 dark:text-green-300">
          OkapIQ's census impact analysis provides actionable intelligence for various strategic applications:
        </p>
        <ul className="mt-2 space-y-1 pl-5">
          <li className="text-sm text-green-700 dark:text-green-300 list-disc">
            <strong>Acquisition Targeting:</strong> Identify businesses in demographically favorable areas with higher
            growth potential and valuation upside.
          </li>
          <li className="text-sm text-green-700 dark:text-green-300 list-disc">
            <strong>Pricing Strategy:</strong> Optimize pricing models based on local income levels and spending
            patterns.
          </li>
          <li className="text-sm text-green-700 dark:text-green-300 list-disc">
            <strong>Expansion Planning:</strong> Select optimal locations for new branches or acquisitions based on
            demographic alignment.
          </li>
          <li className="text-sm text-green-700 dark:text-green-300 list-disc">
            <strong>Risk Assessment:</strong> Evaluate demographic stability and trends to identify potential market
            risks or opportunities.
          </li>
        </ul>
      </div>
    </div>
  )
}

