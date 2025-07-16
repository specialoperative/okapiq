import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DataValidationMetrics } from "@/components/data-validation-metrics"
import { DataSourcesTable } from "@/components/data-sources-table"
import { ValidationMethodology } from "@/components/validation-methodology"

export default function DataValidationPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Data Validation & Quality</h2>
      </div>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="methodology">Methodology</TabsTrigger>
          <TabsTrigger value="sources">Data Sources</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Data Validation Framework</CardTitle>
              <CardDescription>Our comprehensive approach to ensuring data quality and reliability</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                OkapIQ's data validation framework ensures that all SMB data points are meticulously verified and
                validated through a multi-step process. Our system incorporates both automated validation algorithms and
                human expert review to achieve industry-leading accuracy rates.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Key Validation Metrics</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <span className="bg-green-100 p-1 rounded-full mr-2 mt-0.5">
                        <svg className="h-3 w-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <span>
                        <strong>Accuracy:</strong> 99.5% verified against primary sources
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-green-100 p-1 rounded-full mr-2 mt-0.5">
                        <svg className="h-3 w-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <span>
                        <strong>Completeness:</strong> 97.8% of all required data fields populated
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-green-100 p-1 rounded-full mr-2 mt-0.5">
                        <svg className="h-3 w-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <span>
                        <strong>Consistency:</strong> 98.3% internal data coherence
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-green-100 p-1 rounded-full mr-2 mt-0.5">
                        <svg className="h-3 w-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <span>
                        <strong>Timeliness:</strong> 95.2% of data updated within 30 days
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-green-100 p-1 rounded-full mr-2 mt-0.5">
                        <svg className="h-3 w-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <span>
                        <strong>Cross-validation:</strong> 96.7% verified across multiple sources
                      </span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">Validation Process</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <span className="bg-green-100 p-1 rounded-full mr-2 mt-0.5">
                        <span className="text-green-600 text-xs font-bold">1</span>
                      </span>
                      <span>
                        <strong>Data Collection:</strong> Multi-source aggregation with API integrations
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-green-100 p-1 rounded-full mr-2 mt-0.5">
                        <span className="text-green-600 text-xs font-bold">2</span>
                      </span>
                      <span>
                        <strong>Automated Validation:</strong> AI-powered anomaly detection
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-green-100 p-1 rounded-full mr-2 mt-0.5">
                        <span className="text-green-600 text-xs font-bold">3</span>
                      </span>
                      <span>
                        <strong>Cross-referencing:</strong> Verification against multiple sources
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-green-100 p-1 rounded-full mr-2 mt-0.5">
                        <span className="text-green-600 text-xs font-bold">4</span>
                      </span>
                      <span>
                        <strong>Expert Review:</strong> Human validation of critical data points
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-green-100 p-1 rounded-full mr-2 mt-0.5">
                        <span className="text-green-600 text-xs font-bold">5</span>
                      </span>
                      <span>
                        <strong>Continuous Monitoring:</strong> Ongoing data quality assessment
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Data Quality by Category</CardTitle>
                <CardDescription>Validation metrics across key data categories</CardDescription>
              </CardHeader>
              <CardContent>
                <DataValidationMetrics />
              </CardContent>
            </Card>
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Data Inclusion Rationale</CardTitle>
                <CardDescription>Why specific data points are critical for analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                    <h4 className="font-medium mb-2">Financial Metrics</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Revenue, EBITDA, and margin data provide essential valuation benchmarks. These metrics are
                      included because they directly impact acquisition pricing and ROI calculations, with 82% of
                      investors citing financial data as their primary decision factor.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                    <h4 className="font-medium mb-2">Owner Demographics</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Owner age and tenure data are critical predictors of sale likelihood. With 58% of SMB owners
                      planning to exit in 5-10 years, this data helps identify acquisition targets before they reach the
                      market.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                    <h4 className="font-medium mb-2">Industry Fragmentation</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Industry concentration metrics help identify roll-up opportunities. With 5M+ SMBs in highly
                      fragmented industries like HVAC and dental practices, this data is essential for PE firms seeking
                      consolidation plays.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                    <h4 className="font-medium mb-2">Geographic Data</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Location data combined with census information provides critical market context. This enables
                      analysis of local competition, pricing power, and growth potential based on demographic trends.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="methodology">
          <Card>
            <CardHeader>
              <CardTitle>Validation Methodology</CardTitle>
              <CardDescription>Our comprehensive approach to data validation</CardDescription>
            </CardHeader>
            <CardContent>
              <ValidationMethodology />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="sources">
          <Card>
            <CardHeader>
              <CardTitle>Data Sources</CardTitle>
              <CardDescription>Primary and secondary sources used for data collection and validation</CardDescription>
            </CardHeader>
            <CardContent>
              <DataSourcesTable />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

