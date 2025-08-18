import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

export default function IndustryInsightsPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Industry Insights Dashboard</h1>
        <p className="text-muted-foreground">
          Comprehensive analysis of business distribution and email coverage across industries
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-bold">Industry Distribution</CardTitle>
              <CardDescription>Business count by industry with email coverage insights</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center">
                <div className="text-center">
                  <p className="text-lg font-medium mb-4">Industry Distribution</p>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Services</span>
                      <span>34.8%</span>
                    </div>
                    <Progress value={34.8} />

                    <div className="flex justify-between">
                      <span>Manufacturing</span>
                      <span>30.6%</span>
                    </div>
                    <Progress value={30.6} />

                    <div className="flex justify-between">
                      <span>Wholesale</span>
                      <span>24.7%</span>
                    </div>
                    <Progress value={24.7} />

                    <div className="flex justify-between">
                      <span>Construction</span>
                      <span>6.5%</span>
                    </div>
                    <Progress value={6.5} />

                    <div className="flex justify-between">
                      <span>Agriculture</span>
                      <span>3.3%</span>
                    </div>
                    <Progress value={3.3} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-bold">Email Coverage</CardTitle>
              <CardDescription>Percentage of businesses with email addresses by industry</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Services</span>
                  <span className="text-sm font-medium">54.2%</span>
                </div>
                <Progress value={54.2} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Manufacturing</span>
                  <span className="text-sm font-medium">47.6%</span>
                </div>
                <Progress value={47.6} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Wholesale</span>
                  <span className="text-sm font-medium">38.5%</span>
                </div>
                <Progress value={38.5} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Construction</span>
                  <span className="text-sm font-medium">29.3%</span>
                </div>
                <Progress value={29.3} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Agriculture</span>
                  <span className="text-sm font-medium">18.7%</span>
                </div>
                <Progress value={18.7} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-bold">Key Insights</CardTitle>
              <CardDescription>Actionable intelligence from our industry analysis</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-primary"
                  >
                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                    <polyline points="17 6 23 6 23 12"></polyline>
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">Growth Opportunities</h3>
                  <p className="text-sm text-muted-foreground">
                    Services sector shows 12% YoY growth with highest email coverage at 54.2%
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-primary"
                  >
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">Email Penetration</h3>
                  <p className="text-sm text-muted-foreground">
                    624,574 businesses with email addresses out of 18.3M total businesses
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-bold">Market Opportunity</CardTitle>
              <CardDescription>Email coverage vs. total addressable market</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-bold">3.4%</div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Only 3.4% of businesses have email addresses - representing a massive untapped opportunity
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-bold">Census Correlation Insights</CardTitle>
              <CardDescription>Key demographic factors correlated with industry presence</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-medium">Services</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">Urban Population</Badge>
                  <Badge variant="outline">Higher Education</Badge>
                  <Badge variant="outline">Median Income $75k+</Badge>
                  <Badge variant="outline">Tech Adoption</Badge>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">Manufacturing</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">Suburban Areas</Badge>
                  <Badge variant="outline">Transportation Hubs</Badge>
                  <Badge variant="outline">Technical Education</Badge>
                  <Badge variant="outline">Industrial Zoning</Badge>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">Wholesale</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">Logistics Centers</Badge>
                  <Badge variant="outline">Interstate Proximity</Badge>
                  <Badge variant="outline">Commercial Zoning</Badge>
                  <Badge variant="outline">Business Districts</Badge>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">Construction</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">Population Growth</Badge>
                  <Badge variant="outline">New Housing Permits</Badge>
                  <Badge variant="outline">Infrastructure Spending</Badge>
                  <Badge variant="outline">Trade Schools</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-8 rounded-lg bg-muted p-4">
        <h2 className="mb-2 text-xl font-bold">About This Data</h2>
        <p className="text-sm text-muted-foreground">
          This dashboard integrates business data with U.S. Census Bureau demographic information to provide actionable
          insights for targeted marketing and business development. The analysis correlates industry presence with
          demographic factors to identify high-potential markets and growth opportunities.
        </p>
      </div>
    </div>
  )
}
