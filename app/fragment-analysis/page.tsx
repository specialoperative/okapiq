import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FragmentationChart } from "@/components/fragmentation-chart"
import { CorrelationMatrix } from "@/components/correlation-matrix"
import { CensusImpactAnalysis } from "@/components/census-impact-analysis"

export default function FragmentAnalysisPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Fragment Analysis</h2>
      </div>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="industry">Industry Analysis</TabsTrigger>
          <TabsTrigger value="census">Census Impact</TabsTrigger>
          <TabsTrigger value="correlations">Correlations</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Fragment Analysis Framework</CardTitle>
              <CardDescription>Understanding the impact of various factors on SMB metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-6">
                OkapIQ's fragment analysis provides a comprehensive understanding of how various factors influence SMB
                metrics and market dynamics. By analyzing the relationships between different data points, we can
                identify patterns, correlations, and causal relationships that drive business performance and
                acquisition opportunities.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Key Analytical Dimensions</h3>
                  <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                    <h4 className="font-medium mb-2">Census Data Impact</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Our analysis reveals how demographic factors like population age, income levels, and education
                      directly influence SMB performance metrics. For example, areas with higher concentrations of
                      residents aged 55+ show 32% higher rates of business owners seeking exit strategies.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                    <h4 className="font-medium mb-2">Economic Indicators</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      We correlate local economic indicators with SMB pricing power and growth potential. Data shows
                      that SMBs in areas with median incomes 20% above national average can sustain 15-25% higher
                      pricing for comparable services.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                    <h4 className="font-medium mb-2">Industry Fragmentation</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Our fragmentation analysis identifies industries with high consolidation potential. Sectors like
                      HVAC, dental practices, and local logistics show fragmentation rates above 85%, creating
                      significant roll-up opportunities.
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Analytical Methodologies</h3>
                  <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                    <h4 className="font-medium mb-2">Multivariate Regression</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      We employ advanced statistical techniques to isolate the impact of specific variables on SMB
                      performance. This allows us to quantify the effect of factors like owner age, local competition,
                      and market growth on valuation multiples.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                    <h4 className="font-medium mb-2">Time Series Analysis</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      By analyzing data over time, we identify trends, seasonality, and cyclical patterns that affect
                      SMB performance. This helps predict future performance and optimal timing for acquisitions or
                      market entry.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                    <h4 className="font-medium mb-2">Geospatial Mapping</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Our geospatial analysis overlays SMB data with demographic and economic indicators to identify
                      regional patterns and opportunities. This reveals underserved markets and areas with high growth
                      potential.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Industry Fragmentation</CardTitle>
                <CardDescription>Analysis of industry consolidation potential</CardDescription>
              </CardHeader>
              <CardContent>
                <FragmentationChart />
              </CardContent>
            </Card>
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Factor Correlation Matrix</CardTitle>
                <CardDescription>Relationships between key SMB metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <CorrelationMatrix />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="census">
          <Card>
            <CardHeader>
              <CardTitle>Census Data Impact Analysis</CardTitle>
              <CardDescription>How demographic factors influence SMB metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <CensusImpactAnalysis />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

